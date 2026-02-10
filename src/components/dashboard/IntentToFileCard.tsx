import { useState, useEffect } from 'react';
import { Lightbulb, X, ExternalLink, Clock, Flag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DISMISSED_KEY = 'intentToFileDismissed';
const DISMISSED_AT_KEY = 'intentToFileDismissedAt';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function IntentToFileCard() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISSED_AT_KEY);

    if (!dismissedAt) {
      // Never dismissed
      setIsDismissed(false);
      return;
    }

    const dismissedTime = parseInt(dismissedAt, 10);
    const now = Date.now();

    // Show again after 30 days
    if (now - dismissedTime >= THIRTY_DAYS_MS) {
      localStorage.removeItem(DISMISSED_KEY);
      localStorage.removeItem(DISMISSED_AT_KEY);
      setIsDismissed(false);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true');
      localStorage.setItem(DISMISSED_AT_KEY, Date.now().toString());
    } catch {
      // Storage full or unavailable
    }
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-blue-500/10",
      "border-2 border-blue-500/30",
      "shadow-lg shadow-blue-500/10"
    )}>
      {/* Animated accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-blue-500" />

      <CardContent className="pt-4 pb-4 pl-6 pr-4">
        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-blue-500/10"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-4 pr-8">
          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Flag className="h-6 w-6 text-blue-500" />
            </div>
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full scale-150 -z-10" />
          </div>

          <div className="space-y-2 flex-1">
            {/* Header */}
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-base sm:text-lg">
                Pro Tip: File an Intent to File First!
              </h3>
              <Lightbulb className="h-5 w-5 text-blue-500 flex-shrink-0" />
            </div>

            {/* Content */}
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>
                Filing an <strong className="text-foreground">Intent to File (ITF)</strong> protects
                your effective date for <strong className="text-blue-600 dark:text-blue-400">up to 1 year</strong> while
                you gather evidence.
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>This could mean <strong className="text-blue-600 dark:text-blue-400">thousands in back pay</strong> if approved.</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://www.va.gov/disability/how-to-file-claim/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="h-9 gap-2 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-500/90 hover:to-blue-500/90 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  File Intent to File
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
              <a
                href="https://www.va.gov/resources/your-intent-to-file-a-va-claim/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
