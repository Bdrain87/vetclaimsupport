/**
 * Veteran Profile Persistence
 * Saves and loads veteran profile data (service job code, service dates) to/from localStorage
 */

const STORAGE_KEY = 'vet-claim-veteran-profile';

export interface VeteranProfile {
  // Service job code information (MOS, AFSC, Rating, SFSC depending on branch)
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
 * Get the correct job code label for a given military branch
 */
export function getJobCodeLabel(branch: string): string {
  switch (branch.toLowerCase()) {
    case 'army':
      return 'MOS';
    case 'marines':
      return 'MOS';
    case 'air force':
    case 'air_force':
      return 'AFSC';
    case 'navy':
      return 'Rating/NEC';
    case 'coast guard':
    case 'coast_guard':
      return 'Rating';
    case 'space force':
    case 'space_force':
      return 'SFSC';
    default:
      return 'Service Job Code';
  }
}

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
 * Update just the service job code
 */
export function saveMOS(mos: string, branch?: string): void {
  saveVeteranProfile({
    primaryMOS: mos,
    ...(branch && { branch }),
  });
}

/**
 * Get saved service job code
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
 * Get all unique branch labels from a profile's service periods, with fallback to single branch.
 * Returns a comma-separated string like "Army, Marine Corps" or a single label like "Navy".
 */
export function getAllBranchLabels(profile: {
  branch?: string;
  servicePeriods?: Array<{ branch: string }>;
}): string {
  const LABELS: Record<string, string> = {
    army: 'Army',
    marines: 'Marine Corps',
    navy: 'Navy',
    air_force: 'Air Force',
    coast_guard: 'Coast Guard',
    space_force: 'Space Force',
  };

  const periods = profile.servicePeriods || [];
  const uniqueBranches: string[] = [];

  for (const period of periods) {
    if (period.branch) {
      const label = LABELS[period.branch] || period.branch;
      if (!uniqueBranches.includes(label)) {
        uniqueBranches.push(label);
      }
    }
  }

  if (uniqueBranches.length > 0) return uniqueBranches.join(', ');

  // Fallback to single branch
  if (profile.branch) {
    return LABELS[profile.branch] || profile.branch;
  }

  return '';
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
