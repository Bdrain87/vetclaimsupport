/**
 * AUTH HOOK — Reserved for future cloud sync feature.
 * Currently NOT connected to any route guards or UI.
 * The app works without authentication.
 */
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
    let listenerFired = false;

    // Subscribe to auth state changes first so we don't miss events
    const subscription = onAuthStateChange((_event, sess) => {
      listenerFired = true;
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
    });

    // Load initial session as fallback
    getSession()
      .then((sess) => {
        if (!listenerFired) {
          setSession(sess);
          setUser(sess?.user ?? null);
        }
      })
      .catch(() => {
        if (!listenerFired) {
          setSession(null);
          setUser(null);
        }
      })
      .finally(() => setLoading(false));

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
