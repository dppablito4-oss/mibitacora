import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, X, Send, Paperclip, Loader2, Phone } from 'lucide-react';

export default function SpaceCopilot() {
  const { user, signInAnonymously } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // States
  const [clientName, setClientName] = useState('');
  const [activeQuote, setActiveQuote] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Iniciar sesión anónima automáticamente al abrir si no hay usuario
  useEffect(() => {
    if (isOpen && !user) {
      signInAnonymously?.();
    }
  }, [isOpen, user, signInAnonymously]);

  // 2. Cargar cotización activa del usuario
  useEffect(() => {
    if (!user?.id) return;
    const loadQuote = async () => {
      const { data, error } = await supabase
        .from('cotizaciones')
        .select('*')
        .eq('cliente_id', user.id)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setActiveQuote(data);
    };
    loadQuote();
  }, [user]);

  // 3. Suscribirse a mensajes_chat en tiempo real
  useEffect(() => {
    if (!activeQuote) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('mensajes_chat')
        .select('*')
        .eq('cotizacion_id', activeQuote.id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    loadMessages();

    // Suscripción Realtime
    const channel = supabase.channel(`chat_${activeQuote.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes_chat', filter: `cotizacion_id=eq.${activeQuote.id}` },
        (payload) => {
          setMessages((prev) => {
            // Evitar duplicados si el propio cliente ya lo insertó (a veces Realtime lo recibe muy rápido)
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeQuote]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, loading]);

  // --- ACCIONES ---

  const startQuote = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cotizaciones')
        .insert({ cliente_id: user.id, nombre_cliente: clientName.trim() })
        .select()
        .single();
      
      if (error) throw error;
      setActiveQuote(data);
      
      // Mensaje inicial de bienvenida
      await supabase.from('mensajes_chat').insert({
        cotizacion_id: data.id,
        enviado_por: 'asistente_ai',
        mensaje: `¡Hola ${clientName.trim()}! 👋 Soy P.A.B.L.O., el asistente virtual táctico. \n\n¿En qué te puedo ayudar hoy? ¿Buscas formateo APA, redactar una monografía, o diseño gráfico? Cuéntame los detalles o adjunta tus documentos.`
      });
      
    } catch (err) {
      console.error('Error iniciando cotización:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading || !activeQuote) return;
    
    const text = prompt.trim();
    setPrompt('');
    setLoading(true);

    try {
      // 1. Insertar el mensaje del cliente en BD
      const { data: insertedMsg, error: insertError } = await supabase
        .from('mensajes_chat')
        .insert({
          cotizacion_id: activeQuote.id,
          enviado_por: 'cliente',
          mensaje: text
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Actualizamos UI localmente por rapidez (Realtime también lo mandará, pero ya tenemos validación de duplicados)
      setMessages(prev => [...prev, insertedMsg]);

      // 2. Llamar a la Edge Function para que DeepSeek responda
      const { error: fnError } = await supabase.functions.invoke('deepseek-router', {
        body: { 
          cotizacion_id: activeQuote.id, 
          prompt: text,
          system: `Eres P.A.B.L.O., el Asistente Virtual Táctico de Samuel Pablo DP. Ayudas a los clientes a cotizar servicios como: Formateo APA 7ma Edición, Creación de Monografías, Material Gráfico y CVs. Eres conciso, amable, altamente persuasivo, y utilizas un tono táctico militar ligero pero muy profesional. El cliente se llama ${activeQuote.nombre_cliente}. NO des precios exactos altos, siempre diles que un agente humano revisará el documento para dar la cotización final, pero anímalos a subir sus archivos aquí mismo.`
        }
      });

      if (fnError) throw fnError;

    } catch (err) {
      console.error('Error enviando mensaje:', err);
      // Mensaje local de error
      setMessages(prev => [...prev, { id: 'err', role: 'asistente_ai', mensaje: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user || !activeQuote) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      // Nombre único con timestamp para evitar colisiones
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documentos-cotizaciones')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('documentos-cotizaciones')
        .getPublicUrl(filePath);
        
      // Insertar mensaje indicando que se subió un archivo
      const { data: insertedMsg, error: msgError } = await supabase
        .from('mensajes_chat')
        .insert({
          cotizacion_id: activeQuote.id,
          enviado_por: 'cliente',
          mensaje: `📄 Archivo subido exitosamente: ${file.name}`,
          archivo_url: urlData.publicUrl
        })
        .select()
        .single();
        
      if (msgError) throw msgError;
      
      setMessages(prev => [...prev, insertedMsg]);
      
      // Que la IA reaccione al archivo
      await supabase.functions.invoke('deepseek-router', {
        body: { 
          cotizacion_id: activeQuote.id, 
          prompt: `He subido el archivo: ${file.name}`,
          system: `El cliente acaba de subir un archivo. Confírmale que el documento ha sido recibido en el sistema seguro y que el equipo (o Pablo) lo revisará en breve para darle un presupuesto exacto.`
        }
      });

    } catch (err) {
      console.error('Error subiendo archivo:', err);
      alert('Error subiendo archivo: ' + err.message);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  // --- UI ---

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
                <h3 className="text-sm font-bold text-zinc-100">P.A.B.L.O. <span className="text-zinc-500 font-normal text-xs">| Asistente Táctico</span></h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> En línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              <X size={16} />
            </button>
          </div>
          
          {/* Botón WhatsApp Flotante Interno */}
          <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold transition-colors">
            <Phone size={14} /> Hablar directo con Pablo
          </a>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 flex flex-col" style={{ scrollbarWidth: 'thin' }}>
          
          {/* PANTALLA INICIAL (Pedir nombre) */}
          {!activeQuote ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4" style={{ background: `linear-gradient(135deg, ${botColor}, ${botColor}66)`, boxShadow: `0 8px 32px ${botColor}40` }}>
                <MessageCircle size={40} />
              </div>
              <h2 className="text-xl font-bold text-white">Iniciar Cotización</h2>
              <p className="text-sm text-zinc-400">Dime tu nombre o alias para comenzar la sesión y subir tus documentos.</p>
              
              <form onSubmit={startQuote} className="w-full space-y-3">
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
            
            /* PANTALLA DE CHAT */
            <div className="p-4 space-y-4 flex-1">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.enviado_por === 'cliente' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    m.enviado_por === 'cliente' 
                      ? 'bg-cyan-600 text-white rounded-br-sm shadow-lg shadow-cyan-900/20' 
                      : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm'
                  }`}>
                    {m.mensaje}
                    {m.archivo_url && (
                      <a href={m.archivo_url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-xs font-semibold underline text-blue-200 hover:text-white truncate">
                        🔗 Ver documento
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loader de DeepSeek o subida */}
              {(loading || uploading) && (
                <div className="flex justify-start">
                  <div className="border border-cyan-500/20 rounded-2xl rounded-bl-sm px-4 py-3 bg-zinc-800/80 flex items-center gap-2">
                    <Loader2 size={14} className="text-cyan-400 animate-spin" />
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                      {uploading ? 'Subiendo archivo...' : 'P.A.B.L.O. escribiendo...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input Area (Solo visible si hay cotización activa) */}
        {activeQuote && (
          <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 shrink-0 backdrop-blur-md">
            <form onSubmit={sendMessage} className="relative flex items-end gap-2">
              
              {/* Botón Adjuntar Archivo */}
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
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }} 
                placeholder="Describe tu solicitud..." 
                disabled={loading || uploading} 
                rows={1} 
                className="flex-1 max-h-32 bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-zinc-200 text-sm resize-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50 transition-all placeholder:text-zinc-600" 
              />
              
              {/* Botón Enviar */}
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
