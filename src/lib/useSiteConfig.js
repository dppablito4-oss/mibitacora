import { useState, useEffect, useCallback } from 'react';
import { getSiteConfig } from '../config/supabaseClient';
import { PROFILE } from '../data/siteData';

// Fallback con datos hardcodeados por si Supabase falla
const FALLBACK = {
  profile: { ...PROFILE },
  avatar_url: null,
  hobbies: [],
  aviso: { activo: false, texto: '', link: '', tipo: 'info' },
  modules: [
    {
      id: 'scanner',
      title: 'Escáner',
      description: 'Decodificación y análisis de códigos QR en tiempo real.',
      url: '/scanner',
      icon: 'ScanLine',
      isFlashy: false,
      flashyText: '',
      flashyColor: 'rose',
      active: true
    },
    {
      id: 'qr',
      title: 'Generador QR',
      description: 'Creación de códigos QR ultra-personalizados y blindados.',
      url: '/qr',
      icon: 'QrCode',
      isFlashy: false,
      flashyText: '',
      flashyColor: 'rose',
      active: true
    },
    {
      id: 'math',
      title: 'Math Pro',
      description: 'Resolución de polinomios paso a paso con rigor matemático.',
      url: '/math',
      icon: 'Calculator',
      isFlashy: false,
      flashyText: '',
      flashyColor: 'rose',
      active: true
    },
    {
      id: 'tripticos',
      title: 'Trípticos IA',
      description: 'Generador de trípticos impulsado por DeepSeek V3.',
      url: '/tripticos',
      icon: 'LayoutTemplate',
      isFlashy: false,
      flashyText: '',
      flashyColor: 'rose',
      active: true
    },
    {
      id: 'golpe',
      title: 'El Golpe',
      description: 'Juego de cartas multijugador en tiempo real con amigos.',
      url: '/golpe',
      icon: 'Gamepad2',
      isFlashy: false,
      flashyText: '',
      flashyColor: 'rose',
      active: true
    }
  ]
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
    } catch { /* ignore */ }
    return FALLBACK;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadConfig = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setLoading(true);
      const data = await getSiteConfig();
      if (data) {
        // Merge con fallback para campos que puedan faltar
        const merged = {
          profile: { ...FALLBACK.profile, ...(data.profile || {}) },
          avatar_url: data.avatar_url || FALLBACK.avatar_url,
          hobbies: data.hobbies || FALLBACK.hobbies,
          aviso: { ...FALLBACK.aviso, ...(data.aviso || {}) },
          modules: data.modules || FALLBACK.modules,
        };
        setConfig(merged);
        // Guardar en caché
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: merged,
            timestamp: Date.now(),
          }));
        } catch { /* ignore */ }
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConfig(false);
  }, [loadConfig]);

  /**
   * Fuerza recarga desde Supabase (útil después de editar en admin).
   */
  const refreshConfig = useCallback(() => {
    try { sessionStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
    return loadConfig(true);
  }, [loadConfig]);

  return {
    profile: config.profile,
    avatarUrl: config.avatar_url,
    hobbies: config.hobbies,
    aviso: config.aviso,
    modules: config.modules,
    loading,
    error,
    refreshConfig,
  };
}
