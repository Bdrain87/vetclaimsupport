import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

import { MobileHeader } from './components/MobileHeader';
import { BottomTabBar } from './components/BottomTabBar';

import { ThemeProvider } from './context/ThemeContext';
import { TooltipProvider } from './components/ui/tooltip';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LiabilityAcceptanceScreen } from './components/legal/LiabilityAcceptanceScreen';
import { SplashScreen } from './components/SplashScreen';
import { useProfileStore } from './store/useProfileStore';
import { migrateOldDataToAppStore } from './utils/migrateData';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { useHydration } from './hooks/useHydration';
import { checkDataRetention } from './utils/dataRetention';
import { RetentionWarningBanner } from './components/RetentionWarningBanner';
import { isWeb } from './lib/platform';

// Run migration before React renders (synchronous, runs once)
try {
  migrateOldDataToAppStore();
} catch (e) {
  console.error('Data migration failed:', e);
}

// Lazy-loaded route components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Conditions = lazy(() => import('./pages/Conditions'));
const ConditionDetail = lazy(() => import('./pages/ConditionDetail'));
const SecondaryFinder = lazy(() => import('./pages/SecondaryFinder'));
const BilateralCalculator = lazy(() => import('./pages/BilateralCalculator'));
const ClaimChecklist = lazy(() => import('./pages/ClaimChecklist'));
const ClaimStrategyWizard = lazy(() => import('./pages/ClaimStrategyWizard'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Symptoms = lazy(() => import('./pages/Symptoms'));
const Sleep = lazy(() => import('./pages/Sleep'));
const Medications = lazy(() => import('./pages/Medications'));
const Migraines = lazy(() => import('./pages/Migraines'));
const MedicalVisits = lazy(() => import('./pages/MedicalVisits'));
const Exposures = lazy(() => import('./pages/Exposures'));
const BuddyStatements = lazy(() => import('./pages/BuddyStatements'));
const DoctorSummaryOutline = lazy(() => import('./pages/DoctorSummaryOutline'));
const DocumentsHub = lazy(() => import('./pages/DocumentsHub'));
const CPExamPrepEnhanced = lazy(() => import('./pages/CPExamPrepEnhanced'));
const DBQPrepSheet = lazy(() => import('./pages/DBQPrepSheet'));
const VAResources = lazy(() => import('./pages/VAResources'));
const ServiceHistory = lazy(() => import('./pages/ServiceHistory'));
const Glossary = lazy(() => import('./pages/Glossary'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const FAQ = lazy(() => import('./pages/FAQ'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const FormGuide = lazy(() => import('./pages/FormGuide'));
const FormGuideDetail = lazy(() => import('./pages/FormGuideDetail'));
const BuildPacket = lazy(() => import('./pages/BuildPacket'));
const CPExamPacket = lazy(() => import('./pages/CPExamPacket'));
const Combination = lazy(() => import('./components/UnifiedRatingCalculator'));
const ClaimJourney = lazy(() => import('./pages/ClaimJourney'));
const HealthLog = lazy(() => import('./pages/HealthLog'));
// Hub pages
const HealthHub = lazy(() => import('./pages/HealthHub'));
const PrepHub = lazy(() => import('./pages/PrepHub'));
const AppealsGuide = lazy(() => import('./pages/AppealsGuide'));

// Phase 15 new pages
const PersonalStatement = lazy(() => import('./pages/PersonalStatement'));
const BodyMap = lazy(() => import('./pages/BodyMap'));
const StressorStatement = lazy(() => import('./pages/StressorStatement'));
const VASpeakTranslator = lazy(() => import('./pages/VASpeakTranslator'));
const BackPayEstimator = lazy(() => import('./pages/BackPayEstimator'));
const IntentToFile = lazy(() => import('./pages/IntentToFile'));
const TravelPayCalculator = lazy(() => import('./pages/TravelPayCalculator'));
const BDDGuide = lazy(() => import('./pages/BDDGuide'));
const AboutVCS = lazy(() => import('./pages/AboutVCS'));
const ConditionsByConflict = lazy(() => import('./pages/ConditionsByConflict'));
const ConditionGuide = lazy(() => import('./pages/ConditionGuide'));

// Account & Legal pages
const DeleteAccountPage = lazy(() => import('./pages/account/DeleteAccountPage'));
const ExportDataPage = lazy(() => import('./pages/account/ExportDataPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage'));
const DisclaimerPage = lazy(() => import('./pages/legal/DisclaimerPage'));

// Landing page (web only)
const LandingPage = lazy(() => import('./pages/LandingPage'));

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
              border: '2px solid rgba(197, 164, 66, 0.3)',
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
              background: 'var(--gold-gradient, linear-gradient(135deg, #F5D680 0%, #C5A442 45%, #7A672A 100%))',
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

    if (!hasOnboarded && !isOnboardingPage && !isLegalPage) {
      navigate('/onboarding', { replace: true });
    }
  }, [location.pathname, navigate, hasOnboarded]);
}

function AnimatedRoutes() {
  const location = useLocation();

  useFirstTimeRedirect();

  return (
    <div key={location.pathname} className="animate-fade-in">
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

          {/* === CLAIMS === */}
          <Route path="/claims" element={<Conditions />} />
          <Route path="/claims/strategy" element={<ClaimStrategyWizard />} />
          <Route path="/claims/body-map" element={<BodyMap />} />
          <Route path="/claims/calculator" element={<Combination />} />
          <Route path="/claims/bilateral" element={<BilateralCalculator />} />
          <Route path="/claims/secondary-finder" element={<SecondaryFinder />} />
          <Route path="/claims/checklist" element={<ClaimChecklist />} />
          <Route path="/claims/:id" element={<ConditionDetail />} />

          {/* === HEALTH === */}
          <Route path="/health" element={<HealthHub />} />
          <Route path="/health/symptoms" element={<Symptoms />} />
          <Route path="/health/sleep" element={<Sleep />} />
          <Route path="/health/migraines" element={<Migraines />} />
          <Route path="/health/medications" element={<Medications />} />
          <Route path="/health/visits" element={<MedicalVisits />} />
          <Route path="/health/exposures" element={<Exposures />} />
          <Route path="/health/summary" element={<HealthLog />} />

          {/* === PREP === */}
          <Route path="/prep" element={<PrepHub />} />
          <Route path="/prep/exam" element={<CPExamPrepEnhanced />} />
          <Route path="/prep/personal-statement" element={<PersonalStatement />} />
          <Route path="/prep/buddy-statement" element={<BuddyStatements />} />
          <Route path="/prep/doctor-summary" element={<DoctorSummaryOutline />} />
          <Route path="/prep/nexus-letter" element={<Navigate to="/prep/doctor-summary" replace />} />
          <Route path="/prep/stressor" element={<StressorStatement />} />
          <Route path="/prep/form-guide" element={<FormGuide />} />
          <Route path="/prep/form-guide/:formId" element={<FormGuideDetail />} />
          <Route path="/prep/dbq" element={<DBQPrepSheet />} />
          <Route path="/prep/va-speak" element={<VASpeakTranslator />} />
          <Route path="/prep/back-pay" element={<BackPayEstimator />} />
          <Route path="/prep/travel-pay" element={<TravelPayCalculator />} />
          <Route path="/prep/bdd-guide" element={<BDDGuide />} />
          <Route path="/prep/packet" element={<BuildPacket />} />
          <Route path="/prep/appeals" element={<AppealsGuide />} />
          <Route path="/cp-exam-packet" element={<CPExamPacket />} />

          {/* === REFERENCE === */}
          <Route path="/reference/conditions-by-conflict" element={<ConditionsByConflict />} />
          <Route path="/reference/condition-guide" element={<ConditionGuide />} />

          {/* === SETTINGS (formerly Profile) === */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/edit-profile" element={<SettingsPage />} />
          <Route path="/settings/service-history" element={<ServiceHistory />} />
          <Route path="/settings/vault" element={<DocumentsHub />} />
          <Route path="/settings/journey" element={<ClaimJourney />} />
          <Route path="/settings/itf" element={<IntentToFile />} />
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
          <Route path="/bilateral-calculator" element={<Navigate to="/claims/bilateral" replace />} />
          <Route path="/exam-prep" element={<Navigate to="/prep/exam" replace />} />
          <Route path="/claim-tools" element={<Navigate to="/prep" replace />} />
          <Route path="/tools" element={<Navigate to="/prep" replace />} />
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
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isLandingRoute = isWeb && location.pathname === '/';
  // Web root — show landing page (users click through to /app)
  if (isLandingRoute) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LandingPage />
      </Suspense>
    );
  }

  // App shell
  return (
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
        <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatedRoutes />
        </main>
        <BottomTabBar />
      </div>
    </div>
  );
}

function App() {
  useSessionTimeout();
  const hydrated = useHydration();
  const [showSplash, setShowSplash] = useState(() => {
    // Skip splash on web landing page
    if (isWeb && window.location.pathname === '/') return false;
    return true;
  });

  useEffect(() => {
    checkDataRetention();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
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
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
