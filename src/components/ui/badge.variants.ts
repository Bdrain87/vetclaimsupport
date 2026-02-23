import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: [
          "border-0 bg-primary/15 text-primary",
          "shadow-[inset_0_0_0_1px_hsl(48_82%_59%/0.2)]",
        ],
        secondary: [
          "border-0 bg-black/10 dark:bg-white/10 text-foreground",
          "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]",
        ],
        destructive: [
          "border-0 bg-destructive/15 text-destructive",
          "shadow-[inset_0_0_0_1px_hsl(0_100%_60%/0.2)]",
        ],
        outline: [
          "bg-transparent text-foreground",
          "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]",
        ],
        success: [
          "border-0 bg-success/15 text-success",
          "shadow-[inset_0_0_0_1px_hsl(142_76%_46%/0.2)]",
        ],
        warning: [
          "border-0 bg-warning/15 text-warning",
          "shadow-[inset_0_0_0_1px_hsl(35_100%_55%/0.2)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
