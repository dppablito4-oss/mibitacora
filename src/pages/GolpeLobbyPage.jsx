import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logger from '../utils/logger';

export default function GolpeLobbyPage() {
  const navigate = useNavigate();
  const { user, signInAnonymously } = useAuth();
  const { showToast } = useToast();

  const [apodo, setApodo] = useState(() => localStorage.getItem('golpe_apodo') || '');
  const [maxPuntaje, setMaxPuntaje] = useState(100);
  const [joinId, setJoinId] = useState('');
  const [activeGameId, setActiveGameId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [checkingActive, setCheckingActive] = useState(true);

  // Guardar apodo en localStorage
  const handleApodoChange = (val) => {
    setApodo(val);
    localStorage.setItem('golpe_apodo', val);
  };

  // Buscar si el usuario tiene una partida activa
  useEffect(() => {
    if (!user) {
      setCheckingActive(false);
      return;
    }

    const checkActiveGame = async () => {
      try {
        setCheckingActive(true);
        const { data, error } = await supabase
          .from('partida_jugadores')
          .select('partida_id, partidas(estado)')
          .eq('user_id', user.id)
          .in('partidas.estado', ['esperando', 'jugando']);

        if (error) throw error;

        // Filtrar partidas que realmente están activas (esperando o jugando)
        const active = data?.find(item => item.partidas && (item.partidas.estado === 'esperando' || item.partidas.estado === 'jugando'));
        if (active) {
          setActiveGameId(active.partida_id);
        } else {
          setActiveGameId(null);
        }
      } catch (err) {
        logger.error('Error checking active game:', err);
      } finally {
        setCheckingActive(false);
      }
    };

    checkActiveGame();
  }, [user]);

  // Crear una nueva partida
  const handleCrearPartida = async (e) => {
    e.preventDefault();
    if (!apodo.trim()) {
      showToast('Por favor, ingresa un apodo.', 'warning');
      return;
    }

    setLoading(true);
    try {
      let currentUser = user;
      if (!currentUser) {
        const { data } = await signInAnonymously();
        currentUser = data?.user;
      }

      const { data: partidaId, error } = await supabase.rpc('crear_partida', {
        p_nombre: apodo.trim(),
        p_max_puntaje: parseInt(maxPuntaje, 10)
      });

      if (error) throw error;

      showToast('Partida creada con éxito.', 'success');
      navigate(`/golpe/${partidaId}`);
    } catch (err) {
      logger.error('Error al crear partida:', err);
      showToast(err.message || 'No se pudo crear la partida.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Unirse a una partida existente
  const handleUnirsePartida = async (e) => {
    e.preventDefault();
    const cleanId = joinId.trim();
    if (!apodo.trim()) {
      showToast('Por favor, ingresa un apodo.', 'warning');
      return;
    }
    if (!cleanId) {
      showToast('Por favor, ingresa el ID de la partida.', 'warning');
      return;
    }

    setLoading(true);
    try {
      let currentUser = user;
      if (!currentUser) {
        const { data } = await signInAnonymously();
        currentUser = data?.user;
      }

      const { data: jugadorId, error } = await supabase.rpc('unirse_a_partida', {
        p_partida_id: cleanId,
        p_nombre: apodo.trim()
      });

      if (error) {
        // Detectar si el usuario ya tiene una partida activa
        if (error.message.startsWith('ACT_GAME_EXIST:')) {
          const prevId = error.message.split(':')[1];
          setActiveGameId(prevId);
          showToast('Ya estás en una partida activa. Reanúdala o abandónala.', 'info');
          setLoading(false);
          return;
        }
        throw error;
      }

      showToast('Te has unido a la partida.', 'success');
      navigate(`/golpe/${cleanId}`);
    } catch (err) {
      logger.error('Error al unirse a partida:', err);
      showToast(err.message || 'No se pudo unir a la partida. Verifica el ID.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Abandonar la partida activa desde el lobby
  const handleAbandonarPartidaActiva = async () => {
    if (!activeGameId) return;
    if (!confirm('¿Estás seguro de que quieres abandonar tu partida activa actual? Perderás todo el progreso.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('abandonar_partida', {
        p_partida_id: activeGameId
      });

      if (error) throw error;

      setActiveGameId(null);
      showToast('Partida abandonada con éxito.', 'success');
    } catch (err) {
      logger.error('Error al abandonar partida:', err);
      showToast('Error al abandonar la partida activa.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-rose-500 selection:text-white">
      {/* Fondo decorativo con luces difusas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
        
        {/* Cabecera del juego */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl mb-4 border border-rose-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <span className="text-3xl">🃏</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            EL GOLPE
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Juego de cartas multijugador en tiempo real
          </p>
        </div>

        {checkingActive ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Verificando estado de juego...</p>
          </div>
        ) : activeGameId ? (
          /* Caja de Alerta si ya tiene juego activo */
          <div className="space-y-6">
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-6 text-center space-y-4">
              <span className="text-4xl">⚠️</span>
              <h2 className="text-lg font-bold text-rose-400">¡Partida Activa Detectada!</h2>
              <p className="text-sm text-slate-400">
                Ya estás registrado en una partida que está en curso o esperando jugadores. No puedes unirte a otra hasta que termine o salgas.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate(`/golpe/${activeGameId}`)}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-rose-900/30 flex items-center justify-center"
              >
                Volver a mi Partida 🚀
              </button>
              
              <button
                onClick={handleAbandonarPartidaActiva}
                disabled={loading}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-rose-400 font-medium rounded-xl transition duration-200 border border-slate-700 disabled:opacity-50"
              >
                {loading ? 'Abandonando...' : 'Abandonar partida actual 🚪'}
              </button>
            </div>
          </div>
        ) : (
          /* Formulario Normal de Registro y Creación/Unión */
          <div className="space-y-6">
            {/* Input de Apodo obligatorio */}
            <div>
              <label htmlFor="apodo" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Tu Apodo / Nickname
              </label>
              <input
                id="apodo"
                type="text"
                placeholder="Escribe tu apodo..."
                value={apodo}
                onChange={(e) => handleApodoChange(e.target.value)}
                maxLength={15}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-rose-500 focus:outline-none transition duration-200 text-slate-100 placeholder-slate-600 font-medium"
              />
            </div>

            <hr className="border-slate-800" />

            {/* Crear Partida */}
            <form onSubmit={handleCrearPartida} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Límite de Puntos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 150].map((points) => (
                    <button
                      key={points}
                      type="button"
                      onClick={() => setMaxPuntaje(points)}
                      className={`py-2 px-3 text-sm font-semibold rounded-xl border transition duration-200 ${
                        maxPuntaje === points
                          ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {points} pts
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-xl transition duration-200 shadow-lg shadow-rose-900/20 disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear Sala Nueva ➕'}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">o</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Unirse a Partida */}
            <form onSubmit={handleUnirsePartida} className="space-y-4">
              <div>
                <label htmlFor="roomId" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Código / ID de la Partida
                </label>
                <input
                  id="roomId"
                  type="text"
                  placeholder="Pegar UUID de la partida..."
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-rose-500 focus:outline-none transition duration-200 text-slate-100 placeholder-slate-700 text-sm font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition duration-200 border border-slate-700 disabled:opacity-50"
              >
                {loading ? 'Uniéndose...' : 'Unirme a Sala existente 🤝'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
