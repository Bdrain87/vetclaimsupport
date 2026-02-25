import { Link } from 'react-router-dom';

type FooterLink =
  | { label: string; href: string; to?: never; external?: boolean }
  | { label: string; to: string; href?: never; external?: never };

const PRODUCT_LINKS: FooterLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Launch App', to: '/login' },
];

const RESOURCE_LINKS: FooterLink[] = [
  { label: 'VA.gov', href: 'https://www.va.gov/', external: true },
  { label: 'FAQ', to: '/settings/faq' },
  { label: 'Privacy Policy', to: '/settings/privacy' },
  { label: 'Terms of Service', to: '/settings/terms' },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About', to: '/settings/about' },
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
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g>
          <path d="M21.2 18.07l-7.49-7.52a1.61 1.61 0 0 0-.47 1.14v16.62a1.6 1.6 0 0 0 .47 1.14l.08.07 8.38-8.38v-.2l-.97-.87z" fill="#4285F4" />
          <path d="M24.37 21.24l-3.17-3.17v-.2l3.17-3.17.07.04 3.76 2.13c1.07.61 1.07 1.61 0 2.22l-3.76 2.13-.07.02z" fill="#FBBC04" />
          <path d="M24.44 21.22l-3.24-3.24-7.96 7.96c.35.38.93.42 1.59.05l9.61-4.77" fill="#EA4335" />
          <path d="M24.44 14.74l-9.61-4.77c-.66-.37-1.24-.33-1.59.05l7.96 7.96 3.24-3.24z" fill="#34A853" />
          <text x="38" y="15" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="0.03em">GET IT ON</text>
          <text x="38" y="28" fontSize="13" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fill="#fff" letterSpacing="-0.01em">Google Play</text>
        </g>
      </svg>
    </a>
  );
}

function WebAppBadge() {
  return (
    <Link
      to="/auth"
      className="inline-flex items-center no-underline"
    >
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#000" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g fill="#fff">
          <circle cx="22" cy="20" r="9" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <ellipse cx="22" cy="20" rx="4" ry="9" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <line x1="13" y1="20" x2="31" y2="20" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
          <text x="38" y="15" fontSize="8" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fill="rgba(255,255,255,0.8)" letterSpacing="0.03em">Available on the</text>
          <text x="38" y="28" fontSize="14" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" letterSpacing="-0.01em">Web</text>
        </g>
      </svg>
    </Link>
  );
}

export function LandingFooter() {
  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: '#111111' }} className="pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/app-icon.png" alt="Vet Claim Support" width={28} height={28} style={{ borderRadius: 6 }} />
              <span className="text-white font-semibold">Vet Claim Support</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#9CA3AF' }}>
              Secure VA claim preparation tools for veterans and service members.
            </p>
            {/* App Store Badges */}
            <div className="flex items-center gap-3">
              <AppStoreBadge />
              <GooglePlayBadge />
              <WebAppBadge />
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="bg-transparent border-none cursor-pointer text-sm p-0"
                      style={{ color: '#9CA3AF', transition: 'color 300ms ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm no-underline"
                      style={{ color: '#9CA3AF', transition: 'color 300ms ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm no-underline"
                      style={{ color: '#9CA3AF', transition: 'color 300ms ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                    >
                      {link.label}
                    </a>
                  ) : link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm no-underline"
                      style={{ color: '#9CA3AF', transition: 'color 300ms ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                    >
                      {link.label}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm no-underline"
                    style={{ color: '#9CA3AF', transition: 'color 300ms ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: '#374151' }}
        >
          <p className="text-xs" style={{ color: '#6B7280' }}>
            &copy; {new Date().getFullYear()} Vet Claim Support. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            Built with care by a veteran.
          </p>
        </div>

        {/* Required legal disclaimer per 38 CFR 14.629, 38 USC 5901 */}
        <p
          className="mt-6 text-center leading-relaxed"
          style={{
            color: 'rgba(255, 255, 255, 0.35)',
            fontSize: '12px',
          }}
        >
          Vet Claim Support is an evidence organization and claim preparation tool. It is not a law firm,
          accredited claims agent, or Veterans Service Organization (VSO). VCS does not file claims on your
          behalf, provide legal advice, or represent veterans before the VA. All claim filing decisions are
          made by you. For accredited representation, contact a VSO, VA-accredited attorney, or claims agent.
          Not affiliated with the U.S. Department of Veterans Affairs. Free VA-accredited Veterans Service
          Organizations (VSOs) are available at{' '}
          <a
            href="https://www.va.gov/vso"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'rgba(255, 255, 255, 0.35)', transition: 'color 300ms ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)')}
          >
            va.gov/vso
          </a>{' '}
          to help with claims filing.
        </p>
      </div>
    </footer>
  );
}
