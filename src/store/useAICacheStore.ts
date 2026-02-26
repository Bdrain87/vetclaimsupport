import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encryptedStorage';

interface AICacheEntry {
  result: string;
  timestamp: number;
  persona: string;
}

interface AICacheState {
  cache: Record<string, AICacheEntry>;
  getCache: (key: string) => string | null;
  setCache: (key: string, result: string, persona: string) => void;
  clearCache: () => void;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_ENTRIES = 100; // Cap to prevent unbounded growth

export const useAICacheStore = create<AICacheState>()(
  persist(
    (set, get) => ({
      cache: {},
      getCache: (key: string) => {
        const entry = get().cache[key];
        if (!entry) return null;
        if (Date.now() - entry.timestamp > CACHE_TTL) {
          const { [key]: _, ...rest } = get().cache;
          set({ cache: rest });
          return null;
        }
        return entry.result;
      },
      setCache: (key: string, result: string, persona: string) => {
        set((state) => {
          const entries = Object.entries(state.cache);
          const cache = { ...state.cache };

          // Evict oldest entries if at capacity
          if (entries.length >= MAX_CACHE_ENTRIES) {
            const sorted = entries.sort(
              ([, a], [, b]) => a.timestamp - b.timestamp,
            );
            const toRemove = sorted.slice(
              0,
              entries.length - MAX_CACHE_ENTRIES + 1,
            );
            for (const [k] of toRemove) {
              delete cache[k];
            }
          }

          cache[key] = { result, timestamp: Date.now(), persona };
          return { cache };
        });
      },
      clearCache: () => set({ cache: {} }),
    }),
    {
      name: 'vcs-ai-cache',
      storage: createJSONStorage(() => encryptedStorage),
      skipHydration: true,
    }
  )
);
