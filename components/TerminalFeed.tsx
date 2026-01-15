
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

interface Props {
  customLogs?: string[];
}

const DEFAULT_LOGS = [
  "Initializing Multimodal Interface...",
  "Uploading Context to Gemini 3 Flash (2M Context Window)...",
  "Processing Visual Stream (Spatial Reasoning Enabled)...",
  "Extracting Bounding Boxes & Segmentation Masks (JSON Mode)...",
  "Calculating Volumetric Density via Depth Map...",
  "Finalizing Liquid Glass Render..."
];

export const TerminalFeed: React.FC<Props> = ({ customLogs }) => {
  const logsToUse = customLogs || DEFAULT_LOGS;
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs([]); // Reset on prop change
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < logsToUse.length) {
        setLogs(prev => [...prev, logsToUse[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 600); 

    return () => clearInterval(interval);
  }, [logsToUse]);

  return (
    <div className="w-full max-w-2xl mx-auto font-mono text-xs md:text-sm">
      <div className="bg-[#1a1a1d] rounded-t-xl p-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-white/40 flex items-center gap-2 text-[10px] uppercase tracking-widest">
          <Cpu className="w-3 h-3" />
          <span>Gemini.Nucleus.v3.0</span>
        </div>
      </div>
      
      <div className="bg-[#1a1a1d]/95 backdrop-blur-md rounded-b-xl p-6 min-h-[300px] border border-white/5 shadow-2xl relative overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
         
         <div className="relative z-10 space-y-2">
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-white/80"
              >
                <span className="text-gold/60">[{new Date().toLocaleTimeString([], {hour12: false, hour: "2-digit", minute: "2-digit", second:"2-digit"})}.{(i*132)%999}]</span>
                <span className={i === logs.length - 1 ? "text-gold animate-pulse" : "text-gray-400"}>
                  {`> ${log}`}
                </span>
              </motion.div>
            ))}
            <motion.div 
              animate={{ opacity: [0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-gold inline-block align-middle ml-2"
            />
         </div>
      </div>
    </div>
  );
};
