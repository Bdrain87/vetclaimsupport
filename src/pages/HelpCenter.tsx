import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, Search, ChevronRight, BookOpen,
  MessageSquare, FileText, Shield, Clock, Users, Download, Activity,
  Settings, CheckCircle, AlertCircle, Mail, Sparkles,
  Printer, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageContainer } from '@/components/PageContainer';

// ============================================
// DATA: FAQ Items
// ============================================
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'app' | 'claims' | 'evidence' | 'privacy';
}

const faqData: FAQItem[] = [
  { id: 'faq-1', category: 'app', question: 'How do I get started with Vet Claim Support?', answer: 'Start by adding your service history and separation date in Settings. Then begin logging your symptoms, medical visits, and any exposures you experienced during service. The app will guide you through building your evidence.' },
  { id: 'faq-2', category: 'app', question: 'Is my data backed up anywhere?', answer: 'Your data is encrypted and stored securely. We recommend using the Export Backup feature in Settings regularly to create a backup file you can save for safekeeping.' },
  { id: 'faq-3', category: 'app', question: 'Can I use this app on multiple devices?', answer: "Yes, but data doesn't sync automatically. Use the Export Backup feature to create a backup on one device, then use Restore from Backup on another device to transfer your data." },
  { id: 'faq-4', category: 'app', question: 'How do I export my data for my VSO?', answer: 'Use the Export PDF feature on the Dashboard. You can customize which sections to include and generate a professional PDF summary of your evidence.' },
  { id: 'faq-5', category: 'app', question: 'What does the AI analysis feature do?', answer: 'The AI analysis reviews your logged symptoms, medical visits, and service history to suggest potential VA-ratable conditions you might qualify for. It also identifies secondary conditions that could increase your combined rating.' },
  { id: 'faq-6', category: 'claims', question: 'What is a BDD claim?', answer: 'Benefits Delivery at Discharge (BDD) allows service members to file a VA disability claim 180-90 days before separation. This can result in receiving benefits soon after discharge.' },
  { id: 'faq-7', category: 'claims', question: 'What is a C&P exam?', answer: 'Compensation & Pension (C&P) exams are medical examinations ordered by the VA to evaluate your claimed disabilities. The examiner assesses the severity and connection to your service.' },
  { id: 'faq-8', category: 'claims', question: 'What is a nexus letter?', answer: 'A nexus letter is a medical opinion from a doctor stating that your current condition is "at least as likely as not" connected to your military service. It\'s crucial evidence for service connection. Use our Doctor Summary Builder to organize your information for your doctor.' },
  { id: 'faq-9', category: 'claims', question: 'What are secondary conditions?', answer: 'Secondary conditions are disabilities caused or aggravated by an already service-connected condition. For example, depression secondary to chronic pain, or knee problems secondary to a service-connected back injury.' },
  { id: 'faq-10', category: 'claims', question: 'How are combined ratings calculated?', answer: "VA uses \"VA math\" - ratings are combined, not added. Each rating is applied to the remaining \"whole person\" percentage. For example, 50% + 30% = 65% (not 80%). Use our Rating Calculator for accurate estimates." },
  { id: 'faq-11', category: 'evidence', question: 'What evidence do I need for my claim?', answer: 'Key evidence includes: Service Treatment Records (STRs), current medical records showing diagnosis, doctor summaries linking conditions to service, buddy statements from witnesses, and consistent symptom documentation.' },
  { id: 'faq-12', category: 'evidence', question: 'What is a buddy statement?', answer: 'A buddy statement is a written account from someone who witnessed your condition or symptoms during service. Fellow service members, family, or friends can provide these statements to support your claim.' },
  { id: 'faq-13', category: 'evidence', question: 'How often should I log my symptoms?', answer: 'Log symptoms as they occur for the most accurate record. At minimum, aim to log weekly. Consistent documentation over time shows the chronic nature of your conditions and their impact on daily life.' },
  { id: 'faq-14', category: 'evidence', question: 'What is a DBQ?', answer: 'Disability Benefits Questionnaire (DBQ) is a standardized form used by medical professionals to document the severity of your condition. Private doctors can complete DBQs to support your claim.' },
  { id: 'faq-15', category: 'privacy', question: 'Who can see my data?', answer: 'Only you. Your data is encrypted and only accessible with your credentials. We do not access your health information.' },
  { id: 'faq-16', category: 'privacy', question: 'What happens if I clear my browser data?', answer: 'If you clear your browser data or storage, your app data will be deleted. Always maintain current backups using the Export Backup feature.' },
  { id: 'faq-17', category: 'privacy', question: 'Is the AI analysis private?', answer: "When you use AI analysis, your data is sent to Google's Gemini API for processing. This is optional and only happens when you explicitly request analysis. We don't store or retain any data sent to or from the AI service." },
  { id: 'faq-18', category: 'privacy', question: 'Can I delete all my data?', answer: "Yes. Clear your browser's site data for this app, or use your browser's developer tools to clear localStorage and IndexedDB. This permanently removes all your data." },
];

const categoryLabels: Record<string, string> = {
  app: 'Using the App',
  claims: 'VA Claims Process',
  evidence: 'Evidence Requirements',
  privacy: 'Privacy & Data',
};

// ============================================
// DATA: User Guide Sections
// ============================================
interface GuideStep {
  title: string;
  content: string;
  tip?: string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: GuideStep[];
}

const guideSections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Learn the basics of using Vet Claim Support',
    steps: [
      { title: 'Accept the Terms', content: "When you first open the app, you'll see a liability acceptance screen. Read and accept to continue. This app is an educational tool - always consult with a VSO for official advice.", tip: 'The app works entirely offline after initial load. Your data is encrypted and stored on your device.' },
      { title: 'Complete the Onboarding', content: 'The onboarding wizard helps you set up your profile. You can add your service dates, primary conditions, and customize the app to your needs.', tip: 'You can always change these settings later in the Settings page.' },
      { title: 'Explore the Dashboard', content: 'Your dashboard shows a summary of your tracked data, quick actions, and your claim readiness score. Use the navigation menu to access different sections.' },
    ],
  },
  {
    id: 'tracking-health',
    title: 'Tracking Your Health',
    icon: <Activity className="h-5 w-5" />,
    description: 'Document symptoms, migraines, sleep, and medications',
    steps: [
      { title: 'Symptom Journal', content: 'Log your symptoms with date, severity (1-10), frequency, and how they impact your daily activities. The more detail you provide, the stronger your evidence.', tip: 'Track symptoms right when they happen for the most accurate record.' },
      { title: 'Migraine Log', content: "If you suffer from migraines, use the dedicated migraine tracker. It's designed around VA rating criteria (38 CFR 4.124a DC 8100) to capture relevant details.", tip: 'Note prostrating attacks (can\'t function) vs. non-prostrating for accurate ratings.' },
      { title: 'Sleep Tracker', content: 'Track your sleep patterns, especially if you have sleep apnea. The tracker aligns with VA criteria (38 CFR 4.97 DC 6847).', tip: "Log CPAP usage if prescribed - it's important for your rating." },
      { title: 'Medication Log', content: 'Keep a record of all medications, dosages, and any side effects. This shows the VA the treatment burden of your conditions.' },
    ],
  },
  {
    id: 'building-evidence',
    title: 'Building Your Evidence',
    icon: <FileText className="h-5 w-5" />,
    description: 'Organize documents and statements for your claim',
    steps: [
      { title: 'Upload Documents', content: 'Upload medical records, service records, and other documents. Organize them by type and condition for easy retrieval.', tip: 'Name files clearly: "2024-01_MRI_Knee_Results.pdf" is better than "scan.pdf".' },
      { title: 'Track Buddy Statements', content: "Buddy statements from fellow service members or family can support your claim. Add contacts, track who you've asked, and note when statements are received.", tip: 'Former roommates, supervisors, and family members make good witnesses.' },
      { title: 'Build Your Timeline', content: 'Create a visual timeline of your service history, injuries, and medical events. This helps establish when conditions began.' },
      { title: 'Use the Evidence Library', content: 'The Evidence Library is your central hub for all claim-related documents. Filter by category, search, and ensure nothing is missing.' },
    ],
  },
  {
    id: 'claim-tools',
    title: 'Using Claim Tools',
    icon: <Shield className="h-5 w-5" />,
    description: 'Prepare for exams and calculate ratings',
    steps: [
      { title: 'C&P Exam Prep', content: "Before your Compensation & Pension exam, use the Exam Prep tool. It provides condition-specific questions you might be asked and tips for communicating your symptoms.", tip: 'Be honest but thorough. Describe your worst days, not just average days.' },
      { title: 'Documents Checklist', content: 'Use the checklist to ensure you have all required forms and documents before filing. Check items off as you gather them.' },
      { title: 'Rating Calculator', content: "Estimate your combined VA disability rating using the calculator. Remember: VA math isn't simple addition - the calculator shows you how ratings combine.", tip: 'This is an estimate only. Actual ratings are determined by VA raters.' },
      { title: 'Reference Database', content: 'Search 784+ VA conditions with their rating criteria, required evidence, and common secondary conditions. Use this to understand what the VA is looking for.' },
    ],
  },
  {
    id: 'managing-contacts',
    title: 'Managing Contacts',
    icon: <Users className="h-5 w-5" />,
    description: 'Track witnesses and get buddy statements',
    steps: [
      { title: 'Add Contacts', content: 'Add people who can provide buddy statements - fellow service members, family, supervisors, medical providers. Include how they know you and what they witnessed.' },
      { title: 'Track Statement Status', content: 'Mark contacts as "Not Asked", "Pending", or "Received". Follow up with those who haven\'t responded.', tip: 'Make it easy for them - provide a template and clear instructions.' },
    ],
  },
  {
    id: 'service-history',
    title: 'Service History',
    icon: <Clock className="h-5 w-5" />,
    description: 'Document your military service',
    steps: [
      { title: 'Duty Stations', content: 'List all duty stations with dates. This is important for establishing exposures and service connection.' },
      { title: 'Deployments & Combat', content: 'Document deployments, combat tours, and hazardous duty. Include locations, dates, and any incidents.', tip: 'Combat veterans have relaxed evidence requirements for certain conditions.' },
      { title: 'Exposures', content: 'Track potential toxic exposures: burn pits, Agent Orange, contaminated water, radiation, etc. Note locations and duration.' },
    ],
  },
  {
    id: 'data-management',
    title: 'Managing Your Data',
    icon: <Download className="h-5 w-5" />,
    description: 'Backup, export, and protect your information',
    steps: [
      { title: 'Export Your Data', content: 'Use Settings > Data Backup to export all your data as a JSON file. This creates a complete backup you can restore later.', tip: 'Export before clearing browser data or switching devices.' },
      { title: 'Import/Restore', content: 'Restore a previous backup by importing the JSON file. This overwrites current data, so export first if needed.' },
      { title: 'Privacy', content: 'Your data is encrypted and stored securely. We never share your information with third parties (except optional AI features, which are clearly disclosed).' },
    ],
  },
];

// ============================================
// DATA: Glossary Terms
// ============================================
interface GlossaryTerm {
  term: string;
  definition: string;
  related?: string[];
}

const glossaryData: GlossaryTerm[] = [
  { term: '38 CFR Part 4', definition: "The federal regulation containing the VA's Schedule for Rating Disabilities, which defines how each disability is evaluated and rated.", related: ['Rating Schedule', 'Diagnostic Code'] },
  { term: 'BDD', definition: 'Benefits Delivery at Discharge. A program allowing service members to file VA disability claims 180-90 days before separation.', related: ['Pre-Discharge Claim'] },
  { term: 'Bilateral Factor', definition: 'A 10% increase applied when a veteran has matching disabilities on both sides of the body (e.g., both knees, both hearing loss).' },
  { term: 'Buddy Statement', definition: 'A written statement from someone who witnessed your condition, symptoms, or the event that caused your disability.', related: ['Lay Evidence'] },
  { term: 'C&P Exam', definition: 'Compensation and Pension examination. A medical exam ordered by the VA to evaluate the severity of your claimed conditions.', related: ['DBQ', 'Medical Evidence'] },
  { term: 'Combined Rating', definition: 'The overall disability rating calculated using VA math, where each rating is applied to the remaining "whole person" percentage.' },
  { term: 'DBQ', definition: 'Disability Benefits Questionnaire. A standardized form that doctors use to document the severity of disabilities.', related: ['C&P Exam'] },
  { term: 'Diagnostic Code (DC)', definition: 'A number assigned to each disability in 38 CFR Part 4 that identifies the specific condition and its rating criteria.' },
  { term: 'Direct Service Connection', definition: 'A disability that was directly caused by an event, injury, or disease during military service.', related: ['Secondary Connection'] },
  { term: 'Effective Date', definition: 'The date from which VA benefits begin. Usually the date of claim or the date entitlement arose, whichever is later.' },
  { term: 'Fully Developed Claim (FDC)', definition: 'A claim submitted with all necessary evidence, allowing for faster processing.' },
  { term: 'HLR', definition: 'Higher-Level Review. An appeal option where a senior reviewer examines the claim decision for errors.', related: ['Supplemental Claim'] },
  { term: 'IMO', definition: 'Independent Medical Opinion. A medical opinion from a private doctor supporting service connection.', related: ['Doctor Summary'] },
  { term: 'Intent to File', definition: 'A notification to VA that you plan to file a claim, preserving your effective date for up to one year.' },
  { term: 'Lay Evidence', definition: 'Evidence from non-medical sources, such as personal statements or buddy statements.', related: ['Buddy Statement'] },
  { term: 'Doctor Summary (Nexus Letter)', definition: 'A medical opinion from your doctor stating that your disability is "at least as likely as not" connected to your service.', related: ['IMO'] },
  { term: 'PACT Act', definition: 'The Promise to Address Comprehensive Toxics Act (2022). Expanded VA benefits for toxic exposure veterans.' },
  { term: 'Pyramiding', definition: 'The prohibited practice of rating the same symptoms under multiple diagnostic codes.' },
  { term: 'Rating Schedule', definition: "The VA's system for assigning percentage ratings to disabilities based on their severity.", related: ['38 CFR Part 4'] },
  { term: 'Secondary Condition', definition: 'A disability caused or aggravated by an already service-connected condition.', related: ['Direct Service Connection'] },
  { term: 'Service Connection', definition: 'VA determination that a disability is related to military service, required for compensation benefits.' },
  { term: 'SMC', definition: 'Special Monthly Compensation. Additional compensation for severe disabilities or specific situations.' },
  { term: 'STRs', definition: 'Service Treatment Records. Medical records from your time in military service.' },
  { term: 'Supplemental Claim', definition: 'A claim filed after a denial that includes new and relevant evidence.', related: ['HLR'] },
  { term: 'TDIU', definition: 'Total Disability Individual Unemployability. Allows veterans rated less than 100% to receive 100% compensation if unemployable.' },
  { term: 'TBI', definition: 'Traumatic Brain Injury. Brain injury caused by trauma during service.' },
  { term: 'VA Math', definition: 'The method VA uses to calculate combined ratings using "whole person" math, not simple addition.', related: ['Combined Rating'] },
  { term: 'VSO', definition: 'Veterans Service Organization. Groups like DAV, VFW that provide free claims assistance.' },
];

// ============================================
// Quick Start Cards
// ============================================
const quickStartCards = [
  { icon: <Settings className="h-5 w-5" />, title: 'Set Up Your Profile', description: 'Add service dates and conditions', link: '/settings' },
  { icon: <Activity className="h-5 w-5" />, title: 'Log Your First Symptom', description: 'Start building evidence', link: '/health/symptoms' },
  { icon: <FileText className="h-5 w-5" />, title: 'Upload Documents', description: 'Add medical records', link: '/settings/vault' },
  { icon: <Shield className="h-5 w-5" />, title: 'Explore Reference', description: 'Search 784+ conditions', link: '/settings/resources' },
];

// ============================================
// Component
// ============================================
export default function HelpCenter() {
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('start');
  const [faqCategory, setFaqCategory] = useState('all');

  // Global search across all content
  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return null;
    const query = globalSearch.toLowerCase();

    const faqs = faqData.filter(
      f => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
    ).map(f => ({ type: 'faq' as const, data: f }));

    const guides = guideSections.flatMap(section =>
      section.steps.filter(
        step => step.title.toLowerCase().includes(query) || step.content.toLowerCase().includes(query)
      ).map(step => ({ type: 'guide' as const, data: { section, step } }))
    );

    const terms = glossaryData.filter(
      t => t.term.toLowerCase().includes(query) || t.definition.toLowerCase().includes(query)
    ).map(t => ({ type: 'glossary' as const, data: t }));

    return { faqs, guides, terms, total: faqs.length + guides.length + terms.length };
  }, [globalSearch]);

  // Filtered FAQ
  const filteredFAQ = useMemo(() => {
    return faqData.filter(item => {
      const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
      return matchesCategory;
    });
  }, [faqCategory]);

  // Grouped glossary
  const groupedGlossary = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    glossaryData.forEach(term => {
      const letter = (term.term[0] || '#').toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, []);

  const handlePrint = useCallback(() => {
    if (!('Capacitor' in window)) window.print();
  }, []);

  return (
    <PageContainer className="py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Help Center</h1>
            <p className="text-muted-foreground">Everything you need to know about your VA claim</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handlePrint} className="hidden sm:flex gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Global Search */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search all help content..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-12 h-12 text-base bg-background border-border/50"
              aria-label="Search help topics"
            />
            {globalSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setGlobalSearch('')}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Results
              <Badge variant="secondary">{searchResults.total} found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.total === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No results found for "{globalSearch}"
              </p>
            ) : (
              <>
                {searchResults.faqs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">FAQ ({searchResults.faqs.length})</h3>
                    <div className="space-y-2">
                      {searchResults.faqs.slice(0, 3).map(({ data }) => (
                        <button key={data.id} className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer" onClick={() => { setGlobalSearch(''); setActiveTab('faq'); }}>
                          <p className="font-medium text-sm">{data.question}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{data.answer}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.guides.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Guides ({searchResults.guides.length})</h3>
                    <div className="space-y-2">
                      {searchResults.guides.slice(0, 3).map(({ data }, i) => (
                        <button key={i} className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer" onClick={() => { setGlobalSearch(''); setActiveTab('guides'); }}>
                          <p className="font-medium text-sm">{data.step.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{data.section.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.terms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Glossary ({searchResults.terms.length})</h3>
                    <div className="space-y-2">
                      {searchResults.terms.slice(0, 3).map(({ data }) => (
                        <button key={data.term} className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer" onClick={() => { setGlobalSearch(''); setActiveTab('glossary'); }}>
                          <p className="font-medium text-sm">{data.term}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{data.definition}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      {!searchResults && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 h-auto p-1 bg-muted/50">
            {[
              { value: 'start', label: 'Get Started', icon: <Sparkles className="h-4 w-4" /> },
              { value: 'faq', label: 'FAQ', icon: <MessageSquare className="h-4 w-4" /> },
              { value: 'guides', label: 'Guides', icon: <BookOpen className="h-4 w-4" /> },
              { value: 'glossary', label: 'Glossary', icon: <FileText className="h-4 w-4" /> },
              { value: 'contact', label: 'Contact', icon: <Mail className="h-4 w-4" /> },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col sm:flex-row items-center gap-1.5 py-2.5 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {tab.icon}
                <span className="text-xs sm:text-sm">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="start" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Welcome to Vet Claim Support
                </CardTitle>
                <CardDescription>
                  Your complete toolkit for building a strong VA disability claim
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  This app helps you document, organize, and prepare your VA disability claim evidence.
                  Your data is encrypted and securely stored — you stay in control.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {quickStartCards.map((card, i) => (
                    <Link
                      key={i}
                      to={card.link}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{card.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-700 dark:text-green-500">Pro Tip</p>
                      <p className="text-sm text-green-600/80 dark:text-green-500/80 mt-1">
                        Consistency is key! Log symptoms regularly - even brief entries help establish
                        a pattern that strengthens your claim.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {['all', 'app', 'claims', 'evidence', 'privacy'].map(cat => (
                <Button
                  key={cat}
                  variant={faqCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFaqCategory(cat)}
                  className="rounded-full"
                >
                  {cat === 'all' ? 'All' : categoryLabels[cat]}
                </Button>
              ))}
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {filteredFAQ.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border rounded-2xl px-4 bg-card hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="pl-8">
                      <p className="text-muted-foreground">{item.answer}</p>
                      <Badge variant="outline" className="mt-3">
                        {categoryLabels[item.category]}
                      </Badge>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-4">
              {guideSections.map((section) => (
                <Card key={section.id} className="border-0 shadow-md">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={section.id} className="border-0">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-t-xl">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            {section.icon}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{section.title}</p>
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 pt-2">
                          {section.steps.map((step, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                                {i + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{step.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{step.content}</p>
                                {step.tip && (
                                  <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-gold/10 text-foreground">
                                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs">{step.tip}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Glossary Tab */}
          <TabsContent value="glossary" className="space-y-6">
            <div className="flex flex-wrap gap-2 sticky top-0 bg-background/95 backdrop-blur py-2 -my-2 z-10">
              {Object.keys(groupedGlossary).sort().map(letter => (
                <a
                  key={letter}
                  href={`#glossary-${letter}`}
                  className="w-11 h-11 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                >
                  {letter}
                </a>
              ))}
            </div>

            <div className="space-y-6">
              {Object.entries(groupedGlossary).sort().map(([letter, terms]) => (
                <div key={letter} id={`glossary-${letter}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                      {letter}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid gap-3">
                    {terms.map(term => (
                      <div key={term.term} className="p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/20 transition-colors">
                        <p className="font-semibold">{term.term}</p>
                        <p className="text-sm text-muted-foreground mt-1">{term.definition}</p>
                        {term.related && (
                          <div className="flex gap-2 mt-2">
                            {term.related.map(r => (
                              <Badge key={r} variant="outline" className="text-xs">
                                {r}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Get Help & Give Feedback
                </CardTitle>
                <CardDescription>
                  We're here to help you succeed with your VA claim
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href="mailto:support@vetclaimsupport.com"
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Email Support</p>
                      <p className="text-xs text-muted-foreground">Found a bug? Let us know</p>
                    </div>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </a>

                  <a
                    href="mailto:support@vetclaimsupport.com?subject=Feature%20Request"
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className="p-2.5 rounded-xl bg-green-500/10 text-green-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Email Feature Request</p>
                      <p className="text-xs text-muted-foreground">Have an idea? Share it</p>
                    </div>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Important Disclaimer</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This app is an educational tool only. It does not provide legal, medical, or
                        professional advice. Always consult with an accredited VSO, attorney, or VA
                        representative for official guidance on your claim.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </PageContainer>
  );
}
