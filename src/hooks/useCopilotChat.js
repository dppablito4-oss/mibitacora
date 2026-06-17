import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import { useToast } from '../context/ToastContext';
import logger from '../utils/logger';

const JSON_INSTRUCTION = `
REGLA CRÍTICA: Responde SIEMPRE con este objeto JSON exacto:
{
  "intent": "HERRAMIENTA_AUTOMATIZADA" | "SERVICIO_MANUAL" | "SYSTEM_MEMORY",
  "tool_name": "qr_generator" | "math_solver" | "triptico_maker" | "save_note" | null,
  "action": "OPEN_MINI_APP" | "COLLECT_INFO" | "NORMAL_CHAT" | "EXECUTE_TOOL",
  "message": "Tu respuesta confirmando la acción.",
  "ui_state": { "show_uploader": true | false, "note_content": "texto exacto a guardar si tool_name es save_note", "panel_active": "qr_config_panel" | "chat_standard" | null }
}`;

export function useCopilotChat({ user, isOpen, signInAnonymously, isAdmin }) {
  const { showToast } = useToast();
  const [activeQuote, setActiveQuote] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingText = 'Escribiendo...';
  const [uploading, setUploading] = useState(false);

  const hasCheckedRef = useRef(false);
  const prevUserIdRef = useRef(user?.id);
  const prevIsAdminRef = useRef(isAdmin);

  if (user?.id !== prevUserIdRef.current || isAdmin !== prevIsAdminRef.current) {
    prevUserIdRef.current = user?.id;
    prevIsAdminRef.current = isAdmin;
    hasCheckedRef.current = false;
  }

  const handleStartAdminSession = useCallback(async () => {
    if (!user?.id) return;
    logger.log('[Copilot] handleStartAdminSession triggered');
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cotizaciones')
        .insert({ cliente_id: user.id, nombre_cliente: 'Jefe' })
        .select()
        .single();

      logger.log('[Copilot] handleStartAdminSession insert result. data:', data, 'error:', error);
      if (error) throw error;
      setActiveQuote(data);

      const msgRes = await supabase.from('mensajes_chat').insert({
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
      logger.log('[Copilot] handleStartAdminSession insert message result:', msgRes);
    } catch (err) {
      logger.error('[Copilot] Error iniciando sesión admin:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 1. Cargar cotización activa del usuario
  useEffect(() => {
    if (!user?.id) return;
    const loadQuote = async () => {
      hasCheckedRef.current = true;
      try {
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
          await handleStartAdminSession();
        }
      } catch (err) {
        logger.error('Error loading quote:', err);
      }
    };

    if (isOpen && !activeQuote && !loading && !hasCheckedRef.current) {
      loadQuote();
    }
  }, [user?.id, activeQuote, isOpen, isAdmin, loading, handleStartAdminSession]);

  const startQuote = async (clientName) => {
    if (!clientName.trim()) return;
    
    // Sanitización: Limitar longitud a 100 caracteres y remover tags HTML
    const cleanName = clientName.trim().slice(0, 100).replace(/<\/?[^>]+(>|$)/g, "");
    if (!cleanName) return;

    // Persistir el nombre sanitizado para rellenar en futuras visitas
    localStorage.setItem('copilot_name', cleanName);

    setLoading(true);
    try {
      let currentUser = user;
      
      if (!currentUser && signInAnonymously) {
        const authRes = await signInAnonymously();
        if (authRes?.error) {
          if (authRes.error.code === 'anonymous_provider_disabled' || authRes.error.message?.includes('disabled')) {
            throw new Error("Los inicios de sesión anónimos están desactivados en tu proyecto de Supabase.");
          }
          throw authRes.error;
        }
        if (authRes?.data?.user) currentUser = authRes.data.user;
      }
      
      if (!currentUser) throw new Error("No se pudo establecer conexión segura.");

      const { data, error } = await supabase
        .from('cotizaciones')
        .insert({ cliente_id: currentUser.id, nombre_cliente: cleanName })
        .select()
        .single();

      if (error) throw error;
      setActiveQuote(data);

      const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      await supabase.from('mensajes_chat').insert({
        cotizacion_id: data.id,
        enviado_por: 'asistente_ai',
        mensaje: JSON.stringify({
          intent: "NORMAL_CHAT",
          tool_name: null,
          action: "NORMAL_CHAT",
          message: `Saludos, ${cleanName}.\n\nSoy A.L.P.H.A., una Inteligencia Artificial creada y diseñada por el Sr. Pablo. Hoy es ${fecha}. ¿En qué te puedo ayudar el día de hoy?`,
          ui_state: { show_uploader: true, panel_active: null }
        })
      });

    } catch (err) {
      logger.error('Error iniciando cotización:', err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading || !activeQuote) return;
    setLoading(true);

    try {
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
      setMessages(prev => [...prev, insertedMsg]);

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
      logger.error('Error enviando mensaje:', err);
      setMessages(prev => [...prev, { id: 'err-' + Date.now(), enviado_por: 'asistente_ai', mensaje: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file || !user || !activeQuote) return;

    // Validación de tipo de archivo
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];
    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Tipo de archivo no permitido. Solo se aceptan PDF, DOC, DOCX, JPG, PNG y WebP.', 'error');
      return;
    }

    // Validación de tamaño (máx 10 MB)
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast(`El archivo excede el límite de ${MAX_SIZE_MB} MB.`, 'error');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos-cotizaciones')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('documentos-cotizaciones')
        .getPublicUrl(filePath);

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
      logger.error('Error subiendo archivo:', err);
      showToast('Error subiendo archivo: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return {
    activeQuote,
    messages,
    loading,
    loadingText,
    uploading,
    startQuote,
    sendMessage,
    uploadFile
  };
}
