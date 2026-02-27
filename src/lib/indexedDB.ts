// IndexedDB wrapper for storing large files locally
// This keeps all veteran data 100% on-device for privacy
// All stored data is encrypted at rest using the device encryption key.

import { encryptWithRawKey, decryptWithRawKey } from '@/utils/encryption';
import { getCachedKey } from '@/lib/keyManager';
import { logger } from '@/utils/logger';

const DB_NAME = 'va-claims-evidence-db';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

// Threshold for using IndexedDB vs localStorage (500KB)
export const INDEXEDDB_THRESHOLD = 500 * 1024;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      // Clear the cached promise so future calls can retry
      dbPromise = null;
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;
      // Handle unexpected closure (e.g., storage cleared while app is running)
      db.onclose = () => {
        dbPromise = null;
      };
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });

  return dbPromise;
}

// Minimum free space required before writing (5 MB)
const MIN_FREE_SPACE_BYTES = 5 * 1024 * 1024;

/**
 * Check if there is enough storage quota to write `bytesNeeded`.
 * Returns true if quota info is unavailable (optimistic fallback).
 */
async function hasQuota(bytesNeeded: number): Promise<boolean> {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) return true;
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const available = quota - usage;
    return available > bytesNeeded + MIN_FREE_SPACE_BYTES;
  } catch {
    return true; // Optimistic if estimate fails
  }
}

// Store large file data in IndexedDB (encrypted at rest)
export async function storeFileData(id: string, dataUrl: string): Promise<void> {
  const ok = await hasQuota(dataUrl.length * 2); // UTF-16 ≈ 2 bytes/char
  if (!ok) {
    throw new Error('Insufficient storage quota. Free up space and try again.');
  }

  const key = getCachedKey();
  if (!key) {
    throw new Error('Encryption key unavailable. Cannot store unencrypted data.');
  }
  const storedValue = await encryptWithRawKey(dataUrl, key);

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put({
      id,
      dataUrl: storedValue,
      encrypted: true,
      storedAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Retrieve file data from IndexedDB (decrypts if encrypted)
export async function getFileData(id: string): Promise<string | null> {
  const db = await openDB();

  const result = await new Promise<{ dataUrl: string; encrypted?: boolean } | undefined>(
    (resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    },
  );

  if (!result?.dataUrl) return null;

  // Decrypt if the record was stored encrypted
  if (result.encrypted) {
    const key = getCachedKey();
    if (!key) {
      logger.error('[indexedDB] No encryption key available to decrypt record:', id);
      return null;
    }
    try {
      return await decryptWithRawKey(result.dataUrl, key);
    } catch {
      logger.error('[indexedDB] Decryption failed for record:', id);
      return null;
    }
  }

  // Unencrypted legacy record — migrate it to encrypted on read
  const key = getCachedKey();
  if (key) {
    try {
      const encrypted = await encryptWithRawKey(result.dataUrl, key);
      const writeDb = await openDB();
      const tx = writeDb.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({
        id,
        dataUrl: encrypted,
        encrypted: true,
        storedAt: new Date().toISOString(),
      });
    } catch {
      // Migration failure is non-fatal — data is still readable
      logger.warn('[indexedDB] Failed to migrate record to encrypted:', id);
    }
  }

  return result.dataUrl;
}

// Restore multiple files in a single transaction, resolving only once the
// transaction has fully committed.  This prevents the race condition where
// window.location.reload() could fire before IndexedDB has durably written
// all restored records.
export async function restoreFiles(
  files: Array<{ id: string; dataUrl: string }>,
): Promise<void> {
  if (files.length === 0) return;

  const key = getCachedKey();
  if (!key) {
    throw new Error('Encryption key unavailable. Cannot restore files without encryption.');
  }

  // Pre-encrypt all values before opening the transaction so the transaction
  // does not go inactive while we await crypto operations.
  const prepared: Array<{
    id: string;
    dataUrl: string;
  }> = [];

  for (const file of files) {
    const storedValue = await encryptWithRawKey(file.dataUrl, key);
    prepared.push({ id: file.id, dataUrl: storedValue });
  }

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    for (const item of prepared) {
      store.put({
        id: item.id,
        dataUrl: item.dataUrl,
        encrypted: true,
        storedAt: new Date().toISOString(),
      });
    }

    // Resolve on transaction.oncomplete — not request.onsuccess — so we
    // know all writes have been durably committed to disk.
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () =>
      reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
  });
}

// Delete file data from IndexedDB
export async function deleteFileData(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get all stored file IDs
export async function getAllFileIds(): Promise<string[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAllKeys();

    request.onsuccess = () => {
      resolve(request.result as string[]);
    };
    request.onerror = () => reject(request.error);
  });
}

// Get storage usage estimate
export async function getStorageEstimate(): Promise<{ used: number; quota: number } | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  return null;
}

// Delete the entire IndexedDB database (used during account deletion / data purge)
export async function clearDatabase(): Promise<void> {
  // Close any open connection first
  if (dbPromise) {
    try {
      const db = await dbPromise;
      db.close();
    } catch { /* ignore */ }
    dbPromise = null;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      // Database is still in use — resolve anyway to avoid blocking purge
      logger.warn('[indexedDB] deleteDatabase blocked — resolving anyway');
      resolve();
    };
  });
}

// Check if IndexedDB is available
export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}
