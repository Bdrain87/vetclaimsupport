import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 min-h-[48px] w-full max-w-full rounded-xl px-4 py-3 text-base box-border",
          "bg-muted/80 text-foreground",
          "border border-border/50",
          "placeholder:text-muted-foreground/50 placeholder:font-normal",
          "focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
          "focus:bg-muted focus:shadow-[0_0_0_4px_hsl(43_63%_54%/0.1)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200 ease-vcs",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };