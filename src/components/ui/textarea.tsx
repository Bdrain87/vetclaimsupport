import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border-0 px-4 py-3 text-base",
        "bg-white/[0.06] text-foreground",
        "ring-1 ring-inset ring-white/10",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-150 resize-none",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };