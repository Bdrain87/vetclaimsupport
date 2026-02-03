import * as React from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: 'lift' | 'glow' | 'border' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant = 'default', hover = 'lift', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'relative rounded-2xl transition-all duration-300 ease-out overflow-hidden';

    const variantStyles = {
      default: 'bg-card border border-border/50 shadow-sm',
      glass: 'bg-card/80 backdrop-blur-xl border border-white/10 shadow-lg',
      gradient: 'bg-gradient-to-br from-card via-card to-card/80 border border-border/30 shadow-md',
      elevated: 'bg-card shadow-xl shadow-black/5 border-0',
    };

    const hoverStyles = {
      lift: 'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 active:translate-y-0 active:shadow-md',
      glow: 'hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30',
      border: 'hover:border-primary/50',
      none: '',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          hoverStyles[hover],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PremiumCard.displayName = 'PremiumCard';

// Premium Card Header
interface PremiumCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const PremiumCardHeader = React.forwardRef<HTMLDivElement, PremiumCardHeaderProps>(
  ({ className, icon, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start gap-4 mb-4', className)}
        {...props}
      >
        {icon && (
          <div className="flex-shrink-0 p-2.5 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">{children}</div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);
PremiumCardHeader.displayName = 'PremiumCardHeader';

// Premium Card Title
const PremiumCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold tracking-tight text-foreground', className)}
    {...props}
  />
));
PremiumCardTitle.displayName = 'PremiumCardTitle';

// Premium Card Description
const PremiumCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground mt-1', className)}
    {...props}
  />
));
PremiumCardDescription.displayName = 'PremiumCardDescription';

// Premium Card Content
const PremiumCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
PremiumCardContent.displayName = 'PremiumCardContent';

// Premium Card Footer
const PremiumCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3 mt-6 pt-4 border-t border-border/50', className)}
    {...props}
  />
));
PremiumCardFooter.displayName = 'PremiumCardFooter';

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
  PremiumCardFooter,
};
