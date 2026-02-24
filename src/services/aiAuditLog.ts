/**
 * Local AI Audit Log
 *
 * Stores a local record of each AI send event, viewable by the user.
 * No PII, prompt text, or document content is stored.
 */

const STORAGE_KEY = 'vcs-ai-audit-log';
const MAX_ENTRIES = 100;

export interface AIAuditEntry {
  id: string;
  timestamp: string;
  redactionMode: 'standard' | 'high';
  redactionCount: number;
  textLengthSent: number;
}

export function logAISend(entry: Omit<AIAuditEntry, 'id' | 'timestamp'>): void {
  try {
    const log = getAIAuditLog();
    const newEntry: AIAuditEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    log.unshift(newEntry);
    if (log.length > MAX_ENTRIES) log.length = MAX_ENTRIES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    // Storage unavailable — non-fatal
  }
}

export function getAIAuditLog(): AIAuditEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AIAuditEntry[];
  } catch {
    return [];
  }
}

export function clearAIAuditLog(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable
  }
}
