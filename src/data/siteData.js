// ── Datos de perfil ───────────────────────────────────────────
export const PROFILE = {
  name: 'Pablo DP',
  tagline: 'Full-Stack Developer & Digital Creator',
  bio: 'Construyo experiencias digitales que combinan diseño minimalista con tecnología de vanguardia. Especializado en React, Supabase y automatización con IA.',
  avatar: null, // Se generará con un placeholder elegante
  subdomain: 'space.sypablitodp.site',
  links: {
    github: 'https://github.com/dppablito4-oss',
    expo: 'https://expo.sypablitodp.site',
    email: 'mailto:contacto@sypablitodp.site',
  },
};

// ── Experiencia / Habilidades ─────────────────────────────────
export const SKILLS = [
  {
    category: 'Frontend',
    icon: 'Monitor',
    items: ['React', 'Vite', 'Tailwind CSS', 'Next.js'],
  },
  {
    category: 'Backend',
    icon: 'Server',
    items: ['Node.js', 'Supabase', 'PostgreSQL', 'Deno'],
  },
  {
    category: 'IA & APIs',
    icon: 'Brain',
    items: ['DeepSeek', 'OpenAI', 'Edge Functions', 'REST'],
  },
  {
    category: 'DevOps',
    icon: 'GitBranch',
    items: ['Git', 'GitHub Pages', 'Vercel', 'CI/CD'],
  },
];

// ── Proyectos ─────────────────────────────────────────────────
export const PROJECTS = [
  {
    title: 'Pablito Expo',
    description: 'Plataforma de presentaciones con editor canvas profesional, IA integrada y sistema de módulos.',
    tags: ['React', 'Supabase', 'DeepSeek', 'Canvas'],
    url: 'https://expo.sypablitodp.site',
    color: 'from-violet-500/20 to-fuchsia-500/20',
    accent: '#a855f7',
  },
  {
    title: 'Grafiplot',
    description: 'Servicio de impresión digital con landing page premium, dashboard admin y asistente IA Graphita.',
    tags: ['Next.js', 'Supabase', 'Tailwind', 'IA'],
    url: 'https://grafiplot.sypablitodp.site',
    color: 'from-red-500/20 to-orange-500/20',
    accent: '#ef4444',
  },
  {
    title: 'Space',
    description: 'Este mismo sitio — portafolio y bitácora personal con diseño ultra-minimalista y modo oscuro nativo.',
    tags: ['Vite', 'React', 'Tailwind', 'Supabase'],
    url: 'https://space.sypablitodp.site',
    color: 'from-accent-500/20 to-cyan-500/20',
    accent: '#3381ff',
  },
  {
    title: 'I.E.I. N° 090',
    description: 'Sitio institucional educativo con diseño dark mode, dashboard admin y sistema de contenido dinámico.',
    tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    url: '#',
    color: 'from-emerald-500/20 to-teal-500/20',
    accent: '#10b981',
  },
];

// ── Experiencia Profesional ───────────────────────────────────
export const EXPERIENCE = [
  {
    role: 'Desarrollador Full-Stack Independiente',
    period: '2024 — Presente',
    description: 'Diseño y desarrollo de plataformas web completas con arquitectura moderna, integraciones de IA y backends serverless.',
  },
  {
    role: 'Creador de Pablito Expo',
    period: '2025',
    description: 'Editor de presentaciones con canvas interactivo, sistema de módulos y generación automática con DeepSeek.',
  },
];

// ── Navegación ────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Perfil', href: '#perfil' },
  { label: 'Skills', href: '#skills' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Experiencia', href: '#experiencia' },
];
