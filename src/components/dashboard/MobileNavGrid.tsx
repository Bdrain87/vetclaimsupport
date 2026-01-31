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
  BookOpen,
  Clock,
  ClipboardCheck,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    to: '/service-history', 
    icon: Shield, 
    label: 'Service History',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
  { 
    to: '/medical-visits', 
    icon: Stethoscope, 
    label: 'Medical Visits',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
  },
  { 
    to: '/medications', 
    icon: Pill, 
    label: 'Medications',
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
  },
  { 
    to: '/documents', 
    icon: FileCheck, 
    label: 'Documents',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
  { 
    to: '/symptoms', 
    icon: Activity, 
    label: 'Symptoms',
    color: 'text-rose-400',
    bg: 'bg-rose-500/15',
  },
  { 
    to: '/exposures', 
    icon: AlertTriangle, 
    label: 'Exposures',
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
  },
  { 
    to: '/migraines', 
    icon: Brain, 
    label: 'Migraines',
    color: 'text-pink-400',
    bg: 'bg-pink-500/15',
  },
  { 
    to: '/sleep', 
    icon: Moon, 
    label: 'Sleep',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15',
  },
  { 
    to: '/buddy-contacts', 
    icon: Users, 
    label: 'Buddy Contacts',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
  },
  { 
    to: '/timeline', 
    icon: Clock, 
    label: 'Timeline',
    color: 'text-teal-400',
    bg: 'bg-teal-500/15',
  },
  { 
    to: '/checklist', 
    icon: ClipboardCheck, 
    label: 'Checklist',
    color: 'text-lime-400',
    bg: 'bg-lime-500/15',
  },
  { 
    to: '/reference', 
    icon: BookOpen, 
    label: 'Reference',
    color: 'text-slate-400',
    bg: 'bg-slate-500/15',
  },
  { 
    to: '/settings', 
    icon: Settings, 
    label: 'Settings',
    color: 'text-gray-400',
    bg: 'bg-gray-500/15',
  },
];

export function MobileNavGrid() {
  return (
    <div className="md:hidden">
      <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Quick Access</h2>
      
      {/* iOS-style grouped list */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3.5",
              "active:bg-white/5 transition-colors duration-100",
              index !== navItems.length - 1 && "border-b border-white/[0.04]",
              isActive && "bg-primary/10"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl",
                item.bg
              )}>
                <item.icon className={cn('h-[18px] w-[18px]', item.color)} />
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </NavLink>
        ))}
      </div>
    </div>
  );
}