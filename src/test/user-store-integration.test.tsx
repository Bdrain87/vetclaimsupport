/**
 * Store Integration & Data Persistence Tests
 *
 * Tests Zustand stores directly for state transitions,
 * data persistence, and store interactions.
 */
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { useProfileStore } from '@/store/useProfileStore';
import { useAICacheStore } from '@/store/useAICacheStore';

// ── useAppStore ───────────────────────────────────────────────────────────
// useAppStore uses encryptedStorage + indexedDB which need dynamic import in jsdom

describe('useAppStore Integration', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appStore: any;

  beforeAll(async () => {
    const mod = await import('@/store/useAppStore');
    appStore = mod.default;
  });

  beforeEach(() => {
    appStore?.getState().resetAllData();
  });

  it('starts with empty arrays after reset', () => {
    const state = appStore.getState();
    expect(state.symptoms).toEqual([]);
    expect(state.medications).toEqual([]);
    expect(state.medicalVisits).toEqual([]);
    expect(state.exposures).toEqual([]);
    expect(state.buddyContacts).toEqual([]);
    expect(state.quickLogs).toEqual([]);
    expect(state.userConditions).toEqual([]);
    expect(state.migraines).toEqual([]);
    expect(state.sleepEntries).toEqual([]);
  });

  it('has default documents checklist', () => {
    const state = appStore.getState();
    expect(state.documents.length).toBeGreaterThan(0);
    expect(state.documents[0].name).toBe('Service Treatment Records (STRs)');
  });

  it('adds and retrieves a user condition', () => {
    const condition = {
      id: 'test-1',
      conditionId: 'tinnitus',
      serviceConnected: true,
      claimStatus: 'pending' as const,
      isPrimary: true,
      dateAdded: '2025-06-15',
    };

    appStore.getState().addUserCondition(condition);
    expect(appStore.getState().userConditions).toHaveLength(1);
    expect(appStore.getState().userConditions[0].conditionId).toBe('tinnitus');
  });

  it('removes a user condition by id', () => {
    appStore.getState().addUserCondition({
      id: 'test-remove',
      conditionId: 'ptsd',
      serviceConnected: true,
      claimStatus: 'pending' as const,
      isPrimary: true,
      dateAdded: '2025-06-15',
    });
    expect(appStore.getState().userConditions).toHaveLength(1);

    appStore.getState().removeUserCondition('test-remove');
    expect(appStore.getState().userConditions).toHaveLength(0);
  });

  it('updates a user condition', () => {
    appStore.getState().addUserCondition({
      id: 'test-update',
      conditionId: 'knee-pain',
      serviceConnected: true,
      claimStatus: 'pending' as const,
      isPrimary: true,
      dateAdded: '2025-06-15',
    });

    appStore.getState().updateUserCondition('test-update', {
      claimStatus: 'approved',
      rating: 30,
    });

    const updated = appStore.getState().userConditions[0];
    expect(updated.claimStatus).toBe('approved');
    expect(updated.rating).toBe(30);
  });

  it('clears all user conditions', () => {
    appStore.getState().addUserCondition({
      id: '1',
      conditionId: 'a',
      serviceConnected: true,
      claimStatus: 'pending' as const,
      isPrimary: true,
      dateAdded: '2025-01-01',
    });
    appStore.getState().addUserCondition({
      id: '2',
      conditionId: 'b',
      serviceConnected: true,
      claimStatus: 'pending' as const,
      isPrimary: false,
      dateAdded: '2025-01-01',
    });

    expect(appStore.getState().userConditions).toHaveLength(2);
    appStore.getState().clearAllUserConditions();
    expect(appStore.getState().userConditions).toHaveLength(0);
  });

  it('adds a quick log', () => {
    appStore.getState().addQuickLog({
      date: new Date().toISOString(),
      overallFeeling: 7,
      hadFlareUp: false,
      flareUpNote: '',
      painLevel: 7,
      mood: 'bad',
      condition: 'knee-pain',
      notes: 'Flare-up today',
      createdAt: new Date().toISOString(),
    });

    expect(appStore.getState().quickLogs).toHaveLength(1);
    expect(appStore.getState().quickLogs[0].mood).toBe('bad');
  });

  it('sets and clears form drafts', () => {
    appStore.getState().setFormDraft('buddy-statement', 'name', 'John Doe');
    appStore.getState().setFormDraft('buddy-statement', 'relationship', 'Fellow Soldier');

    const drafts = appStore.getState().formDrafts;
    expect(drafts['buddy-statement']).toBeDefined();
    expect(drafts['buddy-statement'].name).toBe('John Doe');

    appStore.getState().clearFormDraft('buddy-statement');
    expect(appStore.getState().formDrafts['buddy-statement']).toBeUndefined();
  });

  it('adds a milestone', () => {
    appStore.getState().addMilestone('first-log');
    expect(appStore.getState().milestonesAchieved).toContain('first-log');
  });

  it('toggles evidence check', () => {
    appStore.getState().toggleEvidenceCheck('tinnitus', 'medical-records');
    expect(appStore.getState().conditionEvidenceChecks['tinnitus']).toContain(
      'medical-records',
    );

    // Toggle again removes it
    appStore.getState().toggleEvidenceCheck('tinnitus', 'medical-records');
    expect(
      appStore.getState().conditionEvidenceChecks['tinnitus'],
    ).not.toContain('medical-records');
  });

  it('resetAllData clears all data', () => {
    appStore.getState().addUserCondition({
      id: 'x',
      conditionId: 'x',
      serviceConnected: true,
      claimStatus: 'pending' as const,
      isPrimary: true,
      dateAdded: '2025-01-01',
    });
    appStore.getState().addQuickLog({
      date: new Date().toISOString(),
      overallFeeling: 1,
      hadFlareUp: false,
      flareUpNote: '',
      painLevel: 1,
      mood: 'good',
      condition: 'general',
      notes: '',
      createdAt: new Date().toISOString(),
    });
    appStore.getState().addMilestone('test');

    appStore.getState().resetAllData();

    expect(appStore.getState().userConditions).toHaveLength(0);
    expect(appStore.getState().quickLogs).toHaveLength(0);
    expect(appStore.getState().symptoms).toHaveLength(0);
    expect(appStore.getState().milestonesAchieved).toHaveLength(0);
  });
});

// ── useProfileStore ───────────────────────────────────────────────────────

describe('useProfileStore Integration', () => {
  beforeEach(() => {
    useProfileStore.getState().resetProfile();
  });

  it('starts with default values', () => {
    const state = useProfileStore.getState();
    expect(state.firstName).toBe('');
    expect(state.lastName).toBe('');
    expect(state.branch).toBe('');
    expect(state.mosCode).toBe('');
    expect(state.mosTitle).toBe('');
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.entitlement).toBe('preview');
    expect(state.vaultPasscodeSet).toBe(false);
  });

  it('sets first and last name', () => {
    useProfileStore.getState().setFirstName('Blake');
    useProfileStore.getState().setLastName('Drain');

    expect(useProfileStore.getState().firstName).toBe('Blake');
    expect(useProfileStore.getState().lastName).toBe('Drain');
  });

  it('sets branch', () => {
    useProfileStore.getState().setBranch('army');
    expect(useProfileStore.getState().branch).toBe('army');
  });

  it('sets MOS code and title', () => {
    useProfileStore.getState().setMOS('11B', 'Infantryman');
    expect(useProfileStore.getState().mosCode).toBe('11B');
    expect(useProfileStore.getState().mosTitle).toBe('Infantryman');
  });

  it('completes onboarding', () => {
    expect(useProfileStore.getState().hasCompletedOnboarding).toBe(false);
    useProfileStore.getState().completeOnboarding();
    expect(useProfileStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('sets claim type and goal', () => {
    useProfileStore.getState().setClaimType('increase');
    useProfileStore.getState().setClaimGoal('secondary');

    expect(useProfileStore.getState().claimType).toBe('increase');
    expect(useProfileStore.getState().claimGoal).toBe('secondary');
  });

  it('sets intent to file', () => {
    useProfileStore.getState().setIntentToFile(true, '2025-06-15');
    expect(useProfileStore.getState().intentToFileFiled).toBe(true);
    expect(useProfileStore.getState().intentToFileDate).toBe('2025-06-15');
  });

  it('sets separation date', () => {
    useProfileStore.getState().setSeparationDate('2025-12-01');
    expect(useProfileStore.getState().separationDate).toBe('2025-12-01');
  });

  it('sets entitlement level', () => {
    useProfileStore.getState().setEntitlement('premium');
    expect(useProfileStore.getState().entitlement).toBe('premium');
  });

  it('manages service periods', () => {
    const period = {
      id: 'sp-1',
      branch: 'army' as const,
      mos: '11B',
      jobTitle: 'Infantryman',
      startDate: '2010-01-01',
      endDate: '2014-01-01',
    };

    useProfileStore.getState().addServicePeriod(period);
    expect(useProfileStore.getState().servicePeriods).toHaveLength(1);

    useProfileStore.getState().updateServicePeriod('sp-1', { mos: '13F' });
    expect(useProfileStore.getState().servicePeriods[0].mos).toBe('13F');

    useProfileStore.getState().removeServicePeriod('sp-1');
    expect(useProfileStore.getState().servicePeriods).toHaveLength(0);
  });

  it('resets profile to defaults', () => {
    useProfileStore.getState().setFirstName('Test');
    useProfileStore.getState().setBranch('navy');
    useProfileStore.getState().completeOnboarding();
    useProfileStore.getState().setEntitlement('premium');

    useProfileStore.getState().resetProfile();

    expect(useProfileStore.getState().firstName).toBe('');
    expect(useProfileStore.getState().branch).toBe('');
    expect(useProfileStore.getState().hasCompletedOnboarding).toBe(false);
    expect(useProfileStore.getState().entitlement).toBe('preview');
  });
});

// ── useAICacheStore ───────────────────────────────────────────────────────

describe('useAICacheStore Integration', () => {
  beforeEach(() => {
    useAICacheStore.getState().clearCache();
  });

  it('starts with empty cache', () => {
    expect(useAICacheStore.getState().cache).toEqual({});
  });

  it('sets and retrieves cache entry', () => {
    useAICacheStore.getState().setCache('test-key', 'test-result', 'default');
    const cached = useAICacheStore.getState().getCache('test-key');
    expect(cached).toBe('test-result');
  });

  it('returns null for non-existent cache key', () => {
    const cached = useAICacheStore.getState().getCache('nonexistent');
    expect(cached).toBeNull();
  });

  it('overwrites existing cache entry', () => {
    useAICacheStore.getState().setCache('k1', 'v1', 'p1');
    useAICacheStore.getState().setCache('k1', 'v2', 'p2');
    expect(useAICacheStore.getState().getCache('k1')).toBe('v2');
  });

  it('clears all cache entries', () => {
    useAICacheStore.getState().setCache('k1', 'v1', 'p1');
    useAICacheStore.getState().setCache('k2', 'v2', 'p2');
    useAICacheStore.getState().clearCache();
    expect(useAICacheStore.getState().cache).toEqual({});
  });
});
