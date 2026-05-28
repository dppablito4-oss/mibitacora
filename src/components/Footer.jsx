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
      </div>
    </footer>
  );
}
