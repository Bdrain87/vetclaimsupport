/**
 * VCS Brand Color Palette for PDF Exports
 *
 * Gold / Black / Cream palette per partnership agreement.
 * All values are RGB tuples for jsPDF compatibility.
 */

export type RGBColor = [number, number, number];

export const PDF_BRAND = {
  // Gold spectrum
  goldDark: [142, 123, 58] as RGBColor,     // #8E7B3A
  goldMedium: [176, 153, 78] as RGBColor,   // #B0994E
  goldLight: [201, 183, 108] as RGBColor,   // #C9B76C

  // Core
  black: [0, 0, 0] as RGBColor,
  white: [255, 255, 255] as RGBColor,
  cream: [252, 250, 245] as RGBColor,       // #FCFAF5

  // Text
  textPrimary: [15, 23, 42] as RGBColor,    // near-black for body text
  textSecondary: [71, 85, 105] as RGBColor,  // muted for labels
  textMuted: [100, 116, 139] as RGBColor,    // very muted for footnotes

  // Status indicators
  success: [22, 101, 52] as RGBColor,        // dark green
  successBg: [220, 252, 231] as RGBColor,    // light green bg
  warning: [146, 64, 14] as RGBColor,        // dark amber
  warningBg: [254, 243, 199] as RGBColor,    // light amber bg
  danger: [153, 27, 27] as RGBColor,         // dark red
  dangerBg: [254, 226, 226] as RGBColor,     // light red bg

  // Structural
  border: [214, 211, 199] as RGBColor,       // warm gray border
  backgroundAlt: [249, 247, 243] as RGBColor, // slightly warm off-white
  watermark: [200, 195, 180] as RGBColor,     // faded gold-gray
} as const;

/** Severity badge color lookup */
export function getSeverityColor(severity: number): { text: RGBColor; bg: RGBColor } {
  if (severity >= 8) return { text: PDF_BRAND.danger, bg: PDF_BRAND.dangerBg };
  if (severity >= 5) return { text: PDF_BRAND.warning, bg: PDF_BRAND.warningBg };
  return { text: PDF_BRAND.success, bg: PDF_BRAND.successBg };
}
