import { useState } from 'react';
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
  ShieldCheck,
  Brain,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/service-history', icon: Shield, label: 'Service History' },
  { to: '/medical-visits', icon: Stethoscope, label: 'Medical Visits' },
  { to: '/medications', icon: Pill, label: 'Medications' },
  { to: '/symptoms', icon: Activity, label: 'Symptoms Journal' },
  { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
  { to: '/migraines', icon: Brain, label: 'Migraine Tracker' },
  { to: '/sleep', icon: Moon, label: 'Sleep Tracker' },
  { to: '/documents', icon: FileCheck, label: 'Documents' },
  { to: '/buddy-contacts', icon: Users, label: 'Buddy Contacts' },
];

const secondaryNavItems = [
  { to: '/reference', icon: BookOpen, label: 'Reference' },
];

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border safe-area-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sidebar-accent-foreground text-sm">Evidence Tracker</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 text-sidebar-foreground hover:bg-sidebar-accent touch-target"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[280px] bg-sidebar border-sidebar-border p-0 safe-area-left"
            >
              <SheetHeader className="px-4 py-4 border-b border-sidebar-border">
                <SheetTitle className="flex items-center gap-2 text-sidebar-accent-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Service Evidence Tracker</span>
                </SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
                <nav className="py-4">
                  <ul className="space-y-1 px-3">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.to;
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            onClick={handleNavClick}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors touch-target',
                              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                              'min-h-[44px]',
                              isActive && 'bg-sidebar-accent text-sidebar-primary'
                            )}
                          >
                            <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-sidebar-primary')} />
                            <span>{item.label}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-4 pt-4 border-t border-sidebar-border mx-3">
                    <ul className="space-y-1">
                      {secondaryNavItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                          <li key={item.to}>
                            <NavLink
                              to={item.to}
                              onClick={handleNavClick}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors touch-target',
                                'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                'min-h-[44px]',
                                isActive && 'bg-sidebar-accent text-sidebar-primary'
                              )}
                            >
                              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-sidebar-primary')} />
                              <span>{item.label}</span>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
