import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Shield, Heart, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/claims', icon: Shield, label: 'Claims' },
  { to: '/health', icon: Heart, label: 'Health' },
  { to: '/prep', icon: BookOpen, label: 'Prep' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const isTabActive = (tabPath: string, pathname: string) => {
  if (tabPath === '/') return pathname === '/';
  return pathname === tabPath || pathname.startsWith(tabPath + '/');
};

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on onboarding
  if (location.pathname === '/onboarding') {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around px-2" style={{ height: '56px' }}>
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.to, location.pathname);
          return (
            <button
              key={tab.to}
              onClick={() => navigate(tab.to)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5',
                'flex-1 h-full',
                'transition-colors duration-200 ease-out',
              )}
            >
              <tab.icon
                className={cn(
                  'h-6 w-6 transition-colors duration-200 ease-out',
                  isActive ? 'text-[#3B82F6]' : 'text-[#94A3B8]'
                )}
              />
              <span
                className={cn(
                  'font-medium transition-colors duration-200 ease-out',
                  isActive ? 'text-[#3B82F6]' : 'text-[#94A3B8]'
                )}
                style={{ fontSize: '0.6875rem', lineHeight: '1' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
