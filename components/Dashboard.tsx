
import React, { useState, useEffect, useMemo } from 'react';
import { Ingredient, Recipe } from '../types';
import { IngredientCard } from './IngredientCard';
import { RecipeCard } from './RecipeCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Database, ArrowLeft, Book, Grid, TrendingUp, ShieldCheck, Wallet, Wand2, BarChart3 } from 'lucide-react';
import { LiquidCard } from './LiquidCard';
import { getRecipeHistory } from '../services/geminiService';

interface DashboardProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
  onReset: () => void;
  onStartCooking: (recipe: Recipe) => void;
  onOpenSandbox: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ ingredients, recipes, onReset, onStartCooking, onOpenSandbox }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'journal'>('system');
  const [history, setHistory] = useState<Recipe[]>([]);

  useEffect(() => {
    if (activeTab === 'journal') setHistory(getRecipeHistory());
  }, [activeTab]);

  // Premium Economics Logic
  const stats = useMemo(() => {
    const freshCount = ingredients.filter(i => i.freshness > 70).length;
    const expiringCount = ingredients.filter(i => i.freshness < 40).length;
    
    // Aggregate savings from history for the "Ledger"
    const historicHistory = getRecipeHistory();
    const totalSaved = historicHistory.reduce((acc, curr) => {
      const val = parseFloat(curr.economicImpact?.savingsValue.replace('$', '') || '0');
      return acc + val;
    }, 0);

    const wasteReductionPct = historicHistory.length > 0 
      ? Math.round(historicHistory.reduce((acc, curr) => acc + parseFloat(curr.economicImpact?.wasteReduction.replace('%', '') || '0'), 0) / historicHistory.length)
      : 0;

    return { freshCount, expiringCount, totalSaved, wasteReductionPct };
  }, [ingredients, recipes]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 pb-20 pt-8">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-12 border-b border-black/5 pb-8">
        <div>
          <button onClick={onReset} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-obsidian/40 hover:text-gold transition-colors mb-4"><ArrowLeft className="w-3 h-3" /> Sensor Re-Init</button>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-obsidian">{activeTab === 'system' ? 'System Intelligence' : 'Culinary Archive'}</h2>
          <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                <ShieldCheck className="w-3 h-3" /> Zero-Waste Protocol Active
             </div>
             <span className="text-obsidian/30 text-xs font-medium">Archiving session ID: {crypto.randomUUID().slice(0,8).toUpperCase()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={onOpenSandbox}
             className="px-5 py-2.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-gold hover:text-white flex items-center gap-2"
           >
             <Wand2 className="w-3.5 h-3.5" />
             Sandbox
           </button>
           <div className="h-6 w-[1px] bg-black/5 mx-2" />
           <div className="flex items-center gap-2">
              <button onClick={() => setActiveTab('system')} className={`px-5 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'system' ? 'bg-obsidian text-white border-obsidian' : 'bg-white border-black/5 text-obsidian/60'}`}>System</button>
              <button onClick={() => setActiveTab('journal')} className={`px-5 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'journal' ? 'bg-obsidian text-white border-obsidian' : 'bg-white border-black/5 text-obsidian/60'}`}>Journal</button>
           </div>
        </div>
      </motion.div>

      <AnimatePresence mode='wait'>
        {activeTab === 'system' ? (
          <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            
            <div className="xl:col-span-4 space-y-8">
              {/* Economics Ledger Widget */}
              <LiquidCard className="p-6 rounded-[2.5rem] bg-gradient-to-br from-obsidian to-gray-900 text-white border-none shadow-2xl relative overflow-hidden">
                 <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-gold"><BarChart3 className="w-5 h-5" /></div>
                    <div className="text-right">
                       <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Lifetime Economy</div>
                       <div className="text-3xl font-serif font-bold text-white tracking-tighter">${stats.totalSaved.toFixed(2)}</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-white/40">Efficiency Index</span>
                       <span className="text-green-400 font-bold">{stats.wasteReductionPct}% Reduction</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${stats.wasteReductionPct}%` }} 
                         className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full" 
                       />
                    </div>
                    <p className="text-[10px] text-white/30 leading-relaxed">
                       Cross-referencing historical consumption patterns with bio-metric intake.
                    </p>
                 </div>
              </LiquidCard>

              <h3 className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 flex items-center gap-2"><Leaf className="w-4 h-4" /> Molecular Manifest</h3>
              <div className="grid grid-cols-2 gap-4">
                 {ingredients.map((ing, idx) => <IngredientCard key={idx} ingredient={ing} delay={idx} />)}
              </div>
            </div>

            <div className="xl:col-span-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 mb-8 flex items-center gap-2"><Database className="w-4 h-4" /> Synthesized Neural Protocols</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {recipes.map((recipe, idx) => (
                  <RecipeCard key={idx} recipe={recipe} delay={idx + 0.5} onStartExecution={() => onStartCooking(recipe)} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="journal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {history.length > 0 ? history.map((h, i) => (
               <RecipeCard key={i} recipe={h} delay={i * 0.1} />
             )) : (
               <div className="col-span-full py-20 text-center text-obsidian/20 italic">No protocols archived yet.</div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
