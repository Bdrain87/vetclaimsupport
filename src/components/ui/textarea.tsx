import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl px-4 py-3 text-base",
        "bg-muted/80 text-foreground",
        "border border-border/50",
        "placeholder:text-muted-foreground/50 placeholder:font-normal",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
        "focus:bg-muted focus:shadow-[0_0_0_4px_hsl(43_64%_60%/0.1)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200 ease-vcs resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };