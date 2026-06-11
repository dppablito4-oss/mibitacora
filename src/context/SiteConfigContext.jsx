import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSiteConfig, getProjects, getServices, supabase } from '../config/supabaseClient';
import { PROFILE, PROJECTS, SERVICES } from '../data/siteData';

function hexToHSL(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function getAccentVariations(hexColor) {
  try {
    const hsl = hexToHSL(hexColor);
    return {
      c500: hexColor,
      c400: `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(100, hsl.l + 8)}%)`,
      c300: `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(100, hsl.l + 16)}%)`,
    };
  } catch (e) {
    return {
      c500: hexColor,
      c400: hexColor,
      c300: hexColor
    };
  }
}

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
  ],
  section_order: ['expediente', 'modules', 'arsenal', 'proyectos', 'servicios', 'contacto'],
  theme: {
    mode: 'dark',
    bg_color: '#030712',
    card_color: '#0a0f25',
    accent_color: '#06b6d4',
    glow_color: 'rgba(6, 182, 212, 0.15)',
    particles: true
  },
  projects: [...PROJECTS],
  services: [...SERVICES]
};

const CACHE_KEY = 'space_site_config';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
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
      
      const [configData, projectsData, servicesData] = await Promise.allSettled([
        getSiteConfig(),
        getProjects(),
        getServices()
      ]);

      const data = configData.status === 'fulfilled' ? configData.value : null;
      const dbProjects = projectsData.status === 'fulfilled' ? projectsData.value : null;
      const dbServices = servicesData.status === 'fulfilled' ? servicesData.value : null;

      if (data) {
        const merged = {
          profile: { ...FALLBACK.profile, ...(data.profile || {}) },
          avatar_url: data.avatar_url || FALLBACK.avatar_url,
          hobbies: data.hobbies || FALLBACK.hobbies,
          aviso: { ...FALLBACK.aviso, ...(data.aviso || {}) },
          modules: data.modules || FALLBACK.modules,
          section_order: data.section_order || FALLBACK.section_order,
          theme: { ...FALLBACK.theme, ...(data.theme || {}) },
          projects: (dbProjects && dbProjects.length > 0) ? dbProjects : FALLBACK.projects,
          services: (dbServices && dbServices.length > 0) ? dbServices : FALLBACK.services
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const authKey = Object.keys(localStorage).find(
          key => key.startsWith('sb-') && key.endsWith('-auth-token')
        );
        if (authKey && localStorage.getItem(authKey)) {
          // Esperamos a que Supabase recupere o limpie la sesión para tener headers válidos en la petición REST pública
          await supabase.auth.getSession();
        }
      } catch (err) {
        console.warn('[SiteConfig] Error recuperando sesión inicial:', err);
      }
      if (active) {
        loadConfig(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadConfig]);

  // Aplicar variables CSS del tema
  useEffect(() => {
    if (config?.theme) {
      const { mode, bg_color, card_color, accent_color } = config.theme;
      const root = document.documentElement;
      
      const isLight = mode === 'light';
      if (isLight) {
        root.classList.add('light-theme');
      } else {
        root.classList.remove('light-theme');
      }
      
      if (bg_color) root.style.setProperty('--color-dark', bg_color);
      if (card_color) root.style.setProperty('--color-card', card_color);
      if (accent_color) {
        const vars = getAccentVariations(accent_color);
        root.style.setProperty('--color-tesseract-500', vars.c500);
        root.style.setProperty('--color-tesseract-400', vars.c400);
        root.style.setProperty('--color-tesseract-300', vars.c300);
        root.style.setProperty('--color-accent-500', vars.c500);
        root.style.setProperty('--color-accent-400', vars.c400);
      }
    }
  }, [config?.theme]);

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
    sectionOrder: config.section_order,
    theme: config.theme,
    projects: config.projects,
    services: config.services,
    loading,
    error,
    refreshConfig,
  };

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig debe usarse dentro de <SiteConfigProvider>');
  }
  return ctx;
}
