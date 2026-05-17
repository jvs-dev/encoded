import { motion } from 'motion/react';
import { SectionTitle } from '../ui/SectionTitle';
import { ExternalLink, ZoomIn } from 'lucide-react';

interface PortfolioItem {
  title: string;
  img: string;
  category?: string;
}

interface PortfolioProps {
  subtitle: string;
  sites: PortfolioItem[];
  logos: PortfolioItem[];
  posts: PortfolioItem[];
}

const BentoCard = ({ item, className = "" }: { item: PortfolioItem; className?: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`relative group bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 cursor-pointer ${className}`}
  >
    <img 
      src={item.img} 
      alt={item.title} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
    
    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
      <span className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">
        {item.category || "Project"}
      </span>
      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
        <div className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white">
          <ZoomIn className="w-4 h-4" />
        </div>
        <div className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </div>
  </motion.div>
);

export function Portfolio({ subtitle, sites, logos, posts }: PortfolioProps) {
  // Combine items for the bento grid
  const items = [
    { ...sites[0], category: "Sites & Sistemas", size: "lg" },
    { ...logos[0], category: "Identity", size: "md" },
    { ...posts[0], category: "Social Media", size: "sm" },
    { ...sites[1], category: "Development", size: "sm" },
    { ...logos[1], category: "Branding", size: "lg" },
    { ...posts[1], category: "Criativos", size: "md" },
  ];

  return (
    <section id="portfolio" className="portfolio py-24 bg-[#0a070e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle={subtitle}>
          Engineering Excellence
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[1200px] md:h-[800px]">
          {/* Card 1: Large Main */}
          <BentoCard 
            item={items[0]} 
            className="md:col-span-2 md:row-span-2" 
          />
          
          {/* Card 2: Square Top */}
          <BentoCard 
            item={items[1]} 
            className="md:col-span-2 md:row-span-1" 
          />
          
          {/* Card 3: Small Bottom Left */}
          <BentoCard 
            item={items[2]} 
            className="md:col-span-1 md:row-span-1" 
          />
          
          {/* Card 4: Small Bottom Right */}
          <BentoCard 
            item={items[3]} 
            className="md:col-span-1 md:row-span-1" 
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[400px]">
           <BentoCard item={items[4]} className="md:col-span-2" />
           <BentoCard item={items[5]} className="md:col-span-1" />
        </div>

        <div className="mt-12 flex justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
            >
                Ver Portfólio Completo
            </motion.button>
        </div>
      </div>
    </section>
  );
}

