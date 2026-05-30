-- ═══════════════════════════════════════════════════════════════
-- Migración 002: Admin CMS Dinámico
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. PROFILES ─────────────────────────────────────────────
-- Reemplaza el email hardcodeado por roles en BD.
-- Cada usuario autenticado obtiene un perfil automáticamente.

CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con roles para control de acceso';
COMMENT ON COLUMN public.profiles.role IS 'user = visitante, admin = editor, superadmin = acceso total';

-- Trigger: crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger existente si hay uno
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Cada usuario puede leer su propio perfil
CREATE POLICY "Lectura de perfil propio"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Solo superadmin puede modificar roles
CREATE POLICY "Superadmin modifica perfiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Índice para búsquedas por role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);


-- ─── 2. SITE_CONFIG ──────────────────────────────────────────
-- Una sola fila con toda la configuración editable del sitio.
-- Diseño key-value con JSONB para máxima flexibilidad.

CREATE TABLE IF NOT EXISTS public.site_config (
  id         TEXT PRIMARY KEY DEFAULT 'main',
  profile    JSONB NOT NULL DEFAULT '{
    "name": "SAMUEL Y. PABLO CLAUDIO",
    "subdomain": "PABLITODP",
    "tagline": "Desarrollador Web Táctico & Digital Creator",
    "bio": "Construyo interfaces de alta tecnología y ofrezco servicios digitales precisos.",
    "email": "pabloclsa87@gmail.com",
    "birth": "19-11-2004",
    "gender": "MASCULINO",
    "links": {
      "github": "https://github.com/dppablito4-oss",
      "email": "mailto:pabloclsa87@gmail.com",
      "expo": "https://expo.sypablitodp.site"
    }
  }'::jsonb,
  avatar_url TEXT DEFAULT NULL,
  hobbies    JSONB NOT NULL DEFAULT '[]'::jsonb,
  aviso      JSONB NOT NULL DEFAULT '{
    "activo": false,
    "texto": "",
    "link": "",
    "tipo": "info"
  }'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.site_config IS 'Configuración dinámica del sitio — editable desde admin';
COMMENT ON COLUMN public.site_config.profile IS 'Datos del perfil personal (nombre, bio, links, etc.)';
COMMENT ON COLUMN public.site_config.avatar_url IS 'URL de la foto de perfil en Supabase Storage';
COMMENT ON COLUMN public.site_config.hobbies IS 'Array de hobbies: [{emoji, name, description}]';
COMMENT ON COLUMN public.site_config.aviso IS 'Banner/aviso activo: {activo, texto, link, tipo}';

-- Insertar fila inicial si no existe
INSERT INTO public.site_config (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- RLS para site_config
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el frontend necesita estos datos)
CREATE POLICY "Lectura pública de site_config"
  ON public.site_config FOR SELECT
  USING (true);

-- Solo superadmin puede modificar
CREATE POLICY "Superadmin modifica site_config"
  ON public.site_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );


-- ─── 3. ACTUALIZAR RLS DE BITÁCORA (si la tabla existe) ─────
-- Restringir escritura a superadmin (antes cualquier autenticado podía)
-- Si no has ejecutado 001_create_bitacora.sql, sáltate esta sección.

DO $$
BEGIN
  -- Solo ejecutar si la tabla bitacora existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bitacora') THEN
    -- Eliminar política anterior si existe
    DROP POLICY IF EXISTS "Escritura autenticada en bitácora" ON public.bitacora;

    -- Crear nueva política restrictiva
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bitacora' AND policyname = 'Superadmin gestiona bitácora') THEN
      CREATE POLICY "Superadmin gestiona bitácora"
        ON public.bitacora FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
          )
        );
    END IF;

    RAISE NOTICE 'Políticas de bitácora actualizadas ✓';
  ELSE
    RAISE NOTICE 'Tabla bitacora no existe — omitiendo actualización de políticas. Ejecuta 001_create_bitacora.sql primero.';
  END IF;
END $$;


-- ─── 4. CONFIGURAR TU USUARIO COMO SUPERADMIN ───────────────
-- IMPORTANTE: Ejecuta esto DESPUÉS de registrar tu cuenta.
-- Reemplaza el email con el tuyo si es diferente.

-- Opción A: Por email (más fácil)
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = 'pabloclsa87@gmail.com';

-- Si el trigger no creó el perfil aún, insertarlo manualmente:
-- INSERT INTO public.profiles (id, email, role)
-- SELECT id, email, 'superadmin'
-- FROM auth.users
-- WHERE email = 'pabloclsa87@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'superadmin';


-- ═══════════════════════════════════════════════════════════════
-- NOTA: Crear el bucket de Storage manualmente:
-- Supabase Dashboard > Storage > New Bucket
-- Nombre: "avatars"
-- Público: SÍ (para que la URL de la foto sea accesible)
--
-- Luego agregar esta política en Storage > avatars > Policies:
-- Policy name: "Superadmin upload"
-- Allowed operation: INSERT, UPDATE, DELETE
-- Policy: (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'))
--
-- Policy name: "Public read"
-- Allowed operation: SELECT
-- Policy: true
-- ═══════════════════════════════════════════════════════════════
