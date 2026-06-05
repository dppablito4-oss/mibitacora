import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import logger from '../utils/logger';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && (data?.role === 'superadmin' || data?.role === 'admin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      logger.warn('Error checking admin status:', err);
      setIsAdmin(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkAdminStatus();
    } else if (!loading && !user) {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="text-sm text-zinc-500 font-mono">Verificando acceso...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-zinc-100 mb-4">Autenticación Requerida</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Para acceder al panel de control administrativo, por favor inicia sesión con tus credenciales.</p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="px-6 py-3 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider hover:border-zinc-700 hover:text-zinc-200 transition-all rounded-xl text-xs">
              Volver al inicio
            </Link>
            <Link to="/login" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider transition-all rounded-xl text-xs shadow-lg shadow-cyan-600/20">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-red-500 mb-4">Acceso Denegado</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Tu sesión actual no cuenta con privilegios administrativos. Inicia sesión con una cuenta autorizada.</p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="px-6 py-3 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider hover:border-zinc-700 hover:text-zinc-200 transition-all rounded-xl text-xs">
              Volver al inicio
            </Link>
            <Link to="/login" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider transition-all rounded-xl text-xs shadow-lg shadow-red-600/20">
              Iniciar Sesión Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
