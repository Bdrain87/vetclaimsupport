/**
 * Claim Dates Consistency Tests — Section 16
 *
 * Tests claim dates copy, BDD guide reference, and Intent to File copy.
 */
import { describe, it, expect } from 'vitest';
import { CLAIM_DATES_COPY, CORE_DISCLAIMERS } from '@/data/legalCopy';

// ---------------------------------------------------------------------------
// 16A: Save Behavior Copy
// ---------------------------------------------------------------------------
describe('Claim Dates — Save Behavior', () => {
  it('auto-save label exists', () => {
    expect(CLAIM_DATES_COPY.autoSaveLabel).toBe('Saved automatically.');
  });

  it('ETS definition is clear', () => {
    expect(CLAIM_DATES_COPY.etsDefinition).toContain('ETS');
    expect(CLAIM_DATES_COPY.etsDefinition).toContain('separation date');
  });
});

// ---------------------------------------------------------------------------
// 16B: BDD Guide
// ---------------------------------------------------------------------------
describe('Claim Dates — BDD Guide', () => {
  it('BDD guide title exists', () => {
    expect(CLAIM_DATES_COPY.bddGuideTitle).toBe('BDD Guide');
  });
});

// ---------------------------------------------------------------------------
// 16C: Intent to File
// ---------------------------------------------------------------------------
describe('Claim Dates — Intent to File', () => {
  it('Intent to File title exists', () => {
    expect(CLAIM_DATES_COPY.itfTitle).toBe('Intent to File');
  });

  it('app is informational only — does not file claims', () => {
    expect(CORE_DISCLAIMERS.notClaimsFiling).toContain('NOT a claims filing service');
  });
});
