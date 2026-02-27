import { useState } from 'react';
import { Crown, Award, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/useProfileStore';
import { supabase } from '@/lib/supabase';
import { startCheckout, refreshEntitlementFromServer } from '@/services/entitlements';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { isNativeApp } from '@/lib/platform';
import { PREMIUM_COPY } from '@/data/legalCopy';

export function SubscriptionCard() {
  const entitlement = useProfileStore((s) => s.entitlement);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const { toast } = useToast();

  const isPremium = entitlement === 'premium' || entitlement === 'lifetime';

  const handleUpgrade = async () => {
    if (isNativeApp) {
      // On iOS, purchases go through StoreKit (not yet implemented)
      toast({
        title: 'Coming Soon',
        description: 'In-app purchases will be available in a future update.',
      });
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
      window.open(url, '_blank');
    } catch (err) {
      console.error('Checkout failed:', err);
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
              <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        {!isNativeApp && (
          <Button onClick={handleUpgrade} disabled={loading} className="w-full" size="sm">
            {loading ? 'Redirecting...' : PREMIUM_COPY.ctaLabel}
          </Button>
        )}

        {isNativeApp && (
          <Button onClick={handleUpgrade} disabled={loading} className="w-full" size="sm">
            {loading ? 'Loading...' : PREMIUM_COPY.ctaLabel}
          </Button>
        )}

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
