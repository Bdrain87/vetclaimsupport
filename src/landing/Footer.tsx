import { Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#000000] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Vet Claim Support</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Professional-grade VA claim preparation. Built by veterans, for veterans.
            </p>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/settings/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/settings/terms" className="text-sm text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/settings/disclaimer" className="text-sm text-white/60 hover:text-white transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/settings/faq" className="text-sm text-white/60 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/settings/help" className="text-sm text-white/60 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources & Guides
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/settings/resources" className="text-sm text-white/60 hover:text-white transition-colors">
                  VA Resources
                </a>
              </li>
              <li>
                <a href="/settings/help" className="text-sm text-white/60 hover:text-white transition-colors">
                  User Guide
                </a>
              </li>
              <li>
                <a
                  href="https://www.va.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  VA.gov
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40 text-center md:text-left">
              © {currentYear} Vet Claim Support. All rights reserved.
            </p>
            <p className="text-xs text-white/40 text-center md:text-right max-w-lg">
              Not affiliated with or endorsed by the U.S. Department of Veterans Affairs.
              This app is not a substitute for professional legal or medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
