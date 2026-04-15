import React, { useState, useEffect } from 'react';
import { db, auth, googleProvider } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Lock, Save, LogOut, ArrowLeft, Loader2, LayoutDashboard, Activity, Users, MessageSquare, Trash2, Plus } from 'lucide-react';

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
    servicesSubtitle: 'Soluções completas de ponta a ponta. Do design estratégico ao desenvolvimento de sistemas complexos.',
    processSubtitle: 'Transparência e previsibilidade do primeiro contato ao lançamento. Sem surpresas, apenas resultados.',
    portfolioSubtitle: 'Um vislumbre do que construímos para marcas que confiam na ENCODED.',
    contactSubtitle: 'Preencha o formulário ao lado ou entre em contato diretamente pelos nossos canais. Nossa equipe retornará o mais breve possível com uma proposta customizada.',
    faqSubtitle: 'Tire suas dúvidas e entenda como podemos ajudar o seu negócio a crescer.',
    packagesSubtitle: 'Escolha a solução ideal para colocar sua empresa em um novo patamar agora.',
    services: [
      { title: "Sites Personalizados", description: "Presença digital profissional e otimizada para conversão.", price: "A partir de R$ 150", promo: true, active: true },
      { title: "Sistemas Completos", description: "Soluções sob medida para automatizar e otimizar seus processos.", price: "Preço sob consulta", active: true },
      { title: "Posts para Redes Sociais", description: "Design estratégico que comunica o valor da sua marca.", price: "A partir de R$ 10", promo: true, active: true },
      { title: "Carrossel 5 slides", description: "Conteúdo denso e engajador para o seu Instagram/LinkedIn.", price: "A partir de R$ 20", promo: true, active: true },
      { title: "Identidade Visual", description: "Marcas fortes, memoráveis e alinhadas com seu propósito.", price: "A partir de R$ 500", active: true },
      { title: "Consultoria", description: "Diagnóstico e plano de ação para escalar seu negócio digital.", price: "R$ 350 / sessão", active: true }
    ],
    packages: [
      {
        title: "Presença Digital Express",
        description: "Ideal para quem precisa de uma presença profissional imediata com baixo investimento.",
        price: "R$ 442,00",
        installments: "ou 12x de R$ 36,83",
        deliveryTime: "3 dias úteis"
      },
      {
        title: "Aceleração Profissional",
        description: "A solução completa para empresas que querem vender mais e ter controle total do seu site.",
        price: "R$ 997,00",
        installments: "ou 12x de R$ 83,08",
        deliveryTime: "8 dias úteis"
      },
      {
        title: "Ecossistema Digital Premium",
        description: "Projeto robusto para empresas que buscam liderança de mercado e automação total.",
        price: "R$ 3.497,00",
        installments: "ou 12x de R$ 291,41",
        deliveryTime: "Sob consulta"
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
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      await setDoc(doc(db, 'site_content', CONTENT_ID), content);
      setSuccessMsg('Conteúdo salvo com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Erro ao salvar conteúdo.');
      console.error(err);
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
      promo: false
    };
    setContent(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const removeService = (index: number) => {
    if (window.confirm('Deseja realmente excluir este serviço?')) {
      const newServices = content.services.filter((_, i) => i !== index);
      setContent(prev => ({ ...prev, services: newServices }));
    }
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    const newPackages = [...content.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setContent(prev => ({ ...prev, packages: newPackages }));
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
    <div className="min-h-screen bg-black text-white pb-20">
      <header className="bg-zinc-950 border-b border-white/10 sticky top-0 z-50">
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
              className={`bg-white text-black px-4 py-2 rounded text-sm font-bold flex items-center transition-colors mr-4 ${activeTab !== 'content' ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-200 disabled:opacity-50'}`}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar Alterações
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
