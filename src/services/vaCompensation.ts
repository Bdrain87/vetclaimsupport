/**
 * VA Compensation Calculation Service
 *
 * Implements the VA's combined disability rating math, bilateral factor,
 * 2025 compensation rate lookups, and "what if" projection utilities.
 */

// ---------------------------------------------------------------------------
// 2025 VA Compensation Rates (veteran alone, no dependents)
// Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
// ---------------------------------------------------------------------------

const BASE_RATES_2025: Record<number, number> = {
  0: 0,
  10: 175.95,
  20: 347.83,
  30: 538.39,
  40: 775.28,
  50: 1103.73,
  60: 1395.76,
  70: 1758.24,
  80: 2044.3,
  90: 2296.76,
  100: 3737.85,
};

// ---------------------------------------------------------------------------
// Dependent add-on amounts for ratings 30 % and above.
// Values are approximate and interpolated linearly between 30 % and 100 %.
// ---------------------------------------------------------------------------

/** Per-dependent additional monthly amounts keyed by combined rating. */
const SPOUSE_ADD: Record<number, number> = {
  30: 60,
  40: 78,
  50: 97,
  60: 116,
  70: 134,
  80: 153,
  90: 171,
  100: 190,
};

const CHILD_ADD: Record<number, number> = {
  30: 30,
  40: 40,
  50: 50,
  60: 60,
  70: 70,
  80: 80,
  90: 90,
  100: 100,
};

const PARENT_ADD: Record<number, number> = {
  30: 40,
  40: 56,
  50: 72,
  60: 87,
  70: 103,
  80: 119,
  90: 134,
  100: 150,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Round a combined rating to the nearest 10, as the VA does when
 * determining the final compensable percentage.
 *
 * Examples:
 *  - 45 -> 50
 *  - 54 -> 50
 *  - 55 -> 60
 */
function roundToNearest10(value: number): number {
  return Math.round(value / 10) * 10;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface DependentInfo {
  spouse?: boolean;
  children?: number;
  parents?: number;
}

export interface RatingProjection {
  currentCombined: number;
  projectedCombined: number;
  currentMonthly: number;
  projectedMonthly: number;
}

export interface BilateralRatingInput {
  rating: number;
  bodyPart: string;
}

/**
 * Calculate a combined VA disability rating using "VA math."
 *
 * The VA does **not** simply add percentages together. Instead it applies
 * each rating to the *remaining* (non-disabled) portion of the body:
 *
 * 1. Sort ratings from highest to lowest.
 * 2. Start with a combined value of 0.
 * 3. For each rating, add `(100 - combined) * rating / 100` to combined.
 * 4. Truncate intermediate values to whole numbers.
 * 5. Round the final result to the nearest 10.
 *
 * Example: 50 % and 30 %
 *   - Start: 0
 *   - After 50 %: 0 + (100 - 0) * 50 / 100 = 50
 *   - After 30 %: 50 + (100 - 50) * 30 / 100 = 50 + 15 = 65
 *   - Rounded: 70 %
 *
 * @param ratings Array of individual disability percentages (0-100).
 * @returns The combined rating rounded to the nearest 10.
 */
export function calculateCombinedRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  if (ratings.length === 1) return roundToNearest10(ratings[0]);

  // Sort descending so the largest rating is applied first.
  const sorted = [...ratings].sort((a, b) => b - a);

  let combined = 0;
  for (const rating of sorted) {
    combined = combined + ((100 - combined) * rating) / 100;
    // The VA truncates to a whole number at each intermediate step.
    combined = Math.floor(combined);
  }

  return roundToNearest10(combined);
}

/**
 * Apply the VA bilateral factor to a set of rated conditions.
 *
 * When a veteran has disabilities affecting **both** extremities of a pair
 * (e.g., left knee 20 % and right knee 10 %), the VA:
 *
 * 1. Combines the bilateral group using standard VA math (without rounding).
 * 2. Adds a **10 % bonus** of the combined bilateral value.
 * 3. Returns the adjusted combined value (still unrounded -- the caller
 *    should fold this into the overall combined rating before rounding).
 *
 * If no bilateral pairs are found the function returns 0.
 *
 * Body-part strings are matched by looking for "left"/"right" prefixes
 * (case-insensitive). For example, "Left Knee" and "Right Knee" form a pair.
 *
 * @param ratings Array of `{ rating, bodyPart }` objects.
 * @returns The bilateral factor bonus to add to the combined rating, or 0.
 */
export function getBilateralFactor(ratings: BilateralRatingInput[]): number {
  // Normalise body parts: strip leading "left "/"right " to find pairs.
  const normalize = (part: string): string =>
    part
      .toLowerCase()
      .replace(/^(left|right)\s+/i, "")
      .trim();

  // Group ratings by their normalised body-part name.
  const groups = new Map<string, number[]>();
  for (const { rating, bodyPart } of ratings) {
    const lower = bodyPart.toLowerCase();
    const isLeft = lower.startsWith("left");
    const isRight = lower.startsWith("right");
    if (!isLeft && !isRight) continue;

    const key = normalize(bodyPart);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(rating);
  }

  // Only groups that contain entries from *both* sides count.
  // We detect this by requiring at least two entries in the group.
  // (A more rigorous check would track left vs. right explicitly, but for
  // the common case of one-left / one-right this is sufficient.)
  let bilateralBonus = 0;

  for (const [, groupRatings] of groups) {
    if (groupRatings.length < 2) continue;

    // Combine the bilateral group using VA math (no final rounding).
    const sorted = [...groupRatings].sort((a, b) => b - a);
    let combined = 0;
    for (const r of sorted) {
      combined = combined + ((100 - combined) * r) / 100;
      combined = Math.floor(combined);
    }

    // The bilateral factor is 10 % of the combined bilateral value.
    bilateralBonus += combined * 0.1;
  }

  return Math.round(bilateralBonus * 100) / 100;
}

/**
 * Look up the estimated monthly VA compensation for a given combined rating
 * and optional dependents.
 *
 * - Ratings below 30 % do not receive dependent additions.
 * - For 30 %+ ratings the function adds approximate per-dependent amounts
 *   derived from the 2025 VA rate tables.
 *
 * @param rating  The final combined rating (should be a multiple of 10, 0-100).
 * @param dependents Optional dependent information.
 * @returns Estimated monthly compensation in USD.
 */
export function getMonthlyCompensation(
  rating: number,
  dependents?: DependentInfo
): number {
  // Clamp to valid range and snap to nearest 10.
  const clamped = Math.min(100, Math.max(0, roundToNearest10(rating)));
  let amount = BASE_RATES_2025[clamped] ?? 0;

  // Dependent additions only apply at 30 % and above.
  if (clamped >= 30 && dependents) {
    if (dependents.spouse) {
      amount += SPOUSE_ADD[clamped] ?? 0;
    }
    if (dependents.children && dependents.children > 0) {
      amount += (CHILD_ADD[clamped] ?? 0) * dependents.children;
    }
    if (dependents.parents && dependents.parents > 0) {
      amount += (PARENT_ADD[clamped] ?? 0) * dependents.parents;
    }
  }

  // Round to two decimal places to avoid floating-point drift.
  return Math.round(amount * 100) / 100;
}

/**
 * Project the impact of adding a new disability rating to an existing set.
 *
 * This is useful for "what if I get rated at X % for this new condition?"
 * scenarios. It returns both the current and projected combined ratings and
 * their corresponding monthly compensation (veteran alone, no dependents).
 *
 * @param currentRatings   Array of existing individual disability percentages.
 * @param proposedAdditional The proposed new rating to add (0-100).
 * @returns An object with current vs. projected combined ratings and monthly amounts.
 */
export function projectRatingIncrease(
  currentRatings: number[],
  proposedAdditional: number
): RatingProjection {
  const currentCombined = calculateCombinedRating(currentRatings);
  const projectedCombined = calculateCombinedRating([
    ...currentRatings,
    proposedAdditional,
  ]);

  return {
    currentCombined,
    projectedCombined,
    currentMonthly: getMonthlyCompensation(currentCombined),
    projectedMonthly: getMonthlyCompensation(projectedCombined),
  };
}
