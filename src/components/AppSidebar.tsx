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
  Calculator,
  Search,
  Wand2,
  Route,
  HelpCircle,
  Files,
  FileSignature,
  ClipboardList,
  Calendar,
  Moon,
  Pill,
  Activity,
  FolderOpen,
  Bookmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSidebarStore } from '@/store/useSidebarStore';

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
    label: 'Tools',
    icon: Calculator,
    defaultOpen: true,
    items: [
      { to: '/claims/calculator', icon: Calculator, label: 'Rating Calculator' },
      { to: '/claims/secondary-finder', icon: Search, label: 'Secondary Finder' },
      { to: '/claims/strategy', icon: Wand2, label: 'Strategy Wizard' },
      { to: '/prep/exam', icon: ClipboardCheck, label: 'C&P Exam Prep' },
      { to: '/prep/nexus-letter', icon: FileSignature, label: 'Doctor Summary' },
      { to: '/prep/dbq', icon: ClipboardList, label: 'DBQ Prep' },
      { to: '/claims/body-map', icon: Activity, label: 'Body Map' },
    ],
  },
  {
    label: 'My Claim',
    icon: FolderOpen,
    defaultOpen: true,
    items: [
      { to: '/claims', icon: FileText, label: 'Conditions' },
      { to: '/claims/checklist', icon: ClipboardCheck, label: 'Checklist' },
      { to: '/settings/journey', icon: Route, label: 'Journey' },
      { to: '/settings/vault', icon: Files, label: 'Documents' },
      { to: '/prep/buddy-statement', icon: Users, label: 'Buddy Statements' },
    ],
  },
  {
    label: 'Health',
    icon: Heart,
    defaultOpen: false,
    items: [
      { to: '/health/summary', icon: Calendar, label: 'Daily Log' },
      { to: '/health/symptoms', icon: FileText, label: 'Symptoms' },
      { to: '/health/sleep', icon: Moon, label: 'Sleep' },
      { to: '/health/migraines', icon: Brain, label: 'Migraines' },
      { to: '/health/medications', icon: Pill, label: 'Medications' },
      { to: '/health/visits', icon: Stethoscope, label: 'Medical Visits' },
      { to: '/health/exposures', icon: AlertTriangle, label: 'Exposures' },
    ],
  },
  {
    label: 'Service & Reference',
    icon: Shield,
    defaultOpen: false,
    items: [
      { to: '/settings/service-history', icon: Shield, label: 'Service Record' },
      { to: '/settings/timeline', icon: Clock, label: 'Timeline' },
      { to: '/settings/resources', icon: BookOpen, label: 'VA Resources' },
      { to: '/prep/form-guide', icon: Bookmark, label: 'Form Guide' },
    ],
  },
];

const secondaryNavItems: NavItem[] = [
  { to: '/settings/help', icon: HelpCircle, label: 'Help' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebarStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach(group => {
      initial[group.label] = group.defaultOpen ?? false;
    });
    return initial;
  });
  const location = useLocation();

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => location.pathname === item.to || location.pathname.startsWith(item.to + '/'));
  };

  const isItemActive = (to: string) => {
    return location.pathname === to;
  };

  return (
    <aside
      className={cn(
        'hidden md:flex',
        'fixed left-0 top-0 z-40 h-screen border-r flex-col',
        'border-sidebar-border',
        'transition-all duration-300 ease-vcs',
        'bg-gradient-to-b from-sidebar-background via-sidebar-background to-[hsl(0_0%_5%)]',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{
        boxShadow: 'inset -1px 0 0 hsl(var(--border) / 0.3), 4px 0 24px -4px hsl(0 0% 0% / 0.3)'
      }}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-4 border-b border-sidebar-border/50 transition-all duration-200 ease-vcs',
        collapsed && 'justify-center px-2'
      )}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 shadow-[0_0_20px_rgba(197,164,66,0.2)] transition-all duration-200 ease-vcs hover:scale-105">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm tracking-tight">Vet Claim Support</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav aria-label="Sidebar navigation" className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin">
        {/* Dashboard */}
        <div className="mb-1">
          <NavLink
            to="/app"
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
              'transition-all duration-200 ease-vcs',
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
              (location.pathname === '/' || location.pathname === '/app') && 'bg-primary/10 text-primary',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Dashboard' : undefined}
          >
            <LayoutDashboard className={cn('h-[18px] w-[18px] flex-shrink-0', (location.pathname === '/' || location.pathname === '/app') && 'text-primary')} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </div>

        {/* Divider */}
        <div className="h-px bg-sidebar-border/50 my-2" />

        {/* Nav Groups */}
        <div className="space-y-0.5">
          {navGroups.map((group) => {
            const groupActive = isGroupActive(group);
            const isOpen = openGroups[group.label];

            if (collapsed) {
              return (
                <NavLink
                  key={group.label}
                  to={group.items[0].to}
                  className={cn(
                    'flex items-center justify-center rounded-lg px-2 py-2',
                    'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                    'transition-all duration-200 ease-vcs',
                    groupActive && 'bg-primary/10 text-primary'
                  )}
                  title={group.label}
                >
                  <group.icon className={cn('h-[18px] w-[18px]', groupActive && 'text-primary')} />
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
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium',
                    'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
                    'transition-all duration-200 ease-vcs',
                    groupActive && 'text-primary'
                  )}>
                    <div className="flex items-center gap-3">
                      <group.icon className={cn('h-[18px] w-[18px] flex-shrink-0', groupActive && 'text-primary')} />
                      <span>{group.label}</span>
                    </div>
                    <ChevronDown className={cn(
                      'h-3.5 w-3.5 text-sidebar-muted transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="ml-5 pl-3 border-l border-sidebar-border/40 space-y-0.5 py-1">
                    {group.items.map((item) => {
                      const active = isItemActive(item.to);
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            className={cn(
                              'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px]',
                              'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground',
                              'transition-all duration-150',
                              active && 'bg-primary/10 text-primary font-medium'
                            )}
                          >
                            <item.icon className={cn('h-3.5 w-3.5 flex-shrink-0', active && 'text-primary')} />
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
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border/50 p-2 space-y-0.5">
        {/* Secondary nav items */}
        {secondaryNavItems.map((item) => {
          const active = isItemActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-foreground',
                'transition-all duration-150',
                active && 'bg-primary/10 text-primary',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn('h-[18px] w-[18px] flex-shrink-0', active && 'text-primary')} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Theme + Collapse */}
        <div className="pt-1 border-t border-sidebar-border/30 mt-1">
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
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'w-full text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-foreground',
              collapsed && 'px-2'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
