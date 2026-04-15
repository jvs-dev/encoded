import { motion } from 'motion/react';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';

interface ProcessProps {
  subtitle: string;
}

/**
 * Process Section
 * Block: process
 * Element: process__grid, process__item, process__icon-box, process__step-number
 */
export function Process({ subtitle }: ProcessProps) {
  const steps = [
    {
      step: "01",
      title: "Discovery",
      description: "Mergulhamos no seu negócio para entender o público, concorrentes e objetivos reais.",
      icon: <Search className="w-6 h-6 text-white" />
    },
    {
      step: "02",
      title: "Design & Estratégia",
      description: "Criamos protótipos de alta fidelidade para você visualizar e aprovar antes do código.",
      icon: <PenTool className="w-6 h-6 text-white" />
    },
    {
      step: "03",
      title: "Desenvolvimento",
      description: "Codificação limpa, otimizada para SEO e com as melhores tecnologias do mercado.",
      icon: <Code2 className="w-6 h-6 text-white" />
    },
    {
      step: "04",
      title: "Lançamento",
      description: "Entrega oficial, treinamento da equipe e suporte contínuo para garantir estabilidade.",
      icon: <Rocket className="w-6 h-6 text-white" />
    }
  ];

  return (
    <section id="processo" className="process py-24 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle align="center" subtitle={subtitle}>
          Nosso Processo
        </SectionTitle>

        <div className="process__grid grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-white/10 z-0"></div>

          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="process__item relative z-10 flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="process__icon-box w-24 h-24 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.03)] group hover:border-white/30 transition-colors">
                <div className="relative">
                  {item.icon}
                  <span className="process__step-number absolute -top-3 -right-4 text-[10px] font-bold text-gray-500 bg-black px-1">
                    {item.step}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
