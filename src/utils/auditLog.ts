/**
 * Local Audit Log for tracking data modifications
 * Stores a history of all changes made to user data
 */

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'import'
  | 'clear'
  | 'login'
  | 'logout';

export interface AuditEntry {
  id: string;
  timestamp: number;
  action: AuditAction;
  category: string;
  description: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = 'vet-claim-audit-log';
const MAX_ENTRIES = 500; // Limit log size

// Generate unique ID using cryptographically secure random
function generateId(): string {
  return crypto.randomUUID();
}

// Get all audit entries
export function getAuditLog(): AuditEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Add a new audit entry
export function logAuditEntry(
  action: AuditAction,
  category: string,
  description: string,
  metadata?: Record<string, unknown>
): AuditEntry {
  const entry: AuditEntry = {
    id: generateId(),
    timestamp: Date.now(),
    action,
    category,
    description,
    metadata,
  };

  const log = getAuditLog();

  // Add new entry at the beginning
  log.unshift(entry);

  // Trim to max size
  if (log.length > MAX_ENTRIES) {
    log.splice(MAX_ENTRIES);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    // Storage full or unavailable
  }

  return entry;
}

// Convenience methods for common actions
export const audit = {
  create: (category: string, itemName: string, metadata?: Record<string, unknown>) =>
    logAuditEntry('create', category, `Created ${itemName}`, metadata),

  update: (category: string, itemName: string, metadata?: Record<string, unknown>) =>
    logAuditEntry('update', category, `Updated ${itemName}`, metadata),

  delete: (category: string, itemName: string, metadata?: Record<string, unknown>) =>
    logAuditEntry('delete', category, `Deleted ${itemName}`, metadata),

  export: (category: string, metadata?: Record<string, unknown>) =>
    logAuditEntry('export', category, `Exported ${category} data`, metadata),

  import: (category: string, metadata?: Record<string, unknown>) =>
    logAuditEntry('import', category, `Imported ${category} data`, metadata),

  clear: (category: string, metadata?: Record<string, unknown>) =>
    logAuditEntry('clear', category, `Cleared ${category} data`, metadata),
};

// Get entries by category
export function getEntriesByCategory(category: string): AuditEntry[] {
  return getAuditLog().filter((entry) => entry.category === category);
}

// Get entries by action type
export function getEntriesByAction(action: AuditAction): AuditEntry[] {
  return getAuditLog().filter((entry) => entry.action === action);
}

// Get entries within a date range
export function getEntriesByDateRange(startDate: Date, endDate: Date): AuditEntry[] {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return getAuditLog().filter(
    (entry) => entry.timestamp >= start && entry.timestamp <= end
  );
}

// Get recent entries
export function getRecentEntries(count: number = 50): AuditEntry[] {
  return getAuditLog().slice(0, count);
}

// Clear audit log
export function clearAuditLog(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Export audit log as JSON
export function exportAuditLog(): string {
  const log = getAuditLog();
  return JSON.stringify(log, null, 2);
}

// Download audit log as file
export function downloadAuditLog(): void {
  const json = exportAuditLog();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Get audit statistics
export function getAuditStats(): {
  totalEntries: number;
  entriesByAction: Record<AuditAction, number>;
  entriesByCategory: Record<string, number>;
  oldestEntry: number | null;
  newestEntry: number | null;
} {
  const log = getAuditLog();

  const entriesByAction: Record<AuditAction, number> = {
    create: 0,
    update: 0,
    delete: 0,
    export: 0,
    import: 0,
    clear: 0,
    login: 0,
    logout: 0,
  };

  const entriesByCategory: Record<string, number> = {};

  log.forEach((entry) => {
    entriesByAction[entry.action]++;
    entriesByCategory[entry.category] = (entriesByCategory[entry.category] || 0) + 1;
  });

  return {
    totalEntries: log.length,
    entriesByAction,
    entriesByCategory,
    oldestEntry: log.length > 0 ? log[log.length - 1].timestamp : null,
    newestEntry: log.length > 0 ? log[0].timestamp : null,
  };
}

// Format timestamp for display
export function formatAuditTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Get action color for UI
export function getActionColor(action: AuditAction): string {
  switch (action) {
    case 'create':
      return 'text-success';
    case 'update':
      return 'text-primary';
    case 'delete':
      return 'text-destructive';
    case 'export':
      return 'text-blue-500';
    case 'import':
      return 'text-purple-500';
    case 'clear':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

// Get action icon name for UI
export function getActionIcon(action: AuditAction): string {
  switch (action) {
    case 'create':
      return 'Plus';
    case 'update':
      return 'Edit';
    case 'delete':
      return 'Trash2';
    case 'export':
      return 'Download';
    case 'import':
      return 'Upload';
    case 'clear':
      return 'XCircle';
    case 'login':
      return 'LogIn';
    case 'logout':
      return 'LogOut';
    default:
      return 'Activity';
  }
}
