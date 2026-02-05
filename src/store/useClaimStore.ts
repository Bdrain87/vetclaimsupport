import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClaimEntry {
  id: string;
  name: string;
  rating: number;
  isBilateral: boolean;
}

interface UserState {
  isPro: boolean;
  claims: ClaimEntry[];
  logs: any[];
  addClaim: (claim: ClaimEntry) => void;
  removeClaim: (id: string) => void;
  togglePro: (val: boolean) => void;
}

export const useClaimStore = create<UserState>()(
  persist(
    (set) => ({
      isPro: false,
      claims: [],
      logs: [],
      addClaim: (claim) => set((state) => ({ claims: [...state.claims, claim] })),
      removeClaim: (id) => set((state) => ({ claims: state.claims.filter(c => c.id !== id) })),
      togglePro: (val) => set({ isPro: val }),
    }),
    {
      name: 'vet-evidence-vault',
    }
  )
);
