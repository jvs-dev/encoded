import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  price: string;
  icon?: any;
}

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
}

/**
 * ServiceDetailModal Component
 * Block: service-modal
 * Element: service-modal__content, service-modal__icon, service-modal__title, service-modal__price, service-modal__body, service-modal__footer
 */
export function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  return (
    <AnimatePresence>
      {service && (
        <div className="service-modal fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="service-modal__content bg-zinc-950 border border-white/10 p-6 md:p-8 max-w-lg w-full relative"
          >
            <button 
              onClick={onClose}
              className="service-modal__close absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Fechar modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="service-modal__icon mb-6 text-white">
              {service.icon}
            </div>
            <h2 className="service-modal__title text-2xl font-bold mb-2">{service.title}</h2>
            <p className="service-modal__price text-lg font-black text-white mb-6 inline-block bg-white/10 px-3 py-1 rounded-sm border-l-2 border-white">
              {service.price}
            </p>
            
            <div className="service-modal__body space-y-4 text-gray-300 leading-relaxed">
              <p>{service.description}</p>
              
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3">O que está incluído ou como calculamos:</h4>
                <ul className="space-y-2">
                  {service.price.includes('consulta') ? (
                    <>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-white/40 shrink-0 mt-0.5" />
                        Análise técnica da complexidade do projeto.
                      </li>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-white/40 shrink-0 mt-0.5" />
                        Estimativa de horas de desenvolvimento e design.
                      </li>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-white/40 shrink-0 mt-0.5" />
                        Integrações com APIs de terceiros ou sistemas legados.
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-white/40 shrink-0 mt-0.5" />
                        Entrega de alta qualidade seguindo padrões modernos.
                      </li>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-white/40 shrink-0 mt-0.5" />
                        Suporte inicial para implementação.
                      </li>
                      <li className="flex items-start text-sm">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-white/40 shrink-0 mt-0.5" />
                        Otimização para performance e SEO.
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="service-modal__footer mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/5571991895994" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-black px-6 py-3 font-bold hover:bg-gray-200 transition-colors text-center flex-1"
              >
                Solicitar Orçamento
              </a>
              <button 
                onClick={onClose}
                className="border border-white/20 text-white px-6 py-3 font-bold hover:bg-white/5 transition-colors flex-1"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
