import { useState, useRef, useCallback, useEffect } from 'react';
import { AI_CONFIG } from '@/lib/ai-prompts';
import { supabase } from '@/lib/supabase';
import { sanitizePHI } from '@/utils/phiSanitizer';

async function ensureSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return true;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.session) return false;

  // Wait briefly for the client to store the new session
  await new Promise((r) => setTimeout(r, 100));
  return true;
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
      // Ensure we have a valid session (anonymous sign-in if needed)
      const hasSession = await ensureSession();
      if (!hasSession) {
        setError('Unable to authenticate. Please try again.');
        return null;
      }

      const sanitizedInput = sanitizePHI(input);
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-disabilities', {
        body: {
          prompt: `${AI_CONFIG[persona]}\n\nInput: ${sanitizedInput}`,
        },
      });

      if (controller.signal.aborted) return null;

      if (invokeError) {
        // In supabase-js v2, the actual error body may be in data or invokeError.context
        let msg = 'AI service request failed';

        // Try reading the error from the response context
        try {
          if (invokeError.context instanceof Response) {
            const body = await invokeError.context.json();
            if (body?.error) msg = body.error;
            else if (body?.message) msg = body.message;
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
