import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGolpeGame } from '../hooks/useGolpeGame';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import logger from '../utils/logger';

// Utilidad para parsear los nombres de las cartas en iconos y colores de suit
const parseCard = (cardName) => {
  if (!cardName) return { value: '', suit: '', icon: '❓', color: 'text-slate-400 border-slate-700' };
  
  if (cardName.startsWith('Joker')) {
    const isRed = cardName.includes('Rojo');
    return {
      value: 'JK',
      suit: 'Joker',
      icon: '🃏',
      color: isRed ? 'text-rose-500 border-rose-500/30' : 'text-amber-500 border-amber-600/30'
    };
  }
  
  const parts = cardName.split(' de ');
  const val = parts[0];
  const suit = parts[1];
  
  let icon = '❓';
  let color = 'text-slate-400 border-slate-800';
  
  if (suit === 'Corazones') { icon = '♥️'; color = 'text-red-500 border-red-500/20'; }
  else if (suit === 'Diamantes') { icon = '♦️'; color = 'text-rose-500 border-rose-500/20'; }
  else if (suit === 'Treboles') { icon = '♣️'; color = 'text-emerald-400 border-emerald-500/20'; }
  else if (suit === 'Espadas') { icon = '♠️'; color = 'text-sky-400 border-sky-500/20'; }
  
  return { value: val, suit, icon, color };
};

export default function GolpeGamePage() {
  const { partidaId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const {
    partida,
    jugadores,
    cartas,
    cantidadesCartas,
    miJugador,
    loading,
    error,
    actions
  } = useGolpeGame(partidaId);

  const [apodoInput, setApodoInput] = useState(() => localStorage.getItem('golpe_apodo') || '');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  
  // Trackear rondas para activar la animación de barajado cuando cambie la ronda
  const prevRondaRef = useRef(null);

  useEffect(() => {
    if (partida?.ronda && prevRondaRef.current !== null && partida.ronda !== prevRondaRef.current) {
      // Activar animación de barajar
      setIsShuffling(true);
      setSelectedCardId(null);
      const timer = setTimeout(() => {
        setIsShuffling(false);
        showToast(`¡Ronda ${partida.ronda} iniciada!`, 'info');
      }, 2500);
      return () => clearTimeout(timer);
    }
    if (partida?.ronda) {
      prevRondaRef.current = partida.ronda;
    }
  }, [partida?.ronda, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">Sincronizando con la mesa...</p>
      </div>
    );
  }

  if (error || !partida) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <span className="text-6xl">⛔</span>
        <h2 className="text-2xl font-bold text-rose-500">Error al Conectarse</h2>
        <p className="text-slate-400 max-w-md">
          {error || 'La partida solicitada no existe o fue eliminada por inactividad.'}
        </p>
        <button
          onClick={() => navigate('/golpe')}
          className="mt-4 px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium rounded-xl transition duration-200"
        >
          Volver al Menú Principal 🚪
        </button>
      </div>
    );
  }

  // 1. SI EL USUARIO AÚN NO ES JUGADOR DE ESTA SALA: pedir apodo
  if (!miJugador && partida.estado === 'esperando') {
    const handleJoin = async (e) => {
      e.preventDefault();
      if (!apodoInput.trim()) {
        showToast('Elige un apodo para entrar.', 'warning');
        return;
      }
      localStorage.setItem('golpe_apodo', apodoInput.trim());
      setActionLoading(true);
      try {
        await actions.unirseAPartida(apodoInput.trim());
        showToast('¡Te has unido a la partida!', 'success');
      } catch (err) {
        logger.error('Error al unirse:', err);
        showToast(err.message || 'No se pudo unir a la partida.', 'error');
      } finally {
        setActionLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <span className="text-4xl">👋</span>
            <h2 className="text-2xl font-bold mt-2">Unirse a la Sala</h2>
            <p className="text-sm text-slate-400 mt-1">Ingresa tu apodo para registrarte en el tablero.</p>
          </div>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              placeholder="Escribe tu apodo..."
              value={apodoInput}
              onChange={(e) => setApodoInput(e.target.value)}
              maxLength={15}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-rose-500 focus:outline-none transition duration-200"
            />
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition duration-200 disabled:opacity-50"
            >
              {actionLoading ? 'Entrando...' : 'Entrar a la partida ⚡'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Si no está registrado y la partida ya empezó, ingresa como espectador (caso alternativo)
  if (!miJugador && partida.estado !== 'esperando') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-4">
          <span className="text-5xl">👀</span>
          <h2 className="text-xl font-bold">Modo Espectador</h2>
          <p className="text-sm text-slate-400">
            Esta partida ya ha comenzado y no quedan cupos activos. Puedes observar el desarrollo de la mesa en tiempo real.
          </p>
          <button
            onClick={() => navigate('/golpe')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition border border-slate-700"
          >
            Volver al Vestíbulo 🚪
          </button>
        </div>
      </div>
    );
  }

  // 2. DETECTOR DE RIVALES Y ORDEN DE TURNOS
  // Filtrar oponentes (ordenados para girar en círculo respecto a mí)
  const oponentes = jugadores
    .filter(j => j.id !== miJugador.id)
    .sort((a, b) => a.orden_turno - b.orden_turno);

  // Clasificar cartas mías y de la mesa
  const misCartas = cartas.filter(c => c.propietario_jugador_id === miJugador.id && c.ubicacion === 'mano');
  
  // Cartas en descarte (ordenadas por orden ASC para ver el historial y tomar la de encima)
  const cartasDescarte = cartas
    .filter(c => c.ubicacion === 'descarte')
    .sort((a, b) => a.orden - b.orden);
  
  const cartaSuperiorDescarte = cartasDescarte[cartasDescarte.length - 1];

  const esMiTurno = partida.jugador_turno_id === miJugador.id;
  const puedoRobar = esMiTurno && partida.fase_turno === 'robar';
  const puedoDescartar = esMiTurno && partida.fase_turno === 'descartar';

  // Copiar link de invitación
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Enlace de invitación copiado.', 'info');
  };

  // Acciones rápidas de botones
  const handleRobar = async (origen) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await actions.robarCarta(origen);
      showToast(`Robaste del ${origen === 'mazo' ? 'Mazo' : 'Descarte'}.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDescartar = async (esGolpe = false) => {
    if (!selectedCardId) {
      showToast('Selecciona una carta para descartar.', 'warning');
      return;
    }
    if (actionLoading) return;
    setActionLoading(true);
    try {
      if (esGolpe) {
        await actions.golpear(selectedCardId);
        showToast('¡Has declarado GOLPE! Calculando puntuaciones...', 'success');
      } else {
        await actions.descartarCarta(selectedCardId);
        showToast('Carta descartada.', 'info');
      }
      setSelectedCardId(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAbandonar = () => {
    setShowAbandonConfirm(true);
  };

  const confirmAbandonar = async () => {
    setShowAbandonConfirm(false);
    try {
      await actions.abandonarPartida();
      showToast('Has abandonado la partida.', 'info');
      navigate('/golpe');
    } catch (err) {
      logger.error('Error al abandonar partida:', err);
      showToast(err.message || 'Error al abandonar la partida.', 'error');
    }
  };

  // ── RENDER DE ESTADO: ESPERANDO (LOBBY) ───────────────────────
  if (partida.estado === 'esperando') {
    const todosListos = jugadores.length >= 2 && jugadores.every(j => j.listo);
    const esCreador = partida.creador_id === miJugador.user_id;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative">
          
          <div className="absolute top-4 right-4">
            <button
              onClick={handleAbandonar}
              className="py-1.5 px-3 bg-rose-950/20 border border-rose-500/20 hover:bg-rose-900/30 text-rose-400 text-xs font-semibold rounded-lg transition"
            >
              Abandonar Sala 🚪
            </button>
          </div>

          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-rose-500">Lobby de Espera</span>
            <h2 className="text-2xl font-bold">Esperando Jugadores</h2>
            <p className="text-sm text-slate-400">La partida comenzará cuando todos los jugadores estén listos.</p>
          </div>

          {/* Caja para copiar el Link */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between space-x-4">
            <div className="truncate font-mono text-xs text-slate-400 select-all">
              {window.location.href}
            </div>
            <button
              onClick={handleCopyLink}
              className="flex-shrink-0 py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition duration-200"
            >
              Copiar Enlace 🔗
            </button>
          </div>

          {/* Lista de Jugadores */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jugadores ({jugadores.length}/4)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {jugadores.map((player) => (
                <div
                  key={player.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition duration-200 ${
                    player.id === miJugador.id
                      ? 'bg-slate-900/90 border-slate-700 shadow-md'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center font-bold text-sm">
                      {player.nombre[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold block">
                        {player.nombre} {player.id === miJugador.id && <span className="text-xs text-rose-400 font-normal">(Tú)</span>}
                      </span>
                      <span className="text-xs text-slate-500">Orden {player.orden_turno}</span>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div>
                    {player.listo ? (
                      <span className="text-xs py-1 px-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold">
                        Listo
                      </span>
                    ) : (
                      <span className="text-xs py-1 px-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-semibold">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones principales del Lobby */}
          <div className="pt-4 flex flex-col space-y-3">
            <button
              onClick={actions.toggleListo}
              className={`w-full py-3.5 rounded-xl font-bold transition duration-200 border ${
                miJugador.listo
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/25'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-900/20 border-transparent'
              }`}
            >
              {miJugador.listo ? 'Cancelar Listo ⏳' : '¡Estoy Listo! 🤜🤛'}
            </button>

            {esCreador && (
              <button
                onClick={actions.iniciarPartida}
                disabled={!todosListos}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition duration-200 border border-transparent disabled:border-slate-800/80 shadow-lg shadow-rose-950/20"
              >
                Comenzar Partida 🎮
              </button>
            )}
            
            {esCreador && !todosListos && (
              <p className="text-center text-xs text-slate-500 font-medium">
                (Se necesitan mínimo 2 jugadores y que todos pulsen listo para habilitar la partida)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER DE ESTADO: FINALIZADO (PANTALLA DE RESULTADOS) ─────
  if (partida.estado === 'finalizado') {
    const ganador = jugadores.find(j => j.id === partida.ganador_id);
    
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-8">
          <div>
            <span className="text-6xl animate-bounce inline-block">👑</span>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mt-4">
              Juego Terminado
            </h1>
            <p className="text-slate-400 text-sm mt-1">El Golpe ha concluido tras llegar al puntaje límite.</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-amber-400">Ganador Definitivo</h2>
            <div className="text-2xl font-black text-white">{ganador?.nombre || 'Desconocido'}</div>
            <p className="text-xs text-slate-500">¡Felicidades por dominar la mesa!</p>
          </div>

          {/* Tabla de Puntuaciones */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Puntajes Acumulados</h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-900">
              {jugadores
                .sort((a, b) => a.puntaje - b.puntaje)
                .map((player, idx) => (
                  <div key={player.id} className="p-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-slate-600 w-4">{idx + 1}.</span>
                      <span className={`font-semibold ${player.id === miJugador.id ? 'text-rose-400' : ''}`}>
                        {player.nombre} {player.id === miJugador.id && '(Tú)'}
                      </span>
                      {player.estado === 'eliminado' && (
                        <span className="text-[10px] py-0.5 px-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full font-bold">
                          Voló
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-200">
                      {player.puntaje} <span className="text-xs font-normal text-slate-500">pts</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/golpe')}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition border border-slate-700"
          >
            Volver al Lobby principal 🚪
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER DE ESTADO: JUGANDO (EL TABLERO DE JUEGO) ───────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative select-none">
      
      {/* Estilos dinámicos para animación de barajado y efectos premium */}
      <style>{`
        .carta-reverso-animada {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 85px;
          height: 120px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e1b4b 0%, #31102f 100%);
          border: 2px solid rgba(244, 63, 94, 0.4);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          animation: barajarEfecto 0.5s ease-in-out infinite alternate;
        }
        .carta-reverso-animada:nth-child(2) { animation-delay: 0.1s; }
        .carta-reverso-animada:nth-child(3) { animation-delay: 0.2s; }
        .carta-reverso-animada:nth-child(4) { animation-delay: 0.3s; }

        @keyframes barajarEfecto {
          0% {
            transform: translate(-50%, -50%) translateX(0) rotate(0deg);
            z-index: 1;
          }
          50% {
            transform: translate(-50%, -50%) translateX(-85px) rotate(-12deg); 
            z-index: 5;
          }
          100% {
            transform: translate(-50%, -50%) translateX(0) rotate(0deg);
            z-index: -1;
          }
        }
      `}</style>

      {/* Overlay de Barajado animado */}
      {isShuffling && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-8">
          <div className="relative w-48 h-48">
            <div className="carta-reverso-animada" />
            <div className="carta-reverso-animada" />
            <div className="carta-reverso-animada" />
            <div className="carta-reverso-animada" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-rose-500 uppercase tracking-widest animate-pulse">Barajando Cartas</h2>
            <p className="text-slate-400 text-sm">Mezclando mazo en el servidor de forma matemática...</p>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-violet-500 bg-clip-text text-transparent">EL GOLPE</span>
          <span className="text-xs py-0.5 px-2 bg-slate-800 border border-slate-700 text-slate-400 rounded-full font-mono">
            Ronda {partida.ronda}
          </span>
          <span className="text-xs py-0.5 px-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full font-semibold">
            Límite: {partida.max_puntaje} pts
          </span>
        </div>

        <button
          onClick={handleAbandonar}
          className="text-xs py-1.5 px-3 hover:bg-rose-950/20 hover:text-rose-400 text-slate-400 font-semibold rounded-lg transition border border-transparent hover:border-rose-500/10"
        >
          Abandonar Partida 🚪
        </button>
      </header>

      {/* ── PANEL DE OPONENTES (Superior) ── */}
      <section className="px-6 py-4 flex justify-center space-x-8 z-10 bg-slate-950/20">
        {oponentes.map((rival) => {
          const esTurnoRival = partida.jugador_turno_id === rival.id;
          const cantidadCartas = cantidadesCartas[rival.id] || 0;
          return (
            <div
              key={rival.id}
              className={`py-3 px-5 rounded-2xl border transition duration-300 flex items-center space-x-4 ${
                esTurnoRival
                  ? 'bg-rose-500/10 border-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] scale-105'
                  : 'bg-slate-900/50 border-slate-800/80'
              }`}
            >
              {/* Avatar e info */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  esTurnoRival ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {rival.nombre[0].toUpperCase()}
                </div>
                {esTurnoRival && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                  </span>
                )}
              </div>

              <div>
                <span className="text-sm font-semibold block text-slate-100">{rival.nombre}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  {rival.estado === 'eliminado' ? 'Voló 💀' : `${rival.puntaje} pts`}
                </span>
              </div>

              {/* Cantidad de Cartas de Oponente */}
              {rival.estado === 'activo' && (
                <div className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800/80 py-1.5 px-3 rounded-xl">
                  <span className="text-xs">🎴</span>
                  <span className="font-mono text-xs font-bold text-slate-200">{cantidadCartas}</span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ── MESA DE JUEGO (Mazo y Descarte Central) ── */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {/* Indicador de Turno */}
        <div className="absolute top-4 bg-slate-900/40 border border-slate-800/50 rounded-full px-5 py-1.5 text-xs font-medium text-slate-300 flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${esMiTurno ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
          <span>
            {esMiTurno
              ? puedoRobar
                ? 'Es tu turno: ¡Roba una carta de la pila!'
                : 'Es tu turno: Elige una carta de tu mano y descártala.'
              : `Esperando a ${jugadores.find(j => j.id === partida.jugador_turno_id)?.nombre}...`}
          </span>
        </div>

        {/* Zona del mazo y pila de descarte */}
        <div className="flex items-center justify-center space-x-12">
          
          {/* Mazo (Para robar) */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleRobar('mazo')}
              disabled={!puedoRobar || actionLoading}
              className={`w-28 h-40 rounded-xl bg-gradient-to-br from-indigo-950 to-purple-950 border border-indigo-500/20 flex flex-col items-center justify-center relative transition duration-300 shadow-xl select-none ${
                puedoRobar
                  ? 'hover:border-rose-500/50 hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-2 ring-indigo-500/10'
                  : 'opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Textura de carta reverso */}
              <div className="absolute inset-2 border border-dashed border-indigo-500/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎴</span>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-400 mt-8 z-10">ROBAR</span>
            </button>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mazo Tapado</span>
          </div>

          {/* Descarte (Pila boca arriba) */}
          <div className="flex flex-col items-center space-y-2">
            {cartaSuperiorDescarte ? (
              (() => {
                const parsed = parseCard(cartaSuperiorDescarte.carta_nombre);
                return (
                  <button
                    onClick={() => handleRobar('descarte')}
                    disabled={!puedoRobar || actionLoading}
                    className={`w-28 h-40 rounded-xl bg-slate-900 border flex flex-col justify-between p-4 relative transition duration-300 shadow-xl ${
                      puedoRobar
                        ? 'hover:border-rose-500/50 hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.1)] ring-2 ring-rose-500/10'
                        : 'opacity-90 cursor-not-allowed'
                    } ${parsed.color}`}
                  >
                    {/* Corner superior izquierdo */}
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black leading-none">{parsed.value}</span>
                      <span className="text-xs leading-none">{parsed.icon}</span>
                    </div>

                    {/* Simbolo central gigante */}
                    <div className="text-center text-4xl leading-none">{parsed.icon}</div>

                    {/* Corner inferior derecho volteado */}
                    <div className="flex flex-col items-center rotate-180 self-end">
                      <span className="text-lg font-black leading-none">{parsed.value}</span>
                      <span className="text-xs leading-none">{parsed.icon}</span>
                    </div>
                  </button>
                );
              })()
            ) : (
              <div className="w-28 h-40 rounded-xl bg-slate-950 border border-slate-900 border-dashed flex items-center justify-center text-slate-700 text-xs font-semibold">
                Vacío
              </div>
            )}
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pila Descarte</span>
          </div>

        </div>
      </section>

      {/* ── MANO DEL JUGADOR (Mesa Inferior) ── */}
      <section className="bg-slate-900/60 backdrop-blur-lg border-t border-slate-800/80 p-6 flex flex-col items-center space-y-6 z-10">
        
        {/* Controles de Acción de mi Turno */}
        {esMiTurno && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleDescartar(false)}
              disabled={!puedoDescartar || !selectedCardId || actionLoading}
              className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-sm border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200"
            >
              Descartar Carta 📤
            </button>

            <button
              onClick={() => handleDescartar(true)}
              disabled={!puedoDescartar || !selectedCardId || actionLoading}
              className="py-2.5 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-rose-950/20"
            >
              ¡GOLPEAR! 🏆
            </button>
          </div>
        )}

        {/* Las Cartas de mi Mano en forma de abanico */}
        <div className="w-full max-w-4xl flex justify-center items-end h-44 px-8 relative">
          {misCartas.length > 0 ? (
            misCartas.map((card, index) => {
              const parsed = parseCard(card.carta_nombre);
              const isSelected = selectedCardId === card.id;

              // Calcular desplazamiento en abanico
              const totalCards = misCartas.length;
              const angleStep = 4; // grados
              const midIndex = (totalCards - 1) / 2;
              const angle = (index - midIndex) * angleStep;
              const translateX = (index - midIndex) * 20; // desplazamiento X
              const translateY = Math.abs(index - midIndex) * 3; // desplazamiento Y (arco)

              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedCardId(isSelected ? null : card.id)}
                  style={{
                    transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${angle}deg) ${
                      isSelected ? 'translateY(-24px) scale(1.05)' : ''
                    }`,
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
                    zIndex: index + (isSelected ? 20 : 0)
                  }}
                  className={`absolute bottom-0 w-24 h-36 rounded-xl bg-slate-900 border border-slate-800 p-3.5 flex flex-col justify-between text-left shadow-lg hover:border-slate-600 ${
                    isSelected
                      ? 'border-rose-500/80 shadow-[0_10px_20px_rgba(244,63,94,0.15)] ring-2 ring-rose-500/20'
                      : ''
                  } ${parsed.color}`}
                >
                  {/* Corner superior izquierdo */}
                  <div className="flex flex-col items-center">
                    <span className="text-base font-black leading-none">{parsed.value}</span>
                    <span className="text-[10px] leading-none mt-0.5">{parsed.icon}</span>
                  </div>

                  {/* Icono central */}
                  <div className="text-center text-2xl leading-none">{parsed.icon}</div>

                  {/* Corner inferior derecho volteado */}
                  <div className="flex flex-col items-center rotate-180 self-end">
                    <span className="text-base font-black leading-none">{parsed.value}</span>
                    <span className="text-[10px] leading-none mt-0.5">{parsed.icon}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-8">
              No tienes cartas. Esperando inicio de ronda.
            </div>
          )}
        </div>
      </section>

      {/* Confirm Abandonar Dialog */}
      {showAbandonConfirm && (
        <ConfirmDialog
          title="¿Abandonar la partida?"
          message="Perderás todo el progreso acumulado. Esta acción no se puede deshacer."
          confirmLabel="Abandonar"
          cancelLabel="Volver al juego"
          onConfirm={confirmAbandonar}
          onCancel={() => setShowAbandonConfirm(false)}
        />
      )}
    </div>
  );
}
