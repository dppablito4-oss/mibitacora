import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-800/40 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <span>Construido con</span>
          <Heart size={13} className="text-red-500/60" fill="currentColor" />
          <span>y</span>
          <Sparkles size={13} className="text-accent-400/60" />
          <span>por Pablo DP</span>
        </div>
        <p className="font-mono text-xs text-zinc-700">
          © {new Date().getFullYear()} space.sypablitodp.site
        </p>
      </div>
    </footer>
  );
}
