-- ═══════════════════════════════════════════════════════════════
-- Tabla: bitacora
-- Descripción: Almacena entradas de la bitácora personal / blog.
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Crear la tabla
CREATE TABLE IF NOT EXISTS public.bitacora (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  titulo      TEXT NOT NULL,
  contenido   TEXT NOT NULL,
  categoria   TEXT NOT NULL DEFAULT 'general',
  tags        TEXT[] DEFAULT '{}',
  publicado   BOOLEAN DEFAULT false
);

-- Comentarios descriptivos
COMMENT ON TABLE public.bitacora IS 'Bitácora personal — entradas tipo blog/log';
COMMENT ON COLUMN public.bitacora.titulo IS 'Título de la entrada';
COMMENT ON COLUMN public.bitacora.contenido IS 'Contenido completo en markdown';
COMMENT ON COLUMN public.bitacora.categoria IS 'Categoría: general, dev, personal, proyecto';
COMMENT ON COLUMN public.bitacora.tags IS 'Array de etiquetas para filtrado';
COMMENT ON COLUMN public.bitacora.publicado IS 'Si la entrada es visible públicamente';

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_bitacora_created_at ON public.bitacora (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bitacora_categoria ON public.bitacora (categoria);
CREATE INDEX IF NOT EXISTS idx_bitacora_publicado ON public.bitacora (publicado) WHERE publicado = true;

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.bitacora ENABLE ROW LEVEL SECURITY;

-- Lectura pública solo de entradas publicadas
CREATE POLICY "Lectura pública de bitácora"
  ON public.bitacora
  FOR SELECT
  USING (publicado = true);

-- Inserción/actualización solo para usuarios autenticados
CREATE POLICY "Escritura autenticada en bitácora"
  ON public.bitacora
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ═══════════════════════════════════════════════════════════════
-- Tabla: user_logs
-- Descripción: Logs de actividad para analytics internos.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  event       TEXT NOT NULL,
  metadata    JSONB DEFAULT '{}',
  ip_hint     TEXT,
  user_agent  TEXT
);

COMMENT ON TABLE public.user_logs IS 'Logs de actividad del sitio';

CREATE INDEX IF NOT EXISTS idx_user_logs_created_at ON public.user_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_logs_event ON public.user_logs (event);

ALTER TABLE public.user_logs ENABLE ROW LEVEL SECURITY;

-- Solo inserción desde el cliente (anon), sin lectura pública
CREATE POLICY "Inserción anónima de logs"
  ON public.user_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Lectura de logs solo autenticado"
  ON public.user_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');
