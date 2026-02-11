import { useState, useRef, useCallback, useEffect } from 'react';
import { AI_CONFIG } from '@/lib/ai-prompts';
import { supabase } from '@/lib/supabase';

export const useGemini = (persona: keyof typeof AI_CONFIG) => {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (input: string): Promise<string | null> => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-disabilities', {
        body: {
          prompt: `${AI_CONFIG[persona]}\n\nInput: ${input}`,
        },
      });

      if (controller.signal.aborted) return null;

      if (error) {
        throw new Error(error.message || 'AI service request failed');
      }

      const text = data?.analysis;
      if (!text) {
        throw new Error('Unexpected response format from AI service');
      }
      return text;
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return null;
      }
      console.error('[useGemini]', error);
      return null;
    } finally {
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

  return { generate, isLoading, cancel };
};
