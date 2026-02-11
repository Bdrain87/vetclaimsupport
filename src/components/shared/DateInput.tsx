import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

/**
 * Standardized date input component.
 * Uses native HTML5 date picker with consistent styling across the app.
 * Format: YYYY-MM-DD (ISO 8601) internally, displayed as MM/DD/YYYY by the browser.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        className={cn('h-10', className)}
        {...props}
      />
    );
  }
);

DateInput.displayName = 'DateInput';
