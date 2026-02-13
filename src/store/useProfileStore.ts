import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/lib/encryptedStorage';

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

export interface ServicePeriod {
  id: string;
  branch: Branch | '';
  mos: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  dutyStation?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  branch: Branch | '';
  mosCode: string;
  mosTitle: string;
  hasCompletedOnboarding: boolean;
  serviceDates?: { start: string; end: string };
  servicePeriods: ServicePeriod[];
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
  setServicePeriods: (periods: ServicePeriod[]) => void;
  addServicePeriod: (period: ServicePeriod) => void;
  updateServicePeriod: (id: string, updates: Partial<ServicePeriod>) => void;
  removeServicePeriod: (id: string) => void;
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
      servicePeriods: [],
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
      setServicePeriods: (periods) => set({ servicePeriods: periods }),
      addServicePeriod: (period) => set((state) => ({
        servicePeriods: [...state.servicePeriods, period],
      })),
      updateServicePeriod: (id, updates) => set((state) => ({
        servicePeriods: state.servicePeriods.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),
      removeServicePeriod: (id) => set((state) => ({
        servicePeriods: state.servicePeriods.filter((p) => p.id !== id),
      })),
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
        servicePeriods: [],
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
      version: 4,
      storage: createJSONStorage(() => encryptedStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('useProfileStore hydration failed:', error);
          }
        };
      },
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
            servicePeriods: [],
          };
        }
        if (version < 3) {
          return {
            ...state,
            entitlement: state.entitlement || 'preview',
            vaultPasscodeSet: state.vaultPasscodeSet ?? false,
            lastSyncedAt: state.lastSyncedAt ?? null,
            servicePeriods: [],
          };
        }
        if (version < 4) {
          // Migrate from single MOS fields to servicePeriods array
          const periods: ServicePeriod[] = [];
          const branch = state.branch as string;
          const mosCode = state.mosCode as string;
          const mosTitle = state.mosTitle as string;
          const serviceDates = state.serviceDates as { start: string; end: string } | undefined;

          if (branch || mosCode) {
            periods.push({
              id: crypto.randomUUID(),
              branch: (branch || '') as Branch | '',
              mos: mosCode || '',
              jobTitle: mosTitle || '',
              startDate: serviceDates?.start || '',
              endDate: serviceDates?.end || '',
            });
          }

          return {
            ...state,
            servicePeriods: periods,
          };
        }
        return state as ProfileState;
      },
    }
  )
);
