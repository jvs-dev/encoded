import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PrivacyPolicyModal Component
 * Block: modal
 * Element: modal__content, modal__header, modal__body, modal__footer
 */
export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal__content bg-zinc-950 border border-white/10 p-6 md:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="modal__close absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Fechar modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="modal__title text-2xl font-bold mb-6">Política de Privacidade</h2>
            
            <div className="modal__body space-y-4 text-gray-300 leading-relaxed text-sm md:text-base">
              <p>
                A <strong>ENCODED</strong> valoriza e respeita a sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nosso site.
              </p>
              
              <h3 className="text-lg font-bold text-white mt-6">1. Coleta de Dados</h3>
              <p>
                Coletamos informações pessoais (como nome, e-mail e número de telefone) apenas quando você as fornece voluntariamente através do nosso formulário de contato.
              </p>
              
              <h3 className="text-lg font-bold text-white mt-6">2. Uso das Informações</h3>
              <p>
                Os dados coletados são utilizados exclusivamente para:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Responder às suas dúvidas e solicitações de orçamento;</li>
                <li>Enviar propostas comerciais relacionadas aos nossos serviços;</li>
                <li>Melhorar nosso atendimento e a experiência no site.</li>
              </ul>
              
              <h3 className="text-lg font-bold text-white mt-6">3. Proteção e Compartilhamento</h3>
              <p>
                Suas informações são armazenadas de forma segura em nosso banco de dados. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.
              </p>

              <h3 className="text-lg font-bold text-white mt-6">4. Seus Direitos</h3>
              <p>
                Você tem o direito de solicitar a exclusão ou alteração dos seus dados a qualquer momento. Para isso, basta entrar em contato conosco através do e-mail: <strong>encoded.ofc@gmail.com</strong>.
              </p>
            </div>
            
            <div className="modal__footer mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button 
                onClick={onClose}
                className="bg-white text-black px-6 py-2 font-bold hover:bg-gray-200 transition-colors focus:outline-none"
              >
                Entendi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
