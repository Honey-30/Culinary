
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidCard } from './LiquidCard';
import { DietaryConfig, Ingredient } from '../types';
import { getDietaryConfig } from '../services/geminiService';
import { ChefHat, Globe, Leaf, Wheat, Beef, Utensils, Sparkles, Recycle, CheckCircle2, Box, Wand2 } from 'lucide-react';

interface Props {
  detectedIngredients: Ingredient[];
  onGenerate: (cuisine: string, diet: DietaryConfig, selectedIngredients: Ingredient[]) => void;
}

const CUISINES = [
  { id: 'Indian', label: 'Indian', icon: '🍛' },
  { id: 'Chinese', label: 'Chinese', icon: '🥟' },
  { id: 'Italian', label: 'Italian', icon: '🍝' },
  { id: 'Mexican', label: 'Mexican', icon: '🌮' },
  { id: 'Japanese', label: 'Japanese', icon: '🍱' },
  { id: 'Thai', label: 'Thai', icon: '🍜' },
  { id: 'Mediterranean', label: 'Mediterranean', icon: '🥗' },
  { id: 'American', label: 'American', icon: '🍔' },
  { id: 'French', label: 'French', icon: '🥐' },
  { id: 'Korean', label: 'Korean', icon: '🥢' },
];

export const CuisineSelector: React.FC<Props> = ({ detectedIngredients, onGenerate }) => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('Global/Fusion');
  const [selectionMode, setSelectionMode] = useState<'chef' | 'manual'>('chef'); // 'chef' = Surprise Me, 'manual' = User picks
  const [manualSelection, setManualSelection] = useState<Set<string>>(new Set());
  
  const [diet, setDiet] = useState<DietaryConfig>({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    keto: false,
    paleo: false,
    allergies: '',
    zeroWaste: false
  });

  useEffect(() => {
    // Load default settings
    setDiet(getDietaryConfig());
    // Pre-select all ingredients for manual mode initially
    setManualSelection(new Set(detectedIngredients.map(i => i.name)));
  }, [detectedIngredients]);

  const handleDietChange = (key: keyof DietaryConfig, value: any) => {
    setDiet(prev => ({ ...prev, [key]: value }));
  };

  const toggleIngredient = (name: string) => {
    setManualSelection(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleGenerateClick = () => {
    let finalIngredients = detectedIngredients;
    
    // If manual mode, filter the list. If 'chef' (Surprise), we send all and let AI decide priority.
    if (selectionMode === 'manual') {
      finalIngredients = detectedIngredients.filter(i => manualSelection.has(i.name));
    }

    if (finalIngredients.length === 0) {
      alert("Please select at least one ingredient.");
      return;
    }

    onGenerate(selectedCuisine, diet, finalIngredients);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-md mb-6">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-xs font-bold tracking-widest uppercase text-obsidian/60">System Ready</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-obsidian mb-4">
          Protocol <span className="text-gold">Calibration</span>
        </h1>
        <p className="text-obsidian/50 max-w-xl mx-auto font-light">
          Configure synthesis parameters. Select specific inventory items or allow the Neural Engine to optimize for freshness.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inventory Selection (Full width or split based on design) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* INVENTORY SELECTION MODULE */}
          <LiquidCard className="p-8 rounded-[2.5rem]" hoverEffect={false}>
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-obsidian text-white">
                    <Box className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-obsidian">Inventory Selection</h3>
                    <p className="text-xs text-obsidian/50">Choose active components</p>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectionMode('chef')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2
                      ${selectionMode === 'chef' ? 'bg-white shadow-sm text-obsidian' : 'text-obsidian/40 hover:text-obsidian'}`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Surprise Me
                  </button>
                  <button
                    onClick={() => setSelectionMode('manual')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2
                      ${selectionMode === 'manual' ? 'bg-white shadow-sm text-obsidian' : 'text-obsidian/40 hover:text-obsidian'}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Manual
                  </button>
                </div>
             </div>

             <AnimatePresence mode='wait'>
                {selectionMode === 'chef' ? (
                   <motion.div 
                     key="chef"
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="bg-gradient-to-br from-gold/5 to-amber-500/5 rounded-2xl p-8 border border-gold/20 flex flex-col items-center text-center"
                   >
                      <Sparkles className="w-12 h-12 text-gold mb-4 animate-pulse" />
                      <h4 className="text-xl font-bold text-obsidian mb-2">Neural Optimization Active</h4>
                      <p className="text-obsidian/60 max-w-md text-sm leading-relaxed">
                         The Chef will analyze the full inventory ({detectedIngredients.length} items). Prioritizing ingredients based on <span className="font-bold text-obsidian">Freshness Index</span> and <span className="font-bold text-obsidian">Flavor Compatibility</span>.
                      </p>
                   </motion.div>
                ) : (
                   <motion.div 
                     key="manual"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="grid grid-cols-2 md:grid-cols-3 gap-3"
                   >
                      {detectedIngredients.map((item, idx) => {
                         const isSelected = manualSelection.has(item.name);
                         return (
                           <button
                             key={idx}
                             onClick={() => toggleIngredient(item.name)}
                             className={`p-3 rounded-xl border text-left transition-all duration-200 relative group
                               ${isSelected 
                                 ? 'bg-obsidian text-white border-obsidian shadow-lg transform scale-[1.02]' 
                                 : 'bg-white border-gray-100 text-obsidian/50 hover:bg-gray-50'
                               }`}
                           >
                              <div className="flex justify-between items-start mb-2">
                                 <span className="font-bold text-sm truncate pr-2">{item.name}</span>
                                 {isSelected && <CheckCircle2 className="w-4 h-4 text-gold" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`h-1.5 flex-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-black/5'}`}>
                                   <div 
                                      className={`h-full rounded-full ${item.freshness > 70 ? 'bg-green-500' : 'bg-amber-500'}`} 
                                      style={{ width: `${item.freshness}%` }}
                                   />
                                </div>
                                <span className="text-[10px] font-mono opacity-60">{item.freshness}%</span>
                              </div>
                           </button>
                         );
                      })}
                   </motion.div>
                )}
             </AnimatePresence>
          </LiquidCard>

          {/* CUISINE SELECTION */}
          <LiquidCard className="p-8 rounded-[2.5rem]" hoverEffect={false}>
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-obsidian text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-obsidian">Target Gastronomy</h3>
                  <p className="text-xs text-obsidian/50">Select regional influence</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CUISINES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCuisine(c.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group
                      ${selectedCuisine === c.id 
                        ? 'bg-obsidian text-white border-obsidian shadow-lg' 
                        : 'bg-white/50 border-black/5 hover:border-gold/30 hover:bg-white text-obsidian'}`}
                  >
                     <div className="text-2xl mb-1">{c.icon}</div>
                     <div className="text-xs font-bold uppercase tracking-wider">{c.label}</div>
                     {selectedCuisine === c.id && (
                       <motion.div layoutId="cuisine-highlight" className="absolute inset-0 border-2 border-gold/30 rounded-xl pointer-events-none" />
                     )}
                  </button>
                ))}
                <button
                    onClick={() => setSelectedCuisine('Global/Fusion')}
                    className={`col-span-2 p-3 rounded-xl border text-center transition-all duration-300
                      ${selectedCuisine === 'Global/Fusion'
                        ? 'bg-obsidian text-white border-obsidian shadow-lg' 
                        : 'bg-white/50 border-black/5 hover:border-gold/30 hover:bg-white text-obsidian'}`}
                  >
                     <div className="text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                       <Sparkles className="w-4 h-4" /> Chef's Choice
                     </div>
                </button>
              </div>
          </LiquidCard>
        </div>

        {/* Right Column: Dietary Constraints */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <LiquidCard className="p-8 rounded-[2.5rem] flex-1" hoverEffect={false}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-obsidian">Bio-Constraints</h3>
                  <p className="text-xs text-obsidian/50">Overrides global settings</p>
                </div>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-green-100 flex items-center justify-between group cursor-pointer"
               onClick={() => handleDietChange('zeroWaste', !diet.zeroWaste)}
            >
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full transition-colors ${diet.zeroWaste ? 'bg-green-500 text-white' : 'bg-white text-green-600'}`}>
                    <Recycle className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-sm font-bold text-green-900">Zero-Waste</div>
                    <div className="text-[10px] text-green-700/60 uppercase tracking-wide">Prioritize expiry</div>
                 </div>
               </div>
               <div className={`w-12 h-6 rounded-full p-1 transition-colors ${diet.zeroWaste ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${diet.zeroWaste ? 'translate-x-6' : 'translate-x-0'}`} />
               </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
                <label className={`flex flex-row items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${diet.vegan ? 'bg-emerald-50 border-emerald-200' : 'bg-white/30 border-black/5'}`}>
                  <div className="flex items-center gap-3">
                     <Leaf className={`w-5 h-5 ${diet.vegan ? 'text-emerald-600' : 'text-gray-400'}`} />
                     <span className="text-xs font-bold text-obsidian">Vegan</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-emerald-500" checked={diet.vegan} onChange={(e) => handleDietChange('vegan', e.target.checked)} />
                </label>
                
                <label className={`flex flex-row items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${diet.vegetarian ? 'bg-emerald-50 border-emerald-200' : 'bg-white/30 border-black/5'}`}>
                  <div className="flex items-center gap-3">
                     <Leaf className={`w-5 h-5 ${diet.vegetarian ? 'text-emerald-500' : 'text-gray-400'}`} />
                     <span className="text-xs font-bold text-obsidian">Vegetarian</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-emerald-500" checked={diet.vegetarian} onChange={(e) => handleDietChange('vegetarian', e.target.checked)} />
                </label>

                 <label className={`flex flex-row items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${diet.glutenFree ? 'bg-amber-50 border-amber-200' : 'bg-white/30 border-black/5'}`}>
                  <div className="flex items-center gap-3">
                     <Wheat className={`w-5 h-5 ${diet.glutenFree ? 'text-amber-600' : 'text-gray-400'}`} />
                     <span className="text-xs font-bold text-obsidian">Gluten-Free</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={diet.glutenFree} onChange={(e) => handleDietChange('glutenFree', e.target.checked)} />
                </label>

                <label className={`flex flex-row items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${diet.keto ? 'bg-red-50 border-red-200' : 'bg-white/30 border-black/5'}`}>
                  <div className="flex items-center gap-3">
                     <Beef className={`w-5 h-5 ${diet.keto ? 'text-red-600' : 'text-gray-400'}`} />
                     <span className="text-xs font-bold text-obsidian">Keto</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-red-500" checked={diet.keto} onChange={(e) => handleDietChange('keto', e.target.checked)} />
                </label>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40">Additional Allergies</label>
               <input 
                  type="text" 
                  value={diet.allergies} 
                  onChange={(e) => handleDietChange('allergies', e.target.value)}
                  placeholder="e.g. Shellfish..."
                  className="w-full bg-white/50 border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
               />
            </div>
          </LiquidCard>

          <button 
             onClick={handleGenerateClick}
             className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-obsidian to-black text-gold border border-gold/20 shadow-premium flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform"
          >
             <ChefHat className="w-5 h-5" />
             Initiate Synthesis
          </button>
        </div>
      </div>
    </div>
  );
};
