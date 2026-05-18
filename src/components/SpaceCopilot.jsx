import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, X, Send, Trash2, Plus, ChevronDown } from 'lucide-react';

const PERSONALITIES = {
  catedratico: { id: 'catedratico', emoji: '🎓', name: 'Catedrático', color: '#3b82f6' },
  brayan: { id: 'brayan', emoji: '🧢', name: 'El Brayan', color: '#a855f7' },
  motivador: { id: 'motivador', emoji: '🚀', name: 'Motivador', color: '#f59e0b' },
  cientifico: { id: 'cientifico', emoji: '⚛️', name: 'Científico', color: '#10b981' },
};

const MAX_CHATS = 5;
const MAX_MSGS = 20;
const MAX_CHARS = 500;

function newChat(name) {
  return { id: Date.now().toString(), title: 'Nuevo Chat', messages: [{ role: 'assistant', text: `¡Hola, ${name}! Soy P.A.B.L.O. ¿En qué te ayudo?` }], createdAt: Date.now() };
}

export default function SpaceCopilot() {
  const { user } = useAuth();
  const name = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Visitante';
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState('catedratico');
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showList, setShowList] = useState(false);
  const endRef = useRef(null);
  const key = useCallback(uid => `space_chats_${uid}`, []);

  useEffect(() => {
    if (!user?.id) { setChats([]); setActiveId(null); return; }
    try { const s = JSON.parse(localStorage.getItem(key(user.id))); if (s?.length) { setChats(s); setActiveId(s[0].id); return; } } catch (_) {}
    const c = newChat(name); setChats([c]); setActiveId(c.id);
  }, [user?.id]);

  useEffect(() => { if (user?.id && chats.length) localStorage.setItem(key(user.id), JSON.stringify(chats)); }, [chats, user?.id]);
  useEffect(() => { if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chats, loading, isOpen, activeId]);

  const chat = chats.find(c => c.id === activeId);
  const msgs = chat?.messages || [];

  const addMsg = (msg) => setChats(p => p.map(c => {
    if (c.id !== activeId) return c;
    const m = [...c.messages, msg].slice(-MAX_MSGS);
    const fu = m.find(x => x.role === 'user');
    return { ...c, messages: m, title: fu ? fu.text.slice(0, 30) + (fu.text.length > 30 ? '…' : '') : c.title };
  }));

  const send = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    const txt = prompt.trim().slice(0, MAX_CHARS);
    setPrompt(''); addMsg({ role: 'user', text: txt }); setLoading(true);
    try {
      const hist = msgs.slice(-10).map(m => ({ role: m.role, content: m.text }));
      const p = PERSONALITIES[personality];
      const { data, error } = await supabase.functions.invoke('deepseek-router', {
        body: { prompt: txt, system: `Eres P.A.B.L.O., asistente virtual en Space (bitácora de Pablo DP). Personalidad: "${p.name}". Usuario: "${name}". Responde conciso y útil en español.`, temperature: 0.7, max_tokens: 1500 }
      });
      if (error) throw new Error(error.message);
      addMsg({ role: 'assistant', text: data?.reply || data?.error || 'Sin respuesta' });
    } catch (err) { addMsg({ role: 'assistant', text: `❌ ${err.message}` }); }
    finally { setLoading(false); }
  };

  if (!user) return null;
  const p = PERSONALITIES[personality];

  return (<>
    <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border border-white/10" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}88)`, boxShadow: `0 8px 32px ${p.color}40` }}>
      {isOpen ? <X size={20} className="text-white" /> : <span className="text-2xl">{p.emoji}</span>}
    </button>

    {isOpen && <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

    <div className={`fixed top-0 right-0 h-full w-[380px] max-w-full z-50 transform transition-transform duration-300 shadow-2xl flex flex-col border-l border-zinc-800 bg-zinc-950 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 shrink-0 bg-zinc-900/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}66)` }}>{p.emoji}</div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">P.A.B.L.O. <span className="text-zinc-500 font-normal text-xs">| {p.name}</span></h3>
              <p className="text-[10px] text-zinc-600">Asistente de Space</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowList(!showList)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"><ChevronDown size={16} className={showList ? 'rotate-180 transition-transform' : 'transition-transform'} /></button>
            <button onClick={() => { const c = newChat(name); setChats(prev => [c, ...prev].slice(0, MAX_CHATS)); setActiveId(c.id); setShowList(false); }} className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"><Plus size={16} /></button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"><X size={16} /></button>
          </div>
        </div>
        {showList && (
          <div className="mt-3 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
            {chats.map(c => (
              <div key={c.id} onClick={() => { setActiveId(c.id); setShowList(false); }} className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer border-b border-zinc-900/50 last:border-0 ${c.id === activeId ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:bg-zinc-800/50'}`}>
                <span className="truncate flex-1"><MessageCircle size={12} className="inline mr-2" />{c.title}</span>
                <button onClick={(e) => { e.stopPropagation(); setChats(prev => { const u = prev.filter(x => x.id !== c.id); if (!u.length) { const f = newChat(name); setActiveId(f.id); return [f]; } if (c.id === activeId) setActiveId(u[0].id); return u; }); }} className="ml-2 text-zinc-700 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personalities */}
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/40 flex gap-1.5 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
        {Object.values(PERSONALITIES).map(pe => (
          <button key={pe.id} onClick={() => { setPersonality(pe.id); addMsg({ role: 'assistant', text: `*${pe.emoji} ${pe.name} activado*` }); }} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${personality === pe.id ? 'bg-zinc-800 text-zinc-100 border border-zinc-600' : 'text-zinc-600 hover:bg-zinc-800/50 border border-transparent'}`}>
            <span>{pe.emoji}</span><span>{pe.name}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col" style={{ scrollbarWidth: 'thin' }}>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-accent-600 text-white rounded-br-sm' : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/40 rounded-bl-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="border border-accent-500/20 rounded-2xl rounded-bl-sm px-4 py-3 bg-zinc-900/80 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] text-accent-400 uppercase tracking-widest font-mono">Pensando...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 shrink-0">
        <form onSubmit={send} className="relative">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value.slice(0, MAX_CHARS))} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(e); } }} placeholder="Escribe tu mensaje..." disabled={loading} rows={2} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 pr-12 text-zinc-200 text-xs resize-none focus:border-accent-500/60 focus:outline-none focus:ring-1 focus:ring-accent-500/30 disabled:opacity-50 transition-all placeholder:text-zinc-600" />
          <span className="absolute bottom-2.5 left-3 text-[9px] text-zinc-700 font-mono">{prompt.length}/{MAX_CHARS}</span>
          <button type="submit" disabled={!prompt.trim() || loading} className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-accent-600 hover:bg-accent-500 text-white disabled:opacity-30 transition-all"><Send size={14} /></button>
        </form>
      </div>
    </div>
  </>);
}
