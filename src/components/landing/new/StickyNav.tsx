import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Sign In', href: '/auth', isRoute: true },
];

function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com/us/app/vet-claim-support/id6744254580"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g fill="#fff">
          <path d="M24.769 20.3a4.949 4.949 0 0 1 2.356-4.152 5.066 5.066 0 0 0-3.99-2.158c-1.68-.176-3.308 1.005-4.164 1.005-.872 0-2.19-.988-3.608-.958a5.315 5.315 0 0 0-4.473 2.728c-1.934 3.348-.491 8.269 1.361 10.976.927 1.325 2.01 2.805 3.428 2.753 1.387-.058 1.905-.885 3.58-.885 1.658 0 2.144.885 3.59.852 1.489-.025 2.426-1.332 3.32-2.669a10.962 10.962 0 0 0 1.52-3.092 4.782 4.782 0 0 1-2.92-4.4zM22.037 12.21a4.872 4.872 0 0 0 1.115-3.49 4.957 4.957 0 0 0-3.208 1.66 4.636 4.636 0 0 0-1.144 3.36 4.1 4.1 0 0 0 3.237-1.53z" />
          <text x="38" y="15" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="0.03em">Download on the</text>
          <text x="38" y="28" fontSize="14" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing="-0.01em">App Store</text>
        </g>
      </svg>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href="/auth"
      className="inline-flex items-center"
    >
      <svg width="135" height="40" viewBox="0 0 135 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="135" height="40" rx="6" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g>
          <path d="M21.2 18.07l-7.49-7.52a1.61 1.61 0 0 0-.47 1.14v16.62a1.6 1.6 0 0 0 .47 1.14l.08.07 8.38-8.38v-.2l-.97-.87z" fill="#4285F4" />
          <path d="M24.37 21.24l-3.17-3.17v-.2l3.17-3.17.07.04 3.76 2.13c1.07.61 1.07 1.61 0 2.22l-3.76 2.13-.07.02z" fill="#FBBC04" />
          <path d="M24.44 21.22l-3.24-3.24-7.96 7.96c.35.38.93.42 1.59.05l9.61-4.77" fill="#EA4335" />
          <path d="M24.44 14.74l-9.61-4.77c-.66-.37-1.24-.33-1.59.05l7.96 7.96 3.24-3.24z" fill="#34A853" />
          <text x="42" y="15" fontSize="7" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="0.03em">GET IT ON</text>
          <text x="42" y="28" fontSize="13" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fill="#fff" letterSpacing="-0.01em">Google Play</text>
        </g>
      </svg>
    </a>
  );
}

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 300ms ease, border-color 300ms ease',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none"
          >
            <img src="/app-icon.png" alt="Vet Claim Support" width={32} height={32} style={{ borderRadius: 8 }} />
            <span className="text-white font-semibold text-lg tracking-tight">
              Vet Claim Support
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              'isRoute' in link && link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium no-underline"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="bg-transparent border-none text-white/80 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {link.label}
                </button>
              )
            ))}
            <div className="hidden lg:flex items-center gap-3">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
            <Link
              to="/auth"
              className="rounded-full px-5 py-2 text-sm font-semibold text-black no-underline transition-shadow hover:shadow-[0_0_20px_rgba(236,196,64,0.3)]"
              style={{
                background:
                  'linear-gradient(90deg, #C8A020 0%, #ECC440 20%, #FFE566 50%, #ECC440 80%, #C8A020 100%)',
              }}
            >
              Launch App
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden bg-transparent border-none text-white p-1 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => (
              'isRoute' in link && link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-2xl font-medium hover:text-white/80 transition-colors no-underline"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="bg-transparent border-none text-white text-2xl font-medium cursor-pointer hover:text-white/80 transition-colors"
                >
                  {link.label}
                </button>
              )
            ))}
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="rounded-full px-8 py-3 text-lg font-semibold text-black no-underline mt-4"
              style={{
                background:
                  'linear-gradient(90deg, #C8A020 0%, #ECC440 20%, #FFE566 50%, #ECC440 80%, #C8A020 100%)',
              }}
            >
              Launch App
            </Link>
            <div className="mt-2 flex items-center gap-3">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
