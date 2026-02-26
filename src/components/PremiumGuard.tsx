import { useState, useEffect, type ReactNode } from 'react';
import { hasPremiumAccess, ensureFreshEntitlement } from '@/services/entitlements';
import { UpgradeModal } from '@/components/UpgradeModal';

/** Maximum time to wait for server entitlement check before failing closed. */
const ENTITLEMENT_TIMEOUT_MS = 8000;

interface PremiumGuardProps {
  featureName: string;
  children: ReactNode;
}

export function PremiumGuard({ featureName, children }: PremiumGuardProps) {
  const [state, setState] = useState<'loading' | 'granted' | 'blocked'>('loading');

  useEffect(() => {
    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    // Show content immediately for known premium users (avoids flash)
    if (hasPremiumAccess()) {
      setState('granted');
    }

    // ALWAYS verify with server — never trust local cache alone.
    // Race against a timeout so the guard fails closed (blocked) if the
    // server is unreachable, preventing free users from accessing premium
    // content during network outages.
    const timeout = new Promise<'timeout'>((resolve) => {
      timerId = setTimeout(() => resolve('timeout'), ENTITLEMENT_TIMEOUT_MS);
    });

    Promise.race([ensureFreshEntitlement(), timeout]).then((result) => {
      if (cancelled) return;
      if (result === 'timeout') {
        // Fail closed: if we can't verify, block access unless the user
        // was already confirmed premium in this session's cache.
        setState(hasPremiumAccess() ? 'granted' : 'blocked');
        return;
      }
      const isPremium = result === 'premium' || result === 'lifetime';
      setState(isPremium ? 'granted' : 'blocked');
    });

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
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
