/**
 * Safe date formatting — returns fallback instead of "Invalid Date".
 */
export function safeFormatDate(
  dateStr: string | undefined | null,
  fallback = 'N/A',
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!dateStr) return fallback;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? fallback : d.toLocaleDateString(locales, options);
}

/**
 * Safe datetime formatting (includes time) — returns fallback instead of "Invalid Date".
 */
export function safeFormatDateTime(
  dateStr: string | undefined | null,
  fallback = 'N/A',
): string {
  if (!dateStr) return fallback;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? fallback : d.toLocaleString();
}

/**
 * Safe sort key for dates — returns 0 for invalid dates instead of NaN.
 */
export function safeSortTime(dateStr: string | undefined | null): number {
  if (!dateStr) return 0;
  const t = new Date(dateStr).getTime();
  return isNaN(t) ? 0 : t;
}
