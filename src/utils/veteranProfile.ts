/**
 * Veteran Profile Persistence
 * Saves and loads veteran profile data (MOS/AFSC, service dates) to/from localStorage
 */

const STORAGE_KEY = 'vet-claim-veteran-profile';

export interface VeteranProfile {
  // MOS/AFSC information
  primaryMOS: string;
  branch: string;

  // Service dates
  serviceStartDate: string;
  serviceEndDate: string;

  // Additional profile info
  rank?: string;
  lastUpdated: number;
}

const defaultProfile: VeteranProfile = {
  primaryMOS: '',
  branch: '',
  serviceStartDate: '',
  serviceEndDate: '',
  rank: '',
  lastUpdated: 0,
};

/**
 * Get veteran profile from localStorage
 */
export function getVeteranProfile(): VeteranProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultProfile, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load veteran profile from localStorage:', error);
  }
  return { ...defaultProfile };
}

/**
 * Save veteran profile to localStorage
 */
export function saveVeteranProfile(profile: Partial<VeteranProfile>): void {
  try {
    const current = getVeteranProfile();
    const updated: VeteranProfile = {
      ...current,
      ...profile,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save veteran profile to localStorage:', error);
  }
}

/**
 * Update just the MOS/AFSC
 */
export function saveMOS(mos: string, branch?: string): void {
  saveVeteranProfile({
    primaryMOS: mos,
    ...(branch && { branch }),
  });
}

/**
 * Get saved MOS/AFSC
 */
export function getSavedMOS(): { mos: string; branch: string } {
  const profile = getVeteranProfile();
  return {
    mos: profile.primaryMOS,
    branch: profile.branch,
  };
}

/**
 * Update service dates
 */
export function saveServiceDates(startDate: string, endDate: string): void {
  saveVeteranProfile({
    serviceStartDate: startDate,
    serviceEndDate: endDate,
  });
}

/**
 * Get saved service dates
 */
export function getSavedServiceDates(): { startDate: string; endDate: string } {
  const profile = getVeteranProfile();
  return {
    startDate: profile.serviceStartDate,
    endDate: profile.serviceEndDate,
  };
}

/**
 * Clear veteran profile
 */
export function clearVeteranProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear veteran profile from localStorage:', error);
  }
}
