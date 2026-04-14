import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Lock, Save, LogOut, ArrowLeft, Loader2, LayoutDashboard, Activity, Eye, EyeOff } from 'lucide-react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
      { title: "Sites Personalizados", description: "Presença digital profissional e otimizada para conversão.", price: "A partir de R$ 150" },
      { title: "Sistemas Completos", description: "Soluções sob medida para automatizar e otimizar seus processos.", price: "Preço sob consulta" },
      { title: "Identidade Visual", description: "Marcas fortes, memoráveis e alinhadas com seu propósito.", price: "A partir de R$ 500" },
      { title: "Social Media", description: "Gestão estratégica de redes sociais para gerar autoridade.", price: "A partir de R$ 800/mês" },
      { title: "Tráfego Pago", description: "Anúncios otimizados no Google e Meta Ads para atrair clientes.", price: "A partir de R$ 600/mês" },
      { title: "Consultoria", description: "Diagnóstico e plano de ação para escalar seu negócio digital.", price: "R$ 350 / sessão" }
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
    fetchContent();
    if (localStorage.getItem('encoded_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === content.adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('encoded_admin_auth', 'true');
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    localStorage.removeItem('encoded_admin_auth');
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

  const handleServiceChange = (index: number, field: string, value: string) => {
    const newServices = [...content.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setContent(prev => ({ ...prev, services: newServices }));
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

  if (!isAuthenticated) {
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
          <h1 className="text-2xl font-bold text-center mb-2">Painel Administrativo</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Insira a senha de administrador para gerenciar os textos do site.
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Senha de acesso"
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-center tracking-widest pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200 transition-colors"
            >
              Acessar Dashboard
            </button>
          </form>
          
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
              disabled={saving}
              className="bg-white text-black px-4 py-2 rounded text-sm font-bold flex items-center hover:bg-gray-200 transition-colors disabled:opacity-50 mr-4"
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
          <h1 className="text-3xl font-bold mb-2">Gerenciar Conteúdo</h1>
          <p className="text-gray-400">Altere os textos principais das seções do site.</p>
        </div>

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
            <h2 className="text-lg font-bold mb-6 border-b border-white/5 pb-4">Serviços (Cards)</h2>
            <div className="space-y-8">
              {content.services.map((service, index) => (
                <div key={index} className="p-4 border border-white/5 bg-black">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Serviço {index + 1}</h3>
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

        {error && <p className="text-red-400 text-sm mt-6 text-center bg-red-400/10 p-3 rounded">{error}</p>}
        {successMsg && <p className="text-green-400 text-sm mt-6 text-center bg-green-400/10 p-3 rounded">{successMsg}</p>}
      </main>
    </div>
  );
}
