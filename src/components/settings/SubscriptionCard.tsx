import { useState } from 'react';
import { Crown, Award, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/useProfileStore';
import { logger } from '@/utils/logger';
import { supabase } from '@/lib/supabase';
import { startCheckout, refreshEntitlementFromServer, verifyAppleReceipt } from '@/services/entitlements';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { isNativeApp, openExternalUrl } from '@/lib/platform';
import { PREMIUM_COPY } from '@/data/legalCopy';
import { purchaseViaApple, restoreApplePurchases } from '@/services/iap';

export function SubscriptionCard() {
  const entitlement = useProfileStore((s) => s.entitlement);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const { toast } = useToast();

  const isPremium = entitlement === 'premium' || entitlement === 'lifetime';

  const handleUpgrade = async () => {
    if (isNativeApp) {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          sessionStorage.setItem('post_login_redirect', '/settings');
          navigate('/auth');
          return;
        }

        const result = await purchaseViaApple();

        if (result.cancelled) return; // User cancelled — no toast needed

        if (result.success && result.entitlementActive) {
          // Verify with our backend to record entitlement
          await verifyAppleReceipt('revenuecat').catch(() => {});
          // Refresh local entitlement state
          await refreshEntitlementFromServer();
          toast({ title: 'Premium Unlocked', description: 'Welcome to VCS Premium!' });
        } else if (!result.success && result.error) {
          toast({ title: 'Purchase Failed', description: result.error, variant: 'destructive' });
        }
      } catch (err) {
        logger.error('iOS purchase failed:', err);
        toast({
          title: 'Purchase Failed',
          description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        sessionStorage.setItem('post_login_redirect', '/settings');
        navigate('/auth');
        return;
      }
      const url = await startCheckout();
      await openExternalUrl(url);
    } catch (err) {
      logger.error('Checkout failed:', err);
      toast({
        title: 'Checkout failed',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Sign In Required',
          description: 'Sign in to restore your premium access.',
          variant: 'destructive',
        });
        return;
      }

      if (isNativeApp) {
        // Try restoring via Apple IAP first
        const { restored, error } = await restoreApplePurchases();
        if (restored) {
          await verifyAppleReceipt('revenuecat').catch(() => {});
          await refreshEntitlementFromServer();
          toast({ title: 'Premium Restored', description: 'Welcome back! Premium access is active.' });
          return;
        }
        if (error) {
          logger.warn('Apple restore failed, falling back to server check:', error);
        }
      }

      // Fallback: check server for existing entitlement (works for Stripe + Apple)
      const status = await refreshEntitlementFromServer();
      if (status === 'premium' || status === 'lifetime') {
        toast({ title: 'Premium Restored', description: 'Welcome back! Premium access is active.' });
      } else {
        toast({
          title: 'No Purchase Found',
          description: 'No premium purchase was found for this account.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Restore Failed',
        description: 'Could not check your purchase status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRestoring(false);
    }
  };

  if (isPremium) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{PREMIUM_COPY.activeLabel}</p>
            <p className="text-xs text-muted-foreground">Full access to all features</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gold/10 shrink-0">
            <Crown className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Premium Access</p>
            <p className="text-xs text-muted-foreground">{PREMIUM_COPY.subtext}</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {PREMIUM_COPY.priceDisplay}
        </div>

        <ul className="space-y-1 text-xs text-muted-foreground">
          {PREMIUM_COPY.whatYouGet.map((item) => (
            <li key={item} className="flex items-start gap-1.5">
              <span className="text-success mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <Button onClick={handleUpgrade} disabled={loading} className="w-full" size="sm">
          {loading ? (isNativeApp ? 'Processing...' : 'Redirecting...') : PREMIUM_COPY.ctaLabel}
        </Button>

        <p className="text-[11px] text-muted-foreground/70 text-center">
          {PREMIUM_COPY.accountNote} {PREMIUM_COPY.signInNote}
        </p>

        <p className="text-[11px] text-muted-foreground/60 text-center">
          {PREMIUM_COPY.alreadyPurchased}
        </p>

        <button
          onClick={handleRestore}
          disabled={restoring}
          className="flex items-center justify-center gap-1.5 text-xs text-gold hover:text-gold/80 transition-colors w-full"
        >
          <RefreshCw className={`h-3 w-3 ${restoring ? 'animate-spin' : ''}`} />
          {restoring ? 'Checking...' : isNativeApp ? PREMIUM_COPY.restorePurchasesLabel : PREMIUM_COPY.restorePremiumLabel}
        </button>
      </CardContent>
    </Card>
  );
}
