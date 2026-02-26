import { useState, useMemo, useCallback, useEffect } from 'react';
import { useClaims } from '@/hooks/useClaims';
import useAppStore from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatCard, StatsGrid } from '@/components/ui/stat-card';
import { SuccessOverlay } from '@/components/ui/success-animation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Flag, FileText, Send, Stethoscope, Award, Check,
  Lock, ArrowRight, Sparkles,
  ClipboardList, CheckCircle,
  ExternalLink, Target, AlertTriangle,
  TrendingDown, Clock, Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PageContainer } from '@/components/PageContainer';

// Journey phases configuration
interface JourneyPhase {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  description: string;
  tips: string[];
  checklist: { id: string; label: string; description?: string }[];
  resources?: { label: string; link: string }[];
}

const journeyPhases: JourneyPhase[] = [
  {
    id: 'intent',
    title: 'Intent to File',
    shortTitle: 'Intent',
    icon: <Flag className="h-5 w-5" />,
    description: 'Protect your effective date by filing an Intent to File (ITF) with the VA. This gives you one year to gather evidence while preserving your start date for benefits.',
    tips: [
      'File ITF even if you\'re not ready to submit your full claim',
      'Your effective date determines when back pay starts',
      'You have 1 year from ITF to submit your full claim',
      'ITF can be filed online, by phone, or through a VSO',
    ],
    checklist: [
      { id: 'itf-filed', label: 'Intent to File submitted', description: 'File via VA.gov, phone, or VSO' },
      { id: 'itf-date', label: 'ITF date recorded', description: 'Save your confirmation number' },
      { id: 'itf-deadline', label: 'Deadline marked on calendar', description: 'Must submit claim within 1 year' },
    ],
    resources: [
      { label: 'File Intent to File', link: 'https://www.va.gov/disability/how-to-file-claim/' },
      { label: 'What is ITF?', link: 'https://www.va.gov/resources/your-intent-to-file-a-va-claim/' },
    ],
  },
  {
    id: 'evidence',
    title: 'Gather Evidence',
    shortTitle: 'Evidence',
    icon: <FileText className="h-5 w-5" />,
    description: 'Build the strongest possible case by gathering medical records, service records, buddy statements, and other supporting documentation.',
    tips: [
      'Request your complete STRs from the National Personnel Records Center',
      'Get current diagnosis and doctor summaries from your physician',
      'Buddy statements can fill gaps in official records',
      'Document how conditions affect your daily life',
    ],
    checklist: [
      { id: 'str-requested', label: 'Service Treatment Records requested', description: 'From NPRC or VA' },
      { id: 'med-records', label: 'Current medical records gathered', description: 'Recent diagnoses and treatment' },
      { id: 'nexus-letter', label: 'Doctor summary obtained', description: 'Links condition to service' },
      { id: 'buddy-statements', label: 'Buddy statements collected', description: 'Witness accounts of condition' },
      { id: 'personal-statement', label: 'Personal statement written', description: 'Your account of events and impact' },
      { id: 'dbq-completed', label: 'DBQ completed (if using private doctor)', description: 'Disability Benefits Questionnaire' },
    ],
    resources: [
      { label: 'Request Military Records', link: 'https://www.archives.gov/veterans/military-service-records' },
      { label: 'Download DBQ Forms', link: 'https://www.va.gov/find-forms/?q=dbq' },
    ],
  },
  {
    id: 'submit',
    title: 'Submit Claim',
    shortTitle: 'Submit',
    icon: <Send className="h-5 w-5" />,
    description: 'Submit your fully developed claim with all evidence attached. Choose the right claim type and ensure everything is properly organized.',
    tips: [
      'Consider submitting as a Fully Developed Claim (FDC) for faster processing',
      'Double-check all forms are completely filled out',
      'Organize evidence by condition with a cover letter',
      'Keep copies of everything you submit',
    ],
    checklist: [
      { id: 'va21-526ez', label: 'VA Form 21-526EZ completed', description: 'Main disability claim form' },
      { id: 'evidence-attached', label: 'All evidence attached', description: 'Medical records, statements, etc.' },
      { id: 'claim-type', label: 'Claim type selected', description: 'FDC or Standard Claim' },
      { id: 'claim-submitted', label: 'Claim submitted', description: 'Via VA.gov or mail' },
      { id: 'confirmation', label: 'Confirmation number saved', description: 'Track your claim status' },
    ],
    resources: [
      { label: 'Submit Claim Online', link: 'https://www.va.gov/disability/file-disability-claim-form-21-526ez/' },
      { label: 'Track Claim Status', link: 'https://www.va.gov/claim-or-appeal-status/' },
    ],
  },
  {
    id: 'exam',
    title: 'C&P Exam',
    shortTitle: 'C&P Exam',
    icon: <Stethoscope className="h-5 w-5" />,
    description: 'Attend your Compensation & Pension examination. The examiner will evaluate your conditions and their severity for the VA rating decision.',
    tips: [
      'Describe your worst days, not average days',
      'Bring a list of all conditions and symptoms',
      'Don\'t minimize your symptoms or try to tough it out',
      'Note any flare-ups, limitations, and how conditions affect work/life',
    ],
    checklist: [
      { id: 'exam-scheduled', label: 'C&P exam scheduled', description: 'Check mail and phone regularly' },
      { id: 'prep-notes', label: 'Preparation notes ready', description: 'Symptoms, flare-ups, limitations' },
      { id: 'docs-gathered', label: 'Documents gathered to bring', description: 'ID, medical records, list of conditions' },
      { id: 'exam-attended', label: 'Exam attended', description: 'Be thorough and honest' },
      { id: 'exam-notes', label: 'Post-exam notes written', description: 'Document what happened at exam' },
    ],
    resources: [
      { label: 'C&P Exam Prep Guide', link: '/prep/exam' },
      { label: 'What to Expect', link: 'https://www.va.gov/disability/va-claim-exam/' },
    ],
  },
  {
    id: 'decision',
    title: 'Decision',
    shortTitle: 'Decision',
    icon: <Award className="h-5 w-5" />,
    description: 'Receive your rating decision and understand your options. Whether approved, partially approved, or denied, know your next steps.',
    tips: [
      'Review your decision letter carefully',
      'Check for errors in the VA\'s reasoning',
      'You have 1 year to appeal any decision',
      'Consider consulting a VSO or attorney for appeals',
    ],
    checklist: [
      { id: 'decision-received', label: 'Decision letter received', description: 'Review thoroughly' },
      { id: 'rating-understood', label: 'Rating understood', description: 'Know what each percentage means' },
      { id: 'effective-date', label: 'Effective date confirmed', description: 'When benefits start' },
      { id: 'appeal-deadline', label: 'Appeal deadline noted', description: '1 year from decision date' },
    ],
    resources: [
      { label: 'Understanding Your Decision', link: 'https://www.va.gov/disability/about-disability-ratings/' },
      { label: 'Appeal Options', link: 'https://www.va.gov/decision-reviews/' },
    ],
  },
];

// --- VA Claim Status Tracker with Regression Detection ---

const VA_CLAIM_PHASES = [
  { id: 'claim-received', label: 'Claim Received', order: 1, avgDays: 7 },
  { id: 'initial-review', label: 'Initial Review', order: 2, avgDays: 14 },
  { id: 'evidence-gathering', label: 'Evidence Gathering', order: 3, avgDays: 45 },
  { id: 'review-of-evidence', label: 'Review of Evidence', order: 4, avgDays: 30 },
  { id: 'preparation-for-decision', label: 'Preparation for Decision', order: 5, avgDays: 21 },
  { id: 'pending-decision-approval', label: 'Pending Decision Approval', order: 6, avgDays: 14 },
  { id: 'preparation-for-notification', label: 'Preparation for Notification', order: 7, avgDays: 7 },
  { id: 'complete', label: 'Complete', order: 8, avgDays: 0 },
] as const;

const STATUS_STORAGE_KEY = 'vet-claim-status-log';

interface StatusLogEntry {
  id: string;
  phase: string;
  loggedAt: string;
  notes: string;
}

function loadStatusLog(): StatusLogEntry[] {
  try {
    const stored = localStorage.getItem(STATUS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStatusLog(entries: StatusLogEntry[]): void {
  try {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // silently ignore
  }
}

function detectRegression(entries: StatusLogEntry[]): { isRegression: boolean; from: string; to: string; explanation: string } | null {
  if (entries.length < 2) return null;

  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];

  const latestPhase = VA_CLAIM_PHASES.find(p => p.id === latest.phase);
  const previousPhase = VA_CLAIM_PHASES.find(p => p.id === previous.phase);

  if (!latestPhase || !previousPhase) return null;

  if (latestPhase.order < previousPhase.order) {
    return {
      isRegression: true,
      from: previousPhase.label,
      to: latestPhase.label,
      explanation: getRegressExplanation(previousPhase.id, latestPhase.id),
    };
  }

  return null;
}

function getRegressExplanation(fromPhase: string, toPhase: string): string {
  if (toPhase === 'evidence-gathering') {
    return 'Your claim moved back to Evidence Gathering. This often means the VA needs additional evidence, medical records, or a new C&P exam. Check your VA.gov account for any requests and respond promptly to avoid delays.';
  }
  if (toPhase === 'initial-review') {
    return 'Your claim returned to Initial Review. This may indicate an error was found or a new issue was added. Contact your VSO or check VA.gov for updates.';
  }
  if (fromPhase === 'pending-decision-approval' || fromPhase === 'preparation-for-decision') {
    return 'Your claim moved backward from the decision stage. This sometimes happens when a reviewer identifies missing information or requests a specialist opinion. While frustrating, this can lead to a more favorable outcome.';
  }
  return 'Your claim moved to an earlier processing stage. This is not uncommon and may indicate the VA is gathering additional information. Check VA.gov or contact your VSO for specific details about why.';
}

function getDaysInPhase(entries: StatusLogEntry[]): number {
  if (entries.length === 0) return 0;
  const latest = entries[entries.length - 1];
  const logDate = new Date(latest.loggedAt);
  const now = new Date();
  return Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
}

function ClaimStatusTracker() {
  const [entries, setEntries] = useState<StatusLogEntry[]>(() => loadStatusLog());
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showTracker, setShowTracker] = useState(entries.length > 0);

  const regression = useMemo(() => detectRegression(entries), [entries]);
  const daysInPhase = useMemo(() => getDaysInPhase(entries), [entries]);

  const currentPhase = entries.length > 0
    ? VA_CLAIM_PHASES.find(p => p.id === entries[entries.length - 1].phase)
    : null;

  const isOverdue = currentPhase ? daysInPhase > currentPhase.avgDays * 1.5 : false;

  const addStatusEntry = useCallback(() => {
    if (!selectedStatus) return;
    const newEntry: StatusLogEntry = {
      id: crypto.randomUUID(),
      phase: selectedStatus,
      loggedAt: new Date().toISOString(),
      notes: '',
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    saveStatusLog(updated);
    setSelectedStatus('');
  }, [selectedStatus, entries]);

  if (!showTracker && entries.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="py-6">
          <div className="text-center space-y-3">
            <div className="p-3 rounded-full bg-muted inline-flex">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">VA Claim Status Tracker</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Track your claim's progress through VA processing and get alerts if it moves backward.
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowTracker(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Start Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">VA Claim Status Tracker</CardTitle>
            <CardDescription>
              Log your claim status from VA.gov to track progress and detect movement
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Regression Alert */}
        {regression && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              <strong>Claim moved backward:</strong> {regression.from} → {regression.to}
              <p className="mt-2 text-sm opacity-90">{regression.explanation}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Overdue Alert */}
        {isOverdue && currentPhase && !regression && (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700 dark:text-orange-400">
              <strong>Longer than average:</strong> Your claim has been in "{currentPhase.label}" for {daysInPhase} days.
              The VA average for this phase is ~{currentPhase.avgDays} days.
              Consider checking VA.gov or calling the VA hotline (800-827-1000).
            </AlertDescription>
          </Alert>
        )}

        {/* Current Status Display */}
        {currentPhase && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Current Status</p>
              <p className="font-semibold text-lg">{currentPhase.label}</p>
              <p className="text-sm text-muted-foreground">
                {daysInPhase} days in this phase
                {currentPhase.avgDays > 0 && (
                  <> (VA avg: ~{currentPhase.avgDays} days)</>
                )}
              </p>
            </div>
            {currentPhase.avgDays > 0 && (
              <div className="text-right">
                <Progress
                  value={Math.min((daysInPhase / currentPhase.avgDays) * 100, 100)}
                  className={cn('h-2 w-24', isOverdue && '[&>div]:bg-orange-500')}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((daysInPhase / currentPhase.avgDays) * 100)}% of avg
                </p>
              </div>
            )}
          </div>
        )}

        {/* Phase Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Received</span>
            <span>Complete</span>
          </div>
          <div className="flex gap-1">
            {VA_CLAIM_PHASES.map((phase) => {
              const latestPhaseOrder = currentPhase?.order || 0;
              const isCurrent = phase.id === currentPhase?.id;
              const isPast = phase.order < latestPhaseOrder;
              return (
                <div
                  key={phase.id}
                  className={cn(
                    'flex-1 h-3 rounded-sm transition-colors',
                    isPast && 'bg-green-500',
                    isCurrent && 'bg-primary animate-pulse',
                    !isPast && !isCurrent && 'bg-muted',
                  )}
                  title={phase.label}
                />
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Log New Status */}
        <div className="flex gap-3">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select current claim status from VA.gov" />
            </SelectTrigger>
            <SelectContent>
              {VA_CLAIM_PHASES.map(phase => (
                <SelectItem key={phase.id} value={phase.id}>
                  {phase.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addStatusEntry} disabled={!selectedStatus}>
            <Plus className="h-4 w-4 mr-2" />
            Log
          </Button>
        </div>

        {/* Status History */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status History</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {[...entries].reverse().map((entry, idx) => {
                const phase = VA_CLAIM_PHASES.find(p => p.id === entry.phase);
                const prevEntry = entries[entries.length - 1 - idx - 1];
                const prevPhase = prevEntry ? VA_CLAIM_PHASES.find(p => p.id === prevEntry.phase) : null;
                const isRegress = prevPhase && phase && phase.order < prevPhase.order;

                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                      isRegress ? 'bg-red-500/5 border border-red-500/20' : 'bg-muted/30',
                    )}
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      isRegress ? 'bg-red-500' : idx === 0 ? 'bg-primary' : 'bg-muted-foreground/40',
                    )} />
                    <span className="font-medium flex-1">{phase?.label || entry.phase}</span>
                    {isRegress && <TrendingDown className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.loggedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ClaimJourney() {
  const { data } = useClaims();
  const setJourneyProgress = useAppStore((s) => s.setJourneyProgress);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedPhaseId, setCompletedPhaseId] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<JourneyPhase | null>(null);

  // Get journey progress from stored data
  const journeyProgress = useMemo(() => data.journeyProgress || {
    currentPhase: 0,
    completedChecklist: {},
    phaseCompletedDates: {},
  }, [data.journeyProgress]);

  // Calculate phase completion percentages
  const phaseProgress = useMemo(() => {
    return journeyPhases.map(phase => {
      const checkedItems = phase.checklist.filter(
        item => journeyProgress.completedChecklist[item.id]
      ).length;
      return Math.round((checkedItems / phase.checklist.length) * 100);
    });
  }, [journeyProgress.completedChecklist]);

  // Overall progress
  const overallProgress = useMemo(() => {
    const totalItems = journeyPhases.reduce((sum, phase) => sum + phase.checklist.length, 0);
    const completedItems = Object.values(journeyProgress.completedChecklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  }, [journeyProgress.completedChecklist]);

  // Check for phase completion
  useEffect(() => {
    journeyPhases.forEach((phase, index) => {
      const isComplete = phase.checklist.every(
        item => journeyProgress.completedChecklist[item.id]
      );
      const wasNotComplete = !journeyProgress.phaseCompletedDates?.[phase.id];

      if (isComplete && wasNotComplete && index === journeyProgress.currentPhase) {
        // Phase just completed
        setCompletedPhaseId(phase.id);
        setShowCelebration(true);

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#ECC840', '#f59e0b', '#ec4899'],
        });

        // Update progress
        const newProgress = {
          ...journeyProgress,
          currentPhase: Math.min(index + 1, journeyPhases.length - 1),
          phaseCompletedDates: {
            ...journeyProgress.phaseCompletedDates,
            [phase.id]: new Date().toISOString(),
          },
        };
        setJourneyProgress(newProgress);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally fires only on checklist changes. Adding `journeyProgress` would cause an extra re-fire after updateData modifies it; `updateData` stability from context is not guaranteed.
  }, [journeyProgress.completedChecklist]);

  const handleChecklistChange = useCallback((itemId: string, checked: boolean) => {
    const newChecklist = {
      ...journeyProgress.completedChecklist,
      [itemId]: checked,
    };
    setJourneyProgress({
      ...journeyProgress,
      completedChecklist: newChecklist,
    });
  }, [journeyProgress, setJourneyProgress]);

  const getPhaseStatus = (index: number) => {
    if (phaseProgress[index] === 100) return 'completed';
    if (index === journeyProgress.currentPhase) return 'current';
    if (index < journeyProgress.currentPhase) return 'completed';
    return 'locked';
  };

  const currentPhase = journeyPhases[journeyProgress.currentPhase];

  return (
    <PageContainer className="py-8 space-y-8 animate-fade-in">
      {/* Celebration Overlay */}
      <SuccessOverlay
        show={showCelebration}
        message="Phase Complete!"
        subMessage={`You've completed the ${completedPhaseId ? journeyPhases.find(p => p.id === completedPhaseId)?.title : ''} phase`}
        size="lg"
        variant="celebration"
        onDismiss={() => setShowCelebration(false)}
        autoHide
        autoHideDelay={4000}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Claim Journey</h1>
            <p className="text-muted-foreground">Your path to VA disability benefits</p>
          </div>
        </div>
        <ProgressRing value={overallProgress} size="md" variant="primary" label="Overall" />
      </div>

      {/* Phase Timeline */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {journeyPhases.map((phase, index) => {
              const status = getPhaseStatus(index);
              const isLast = index === journeyPhases.length - 1;

              return (
                <div
                  key={phase.id}
                  className={cn(
                    'flex items-center',
                    !isLast && 'flex-1'
                  )}
                >
                  {/* Phase Circle */}
                  <button
                    onClick={() => status !== 'locked' && setSelectedPhase(phase)}
                    disabled={status === 'locked'}
                    className={cn(
                      'relative flex flex-col items-center transition-all duration-300',
                      status !== 'locked' && 'cursor-pointer hover:scale-105',
                      status === 'locked' && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300',
                        status === 'completed' && 'bg-green-500 text-white shadow-lg shadow-green-500/30',
                        status === 'current' && 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20',
                        status === 'locked' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {status === 'completed' ? (
                        <Check className="h-6 w-6" />
                      ) : status === 'locked' ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        phase.icon
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-2 text-xs font-medium text-center max-w-[80px]',
                        status === 'completed' && 'text-green-600 dark:text-green-500',
                        status === 'current' && 'text-primary',
                        status === 'locked' && 'text-muted-foreground'
                      )}
                    >
                      {phase.shortTitle}
                    </span>
                    {status !== 'locked' && (
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        {phaseProgress[index]}%
                      </span>
                    )}
                  </button>

                  {/* Connector Line */}
                  {!isLast && (
                    <div className="flex-1 mx-2 h-1 rounded-full bg-muted relative overflow-hidden">
                      <div
                        className={cn(
                          'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
                          status === 'completed' ? 'bg-green-500' : 'bg-primary/30'
                        )}
                        style={{
                          width: status === 'completed' ? '100%' : status === 'current' ? `${phaseProgress[index]}%` : '0%',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <StatsGrid columns={4}>
        <StatCard
          label="Current Phase"
          value={journeyProgress.currentPhase + 1}
          suffix={` of ${journeyPhases.length}`}
          variant="primary"
          icon={<Flag className="h-5 w-5" />}
        />
        <StatCard
          label="Items Complete"
          value={Object.values(journeyProgress.completedChecklist).filter(Boolean).length}
          suffix={` / ${journeyPhases.reduce((sum, p) => sum + p.checklist.length, 0)}`}
          variant="success"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Phases Done"
          value={journeyPhases.filter((_, i) => getPhaseStatus(i) === 'completed').length}
          variant="default"
          icon={<Award className="h-5 w-5" />}
        />
        <StatCard
          label="Overall Progress"
          value={overallProgress}
          suffix="%"
          variant="primary"
          icon={<Target className="h-5 w-5" />}
        />
      </StatsGrid>

      {/* Current Phase Detail */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
              {currentPhase.icon}
            </div>
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="mb-1">Current Phase</Badge>
              <CardTitle className="truncate">{currentPhase.title}</CardTitle>
              <CardDescription className="line-clamp-2">{currentPhase.description}</CardDescription>
            </div>
            <ProgressRing
              value={phaseProgress[journeyProgress.currentPhase]}
              size="md"
              variant={phaseProgress[journeyProgress.currentPhase] === 100 ? 'success' : 'primary'}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Tips */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              Tips for Success
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPhase.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-gold/5 border border-gold/20">
                  <CheckCircle className="h-4 w-4 text-gold-dk mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Phase Checklist
            </h3>
            <div className="space-y-2">
              {currentPhase.checklist.map((item) => {
                const isChecked = journeyProgress.completedChecklist[item.id];
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-xl border transition-all duration-300',
                      isChecked
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-card border-border/50 hover:border-primary/30'
                    )}
                  >
                    <Checkbox
                      id={item.id}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleChecklistChange(item.id, !!checked)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={item.id}
                        className={cn(
                          'font-medium cursor-pointer',
                          isChecked && 'line-through text-muted-foreground'
                        )}
                      >
                        {item.label}
                      </label>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                      )}
                    </div>
                    {isChecked && (
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resources */}
          {currentPhase.resources && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" />
                Helpful Resources
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentPhase.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.link}
                    target={resource.link.startsWith('http') ? '_blank' : undefined}
                    rel={resource.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
                  >
                    {resource.label}
                    {resource.link.startsWith('http') && (
                      <ExternalLink className="h-3.5 w-3.5" />
                    )}
                    {resource.link.startsWith('/') && (
                      <ArrowRight className="h-3.5 w-3.5" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Phases Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">All Phases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {journeyPhases.map((phase, index) => {
            const status = getPhaseStatus(index);
            return (
              <button
                key={phase.id}
                onClick={() => status !== 'locked' && setSelectedPhase(phase)}
                disabled={status === 'locked'}
                className={cn(
                  'text-left p-4 rounded-2xl border transition-all duration-300',
                  status === 'completed' && 'bg-green-500/5 border-green-500/30 hover:border-green-500/50',
                  status === 'current' && 'bg-primary/5 border-primary/30 hover:border-primary/50 ring-2 ring-primary/20',
                  status === 'locked' && 'bg-muted/30 border-border/30 opacity-60 cursor-not-allowed'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      status === 'completed' && 'bg-green-500/20 text-green-600',
                      status === 'current' && 'bg-primary/20 text-primary',
                      status === 'locked' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {status === 'completed' ? <Check className="h-4 w-4" /> : phase.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{phase.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {phase.description}
                    </p>
                    <div className="mt-2">
                      <Progress value={phaseProgress[index]} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {phaseProgress[index]}% complete
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VA Claim Status Tracker with Regression Detection */}
      <ClaimStatusTracker />

      {/* Phase Detail Dialog */}
      <Dialog open={!!selectedPhase} onOpenChange={() => setSelectedPhase(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedPhase && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    {selectedPhase.icon}
                  </div>
                  <div>
                    <DialogTitle>{selectedPhase.title}</DialogTitle>
                    <DialogDescription>{selectedPhase.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Checklist */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Checklist</h4>
                  <div className="space-y-2">
                    {selectedPhase.checklist.map((item) => {
                      const isChecked = journeyProgress.completedChecklist[item.id];
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            'flex items-start gap-3 p-3 rounded-xl border',
                            isChecked ? 'bg-green-500/5 border-green-500/30' : 'bg-muted/30'
                          )}
                        >
                          <Checkbox
                            id={`dialog-${item.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => handleChecklistChange(item.id, !!checked)}
                          />
                          <div>
                            <label htmlFor={`dialog-${item.id}`} className="font-medium text-sm cursor-pointer">
                              {item.label}
                            </label>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Tips</h4>
                  <ul className="space-y-2">
                    {selectedPhase.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                {selectedPhase.resources && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhase.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.link}
                          target={resource.link.startsWith('http') ? '_blank' : undefined}
                          rel={resource.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                        >
                          {resource.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
