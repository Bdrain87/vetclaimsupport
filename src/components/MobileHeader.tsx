import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/service-history': 'Service History',
  '/medical-visits': 'Medical Visits',
  '/medications': 'Medications',
  '/symptoms': 'Symptoms',
  '/exposures': 'Exposures',
  '/migraines': 'Migraines',
  '/sleep': 'Sleep',
  '/documents': 'Documents',
  '/buddy-contacts': 'Buddy Contacts',
  '/timeline': 'Timeline',
  '/checklist': 'Checklist',
  '/reference': 'Reference',
  '/settings': 'Settings',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
};

export function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  
  const pageLabel = pageLabels[location.pathname] || 'Evidence Tracker';

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header className={cn(
      "md:hidden fixed top-0 left-0 right-0 z-50",
      "bg-background/80 backdrop-blur-xl",
      "border-b border-border",
      "safe-area-top"
    )}>
      <div className="flex items-center justify-between px-4 h-12">
        {/* Left side */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isHome ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-sm">Evidence Tracker</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-9 px-2 text-primary hover:bg-muted"
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Back</span>
              </Button>
            </div>
          )}
        </div>

        {/* Center - Title (only on subpages) */}
        {!isHome && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="font-semibold text-foreground text-sm">
              {pageLabel}
            </span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}