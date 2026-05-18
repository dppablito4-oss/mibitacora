import { useState } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
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
      // Track the contact event
      trackEvent('contact_submit', { name, email });

      // Open mailto as fallback (you can replace with an Edge Function later)
      const mailtoLink = `mailto:pabloclsa87@gmail.com?subject=Contacto desde Space — ${encodeURIComponent(name)}&body=${encodeURIComponent(`De: ${name} (${email})\n\n${message}`)}`;
      window.open(mailtoLink, '_blank');

      setSent(true);
      setName(''); setEmail(''); setMessage('');
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="relative py-24">
      <div ref={ref} className={`mx-auto max-w-6xl px-6 ${scrollAnimClass(isVisible, 'up')}`}>
        {/* Header */}
        <div className="mb-14">
          <span className="mb-2 inline-block font-mono text-xs font-medium uppercase tracking-widest text-accent-400">
            Get In Touch
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Contacto
          </h2>
          <p className="mt-3 max-w-md text-zinc-500">
            ¿Tienes un proyecto en mente? Hablemos.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Info */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7">
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">Conectemos</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Estoy disponible para proyectos freelance, colaboraciones y oportunidades interesantes. Si tienes una idea, escríbeme.
              </p>
              <div className="space-y-3">
                <a href="mailto:pabloclsa87@gmail.com" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-accent-400 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-accent-600/10 flex items-center justify-center">
                    <Mail size={16} className="text-accent-400" />
                  </div>
                  pabloclsa87@gmail.com
                </a>
                <a href="https://github.com/dppablito4-oss" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-accent-400 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-accent-600/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-400"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.76a5.2 5.2 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.3 5.3 0 0 0-.1 3.7 5.2 5.2 0 0 0-1.5 3.8c0 5.2 3 6.4 6 6.76a4.8 4.8 0 0 0-1 3.24v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </div>
                  github.com/dppablito4-oss
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 space-y-5">
            {sent && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs text-emerald-400">
                <CheckCircle size={16} /> ¡Mensaje listo! Revisa tu cliente de correo.
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Nombre</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Mensaje</label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-zinc-600" />
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Cuéntame sobre tu proyecto..."
                  required rows={4}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent-600 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-500 hover:shadow-lg hover:shadow-accent-500/20 disabled:opacity-50"
            >
              <Send size={16} /> {sending ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
