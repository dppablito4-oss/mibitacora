import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSiteConfig } from '../config/supabaseClient';
import { PROFILE } from '../data/siteData';

// ── Fallback: datos locales por si Supabase falla o la red tarda ──
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

const SiteConfigContext = createContext(null);

/**
 * Provider global de la configuración del sitio.
 * Renderiza hijos INMEDIATAMENTE con datos de fallback/caché,
 * y actualiza cuando Supabase responde en segundo plano.
 */
export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    // Intentar cargar desde caché para renderizar de inmediato
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
        const merged = {
          profile: { ...FALLBACK.profile, ...(data.profile || {}) },
          avatar_url: data.avatar_url || FALLBACK.avatar_url,
          hobbies: data.hobbies || FALLBACK.hobbies,
          aviso: { ...FALLBACK.aviso, ...(data.aviso || {}) },
          modules: data.modules || FALLBACK.modules,
        };
        setConfig(merged);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: merged,
            timestamp: Date.now(),
          }));
        } catch { /* ignore */ }
      }
      setError(null);
    } catch (err) {
      console.warn('[SiteConfig] Error cargando config, usando fallback:', err.message);
      setError(err.message);
      // Mantener fallback/caché existente — no crashear la app
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConfig(false);
  }, [loadConfig]);

  const refreshConfig = useCallback(() => {
    try { sessionStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
    return loadConfig(true);
  }, [loadConfig]);

  const value = {
    profile: config.profile,
    avatarUrl: config.avatar_url,
    hobbies: config.hobbies,
    aviso: config.aviso,
    modules: config.modules,
    loading,
    error,
    refreshConfig,
  };

  // IMPORTANTE: Renderizar hijos SIEMPRE, incluso mientras carga.
  // La data tiene fallback/caché, así que nunca estará vacía.
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig debe usarse dentro de <SiteConfigProvider>');
  }
  return ctx;
}
