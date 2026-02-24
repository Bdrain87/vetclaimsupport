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
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(10,10,10,0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
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
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              'isRoute' in link && link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-white/80 hover:text-gold transition-colors text-sm font-medium no-underline"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="bg-transparent border-none text-white/80 hover:text-gold transition-colors text-sm font-medium cursor-pointer"
                >
                  {link.label}
                </button>
              )
            ))}
            <Link
              to="/auth"
              className="rounded-full px-6 py-2 text-sm font-semibold text-black no-underline"
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
                  className="text-white text-2xl font-medium hover:text-gold transition-colors no-underline"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="bg-transparent border-none text-white text-2xl font-medium cursor-pointer hover:text-gold transition-colors"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
