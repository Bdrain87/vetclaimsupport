import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Stethoscope,
  AlertTriangle,
  Activity,
  Pill,
  Shield,
  Users,
  FileCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Brain,
  Moon,
  Settings,
  Clock,
  ClipboardCheck,
  Heart,
  Briefcase,
  Wrench,
  FileArchive,
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

const navGroups: NavGroup[] = [
  {
    label: 'Health Logs',
    icon: Heart,
    defaultOpen: true,
    items: [
      { to: '/symptoms', icon: Activity, label: 'Symptoms' },
      { to: '/migraines', icon: Brain, label: 'Migraines' },
      { to: '/sleep', icon: Moon, label: 'Sleep' },
      { to: '/medications', icon: Pill, label: 'Medications' },
    ],
  },
  {
    label: 'Service Record',
    icon: Shield,
    items: [
      { to: '/service-history', icon: Shield, label: 'Service History' },
      { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
      { to: '/medical-visits', icon: Stethoscope, label: 'Medical Visits' },
    ],
  },
  {
    label: 'Evidence & Docs',
    icon: FileCheck,
    items: [
      { to: '/evidence-library', icon: FileArchive, label: 'Evidence Library' },
      { to: '/documents', icon: FileCheck, label: 'Documents Checklist' },
      { to: '/buddy-contacts', icon: Users, label: 'Buddy Contacts' },
      { to: '/timeline', icon: Clock, label: 'Timeline' },
    ],
  },
  {
    label: 'Claim Tools',
    icon: Wrench,
    items: [
      { to: '/claim-tools', icon: Wrench, label: 'All Tools' },
      { to: '/checklist', icon: ClipboardCheck, label: 'Checklist' },
      { to: '/exam-prep', icon: Briefcase, label: 'C&P Exam Prep' },
    ],
  },
];

const secondaryNavItems: NavItem[] = [
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
        'fixed left-0 top-0 z-40 h-screen border-r transition-all duration-300 flex flex-col',
        'bg-sidebar-background border-sidebar-border',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-sidebar-border',
        collapsed && 'justify-center px-2'
      )}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 shadow-[0_0_20px_hsl(211_100%_50%/0.2)]">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm tracking-tight">Service Evidence</span>
            <span className="text-xs text-sidebar-muted">Tracker</span>
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
              'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
              'min-h-[44px]',
              location.pathname === '/' && 'bg-primary/10 text-primary',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Dashboard' : undefined}
          >
            {location.pathname === '/' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
            <LayoutDashboard className={cn('h-5 w-5 flex-shrink-0', location.pathname === '/' && 'text-primary')} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
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
                    'transition-all duration-150',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                  title={group.label}
                >
                  <group.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
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
                    'transition-all duration-150 min-h-[44px]',
                    isActive && 'text-primary'
                  )}>
                    <div className="flex items-center gap-3">
                      <group.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                      <span>{group.label}</span>
                    </div>
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1">
                  <ul className="space-y-0.5 pl-4 border-l border-sidebar-border ml-5">
                    {group.items.map((item) => {
                      const isItemActive = location.pathname === item.to;
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                              'transition-all duration-150',
                              isItemActive && 'bg-primary/10 text-primary font-medium'
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
                      'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                      'min-h-[44px]',
                      isActive && 'bg-primary/10 text-primary',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
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
