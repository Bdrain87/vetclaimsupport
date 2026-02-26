import { useState, useEffect, type ReactNode } from 'react';
import { hasPremiumAccess, ensureFreshEntitlement } from '@/services/entitlements';
import { UpgradeModal } from '@/components/UpgradeModal';
import { isNativeApp } from '@/lib/platform';

interface PremiumGuardProps {
  featureName: string;
  children: ReactNode;
}

export function PremiumGuard({ featureName, children }: PremiumGuardProps) {
  // TODO: Remove this bypass once StoreKit IAP is implemented.
  // Currently all native iOS users get premium features for free because
  // Apple IAP is not yet integrated. This is a known pre-launch limitation.
  const [state, setState] = useState<'loading' | 'granted' | 'blocked'>(
    isNativeApp ? 'granted' : 'loading'
  );

  useEffect(() => {
    if (isNativeApp) return;

    let cancelled = false;

    // Show content immediately for known premium users (avoids flash)
    if (hasPremiumAccess()) {
      setState('granted');
    }

    // ALWAYS verify with server — never trust local cache alone
    ensureFreshEntitlement().then((status) => {
      if (cancelled) return;
      const isPremium = status === 'premium' || status === 'lifetime';
      setState(isPremium ? 'granted' : 'blocked');
    });

    return () => { cancelled = true; };
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
