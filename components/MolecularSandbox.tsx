
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ingredient, AffinityResult } from '../types';
import { LiquidCard } from './LiquidCard';
import { Atom, Sparkles, Wand2, ArrowLeft, Thermometer, FlaskConical, Target, CheckCircle2 } from 'lucide-react';
import { calculateMolecularAffinity } from '../services/geminiService';

interface Props {
  inventory: Ingredient[];
  onBack: () => void;
}

export const MolecularSandbox: React.FC<Props> = ({ inventory, onBack }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [affinity, setAffinity] = useState<AffinityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const toggleIngredient = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else if (next.size < 5) next.add(name); // Limit to 5 for sandbox focus
      return next;
    });
  };

  useEffect(() => {
    if (selected.size >= 2) {
      const runCalc = async () => {
        setIsCalculating(true);
        try {
          const res = await calculateMolecularAffinity(Array.from(selected));
          setAffinity(res);
        } catch (e) {
          console.error(e);
        } finally {
          setIsCalculating(false);
        }
      };
      runCalc();
    } else {
      setAffinity(null);
    }
  }, [selected]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full mb-12 flex justify-between items-start">
         <div>
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-obsidian/40 hover:text-gold transition-colors mb-4">
               <ArrowLeft className="w-3 h-3" /> Dashboard
            </button>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-obsidian">Molecular <span className="text-gold">Sandbox</span></h1>
            <p className="text-sm text-obsidian/50 mt-2 font-light">Explore chemical synergy between biological inventory items.</p>
         </div>
         <div className="hidden md:flex flex-col items-end text-right">
            <div className="text-[10px] font-bold uppercase tracking-widest text-obsidian/30">Sensor Active</div>
            <div className="text-xs font-mono text-obsidian/60">{inventory.length} Components Detected</div>
         </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-12 w-full">
         
         {/* Synthesis Chamber */}
         <div className="lg:col-span-7 space-y-8">
            <LiquidCard className="aspect-square rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden bg-white/40">
               {/* Background Orbitals */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-[80%] h-[80%] rounded-full border border-obsidian/10 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute w-[60%] h-[60%] rounded-full border border-gold/10 animate-[spin_15s_linear_infinite_reverse]" />
               </div>

               <AnimatePresence mode='wait'>
                  {selected.size === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                       <Atom className="w-16 h-16 text-obsidian/10 mx-auto mb-6" strokeWidth={1} />
                       <h3 className="text-xl font-serif font-bold text-obsidian/30">Add components to initialize synthesis</h3>
                    </motion.div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                       {/* Center Meter */}
                       <motion.div 
                         initial={{ scale: 0 }} 
                         animate={{ scale: 1 }} 
                         className="w-48 h-48 rounded-full bg-white shadow-2xl border border-gold/20 flex flex-col items-center justify-center relative z-20"
                       >
                          {isCalculating ? (
                            <Sparkles className="w-8 h-8 text-gold animate-spin" />
                          ) : (
                            <>
                               <span className="text-4xl font-serif font-bold text-obsidian">{affinity?.score || '0'}<span className="text-sm align-top text-obsidian/40">%</span></span>
                               <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Affinity Score</span>
                            </>
                          )}
                       </motion.div>

                       {/* Orbiting Selected Nodes */}
                       {/* Fix: Added explicit string type for name to resolve compilation error */}
                       {Array.from(selected).map((name: string, i) => {
                         const angle = (i / selected.size) * (Math.PI * 2);
                         const radius = 160;
                         const x = Math.cos(angle) * radius;
                         const y = Math.sin(angle) * radius;
                         return (
                           <motion.div
                             key={name}
                             initial={{ opacity: 0, x: 0, y: 0 }}
                             animate={{ opacity: 1, x, y }}
                             className="absolute w-16 h-16 rounded-full bg-obsidian text-white flex items-center justify-center text-xs font-bold text-center p-2 shadow-xl border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                             onClick={() => toggleIngredient(name)}
                           >
                              {name}
                           </motion.div>
                         );
                       })}

                       {/* Connecting Lines */}
                       <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {Array.from(selected).map((_, i) => {
                             const angle = (i / selected.size) * (Math.PI * 2);
                             const x = 50 + Math.cos(angle) * 35;
                             const y = 50 + Math.sin(angle) * 35;
                             return (
                               <line key={i} x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`} stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
                             );
                          })}
                       </svg>
                    </div>
                  )}
               </AnimatePresence>
            </LiquidCard>

            {affinity && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                 <LiquidCard className="p-6 rounded-2xl bg-white border-black/5">
                    <div className="flex gap-4">
                       <Target className="w-5 h-5 text-gold shrink-0" />
                       <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 mb-1">Synthesis Rationale</h4>
                          <p className="text-sm text-obsidian/70 leading-relaxed font-light">{affinity.rationale}</p>
                       </div>
                    </div>
                    {affinity.bridgingIngredients.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-black/5">
                         <h4 className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 mb-2">Suggested Bridging Agents</h4>
                         <div className="flex gap-2">
                            {affinity.bridgingIngredients.map((item, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-50 border border-black/5 text-[10px] font-bold text-obsidian/60">{item}</span>
                            ))}
                         </div>
                      </div>
                    )}
                 </LiquidCard>
              </motion.div>
            )}
         </div>

         {/* Selection Sidebar */}
         <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 flex items-center gap-2 px-2">
               <FlaskConical className="w-4 h-4" /> Component Matrix
            </h3>
            <div className="grid grid-cols-2 gap-3 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
               {inventory.map((item) => {
                 const isSelected = selected.has(item.name);
                 return (
                   <button
                     key={item.name}
                     onClick={() => toggleIngredient(item.name)}
                     className={`p-4 rounded-2xl border text-left transition-all duration-300 group relative
                       ${isSelected 
                         ? 'bg-obsidian text-white border-obsidian shadow-lg scale-[0.98]' 
                         : 'bg-white border-black/5 hover:bg-gray-50 text-obsidian/60'
                       }`}
                   >
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-bold truncate max-w-[80%]">{item.name}</span>
                         {isSelected && <CheckCircle2 className="w-4 h-4 text-gold" />}
                      </div>
                      <span className="text-[9px] font-mono opacity-40 uppercase">{item.category}</span>
                      
                      {/* Freshness Bar Mini */}
                      <div className="mt-2 w-full h-[1px] bg-black/5">
                         <div className={`h-full ${item.freshness > 70 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${item.freshness}%` }} />
                      </div>
                   </button>
                 );
               })}
            </div>
         </div>

      </div>
    </div>
  );
};
