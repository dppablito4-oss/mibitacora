-- ═══════════════════════════════════════════════════════════════
-- Migración 004: Estructura del Juego de Cartas "El Golpe"
-- Ejecutar en: Supabase Dashboard > SQL Editor (o deploy automático)
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. TABLA: PARTIDAS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partidas (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estado           TEXT NOT NULL DEFAULT 'esperando' CHECK (estado IN ('esperando', 'jugando', 'finalizado')),
  max_puntaje      INTEGER NOT NULL DEFAULT 100,
  jugador_turno_id UUID DEFAULT NULL, -- Se enlazará a partida_jugadores(id) después
  fase_turno       TEXT NOT NULL DEFAULT 'robar' CHECK (fase_turno IN ('robar', 'descartar')),
  creador_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ronda            INTEGER NOT NULL DEFAULT 1,
  ganador_id       UUID DEFAULT NULL, -- Apunta al jugador ganador de la partida
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.partidas IS 'Almacena el estado global de cada partida de El Golpe';
COMMENT ON COLUMN public.partidas.estado IS 'esperando = lobby, jugando = partida en curso, finalizado = juego terminado';
COMMENT ON COLUMN public.partidas.max_puntaje IS 'Límite de puntos (ej. 100) para declarar eliminación o derrota';

-- ─── 2. TABLA: PARTIDA_JUGADORES ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.partida_jugadores (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partida_id   UUID NOT NULL REFERENCES public.partidas(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre       TEXT NOT NULL,
  orden_turno  INTEGER NOT NULL DEFAULT 0,
  puntaje      INTEGER NOT NULL DEFAULT 0,
  listo        BOOLEAN NOT NULL DEFAULT false,
  estado       TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'eliminado')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.partida_jugadores IS 'Jugadores conectados a cada partida y su estado';
COMMENT ON COLUMN public.partida_jugadores.orden_turno IS 'Secuencia de turnos (1, 2, 3, 4) en la mesa';
COMMENT ON COLUMN public.partida_jugadores.listo IS 'True si el jugador está preparado para comenzar en el lobby';

-- Añadir constraint de llave foránea para jugador_turno_id en partidas
ALTER TABLE public.partidas 
  ADD CONSTRAINT fk_jugador_turno 
  FOREIGN KEY (jugador_turno_id) 
  REFERENCES public.partida_jugadores(id) 
  ON DELETE SET NULL;

-- ─── 3. TABLA: PARTIDA_CARTAS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partida_cartas (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partida_id             UUID NOT NULL REFERENCES public.partidas(id) ON DELETE CASCADE,
  carta_nombre           TEXT NOT NULL, -- Ej: 'A de Corazones', 'Joker Rojo', '10 de Espadas'
  propietario_jugador_id UUID REFERENCES public.partida_jugadores(id) ON DELETE CASCADE,
  ubicacion              TEXT NOT NULL CHECK (ubicacion IN ('mazo', 'descarte', 'mano', 'jugada')),
  orden                  INTEGER NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.partida_cartas IS 'Fila por carta para el mazo, descarte, manos y juegos en mesa';
COMMENT ON COLUMN public.partida_cartas.propietario_jugador_id IS 'Jugador que sostiene la carta si ubicación = mano o jugada';
COMMENT ON COLUMN public.partida_cartas.ubicacion IS 'Ubicación física de la carta en la partida';
COMMENT ON COLUMN public.partida_cartas.orden IS 'Ordenación de la carta dentro del mazo o pila de descarte';

-- ─── 4. ÍNDICES DE RENDIMIENTO ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_partida_jugadores_partida ON public.partida_jugadores(partida_id);
CREATE INDEX IF NOT EXISTS idx_partida_jugadores_user ON public.partida_jugadores(user_id);
CREATE INDEX IF NOT EXISTS idx_partida_cartas_partida ON public.partida_cartas(partida_id);
CREATE INDEX IF NOT EXISTS idx_partida_cartas_propietario ON public.partida_cartas(propietario_jugador_id);
CREATE INDEX IF NOT EXISTS idx_partida_cartas_ubicacion ON public.partida_cartas(partida_id, ubicacion);

-- ─── 5. ROW LEVEL SECURITY (RLS) ──────────────────────────────
ALTER TABLE public.partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partida_jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partida_cartas ENABLE ROW LEVEL SECURITY;

-- Políticas para Partidas
CREATE POLICY "Lectura pública de partidas"
  ON public.partidas FOR SELECT
  USING (true);

-- Políticas para Jugadores
CREATE POLICY "Lectura pública de jugadores"
  ON public.partida_jugadores FOR SELECT
  USING (true);

-- Políticas para Cartas (Protección total contra espionaje)
CREATE POLICY "Lectura selectiva de cartas"
  ON public.partida_cartas FOR SELECT
  USING (
    ubicacion IN ('descarte', 'jugada')
    OR propietario_jugador_id IN (
      SELECT pj.id FROM public.partida_jugadores pj WHERE pj.user_id = auth.uid()
    )
    OR (
      SELECT p.estado FROM public.partidas p WHERE p.id = partida_id
    ) = 'finalizado'
  );

-- NOTA: Las políticas de INSERT/UPDATE/DELETE no se otorgan para clientes.
-- Todo cambio se realizará mediante funciones con la cláusula SECURITY DEFINER.
