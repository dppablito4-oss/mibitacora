import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSiteConfig } from '../lib/useSiteConfig';
import { useCopilotChat } from '../hooks/useCopilotChat';
import { MessageCircle, X, Send, Paperclip, Loader2, Phone } from 'lucide-react';
import QRGeneratorApp from './miniapps/QRGeneratorApp';
import MathSolverApp from './miniapps/MathSolverApp';
import TripticoMakerApp from './miniapps/TripticoMakerApp';

export default function SpaceCopilot() {
  const { user, userRole, signInAnonymously } = useAuth();
  const { profile } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState(() => {
    return localStorage.getItem('copilot_name') || localStorage.getItem('golpe_apodo') || '';
  });
  const [prompt, setPrompt] = useState('');
  
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  const {
    activeQuote,
    messages,
    loading,
    loadingText,
    uploading,
    startQuote,
    sendMessage,
    uploadFile
  } = useCopilotChat({ user, isOpen, signInAnonymously, isAdmin });

  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, loading]);

  const handleStart = (e) => {
    e.preventDefault();
    startQuote(clientName);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      sendMessage(prompt);
      setPrompt('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const botColor = '#06b6d4'; // Cyan táctico

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border border-white/10"
        style={{ background: `linear-gradient(135deg, ${botColor}, ${botColor}88)`, boxShadow: `0 8px 32px ${botColor}40` }}
      >
        {isOpen ? <X size={20} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      <div className={`fixed top-0 right-0 h-full w-[380px] max-w-full z-50 transform transition-transform duration-300 shadow-2xl flex flex-col border-l border-zinc-800 bg-zinc-950 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="p-4 border-b border-zinc-800 shrink-0 bg-zinc-900/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${botColor}, ${botColor}66)` }}>
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">A.L.P.H.A. <span className="text-zinc-500 font-normal text-xs">| S.H.I.E.L.D. A.I.</span></h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Sistemas en línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              <X size={16} />
            </button>
          </div>

          <a href={`https://wa.me/${profile?.whatsapp || '51918165428'}`} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold transition-colors">
            <Phone size={14} /> Hablar directo por WhatsApp
          </a>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 flex flex-col" style={{ scrollbarWidth: 'thin' }}>
          {!activeQuote ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4" style={{ background: `linear-gradient(135deg, ${botColor}, ${botColor}66)`, boxShadow: `0 8px 32px ${botColor}40` }}>
                <MessageCircle size={40} />
              </div>
              <h2 className="text-xl font-bold text-white">Protocolo de Acceso</h2>
              <p className="text-sm text-zinc-400">Identifícate para ingresar al canal seguro y contactar con el Sr. Pablo.</p>

              <form onSubmit={handleStart} className="w-full space-y-3">
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !clientName.trim()}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Comenzar'}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 space-y-4 flex-1">
              {messages.map((m) => {
                const isCliente = m.enviado_por === 'cliente';
                const isAdminMsg = m.enviado_por === 'admin';
                
                let parsedMsg = m.mensaje;
                let toolData = null;
                
                if (m.enviado_por === 'asistente_ai' && m.mensaje.trim().startsWith('{')) {
                  try {
                    const data = JSON.parse(m.mensaje);
                    if (data.intent) {
                      parsedMsg = data.message;
                      toolData = data;
                    }
                  } catch {
                    // Ignorar parseo fallido
                  }
                }

                return (
                <div key={m.id} className={`flex ${isCliente ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    isCliente
                      ? 'bg-cyan-600 text-white rounded-br-sm shadow-lg shadow-cyan-900/20'
                      : isAdminMsg
                        ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/10 text-amber-50 border border-amber-500/30 rounded-bl-sm'
                        : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm'
                    }`}>
                    {isAdminMsg && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pablo
                      </div>
                    )}
                    
                    {parsedMsg}
                    
                    {toolData && toolData.tool_name === 'qr_generator' && (
                      <QRGeneratorApp uiState={toolData.ui_state} />
                    )}
                    {toolData && toolData.tool_name === 'math_solver' && (
                      <MathSolverApp uiState={toolData.ui_state} />
                    )}
                    {toolData && toolData.tool_name === 'triptico_maker' && (
                      <TripticoMakerApp uiState={toolData.ui_state} />
                    )}

                    {m.archivo_url && (
                      <a href={m.archivo_url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-xs font-semibold underline text-blue-200 hover:text-white truncate">
                        🔗 Ver documento
                      </a>
                    )}
                  </div>
                </div>
                );
              })}

              {(loading || uploading) && (
                <div className="flex justify-start">
                  <div className="border border-cyan-500/20 rounded-2xl rounded-bl-sm px-4 py-3 bg-zinc-800/80 flex items-center gap-2">
                    <Loader2 size={14} className="text-cyan-400 animate-spin" />
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                      {uploading ? 'Procesando archivo...' : loadingText}
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {activeQuote && (
          <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 shrink-0 backdrop-blur-md">
            <form onSubmit={handleSend} className="relative flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || uploading}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-colors shrink-0 disabled:opacity-50"
                title="Adjuntar Documento"
              >
                <Paperclip size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />

              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder="Describe tu solicitud..."
                disabled={loading || uploading}
                rows={1}
                className="flex-1 max-h-32 bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-200 text-sm resize-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50 transition-all placeholder:text-zinc-600"
              />

              <button
                type="submit"
                disabled={!prompt.trim() || loading || uploading}
                className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl disabled:opacity-30 transition-all shrink-0 shadow-lg shadow-cyan-600/20"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
