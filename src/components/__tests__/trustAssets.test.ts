/**
 * VSO Cover Page & Trust Assets Tests — Section 24
 *
 * Tests trust-related copy, privacy model statements, and
 * "Not affiliated" placement.
 */
import { describe, it, expect } from 'vitest';
import {
  CORE_DISCLAIMERS,
  DATA_PRIVACY_COPY,
  ABOUT_COPY,
  PREMIUM_COPY,
} from '@/data/legalCopy';

// ---------------------------------------------------------------------------
// 24B: Trust Explainer
// ---------------------------------------------------------------------------
describe('Trust Assets — Privacy Model', () => {
  it('no tracking statement exists', () => {
    expect(DATA_PRIVACY_COPY.noTracking).toBe('No tracking. No ads. No selling data.');
  });

  it('local default copy exists', () => {
    expect(DATA_PRIVACY_COPY.localDefault).toBeTruthy();
  });

  it('about page has privacy-first tagline', () => {
    expect(ABOUT_COPY.tagline).toContain('Privacy-first');
  });

  it('about page has mission blocks', () => {
    expect(ABOUT_COPY.missionBlocks).toHaveLength(3);
  });

  it('about page mentions privacy by design', () => {
    const privacyBlock = ABOUT_COPY.missionBlocks.find((b) => b.heading === 'Privacy by Design');
    expect(privacyBlock).toBeDefined();
    expect(privacyBlock!.body).toContain('No tracking');
  });
});

// ---------------------------------------------------------------------------
// 24C: Not Affiliated Placement
// ---------------------------------------------------------------------------
describe('Trust Assets — Not Affiliated', () => {
  it('main disclaimer mentions not affiliated with VA', () => {
    expect(CORE_DISCLAIMERS.mainDisclaimer).toContain('NOT affiliated with');
    expect(CORE_DISCLAIMERS.mainDisclaimer).toContain('Department of Veterans Affairs');
  });

  it('not VA accredited disclaimer exists', () => {
    expect(CORE_DISCLAIMERS.notVAAccredited).toContain('NOT a VA-accredited');
  });
});

// ---------------------------------------------------------------------------
// 24A: Premium What You Get
// ---------------------------------------------------------------------------
describe('Trust Assets — Premium Card', () => {
  it('what you get list has 5 items', () => {
    expect(PREMIUM_COPY.whatYouGet).toHaveLength(5);
  });

  it('price is displayed', () => {
    expect(PREMIUM_COPY.priceDisplay).toContain('$9.99');
  });

  it('already purchased text exists', () => {
    expect(PREMIUM_COPY.alreadyPurchased).toContain('Already purchased');
  });

  it('restore purchases label exists', () => {
    expect(PREMIUM_COPY.restorePurchasesLabel).toBe('Restore Purchases');
  });

  it('restore premium label exists', () => {
    expect(PREMIUM_COPY.restorePremiumLabel).toBe('Restore Premium');
  });

  it('sign in note exists', () => {
    expect(PREMIUM_COPY.signInNote).toContain('Sign in');
  });
});
