import { NavLink } from 'react-router-dom';
import {
  Home,
  Heart,
  FileText,
  Shield,
  Calculator,
  Wrench,
  Route,
  Clock,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

// Simple flat navigation - NO DUPLICATES
const mobileNavItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/health-log', icon: Heart, label: 'Health Log' },
  { to: '/docs', icon: FileText, label: 'Documents' },
  { to: '/service-history', icon: Shield, label: 'Service' },
  { to: '/calculator', icon: Calculator, label: 'Calculator' },
  { to: '/claim-tools', icon: Wrench, label: 'Tools' },
  { to: '/journey', icon: Route, label: 'Journey' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNavGrid() {
  return (
    <div className="md:hidden">
      <div className="grid grid-cols-3 gap-3">
        {mobileNavItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-2",
              "min-h-[90px] p-3 rounded-2xl",
              "bg-card border border-border/50",
              "transition-all duration-300",
              "hover:border-primary/30 hover:bg-primary/5 hover:translate-y-[-2px]",
              "active:scale-[0.97]",
              "animate-fade-in",
              isActive && "bg-primary/10 border-primary/30 shadow-[0_0_16px_hsl(var(--primary)/0.15)]"
            )}
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
              "bg-muted/50"
            )}>
              <item.icon className="h-6 w-6 text-foreground" />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
