import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Heart, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/claims', icon: FileText, label: 'Claims' },
  { to: '/health', icon: Heart, label: 'Health' },
  { to: '/prep', icon: BookOpen, label: 'Prep' },
  { to: '/profile', icon: User, label: 'Profile' },
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
      <div className="flex items-center justify-around h-20 px-2">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.to, location.pathname);
          return (
            <button
              key={tab.to}
              onClick={() => navigate(tab.to)}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                'flex-1 min-h-[48px] min-w-[48px]',
                'transition-all duration-200 ease-out',
              )}
            >
              <tab.icon
                className={cn(
                  'h-6 w-6 transition-all duration-200 ease-out',
                  isActive ? 'text-amber-500 scale-105' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200 ease-out',
                  isActive ? 'text-amber-500' : 'text-muted-foreground'
                )}
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
