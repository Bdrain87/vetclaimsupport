import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClaimEntry {
  id: string;
  name: string;
  rating: number;
  isBilateral: boolean;
  conditionId?: string;
  bodySystem?: string;
  diagnosticCode?: string;
  secondaryTo?: string;
  claimType?: 'new' | 'increase' | 'secondary';
  dateAdded?: string;
}

interface UserState {
  isPro: boolean;
  claims: ClaimEntry[];
  logs: string[];
  addClaim: (claim: ClaimEntry) => void;
  removeClaim: (id: string) => void;
  updateClaim: (id: string, updates: Partial<ClaimEntry>) => void;
  togglePro: (val: boolean) => void;
  setClaims: (claims: ClaimEntry[]) => void;
}

export const useClaimStore = create<UserState>()(
  persist(
    (set) => ({
      isPro: false,
      claims: [],
      logs: [],
      addClaim: (claim) => set((state) => ({ claims: [...state.claims, claim] })),
      removeClaim: (id) => set((state) => ({ claims: state.claims.filter(c => c.id !== id) })),
      updateClaim: (id, updates) => set((state) => ({
        claims: state.claims.map(c => c.id === id ? { ...c, ...updates } : c),
      })),
      togglePro: (val) => set({ isPro: val }),
      setClaims: (claims) => set({ claims }),
    }),
    {
      name: 'vet-evidence-vault',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          return {
            ...state,
            claims: (Array.isArray(state.claims) ? state.claims : []).map((c: Record<string, unknown>) => ({
              ...c,
              conditionId: c.conditionId || undefined,
              bodySystem: c.bodySystem || undefined,
              diagnosticCode: c.diagnosticCode || undefined,
              secondaryTo: c.secondaryTo || undefined,
              claimType: c.claimType || 'new',
              dateAdded: c.dateAdded || new Date().toISOString(),
            })),
          };
        }
        return state as UserState;
      },
    }
  )
);
