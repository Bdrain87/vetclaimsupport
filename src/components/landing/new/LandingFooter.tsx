import { Link } from 'react-router-dom';

const PRODUCT_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Launch App', to: '/app' },
];

const RESOURCE_LINKS = [
  { label: 'VA.gov', href: 'https://www.va.gov/', external: true },
  { label: 'FAQ', to: '/app/settings/faq' },
  { label: 'Privacy Policy', to: '/app/settings/privacy' },
  { label: 'Terms of Service', to: '/app/settings/terms' },
];

const COMPANY_LINKS = [
  { label: 'About', to: '/app/settings/about' },
];

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
            <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>
              Privacy-first VA claim preparation tools for veterans and service members.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <button
                      onClick={() => scrollTo(link.href!)}
                      className="bg-transparent border-none cursor-pointer text-sm hover:text-[#BF953F] transition-colors p-0"
                      style={{ color: '#9CA3AF' }}
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.to!}
                      className="text-sm no-underline hover:text-[#BF953F] transition-colors"
                      style={{ color: '#9CA3AF' }}
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
                      className="text-sm no-underline hover:text-[#BF953F] transition-colors"
                      style={{ color: '#9CA3AF' }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to!}
                      className="text-sm no-underline hover:text-[#BF953F] transition-colors"
                      style={{ color: '#9CA3AF' }}
                    >
                      {link.label}
                    </Link>
                  )}
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
                    className="text-sm no-underline hover:text-[#BF953F] transition-colors"
                    style={{ color: '#9CA3AF' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
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

        {/* Legal disclaimer — required */}
        <p className="text-xs mt-6 text-center leading-relaxed" style={{ color: '#4B5563' }}>
          Vet Claim Support is an educational and organizational tool and is NOT affiliated with,
          endorsed by, or connected to the U.S. Department of Veterans Affairs or any government agency.
          VCS is NOT a VA-accredited representative, attorney, claims agent, or Veterans Service Organization (VSO).
          VCS does NOT provide legal advice, medical advice, or professional claims filing services.
          VCS does NOT file claims on your behalf and does NOT guarantee any claim outcomes.
          AI-generated content may contain errors and must be independently verified.
          Free VA-accredited Veterans Service Organizations (VSOs) are available at va.gov/vso to help with claims filing.
        </p>
      </div>
    </footer>
  );
}
