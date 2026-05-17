import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface ContactProps {
  subtitle: string;
  // Kept so we don't break Landing.tsx props
  formData: any;
  formStatus: any;
  onFormSubmit: any;
  onFormDataChange: any;
}

export function Contact({ subtitle }: ContactProps) {
  return (
    <section id="contato" className="bg-[#0a070e] relative z-10 w-full overflow-hidden mb-[1px] pb-[52px]">
      {/* Decorative gradient behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-[#050308]/80 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:px-[64px] md:py-[52px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full relative overflow-hidden"
        >
          {/* Efeito de luz radial roxo no topo centralizado */}
          <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#7c3aed]/20 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="max-w-2xl text-left relative z-10">
            <div className="text-[46px] font-medium tracking-tight text-white mb-4 leading-[49px] normal-case" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
              Vamos transformar <br className="hidden md:block"/>
              seu digital em <br className="hidden md:block"/>
              vantagem competitiva.
            </div>
            <p className="text-gray-400 text-base md:text-lg font-normal">
              Conte seu desafio. Respondemos com um plano objetivo em até 24h úteis.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0 self-start md:self-center mt-4 md:mt-0">
            <Link 
              to="/contato" 
              className="group bg-primary text-white font-semibold text-sm md:text-base py-[12px] px-[24px] rounded-[10px] border border-transparent flex items-center gap-2 hover:bg-primary-dark transition-all whitespace-nowrap active:scale-95"
            >
              Falar com a equipe
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

