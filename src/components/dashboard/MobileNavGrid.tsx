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
  { to: '/service-history', icon: Shield, label: 'Service', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { to: '/medical-visits', icon: Stethoscope, label: 'Medical', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { to: '/medications', icon: Pill, label: 'Meds', color: 'text-violet-400', bg: 'bg-violet-500/20' },
  { to: '/documents', icon: FileCheck, label: 'Docs', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { to: '/symptoms', icon: Activity, label: 'Symptoms', color: 'text-rose-400', bg: 'bg-rose-500/20' },
  { to: '/exposures', icon: AlertTriangle, label: 'Exposures', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { to: '/migraines', icon: Brain, label: 'Migraines', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  { to: '/sleep', icon: Moon, label: 'Sleep', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  { to: '/buddy-contacts', icon: Users, label: 'Buddies', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { to: '/timeline', icon: Clock, label: 'Timeline', color: 'text-teal-400', bg: 'bg-teal-500/20' },
  { to: '/checklist', icon: ClipboardCheck, label: 'Checklist', color: 'text-lime-400', bg: 'bg-lime-500/20' },
  { to: '/reference', icon: BookOpen, label: 'Reference', color: 'text-slate-400', bg: 'bg-slate-500/20' },
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
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              "transition-transform duration-300 ease-out",
              item.bg
            )}>
              <item.icon className={cn('h-5 w-5', item.color)} />
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
