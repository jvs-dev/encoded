import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="carousel flex flex-col h-full">
      <h3 className="carousel__heading text-xl font-bold mb-6 flex items-center">
        <span className="w-6 h-1 bg-white mr-3"></span>
        {title}
      </h3>
      <div className="carousel__container relative group overflow-hidden bg-zinc-900 border border-white/10 aspect-[4/3] md:aspect-square xl:aspect-[4/3] w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={items[currentIndex].img}
            alt={items[currentIndex].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="carousel__image absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="carousel__overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 pointer-events-none">
          <h4 className="text-xl md:text-2xl font-bold text-white">{items[currentIndex].title}</h4>
        </div>
        
        <button 
          onClick={prev} 
          className="carousel__nav carousel__nav--prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none" 
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button 
          onClick={next} 
          className="carousel__nav carousel__nav--next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none" 
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="carousel__dots absolute bottom-6 right-6 flex space-x-2">
          {items.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/60'}`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
