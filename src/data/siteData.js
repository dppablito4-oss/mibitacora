// ── Datos de perfil ───────────────────────────────────────────
export const PROFILE = {
  name: 'SAMUEL Y. PABLO CLAUDIO',
  birth: '19-11-2004',
  gender: 'MASCULINO',
  tagline: 'Desarrollador Web Táctico & Digital Creator',
  bio: 'Construyo interfaces de alta tecnología y ofrezco servicios digitales precisos.',
  email: 'pabloclsa87@gmail.com',
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
    description: 'Editor interactivo de presentaciones con generación de contenido mediante Inteligencia Artificial (DeepSeek).',
    tags: ['React', 'Canvas', 'IA'],
    url: 'https://expo.sypablitodp.site',
    color: 'from-tesseract-500/20 to-blue-500/20',
    accent: '#06b6d4',
  },
  {
    title: 'Grafiplot',
    description: 'Landing page premium y dashboard de administración para servicio de impresión digital.',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    url: 'https://grafiplotvasquez.lat',
    color: 'from-emerald-500/20 to-teal-500/20',
    accent: '#10b981',
  }
];

// ── Servicios ─────────────────────────────────────────────────
export const SERVICES = [
  {
    title: 'Formateo APA 7ma Edición',
    description: 'Ajuste riguroso de presentaciones, tesis y documentos bajo la normativa APA actual.'
  },
  {
    title: 'Creación de Monografías',
    description: 'Redacción y estructura profesional de monografías para nivel secundario y preuniversitario.'
  },
  {
    title: 'Material Gráfico',
    description: 'Diseño de trípticos, dípticos y material publicitario escolar o de negocios.'
  },
  {
    title: 'Curriculum Vitae (CV)',
    description: 'Diseño y redacción de CVs de alto impacto, modernos y optimizados para entrevistas.'
  }
];

// ── Navegación ────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Protocolo Alpha', href: '#inicio' },
  { label: 'Expediente', href: '#expediente' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Contacto', href: '#contacto' },
];
