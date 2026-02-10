import { useState, useEffect, useCallback } from 'react';
import {
  getSyncStatus,
  getLastSyncedAt,
  onSyncStatusChange,
  syncNow as doSyncNow,
  type SyncStatus,
} from '@/services/syncEngine';

export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus());
  const [lastSynced, setLastSynced] = useState<string | null>(getLastSyncedAt());

  useEffect(() => {
    const unsubscribe = onSyncStatusChange((newStatus) => {
      setStatus(newStatus);
      setLastSynced(getLastSyncedAt());
    });
    return unsubscribe;
  }, []);

  const syncNow = useCallback(async () => {
    await doSyncNow();
    setLastSynced(getLastSyncedAt());
  }, []);

  return { status, lastSynced, syncNow };
}
