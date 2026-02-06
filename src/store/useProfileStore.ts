import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Branch = 'army' | 'marines' | 'navy' | 'air_force' | 'coast_guard' | 'space_force';

export const BRANCH_LABELS: Record<Branch, string> = {
  army: 'Army',
  marines: 'Marine Corps',
  navy: 'Navy',
  air_force: 'Air Force',
  coast_guard: 'Coast Guard',
  space_force: 'Space Force',
};

export const BRANCH_COLORS: Record<Branch, string> = {
  army: '#4B5320',
  marines: '#CC0000',
  navy: '#003B6F',
  air_force: '#00308F',
  coast_guard: '#FF6600',
  space_force: '#000000',
};

export interface UserProfile {
  firstName: string;
  lastName: string;
  branch: Branch | '';
  mosCode: string;
  mosTitle: string;
  hasCompletedOnboarding: boolean;
}

interface ProfileState extends UserProfile {
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setBranch: (branch: Branch | '') => void;
  setMOS: (code: string, title: string) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      firstName: '',
      lastName: '',
      branch: '',
      mosCode: '',
      mosTitle: '',
      hasCompletedOnboarding: false,

      setFirstName: (name) => set({ firstName: name }),
      setLastName: (name) => set({ lastName: name }),
      setBranch: (branch) => set({ branch }),
      setMOS: (code, title) => set({ mosCode: code, mosTitle: title }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetProfile: () => set({
        firstName: '',
        lastName: '',
        branch: '',
        mosCode: '',
        mosTitle: '',
        hasCompletedOnboarding: false,
      }),
    }),
    {
      name: 'vet-user-profile',
    }
  )
);
