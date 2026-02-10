import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  FileCheck,
  Download,
  Loader2,
  ChevronDown,
  User,
  ClipboardList,
  FileText,
  Activity,
  MessageSquare,
  HelpCircle,
  Scale,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { useProfileStore, BRANCH_LABELS } from '@/store/useProfileStore';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/vaConditions';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import { useCaseLaw } from '@/hooks/useCaseLaw';
import { generateCPExamPacketPDF } from '@/services/exportEngine';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

// Condition-specific reminders
const conditionReminders: Record<string, string[]> = {
  ptsd: [
    'Mention nightmares, hypervigilance, and avoidance behaviors',
    'Describe how PTSD affects relationships and social functioning',
    'Note any panic attacks and their frequency',
    'Discuss memory and concentration difficulties',
  ],
  migraine: [
    'Document prostrating episodes (completely incapacitating)',
    'Track work days missed due to migraines',
    'Note if migraines require bed rest in a dark room',
    'Describe aura symptoms and triggers',
  ],
  sleep: [
    'Bring CPAP compliance records if applicable',
    'Document daytime sleepiness and its impact on work/driving',
    'Note oxygen desaturation episodes',
    'Describe morning headaches and fatigue',
  ],
  back: [
    'Do NOT push through pain during range of motion testing',
    'Describe pain during flare-ups, not just average days',
    'Mention radiculopathy (pain shooting down legs)',
    'Note incapacitating episodes requiring bed rest',
  ],
  knee: [
    'Describe instability and giving way episodes',
    'Note use of braces or assistive devices',
    'Mention pain on stairs, squatting, and prolonged standing',
    'Discuss locking and effusion (swelling)',
  ],
  tinnitus: [
    'Describe the sound (ringing, buzzing, hissing)',
    'Note impact on sleep and concentration',
    'Mention any noise exposure during service',
    'Describe how it affects daily functioning',
  ],
  hearing: [
    'Bring any private audiograms',
    'Describe difficulty in noisy environments',
    'Note use of hearing aids',
    'Mention in-service noise exposure',
  ],
  anxiety: [
    'Describe panic attacks including frequency and duration',
    'Note avoidance behaviors and social withdrawal',
    'Discuss impact on work attendance and performance',
    'Mention sleep disruption and difficulty concentrating',
  ],
  depression: [
    'Describe your worst episodes in detail',
    'Note impacts on motivation, hygiene, and daily routine',
    'Discuss effects on relationships and social isolation',
    'Mention any suicidal ideation history',
  ],
};

function getConditionSpecificReminders(conditionName: string): string[] {
  const lower = conditionName.toLowerCase();
  for (const [key, reminders] of Object.entries(conditionReminders)) {
    if (lower.includes(key)) return reminders;
  }
  return [];
}

// Section component for accordion-style collapsible
function PacketSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  sectionNumber,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  sectionNumber: number;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold shrink-0">
          {sectionNumber}
        </span>
        <Icon className="h-5 w-5 text-blue-500 shrink-0" />
        <span className="flex-1 font-semibold text-foreground text-base">{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function CPExamPacket() {
  const navigate = useNavigate();
  const profile = useProfileStore();
  const appState = useAppStore();

  // AI hooks
  const { generate: aiGenerate, isLoading: aiLoading } = useAIGenerate('EXAMINER_PERSONA');
  const { getCaseLaw, isLoading: caseLawLoading } = useCaseLaw();

  // State
  const [examQuestions, setExamQuestions] = useState<Record<string, string>>({});
  const [caseLawResults, setCaseLawResults] = useState<Record<string, string>>({});
  const [loadingQuestions, setLoadingQuestions] = useState<Set<string>>(new Set());
  const [loadingCaseLaw, setLoadingCaseLaw] = useState<Set<string>>(new Set());
  const [pdfExporting, setPdfExporting] = useState(false);

  // Data
  const userConditions = appState.userConditions;
  const claimConditions = appState.claimConditions;
  const symptoms = appState.symptoms;
  const medications = appState.medications;
  const quickLogs = appState.quickLogs;
  const sleepEntries = appState.sleepEntries;
  const migraines = appState.migraines;
  const buddyContacts = appState.buddyContacts;
  const documents = appState.documents;
  const medicalVisits = appState.medicalVisits;

  // All conditions with details
  const allConditions = useMemo(() => {
    const conditions: Array<{
      id: string;
      name: string;
      diagnosticCode?: string;
      claimType: string;
      isPrimary: boolean;
      linkedPrimaryName?: string;
      rating?: number;
    }> = [];

    userConditions.forEach((uc) => {
      const details = getConditionById(uc.conditionId);
      if (!details) return;
      const primary = uc.linkedPrimaryId
        ? userConditions.find((c) => c.id === uc.linkedPrimaryId)
        : null;
      const primaryDetails = primary ? getConditionById(primary.conditionId) : null;

      conditions.push({
        id: uc.id,
        name: details.name,
        diagnosticCode: details.diagnosticCode,
        claimType: uc.isPrimary
          ? 'new'
          : uc.linkedPrimaryId
          ? 'secondary'
          : uc.claimStatus === 'appeal'
          ? 'appeal'
          : 'increase',
        isPrimary: uc.isPrimary,
        linkedPrimaryName: primaryDetails?.name,
        rating: uc.rating,
      });
    });

    // Also include claim conditions not already represented
    claimConditions.forEach((cc) => {
      if (!conditions.some((c) => c.name.toLowerCase() === cc.name.toLowerCase())) {
        conditions.push({
          id: cc.id,
          name: cc.name,
          claimType: 'new',
          isPrimary: true,
        });
      }
    });

    return conditions;
  }, [userConditions, claimConditions]);

  // 90-day symptom summary
  const symptomSummary = useMemo(() => {
    const ninetyDaysAgo = subDays(new Date(), 90).toISOString();

    const recentLogs = quickLogs.filter((l) => l.date >= ninetyDaysAgo);
    const recentSymptoms = symptoms.filter((s) => s.date >= ninetyDaysAgo);
    const recentSleep = sleepEntries.filter((s) => s.date >= ninetyDaysAgo);
    const recentMigraines = migraines.filter((m) => m.date >= ninetyDaysAgo);

    const painLevels = [
      ...recentLogs.map((l) => l.painLevel || l.overallFeeling || 0),
      ...recentSymptoms.map((s) => s.severity),
    ].filter((p) => p > 0);

    const avgPain = painLevels.length > 0
      ? (painLevels.reduce((a, b) => a + b, 0) / painLevels.length).toFixed(1)
      : 'N/A';

    const flareUps = recentLogs.filter((l) => l.hadFlareUp).length;
    const worstPain = painLevels.length > 0 ? Math.max(...painLevels) : 0;
    const worstDate = recentSymptoms.length > 0
      ? recentSymptoms.sort((a, b) => b.severity - a.severity)[0]?.date
      : recentLogs.length > 0
      ? recentLogs.sort((a, b) => (b.painLevel || 0) - (a.painLevel || 0))[0]?.date
      : null;

    const avgSleep = recentSleep.length > 0
      ? (recentSleep.reduce((a, b) => a + (b.hoursSlept || 0), 0) / recentSleep.length).toFixed(1)
      : null;

    const migraineCount = recentMigraines.length;
    const prostratingCount = recentMigraines.filter((m) => m.wasProstrating).length;

    const currentMeds = medications.filter((m) => m.stillTaking);

    return {
      avgPain,
      flareUps,
      worstPain,
      worstDate: worstDate ? format(new Date(worstDate), 'MMM d, yyyy') : null,
      avgSleep,
      migraineCount,
      prostratingCount,
      currentMeds,
      totalLogs: recentLogs.length + recentSymptoms.length,
    };
  }, [quickLogs, symptoms, sleepEntries, migraines, medications]);

  // Evidence summary per condition
  const getEvidenceSummary = useCallback(
    (conditionName: string) => {
      const cc = claimConditions.find(
        (c) => c.name.toLowerCase() === conditionName.toLowerCase()
      );
      const medRecords = cc ? cc.linkedMedicalVisits.length : 0;
      const buddyCount = cc ? cc.linkedBuddyContacts.length : 0;
      const symptomCount = cc ? cc.linkedSymptoms.length : 0;
      const docCount = cc ? cc.linkedDocuments.length : 0;

      // Check for nexus letter
      const hasNexus = documents.some(
        (d) =>
          d.name.toLowerCase().includes('nexus') &&
          (d.status === 'Obtained' || d.status === 'Submitted')
      );

      // Check for personal statement
      const hasPersonalStatement = documents.some(
        (d) =>
          d.name.toLowerCase().includes('personal') &&
          (d.status === 'Obtained' || d.status === 'Submitted')
      );

      const gaps: string[] = [];
      if (medRecords === 0) gaps.push('Medical records');
      if (buddyCount === 0) gaps.push('Buddy statements');
      if (!hasNexus) gaps.push('Nexus letter');
      if (!hasPersonalStatement) gaps.push('Personal statement');

      return {
        medRecords,
        buddyCount,
        symptomCount,
        docCount,
        hasNexus,
        hasPersonalStatement,
        gaps,
      };
    },
    [claimConditions, documents]
  );

  // Generate exam questions for a condition
  const handleGenerateQuestions = async (conditionName: string) => {
    if (examQuestions[conditionName]) return; // Already cached
    setLoadingQuestions((prev) => new Set(prev).add(conditionName));

    const prompt = `For a C&P exam for ${conditionName}, list the 8-10 most likely questions the examiner will ask. Focus on functional impact, frequency, severity, and daily life limitations. Format as a numbered list.`;
    const result = await aiGenerate(prompt);
    if (result) {
      setExamQuestions((prev) => ({ ...prev, [conditionName]: result }));
    }
    setLoadingQuestions((prev) => {
      const next = new Set(prev);
      next.delete(conditionName);
      return next;
    });
  };

  // Generate case law for a condition
  const handleGenerateCaseLaw = async (conditionName: string, claimType: string) => {
    if (caseLawResults[conditionName]) return; // Already cached
    setLoadingCaseLaw((prev) => new Set(prev).add(conditionName));

    const evidence = getEvidenceSummary(conditionName);
    const evidenceList = [
      evidence.medRecords > 0 ? 'Medical records' : null,
      evidence.buddyCount > 0 ? 'Buddy statements' : null,
      evidence.hasNexus ? 'Nexus letter' : null,
      evidence.hasPersonalStatement ? 'Personal statement' : null,
      evidence.symptomCount > 0 ? 'Symptom logs' : null,
    ].filter(Boolean) as string[];

    const result = await getCaseLaw(conditionName, claimType, evidenceList);
    if (result) {
      setCaseLawResults((prev) => ({ ...prev, [conditionName]: result }));
    }
    setLoadingCaseLaw((prev) => {
      const next = new Set(prev);
      next.delete(conditionName);
      return next;
    });
  };

  // Generate all case law for all conditions
  const handleGenerateAllCaseLaw = async () => {
    for (const condition of allConditions) {
      if (!caseLawResults[condition.name]) {
        await handleGenerateCaseLaw(condition.name, condition.claimType);
      }
    }
  };

  // PDF export
  const handleExportPDF = async () => {
    setPdfExporting(true);
    try {
      generateCPExamPacketPDF({
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          branch: profile.branch ? BRANCH_LABELS[profile.branch] : '',
          mosCode: profile.mosCode,
          mosTitle: profile.mosTitle,
          serviceDates: profile.serviceDates,
          intentToFileDate: profile.intentToFileDate,
          currentRating: userConditions.reduce(
            (max, c) => (c.rating && c.rating > max ? c.rating : max),
            0
          ),
        },
        conditions: allConditions,
        evidenceSummaries: allConditions.map((c) => ({
          conditionName: c.name,
          ...getEvidenceSummary(c.name),
        })),
        symptomSummary,
        medications: medications.filter((m) => m.stillTaking),
        examQuestions,
        caseLawResults,
      });
    } finally {
      setPdfExporting(false);
    }
  };

  // Quick jump refs
  const sectionIds = [
    'veteran-info',
    'conditions',
    'evidence',
    'symptom-history',
    'talking-points',
    'questions',
    'case-law',
  ];
  const sectionLabels = [
    'Info',
    'Conditions',
    'Evidence',
    'Symptoms',
    'Talking Pts',
    'Questions',
    'Case Law',
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-4 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-blue-500/10 shrink-0">
          <FileCheck className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">C&P Exam Packet</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your complete preparation document for the C&P exam
          </p>
        </div>
      </div>

      {/* Export + Quick Jump */}
      <div className="space-y-3">
        <Button
          onClick={handleExportPDF}
          disabled={pdfExporting}
          className="w-full"
          size="lg"
        >
          {pdfExporting ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Download className="h-5 w-5 mr-2" />
          )}
          {pdfExporting ? 'Generating PDF...' : 'Export as PDF'}
        </Button>

        {/* Quick Jump Navigation */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {sectionLabels.map((label, i) => (
            <button
              key={sectionIds[i]}
              onClick={() => {
                document.getElementById(sectionIds[i])?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="shrink-0 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Veteran Information */}
      <div id="veteran-info">
        <PacketSection title="Veteran Information" icon={User} sectionNumber={1} defaultOpen>
          <div className="space-y-2 text-sm">
            <InfoRow label="Name" value={`${profile.firstName} ${profile.lastName}`.trim() || 'Not provided'} />
            <InfoRow label="Branch" value={profile.branch ? BRANCH_LABELS[profile.branch] : 'Not provided'} />
            <InfoRow label="Service Dates" value={
              profile.serviceDates
                ? `${profile.serviceDates.start} to ${profile.serviceDates.end || 'Present'}`
                : 'Not provided'
            } />
            <InfoRow label="MOS/AFSC" value={profile.mosCode ? `${profile.mosCode} — ${profile.mosTitle}` : 'Not provided'} />
            <InfoRow label="Current VA Rating" value={
              userConditions.some((c) => c.rating !== undefined && c.rating > 0)
                ? `${userConditions.reduce((max, c) => (c.rating && c.rating > max ? c.rating : max), 0)}%`
                : 'None on file'
            } />
            <InfoRow label="Intent to File" value={
              profile.intentToFileDate
                ? `Filed ${profile.intentToFileDate}`
                : profile.intentToFileFiled
                ? 'Filed (date not set)'
                : 'Not filed'
            } />
          </div>
        </PacketSection>
      </div>

      {/* Section 2: Conditions Being Claimed */}
      <div id="conditions">
        <PacketSection title="Conditions Being Claimed" icon={ClipboardList} sectionNumber={2} defaultOpen>
          {allConditions.length === 0 ? (
            <EmptyState text="No conditions added yet" />
          ) : (
            <div className="space-y-3">
              {allConditions.map((condition) => {
                const specificReminders = getConditionSpecificReminders(condition.name);
                return (
                  <div
                    key={condition.id}
                    className="rounded-lg border border-border bg-secondary/50 p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground text-base">{condition.name}</p>
                        {condition.diagnosticCode && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            DC {condition.diagnosticCode}
                          </Badge>
                        )}
                      </div>
                      <Badge
                        className={cn(
                          'text-xs shrink-0',
                          condition.claimType === 'secondary'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : condition.claimType === 'increase'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        )}
                      >
                        {condition.claimType}
                      </Badge>
                    </div>
                    {condition.linkedPrimaryName && (
                      <p className="text-xs text-muted-foreground">
                        Secondary to: <span className="font-medium text-foreground">{condition.linkedPrimaryName}</span>
                      </p>
                    )}
                    {specificReminders.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <p className="font-medium text-foreground text-xs mb-1">Condition-specific tips:</p>
                        <ul className="space-y-0.5">
                          {specificReminders.slice(0, 2).map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-blue-500 mt-0.5">&#x2022;</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </PacketSection>
      </div>

      {/* Section 3: Evidence Summary */}
      <div id="evidence">
        <PacketSection title="Evidence Summary" icon={FileText} sectionNumber={3}>
          {allConditions.length === 0 ? (
            <EmptyState text="No conditions to show evidence for" />
          ) : (
            <div className="space-y-4">
              {allConditions.map((condition) => {
                const evidence = getEvidenceSummary(condition.name);
                return (
                  <div key={condition.id} className="space-y-2">
                    <p className="font-semibold text-foreground text-sm">{condition.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <EvidenceItem label="Medical Records" count={evidence.medRecords} />
                      <EvidenceItem label="Buddy Statements" count={evidence.buddyCount} />
                      <EvidenceItem label="Nexus Letter" status={evidence.hasNexus} />
                      <EvidenceItem label="Personal Statement" status={evidence.hasPersonalStatement} />
                    </div>
                    {evidence.gaps.length > 0 && (
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-400">
                          Missing: {evidence.gaps.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </PacketSection>
      </div>

      {/* Section 4: Symptom History */}
      <div id="symptom-history">
        <PacketSection title="Symptom History (90 Days)" icon={Activity} sectionNumber={4}>
          {symptomSummary.totalLogs === 0 && !symptomSummary.avgSleep && symptomSummary.migraineCount === 0 ? (
            <EmptyState text="No symptom data recorded yet" />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Avg Pain Level" value={`${symptomSummary.avgPain}/10`} />
                <StatCard label="Flare-Ups" value={String(symptomSummary.flareUps)} />
                <StatCard
                  label="Worst Pain"
                  value={symptomSummary.worstPain > 0 ? `${symptomSummary.worstPain}/10` : 'N/A'}
                  sub={symptomSummary.worstDate || undefined}
                />
                <StatCard label="Total Logs" value={String(symptomSummary.totalLogs)} />
              </div>

              {symptomSummary.avgSleep && (
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-sm font-medium text-foreground">Sleep</p>
                  <p className="text-xs text-muted-foreground">
                    Average: {symptomSummary.avgSleep} hrs/night
                  </p>
                </div>
              )}

              {symptomSummary.migraineCount > 0 && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm font-medium text-foreground">Migraines</p>
                  <p className="text-xs text-muted-foreground">
                    {symptomSummary.migraineCount} episodes, {symptomSummary.prostratingCount} prostrating
                  </p>
                </div>
              )}

              {symptomSummary.currentMeds.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Current Medications</p>
                  {symptomSummary.currentMeds.map((med) => (
                    <p key={med.id} className="text-xs text-muted-foreground">
                      {med.name} — {med.prescribedFor || 'N/A'}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </PacketSection>
      </div>

      {/* Section 5: Key Talking Points */}
      <div id="talking-points">
        <PacketSection title="Key Talking Points" icon={MessageSquare} sectionNumber={5} defaultOpen>
          <div className="space-y-4">
            {/* Universal reminders */}
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-sm">For ALL conditions:</p>
              <ul className="space-y-2">
                {[
                  'Describe your WORST days, not your average',
                  'Mention how this limits your daily activities and work',
                  'Bring up frequency: how often symptoms occur',
                  "Don't minimize — the examiner is evaluating functional loss",
                  'Be specific with numbers (e.g., "3-4 times per week")',
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-blue-500 font-bold mt-0.5 shrink-0">&#x2022;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Condition-specific reminders */}
            {allConditions.map((condition) => {
              const reminders = getConditionSpecificReminders(condition.name);
              if (reminders.length === 0) return null;
              return (
                <div key={condition.id} className="space-y-2">
                  <p className="font-semibold text-foreground text-sm">
                    For {condition.name}:
                  </p>
                  <ul className="space-y-1.5">
                    {reminders.map((reminder, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-amber-500 mt-0.5 shrink-0">&#x25B8;</span>
                        {reminder}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </PacketSection>
      </div>

      {/* Section 6: Questions to Expect */}
      <div id="questions">
        <PacketSection title="Questions to Expect" icon={HelpCircle} sectionNumber={6}>
          <AIDisclaimer variant="banner" className="mb-2" />
          {allConditions.length === 0 ? (
            <EmptyState text="Add conditions to generate expected questions" />
          ) : (
            <div className="space-y-4">
              {allConditions.map((condition) => (
                <div key={condition.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-sm">{condition.name}</p>
                    {!examQuestions[condition.name] && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateQuestions(condition.name)}
                        disabled={loadingQuestions.has(condition.name) || aiLoading}
                      >
                        {loadingQuestions.has(condition.name) ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3 mr-1" />
                        )}
                        Generate
                      </Button>
                    )}
                  </div>
                  {examQuestions[condition.name] ? (
                    <div className="p-3 rounded-lg bg-muted/30 border text-sm whitespace-pre-wrap leading-relaxed">
                      {examQuestions[condition.name]}
                    </div>
                  ) : loadingQuestions.has(condition.name) ? (
                    <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating questions...</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Tap "Generate" to get AI-generated exam questions for this condition
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </PacketSection>
      </div>

      {/* Section 7: Case Law References */}
      <div id="case-law">
        <PacketSection title="Case Law References" icon={Scale} sectionNumber={7}>
          <AIDisclaimer variant="banner" className="mb-2" />
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-400 leading-relaxed">
                Case law references are AI-generated and may contain errors or outdated information. Always verify citations through official legal databases before citing in any filing. Consult a VA-accredited attorney for legal advice.
              </p>
            </div>
          </div>

          {allConditions.length === 0 ? (
            <EmptyState text="Add conditions to find relevant case law" />
          ) : (
            <div className="space-y-4">
              {allConditions.length > 1 && (
                <Button
                  variant="outline"
                  onClick={handleGenerateAllCaseLaw}
                  disabled={caseLawLoading}
                  className="w-full"
                >
                  {caseLawLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Scale className="h-4 w-4 mr-2" />
                  )}
                  Generate Case Law for All Conditions
                </Button>
              )}

              {allConditions.map((condition) => (
                <div key={condition.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-sm">{condition.name}</p>
                    {!caseLawResults[condition.name] && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleGenerateCaseLaw(condition.name, condition.claimType)
                        }
                        disabled={loadingCaseLaw.has(condition.name) || caseLawLoading}
                      >
                        {loadingCaseLaw.has(condition.name) ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Scale className="h-3 w-3 mr-1" />
                        )}
                        Find Case Law
                      </Button>
                    )}
                  </div>
                  {caseLawResults[condition.name] ? (
                    <div className="p-3 rounded-lg bg-muted/30 border text-sm whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                      {caseLawResults[condition.name]}
                    </div>
                  ) : loadingCaseLaw.has(condition.name) ? (
                    <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Searching case law...</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Tap "Find Case Law" to get AI-generated legal references
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </PacketSection>
      </div>

      {/* Footer */}
      <div className="text-center py-4 space-y-2">
        <p className="text-xs text-muted-foreground">
          Prepared by Vet Claim Support — For personal use only — Not an official VA document
        </p>
        <Button
          onClick={handleExportPDF}
          disabled={pdfExporting}
          variant="outline"
          size="lg"
          className="w-full"
        >
          {pdfExporting ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Download className="h-5 w-5 mr-2" />
          )}
          {pdfExporting ? 'Generating PDF...' : 'Export as PDF'}
        </Button>
      </div>
    </div>
  );
}

// --- Helper Components ---

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground w-32 shrink-0 text-sm">{label}:</span>
      <span className="text-foreground font-medium text-sm">{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="text-sm text-muted-foreground py-2">{text}</p>
  );
}

function EvidenceItem({
  label,
  count,
  status,
}: {
  label: string;
  count?: number;
  status?: boolean;
}) {
  const hasIt = count !== undefined ? count > 0 : status;
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
      <div
        className={cn(
          'w-2 h-2 rounded-full shrink-0',
          hasIt ? 'bg-emerald-500' : 'bg-muted-foreground/40'
        )}
      />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-xs font-medium text-foreground">
          {count !== undefined ? (count > 0 ? `${count} collected` : 'None') : status ? 'Yes' : 'Missing'}
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70">{sub}</p>}
    </div>
  );
}
