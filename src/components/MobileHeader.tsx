import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/vaConditions';

const ROOT_TAB_ROUTES = ['/', '/claims', '/health', '/prep', '/profile'];

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/claims': 'My Conditions',
  '/claims/strategy': 'Claim Strategy',
  '/claims/body-map': 'Body Map',
  '/claims/calculator': 'Rating Calculator',
  '/claims/bilateral': 'Bilateral Calculator',
  '/claims/secondary-finder': 'Secondary Finder',
  '/claims/checklist': 'Claim Checklist',
  '/health': 'Health Tracking',
  '/health/symptoms': 'Symptom Log',
  '/health/sleep': 'Sleep Log',
  '/health/migraines': 'Migraine Log',
  '/health/medications': 'Medications',
  '/health/visits': 'Medical Visits',
  '/health/exposures': 'Exposures',
  '/health/summary': '30-Day Summary',
  '/prep': 'Claim Prep',
  '/prep/exam': 'C&P Exam Prep',
  '/prep/personal-statement': 'Personal Statement',
  '/prep/buddy-statement': 'Buddy Statement',
  '/prep/nexus-letter': 'Nexus Letter',
  '/prep/stressor': 'Stressor Statement',
  '/prep/form-guide': 'VA Form Guide',
  '/prep/dbq': 'DBQ Prep',
  '/prep/va-speak': 'VA-Speak',
  '/prep/back-pay': 'Back Pay',
  '/prep/packet': 'Claim Packet',
  '/profile': 'Profile',
  '/profile/edit': 'Edit Profile',
  '/profile/service-history': 'Service History',
  '/profile/vault': 'Documents',
  '/profile/journey': 'Claim Journey',
  '/profile/itf': 'Intent to File',
  '/profile/timeline': 'Medical Timeline',
  '/profile/settings': 'Settings',
  '/profile/help': 'Help Center',
  '/profile/resources': 'VA Resources',
  '/profile/export-data': 'Export Data',
  '/profile/delete-account': 'Delete Account',
  '/profile/privacy': 'Privacy Policy',
  '/profile/terms': 'Terms of Service',
  '/profile/disclaimer': 'Disclaimer',
  '/profile/about': 'About VCS',
  '/profile/glossary': 'Glossary',
  '/profile/faq': 'FAQ',
};

function getParentRoute(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return '/';
  return '/' + segments[0];
}

export function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const userConditions = useAppStore((s) => s.userConditions);

  const isRootTab = ROOT_TAB_ROUTES.includes(location.pathname);
  const isOnboarding = location.pathname === '/onboarding';

  if (isOnboarding) return null;

  let pageTitle = pageLabels[location.pathname];
  if (!pageTitle) {
    const conditionMatch = location.pathname.match(/^\/claims\/([^/]+)$/);
    if (conditionMatch) {
      const condId = conditionMatch[1];
      const uc = userConditions.find((c) => c.id === condId);
      if (uc) {
        const details = getConditionById(uc.conditionId);
        pageTitle = details?.abbreviation || details?.name || 'Condition Detail';
      } else {
        pageTitle = 'Condition Detail';
      }
    } else {
      pageTitle = 'VCS';
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex items-center justify-between px-3 h-14">
        {/* Left: Back button or VCS logo */}
        <div className="w-12 flex items-center justify-start">
          {!isRootTab ? (
            <button
              onClick={() => navigate(getParentRoute(location.pathname))}
              className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          ) : (
            <span className="text-sm font-bold text-amber-500 tracking-wider">VCS</span>
          )}
        </div>

        {/* Center: Page title */}
        <span className="font-semibold text-foreground text-sm truncate max-w-[200px]">
          {pageTitle}
        </span>

        {/* Right: Theme toggle */}
        <div className="w-12 flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
