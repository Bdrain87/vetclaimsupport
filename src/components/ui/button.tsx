import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground rounded-xl",
          "shadow-[0_2px_8px_hsl(211_100%_50%/0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "hover:brightness-110 hover:shadow-[0_4px_16px_hsl(211_100%_50%/0.4)]",
          "active:scale-[0.97] active:brightness-95",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground rounded-xl",
          "shadow-[0_2px_8px_hsl(0_100%_60%/0.3)]",
          "hover:brightness-110 active:scale-[0.97]",
        ],
        outline: [
          "border border-white/10 bg-transparent rounded-xl",
          "hover:bg-white/5 hover:border-white/20",
          "active:scale-[0.97] active:bg-white/10",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground rounded-xl",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
          "hover:bg-white/10 active:scale-[0.97]",
        ],
        ghost: [
          "rounded-xl",
          "hover:bg-white/5 hover:text-foreground",
          "active:scale-[0.97] active:bg-white/10",
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