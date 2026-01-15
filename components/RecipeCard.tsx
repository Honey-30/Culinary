
import React, { useState } from 'react';
import { Recipe } from '../types';
import { LiquidCard } from './LiquidCard';
import { Clock, ChefHat, Sparkles, ShoppingCart, Microscope, Globe, PlayCircle, Bot, Wine, ChevronDown, ChevronUp, Image as ImageIcon, Zap, Coins, Atom, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SousChefModal } from './SousChefModal';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
// Fix: Removed missing export generateBeverageImage
import { generateDishImage, generateBlueprint } from '../services/geminiService';

interface Props {
  recipe: Recipe;
  delay: number;
  onStartExecution?: () => void;
}

export const RecipeCard: React.FC<Props> = ({ recipe, delay, onStartExecution }) => {
  const [showChat, setShowChat] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(recipe.imageUrl);
  const [blueprintUrl, setBlueprintUrl] = useState<string | undefined>(recipe.blueprintImageUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);

  const handleVisualize = async () => {
    if (imageUrl || isGenerating) return;
    setIsGenerating(true);
    try {
      const url = await generateDishImage(recipe);
      setImageUrl(url);
      recipe.imageUrl = url;
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleBlueprint = async () => {
    if (blueprintUrl || isGeneratingBlueprint) return;
    setIsGeneratingBlueprint(true);
    try {
      const url = await generateBlueprint(recipe);
      setBlueprintUrl(url);
      recipe.blueprintImageUrl = url;
    } catch (e) { console.error(e); } finally { setIsGeneratingBlueprint(false); }
  };

  const flavorData = recipe.flavorProfile ? [
    { subject: 'Umami', A: recipe.flavorProfile.umami },
    { subject: 'Sweet', A: recipe.flavorProfile.sweet },
    { subject: 'Sour', A: recipe.flavorProfile.sour },
    { subject: 'Spicy', A: recipe.flavorProfile.spicy },
    { subject: 'Bitter', A: recipe.flavorProfile.bitter },
    { subject: 'Salty', A: recipe.flavorProfile.salty },
  ] : [];

  return (
    <>
    <LiquidCard delay={delay} className="rounded-[2.5rem] p-0 group bg-white/90 border-white" hoverEffect={true}>
      <div className="h-64 w-full relative overflow-hidden bg-gray-100">
        <AnimatePresence mode='wait'>
          {imageUrl ? (
            <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={imageUrl} className="w-full h-full object-cover" />
          ) : blueprintUrl ? (
            <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={blueprintUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-4 flex gap-2 z-20">
          <button onClick={handleVisualize} className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-[10px] font-bold text-obsidian flex items-center gap-1.5 shadow-sm hover:bg-white transition-colors">
            {isGenerating ? <Sparkles className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
            Plating
          </button>
          <button onClick={handleBlueprint} className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-[10px] font-bold text-obsidian flex items-center gap-1.5 shadow-sm hover:bg-white transition-colors">
            {isGeneratingBlueprint ? <Sparkles className="w-3 h-3 animate-spin" /> : <Map className="w-3 h-3" />}
            Blueprint
          </button>
        </div>

        {recipe.economicImpact && (
          <div className="absolute bottom-4 right-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
            <Coins className="w-3 h-3" />
            Saved {recipe.economicImpact.savingsValue}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-white via-white/80 to-transparent pt-12">
          <h3 className="text-3xl font-serif font-bold text-obsidian">{recipe.title}</h3>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
             <h4 className="text-[10px] font-bold uppercase text-amber-600 mb-1 flex items-center gap-1">
               <Atom className="w-3 h-3" /> Gastronomy
             </h4>
             <p className="text-xs text-amber-900/70 italic leading-relaxed">"{recipe.scientificRationale}"</p>
          </div>
          <div className="w-32 h-32 shrink-0">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={flavorData}>
                  <PolarGrid stroke="#eee" />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize: 7}} />
                  <Radar dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
                </RadarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex justify-between items-center py-2 px-4 rounded-xl border border-black/5 bg-gray-50 mb-4 hover:bg-gray-100 transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40">Molecular Substitutions & Tech</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 mb-4">
               {recipe.molecularSubstitutions && recipe.molecularSubstitutions.length > 0 && (
                 <div className="space-y-2">
                    {recipe.molecularSubstitutions.map((sub, i) => (
                      <div key={i} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-blue-800 uppercase">{sub.target} → {sub.substitute}</span>
                            <span className="text-[8px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 font-mono">{sub.chemicalLink}</span>
                         </div>
                         <p className="text-[10px] text-blue-900/60 leading-tight">{sub.rationale}</p>
                      </div>
                    ))}
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <button onClick={() => setShowChat(true)} className="h-12 w-12 rounded-2xl bg-obsidian text-gold flex items-center justify-center shadow-lg"><Bot className="w-5 h-5" /></button>
          <button onClick={onStartExecution} className="flex-1 h-12 bg-obsidian text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors">
            <PlayCircle className="w-5 h-5" /> Begin Protocol
          </button>
        </div>
      </div>
    </LiquidCard>

    <AnimatePresence>
      {showChat && <SousChefModal recipe={recipe} onClose={() => setShowChat(false)} />}
    </AnimatePresence>
    </>
  );
};
