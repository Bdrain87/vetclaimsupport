import { useState, useEffect } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';

/**
 * Returns `true` once both useAppStore and useProfileStore have finished
 * rehydrating from encryptedStorage.  Components that depend on persisted
 * state should gate their rendering on this value to avoid reading
 * stale/default store data before async decryption completes.
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(
    () =>
      useAppStore.persist.hasHydrated() &&
      useProfileStore.persist.hasHydrated(),
  );

  useEffect(() => {
    // If already hydrated on mount, nothing to subscribe to.
    if (hydrated) return;

    function check() {
      if (
        useAppStore.persist.hasHydrated() &&
        useProfileStore.persist.hasHydrated()
      ) {
        setHydrated(true);
      }
    }

    const unsub1 = useAppStore.persist.onFinishHydration(() => check());
    const unsub2 = useProfileStore.persist.onFinishHydration(() => check());

    // Re-check in case hydration finished between the useState initialiser
    // and this effect running (React 18 concurrent mode edge case).
    check();

    return () => {
      unsub1();
      unsub2();
    };
  }, [hydrated]);

  return hydrated;
}
