import { Mail, ExternalLink, MapPin, ArrowDown } from 'lucide-react';
import { PROFILE } from '../data/siteData';
import { trackCTA } from '../lib/analytics';

export default function Profile() {
  return (
<<<<<<< HEAD
    <section id="perfil" className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Hero glow effect */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2">
        <div className="h-[500px] w-[700px] rounded-full bg-accent-600/[0.06] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">
          {/* Avatar */}
          <div className="group relative shrink-0 animate-fade-in">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-500/20 via-transparent to-violet-500/20 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
              {/* Avatar circle */}
              <div className="relative h-32 w-32 overflow-hidden rounded-full border border-zinc-800/80 bg-zinc-900 ring-1 ring-zinc-800/40 ring-offset-2 ring-offset-[#09090b] transition-all duration-500 group-hover:border-accent-500/30 sm:h-36 sm:w-36">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                  <span className="text-5xl font-extralight tracking-tight text-zinc-200 select-none sm:text-6xl">
                    P
                  </span>
                </div>
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/95 px-2.5 py-1 shadow-lg shadow-black/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-semibold text-zinc-500">
                  Open
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Role badge */}
            <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800/60 bg-zinc-900/60 px-3.5 py-1.5 backdrop-blur-sm">
              <Code2 size={12} className="text-accent-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Full-Stack Developer
              </span>
            </div>

            {/* Name */}
            <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl" style={{ animationDelay: '100ms' }}>
              {PROFILE.name}
            </h1>

            {/* Tagline */}
            <p className="animate-fade-up mt-3 text-lg font-normal text-zinc-500 sm:text-xl" style={{ animationDelay: '200ms' }}>
              {PROFILE.tagline}
            </p>

            {/* Bio */}
            <p className="animate-fade-up mt-5 max-w-lg text-[15px] leading-relaxed text-zinc-600" style={{ animationDelay: '300ms' }}>
              {PROFILE.bio}
            </p>

            {/* Location */}
            <div className="animate-fade-up mt-5 flex items-center gap-1.5 text-zinc-700" style={{ animationDelay: '350ms' }}>
              <MapPin size={13} />
              <span className="text-[13px] font-medium">Lima, Perú</span>
            </div>

            {/* CTAs */}
            <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '400ms' }}>
              <a
                href={PROFILE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-zinc-50 px-5 py-2.5 text-[13px] font-semibold text-zinc-900 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:-rotate-6">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                GitHub
              </a>
              <a
                href={PROFILE.links.email}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-[13px] font-medium text-zinc-400 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-zinc-200"
              >
                <Mail size={14} />
                Contacto
              </a>
              <a
                href={PROFILE.links.expo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-[13px] font-medium text-zinc-400 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-zinc-200"
              >
                <ExternalLink size={14} />
                Expo
              </a>
            </div>
          </div>
=======
    <section id="perfil" className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,110,245,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(151,117,250,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Status */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/6 bg-white/3 px-4 py-2">
          <span className="status-dot" />
          <span className="text-xs font-medium text-white/50 tracking-wide">Disponible para proyectos</span>
        </div>

        {/* Name */}
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-gradient">{PROFILE.name}</span>
        </h1>

        {/* Tagline */}
        <p className="mt-5 text-lg font-normal text-white/35 sm:text-xl lg:text-2xl tracking-tight">
          {PROFILE.tagline}
        </p>

        {/* Bio */}
        <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-white/25">
          {PROFILE.bio}
        </p>

        {/* Location */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-white/20">
          <MapPin size={13} />
          <span className="text-xs tracking-wide">Lima, Perú</span>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={PROFILE.links.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('GitHub', PROFILE.links.github)}
            className="inline-flex items-center gap-2.5 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-[1.02]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
          <a
            href={PROFILE.links.email}
            onClick={() => trackCTA('Contacto', PROFILE.links.email)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-6 py-3 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/8 hover:text-white/90 hover:border-white/12"
          >
            <Mail size={15} />
            Contacto
          </a>
          <a
            href={PROFILE.links.expo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('Expo', PROFILE.links.expo)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-6 py-3 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/8 hover:text-white/90 hover:border-white/12"
          >
            <ExternalLink size={15} />
            Expo
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex justify-center">
          <a href="#skills" className="text-white/10 transition-colors hover:text-white/30" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <ArrowDown size={20} />
          </a>
>>>>>>> f1c96d7c0faadf24344cfb05982bef174dc10819
        </div>
      </div>

      {/* Bottom section divider */}
      <div className="mx-auto mt-20 max-w-5xl px-6">
        <div className="section-line" />
      </div>
    </section>
  );
}
