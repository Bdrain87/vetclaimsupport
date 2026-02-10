import { Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIDisclaimerProps {
  className?: string;
  variant?: 'inline' | 'banner' | 'caselaw';
}

export function AIDisclaimer({ className, variant = 'inline' }: AIDisclaimerProps) {
  if (variant === 'caselaw') {
    return (
      <div
        className={cn(
          'flex items-start gap-2 px-3 py-2.5 rounded-lg',
          'bg-amber-500/10 border border-amber-500/30',
          'text-amber-400',
          className
        )}
      >
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <p className="text-xs leading-relaxed font-medium">
          AI-GENERATED LEGAL CITATIONS — NOT VERIFIED. Case law references may be completely fabricated. You MUST verify every citation using official legal databases before relying on it. Submitting unverified citations may harm your claim.
        </p>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-[var(--color-accent-100)] border border-[var(--color-accent-200)]',
          'text-[var(--text-secondary)]',
          className
        )}
      >
        <Sparkles className="h-3.5 w-3.5 text-[var(--interactive-primary)] shrink-0" />
        <p className="text-xs leading-relaxed">
          AI-generated content (Google Gemini). May contain errors or fabricated information. You must verify all content before use. Not legal or medical advice.
        </p>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]',
        className
      )}
    >
      <Sparkles className="h-3 w-3 text-[var(--interactive-primary)]" />
      AI-generated content (Google Gemini). May contain errors or fabricated information. You must verify all content before use. Not legal or medical advice.
    </span>
  );
}
