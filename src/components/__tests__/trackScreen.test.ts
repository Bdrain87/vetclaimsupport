/**
 * Track Screen State Consistency Tests — Section 8
 *
 * Tests card state logic, entry counting, and selection state
 * for all tracker types.
 */
import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Pure logic helpers for card state
// ---------------------------------------------------------------------------

function getEntryLabel(count: number): string {
  if (count === 0) return 'No entries';
  if (count === 1) return '1 entry';
  return `${count} entries`;
}

function isCardHighlightable(entryCount: number): boolean {
  return entryCount > 0;
}

function getEmptyStateContent(trackerName: string) {
  return {
    headline: `No ${trackerName} logged yet`,
    explanation: `Start tracking your ${trackerName.toLowerCase()} to build your evidence record.`,
    ctaLabel: `Log ${trackerName}`,
  };
}

// ---------------------------------------------------------------------------
// 8A: Card State Logic
// ---------------------------------------------------------------------------
describe('Track Screen — Card State Logic', () => {
  it('0 entries shows "No entries"', () => {
    expect(getEntryLabel(0)).toBe('No entries');
  });

  it('1 entry shows singular "1 entry"', () => {
    expect(getEntryLabel(1)).toBe('1 entry');
  });

  it('5 entries shows plural "5 entries"', () => {
    expect(getEntryLabel(5)).toBe('5 entries');
  });

  it('large count formats correctly', () => {
    expect(getEntryLabel(100)).toBe('100 entries');
  });

  it('does not show "0 entries" — uses "No entries" instead', () => {
    const label = getEntryLabel(0);
    expect(label).not.toContain('0 entries');
    expect(label).toBe('No entries');
  });

  it('empty state includes headline, explanation, and CTA', () => {
    const content = getEmptyStateContent('Symptoms');
    expect(content.headline).toBeTruthy();
    expect(content.explanation).toBeTruthy();
    expect(content.ctaLabel).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 8B: Selection State
// ---------------------------------------------------------------------------
describe('Track Screen — Selection State', () => {
  it('card with 0 entries cannot appear highlighted', () => {
    expect(isCardHighlightable(0)).toBe(false);
  });

  it('card with entries can be highlighted', () => {
    expect(isCardHighlightable(1)).toBe(true);
    expect(isCardHighlightable(5)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 8C: All Tracker Types
// ---------------------------------------------------------------------------
const TRACKER_TYPES = [
  'Symptoms',
  'Migraines',
  'Sleep',
  'Medications',
  'Body Map',
  'Medical Visits',
  'Exposures',
] as const;

describe('Track Screen — All Tracker Types', () => {
  for (const trackerType of TRACKER_TYPES) {
    describe(`${trackerType} tracker`, () => {
      it('zero entries shows correct label', () => {
        expect(getEntryLabel(0)).toBe('No entries');
      });

      it('one entry shows singular label', () => {
        expect(getEntryLabel(1)).toBe('1 entry');
      });

      it('multiple entries shows plural label', () => {
        expect(getEntryLabel(3)).toBe('3 entries');
      });

      it('empty state has proper content', () => {
        const content = getEmptyStateContent(trackerType);
        expect(content.headline).toContain(trackerType);
        expect(content.ctaLabel).toContain(trackerType);
      });

      it('is not highlightable with 0 entries', () => {
        expect(isCardHighlightable(0)).toBe(false);
      });

      it('is highlightable with entries', () => {
        expect(isCardHighlightable(1)).toBe(true);
      });
    });
  }
});
