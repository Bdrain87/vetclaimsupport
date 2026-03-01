import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/conditions';

const ROOT_TAB_ROUTES = ['/', '/app', '/claims', '/health', '/prep', '/settings'];

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/app': 'Dashboard',
  '/claims': 'My Claim',
  '/claims/strategy': 'Claim Preparation',
  '/claims/body-map': 'Body Map',
  '/claims/calculator': 'Rating Calculator',
  '/claims/bilateral': 'Bilateral Calculator',
  '/claims/secondary-finder': 'Secondary Finder',
  '/claims/checklist': 'Claim Checklist',
  '/claims/upgrade-paths': 'Rating Upgrade Paths',
  '/claims/vault': 'Documents',
  '/claims/deadlines': 'Deadline Tracker',
  '/claims/journey': 'Claim Journey',
  '/claims/itf': 'Intent to File',
  '/claims/timeline': 'Medical Timeline',
  '/health': 'Track',
  '/health/symptoms': 'Symptom Log',
  '/health/sleep': 'Sleep Log',
  '/health/migraines': 'Migraine Log',
  '/health/medications': 'Medications',
  '/health/visits': 'Medical Visits',
  '/health/exposures': 'Exposures',
  '/health/summary': '30-Day Summary',
  '/health/timeline': 'Health Timeline',
  '/prep': 'Tools',
  '/prep/exam': 'VA Exam Prep',
  '/prep/personal-statement': 'Personal Statement',
  '/prep/buddy-statement': 'Buddy Statement',
  '/prep/doctor-summary': 'Doctor Summary',
  '/prep/stressor': 'Stressor Statement',
  '/prep/form-guide': 'VA Form Guide',
  '/prep/dbq': 'DBQ Prep',
  '/prep/va-speak': 'VA-Speak Translator',
  '/prep/back-pay': 'Back Pay Estimator',
  '/prep/travel-pay': 'Travel Pay Calculator',
  '/prep/bdd-guide': 'Pre-Discharge Filing',
  '/prep/packet': 'Claim Packet',
  '/prep/appeals': 'Appeals Guide',
  '/prep/summary': 'Shareable Summary',
  '/prep/doctor-packet': 'Doctor Packet',
  '/prep/vso-packet': 'VSO Packet',
  '/prep/exam-day': 'Exam Day Checklist',
  '/settings': 'Me',
  '/settings/edit-profile': 'Edit Profile',
  '/settings/service-history': 'Service History',
  '/settings/timeline': 'Medical Timeline',
  '/settings/help': 'Help Center',
  '/settings/resources': 'VA Resources',
  '/settings/export-data': 'Export Data',
  '/settings/delete-account': 'Delete Account',
  '/settings/privacy': 'Privacy Policy',
  '/settings/terms': 'Terms of Service',
  '/settings/disclaimer': 'Disclaimer',
  '/settings/about': 'About VCS',
  '/settings/glossary': 'Glossary',
  '/settings/faq': 'FAQ',
  '/reference/conditions-by-conflict': 'Conditions by Conflict',
  '/reference/condition-guide': 'Condition Guide',
  '/reference/deployment-locations': 'Deployment Locations',
  '/cp-exam-packet': 'VA Exam Packet',
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

  const pageTitle = useMemo(() => {
    const staticLabel = pageLabels[location.pathname];
    if (staticLabel) return staticLabel;

    const conditionMatch = location.pathname.match(/^\/claims\/([^/]+)$/);
    if (!conditionMatch) return 'VCS';

    const condId = conditionMatch[1];
    const uc = userConditions.find((c) => c.id === condId);
    if (!uc) return 'Condition Detail';
    if (uc.displayName) return uc.displayName;

    const details = getConditionById(uc.conditionId);
    return details?.abbreviation || details?.name || 'Condition Detail';
  }, [location.pathname, userConditions]);

  const isRootTab = ROOT_TAB_ROUTES.includes(location.pathname);
  const isOnboarding = location.pathname === '/onboarding';

  if (isOnboarding) return null;

  return (
    <header
      className="shrink-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
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
            <span className="text-sm font-bold text-gold tracking-wider">VCS</span>
          )}
        </div>

        {/* Center: Page title */}
        <span className="font-semibold text-foreground text-sm truncate flex-1 text-center px-2">
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
