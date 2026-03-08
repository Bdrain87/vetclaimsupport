import { useState, useEffect, type ReactNode } from 'react';
import { hasPremiumAccess, ensureFreshEntitlement, wasPremiumInSession } from '@/services/entitlements';
import { UpgradeModal } from '@/components/UpgradeModal';

/** Maximum time to wait for server entitlement check before degrading gracefully. */
const ENTITLEMENT_TIMEOUT_MS = 4000;

interface PremiumGuardProps {
  featureName: string;
  children: ReactNode;
}

export function PremiumGuard({ featureName, children }: PremiumGuardProps) {
  const [state, setState] = useState<'loading' | 'granted' | 'blocked'>('loading');

  useEffect(() => {
    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    // Immediate grant for known premium users — avoids flash
    const premiumAtMount = hasPremiumAccess() || wasPremiumInSession();
    if (premiumAtMount) {
      setState('granted');
    }

    // ALWAYS verify with server — never trust local cache alone.
    const timeout = new Promise<'timeout'>((resolve) => {
      timerId = setTimeout(() => resolve('timeout'), ENTITLEMENT_TIMEOUT_MS);
    });

    Promise.race([ensureFreshEntitlement(), timeout]).then((result) => {
      if (cancelled) return;
      if (result === 'timeout') {
        // If the user was premium at mount or earlier in this session,
        // NEVER flip to blocked on timeout — gracefully degrade.
        if (premiumAtMount || wasPremiumInSession()) {
          setState('granted');
        } else {
          setState(hasPremiumAccess() ? 'granted' : 'blocked');
        }
        return;
      }
      const isPremium = result === 'premium' || result === 'lifetime';
      setState(isPremium ? 'granted' : 'blocked');
    }).catch(() => {
      if (cancelled) return;
      // On error: same logic — never lock out known-premium users
      if (premiumAtMount || wasPremiumInSession()) {
        setState('granted');
      } else {
        setState(hasPremiumAccess() ? 'granted' : 'blocked');
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (state === 'blocked') {
    return <UpgradeModal featureName={featureName} />;
  }

  return <>{children}</>;
}
