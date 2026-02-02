import { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Menu, X, LayoutDashboard, Activity, Brain, Moon, Pill, Shield, AlertTriangle, Stethoscope, FileArchive, FileCheck, Users, Clock, Wrench, ClipboardCheck, Briefcase, BookOpen, Settings, Heart, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

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
  '/claim-documents': 'Claim Documents',
  '/evidence-library': 'Evidence Library',
  '/evidence-docs': 'Evidence & Docs',
  '/buddy-contacts': 'Buddy Contacts',
  '/timeline': 'Timeline',
  '/checklist': 'Checklist',
  '/claim-tools': 'Claim Tools',
  '/exam-prep': 'C&P Exam Prep',
  '/reference': 'Reference',
  '/settings': 'Settings',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
};

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/symptoms', icon: Activity, label: 'Symptoms' },
  { to: '/migraines', icon: Brain, label: 'Migraines' },
  { to: '/sleep', icon: Moon, label: 'Sleep' },
  { to: '/medications', icon: Pill, label: 'Medications' },
  { to: '/service-history', icon: Shield, label: 'Service History' },
  { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
  { to: '/medical-visits', icon: Stethoscope, label: 'Medical Visits' },
  { to: '/evidence-docs', icon: FolderOpen, label: 'Evidence & Docs' },
  { to: '/claim-documents', icon: FolderOpen, label: 'Claim Documents' },
  { to: '/evidence-library', icon: FileArchive, label: 'Evidence Library' },
  { to: '/documents', icon: FileCheck, label: 'Documents Checklist' },
  { to: '/buddy-contacts', icon: Users, label: 'Buddy Contacts' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/claim-tools', icon: Wrench, label: 'Claim Tools' },
  { to: '/checklist', icon: ClipboardCheck, label: 'Checklist' },
  { to: '/exam-prep', icon: Briefcase, label: 'C&P Exam Prep' },
  { to: '/reference', icon: BookOpen, label: 'Reference' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [open, setOpen] = useState(false);
  
  const pageLabel = pageLabels[location.pathname] || 'Vet Claim Support';

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
      <div className="flex items-center justify-between px-3 h-14">
        {/* Left side - Hamburger Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-12 w-12 min-h-[48px] min-w-[48px] p-0"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              {/* Sheet Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground text-sm">Vet Claim Support</span>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-2">
                <ul className="space-y-0.5 px-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm min-h-[44px]',
                            'text-foreground hover:bg-muted transition-colors',
                            isActive && 'bg-primary/10 text-primary font-medium'
                          )}
                        >
                          <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive && 'text-primary')} />
                          <span>{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              
              {/* Theme Toggle */}
              <div className="border-t p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Center - Title */}
        <div className="flex items-center gap-2">
          {isHome ? (
            <>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-sm">Vet Claim Support</span>
            </>
          ) : (
            <span className="font-semibold text-foreground text-sm truncate max-w-[180px]">
              {pageLabel}
            </span>
          )}
        </div>

        {/* Right side - Back or Theme */}
        <div className="flex items-center">
          {!isHome ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-12 w-12 min-h-[48px] min-w-[48px] p-0"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <ThemeToggle />
          )}
        </div>
      </div>
    </header>
  );
}