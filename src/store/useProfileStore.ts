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

export type ClaimGoal = 'initial' | 'increase' | 'secondary' | 'appeal' | 'exploring';

export interface UserProfile {
  firstName: string;
  lastName: string;
  branch: Branch | '';
  mosCode: string;
  mosTitle: string;
  hasCompletedOnboarding: boolean;
  serviceDates?: { start: string; end: string };
  claimType?: 'initial' | 'increase' | 'supplemental';
  claimGoal?: ClaimGoal;
  intentToFileFiled?: boolean;
  intentToFileDate?: string;
  separationDate?: string;
  entitlement: 'preview' | 'lifetime';
  vaultPasscodeSet: boolean;
  lastSyncedAt: string | null;
}

interface ProfileState extends UserProfile {
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setBranch: (branch: Branch | '') => void;
  setMOS: (code: string, title: string) => void;
  setServiceDates: (dates: { start: string; end: string }) => void;
  setClaimType: (type: 'initial' | 'increase' | 'supplemental') => void;
  setClaimGoal: (goal: ClaimGoal) => void;
  setIntentToFile: (filed: boolean, date?: string) => void;
  setSeparationDate: (date: string) => void;
  setEntitlement: (entitlement: 'preview' | 'lifetime') => void;
  setVaultPasscodeSet: (set: boolean) => void;
  setLastSyncedAt: (date: string | null) => void;
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
      serviceDates: undefined,
      claimType: undefined,
      claimGoal: undefined,
      intentToFileFiled: undefined,
      intentToFileDate: undefined,
      separationDate: undefined,
      entitlement: 'preview',
      vaultPasscodeSet: false,
      lastSyncedAt: null,

      setFirstName: (name) => set({ firstName: name }),
      setLastName: (name) => set({ lastName: name }),
      setBranch: (branch) => set({ branch }),
      setMOS: (code, title) => set({ mosCode: code, mosTitle: title }),
      setServiceDates: (dates) => set({ serviceDates: dates }),
      setClaimType: (type) => set({ claimType: type }),
      setClaimGoal: (goal) => set({ claimGoal: goal }),
      setIntentToFile: (filed, date) => set({ intentToFileFiled: filed, intentToFileDate: date }),
      setSeparationDate: (date) => set({ separationDate: date }),
      setEntitlement: (entitlement) => set({ entitlement }),
      setVaultPasscodeSet: (val) => set({ vaultPasscodeSet: val }),
      setLastSyncedAt: (date) => set({ lastSyncedAt: date }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetProfile: () => set({
        firstName: '',
        lastName: '',
        branch: '',
        mosCode: '',
        mosTitle: '',
        hasCompletedOnboarding: false,
        serviceDates: undefined,
        claimType: undefined,
        claimGoal: undefined,
        intentToFileFiled: undefined,
        intentToFileDate: undefined,
        separationDate: undefined,
        entitlement: 'preview',
        vaultPasscodeSet: false,
        lastSyncedAt: null,
      }),
    }),
    {
      name: 'vet-user-profile',
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 2) {
          return {
            ...state,
            serviceDates: state.serviceDates || undefined,
            claimType: state.claimType || undefined,
            intentToFileFiled: state.intentToFileFiled || undefined,
            intentToFileDate: state.intentToFileDate || undefined,
            separationDate: state.separationDate || undefined,
            entitlement: 'preview',
            vaultPasscodeSet: false,
            lastSyncedAt: null,
          };
        }
        if (version < 3) {
          return {
            ...state,
            entitlement: state.entitlement || 'preview',
            vaultPasscodeSet: state.vaultPasscodeSet ?? false,
            lastSyncedAt: state.lastSyncedAt ?? null,
          };
        }
        return state as ProfileState;
      },
    }
  )
);
