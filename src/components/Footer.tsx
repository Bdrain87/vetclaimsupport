import * as React from 'react';
import { Link } from 'react-router-dom';

export const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <footer 
        ref={ref}
        className={`mt-auto border-t border-border bg-muted/30 py-6 safe-area-bottom ${className || ''}`}
        {...props}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 safe-area-x">
          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-4xl mx-auto">
            This app is an organizational tool only. It does not provide medical, legal, or VA claims advice. 
            Always consult with a healthcare provider, VA-accredited attorney, or Veterans Service Organization (VSO) 
            before making decisions about your health or benefits.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link 
              to="/privacy" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline min-h-[44px] flex items-center"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              to="/terms" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline min-h-[44px] flex items-center"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = 'Footer';
