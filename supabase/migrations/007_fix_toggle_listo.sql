-- ═══════════════════════════════════════════════════════════════
-- Migración 007: Fix toggle_listo RPC + Realtime Publication
-- ═══════════════════════════════════════════════════════════════

-- 1. RPC: Toggle Listo (reemplaza el UPDATE directo que RLS bloquea)
CREATE OR REPLACE FUNCTION public.toggle_listo(p_partida_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_jugador_id UUID;
  v_current_listo BOOLEAN;
  v_new_listo BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado.';
  END IF;

  -- Buscar jugador en esta partida
  SELECT id, listo INTO v_jugador_id, v_current_listo
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id AND user_id = v_user_id;

  IF v_jugador_id IS NULL THEN
    RAISE EXCEPTION 'No eres jugador de esta partida.';
  END IF;

  -- Validar que la partida esté en estado esperando
  IF NOT EXISTS (SELECT 1 FROM public.partidas WHERE id = p_partida_id AND estado = 'esperando') THEN
    RAISE EXCEPTION 'La partida ya comenzó o finalizó.';
  END IF;

  v_new_listo := NOT v_current_listo;

  UPDATE public.partida_jugadores
  SET listo = v_new_listo
  WHERE id = v_jugador_id;

  RETURN v_new_listo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Verificar que Realtime publication incluya las tablas del juego
-- (Supabase necesita publicar los cambios para que los clientes los reciban)
-- Si la publicación "supabase_realtime" ya existe, agregar las tablas.
-- Si no existe, las tablas deben añadirse manualmente en Dashboard > Database > Replication.
DO $$
BEGIN
  -- Intentar agregar las tablas a la publicación de Realtime
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.partidas;
  EXCEPTION WHEN duplicate_object THEN
    NULL; -- Ya está agregada
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.partida_jugadores;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.partida_cartas;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  RAISE NOTICE 'Tablas de juego agregadas a supabase_realtime publication ✓';
END $$;
