/** Symmetric range-aware diagnostic code matching. */
export function dcMatches(a: string, b: string): boolean {
  if (a === b) return true;
  const rangeA = a.match(/^(\d+)-(\d+)$/);
  if (rangeA) {
    const num = parseInt(b, 10);
    if (!isNaN(num) && num >= parseInt(rangeA[1], 10) && num <= parseInt(rangeA[2], 10)) return true;
  }
  const rangeB = b.match(/^(\d+)-(\d+)$/);
  if (rangeB) {
    const num = parseInt(a, 10);
    if (!isNaN(num) && num >= parseInt(rangeB[1], 10) && num <= parseInt(rangeB[2], 10)) return true;
  }
  return false;
}
