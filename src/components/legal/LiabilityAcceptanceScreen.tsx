import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldAlert, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const LIABILITY_ACCEPTED_KEY = 'liabilityAccepted';
const TERMS_VERSION = '1.1';

export function LiabilityAcceptanceScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [liabilityChecked, setLiabilityChecked] = useState(false);
  const [aiChecked, setAiChecked] = useState(false);
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
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem(LIABILITY_ACCEPTED_KEY, 'true');
      localStorage.setItem('consentTimestamp', timestamp);
      localStorage.setItem('consentTermsVersion', TERMS_VERSION);
    } catch {
      // Storage full or unavailable
    }

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('consent_log').insert({
            user_id: session.user.id,
            terms_version: TERMS_VERSION,
            accepted_at: timestamp,
          });
        }
      } catch {
        // Non-fatal: local consent is still recorded
      }
    })();

    setIsOpen(false);
  };

  const canContinue = liabilityChecked && aiChecked && termsChecked && hasScrolled;

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
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gold/15 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-gold-hl" />
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
                Affairs. VCS is not a VA-accredited representative, attorney,
                claims agent, or VSO as defined under 38 U.S.C. &sect;&sect; 5901-5905
                and 38 C.F.R. Part 14. We do not file claims on your behalf.
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
              <h3 className="font-semibold text-foreground mb-2">AI-Assisted Features</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This app uses AI (Google Gemini) to assist with organizing
                claim information. AI output can be inaccurate or fabricated.
                Verify any legal citations using official sources before
                relying on them. You must independently verify all AI output
                before use.
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
                I understand this is an <span className="text-foreground font-medium">educational and organizational tool only</span>. It does not provide legal advice, medical advice, or VA-accredited representation, and it does not file claims on my behalf.
              </span>
            </label>

            <label
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors",
                hasScrolled
                  ? "bg-muted/50 hover:bg-muted"
                  : "bg-muted/20 cursor-not-allowed opacity-60"
              )}
              htmlFor="ai-consent"
            >
              <Checkbox
                id="ai-consent"
                checked={aiChecked}
                onCheckedChange={(checked) => setAiChecked(checked as boolean)}
                className="mt-0.5"
                disabled={!hasScrolled}
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I understand that <span className="text-foreground font-medium">AI-generated content may contain errors</span> and I am responsible for verifying all information before submitting to the VA.
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
                  to="/settings/terms"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/settings/privacy"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
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
                : "Please check all boxes to continue"
              }
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
