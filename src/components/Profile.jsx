import { Mail, ExternalLink, MapPin, ArrowDown } from 'lucide-react';
import { PROFILE } from '../data/siteData';
import { trackCTA } from '../lib/analytics';

export default function Profile() {
  return (
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
        </div>
      </div>
    </section>
  );
}
