import { motion } from 'motion/react';

interface Partner {
  name: string;
  logo: string;
}

interface PartnersProps {
  partners: Partner[];
}

/**
 * Partners Section
 * Block: partners
 * Element: partners__title, partners__marquee, partners__item
 */
export function Partners({ partners }: PartnersProps) {
  return (
    <section id="parceiros" className="partners py-20 bg-black border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="partners__title text-sm font-bold tracking-[0.3em] uppercase text-gray-500">Nossos Parceiros</h2>
      </div>
      
      <div className="relative flex overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
        
        <motion.div 
          className="partners__marquee flex whitespace-nowrap gap-16 items-center py-4"
          animate={{ x: [0, -1920] }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div key={index} className="partners__item flex items-center justify-center w-48 h-12 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
