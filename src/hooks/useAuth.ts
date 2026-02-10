import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as authSignOut,
  getSession,
  onAuthStateChange,
  type Session,
  type User,
} from '@/services/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial session
    getSession()
      .then((sess) => {
        setSession(sess);
        setUser(sess?.user ?? null);
      })
      .catch(() => {
        setSession(null);
        setUser(null);
      })
      .finally(() => setLoading(false));

    // Subscribe to auth state changes
    const subscription = onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await signInWithEmail(email, password);
    return data;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const data = await signUpWithEmail(email, password);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setSession(null);
  }, []);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session,
  };
}
