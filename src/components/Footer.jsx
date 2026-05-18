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
      </div>
    </footer>
  );
}
