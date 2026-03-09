import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Shield, Activity, Wrench, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isWeb } from '@/lib/platform';
import { selectionTap } from '@/lib/haptics';

const tabs = [
  { to: isWeb ? '/app' : '/', icon: Home, label: 'Home' },
  { to: '/claims', icon: Shield, label: 'My Claim' },
  { to: '/health', icon: Activity, label: 'Track' },
  { to: '/prep', icon: Wrench, label: 'Tools' },
  { to: '/settings', icon: User, label: 'Me' },
];

const isTabActive = (tabPath: string, pathname: string) => {
  if (tabPath === '/' || tabPath === '/app') return pathname === '/' || pathname === '/app';
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
      className="shrink-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50"
      aria-label="Main navigation"
      role="navigation"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-2" style={{ height: '56px' }}>
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.to, location.pathname);
          return (
            <button
              key={tab.to}
              onClick={() => { selectionTap(); navigate(tab.to); }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5',
                'flex-1 h-full',
                'transition-colors duration-200 ease-out',
                'outline-hidden focus:outline-hidden focus-visible:outline-hidden focus-visible:shadow-none',
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                     style={{ background: 'var(--gold-gradient)' }} />
              )}
              <tab.icon
                className={cn(
                  'h-6 w-6 transition-colors duration-200 ease-out',
                  isActive ? 'text-gold' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'font-medium transition-colors duration-200 ease-out',
                  isActive ? 'text-gold' : 'text-muted-foreground'
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
