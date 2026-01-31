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
  ShieldCheck,
  Brain,
  Moon,
  Settings,
  Clock,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/service-history', icon: Shield, label: 'Service History' },
  { to: '/medical-visits', icon: Stethoscope, label: 'Medical Visits' },
  { to: '/medications', icon: Pill, label: 'Medications' },
  { to: '/symptoms', icon: Activity, label: 'Symptoms' },
  { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
  { to: '/migraines', icon: Brain, label: 'Migraines' },
  { to: '/sleep', icon: Moon, label: 'Sleep' },
  { to: '/documents', icon: FileCheck, label: 'Documents' },
  { to: '/buddy-contacts', icon: Users, label: 'Buddy Contacts' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/checklist', icon: ClipboardCheck, label: 'Checklist' },
  { to: '/exam-prep', icon: ClipboardCheck, label: 'C&P Exam Prep' },
  { to: '/claim-tools', icon: FileCheck, label: 'Claim Tools' },
];

const secondaryNavItems = [
  { to: '/reference', icon: BookOpen, label: 'Reference' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
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