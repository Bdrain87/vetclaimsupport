import { useState, useRef, useCallback, useEffect } from 'react';
import { AI_CONFIG } from '@/lib/ai-prompts';
import { supabase } from '@/lib/supabase';
import { sanitizePHI } from '@/utils/phiSanitizer';

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
      const sanitizedInput = sanitizePHI(input);
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-disabilities', {
        body: {
          prompt: `${AI_CONFIG[persona]}\n\nInput: ${sanitizedInput}`,
        },
      });

      if (controller.signal.aborted) return null;

      if (invokeError) {
        const msg = invokeError.message || 'AI service request failed';
        setError(msg);
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
