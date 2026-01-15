
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Cpu, ScanLine, ChefHat, Globe, Aperture, MousePointer2, Network, Search } from 'lucide-react';
import { LiquidCard } from './LiquidCard';

interface Props {
  onEnter: () => void;
}

export const LandingPage: React.FC<Props> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-[#fafafa] text-obsidian font-sans selection:bg-gold/20">
      
      {/* Background Ambience - Global Subtle Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-50/50 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-amber-50/50 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 z-10 flex flex-col items-center min-h-[90vh] justify-center overflow-hidden">
        <motion.div 
          style={{ y, opacity, scale }}
          className="text-center max-w-3xl mx-auto flex flex-col items-center relative z-20"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8 hover:shadow-md transition-all cursor-default"
          >
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-obsidian/60">System v2.0 • Neural Architecture</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-obsidian tracking-tighter leading-[1] md:leading-[0.95] mb-8 drop-shadow-sm">
            Culinary<br/>
            <span className="relative inline-block mt-2 md:mt-0">
               <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-obsidian via-gray-700 to-gray-800">Intelligence</span>
               {/* Subtle underline decoration */}
               <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
               </svg>
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-obsidian/60 max-w-xl mx-auto font-light leading-relaxed mb-10 tracking-tight">
            Digitize your biological inventory.
            <br className="hidden md:block"/>
            <span className="text-obsidian font-medium border-b border-black/10 pb-0.5">Computer Vision</span> meets <span className="text-obsidian font-medium border-b border-black/10 pb-0.5">Molecular Gastronomy</span>.
          </p>

          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.02, paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 bg-obsidian text-white rounded-full font-medium text-lg tracking-wide shadow-2xl shadow-obsidian/20 overflow-hidden flex items-center gap-3 transition-all"
          >
            <ScanLine className="w-5 h-5 text-gold" />
            <span>Initialize System</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white/60 group-hover:text-white" />
          </motion.button>
        </motion.div>

        {/* Digital Twin Visualization - Floating Glass */}
        <motion.div 
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 md:mt-20 w-full max-w-5xl relative z-10 perspective-1000"
        >
           <div className="relative aspect-[4/3] md:aspect-[2.4/1] rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08),0_20px_60px_-10px_rgba(0,0,0,0.04)] border border-white bg-white/80 backdrop-blur-xl group transform-gpu transition-transform hover:scale-[1.01] duration-700">
             
             {/* Internal UI Layer */}
             <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between z-10">
                {/* Header */}
                <div className="flex justify-between items-start">
                   <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 border border-gray-100 text-obsidian flex items-center justify-center shadow-sm">
                         <Aperture className="w-5 h-5 md:w-6 md:h-6 animate-[spin_10s_linear_infinite] opacity-60" />
                      </div>
                      <div>
                         <div className="text-[10px] font-bold uppercase tracking-widest text-obsidian/30">Sensor Array</div>
                         <div className="text-sm md:text-base font-bold text-obsidian tracking-tight">Active Scanning</div>
                      </div>
                   </div>
                   {/* Status Lights */}
                   <div className="flex gap-2.5">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                   </div>
                </div>

                {/* Central Abstract Metric */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="relative w-40 h-40 md:w-64 md:h-64 opacity-80">
                      {/* Rings */}
                      <div className="absolute inset-0 rounded-full border border-obsidian/5 animate-[spin_12s_linear_infinite]" />
                      <div className="absolute inset-8 md:inset-12 rounded-full border border-obsidian/10 animate-[spin_15s_linear_infinite_reverse]" />
                      <div className="absolute inset-16 md:inset-24 rounded-full border-2 border-gold/20 animate-pulse" />
                      
                      {/* Center Info */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                         <span className="font-mono text-2xl md:text-4xl font-bold text-obsidian tracking-tighter">98<span className="text-xs md:text-base align-top text-obsidian/40">%</span></span>
                         <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-obsidian/30 font-bold mt-1">Confidence</span>
                      </div>
                   </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end border-t border-black/5 pt-4 md:pt-6">
                   <div className="space-y-2">
                      <div className="text-[9px] md:text-[10px] font-mono text-obsidian/40 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Processing Visual Cortex
                      </div>
                      <div className="h-1 w-32 md:w-48 bg-gray-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: "100%" }}
                           transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                           className="h-full bg-gradient-to-r from-obsidian to-gray-600"
                         />
                      </div>
                   </div>
                   <div className="text-right text-[8px] md:text-[10px] font-mono text-obsidian/30 leading-relaxed">
                      ID: 8A-F9-00<br/>
                      LAT: 42ms
                   </div>
                </div>
             </div>

             {/* Background Grid Texture */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px] pointer-events-none" />
             <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-100" />
           </div>
        </motion.div>
      </section>

      {/* Features Section - Consistent Light Theme */}
      <section className="relative px-6 py-24 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-16 text-center">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="inline-block mb-4"
             >
               <span className="text-gold font-bold text-lg">✦</span>
             </motion.div>
             <h2 className="text-3xl md:text-5xl font-serif font-bold text-obsidian mb-6">Core Technologies</h2>
             <p className="text-obsidian/50 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
               Proprietary layers built on top of the Gemini 3 Pro reasoning engine.
               Designed for precision and creativity.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[300px]">
            
            {/* 1. Cognitive Compute (Large) */}
            <LiquidCard className="md:col-span-2 row-span-1 rounded-[2.5rem] p-8 md:p-10 bg-white border border-black/5 flex flex-col justify-between overflow-hidden relative group shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-shadow" hoverEffect>
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                   <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 text-obsidian shadow-sm group-hover:bg-obsidian group-hover:text-white transition-colors duration-500">
                     <Cpu className="w-6 h-6 md:w-7 md:h-7" />
                   </div>
                   <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight text-obsidian">Cognitive Compute</h3>
                   <p className="text-obsidian/60 max-w-sm text-sm md:text-base leading-relaxed font-light">
                     Synthesizes inventory into flavor vectors using 240-dimensional embedding space.
                   </p>
                 </div>
                 
                 <div className="flex gap-2 mt-6 md:mt-4 flex-wrap">
                    <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-wider text-obsidian/50">FlavorGraph</span>
                    <span className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-wider text-obsidian/50">Molecular</span>
                 </div>
               </div>
               
               {/* Abstract Mesh Background */}
               <div className="absolute right-[-20%] top-[-20%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-gradient-to-br from-gray-50 via-gray-100 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity" />
               <Network className="absolute bottom-[-20px] right-[-20px] w-48 md:w-64 h-48 md:h-64 text-gray-50 opacity-50 -rotate-12" strokeWidth={0.5} />
            </LiquidCard>

            {/* 2. Neural Sommelier (Small, Premium High Contrast) */}
            <LiquidCard className="rounded-[2.5rem] p-8 bg-white border border-black/5 flex flex-col justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group relative overflow-hidden h-[240px] md:h-full" hoverEffect>
               <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-amber-500/20">
                   <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
               </div>
               <div className="relative z-10 mt-auto">
                   <h4 className="text-lg md:text-xl font-bold text-obsidian mb-1">Neural Sommelier</h4>
                   <p className="text-[10px] text-obsidian/40 uppercase tracking-widest font-medium">Molecular Pairing</p>
               </div>
               {/* Decorative Gradient */}
               <div className="absolute -right-10 -top-10 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
            </LiquidCard>

            {/* 3. Search Grounding (Small, Premium High Contrast) */}
            <LiquidCard className="rounded-[2.5rem] p-8 bg-white border border-black/5 flex flex-col justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group relative overflow-hidden h-[240px] md:h-full" hoverEffect>
               <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-600/20">
                   <Globe className="w-6 h-6 md:w-7 md:h-7" />
               </div>
               <div className="relative z-10 mt-auto">
                   <h4 className="text-lg md:text-xl font-bold text-obsidian mb-1">Live Grounding</h4>
                   <p className="text-[10px] text-obsidian/40 uppercase tracking-widest font-medium">Real-time Trends</p>
               </div>
                {/* World Map / Mesh Decoration */}
               <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
               <div className="absolute -right-10 -top-10 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors" />
            </LiquidCard>

            {/* 4. Artistic Plating (Converted to Light Mode - High Contrast) */}
            <LiquidCard className="md:col-span-1 md:row-span-2 rounded-[2.5rem] p-8 bg-white text-obsidian flex flex-col relative overflow-hidden group shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-black/5" hoverEffect>
               <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-auto">
                     <div className="w-12 h-12 rounded-xl bg-obsidian flex items-center justify-center mb-6 text-white border border-black/5 shadow-lg shadow-obsidian/20">
                        <ChefHat className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl md:text-2xl font-bold mb-2">Artistic Plating</h3>
                     <p className="text-obsidian/50 text-xs md:text-sm leading-relaxed">Schematic generation for Michelin-grade presentation.</p>
                  </div>
                  
                  {/* Schematic Visual - Dark Lines on Light BG */}
                  <div className="mt-8 md:mt-12 aspect-square rounded-full border border-dashed border-obsidian/10 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500 bg-gray-50/50">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-[10px] md:text-xs font-mono text-obsidian border border-black/10 shadow-sm z-10">
                         Protein
                      </div>
                      <div className="absolute top-6 right-8 w-2 h-2 md:w-3 md:h-3 bg-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)] z-20" />
                      <div className="absolute bottom-10 left-10 w-1.5 h-1.5 md:w-2 md:h-2 bg-obsidian rounded-full z-20" />
                      
                      {/* Grid lines - Dark */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px] rounded-full" />
                      
                      {/* Orbiting Element */}
                      <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                         <div className="w-1.5 h-1.5 bg-obsidian/20 rounded-full absolute top-4 left-1/2 -translate-x-1/2" />
                      </div>
                  </div>
               </div>
            </LiquidCard>

            {/* 5. Inventory Analysis (Large Wide) */}
            <LiquidCard className="md:col-span-2 rounded-[2.5rem] p-8 md:p-10 bg-white border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden relative shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group" hoverEffect>
                <div className="z-10 mb-6 md:mb-0">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20">
                         <ScanLine className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-obsidian">Inventory Analysis</h3>
                   </div>
                   <p className="text-obsidian/50 max-w-sm text-xs md:text-sm">
                     Deep learning segmentation for precise volumetric estimation and freshness scoring.
                   </p>
                </div>
                
                {/* Visual Representation */}
                <div className="flex gap-2 relative z-10">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-12 h-16 md:w-16 md:h-20 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center relative group-hover:-translate-y-2 transition-transform" style={{ transitionDelay: `${i*100}ms` }}>
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200" />
                        <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-200 rounded-full" />
                     </div>
                   ))}
                </div>
            </LiquidCard>

          </div>
        </div>
      </section>

      {/* Footer Section - Clean & Minimal */}
      <section className="py-24 flex flex-col items-center justify-center bg-white border-t border-black/5 relative z-10">
         <div className="mb-8 p-4 rounded-full bg-gray-50 border border-black/5 animate-bounce">
            <MousePointer2 className="w-6 h-6 text-obsidian" />
         </div>
         <h2 className="text-3xl md:text-6xl font-serif font-bold text-obsidian mb-8 text-center tracking-tight px-6">
            Ready to cook?
         </h2>
         <button 
           onClick={onEnter}
           className="px-10 py-5 md:px-12 md:py-6 bg-obsidian text-white rounded-full font-bold text-base md:text-lg tracking-wide hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:scale-105"
         >
           Enter CulinaryLens
         </button>
         <div className="mt-12 flex flex-wrap justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian/30 px-6 text-center">
            <span>Stable Build v1.0.5</span>
            <span className="hidden md:inline w-1 h-1 rounded-full bg-obsidian/20" />
            <span>Powered by Gemini 3 Pro</span>
         </div>
      </section>

    </div>
  );
};
