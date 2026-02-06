import { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Menu,
  LayoutDashboard,
  Shield,
  AlertTriangle,
  Stethoscope,
  Users,
  FileText,
  Clock,
  ClipboardCheck,
  Heart,
  Wrench,
  Calculator,
  Search,
  Wand2,
  Route,
  HelpCircle,
  Settings,
  Star,
  Files,
  Activity,
  Brain,
  FileSignature,
  ClipboardList,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
  defaultOpen?: boolean;
  premium?: boolean;
  alwaysOpen?: boolean;
}

// Same navigation structure as desktop AppSidebar
const premiumToolsGroup: NavGroup = {
  label: 'Claim Tools',
  icon: Wrench,
  premium: true,
  alwaysOpen: true,
  defaultOpen: true,
  items: [
    { to: '/calculator', icon: Calculator, label: 'Rating Calculator' },
    { to: '/secondary-finder', icon: Search, label: 'Secondary Finder' },
    { to: '/nexus-letter', icon: FileSignature, label: 'Nexus Letter Generator' },
    { to: '/dbq-prep', icon: ClipboardList, label: 'DBQ Prep Sheet' },
    { to: '/claim-strategy', icon: Wand2, label: 'Strategy Wizard' },
    { to: '/cp-exam-prep', icon: ClipboardCheck, label: 'C&P Exam Prep' },
  ],
};

const navGroups: NavGroup[] = [
  {
    label: 'My Claim',
    icon: FileText,
    defaultOpen: true,
    items: [
      { to: '/claim-journey', icon: Route, label: 'Journey' },
      { to: '/documents', icon: Files, label: 'Documents' },
      { to: '/claim-checklist', icon: ClipboardCheck, label: 'Checklist' },
    ],
  },
  {
    label: 'Service History',
    icon: Shield,
    defaultOpen: false,
    items: [
      { to: '/service-history', icon: Shield, label: 'Service Record' },
      { to: '/medical-visits', icon: Stethoscope, label: 'Medical Visits' },
      { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
      { to: '/timeline', icon: Clock, label: 'Timeline' },
    ],
  },
  {
    label: 'Health Tracking',
    icon: Heart,
    defaultOpen: false,
    items: [
      { to: '/health-log', icon: Activity, label: 'Daily Log' },
      { to: '/migraines', icon: Brain, label: 'Migraines' },
    ],
  },
];

const singleNavItems: NavItem[] = [
  { to: '/buddy-statements', icon: Users, label: 'Buddy Statements' },
];

const secondaryNavItems: NavItem[] = [
  { to: '/help', icon: HelpCircle, label: 'Help Center' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/calculator': 'Rating Calculator',
  '/secondary-finder': 'Secondary Finder',
  '/nexus-letter': 'Nexus Letter Generator',
  '/dbq-prep': 'DBQ Prep Sheet',
  '/claim-strategy': 'Strategy Wizard',
  '/cp-exam-prep': 'C&P Exam Prep',
  '/claim-journey': 'Journey',
  '/documents': 'Documents',
  '/claim-checklist': 'Checklist',
  '/service-history': 'Service History',
  '/medical-visits': 'Medical Visits',
  '/exposures': 'Exposures',
  '/timeline': 'Timeline',
  '/health-log': 'Daily Log',
  '/migraines': 'Migraines',
  '/buddy-statements': 'Buddy Statements',
  '/help': 'Help Center',
  '/settings': 'Settings',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
};

export function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [open, setOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = { [premiumToolsGroup.label]: true };
    navGroups.forEach(group => {
      initial[group.label] = group.defaultOpen ?? false;
    });
    return initial;
  });

  const pageLabel = pageLabels[location.pathname] || 'Vet Claim Support';

  const handleBack = () => {
    navigate('/');
  };

  const toggleGroup = (label: string, alwaysOpen?: boolean) => {
    if (alwaysOpen) return;
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => location.pathname === item.to);
  };

  const renderNavGroup = (group: NavGroup, isPremium = false) => {
    const isActive = isGroupActive(group);
    const isOpen = openGroups[group.label];

    return (
      <Collapsible
        key={group.label}
        open={isOpen}
        onOpenChange={() => toggleGroup(group.label, group.alwaysOpen)}
      >
        <CollapsibleTrigger className="w-full">
          <div className={cn(
            'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium',
            'text-foreground hover:bg-muted',
            'transition-all duration-200 min-h-[44px]',
            isActive && 'text-primary',
            isPremium && 'text-primary font-semibold'
          )}>
            <div className="flex items-center gap-3">
              <group.icon className={cn('h-5 w-5 flex-shrink-0', (isActive || isPremium) && 'text-primary')} />
              <span>{group.label}</span>
            </div>
            {!group.alwaysOpen && (
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180'
              )} />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1">
          <ul className="space-y-0.5 pl-4 border-l border-border ml-5">
            {group.items.map((item) => {
              const isItemActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm min-h-[44px]',
                      'text-foreground hover:bg-muted transition-colors',
                      isItemActive && 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4 flex-shrink-0', isItemActive && 'text-primary')} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );
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
          <SheetContent side="left" className="w-[300px] p-0 overflow-hidden">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col h-full">
              {/* Sheet Header */}
              <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 shadow-[0_0_24px_hsl(217_91%_60%/0.25)]">
                  <ShieldCheck className="h-5 w-5 text-primary drop-shadow-[0_0_8px_hsl(217_91%_60%/0.5)]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-sm tracking-tight">Vet Claim</span>
                  <span className="text-xs text-muted-foreground font-medium">Support</span>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
                {/* Dashboard */}
                <div className="px-2 mb-3">
                  <NavLink
                    to="/"
                    onClick={() => setOpen(false)}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                      'transition-all duration-200',
                      'text-foreground hover:bg-muted',
                      'min-h-[44px]',
                      location.pathname === '/' && 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20'
                    )}
                  >
                    {location.pathname === '/' && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-primary to-primary/60 rounded-r-full" />
                    )}
                    <LayoutDashboard className={cn('h-5 w-5 flex-shrink-0', location.pathname === '/' && 'text-primary')} />
                    <span className="font-semibold">Dashboard</span>
                  </NavLink>
                </div>

                {/* PREMIUM TOOLS SECTION */}
                <div className="mx-2 mb-3 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 mb-1">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Premium Tools</span>
                  </div>
                  {renderNavGroup(premiumToolsGroup, true)}
                </div>

                {/* Regular Navigation Groups */}
                <div className="space-y-1 px-2">
                  {navGroups.map((group) => renderNavGroup(group))}
                </div>

                {/* Single Link Items */}
                <div className="mt-2 px-2 space-y-1">
                  {singleNavItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                          'transition-all duration-200',
                          'text-foreground hover:bg-muted',
                          'min-h-[44px]',
                          isActive && 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20'
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-primary to-primary/60 rounded-r-full" />
                        )}
                        <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>

                {/* Secondary Navigation */}
                <div className="mt-3 pt-3 border-t border-border mx-2">
                  <ul className="space-y-0.5">
                    {secondaryNavItems.map((item) => {
                      const isActive = location.pathname === item.to;
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            onClick={() => setOpen(false)}
                            className={cn(
                              'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                              'transition-all duration-200',
                              'text-foreground hover:bg-muted',
                              'min-h-[44px]',
                              isActive && 'bg-primary/10 text-primary'
                            )}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                            )}
                            <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                            <span>{item.label}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
