import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ClaimsProvider } from './context/ClaimsContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserConditionsProvider } from './context/UserConditionsContext';
import { TooltipProvider } from './components/ui/tooltip';
import { ErrorBoundary } from './components/ErrorBoundary';

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

function LoadingFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#102039]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-2 border-[#C8A628] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60 text-base font-medium">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ClaimsProvider>
          <UserConditionsProvider>
            <TooltipProvider>
              <BrowserRouter>
                <div className="min-h-[100dvh] bg-[#102039] text-white overflow-x-hidden break-words">
                  <Navbar />
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
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
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </UserConditionsProvider>
        </ClaimsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
