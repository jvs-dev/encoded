import React, { useState, useMemo, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminNav } from '../components/layout/AdminNav';
import { 
  Building2, 
  MapPin, 
  Search, 
  Phone, 
  Filter, 
  Users, 
  Briefcase, 
  ArrowLeft,
  ExternalLink,
  Plus,
  LayoutDashboard,
  Activity,
  Sparkles,
  Loader2,
  Trash2,
  Edit3,
  X,
  Save,
  CheckCircle2,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, auth, googleProvider } from '../firebase';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { GoogleGenAI, Type } from "@google/genai";

// Types
enum ProspectStatus {
  Novo = "Novo",
  Contatado = "Contatado",
  Interessado = "Interessado",
  Convertido = "Convertido",
  Recusado = "Recusado"
}

interface ProspectData {
  id: string;
  name: string;
  region: string;
  sector: string;
  size: string;
  phone: string;
  website?: string;
  maps_url?: string;
  status: ProspectStatus;
  notes?: string;
  createdAt: Timestamp;
}

export default function Prospect() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [prospects, setProspects] = useState<ProspectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'crm' | 'discovery'>('crm');
  const [discoveredLeads, setDiscoveredLeads] = useState<any[]>([]);
  const [discoveryQuery, setDiscoveryQuery] = useState('');
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Filters
  const [filterRegion, setFilterRegion] = useState('Todas');
  const [filterSector, setFilterSector] = useState('Todos');
  const [filterSize, setFilterSize] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Discovery Specific Filters
  const [discoverySize, setDiscoverySize] = useState('Todos');
  const [discoveryPopularity, setDiscoveryPopularity] = useState('Todas');
  const [discoveryHasWebsite, setDiscoveryHasWebsite] = useState('Tanto faz');
  
  // Pagination State
  const [currentPageCRM, setCurrentPageCRM] = useState(1);
  const [currentPageDiscovery, setCurrentPageDiscovery] = useState(1);
  const pageSizeCRM = 12;
  const pageSizeDiscovery = 20;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    region: 'Sudeste',
    sector: 'Tecnologia',
    size: 'Média',
    phone: '',
    website: '',
    status: ProspectStatus.Novo,
    notes: ''
  });

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPageCRM(1);
  }, [filterRegion, filterSector, filterSize, searchTerm]);

  useEffect(() => {
    setCurrentPageDiscovery(1);
  }, [discoveryQuery]);

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Verify if user is admin
        const isAllowed = currentUser.email === "jvssilv4@gmail.com";
        setIsAdminUser(isAllowed);
      } else {
        setIsAdminUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
    }
  }

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError(`Erro (${operationType}): ${error instanceof Error ? error.message : 'Permissão insuficiente'}`);
  };

  const handleLogin = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Falha ao autenticar.');
      console.error(err);
    }
  };

  const handleLogout = () => signOut(auth);

  // Load Prospects
  useEffect(() => {
    if (!user || !isAdminUser) {
      if (!loading) setLoading(false);
      return;
    }

    const q = query(collection(db, 'prospects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProspectData[];
      setProspects(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'prospects');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAdminUser]);

  // Filter Logic
  const regions = ['Todas', 'Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'];
  const sectors = ['Todos', 'Tecnologia', 'Varejo', 'Indústria', 'Saúde', 'Educação', 'Agronegócio', 'Logística', 'Construção', 'Serviços'];
  const sizes = ['Todos', 'Pequena', 'Média', 'Grande'];

  const filteredCompanies = useMemo(() => {
    return prospects.filter(company => {
      const matchRegion = filterRegion === 'Todas' || company.region === filterRegion;
      const matchSector = filterSector === 'Todos' || company.sector === filterSector;
      const matchSize = filterSize === 'Todos' || company.size === filterSize;
      const matchStatus = filterStatus === 'Todos' || company.status === filterStatus;
      const matchSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRegion && matchSector && matchSize && matchStatus && matchSearch;
    });
  }, [prospects, filterRegion, filterSector, filterSize, filterStatus, searchTerm]);

  const paginatedCRM = useMemo(() => {
    const start = (currentPageCRM - 1) * pageSizeCRM;
    return filteredCompanies.slice(start, start + pageSizeCRM);
  }, [filteredCompanies, currentPageCRM]);

  const totalPagesCRM = Math.ceil(filteredCompanies.length / pageSizeCRM);

  const paginatedDiscovery = useMemo(() => {
    const start = (currentPageDiscovery - 1) * pageSizeDiscovery;
    return discoveredLeads.slice(start, start + pageSizeDiscovery);
  }, [discoveredLeads, currentPageDiscovery]);

  const totalPagesDiscovery = Math.ceil(discoveredLeads.length / pageSizeDiscovery);

  // Actions
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'prospects', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'prospects'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      alert("Erro ao salvar prospect.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'prospects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prospects/${id}`);
    }
  };

  const handleEdit = (prospect: ProspectData) => {
    setFormData({
      name: prospect.name,
      region: prospect.region,
      sector: prospect.sector,
      size: prospect.size,
      phone: prospect.phone,
      website: prospect.website || '',
      maps_url: prospect.maps_url || '',
      status: prospect.status,
      notes: prospect.notes || ''
    });
    setEditingId(prospect.id);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      region: 'Sudeste',
      sector: 'Tecnologia',
      size: 'Média',
      phone: '',
      website: '',
      maps_url: '',
      status: ProspectStatus.Novo,
      notes: ''
    });
    setEditingId(null);
  };

  const toggleSelectProspect = (id: string) => {
    setSelectedProspects(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (newStatus: ProspectStatus) => {
    if (selectedProspects.length === 0) return;
    setIsBulkUpdating(true);
    try {
      const promises = selectedProspects.map(id => 
        updateDoc(doc(db, 'prospects', id), {
          status: newStatus,
          updatedAt: serverTimestamp()
        })
      );
      await Promise.all(promises);
      setSelectedProspects([]);
      alert(`${selectedProspects.length} prospects atualizados para ${newStatus}.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'prospects/bulk');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const exportSelectionToCsv = () => {
    if (selectedProspects.length === 0) return;
    
    const selectedData = filteredCompanies.filter(p => selectedProspects.includes(p.id));
    const headers = ['Nome', 'Status', 'Região', 'Setor', 'Tamanho', 'Telefone', 'Website', 'Notas'];
    const csvRows = selectedData.map(p => [
      p.name,
      p.status,
      p.region,
      p.sector,
      p.size,
      p.phone,
      p.website || '',
      (p.notes || '').replace(/\n/g, ' ')
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + csvRows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `prospects_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI Generation / Lead Discovery
  const handleDiscovery = async () => {
    if (!discoveryQuery.trim()) return;
    setIsAiLoading(true);
    setDiscoveredLeads([]);
    setGroundingLinks([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Use Google Maps grounding to find real local businesses
      const prompt = `Busque pelo menos 50 empresas reais do setor "${discoveryQuery}" na região "${filterRegion === 'Todas' ? 'Brasil' : filterRegion}". 
      Critérios de Filtro Aplicados:
      - Porte da Empresa: ${discoverySize}
      - Popularidade (Avaliações no Maps): ${discoveryPopularity}
      - Presença Digital (Possui Site): ${discoveryHasWebsite}

      Retorne uma lista formatada como JSON contendo:
      "name": Nome da empresa
      "region": Cidade/Estado
      "sector": Ramo específico
      "size": Estimativa (Pequena, Média, Grande)
      "phone": Telefone de contato
      "website": URL do site (ou null)
      "maps_url": Link direto da empresa no Google Maps
      "notes": Uma breve descrição do que eles fazem, mencionando a popularidade e se atendem aos critérios solicitados.
      
      Importante: Use informações reais baseadas no Google Maps. Tente trazer o máximo de resultados possível (pelo menos 50) para escala de prospecção.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
        }
      });

      // Since we can't use responseSchema with googleMaps, we need to extract JSON from the text
      const text = response.text;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setGroundingLinks(chunks);

      // Try to parse JSON from text if AI followed instructions, otherwise fallback to simple display
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const items = JSON.parse(jsonMatch[0]);
          setDiscoveredLeads(items);
        } else {
          // Fallback: Create a simple item from the text if parsing fails
          setDiscoveredLeads([{ 
            name: "Resultados da Busca", 
            notes: text, 
            isRawText: true 
          }]);
        }
      } catch (e) {
        setDiscoveredLeads([{ 
          name: "Resultados da Busca", 
          notes: text, 
          isRawText: true 
        }]);
      }
    } catch (error) {
      console.error("Discovery failed:", error);
      alert("Falha na busca de leads. Tente uma query mais específica.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveLeadToCrm = async (lead: any) => {
    try {
      await addDoc(collection(db, 'prospects'), {
        name: lead.name || 'Empresa Desconhecida',
        region: lead.region || filterRegion,
        sector: lead.sector || discoveryQuery,
        size: lead.size || 'Média',
        phone: lead.phone || 'N/A',
        website: lead.website || '',
        maps_url: lead.maps_url || '',
        status: ProspectStatus.Novo,
        notes: lead.notes || '',
        createdAt: serverTimestamp()
      });
      // Filter out from discovery list
      setDiscoveredLeads(prev => prev.filter(l => l.name !== lead.name));
    } catch (error) {
      alert("Erro ao salvar lead.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-gray-700" />
      </div>
    );
  }

  if (!user || !isAdminUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-white/10 p-8 w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Prospecção Ativa</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            {user ? "Você não tem permissão para acessar esta ferramenta." : "Faça login para acessar o painel de prospecção."}
          </p>
          
          {!user ? (
            <button
              onClick={handleLogin}
              className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              Entrar com Google
            </button>
          ) : (
            <button
              onClick={() => signOut(auth)}
              className="w-full bg-zinc-900 text-white font-bold py-3 hover:bg-zinc-800 transition-colors flex items-center justify-center"
            >
              Sair da Conta
            </button>
          )}
          
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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-white/10 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/LogomarcaBranca.svg" alt="INCODED" className="h-6 w-auto mr-4" />
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="ml-4 font-medium text-sm tracking-widest uppercase text-gray-300">Ferramenta de Prospecção</span>
          </div>
          <div className="flex items-center">
            <AdminNav activeTab="prospect" />
            <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Site
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-[80px]">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => { setError(''); window.location.reload(); }}
              className="ml-auto text-xs font-bold uppercase tracking-widest underline"
            >
              Recarregar
            </button>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prospecção Ativa</h1>
            <p className="text-gray-400 text-sm">Gerencie seus potenciais clientes e utilize IA para encontrar novas oportunidades reais.</p>
          </div>
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setViewMode('crm')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'crm' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
            >
              Meus Prospects
            </button>
            <button 
              onClick={() => setViewMode('discovery')}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'discovery' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
            >
              Busca de Leads
            </button>
          </div>
        </div>

        {viewMode === 'crm' ? (
          <>
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-widest flex items-center hover:bg-gray-200 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" /> Novo Prospect
              </button>
            </div>

            {/* Filters */}
            <div className="bg-zinc-950 border border-white/10 p-6 mb-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Filtrar Salvos</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Ex: Tech..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-md py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="Todos">Todos Status</option>
                    {Object.values(ProspectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Região</label>
                  <select 
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-md py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-white transition-colors"
                  >
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Sector */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Setor</label>
                  <select 
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-md py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-white transition-colors"
                  >
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Tamanho</label>
                  <select 
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-md py-2.5 px-4 text-sm appearance-none focus:outline-none focus:border-white transition-colors"
                  >
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedProspects.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white text-black p-4 mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-40 rounded-lg shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm tracking-tighter">
                      {selectedProspects.length} SELECIONADOS
                    </span>
                    <button 
                      onClick={() => setSelectedProspects([])}
                      className="text-xs uppercase font-black underline"
                    >
                      Desmarcar
                    </button>
                    <button 
                      onClick={() => setSelectedProspects(filteredCompanies.map(p => p.id))}
                      className="text-xs uppercase font-black underline"
                    >
                      Selecionar Todos Filtro
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-black uppercase">Alterar Status:</label>
                      <select 
                        disabled={isBulkUpdating}
                        onChange={(e) => handleBulkStatusUpdate(e.target.value as ProspectStatus)}
                        className="bg-white border-2 border-black rounded px-2 py-1 text-xs font-bold focus:outline-none"
                        value=""
                      >
                        <option value="" disabled>Selecione...</option>
                        {Object.values(ProspectStatus).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button 
                      onClick={exportSelectionToCsv}
                      className="bg-black text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-zinc-800 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 mr-2" /> Baixar Planilha
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CRM List */}
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Carregando CRM...</p>
              </div>
            ) : filteredCompanies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {paginatedCRM.map((company) => (
                      <motion.div
                        key={company.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-zinc-950 border border-white/5 p-6 rounded-lg hover:border-white/20 transition-all group relative overflow-hidden"
                      >
                        {/* Status Indicator */}
                        <div className={`absolute top-0 right-0 h-1 left-0 ${
                          company.status === ProspectStatus.Novo ? 'bg-blue-500' :
                          company.status === ProspectStatus.Contatado ? 'bg-yellow-500' :
                          company.status === ProspectStatus.Interessado ? 'bg-purple-500' :
                          company.status === ProspectStatus.Convertido ? 'bg-green-500' :
                          'bg-red-500'
                        }`} />

                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-white/5 p-3 rounded-lg group-hover:bg-white/10 transition-colors">
                            <Building2 className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => toggleSelectProspect(company.id)}
                              className={`w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 transition-all ${
                                selectedProspects.includes(company.id) 
                                  ? 'bg-emerald-500 border-emerald-500 text-black' 
                                  : 'border-white/20 hover:border-white/40 bg-transparent'
                              }`}
                              title={selectedProspects.includes(company.id) ? "Desselecionar" : "Selecionar"}
                            >
                              {selectedProspects.includes(company.id) && <Check className="w-3 h-3" />}
                            </button>

                            {company.maps_url && (
                              <a 
                                href={company.maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-emerald-500 hover:bg-emerald-500/5 rounded transition-all"
                                title="Ver no Maps"
                              >
                                <MapPin className="w-4 h-4" />
                              </a>
                            )}
                            <button 
                              onClick={() => handleEdit(company)}
                              className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(company.id)}
                              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-1 leading-tight">{company.name}</h3>
                        <div className="space-y-1 mb-4">
                          <p className="text-gray-500 text-xs flex items-center">
                            <Briefcase className="w-3 h-3 mr-2" /> {company.sector}
                          </p>
                          <p className="text-gray-500 text-xs flex items-center">
                            <MapPin className="w-3 h-3 mr-2" /> {company.region}
                          </p>
                          <p className="text-gray-500 text-xs flex items-center">
                            <Users className="w-3 h-3 mr-2 text-zinc-600" /> {company.size}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center text-white font-mono font-bold text-sm tracking-tight">
                            <Phone className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                            {company.phone}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                            company.status === ProspectStatus.Novo ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            company.status === ProspectStatus.Contatado ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            company.status === ProspectStatus.Interessado ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            company.status === ProspectStatus.Convertido ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {company.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {totalPagesCRM > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPageCRM(prev => Math.max(1, prev - 1))}
                      disabled={currentPageCRM === 1}
                      className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: totalPagesCRM }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPageCRM(i + 1)}
                          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                            currentPageCRM === i + 1 
                              ? 'bg-white text-black' 
                              : 'bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPageCRM(prev => Math.min(totalPagesCRM, prev + 1))}
                      disabled={currentPageCRM === totalPagesCRM}
                      className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-lg bg-zinc-950/20">
                <Filter className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600">Nenhum prospect encontrado</h3>
                <p className="text-gray-700 text-sm mt-2">Tente ajustar seus filtros ou use a Busca de Leads para encontrar novos.</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            {/* Search Input for Discovery */}
            <div className="bg-zinc-950 border border-white/10 p-8 rounded-lg">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">O que você procura?</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Ex: Oficinas Mecânicas, Restaurantes Italianos, Startups..."
                      value={discoveryQuery}
                      onChange={(e) => setDiscoveryQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleDiscovery()}
                      className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-white transition-all shadow-inner"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Onde?</label>
                  <select 
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-4 px-4 text-lg appearance-none focus:outline-none focus:border-white transition-all"
                  >
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Extra Discovery Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Porte da Empresa</label>
                  <select 
                    value={discoverySize}
                    onChange={(e) => setDiscoverySize(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white transition-all text-gray-300"
                  >
                    <option value="Todos">Todos os Portes</option>
                    <option value="Pequena">Pequena (MEI/ME)</option>
                    <option value="Média">Média (EPP/LTDA)</option>
                    <option value="Grande">Grande (S.A.)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Popularidade</label>
                  <select 
                    value={discoveryPopularity}
                    onChange={(e) => setDiscoveryPopularity(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white transition-all text-gray-300"
                  >
                    <option value="Todas">Todas as Avaliações</option>
                    <option value="Alta">Alta (4.5+ estrelas)</option>
                    <option value="Média">Média (3.0+ estrelas)</option>
                    <option value="Poucas">Novas / Poucas Avaliações</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Possui Site?</label>
                  <select 
                    value={discoveryHasWebsite}
                    onChange={(e) => setDiscoveryHasWebsite(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:border-white transition-all text-gray-300"
                  >
                    <option value="Tanto faz">Tanto faz</option>
                    <option value="Sim">Sim, obrigatório</option>
                    <option value="Não">Não (Leads sem site)</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleDiscovery}
                  disabled={isAiLoading || !discoveryQuery.trim()}
                  className="w-full md:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center rounded-lg shadow-xl"
                >
                  {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 mr-3 text-emerald-600" /> Buscar Lead</>}
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500 italic">Usando tecnologia de busca em tempo real do Google para encontrar leads qualificados.</p>
            </div>

            {/* Discovery Results */}
            {isAiLoading ? (
              <div className="py-20 text-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full mx-auto mb-6"
                />
                <h3 className="text-xl font-bold mb-2">Garimpando Oportunidades...</h3>
                <p className="text-gray-500">A IA está consultando o Google Maps para você agora mesmo.</p>
              </div>
            ) : discoveredLeads.length > 0 ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-4 rounded-lg border border-white/5 gap-4">
                  <h3 className="font-bold flex items-center gap-2 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {discoveredLeads[0].isRawText ? "Resultados da Busca" : `${discoveredLeads.length} Leads Encontrados`}
                  </h3>
                  {groundingLinks.length > 0 && (
                    <div className="flex gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-white/10 no-scrollbar">
                      <div className="flex gap-4 flex-nowrap whitespace-nowrap">
                        {groundingLinks.map((chunk, idx) => chunk.maps && (
                          <a key={idx} href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Ver no Maps
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedDiscovery.map((lead, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-zinc-950 border border-white/5 p-6 rounded-lg hover:border-white/10 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {lead.isRawText ? (
                          <div className="prose prose-invert text-sm text-gray-400 max-w-none">
                            {lead.notes}
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="text-lg font-bold leading-tight">{lead.name}</h4>
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-black border border-emerald-500/10 uppercase">Lead Real</span>
                            </div>
                              <div className="space-y-1.5 mb-4">
                                <p className="text-gray-500 text-xs flex items-center"><MapPin className="w-3.5 h-3.5 mr-2" /> {lead.region}</p>
                                <p className="text-gray-500 text-xs flex items-center"><Briefcase className="w-3.5 h-3.5 mr-2" /> {lead.sector}</p>
                                <div className="space-y-1">
                                  <p className="text-white text-sm font-mono mt-2 font-bold flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-zinc-500" /> {lead.phone}
                                  </p>
                                  <div className="flex flex-wrap gap-4 mt-1">
                                    {lead.website && (
                                      <a 
                                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-400 text-xs flex items-center hover:underline"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Site
                                      </a>
                                    )}
                                    {lead.maps_url && (
                                      <a 
                                        href={lead.maps_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-emerald-400 text-xs flex items-center hover:underline"
                                      >
                                        <MapPin className="w-3.5 h-3.5 mr-1" /> Ver no Maps
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            <p className="text-xs text-gray-500 italic line-clamp-2 border-l-2 border-zinc-800 pl-3 py-1 bg-zinc-900/50">"{lead.notes}"</p>
                          </>
                        )}
                      </div>
                      
                      {!lead.isRawText && (
                        <button 
                          onClick={() => saveLeadToCrm(lead)}
                          className="mt-6 w-full py-3 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center transition-all group"
                        >
                          <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Acompanhar no CRM
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {totalPagesDiscovery > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPageDiscovery(prev => Math.max(1, prev - 1))}
                      disabled={currentPageDiscovery === 1}
                      className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: totalPagesDiscovery }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPageDiscovery(i + 1)}
                          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                            currentPageDiscovery === i + 1 
                              ? 'bg-white text-black' 
                              : 'bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPageDiscovery(prev => Math.min(totalPagesDiscovery, prev + 1))}
                      disabled={currentPageDiscovery === totalPagesDiscovery}
                      className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-32 text-center border border-dashed border-white/10 rounded-xl bg-zinc-950/20">
                <Activity className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-600">Prepare sua Campanha</h3>
                <p className="text-gray-700 max-w-md mx-auto mt-4">
                  Digite o que você quer vender e para quem (ex: "Oficinas Mecânicas") e nossa IA buscará estabelecimentos reais para você entrar em contato hoje.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 w-full max-w-lg p-8 relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                {editingId ? <Edit3 className="w-6 h-6 text-green-500" /> : <Plus className="w-6 h-6 text-green-500" />}
                {editingId ? 'Editar Prospect' : 'Novo Prospect'}
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Nome da Empresa</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Região</label>
                    <select 
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                    >
                      {regions.filter(r => r !== 'Todas').map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Tamanho</label>
                    <select 
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                    >
                      {sizes.filter(s => s !== 'Todos').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Setor</label>
                    <select 
                      value={formData.sector}
                      onChange={(e) => setFormData({...formData, sector: e.target.value})}
                      className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                    >
                      {sectors.filter(s => s !== 'Todos').map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Telefone</label>
                    <input 
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Website</label>
                  <input 
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://exemplo.com.br"
                    className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Google Maps URL</label>
                  <input 
                    type="text"
                    value={formData.maps_url}
                    onChange={(e) => setFormData({...formData, maps_url: e.target.value})}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as ProspectStatus})}
                    className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                  >
                    {Object.values(ProspectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">Notas / Próximos Passos</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Ex: Agendar reunião de apresentação..."
                    className="w-full bg-black border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors min-h-[100px]"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 border border-white/10 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

