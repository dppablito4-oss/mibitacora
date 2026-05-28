import { Heart, Sparkles } from 'lucide-react';
import { PROFILE } from '../data/siteData';

export default function Footer() {
  return (
    <footer className="relative border-t border-tesseract-500/10 bg-dark py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 relative z-10">
        {/* Hidden Admin Link */}
        <a href="#/admin" className="flex h-8 w-8 items-center justify-center rounded-sm bg-tesseract-500/5 border border-tesseract-500/20 transition-all hover:bg-tesseract-500/20 hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          <Sparkles size={14} className="text-tesseract-500/50" />
        </a>

        {/* Built with love */}
        <div className="flex items-center gap-2 text-[13px] text-slate-500 font-mono">
          <span>SISTEMA CREADO CON</span>
          <Heart size={12} className="text-tesseract-500" fill="currentColor" />
          <span>POR</span>
          <span className="font-bold text-tesseract-300 tracking-widest">{PROFILE.name}</span>
        </div>

        {/* Copyright */}
        <p className="font-mono text-[11px] text-slate-700 tracking-widest">
          © {new Date().getFullYear()} {PROFILE.subdomain} — ACCESO CLASIFICADO
        </p>
      </div>
    </footer>
  );
}
