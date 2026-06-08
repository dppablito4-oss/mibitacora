import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están configurados. ' +
    'Copia .env.example → .env y configura tus credenciales. ' +
    'La app funcionará en modo offline con datos de fallback.'
  );
}

// En dev, lanzar error inmediato para que el desarrollador lo note
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.error(
    '⚠️ [Supabase] Variables de entorno faltantes. La conexión a Supabase fallará. ' +
    'Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

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

// ── Site Config ─────────────────────────────────────────────

/**
 * Obtiene la configuración del sitio (perfil, hobbies, aviso, avatar).
 * @returns {Promise<object>}
 */
export async function getSiteConfig() {
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .eq('id', 'main')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza una sección de la configuración del sitio.
 * @param {Object} updates — campos a actualizar (profile, hobbies, aviso, avatar_url)
 */
export async function updateSiteConfig(updates) {
  const { data, error } = await supabase
    .from('site_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', 'main')
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Sube un avatar a Supabase Storage y retorna la URL pública.
 * @param {File} file — archivo de imagen
 * @returns {Promise<string>} — URL pública del avatar
 */
export async function uploadAvatar(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar-${Date.now()}.${fileExt}`;
  const filePath = `public/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Obtiene el rol del usuario actual.
 * @param {string} userId
 * @returns {Promise<string|null>}
 */
export async function getUserRole(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data?.role || null;
}

