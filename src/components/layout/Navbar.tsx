import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

/**
 * Navbar Component
 * Block: navbar
 * Element: navbar__logo, navbar__link, navbar__button, navbar__mobile-menu
 */
export function Navbar({ activeSection }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { id: 'sobre', label: 'Sobre' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'portfolio', label: 'Portfólio' },
    { id: 'depoimentos', label: 'Avaliações' },
    { id: 'parceiros', label: 'Parceiros' },
  ];

  return (
    <header className="navbar">
      <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="navbar__logo flex-shrink-0 flex items-center">
              <img src="/LogomarcaBranca.svg" alt="INCODED" className="h-8 w-auto" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  className={`navbar__link text-sm font-medium transition-colors ${activeSection === link.id ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  {link.label}
                </a>
              ))}
              <a 
                href="#contato" 
                className={`navbar__button px-5 py-2.5 text-sm font-bold transition-all rounded-none border ${activeSection === 'contato' ? 'bg-primary-dark text-white border-primary-dark' : 'bg-primary text-white hover:bg-primary-dark border-primary shadow-lg shadow-primary/20'}`}
              >
                Fale Conosco
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-300 focus:outline-none"
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="navbar__mobile-menu md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={`#${link.id}`} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`block px-4 py-3 text-lg font-medium transition-colors rounded-lg ${activeSection === link.id ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                  >
                    {link.label}
                  </a>
                ))}
                <a 
                  href="#contato" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`block px-4 py-4 text-lg font-black text-white bg-primary mt-6 text-center rounded-lg active:scale-95 transition-all ${activeSection === 'contato' ? 'bg-primary-dark' : ''}`}
                >
                  Fale Conosco
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
