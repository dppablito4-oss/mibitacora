import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

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
    } catch {
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

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-widest text-red-500 mb-4">Acceso Denegado</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Esta área está clasificada y requiere credenciales de Nivel 7. Sus coordenadas han sido registradas.</p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="px-6 py-3 border border-tesseract-500/30 bg-tesseract-500/10 text-tesseract-300 font-bold uppercase tracking-wider hover:bg-tesseract-500 hover:text-white transition-all">
              Volver al inicio
            </Link>
            {!user && (
              <Link to="/login" className="px-6 py-3 bg-dark border border-slate-700 text-slate-400 font-bold uppercase tracking-wider hover:border-slate-500 hover:text-slate-200 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
}
