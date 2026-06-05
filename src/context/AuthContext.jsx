import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import logger from '../utils/logger';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (data?.role) {
        setUserRole(data.role);
      } else {
        setUserRole('user');
      }
      if (error) logger.error('Error fetching user role:', error);
    } catch (err) {
      logger.error('Error fetching user role:', err);
      setUserRole('user');
    }
  };

  useEffect(() => {
    // Failsafe: forzar desbloqueo después de 1.5s si Supabase se cuelga
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser?.id) {
          await fetchUserRole(currentUser.id);
        }
      } catch (err) {
        logger.error('Error checking session on mount:', err);
      } finally {
        clearTimeout(fallbackTimer);
        setLoading(false);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser?.id) {
        await fetchUserRole(currentUser.id);
      } else {
        setUserRole('user');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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

