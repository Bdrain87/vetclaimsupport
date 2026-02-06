import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldAlert, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

const LIABILITY_ACCEPTED_KEY = 'liabilityAccepted';

export function LiabilityAcceptanceScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [liabilityChecked, setLiabilityChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(LIABILITY_ACCEPTED_KEY);
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
      if (isAtBottom) {
        setHasScrolled(true);
      }
    }
  };

  const handleContinue = () => {
    localStorage.setItem(LIABILITY_ACCEPTED_KEY, 'true');
    setIsOpen(false);
  };

  const canContinue = liabilityChecked && termsChecked && hasScrolled;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-describedby="liability-description"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Liability Acceptance</DialogTitle>
          <DialogDescription id="liability-description">
            Please read and acknowledge the terms before using Vet Claim Support
          </DialogDescription>
        </VisuallyHidden.Root>

        <div className="p-6 space-y-5">
          {/* Icon & Title */}
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-500/15 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Important Information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please read and scroll through the following
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-56 overflow-y-auto pr-3 space-y-4 rounded-xl bg-muted/30 p-4 border border-border"
          >
            <div>
              <h3 className="font-semibold text-foreground mb-2">Educational Tool Only</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vet Claim Support is designed to help you understand and prepare
                for the VA disability claims process. This app provides
                educational information and organizational tools.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Not Legal or Medical Advice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This app does not provide legal advice, medical advice, or
                representation. We are not attorneys, doctors, or VA-accredited
                claims agents.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Not Affiliated with the VA</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are an independent application and are not affiliated with,
                endorsed by, or connected to the U.S. Department of Veterans
                Affairs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">No Guarantee of Results</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Using this app does not guarantee any specific outcome for your
                VA claim. All claim decisions are made solely by the VA.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Your Responsibility</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You are responsible for verifying all information and for any
                claims you submit to the VA. Always consult official sources and
                qualified professionals.
              </p>
            </div>
          </div>

          {/* Scroll indicator */}
          {!hasScrolled && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground animate-pulse">
              <ChevronDown className="h-4 w-4" />
              <span>Scroll to read all terms</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          )}

          {/* Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors",
                hasScrolled
                  ? "bg-muted/50 hover:bg-muted"
                  : "bg-muted/20 cursor-not-allowed opacity-60"
              )}
              htmlFor="liability"
            >
              <Checkbox
                id="liability"
                checked={liabilityChecked}
                onCheckedChange={(checked) => setLiabilityChecked(checked as boolean)}
                className="mt-0.5"
                disabled={!hasScrolled}
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I understand this is an <span className="text-foreground font-medium">educational tool only</span> and
                does not provide medical, legal, or VA claims advice.
              </span>
            </label>

            <label
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors",
                hasScrolled
                  ? "bg-muted/50 hover:bg-muted"
                  : "bg-muted/20 cursor-not-allowed opacity-60"
              )}
              htmlFor="terms"
            >
              <Checkbox
                id="terms"
                checked={termsChecked}
                onCheckedChange={(checked) => setTermsChecked(checked as boolean)}
                className="mt-0.5"
                disabled={!hasScrolled}
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
              {!hasScrolled
                ? "Please scroll to read the full disclaimer"
                : "Please check both boxes to continue"
              }
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
