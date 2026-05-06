import { motion } from 'motion/react';
import { CheckCircle2, Plus, TrendingUp } from 'lucide-react';
import { GlowCard } from '../ui/GlowCard';
import { SectionTitle } from '../ui/SectionTitle';

interface Package {
  title: string;
  description: string;
  price: string;
  installments: string;
  deliveryTime: string;
  features?: string[];
  bonusItems?: string[];
}

interface PackagesProps {
  subtitle: string;
  packages: Package[];
  onTrackClick: (label: string) => void;
}

/**
 * Packages Section
 * Block: packages
 * Element: packages__grid, packages__card, packages__feature-list
 */
export function Packages({ subtitle, packages, onTrackClick }: PackagesProps) {
  // Default features if not provided by CMS
  const defaultFeatures = [
    [
      "Site Landing Page",
      "Integração Direta com WhatsApp",
      "1 Carrossel Estratégico",
      "1 Post de Posicionamento",
      "Configuração de Domínio"
    ],
    [
      "Site Completo + Painel de Controle Exclusivo",
      "Identidade Visual Básica",
      "Configuração de Redes Sociais",
      "Escrita Persuasiva (Copywriting)",
      "3 Carrosséis Estratégicos",
      "5 Posts de Autoridade",
      "Integração com WhatsApp e Google"
    ],
    [
      "Sistema Web Sob Medida",
      "Identidade Visual Completa (Manual da Marca)",
      "Estratégia Mensal de Conteúdo (12 artes)",
      "Consultoria de Vendas Inclusa",
      "Suporte VIP prioritário"
    ]
  ];

  return (
    <section id="pacotes" className="packages py-32 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Background growth indicator graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <TrendingUp className="absolute top-20 right-[10%] w-64 h-64 text-primary rotate-12" />
        <TrendingUp className="absolute bottom-20 left-[5%] w-96 h-96 text-primary -rotate-12" />
        <TrendingUp className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-primary/5 rotate-12" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle align="center" subtitle={subtitle}>
          Pacotes de Aceleração Digital
        </SectionTitle>

        <div className="packages__grid grid md:grid-cols-3 gap-8 lg:gap-12 md:items-end pt-12">
          {packages.map((pkg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              className={`h-full relative ${index === 1 ? 'z-20' : 'z-0'}`}
            >
              <GlowCard className={`h-full !p-0 !overflow-visible transition-all duration-500 ${index === 1 ? 'border-2 border-primary shadow-[0_0_50px_rgba(124,58,237,0.2)] md:scale-105' : 'opacity-80 hover:opacity-100'}`}>
                <div className="p-6 md:p-8 lg:p-8 flex flex-col h-full relative">
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] shadow-xl z-20 rounded-full">
                      Recomendado
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{pkg.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-black text-white">{pkg.price}</span>
                    <span className="text-gray-500 text-sm ml-2">/ projeto</span>
                    <p className="text-sm text-gray-400 mt-1">{pkg.installments}</p>
                  </div>

                  <ul className="packages__feature-list space-y-4 mb-8 flex-grow">
                    {(pkg.features || defaultFeatures[index]).map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
                        <span className="text-gray-300 text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                    {pkg.bonusItems && pkg.bonusItems.length > 0 && (
                      <>
                        {pkg.bonusItems.map((bonus, bIndex) => (
                          <li key={bIndex} className="flex items-start">
                            <Plus className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                            <span className="text-white text-sm font-bold leading-tight">{bonus}</span>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>

                  <div className="pt-6 border-t border-white/10 mb-8">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Prazo de Entrega</p>
                      <p className="text-sm font-bold text-white">{pkg.deliveryTime}</p>
                    </div>
                  </div>

                  <a 
                    onClick={() => onTrackClick(`Quero este pacote (${pkg.title})`)} 
                    href={`https://wa.me/5571991895994?text=${encodeURIComponent(`Olá! Vi o site da INCODED e gostaria de saber mais sobre o pacote: ${pkg.title}`)}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center py-4 font-black tracking-widest uppercase text-sm transition-all active:scale-95 rounded-sm ${index === 1 ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20' : 'bg-transparent border border-primary/40 text-white hover:bg-primary hover:border-primary hover:text-white'}`}
                  >
                    {index === 2 ? 'Consultar Especialista' : 'Iniciar agora'}
                  </a>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
