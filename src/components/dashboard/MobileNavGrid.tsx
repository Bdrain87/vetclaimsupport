import { NavLink } from 'react-router-dom';
import { useState } from 'react';
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
  Heart,
  Wrench,
  ChevronDown,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
      { to: '/health-log', icon: Heart, label: 'Health Log' },
      { to: '/symptoms', icon: Activity, label: 'Symptoms' },
      { to: '/migraines', icon: Brain, label: 'Migraines' },
      { to: '/sleep', icon: Moon, label: 'Sleep' },
      { to: '/medications', icon: Pill, label: 'Meds' },
    ],
  },
  {
    label: 'Service Record',
    icon: Shield,
    items: [
      { to: '/service-history', icon: Shield, label: 'Service' },
      { to: '/exposures', icon: AlertTriangle, label: 'Exposures' },
      { to: '/medical-visits', icon: Stethoscope, label: 'Medical' },
    ],
  },
  {
    label: 'Evidence & Docs',
    icon: FileCheck,
    items: [
      { to: '/docs', icon: FileCheck, label: 'Documents' },
      { to: '/evidence-docs', icon: FileCheck, label: 'Evidence' },
      { to: '/buddy-contacts', icon: Users, label: 'Buddies' },
      { to: '/timeline', icon: Clock, label: 'Timeline' },
    ],
  },
  {
    label: 'Claim Tools',
    icon: Wrench,
    items: [
      { to: '/claim-tools', icon: Wrench, label: 'Tools' },
      { to: '/checklist', icon: ClipboardCheck, label: 'Checklist' },
      { to: '/exam-prep', icon: Briefcase, label: 'C&P Prep' },
      { to: '/reference', icon: BookOpen, label: 'Reference' },
    ],
  },
];

export function MobileNavGrid() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    navGroups.reduce((acc, group) => ({ ...acc, [group.label]: group.defaultOpen ?? false }), {})
  );

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="md:hidden space-y-3">
      {navGroups.map((group) => {
        const isOpen = openGroups[group.label];
        
        return (
          <Collapsible
            key={group.label}
            open={isOpen}
            onOpenChange={() => toggleGroup(group.label)}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl',
                'bg-card border border-border shadow-sm',
                'transition-all duration-200',
                isOpen && 'bg-primary/5 border-primary/20'
              )}>
                <div className="flex items-center gap-2">
                  <group.icon className={cn('h-4 w-4', isOpen && 'text-primary')} />
                  <span className={cn(
                    'text-sm font-medium',
                    isOpen && 'text-primary'
                  )}>{group.label}</span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  isOpen && 'rotate-180 text-primary'
                )} />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pt-2">
              <div className="grid grid-cols-4 gap-2">
                {group.items.map((item, index) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => cn(
                      "flex flex-col items-center justify-center gap-1.5",
                      "min-h-[80px] p-3 rounded-2xl",
                      "bg-card border border-border/50",
                      "transition-all duration-300",
                      "hover:border-primary/30 hover:bg-primary/5 hover:translate-y-[-2px]",
                      "active:scale-[0.97]",
                      "animate-fade-in",
                      isActive && "bg-primary/10 border-primary/30 shadow-[0_0_16px_hsl(var(--primary)/0.15)]"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300",
                      "bg-muted/50 group-hover:bg-primary/10"
                    )}>
                      <item.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground text-center leading-tight">
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
