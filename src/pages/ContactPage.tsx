import React, { useState, FormEvent, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

// Layout Components
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Preloader } from '../components/ui/Preloader';
import { Mail, Phone, MapPin } from 'lucide-react';

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

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
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
            _subject: "Novo contato pelo site INCODED!"
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

  return (
    <div className="min-h-screen bg-[#0a070e] text-white font-sans selection:bg-white selection:text-black flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      <SEO 
        title="Contato | INCODED"
        description="Entre em contato com a equipe da INCODED. Estamos prontos para transformar sua empresa com soluções digitais avançadas."
        url="https://incoded.com.br/contato"
      />

      <Navbar activeSection="contato" />

      <main className="flex-1 mt-20">
        <section className="contact py-24 bg-[#090B11] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div>
              <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-primary mb-4 block">Contato</span>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 text-white" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>Conte seu desafio.</h1>
              <p className="text-gray-400 text-base md:text-lg font-normal">
                Respondemos com um plano objetivo em até 24h úteis.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="contact__info">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Online Agora</span>
                </div>
                
                <p className="text-gray-400 md:text-lg mb-10">
                  Preencha o formulário ao lado ou entre em contato diretamente pelos nossos canais.
                </p>
                
                <div className="flex flex-col gap-4">
                  <a href="tel:+5571991895994" className="flex items-center gap-6 p-6 border border-white/10 rounded-2xl bg-[#050505] hover:border-primary/50 transition-colors group">
                    <div className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Telefone</p>
                      <p className="text-base font-medium text-white">+55 71 99189-5994</p>
                    </div>
                  </a>
                  
                  <a href={`https://wa.me/5571991895994?text=${encodeURIComponent('Olá! Vi o site da INCODED e gostaria de iniciar um projeto.')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 border border-white/10 rounded-2xl bg-[#050505] hover:border-[#25D366]/50 transition-colors group">
                    <div className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-[#25D366]/50 transition-colors">
                      <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">WhatsApp</p>
                      <p className="text-base font-medium text-white">Clique para conversar</p>
                    </div>
                  </a>

                  <a href="mailto:contato@incoded.com.br" className="flex items-center gap-6 p-6 border border-white/10 rounded-2xl bg-[#050505] hover:border-primary/50 transition-colors group">
                    <div className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">E-mail</p>
                      <p className="text-base font-medium text-white">contato@incoded.com.br</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-6 p-6 border border-white/10 rounded-2xl bg-[#050505] hover:border-primary/50 transition-colors group cursor-default">
                    <div className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Endereço</p>
                      <p className="text-base font-medium text-white">Av. Luís Viana, 6462 — Salvador / BA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact__form bg-[#050505] border border-white/10 rounded-2xl p-8 relative z-10">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Nome</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">E-mail</label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Telefone</label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
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
                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                     <label htmlFor="interest" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Interesse</label>
                     <select 
                        id="interest" 
                        required
                        className="w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-lg appearance-none cursor-pointer"
                        onChange={(e) => setFormData({...formData, interest: e.target.value} as any)}
                     >
                        <option value="Site / Landing Page" className="bg-[#050505]">Site / Landing Page</option>
                        <option value="Sistema Web" className="bg-[#050505]">Sistema Web</option>
                        <option value="Identidade Visual" className="bg-[#050505]">Identidade Visual</option>
                        <option value="Social Media" className="bg-[#050505]">Social Media</option>
                     </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Conte Sobre O Projeto</label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none rounded-lg"
                    ></motion.textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
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
      </main>

      <Footer onOpenPrivacy={() => {}} />
    </div>
  );
}
