import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
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
        scrolled
          ? 'glass shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#"
          className="group flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Sparkles
            size={18}
            className="text-accent-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
          />
          <span className="text-gradient">Space</span>
          <span className="ml-1 hidden text-xs font-normal text-zinc-500 sm:inline">
            {PROFILE.subdomain}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:bg-zinc-800/50 hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href={PROFILE.links.expo}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-lg bg-accent-600/15 px-3.5 py-2 text-sm font-medium text-accent-400 ring-1 ring-accent-500/20 transition-all duration-200 hover:bg-accent-600/25 hover:ring-accent-500/40"
          >
            Expo →
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? 'max-h-64 border-t border-zinc-800/50' : 'max-h-0'
        }`}
      >
        <div className="glass mx-4 mb-4 flex flex-col gap-1 rounded-xl p-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href={PROFILE.links.expo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 rounded-lg bg-accent-600/15 px-4 py-2.5 text-center text-sm font-medium text-accent-400 transition-colors hover:bg-accent-600/25"
          >
            Expo →
          </a>
        </div>
      </div>
    </header>
  );
}
