import { useState, useEffect } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '@/store/useProfileStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Tools', href: '/claim-tools' },
  { label: 'Health Log', href: '/health-log' },
];

const DRAWER_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Health Log', href: '/health-log' },
  { label: 'Claim Tools', href: '/claim-tools' },
  { label: 'Evidence Vault', href: '/documents' },
  { label: 'Exam Prep', href: '/exam-prep' },
  { label: 'Calculator', href: '/bilateral-calculator' },
  { label: 'Settings', href: '/settings' },
];

function NavLinkItem({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link to={to} className="relative group px-3 py-2">
      {isActive && (
        <motion.div
          layoutId="nav-active-indicator"
          className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-[#C8A628] via-[#E8D05A] to-[#C8A628] rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <div className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-200" />
      <span className={cn(
        'relative text-sm font-medium transition-colors duration-200',
        isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'
      )}>
        {children}
      </span>
    </Link>
  );
}

export const PlatinumNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const location = useLocation();

  const { firstName } = useProfileStore();
  const displayName = firstName || 'Veteran';
  const initial = displayName[0]?.toUpperCase() || 'V';

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
  const isOnboarding = location.pathname === '/onboarding';

  // Scroll compression
  useEffect(() => {
    const onScroll = () => setIsCompressed(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Hide nav entirely on onboarding
  if (isOnboarding) return null;

  return (
    <>
      {/* Desktop & Tablet Nav */}
      <nav className={cn(
        isLandingPage ? 'fixed top-0 left-0' : 'relative',
        'w-full z-[100] hidden sm:block'
      )}>
        <div className={cn(
          'transition-all duration-300',
          isCompressed ? 'py-1 px-3 sm:px-6' : 'py-3 px-3 sm:px-6'
        )}>
          <div className="relative max-w-7xl mx-auto">
            {/* Glass background */}
            <div className="absolute inset-0 bg-[#102039]/70 backdrop-blur-xl border border-white/[0.06] rounded-2xl" />

            {/* Gold accent line */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#C8A628]/30 to-transparent" />

            {/* Content */}
            <div className={cn(
              'relative flex items-center justify-between px-4 sm:px-6 transition-all duration-300',
              isCompressed ? 'h-12' : 'h-16'
            )}>
              {/* Left: Brand + Nav */}
              <div className="flex items-center gap-4 lg:gap-8 min-w-0">
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                  <div className={cn(
                    'bg-gradient-to-br from-[#C8A628] to-[#9A7B1A] rounded-lg flex items-center justify-center font-black text-[#102039] transition-all duration-300',
                    isCompressed ? 'h-7 w-7 text-sm' : 'h-8 w-8 text-base'
                  )}>V</div>
                  <div className="hidden md:block">
                    <span className="text-white font-bold tracking-[0.08em] uppercase text-sm">
                      VCS
                    </span>
                    <span className={cn(
                      'hidden lg:inline text-white/40 text-xs font-medium ml-2 transition-opacity duration-300',
                      isCompressed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    )}>
                      Claim Preparation Tools
                    </span>
                  </div>
                </Link>

                {/* Desktop nav links with sliding gold indicator */}
                <div className="hidden lg:flex items-center gap-1">
                  {NAV_ITEMS.map(item => (
                    <NavLinkItem key={item.label} to={item.href}>
                      {item.label}
                    </NavLinkItem>
                  ))}
                </div>
              </div>

              {/* Right: Settings + Profile */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Link
                  to="/settings"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </Link>

                <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-white/[0.06]">
                  <div className={cn(
                    'rounded-full bg-gradient-to-br from-[#C8A628]/20 to-[#C8A628]/5 border border-[#C8A628]/20 overflow-hidden flex items-center justify-center text-[#C8A628] font-bold transition-all duration-300',
                    isCompressed ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm'
                  )}>
                    {initial}
                  </div>
                  <span className={cn(
                    'text-white/60 text-xs font-medium transition-opacity duration-300',
                    isCompressed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  )}>
                    {displayName}
                  </span>
                </div>

                {/* Hamburger for tablet (sm-lg) */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  aria-label="Open menu"
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile top bar - minimal, pairs with bottom tab bar */}
      <nav className={cn(
        isLandingPage ? 'fixed top-0 left-0' : 'relative',
        'w-full z-[100] sm:hidden'
      )}>
        <div className="px-3 py-2">
          <div className="relative">
            <div className="absolute inset-0 bg-[#102039]/70 backdrop-blur-xl border border-white/[0.06] rounded-xl" />
            <div className="relative flex items-center justify-between px-3 h-12">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="h-7 w-7 bg-gradient-to-br from-[#C8A628] to-[#9A7B1A] rounded-lg flex items-center justify-center font-black text-[#102039] text-sm">V</div>
                <span className="text-white font-bold tracking-[0.08em] uppercase text-sm">VCS</span>
              </Link>

              <button
                onClick={() => setDrawerOpen(true)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Slide-in drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 z-[201] h-[100dvh] w-[min(320px,85vw)]',
          'bg-[#0c1829]/95 backdrop-blur-xl border-l border-white/[0.06]',
          'shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#C8A628]/20 to-[#C8A628]/5 border border-[#C8A628]/20 flex items-center justify-center text-[#C8A628] font-bold text-sm">
              {initial}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{displayName}</p>
              <p className="text-[#C8A628]/60 text-[10px] uppercase tracking-wider font-medium">Claim Prep Tools</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="px-4 py-4 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 80px)' }}>
          {DRAWER_ITEMS.map(item => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'flex items-center min-h-[48px] px-4 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white bg-white/[0.06] border-l-2 border-[#C8A628]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.03] active:bg-white/[0.06]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
