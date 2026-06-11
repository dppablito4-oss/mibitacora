import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import logger from '../utils/logger';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let lastUserId = null;

    // Failsafe: forzar desbloqueo después de 2s si Supabase se cuelga
    const fallbackTimer = setTimeout(() => {
      if (active) setLoading(false);
    }, 2000);

    const fetchUserRole = async (userId) => {
      lastUserId = userId;
      
      // Breve retardo para permitir que el SDK de Supabase sincronice los headers JWT en las peticiones REST
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!active || lastUserId !== userId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (!active || lastUserId !== userId) return;

        if (data?.role) {
          setUserRole(data.role);
          try {
            sessionStorage.setItem('space_user_role', JSON.stringify({
              userId,
              role: data.role
            }));
          } catch { /* ignore */ }
        } else {
          // Si no tiene perfil, degradamos a user y limpiamos caché
          setUserRole('user');
          try { sessionStorage.removeItem('space_user_role'); } catch { /* ignore */ }
        }
        if (error) logger.error('Error fetching user role:', error);
      } catch (err) {
        if (!active || lastUserId !== userId) return;
        logger.error('Error fetching user role:', err);
        
        // En caso de error de red o RLS temporal, intentamos recuperar el rol de la caché antes de degradar a user
        try {
          const cached = sessionStorage.getItem('space_user_role');
          if (cached) {
            const { userId: cachedId, role: cachedRole } = JSON.parse(cached);
            if (cachedId === userId) {
              setUserRole(cachedRole);
              return;
            }
          }
        } catch { /* ignore */ }
        
        setUserRole('user');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.log(`[Auth] onAuthStateChange event: ${event}`);
      const currentUser = session?.user ?? null;
      
      if (!active) return;

      setUser(currentUser);
      
      if (currentUser?.id) {
        // Cargar inmediatamente el rol desde el sessionStorage para evitar destello de 'sin permisos'
        try {
          const cached = sessionStorage.getItem('space_user_role');
          if (cached) {
            const { userId, role } = JSON.parse(cached);
            if (userId === currentUser.id) {
              setUserRole(role);
            }
          }
        } catch { /* ignore */ }

        await fetchUserRole(currentUser.id);
      } else {
        setUserRole('user');
        try { sessionStorage.removeItem('space_user_role'); } catch { /* ignore */ }
      }
      
      setLoading(false);
      clearTimeout(fallbackTimer);
    });

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signInAnonymously: () => supabase.auth.signInAnonymously(),
    signOut: () => supabase.auth.signOut(),
    user,
    userRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

