import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { GlowCard } from '../ui/GlowCard';
import { SectionTitle } from '../ui/SectionTitle';

interface Package {
  title: string;
  description: string;
  price: string;
  installments: string;
  deliveryTime: string;
  features?: string[];
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
    <section id="pacotes" className="packages py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle align="center" subtitle={subtitle}>
          Pacotes de Aceleração Digital
        </SectionTitle>

        <div className="packages__grid grid md:grid-cols-3 gap-8 md:items-end">
          {packages.map((pkg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              className="h-full"
            >
              <GlowCard className={`h-full !p-0 ${index === 1 ? 'border-2 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : ''}`}>
                <div className="p-6 md:p-8 flex flex-col h-full relative">
                  {index === 1 && (
                    <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-wider">
                      Mais Vendido
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-gray-400 text-sm mb-6">{pkg.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className="text-gray-500 text-sm ml-2">/ único</span>
                    <p className="text-sm text-gray-400 mt-1">{pkg.installments}</p>
                  </div>

                  <ul className="packages__feature-list space-y-4 mb-8 flex-grow">
                    {(pkg.features || defaultFeatures[index]).map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-white/10 mb-6">
                    <p className="text-sm text-gray-400"><span className="font-bold text-white">Prazo:</span> {pkg.deliveryTime}</p>
                  </div>

                  <a 
                    onClick={() => onTrackClick(`Quero este pacote (${pkg.title})`)} 
                    href="#contato" 
                    className={`w-full text-center py-3 font-bold transition-colors ${index === 1 ? 'bg-white text-black hover:bg-gray-200' : 'bg-transparent border border-white text-white hover:bg-white hover:text-black'}`}
                  >
                    {index === 2 ? 'Falar com um Consultor' : 'Quero este pacote'}
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
