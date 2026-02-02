import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border-0 px-4 py-3 text-base",
        "bg-muted text-foreground",
        "ring-1 ring-inset ring-border",
        "placeholder:text-muted-foreground/60 placeholder:font-normal",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:bg-muted/80 focus:shadow-[0_0_0_4px_hsl(211_100%_50%/0.1)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };