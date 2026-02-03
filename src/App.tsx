import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import EvidenceLibrary from "./pages/EvidenceLibrary";
import ClaimDocuments from "./pages/ClaimDocuments";
import Dashboard from "./pages/Dashboard";
import MedicalVisits from "./pages/MedicalVisits";
import Migraines from "./pages/Migraines";
import Exposures from "./pages/Exposures";
import Symptoms from "./pages/Symptoms";
import Medications from "./pages/Medications";
import ServiceHistory from "./pages/ServiceHistory";
import BuddyContacts from "./pages/BuddyContacts";
import Documents from "./pages/Documents";
import Reference from "./pages/Reference";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Sleep from "./pages/Sleep";
import Settings from "./pages/Settings";
import Timeline from "./pages/Timeline";
import ClaimChecklist from "./pages/ClaimChecklist";
import ExamPrep from "./pages/ExamPrep";
import ClaimTools from "./pages/ClaimTools";
import EvidenceDocs from "./pages/EvidenceDocs";
import FAQ from "./pages/FAQ";
import Glossary from "./pages/Glossary";
import VAForms from "./pages/VAForms";
import UserGuide from "./pages/UserGuide";
import ConditionsByConflict from "./pages/ConditionsByConflict";
import BuddyStatementGenerator from "./pages/BuddyStatementGenerator";
import ConditionGuide from "./pages/ConditionGuide";
import SecondaryFinder from "./pages/SecondaryFinder";
import CPExamPrepEnhanced from "./pages/CPExamPrepEnhanced";
import ClaimStrategyWizard from "./pages/ClaimStrategyWizard";
import NotFound from "./pages/NotFound";

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
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/medical-visits" element={<MedicalVisits />} />
                      <Route path="/migraines" element={<Migraines />} />
                      <Route path="/exposures" element={<Exposures />} />
                      <Route path="/symptoms" element={<Symptoms />} />
                      <Route path="/medications" element={<Medications />} />
                      <Route path="/service-history" element={<ServiceHistory />} />
                      <Route path="/buddy-contacts" element={<BuddyContacts />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/claim-documents" element={<ClaimDocuments />} />
                      <Route path="/evidence-docs" element={<EvidenceDocs />} />
                      <Route path="/evidence-library" element={<EvidenceLibrary />} />
                      <Route path="/reference" element={<Reference />} />
                      <Route path="/sleep" element={<Sleep />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/timeline" element={<Timeline />} />
                      <Route path="/checklist" element={<ClaimChecklist />} />
                      <Route path="/exam-prep" element={<ExamPrep />} />
                      <Route path="/claim-tools" element={<ClaimTools />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/glossary" element={<Glossary />} />
                      <Route path="/va-forms" element={<VAForms />} />
                      <Route path="/user-guide" element={<UserGuide />} />
                      <Route path="/conditions-by-conflict" element={<ConditionsByConflict />} />
                      <Route path="/buddy-statement-generator" element={<BuddyStatementGenerator />} />
                      <Route path="/condition-guide" element={<ConditionGuide />} />
                      <Route path="/secondary-finder" element={<SecondaryFinder />} />
                      <Route path="/cp-exam-prep" element={<CPExamPrepEnhanced />} />
                      <Route path="/claim-strategy" element={<ClaimStrategyWizard />} />
                      <Route path="/landing-preview" element={<AppStoreLandingPage />} />
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
