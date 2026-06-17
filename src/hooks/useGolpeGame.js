import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import logger from '../utils/logger';

export function useGolpeGame(partidaId) {
  const { user, signInAnonymously } = useAuth();
  const [partida, setPartida] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [cartas, setCartas] = useState([]);
  const [cantidadesCartas, setCantidadesCartas] = useState({});
  const [miJugador, setMiJugador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guardar refs para evitar ciclos en los effect
  const isFetchingRef = useRef(false);

  // Obtener datos iniciales y refrescar
  const fetchGameState = useCallback(async () => {
    if (!partidaId) return;

    try {
      isFetchingRef.current = true;

      // 1. Obtener datos de la partida
      const { data: partidaData, error: partidaErr } = await supabase
        .from('partidas')
        .select('*')
        .eq('id', partidaId)
        .single();

      if (partidaErr) throw partidaErr;
      setPartida(partidaData);

      // 2. Obtener lista de jugadores
      const { data: jugadoresData, error: jugErr } = await supabase
        .from('partida_jugadores')
        .select('*')
        .eq('partida_id', partidaId)
        .order('orden_turno', { ascending: true });

      if (jugErr) throw jugErr;
      setJugadores(jugadoresData);

      // Encontrar mi registro de jugador
      if (user) {
        const yo = jugadoresData.find((j) => j.user_id === user.id);
        setMiJugador(yo || null);
      }

      // 3. Obtener las cartas visibles (mano propia, descarte, jugadas)
      const { data: cartasData, error: cartasErr } = await supabase
        .from('partida_cartas')
        .select('*')
        .eq('partida_id', partidaId);

      if (cartasErr) throw cartasErr;
      setCartas(cartasData || []);

      // 4. Obtener conteo de cartas de todos los jugadores (para rivales)
      if (partidaData.estado === 'jugando') {
        const { data: countsData, error: countsErr } = await supabase.rpc('obtener_cantidades_cartas', {
          p_partida_id: partidaId
        });
        if (!countsErr && countsData) {
          const countsMap = {};
          countsData.forEach(item => {
            countsMap[item.jugador_id] = item.cantidad;
          });
          setCantidadesCartas(countsMap);
        }
      }

    } catch (err) {
      logger.error('Error fetching game state:', err);
      setError(err.message || 'Error al cargar la partida');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [partidaId, user]);

  // Asegurar autenticación anónima si el usuario es invitado
  useEffect(() => {
    const ensureAuth = async () => {
      if (!user) {
        try {
          setLoading(true);
          await signInAnonymously();
        } catch (err) {
          logger.error('Error in anonymous login:', err);
          setError('No se pudo establecer una sesión anónima.');
          setLoading(false);
        }
      }
    };
    ensureAuth();
  }, [user, signInAnonymously]);

  // Suscripción Realtime para actualizaciones instantáneas
  const fetchGameStateRef = useRef(fetchGameState);
  useEffect(() => {
    fetchGameStateRef.current = fetchGameState;
  }, [fetchGameState]);

  useEffect(() => {
    if (!partidaId || !user) return;

    // Cargar estado inicial de forma asíncrona para evitar setStates sincrónicos en el efecto
    let active = true;
    const initFetch = async () => {
      if (active) {
        await fetchGameStateRef.current();
      }
    };
    initFetch();

    logger.log(`Subscribing to realtime updates for game: ${partidaId}`);

    const channel = supabase
      .channel(`partida:${partidaId}`)
      // Escuchar cambios en la partida
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'partidas', filter: `id=eq.${partidaId}` },
        () => {
          logger.log('Realtime: partida updated');
          fetchGameStateRef.current();
        }
      )
      // Escuchar cambios en los jugadores
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'partida_jugadores', filter: `partida_id=eq.${partidaId}` },
        () => {
          logger.log('Realtime: jugadores updated');
          fetchGameStateRef.current();
        }
      )
      // Escuchar cambios en las cartas
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'partida_cartas', filter: `partida_id=eq.${partidaId}` },
        () => {
          logger.log('Realtime: cartas updated');
          fetchGameStateRef.current();
        }
      )
      .subscribe((status) => {
        logger.log(`Realtime channel status: ${status}`);
      });

    // Fallback de polling de seguridad (por si Realtime falla en Supabase)
    const pollInterval = setInterval(() => {
      if (!isFetchingRef.current) {
        fetchGameStateRef.current();
      }
    }, 15000);

    return () => {
      active = false;
      clearInterval(pollInterval);
      logger.log(`Cleaning up realtime channel for game: ${partidaId}`);
      supabase.removeChannel(channel);
    };
  }, [partidaId, user?.id, user]);

  // ── ACCIONES DEL JUEGO (RPC TRIGGERS) ──────────────────────────

  // Crear partida
  const crearPartida = async (nombre, maxPuntaje) => {
    try {
      const { data, error: rpcErr } = await supabase.rpc('crear_partida', {
        p_nombre: nombre,
        p_max_puntaje: maxPuntaje,
      });
      if (rpcErr) throw rpcErr;
      return data; // retorna partidaId
    } catch (err) {
      logger.error('Error creating match:', err);
      throw new Error(err.message || 'No se pudo crear la partida.', { cause: err });
    }
  };

  // Unirse a partida
  const unirseAPartida = async (nombre) => {
    try {
      const { data, error: rpcErr } = await supabase.rpc('unirse_a_partida', {
        p_partida_id: partidaId,
        p_nombre: nombre,
      });
      if (rpcErr) throw rpcErr;
      await fetchGameState();
      return data; // retorna jugadorId
    } catch (err) {
      logger.error('Error joining match:', err);
      throw err; // lanzamos el error original para detectar 'ACT_GAME_EXIST'
    }
  };

  // Alternar estado Listo
  const toggleListo = async () => {
    if (!miJugador) return;
    try {
      const { error: rpcErr } = await supabase.rpc('toggle_listo', {
        p_partida_id: partidaId
      });

      if (rpcErr) throw rpcErr;
      await fetchGameState();
    } catch (err) {
      logger.error('Error toggling ready state:', err);
      throw new Error(err.message || 'No se pudo actualizar el estado.', { cause: err });
    }
  };

  // Iniciar la partida (solo el creador)
  const iniciarPartida = async () => {
    try {
      const { error: rpcErr } = await supabase.rpc('iniciar_partida', {
        p_partida_id: partidaId,
      });
      if (rpcErr) throw rpcErr;
      await fetchGameState();
    } catch (err) {
      logger.error('Error starting match:', err);
      throw new Error(err.message || 'No se pudo iniciar la partida.', { cause: err });
    }
  };

  // Robar carta
  const robarCarta = async (origen) => {
    try {
      const { error: rpcErr } = await supabase.rpc('robar_carta', {
        p_partida_id: partidaId,
        p_origen: origen,
      });
      if (rpcErr) throw rpcErr;
      await fetchGameState();
    } catch (err) {
      logger.error('Error drawing card:', err);
      throw new Error(err.message || 'Error al robar carta.', { cause: err });
    }
  };

  // Descartar carta
  const descartarCarta = async (cartaId) => {
    try {
      const { error: rpcErr } = await supabase.rpc('descartar_carta', {
        p_partida_id: partidaId,
        p_carta_id: cartaId,
      });
      if (rpcErr) throw rpcErr;
      await fetchGameState();
    } catch (err) {
      logger.error('Error discarding card:', err);
      throw new Error(err.message || 'Error al descartar carta.', { cause: err });
    }
  };

  // Golpear (Cerrar ronda)
  const golpear = async (cartaId) => {
    try {
      const { error: rpcErr } = await supabase.rpc('golpear', {
        p_partida_id: partidaId,
        p_carta_descarte_id: cartaId,
      });
      if (rpcErr) throw rpcErr;
      await fetchGameState();
    } catch (err) {
      logger.error('Error playing Golpe:', err);
      throw new Error(err.message || 'Error al declarar Golpe.', { cause: err });
    }
  };

  // Abandonar partida
  const abandonarPartida = async () => {
    try {
      const { error: rpcErr } = await supabase.rpc('abandonar_partida', {
        p_partida_id: partidaId,
      });
      if (rpcErr) throw rpcErr;
      setPartida(null);
      setJugadores([]);
      setCartas([]);
      setMiJugador(null);
    } catch (err) {
      logger.error('Error leaving match:', err);
      throw new Error(err.message || 'Error al abandonar la partida.', { cause: err });
    }
  };

  return {
    partida,
    jugadores,
    cartas,
    cantidadesCartas,
    miJugador,
    loading,
    error,
    actions: {
      crearPartida,
      unirseAPartida,
      toggleListo,
      iniciarPartida,
      robarCarta,
      descartarCarta,
      golpear,
      abandonarPartida,
      refresh: fetchGameState,
    },
  };
}
