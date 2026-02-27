import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { clearLocalData } from '@/services/accountManagement';
import { stopSync } from '@/services/syncEngine';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_MS = 25 * 60 * 1000; // 25 minutes (5 min before timeout)

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
];

const THROTTLE_MS = 5_000; // Throttle activity resets to once per 5 seconds

export function useSessionTimeout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningShownRef = useRef(false);
  const lastResetRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    clearTimers();
    stopSync();
    try {
      await supabase.auth.signOut();
    } catch {
      // Sign-out best-effort; ignore network errors
    }
    await clearLocalData();
    window.location.replace('/auth');
  }, [clearTimers]);

  const resetTimers = useCallback(() => {
    clearTimers();
    warningShownRef.current = false;

    warningRef.current = setTimeout(() => {
      warningShownRef.current = true;
      toast({
        title: 'Session expiring soon',
        description: 'Session expiring in 5 minutes due to inactivity.',
        variant: 'destructive',
      });
    }, WARNING_MS);

    timeoutRef.current = setTimeout(() => {
      handleSignOut();
    }, TIMEOUT_MS);
  }, [clearTimers, handleSignOut]);

  useEffect(() => {
    resetTimers();

    const onActivity = () => {
      const now = Date.now();
      if (now - lastResetRef.current < THROTTLE_MS) return;
      lastResetRef.current = now;
      resetTimers();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }

    return () => {
      clearTimers();
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
    };
  }, [resetTimers, clearTimers]);
}
