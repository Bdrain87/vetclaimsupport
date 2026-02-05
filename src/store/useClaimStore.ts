import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ClaimState {
  isPro: boolean;
  biometricUnlocked: boolean;
  activeExaminerChat: any[];
  currentNexusSelection: string | null;
  setNexus: (id: string) => void;
  togglePro: (status: boolean) => void;
}

export const useClaimStore = create<ClaimState>()(
  persist(
    (set) => ({
      isPro: false,
      biometricUnlocked: false,
      activeExaminerChat: [],
      currentNexusSelection: null,
      setNexus: (id) => set({ currentNexusSelection: id }),
      togglePro: (status) => set({ isPro: status }),
    }),
    { name: 'platinum-vault-storage' }
  )
);
