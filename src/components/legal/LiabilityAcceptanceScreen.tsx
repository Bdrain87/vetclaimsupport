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
        className="sm:max-w-lg p-0 overflow-hidden [&>button]:hidden"
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
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-warning" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Before We Begin</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <p className="text-muted-foreground">
            Please read and acknowledge the following before using Service Evidence Tracker:
          </p>

          {/* Checkbox 1 - Liability */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <Checkbox
              id="liability"
              checked={liabilityChecked}
              onCheckedChange={(checked) => setLiabilityChecked(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="liability" className="text-sm leading-relaxed cursor-pointer">
              I understand that Service Evidence Tracker is an <strong>organizational tool only</strong>. 
              It does not provide medical, legal, or VA claims advice. I release the app and its 
              creators from any liability related to my use of this app or decisions I make based 
              on information within it.
            </Label>
          </div>

          {/* Checkbox 2 - Terms */}
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <Checkbox
              id="terms"
              checked={termsChecked}
              onCheckedChange={(checked) => setTermsChecked(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              I have read and agree to the{' '}
              <Link 
                to="/privacy" 
                className="text-primary underline hover:text-primary/80"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link 
                to="/terms" 
                className="text-primary underline hover:text-primary/80"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
              >
                Terms of Service
              </Link>.
            </Label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Button 
            onClick={handleContinue} 
            disabled={!canContinue}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
          {!canContinue && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Please check both boxes to continue
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
