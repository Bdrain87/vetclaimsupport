import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

const LIABILITY_ACCEPTED_KEY = 'liabilityAccepted';

export function LiabilityAcceptanceScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [liabilityChecked, setLiabilityChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(LIABILITY_ACCEPTED_KEY);
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem(LIABILITY_ACCEPTED_KEY, 'true');
    setIsOpen(false);
  };

  const canContinue = liabilityChecked && termsChecked;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-describedby="liability-description"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Liability Acceptance</DialogTitle>
          <DialogDescription id="liability-description">
            Please read and acknowledge the terms before using Service Evidence Tracker
          </DialogDescription>
        </VisuallyHidden.Root>

        <div className="p-6 space-y-6">
          {/* Icon & Title */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-500/15 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Before We Begin</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please acknowledge the following
              </p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label 
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] cursor-pointer transition-colors hover:bg-white/[0.05]"
              htmlFor="liability"
            >
              <Checkbox
                id="liability"
                checked={liabilityChecked}
                onCheckedChange={(checked) => setLiabilityChecked(checked as boolean)}
                className="mt-0.5"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I understand this is an <span className="text-foreground font-medium">organizational tool only</span>. 
                It does not provide medical, legal, or VA claims advice.
              </span>
            </label>

            <label 
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] cursor-pointer transition-colors hover:bg-white/[0.05]"
              htmlFor="terms"
            >
              <Checkbox
                id="terms"
                checked={termsChecked}
                onCheckedChange={(checked) => setTermsChecked(checked as boolean)}
                className="mt-0.5"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <Link 
                  to="/privacy" 
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link 
                  to="/terms" 
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                >
                  Terms of Service
                </Link>.
              </span>
            </label>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handleContinue} 
            disabled={!canContinue}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>

          {!canContinue && (
            <p className="text-xs text-muted-foreground text-center">
              Please check both boxes to continue
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}