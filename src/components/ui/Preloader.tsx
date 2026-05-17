import React from 'react';
import { motion } from 'motion/react';

export function Preloader() {
  return (
    <motion.div 
      initial={{ opacity: 1, pointerEvents: "auto" }}
      exit={{ 
        opacity: 0,
        y: -100,
        pointerEvents: "none",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[100] bg-[#0a070e] flex flex-col items-center justify-center"
    >
      <div className="relative text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <img src="/LogomarcaBranca.svg" alt="INCODED" className="h-16 w-auto" />
        </motion.div>
        
        <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden mx-auto">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-primary"
          />
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-6 text-xs uppercase tracking-[0.3em] text-gray-500 font-medium"
      >
        Iniciando experiência
      </motion.p>
    </motion.div>
  );
}
