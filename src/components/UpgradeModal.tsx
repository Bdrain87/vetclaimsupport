import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Shield, FileText, Activity, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { startCheckout } from '@/services/entitlements';

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

  const handleGetPremium = async () => {
    setLoading(true);
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Store intended destination so onboarding can redirect back
        sessionStorage.setItem('post_login_redirect', window.location.pathname);
        navigate('/onboarding');
        return;
      }

      const url = await startCheckout();
      window.location.href = url;
    } catch (err) {
      console.error('Checkout failed:', err);
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
              <span className="font-medium text-foreground">{featureName}</span> requires a Premium subscription.
            </p>
          </div>

          {/* Pricing */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2">
              <span className="text-sm line-through text-muted-foreground">$19.99/mo</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                Launch Sale
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              $9.99<span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
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
              onClick={() => navigate(-1)}
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
