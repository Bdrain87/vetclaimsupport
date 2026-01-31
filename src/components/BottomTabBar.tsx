import { NavLink, useLocation } from 'react-router-dom';
import { Home, PenSquare, Wrench, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/symptoms', icon: PenSquare, label: 'Log' },
  { to: '/claim-tools', icon: Wrench, label: 'Tools' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomTabBar() {
  const location = useLocation();

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-50",
      "bg-black/90 backdrop-blur-xl",
      "border-t border-white/[0.08]",
      "safe-area-bottom"
    )}>
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
                "transition-colors duration-150",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
