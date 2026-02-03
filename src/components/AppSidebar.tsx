import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Stethoscope,
  AlertTriangle,
  Shield,
  Users,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Brain,
  Settings,
  Clock,
  ClipboardCheck,
  Heart,
  Wrench,
  Calculator,
  Search,
  Wand2,
  Route,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
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
}

// Grouped navigation items
const navGroups: NavGroup[] = [
  {
    label: 'Health',
    icon: Heart,
    defaultOpen: true,
    items: [
      { to: '/health-log', icon: Heart, label: 'Health Log' },
      { to: '/migraines', icon: Brain, label: 'Migraines' },
    ],
  },
  {
    label: 'Service History',
    icon: Shield,
    items: [
      { to: '/service-history', icon: Shield, label: 'Service Record' },
      { to: '/medical-visits', icon: Stethoscope, label: 'Medical Visits' },
      { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
      { to: '/timeline', icon: Clock, label: 'Timeline' },
    ],
  },
  {
    label: 'Claims',
    icon: ClipboardCheck,
    items: [
      { to: '/journey', icon: Route, label: 'Journey' },
      { to: '/buddy-statements', icon: Users, label: 'Buddy Statements' },
      { to: '/checklist', icon: ClipboardCheck, label: 'Checklist' },
    ],
  },
  {
    label: 'Tools',
    icon: Wrench,
    items: [
      { to: '/calculator', icon: Calculator, label: 'Calculator' },
      { to: '/claim-strategy', icon: Wand2, label: 'Strategy Wizard' },
      { to: '/secondary-finder', icon: Search, label: 'Secondary Finder' },
      { to: '/cp-exam-prep', icon: ClipboardCheck, label: 'C&P Exam Prep' },
    ],
  },
];

// Single-link navigation items (no submenu)
const singleNavItems: NavItem[] = [
  { to: '/docs', icon: FileText, label: 'Documents' },
];

// Bottom navigation items
const secondaryNavItems: NavItem[] = [
  { to: '/help', icon: HelpCircle, label: 'Help' },
  { to: '/reference', icon: BookOpen, label: 'Reference' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    navGroups.reduce((acc, group) => ({ ...acc, [group.label]: group.defaultOpen ?? false }), {})
  );
  const location = useLocation();

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => location.pathname === item.to);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r flex flex-col',
        'border-sidebar-border',
        'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
        // Premium gradient background
        'bg-gradient-to-b from-sidebar-background via-sidebar-background to-[hsl(220_20%_5%)]',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{
        boxShadow: 'inset -1px 0 0 hsl(var(--border) / 0.3), 4px 0 24px -4px hsl(0 0% 0% / 0.3)'
      }}
    >
      {/* Header with subtle gradient */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-sidebar-border/50 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent',
        collapsed && 'justify-center px-2'
      )}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 shadow-[0_0_24px_hsl(217_91%_60%/0.25)] transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 hover:shadow-[0_0_32px_hsl(217_91%_60%/0.35)]">
          <ShieldCheck className="h-5 w-5 text-primary drop-shadow-[0_0_8px_hsl(217_91%_60%/0.5)]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="font-semibold text-foreground text-sm tracking-tight">Vet Claim</span>
            <span className="text-xs text-sidebar-muted font-medium">Support</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {/* Dashboard - Always visible at top */}
        <div className="px-2 mb-2">
          <NavLink
            to="/"
            className={cn(
              'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
              'transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-1',
              'min-h-[44px]',
              location.pathname === '/' && 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20',
              collapsed && 'justify-center px-2 hover:translate-x-0'
            )}
            title={collapsed ? 'Dashboard' : undefined}
          >
            {location.pathname === '/' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-primary to-primary/60 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
            )}
            <LayoutDashboard className={cn('h-5 w-5 flex-shrink-0 transition-transform duration-200', location.pathname === '/' && 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]')} />
            {!collapsed && <span className="font-semibold">Dashboard</span>}
          </NavLink>

          {/* Single-link navigation items (no submenu) */}
          {singleNavItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium mt-1',
                  'transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
                  'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-1',
                  'min-h-[44px]',
                  isActive && 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20',
                  collapsed && 'justify-center px-2 hover:translate-x-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-primary to-primary/60 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                )}
                <item.icon className={cn('h-5 w-5 flex-shrink-0 transition-transform duration-200', isActive && 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]')} />
                {!collapsed && <span className="font-semibold">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Grouped Navigation */}
        <div className="space-y-1 px-2">
          {navGroups.map((group) => {
            const isActive = isGroupActive(group);
            const isOpen = openGroups[group.label];

            if (collapsed) {
              // When collapsed, show only group icon that links to first item
              return (
                <NavLink
                  key={group.label}
                  to={group.items[0].to}
                  className={cn(
                    'flex items-center justify-center rounded-xl px-2 py-2.5 min-h-[44px]',
                    'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                    'transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
                    'hover:scale-105',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                  title={group.label}
                >
                  <group.icon className={cn('h-5 w-5 transition-transform duration-200', isActive && 'text-primary')} />
                </NavLink>
              );
            }

            return (
              <Collapsible
                key={group.label}
                open={isOpen}
                onOpenChange={() => toggleGroup(group.label)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium',
                    'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                    'transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] min-h-[44px]',
                    'hover:translate-x-1',
                    isActive && 'text-primary'
                  )}>
                    <div className="flex items-center gap-3">
                      <group.icon className={cn('h-5 w-5 flex-shrink-0 transition-transform duration-200', isActive && 'text-primary')} />
                      <span>{group.label}</span>
                    </div>
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]',
                      isOpen && 'rotate-180'
                    )} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1 animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <ul className="space-y-0.5 pl-4 border-l border-sidebar-border ml-5">
                    {group.items.map((item, index) => {
                      const isItemActive = location.pathname === item.to;
                      return (
                        <li key={item.to} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                          <NavLink
                            to={item.to}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                              'transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
                              'hover:translate-x-1',
                              isItemActive && 'bg-gradient-to-r from-primary/15 to-transparent text-primary font-medium border-l-2 border-primary'
                            )}
                          >
                            <item.icon className={cn('h-4 w-4 flex-shrink-0 transition-transform duration-200', isItemActive && 'text-primary drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]')} />
                            <span>{item.label}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="mt-3 pt-3 border-t border-sidebar-border mx-2">
          <ul className="space-y-0.5">
            {secondaryNavItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                      'transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
                      'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-1',
                      'min-h-[44px]',
                      isActive && 'bg-primary/10 text-primary',
                      collapsed && 'justify-center px-2 hover:translate-x-0 hover:scale-105'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full transition-all duration-200" />
                    )}
                    <item.icon className={cn('h-5 w-5 flex-shrink-0 transition-transform duration-200', isActive && 'text-primary')} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2 space-y-2">
        <div className={cn(
          'flex items-center',
          collapsed ? 'justify-center' : 'justify-between px-2'
        )}>
          {!collapsed && (
            <span className="text-xs text-sidebar-muted">Theme</span>
          )}
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground min-h-[44px]',
            collapsed && 'px-2'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
