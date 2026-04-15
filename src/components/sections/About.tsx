import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface AboutProps {
  title: string;
  text: string;
}

/**
 * About Section
 * Block: about
 * Element: about__content, about__image, about__stats, about__stat-item
 */
export function About({ title, text }: AboutProps) {
  const stats = [
    { to: 50, prefix: "+", label: "Projetos Entregues", delay: 0.1 },
    { to: 100, suffix: "%", label: "Satisfação", delay: 0.2 },
    { to: 1, prefix: "+", label: "Países Atendidos", delay: 0.3 },
    { to: 4, suffix: " anos", label: "De Experiência", delay: 0.4 }
  ];

  return (
    <>
      <section id="sobre" className="about py-24 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="about__content"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                {title}
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                {text}
              </p>
              <ul className="space-y-4">
                {[
                  "Preços customizados e acessíveis",
                  "Atendimento consultivo e transparente",
                  "Foco em resolução de problemas",
                  "Entregas focadas em conversão e usabilidade"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-white mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="about__image relative h-[450px] border border-white/10 overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Equipe ENCODED trabalhando" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8">
                <div className="w-full h-1 bg-gradient-to-r from-white to-transparent mb-6"></div>
                <h3 className="text-2xl font-bold mb-3 text-white">Nosso Compromisso</h3>
                <p className="text-gray-300 text-lg italic">
                  "Não entregamos apenas código ou imagens. Entregamos soluções que geram autoridade, otimizam tempo e aumentam o faturamento dos nossos clientes."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about__stats py-16 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-32 bg-white/[0.02] blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
                className="about__stat-item"
              >
                <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter to={stat.to} prefix={stat.prefix} suffix={stat.suffix} />
                </h4>
                <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
