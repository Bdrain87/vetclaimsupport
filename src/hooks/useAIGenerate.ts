import { useCallback } from 'react';
import { useGemini } from './useGemini';
import { useAICacheStore } from '@/store/useAICacheStore';
import { AI_CONFIG } from '@/lib/ai-prompts';

/** Simple hash to avoid storing medical text as cache keys. */
async function hashInput(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useAIGenerate(persona: keyof typeof AI_CONFIG) {
  const { generate, isLoading, cancel, error: geminiError } = useGemini(persona);
  const { getCache, setCache } = useAICacheStore();

  const generateWithCache = useCallback(async (input: string): Promise<string | null> => {
    const inputHash = await hashInput(input);
    const cacheKey = `${persona}:${inputHash}`;
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
