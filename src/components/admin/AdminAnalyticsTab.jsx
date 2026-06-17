import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useToast } from '../../context/ToastContext';
import { BarChart3, Users, Eye, Play, RefreshCw, Calendar } from 'lucide-react';

export default function AdminAnalyticsTab() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLogs: 0,
    pageViews: 0,
    uniqueIPs: 0,
    activePlays: 0,
    byEvent: {},
    byDate: []
  });

  // Calcular métricas
  const calculateStats = useCallback((data) => {
    const total = data.length;
    let pageViews = 0;
    let activePlays = 0;
    const ips = new Set();
    const byEvent = {};
    const dateCounts = {};

    data.forEach(log => {
      // Contador por evento
      byEvent[log.event] = (byEvent[log.event] || 0) + 1;
      
      // Contar visitas únicas e IPs
      if (log.event === 'page_view') pageViews++;
      if (log.event?.includes('juego') || log.event?.includes('golpe')) activePlays++;
      if (log.ip_hint) ips.add(log.ip_hint);

      // Agrupar por fecha (YYYY-MM-DD)
      const dateStr = new Date(log.created_at).toISOString().split('T')[0];
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    // Ordenar fechas para el gráfico de barras
    const sortedDates = Object.keys(dateCounts)
      .sort()
      .slice(-7) // Últimos 7 días
      .map(date => ({
        date: date.substring(5), // MM-DD
        count: dateCounts[date]
      }));

    setStats({
      totalLogs: total,
      pageViews,
      uniqueIPs: ips.size,
      activePlays,
      byEvent,
      byDate: sortedDates
    });
  }, []);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000); // Cargar los últimos 1000 logs para análisis

      if (error) throw error;
      setLogs(data || []);
      calculateStats(data || []);
    } catch (err) {
      showToast('Error cargando analíticas: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, calculateStats]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLogs();
  }, [loadLogs]);

  const maxDateCount = Math.max(...stats.byDate.map(d => d.count), 1);

  return (
    <div className="space-y-6 animate-fade-in text-zinc-300">
      
      {/* Botón refrescar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 size={20} className="text-accent-400" />
            Consola de Tráfico & Actividad
          </h2>
          <p className="text-xs text-zinc-500">Datos recopilados en base a las interacciones de los usuarios en tiempo real.</p>
        </div>
        <button 
          onClick={loadLogs} 
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 rounded-xl text-xs hover:bg-zinc-900 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 border border-zinc-800 bg-zinc-900/20 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent-500/10 text-accent-400">
            <Eye size={20} />
          </div>
          <div>
            <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">Peticiones Totales</span>
            <span className="text-2xl font-bold text-zinc-100">{stats.totalLogs}</span>
          </div>
        </div>

        <div className="p-5 border border-zinc-800 bg-zinc-900/20 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Users size={20} />
          </div>
          <div>
            <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">IPs Únicas</span>
            <span className="text-2xl font-bold text-zinc-100">{stats.uniqueIPs}</span>
          </div>
        </div>

        <div className="p-5 border border-zinc-800 bg-zinc-900/20 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
            <Calendar size={20} />
          </div>
          <div>
            <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">Vistas de Página</span>
            <span className="text-2xl font-bold text-zinc-100">{stats.pageViews}</span>
          </div>
        </div>

        <div className="p-5 border border-zinc-800 bg-zinc-900/20 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <Play size={20} />
          </div>
          <div>
            <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider">Interacciones Juego</span>
            <span className="text-2xl font-bold text-zinc-100">{stats.activePlays}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico de barras SVG */}
        <div className="lg:col-span-8 p-6 border border-zinc-800 bg-zinc-900/20 rounded-2xl flex flex-col">
          <h3 className="text-sm font-bold text-zinc-100 mb-6 uppercase tracking-wider flex items-center gap-2">
            <span>📈</span> Historial de Tráfico (Últimos 7 Días)
          </h3>
          {stats.byDate.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-600">No hay datos suficientes para graficar.</div>
          ) : (
            <div className="flex items-end justify-between h-48 px-2 border-b border-zinc-800/80 pb-2">
              {stats.byDate.map(d => {
                const barHeight = (d.count / maxDateCount) * 100;
                return (
                  <div key={d.date} className="flex flex-col items-center flex-1 group">
                    {/* Tooltip con valor */}
                    <span className="opacity-0 group-hover:opacity-100 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 px-1.5 py-0.5 rounded mb-1 transition-opacity duration-200">
                      {d.count}
                    </span>
                    <div 
                      className="w-8 bg-gradient-to-t from-accent-600 to-accent-400 hover:from-accent-500 hover:to-accent-300 rounded-t transition-all duration-500 shadow-lg shadow-accent-500/10"
                      style={{ height: `${Math.max(barHeight, 5)}%` }}
                    />
                    <span className="text-[10px] text-zinc-500 font-mono mt-2">{d.date}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Métricas por Evento */}
        <div className="lg:col-span-4 p-6 border border-zinc-800 bg-zinc-900/20 rounded-2xl">
          <h3 className="text-sm font-bold text-zinc-100 mb-4 uppercase tracking-wider">Distribución de Eventos</h3>
          <div className="space-y-4">
            {Object.keys(stats.byEvent).length === 0 ? (
              <div className="text-xs text-zinc-600 py-6 text-center">Sin eventos registrados</div>
            ) : (
              Object.entries(stats.byEvent).map(([event, count]) => {
                const percentage = Math.round((count / stats.totalLogs) * 100);
                return (
                  <div key={event} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-300 font-mono">{event}</span>
                      <span className="text-zinc-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-zinc-950 border border-zinc-800/60 h-2 rounded-full overflow-hidden">
                      <div className="bg-accent-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Listado de Logs Recientes */}
      <div className="p-6 border border-zinc-800 bg-zinc-900/20 rounded-2xl">
        <h3 className="text-sm font-bold text-zinc-100 mb-4 uppercase tracking-wider">Logs de Auditoría en Vivo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-mono tracking-wider">
                <th className="py-3 px-4">Fecha/Hora</th>
                <th className="py-3 px-4">Evento</th>
                <th className="py-3 px-4">IP Cliente</th>
                <th className="py-3 px-4">Metadatos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {logs.slice(0, 15).map(log => (
                <tr key={log.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-zinc-500">
                    {new Date(log.created_at).toLocaleString('es-PE', { hour12: false })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-zinc-300">
                      {log.event}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400">{log.ip_hint || 'Desconocido'}</td>
                  <td className="py-3 px-4 font-mono text-zinc-500 max-w-xs truncate" title={JSON.stringify(log.metadata)}>
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
