import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../data/siteData';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
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
        </div>
      </div>
    </header>
  );
}
