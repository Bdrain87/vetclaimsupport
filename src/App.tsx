import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { ClaimsProvider } from "./context/ClaimsContext";
import { EvidenceProvider } from "./context/EvidenceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppLayout } from "./components/AppLayout";
import { LiabilityAcceptanceScreen } from "./components/legal/LiabilityAcceptanceScreen";
import { OnboardingModal } from "./components/onboarding/OnboardingModal";
import { PWAInstallPrompt } from "./components/pwa/PWAInstallPrompt";
import { OfflineIndicator } from "./components/pwa/OfflineIndicator";
import { MilestoneCelebration } from "./components/dashboard/MilestoneCelebration";
import { WebGateWrapper } from "./components/landing/WebGateWrapper";
import { AppStoreLandingPage } from "./components/landing/AppStoreLandingPage";

// Core pages
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Unified pages (NO DUPLICATES)
import HealthLog from "./pages/HealthLog";
import DocumentsHub from "./pages/DocumentsHub";
import BuddyStatements from "./pages/BuddyStatements";

// Service & Medical
import ServiceHistory from "./pages/ServiceHistory";
import MedicalVisits from "./pages/MedicalVisits";
import Exposures from "./pages/Exposures";
import Migraines from "./pages/Migraines";
import Timeline from "./pages/Timeline";

// Claim Tools
import ClaimTools from "./pages/ClaimTools";
import ClaimChecklist from "./pages/ClaimChecklist";
import ExamPrep from "./pages/ExamPrep";
import CPExamPrepEnhanced from "./pages/CPExamPrepEnhanced";
import ClaimStrategyWizard from "./pages/ClaimStrategyWizard";
import SecondaryFinder from "./pages/SecondaryFinder";
import BilateralCalculator from "./pages/BilateralCalculator";
import ConditionGuide from "./pages/ConditionGuide";
import ClaimJourney from "./pages/ClaimJourney";

// Reference & Help
import Reference from "./pages/Reference";
import HelpCenter from "./pages/HelpCenter";
import FAQ from "./pages/FAQ";
import Glossary from "./pages/Glossary";
import VAForms from "./pages/VAForms";
import UserGuide from "./pages/UserGuide";
import ConditionsByConflict from "./pages/ConditionsByConflict";

// Legal
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WebGateWrapper>
          <ClaimsProvider>
            <EvidenceProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <LiabilityAcceptanceScreen />
                  <OnboardingModal />
                  <PWAInstallPrompt />
                  <OfflineIndicator />
                  <MilestoneCelebration />
                  <AppLayout>
                    <Routes>
                      {/* Core */}
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Navigate to="/" replace />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Unified Health Log - ONE page for all health tracking */}
                      <Route path="/health-log" element={<HealthLog />} />
                      <Route path="/migraines" element={<Migraines />} />

                      {/* Unified Documents - ONE page for all documents */}
                      <Route path="/docs" element={<DocumentsHub />} />

                      {/* Unified Buddy Statements - ONE page */}
                      <Route path="/buddy-statements" element={<BuddyStatements />} />

                      {/* Service & Medical */}
                      <Route path="/service-history" element={<ServiceHistory />} />
                      <Route path="/medical-visits" element={<MedicalVisits />} />
                      <Route path="/exposures" element={<Exposures />} />
                      <Route path="/timeline" element={<Timeline />} />

                      {/* Claim Tools */}
                      <Route path="/claim-tools" element={<ClaimTools />} />
                      <Route path="/checklist" element={<ClaimChecklist />} />
                      <Route path="/exam-prep" element={<ExamPrep />} />
                      <Route path="/cp-exam-prep" element={<CPExamPrepEnhanced />} />
                      <Route path="/claim-strategy" element={<ClaimStrategyWizard />} />
                      <Route path="/secondary-finder" element={<SecondaryFinder />} />
                      <Route path="/calculator" element={<BilateralCalculator />} />
                      <Route path="/condition-guide" element={<ConditionGuide />} />
                      <Route path="/journey" element={<ClaimJourney />} />

                      {/* Reference & Help */}
                      <Route path="/reference" element={<Reference />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/glossary" element={<Glossary />} />
                      <Route path="/va-forms" element={<VAForms />} />
                      <Route path="/user-guide" element={<UserGuide />} />
                      <Route path="/conditions-by-conflict" element={<ConditionsByConflict />} />

                      {/* Legal */}
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />

                      {/* Landing preview */}
                      <Route path="/landing-preview" element={<AppStoreLandingPage />} />

                      {/* REDIRECTS - Old URLs to unified pages */}
                      {/* Health Log redirects */}
                      <Route path="/symptoms" element={<Navigate to="/health-log" replace />} />
                      <Route path="/medications" element={<Navigate to="/health-log" replace />} />
                      <Route path="/sleep" element={<Navigate to="/health-log" replace />} />
                      <Route path="/symptom-journal" element={<Navigate to="/health-log" replace />} />
                      <Route path="/medication-log" element={<Navigate to="/health-log" replace />} />
                      <Route path="/sleep-tracker" element={<Navigate to="/health-log" replace />} />
                      <Route path="/migraine-log" element={<Navigate to="/health-log" replace />} />

                      {/* Documents redirects */}
                      <Route path="/documents" element={<Navigate to="/docs" replace />} />
                      <Route path="/claim-documents" element={<Navigate to="/docs" replace />} />
                      <Route path="/evidence-docs" element={<Navigate to="/docs" replace />} />
                      <Route path="/evidence-library" element={<Navigate to="/docs" replace />} />
                      <Route path="/documents-checklist" element={<Navigate to="/docs" replace />} />
                      <Route path="/claim-docs" element={<Navigate to="/docs" replace />} />

                      {/* Buddy Statements redirects */}
                      <Route path="/buddy-contacts" element={<Navigate to="/buddy-statements" replace />} />
                      <Route path="/buddy-statement-generator" element={<Navigate to="/buddy-statements" replace />} />
                      <Route path="/buddy-statement-tool" element={<Navigate to="/buddy-statements" replace />} />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </BrowserRouter>
              </TooltipProvider>
            </EvidenceProvider>
          </ClaimsProvider>
        </WebGateWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
