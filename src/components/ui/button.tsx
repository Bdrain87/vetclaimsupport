import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground rounded-xl",
          "shadow-[0_2px_8px_hsl(211_100%_50%/0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:brightness-110 hover:shadow-[0_4px_16px_hsl(211_100%_50%/0.4)] hover:translate-y-[-1px]",
          "active:scale-[0.97] active:brightness-95 active:translate-y-0",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground rounded-xl",
          "shadow-[0_2px_8px_hsl(0_100%_60%/0.3)]",
          "hover:brightness-110 hover:translate-y-[-1px]",
          "active:scale-[0.97] active:translate-y-0",
        ],
        outline: [
          "border border-border bg-transparent rounded-xl",
          "hover:bg-muted hover:border-border hover:translate-y-[-1px]",
          "active:scale-[0.97] active:bg-muted active:translate-y-0",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground rounded-xl",
          "hover:bg-muted hover:translate-y-[-1px]",
          "active:scale-[0.97] active:translate-y-0",
        ],
        ghost: [
          "rounded-xl",
          "hover:bg-muted hover:text-foreground",
          "active:scale-[0.97] active:bg-muted",
        ],
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 min-h-[48px] px-5 py-3",
        sm: "h-10 min-h-[44px] rounded-xl px-4",
        lg: "h-14 min-h-[56px] rounded-xl px-8 text-base",
        icon: "h-12 w-12 min-h-[48px] min-w-[48px] rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };