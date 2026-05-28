import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Hexagon, List, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
=======
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../data/siteData';
>>>>>>> f1c96d7c0faadf24344cfb05982bef174dc10819

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
<<<<<<< HEAD
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
              <Link to="/#inicio" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Protocolo Alpha
              </Link>
              <Link to="/#expediente" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Expediente
              </Link>
              <Link to="/#arsenal" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Arsenal
              </Link>
              <Link to="/scanner" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Escáner
              </Link>
              <Link to="/qr" className="text-sm font-medium text-slate-300 transition-all hover:text-tesseract-300 hover:text-glow px-3 py-2">
                Generador QR
              </Link>
              <a href="#contacto" className="rounded-sm border border-tesseract-300/50 bg-tesseract-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all hover:bg-tesseract-600">
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
          <Link to="/#inicio" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Protocolo Alpha
          </Link>
          <Link to="/#expediente" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Expediente
          </Link>
          <Link to="/#arsenal" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Arsenal
          </Link>
          <Link to="/scanner" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Escáner
          </Link>
          <Link to="/qr" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-slate-300 hover:border-tesseract-500/30 hover:bg-tesseract-500/10 hover:text-tesseract-300">
            Generador QR
          </Link>
          <a href="#contacto" onClick={closeMenu} className="block rounded-md border border-transparent px-3 py-2 text-base font-medium text-tesseract-500 hover:border-tesseract-500/30 hover:bg-tesseract-500/10">
            Contactar Enlace
          </a>
=======
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="group flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-[10px] font-black text-white tracking-wider">S</span>
          </div>
          <span className="text-sm font-semibold text-white/90 tracking-tight">
            {PROFILE.subdomain.split('.')[0]}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-white/40 transition-colors duration-200 hover:text-white/80"
            >
              {link.label}
            </a>
          ))}
          <a
            href={PROFILE.links.expo}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 rounded-lg border border-white/8 bg-white/4 px-3.5 py-1.5 text-[13px] font-medium text-white/60 transition-all duration-200 hover:bg-white/8 hover:text-white/90 hover:border-white/12"
          >
            Expo ↗
          </a>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-white/40 transition-colors hover:text-white/80 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`overflow-hidden transition-all duration-300 md:hidden ${menuOpen ? 'max-h-80' : 'max-h-0'}`}>
        <div className="glass mx-4 mb-4 flex flex-col gap-0.5 rounded-xl p-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/4 hover:text-white/90"
            >
              {link.label}
            </a>
          ))}
>>>>>>> f1c96d7c0faadf24344cfb05982bef174dc10819
        </div>
      </div>
    </nav>
  );
}
