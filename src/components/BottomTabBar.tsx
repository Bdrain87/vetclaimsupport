import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Wrench, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', match: (p: string) => p === '/dashboard' },
  { to: '/conditions', icon: FileText, label: 'Conditions', match: (p: string) => p.startsWith('/conditions') },
  { to: '/claim-tools', icon: Wrench, label: 'Tools', match: (p: string) => p.startsWith('/claim-tools') || p.startsWith('/tools') },
  { to: '/health-log', icon: Heart, label: 'Health', match: (p: string) => p.startsWith('/health-log') },
  { to: '/settings', icon: User, label: 'Profile', match: (p: string) => p.startsWith('/settings') },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on landing page and onboarding
  if (location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/onboarding') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div
        className="bg-[#102039]/95 backdrop-blur-xl border-t border-white/[0.08]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => {
            const isActive = tab.match(location.pathname);
            return (
              <motion.button
                key={tab.to}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.1 }}
                onClick={() => navigate(tab.to)}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5',
                  'flex-1 h-full min-w-[56px] min-h-[48px]',
                )}
              >
                {/* Gold dot indicator */}
                {isActive && (
                  <div className="absolute -top-0.5 w-1 h-1 rounded-full bg-[#C8A628]" />
                )}
                <tab.icon
                  size={24}
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-[#C8A628]' : 'text-white/40'
                  )}
                />
                <span className={cn(
                  'text-[10px] font-medium mt-1 transition-colors duration-200',
                  isActive ? 'text-[#C8A628]' : 'text-white/40'
                )}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
