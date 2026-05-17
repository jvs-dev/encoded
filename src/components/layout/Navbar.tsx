import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
}

/**
 * Navbar Component
 */
export function Navbar({ activeSection = '' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { id: 'inicio', label: 'Início', path: '/' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'portfolio', label: 'Portfólio' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'contato', label: 'Contato', path: '/contato' },
  ];

  const renderNavLink = (link: { id: string, label: string, path?: string }, isMobile = false) => {
    const href = link.path || (isHomePage ? `#${link.id}` : `/#${link.id}`);
    const isExternal = !!link.path;
    const className = isMobile 
      ? `block px-4 py-3 text-lg font-medium transition-colors rounded-lg ${activeSection === link.id ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
      : `navbar__link text-sm font-medium transition-colors ${activeSection === link.id ? 'text-white' : 'text-gray-400 hover:text-white'}`;

    if (isExternal) {
      return (
        <Link key={link.id} to={href} className={className} onClick={() => isMobile && setIsMenuOpen(false)}>
          {link.label}
        </Link>
      );
    }

    return isHomePage ? (
      <a key={link.id} href={href} className={className} onClick={() => isMobile && setIsMenuOpen(false)}>
        {link.label}
      </a>
    ) : (
      <Link key={link.id} to={href} className={className} onClick={() => isMobile && setIsMenuOpen(false)}>
        {link.label}
      </Link>
    );
  };

  return (
    <header className="navbar">
      <nav className={`fixed w-full z-50 transition-colors duration-300 border-b-1 border-[#21272f] ${isScrolled ? 'bg-[#060606]/80 backdrop-blur-md' : 'bg-[#07090E]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="navbar__logo flex-shrink-0 flex items-center">
                <img src="/logo.svg" alt="LOGO INCODED" className="h-[28px] w-auto" />
              </Link>
            </div>
            
            {/* Center Desktop Menu */}
            <div className="hidden md:flex space-x-8 flex-1 justify-center items-center">
              {navLinks.map((link) => renderNavLink(link))}
            </div>

            {/* Right Button */}
            <div className="hidden md:flex flex-1 justify-end items-center">
              <Link 
                to="/contato"
                className={`navbar__button px-[16px] py-[8px] border border-transparent text-sm font-semibold transition-all rounded-[10px] bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 active:scale-95`}
              >
                Iniciar projeto
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center flex-1 justify-end">
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
              className="navbar__mobile-menu md:hidden bg-[#0a070e]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => renderNavLink(link, true))}
                <Link 
                  to="/contato"
                  onClick={() => setIsMenuOpen(false)} 
                  className={`block px-4 py-4 text-lg font-black text-white bg-primary mt-6 text-center rounded-lg active:scale-95 transition-all ${activeSection === 'contato' ? 'bg-primary-dark' : ''}`}
                >
                  Iniciar projeto
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
