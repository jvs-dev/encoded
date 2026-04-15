import { Mail } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
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
 * Footer Component
 * Block: footer
 * Element: footer__logo, footer__nav, footer__social, footer__bottom
 */
export function Footer({ onOpenPrivacy }: FooterProps) {
  return (
    <footer className="footer bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="footer__logo mb-6">
              <span className="font-bold text-2xl tracking-tighter">ENCODED<span className="text-gray-500">.</span></span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Transformamos ideias em realidade digital através de engenharia de software e design de alto nível. Soluções focadas em resultados e escala.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Navegação</h4>
            <ul className="footer__nav space-y-4">
              <li><a href="#sobre" className="text-gray-400 hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#servicos" className="text-gray-400 hover:text-white transition-colors">Serviços</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfólio</a></li>
              <li><a href="#contato" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Contato</h4>
            <ul className="footer__social space-y-4">
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3" />
                encoded.ofc@gmail.com
              </li>
              <li className="flex items-center text-gray-400">
                <WhatsAppIcon className="w-4 h-4 mr-3" />
                +55 (71) 99189-5994
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer__bottom pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ENCODED. Todos os direitos reservados.
          </p>
          <div className="flex space-x-8">
            <button onClick={onOpenPrivacy} className="text-gray-500 hover:text-white text-sm transition-colors">Política de Privacidade</button>
            <span className="text-gray-500 text-sm">Salvador, BA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
