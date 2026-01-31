import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/service-history': 'Service History',
  '/medical-visits': 'Medical Visits',
  '/medications': 'Medications',
  '/symptoms': 'Symptoms Journal',
  '/exposures': 'Exposures',
  '/migraines': 'Migraine Tracker',
  '/sleep': 'Sleep Tracker',
  '/documents': 'Documents',
  '/buddy-contacts': 'Buddy Contacts',
  '/timeline': 'Timeline',
  '/checklist': 'Claim Checklist',
  '/reference': 'Reference Guide',
  '/settings': 'Settings',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
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
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border safe-area-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left side - Back button or Logo */}
        <div className="flex items-center gap-2">
          {isHome ? (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sidebar-accent-foreground text-sm">Evidence Tracker</span>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent touch-target"
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <span className="font-semibold text-sidebar-accent-foreground text-sm truncate max-w-[200px]">
                {pageLabel}
              </span>
            </>
          )}
        </div>

        {/* Right side - Theme toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
