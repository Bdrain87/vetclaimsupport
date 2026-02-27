import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIDisclaimerProps {
  className?: string;
  variant?: 'inline' | 'banner';
}

export function AIDisclaimer({ className, variant = 'inline' }: AIDisclaimerProps) {
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
          AI-assisted — verify all content before use.
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
      AI-assisted — verify before use.
    </span>
  );
}
