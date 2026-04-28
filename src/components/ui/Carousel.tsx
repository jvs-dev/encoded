import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface CarouselItem {
  title: string;
  img: string;
}

interface CarouselProps {
  title: string;
  items: CarouselItem[];
}

/**
 * Carousel Component
 * Block: carousel
 * Element: carousel__heading, carousel__container, carousel__image, carousel__overlay, carousel__nav, carousel__dots
 */
export function Carousel({ title, items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  // Close lightbox on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    if (isExpanded) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  return (
    <div className="carousel flex flex-col h-full">
      <h3 className="carousel__heading text-xl font-bold mb-6 flex items-center">
        <span className="w-6 h-1 bg-white mr-3"></span>
        {title}
      </h3>
      <div 
        onClick={() => setIsExpanded(true)}
        className="carousel__container relative group overflow-hidden bg-zinc-900 border border-white/10 aspect-[4/3] md:aspect-square xl:aspect-[4/3] w-full cursor-zoom-in"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={items[currentIndex].img}
            alt={items[currentIndex].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="carousel__image absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        {/* Soft background glow based on current image would be nice, but simple overlay for now */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors pointer-events-none" />
        
        <div className="carousel__overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-6 pointer-events-none">
          <h4 className="text-xl md:text-2xl font-bold text-white flex items-center justify-between">
            <span className="truncate mr-2">{items[currentIndex].title}</span>
            <Maximize2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0" />
          </h4>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); prev(); }} 
          className="carousel__nav carousel__nav--prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 outline-none z-10" 
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); next(); }} 
          className="carousel__nav carousel__nav--next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 outline-none z-10" 
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="carousel__dots absolute bottom-6 right-6 flex space-x-2 z-10" onClick={(e) => e.stopPropagation()}>
          {items.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setIsExpanded(false)}
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 right-6 text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all z-50"
              onClick={() => setIsExpanded(false)}
            >
              <X className="w-8 h-8" />
            </motion.button>

            <motion.div
              layoutId={`portfolio-${title}-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-[95vw] max-h-[80vh] md:max-h-[85vh] rounded-lg overflow-hidden border border-white/10 bg-zinc-900/50"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[currentIndex].img}
                alt={items[currentIndex].title}
                className="w-auto h-auto max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <h4 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                {items[currentIndex].title}
              </h4>
              <p className="text-white/40 text-xs md:text-sm mt-2 uppercase tracking-[0.3em] font-black">
                {title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
