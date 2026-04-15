import { motion } from 'motion/react';
import { Globe, Code2, LayoutTemplate, Smartphone, PenTool, MessageSquare, ArrowRight } from 'lucide-react';
import { GlowCard } from '../ui/GlowCard';
import { PromoBadge } from '../ui/PromoBadge';
import { SectionTitle } from '../ui/SectionTitle';

interface Service {
  title: string;
  description: string;
  price: string;
  promo?: boolean;
  active?: boolean;
  icon?: any;
}

interface ServicesProps {
  subtitle: string;
  services: Service[];
  onSelectService: (service: Service) => void;
  onTrackClick: (label: string) => void;
}

/**
 * Services Section
 * Block: services
 * Element: services__grid, services__card, services__footer
 */
export function Services({ subtitle, services, onSelectService, onTrackClick }: ServicesProps) {
  const defaultIcons = [
    <Globe className="w-8 h-8" />,
    <Code2 className="w-8 h-8" />,
    <LayoutTemplate className="w-8 h-8" />,
    <Smartphone className="w-8 h-8" />,
    <PenTool className="w-8 h-8" />,
    <MessageSquare className="w-8 h-8" />
  ];

  return (
    <section id="servicos" className="services py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle align="center" subtitle={subtitle}>
          Nossas Soluções
        </SectionTitle>

        <div className="services__grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter((s) => s.active !== false).map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="services__card"
            >
              <GlowCard className="h-full relative overflow-hidden">
                {service.promo && <PromoBadge />}
                
                <div className="mb-6 text-white group-hover:scale-110 transition-transform origin-left">
                  {service.icon || defaultIcons[index % defaultIcons.length]}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  {service.description}
                </p>
                
                <div className="pt-6 border-t border-white/10 flex justify-between items-center mt-auto">
                  <span className="text-sm font-black text-gray-300">{service.price}</span>
                  <button 
                    onClick={() => onSelectService(service)}
                    className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center group/btn"
                  >
                    Ver mais <ArrowRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
        
        <div className="services__footer mt-12 text-center">
          <p className="text-gray-400 mb-6">Valores promocionais por tempo limitado. Consulte condições.</p>
          <a 
            onClick={() => onTrackClick('Solicitar orçamento detalhado (Serviços)')} 
            href="https://wa.me/5571991895994" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-white font-bold hover:underline"
          >
            Solicitar orçamento detalhado <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
