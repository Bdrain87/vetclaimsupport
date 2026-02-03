import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerNoticeProps {
  variant?: 'inline' | 'card' | 'subtle';
  className?: string;
}

export function DisclaimerNotice({ variant = 'inline', className }: DisclaimerNoticeProps) {
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

  if (variant === 'card') {
    return (
      <div className={cn(
        "p-3 rounded-lg bg-warning/10 border border-warning/20",
        className
      )}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Educational Tools Only</p>
            <p>
              This information is for educational purposes only and is not medical, legal, or VA advice. 
              Consult a healthcare provider, attorney, or accredited VSO before making decisions about your claim.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border",
      className
    )}>
      <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      <p className="text-xs text-muted-foreground">
        Educational tool only — not medical, legal, or VA advice.
      </p>
    </div>
  );
}
