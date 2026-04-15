import { motion } from 'motion/react';

/**
 * PromoBadge Component
 * Following BEM nomenclature:
 * Block: promo-badge
 * Element: promo-badge__glow, promo-badge__label, promo-badge__shimmer
 */
export function PromoBadge() {
  return (
    <div className="promo-badge absolute top-3 right-3 z-10">
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="promo-badge__container relative"
      >
        <div className="promo-badge__glow absolute inset-0 bg-white blur-[4px] opacity-20 rounded-full animate-pulse"></div>
        <div className="promo-badge__label relative bg-white text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center shadow-lg border border-white/20 overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1
            }}
            className="promo-badge__shimmer absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent w-1/2 -skew-x-12"
          />
          Promoção
        </div>
      </motion.div>
    </div>
  );
}
