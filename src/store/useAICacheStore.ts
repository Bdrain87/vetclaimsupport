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
        set((state) => ({
          cache: {
            ...state.cache,
            [key]: { result, timestamp: Date.now(), persona },
          },
        }));
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
