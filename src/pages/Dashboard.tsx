import React, { useState, useEffect } from 'react';
import { db, auth, googleProvider } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Lock, Save, LogOut, ArrowLeft, Loader2, LayoutDashboard, Activity, Users, MessageSquare, Trash2, Plus, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { ICON_LIST, getIcon } from '../lib/icons';

const CONTENT_ID = 'main';

const AdminNav = () => (
  <div className="flex space-x-6 mr-8 border-r border-white/10 pr-8">
    <a href="/dashboard" className="text-sm font-bold text-white flex items-center">
      <LayoutDashboard className="w-4 h-4 mr-2" /> Conteúdo
    </a>
    <a href="/webdata" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center">
      <Activity className="w-4 h-4 mr-2" /> Analytics
    </a>
  </div>
);

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'leads' | 'admins'>('content');
  
  // Leads state
  const [leads, setLeads] = useState<any[]>([]);
  
  // Admins state
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  
  const [content, setContent] = useState({
    adminPassword: 'encoded123',
    heroTitle: 'Engenharia digital para resultados reais.',
    heroSubtitle: 'Consultoria, sites, sistemas e identidade visual. Resolvemos problemas complexos e otimizamos processos para empresas de todos os tamanhos.',
    aboutTitle: 'Para grandes corporações e empreendedores iniciantes.',
    aboutText: 'A ENCODED nasceu com o propósito de democratizar o acesso à tecnologia e design de alto nível. Entendemos que cada negócio está em um momento diferente.',
    aboutImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
    heroVideoUrl: '/videowork.mp4',
    servicesSubtitle: 'Soluções completas de ponta a ponta. Do design estratégico ao desenvolvimento de sistemas complexos.',
    processSubtitle: 'Transparência e previsibilidade do primeiro contato ao lançamento. Sem surpresas, apenas resultados.',
    portfolioSubtitle: 'Um vislumbre do que construímos para marcas que confiam na ENCODED.',
    contactSubtitle: 'Preencha o formulário ao lado ou entre em contato diretamente pelos nossos canais. Nossa equipe retornará o mais breve possível com uma proposta customizada.',
    faqSubtitle: 'Tire suas dúvidas e entenda como podemos ajudar o seu negócio a crescer.',
    faqs: [
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
      }
    ],
    testimonials: [
      {
        name: "Carlos Mendes",
        role: "CEO, TechLog",
        content: "A ENCODED transformou nossa operação. O sistema personalizado que desenvolveram reduziu nosso tempo de processamento em 40%. Profissionalismo ímpar.",
        avatar: "https://i.pravatar.cc/150?u=carlos",
        rating: 5
      },
      {
        name: "Mariana Silva",
        role: "Empreendedora",
        content: "Comecei meu negócio do zero e o site que a ENCODED fez me deu a credibilidade que a eu precisava. Preço acessível e entrega impecável.",
        avatar: "https://i.pravatar.cc/150?u=mariana",
        rating: 5
      }
    ],
    packagesSubtitle: 'Escolha a solução ideal para colocar sua empresa em um novo patamar agora.',
    roiSubtitle: 'Ter uma presença digital é obrigatório, mas ter uma presença digital ineficiente pode estar drenando silenciosamente o seu faturamento mensal.',
    showPartners: true,
    partners: [
      { name: "Partner 1", logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" },
      { name: "Partner 2", logo: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop" }
    ],
    portfolioSites: [
      { title: "Dashboard Corporativo", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" },
      { title: "Landing Page High Performance", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" },
      { title: "E-commerce de Luxo", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" }
    ],
    portfolioLogos: [
      { title: "Branding ENCODED", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop" },
      { title: "Logotipo TechWave", img: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=2069&auto=format&fit=crop" },
      { title: "Visual ID Spark", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop" }
    ],
    portfolioPosts: [
      { title: "Campanha ROI Digital", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop" },
      { title: "Social Media Strategy", img: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=2074&auto=format&fit=crop" },
      { title: "Creative Ads Batch", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" }
    ],
    services: [
      { title: "Sites Personalizados", description: "Presença digital profissional e otimizada para conversão.", price: "A partir de R$ 150", promo: true, active: true, includedItems: [], iconName: 'globe' },
      { title: "Sistemas Completos", description: "Soluções sob medida para automatizar e otimizar seus processos.", price: "Preço sob consulta", active: true, includedItems: [], iconName: 'code' },
      { title: "Posts para Redes Sociais", description: "Design estratégico que comunica o valor da sua marca.", price: "A partir de R$ 10", promo: true, active: true, includedItems: [], iconName: 'layout' },
      { title: "Carrossel 5 slides", description: "Conteúdo denso e engajador para o seu Instagram/LinkedIn.", price: "A partir de R$ 20", promo: true, active: true, includedItems: [], iconName: 'smartphone' },
      { title: "Identidade Visual", description: "Marcas fortes, memoráveis e alinhadas com seu propósito.", price: "A partir de R$ 500", active: true, includedItems: [], iconName: 'pen' },
      { title: "Consultoria", description: "Diagnóstico e plano de ação para escalar seu negócio digital.", price: "R$ 350 / sessão", active: true, includedItems: [], iconName: 'message' }
    ],
    packages: [
      {
        title: "Presença Digital Express",
        description: "Ideal para quem precisa de uma presença profissional imediata com baixo investimento.",
        price: "R$ 442,00",
        installments: "ou 12x de R$ 36,83",
        deliveryTime: "3 dias úteis",
        bonusItems: []
      },
      {
        title: "Aceleração Profissional",
        description: "A solução completa para empresas que querem vender mais e ter controle total do seu site.",
        price: "R$ 997,00",
        installments: "ou 12x de R$ 83,08",
        deliveryTime: "8 dias úteis",
        bonusItems: []
      },
      {
        title: "Ecossistema Digital Premium",
        description: "Projeto robusto para empresas que buscam liderança de mercado e automação total.",
        price: "R$ 3.497,00",
        installments: "ou 12x de R$ 291,41",
        deliveryTime: "Sob consulta",
        bonusItems: []
      }
    ]
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchContent();
        await fetchLeads();
        await fetchAdmins();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    try {
      await setDoc(doc(db, 'admins', newAdminEmail.toLowerCase()), {
        email: newAdminEmail.toLowerCase(),
        role: 'admin',
        addedAt: new Date()
      });
      setNewAdminEmail('');
      fetchAdmins();
      setSuccessMsg('Administrador adicionado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Erro ao adicionar administrador. Verifique suas permissões.');
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (email === 'jvssilv4@gmail.com') {
      alert('Não é possível remover o administrador principal.');
      return;
    }
    if (window.confirm(`Remover ${email} dos administradores?`)) {
      try {
        await deleteDoc(doc(db, 'admins', email));
        fetchAdmins();
      } catch (err) {
        setError('Erro ao remover administrador.');
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      try {
        await deleteDoc(doc(db, 'leads', id));
        fetchLeads();
      } catch (err) {
        setError('Erro ao excluir lead.');
      }
    }
  };

  const fetchContent = async () => {
    try {
      const docRef = doc(db, 'site_content', CONTENT_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError('Erro ao fazer login: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    
    setSaving(true);
    setError('');
    setSuccessMsg('');
    
    console.log('Starting save operation...');
    
    try {
      // Small timeout to ensure the UI has time to show the "Saving..." state before the blocking DB call
      // (Though setDoc is async, batching can sometimes delay state updates)
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const docRef = doc(db, 'site_content', CONTENT_ID);
      await setDoc(docRef, content);
      
      console.log('Save successful');
      setSuccessMsg('Conteúdo salvo com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Error saving content:', err);
      setError('Erro ao salvar conteúdo: ' + (err.message || 'Erro desconhecido'));
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newServices = [...content.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setContent(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    const newService = {
      title: "Novo Serviço",
      description: "Descrição do serviço...",
      price: "A partir de R$ 0",
      active: true,
      promo: false,
      includedItems: [],
      iconName: 'globe'
    };
    setContent(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const removeService = (index: number) => {
    if (window.confirm('Deseja realmente excluir este serviço?')) {
      const newServices = content.services.filter((_, i) => i !== index);
      setContent(prev => ({ ...prev, services: newServices }));
    }
  };

  const handlePackageChange = (index: number, field: string, value: any) => {
    const newPackages = [...content.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setContent(prev => ({ ...prev, packages: newPackages }));
  };

  const handleFAQChange = (index: number, field: string, value: string) => {
    const newFaqs = [...content.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setContent(prev => ({ ...prev, faqs: newFaqs }));
  };

  const addFAQItem = () => {
    const newItem = { question: "Nova Pergunta", answer: "Resposta aqui..." };
    setContent(prev => ({ ...prev, faqs: [...prev.faqs, newItem] }));
  };

  const removeFAQItem = (index: number) => {
    if (window.confirm('Excluir esta pergunta?')) {
      const newFaqs = content.faqs.filter((_, i) => i !== index);
      setContent(prev => ({ ...prev, faqs: newFaqs }));
    }
  };
  
  const handleTestimonialChange = (index: number, field: string, value: any) => {
    const newTestimonials = [...content.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setContent(prev => ({ ...prev, testimonials: newTestimonials }));
  };

  const addTestimonial = () => {
    const newItem = { 
      name: "Nome do Cliente", 
      role: "Cargo / Empresa", 
      content: "Texto do depoimento...", 
      avatar: "https://i.pravatar.cc/150",
      rating: 5
    };
    setContent(prev => ({ ...prev, testimonials: [...prev.testimonials, newItem] }));
  };

  const removeTestimonial = (index: number) => {
    if (window.confirm('Excluir este depoimento?')) {
      const newTestimonials = content.testimonials.filter((_, i) => i !== index);
      setContent(prev => ({ ...prev, testimonials: newTestimonials }));
    }
  };

  const handlePortfolioChange = (category: 'portfolioSites' | 'portfolioLogos' | 'portfolioPosts', index: number, field: string, value: string) => {
    // @ts-ignore
    const newList = [...content[category]];
    newList[index] = { ...newList[index], [field]: value };
    setContent(prev => ({ ...prev, [category]: newList }));
  };

  const handlePartnerChange = (index: number, field: string, value: string) => {
    const newList = [...content.partners];
    newList[index] = { ...newList[index], [field]: value };
    setContent(prev => ({ ...prev, partners: newList }));
  };

  const addPartner = () => {
    const newItem = { name: "Novo Parceiro", logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" };
    setContent(prev => ({ ...prev, partners: [...prev.partners, newItem] }));
  };

  const removePartner = (index: number) => {
    if (window.confirm('Excluir este parceiro?')) {
      const newList = content.partners.filter((_, i) => i !== index);
      setContent(prev => ({ ...prev, partners: newList }));
    }
  };

  const addPortfolioItem = (category: 'portfolioSites' | 'portfolioLogos' | 'portfolioPosts') => {
    const newItem = { title: "Novo Trabalho", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" };
    // @ts-ignore
    setContent(prev => ({ ...prev, [category]: [...prev[category], newItem] }));
  };

  const removePortfolioItem = (category: 'portfolioSites' | 'portfolioLogos' | 'portfolioPosts', index: number) => {
    if (window.confirm('Excluir este item do portfólio?')) {
      // @ts-ignore
      const newList = content[category].filter((_, i) => i !== index);
      setContent(prev => ({ ...prev, [category]: newList }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-white/10 p-8 w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Acesso Restrito</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Faça login com sua conta Google autorizada para acessar o painel.
          </p>
          
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            Entrar com Google
          </button>
          
          {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
          
          <div className="mt-6 text-center">
            <a href="/" className="text-gray-500 hover:text-white text-sm inline-flex items-center transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o site
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 pt-20">
      <header className="bg-zinc-950 border-b border-white/10 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-xl tracking-tighter mr-4">ENCODED<span className="text-gray-500">.</span></span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="ml-4 font-medium text-sm tracking-widest uppercase text-gray-300">CMS Dashboard</span>
          </div>
          <div className="flex items-center">
            <AdminNav />
            <button 
              onClick={handleSave}
              disabled={saving || activeTab !== 'content'}
              className={`px-4 py-2 rounded text-sm font-bold flex items-center transition-all mr-4 ${
                activeTab !== 'content' 
                  ? 'opacity-0 pointer-events-none' 
                  : saving 
                    ? 'bg-zinc-800 text-white cursor-wait opacity-80' 
                    : successMsg 
                      ? 'bg-green-600 text-white scale-105' 
                      : error 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : successMsg ? (
                <Check className="w-4 h-4 mr-2" />
              ) : error ? (
                <AlertCircle className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Salvando...' : successMsg ? 'Salvo!' : error ? 'Erro!' : 'Salvar Alterações'}
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
          <p className="text-gray-400">Gerencie o conteúdo, leads e acessos do site.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'content' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4 inline-block mr-2" />
            Conteúdo
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'leads' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <MessageSquare className="w-4 h-4 inline-block mr-2" />
            Leads
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'admins' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            Acessos
          </button>
        </div>

        {activeTab === 'content' && (
          <div className="space-y-8">
          {/* Configurações */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4 text-red-400">Configurações de Acesso</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Senha do Painel</label>
                <input 
                  type="text"
                  name="adminPassword"
                  value={content.adminPassword}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">Esta senha é usada para acessar o Dashboard e o Analytics.</p>
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4">Seção Hero</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Título Principal</label>
                <textarea 
                  name="heroTitle"
                  value={content.heroTitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Subtítulo</label>
                <textarea 
                  name="heroSubtitle"
                  value={content.heroSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Vídeo de Fundo (URL)</label>
                <input 
                  type="text"
                  name="heroVideoUrl"
                  value={content.heroVideoUrl || ''}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                  placeholder="/videowork.mp4 ou link externo"
                />
                <p className="text-[10px] text-gray-500 mt-2 italic">Dica: Use /videowork.mp4 para o vídeo padrão enviado ou um link direto de vídeo MP4.</p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4">Seção Sobre</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Título</label>
                <input 
                  type="text"
                  name="aboutTitle"
                  value={content.aboutTitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Texto</label>
                <textarea 
                  name="aboutText"
                  value={content.aboutText}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Link da Imagem Lateral</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden">
                    <img src={content.aboutImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <input 
                    type="text"
                    name="aboutImage"
                    value={content.aboutImage || ''}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Other Subtitles */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4">Subtítulos das Seções</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Serviços</label>
                <textarea 
                  name="servicesSubtitle"
                  value={content.servicesSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Processo</label>
                <textarea 
                  name="processSubtitle"
                  value={content.processSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Portfólio</label>
                <textarea 
                  name="portfolioSubtitle"
                  value={content.portfolioSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Contato</label>
                <textarea 
                  name="contactSubtitle"
                  value={content.contactSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">FAQ</label>
                <textarea 
                  name="faqSubtitle"
                  value={content.faqSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Pacotes</label>
                <textarea 
                  name="packagesSubtitle"
                  value={content.packagesSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">ROI (Análise de Risco)</label>
                <textarea 
                  name="roiSubtitle"
                  value={content.roiSubtitle}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Serviços */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold">Serviços (Cards)</h2>
              <button 
                onClick={addService}
                className="text-xs font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 flex items-center transition-colors"
              >
                <Plus className="w-3 h-3 mr-2" /> Adicionar Serviço
              </button>
            </div>
            <div className="space-y-8">
              {content.services.map((service, index) => (
                <div key={index} className={`p-4 border ${service.active === false ? 'border-red-500/20 opacity-60' : 'border-white/5'} bg-black relative group`}>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => removeService(index)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      title="Excluir Serviço"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider flex items-center">
                    Serviço {index + 1}
                    {service.active === false && <span className="ml-2 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Inativo</span>}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Ícone do Serviço</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-zinc-950 border border-white/10 mb-4">
                        {ICON_LIST.map((iconName) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => handleServiceChange(index, 'iconName', iconName)}
                            className={`p-2 rounded transition-colors ${service.iconName === iconName ? 'bg-white text-black' : 'hover:bg-white/5 text-gray-400'}`}
                            title={iconName}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              {/* @ts-ignore */}
                              {React.isValidElement(getIcon(iconName)) ? React.cloneElement(getIcon(iconName) as React.ReactElement, { className: 'w-5 h-5' }) : null}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Título</label>
                      <input 
                        type="text"
                        value={service.title}
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Descrição</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Preço</label>
                      <input 
                        type="text"
                        value={service.price}
                        onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">O que está incluído (um por linha)</label>
                      <textarea 
                        value={service.includedItems?.join('\n') || ''}
                        onChange={(e) => handleServiceChange(index, 'includedItems', e.target.value.split('\n').filter(line => line.trim() !== ''))}
                        placeholder="Ex: Entrega em 5 dias&#10;Suporte 24h&#10;Design Responsivo"
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <input 
                          type="checkbox"
                          id={`promo-${index}`}
                          checked={service.promo || false}
                          onChange={(e) => handleServiceChange(index, 'promo', e.target.checked)}
                          className="w-4 h-4 bg-zinc-950 border border-white/10 rounded focus:ring-0 focus:ring-offset-0"
                        />
                        <label htmlFor={`promo-${index}`} className="ml-2 text-xs uppercase tracking-widest text-gray-500 cursor-pointer">Em Promoção</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox"
                          id={`active-${index}`}
                          checked={service.active !== false}
                          onChange={(e) => handleServiceChange(index, 'active', e.target.checked)}
                          className="w-4 h-4 bg-zinc-950 border border-white/10 rounded focus:ring-0 focus:ring-offset-0"
                        />
                        <label htmlFor={`active-${index}`} className="ml-2 text-xs uppercase tracking-widest text-gray-500 cursor-pointer">Ativo no Site</label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Parceiros Management */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold">Nossos Parceiros</h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 mr-3">Exibir Seção</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={content.showPartners}
                      onChange={(e) => setContent(prev => ({ ...prev, showPartners: e.target.checked }))}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${content.showPartners ? 'bg-white' : 'bg-zinc-800'}`}></div>
                    <div className={`absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${content.showPartners ? 'translate-x-4' : ''}`}></div>
                  </div>
                </label>
                <button 
                  onClick={addPartner}
                  className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 flex items-center transition-colors"
                >
                  <Plus className="w-3 h-3 mr-2" /> Adicionar Parceria
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.partners?.map((item: any, idx: number) => (
                <div key={idx} className="bg-black border border-white/5 p-4 relative group">
                  <button 
                    onClick={() => removePartner(idx)}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Nome do Parceiro</label>
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => handlePartnerChange(idx, 'name', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Logo URL (Preview abaixo)</label>
                      <input 
                        type="text" 
                        value={item.logo}
                        onChange={(e) => handlePartnerChange(idx, 'logo', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                      <div className="mt-4 h-12 flex items-center justify-center bg-zinc-900 border border-white/5 overflow-hidden">
                        {item.logo ? (
                          <img src={item.logo} alt="Preview" className="h-8 object-contain grayscale opacity-50" />
                        ) : (
                          <span className="text-[10px] text-gray-600">Sem logo</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!content.partners || content.partners.length === 0) && (
                <div className="md:col-span-2 py-8 text-center border border-dashed border-white/10 text-gray-600 text-sm">
                  Nenhum parceiro adicionado. Use o botão acima para adicionar.
                </div>
              )}
            </div>
          </section>

          {/* FAQ Management */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold">Perguntas Frequentes (FAQ)</h2>
              <button 
                onClick={addFAQItem}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 flex items-center transition-colors"
              >
                <Plus className="w-3 h-3 mr-2" /> Adicionar Pergunta
              </button>
            </div>
            
            <div className="space-y-4">
              {content.faqs?.map((faq: any, idx: number) => (
                <div key={idx} className="bg-black border border-white/5 p-4 relative group">
                  <button 
                    onClick={() => removeFAQItem(idx)}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Pergunta</label>
                      <input 
                        type="text" 
                        value={faq.question}
                        onChange={(e) => handleFAQChange(idx, 'question', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Resposta</label>
                      <textarea 
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(idx, 'answer', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!content.faqs || content.faqs.length === 0) && (
                <div className="py-8 text-center border border-dashed border-white/10 text-gray-600 text-sm">
                  Nenhuma pergunta adicionada ainda.
                </div>
              )}
            </div>
          </section>

          {/* Testimonial Management */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold">O que dizem sobre nós (Depoimentos)</h2>
              <button 
                onClick={addTestimonial}
                className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 flex items-center transition-colors"
              >
                <Plus className="w-3 h-3 mr-2" /> Adicionar Depoimento
              </button>
            </div>
            
            <div className="space-y-6">
              {content.testimonials?.map((testimonial: any, idx: number) => (
                <div key={idx} className="bg-black border border-white/5 p-4 relative group">
                  <button 
                    onClick={() => removeTestimonial(idx)}
                    className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Nome do Cliente</label>
                        <input 
                          type="text" 
                          value={testimonial.name}
                          onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Cargo / Empresa</label>
                        <input 
                          type="text" 
                          value={testimonial.role}
                          onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Nota (1 a 5 estrelas)</label>
                        <select 
                          value={testimonial.rating || 5}
                          onChange={(e) => handleTestimonialChange(idx, 'rating', parseInt(e.target.value))}
                          className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                        >
                          <option value="1">1 Estrela</option>
                          <option value="2">2 Estrelas</option>
                          <option value="3">3 Estrelas</option>
                          <option value="4">4 Estrelas</option>
                          <option value="5">5 Estrelas</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Avatar URL</label>
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 flex-shrink-0 bg-zinc-900 border border-white/5 overflow-hidden rounded-full">
                            <img src={testimonial.avatar} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <input 
                            type="text" 
                            value={testimonial.avatar}
                            onChange={(e) => handleTestimonialChange(idx, 'avatar', e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Depoimento</label>
                        <textarea 
                          value={testimonial.content}
                          onChange={(e) => handleTestimonialChange(idx, 'content', e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!content.testimonials || content.testimonials.length === 0) && (
                <div className="py-8 text-center border border-dashed border-white/10 text-gray-600 text-sm">
                  Nenhum depoimento adicionado.
                </div>
              )}
            </div>
          </section>

          {/* Portfólio Management */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4">Trabalhos Recentes (Portfólio)</h2>
            
            <div className="space-y-12">
              {/* Sites category */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Sites & Sistemas</h3>
                  <button 
                    onClick={() => addPortfolioItem('portfolioSites')}
                    className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 flex items-center transition-colors"
                  >
                    <Plus className="w-3 h-3 mr-2" /> Adicionar Site
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {content.portfolioSites?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-black border border-white/5 p-4 relative group">
                      <button 
                        onClick={() => removePortfolioItem('portfolioSites', idx)}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Título do trabalho</label>
                          <input 
                            type="text" 
                            value={item.title}
                            onChange={(e) => handlePortfolioChange('portfolioSites', idx, 'title', e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Link da imagem</label>
                          <input 
                            type="text" 
                            value={item.img}
                            onChange={(e) => handlePortfolioChange('portfolioSites', idx, 'img', e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logos category */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Identidade Visual & Logos</h3>
                  <button 
                    onClick={() => addPortfolioItem('portfolioLogos')}
                    className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 flex items-center transition-colors"
                  >
                    <Plus className="w-3 h-3 mr-2" /> Adicionar Logo
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {content.portfolioLogos?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-black border border-white/5 p-4 relative group">
                      <button 
                        onClick={() => removePortfolioItem('portfolioLogos', idx)}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Título do trabalho</label>
                          <input 
                            type="text" 
                            value={item.title}
                            onChange={(e) => handlePortfolioChange('portfolioLogos', idx, 'title', e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Link da imagem</label>
                          <input 
                            type="text" 
                            value={item.img}
                            onChange={(e) => handlePortfolioChange('portfolioLogos', idx, 'img', e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts category */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Social Media & Posts</h3>
                  <button 
                    onClick={() => addPortfolioItem('portfolioPosts')}
                    className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 flex items-center transition-colors"
                  >
                    <Plus className="w-3 h-3 mr-2" /> Adicionar Post
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {content.portfolioPosts?.map((item: any, idx: number) => (
                    <div key={idx} className="bg-black border border-white/5 p-4 relative group">
                      <button 
                        onClick={() => removePortfolioItem('portfolioPosts', idx)}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Título do trabalho</label>
                          <input 
                            type="text" 
                            value={item.title}
                            onChange={(e) => handlePortfolioChange('portfolioPosts', idx, 'title', e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Link da imagem</label>
                          <input 
                            type="text" 
                            value={item.img}
                            onChange={(e) => handlePortfolioChange('portfolioPosts', idx, 'img', e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 p-2 text-white text-sm focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Pacotes */}
          <section className="bg-zinc-950 border border-white/10 p-6">
            <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4">Pacotes de Aceleração</h2>
            <div className="space-y-8">
              {content.packages.map((pkg, index) => (
                <div key={index} className="p-4 border border-white/5 bg-black">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Pacote {index + 1}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Título</label>
                      <input 
                        type="text"
                        value={pkg.title}
                        onChange={(e) => handlePackageChange(index, 'title', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Descrição</label>
                      <textarea 
                        value={pkg.description}
                        onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Preço Principal</label>
                        <input 
                          type="text"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(index, 'price', e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Parcelamento</label>
                        <input 
                          type="text"
                          value={pkg.installments}
                          onChange={(e) => handlePackageChange(index, 'installments', e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Prazo de Entrega</label>
                      <input 
                        type="text"
                        value={pkg.deliveryTime}
                        onChange={(e) => handlePackageChange(index, 'deliveryTime', e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Itens de Bônus / Gratuidade (um por linha)</label>
                      <textarea 
                        value={pkg.bonusItems?.join('\n') || ''}
                        onChange={(e) => handlePackageChange(index, 'bonusItems', e.target.value.split('\n').filter(line => line.trim() !== ''))}
                        placeholder="Ex: 1 Logo Grátis&#10;Consultoria de 30min&#10;Hospedagem por 1 mês"
                        className="w-full bg-zinc-950 border border-white/10 p-3 text-white focus:outline-none focus:border-white transition-colors min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            <section className="bg-zinc-950 border border-white/10 p-6">
              <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" /> Contatos Recebidos
              </h2>
              {leads.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum contato recebido ainda.</p>
              ) : (
                <div className="space-y-4">
                  {leads.map(lead => (
                    <div key={lead.id} className="p-4 border border-white/5 bg-black relative group">
                      <button 
                        onClick={() => handleDeleteLead(lead.id)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Nome</p>
                          <p className="font-bold">{lead.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Data</p>
                          <p className="text-gray-300">
                            {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString('pt-BR') : 'Data desconhecida'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
                          <a href={`mailto:${lead.email}`} className="text-blue-400 hover:underline">{lead.email}</a>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Telefone</p>
                          <p className="text-gray-300">{lead.phone || 'Não informado'}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Mensagem</p>
                        <p className="text-gray-300 whitespace-pre-wrap">{lead.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="space-y-6">
            <section className="bg-zinc-950 border border-white/10 p-6">
              <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" /> Administradores
              </h2>
              
              <form onSubmit={handleAddAdmin} className="flex gap-4 mb-8">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Email do novo administrador"
                  className="flex-1 bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                  required
                />
                <button 
                  type="submit"
                  className="bg-white text-black px-6 py-3 font-bold hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar
                </button>
              </form>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 border border-white/5 bg-black">
                  <div>
                    <p className="font-bold">jvssilv4@gmail.com</p>
                    <p className="text-xs text-green-400 mt-1">Admin Principal</p>
                  </div>
                </div>
                {admins.filter(a => a.email !== 'jvssilv4@gmail.com').map(admin => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border border-white/5 bg-black">
                    <div>
                      <p className="font-bold">{admin.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Adicionado em: {admin.addedAt?.toDate ? admin.addedAt.toDate().toLocaleDateString('pt-BR') : ''}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveAdmin(admin.email)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-2"
                      title="Remover acesso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-6 text-center bg-red-400/10 p-3 rounded">{error}</p>}
        {successMsg && <p className="text-green-400 text-sm mt-6 text-center bg-green-400/10 p-3 rounded">{successMsg}</p>}
      </main>
    </div>
  );
}
