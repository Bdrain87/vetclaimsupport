import { useState, useRef, useCallback, useEffect } from 'react';
import { AI_CONFIG } from '@/lib/ai-prompts';
import { supabase } from '@/lib/supabase';
import { redactPII } from '@/lib/redaction';
import { logAISend } from '@/services/aiAuditLog';

async function ensureSession(): Promise<boolean> {
  // 1. Check for a cached session
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // If the access token is expiring within 30 seconds, proactively refresh
    const expiresAt = session.expires_at; // unix seconds
    if (expiresAt && expiresAt < Math.floor(Date.now() / 1000) + 30) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed.session) return true;
      // Refresh failed — session is stale. User must sign in.
    } else {
      return true;
    }
  }

  // 2. No valid session — try refreshing (handles cases where getSession
  //    returned null but a refresh token still exists in storage)
  const { data: refreshed } = await supabase.auth.refreshSession();
  if (refreshed.session) return true;

  // 3. No valid session and refresh failed — require real authentication.
  //    Do NOT fall back to anonymous sign-in (security: anonymous sessions
  //    bypass entitlement checks and should not access Edge Functions).
  return false;
}

export const useGemini = (persona: keyof typeof AI_CONFIG) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (input: string): Promise<string | null> => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    // Auto-abort after 30 seconds to prevent infinite loading
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      // Ensure we have a valid session (requires real auth — no anonymous fallback)
      const hasSession = await ensureSession();
      if (!hasSession) {
        setError('Unable to authenticate. Please sign in and try again.');
        return null;
      }

      const { redactedText: sanitizedInput, redactionCount } = redactPII(input, 'high');

      logAISend({
        redactionMode: 'high',
        redactionCount,
        textLengthSent: sanitizedInput.length,
      });

      const body = {
        prompt: `${AI_CONFIG[persona]}\n\nInput: ${sanitizedInput}`,
      };

      let result = await supabase.functions.invoke('analyze-disabilities', { body });

      if (controller.signal.aborted) return null;

      // If we got a 401 (token expired/invalid), refresh the session and retry once
      if (result.error) {
        let status: number | undefined;
        try {
          if (result.error.context instanceof Response) {
            status = result.error.context.status;
          }
        } catch { /* ignore */ }

        if (status === 401) {
          if (controller.signal.aborted) return null;
          const { data: refreshed } = await supabase.auth.refreshSession();
          if (refreshed.session && !controller.signal.aborted) {
            result = await supabase.functions.invoke('analyze-disabilities', { body });
            if (controller.signal.aborted) return null;
          }
        }
      }

      const { data, error: invokeError } = result;

      if (invokeError) {
        // In supabase-js v2, the actual error body may be in data or invokeError.context
        let msg = 'AI service request failed';

        // Try reading the error from the response context
        try {
          if (invokeError.context instanceof Response) {
            const errBody = await invokeError.context.json();
            if (errBody?.error) msg = errBody.error;
            else if (errBody?.message) msg = errBody.message;
          }
        } catch {
          // context may already be consumed
        }

        // Fallback: check if data has the error (some versions put parsed body in data)
        if (msg === 'AI service request failed' && data?.error) {
          msg = data.error;
        }

        // Last resort: use the invokeError message if it's not the generic one
        if (msg === 'AI service request failed' && invokeError.message && !invokeError.message.includes('non-2xx')) {
          msg = invokeError.message;
        }

        setError(msg);
        return null;
      }

      // Check if the response is actually an error (non-2xx returns can still populate data)
      if (data?.error) {
        setError(data.error);
        return null;
      }

      const text = data?.analysis;
      if (!text) {
        setError('Unexpected response format from AI service');
        return null;
      }
      return text;
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
        return null;
      }
      if (controller.signal.aborted) return null;
      const msg = err instanceof Error ? err.message : 'AI service request failed';
      setError(msg);
      return null;
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  }, [persona]);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  // Clean up in-flight requests when the component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { generate, isLoading, cancel, error };
};
