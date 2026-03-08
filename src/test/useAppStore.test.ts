/**
 * useAppStore — Zustand store unit tests
 *
 * Tests initial state, CRUD actions for symptoms / form drafts / user conditions /
 * milestones / evidence checklist, and the global resetAllData action.
 *
 * The store is wrapped with the `persist` middleware backed by `encryptedStorage`
 * which delegates to `localStorage`.  We mock the encrypted-storage module so that
 * persistence writes go straight to the jsdom localStorage provided by vitest's
 * setup file, and we mock `@/lib/indexedDB` to avoid real IndexedDB calls.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — must be declared before the store import so vitest can hoist them
// ---------------------------------------------------------------------------

vi.mock('@/lib/encryptedStorage', () => ({
  encryptedStorage: {
    getItem: (key: string) => localStorage.getItem(key),
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    removeItem: (key: string) => localStorage.removeItem(key),
  },
}));

vi.mock('@/lib/indexedDB', () => ({
  storeFileData: vi.fn().mockResolvedValue(undefined),
  getFileData: vi.fn().mockResolvedValue(null),
  deleteFileData: vi.fn().mockResolvedValue(undefined),
  INDEXEDDB_THRESHOLD: 500 * 1024,
  isIndexedDBAvailable: () => false,
}));

// Mock entitlements so free-tier limits don't block test data creation
vi.mock('@/services/entitlements', () => ({
  canAddCondition: () => true,
  canAddHealthLog: () => true,
}));

// Now import the store (the mocks above will be active)
import useAppStore from '@/store/useAppStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Reset the store to pristine initial state between tests. */
function resetStore() {
  useAppStore.getState().resetAllData();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------
  describe('initial state', () => {
    it('starts with empty arrays for all collection fields', () => {
      const s = useAppStore.getState();
      expect(s.medicalVisits).toEqual([]);
      expect(s.exposures).toEqual([]);
      expect(s.symptoms).toEqual([]);
      expect(s.medications).toEqual([]);
      expect(s.serviceHistory).toEqual([]);
      expect(s.combatHistory).toEqual([]);
      expect(s.majorEvents).toEqual([]);
      expect(s.deployments).toEqual([]);
      expect(s.buddyContacts).toEqual([]);
      expect(s.migraines).toEqual([]);
      expect(s.sleepEntries).toEqual([]);
      expect(s.ptsdSymptoms).toEqual([]);
      expect(s.uploadedDocuments).toEqual([]);
      expect(s.claimConditions).toEqual([]);
      expect(s.quickLogs).toEqual([]);
      expect(s.deadlines).toEqual([]);
      expect(s.milestonesAchieved).toEqual([]);
      expect(s.approvedConditions).toEqual([]);
      expect(s.dutyStations).toEqual([]);
      expect(s.userConditions).toEqual([]);
      expect(s.evidenceDocuments).toEqual([]);
      expect(s.claimDocuments).toEqual([]);
    });

    it('starts with the default documents checklist (10 items)', () => {
      const docs = useAppStore.getState().documents;
      expect(docs.length).toBe(10);
      expect(docs[0].name).toBe('Service Treatment Records (STRs)');
      expect(docs.every((d) => d.status === 'Not Started')).toBe(true);
    });

    it('starts with documentScanDisclaimerShown as false', () => {
      expect(useAppStore.getState().documentScanDisclaimerShown).toBe(false);
    });

    it('starts with empty formDrafts', () => {
      expect(useAppStore.getState().formDrafts).toEqual({});
    });

    it('starts with empty conditionEvidenceChecks', () => {
      expect(useAppStore.getState().conditionEvidenceChecks).toEqual({});
    });

    it('starts with default journeyProgress', () => {
      const jp = useAppStore.getState().journeyProgress;
      expect(jp.currentPhase).toBe(0);
      expect(jp.completedChecklist).toEqual({});
    });
  });

  // -------------------------------------------------------------------------
  // Symptoms CRUD
  // -------------------------------------------------------------------------
  describe('addSymptom / updateSymptom / deleteSymptom', () => {
    it('addSymptom appends a new symptom with a generated id', () => {
      useAppStore.getState().addSymptom({
        date: '2025-01-01',
        symptom: 'Knee pain',
        bodyArea: 'Left knee',
        severity: 7,
        frequency: 'Daily',
        dailyImpact: 'Cannot run',
        notes: '',
      });

      const symptoms = useAppStore.getState().symptoms;
      expect(symptoms).toHaveLength(1);
      expect(symptoms[0].symptom).toBe('Knee pain');
      expect(symptoms[0].id).toBeTruthy();
    });

    it('updateSymptom modifies the correct entry', () => {
      useAppStore.getState().addSymptom({
        date: '2025-01-01',
        symptom: 'Knee pain',
        bodyArea: 'Left knee',
        severity: 7,
        frequency: 'Daily',
        dailyImpact: 'Cannot run',
        notes: '',
      });

      const id = useAppStore.getState().symptoms[0].id;
      useAppStore.getState().updateSymptom(id, { severity: 9 });

      expect(useAppStore.getState().symptoms[0].severity).toBe(9);
      expect(useAppStore.getState().symptoms[0].symptom).toBe('Knee pain');
    });

    it('deleteSymptom removes the correct entry', () => {
      useAppStore.getState().addSymptom({
        date: '2025-01-01',
        symptom: 'Knee pain',
        bodyArea: 'Left knee',
        severity: 7,
        frequency: 'Daily',
        dailyImpact: '',
        notes: '',
      });
      useAppStore.getState().addSymptom({
        date: '2025-01-02',
        symptom: 'Back pain',
        bodyArea: 'Lower back',
        severity: 5,
        frequency: 'Weekly',
        dailyImpact: '',
        notes: '',
      });

      const firstId = useAppStore.getState().symptoms[0].id;
      useAppStore.getState().deleteSymptom(firstId);

      const remaining = useAppStore.getState().symptoms;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].symptom).toBe('Back pain');
    });
  });

  // -------------------------------------------------------------------------
  // Form Drafts
  // -------------------------------------------------------------------------
  describe('setFormDraft / clearFormDraft', () => {
    it('setFormDraft creates a draft for a form and field', () => {
      useAppStore.getState().setFormDraft('form-21-526ez', 'fullName', 'John Doe');

      const drafts = useAppStore.getState().formDrafts;
      expect(drafts['form-21-526ez']).toBeDefined();
      expect(drafts['form-21-526ez'].fullName).toBe('John Doe');
      expect(drafts['form-21-526ez'].lastModified).toBeTruthy();
    });

    it('setFormDraft accumulates multiple fields under the same form', () => {
      const { setFormDraft } = useAppStore.getState();
      setFormDraft('form-21-526ez', 'fullName', 'John Doe');
      setFormDraft('form-21-526ez', 'ssn', '123-45-6789');

      const draft = useAppStore.getState().formDrafts['form-21-526ez'];
      expect(draft.fullName).toBe('John Doe');
      expect(draft.ssn).toBe('123-45-6789');
    });

    it('setFormDraft overwrites a field value for an existing form', () => {
      const { setFormDraft } = useAppStore.getState();
      setFormDraft('form-21-526ez', 'fullName', 'John Doe');
      setFormDraft('form-21-526ez', 'fullName', 'Jane Doe');

      expect(useAppStore.getState().formDrafts['form-21-526ez'].fullName).toBe('Jane Doe');
    });

    it('clearFormDraft removes the draft for a specific form', () => {
      const { setFormDraft } = useAppStore.getState();
      setFormDraft('form-21-526ez', 'fullName', 'John Doe');
      setFormDraft('form-0781', 'event', 'combat');

      useAppStore.getState().clearFormDraft('form-21-526ez');

      const drafts = useAppStore.getState().formDrafts;
      expect(drafts['form-21-526ez']).toBeUndefined();
      expect(drafts['form-0781']).toBeDefined();
    });

    it('clearFormDraft is a no-op for a non-existent form', () => {
      useAppStore.getState().clearFormDraft('non-existent');
      expect(useAppStore.getState().formDrafts).toEqual({});
    });
  });

  // -------------------------------------------------------------------------
  // User Conditions
  // -------------------------------------------------------------------------
  describe('user conditions (add / remove / update / clearAll)', () => {
    const baseCond = {
      id: 'cond-1',
      conditionId: 'ptsd',
      serviceConnected: true,
      claimStatus: 'pending' as const,
      isPrimary: true,
      dateAdded: '2025-01-01',
    };

    it('addUserCondition appends a condition', () => {
      useAppStore.getState().addUserCondition(baseCond);
      expect(useAppStore.getState().userConditions).toHaveLength(1);
      expect(useAppStore.getState().userConditions[0].conditionId).toBe('ptsd');
    });

    it('updateUserCondition modifies the correct condition', () => {
      useAppStore.getState().addUserCondition(baseCond);
      useAppStore.getState().updateUserCondition('cond-1', { rating: 70 });

      expect(useAppStore.getState().userConditions[0].rating).toBe(70);
    });

    it('removeUserCondition removes the condition and linked secondaries', () => {
      useAppStore.getState().addUserCondition(baseCond);
      useAppStore.getState().addUserCondition({
        id: 'cond-2',
        conditionId: 'depression',
        serviceConnected: true,
        claimStatus: 'pending',
        isPrimary: false,
        linkedPrimaryId: 'cond-1',
        dateAdded: '2025-01-01',
      });

      // Remove the primary — should also remove the secondary
      useAppStore.getState().removeUserCondition('cond-1');
      expect(useAppStore.getState().userConditions).toHaveLength(0);
    });

    it('removeUserCondition for a secondary only removes that entry', () => {
      useAppStore.getState().addUserCondition(baseCond);
      useAppStore.getState().addUserCondition({
        id: 'cond-2',
        conditionId: 'depression',
        serviceConnected: true,
        claimStatus: 'pending',
        isPrimary: false,
        linkedPrimaryId: 'cond-1',
        dateAdded: '2025-01-01',
      });

      useAppStore.getState().removeUserCondition('cond-2');
      const remaining = useAppStore.getState().userConditions;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('cond-1');
    });

    it('clearAllUserConditions empties the array', () => {
      useAppStore.getState().addUserCondition(baseCond);
      useAppStore.getState().clearAllUserConditions();
      expect(useAppStore.getState().userConditions).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // Milestones
  // -------------------------------------------------------------------------
  describe('addMilestone', () => {
    it('appends a unique milestone', () => {
      useAppStore.getState().addMilestone('first-symptom');
      useAppStore.getState().addMilestone('first-export');

      expect(useAppStore.getState().milestonesAchieved).toEqual([
        'first-symptom',
        'first-export',
      ]);
    });

    it('deduplicates milestone entries', () => {
      useAppStore.getState().addMilestone('first-symptom');
      useAppStore.getState().addMilestone('first-symptom');

      expect(useAppStore.getState().milestonesAchieved).toEqual(['first-symptom']);
    });
  });

  // -------------------------------------------------------------------------
  // Evidence Checklist
  // -------------------------------------------------------------------------
  describe('toggleEvidenceCheck', () => {
    it('adds an item when not present', () => {
      useAppStore.getState().toggleEvidenceCheck('ptsd', 'nexus-letter');
      expect(useAppStore.getState().conditionEvidenceChecks['ptsd']).toEqual(['nexus-letter']);
    });

    it('removes an item when already present (toggle off)', () => {
      useAppStore.getState().toggleEvidenceCheck('ptsd', 'nexus-letter');
      useAppStore.getState().toggleEvidenceCheck('ptsd', 'nexus-letter');
      expect(useAppStore.getState().conditionEvidenceChecks['ptsd']).toEqual([]);
    });

    it('handles multiple items per condition independently', () => {
      const toggle = useAppStore.getState().toggleEvidenceCheck;
      toggle('ptsd', 'nexus-letter');
      toggle('ptsd', 'buddy-statement');

      const checks = useAppStore.getState().conditionEvidenceChecks['ptsd'];
      expect(checks).toContain('nexus-letter');
      expect(checks).toContain('buddy-statement');
      expect(checks).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // Journey Progress
  // -------------------------------------------------------------------------
  describe('setJourneyProgress', () => {
    it('updates journey progress partially', () => {
      useAppStore.getState().setJourneyProgress({ currentPhase: 2 });
      const jp = useAppStore.getState().journeyProgress;
      expect(jp.currentPhase).toBe(2);
      expect(jp.completedChecklist).toEqual({});
    });

    it('merges with existing journey progress', () => {
      useAppStore.getState().setJourneyProgress({ currentPhase: 1 });
      useAppStore.getState().setJourneyProgress({ completedChecklist: { step1: true } });

      const jp = useAppStore.getState().journeyProgress;
      expect(jp.currentPhase).toBe(1);
      expect(jp.completedChecklist).toEqual({ step1: true });
    });
  });

  // -------------------------------------------------------------------------
  // Duty Stations
  // -------------------------------------------------------------------------
  describe('addDutyStation / removeDutyStation', () => {
    it('addDutyStation appends a station with generated id', () => {
      useAppStore.getState().addDutyStation({
        baseName: 'Joint Base Andrews',
        startDate: '2020-01-01',
        endDate: '2022-06-01',
      });

      const stations = useAppStore.getState().dutyStations;
      expect(stations).toHaveLength(1);
      expect(stations[0].baseName).toBe('Joint Base Andrews');
      expect(stations[0].id).toBeTruthy();
    });

    it('removeDutyStation removes the correct station', () => {
      useAppStore.getState().addDutyStation({
        baseName: 'Ft Bragg',
        startDate: '2018-01-01',
        endDate: '2020-01-01',
      });
      useAppStore.getState().addDutyStation({
        baseName: 'Camp Pendleton',
        startDate: '2020-01-01',
        endDate: '2022-01-01',
      });

      const firstId = useAppStore.getState().dutyStations[0].id;
      useAppStore.getState().removeDutyStation(firstId);

      const remaining = useAppStore.getState().dutyStations;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].baseName).toBe('Camp Pendleton');
    });
  });

  // -------------------------------------------------------------------------
  // Document checklist update
  // -------------------------------------------------------------------------
  describe('updateDocument', () => {
    it('updates a document status in the default checklist', () => {
      useAppStore.getState().updateDocument('1', { status: 'Obtained' });

      const doc = useAppStore.getState().documents.find((d) => d.id === '1');
      expect(doc?.status).toBe('Obtained');
      expect(doc?.name).toBe('Service Treatment Records (STRs)');
    });
  });

  // -------------------------------------------------------------------------
  // resetAllData
  // -------------------------------------------------------------------------
  describe('resetAllData', () => {
    it('restores the store to initial state', () => {
      // Populate various areas of the store
      useAppStore.getState().addSymptom({
        date: '2025-01-01',
        symptom: 'Knee pain',
        bodyArea: 'Left knee',
        severity: 7,
        frequency: 'Daily',
        dailyImpact: '',
        notes: '',
      });
      useAppStore.getState().setFormDraft('f1', 'a', 'b');
      useAppStore.getState().addMilestone('test');

      useAppStore.getState().resetAllData();

      const s = useAppStore.getState();
      expect(s.symptoms).toEqual([]);
      expect(s.formDrafts).toEqual({});
      expect(s.milestonesAchieved).toEqual([]);
      expect(s.documents.length).toBe(10);
    });
  });
});
