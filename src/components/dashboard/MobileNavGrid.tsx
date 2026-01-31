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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    to: '/service-history', 
    icon: Shield, 
    label: 'Service History',
    description: 'Duty stations & deployments',
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-500',
  },
  { 
    to: '/medical-visits', 
    icon: Stethoscope, 
    label: 'Medical Visits',
    description: 'Appointments & treatments',
    gradient: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-500',
  },
  { 
    to: '/medications', 
    icon: Pill, 
    label: 'Medications',
    description: 'Current & past prescriptions',
    gradient: 'from-violet-500/20 to-violet-600/10',
    iconColor: 'text-violet-500',
  },
  { 
    to: '/documents', 
    icon: FileCheck, 
    label: 'Documents',
    description: 'Records & evidence',
    gradient: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-500',
  },
  { 
    to: '/symptoms', 
    icon: Activity, 
    label: 'Symptoms',
    description: 'Daily symptom journal',
    gradient: 'from-rose-500/20 to-rose-600/10',
    iconColor: 'text-rose-500',
  },
  { 
    to: '/exposures', 
    icon: AlertTriangle, 
    label: 'Exposures',
    description: 'Hazards & toxic exposure',
    gradient: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-500',
  },
  { 
    to: '/migraines', 
    icon: Brain, 
    label: 'Migraines',
    description: 'Headache tracking',
    gradient: 'from-pink-500/20 to-pink-600/10',
    iconColor: 'text-pink-500',
  },
  { 
    to: '/sleep', 
    icon: Moon, 
    label: 'Sleep',
    description: 'Sleep quality tracker',
    gradient: 'from-indigo-500/20 to-indigo-600/10',
    iconColor: 'text-indigo-500',
  },
  { 
    to: '/buddy-contacts', 
    icon: Users, 
    label: 'Buddy Contacts',
    description: 'Statement witnesses',
    gradient: 'from-cyan-500/20 to-cyan-600/10',
    iconColor: 'text-cyan-500',
  },
  { 
    to: '/timeline', 
    icon: Clock, 
    label: 'Timeline',
    description: 'Visual service timeline',
    gradient: 'from-teal-500/20 to-teal-600/10',
    iconColor: 'text-teal-500',
  },
  { 
    to: '/checklist', 
    icon: ClipboardCheck, 
    label: 'Checklist',
    description: 'Claim readiness guide',
    gradient: 'from-lime-500/20 to-lime-600/10',
    iconColor: 'text-lime-500',
  },
  { 
    to: '/reference', 
    icon: BookOpen, 
    label: 'Reference',
    description: 'VA claims resources',
    gradient: 'from-slate-500/20 to-slate-600/10',
    iconColor: 'text-slate-400',
  },
  { 
    to: '/settings', 
    icon: Settings, 
    label: 'Settings',
    description: 'App preferences',
    gradient: 'from-gray-500/20 to-gray-600/10',
    iconColor: 'text-gray-400',
  },
];

export function MobileNavGrid() {
  return (
    <div className="md:hidden mt-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Quick Access</h2>
      <div className="grid grid-cols-2 gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'flex flex-col items-start p-4 rounded-xl border border-border/50',
              'bg-gradient-to-br',
              item.gradient,
              'active:scale-[0.96] active:opacity-80 transition-all duration-150 ease-out',
              'hover:shadow-md hover:border-border',
              'min-h-[100px] touch-target'
            )}
          >
            <div className={cn(
              'flex items-center justify-center w-10 h-10 rounded-lg mb-3',
              'bg-background/80 backdrop-blur-sm'
            )}>
              <item.icon className={cn('h-5 w-5', item.iconColor)} />
            </div>
            <span className="font-semibold text-foreground text-sm leading-tight">
              {item.label}
            </span>
            <span className="text-xs text-muted-foreground mt-1 leading-tight">
              {item.description}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
