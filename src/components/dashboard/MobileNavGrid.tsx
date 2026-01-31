import { NavLink } from 'react-router-dom';
import {
  Shield,
  Stethoscope,
  Pill,
  FileCheck,
  Activity,
  AlertTriangle,
  Brain,
  Moon,
  Users,
  Clock,
  ClipboardCheck,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/service-history', icon: Shield, label: 'Service' },
  { to: '/medical-visits', icon: Stethoscope, label: 'Medical' },
  { to: '/medications', icon: Pill, label: 'Meds' },
  { to: '/documents', icon: FileCheck, label: 'Docs' },
  { to: '/symptoms', icon: Activity, label: 'Symptoms' },
  { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
  { to: '/migraines', icon: Brain, label: 'Migraines' },
  { to: '/sleep', icon: Moon, label: 'Sleep' },
  { to: '/buddy-contacts', icon: Users, label: 'Buddies' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/checklist', icon: ClipboardCheck, label: 'Checklist' },
  { to: '/reference', icon: BookOpen, label: 'Reference' },
];

export function MobileNavGrid() {
  return (
    <div className="md:hidden">
      <h2 className="text-xs font-medium text-muted-foreground mb-2 px-1">Quick Access</h2>
      
      {/* 4-column icon grid */}
      <div className="grid grid-cols-4 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1",
              "min-h-[72px] p-2 rounded-2xl",
              "bg-white/[0.04] backdrop-blur-sm",
              "border border-white/[0.06]",
              "transition-all duration-300 ease-out",
              "active:scale-95 active:bg-white/[0.08]",
              "hover:bg-white/[0.06]",
              isActive && "bg-primary/10 border-primary/20"
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 transition-transform duration-300 ease-out">
              <item.icon className="h-5 w-5 text-foreground/70" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
