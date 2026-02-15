import { useState } from 'react';
import { Crown, ExternalLink, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/useProfileStore';
import { supabase } from '@/lib/supabase';
import { startCheckout, openBillingPortal } from '@/services/entitlements';
import { useNavigate } from 'react-router-dom';

export function SubscriptionCard() {
  const entitlement = useProfileStore((s) => s.entitlement);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        sessionStorage.setItem('post_login_redirect', '/settings');
        navigate('/onboarding');
        return;
      }
      const url = await startCheckout();
      window.location.href = url;
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManage = async () => {
    setLoading(true);
    try {
      const url = await openBillingPortal();
      window.location.href = url;
    } catch (err) {
      console.error('Portal failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Subscription
        </CardTitle>
        <CardDescription>
          {entitlement === 'preview' && 'Upgrade to unlock all premium features'}
          {entitlement === 'premium' && 'You have full access to all premium features'}
          {entitlement === 'lifetime' && 'You have lifetime access to all features'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entitlement === 'preview' && (
          <Button onClick={handleUpgrade} disabled={loading} className="w-full">
            {loading ? 'Redirecting...' : 'Upgrade to Premium — $9.99/mo'}
          </Button>
        )}

        {entitlement === 'premium' && (
          <Button onClick={handleManage} disabled={loading} variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            {loading ? 'Opening...' : 'Manage Subscription'}
          </Button>
        )}

        {entitlement === 'lifetime' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Award className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Lifetime Access</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
