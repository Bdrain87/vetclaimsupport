import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ArrowLeft, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { logger } from '@/utils/logger';
import { supabase } from '@/lib/supabase';
import { startCheckout, refreshEntitlementFromServer, invalidateEntitlementCache } from '@/services/entitlements';
import { useToast } from '@/hooks/use-toast';
import { isNativeApp, openExternalUrl } from '@/lib/platform';
import { getFeatureValue } from '@/data/premiumFeatureValues';
import confetti from 'canvas-confetti';

interface UpgradeModalProps {
  featureName: string;
}

export function UpgradeModal({ featureName }: UpgradeModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [priceString, setPriceString] = useState('$14.99');
  const { toast } = useToast();

  const featureValue = getFeatureValue(featureName);

  // On native, fetch dynamic price from RevenueCat
  useEffect(() => {
    if (!isNativeApp) return;
    import('@/services/iap').then(({ getOfferings }) =>
      getOfferings().then((offerings) => {
        if (offerings.length > 0) {
          setPriceString(offerings[0].priceString);
        }
      }).catch(() => {
        // Keep default price string
      })
    );
  }, []);

  // Reset loading and refresh entitlements when user returns from Stripe checkout (web only)
  useEffect(() => {
    if (!loading || isNativeApp) return;
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        setLoading(false);
        invalidateEntitlementCache();
        const status = await refreshEntitlementFromServer();
        if (status === 'premium' || status === 'lifetime') {
          fireConfetti();
          toast({ title: 'Welcome to Premium!', description: 'Premium features are now unlocked.' });
          setTimeout(() => navigate(0), 1500);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [loading, navigate, toast]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B8AB80', '#D0C6A0', '#9E9370', '#ACA27C'],
    });
  };

  const handleGetPremium = async () => {
    setLoading(true);
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        sessionStorage.setItem('post_login_redirect', window.location.pathname);
        setLoading(false);
        navigate('/auth');
        return;
      }

      if (isNativeApp) {
        // Apple IAP flow
        const { purchaseViaApple } = await import('@/services/iap');
        const result = await purchaseViaApple();

        if (result.cancelled) {
          setLoading(false);
          return;
        }

        if (result.success && result.entitlementActive) {
          // Sync entitlement to Supabase
          invalidateEntitlementCache();
          await refreshEntitlementFromServer();
          fireConfetti();
          toast({ title: 'Welcome to Premium!', description: 'Premium features are now unlocked.' });
          // Navigate back to the feature they wanted
          setTimeout(() => navigate(0), 1500);
          return;
        }

        if (result.error) {
          throw new Error(result.error);
        }
      } else {
        // Stripe web flow
        const url = await startCheckout();
        await openExternalUrl(url);
        // Loading stays true until user returns (visibilitychange handler above)
      }
    } catch (err) {
      logger.error('Checkout failed:', err);
      toast({
        title: 'Checkout failed',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      if (isNativeApp) setLoading(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      if (isNativeApp) {
        const { restoreApplePurchases } = await import('@/services/iap');
        const result = await restoreApplePurchases();
        if (result.restored) {
          invalidateEntitlementCache();
          await refreshEntitlementFromServer();
          fireConfetti();
          toast({ title: 'Purchases restored!', description: 'Premium access has been restored.' });
          setTimeout(() => navigate(0), 1500);
          return;
        }
        toast({
          title: 'No purchases found',
          description: 'No previous purchase was found for this account.',
        });
      } else {
        // On web, just re-check server entitlement
        invalidateEntitlementCache();
        const status = await refreshEntitlementFromServer();
        if (status === 'premium' || status === 'lifetime') {
          fireConfetti();
          toast({ title: 'Access restored!', description: 'Premium access has been restored.' });
          setTimeout(() => navigate(0), 1500);
          return;
        }
        toast({
          title: 'No purchase found',
          description: 'No active subscription was found for this account.',
        });
      }
    } catch (err) {
      logger.error('Restore failed:', err);
      toast({
        title: 'Restore failed',
        description: err instanceof Error ? err.message : 'Could not restore purchases.',
        variant: 'destructive',
      });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-primary/30">
        <CardContent className="pt-8 pb-6 px-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Crown className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {featureValue.headline}
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{featureName}</span> requires Premium access.
            </p>
          </div>

          {/* Pricing */}
          <div className="text-center space-y-2">
            <p className="text-3xl font-bold text-foreground">
              {priceString}<span className="text-base font-normal text-muted-foreground">/month</span>
            </p>
            <div className="flex justify-center gap-3 text-[11px] text-muted-foreground">
              <span>3 mo — $39.99</span>
              <span>6 mo — $74.99</span>
              <span>Annual — $124.99</span>
            </div>
            <p className="text-xs text-muted-foreground">Less than a single copay. Cancel anytime.</p>
          </div>

          {/* Contextual feature bullets */}
          <div className="space-y-3">
            {featureValue.bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{bullet}</span>
              </div>
            ))}
          </div>

          {/* Urgency message */}
          {featureValue.urgency && (
            <p className="text-xs text-center text-primary font-medium bg-primary/5 rounded-xl px-3 py-2">
              {featureValue.urgency}
            </p>
          )}

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleGetPremium}
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? 'Processing...' : `Get Premium — ${priceString}/mo`}
            </Button>

            {/* Restore Purchases (Apple requirement on native) */}
            <Button
              variant="outline"
              onClick={handleRestore}
              disabled={restoring}
              className="w-full text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {restoring ? 'Restoring...' : 'Restore Purchases'}
            </Button>

            <Button
              variant="ghost"
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/app')}
              className="w-full text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
