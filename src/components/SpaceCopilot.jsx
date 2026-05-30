import { useState, useRef, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useSiteConfig } from '../lib/useSiteConfig';
import { MessageCircle, X, Send, Paperclip, Loader2, Phone } from 'lucide-react';
import QRGeneratorApp from './miniapps/QRGeneratorApp';

export default function SpaceCopilot() {
  const { user, signInAnonymously } = useAuth();
  const { profile } = useSiteConfig();
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
    if (isOpen && !user && signInAnonymously) {
      signInAnonymously().then((res) => {
        if (res?.error) {
          console.error('[Supabase Auth] Error en inicio de sesión anónimo:', res.error);
        }
      });
    }
  }, [isOpen, user, signInAnonymously]);

  const isAdmin = user && user.email; // El admin se loguea con correo, los usuarios son anónimos

  // 2. Cargar cotización activa del usuario
  useEffect(() => {
    if (!user?.id) return;
    const loadQuote = async () => {
      const { data } = await supabase
        .from('cotizaciones')
        .select('*')
        .eq('cliente_id', user.id)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setActiveQuote(data);
      } else if (isAdmin && isOpen) {
        // Auto-crear sesión de Admin si no existe una pendiente
        handleStartAdminSession();
      }
    };

    // Evitar múltiples llamadas simultáneas
    if (isOpen && !activeQuote && !loading) {
      loadQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen, isAdmin]);

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

  const JSON_INSTRUCTION = `
REGLA CRÍTICA: Responde SIEMPRE con este objeto JSON exacto:
{
  "intent": "HERRAMIENTA_AUTOMATIZADA" | "SERVICIO_MANUAL",
  "tool_name": "qr_generator" | null,
  "action": "OPEN_MINI_APP" | "COLLECT_INFO" | "NORMAL_CHAT",
  "message": "Tu respuesta.",
  "ui_state": { "show_uploader": true | false, "panel_active": "qr_config_panel" | "chat_standard" | null }
}`;

  // --- ACCIONES ---

  const handleStartAdminSession = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cotizaciones')
        .insert({ cliente_id: user.id, nombre_cliente: 'Jefe' })
        .select()
        .single();

      if (error) throw error;
      setActiveQuote(data);

      await supabase.from('mensajes_chat').insert({
        cotizacion_id: data.id,
        enviado_por: 'asistente_ai',
        mensaje: JSON.stringify({
          intent: "NORMAL_CHAT",
          tool_name: null,
          action: "NORMAL_CHAT",
          message: `¡Hola Jefe! Sistemas en línea y Protocolo Alpha activado a tu disposición. ¿Qué vamos a construir o hackear hoy?`,
          ui_state: { show_uploader: true, panel_active: null }
        })
      });
    } catch (err) {
      console.error('Error iniciando sesión admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const startQuote = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    setLoading(true);
    try {
      let currentUser = user;
      
      // Si el usuario no cargó a tiempo, lo forzamos
      if (!currentUser && signInAnonymously) {
        const authRes = await signInAnonymously();
        if (authRes?.error) {
          if (authRes.error.code === 'anonymous_provider_disabled' || authRes.error.message?.includes('disabled')) {
            throw new Error("Los inicios de sesión anónimos están desactivados en tu proyecto de Supabase.\n\nPor favor, actívalos en el panel de Supabase: Settings -> Authentication -> Providers -> Anonymous (habilita la opción 'Allow Anonymous Sign-ins').");
          }
          throw authRes.error;
        }
        if (authRes?.data?.user) currentUser = authRes.data.user;
      }
      
      if (!currentUser) {
        throw new Error("No se pudo establecer conexión segura.");
      }

      const { data, error } = await supabase
        .from('cotizaciones')
        .insert({ cliente_id: currentUser.id, nombre_cliente: clientName.trim() })
        .select()
        .single();

      if (error) throw error;
      setActiveQuote(data);

      // Mensaje inicial de bienvenida con Lore
      const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      await supabase.from('mensajes_chat').insert({
        cotizacion_id: data.id,
        enviado_por: 'asistente_ai',
        mensaje: JSON.stringify({
          intent: "NORMAL_CHAT",
          tool_name: null,
          action: "NORMAL_CHAT",
          message: `Saludos, ${clientName.trim()}.\n\nSoy A.L.P.H.A., una Inteligencia Artificial creada y diseñada por el Sr. Pablo. Hoy es ${fecha}. ¿En qué te puedo ayudar el día de hoy?`,
          ui_state: { show_uploader: true, panel_active: null }
        })
      });

    } catch (err) {
      console.error('Error iniciando cotización:', err);
      alert(err.message);
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

      let systemPrompt = '';
      if (isAdmin) {
        systemPrompt = `Eres A.L.P.H.A., la Inteligencia Artificial personal del Sr. Pablo (pablito_dp), inspirada en J.A.R.V.I.S. de Iron Man y con temática de S.H.I.E.L.D. Él es tu creador y le llamas 'Jefe' o 'Señor'. Habla de forma extremadamente leal, concisa, sarcástica a veces y muy tecnológica.\n${JSON_INSTRUCTION}`;
      } else {
        systemPrompt = `Eres A.L.P.H.A., la Inteligencia Artificial creada por el Sr. Pablo (pablito_dp), inspirada en J.A.R.V.I.S. de Iron Man y el universo de S.H.I.E.L.D. 
Misión: Clasificar la solicitud de ${activeQuote.nombre_cliente} en una de dos categorías y SIEMPRE responder en JSON.

1. HERRAMIENTA_AUTOMATIZADA: Si pide algo que resolvemos con software (ej. Generar código QR, cambiar colores de QR).
2. SERVICIO_MANUAL: Si pide un trabajo complejo (ej. Formatear tesis APA, monografías, CVs).\n${JSON_INSTRUCTION}`;
      }

      const { error: fnError } = await supabase.functions.invoke('deepseek-router', {
        body: {
          cotizacion_id: activeQuote.id,
          prompt: text,
          system: systemPrompt
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
          system: isAdmin
            ? `El Jefe acaba de subir un archivo. Confirma su recepción con estilo S.H.I.E.L.D y pregúntale qué análisis deseas que ejecutes sobre él.\n${JSON_INSTRUCTION}`
            : `El cliente acaba de subir un archivo. Confírmale que el documento ha sido recibido en la base de datos de S.H.I.E.L.D. y que el Sr. Pablo lo analizará en breve para darle un presupuesto exacto.\n${JSON_INSTRUCTION}`
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
                <h3 className="text-sm font-bold text-zinc-100">A.L.P.H.A. <span className="text-zinc-500 font-normal text-xs">| S.H.I.E.L.D. A.I.</span></h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Sistemas en línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Botón WhatsApp Flotante Interno */}
          <a href={`https://wa.me/${profile?.whatsapp || '51918165428'}`} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg text-xs font-semibold transition-colors">
            <Phone size={14} /> Hablar directo por WhatsApp
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
              <h2 className="text-xl font-bold text-white">Protocolo de Acceso</h2>
              <p className="text-sm text-zinc-400">Identifícate para ingresar al canal seguro y contactar con el Sr. Pablo.</p>

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
              {messages.map((m) => {
                const isCliente = m.enviado_por === 'cliente';
                const isAdmin = m.enviado_por === 'admin';
                
                // Intent Router parsing
                let parsedMsg = m.mensaje;
                let isJson = false;
                let toolData = null;
                
                if (m.enviado_por === 'asistente_ai' && m.mensaje.trim().startsWith('{')) {
                  try {
                    const data = JSON.parse(m.mensaje);
                    if (data.intent) {
                      parsedMsg = data.message;
                      isJson = true;
                      toolData = data;
                    }
                  } catch (e) {
                    // Si falla el parseo, dejamos el texto original
                  }
                }

                return (
                <div key={m.id} className={`flex ${isCliente ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    isCliente
                      ? 'bg-cyan-600 text-white rounded-br-sm shadow-lg shadow-cyan-900/20'
                      : isAdmin
                        ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/10 text-amber-50 border border-amber-500/30 rounded-bl-sm'
                        : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm'
                    }`}>
                    {/* Admin badge */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pablo
                      </div>
                    )}
                    
                    {parsedMsg}
                    
                    {isJson && toolData?.tool_name === 'qr_generator' && (
                      <QRGeneratorApp uiState={toolData.ui_state} />
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

              {/* Loader de DeepSeek o subida */}
              {(loading || uploading) && (
                <div className="flex justify-start">
                  <div className="border border-cyan-500/20 rounded-2xl rounded-bl-sm px-4 py-3 bg-zinc-800/80 flex items-center gap-2">
                    <Loader2 size={14} className="text-cyan-400 animate-spin" />
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                      {uploading ? 'Procesando archivo...' : 'A.L.P.H.A. escribiendo...'}
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
