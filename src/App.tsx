import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { BottomTabBar } from './components/BottomTabBar';
import { ThemeProvider } from './context/ThemeContext';
import { TooltipProvider } from './components/ui/tooltip';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useProfileStore } from './store/useProfileStore';
import { migrateOldDataToAppStore } from './utils/migrateData';

// Run migration before React renders (synchronous, runs once)
migrateOldDataToAppStore();

// Lazy-loaded route components for code splitting
const Landing = lazy(() =>
  import('./pages/Landing').then((mod) => ({ default: mod.Landing }))
);
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Conditions = lazy(() => import('./pages/Conditions'));
const ConditionDetail = lazy(() => import('./pages/ConditionDetail'));
const ConditionGuide = lazy(() => import('./pages/ConditionGuide'));
const ConditionsByConflict = lazy(() => import('./pages/ConditionsByConflict'));
const SecondaryFinder = lazy(() => import('./pages/SecondaryFinder'));
const BilateralCalculator = lazy(() => import('./pages/BilateralCalculator'));
const ClaimChecklist = lazy(() => import('./pages/ClaimChecklist'));
const ClaimJourney = lazy(() => import('./pages/ClaimJourney'));
const ClaimStrategyWizard = lazy(() => import('./pages/ClaimStrategyWizard'));
const ClaimTools = lazy(() => import('./pages/ClaimTools'));
const Timeline = lazy(() => import('./pages/Timeline'));
const HealthLog = lazy(() => import('./pages/HealthLog'));
const Symptoms = lazy(() => import('./pages/Symptoms'));
const Sleep = lazy(() => import('./pages/Sleep'));
const Medications = lazy(() => import('./pages/Medications'));
const Migraines = lazy(() => import('./pages/Migraines'));
const MedicalVisits = lazy(() => import('./pages/MedicalVisits'));
const Exposures = lazy(() => import('./pages/Exposures'));
const BuddyStatements = lazy(() => import('./pages/BuddyStatements'));
const NexusLetterGenerator = lazy(() => import('./pages/NexusLetterGenerator'));
const DocumentsHub = lazy(() => import('./pages/DocumentsHub'));
const ExamPrep = lazy(() => import('./pages/ExamPrep'));
const CPExamPrepEnhanced = lazy(() => import('./pages/CPExamPrepEnhanced'));
const DBQPrepSheet = lazy(() => import('./pages/DBQPrepSheet'));
const VAForms = lazy(() => import('./pages/VAForms'));
const VAResources = lazy(() => import('./pages/VAResources'));
const ServiceHistory = lazy(() => import('./pages/ServiceHistory'));
const Reference = lazy(() => import('./pages/Reference'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Settings = lazy(() => import('./pages/Settings'));
const FAQ = lazy(() => import('./pages/FAQ'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const UserGuide = lazy(() => import('./pages/UserGuide'));
const AppStorePreview = lazy(() => import('./pages/AppStorePreview'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const FormGuide = lazy(() => import('./pages/FormGuide'));
const BuildPacket = lazy(() => import('./pages/BuildPacket'));
const Combination = lazy(() => import('./components/UnifiedRatingCalculator'));

// Account & Legal pages
const DeleteAccountPage = lazy(() => import('./pages/account/DeleteAccountPage'));
const ExportDataPage = lazy(() => import('./pages/account/ExportDataPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage'));
const DisclaimerPage = lazy(() => import('./pages/legal/DisclaimerPage'));

function LoadingFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#102039]">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Gold V Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C8A628] to-[#B8960F] flex items-center justify-center shadow-lg shadow-[#C8A628]/20">
            <span className="text-[#102039] text-4xl font-bold">V</span>
          </div>
          {/* Subtle pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-[#C8A628]/30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Brand text */}
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold tracking-wide">VCS</h1>
          <p className="text-white/40 text-xs mt-1">Claim Preparation Tools</p>
        </div>

        {/* Loading bar */}
        <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#C8A628] rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function useFirstTimeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasOnboarded = useProfileStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    const isOnboardingPage = location.pathname === '/onboarding';
    const isLandingPage = location.pathname === '/';
    const isLegalPage = ['/terms', '/privacy', '/disclaimer', '/profile/privacy', '/profile/terms', '/profile/disclaimer'].includes(location.pathname);

    if (!hasOnboarded && !isOnboardingPage && !isLandingPage && !isLegalPage) {
      navigate('/onboarding', { replace: true });
    }
  }, [location.pathname, navigate, hasOnboarded]);
}

function AnimatedRoutes() {
  const location = useLocation();

  useFirstTimeRedirect();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            {/* Landing — hero goes behind fixed navbar */}
            <Route path="/" element={<Landing />} />

            {/* Onboarding — no navbar needed, fullscreen */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* All inner pages — navbar is relative, no padding needed */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/conditions/:id" element={<ConditionDetail />} />
            <Route path="/condition-guide" element={<ConditionGuide />} />
            <Route path="/conditions-by-conflict" element={<ConditionsByConflict />} />
            <Route path="/secondary-finder" element={<SecondaryFinder />} />
            <Route path="/bilateral-calculator" element={<BilateralCalculator />} />
            <Route path="/claim-checklist" element={<ClaimChecklist />} />
            <Route path="/claim-journey" element={<ClaimJourney />} />
            <Route path="/claim-strategy" element={<ClaimStrategyWizard />} />
            <Route path="/claim-tools" element={<ClaimTools />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/health-log" element={<HealthLog />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/migraines" element={<Migraines />} />
            <Route path="/medical-visits" element={<MedicalVisits />} />
            <Route path="/exposures" element={<Exposures />} />
            <Route path="/buddy-statements" element={<BuddyStatements />} />
            <Route path="/nexus-letter" element={<NexusLetterGenerator />} />
            <Route path="/documents" element={<DocumentsHub />} />
            <Route path="/exam-prep" element={<ExamPrep />} />
            <Route path="/cp-exam-prep" element={<CPExamPrepEnhanced />} />
            <Route path="/dbq-prep" element={<DBQPrepSheet />} />
            <Route path="/va-forms" element={<VAForms />} />
            <Route path="/va-resources" element={<VAResources />} />
            <Route path="/service-history" element={<ServiceHistory />} />
            <Route path="/reference" element={<Reference />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/user-guide" element={<UserGuide />} />
            <Route path="/app-preview" element={<AppStorePreview />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/form-guide" element={<FormGuide />} />
            <Route path="/build-packet" element={<BuildPacket />} />
            <Route path="/tools" element={<ClaimTools />} />
            <Route path="/calculator" element={<Combination />} />

            {/* Account management routes */}
            <Route path="/profile/delete-account" element={<DeleteAccountPage />} />
            <Route path="/profile/export-data" element={<ExportDataPage />} />

            {/* Legal routes (profile-prefixed) */}
            <Route path="/profile/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/profile/terms" element={<TermsOfServicePage />} />
            <Route path="/profile/disclaimer" element={<DisclaimerPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-[100dvh] bg-[#102039] text-white overflow-x-hidden break-words pb-20 lg:pb-0">
              <Navbar />
              <AnimatedRoutes />
              <BottomTabBar />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
