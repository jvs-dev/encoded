import { useState, FormEvent, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'motion/react';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Layout Components
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Section Components
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Services } from '../components/sections/Services';
import { Packages } from '../components/sections/Packages';
import { Process } from '../components/sections/Process';
import { Portfolio } from '../components/sections/Portfolio';
import { Testimonials } from '../components/sections/Testimonials';
import { Partners } from '../components/sections/Partners';
import { Contact } from '../components/sections/Contact';
import { FAQ } from '../components/sections/FAQ';
import { Careers } from '../components/sections/Careers';

// UI Components
import { ServiceDetailModal } from '../components/ui/ServiceDetailModal';
import { PrivacyPolicyModal } from '../components/ui/PrivacyPolicyModal';
import { FloatingWhatsApp } from '../components/ui/FloatingWhatsApp';

// Constants
import { 
  DEFAULT_SERVICES, 
  PORTFOLIO_SITES, 
  PORTFOLIO_LOGOS, 
  PORTFOLIO_POSTS, 
  FAQS, 
  TESTIMONIALS, 
  PARTNERS 
} from '../constants/landing';

export default function Landing() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [showFloatingWhatsApp, setShowFloatingWhatsApp] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const [siteContent, setSiteContent] = useState<any>({
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
    const timer = setTimeout(() => {
      setShowFloatingWhatsApp(true);
    }, 60000); // 1 minute
    return () => clearTimeout(timer);
  }, []);

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

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      trackClick('Enviar Mensagem (Formulário)');

      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        createdAt: serverTimestamp()
      });

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

  const services = siteContent.services || DEFAULT_SERVICES;
  const packages = siteContent.packages || [
    { title: "Presença Express", description: "Ideal para quem precisa de um posicionamento profissional rápido.", price: "R$ 497", installments: "ou 12x de R$ 49,70", deliveryTime: "5 dias úteis" },
    { title: "Plano Profissional", description: "A solução completa para empresas que buscam escala e autoridade.", price: "R$ 1.297", installments: "ou 12x de R$ 129,70", deliveryTime: "15 dias úteis" },
    { title: "Custom Enterprise", description: "Sistemas e estratégias robustas para negócios complexos.", price: "Sob Consulta", installments: "Condições especiais", deliveryTime: "A combinar" }
  ];

  return (
    <div className="landing min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
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

      <Navbar activeSection={activeSection} />

      <main>
        <Hero subtitle={siteContent.heroSubtitle} onTrackClick={trackClick} />
        <About title={siteContent.aboutTitle} text={siteContent.aboutText} />
        <Services 
          subtitle={siteContent.servicesSubtitle} 
          services={services} 
          onSelectService={setSelectedService} 
          onTrackClick={trackClick} 
        />
        <Packages 
          subtitle={siteContent.packagesSubtitle} 
          packages={packages} 
          onTrackClick={trackClick} 
        />
        <Process subtitle={siteContent.processSubtitle} />
        <Portfolio 
          subtitle={siteContent.portfolioSubtitle} 
          sites={PORTFOLIO_SITES} 
          logos={PORTFOLIO_LOGOS} 
          posts={PORTFOLIO_POSTS} 
        />
        <Testimonials testimonials={TESTIMONIALS} />
        <Partners partners={PARTNERS} />
        <Contact 
          subtitle={siteContent.contactSubtitle} 
          formData={formData} 
          formStatus={formStatus} 
          onFormSubmit={handleFormSubmit} 
          onFormDataChange={setFormData} 
        />
        <FAQ subtitle={siteContent.faqSubtitle} faqs={FAQS} />
        <Careers onTrackClick={trackClick} />
      </main>

      <Footer onOpenPrivacy={() => setIsPrivacyModalOpen(true)} />

      <ServiceDetailModal 
        service={selectedService} 
        onClose={() => setSelectedService(null)} 
      />
      
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />

      <FloatingWhatsApp show={showFloatingWhatsApp} onTrackClick={trackClick} />
    </div>
  );
}
