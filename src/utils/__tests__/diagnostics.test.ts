import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runDiagnostics } from '../diagnostics';

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

// Mock vaMath — calculatePlatinumRating([20, 20], []) should return 40
vi.mock('../vaMath', () => ({
  calculatePlatinumRating: vi.fn((ratings: number[], bilateral: number[]) => {
    // Real VA math: 20 + (20 * 0.8) = 36, rounds to 40
    if (ratings.length === 2 && ratings[0] === 20 && ratings[1] === 20 && bilateral.length === 0) {
      return 40;
    }
    return 0;
  }),
}));

// Mock ai-prompts — provide the expected config structure
vi.mock('../../lib/ai-prompts', () => ({
  AI_CONFIG: {
    EXAMINER_PERSONA: 'mock persona',
    VA_SPEAK_TRANSLATOR: 'mock translator',
    NEXUS_LOGIC: 'mock nexus logic',
  },
}));

describe('runDiagnostics', () => {
  beforeEach(() => {
    vi.spyOn(console, 'table').mockImplementation(() => {});
  });

  it('returns an object with vaMath, aiConfig, and branding keys', () => {
    const results = runDiagnostics();
    expect(results).toHaveProperty('vaMath');
    expect(results).toHaveProperty('aiConfig');
    expect(results).toHaveProperty('branding');
  });

  it('vaMath passes when calculatePlatinumRating([20,20],[]) returns 40', () => {
    const results = runDiagnostics();
    expect(results.vaMath).toBe(true);
  });

  it('aiConfig passes when EXAMINER_PERSONA and VA_SPEAK_TRANSLATOR are present', () => {
    const results = runDiagnostics();
    expect(results.aiConfig).toBe(true);
  });

  it('branding is set to true (placeholder)', () => {
    const results = runDiagnostics();
    expect(results.branding).toBe(true);
  });

  it('logs a diagnostic table to the console', () => {
    const consoleSpy = vi.spyOn(console, 'table');
    runDiagnostics();

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        SYSTEM: 'VET CLAIM SUPPORT',
        VA_MATH_INTEGRITY: 'PASSED',
        AI_PROMPT_INTEGRITY: 'PASSED',
        DEBRANDING_STATUS: 'COMPLETE',
      }),
    );
  });

  it('reports vaMath failure when calculatePlatinumRating returns wrong value', async () => {
    const { calculatePlatinumRating } = await import('../vaMath');
    (calculatePlatinumRating as ReturnType<typeof vi.fn>).mockReturnValueOnce(30);

    const results = runDiagnostics();
    expect(results.vaMath).toBe(false);
  });

  it('reports aiConfig failure when AI_CONFIG fields are empty', async () => {
    const aiPrompts = await import('../../lib/ai-prompts');
    const original = { ...aiPrompts.AI_CONFIG };

    // Temporarily clear the fields
    (aiPrompts.AI_CONFIG as Record<string, string>).EXAMINER_PERSONA = '';
    (aiPrompts.AI_CONFIG as Record<string, string>).VA_SPEAK_TRANSLATOR = '';

    const results = runDiagnostics();
    expect(results.aiConfig).toBe(false);

    // Restore
    (aiPrompts.AI_CONFIG as Record<string, string>).EXAMINER_PERSONA = original.EXAMINER_PERSONA;
    (aiPrompts.AI_CONFIG as Record<string, string>).VA_SPEAK_TRANSLATOR = original.VA_SPEAK_TRANSLATOR;
  });

  it('all diagnostics pass under normal conditions', () => {
    const results = runDiagnostics();
    expect(results.vaMath).toBe(true);
    expect(results.aiConfig).toBe(true);
    expect(results.branding).toBe(true);
  });
});
