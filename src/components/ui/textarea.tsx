import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, maxLength, ...props }, ref) => {
  const value = typeof props.value === 'string' ? props.value : '';
  const showCounter = maxLength && value.length > maxLength * 0.8;

  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl px-4 py-3 text-base",
          "bg-muted/80 text-foreground",
          "border border-border/50",
          "placeholder:text-muted-foreground/50 placeholder:font-normal",
          "focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
          "focus:bg-muted focus:shadow-[0_0_0_4px_hsl(48_82%_59%/0.1)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200 ease-vcs resize-none",
          className
        )}
        ref={ref}
        maxLength={maxLength}
        {...props}
      />
      {showCounter && (
        <span
          className={cn(
            "absolute bottom-2 right-3 text-[10px] pointer-events-none",
            value.length >= maxLength ? "text-destructive font-medium" : "text-muted-foreground"
          )}
        >
          {value.length.toLocaleString()}/{maxLength.toLocaleString()}
        </span>
      )}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
