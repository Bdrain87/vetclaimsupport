import { forwardRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, PenSquare, Wrench, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/symptoms', icon: PenSquare, label: 'Log' },
  { to: '/claim-tools', icon: Wrench, label: 'Tools' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const BottomTabBar = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  const location = useLocation();

  return (
    <nav
      ref={ref}
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "bg-background/80 backdrop-blur-xl",
        "border-t border-border",
        "safe-area-bottom"
      )}
      {...props}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "flex-1 h-full min-w-[64px]",
                "transition-all duration-300 ease-out",
                "active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-xl",
                "transition-all duration-300 ease-out",
                isActive && "bg-primary/15"
              )}>
                <tab.icon className="h-5 w-5 transition-all duration-300" />
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
});

BottomTabBar.displayName = 'BottomTabBar';
