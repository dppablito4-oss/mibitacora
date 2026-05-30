import { useState, useEffect, useCallback } from 'react';
import { getSiteConfig } from '../config/supabaseClient';
import { PROFILE } from '../data/siteData';

// Fallback con datos hardcodeados por si Supabase falla
const FALLBACK = {
  profile: { ...PROFILE },
  avatar_url: null,
  hobbies: [],
  aviso: { activo: false, texto: '', link: '', tipo: 'info' },
};

const CACHE_KEY = 'space_site_config';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Hook para cargar la configuración dinámica del sitio desde Supabase.
 * Usa sessionStorage como caché y siteData.js como fallback.
 */
export function useSiteConfig() {
  const [config, setConfig] = useState(() => {
    // Intentar cargar desde caché
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) return data;
      }
    } catch (_) {}
    return FALLBACK;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSiteConfig();
      if (data) {
        // Merge con fallback para campos que puedan faltar
        const merged = {
          profile: { ...FALLBACK.profile, ...(data.profile || {}) },
          avatar_url: data.avatar_url || FALLBACK.avatar_url,
          hobbies: data.hobbies || FALLBACK.hobbies,
          aviso: { ...FALLBACK.aviso, ...(data.aviso || {}) },
        };
        setConfig(merged);
        // Guardar en caché
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: merged,
            timestamp: Date.now(),
          }));
        } catch (_) {}
      }
      setError(null);
    } catch (err) {
      console.warn('[useSiteConfig] Error cargando config, usando fallback:', err.message);
      setError(err.message);
      // Mantener fallback o caché existente
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  /**
   * Fuerza recarga desde Supabase (útil después de editar en admin).
   */
  const refreshConfig = useCallback(() => {
    try { sessionStorage.removeItem(CACHE_KEY); } catch (_) {}
    return loadConfig();
  }, [loadConfig]);

  return {
    profile: config.profile,
    avatarUrl: config.avatar_url,
    hobbies: config.hobbies,
    aviso: config.aviso,
    loading,
    error,
    refreshConfig,
  };
}
