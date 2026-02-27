import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldAlert } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const LIABILITY_ACCEPTED_KEY = 'liabilityAccepted';
const TERMS_VERSION = '1.2';

export function LiabilityAcceptanceScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Check localStorage first (fast), then Supabase (authoritative)
    const localAccepted = localStorage.getItem(LIABILITY_ACCEPTED_KEY);
    if (localAccepted) return; // Already accepted locally

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.user_metadata?.liability_accepted) {
          // They accepted before — restore localStorage and skip modal
          localStorage.setItem(LIABILITY_ACCEPTED_KEY, 'true');
          return;
        }
      } catch {
        // Fall through to show modal
      }
      setIsOpen(true);
    })();
  }, []);

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
          // Save to user metadata so it persists across sign-outs
          await supabase.auth.updateUser({
            data: { liability_accepted: true, liability_accepted_at: timestamp, liability_terms_version: TERMS_VERSION },
          });
          // Also log to consent_log table
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

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-describedby="liability-description"
      >
        <VisuallyHidden.Root>
          <DialogTitle>Terms Acceptance</DialogTitle>
          <DialogDescription id="liability-description">
            Please acknowledge the terms before using Vet Claim Support
          </DialogDescription>
        </VisuallyHidden.Root>

        <div className="p-6 space-y-5">
          {/* Icon & Title */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gold/15 flex items-center justify-center">
              <ShieldAlert className="h-7 w-7 text-gold-hl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Before You Begin</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Vet Claim Support is an educational and organizational tool.
              </p>
            </div>
          </div>

          {/* Key points — concise list */}
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="text-muted-foreground/60 mt-0.5 shrink-0">&bull;</span>
              Not affiliated with the VA. Not legal or medical advice.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-muted-foreground/60 mt-0.5 shrink-0">&bull;</span>
              AI features may produce errors — verify before submitting anything.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-muted-foreground/60 mt-0.5 shrink-0">&bull;</span>
              No guaranteed outcomes. All claim decisions are made by the VA.
            </li>
          </ul>

          {/* Single checkbox */}
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors",
              "bg-muted/50 hover:bg-muted"
            )}
            htmlFor="accept-terms"
          >
            <Checkbox
              id="accept-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-0.5"
            />
            <span className="text-sm text-muted-foreground leading-relaxed">
              I understand and agree to the{' '}
              <a
                href="/settings/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/settings/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>.
            </span>
          </label>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!accepted}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
