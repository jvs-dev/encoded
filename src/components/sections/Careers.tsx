import { ArrowRight, Code2, PenTool, MessageSquare } from 'lucide-react';
import { JobCard } from '../ui/JobCard';

interface CareersProps {
  onTrackClick: (label: string) => void;
}

/**
 * Careers Section
 * Block: careers
 * Element: careers__header, careers__grid
 */
export function Careers({ onTrackClick }: CareersProps) {
  return (
    <section className="careers py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="careers__header flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Trabalhe Conosco</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Faça parte de uma equipe apaixonada por tecnologia e inovação. Confira nossas vagas abertas.
            </p>
          </div>
          <a 
            onClick={() => onTrackClick('Enviar currículo (Vagas)')} 
            href="mailto:encoded.ofc@gmail.com?subject=candidatura%20banco%20de%20talentos" 
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors font-medium group whitespace-nowrap"
          >
            Enviar currículo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="careers__grid flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide items-start">
          <JobCard 
            icon={Code2}
            title="Programador Full-Stack"
            type="Remoto • Tempo Integral"
            description="Buscamos desenvolvedores apaixonados por criar soluções escaláveis, APIs robustas e interfaces incríveis."
            requirements={["React / Next.js", "Node.js / TypeScript", "PostgreSQL / Prisma", "AWS / Docker"]}
          />

          <JobCard 
            icon={PenTool}
            title="UX/UI Designer"
            type="Híbrido • Tempo Integral"
            description="Projete experiências de usuário memoráveis e interfaces de alto impacto visual para nossos clientes."
            requirements={["Figma / Adobe XD", "Design Systems", "Prototipagem de Alta Fidelidade", "Acessibilidade (WCAG)"]}
          />

          <JobCard 
            icon={MessageSquare}
            title="Consultor de Vendas"
            type="Remoto • PJ"
            description="Ajude a expandir nossos negócios, prospectar novos clientes e fechar grandes projetos de tecnologia."
            requirements={["Prospecção B2B", "Gestão de CRM (HubSpot/Pipedrive)", "Negociação Estratégica", "Inglês Fluente"]}
          />
        </div>
      </div>
    </section>
  );
}
