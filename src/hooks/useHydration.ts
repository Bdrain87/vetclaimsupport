import { useState, useEffect } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAICacheStore } from '@/store/useAICacheStore';
import { initEncryptionKey } from '@/lib/keyManager';
import { setSessionPassword } from '@/lib/encryptedStorage';

const MIGRATION_FLAG = 'vcs-encrypted-migration-v2';

// Safety timeout — if hydration takes longer than this, force-complete to
// prevent a permanent black screen on degraded devices.
const HYDRATION_TIMEOUT_MS = 10_000;

/**
 * Orchestrates encryption key initialisation and store rehydration.
 *
 * 1. Generates / retrieves the device encryption key.
 * 2. Loads it into encryptedStorage as the session password.
 * 3. Marks encryption as enabled (for any legacy code that checks the flag).
 * 4. Manually triggers rehydration of all three stores.
 * 5. Migrates existing plaintext data to encrypted format.
 *
 * Returns `true` once all stores have finished rehydrating and data is ready.
 * Includes a 10-second safety timeout to prevent permanent black screens.
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Safety net: if boot() never resolves (e.g. broken IndexedDB, slow
    // device), force hydration after 10 seconds so the user doesn't see
    // a permanent loading screen.
    const safetyTimer = setTimeout(() => {
      if (!cancelled) {
        console.warn('[useHydration] Safety timeout reached — forcing hydration');
        setHydrated(true);
      }
    }, HYDRATION_TIMEOUT_MS);

    async function boot() {
      try {
        // Step 1: init encryption key (generates on first launch, retrieves after)
        const key = await initEncryptionKey();

        // Step 2: load key into encryptedStorage as raw-mode session password
        setSessionPassword(key, 'raw');

        // Step 3: mark encryption as enabled (legacy compat flag)
        localStorage.setItem('vet-claim-encryption-enabled', 'true');
      } catch (error) {
        // Safety net: if key init fails, still allow rehydration with
        // whatever state is available (plaintext reads still work).
        console.error('[useHydration] Encryption key init failed:', error);
      }

      if (cancelled) return;

      // Step 4: manually trigger rehydration for all stores
      await Promise.all([
        useAppStore.persist.rehydrate(),
        useProfileStore.persist.rehydrate(),
        useAICacheStore.persist.rehydrate(),
      ]);

      if (cancelled) return;

      // Step 5: migrate existing plaintext data to encrypted format
      try {
        if (!localStorage.getItem(MIGRATION_FLAG)) {
          // Force a write-back which will re-encrypt via setItem
          useAppStore.setState({ ...useAppStore.getState() });
          useProfileStore.setState({ ...useProfileStore.getState() });
          useAICacheStore.setState({ ...useAICacheStore.getState() });
          localStorage.setItem(MIGRATION_FLAG, 'true');
        }
      } catch (error) {
        console.error('[useHydration] Migration failed:', error);
      }

      if (!cancelled) {
        setHydrated(true);
      }
    }

    boot();

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, []);

  return hydrated;
}
