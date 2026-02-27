import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Shield, FileText, Activity, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { logger } from '@/utils/logger';
import { supabase } from '@/lib/supabase';
import { startCheckout } from '@/services/entitlements';
import { useToast } from '@/hooks/use-toast';
import { openExternalUrl } from '@/lib/platform';

interface UpgradeModalProps {
  featureName: string;
}

const PREMIUM_HIGHLIGHTS = [
  { icon: Shield, label: 'Claim Strategy & Body Map tools' },
  { icon: Activity, label: 'Full health & symptom tracking' },
  { icon: FileText, label: 'Personal statements, buddy letters & more' },
  { icon: Package, label: 'Build & export your complete claim packet' },
];

export function UpgradeModal({ featureName }: UpgradeModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

      const url = await startCheckout();
      await openExternalUrl(url);
      // Reset loading after opening checkout — user may close the tab
      setTimeout(() => setLoading(false), 2000);
    } catch (err) {
      logger.error('Checkout failed:', err);
      toast({
        title: 'Checkout failed',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
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
              Premium Feature
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{featureName}</span> requires Premium access.
            </p>
          </div>

          {/* Pricing */}
          <div className="text-center space-y-1">
            <p className="text-3xl font-bold text-foreground">
              $9.99<span className="text-base font-normal text-muted-foreground"> one-time</span>
            </p>
            <p className="text-xs text-muted-foreground">One-time purchase. No subscription.</p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-3">
            {PREMIUM_HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleGetPremium}
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? 'Redirecting...' : 'Get Premium'}
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
