import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

import { MobileHeader } from './components/MobileHeader';
import { BottomTabBar } from './components/BottomTabBar';

import { ThemeProvider } from './context/ThemeContext';
import { TooltipProvider } from './components/ui/tooltip';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { LiabilityAcceptanceScreen } from './components/legal/LiabilityAcceptanceScreen';
import { SplashScreen } from './components/SplashScreen';
import { useProfileStore } from './store/useProfileStore';
import { migrateOldDataToAppStore } from './utils/migrateData';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { useHydration } from './hooks/useHydration';
import { Toaster } from './components/ui/toaster';
import { checkDataRetention } from './utils/dataRetention';
import { RetentionWarningBanner } from './components/RetentionWarningBanner';
import { AriaLiveAnnouncer } from './components/AriaLiveAnnouncer';
import { QuickAddFAB } from './components/QuickAddFAB';
import { OfflineIndicator } from './components/OfflineIndicator';
import { isWeb } from './lib/platform';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { PremiumGuard } from './components/PremiumGuard';
import { ensureFreshEntitlement } from './services/entitlements';
import { supabase } from './lib/supabase';

// Run migration before React renders (synchronous, runs once)
try {
  migrateOldDataToAppStore();
} catch (e) {
  console.error('Data migration failed:', e);
}

// Retry wrapper for lazy imports — when a deploy ships new chunk filenames,
// stale clients will 404 on old URLs. This catches that and forces a reload.
function lazyWithRetry(factory: () => Promise<{ default: React.ComponentType }>) {
  return lazy(() =>
    factory()
      .then((mod) => {
        // Chunk loaded successfully — clear any previous reload flag so future
        // failures can still trigger the one-time reload mechanism.
        sessionStorage.removeItem('chunk_reload');
        return mod;
      })
      .catch(() => {
        // If chunk load fails, force a full page reload to get new HTML + chunks.
        // Guard against infinite reload loops with a sessionStorage flag.
        const key = 'chunk_reload';
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          window.location.reload();
        }
        // If we already reloaded and still failing, throw to error boundary
        return factory();
      })
  );
}

// Lazy-loaded route components for code splitting
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Conditions = lazyWithRetry(() => import('./pages/Conditions'));
const ConditionDetail = lazyWithRetry(() => import('./pages/ConditionDetail'));
const SecondaryFinder = lazyWithRetry(() => import('./pages/SecondaryFinder'));
const BilateralCalculator = lazyWithRetry(() => import('./pages/BilateralCalculator'));
const ClaimChecklist = lazyWithRetry(() => import('./pages/ClaimChecklist'));
const ClaimStrategyWizard = lazyWithRetry(() => import('./pages/ClaimStrategyWizard'));
const Timeline = lazyWithRetry(() => import('./pages/Timeline'));
const UnifiedTimeline = lazyWithRetry(() => import('./pages/UnifiedTimeline'));
const Symptoms = lazyWithRetry(() => import('./pages/Symptoms'));
const Sleep = lazyWithRetry(() => import('./pages/Sleep'));
const Medications = lazyWithRetry(() => import('./pages/Medications'));
const Migraines = lazyWithRetry(() => import('./pages/Migraines'));
const MedicalVisits = lazyWithRetry(() => import('./pages/MedicalVisits'));
const Exposures = lazyWithRetry(() => import('./pages/Exposures'));
const BuddyStatements = lazyWithRetry(() => import('./pages/BuddyStatements'));
const DoctorSummaryOutline = lazyWithRetry(() => import('./pages/DoctorSummaryOutline'));
const DocumentsHub = lazyWithRetry(() => import('./pages/DocumentsHub'));
const CPExamPrepEnhanced = lazyWithRetry(() => import('./pages/CPExamPrepEnhanced'));
const DBQPrepSheet = lazyWithRetry(() => import('./pages/DBQPrepSheet'));
const VAResources = lazyWithRetry(() => import('./pages/VAResources'));
const ServiceHistory = lazyWithRetry(() => import('./pages/ServiceHistory'));
const Glossary = lazyWithRetry(() => import('./pages/Glossary'));
const SettingsPage = lazyWithRetry(() => import('./pages/Settings'));
const FAQ = lazyWithRetry(() => import('./pages/FAQ'));
const HelpCenter = lazyWithRetry(() => import('./pages/HelpCenter'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
const Onboarding = lazyWithRetry(() => import('./pages/Onboarding'));
const FormGuide = lazyWithRetry(() => import('./pages/FormGuide'));
const FormGuideDetail = lazyWithRetry(() => import('./pages/FormGuideDetail'));
const BuildPacket = lazyWithRetry(() => import('./pages/BuildPacket'));
const CPExamPacket = lazyWithRetry(() => import('./pages/CPExamPacket'));
const Combination = lazyWithRetry(() => import('./components/UnifiedRatingCalculator'));
const ClaimJourney = lazyWithRetry(() => import('./pages/ClaimJourney'));
const HealthLog = lazyWithRetry(() => import('./pages/HealthLog'));
// Hub pages
const HealthHub = lazyWithRetry(() => import('./pages/HealthHub'));
const PrepHub = lazyWithRetry(() => import('./pages/PrepHub'));
const AppealsGuide = lazyWithRetry(() => import('./pages/AppealsGuide'));

// Phase 15 new pages
const PersonalStatement = lazyWithRetry(() => import('./pages/PersonalStatement'));
const BodyMap = lazyWithRetry(() => import('./pages/BodyMap'));
const StressorStatement = lazyWithRetry(() => import('./pages/StressorStatement'));
const VASpeakTranslator = lazyWithRetry(() => import('./pages/VASpeakTranslator'));
const BackPayEstimator = lazyWithRetry(() => import('./pages/BackPayEstimator'));
const IntentToFile = lazyWithRetry(() => import('./pages/IntentToFile'));
const TravelPayCalculator = lazyWithRetry(() => import('./pages/TravelPayCalculator'));
const BDDGuide = lazyWithRetry(() => import('./pages/BDDGuide'));
const AboutVCS = lazyWithRetry(() => import('./pages/AboutVCS'));
const ConditionsByConflict = lazyWithRetry(() => import('./pages/ConditionsByConflict'));
const ConditionGuide = lazyWithRetry(() => import('./pages/ConditionGuide'));
const DeploymentLocations = lazyWithRetry(() => import('./pages/DeploymentLocations'));
const ZeroPercentOptimizer = lazyWithRetry(() => import('./pages/ZeroPercentOptimizer'));
const DeadlinesPage = lazyWithRetry(() => import('./pages/Deadlines'));
const ShareableSummary = lazyWithRetry(() => import('./pages/ShareableSummary'));

// Account & Legal pages
const DeleteAccountPage = lazyWithRetry(() => import('./pages/account/DeleteAccountPage'));
const ExportDataPage = lazyWithRetry(() => import('./pages/account/ExportDataPage'));
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazyWithRetry(() => import('./pages/legal/TermsOfServicePage'));
const DisclaimerPage = lazyWithRetry(() => import('./pages/legal/DisclaimerPage'));

// Landing page (web only)
const LandingPage = lazyWithRetry(() => import('./pages/LandingPage'));
const Login = lazyWithRetry(() => import('./pages/Login'));

// Auth page
const AuthPage = lazyWithRetry(() => import('./pages/AuthPage'));

function LoadingFallback() {
  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center"
      style={{ background: '#000000' }}
      role="status"
      aria-label="Loading application"
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <img
            src="/app-icon.png"
            alt=""
            width={80}
            height={80}
            style={{ borderRadius: 18, display: 'block' }}
          />
          <div
            className="absolute inset-0"
            style={{
              borderRadius: 18,
              border: '2px solid rgba(240, 200, 64, 0.3)',
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          />
        </div>
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold tracking-wide">Vet Claim Support</h1>
          <p className="text-white/40 text-xs mt-1">Get the rating you earned</p>
        </div>
        <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
          <div
            className="h-full rounded-full"
            style={{
              background: 'var(--gold-gradient, linear-gradient(90deg, #C8A020 0%, #ECC440 20%, #FFE566 50%, #ECC440 80%, #C8A020 100%))',
              animation: 'gradient-slide 1.2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function RedirectConditionToClaimsId() {
  const { id } = useParams();
  return <Navigate to={`/claims/${id}`} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function useFirstTimeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasOnboarded = useProfileStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    const isOnboardingPage = location.pathname === '/onboarding';
    const isLegalPage = ['/terms', '/privacy', '/disclaimer', '/settings/privacy', '/settings/terms', '/settings/disclaimer', '/profile/privacy', '/profile/terms', '/profile/disclaimer'].includes(location.pathname);
    const isLoginPage = location.pathname === '/login';

    if (!hasOnboarded && !isOnboardingPage && !isLegalPage && !isLoginPage) {
      navigate('/onboarding', { replace: true });
    }
  }, [location.pathname, navigate, hasOnboarded]);
}

function AnimatedRoutes() {
  const location = useLocation();

  useFirstTimeRedirect();
  useKeyboardShortcuts();

  return (
    <div key={location.pathname} className="animate-fade-in">
      <RouteErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location}>
          {/* === ROOT TABS === */}
          {isWeb ? (
            <Route path="/" element={<Navigate to="/app" replace />} />
          ) : (
            <Route path="/" element={<Dashboard />} />
          )}
          <Route path="/app" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          {/* === CLAIMS === */}
          <Route path="/claims" element={<Conditions />} />
          <Route path="/claims/strategy" element={<PremiumGuard featureName="Claim Strategy Wizard"><ClaimStrategyWizard /></PremiumGuard>} />
          <Route path="/claims/body-map" element={<PremiumGuard featureName="Body Map"><BodyMap /></PremiumGuard>} />
          <Route path="/claims/calculator" element={<Combination />} />
          <Route path="/claims/bilateral" element={<PremiumGuard featureName="Bilateral Calculator"><BilateralCalculator /></PremiumGuard>} />
          <Route path="/claims/secondary-finder" element={<PremiumGuard featureName="Secondary Condition Finder"><SecondaryFinder /></PremiumGuard>} />
          <Route path="/claims/checklist" element={<ClaimChecklist />} />
          <Route path="/claims/upgrade-paths" element={<ZeroPercentOptimizer />} />
          <Route path="/claims/:id" element={<ConditionDetail />} />

          {/* === HEALTH === */}
          <Route path="/health" element={<HealthHub />} />
          <Route path="/health/symptoms" element={<PremiumGuard featureName="Symptom Tracker"><Symptoms /></PremiumGuard>} />
          <Route path="/health/sleep" element={<PremiumGuard featureName="Sleep Tracker"><Sleep /></PremiumGuard>} />
          <Route path="/health/migraines" element={<PremiumGuard featureName="Migraine Tracker"><Migraines /></PremiumGuard>} />
          <Route path="/health/medications" element={<PremiumGuard featureName="Medication Tracker"><Medications /></PremiumGuard>} />
          <Route path="/health/visits" element={<PremiumGuard featureName="Medical Visits"><MedicalVisits /></PremiumGuard>} />
          <Route path="/health/exposures" element={<PremiumGuard featureName="Exposure Tracker"><Exposures /></PremiumGuard>} />
          <Route path="/health/summary" element={<PremiumGuard featureName="Health Summary"><HealthLog /></PremiumGuard>} />
          <Route path="/health/timeline" element={<PremiumGuard featureName="Health Timeline"><UnifiedTimeline /></PremiumGuard>} />

          {/* === PREP === */}
          <Route path="/prep" element={<PrepHub />} />
          <Route path="/prep/exam" element={<PremiumGuard featureName="C&P Exam Prep"><CPExamPrepEnhanced /></PremiumGuard>} />
          <Route path="/prep/personal-statement" element={<PremiumGuard featureName="Personal Statement Builder"><PersonalStatement /></PremiumGuard>} />
          <Route path="/prep/buddy-statement" element={<PremiumGuard featureName="Buddy Statement Builder"><BuddyStatements /></PremiumGuard>} />
          <Route path="/prep/doctor-summary" element={<PremiumGuard featureName="Doctor Summary Outline"><DoctorSummaryOutline /></PremiumGuard>} />
          <Route path="/prep/nexus-letter" element={<Navigate to="/prep/doctor-summary" replace />} />
          <Route path="/prep/stressor" element={<PremiumGuard featureName="Stressor Statement"><StressorStatement /></PremiumGuard>} />
          <Route path="/prep/form-guide" element={<FormGuide />} />
          <Route path="/prep/form-guide/:formId" element={<FormGuideDetail />} />
          <Route path="/prep/dbq" element={<PremiumGuard featureName="DBQ Prep Sheet"><DBQPrepSheet /></PremiumGuard>} />
          <Route path="/prep/va-speak" element={<VASpeakTranslator />} />
          <Route path="/prep/back-pay" element={<PremiumGuard featureName="Back Pay Estimator"><BackPayEstimator /></PremiumGuard>} />
          <Route path="/prep/travel-pay" element={<TravelPayCalculator />} />
          <Route path="/prep/bdd-guide" element={<BDDGuide />} />
          <Route path="/prep/packet" element={<PremiumGuard featureName="Claim Packet Builder"><BuildPacket /></PremiumGuard>} />
          <Route path="/prep/appeals" element={<PremiumGuard featureName="Appeals Guide"><AppealsGuide /></PremiumGuard>} />
          <Route path="/prep/summary" element={<ShareableSummary />} />
          <Route path="/cp-exam-packet" element={<CPExamPacket />} />

          {/* === REFERENCE === */}
          <Route path="/reference/conditions-by-conflict" element={<ConditionsByConflict />} />
          <Route path="/reference/condition-guide" element={<ConditionGuide />} />
          <Route path="/reference/deployment-locations" element={<DeploymentLocations />} />

          {/* === SETTINGS (formerly Profile) === */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/edit-profile" element={<SettingsPage />} />
          <Route path="/settings/service-history" element={<ServiceHistory />} />
          <Route path="/settings/vault" element={<PremiumGuard featureName="Document Vault"><DocumentsHub /></PremiumGuard>} />
          <Route path="/settings/journey" element={<ClaimJourney />} />
          <Route path="/settings/itf" element={<IntentToFile />} />
          <Route path="/settings/deadlines" element={<DeadlinesPage />} />
          <Route path="/settings/timeline" element={<Timeline />} />
          <Route path="/settings/help" element={<HelpCenter />} />
          <Route path="/settings/glossary" element={<Glossary />} />
          <Route path="/settings/resources" element={<VAResources />} />
          <Route path="/settings/faq" element={<FAQ />} />
          <Route path="/settings/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/settings/terms" element={<TermsOfServicePage />} />
          <Route path="/settings/disclaimer" element={<DisclaimerPage />} />
          <Route path="/settings/about" element={<AboutVCS />} />
          <Route path="/settings/export-data" element={<ExportDataPage />} />
          <Route path="/settings/delete-account" element={<DeleteAccountPage />} />

          {/* === REDIRECTS FROM OLD ROUTES === */}
          <Route path="/dashboard" element={<Navigate to={isWeb ? '/app' : '/'} replace />} />
          <Route path="/conditions" element={<Navigate to="/claims" replace />} />
          <Route path="/conditions/:id" element={<RedirectConditionToClaimsId />} />
          <Route path="/calculator" element={<Navigate to="/claims/calculator" replace />} />
          <Route path="/secondary-finder" element={<Navigate to="/claims/secondary-finder" replace />} />
          <Route path="/nexus-letter" element={<Navigate to="/prep/doctor-summary" replace />} />
          <Route path="/dbq-prep" element={<Navigate to="/prep/dbq" replace />} />
          <Route path="/cp-exam-prep" element={<Navigate to="/prep/exam" replace />} />
          <Route path="/claim-strategy" element={<Navigate to="/claims/strategy" replace />} />
          <Route path="/health-log" element={<Navigate to="/health/summary" replace />} />
          <Route path="/docs" element={<Navigate to="/settings/vault" replace />} />
          <Route path="/documents" element={<Navigate to="/settings/vault" replace />} />
          <Route path="/service-history" element={<Navigate to="/settings/service-history" replace />} />
          <Route path="/help" element={<Navigate to="/settings/help" replace />} />
          <Route path="/va-resources" element={<Navigate to="/settings/resources" replace />} />
          <Route path="/buddy-statements" element={<Navigate to="/prep/buddy-statement" replace />} />
          <Route path="/journey" element={<Navigate to="/settings/journey" replace />} />
          <Route path="/claim-journey" element={<Navigate to="/settings/journey" replace />} />
          <Route path="/checklist" element={<Navigate to="/claims/checklist" replace />} />
          <Route path="/claim-checklist" element={<Navigate to="/claims/checklist" replace />} />
          <Route path="/migraines" element={<Navigate to="/health/migraines" replace />} />
          <Route path="/exposures" element={<Navigate to="/health/exposures" replace />} />
          <Route path="/medical-visits" element={<Navigate to="/health/visits" replace />} />
          <Route path="/timeline" element={<Navigate to="/settings/timeline" replace />} />
          <Route path="/privacy" element={<Navigate to="/settings/privacy" replace />} />
          <Route path="/terms" element={<Navigate to="/settings/terms" replace />} />
          <Route path="/disclaimer" element={<Navigate to="/settings/disclaimer" replace />} />
          <Route path="/symptoms" element={<Navigate to="/health/symptoms" replace />} />
          <Route path="/sleep" element={<Navigate to="/health/sleep" replace />} />
          <Route path="/medications" element={<Navigate to="/health/medications" replace />} />
          <Route path="/health/body-map" element={<Navigate to="/claims/body-map" replace />} />
          <Route path="/body-map" element={<Navigate to="/claims/body-map" replace />} />
          <Route path="/bilateral-calculator" element={<Navigate to="/claims/bilateral" replace />} />
          <Route path="/exam-prep" element={<Navigate to="/prep/exam" replace />} />
          <Route path="/claim-tools" element={<Navigate to="/prep" replace />} />
          <Route path="/tools" element={<Navigate to="/prep" replace />} />
          <Route path="/tools/calculator" element={<Navigate to="/claims/calculator" replace />} />
          <Route path="/tools/secondary" element={<Navigate to="/claims/secondary-finder" replace />} />
          <Route path="/tools/secondary-finder" element={<Navigate to="/claims/secondary-finder" replace />} />
          <Route path="/tools/strategy" element={<Navigate to="/claims/strategy" replace />} />
          <Route path="/tools/body-map" element={<Navigate to="/claims/body-map" replace />} />
          <Route path="/tools/documents" element={<Navigate to="/claims/checklist" replace />} />
          <Route path="/tools/checklist" element={<Navigate to="/claims/checklist" replace />} />
          <Route path="/tools/export" element={<Navigate to="/prep/packet" replace />} />
          <Route path="/tools/packet" element={<Navigate to="/prep/packet" replace />} />
          <Route path="/tools/buddy-statement" element={<Navigate to="/prep/buddy-statement" replace />} />
          <Route path="/tools/nexus" element={<Navigate to="/prep/doctor-summary" replace />} />
          <Route path="/tools/nexus-letter" element={<Navigate to="/prep/doctor-summary" replace />} />
          <Route path="/tools/doctor-summary" element={<Navigate to="/prep/doctor-summary" replace />} />
          <Route path="/tools/personal-statement" element={<Navigate to="/prep/personal-statement" replace />} />
          <Route path="/tools/stressor" element={<Navigate to="/prep/stressor" replace />} />
          <Route path="/tools/exam" element={<Navigate to="/prep/exam" replace />} />
          <Route path="/tools/dbq" element={<Navigate to="/prep/dbq" replace />} />
          <Route path="/tools/va-speak" element={<Navigate to="/prep/va-speak" replace />} />
          <Route path="/tools/back-pay" element={<Navigate to="/prep/back-pay" replace />} />
          <Route path="/tools/travel-pay" element={<Navigate to="/prep/travel-pay" replace />} />
          <Route path="/tools/form-guide" element={<Navigate to="/prep/form-guide" replace />} />
          <Route path="/tools/appeals" element={<Navigate to="/prep/appeals" replace />} />
          <Route path="/tools/bdd-guide" element={<Navigate to="/prep/bdd-guide" replace />} />
          <Route path="/tools/bilateral" element={<Navigate to="/claims/bilateral" replace />} />
          <Route path="/tools/*" element={<Navigate to="/prep" replace />} />
          <Route path="/va-forms" element={<Navigate to="/prep/form-guide" replace />} />
          <Route path="/form-guide" element={<Navigate to="/prep/form-guide" replace />} />
          <Route path="/build-packet" element={<Navigate to="/prep/packet" replace />} />
          <Route path="/glossary" element={<Navigate to="/settings/glossary" replace />} />
          <Route path="/faq" element={<Navigate to="/settings/faq" replace />} />
          <Route path="/reference" element={<Navigate to="/settings/resources" replace />} />
          <Route path="/conditions-by-conflict" element={<Navigate to="/reference/conditions-by-conflict" replace />} />
          <Route path="/condition-guide" element={<Navigate to="/reference/condition-guide" replace />} />
          <Route path="/user-guide" element={<Navigate to="/settings/help" replace />} />

          {/* Backwards compat: old /profile/* routes → /settings/* */}
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route path="/profile/edit" element={<Navigate to="/settings/edit-profile" replace />} />
          <Route path="/profile/service-history" element={<Navigate to="/settings/service-history" replace />} />
          <Route path="/profile/vault" element={<Navigate to="/settings/vault" replace />} />
          <Route path="/profile/journey" element={<Navigate to="/settings/journey" replace />} />
          <Route path="/profile/itf" element={<Navigate to="/settings/itf" replace />} />
          <Route path="/profile/timeline" element={<Navigate to="/settings/timeline" replace />} />
          <Route path="/profile/settings" element={<Navigate to="/settings" replace />} />
          <Route path="/profile/help" element={<Navigate to="/settings/help" replace />} />
          <Route path="/profile/glossary" element={<Navigate to="/settings/glossary" replace />} />
          <Route path="/profile/resources" element={<Navigate to="/settings/resources" replace />} />
          <Route path="/profile/faq" element={<Navigate to="/settings/faq" replace />} />
          <Route path="/profile/privacy" element={<Navigate to="/settings/privacy" replace />} />
          <Route path="/profile/terms" element={<Navigate to="/settings/terms" replace />} />
          <Route path="/profile/disclaimer" element={<Navigate to="/settings/disclaimer" replace />} />
          <Route path="/profile/about" element={<Navigate to="/settings/about" replace />} />
          <Route path="/profile/export-data" element={<Navigate to="/settings/export-data" replace />} />
          <Route path="/profile/delete-account" element={<Navigate to="/settings/delete-account" replace />} />

          {/* === CATCH-ALL === */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </RouteErrorBoundary>
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'authed' | 'unauthed'>('loading');
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(session ? 'authed' : 'unauthed');
    }).catch(() => {
      setState('unauthed');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session ? 'authed' : 'unauthed');
    });
    return () => subscription.unsubscribe();
  }, []);

  if (state === 'loading') {
    return <LoadingFallback />;
  }

  if (state === 'unauthed') {
    sessionStorage.setItem('post_login_redirect', location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isLandingRoute = isWeb && location.pathname === '/';
  const isLoginRoute = location.pathname === '/login';
  const isAuthRoute = location.pathname === '/auth';

  if (isLandingRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    );
  }

  if (isLoginRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    );
  }

  if (isAuthRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AuthPage />
      </Suspense>
    );
  }

  // Free calculator — accessible without login
  if (location.pathname === '/calculator') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Combination />
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Create a free account to save your conditions, track health data, and access all 58 tools.
              </p>
              <a
                href="/auth"
                className="inline-block px-6 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-[#D4B030] transition-colors"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      </Suspense>
    );
  }

  // App shell — requires authentication on web
  const appShell = (
    <div className="h-screen overflow-hidden flex flex-row bg-background text-foreground break-words w-full max-w-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <LiabilityAcceptanceScreen />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <MobileHeader />
        <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden max-w-full">
          <OfflineIndicator />
          <AnimatedRoutes />
        </main>
        <QuickAddFAB />
        <BottomTabBar />
      </div>
    </div>
  );

  if (isWeb) {
    return <AuthGuard>{appShell}</AuthGuard>;
  }

  return appShell;
}

function App() {
  useSessionTimeout();
  const hydrated = useHydration();
  const [showSplash, setShowSplash] = useState(() => {
    if (isWeb && (window.location.pathname === '/' || window.location.pathname === '/auth')) return false;
    return true;
  });

  useEffect(() => {
    checkDataRetention();
  }, []);

  // Refresh entitlement on startup and auth state changes
  useEffect(() => {
    ensureFreshEntitlement();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        ensureFreshEntitlement();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <AriaLiveAnnouncer>
            {showSplash && (
              <SplashScreen
                onComplete={() => setShowSplash(false)}
                minimumDuration={1800}
                ready={hydrated}
              />
            )}
            <BrowserRouter>
              <ScrollToTop />
              <RetentionWarningBanner />
              <AppContent />
              <Toaster />
            </BrowserRouter>
          </AriaLiveAnnouncer>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
