import { useState, useEffect } from 'react';
import { Menu, X, Bell, Search } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Evidence Vault', href: '/documents' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Claim Tools', href: '/claim-tools' },
  { label: 'Calculator', href: '/bilateral-calculator' },
  { label: 'Health Log', href: '/health-log' },
  { label: 'Exam Prep', href: '/exam-prep' },
  { label: 'Settings', href: '/settings' },
];

export const PlatinumNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

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

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Left: logo + desktop nav */}
          <div className="flex items-center gap-4 lg:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="h-8 w-8 bg-[#C8A628] rounded-lg flex items-center justify-center font-black text-[#102039] italic transition-transform group-hover:rotate-12">V</div>
              <span className="text-white font-black italic tracking-tighter uppercase relative hidden md:block">
                Vet Claim Support
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_ITEMS.slice(0, 4).map(item => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors min-h-[44px] flex items-center ${
                    location.pathname === item.href ? 'text-[#C8A628]' : 'text-white/40 hover:text-[#C8A628]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 hover:text-white transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="relative min-h-[44px] min-w-[44px] flex items-center justify-center text-white/40 hover:text-white transition-colors" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-[#C8A628] rounded-full border-2 border-[#102039]" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase leading-none">Blake Drain</p>
                <p className="text-[9px] font-bold text-[#C8A628] uppercase leading-none mt-1">Platinum Member</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-[#C8A628]/20 text-[#C8A628] font-black italic">B</div>
              </div>
            </div>

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-[201] h-[100dvh] w-[min(320px,85vw)] bg-[#0c1829] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <span className="text-white font-black italic uppercase text-sm">Menu</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="px-4 py-4 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 80px)' }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center min-h-[52px] px-4 rounded-xl text-base font-bold transition-colors ${
                location.pathname === item.href
                  ? 'text-[#C8A628] bg-[#C8A628]/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5 active:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* User info in drawer on mobile */}
          <div className="sm:hidden mt-6 pt-6 border-t border-white/10 px-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 border border-white/10 overflow-hidden shrink-0">
                <div className="w-full h-full flex items-center justify-center bg-[#C8A628]/20 text-[#C8A628] font-black italic">B</div>
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase leading-none">Blake Drain</p>
                <p className="text-[10px] font-bold text-[#C8A628] uppercase leading-none mt-1">Platinum Member</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
