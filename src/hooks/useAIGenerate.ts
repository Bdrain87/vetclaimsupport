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

    const cacheKey = `${persona}:${input.substring(0, 500)}`;
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
