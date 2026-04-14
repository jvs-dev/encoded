import { useState, FormEvent, useEffect, useRef, ReactNode, MouseEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence, useInView, animate } from 'motion/react';
import { 
  Code2, 
  PenTool, 
  LayoutTemplate, 
  MessageSquare, 
  Smartphone, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  Mail,
  Menu,
  X,
  Star,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Rocket,
  ChevronDown
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Map from '../components/Map';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

function Carousel({ title, items }: { title: string, items: { title: string, img: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <span className="w-6 h-1 bg-white mr-3"></span>
        {title}
      </h3>
      <div className="relative group overflow-hidden bg-zinc-900 border border-white/10 aspect-[4/3] md:aspect-square xl:aspect-[4/3] w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={items[currentIndex].img}
            alt={items[currentIndex].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 pointer-events-none">
          <h4 className="text-xl md:text-2xl font-bold text-white">{items[currentIndex].title}</h4>
        </div>
        
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none" aria-label="Anterior">
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none" aria-label="Próximo">
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="absolute bottom-6 right-6 flex space-x-2">
          {items.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/60'}`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function JobCard({ icon: Icon, title, type, description, requirements }: { 
  icon: any, 
  title: string, 
  type: string, 
  description: string,
  requirements: string[]
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-start bg-zinc-950 border border-white/10 p-6 hover:border-white/30 transition-colors group cursor-pointer flex flex-col h-fit"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="w-10 h-10 bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-3">{type}</p>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/5 mt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Requisitos:</h4>
              <ul className="space-y-2">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-white/40" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-sm font-bold flex items-center text-white/70 group-hover:text-white transition-colors">
          {isExpanded ? 'Ver menos' : 'Ver detalhes'} 
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="ml-2"
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </span>
      </div>
    </motion.div>
  );
}

function AnimatedCounter({ from = 0, to, duration = 2, suffix = "", prefix = "" }: { from?: number, to: number, duration?: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          setCount(Math.floor(value));
        }
      });
      return () => controls.stop();
    }
  }, [inView, from, to, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function GlowCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden bg-zinc-950 border border-white/10 p-8 hover:border-white/30 transition-colors group ${className}`}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

function FAQItem({ question, answer, isOpen, onClick }: { key?: number | string, question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-white/10">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-white group-hover:text-gray-300 transition-colors">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Landing() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [showFloatingWhatsApp, setShowFloatingWhatsApp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingWhatsApp(true);
    }, 60000); // 1 minute
    return () => clearTimeout(timer);
  }, []);

  const [siteContent, setSiteContent] = useState({
    heroTitle: 'Engenharia digital para resultados reais.',
    heroSubtitle: 'Consultoria, sites, sistemas e identidade visual. Resolvemos problemas complexos e otimizamos processos para empresas de todos os tamanhos.',
    aboutTitle: 'Para grandes corporações e empreendedores iniciantes.',
    aboutText: 'A ENCODED nasceu com o propósito de democratizar o acesso à tecnologia e design de alto nível. Entendemos que cada negócio está em um momento diferente.',
    servicesSubtitle: 'Soluções completas de ponta a ponta. Do design estratégico ao desenvolvimento de sistemas complexos.',
    processSubtitle: 'Transparência e previsibilidade do primeiro contato ao lançamento. Sem surpresas, apenas resultados.',
    portfolioSubtitle: 'Um vislumbre do que construímos para marcas que confiam na ENCODED.',
    contactSubtitle: 'Preencha o formulário ao lado ou entre em contato diretamente pelos nossos canais. Nossa equipe retornará o mais breve possível com uma proposta customizada.',
    faqSubtitle: 'Tire suas dúvidas e entenda como podemos ajudar o seu negócio a crescer.',
    packagesSubtitle: 'Escolha a solução ideal para colocar sua empresa em um novo patamar agora.'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'site_content', 'main'));
        if (docSnap.exists()) {
          setSiteContent(docSnap.data() as any);
        }
      } catch (err) {
        console.error('Error fetching site content:', err);
      }
    };
    fetchContent();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 400) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  });

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          // Track section view
          addDoc(collection(db, 'analytics_events'), {
            type: 'section_view',
            sectionName: entry.target.id,
            timestamp: serverTimestamp()
          }).catch(() => {});
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Track Visit and Duration
  useEffect(() => {
    let visitId: string | null = null;
    let interval: NodeJS.Timeout;

    const trackVisit = async () => {
      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const referrer = document.referrer || 'Direto';
        
        const visitRef = await addDoc(collection(db, 'analytics_events'), {
          type: 'page_view',
          timestamp: serverTimestamp(),
          referrer,
          isMobile,
          duration: 0
        });
        visitId = visitRef.id;

        const startTime = Date.now();
        
        // Update duration every 15 seconds
        interval = setInterval(() => {
          if (visitId) {
            const durationSecs = Math.floor((Date.now() - startTime) / 1000);
            updateDoc(doc(db, 'analytics_events', visitId), { duration: durationSecs }).catch(() => {});
          }
        }, 15000);
      } catch (e) {
        console.error("Analytics error", e);
      }
    };
    
    trackVisit();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const trackClick = (buttonName: string) => {
    addDoc(collection(db, 'analytics_events'), {
      type: 'button_click',
      buttonName,
      timestamp: serverTimestamp()
    }).catch(() => {});
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      // Track form submission as a button click
      trackClick('Enviar Mensagem (Formulário)');

      // Salvar no Firebase como backup
      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        createdAt: serverTimestamp()
      });

      // Enviar email via FormSubmit
      await fetch("https://formsubmit.co/ajax/encoded.ofc@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            Nome: formData.name,
            Email: formData.email,
            Telefone: formData.phone || 'Não informado',
            Mensagem: formData.message,
            _subject: "Novo contato pelo site ENCODED!"
        })
      });

      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const defaultServices = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Sites Personalizados",
      description: "Presença digital profissional e otimizada para conversão.",
      price: "A partir de R$ 150",
      delay: 0.1
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Sistemas Completos",
      description: "Soluções sob medida para automatizar e otimizar seus processos.",
      price: "Preço sob consulta",
      delay: 0.2
    },
    {
      icon: <LayoutTemplate className="w-8 h-8" />,
      title: "Posts para Redes Sociais",
      description: "Design estratégico que comunica o valor da sua marca.",
      price: "A partir de R$ 20",
      delay: 0.3
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Carrossel",
      description: "Conteúdo denso e engajador para o seu Instagram/LinkedIn.",
      price: "A partir de R$ 40",
      delay: 0.4
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Identidade Visual",
      description: "Construção de marca forte, memorável e coerente.",
      price: "Preço sob consulta",
      delay: 0.5
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Consultoria Digital",
      description: "Direcionamento estratégico para escalar seu negócio no digital.",
      price: "Preço sob consulta",
      delay: 0.6
    }
  ];

  const services = siteContent.services || defaultServices;
  const packages = siteContent.packages || [];


  const portfolioSites = [
    { title: "E-commerce Premium", img: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000&auto=format&fit=crop" },
    { title: "Dashboard de Gestão", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" },
    { title: "Landing Page Institucional", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" }
  ];

  const portfolioLogos = [
    { title: "Rebranding Studio", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop" },
    { title: "Identidade Visual Tech", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop" },
    { title: "Logo Minimalista", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" }
  ];

  const portfolioPosts = [
    { title: "Campanha Lançamento", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" },
    { title: "Carrossel Educativo", img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop" },
    { title: "Post Interativo", img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=1000&auto=format&fit=crop" }
  ];

  const faqs = [
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

  const testimonials = [
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

  const partners = [
    { name: "TechFlow", logo: "https://picsum.photos/seed/techflow/200/100?grayscale" },
    { name: "CloudScale", logo: "https://picsum.photos/seed/cloudscale/200/100?grayscale" },
    { name: "Nexus", logo: "https://picsum.photos/seed/nexus/200/100?grayscale" },
    { name: "Visionary", logo: "https://picsum.photos/seed/visionary/200/100?grayscale" },
    { name: "Quantum", logo: "https://picsum.photos/seed/quantum/200/100?grayscale" },
    { name: "Apex", logo: "https://picsum.photos/seed/apex/200/100?grayscale" },
    { name: "Nova", logo: "https://picsum.photos/seed/nova/200/100?grayscale" },
    { name: "Stellar", logo: "https://picsum.photos/seed/stellar/200/100?grayscale" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      <Helmet>
        <title>ENCODED | Engenharia Digital para Resultados Reais</title>
        <meta name="description" content={siteContent.heroSubtitle} />
        <meta name="keywords" content="agência digital, criação de sites, desenvolvimento de sistemas, identidade visual, social media, consultoria digital, sites personalizados, ENCODED" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://encoded.com.br/" />
        <meta property="og:title" content={siteContent.heroTitle} />
        <meta property="og:description" content={siteContent.heroSubtitle} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://encoded.com.br/" />
        <meta property="twitter:title" content={siteContent.heroTitle} />
        <meta property="twitter:description" content={siteContent.heroSubtitle} />
        <meta property="twitter:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" />
      </Helmet>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <header>
        <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl tracking-tighter">ENCODED<span className="text-gray-500">.</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#sobre" className={`text-sm font-medium transition-colors ${activeSection === 'sobre' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Sobre</a>
              <a href="#servicos" className={`text-sm font-medium transition-colors ${activeSection === 'servicos' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Serviços</a>
              <a href="#portfolio" className={`text-sm font-medium transition-colors ${activeSection === 'portfolio' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Portfólio</a>
              <a href="#depoimentos" className={`text-sm font-medium transition-colors ${activeSection === 'depoimentos' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Avaliações</a>
              <a href="#parceiros" className={`text-sm font-medium transition-colors ${activeSection === 'parceiros' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Parceiros</a>
              <a href="#contato" className={`px-5 py-2.5 text-sm font-bold transition-colors ${activeSection === 'contato' ? 'bg-gray-200 text-black' : 'bg-white text-black hover:bg-gray-200'}`}>
                Fale Conosco
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-300 focus:outline-none"
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-black border-b border-white/10 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#sobre" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 text-base font-medium transition-colors ${activeSection === 'sobre' ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white'}`}>Sobre</a>
                <a href="#servicos" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 text-base font-medium transition-colors ${activeSection === 'servicos' ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white'}`}>Serviços</a>
                <a href="#portfolio" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 text-base font-medium transition-colors ${activeSection === 'portfolio' ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white'}`}>Portfólio</a>
                <a href="#depoimentos" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 text-base font-medium transition-colors ${activeSection === 'depoimentos' ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white'}`}>Avaliações</a>
                <a href="#parceiros" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 text-base font-medium transition-colors ${activeSection === 'parceiros' ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white'}`}>Parceiros</a>
                <a href="#contato" onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 text-base font-bold text-black bg-white mt-4 text-center ${activeSection === 'contato' ? 'bg-gray-200' : ''}`}>Fale Conosco</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </nav>
      </header>

      <main>
      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Background Tech" 
            className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
            referrerPolicy="no-referrer"
          />
          {/* Máscara escura para garantir o contraste do texto */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Gradiente para suavizar a transição para a próxima seção */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
              {siteContent.heroTitle}
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              {siteContent.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a onClick={() => trackClick('Solicitar Orçamento (Hero)')} href="https://wa.me/5571991895994" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center bg-white text-black px-8 py-4 font-bold text-lg hover:bg-gray-200 transition-colors group">
                Solicitar Orçamento
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a onClick={() => trackClick('Ver Serviços (Hero)')} href="#servicos" className="inline-flex justify-center items-center border border-white/20 text-white px-8 py-4 font-bold text-lg hover:bg-white/5 transition-colors">
                Ver Serviços
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audience / About Section */}
      <section id="sobre" className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                {siteContent.aboutTitle}
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                {siteContent.aboutText}
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
              className="relative h-[450px] border border-white/10 overflow-hidden group"
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

      {/* Stats / Impact Section */}
      <section className="py-16 bg-black border-y border-white/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-32 bg-white/[0.02] blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter to={50} prefix="+" />
              </h4>
              <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">Projetos Entregues</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter to={100} suffix="%" />
              </h4>
              <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">Satisfação</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter to={5} prefix="+" />
              </h4>
              <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">Países Atendidos</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter to={4} suffix=" anos" />
              </h4>
              <p className="text-gray-400 text-sm md:text-base font-medium uppercase tracking-wider">De Experiência</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Nossas Soluções</h2>
            <p className="text-gray-400 text-lg">
              {siteContent.servicesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any, index: number) => {
              const icons = [
                <Globe className="w-8 h-8" />,
                <Code2 className="w-8 h-8" />,
                <LayoutTemplate className="w-8 h-8" />,
                <Smartphone className="w-8 h-8" />,
                <PenTool className="w-8 h-8" />,
                <MessageSquare className="w-8 h-8" />
              ];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlowCard className="h-full">
                    <div className="mb-6 text-white group-hover:scale-110 transition-transform origin-left">
                      {service.icon || icons[index % icons.length]}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                      {service.description}
                    </p>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-center mt-auto">
                      <span className="text-sm font-bold text-gray-300">{service.price}</span>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">Valores promocionais por tempo limitado. Consulte condições.</p>
            <a onClick={() => trackClick('Solicitar orçamento detalhado (Serviços)')} href="https://wa.me/5571991895994" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-white font-bold hover:underline">
              Solicitar orçamento detalhado <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Pacotes de Soluções Section */}
      <section id="pacotes" className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Pacotes de Aceleração Digital</h2>
            <p className="text-gray-400 text-lg">
              {siteContent.packagesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:items-end">
            {/* Pacote 1 */}
            {packages[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-950 border border-white/10 p-6 md:p-8 hover:border-white/30 transition-colors flex flex-col relative h-[90%]"
            >
              <h3 className="text-2xl font-bold mb-2">{packages[0].title}</h3>
              <p className="text-gray-400 text-sm mb-6">{packages[0].description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold">{packages[0].price}</span>
                <span className="text-gray-500 text-sm ml-2">/ único</span>
                <p className="text-sm text-gray-400 mt-1">{packages[0].installments}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Site Landing Page</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Integração Direta com WhatsApp</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">1 Carrossel Estratégico</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">1 Post de Posicionamento</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Configuração de Domínio</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-white/10 mb-6">
                <p className="text-sm text-gray-400"><span className="font-bold text-white">Prazo:</span> {packages[0].deliveryTime}</p>
              </div>

              <a onClick={() => trackClick('Quero este pacote (Presença Express)')} href="#contato" className="w-full bg-transparent border border-white text-white text-center py-3 font-bold hover:bg-white hover:text-black transition-colors">
                Quero este pacote
              </a>
            </motion.div>
            )}

            {/* Pacote 2 */}
            {packages[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-950 border-2 border-white/40 p-6 md:p-10 hover:border-white/60 transition-colors flex flex-col h-[95%] relative shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-wider">
                Mais Vendido
              </div>
              <h3 className="text-2xl font-bold mb-2">{packages[1].title}</h3>
              <p className="text-gray-400 text-sm mb-6">{packages[1].description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold">{packages[1].price}</span>
                <span className="text-gray-500 text-sm ml-2">/ único</span>
                <p className="text-sm text-gray-400 mt-1">{packages[1].installments}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Site Completo + Painel de Controle Exclusivo</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Identidade Visual Básica</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Configuração de Redes Sociais</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Escrita Persuasiva (Copywriting)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">3 Carrosséis Estratégicos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">5 Posts de Autoridade</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Integração com WhatsApp e Google</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-white/10 mb-6">
                <p className="text-sm text-gray-400"><span className="font-bold text-white">Prazo:</span> {packages[1].deliveryTime}</p>
              </div>

              <a onClick={() => trackClick('Quero o Plano Profissional')} href="#contato" className="w-full bg-white text-black text-center py-3 font-bold hover:bg-gray-200 transition-colors">
                Quero o Plano Profissional
              </a>
            </motion.div>
            )}

            {/* Pacote 3 */}
            {packages[2] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-zinc-950 border border-white/10 p-6 md:p-12 hover:border-white/30 transition-colors flex flex-col h-full"
            >
              <h3 className="text-2xl font-bold mb-2">{packages[2].title}</h3>
              <p className="text-gray-400 text-sm mb-6">{packages[2].description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-bold">{packages[2].price}</span>
                <span className="text-gray-500 text-sm ml-2">/ único</span>
                <p className="text-sm text-gray-400 mt-1">{packages[2].installments}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Sistema Web Sob Medida</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Identidade Visual Completa (Manual da Marca)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Estratégia Mensal de Conteúdo (12 artes)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Consultoria de Vendas Inclusa</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-white mr-3 shrink-0" />
                  <span className="text-gray-300 text-sm">Suporte VIP prioritário</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-white/10 mb-6">
                <p className="text-sm text-gray-400"><span className="font-bold text-white">Prazo:</span> {packages[2].deliveryTime}</p>
              </div>

              <a onClick={() => trackClick('Falar com um Consultor')} href="#contato" className="w-full bg-transparent border border-white text-white text-center py-3 font-bold hover:bg-white hover:text-black transition-colors">
                Falar com um Consultor
              </a>
            </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processo" className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Nosso Processo</h2>
            <p className="text-gray-400 text-lg">
              {siteContent.processSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-white/10 z-0"></div>

            {[
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
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className="w-24 h-24 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.03)] group hover:border-white/30 transition-colors">
                  <div className="relative">
                    {item.icon}
                    <span className="absolute -top-3 -right-4 text-[10px] font-bold text-gray-500 bg-black px-1">
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

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Trabalhos Recentes</h2>
              <p className="text-gray-400 text-lg">
                {siteContent.portfolioSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Carousel title="Sites & Sistemas" items={portfolioSites} />
            <Carousel title="Identidade Visual & Logos" items={portfolioLogos} />
            <Carousel title="Social Media & Posts" items={portfolioPosts} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">O que dizem sobre nós</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-950 border border-white/10 p-8 flex flex-col"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-white text-white" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 flex-grow leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full grayscale border border-white/20 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="parceiros" className="py-20 bg-black border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-500">Nossos Parceiros</h2>
        </div>
        
        <div className="relative flex overflow-hidden group">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
          
          <motion.div 
            className="flex whitespace-nowrap gap-16 items-center py-4"
            animate={{ x: [0, -1920] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div key={index} className="flex items-center justify-center w-48 h-12 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-pointer">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Vamos iniciar seu projeto?</h2>
              <p className="text-gray-400 text-lg mb-10">
                {siteContent.contactSubtitle}
              </p>
              
              <div className="space-y-6">
                <a href="mailto:encoded.ofc@gmail.com" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="font-bold">encoded.ofc@gmail.com</p>
                  </div>
                </a>
                
                <a href="https://wa.me/5571991895994" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-white transition-colors group">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:bg-[#25D366] group-hover:text-white group-hover:border-[#25D366] transition-colors">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">WhatsApp</p>
                    <p className="font-bold">+55 (71) 99189-5994</p>
                  </div>
                </a>
              </div>

              <div className="hidden lg:block">
                <Map />
              </div>
            </div>

            <div className="bg-black border border-white/10 p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        const filteredValue = value.replace(/[^0-9\s\(\)\-]/g, '');
                        setFormData({...formData, phone: filteredValue});
                      }}
                      pattern="^[0-9\s\(\)\-]*$"
                      title="Apenas números, espaços, parênteses e hifens são permitidos"
                      className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Mensagem / Necessidade *</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
                    placeholder="Conte-nos um pouco sobre o seu projeto..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
                </button>

                {formStatus === 'success' && (
                  <p className="text-green-400 text-sm text-center mt-4">Mensagem enviada com sucesso! Retornaremos em breve.</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center mt-4">Ocorreu um erro ao enviar. Tente novamente ou contate-nos via WhatsApp.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-black border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Perguntas Frequentes</h2>
            <p className="text-gray-400 text-lg">
              {siteContent.faqSubtitle}
            </p>
          </div>

          <div className="border-t border-white/10">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trabalhe Conosco Section */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Trabalhe Conosco</h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Faça parte de uma equipe apaixonada por tecnologia e inovação. Confira nossas vagas abertas.
              </p>
            </div>
            <a onClick={() => trackClick('Enviar currículo (Vagas)')} href="mailto:encoded.ofc@gmail.com?subject=candidatura%20banco%20de%20talentos" className="inline-flex items-center text-white hover:text-gray-300 transition-colors font-medium group whitespace-nowrap">
              Enviar currículo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Carrossel de Vagas (Scroll horizontal no mobile, Grid no desktop) */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide items-start">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <span className="font-bold text-xl tracking-tighter">ENCODED<span className="text-gray-500">.</span></span>
          </div>
          <div className="text-gray-500 text-sm text-center md:text-left flex flex-col md:flex-row items-center md:gap-2">
            <span>&copy; {new Date().getFullYear()} ENCODED Agência Digital. Todos os direitos reservados.</span>
            <span className="hidden md:inline">•</span>
            <button 
              onClick={() => setIsPrivacyModalOpen(true)} 
              className="hover:text-white transition-colors mt-2 md:mt-0 underline underline-offset-4"
            >
              Política de Privacidade
            </button>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors focus:outline-none"
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-950 border border-white/10 p-6 md:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsPrivacyModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Fechar modal"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Política de Privacidade</h2>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
                <p>
                  A <strong>ENCODED</strong> valoriza e respeita a sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nosso site.
                </p>
                
                <h3 className="text-lg font-bold text-white mt-6">1. Coleta de Dados</h3>
                <p>
                  Coletamos informações pessoais (como nome, e-mail e número de telefone) apenas quando você as fornece voluntariamente através do nosso formulário de contato.
                </p>
                
                <h3 className="text-lg font-bold text-white mt-6">2. Uso das Informações</h3>
                <p>
                  Os dados coletados são utilizados exclusivamente para:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Responder às suas dúvidas e solicitações de orçamento;</li>
                  <li>Enviar propostas comerciais relacionadas aos nossos serviços;</li>
                  <li>Melhorar nosso atendimento e a experiência no site.</li>
                </ul>
                
                <h3 className="text-lg font-bold text-white mt-6">3. Proteção e Compartilhamento</h3>
                <p>
                  Suas informações são armazenadas de forma segura em nosso banco de dados. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.
                </p>

                <h3 className="text-lg font-bold text-white mt-6">4. Seus Direitos</h3>
                <p>
                  Você tem o direito de solicitar a exclusão ou alteração dos seus dados a qualquer momento. Para isso, basta entrar em contato conosco através do e-mail: <strong>encoded.ofc@gmail.com</strong>.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="bg-white text-black px-6 py-2 font-bold hover:bg-gray-200 transition-colors focus:outline-none"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <AnimatePresence>
        {showFloatingWhatsApp && (
          <motion.a 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            href="https://wa.me/5571991895994" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
            aria-label="Falar no WhatsApp"
            onClick={() => trackClick('WhatsApp Flutuante')}
          >
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
            <WhatsAppIcon className="w-7 h-7 relative z-10" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
