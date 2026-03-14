import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { GOLD_GRADIENT, MARQUEE_STYLES } from '@/lib/landing-animations';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Sign In', href: '/auth', isRoute: true },
];

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
          {/* Logo — icon only, brand name lives in the hero */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
          >
            <img src="/app-icon.png" alt="VCS" width={32} height={32} style={{ borderRadius: 8 }} />
            <span className="text-white font-semibold text-sm">Vet Claim Support</span>
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
            <Link
              to="/auth"
              className="rounded-full px-5 py-2 text-sm font-semibold text-black no-underline transition-shadow hover:shadow-[0_0_20px_rgba(236,196,64,0.3)]"
              style={{
                background:
                  'linear-gradient(90deg, #B8AB80 0%, #C8BA8A 25%, #DDD3B2 50%, #C8BA8A 75%, #B8AB80 100%)',
              }}
            >
              Try Free
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
                  'linear-gradient(90deg, #B8AB80 0%, #C8BA8A 25%, #DDD3B2 50%, #C8BA8A 75%, #B8AB80 100%)',
              }}
            >
              Try Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
