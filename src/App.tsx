import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { MobileHeader } from './components/MobileHeader';
import { BottomTabBar } from './components/BottomTabBar';

import { ThemeProvider } from './context/ThemeContext';
import { TooltipProvider } from './components/ui/tooltip';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { LiabilityAcceptanceScreen } from './components/legal/LiabilityAcceptanceScreen';
import { SplashScreen } from './components/SplashScreen';

import { useProfileStore } from './store/useProfileStore';
import useAppStore from './store/useAppStore';
import { migrateOldDataToAppStore } from './utils/migrateData';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { useHydration } from './hooks/useHydration';
import { Toaster } from './components/ui/toaster';
import { checkDataRetention } from './utils/dataRetention';
import { RetentionWarningBanner } from './components/RetentionWarningBanner';
import { AriaLiveAnnouncer } from './components/AriaLiveAnnouncer';
import { QuickAddFAB } from './components/QuickAddFAB';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OfflineIndicator } from './components/OfflineIndicator';
import { isWeb } from './lib/platform';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { PremiumGuard } from './components/PremiumGuard';
import { ensureFreshEntitlement } from './services/entitlements';
import { startSync, stopSync } from './services/syncEngine';
import { supabase, getSharedSession } from './lib/supabase';
import { logger } from './utils/logger';
import { initNativeOAuthListener } from './lib/nativeOAuth';
import { initializePurchases, loginPurchases, logoutPurchases } from './services/iap';
import { scheduleDeadlineNotifications } from './services/notifications';

// Initialize native OAuth deep-link listener (no-op on web)
initNativeOAuthListener().catch(() => {});

// Run migration before React renders (synchronous, runs once)
try {
  migrateOldDataToAppStore();
} catch (e) {
  logger.error('Data migration failed:', e);
}

// Retry wrapper for lazy imports — waits 1 second then retries once before
// throwing to the error boundary. Handles transient network blips gracefully.
const lazyWithRetry = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  return lazy(() =>
    importFn().catch(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return importFn();
    })
  );
};

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
const ExamDayMode = lazyWithRetry(() => import('./pages/ExamDayMode'));
const Combination = lazyWithRetry(() => import('./components/UnifiedRatingCalculator'));
const ClaimJourney = lazyWithRetry(() => import('./pages/ClaimJourney'));
const HealthLog = lazyWithRetry(() => import('./pages/HealthLog'));
const WorkImpact = lazyWithRetry(() => import('./pages/WorkImpact'));
const HealthTrends = lazyWithRetry(() => import('./pages/HealthTrends'));
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
const CostEstimator = lazyWithRetry(() => import('./pages/CostEstimator'));
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
const EvidenceStrength = lazyWithRetry(() => import('./pages/EvidenceStrength'));
const DecisionDecoder = lazyWithRetry(() => import('./pages/DecisionDecoder'));
const VSOPacket = lazyWithRetry(() => import('./pages/VSOPacket'));
const DoctorPacket = lazyWithRetry(() => import('./pages/DoctorPacket'));

// Sprint 3-5 new pages
const MedicationRuleTool = lazyWithRetry(() => import('./pages/MedicationRuleTool'));
const CompensationLadder = lazyWithRetry(() => import('./pages/CompensationLadder'));
const NexusGuide = lazyWithRetry(() => import('./pages/NexusGuide'));
const TDIUChecker = lazyWithRetry(() => import('./pages/TDIUChecker'));
const BenefitsDiscovery = lazyWithRetry(() => import('./pages/BenefitsDiscovery'));
const BuddyFillPage = lazyWithRetry(() => import('./pages/BuddyFillPage'));

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
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-3xl border border-white/10 backdrop-blur-3xl text-center"
      >
        <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <p className="mt-6 text-white font-semibold tracking-[3px] text-xl">
          HONORING YOUR SERVICE…
        </p>
        <p className="text-white/70 text-sm mt-2">Loading Vet Claim Support</p>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-10" />
      </motion.div>
    </div>
  );
}

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-10 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl text-center max-w-sm"
      >
        <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <p className="mt-6 text-white font-semibold tracking-[3px] text-xl">
          HONORING YOUR SERVICE…
        </p>
        <p className="text-white/70 text-sm mt-2">Building your unbreakable claim packet</p>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-10" />
      </motion.div>
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
    // Move focus to the first h1 so screen readers announce the new page
    const heading = document.querySelector('h1');
    if (heading instanceof HTMLElement) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}

/** Register the router's navigate function for deep link handling. */
function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    import('@/utils/capacitor').then(({ setDeepLinkNavigator }) => {
      setDeepLinkNavigator((path: string) => navigate(path));
    });
  }, [navigate]);

  return null;
}

function useFirstTimeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasOnboarded = useProfileStore((s) => s.hasCompletedOnboarding);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // Check for an existing auth session on mount AND subscribe to changes.
  // Returning users who are signed in should NOT be forced through onboarding
  // even if local store hasn't rehydrated yet — their profile (with
  // onboarding_completed: true) will sync from Supabase momentarily.
  // We also listen for SIGNED_IN so that if the user signs in after mount
  // (e.g. on native where the app shell is already rendered), hasSession
  // updates immediately and we don't redirect them back to onboarding.
  useEffect(() => {
    getSharedSession().then((session) => {
      setHasSession(!!session);
      setSessionChecked(true);
    }).catch(() => {
      setSessionChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
      setSessionChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Don't redirect until the profile store has hydrated — otherwise the
    // default `hasCompletedOnboarding: false` triggers a false-positive
    // redirect to onboarding on every app launch (especially native iOS
    // where encrypted storage rehydration is async).
    if (!useProfileStore.persist.hasHydrated()) return;
    if (!sessionChecked) return;

    // If user has an active session, they're a returning user — skip onboarding
    // redirect. Their profile will sync and restore hasCompletedOnboarding.
    if (hasSession) return;

    const isOnboardingPage = location.pathname === '/onboarding';
    const isLegalPage = ['/terms', '/privacy', '/disclaimer', '/settings/privacy', '/settings/terms', '/settings/disclaimer', '/profile/privacy', '/profile/terms', '/profile/disclaimer'].includes(location.pathname);
    const isLoginPage = location.pathname === '/login';
    const isAuthPage = location.pathname === '/auth';

    if (!hasOnboarded && !isOnboardingPage && !isLegalPage && !isLoginPage && !isAuthPage) {
      navigate('/onboarding', { replace: true });
    }
  }, [location.pathname, navigate, hasOnboarded, sessionChecked, hasSession]);
}

function AnimatedRoutes() {
  const location = useLocation();

  useFirstTimeRedirect();
  useKeyboardShortcuts();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full"
      >
        <RouteErrorBoundary>
          <Suspense fallback={<RouteLoadingFallback />}>
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
          <Route path="/auth" element={<AuthPage />} />

          {/* === CLAIMS === */}
          <Route path="/claims" element={<Conditions />} />
          <Route path="/claims/vault" element={<PremiumGuard featureName="Document Vault"><DocumentsHub /></PremiumGuard>} />
          <Route path="/claims/deadlines" element={<DeadlinesPage />} />
          <Route path="/claims/journey" element={<ClaimJourney />} />
          <Route path="/claims/itf" element={<IntentToFile />} />
          <Route path="/claims/timeline" element={<Timeline />} />
          <Route path="/claims/strategy" element={<PremiumGuard featureName="Claim Strategy Wizard"><ClaimStrategyWizard /></PremiumGuard>} />
          <Route path="/claims/body-map" element={<PremiumGuard featureName="Body Map"><BodyMap /></PremiumGuard>} />
          <Route path="/claims/calculator" element={<Combination />} />
          <Route path="/claims/bilateral" element={<PremiumGuard featureName="Bilateral Calculator"><BilateralCalculator /></PremiumGuard>} />
          <Route path="/claims/secondary-finder" element={<PremiumGuard featureName="Secondary Condition Finder"><SecondaryFinder /></PremiumGuard>} />
          <Route path="/claims/checklist" element={<ClaimChecklist />} />
          <Route path="/claims/upgrade-paths" element={<ZeroPercentOptimizer />} />
          <Route path="/claims/evidence-strength" element={<PremiumGuard featureName="Evidence Strength"><EvidenceStrength /></PremiumGuard>} />
          <Route path="/claims/decision-decoder" element={<PremiumGuard featureName="Decision Decoder"><DecisionDecoder /></PremiumGuard>} />
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
          <Route path="/health/work-impact" element={<PremiumGuard featureName="Work Impact"><WorkImpact /></PremiumGuard>} />
          <Route path="/health/trends" element={<PremiumGuard featureName="Health Trends"><HealthTrends /></PremiumGuard>} />

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
          <Route path="/prep/cost-estimate" element={<CostEstimator />} />
          <Route path="/prep/travel-pay" element={<TravelPayCalculator />} />
          <Route path="/prep/bdd-guide" element={<BDDGuide />} />
          <Route path="/prep/packet" element={<PremiumGuard featureName="Claim Packet Builder"><BuildPacket /></PremiumGuard>} />
          <Route path="/prep/appeals" element={<PremiumGuard featureName="Appeals Guide"><AppealsGuide /></PremiumGuard>} />
          <Route path="/prep/summary" element={<ShareableSummary />} />
          <Route path="/prep/vso-packet" element={<PremiumGuard featureName="VSO Packet"><VSOPacket /></PremiumGuard>} />
          <Route path="/prep/doctor-packet" element={<PremiumGuard featureName="Doctor Packet"><DoctorPacket /></PremiumGuard>} />
          <Route path="/prep/nexus-guide" element={<NexusGuide />} />
          <Route path="/prep/exam-day" element={<ExamDayMode />} />
          <Route path="/prep/exam-packet" element={<CPExamPacket />} />
          <Route path="/prep/medication-rule" element={<MedicationRuleTool />} />
          <Route path="/prep/compensation" element={<CompensationLadder />} />
          <Route path="/prep/tdiu" element={<TDIUChecker />} />
          <Route path="/prep/benefits" element={<BenefitsDiscovery />} />
          <Route path="/cp-exam-packet" element={<Navigate to="/prep/exam-day" replace />} />

          {/* === REFERENCE === */}
          <Route path="/reference/conditions-by-conflict" element={<ConditionsByConflict />} />
          <Route path="/reference/condition-guide" element={<ConditionGuide />} />
          <Route path="/reference/deployment-locations" element={<DeploymentLocations />} />

          {/* === SETTINGS (formerly Profile) === */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/edit-profile" element={<SettingsPage />} />
          <Route path="/settings/service-history" element={<ServiceHistory />} />
          <Route path="/settings/vault" element={<Navigate to="/claims/vault" replace />} />
          <Route path="/settings/journey" element={<Navigate to="/claims/journey" replace />} />
          <Route path="/settings/itf" element={<Navigate to="/claims/itf" replace />} />
          <Route path="/settings/deadlines" element={<Navigate to="/claims/deadlines" replace />} />
          <Route path="/settings/timeline" element={<Navigate to="/claims/timeline" replace />} />
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

          {/* === PUBLIC (no auth) === */}
          <Route path="/buddy/fill/:token" element={<BuddyFillPage />} />

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
          <Route path="/docs" element={<Navigate to="/claims/vault" replace />} />
          <Route path="/documents" element={<Navigate to="/claims/vault" replace />} />
          <Route path="/service-history" element={<Navigate to="/settings/service-history" replace />} />
          <Route path="/help" element={<Navigate to="/settings/help" replace />} />
          <Route path="/va-resources" element={<Navigate to="/settings/resources" replace />} />
          <Route path="/buddy-statements" element={<Navigate to="/prep/buddy-statement" replace />} />
          <Route path="/journey" element={<Navigate to="/claims/journey" replace />} />
          <Route path="/claim-journey" element={<Navigate to="/claims/journey" replace />} />
          <Route path="/checklist" element={<Navigate to="/claims/checklist" replace />} />
          <Route path="/claim-checklist" element={<Navigate to="/claims/checklist" replace />} />
          <Route path="/migraines" element={<Navigate to="/health/migraines" replace />} />
          <Route path="/exposures" element={<Navigate to="/health/exposures" replace />} />
          <Route path="/medical-visits" element={<Navigate to="/health/visits" replace />} />
          <Route path="/timeline" element={<Navigate to="/claims/timeline" replace />} />
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
          <Route path="/profile/vault" element={<Navigate to="/claims/vault" replace />} />
          <Route path="/profile/journey" element={<Navigate to="/claims/journey" replace />} />
          <Route path="/profile/itf" element={<Navigate to="/claims/itf" replace />} />
          <Route path="/profile/timeline" element={<Navigate to="/claims/timeline" replace />} />
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
      </motion.div>
    </AnimatePresence>
  );
}

function SentinelFAB() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);
    setResponse('');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(query);
      setResponse(result.response.text());
    } catch {
      setResponse('Error: Could not get response from Gemini. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-20 right-4 z-50"
        >
          <Button
            variant="outline"
            className="rounded-full p-4 bg-indigo-950/80 border-white/20 backdrop-blur-md shadow-lg"
          >
            <span className="text-white font-bold tracking-wide">Sentinel AI</span>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="glass-card bg-slate-950/90 border-white/10 backdrop-blur-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">Ask Sentinel AI (Gemini Flash)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about VA claims, symptoms, etc."
            className="bg-slate-800/50 text-white border-white/20"
          />
          <Button onClick={handleAsk} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-500">
            {loading ? 'Asking...' : 'Ask Gemini'}
          </Button>
          {response && <p className="text-white/90 p-4 bg-slate-800/50 rounded-lg">{response}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'authed' | 'unauthed'>('loading');
  const location = useLocation();

  useEffect(() => {
    // Safety timeout — if getSession() hangs (Keychain / Capacitor bridge),
    // fall through to unauthed so the user isn't stuck on a black screen.
    const timeout = setTimeout(() => {
      setState((prev) => (prev === 'loading' ? 'unauthed' : prev));
    }, 8_000);

    getSharedSession().then((session) => {
      clearTimeout(timeout);
      setState(session ? 'authed' : 'unauthed');
    }).catch(() => {
      clearTimeout(timeout);
      setState('unauthed');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session ? 'authed' : 'unauthed');
    });
    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
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

  // Public buddy fill page — no auth required
  if (location.pathname.startsWith('/buddy/fill/')) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <BuddyFillPage />
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
                Create a free account to save your conditions, track health data, and access all 50+ tools.
              </p>
              <Link
                to="/auth"
                className="inline-block px-6 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-[#B59847] transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </Suspense>
    );
  }

  // App shell — requires authentication on web
  const appShell = (
    <div className="h-[100dvh] overflow-hidden flex flex-row bg-background text-foreground break-words w-full max-w-full">
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
        <SentinelFAB />
        <BottomTabBar />
      </div>
    </div>
  );

  return <AuthGuard>{appShell}</AuthGuard>;
}

function App() {
  useSessionTimeout();
  const hydrated = useHydration();
  const [showSplash, setShowSplash] = useState(() => {
    if (isWeb && (window.location.pathname === '/' || window.location.pathname === '/auth')) return false;
    return true;
  });
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    checkDataRetention();
  }, []);

  // Initialize IAP on native platform boot + refresh entitlement and sync.
  useEffect(() => {
    // Initialize IAP (no-op on web, safe to call early)
    initializePurchases().catch(() => {});

    // Reschedule push notifications on every app launch
    const profileState = useProfileStore.getState();
    const appState = useAppStore.getState();
    scheduleDeadlineNotifications({
      intentToFileDate: profileState.intentToFileDate,
      separationDate: profileState.separationDate,
      deadlines: (appState.deadlines ?? [])
        .filter((d: { completed?: boolean }) => !d.completed)
        .map((d: { title: string; dueDate: string }) => ({ title: d.title, dueDate: d.dueDate })),
    }).catch(() => {});

    getSharedSession().then((session) => {
      if (session) {
        ensureFreshEntitlement().catch(() => {});
        startSync();
        loginPurchases(session.user.id).catch(() => {});
      }
    }).catch(() => {});

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        ensureFreshEntitlement().catch(() => {});
        startSync();
        if (session) loginPurchases(session.user.id).catch(() => {});
      }
      if (event === 'SIGNED_OUT') {
        stopSync();
        logoutPurchases().catch(() => {});
      }
    });
    return () => {
      subscription.unsubscribe();
      stopSync();
    };
  }, []);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <TooltipProvider>
          <AriaLiveAnnouncer>
            {showSplash && (
              <SplashScreen
                onComplete={handleSplashComplete}
                minimumDuration={2000}
                ready={hydrated}
              />
            )}
            <BrowserRouter>
              <ScrollToTop />
              <DeepLinkHandler />
              <RetentionWarningBanner />
              {hydrated ? <AppContent /> : <LoadingFallback />}
              <Toaster />
            </BrowserRouter>
          </AriaLiveAnnouncer>
        </TooltipProvider>
      </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
