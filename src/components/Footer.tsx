import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <footer 
        ref={ref}
        className={cn(
          "mt-auto py-6 safe-area-bottom",
          "border-t border-border",
          "bg-background",
          className
        )}
        {...props}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 safe-area-x">
          <p className="text-xs text-muted-foreground/70 text-center leading-relaxed max-w-3xl mx-auto">
            This app is an organizational tool only. Not medical, legal, or VA advice.
            Consult a healthcare provider, attorney, or VSO before making decisions.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link 
              to="/privacy" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              Privacy
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <Link 
              to="/terms" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = 'Footer';