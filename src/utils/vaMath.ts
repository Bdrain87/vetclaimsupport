/**
 * Validate a single rating value. Returns clamped 0–100 integer, or 0 for invalid input.
 */
function sanitizeRating(r: number): number {
  if (typeof r !== 'number' || !isFinite(r)) return 0;
  return Math.min(100, Math.max(0, Math.round(r)));
}

/**
 * 38 CFR Part 4.25 Compliant Combined Rating Math
 */
export const calculatePlatinumRating = (ratings: number[], bilateral: number[]) => {
  // Input validation: filter out invalid values, clamp to 0-100
  const safeRatings = ratings.map(sanitizeRating).filter(r => r > 0);
  const safeBilateral = bilateral.map(sanitizeRating).filter(r => r > 0);

  // 1. Calculate Bilateral first
  let bilateralBase = 0;
  if (safeBilateral.length > 0) {
    const combined = safeBilateral.reduce((acc, r) => acc * (1 - r / 100), 1);
    bilateralBase = (1 - combined) * 100;
    // The 10% "Bump" per 38 CFR 4.26
    bilateralBase = bilateralBase + (bilateralBase * 0.1);
    // Round bilateral value to nearest whole number before combining (VA procedure)
    bilateralBase = Math.round(bilateralBase);
  }

  // 2. Combine all using VA Math descending order
  const all = bilateralBase > 0 ? [...safeRatings, bilateralBase] : [...safeRatings];
  const sorted = [...all].sort((a, b) => b - a);

  if (sorted.length === 0) return 0;

  let current = 100;
  sorted.forEach(r => {
    current = current * (1 - (Math.round(r) / 100));
  });

  const rawCombined = 100 - current;

  // 3. Round to NEAREST 10% (0.5 rounds up, 0.4 rounds down)
  return Math.round(rawCombined / 10) * 10;
};
