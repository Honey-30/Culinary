
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Scan, ShieldCheck, ArrowRight, Aperture, Video, Sparkles, Layers, Cpu, ScanLine } from 'lucide-react';
import { AnalysisState } from '../types';
import { LiquidCard } from './LiquidCard';

interface AnalyzerProps {
  onImageSelected: (file: File) => void;
  analysisState: AnalysisState;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ onImageSelected, analysisState }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12 md:mb-16 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 shadow-glass backdrop-blur-md mb-8 hover:bg-white/60 transition-colors cursor-default"
        >
           <Sparkles className="w-3.5 h-3.5 text-gold" />
           <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-obsidian/60">System Ready</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold text-obsidian mb-8 tracking-tighter leading-[0.95]">
          Culinary<span className="text-transparent bg-clip-text bg-gradient-to-br from-gold via-amber-500 to-amber-700">Lens</span>
        </h1>
        <p className="text-base md:text-xl text-obsidian/60 max-w-2xl mx-auto font-sans font-light leading-relaxed px-4">
          The <span className="font-medium text-obsidian">Computational Gastronomy</span> Interface.
          <br className="hidden md:block" />
          Transform biological inventory into Michelin-grade protocols via Multimodal AI.
        </p>
      </motion.div>

      {/* Main Scanner Interface */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full max-w-4xl relative group cursor-pointer mb-16 md:mb-24"
      >
        <input
          type="file"
          accept="image/*,video/*"
          className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
          onChange={handleChange}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />

        {/* The Lens Container - Adaptive Ratio */}
        <div 
          className={`relative aspect-[4/5] md:aspect-[2/1] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-2xl border transition-all duration-500 overflow-hidden flex flex-col items-center justify-center shadow-2xl
          ${dragActive 
            ? 'border-gold scale-[1.02] shadow-gold/20' 
            : 'border-white/60 hover:border-gold/30 hover:shadow-xl'
          }`}
        >
           {/* Dynamic Background Mesh */}
           <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
           
           {/* Corner Reticles - Viewfinder Effect */}
           <div className={`absolute top-6 left-6 md:top-8 md:left-8 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 transition-all duration-500 ${dragActive ? 'border-gold w-10 h-10 top-4 left-4 md:w-12 md:h-12 md:top-6 md:left-6' : 'border-obsidian/10'}`} />
           <div className={`absolute top-6 right-6 md:top-8 md:right-8 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 transition-all duration-500 ${dragActive ? 'border-gold w-10 h-10 top-4 right-4 md:w-12 md:h-12 md:top-6 md:right-6' : 'border-obsidian/10'}`} />
           <div className={`absolute bottom-6 left-6 md:bottom-8 md:left-8 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 transition-all duration-500 ${dragActive ? 'border-gold w-10 h-10 bottom-4 left-4 md:w-12 md:h-12 md:bottom-6 md:left-6' : 'border-obsidian/10'}`} />
           <div className={`absolute bottom-6 right-6 md:bottom-8 md:right-8 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 transition-all duration-500 ${dragActive ? 'border-gold w-10 h-10 bottom-4 right-4 md:w-12 md:h-12 md:bottom-6 md:right-6' : 'border-obsidian/10'}`} />

           {/* Center Interaction */}
           <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/50 bg-white/50 shadow-glass flex items-center justify-center transition-all duration-700 relative
                ${dragActive ? 'scale-110' : 'group-hover:scale-105'}
              `}>
                 <div className="absolute inset-0 rounded-full border border-dashed border-obsidian/20 animate-[spin_10s_linear_infinite]" />
                 {dragActive ? (
                   <ScanLine className="w-8 h-8 md:w-10 md:h-10 text-gold animate-pulse" />
                 ) : (
                   <Aperture className="w-8 h-8 md:w-10 md:h-10 text-obsidian/60 group-hover:text-obsidian transition-colors" />
                 )}
              </div>
              
              <div>
                 <h3 className="text-xl md:text-2xl font-serif font-bold text-obsidian mb-2">
                   {dragActive ? "Release to Analyze" : "Initialize Sensor"}
                 </h3>
                 <p className="text-[10px] md:text-xs text-obsidian/40 font-mono uppercase tracking-widest leading-relaxed">
                   {dragActive ? "Optical data stream detected" : "Drag & Drop or Click to Scan Fridge Context"}
                 </p>
              </div>
           </div>

           {/* Scanning Light Effect */}
           <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent h-[20%] w-full pointer-events-none transition-opacity duration-300
             ${dragActive ? 'opacity-100 animate-[scan_2s_linear_infinite]' : 'opacity-0'}
           `} />
        </div>
      </motion.div>

      {/* Bento Grid Features - Stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {[
          {
            icon: <Video className="w-5 h-5" />,
            title: "Temporal Context",
            desc: "Analyzes visual sweeps to identify occluded items via object permanence logic."
          },
          {
            icon: <Layers className="w-5 h-5" />,
            title: "Spatial Depth",
            desc: "Lidar-simulated depth mapping estimates volumetric mass of irregular matter."
          },
          {
            icon: <Cpu className="w-5 h-5" />,
            title: "Reasoning Engine",
            desc: "Gemini 3 Pro connects inventory to FlavorGraph for molecular pairing."
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx }}
            className="p-8 rounded-[2rem] bg-white/40 border border-white/60 backdrop-blur-xl hover:bg-white/60 transition-all duration-300 group"
          >
             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-white/50 flex items-center justify-center text-obsidian/60 mb-6 group-hover:scale-110 group-hover:text-gold transition-all">
               {feature.icon}
             </div>
             <h4 className="text-lg font-bold text-obsidian mb-3 font-serif">{feature.title}</h4>
             <p className="text-sm text-obsidian/50 leading-relaxed font-light">
               {feature.desc}
             </p>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
