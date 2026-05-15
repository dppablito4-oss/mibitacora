import { Mail, ExternalLink, MapPin, Code2 } from 'lucide-react';
import { PROFILE } from '../data/siteData';

export default function Profile() {
  return (
    <section id="perfil" className="relative pt-32 pb-20">
      {/* Dot pattern background */}
      <div className="dot-pattern pointer-events-none absolute inset-0 opacity-40" />

      {/* Gradient orb */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-accent-500/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-14">
          {/* Avatar */}
          <div className="group relative shrink-0">
            <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900 shadow-xl shadow-black/20 transition-transform duration-500 group-hover:scale-[1.02]">
              {/* Elegant monogram avatar */}
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-600/20 to-violet-600/20">
                <span className="text-5xl font-bold text-gradient select-none">
                  P
                </span>
              </div>
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-medium text-zinc-400">
                Disponible
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-800/60 bg-zinc-900/80 px-3 py-1">
              <Code2 size={12} className="text-accent-400" />
              <span className="text-xs font-medium text-zinc-400">
                Full-Stack Developer
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{PROFILE.name}</span>
            </h1>

            <p className="mt-2 text-lg font-medium text-zinc-400 sm:text-xl">
              {PROFILE.tagline}
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500">
              {PROFILE.bio}
            </p>

            {/* Location */}
            <div className="mt-4 flex items-center gap-1.5 text-zinc-600">
              <MapPin size={14} />
              <span className="text-sm">Lima, Perú</span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={PROFILE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.76a5.2 5.2 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.3 5.3 0 0 0-.1 3.7 5.2 5.2 0 0 0-1.5 3.8c0 5.2 3 6.4 6 6.76a4.8 4.8 0 0 0-1 3.24v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub
              </a>
              <a
                href={PROFILE.links.email}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-zinc-100"
              >
                <Mail size={16} />
                Contacto
              </a>
              <a
                href={PROFILE.links.expo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-accent-500/20 bg-accent-600/10 px-5 py-2.5 text-sm font-medium text-accent-400 transition-all duration-200 hover:border-accent-500/40 hover:bg-accent-600/20"
              >
                <ExternalLink size={16} />
                Expo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
