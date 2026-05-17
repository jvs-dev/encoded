import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, Send, User, Mail, Phone, Briefcase } from 'lucide-react';

interface BriefingField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  placeholder?: string;
  options?: string[];
  required: boolean;
}

interface BriefingForm {
  type: string;
  title: string;
  description: string;
  fields: BriefingField[];
}

const DEFAULT_FORMS: Record<string, BriefingForm> = {
  website: {
    type: 'website',
    title: 'Briefing - Construção de Website',
    description: 'Coleta de informações estratégicas para a criação do seu novo site.',
    fields: [
      { id: 'objective', label: 'Qual o objetivo principal do site?', type: 'textarea', required: true, placeholder: 'Ex: Vender produtos, captar leads, apresentar portfólio...' },
      { id: 'target_audience', label: 'Quem é o seu público-alvo?', type: 'textarea', required: true },
      { id: 'sections', label: 'Quais seções você imagina para o site?', type: 'textarea', required: true, placeholder: 'Ex: Home, Sobre, Serviços, Depoimentos, Blog, Contato' },
      { id: 'references', label: 'Quais referências de sites você gosta?', type: 'textarea', required: false, placeholder: 'Links de sites que te inspiram' },
      { id: 'colors', label: 'Tem alguma preferência de cores ou identidade visual?', type: 'text', required: false }
    ]
  },
  marketing: {
    type: 'marketing',
    title: 'Briefing - Posts e Marketing',
    description: 'Informações para criação de conteúdo e identidade visual.',
    fields: [
      { id: 'brand_voice', label: 'Qual o tom de voz da sua marca?', type: 'text', required: true, placeholder: 'Ex: Casual, Sério, Amigável, Autoritário' },
      { id: 'post_frequency', label: 'Qual a frequência de postagens esperada?', type: 'select', required: true, options: ['1x por semana', '3x por semana', 'Diário', 'Outro'] },
      { id: 'main_topics', label: 'Quais os temas principais a serem abordados?', type: 'textarea', required: true },
      { id: 'competitors', label: 'Quem são seus principais concorrentes?', type: 'textarea', required: false }
    ]
  },
  system: {
    type: 'system',
    title: 'Briefing - Sistemas Completos',
    description: 'Detalhamento de requisitos para sistemas personalizados.',
    fields: [
      { id: 'problem', label: 'Qual problema o sistema pretende resolver?', type: 'textarea', required: true },
      { id: 'key_features', label: 'Quais são as funcionalidades indispensáveis?', type: 'textarea', required: true },
      { id: 'integrations', label: 'O sistema precisará de integrações externas?', type: 'textarea', required: false, placeholder: 'Ex: Meios de pagamento, ERPs, CRM...' },
      { id: 'user_roles', label: 'Quais serão os tipos de usuários?', type: 'text', required: true, placeholder: 'Ex: Admin, Cliente, Vendedor' }
    ]
  }
};

export default function BriefingPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<BriefingForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // 0: Client Info, 1: Briefing Questions, 2: Success
  const [submitting, setSubmitting] = useState(false);
  
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const q = query(collection(db, 'briefing_forms'), where('type', '==', type));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data() as BriefingForm;
          setForm(data);
        } else if (type && DEFAULT_FORMS[type]) {
          setForm(DEFAULT_FORMS[type]);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        if (type && DEFAULT_FORMS[type]) setForm(DEFAULT_FORMS[type]);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [type, navigate]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'briefing_responses'), {
        formType: type,
        clientName: clientInfo.name,
        clientEmail: clientInfo.email,
        clientPhone: clientInfo.phone,
        answers,
        createdAt: new Date()
      });
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar briefing. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a070e] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-[#0a070e] text-white pb-20 pt-20 px-4">
      <SEO title={form.title} description={form.description} url={`https://incoded.com.br/briefing/${type}`} />
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img src="/LogomarcaBranca.svg" alt="INCODED" className="h-8 mx-auto mb-8" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{form.title}</h1>
            <p className="text-gray-400">{form.description}</p>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.form
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNextStep}
              className="space-y-6 bg-zinc-950 border border-white/10 p-8"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-3 text-primary" /> Dados de Contato
              </h2>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Seu Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    required
                    type="text"
                    value={clientInfo.name}
                    onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                    className="w-full bg-[#0a070e] border border-white/10 p-4 pl-12 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="João Silva"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    required
                    type="email"
                    value={clientInfo.email}
                    onChange={e => setClientInfo({ ...clientInfo, email: e.target.value })}
                    className="w-full bg-[#0a070e] border border-white/10 p-4 pl-12 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="joao@empresa.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">WhatsApp / Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    required
                    type="tel"
                    value={clientInfo.phone}
                    onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    className="w-full bg-[#0a070e] border border-white/10 p-4 pl-12 text-white focus:outline-none focus:border-white transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-colors flex items-center justify-center group"
              >
                Começar Briefing <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          )}

          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-8 bg-zinc-950 border border-white/10 p-8"
            >
              <div className="flex items-center justify-between mb-2">
                <button 
                  type="button" 
                  onClick={() => setStep(0)}
                  className="text-gray-500 hover:text-white flex items-center text-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
                </button>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Questionário</span>
              </div>

              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-gray-500">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      required={field.required}
                      type="text"
                      value={answers[field.id] || ''}
                      onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                      className="w-full bg-[#0a070e] border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors"
                      placeholder={field.placeholder}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      required={field.required}
                      value={answers[field.id] || ''}
                      onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                      className="w-full bg-[#0a070e] border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors min-h-[120px]"
                      placeholder={field.placeholder}
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      required={field.required}
                      value={answers[field.id] || ''}
                      onChange={e => setAnswers({ ...answers, [field.id]: e.target.value })}
                      className="w-full bg-[#0a070e] border border-white/10 p-4 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                    >
                      <option value="">Selecione uma opção</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-bold py-4 hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Finalizar e Enviar <Send className="ml-2 w-4 h-4" /></>
                )}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-zinc-950 border border-white/10 p-12"
            >
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Briefing Recebido!</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Obrigado, {clientInfo.name.split(' ')[0]}. Recebemos suas informações e entraremos em contato dentro de 24h para dar continuidade ao seu projeto.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-black font-bold px-8 py-3 hover:bg-gray-200 transition-colors"
              >
                Voltar para o Início
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
