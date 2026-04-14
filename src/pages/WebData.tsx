import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, MousePointerClick, Clock, ArrowLeft, Lock, Activity, 
  Globe, Smartphone, Monitor, ChevronRight, ArrowUp, Eye, EyeOff
} from 'lucide-react';
import { collection, getDocs, query, where, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LayoutDashboard, Calendar } from 'lucide-react';

const AdminNav = () => (
  <div className="flex space-x-6 mr-8 border-r border-white/10 pr-8">
    <a href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center">
      <LayoutDashboard className="w-4 h-4 mr-2" /> Conteúdo
    </a>
    <a href="/webdata" className="text-sm font-bold text-white flex items-center">
      <Activity className="w-4 h-4 mr-2" /> Analytics
    </a>
  </div>
);

const mockVisitsData = [
  { name: 'Seg', visitas: 120 },
  { name: 'Ter', visitas: 150 },
  { name: 'Qua', visitas: 180 },
  { name: 'Qui', visitas: 140 },
  { name: 'Sex', visitas: 210 },
  { name: 'Sáb', visitas: 250 },
  { name: 'Dom', visitas: 190 },
];

const mockTrafficSource = [
  { name: 'Instagram', value: 45 },
  { name: 'Google (Orgânico)', value: 30 },
  { name: 'Tráfego Direto', value: 15 },
  { name: 'LinkedIn', value: 10 },
];

const mockTopButtons = [
  { name: 'Solicitar Orçamento (WhatsApp)', clicks: 145 },
  { name: 'Quero este pacote (Aceleração)', clicks: 89 },
  { name: 'Enviar Mensagem (Formulário)', clicks: 56 },
  { name: 'Ver Serviços', clicks: 42 },
];

export default function WebData() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'year'>('7days');

  // Data states
  const [visitsToday, setVisitsToday] = useState(0);
  const [visitsWeek, setVisitsWeek] = useState(0);
  const [visitsMonth, setVisitsMonth] = useState(0);
  const [avgDuration, setAvgDuration] = useState('0m 0s');
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [topButtons, setTopButtons] = useState<any[]>([]);
  const [topSections, setTopSections] = useState<string[]>([]);
  
  const [mobilePercent, setMobilePercent] = useState(0);
  const [desktopPercent, setDesktopPercent] = useState(0);
  const [adminPassword, setAdminPassword] = useState('encoded123');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const startDate = new Date();
        if (dateFilter === 'today') startDate.setHours(0, 0, 0, 0);
        else if (dateFilter === '7days') startDate.setDate(startDate.getDate() - 7);
        else if (dateFilter === '30days') startDate.setDate(startDate.getDate() - 30);
        else if (dateFilter === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
        
        const qEvents = query(
          collection(db, 'analytics_events'), 
          where('timestamp', '>=', Timestamp.fromDate(startDate))
        );
        
        const snap = await getDocs(qEvents);
        const events = snap.docs.map(d => d.data());

        // Processing
        const now = new Date();
        const todayStr = now.toDateString();
        
        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            dateStr: d.toDateString(),
            name: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
            visitas: 0
          };
        });

        let vToday = 0;
        let vWeek = 0;
        let vMonth = 0;
        let totalDuration = 0;
        let durationCount = 0;
        let mobileCount = 0;
        let desktopCount = 0;
        const sourcesCount: Record<string, number> = {};
        const clickCounts: Record<string, number> = {};
        const sectionCounts: Record<string, number> = {};

        events.forEach(ev => {
          let date = new Date();
          if (ev.timestamp && typeof ev.timestamp.toDate === 'function') {
            date = ev.timestamp.toDate();
          } else if (ev.timestamp) {
            date = new Date(ev.timestamp);
          }
          
          const dateStr = date.toDateString();

          if (ev.type === 'page_view') {
            if (dateStr === todayStr) vToday++;
            if ((now.getTime() - date.getTime()) <= 7 * 24 * 60 * 60 * 1000) vWeek++;
            if ((now.getTime() - date.getTime()) <= 30 * 24 * 60 * 60 * 1000) vMonth++;

            // Only add to chart if it's within the 7 days array
            const chartDay = last7Days.find(d => d.dateStr === dateStr);
            if (chartDay) chartDay.visitas++;

            if (ev.duration > 0) {
              totalDuration += ev.duration;
              durationCount++;
            }

            if (ev.isMobile) mobileCount++;
            else desktopCount++;

            let sourceName = 'Direto';
            if (ev.referrer) {
              if (ev.referrer.includes('instagram')) sourceName = 'Instagram';
              else if (ev.referrer.includes('google')) sourceName = 'Google';
              else if (ev.referrer.includes('linkedin')) sourceName = 'LinkedIn';
              else if (ev.referrer !== 'Direto' && ev.referrer !== '') sourceName = 'Outros';
            }
            sourcesCount[sourceName] = (sourcesCount[sourceName] || 0) + 1;
          } else if (ev.type === 'button_click') {
            clickCounts[ev.buttonName] = (clickCounts[ev.buttonName] || 0) + 1;
          } else if (ev.type === 'section_view') {
            sectionCounts[ev.sectionName] = (sectionCounts[ev.sectionName] || 0) + 1;
          }
        });

        setVisitsToday(vToday);
        setVisitsWeek(vWeek);
        setVisitsMonth(vMonth);

        const avgSecs = durationCount > 0 ? Math.floor(totalDuration / durationCount) : 0;
        setAvgDuration(`${Math.floor(avgSecs / 60)}m ${avgSecs % 60}s`);

        setChartData(last7Days);

        const totalSources = Object.values(sourcesCount).reduce((a,b) => a+b, 0);
        setTrafficSources(Object.entries(sourcesCount).map(([name, count]) => ({
          name,
          value: totalSources > 0 ? Math.round((count / totalSources) * 100) : 0
        })).sort((a,b) => b.value - a.value));

        const totalDevices = mobileCount + desktopCount;
        setMobilePercent(totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0);
        setDesktopPercent(totalDevices > 0 ? Math.round((desktopCount / totalDevices) * 100) : 0);

        setTopButtons(Object.entries(clickCounts)
          .map(([name, clicks]) => ({ name, clicks }))
          .sort((a,b) => b.clicks - a.clicks)
          .slice(0, 4));

        setTopSections(Object.entries(sectionCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a,b) => b.count - a.count)
          .slice(0, 4)
          .map(s => s.name.charAt(0).toUpperCase() + s.name.slice(1)));

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dateFilter]);

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
            Faça login com sua conta Google autorizada para acessar os insights do site.
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-20">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-xl tracking-tighter mr-4">ENCODED<span className="text-gray-500">.</span></span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="ml-4 font-medium text-sm tracking-widest uppercase text-gray-300 flex items-center">
              <Activity className="w-4 h-4 mr-2" /> Web Analytics
            </span>
          </div>
          <div className="flex items-center">
            <AdminNav />
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
              Sair <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
            <p className="text-gray-400">Acompanhe o desempenho e o engajamento do seu site.</p>
          </div>
          <div className="flex items-center bg-zinc-950 border border-white/10 p-1 rounded">
            <Calendar className="w-4 h-4 text-gray-400 ml-3 mr-2" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="bg-transparent text-sm text-white focus:outline-none py-2 pr-4 cursor-pointer"
            >
              <option value="today" className="bg-zinc-900">Hoje</option>
              <option value="7days" className="bg-zinc-900">Últimos 7 dias</option>
              <option value="30days" className="bg-zinc-900">Últimos 30 dias</option>
              <option value="year" className="bg-zinc-900">Este Ano</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Visitas Hoje</p>
                <h3 className="text-3xl font-bold">{loading ? '...' : visitsToday}</h3>
              </div>
              <div className="p-2 bg-white/5 rounded">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-green-400 text-sm flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" /> Atualizado hoje
            </p>
          </div>

          <div className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Visitas (Semana)</p>
                <h3 className="text-3xl font-bold">{loading ? '...' : visitsWeek}</h3>
              </div>
              <div className="p-2 bg-white/5 rounded">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-green-400 text-sm flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" /> Últimos 7 dias
            </p>
          </div>

          <div className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Visitas (Mês)</p>
                <h3 className="text-3xl font-bold">{loading ? '...' : visitsMonth}</h3>
              </div>
              <div className="p-2 bg-white/5 rounded">
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm flex items-center">
              Últimos 30 dias
            </p>
          </div>

          <div className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Tempo Médio</p>
                <h3 className="text-3xl font-bold">{loading ? '...' : avgDuration}</h3>
              </div>
              <div className="p-2 bg-white/5 rounded">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm flex items-center">
              Média por sessão
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-zinc-950 border border-white/10 p-4 sm:p-6 overflow-hidden">
            <h3 className="text-lg font-bold mb-6">Tráfego nos Últimos 7 Dias</h3>
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888" 
                    tick={{fill: '#888', fontSize: 12}} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#888" 
                    tick={{fill: '#888', fontSize: 12}} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                  />
                  <Tooltip 
                    cursor={{fill: '#ffffff10'}}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-zinc-900 border border-white/20 p-3 shadow-xl rounded-md">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
                            <p className="text-white font-bold text-lg">
                              {payload[0].value} <span className="text-sm font-normal text-gray-400">visitas</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="visitas" fill="#fff" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-zinc-950 border border-white/10 p-6">
            <h3 className="text-lg font-bold mb-6">Origem dos Visitantes</h3>
            <div className="space-y-6">
              {trafficSources.length > 0 ? trafficSources.map((source, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">{source.name}</span>
                    <span className="font-bold">{source.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full" 
                      style={{ width: `${source.value}%` }}
                    ></div>
                  </div>
                </div>
              )) : <p className="text-gray-500 text-sm">Nenhum dado de tráfego ainda.</p>}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
              <div className="flex items-center"><Smartphone className="w-4 h-4 mr-2" /> {mobilePercent}% Mobile</div>
              <div className="flex items-center"><Monitor className="w-4 h-4 mr-2" /> {desktopPercent}% Desktop</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Top Buttons */}
          <div className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex items-center mb-6">
              <MousePointerClick className="w-5 h-5 mr-3 text-gray-400" />
              <h3 className="text-lg font-bold">Botões Mais Clicados</h3>
            </div>
            <div className="space-y-4">
              {topButtons.length > 0 ? topButtons.map((btn, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black border border-white/5 hover:border-white/20 transition-colors">
                  <span className="text-sm font-medium text-gray-300">{btn.name}</span>
                  <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full">{btn.clicks} clicks</span>
                </div>
              )) : <p className="text-gray-500 text-sm">Nenhum clique registrado ainda.</p>}
            </div>
          </div>

          {/* Top Sections */}
          <div className="bg-zinc-950 border border-white/10 p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-5 h-5 mr-3 text-gray-400" />
              <h3 className="text-lg font-bold">Seções Mais Vistas</h3>
            </div>
            <div className="space-y-4">
              {topSections.length > 0 ? topSections.map((section, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center">
                    <span className="text-gray-500 font-mono mr-4">0{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-300">{section}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              )) : <p className="text-gray-500 text-sm">Nenhuma visualização de seção ainda.</p>}
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Os dados apresentados são atualizados em tempo real.</p>
          <p className="mt-1">Para métricas mais detalhadas, acesse o painel do Google Analytics.</p>
        </div>
      </main>
    </div>
  );
}
