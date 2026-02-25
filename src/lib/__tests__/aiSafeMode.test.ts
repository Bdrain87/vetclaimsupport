import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getAISafeLevel,
  setAISafeLevel,
  AI_SAFE_MODE_LABELS,
  AI_SAFE_MODE_SHORT,
} from '../aiSafeMode';
import {
  AI_ANTI_HALLUCINATION,
  SYSTEM_PROMPTS,
} from '../ai-prompts';
import {
  logAISend,
  getAIAuditLog,
  clearAIAuditLog,
} from '@/services/aiAuditLog';
import { AI_COPY } from '@/data/legalCopy';

// ===========================================================================
// Section 4A — Level 0 Default Behavior
// ===========================================================================

describe('Section 4A — Level 0 Default Behavior', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to level 0 when nothing is stored', () => {
    expect(getAISafeLevel()).toBe(0);
  });

  it('returns 0 after explicitly setting level 0', () => {
    setAISafeLevel(0);
    expect(getAISafeLevel()).toBe(0);
  });

  it('persists level 0 across multiple calls', () => {
    setAISafeLevel(0);
    expect(getAISafeLevel()).toBe(0);
    expect(getAISafeLevel()).toBe(0);
    expect(getAISafeLevel()).toBe(0);
  });

  it('stores the value in localStorage under the correct key', () => {
    setAISafeLevel(0);
    expect(localStorage.getItem('vcs-ai-safe-mode-level')).toBe('0');
  });

  it('level 0 label describes text-only behavior', () => {
    expect(AI_SAFE_MODE_LABELS[0]).toContain('Text Only');
  });

  it('level 0 short label is "Text Only (Default)"', () => {
    expect(AI_SAFE_MODE_SHORT[0]).toBe('Text Only (Default)');
  });
});

// ===========================================================================
// Section 4B — Level 1 Behavior
// ===========================================================================

describe('Section 4B — Level 1 Behavior', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('can switch to level 1', () => {
    setAISafeLevel(1);
    expect(getAISafeLevel()).toBe(1);
  });

  it('persists level 1 in localStorage', () => {
    setAISafeLevel(1);
    expect(localStorage.getItem('vcs-ai-safe-mode-level')).toBe('1');
  });

  it('persists level 1 across multiple reads', () => {
    setAISafeLevel(1);
    expect(getAISafeLevel()).toBe(1);
    expect(getAISafeLevel()).toBe(1);
  });

  it('can switch from level 0 to level 1', () => {
    setAISafeLevel(0);
    expect(getAISafeLevel()).toBe(0);
    setAISafeLevel(1);
    expect(getAISafeLevel()).toBe(1);
  });

  it('level 1 label describes redacted documents', () => {
    expect(AI_SAFE_MODE_LABELS[1]).toContain('Redacted');
  });

  it('level 1 short label is "Redacted Documents"', () => {
    expect(AI_SAFE_MODE_SHORT[1]).toBe('Redacted Documents');
  });

  it('level 1 label mentions identifiers being stripped', () => {
    expect(AI_SAFE_MODE_LABELS[1]).toContain('identifiers');
  });
});

// ===========================================================================
// Section 4C — Level 2 Behavior
// ===========================================================================

describe('Section 4C — Level 2 Behavior', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('can switch to level 2', () => {
    setAISafeLevel(2);
    expect(getAISafeLevel()).toBe(2);
  });

  it('persists level 2 in localStorage', () => {
    setAISafeLevel(2);
    expect(localStorage.getItem('vcs-ai-safe-mode-level')).toBe('2');
  });

  it('level 2 label contains "Coming soon"', () => {
    expect(AI_SAFE_MODE_LABELS[2]).toContain('Coming soon');
  });

  it('level 2 short label contains "Coming soon"', () => {
    expect(AI_SAFE_MODE_SHORT[2]).toContain('Coming soon');
  });

  it('level 2 label describes on-device processing', () => {
    expect(AI_SAFE_MODE_LABELS[2]).toContain('On-Device');
  });

  it('level 2 short label mentions on-device', () => {
    expect(AI_SAFE_MODE_SHORT[2]).toContain('On-Device Only');
  });

  it('can cycle through all levels', () => {
    setAISafeLevel(0);
    expect(getAISafeLevel()).toBe(0);
    setAISafeLevel(1);
    expect(getAISafeLevel()).toBe(1);
    setAISafeLevel(2);
    expect(getAISafeLevel()).toBe(2);
    setAISafeLevel(0);
    expect(getAISafeLevel()).toBe(0);
  });
});

// ===========================================================================
// Section 4D — AI Audit Log
// ===========================================================================

describe('Section 4D — AI Audit Log', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty audit log', () => {
    expect(getAIAuditLog()).toEqual([]);
  });

  it('logAISend creates a record in the audit log', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 3, textLengthSent: 500 });
    const log = getAIAuditLog();
    expect(log).toHaveLength(1);
  });

  it('audit entry has all required fields', () => {
    logAISend({ redactionMode: 'high', redactionCount: 7, textLengthSent: 1200 });
    const entry = getAIAuditLog()[0];
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('timestamp');
    expect(entry).toHaveProperty('redactionMode');
    expect(entry).toHaveProperty('redactionCount');
    expect(entry).toHaveProperty('textLengthSent');
  });

  it('audit entry id is a valid UUID', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 0, textLengthSent: 100 });
    const entry = getAIAuditLog()[0];
    // UUID v4 format: 8-4-4-4-12 hex chars
    expect(entry.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('audit entry timestamp is a valid ISO string', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 0, textLengthSent: 100 });
    const entry = getAIAuditLog()[0];
    const parsed = new Date(entry.timestamp);
    expect(parsed.toISOString()).toBe(entry.timestamp);
  });

  it('audit entry stores redactionMode correctly', () => {
    logAISend({ redactionMode: 'high', redactionCount: 5, textLengthSent: 800 });
    expect(getAIAuditLog()[0].redactionMode).toBe('high');
  });

  it('audit entry stores redactionCount correctly', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 12, textLengthSent: 300 });
    expect(getAIAuditLog()[0].redactionCount).toBe(12);
  });

  it('audit entry stores textLengthSent correctly', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 0, textLengthSent: 2048 });
    expect(getAIAuditLog()[0].textLengthSent).toBe(2048);
  });

  it('audit records contain NO PII fields — no name, SSN, email, or text content', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 3, textLengthSent: 500 });
    const entry = getAIAuditLog()[0];
    const keys = Object.keys(entry);

    // Only these fields should exist
    expect(keys).toEqual(
      expect.arrayContaining(['id', 'timestamp', 'redactionMode', 'redactionCount', 'textLengthSent'])
    );
    expect(keys).toHaveLength(5);

    // Explicitly confirm no PII keys
    expect(entry).not.toHaveProperty('name');
    expect(entry).not.toHaveProperty('ssn');
    expect(entry).not.toHaveProperty('email');
    expect(entry).not.toHaveProperty('text');
    expect(entry).not.toHaveProperty('content');
    expect(entry).not.toHaveProperty('prompt');
    expect(entry).not.toHaveProperty('documentContent');
  });

  it('multiple logAISend calls create multiple records', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 1, textLengthSent: 100 });
    logAISend({ redactionMode: 'high', redactionCount: 5, textLengthSent: 200 });
    logAISend({ redactionMode: 'standard', redactionCount: 0, textLengthSent: 300 });
    expect(getAIAuditLog()).toHaveLength(3);
  });

  it('newest entries appear first (unshift order)', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 1, textLengthSent: 100 });
    logAISend({ redactionMode: 'high', redactionCount: 5, textLengthSent: 200 });
    const log = getAIAuditLog();
    expect(log[0].redactionMode).toBe('high');
    expect(log[1].redactionMode).toBe('standard');
  });

  it('clearAIAuditLog removes all entries', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 1, textLengthSent: 100 });
    logAISend({ redactionMode: 'high', redactionCount: 2, textLengthSent: 200 });
    expect(getAIAuditLog()).toHaveLength(2);

    clearAIAuditLog();
    expect(getAIAuditLog()).toEqual([]);
  });

  it('clearAIAuditLog removes the localStorage key', () => {
    logAISend({ redactionMode: 'standard', redactionCount: 0, textLengthSent: 50 });
    clearAIAuditLog();
    expect(localStorage.getItem('vcs-ai-audit-log')).toBeNull();
  });

  it('enforces a maximum of 100 entries', () => {
    for (let i = 0; i < 110; i++) {
      logAISend({ redactionMode: 'standard', redactionCount: i, textLengthSent: i * 10 });
    }
    const log = getAIAuditLog();
    expect(log).toHaveLength(100);
  });

  it('keeps the newest entries when exceeding 100', () => {
    for (let i = 0; i < 105; i++) {
      logAISend({ redactionMode: 'standard', redactionCount: i, textLengthSent: i });
    }
    const log = getAIAuditLog();
    // The most recent entry (i=104) should be first
    expect(log[0].redactionCount).toBe(104);
    // The oldest kept entry should be i=5 (entries 0-4 were evicted)
    expect(log[99].redactionCount).toBe(5);
  });
});

// ===========================================================================
// Section 4E — AI Prompt Safety
// ===========================================================================

describe('Section 4E — AI Prompt Safety', () => {
  it('AI_ANTI_HALLUCINATION contains the required instruction text', () => {
    expect(AI_ANTI_HALLUCINATION).toContain(
      'Do not cite specific legal cases, regulations, or statistics unless the user provides them'
    );
  });

  it('AI_ANTI_HALLUCINATION warns against fabricating citations', () => {
    expect(AI_ANTI_HALLUCINATION).toContain('Do not fabricate');
  });

  const promptKeys = [
    'claimsAnalyst',
    'doctorSummaryBuilder',
    'personalStatementGenerator',
    'cpExamPrep',
    'mockExaminer',
    'vaSpeakTranslator',
  ] as const;

  it('SYSTEM_PROMPTS has all expected keys', () => {
    for (const key of promptKeys) {
      expect(SYSTEM_PROMPTS).toHaveProperty(key);
    }
  });

  for (const key of [
    'claimsAnalyst',
    'doctorSummaryBuilder',
    'personalStatementGenerator',
    'cpExamPrep',
    'mockExaminer',
    'vaSpeakTranslator',
  ] as const) {
    it(`SYSTEM_PROMPTS.${key} contains AI_ANTI_HALLUCINATION text`, () => {
      expect(SYSTEM_PROMPTS[key]).toContain(AI_ANTI_HALLUCINATION);
    });
  }

  it('claimsAnalyst prompt mentions VA disability claims', () => {
    expect(SYSTEM_PROMPTS.claimsAnalyst).toContain('VA disability claims');
  });

  it('doctorSummaryBuilder prompt warns against acting as a physician', () => {
    expect(SYSTEM_PROMPTS.doctorSummaryBuilder).toContain(
      'Do not generate text that reads as if authored by a physician'
    );
  });

  it('personalStatementGenerator prompt writes in first person', () => {
    expect(SYSTEM_PROMPTS.personalStatementGenerator).toContain('first-person');
  });

  it('cpExamPrep prompt warns against exaggeration', () => {
    expect(SYSTEM_PROMPTS.cpExamPrep).toContain('exaggerate');
  });

  it('mockExaminer prompt references 38 CFR Part 4', () => {
    expect(SYSTEM_PROMPTS.mockExaminer).toContain('38 CFR Part 4');
  });

  it('vaSpeakTranslator prompt mentions VA Form 21-4138', () => {
    expect(SYSTEM_PROMPTS.vaSpeakTranslator).toContain('VA Form 21-4138');
  });

  it('AI_COPY.contentBadge contains "AI-Assisted Draft"', () => {
    expect(AI_COPY.contentBadge).toContain('AI-Assisted Draft');
  });

  it('AI_COPY.contentBadge warns to review before submitting to VA', () => {
    expect(AI_COPY.contentBadge).toContain('Review before submitting to the VA');
  });
});

// ===========================================================================
// Coverage gap: aiSafeMode.ts line 15 — SSR guard (typeof window === 'undefined')
// ===========================================================================

describe('aiSafeMode — SSR guard branch', () => {
  it('returns 0 when window is undefined (SSR environment)', async () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error — simulate SSR by removing window
    delete (globalThis as Record<string, unknown>).window;
    try {
      // Re-import to re-evaluate the module with window undefined
      vi.resetModules();
      const mod = await import('../aiSafeMode');
      expect(mod.getAISafeLevel()).toBe(0);
    } finally {
      globalThis.window = originalWindow;
    }
  });
});

// ===========================================================================
// Coverage gap: aiAuditLog.ts line 41 — catch branch in getAIAuditLog
// ===========================================================================

describe('aiAuditLog — getAIAuditLog catch branch', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('vcs-ai-audit-log', '{not valid json!!!');
    const log = getAIAuditLog();
    expect(log).toEqual([]);
  });
});

// ===========================================================================
// Coverage gap: legalCopy.ts lines 65, 106-107 — function bodies
// ===========================================================================

describe('legalCopy — function coverage', () => {
  it('AI_COPY.contentBadgeWithDate returns formatted badge with date', () => {
    const result = AI_COPY.contentBadgeWithDate('February 24, 2026');
    expect(result).toContain('AI-Assisted Draft');
    expect(result).toContain('Generated February 24, 2026');
  });

  it('AI_COPY.auditLogEntry returns formatted audit log entry', () => {
    const result = AI_COPY.auditLogEntry('2026-02-24', 'standard');
    expect(result).toBe('Sent to AI on 2026-02-24 with standard redaction mode');
  });

  it('AI_COPY.auditLogEntry works with high mode', () => {
    const result = AI_COPY.auditLogEntry('2026-01-01', 'high');
    expect(result).toContain('high redaction mode');
  });
});

// ===========================================================================
// Coverage gap: legalCopy.ts line 18-24 — formatLegalDate function
// ===========================================================================

describe('legalCopy — formatLegalDate', () => {
  it('formats a date string to US locale', async () => {
    const { formatLegalDate } = await import('@/data/legalCopy');
    const result = formatLegalDate('2026-02-19');
    expect(result).toContain('2026');
    expect(result).toContain('19');
  });

  it('formats a different date correctly', async () => {
    const { formatLegalDate } = await import('@/data/legalCopy');
    const result = formatLegalDate('2026-02-24');
    expect(result).toContain('24');
    expect(result).toContain('2026');
  });
});
