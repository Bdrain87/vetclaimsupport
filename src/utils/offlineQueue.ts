/**
 * Offline Queue Manager
 * Queues operations when offline and syncs when back online
 */

export type OperationType = 'create' | 'update' | 'delete' | 'sync';

export interface QueuedOperation {
  id: string;
  type: OperationType;
  category: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  error?: string;
}

export interface QueueState {
  operations: QueuedOperation[];
  isSyncing: boolean;
  lastSyncAttempt: number | null;
  lastSuccessfulSync: number | null;
}

const STORAGE_KEY = 'vet-claim-offline-queue';
const MAX_RETRIES = 3;

type SyncHandler = (operation: QueuedOperation) => Promise<boolean>;

// Sync handlers registry
const syncHandlers: Map<string, SyncHandler> = new Map();

// Generate unique ID using cryptographically secure random
function generateId(): string {
  return crypto.randomUUID();
}

// Get queue state from storage
function getQueueState(): QueueState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          operations: [],
          isSyncing: false,
          lastSyncAttempt: null,
          lastSuccessfulSync: null,
        };
  } catch {
    return {
      operations: [],
      isSyncing: false,
      lastSyncAttempt: null,
      lastSuccessfulSync: null,
    };
  }
}

// Save queue state to storage
function saveQueueState(state: QueueState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Register a sync handler for a category
export function registerSyncHandler(category: string, handler: SyncHandler): void {
  syncHandlers.set(category, handler);
}

// Unregister a sync handler
export function unregisterSyncHandler(category: string): void {
  syncHandlers.delete(category);
}

// Add operation to queue
export function queueOperation(
  type: OperationType,
  category: string,
  data: unknown
): QueuedOperation {
  const operation: QueuedOperation = {
    id: generateId(),
    type,
    category,
    data,
    timestamp: Date.now(),
    retryCount: 0,
    maxRetries: MAX_RETRIES,
  };

  const state = getQueueState();
  state.operations.push(operation);
  saveQueueState(state);

  // Try to sync immediately if online
  if (isOnline()) {
    processQueue();
  }

  return operation;
}

// Remove operation from queue
export function removeOperation(operationId: string): boolean {
  const state = getQueueState();
  const index = state.operations.findIndex((op) => op.id === operationId);

  if (index !== -1) {
    state.operations.splice(index, 1);
    saveQueueState(state);
    return true;
  }

  return false;
}

// Get pending operations
export function getPendingOperations(): QueuedOperation[] {
  return getQueueState().operations;
}

// Get pending operations count
export function getPendingCount(): number {
  return getQueueState().operations.length;
}

// Process a single operation
async function processOperation(operation: QueuedOperation): Promise<boolean> {
  const handler = syncHandlers.get(operation.category);

  if (!handler) {
    console.warn(`No sync handler registered for category: ${operation.category}`);
    return false;
  }

  try {
    return await handler(operation);
  } catch (error) {
    console.error(`Error processing operation ${operation.id}:`, error);
    return false;
  }
}

// Process all queued operations
export async function processQueue(): Promise<{
  processed: number;
  failed: number;
  remaining: number;
}> {
  if (!isOnline()) {
    return { processed: 0, failed: 0, remaining: getPendingCount() };
  }

  const state = getQueueState();

  if (state.isSyncing) {
    return { processed: 0, failed: 0, remaining: state.operations.length };
  }

  state.isSyncing = true;
  state.lastSyncAttempt = Date.now();
  saveQueueState(state);

  let processed = 0;
  let failed = 0;
  const remainingOps: QueuedOperation[] = [];

  for (const operation of state.operations) {
    const success = await processOperation(operation);

    if (success) {
      processed++;
    } else {
      operation.retryCount++;

      if (operation.retryCount < operation.maxRetries) {
        remainingOps.push(operation);
      } else {
        failed++;
        operation.error = 'Max retries exceeded';
        // Could emit event or store failed ops elsewhere
      }
    }
  }

  state.operations = remainingOps;
  state.isSyncing = false;

  if (processed > 0) {
    state.lastSuccessfulSync = Date.now();
  }

  saveQueueState(state);

  return {
    processed,
    failed,
    remaining: remainingOps.length,
  };
}

// Clear the queue
export function clearQueue(): void {
  const state = getQueueState();
  state.operations = [];
  saveQueueState(state);
}

// Get queue status
export function getQueueStatus(): {
  pendingCount: number;
  isSyncing: boolean;
  lastSync: number | null;
  isOnline: boolean;
} {
  const state = getQueueState();
  return {
    pendingCount: state.operations.length,
    isSyncing: state.isSyncing,
    lastSync: state.lastSuccessfulSync,
    isOnline: isOnline(),
  };
}

// Set up online/offline listeners
export function setupNetworkListeners(): () => void {
  const handleOnline = () => {
    processQueue();
  };

  window.addEventListener('online', handleOnline);

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}

// Format last sync time
export function formatLastSync(timestamp: number | null): string {
  if (!timestamp) return 'Never';

  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return new Date(timestamp).toLocaleDateString();
}

// Hook for React components
export function useOfflineQueue() {
  const status = getQueueStatus();

  return {
    ...status,
    queueOperation,
    removeOperation,
    processQueue,
    clearQueue,
    getPendingOperations,
    formatLastSync: () => formatLastSync(status.lastSync),
  };
}
