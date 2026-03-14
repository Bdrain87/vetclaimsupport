/**
 * AI Model Configuration
 *
 * Centralized model constants and feature-specific model selection.
 * Pro is used for features requiring deep reasoning (VASRD criteria, medical analysis).
 * Flash is used for everything else (fast, cheap, good enough).
 */

export const MODELS = {
  FLASH: 'gemini-2.5-flash',
  PRO: 'gemini-2.5-pro',
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

/**
 * Feature-to-model mapping with recommended temperatures.
 */
const FEATURE_CONFIG: Record<string, { model: ModelId; temperature: number; timeout: number }> = {
  'cp-exam-simulator': { model: MODELS.PRO, temperature: 0.3, timeout: 60_000 },
  'post-exam-debrief': { model: MODELS.PRO, temperature: 0.4, timeout: 60_000 },
  'doctor-summary': { model: MODELS.FLASH, temperature: 0.2, timeout: 30_000 },
  'evidence-scanner': { model: MODELS.FLASH, temperature: 0.2, timeout: 30_000 },
  'va-speak': { model: MODELS.FLASH, temperature: 0.3, timeout: 30_000 },
  'sentinel-core': { model: MODELS.FLASH, temperature: 0.7, timeout: 30_000 },
  'personal-statement': { model: MODELS.FLASH, temperature: 0.6, timeout: 30_000 },
  'family-statement': { model: MODELS.FLASH, temperature: 0.6, timeout: 30_000 },
  'state-benefits': { model: MODELS.FLASH, temperature: 0.3, timeout: 30_000 },
  'cfile-intel': { model: MODELS.FLASH, temperature: 0.2, timeout: 120_000 },
  'decision-decoder-ai': { model: MODELS.FLASH, temperature: 0.2, timeout: 45_000 },
  'doctor-summary-enhanced': { model: MODELS.FLASH, temperature: 0.3, timeout: 45_000 },
  'ask-intel-full': { model: MODELS.FLASH, temperature: 0.5, timeout: 45_000 },
  'secondary-finder': { model: MODELS.FLASH, temperature: 0.2, timeout: 30_000 },
  'interactive-dbq': { model: MODELS.FLASH, temperature: 0.2, timeout: 60_000 },
  'assistant': { model: MODELS.FLASH, temperature: 0.5, timeout: 30_000 },
  'form-guide': { model: MODELS.FLASH, temperature: 0.3, timeout: 30_000 },
};

/**
 * Get the recommended model, temperature, and timeout for a given feature.
 */
export function getModelConfig(feature: string): { model: ModelId; temperature: number; timeout: number } {
  return FEATURE_CONFIG[feature] ?? { model: MODELS.FLASH, temperature: 0.5, timeout: 30_000 };
}
