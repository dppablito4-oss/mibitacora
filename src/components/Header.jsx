import { useState, useEffect } from 'react';
import { Hexagon, List, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      // Esperar a que ocurra la transición de ruta y luego hacer scroll
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-dark/90 border-b border-tesseract-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md'
          : 'bg-dark/60 border-b border-tesseract-500/10 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-white">
              <Hexagon className="text-tesseract-500" fill="currentColor" />
              Dev<span className="text-tesseract-500">S.H.I.E.L.D.</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#inicio" onClick={(e) => handleAnchorClick(e, 'inicio')} className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Protocolo Alpha
              </a>
              <a href="#expediente" onClick={(e) => handleAnchorClick(e, 'expediente')} className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Expediente
              </a>
              <a href="#arsenal" onClick={(e) => handleAnchorClick(e, 'arsenal')} className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Arsenal
              </a>
              <a href="#proyectos" onClick={(e) => handleAnchorClick(e, 'proyectos')} className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Proyectos
              </a>
              <a href="#servicios" onClick={(e) => handleAnchorClick(e, 'servicios')} className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Servicios
              </a>
              <Link to="/scanner" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Escáner
              </Link>
              <Link to="/qr" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Generador QR
              </Link>
              <Link to="/math" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Math Pro
              </Link>
              <Link to="/tripticos" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2 flex items-center gap-2">
                Trípticos IA
              </Link>
              <a href="#contacto" onClick={(e) => handleAnchorClick(e, 'contacto')} className="rounded-sm border border-tesseract-300/50 bg-tesseract-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all hover:bg-tesseract-600">
                Contactar Enlace
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md border border-tesseract-500/30 p-2 text-tesseract-500 hover:bg-tesseract-600/20 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} absolute w-full border-b border-tesseract-500/20 bg-card/95 backdrop-blur-xl`}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <a href="#inicio" onClick={(e) => handleAnchorClick(e, 'inicio')} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Protocolo Alpha
          </a>
          <a href="#expediente" onClick={(e) => handleAnchorClick(e, 'expediente')} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Expediente
          </a>
          <a href="#arsenal" onClick={(e) => handleAnchorClick(e, 'arsenal')} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Arsenal
          </a>
          <a href="#proyectos" onClick={(e) => handleAnchorClick(e, 'proyectos')} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Proyectos
          </a>
          <a href="#servicios" onClick={(e) => handleAnchorClick(e, 'servicios')} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Servicios
          </a>
          <Link to="/scanner" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Escáner
          </Link>
          <Link to="/qr" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Generador QR
          </Link>
          <Link to="/math" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Math Pro
          </Link>
          <Link to="/tripticos" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Trípticos IA
          </Link>
          <a href="#contacto" onClick={(e) => handleAnchorClick(e, 'contacto')} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-tesseract-500 hover:border-tesseract-500/30 hover:bg-tesseract-500/10">
            Contactar Enlace
          </a>
        </div>
      </div>
    </nav>
  );
}
