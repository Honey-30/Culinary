import React from 'react';
import { motion } from 'framer-motion';

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
}

export const LiquidCard: React.FC<LiquidCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  hoverEffect = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' } : undefined}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] // Apple spring easing
      }}
      className={`relative overflow-hidden border border-white/60 bg-white/60 backdrop-blur-2xl shadow-glass ${className}`}
    >
      {/* Specular Highlight (Top) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-multiply" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};