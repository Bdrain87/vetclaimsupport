import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ClaimsProvider } from './context/ClaimsContext';
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

function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div className="pt-[72px] sm:pt-[80px]">{children}</div>;
}

function App() {
  return (
    <ErrorBoundary>
      <ClaimsProvider>
        <BrowserRouter>
          <div className="min-h-[100dvh] bg-[#102039] text-white overflow-x-hidden break-words">
            <Navbar />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Landing — hero goes behind navbar, no top padding */}
                <Route path="/" element={<Landing />} />

                {/* All other routes — padded below fixed navbar */}
                <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
                <Route path="/conditions" element={<PageWrapper><Conditions /></PageWrapper>} />
                <Route path="/conditions/:id" element={<PageWrapper><ConditionDetail /></PageWrapper>} />
                <Route path="/condition-guide" element={<PageWrapper><ConditionGuide /></PageWrapper>} />
                <Route path="/conditions-by-conflict" element={<PageWrapper><ConditionsByConflict /></PageWrapper>} />
                <Route path="/secondary-finder" element={<PageWrapper><SecondaryFinder /></PageWrapper>} />
                <Route path="/bilateral-calculator" element={<PageWrapper><BilateralCalculator /></PageWrapper>} />
                <Route path="/claim-checklist" element={<PageWrapper><ClaimChecklist /></PageWrapper>} />
                <Route path="/claim-journey" element={<PageWrapper><ClaimJourney /></PageWrapper>} />
                <Route path="/claim-strategy" element={<PageWrapper><ClaimStrategyWizard /></PageWrapper>} />
                <Route path="/claim-tools" element={<PageWrapper><ClaimTools /></PageWrapper>} />
                <Route path="/timeline" element={<PageWrapper><Timeline /></PageWrapper>} />
                <Route path="/health-log" element={<PageWrapper><HealthLog /></PageWrapper>} />
                <Route path="/symptoms" element={<PageWrapper><Symptoms /></PageWrapper>} />
                <Route path="/sleep" element={<PageWrapper><Sleep /></PageWrapper>} />
                <Route path="/medications" element={<PageWrapper><Medications /></PageWrapper>} />
                <Route path="/migraines" element={<PageWrapper><Migraines /></PageWrapper>} />
                <Route path="/medical-visits" element={<PageWrapper><MedicalVisits /></PageWrapper>} />
                <Route path="/exposures" element={<PageWrapper><Exposures /></PageWrapper>} />
                <Route path="/buddy-statements" element={<PageWrapper><BuddyStatements /></PageWrapper>} />
                <Route path="/nexus-letter" element={<PageWrapper><NexusLetterGenerator /></PageWrapper>} />
                <Route path="/documents" element={<PageWrapper><DocumentsHub /></PageWrapper>} />
                <Route path="/exam-prep" element={<PageWrapper><ExamPrep /></PageWrapper>} />
                <Route path="/cp-exam-prep" element={<PageWrapper><CPExamPrepEnhanced /></PageWrapper>} />
                <Route path="/dbq-prep" element={<PageWrapper><DBQPrepSheet /></PageWrapper>} />
                <Route path="/va-forms" element={<PageWrapper><VAForms /></PageWrapper>} />
                <Route path="/va-resources" element={<PageWrapper><VAResources /></PageWrapper>} />
                <Route path="/service-history" element={<PageWrapper><ServiceHistory /></PageWrapper>} />
                <Route path="/reference" element={<PageWrapper><Reference /></PageWrapper>} />
                <Route path="/glossary" element={<PageWrapper><Glossary /></PageWrapper>} />
                <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
                <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
                <Route path="/help" element={<PageWrapper><HelpCenter /></PageWrapper>} />
                <Route path="/user-guide" element={<PageWrapper><UserGuide /></PageWrapper>} />
                <Route path="/app-preview" element={<PageWrapper><AppStorePreview /></PageWrapper>} />
                <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
                <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
                <Route path="/disclaimer" element={<PageWrapper><Disclaimer /></PageWrapper>} />
                <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </ClaimsProvider>
    </ErrorBoundary>
  );
}

export default App;
