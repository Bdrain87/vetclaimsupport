/**
 * Shared rating color utility for the Interactive DBQ tool.
 * Maps VA rating percentages to color classes and hex values.
 */

export interface RatingColorInfo {
  percent: number;
  label: string;
  /** Tailwind text color class */
  textClass: string;
  /** Tailwind bg color class */
  bgClass: string;
  /** Tailwind border color class */
  borderClass: string;
  /** Hex value for inline styles */
  hex: string;
}

/**
 * Full VA rating scale. Every condition uses a subset of these.
 * Smooth ramp: gray (0%) → cool blue → teal → warm amber → bold gold (100%).
 * Higher % = stronger documentation = warmer/bolder color.
 */
const RATING_COLORS: RatingColorInfo[] = [
  { percent: 0,   label: 'No impairment',    textClass: 'text-zinc-500',    bgClass: 'bg-zinc-500',    borderClass: 'border-zinc-500',    hex: '#71717a' },
  { percent: 10,  label: 'Mild',             textClass: 'text-blue-400',    bgClass: 'bg-blue-400',    borderClass: 'border-blue-400',    hex: '#60a5fa' },
  { percent: 20,  label: 'Mild-Moderate',    textClass: 'text-sky-400',     bgClass: 'bg-sky-400',     borderClass: 'border-sky-400',     hex: '#38bdf8' },
  { percent: 30,  label: 'Moderate',         textClass: 'text-teal-400',    bgClass: 'bg-teal-400',    borderClass: 'border-teal-400',    hex: '#2dd4bf' },
  { percent: 40,  label: 'Moderate-Severe',  textClass: 'text-emerald-400', bgClass: 'bg-emerald-400', borderClass: 'border-emerald-400', hex: '#34d399' },
  { percent: 50,  label: 'Considerable',     textClass: 'text-yellow-400',  bgClass: 'bg-yellow-400',  borderClass: 'border-yellow-400',  hex: '#facc15' },
  { percent: 60,  label: 'Significant',      textClass: 'text-amber-400',   bgClass: 'bg-amber-400',   borderClass: 'border-amber-400',   hex: '#fbbf24' },
  { percent: 70,  label: 'Severe',           textClass: 'text-orange-400',  bgClass: 'bg-orange-400',  borderClass: 'border-orange-400',  hex: '#fb923c' },
  { percent: 80,  label: 'Very Severe',      textClass: 'text-orange-300',  bgClass: 'bg-orange-300',  borderClass: 'border-orange-300',  hex: '#fdba74' },
  { percent: 100, label: 'Total',            textClass: 'text-[#C5A55A]',   bgClass: 'bg-[#C5A55A]',   borderClass: 'border-[#C5A55A]',   hex: '#C5A55A' },
];

/** Get color info for a given rating percent. Falls back to 0% if not found. */
export function getRatingColor(percent: number): RatingColorInfo {
  return RATING_COLORS.find((c) => c.percent === percent) ?? RATING_COLORS[0];
}

/** Get all rating colors (for rendering the full scale). */
export function getAllRatingColors(): RatingColorInfo[] {
  return RATING_COLORS;
}

/** Filter rating colors to only those available for a specific condition's rating levels. */
export function getAvailableRatingColors(availablePercents: number[]): RatingColorInfo[] {
  return RATING_COLORS.filter((c) => availablePercents.includes(c.percent));
}
