import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Typewriter } from '../ui/Typewriter';

interface HeroProps {
  subtitle: string;
  onTrackClick: (label: string) => void;
}

/**
 * Hero Section
 * Block: hero
 * Element: hero__bg, hero__content, hero__title, hero__subtitle, hero__actions
 */
export function Hero({ subtitle, onTrackClick }: HeroProps) {
  return (
    <section id="home" className="hero relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="hero__bg absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="Background Tech" 
          className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
      </div>
      
      <div className="hero__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="hero__title text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-4 min-h-[3.5em] sm:min-h-[2.5em] md:min-h-[2.2em]">
            <Typewriter />
          </h1>
          <p className="hero__subtitle text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          <div className="hero__actions flex flex-col sm:flex-row gap-4">
            <a 
              onClick={() => onTrackClick('Solicitar Orçamento (Hero)')} 
              href="https://wa.me/5571991895994" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex justify-center items-center bg-white text-black px-8 py-4 font-bold text-lg hover:bg-gray-200 transition-colors group"
            >
              Solicitar Orçamento
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              onClick={() => onTrackClick('Ver Serviços (Hero)')} 
              href="#servicos" 
              className="inline-flex justify-center items-center border border-white/20 text-white px-8 py-4 font-bold text-lg hover:bg-white/5 transition-colors"
            >
              Ver Serviços
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
