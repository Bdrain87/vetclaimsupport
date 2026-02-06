import { describe, it, expect } from 'vitest';
import {
  calculateVARating,
  simpleVAMath,
  calculatePlatinumRating,
  isBilateralEligible,
  formatRating,
  ratingNeededForTarget,
  BILATERAL_CONDITIONS,
  type RatingEntry,
} from '../vaCalculator';
import { calculatePlatinumRating as vaMathCalculatePlatinumRating } from '../vaMath';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRating(
  id: string,
  condition: string,
  rating: number,
  opts?: Partial<RatingEntry>,
): RatingEntry {
  return { id, condition, rating, ...opts };
}

// ===========================================================================
// calculateVARating — full VA combined rating with bilateral support
// ===========================================================================
describe('calculateVARating', () => {
  // --- Basic whole-person math ---

  it('single rating 50% -> combined 50%, rounded 50%', () => {
    const result = calculateVARating([makeRating('1', 'PTSD', 50)]);
    expect(result.combinedRating).toBe(50);
    expect(result.roundedRating).toBe(50);
    expect(result.hasBilateral).toBe(false);
    expect(result.bilateralFactor).toBe(0);
  });

  it('50% + 30% -> combined 65%, rounded 70%', () => {
    const result = calculateVARating([
      makeRating('1', 'PTSD', 50),
      makeRating('2', 'Back Strain', 30),
    ]);
    expect(result.combinedRating).toBe(65);
    expect(result.roundedRating).toBe(70);
  });

  it('10% + 10% + 10% -> combined 27.1%, rounded 30%', () => {
    const result = calculateVARating([
      makeRating('1', 'Tinnitus', 10),
      makeRating('2', 'Sinusitis', 10),
      makeRating('3', 'Scars', 10),
    ]);
    expect(result.combinedRating).toBe(27.1);
    expect(result.roundedRating).toBe(30);
  });

  it('0% rating -> combined 0%, rounded 0%', () => {
    const result = calculateVARating([makeRating('1', 'Scars', 0)]);
    expect(result.combinedRating).toBe(0);
    expect(result.roundedRating).toBe(0);
  });

  it('100% rating -> combined 100%, rounded 100%', () => {
    const result = calculateVARating([makeRating('1', 'TBI', 100)]);
    expect(result.combinedRating).toBe(100);
    expect(result.roundedRating).toBe(100);
  });

  // --- Empty input ---

  it('empty array -> all zeros', () => {
    const result = calculateVARating([]);
    expect(result.combinedRating).toBe(0);
    expect(result.roundedRating).toBe(0);
    expect(result.steps).toEqual([]);
    expect(result.bilateralFactor).toBe(0);
    expect(result.hasBilateral).toBe(false);
  });

  // --- Single 10% ---

  it('single 10% rating -> combined 10%, rounded 10%', () => {
    const result = calculateVARating([makeRating('1', 'Tinnitus', 10)]);
    expect(result.combinedRating).toBe(10);
    expect(result.roundedRating).toBe(10);
  });

  // --- Maximum never exceeds 100% ---

  it('maximum never exceeds 100% even with 100% + 50%', () => {
    const result = calculateVARating([
      makeRating('1', 'TBI', 100),
      makeRating('2', 'PTSD', 50),
    ]);
    expect(result.combinedRating).toBe(100);
    expect(result.roundedRating).toBe(100);
  });

  it('maximum never exceeds 100% with many high ratings', () => {
    const result = calculateVARating([
      makeRating('1', 'TBI', 90),
      makeRating('2', 'PTSD', 70),
      makeRating('3', 'Back', 60),
      makeRating('4', 'Migraines', 50),
    ]);
    expect(result.roundedRating).toBeLessThanOrEqual(100);
    expect(result.combinedRating).toBeLessThanOrEqual(100);
  });

  // --- Order independence ---

  it('order of ratings does not change the result', () => {
    const ratingsAsc = [
      makeRating('1', 'PTSD', 30),
      makeRating('2', 'Back Strain', 50),
    ];
    const ratingsDesc = [
      makeRating('2', 'Back Strain', 50),
      makeRating('1', 'PTSD', 30),
    ];

    const resultAsc = calculateVARating(ratingsAsc);
    const resultDesc = calculateVARating(ratingsDesc);

    expect(resultAsc.combinedRating).toBe(resultDesc.combinedRating);
    expect(resultAsc.roundedRating).toBe(resultDesc.roundedRating);
  });

  // --- Rounding per 38 CFR 4.25 (.5 rounds UP) ---

  it('rounding: 45% combined rounds UP to 50% per 38 CFR 4.25', () => {
    // A single 45% rating produces combinedRating = 45
    const result = calculateVARating([makeRating('1', 'Condition', 45)]);
    expect(result.combinedRating).toBe(45);
    // Math.round(4.5) = 5, * 10 = 50
    expect(result.roundedRating).toBe(50);
  });

  it('rounding: 44% combined rounds DOWN to 40%', () => {
    const result = calculateVARating([makeRating('1', 'Condition', 44)]);
    expect(result.combinedRating).toBe(44);
    expect(result.roundedRating).toBe(40);
  });

  it('rounding: 55% combined rounds UP to 60%', () => {
    const result = calculateVARating([makeRating('1', 'Condition', 55)]);
    expect(result.combinedRating).toBe(55);
    expect(result.roundedRating).toBe(60);
  });

  // --- Bilateral factor ---

  it('bilateral factor for paired extremities: left knee 30% + right knee 20%', () => {
    const result = calculateVARating([
      makeRating('left', 'Left Knee', 30, {
        isBilateral: true,
        bilateralPair: 'right',
        side: 'left',
      }),
      makeRating('right', 'Right Knee', 20, {
        isBilateral: true,
        bilateralPair: 'left',
        side: 'right',
      }),
    ]);

    expect(result.hasBilateral).toBe(true);
    // combineTwoRatings(30, 20) = 30 + (20 * 70/100) = 44
    // withFactor = Math.round(44 * 1.1) = Math.round(48.4) = 48
    // bilateralFactor = 48 - 44 = 4
    expect(result.bilateralFactor).toBe(4);
    // All ratings are bilateral, so efficiency starts at 100
    // disability = (48/100) * 100 = 48, efficiency = 52
    // combined = 48, rounded = 50
    expect(result.combinedRating).toBe(48);
    expect(result.roundedRating).toBe(50);
  });

  it('bilateral factor is applied BEFORE combining with non-bilateral ratings', () => {
    const bilateralResult = calculateVARating([
      makeRating('ptsd', 'PTSD', 50),
      makeRating('left', 'Left Knee', 30, {
        isBilateral: true,
        bilateralPair: 'right',
        side: 'left',
      }),
      makeRating('right', 'Right Knee', 20, {
        isBilateral: true,
        bilateralPair: 'left',
        side: 'right',
      }),
    ]);

    // PTSD 50% processed first in main loop (highest non-bilateral)
    // efficiency after PTSD: 50
    // Bilateral combined: combineTwoRatings(30,20) = 44, with 10% bump = 48
    // Bilateral applied: disability = 48/100 * 50 = 24, efficiency = 26
    // combinedRating = 100 - 26 = 74
    expect(bilateralResult.hasBilateral).toBe(true);
    expect(bilateralResult.combinedRating).toBe(74);
    expect(bilateralResult.roundedRating).toBe(70);

    // Verify this differs from treating all ratings individually
    // simpleVAMath([50, 30, 20]) = 72 (combined without bilateral factor)
    const simpleResult = simpleVAMath([50, 30, 20]);
    expect(simpleResult).toBe(70); // rounds to same, but combined is different

    // The bilateral factor gives a higher exact combined value (74 > 72)
    expect(bilateralResult.combinedRating).toBeGreaterThan(72);
  });

  // --- Steps array populated ---

  it('populates steps array describing the calculation', () => {
    const result = calculateVARating([
      makeRating('1', 'PTSD', 50),
      makeRating('2', 'Back Strain', 30),
    ]);
    // Should have one step per rating plus the final rounding step
    expect(result.steps.length).toBeGreaterThanOrEqual(3);
    const lastStep = result.steps[result.steps.length - 1];
    expect(lastStep.description).toBe('Final Combined Rating');
    expect(lastStep.result).toBe(70);
  });
});

// ===========================================================================
// simpleVAMath — quick combined rating without bilateral
// ===========================================================================
describe('simpleVAMath', () => {
  it('50 + 30 = 70 (after rounding)', () => {
    expect(simpleVAMath([50, 30])).toBe(70);
  });

  it('empty array returns 0', () => {
    expect(simpleVAMath([])).toBe(0);
  });

  it('single 30 returns 30', () => {
    expect(simpleVAMath([30])).toBe(30);
  });

  it('single 10 returns 10', () => {
    expect(simpleVAMath([10])).toBe(10);
  });

  it('10 + 10 + 10 = 30', () => {
    // 10 + 9 + 8.1 = 27.1 -> rounds to 30
    expect(simpleVAMath([10, 10, 10])).toBe(30);
  });

  it('order does not matter: [30, 50] equals [50, 30]', () => {
    expect(simpleVAMath([30, 50])).toBe(simpleVAMath([50, 30]));
  });

  it('single 0 returns 0', () => {
    expect(simpleVAMath([0])).toBe(0);
  });

  it('single 100 returns 100', () => {
    expect(simpleVAMath([100])).toBe(100);
  });

  it('never exceeds 100', () => {
    expect(simpleVAMath([90, 80, 70, 60, 50])).toBeLessThanOrEqual(100);
  });
});

// ===========================================================================
// isBilateralEligible
// ===========================================================================
describe('isBilateralEligible', () => {
  it('"Knee" is bilateral eligible', () => {
    expect(isBilateralEligible('Knee')).toBe(true);
  });

  it('"PTSD" is NOT bilateral eligible', () => {
    expect(isBilateralEligible('PTSD')).toBe(false);
  });

  it('is case insensitive: "knee" matches', () => {
    expect(isBilateralEligible('knee')).toBe(true);
  });

  it('is case insensitive: "SHOULDER" matches', () => {
    expect(isBilateralEligible('SHOULDER')).toBe(true);
  });

  it('matches as substring: "Left Knee" is eligible', () => {
    expect(isBilateralEligible('Left Knee')).toBe(true);
  });

  it('"hearing loss" matches (case insensitive substring)', () => {
    expect(isBilateralEligible('hearing loss')).toBe(true);
  });

  it('"Back Pain" is NOT bilateral eligible', () => {
    expect(isBilateralEligible('Back Pain')).toBe(false);
  });

  it('"Migraines" is NOT bilateral eligible', () => {
    expect(isBilateralEligible('Migraines')).toBe(false);
  });

  it('all entries in BILATERAL_CONDITIONS are recognized as eligible', () => {
    for (const condition of BILATERAL_CONDITIONS) {
      expect(isBilateralEligible(condition)).toBe(true);
    }
  });
});

// ===========================================================================
// formatRating
// ===========================================================================
describe('formatRating', () => {
  it('50 -> "50%"', () => {
    expect(formatRating(50)).toBe('50%');
  });

  it('0 -> "0%"', () => {
    expect(formatRating(0)).toBe('0%');
  });

  it('100 -> "100%"', () => {
    expect(formatRating(100)).toBe('100%');
  });

  it('10 -> "10%"', () => {
    expect(formatRating(10)).toBe('10%');
  });
});

// ===========================================================================
// ratingNeededForTarget
// ===========================================================================
describe('ratingNeededForTarget', () => {
  it('returns null when target exceeds 100', () => {
    expect(ratingNeededForTarget([50], 110)).toBeNull();
  });

  it('returns null when target is negative', () => {
    expect(ratingNeededForTarget([50], -10)).toBeNull();
  });

  it('no existing ratings, target 50 -> need 50', () => {
    // simpleVAMath([50]) = 50, and simpleVAMath([40]) = 40 < 50
    expect(ratingNeededForTarget([], 50)).toBe(50);
  });

  it('existing 90%, target 100% -> need 50', () => {
    // simpleVAMath([90, 50]) = 95 -> rounds to 100
    // simpleVAMath([90, 40]) = 94 -> rounds to 90
    const needed = ratingNeededForTarget([90], 100);
    expect(needed).not.toBeNull();
    // Verify the returned rating actually achieves the target
    expect(simpleVAMath([90, needed!])).toBe(100);
  });

  it('no existing ratings, target 0 -> need 0', () => {
    expect(ratingNeededForTarget([], 0)).toBe(0);
  });

  it('returned rating always achieves the target', () => {
    const currentRatings = [50, 20];
    const target = 80;
    const needed = ratingNeededForTarget(currentRatings, target);
    if (needed !== null) {
      expect(simpleVAMath([...currentRatings, needed])).toBeGreaterThanOrEqual(target);
    }
  });
});

// ===========================================================================
// calculatePlatinumRating (from vaCalculator)
// ===========================================================================
describe('calculatePlatinumRating (vaCalculator)', () => {
  it('basic ratings: [50, 30] with no bilateral -> 70', () => {
    // 50 + (30 * 50/100) = 65, rounds to 70
    expect(calculatePlatinumRating([50, 30], [])).toBe(70);
  });

  it('with bilateral pairs: [50] non-bilateral + [30, 20] bilateral -> 70', () => {
    // bilateral combined: (1 - 0.7*0.8)*100 = 44, with 10% bump = 48.4
    // allRatings sorted: [50, 48.4]
    // 50 + (48.4 * 50/100) = 74.2, rounds to 70
    expect(calculatePlatinumRating([50], [30, 20])).toBe(70);
  });

  it('empty arrays -> 0', () => {
    expect(calculatePlatinumRating([], [])).toBe(0);
  });

  it('single rating [30] no bilateral -> 30', () => {
    expect(calculatePlatinumRating([30], [])).toBe(30);
  });

  it('only bilateral [30, 20] with no other ratings -> 50', () => {
    // bilateral combined: 44, with 10% bump = 48.4
    // allRatings = [48.4]
    // combinedRating = 48.4, rounds to 50
    expect(calculatePlatinumRating([], [30, 20])).toBe(50);
  });

  it('10 + 10 + 10 no bilateral -> 30', () => {
    // 10 + 9 + 8.1 = 27.1, rounds to 30
    expect(calculatePlatinumRating([10, 10, 10], [])).toBe(30);
  });
});

// ===========================================================================
// calculatePlatinumRating (from vaMath) — 1 - product method
// ===========================================================================
describe('calculatePlatinumRating (vaMath)', () => {
  it('basic: [50, 30] no bilateral -> 70', () => {
    // current = 100 * 0.5 = 50, then 50 * 0.7 = 35
    // rawCombined = 65, rounds to 70
    expect(vaMathCalculatePlatinumRating([50, 30], [])).toBe(70);
  });

  it('bilateral: [50] + bilateral [30, 20] -> 70', () => {
    // bilateral: (1-0.3)*(1-0.2) = 0.56, base = 44, with bump = 48.4
    // Math.round(48.4) = 48 for the current * (1 - round(r)/100) step
    // sorted: [50, 48.4]
    // current = 100 * 0.5 = 50, then 50 * (1 - 48/100) = 50 * 0.52 = 26
    // rawCombined = 74, rounds to 70
    expect(vaMathCalculatePlatinumRating([50], [30, 20])).toBe(70);
  });

  it('empty arrays -> 0', () => {
    expect(vaMathCalculatePlatinumRating([], [])).toBe(0);
  });

  it('single rating [70] no bilateral -> 70', () => {
    // current = 100 * (1 - 70/100) = 30, rawCombined = 70, rounds to 70
    expect(vaMathCalculatePlatinumRating([70], [])).toBe(70);
  });

  it('only bilateral [40, 30] with no other ratings', () => {
    // bilateral: (1-0.4)*(1-0.3) = 0.6*0.7 = 0.42
    // base = 58, with bump = 58 + 5.8 = 63.8
    // current = 100 * (1 - Math.round(63.8)/100) = 100 * (1 - 64/100) = 36
    // rawCombined = 64, rounds to 60
    expect(vaMathCalculatePlatinumRating([], [40, 30])).toBe(60);
  });

  it('agrees with vaCalculator version on simple cases (no bilateral)', () => {
    const ratings = [70, 50, 30];
    const vcResult = calculatePlatinumRating(ratings, []);
    const vmResult = vaMathCalculatePlatinumRating(ratings, []);
    expect(vcResult).toBe(vmResult);
  });
});

// ===========================================================================
// BILATERAL_CONDITIONS constant
// ===========================================================================
describe('BILATERAL_CONDITIONS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(BILATERAL_CONDITIONS)).toBe(true);
    expect(BILATERAL_CONDITIONS.length).toBeGreaterThan(0);
  });

  it('includes common bilateral conditions', () => {
    expect(BILATERAL_CONDITIONS).toContain('Knee');
    expect(BILATERAL_CONDITIONS).toContain('Hip');
    expect(BILATERAL_CONDITIONS).toContain('Shoulder');
    expect(BILATERAL_CONDITIONS).toContain('Hearing Loss');
  });

  it('does not include non-bilateral conditions', () => {
    expect(BILATERAL_CONDITIONS).not.toContain('PTSD');
    expect(BILATERAL_CONDITIONS).not.toContain('Back Pain');
    expect(BILATERAL_CONDITIONS).not.toContain('Migraines');
  });
});
