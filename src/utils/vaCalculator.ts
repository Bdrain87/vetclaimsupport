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

  // Calculate combined rating using VA math
  let efficiency = 100;

  for (let i = 0; i < sortedRatings.length; i++) {
    const rating = sortedRatings[i];

    // Skip if part of bilateral pair already calculated
    if (bilateralConditionIds.has(rating.id)) {
      continue;
    }

    const disability = (rating.rating / 100) * efficiency;
    const newEfficiency = efficiency - disability;

    steps.push({
      description: `${rating.condition} (${rating.rating}%)`,
      calculation: `${rating.rating}% × ${efficiency.toFixed(1)}% remaining = ${disability.toFixed(1)}% disability`,
      result: Number((100 - newEfficiency).toFixed(1))
    });

    efficiency = newEfficiency;
  }

  // If there were bilateral conditions, factor them in
  let combinedRating = 100 - efficiency;
  if (hasBilateral) {
    // Add bilateral ratings to combined using VA math
    for (const pair of bilateralPairs) {
      const combined = combineTwoRatings(pair[0].rating, pair[1].rating);
      const withFactor = Math.round(combined * 1.1);
      const disability = (withFactor / 100) * efficiency;
      efficiency -= disability;
    }
    combinedRating = 100 - efficiency + bilateralFactor;
  }

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
 * Format a rating for display
 */
export function formatRating(rating: number): string {
  return `${rating}%`;
}

/**
 * Calculate what the next condition needs to be rated at
 * to reach a target combined rating
 */
export function ratingNeededForTarget(
  currentRatings: number[],
  targetRating: number
): number | null {
  if (targetRating > 100) return null;
  if (targetRating < 0) return null;

  // Binary search for the needed rating
  let low = 0;
  let high = 100;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const combined = simpleVAMath([...currentRatings, mid]);

    if (combined === targetRating) {
      // Found exact match, try to find minimum
      if (mid === 0 || simpleVAMath([...currentRatings, mid - 10]) < targetRating) {
        return mid;
      }
      high = mid - 1;
    } else if (combined < targetRating) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // Return the minimum rating that achieves target
  for (let rating = 10; rating <= 100; rating += 10) {
    if (simpleVAMath([...currentRatings, rating]) >= targetRating) {
      return rating;
    }
  }

  return null;
}
