import { NavLink, useLocation } from 'react-router-dom';
import { Home, Activity, Calculator, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// Quick-access tabs for mobile - matches key routes from desktop sidebar
const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/health-log', icon: Activity, label: 'Log' },
  { to: '/claim-tools', icon: Calculator, label: 'Tools' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomTabBar() {
  const location = useLocation();

  // Check if current path matches tab or is a child route
  const isTabActive = (tabPath: string) => {
    if (tabPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname === tabPath || location.pathname.startsWith(tabPath + '/');
  };

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 right-0 z-50",
      "bg-background/80 backdrop-blur-xl",
      "border-t border-border",
      "safe-area-bottom"
    )}>
      <div className="flex items-center justify-around h-20 px-2">
        {tabs.map((tab, index) => {
          const isActive = isTabActive(tab.to);
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "flex-1 h-full min-w-[64px] min-h-[48px]",
                "transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "flex items-center justify-center",
                "w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl",
                "transition-all duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isActive && "bg-primary/15 scale-110"
              )}>
                <tab.icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-105"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive && "font-semibold"
              )}>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
