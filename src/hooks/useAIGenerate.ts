import { useState, useCallback } from 'react';
import { useGemini } from './useGemini';
import { useAICacheStore } from '@/store/useAICacheStore';
import { AI_CONFIG } from '@/lib/ai-prompts';

export function useAIGenerate(persona: keyof typeof AI_CONFIG) {
  const { generate, isLoading, cancel } = useGemini(persona);
  const { getCache, setCache } = useAICacheStore();
  const [error, setError] = useState<string | null>(null);

  const generateWithCache = useCallback(async (input: string): Promise<string | null> => {
    setError(null);

    // Check for API key first
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('AI features are temporarily unavailable. Please try again later.');
      return null;
    }

    const cacheKey = `${persona}:${input.substring(0, 200)}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const result = await generate(input);
    if (result) {
      setCache(cacheKey, result, persona);
    } else {
      setError('AI generation failed. Please try again later.');
    }
    return result;
  }, [generate, getCache, setCache, persona]);

  return { generate: generateWithCache, isLoading, cancel, error };
}
