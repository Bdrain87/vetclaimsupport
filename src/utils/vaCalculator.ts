/**
 * VA Combined Rating Calculator
 * Implements the "whole person" calculation method used by the VA
 */

export interface RatingEntry {
  id: string;
  condition: string;
  rating: number;
  isBilateral?: boolean;
  bilateralPair?: string; // ID of the paired bilateral condition
  side?: 'left' | 'right';
}

export interface CalculationStep {
  description: string;
  calculation: string;
  result: number;
}

export interface CalculationResult {
  combinedRating: number;
  roundedRating: number;
  steps: CalculationStep[];
  bilateralFactor: number;
  hasBilateral: boolean;
}

/**
 * Calculate the combined VA disability rating using VA math
 *
 * The VA uses a "whole person" method where each rating is applied
 * to what remains of a 100% whole person, not simply added together.
 *
 * Example: 50% + 30% = 50% + (30% of remaining 50%) = 50% + 15% = 65%
 */
export function calculateVARating(ratings: RatingEntry[]): CalculationResult {
  if (ratings.length === 0) {
    return {
      combinedRating: 0,
      roundedRating: 0,
      steps: [],
      bilateralFactor: 0,
      hasBilateral: false
    };
  }

  // Sort ratings from highest to lowest
  const sortedRatings = [...ratings].sort((a, b) => b.rating - a.rating);

  const steps: CalculationStep[] = [];
  let bilateralFactor = 0;

  // Check for bilateral conditions
  const bilateralPairs = findBilateralPairs(sortedRatings);
  const hasBilateral = bilateralPairs.length > 0;
  const bilateralConditionIds = new Set<string>();

  // Calculate bilateral factor if applicable
  if (hasBilateral) {
    for (const pair of bilateralPairs) {
      bilateralConditionIds.add(pair[0].id);
      bilateralConditionIds.add(pair[1].id);

      // Combine bilateral conditions first
      const combined = combineTwoRatings(pair[0].rating, pair[1].rating);
      // Add 10% bilateral factor
      const withFactor = Math.round(combined * 1.1);
      bilateralFactor += withFactor - combined;

      steps.push({
        description: `Bilateral: ${pair[0].condition} (${pair[0].rating}%) + ${pair[1].condition} (${pair[1].rating}%)`,
        calculation: `${pair[0].rating}% + (${pair[1].rating}% × ${100 - pair[0].rating}/100) = ${combined.toFixed(1)}% → +10% bilateral factor = ${withFactor}%`,
        result: withFactor
      });
    }
  }

  // Per 38 CFR § 4.25/4.26: Bilateral conditions are combined first using VA math,
  // then the 10% bilateral factor is applied, and the result is combined with all
  // non-bilateral ratings using the standard VA whole-person method.

  // Build a list of effective ratings: bilateral combined values + non-bilateral ratings
  const effectiveRatings: { rating: number; description: string }[] = [];

  // Add bilateral combined values (with 10% factor already applied)
  for (const pair of bilateralPairs) {
    const combined = combineTwoRatings(pair[0].rating, pair[1].rating);
    const withFactor = Math.round(combined * 1.1);
    effectiveRatings.push({
      rating: withFactor,
      description: `Bilateral: ${pair[0].condition} + ${pair[1].condition} (${withFactor}%)`,
    });
  }

  // Add non-bilateral ratings
  for (const rating of sortedRatings) {
    if (bilateralConditionIds.has(rating.id)) continue;
    effectiveRatings.push({
      rating: rating.rating,
      description: `${rating.condition} (${rating.rating}%)`,
    });
  }

  // Sort all effective ratings from highest to lowest
  effectiveRatings.sort((a, b) => b.rating - a.rating);

  // Combine using VA whole-person method
  let efficiency = 100;

  for (const entry of effectiveRatings) {
    const disability = (entry.rating / 100) * efficiency;
    const newEfficiency = efficiency - disability;

    steps.push({
      description: entry.description,
      calculation: `${entry.rating}% × ${efficiency.toFixed(1)}% remaining = ${disability.toFixed(1)}% disability`,
      result: Number((100 - newEfficiency).toFixed(1))
    });

    efficiency = newEfficiency;
  }

  const combinedRating = 100 - efficiency;

  const roundedRating = Math.round(combinedRating / 10) * 10;

  steps.push({
    description: 'Final Combined Rating',
    calculation: `${combinedRating.toFixed(1)}% rounds to ${roundedRating}%`,
    result: roundedRating
  });

  return {
    combinedRating: Number(combinedRating.toFixed(1)),
    roundedRating,
    steps,
    bilateralFactor,
    hasBilateral
  };
}

/**
 * Combine two ratings using VA math
 */
function combineTwoRatings(a: number, b: number): number {
  const higher = Math.max(a, b);
  const lower = Math.min(a, b);
  return higher + (lower * (100 - higher) / 100);
}

/**
 * Find pairs of bilateral conditions
 */
function findBilateralPairs(ratings: RatingEntry[]): RatingEntry[][] {
  const pairs: RatingEntry[][] = [];
  const used = new Set<string>();

  for (let i = 0; i < ratings.length; i++) {
    if (used.has(ratings[i].id) || !ratings[i].isBilateral) continue;

    for (let j = i + 1; j < ratings.length; j++) {
      if (used.has(ratings[j].id)) continue;

      // Check if these form a bilateral pair
      if (ratings[i].bilateralPair === ratings[j].id ||
          ratings[j].bilateralPair === ratings[i].id) {
        pairs.push([ratings[i], ratings[j]]);
        used.add(ratings[i].id);
        used.add(ratings[j].id);
        break;
      }
    }
  }

  return pairs;
}

/**
 * Conditions that commonly qualify for bilateral rating
 */
export const BILATERAL_CONDITIONS = [
  'Knee',
  'Hip',
  'Shoulder',
  'Ankle',
  'Wrist',
  'Elbow',
  'Hearing Loss',
  'Carpal Tunnel',
  'Plantar Fasciitis',
  'Flat Feet',
  'Pes Planus',
  'Radiculopathy - Lower Extremity',
  'Radiculopathy - Upper Extremity',
  'Peripheral Neuropathy',
  'Bunions',
  'Hammer Toes'
];

/**
 * Check if a condition is eligible for bilateral rating
 */
export function isBilateralEligible(condition: string): boolean {
  const lowerCondition = condition.toLowerCase();
  return BILATERAL_CONDITIONS.some(bc =>
    lowerCondition.includes(bc.toLowerCase())
  );
}

/**
 * Calculate simple VA math combination without bilateral consideration
 * Useful for quick calculations
 */
export function simpleVAMath(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  if (ratings.length === 1) return ratings[0];

  // Sort from highest to lowest
  const sorted = [...ratings].sort((a, b) => b - a);

  let efficiency = 100;

  for (const rating of sorted) {
    const disability = (rating / 100) * efficiency;
    efficiency -= disability;
  }

  return Math.round((100 - efficiency) / 10) * 10;
}

/**
 * VA Rating Logic with 2026 Rates & Bilateral Factor
 * Enhanced calculation that accepts pre-identified bilateral ratings
 */
export function calculatePlatinumRating(ratings: number[], bilateralPairRatings: number[]): number {
  // 1. Calculate the Bilateral Factor (The 'Bilateral Bump')
  let bilateralValue = 0;
  if (bilateralPairRatings.length > 0) {
    // Combine bilateral ratings using VA Math formula: 1 - (1-a)(1-b)...
    const combined = bilateralPairRatings.reduce((acc, r) => acc * (1 - r / 100), 1);
    const baseBilateral = (1 - combined) * 100;

    // Add the 10% Bilateral Factor bump per 38 CFR
    bilateralValue = baseBilateral + (baseBilateral * 0.1);
  }

  // 2. Combine with all other ratings
  const allRatings = bilateralValue > 0 ? [...ratings, bilateralValue] : ratings;

  // Sort descending for accurate VA combined math
  const sorted = [...allRatings].sort((a, b) => b - a);

  let currentEfficiency = 100;
  let combinedRating = 0;

  sorted.forEach(rating => {
    const value = (rating * currentEfficiency) / 100;
    combinedRating += value;
    currentEfficiency -= value;
  });

  // 3. Final Rounding to the nearest 10%
  return Math.round(combinedRating / 10) * 10;
}

/**
 * Format a rating for display
 */
export function formatRating(rating: number): string {
  return `${rating}%`;
}

/**
 * Calculate what the next condition needs to be rated at
 * to reach a target combined rating.
 * VA ratings are always in increments of 10, so we check each valid tier.
 */
export function ratingNeededForTarget(
  currentRatings: number[],
  targetRating: number
): number | null {
  if (targetRating > 100 || targetRating < 0) return null;

  // Check if we already meet the target
  if (simpleVAMath(currentRatings) >= targetRating) return 0;

  // VA ratings are in increments of 10, so iterate valid tiers
  for (let rating = 10; rating <= 100; rating += 10) {
    if (simpleVAMath([...currentRatings, rating]) >= targetRating) {
      return rating;
    }
  }

  return null;
}
