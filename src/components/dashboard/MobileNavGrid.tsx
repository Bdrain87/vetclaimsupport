import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Home,
  Wrench,
  Plus,
  FileText,
  Menu,
  X,
  Heart,
  Shield,
  Users,
  HelpCircle,
  Settings,
  Calculator,
  Search,
  Wand2,
  ClipboardCheck,
  Activity,
  Brain,
  AlertTriangle,
  Clock,
  Stethoscope,
  Route,
  Files,
  Moon,
  Sun,
  FileSignature,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface NavItem {
  title: string;
  path: string | null;
  icon: React.ElementType;
  primary?: boolean;
  opensDrawer?: boolean;
}

const bottomNavItems: NavItem[] = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Tools', path: '/prep', icon: Wrench },
  { title: 'Add', path: '/health/summary', icon: Plus, primary: true },
  { title: 'Claim', path: '/settings/journey', icon: FileText },
  { title: 'Menu', path: null, icon: Menu, opensDrawer: true },
];

// Drawer menu items
const drawerSections = [
  {
    title: 'Premium Tools',
    items: [
      { title: 'Rating Calculator', path: '/claims/calculator', icon: Calculator },
      { title: 'Secondary Finder', path: '/claims/secondary-finder', icon: Search },
      { title: 'Nexus Letter Generator', path: '/prep/nexus-letter', icon: FileSignature },
      { title: 'DBQ Prep Sheet', path: '/prep/dbq', icon: ClipboardList },
      { title: 'Strategy Wizard', path: '/claims/strategy', icon: Wand2 },
      { title: 'C&P Exam Prep', path: '/prep/exam', icon: ClipboardCheck },
    ],
  },
  {
    title: 'My Claim',
    items: [
      { title: 'Journey', path: '/settings/journey', icon: Route },
      { title: 'Documents', path: '/settings/vault', icon: Files },
      { title: 'Checklist', path: '/claims/checklist', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Service History',
    items: [
      { title: 'Service Record', path: '/settings/service-history', icon: Shield },
      { title: 'Medical Visits', path: '/health/visits', icon: Stethoscope },
      { title: 'Exposures', path: '/health/exposures', icon: AlertTriangle },
      { title: 'Timeline', path: '/settings/timeline', icon: Clock },
    ],
  },
  {
    title: 'Health Tracking',
    items: [
      { title: 'Daily Log', path: '/health/summary', icon: Activity },
      { title: 'Migraines', path: '/health/migraines', icon: Brain },
    ],
  },
];

const drawerSingleItems = [
  { title: 'Buddy Statements', path: '/prep/buddy-statement', icon: Users },
  { title: 'Help Center', path: '/settings/help', icon: HelpCircle },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export function MobileNavGrid() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string | null) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border md:hidden z-50 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => (
            item.opensDrawer ? (
              <button
                key={item.title}
                onClick={() => setDrawerOpen(true)}
                className="flex flex-col items-center justify-center w-16 h-full text-muted-foreground"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-medium">{item.title}</span>
              </button>
            ) : item.primary ? (
              <NavLink
                key={item.title}
                to={item.path!}
                className="flex items-center justify-center w-14 h-14 -mt-5 bg-primary rounded-full text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <item.icon className="w-6 h-6" />
              </NavLink>
            ) : (
              <NavLink
                key={item.title}
                to={item.path!}
                className={cn(
                  'flex flex-col items-center justify-center w-16 h-full transition-colors',
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive(item.path) && 'drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]')} />
                <span className="text-[10px] mt-1 font-medium">{item.title}</span>
              </NavLink>
            )
          ))}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-l border-border z-50 md:hidden overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-lg">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sections */}
            <div className="p-3 space-y-4">
              {drawerSections.map((section) => (
                <div key={section.title}>
                  <div className="px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setDrawerOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px]',
                          isActive(item.path)
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-accent'
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Single Items */}
              <div className="space-y-0.5">
                {drawerSingleItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px]',
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-accent'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </NavLink>
                ))}
              </div>

              {/* Theme Toggle */}
              <div className="border-t border-border pt-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <span className="text-sm">Theme</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add padding to bottom of page for bottom nav */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </>
  );
}
