-- ═══════════════════════════════════════════════════════════════
-- Migración 006: Módulos Dinámicos y limpieza de "Táctico"
-- ═══════════════════════════════════════════════════════════════

-- 1. Agregar columna modules si no existe
ALTER TABLE public.site_config
ADD COLUMN IF NOT EXISTS modules JSONB NOT NULL DEFAULT '[
  {
    "id": "scanner",
    "title": "Escáner",
    "description": "Decodificación y análisis de códigos QR en tiempo real.",
    "url": "/scanner",
    "icon": "ScanLine",
    "isFlashy": false,
    "flashyText": "",
    "flashyColor": "rose",
    "active": true
  },
  {
    "id": "qr",
    "title": "Generador QR",
    "description": "Creación de códigos QR ultra-personalizados y blindados.",
    "url": "/qr",
    "icon": "QrCode",
    "isFlashy": false,
    "flashyText": "",
    "flashyColor": "rose",
    "active": true
  },
  {
    "id": "math",
    "title": "Math Pro",
    "description": "Resolución de polinomios paso a paso con rigor matemático.",
    "url": "/math",
    "icon": "Calculator",
    "isFlashy": false,
    "flashyText": "",
    "flashyColor": "rose",
    "active": true
  },
  {
    "id": "tripticos",
    "title": "Trípticos IA",
    "description": "Generador de trípticos impulsado por DeepSeek V3.",
    "url": "/tripticos",
    "icon": "LayoutTemplate",
    "isFlashy": false,
    "flashyText": "",
    "flashyColor": "rose",
    "active": true
  },
  {
    "id": "golpe",
    "title": "El Golpe",
    "description": "Juego de cartas multijugador en tiempo real con amigos.",
    "url": "/golpe",
    "icon": "Gamepad2",
    "isFlashy": false,
    "flashyText": "",
    "flashyColor": "rose",
    "active": true
  }
]'::jsonb;

-- 2. Limpiar la palabra "Táctico" del tagline por defecto en la tabla site_config
ALTER TABLE public.site_config 
ALTER COLUMN profile SET DEFAULT '{
  "name": "SAMUEL Y. PABLO CLAUDIO",
  "subdomain": "PABLITODP",
  "tagline": "Desarrollador Web & Digital Creator",
  "bio": "Construyo interfaces de alta tecnología y ofrezco servicios digitales precisos.",
  "email": "pabloclsa87@gmail.com",
  "birth": "19-11-2004",
  "gender": "MASCULINO",
  "links": {
    "github": "https://github.com/dppablito4-oss",
    "email": "mailto:pabloclsa87@gmail.com",
    "expo": "https://expo.sypablitodp.site"
  }
}'::jsonb;

-- 3. Actualizar la fila 'main' actual para eliminar "Táctico" y poner la columna modules si está vacía
UPDATE public.site_config
SET 
  profile = jsonb_set(profile, '{tagline}', '"Desarrollador Web & Digital Creator"'::jsonb),
  modules = COALESCE(modules, '[
    {
      "id": "scanner",
      "title": "Escáner",
      "description": "Decodificación y análisis de códigos QR en tiempo real.",
      "url": "/scanner",
      "icon": "ScanLine",
      "isFlashy": false,
      "flashyText": "",
      "flashyColor": "rose",
      "active": true
    },
    {
      "id": "qr",
      "title": "Generador QR",
      "description": "Creación de códigos QR ultra-personalizados y blindados.",
      "url": "/qr",
      "icon": "QrCode",
      "isFlashy": false,
      "flashyText": "",
      "flashyColor": "rose",
      "active": true
    },
    {
      "id": "math",
      "title": "Math Pro",
      "description": "Resolución de polinomios paso a paso con rigor matemático.",
      "url": "/math",
      "icon": "Calculator",
      "isFlashy": false,
      "flashyText": "",
      "flashyColor": "rose",
      "active": true
    },
    {
      "id": "tripticos",
      "title": "Trípticos IA",
      "description": "Generador de trípticos impulsado por DeepSeek V3.",
      "url": "/tripticos",
      "icon": "LayoutTemplate",
      "isFlashy": false,
      "flashyText": "",
      "flashyColor": "rose",
      "active": true
    },
    {
      "id": "golpe",
      "title": "El Golpe",
      "description": "Juego de cartas multijugador en tiempo real con amigos.",
      "url": "/golpe",
      "icon": "Gamepad2",
      "isFlashy": false,
      "flashyText": "",
      "flashyColor": "rose",
      "active": true
    }
  ]'::jsonb)
WHERE id = 'main';
