/**
 * Mock backup file structures for testing backup/restore.
 */

export const VALID_BACKUP = {
  version: '1.0',
  exportDate: '2024-06-15T10:30:00.000Z',
  profile: {
    firstName: 'James',
    lastName: 'Rodriguez',
    branch: 'army',
    mosCode: '11B',
    mosTitle: 'Infantryman',
    entitlement: 'premium',
    vaultPasscodeSet: false,
    servicePeriods: [
      {
        id: 'sp-1',
        branch: 'army',
        mos: '11B',
        jobTitle: 'Infantryman',
        startDate: '2008-06-15',
        endDate: '2012-06-15',
      },
    ],
  },
  appData: {
    symptoms: [
      { id: 's1', date: '2024-06-01', symptom: 'Lower back pain', severity: 7, frequency: 'daily' },
    ],
    medications: [
      { id: 'm1', name: 'Sertraline', dosage: '50mg', reason: 'PTSD' },
    ],
    migraines: [
      { id: 'mg1', date: '2024-06-10', severity: 8, duration: '4 hours', prostrating: true },
    ],
    sleepEntries: [
      { id: 'sl1', date: '2024-06-14', hoursSlept: 4, quality: 'poor' },
    ],
    quickLogs: [],
    medicalVisits: [],
    exposures: [],
  },
  settings: {
    aiSafeLevel: 0,
    theme: 'dark',
    notificationsEnabled: false,
    reminderTime: '09:00',
  },
};

export const EMPTY_BACKUP = {
  version: '1.0',
  exportDate: '2024-06-15T10:30:00.000Z',
  profile: {
    firstName: '',
    lastName: '',
    branch: '',
    mosCode: '',
    mosTitle: '',
    entitlement: 'preview',
    vaultPasscodeSet: false,
    servicePeriods: [],
  },
  appData: {
    symptoms: [],
    medications: [],
    migraines: [],
    sleepEntries: [],
    quickLogs: [],
    medicalVisits: [],
    exposures: [],
  },
  settings: {
    aiSafeLevel: 0,
    theme: 'dark',
    notificationsEnabled: false,
    reminderTime: '09:00',
  },
};

export const CORRUPTED_BACKUP = '{"version": "1.0", "invalid_json_here: broken';

export const WRONG_TYPE_BACKUP = '<html><body>Not a backup file</body></html>';

export const FUTURE_VERSION_BACKUP = {
  version: '99.0',
  exportDate: '2030-01-01T00:00:00.000Z',
  profile: { firstName: 'Future', lastName: 'Veteran' },
  appData: {},
  settings: {},
};

export const OLDER_VERSION_BACKUP = {
  version: '0.5',
  exportDate: '2023-01-01T00:00:00.000Z',
  profile: { firstName: 'Old', lastName: 'Veteran' },
  appData: { symptoms: [] },
  settings: {},
};
