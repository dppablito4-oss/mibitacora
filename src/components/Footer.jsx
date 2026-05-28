<<<<<<< HEAD
import { Heart, Sparkles } from 'lucide-react';
import { PROFILE } from '../data/siteData';

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-800/30 py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6">
        {/* Logo mark */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/60 border border-zinc-800/40">
          <Sparkles size={14} className="text-accent-500/50" />
        </div>

        {/* Built with love */}
        <div className="flex items-center gap-2 text-[13px] text-zinc-700">
          <span>Construido con</span>
          <Heart size={12} className="text-red-500/50" fill="currentColor" />
          <span>por</span>
          <span className="font-medium text-zinc-500">{PROFILE.name}</span>
        </div>

        {/* Copyright */}
        <p className="font-mono text-[11px] text-zinc-800">
          © {new Date().getFullYear()} {PROFILE.subdomain}
        </p>
=======
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-16">
      <div className="section-divider mx-auto max-w-5xl mb-16" />
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <span className="text-[8px] font-black text-white">S</span>
            </div>
            <span className="text-xs font-medium text-white/30 tracking-wide">space.sypablitodp.site</span>
          </div>

          {/* Made with */}
          <div className="flex items-center gap-1.5 text-xs text-white/15">
            <span>Hecho con</span>
            <Heart size={11} className="text-red-400/40" fill="currentColor" />
            <span>por</span>
            <span className="text-white/30 font-medium">Pablo DP</span>
          </div>

          {/* Copyright */}
          <p className="font-mono text-[11px] text-white/12">
            © {new Date().getFullYear()}
          </p>
        </div>
>>>>>>> f1c96d7c0faadf24344cfb05982bef174dc10819
      </div>
    </footer>
  );
}
