
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '../types';
import { X, ChevronRight, ChevronLeft, CheckCircle2, MessageCircle, Clock, Utensils, PlayCircle, Volume2, Palette, Box, Eye, Camera, Aperture, Activity, ChefHat, Sparkles, Timer, RotateCcw, PauseCircle, ArrowRight, Layers, LayoutTemplate } from 'lucide-react';
import { SousChefModal } from './SousChefModal';
import { LiquidCard } from './LiquidCard';
import { playTextToSpeech, validateCookingStep, generateDishImage, saveRecipeToHistory } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  recipe: Recipe;
  onExit: () => void;
  onComplete?: () => void;
}

const FormattedInstruction: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-obsidian to-black">{part.slice(2, -2)}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export const ExecutionMode: React.FC<Props> = ({ recipe, onExit, onComplete }) => {
  const [step, setStep] = useState(0);
  const [showChef, setShowChef] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arOverlayMode, setArOverlayMode] = useState<'none' | 'blueprint' | 'final'>('none');
  
  const [timerDuration, setTimerDuration] = useState<number | null>(null); 
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{status: 'pass'|'fail', feedback: string} | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [finalImage, setFinalImage] = useState<string | undefined>(recipe.imageUrl);
  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);

  const totalSteps = recipe.instructions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    setTimerDuration(null);
    setTimeLeft(null);
    setIsTimerRunning(false);

    const text = recipe.instructions[step];
    const timeRegex = /\b(\d+)\s*(minutes?|mins?|seconds?|secs?|hours?|hrs?)\b/i;
    const match = text.match(timeRegex);

    if (match) {
      const val = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      let seconds = 0;
      if (unit.startsWith('min')) seconds = val * 60;
      else if (unit.startsWith('hour') || unit.startsWith('hr')) seconds = val * 3600;
      else if (unit.startsWith('sec')) seconds = val;
      
      if (seconds > 0) {
        setTimerDuration(seconds);
        setTimeLeft(seconds);
      }
    }
  }, [step, recipe.instructions]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (isCompleted) {
       saveRecipeToHistory(recipe);
       if (!finalImage && !isGeneratingFinal) {
        const gen = async () => {
          setIsGeneratingFinal(true);
          try {
            const url = await generateDishImage(recipe);
            setFinalImage(url);
            recipe.imageUrl = url; 
            saveRecipeToHistory(recipe);
          } catch (e) { console.error(e); } finally { setIsGeneratingFinal(false); }
        };
        gen();
      }
    }
  }, [isCompleted, finalImage, recipe]);

  const nextStep = () => {
    setIsTransitioning(false);
    setAnalysisResult(null); 
    if (step < totalSteps - 1) setStep(s => s + 1);
    else setIsCompleted(true);
  };

  const prevStep = () => {
    if (step > 0 && !isTransitioning) {
      setStep(s => s - 1);
      setIsCompleted(false);
      setAnalysisResult(null);
    }
  };

  const handleSpeak = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const cleanText = recipe.instructions[step].replace(/\*\*/g, "");
      await playTextToSpeech(cleanText);
    } catch (e) { console.error(e); } finally { setIsPlaying(false); }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    setShowCamera(true);
    setAnalysisResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error(err); setShowCamera(false); }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setArOverlayMode('none');
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;
    setIsAnalyzing(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    try {
      const result = await validateCookingStep(base64, recipe.instructions[step]);
      setAnalysisResult(result);
      if (result.status === 'pass') {
        setIsTransitioning(true);
        setTimeout(() => nextStep(), 3000);
      }
    } catch (e) { console.error(e); } finally { setIsAnalyzing(false); stopCamera(); }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#fcfcfc] text-obsidian overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex-none p-4 md:p-6 flex justify-between items-center bg-white border-b border-black/5 z-40">
        <button onClick={onExit} className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-obsidian/40 hover:text-red-500 transition-colors bg-gray-50 px-3 py-2 rounded-full border border-black/5">
          <X className="w-3.5 h-3.5" /> Abort
        </button>
        <div className="flex items-center gap-2 md:gap-3">
           <button onClick={() => setShowChef(true)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-obsidian text-gold flex items-center justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">
        <AnimatePresence mode='wait'>
          {!isCompleted ? (
            <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-4xl flex flex-col items-center text-center">
              <h2 className="text-2xl md:text-5xl font-serif text-obsidian leading-snug md:leading-tight mb-8 md:mb-12">
                <FormattedInstruction text={recipe.instructions[step]} />
              </h2>
              <button onClick={startCamera} className="px-6 py-3 rounded-full border border-obsidian/10 text-obsidian font-bold text-sm hover:bg-obsidian hover:text-white transition-all flex items-center gap-2 bg-white">
                 <Camera className="w-4 h-4" />
                 <span>Chef's Eye / AR Overlay</span>
              </button>
            </motion.div>
          ) : (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start pb-24">
               {/* Metrics Column */}
               <div className="w-full md:w-1/2 space-y-6">
                  <div className="text-left">
                     <h2 className="text-3xl md:text-4xl font-serif font-bold text-obsidian">Service Complete</h2>
                     <p className="text-sm text-obsidian/50 mt-1">Ledger entry finalized.</p>
                  </div>
                  <LiquidCard className="p-8 rounded-[2rem] bg-obsidian text-white border-none shadow-2xl">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Financial & Env Ledger</div>
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <div className="text-2xl font-serif font-bold text-gold">{recipe.economicImpact?.savingsValue}</div>
                           <div className="text-[9px] uppercase tracking-widest text-white/30">Capital Rescued</div>
                        </div>
                        <div>
                           <div className="text-2xl font-serif font-bold text-green-400">{recipe.economicImpact?.wasteReduction}</div>
                           <div className="text-[9px] uppercase tracking-widest text-white/30">Waste Reduction</div>
                        </div>
                     </div>
                  </LiquidCard>
               </div>
               <button onClick={onComplete || onExit} className="w-full py-4 bg-obsidian text-white rounded-xl font-bold flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> Done
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AR Camera Modal Enhancement */}
      <AnimatePresence>
        {showCamera && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6">
             <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border border-white/10">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                
                {/* AR Ghost Overlays */}
                <AnimatePresence>
                  {arOverlayMode === 'blueprint' && recipe.blueprintImageUrl && (
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} src={recipe.blueprintImageUrl} className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none" />
                  )}
                  {arOverlayMode === 'final' && finalImage && (
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} src={finalImage} className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none" />
                  )}
                </AnimatePresence>

                <div className="absolute top-4 left-4 right-4 flex justify-center gap-2">
                   <button onClick={() => setArOverlayMode('none')} className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${arOverlayMode === 'none' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>Pure</button>
                   <button onClick={() => setArOverlayMode('blueprint')} className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${arOverlayMode === 'blueprint' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>Blueprint</button>
                   <button onClick={() => setArOverlayMode('final')} className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${arOverlayMode === 'final' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>Target</button>
                </div>
             </div>
             <div className="mt-8 flex gap-6">
                <button onClick={stopCamera} className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>
                <button onClick={captureAndAnalyze} className="w-16 h-16 rounded-full border-4 border-white p-1 flex items-center justify-center"><Aperture className="w-8 h-8 text-white" /></button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
