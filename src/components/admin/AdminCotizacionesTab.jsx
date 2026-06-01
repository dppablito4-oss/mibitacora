import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabaseClient';
import {
  MessageCircle, Send, User, Bot,
  ChevronRight, FileText, Loader2, ExternalLink,
  Zap, Search
} from 'lucide-react';

const ESTADOS = {
  pendiente: { label: 'Pendiente', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  en_progreso: { label: 'En Progreso', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  finalizado: { label: 'Finalizado', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
};

export default function AdminCotizacionesTab() {
  // ── State ──
  const [cotizaciones, setCotizaciones] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replyMode, setReplyMode] = useState('admin'); // 'admin' | 'bot'
  const [sending, setSending] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [filterEstado, setFilterEstado] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadMap, setUnreadMap] = useState({}); // { cotizacion_id: count }
  const endRef = useRef(null);

  const selected = cotizaciones.find(c => c.id === selectedId);

  // ── 1. Load all cotizaciones ──
  useEffect(() => {
    const loadCotizaciones = async () => {
      const { data, error } = await supabase
        .from('cotizaciones')
        .select('*, mensajes_chat(mensaje, enviado_por, created_at, archivo_url)')
        .order('created_at', { ascending: false });
      if (!error && data) {
        // Sort by last message date
        const sorted = data.sort((a, b) => {
          const lastA = a.mensajes_chat?.length ? new Date(a.mensajes_chat[a.mensajes_chat.length - 1].created_at) : new Date(a.created_at);
          const lastB = b.mensajes_chat?.length ? new Date(b.mensajes_chat[b.mensajes_chat.length - 1].created_at) : new Date(b.created_at);
          return lastB - lastA;
        });
        setCotizaciones(sorted);
      }
    };
    loadCotizaciones();

    // Realtime: new cotizaciones
    const channel = supabase.channel('admin_cotizaciones')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cotizaciones' }, (payload) => {
        setCotizaciones(prev => [{ ...payload.new, mensajes_chat: [] }, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cotizaciones' }, (payload) => {
        setCotizaciones(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── 2. Realtime for ALL new messages (to update sidebar) ──
  useEffect(() => {
    const globalMsgChannel = supabase.channel('admin_all_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes_chat' }, (payload) => {
        const msg = payload.new;
        // Update last message in sidebar
        setCotizaciones(prev => {
          const updated = prev.map(c => {
            if (c.id === msg.cotizacion_id) {
              return { ...c, mensajes_chat: [...(c.mensajes_chat || []), msg] };
            }
            return c;
          });
          // Re-sort by last activity
          return updated.sort((a, b) => {
            const lastA = a.mensajes_chat?.length ? new Date(a.mensajes_chat[a.mensajes_chat.length - 1].created_at) : new Date(a.created_at);
            const lastB = b.mensajes_chat?.length ? new Date(b.mensajes_chat[b.mensajes_chat.length - 1].created_at) : new Date(b.created_at);
            return lastB - lastA;
          });
        });

        // Track unread if not the active chat
        if (msg.cotizacion_id !== selectedId && msg.enviado_por === 'cliente') {
          setUnreadMap(prev => ({ ...prev, [msg.cotizacion_id]: (prev[msg.cotizacion_id] || 0) + 1 }));
        }

        // If this message belongs to the active chat, add it
        if (msg.cotizacion_id === selectedId) {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(globalMsgChannel); };
  }, [selectedId]);

  // ── 3. Load messages when selecting a cotización ──
  useEffect(() => {
    if (!selectedId) return;
    const loadMessages = async () => {
      setLoadingMsgs(true);
      const { data } = await supabase
        .from('mensajes_chat')
        .select('*')
        .eq('cotizacion_id', selectedId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoadingMsgs(false);
    };
    loadMessages();

    // Clear unread for this chat
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnreadMap(prev => { const n = { ...prev }; delete n[selectedId]; return n; });
  }, [selectedId]);

  // ── Auto-scroll ──
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Actions ──
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedId || sending) return;
    const text = replyText.trim();
    setReplyText('');
    setSending(true);

    try {
      if (replyMode === 'admin') {
        // Direct admin message
        await supabase.from('mensajes_chat').insert({
          cotizacion_id: selectedId,
          enviado_por: 'admin',
          mensaje: text
        });
      } else {
        // Ask bot to respond with instruction
        await supabase.functions.invoke('deepseek-router', {
          body: {
            cotizacion_id: selectedId,
            prompt: text,
            system: `Eres A.L.P.H.A., IA de S.H.I.E.L.D. El Sr. Pablo (admin) te da esta instrucción interna sobre cómo responder al cliente. NO repitas la instrucción, simplemente genera la respuesta al cliente basándote en lo que Pablo te indica. Sé profesional, educado y usa el estilo de S.H.I.E.L.D. La instrucción de Pablo es: "${text}"`
          }
        });
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setSending(false);
    }
  };

  const handleChangeEstado = async (cotId, nuevoEstado) => {
    await supabase.from('cotizaciones').update({ estado: nuevoEstado }).eq('id', cotId);
    setCotizaciones(prev => prev.map(c => c.id === cotId ? { ...c, estado: nuevoEstado } : c));
  };

  // ── Helpers ──
  const formatTime = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  };

  const getLastMessage = (cot) => {
    const msgs = cot.mensajes_chat || [];
    if (!msgs.length) return 'Sin mensajes';
    const last = msgs[msgs.length - 1];
    const prefix = last.enviado_por === 'cliente' ? '' : last.enviado_por === 'admin' ? 'Tú: ' : 'IA: ';
    const text = last.mensaje?.substring(0, 60) || '';
    return prefix + text + (last.mensaje?.length > 60 ? '...' : '');
  };

  const getLastTime = (cot) => {
    const msgs = cot.mensajes_chat || [];
    if (!msgs.length) return formatTime(cot.created_at);
    return formatTime(msgs[msgs.length - 1].created_at);
  };

  const filteredCotizaciones = cotizaciones.filter(c => {
    if (filterEstado !== 'todas' && c.estado !== filterEstado) return false;
    if (searchTerm && !c.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0);

  return (
    <div className="flex h-[calc(100vh-180px)] rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/60">

      {/* ════════ LEFT: Conversations List ════════ */}
      <div className={`${selectedId ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[360px] border-r border-zinc-800 bg-zinc-900/80`}>

        {/* Search & Filters */}
        <div className="p-4 border-b border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <MessageCircle size={16} className="text-accent-400" />
              Cotizaciones
              {totalUnread > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-bold animate-pulse">{totalUnread}</span>
              )}
            </h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-accent-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Estado filters */}
          <div className="flex gap-1 flex-wrap">
            {['todas', 'pendiente', 'en_progreso', 'finalizado'].map(f => (
              <button
                key={f}
                onClick={() => setFilterEstado(f)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  filterEstado === f
                    ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border border-transparent'
                }`}
              >
                {f === 'todas' ? 'Todas' : ESTADOS[f]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {filteredCotizaciones.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-sm">
              <MessageCircle size={32} className="mb-2 opacity-30" />
              <p>Sin cotizaciones</p>
            </div>
          ) : (
            filteredCotizaciones.map(cot => {
              const estado = ESTADOS[cot.estado] || ESTADOS.pendiente;
              const isActive = cot.id === selectedId;
              const unread = unreadMap[cot.id] || 0;

              return (
                <button
                  key={cot.id}
                  onClick={() => setSelectedId(cot.id)}
                  className={`w-full text-left p-4 border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/50 ${
                    isActive ? 'bg-accent-600/10 border-l-2 border-l-accent-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                        <User size={14} className="text-zinc-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-200 truncate">{cot.nombre_cliente}</span>
                          {unread > 0 && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-cyan-500 text-white rounded-full font-bold">{unread}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate max-w-[200px]">{getLastMessage(cot)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-zinc-600">{getLastTime(cot)}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${estado.color}`}>
                        {estado.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ════════ RIGHT: Chat Panel ════════ */}
      <div className={`${selectedId ? 'flex' : 'hidden lg:flex'} flex-col flex-1 bg-zinc-950`}>

        {!selected ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
              <MessageCircle size={36} className="text-zinc-700" />
            </div>
            <p className="text-sm font-medium">Selecciona una cotización</p>
            <p className="text-xs text-zinc-700 mt-1">Los chats aparecerán en tiempo real</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Back button on mobile */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
                  <User size={16} className="text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200">{selected.nombre_cliente}</h3>
                  <p className="text-[10px] text-zinc-500">ID: {selected.id?.substring(0, 8)}...</p>
                </div>
              </div>

              {/* Estado selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selected.estado}
                  onChange={e => handleChangeEstado(selected.id, e.target.value)}
                  className="text-[11px] rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 focus:outline-none focus:border-accent-500/50 cursor-pointer"
                >
                  <option value="pendiente">⏳ Pendiente</option>
                  <option value="en_progreso">🔄 En Progreso</option>
                  <option value="finalizado">✅ Finalizado</option>
                </select>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
              {loadingMsgs ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={20} className="animate-spin text-accent-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                  Sin mensajes aún
                </div>
              ) : (
                messages.map(m => {
                  const isCliente = m.enviado_por === 'cliente';
                  const isAdmin = m.enviado_por === 'admin';
                  const isAI = m.enviado_por === 'asistente_ai';

                  return (
                    <div key={m.id} className={`flex ${isCliente ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isCliente
                          ? 'bg-cyan-600/15 text-cyan-100 border border-cyan-500/20 rounded-bl-sm'
                          : isAdmin
                            ? 'bg-accent-600/15 text-accent-100 border border-accent-500/30 rounded-br-sm'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-br-sm'
                      }`}>
                        {/* Sender label */}
                        <div className={`flex items-center gap-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wider ${
                          isCliente ? 'text-cyan-400' : isAdmin ? 'text-accent-400' : 'text-emerald-400'
                        }`}>
                          {isCliente && <><User size={10} /> Cliente</>}
                          {isAdmin && <><Zap size={10} /> Pablo (Admin)</>}
                          {isAI && <><Bot size={10} /> A.L.P.H.A.</>}
                        </div>

                        <div className="whitespace-pre-line">{m.mensaje}</div>

                        {/* File attachment */}
                        {m.archivo_url && (
                          <a
                            href={m.archivo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
                          >
                            <FileText size={12} /> Ver documento <ExternalLink size={10} />
                          </a>
                        )}

                        {/* Timestamp */}
                        <div className="text-[9px] text-zinc-600 mt-1.5 text-right">
                          {new Date(m.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>

            {/* Reply Area */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 shrink-0 space-y-3">

              {/* Mode toggle */}
              <div className="flex items-center gap-1 bg-zinc-800/80 rounded-xl p-1">
                <button
                  onClick={() => setReplyMode('admin')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    replyMode === 'admin'
                      ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Zap size={12} /> Responder como Pablo
                </button>
                <button
                  onClick={() => setReplyMode('bot')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    replyMode === 'bot'
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Bot size={12} /> Que responda la IA
                </button>
              </div>

              {/* Hint */}
              <p className="text-[10px] text-zinc-600 px-1">
                {replyMode === 'admin'
                  ? '💬 Tu mensaje se enviará directamente al cliente como "Pablo"'
                  : '🤖 Escribe instrucciones para la IA (ej: "Dile que el precio es S/50")'
                }
              </p>

              {/* Input */}
              <form onSubmit={handleSendReply} className="flex items-end gap-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(e); } }}
                  placeholder={replyMode === 'admin' ? 'Escribe tu respuesta...' : 'Instrucción para la IA...'}
                  disabled={sending}
                  rows={2}
                  className="flex-1 max-h-24 bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-200 text-sm resize-none focus:border-accent-500/50 focus:outline-none focus:ring-1 focus:ring-accent-500/20 disabled:opacity-50 transition-all placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className={`p-3 rounded-xl text-white disabled:opacity-30 transition-all shrink-0 shadow-lg ${
                    replyMode === 'admin'
                      ? 'bg-accent-600 hover:bg-accent-500 shadow-accent-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  }`}
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
