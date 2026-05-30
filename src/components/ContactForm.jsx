import { useState } from 'react';
import { Send, CheckCircle, Mail } from 'lucide-react';
import { useScrollAnimation, scrollAnimClass } from '../lib/useScrollAnimation';
import { trackEvent } from '../lib/analytics';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    try {
      trackEvent('contact_submit', { name, email });
      const mailto = `mailto:pabloclsa87@gmail.com?subject=Contacto desde Space — ${encodeURIComponent(name)}&body=${encodeURIComponent(`De: ${name} (${email})\n\n${message}`)}`;
      window.open(mailto, '_blank');
      setSent(true);
      setName(''); setEmail(''); setMessage('');
      setTimeout(() => setSent(false), 5000);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const inputClass = "w-full rounded-xl border border-white/6 bg-white/3 py-3 px-4 text-sm text-white/80 placeholder:text-white/15 focus:border-accent-500/30 focus:outline-none focus:ring-1 focus:ring-accent-500/10 transition-all";

  return (
    <section id="contacto" className="relative py-28">
      <div className="section-divider mx-auto max-w-5xl mb-28" />
      <div ref={ref} className={`mx-auto max-w-5xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/25 mb-3">Contacto</p>
          <h2 className="text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
            Hablemos
          </h2>
          <p className="mt-3 text-sm text-white/25 max-w-md">
            ¿Tienes un proyecto en mente? Escríbeme.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <a href="mailto:pabloclsa87@gmail.com" className="card p-5 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-accent-500/8 flex items-center justify-center text-accent-400/50 group-hover:text-accent-400/80 transition-colors">
                <Mail size={17} />
              </div>
              <div>
                <p className="text-xs text-white/25 mb-0.5">Email</p>
                <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">pabloclsa87@gmail.com</p>
              </div>
            </a>

            <a href="https://github.com/dppablito4-oss" target="_blank" rel="noopener noreferrer" className="card p-5 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center text-white/30 group-hover:text-white/60 transition-colors">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </div>
              <div>
                <p className="text-xs text-white/25 mb-0.5">GitHub</p>
                <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">dppablito4-oss</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 card p-7 space-y-4">
            {sent && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 px-4 py-3 text-xs text-emerald-400/70">
                <CheckCircle size={14} /> Mensaje listo. Revisa tu correo.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-medium text-white/25 mb-2 tracking-wide">Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required className={inputClass} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-white/25 mb-2 tracking-wide">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-white/25 mb-2 tracking-wide">Mensaje</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Cuéntame sobre tu proyecto..." required rows={4} className={`${inputClass} resize-none`} />
            </div>

            <button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:shadow-xl hover:shadow-white/10 hover:scale-[1.01] disabled:opacity-50">
              <Send size={15} /> {sending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
