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
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (!active || lastUserId !== userId) return;

        if (data?.role) {
          setUserRole(data.role);
        } else {
          setUserRole('user');
        }
        if (error) logger.error('Error fetching user role:', error);
      } catch (err) {
        if (!active || lastUserId !== userId) return;
        logger.error('Error fetching user role:', err);
        setUserRole('user');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.log(`[Auth] onAuthStateChange event: ${event}`);
      const currentUser = session?.user ?? null;
      
      if (!active) return;

      setUser(currentUser);
      
      if (currentUser?.id) {
        await fetchUserRole(currentUser.id);
      } else {
        setUserRole('user');
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

