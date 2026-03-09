import { useState } from 'react';
import { AlertTriangle, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerNoticeProps {
  variant?: 'inline' | 'card' | 'subtle';
  className?: string;
  dismissible?: boolean;
}

export function DisclaimerNotice({ variant = 'inline', className, dismissible = false }: DisclaimerNoticeProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (variant === 'subtle') {
    return (
      <p className={cn(
        "text-xs text-muted-foreground/70 text-center",
        className
      )}>
        For educational purposes only. Not medical, legal, or VA advice.
      </p>
    );
  }

  if (dismissible && acknowledged) {
    return (
      <button
        onClick={() => setAcknowledged(false)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors w-full",
          className
        )}
      >
        <Info className="h-3 w-3 shrink-0" />
        <span>Educational tool only — not advice.</span>
        <ChevronDown className="h-3 w-3 ml-auto shrink-0" />
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        "p-3 rounded-lg bg-gold/10 border border-gold/20",
        className
      )}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-gold mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground flex-1 min-w-0">
            <p className="font-medium text-foreground mb-1">Educational Tools Only</p>
            <p>
              This information is for educational purposes only and is not medical, legal, or VA advice. 
              Consult a healthcare provider, attorney, or accredited VSO before making decisions about your claim.
            </p>
            {dismissible && (
              <button
                onClick={() => setAcknowledged(true)}
                className="mt-2 px-3 py-1.5 rounded-md bg-gold/20 text-foreground text-xs font-medium hover:bg-gold/30 transition-colors"
              >
                I Acknowledge
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border",
      className
    )}>
      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <p className="text-xs text-muted-foreground flex-1 min-w-0">
        Educational tool only — not medical, legal, or VA advice.
      </p>
      {dismissible && (
        <button
          onClick={() => setAcknowledged(true)}
          className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground hover:bg-muted/80 transition-colors shrink-0"
        >
          OK
        </button>
      )}
    </div>
  );
}
