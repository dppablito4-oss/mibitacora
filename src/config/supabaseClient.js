import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridos. ' +
    'Copia .env.example → .env y configura tus credenciales.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Llama a la Edge Function `deepseek-router` de forma segura.
 * @param {string} prompt — El mensaje del usuario
 * @returns {Promise<object>} — La respuesta de DeepSeek
 */
export async function queryDeepSeek(prompt) {
  const { data, error } = await supabase.functions.invoke('deepseek-router', {
    body: { prompt },
  });

  if (error) throw new Error(error.message || 'Error al contactar DeepSeek');
  return data;
}

/**
 * Inserta un registro en la tabla bitácora.
 * @param {{ titulo: string, contenido: string, categoria: string }} entry
 */
export async function insertBitacora({ titulo, contenido, categoria }) {
  const { data, error } = await supabase
    .from('bitacora')
    .insert([{ titulo, contenido, categoria }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Obtiene los registros de la bitácora, ordenados por fecha.
 * @param {number} limit
 */
export async function getBitacora(limit = 20) {
  const { data, error } = await supabase
    .from('bitacora')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
