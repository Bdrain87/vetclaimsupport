/**
 * 38 CFR Part 4.25 Compliant Combined Rating Math
 */
export const calculatePlatinumRating = (ratings: number[], bilateral: number[]) => {
  // 1. Calculate Bilateral first
  let bilateralBase = 0;
  if (bilateral.length > 0) {
    const combined = bilateral.reduce((acc, r) => acc * (1 - r / 100), 1);
    bilateralBase = (1 - combined) * 100;
    // The 10% "Bump"
    bilateralBase = bilateralBase + (bilateralBase * 0.1);
  }

  // 2. Combine all using VA Math descending order
  const all = bilateralBase > 0 ? [...ratings, bilateralBase] : [...ratings];
  const sorted = all.sort((a, b) => b - a);

  let current = 100;
  sorted.forEach(r => {
    current = current * (1 - (Math.round(r) / 100));
  });

  const rawCombined = 100 - current;

  // 3. Round to NEAREST 10% (0.5 rounds up, 0.4 rounds down)
  return Math.round(rawCombined / 10) * 10;
};
