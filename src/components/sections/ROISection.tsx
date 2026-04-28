import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, TrendingDown, Clock, Users, ArrowRight } from 'lucide-react';

interface ROIItem {
  icon: React.ReactNode;
  title: string;
  problem: string;
  impact: string;
}

interface ROISectionProps {
  subtitle?: string;
  items?: ROIItem[];
}

export const ROISection: React.FC<ROISectionProps> = ({ subtitle, items }) => {
  const defaultItems: ROIItem[] = [
    {
      icon: <TrendingDown className="w-8 h-8 text-red-500" />,
      title: "Performance de Vendas",
      problem: "Quanto você perde por não ter um site de alta performance?",
      impact: "Estudos mostram que 53% dos usuários abandonam sites que demoram mais de 3s para carregar. Sem otimização, você está jogando marketing fora."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
      title: "Autoridade de Marca",
      problem: "Quanto custa uma identidade visual inconsistente?",
      impact: "Design amador transmite insegurança. O custo de ser ignorado por clientes premium é maior do que o investimento em branding profissional."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Retenção e Engajamento",
      problem: "Qual o prejuízo de redes sociais abandonadas?",
      impact: "Sua vitrine digital é sua prova social. Canais inativos fazem clientes em potencial buscarem o concorrente que parece mais 'vivo'."
    },
    {
      icon: <Clock className="w-8 h-8 text-green-500" />,
      title: "Eficiência Operacional",
      problem: "Quanto tempo sua equipe perde em processos manuais?",
      impact: "A falta de sistemas integrados consome horas produtivas. Automação não é custo, é recuperação de margem e lucro."
    }
  ];

  const displayItems = items || defaultItems;

  return (
    <section id="roi" className="roi py-24 bg-zinc-950 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-red-500 font-black tracking-[0.3em] uppercase text-xs mb-4 block">
              Análise de Risco Digital
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-6">
              O invisível <span className="text-gray-500">custo da inação.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              {subtitle || "Ter uma presença digital é obrigatório, mas ter uma presença digital ineficiente pode estar drenando silenciosamente o seu faturamento mensal."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-1 px-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden mt-8 md:mt-0">
          {displayItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black p-6 sm:p-8 md:p-12 hover:bg-zinc-900/50 transition-colors group"
            >
              <div className="mb-6 md:mb-8">{item.icon}</div>
              <h3 className="text-xs sm:text-sm font-black tracking-widest text-white/40 uppercase mb-4">{item.title}</h3>
              <p className="text-xl sm:text-2xl font-bold mb-6 text-white leading-tight group-hover:text-red-500 transition-colors">
                {item.problem}
              </p>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                {item.impact}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 bg-black border border-white/10 p-6 sm:p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 md:w-1 md:h-full"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 md:hidden"></div>
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">Pare de perder oportunidades.</h3>
            <p className="text-gray-400 font-medium text-sm sm:text-base">Nossa engenharia foca em estancar esses vazamentos e transformar seu digital em uma máquina de lucro.</p>
          </div>
          <a 
            href={`https://wa.me/5571991895994?text=${encodeURIComponent('Olá! Quero fazer uma análise do meu ROI digital e entender como a ENCODED pode me ajudar.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center bg-white text-black px-10 py-5 font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all active:scale-95 whitespace-nowrap"
          >
            Análise Gratuita
            <ArrowRight className="ml-3 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
