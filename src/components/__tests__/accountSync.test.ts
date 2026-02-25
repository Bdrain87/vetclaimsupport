/**
 * "What Gets Synced" Modal & Account Tests — Section 22
 *
 * Tests the sync-related copy and sign-in copy.
 */
import { describe, it, expect } from 'vitest';
import { DATA_PRIVACY_COPY, PREMIUM_COPY } from '@/data/legalCopy';

// ---------------------------------------------------------------------------
// 22A: What Gets Synced
// ---------------------------------------------------------------------------
describe('Account Sync — What Gets Synced', () => {
  it('local default copy is present', () => {
    expect(DATA_PRIVACY_COPY.localDefault).toContain('Local-only by default');
  });

  it('what stays local includes health data', () => {
    expect(DATA_PRIVACY_COPY.whatStaysLocal).toContain('Health data');
  });

  it('what stays local includes documents', () => {
    expect(DATA_PRIVACY_COPY.whatStaysLocal).toContain('documents');
  });

  it('what stays local includes vault', () => {
    expect(DATA_PRIVACY_COPY.whatStaysLocal).toContain('vault');
  });

  it('what syncs includes premium entitlement', () => {
    expect(DATA_PRIVACY_COPY.whatSyncs).toContain('Premium entitlement');
  });

  it('what syncs includes account profile', () => {
    expect(DATA_PRIVACY_COPY.whatSyncs).toContain('account profile');
  });
});

// ---------------------------------------------------------------------------
// 22B: Sign-In Copy
// ---------------------------------------------------------------------------
describe('Account Sync — Sign-In Copy', () => {
  it('local default copy mentions cloud sync', () => {
    expect(DATA_PRIVACY_COPY.localDefault).toContain('cloud sync');
  });

  it('local default copy mentions cross-device access', () => {
    expect(DATA_PRIVACY_COPY.localDefault).toContain('cross-device access');
  });

  it('premium copy mentions sign in to sync', () => {
    expect(PREMIUM_COPY.signInNote).toContain('Sign in to sync across devices');
  });
});
