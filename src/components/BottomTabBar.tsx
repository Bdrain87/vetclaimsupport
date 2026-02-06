import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileHeart, Activity, Wrench, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/conditions', icon: FileHeart, label: 'Claims' },
  { to: '/health-log', icon: Activity, label: 'Log' },
  { to: '/claim-tools', icon: Wrench, label: 'Tools' },
  { to: '/settings', icon: Settings, label: 'More' },
];

export function BottomTabBar() {
  const location = useLocation();

  const isTabActive = (tabPath: string) => {
    if (tabPath === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === tabPath || location.pathname.startsWith(tabPath + '/');
  };

  // Hide on landing page and onboarding
  if (location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/onboarding') {
    return null;
  }

  return (
    <nav className={cn(
      'sm:hidden fixed bottom-0 left-0 right-0 z-50',
    )}>
      {/* Glass background */}
      <div className="absolute inset-0 bg-[#102039]/90 backdrop-blur-xl border-t border-white/[0.06]" />

      <div className="relative flex items-center justify-around h-16 px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.to);
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5',
                'flex-1 h-full min-w-[56px] min-h-[48px]',
                'transition-all duration-200',
                'active:scale-95',
              )}
            >
              <div className="relative">
                <tab.icon className={cn(
                  'h-5 w-5 transition-colors duration-200',
                  isActive ? 'text-white' : 'text-white/40'
                )} />
                {/* Gold dot indicator */}
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#C8A628]" />
                )}
              </div>
              <span className={cn(
                'text-[10px] mt-1 transition-colors duration-200',
                isActive ? 'text-white font-medium' : 'text-white/40 font-normal'
              )}>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
