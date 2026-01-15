
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, CheckCircle2, AlertCircle, Eye, EyeOff, 
  Activity, Lock, Leaf, Wheat, Beef, ArrowLeft, 
  Zap, Save, ChevronRight, Info, Utensils, AlertTriangle, Fingerprint
} from 'lucide-react';
import { LiquidCard } from './LiquidCard';
import { setGlobalApiKey, getApiKey, validateApiKey, getDietaryConfig, setDietaryConfig } from '../services/geminiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { DietaryConfig } from '../types';

// Mock data for the usage graph
const USAGE_DATA = [
  { name: '00:00', tokens: 120 },
  { name: '04:00', tokens: 80 },
  { name: '08:00', tokens: 250 },
  { name: '12:00', tokens: 980 },
  { name: '16:00', tokens: 400 },
  { name: '20:00', tokens: 600 },
  { name: '24:00', tokens: 150 },
];

interface SettingsProps {
  onBack: () => void;
}

// iOS-style Toggle Switch
const Switch = ({ checked, onChange, colorClass = "bg-green-500" }: { checked: boolean; onChange: (c: boolean) => void; colorClass?: string }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none ${
      checked ? colorClass : 'bg-gray-200'
    }`}
  >
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
      className={`w-5 h-5 rounded-full bg-white shadow-sm ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [key, setKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
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
    setKey(getApiKey());
    setDiet(getDietaryConfig());
  }, []);

  const handleDietChange = (key: keyof DietaryConfig, value: any) => {
    const newDiet = { ...diet, [key]: value };
    setDiet(newDiet);
    setDietaryConfig(newDiet);
  };

  const handleSave = async () => {
    setStatus('validating');
    setErrorMsg('');
    
    // Simulate network delay for UX
    await new Promise(r => setTimeout(r, 800));

    const isValid = await validateApiKey(key);
    
    if (isValid) {
      setGlobalApiKey(key);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('error');
      setErrorMsg('Invalid API Key');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-8 pb-20">
      
      {/* Navigation Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm text-obsidian/60 hover:text-obsidian"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-obsidian">System Configuration</h1>
          <p className="text-xs text-obsidian/40 font-medium tracking-wide">Secure Enclave & Bio-Preferences</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Security & Metrics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* API Key Card */}
          <LiquidCard className="p-0 rounded-[2rem] overflow-hidden" hoverEffect={false}>
            <div className="p-6 border-b border-gray-100 bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-obsidian to-gray-800 flex items-center justify-center text-white shadow-lg shadow-obsidian/20">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-obsidian">Neural Uplink</h3>
                  <p className="text-xs text-obsidian/40">Gemini API Credentials</p>
                </div>
                <div className="ml-auto">
                   {status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
                   {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500 animate-in zoom-in" />}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/30 space-y-4">
              <div className="relative group">
                <input
                  type={isVisible ? "text" : "password"}
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="sk-..."
                  className={`w-full bg-white/80 border rounded-2xl pl-12 pr-12 py-4 text-obsidian font-mono text-sm transition-all outline-none
                    ${status === 'error' ? 'border-red-200 bg-red-50/50 focus:border-red-500' : 
                      status === 'success' ? 'border-green-200 bg-green-50/50 focus:border-green-500' :
                      'border-gray-200 focus:border-obsidian/30 focus:shadow-lg focus:shadow-obsidian/5'
                    }`}
                />
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian/30 group-focus-within:text-obsidian transition-colors" />
                <button 
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian/30 hover:text-obsidian transition-colors"
                >
                  {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-obsidian/40 font-medium">
                  <Lock className="w-3 h-3" />
                  <span>Encrypted locally in session storage</span>
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={status === 'validating' || !key}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-md
                    ${status === 'success' 
                      ? 'bg-green-500 text-white' 
                      : status === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-obsidian text-white hover:bg-black hover:scale-105'
                    }`}
                >
                  {status === 'validating' ? (
                    <span className="animate-pulse">Verifying...</span>
                  ) : status === 'success' ? (
                    "Linked"
                  ) : status === 'error' ? (
                    "Retry"
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
              {errorMsg && <p className="text-xs text-red-500 text-center">{errorMsg}</p>}
            </div>
          </LiquidCard>

          {/* Usage Metrics */}
          <LiquidCard className="p-6 rounded-[2rem] bg-white border border-gray-100" hoverEffect={false}>
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-obsidian text-sm">Token Throughput</h3>
                      <p className="text-[10px] text-obsidian/40 uppercase tracking-widest font-bold">Last 24 Hours</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-bold text-obsidian tracking-tight">2.4k</div>
                   <div className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block">
                      +12% vs avg
                   </div>
                </div>
             </div>
             
             <div className="h-32 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={USAGE_DATA}>
                   <defs>
                     <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area 
                     type="monotone" 
                     dataKey="tokens" 
                     stroke="#f97316" 
                     strokeWidth={2}
                     fillOpacity={1} 
                     fill="url(#colorTokens)" 
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </LiquidCard>
        </div>

        {/* Right Column: Bio-Preferences */}
        <div className="lg:col-span-5 h-full">
           <LiquidCard className="h-full p-0 rounded-[2rem] flex flex-col bg-white" hoverEffect={false}>
              <div className="p-6 border-b border-gray-100">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-bold text-obsidian">Dietary Matrix</h3>
                       <p className="text-xs text-obsidian/40">Global synthesis constraints</p>
                    </div>
                 </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                 <div className="space-y-1 mb-8">
                    {/* List Items */}
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                             <Leaf className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-obsidian">Vegan</span>
                       </div>
                       <Switch checked={diet.vegan} onChange={(c) => handleDietChange('vegan', c)} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                             <Leaf className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-obsidian">Vegetarian</span>
                       </div>
                       <Switch checked={diet.vegetarian} onChange={(c) => handleDietChange('vegetarian', c)} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                             <Wheat className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-obsidian">Gluten-Free</span>
                       </div>
                       <Switch checked={diet.glutenFree} onChange={(c) => handleDietChange('glutenFree', c)} colorClass="bg-amber-500" />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                             <Beef className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-obsidian">Keto</span>
                       </div>
                       <Switch checked={diet.keto} onChange={(c) => handleDietChange('keto', c)} colorClass="bg-red-500" />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian/40 flex items-center gap-2">
                       <AlertTriangle className="w-3 h-3" />
                       Critical Contaminants
                    </label>
                    <textarea 
                      value={diet.allergies}
                      onChange={(e) => handleDietChange('allergies', e.target.value)}
                      placeholder="List severe allergies (e.g. Peanuts)..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-obsidian placeholder:text-obsidian/30 focus:outline-none focus:border-obsidian/20 focus:bg-white transition-all resize-none h-32"
                    />
                 </div>
              </div>
           </LiquidCard>
        </div>

      </div>
    </div>
  );
};
