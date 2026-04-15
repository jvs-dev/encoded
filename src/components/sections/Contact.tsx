import { FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import Map from '../Map';

interface ContactProps {
  subtitle: string;
  formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  formStatus: 'idle' | 'submitting' | 'success' | 'error';
  onFormSubmit: (e: FormEvent) => void;
  onFormDataChange: (data: any) => void;
}

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

/**
 * Contact Section
 * Block: contact
 * Element: contact__info, contact__form, contact__input, contact__button
 */
export function Contact({ subtitle, formData, formStatus, onFormSubmit, onFormDataChange }: ContactProps) {
  return (
    <section id="contato" className="contact py-24 bg-zinc-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="contact__info">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Vamos iniciar seu projeto?</h2>
            <p className="text-gray-400 text-lg mb-10">
              {subtitle}
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

            <div className="hidden lg:block mt-12">
              <Map />
            </div>
          </div>

          <div className="contact__form bg-black border border-white/10 p-8">
            <form onSubmit={onFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Nome Completo *</label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  placeholder="Seu nome"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => onFormDataChange({...formData, email: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">WhatsApp</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      const filteredValue = value.replace(/[^0-9\s\(\)\-]/g, '');
                      onFormDataChange({...formData, phone: filteredValue});
                    }}
                    pattern="^[0-9\s\(\)\-]*$"
                    title="Apenas números, espaços, parênteses e hifens são permitidos"
                    className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Mensagem / Necessidade *</label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => onFormDataChange({...formData, message: e.target.value})}
                  className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none"
                  placeholder="Conte-nos um pouco sobre o seu projeto..."
                ></motion.textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="contact__button w-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
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
  );
}
