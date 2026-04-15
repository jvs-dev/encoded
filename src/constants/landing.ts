import { Globe, Code2, LayoutTemplate, Smartphone, PenTool, MessageSquare } from 'lucide-react';
import React from 'react';

export const DEFAULT_SERVICES = [
  {
    icon: React.createElement(Globe, { className: "w-8 h-8" }),
    title: "Sites Personalizados",
    description: "Presença digital profissional e otimizada para conversão.",
    price: "A partir de R$ 150",
    promo: true,
    active: true
  },
  {
    icon: React.createElement(Code2, { className: "w-8 h-8" }),
    title: "Sistemas Completos",
    description: "Soluções sob medida para automatizar e otimizar seus processos.",
    price: "Preço sob consulta",
    active: true
  },
  {
    icon: React.createElement(LayoutTemplate, { className: "w-8 h-8" }),
    title: "Posts para Redes Sociais",
    description: "Design estratégico que comunica o valor da sua marca.",
    price: "A partir de R$ 10",
    promo: true,
    active: true
  },
  {
    icon: React.createElement(Smartphone, { className: "w-8 h-8" }),
    title: "Carrossel 5 slides",
    description: "Conteúdo denso e engajador para o seu Instagram/LinkedIn.",
    price: "A partir de R$ 20",
    promo: true,
    active: true
  },
  {
    icon: React.createElement(PenTool, { className: "w-8 h-8" }),
    title: "Identidade Visual",
    description: "Construção de marca forte, memorável e coerente.",
    price: "Preço sob consulta",
    active: true
  },
  {
    icon: React.createElement(MessageSquare, { className: "w-8 h-8" }),
    title: "Consultoria Digital",
    description: "Direcionamento estratégico para escalar seu negócio no digital.",
    price: "Preço sob consulta",
    active: true
  }
];

export const PORTFOLIO_SITES = [
  { title: "E-commerce Premium", img: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000&auto=format&fit=crop" },
  { title: "Dashboard de Gestão", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" },
  { title: "Landing Page Institucional", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" }
];

export const PORTFOLIO_LOGOS = [
  { title: "Rebranding Studio", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop" },
  { title: "Identidade Visual Tech", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop" },
  { title: "Logo Minimalista", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" }
];

export const PORTFOLIO_POSTS = [
  { title: "Campanha Lançamento", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" },
  { title: "Carrossel Educativo", img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop" },
  { title: "Post Interativo", img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1000&auto=format&fit=crop" }
];

export const FAQS = [
  {
    question: "Vocês dão manutenção após a entrega do projeto?",
    answer: "Sim! Oferecemos pacotes de suporte e manutenção contínua para garantir que seu site ou sistema continue seguro, atualizado e funcionando perfeitamente."
  },
  {
    question: "Qual é o prazo médio para a criação de um site?",
    answer: "O prazo varia de acordo com a complexidade do projeto. Landing pages e sites institucionais costumam levar de 2 a 4 semanas, enquanto sistemas sob medida podem levar de 2 a 3 meses."
  },
  {
    question: "Como funciona a forma de pagamento?",
    answer: "Trabalhamos com flexibilidade. Normalmente, dividimos o pagamento em parcelas atreladas às entregas do projeto (ex: entrada, aprovação do design e entrega final). Aceitamos PIX, transferência e cartão."
  },
  {
    question: "Vocês também criam o design ou eu preciso enviar pronto?",
    answer: "Nós cuidamos de tudo! Nossa equipe inclui designers especializados em UI/UX que criarão toda a interface do seu projeto antes de iniciarmos o desenvolvimento."
  },
  {
    question: "Meu site vai funcionar bem no celular?",
    answer: "Com certeza. Todos os nossos projetos são desenvolvidos com a abordagem 'Mobile First', garantindo uma experiência perfeita em smartphones, tablets e desktops."
  }
];

export const TESTIMONIALS = [
  {
    name: "Carlos Mendes",
    role: "CEO, TechLog",
    content: "A ENCODED transformou nossa operação. O sistema personalizado que desenvolveram reduziu nosso tempo de processamento em 40%. Profissionalismo ímpar.",
    avatar: "https://i.pravatar.cc/150?u=carlos"
  },
  {
    name: "Mariana Silva",
    role: "Empreendedora",
    content: "Comecei meu negócio do zero e o site que a ENCODED fez me deu a credibilidade que eu precisava. Preço acessível e entrega impecável.",
    avatar: "https://i.pravatar.cc/150?u=mariana"
  },
  {
    name: "Roberto Almeida",
    role: "Diretor de Marketing",
    content: "Os criativos para nossas redes sociais elevaram o padrão da nossa marca. Comunicação séria, direta e resultados visíveis na primeira semana.",
    avatar: "https://i.pravatar.cc/150?u=roberto"
  }
];

export const PARTNERS = [
  { name: "TechFlow", logo: "https://picsum.photos/seed/techflow/200/100?grayscale" },
  { name: "CloudScale", logo: "https://picsum.photos/seed/cloudscale/200/100?grayscale" },
  { name: "Nexus", logo: "https://picsum.photos/seed/nexus/200/100?grayscale" },
  { name: "Visionary", logo: "https://picsum.photos/seed/visionary/200/100?grayscale" },
  { name: "Quantum", logo: "https://picsum.photos/seed/quantum/200/100?grayscale" },
  { name: "Apex", logo: "https://picsum.photos/seed/apex/200/100?grayscale" },
  { name: "Nova", logo: "https://picsum.photos/seed/nova/200/100?grayscale" },
  { name: "Stellar", logo: "https://picsum.photos/seed/stellar/200/100?grayscale" },
];
