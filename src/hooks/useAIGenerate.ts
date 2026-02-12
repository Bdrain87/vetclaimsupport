import { useCallback } from 'react';
import { useGemini } from './useGemini';
import { useAICacheStore } from '@/store/useAICacheStore';
import { AI_CONFIG } from '@/lib/ai-prompts';

export function useAIGenerate(persona: keyof typeof AI_CONFIG) {
  const { generate, isLoading, cancel, error: geminiError } = useGemini(persona);
  const { getCache, setCache } = useAICacheStore();

  const generateWithCache = useCallback(async (input: string): Promise<string | null> => {
    const cacheKey = `${persona}:${input.substring(0, 500)}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const result = await generate(input);
    if (result) {
      setCache(cacheKey, result, persona);
    }
    return result;
  }, [generate, getCache, setCache, persona]);

  return { generate: generateWithCache, isLoading, cancel, error: geminiError };
}
