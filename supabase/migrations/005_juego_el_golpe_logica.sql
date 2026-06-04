-- ═══════════════════════════════════════════════════════════════
-- Migración 005: Funciones y Lógica del Juego "El Golpe"
-- Ejecutar en: Supabase Dashboard > SQL Editor (o deploy automático)
-- ═══════════════════════════════════════════════════════════════

-- Helper: Calcular el valor en puntos de una carta al final de la ronda
CREATE OR REPLACE FUNCTION public.calcular_valor_carta(carta_nombre TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_prefix TEXT;
BEGIN
  IF carta_nombre LIKE 'Joker%' THEN
    RETURN 20; -- Comodín penaliza con 20 puntos
  END IF;

  -- Extraer la primera parte antes de ' de '
  v_prefix := split_part(carta_nombre, ' de ', 1);

  IF v_prefix IN ('K', 'Q', 'J', '10') THEN
    RETURN 10;
  ELSIF v_prefix = 'A' THEN
    RETURN 11;
  ELSE
    -- Retorna el valor numérico (2 al 9)
    RETURN COALESCE(nullif(regexp_replace(v_prefix, '[^0-9]', '', 'g'), '')::INTEGER, 0);
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;


-- Helper: Reciclar la pila de descartes al mazo cuando este se vacía
CREATE OR REPLACE FUNCTION public.reciclar_descarte(p_partida_id UUID)
RETURNS VOID AS $$
DECLARE
  v_top_descarte_id UUID;
BEGIN
  -- Encontrar la carta superior del descarte (la de mayor orden)
  SELECT id INTO v_top_descarte_id
  FROM public.partida_cartas
  WHERE partida_id = p_partida_id AND ubicacion = 'descarte'
  ORDER BY orden DESC
  LIMIT 1;

  -- Actualizar todas las otras cartas de descarte al mazo con orden aleatorio
  UPDATE public.partida_cartas
  SET ubicacion = 'mazo',
      orden = (random() * 1000000)::INTEGER
  WHERE partida_id = p_partida_id 
    AND ubicacion = 'descarte'
    AND id <> v_top_descarte_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Crear Partida
CREATE OR REPLACE FUNCTION public.crear_partida(p_nombre TEXT, p_max_puntaje INTEGER)
RETURNS UUID AS $$
DECLARE
  v_partida_id UUID;
  v_jugador_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado. Inicie sesión (incluso anónima) primero.';
  END IF;

  -- 1. Crear partida
  INSERT INTO public.partidas (estado, max_puntaje, creador_id)
  VALUES ('esperando', p_max_puntaje, v_user_id)
  RETURNING id INTO v_partida_id;

  -- 2. Insertar al creador como jugador 1
  INSERT INTO public.partida_jugadores (partida_id, user_id, nombre, orden_turno, listo)
  VALUES (v_partida_id, v_user_id, p_nombre, 1, true)
  RETURNING id INTO v_jugador_id;

  RETURN v_partida_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Unirse a Partida
CREATE OR REPLACE FUNCTION public.unirse_a_partida(p_partida_id UUID, p_nombre TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_jugador_id UUID;
  v_next_orden INTEGER;
  v_active_partida_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado.';
  END IF;

  -- 1. Validar restricción de partida única activa
  SELECT p.id INTO v_active_partida_id
  FROM public.partida_jugadores pj
  JOIN public.partidas p ON pj.partida_id = p.id
  WHERE pj.user_id = v_user_id AND p.estado IN ('esperando', 'jugando') AND p.id <> p_partida_id
  LIMIT 1;

  IF v_active_partida_id IS NOT NULL THEN
    RAISE EXCEPTION 'ACT_GAME_EXIST:%', v_active_partida_id;
  END IF;

  -- 2. Validar estado de la partida destino
  IF NOT EXISTS (SELECT 1 FROM public.partidas WHERE id = p_partida_id AND estado = 'esperando') THEN
    RAISE EXCEPTION 'La partida no existe o ya ha comenzado.';
  END IF;

  -- 3. Validar límite de jugadores (Max 4)
  SELECT COALESCE(MAX(orden_turno), 0) INTO v_next_orden
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id;

  IF v_next_orden >= 4 THEN
    RAISE EXCEPTION 'La partida está llena (máximo 4 jugadores).';
  END IF;

  -- 4. Si el usuario ya está en esta misma partida, retornar su ID existente
  SELECT id INTO v_jugador_id
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id AND user_id = v_user_id;

  IF v_jugador_id IS NOT NULL THEN
    RETURN v_jugador_id;
  END IF;

  -- 5. Insertar nuevo jugador
  INSERT INTO public.partida_jugadores (partida_id, user_id, nombre, orden_turno, listo)
  VALUES (p_partida_id, v_user_id, p_nombre, v_next_orden + 1, false)
  RETURNING id INTO v_jugador_id;

  RETURN v_jugador_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Abandonar Partida
CREATE OR REPLACE FUNCTION public.abandonar_partida(p_partida_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_jugador_id UUID;
  v_estado_partida TEXT;
  v_creador_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  SELECT id INTO v_jugador_id
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id AND user_id = v_user_id;

  IF v_jugador_id IS NULL THEN
    RETURN;
  END IF;

  SELECT estado, creador_id INTO v_estado_partida, v_creador_id
  FROM public.partidas
  WHERE id = p_partida_id;

  -- Eliminar jugador
  DELETE FROM public.partida_jugadores WHERE id = v_jugador_id;

  -- Si no quedan jugadores, eliminar partida por completo
  IF NOT EXISTS (SELECT 1 FROM public.partida_jugadores WHERE partida_id = p_partida_id) THEN
    DELETE FROM public.partidas WHERE id = p_partida_id;
    RETURN;
  END IF;

  -- Si la partida ya estaba jugando, finalizarla inmediatamente (abandono causa fin de juego)
  IF v_estado_partida = 'jugando' THEN
    UPDATE public.partidas
    SET estado = 'finalizado',
        ganador_id = (SELECT id FROM public.partida_jugadores WHERE partida_id = p_partida_id LIMIT 1)
    WHERE id = p_partida_id;
  ELSE
    -- Si estaba esperando, reordenar orden_turno
    WITH reordenar AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY orden_turno) as nuevo_orden
      FROM public.partida_jugadores
      WHERE partida_id = p_partida_id
    )
    UPDATE public.partida_jugadores pj
    SET orden_turno = r.nuevo_orden
    FROM reordenar r
    WHERE pj.id = r.id;

    -- Si el creador se fue, asignar la partida a otro jugador
    IF v_creador_id = v_user_id THEN
      UPDATE public.partidas
      SET creador_id = (SELECT user_id FROM public.partida_jugadores WHERE partida_id = p_partida_id LIMIT 1)
      WHERE id = p_partida_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Iniciar Partida / Barajar y Repartir Ronda
CREATE OR REPLACE FUNCTION public.iniciar_partida(p_partida_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_num_jugadores INTEGER;
  v_num_listos INTEGER;
  v_jugador_row RECORD;
  v_carta_id UUID;
  v_carta_index INTEGER := 1;
  
  -- Estructura de baraja inglesa de 54 cartas
  v_palos TEXT[] := ARRAY['Corazones', 'Diamantes', 'Treboles', 'Espadas'];
  v_valores TEXT[] := ARRAY['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  v_palo TEXT;
  v_valor TEXT;
BEGIN
  v_user_id := auth.uid();

  -- 1. Validar que el creador sea quien inicia
  IF NOT EXISTS (SELECT 1 FROM public.partidas WHERE id = p_partida_id AND creador_id = v_user_id) THEN
    RAISE EXCEPTION 'Solo el creador de la sala puede iniciar la partida.';
  END IF;

  -- 2. Validar jugadores mínimos (2) y que todos estén listos
  SELECT COUNT(*), COUNT(*) FILTER (WHERE listo = true)
  INTO v_num_jugadores, v_num_listos
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id;

  IF v_num_jugadores < 2 THEN
    RAISE EXCEPTION 'Se requieren mínimo 2 jugadores para iniciar.';
  END IF;

  IF v_num_jugadores <> v_num_listos THEN
    RAISE EXCEPTION 'Todos los jugadores deben estar listos.';
  END IF;

  -- 3. Limpiar cartas viejas si existieran (ej. ronda anterior)
  DELETE FROM public.partida_cartas WHERE partida_id = p_partida_id;

  -- 4. Crear mazo (52 cartas regulares + 2 jokers)
  FOREACH v_palo IN ARRAY v_palos LOOP
    FOREACH v_valor IN ARRAY v_valores LOOP
      INSERT INTO public.partida_cartas (partida_id, carta_nombre, ubicacion, orden)
      VALUES (p_partida_id, v_valor || ' de ' || v_palo, 'mazo', 0);
    END LOOP;
  END LOOP;

  INSERT INTO public.partida_cartas (partida_id, carta_nombre, ubicacion, orden) VALUES (p_partida_id, 'Joker Rojo', 'mazo', 0);
  INSERT INTO public.partida_cartas (partida_id, carta_nombre, ubicacion, orden) VALUES (p_partida_id, 'Joker Negro', 'mazo', 0);

  -- 5. Barajar aleatoriamente usando random()
  WITH mazo_barajado AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY random()) as nuevo_orden
    FROM public.partida_cartas
    WHERE partida_id = p_partida_id
  )
  UPDATE public.partida_cartas c
  SET orden = m.nuevo_orden
  FROM mazo_barajado m
  WHERE c.id = m.id;

  -- 6. Repartir 7 cartas a cada jugador
  FOR v_jugador_row IN 
    SELECT id FROM public.partida_jugadores WHERE partida_id = p_partida_id ORDER BY orden_turno
  LOOP
    -- Repartir 7 cartas por jugador
    UPDATE public.partida_cartas
    SET propietario_jugador_id = v_jugador_row.id,
        ubicacion = 'mano'
    WHERE id IN (
      SELECT id FROM public.partida_cartas
      WHERE partida_id = p_partida_id AND ubicacion = 'mazo'
      ORDER BY orden ASC
      LIMIT 7
    );
  END LOOP;

  -- 7. Poner primera carta en el descarte
  SELECT id INTO v_carta_id
  FROM public.partida_cartas
  WHERE partida_id = p_partida_id AND ubicacion = 'mazo'
  ORDER BY orden ASC
  LIMIT 1;

  UPDATE public.partida_cartas
  SET ubicacion = 'descarte', orden = 1
  WHERE id = v_carta_id;

  -- 8. Actualizar cantidad de cartas de todos los jugadores en la mesa
  -- (Aunque el cliente puede contar las filas, esto sirve de caché rápido y gatillo de Realtime)
  -- Nota: num_cartas no existe físicamente en partida_jugadores pero se puede calcular en queries o mantener en el cliente.
  -- Para mantenerlo super simple, el cliente puede consultar y contar cartas de su propia mano, 
  -- y para rivales, la vista pública contará las cartas que cada jugador tiene asociadas.

  -- 9. Definir turno inicial aleatorio
  UPDATE public.partidas
  SET estado = 'jugando',
      fase_turno = 'robar',
      jugador_turno_id = (
        SELECT id FROM public.partida_jugadores
        WHERE partida_id = p_partida_id
        ORDER BY random()
        LIMIT 1
      )
  WHERE id = p_partida_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Robar Carta
CREATE OR REPLACE FUNCTION public.robar_carta(p_partida_id UUID, p_origen TEXT)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_jugador_id UUID;
  v_carta_id UUID;
  v_estado_partida TEXT;
  v_turno_id UUID;
  v_fase TEXT;
BEGIN
  v_user_id := auth.uid();

  -- Obtener información de turno
  SELECT estado, jugador_turno_id, fase_turno 
  INTO v_estado_partida, v_turno_id, v_fase
  FROM public.partidas
  WHERE id = p_partida_id;

  -- Validaciones básicas
  IF v_estado_partida <> 'jugando' THEN
    RAISE EXCEPTION 'La partida no está activa.';
  END IF;

  IF v_fase <> 'robar' THEN
    RAISE EXCEPTION 'No es fase de robo de carta.';
  END IF;

  -- Obtener ID del jugador
  SELECT id INTO v_jugador_id
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id AND user_id = v_user_id;

  IF v_jugador_id <> v_turno_id THEN
    RAISE EXCEPTION 'No es tu turno de juego.';
  END IF;

  IF p_origen = 'mazo' THEN
    -- Buscar carta superior del mazo (menor orden)
    SELECT id INTO v_carta_id
    FROM public.partida_cartas
    WHERE partida_id = p_partida_id AND ubicacion = 'mazo'
    ORDER BY orden ASC
    LIMIT 1;

    -- Si se vacía el mazo, reciclar descarte e intentar de nuevo
    IF v_carta_id IS NULL THEN
      PERFORM public.reciclar_descarte(p_partida_id);
      
      SELECT id INTO v_carta_id
      FROM public.partida_cartas
      WHERE partida_id = p_partida_id AND ubicacion = 'mazo'
      ORDER BY orden ASC
      LIMIT 1;
      
      IF v_carta_id IS NULL THEN
        RAISE EXCEPTION 'No quedan cartas en el mazo ni en el descarte.';
      END IF;
    END IF;

  ELSIF p_origen = 'descarte' THEN
    -- Buscar carta superior del descarte (mayor orden)
    SELECT id INTO v_carta_id
    FROM public.partida_cartas
    WHERE partida_id = p_partida_id AND ubicacion = 'descarte'
    ORDER BY orden DESC
    LIMIT 1;

    IF v_carta_id IS NULL THEN
      RAISE EXCEPTION 'La pila de descarte está vacía.';
    END IF;
  ELSE
    RAISE EXCEPTION 'Origen de robo inválido.';
  END IF;

  -- Asignar carta a la mano del jugador
  UPDATE public.partida_cartas
  SET propietario_jugador_id = v_jugador_id,
      ubicacion = 'mano',
      orden = 0
  WHERE id = v_carta_id;

  -- Cambiar fase a descarte
  UPDATE public.partidas
  SET fase_turno = 'descartar'
  WHERE id = p_partida_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Descartar Carta
CREATE OR REPLACE FUNCTION public.descartar_carta(p_partida_id UUID, p_carta_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_jugador_id UUID;
  v_estado_partida TEXT;
  v_turno_id UUID;
  v_fase TEXT;
  v_max_orden_descarte INTEGER;
  v_next_orden_turno INTEGER;
  v_next_jugador_id UUID;
  v_current_orden_turno INTEGER;
BEGIN
  v_user_id := auth.uid();

  -- Obtener info de la partida
  SELECT estado, jugador_turno_id, fase_turno 
  INTO v_estado_partida, v_turno_id, v_fase
  FROM public.partidas
  WHERE id = p_partida_id;

  IF v_estado_partida <> 'jugando' THEN
    RAISE EXCEPTION 'La partida no está activa.';
  END IF;

  IF v_fase <> 'descartar' THEN
    RAISE EXCEPTION 'No es fase de descarte.';
  END IF;

  -- Validar jugador
  SELECT id, orden_turno INTO v_jugador_id, v_current_orden_turno
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id AND user_id = v_user_id;

  IF v_jugador_id <> v_turno_id THEN
    RAISE EXCEPTION 'No es tu turno de juego.';
  END IF;

  -- Validar que la carta pertenece a su mano
  IF NOT EXISTS (
    SELECT 1 FROM public.partida_cartas 
    WHERE id = p_carta_id AND partida_id = p_partida_id AND propietario_jugador_id = v_jugador_id AND ubicacion = 'mano'
  ) THEN
    RAISE EXCEPTION 'La carta seleccionada no está en tu mano.';
  END IF;

  -- Obtener el índice mayor en la pila de descartes
  SELECT COALESCE(MAX(orden), 0) INTO v_max_orden_descarte
  FROM public.partida_cartas
  WHERE partida_id = p_partida_id AND ubicacion = 'descarte';

  -- Mover carta al descarte
  UPDATE public.partida_cartas
  SET propietario_jugador_id = NULL,
      ubicacion = 'descarte',
      orden = v_max_orden_descarte + 1
  WHERE id = p_carta_id;

  -- Determinar siguiente jugador por orden_turno
  SELECT id INTO v_next_jugador_id
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id AND orden_turno > v_current_orden_turno AND estado = 'activo'
  ORDER BY orden_turno ASC
  LIMIT 1;

  -- Si no hay jugador con orden mayor, dar la vuelta al primer jugador activo
  IF v_next_jugador_id IS NULL THEN
    SELECT id INTO v_next_jugador_id
    FROM public.partida_jugadores
    WHERE partida_id = p_partida_id AND estado = 'activo'
    ORDER BY orden_turno ASC
    LIMIT 1;
  END IF;

  -- Actualizar partida para el siguiente turno
  UPDATE public.partidas
  SET jugador_turno_id = v_next_jugador_id,
      fase_turno = 'robar'
  WHERE id = p_partida_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Declarar Golpe (Cerrar ronda)
CREATE OR REPLACE FUNCTION public.golpear(p_partida_id UUID, p_carta_descarte_id UUID)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_jugador_id UUID;
  v_estado_partida TEXT;
  v_turno_id UUID;
  v_fase TEXT;
  
  v_max_orden_descarte INTEGER;
  v_max_puntaje_limite INTEGER;
  v_jugador_row RECORD;
  v_ronda_score INTEGER;
  
  v_ganador_final_id UUID;
  v_min_score INTEGER;
BEGIN
  v_user_id := auth.uid();

  -- Obtener info de partida
  SELECT estado, jugador_turno_id, fase_turno, max_puntaje 
  INTO v_estado_partida, v_turno_id, v_fase, v_max_puntaje_limite
  FROM public.partidas
  WHERE id = p_partida_id;

  IF v_estado_partida <> 'jugando' THEN
    RAISE EXCEPTION 'La partida no está activa.';
  END IF;

  IF v_fase <> 'descartar' THEN
    RAISE EXCEPTION 'Debes robar primero antes de poder golpear.';
  END IF;

  -- Validar jugador
  SELECT id INTO v_jugador_id
  FROM public.partida_jugadores
  WHERE partida_id = p_partida_id AND user_id = v_user_id;

  IF v_jugador_id <> v_turno_id THEN
    RAISE EXCEPTION 'No es tu turno para golpear.';
  END IF;

  -- Validar que la carta de descarte final está en su mano
  IF NOT EXISTS (
    SELECT 1 FROM public.partida_cartas 
    WHERE id = p_carta_descarte_id AND partida_id = p_partida_id AND propietario_jugador_id = v_jugador_id AND ubicacion = 'mano'
  ) THEN
    RAISE EXCEPTION 'La carta de descarte final no está en tu mano.';
  END IF;

  -- 1. Descartar la última carta
  SELECT COALESCE(MAX(orden), 0) INTO v_max_orden_descarte
  FROM public.partida_cartas
  WHERE partida_id = p_partida_id AND ubicacion = 'descarte';

  UPDATE public.partida_cartas
  SET propietario_jugador_id = NULL,
      ubicacion = 'descarte',
      orden = v_max_orden_descarte + 1
  WHERE id = p_carta_descarte_id;

  -- 2. Calcular y acumular puntajes para cada jugador activo
  FOR v_jugador_row IN 
    SELECT id, puntaje FROM public.partida_jugadores WHERE partida_id = p_partida_id AND estado = 'activo'
  LOOP
    -- Si es el jugador que golpeó, su puntuación de mano es 0
    IF v_jugador_row.id = v_jugador_id THEN
      v_ronda_score := 0;
    ELSE
      -- Sumar el valor de todas las cartas en su mano privada
      SELECT COALESCE(SUM(public.calcular_valor_carta(carta_nombre)), 0)
      INTO v_ronda_score
      FROM public.partida_cartas
      WHERE partida_id = p_partida_id 
        AND propietario_jugador_id = v_jugador_row.id 
        AND ubicacion = 'mano';
    END IF;

    -- Actualizar puntaje acumulado
    UPDATE public.partida_jugadores
    SET puntaje = puntaje + v_ronda_score
    WHERE id = v_jugador_row.id;
  END LOOP;

  -- 3. Eliminar jugadores que superaron el puntaje límite
  UPDATE public.partida_jugadores
  SET estado = 'eliminado'
  WHERE partida_id = p_partida_id AND puntaje >= v_max_puntaje_limite;

  -- 4. Comprobar si el juego termina o continúa
  -- Termina si solo queda un jugador activo, o si todos menos uno volaron
  IF (SELECT COUNT(*) FROM public.partida_jugadores WHERE partida_id = p_partida_id AND estado = 'activo') <= 1 THEN
    -- Declarar ganador final al que tiene menos puntaje entre todos
    SELECT id INTO v_ganador_final_id
    FROM public.partida_jugadores
    WHERE partida_id = p_partida_id
    ORDER BY estado DESC, puntaje ASC -- Prioriza activos, luego menor puntaje
    LIMIT 1;

    UPDATE public.partidas
    SET estado = 'finalizado',
        ganador_id = v_ganador_final_id
    WHERE id = p_partida_id;

  ELSE
    -- El juego continúa: Preparar siguiente ronda
    UPDATE public.partidas
    SET ronda = ronda + 1
    WHERE id = p_partida_id;

    -- Llamar a iniciar_partida nuevamente para barajar y repartir la nueva ronda
    -- Para que funcione, ponemos a todos los jugadores activos listos de nuevo
    UPDATE public.partida_jugadores
    SET listo = true
    WHERE partida_id = p_partida_id AND estado = 'activo';

    -- Volver a ejecutar el setup de cartas (barajar y repartir)
    -- bypass temporal de restricción de creador llamándolo directo
    PERFORM public.iniciar_partida_automatica(p_partida_id, v_jugador_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Helper: Iniciar partida automáticamente (sin validación de creador) al iniciar nueva ronda
CREATE OR REPLACE FUNCTION public.iniciar_partida_automatica(p_partida_id UUID, p_ganador_anterior_id UUID)
RETURNS VOID AS $$
DECLARE
  v_jugador_row RECORD;
  v_carta_id UUID;
  v_palos TEXT[] := ARRAY['Corazones', 'Diamantes', 'Treboles', 'Espadas'];
  v_valores TEXT[] := ARRAY['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  v_palo TEXT;
  v_valor TEXT;
BEGIN
  -- Limpiar cartas
  DELETE FROM public.partida_cartas WHERE partida_id = p_partida_id;

  -- Crear mazo
  FOREACH v_palo IN ARRAY v_palos LOOP
    FOREACH v_valor IN ARRAY v_valores LOOP
      INSERT INTO public.partida_cartas (partida_id, carta_nombre, ubicacion, orden)
      VALUES (p_partida_id, v_valor || ' de ' || v_palo, 'mazo', 0);
    END LOOP;
  END LOOP;

  INSERT INTO public.partida_cartas (partida_id, carta_nombre, ubicacion, orden) VALUES (p_partida_id, 'Joker Rojo', 'mazo', 0);
  INSERT INTO public.partida_cartas (partida_id, carta_nombre, ubicacion, orden) VALUES (p_partida_id, 'Joker Negro', 'mazo', 0);

  -- Barajar
  WITH mazo_barajado AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY random()) as nuevo_orden
    FROM public.partida_cartas
    WHERE partida_id = p_partida_id
  )
  UPDATE public.partida_cartas c
  SET orden = m.nuevo_orden
  FROM mazo_barajado m
  WHERE c.id = m.id;

  -- Repartir 7 cartas a cada jugador activo
  FOR v_jugador_row IN 
    SELECT id FROM public.partida_jugadores WHERE partida_id = p_partida_id AND estado = 'activo' ORDER BY orden_turno
  LOOP
    UPDATE public.partida_cartas
    SET propietario_jugador_id = v_jugador_row.id,
        ubicacion = 'mano'
    WHERE id IN (
      SELECT id FROM public.partida_cartas
      WHERE partida_id = p_partida_id AND ubicacion = 'mazo'
      ORDER BY orden ASC
      LIMIT 7
    );
  END LOOP;

  -- Carta inicial de descarte
  SELECT id INTO v_carta_id
  FROM public.partida_cartas
  WHERE partida_id = p_partida_id AND ubicacion = 'mazo'
  ORDER BY orden ASC
  LIMIT 1;

  UPDATE public.partida_cartas
  SET ubicacion = 'descarte', orden = 1
  WHERE id = v_carta_id;

  -- Configurar partida: turno al que golpeó en la ronda anterior
  UPDATE public.partidas
  SET fase_turno = 'robar',
      jugador_turno_id = p_ganador_anterior_id
  WHERE id = p_partida_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Obtener conteo de cartas de todos los jugadores (bypassea RLS de cartas)
CREATE OR REPLACE FUNCTION public.obtener_cantidades_cartas(p_partida_id UUID)
RETURNS TABLE (jugador_id UUID, cantidad INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT pj.id, COALESCE(COUNT(pc.id)::INTEGER, 0)
  FROM public.partida_jugadores pj
  LEFT JOIN public.partida_cartas pc ON pc.propietario_jugador_id = pj.id AND pc.ubicacion = 'mano'
  WHERE pj.partida_id = p_partida_id
  GROUP BY pj.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

