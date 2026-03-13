import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';
import { combineRatings } from '@/utils/vaMath';
import useAppStore from '@/store/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { useSentinel } from '@/hooks/useSentinel';
import {
  ChevronRight,
  Zap,
  AlertTriangle,
  Pencil,
  User,
  Target,
  FileText,
  LogIn,
  FolderOpen,
  Clock,
  Map,
  Activity,
  Plus,
  DollarSign,
  Briefcase,
  Gift,
  ShieldAlert,
  Heart,
  Flame,
  Camera,
  Bell,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { vcsSpring } from '@/constants/animations';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getConditionById } from '@/data/vaConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { supabase, getSharedSession } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { IntentToFileBanner } from '@/components/dashboard/IntentToFileBanner';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import { useSmartReminders } from '@/hooks/useSmartReminders';
import { getMonthlyCompensation } from '@/services/vaCompensation';
import { FLARE_UP_TRIGGERS, FLARE_UP_DURATIONS } from '@/types/claims';
import type { QuickLogEntry } from '@/types/claims';
import { notifySuccess, impactLight, impactMedium } from '@/lib/haptics';
import { BRANCH_LABELS, type Branch } from '@/store/useProfileStore';
import { ReadinessDrillDown } from '@/components/ReadinessDrillDown';
import { SyncStatusBadge } from '@/components/SyncStatusBadge';
import { AnimatePresence } from 'motion/react';
import { hasWriteFailures } from '@/lib/encryptedStorage';
import { useToast } from '@/hooks/use-toast';
import { AskIntelSheet } from '@/components/shared/AskIntelSheet';

const JOURNEY_PHASE_LABELS = ['Research', 'Evidence', 'Filing', 'C&P Exam', 'Decision'];

function ReadinessRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 14;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#C5A55A' : '#ef4444';

  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
      <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2.5" />
      <circle
        cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 18 18)"
        className="transition-all duration-700"
      />
      <text x="18" y="20" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="bold">
        {score}
      </text>
    </svg>
  );
}

export default function Dashboard() {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();
  const { vaultDocCount, activeDeadlines, currentPhase, symptoms, quickLogs } = useAppStore(
    useShallow((s) => ({
      vaultDocCount: s.claimDocuments.length,
      activeDeadlines: (s.deadlines ?? []).filter((d) => !d.completed).length,
      currentPhase: s.journeyProgress?.currentPhase ?? 0,
      symptoms: s.symptoms,
      quickLogs: s.quickLogs,
    })),
  );
  const addQuickLog = useMemo(() => useAppStore.getState().addQuickLog, []);
  const navigate = useNavigate();

  // Quick Log state
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [quickLogFeeling, setQuickLogFeeling] = useState(5);
  const [quickLogFlareUp, setQuickLogFlareUp] = useState(false);
  const [quickLogFlareNote, setQuickLogFlareNote] = useState('');
  const [quickLogFlareUpSeverity, setQuickLogFlareUpSeverity] = useState(5);
  const [quickLogFlareUpDuration, setQuickLogFlareUpDuration] = useState<string>('');
  const [quickLogFlareUpTriggers, setQuickLogFlareUpTriggers] = useState<string[]>([]);
  const [quickLogFlareUpActivities, setQuickLogFlareUpActivities] = useState('');
  const [quickLogFollowUp, setQuickLogFollowUp] = useState(false);

  const todayLogged = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return quickLogs.some((l) => l.date === today);
  }, [quickLogs]);

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    getSharedSession().then((s) => setSession(s)).catch(() => { /* session check failed */ });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const { toast } = useToast();
  useEffect(() => {
    if (hasWriteFailures()) {
      toast({
        title: 'Data save issue',
        description: 'Some changes may not have been saved. Please restart the app.',
        variant: 'destructive',
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const streak = useStreakTracker();
  const reminders = useSmartReminders();
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('vcs_dismissed_reminders');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const dismissReminder = useCallback((id: string) => {
    setDismissedReminders((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('vcs_dismissed_reminders', JSON.stringify([...next]));
      return next;
    });
  }, []);
  const promotedReminders = useMemo(
    () => reminders.filter((r) => r.priority === 'high' && !dismissedReminders.has(r.id)).slice(0, 2),
    [reminders, dismissedReminders],
  );
  const remainingReminders = useMemo(
    () => reminders.filter((r) => !promotedReminders.some((p) => p.id === r.id) && !dismissedReminders.has(r.id)).slice(0, 3),
    [reminders, promotedReminders, dismissedReminders],
  );
  const isFirstSession = useProfileStore((s) => s.isFirstSession);
  const setFirstSessionComplete = useProfileStore((s) => s.setFirstSessionComplete);

  const { score: readinessScore, label: readinessLabel } = useSentinel();
  const [showDrillDown, setShowDrillDown] = useState(false);

  const nextSteps = useMemo(
    () => ClaimIntelligence.getNextSteps(profile, userConditions, data),
    [profile, userConditions, data]
  );

  // Combined VA rating (approved conditions only)
  const combinedRating = useMemo(() => {
    const ratings = userConditions
      .filter(uc => uc.claimStatus === 'approved')
      .map(uc => uc.rating)
      .filter((r): r is number => r !== undefined && r > 0);
    return combineRatings(ratings);
  }, [userConditions]);

  // Unified "What to Do Next" items — merge nextSteps + contextual discovery
  const unifiedNextItems = useMemo(() => {
    const items: { id: string; title: string; description?: string; route?: string; priority?: string }[] = [];
    const seen = new Set<string>();

    // Add ClaimIntelligence next steps first
    for (const step of nextSteps) {
      if (!seen.has(step.title)) {
        items.push({ id: step.id, title: step.title, description: step.description, route: step.actionRoute, priority: step.priority });
        seen.add(step.title);
      }
    }

    // Add contextual items if conditions exist
    if (userConditions.length > 0) {
      if (symptoms.length >= 3 && !seen.has('Evidence Strength')) {
        items.push({ id: 'evidence-strength', title: 'Evidence Strength', description: `See how your ${symptoms.length} symptom logs align with VA rating criteria`, route: '/claims/evidence-strength' });
        seen.add('Evidence Strength');
      }
      if (userConditions.some(uc => uc.claimStatus === 'denied') && !seen.has('Decision Decoder')) {
        items.push({ id: 'decision-decoder', title: 'Decision Decoder', description: 'Understand your denial in plain English and see your options', route: '/claims/decision-decoder' });
        seen.add('Decision Decoder');
      }
    }

    return items.slice(0, 5);
  }, [nextSteps, userConditions, symptoms]);

  // Condition Intelligence Cards — per-condition readiness with CTA
  const conditionCards = useMemo(() => {
    if (userConditions.length === 0) return [];
    return userConditions.slice(0, 3).map((uc) => {
      const readiness = ClaimIntelligence.getConditionReadiness(
        getConditionDisplayName(uc),
        data,
      );
      const details = getConditionById(uc.conditionId);
      const name = details?.abbreviation || details?.name || getConditionDisplayName(uc);

      // Pick the most impactful CTA based on lowest component
      const components = readiness.components;
      const lowest = Object.entries(components).reduce((a, b) => (a[1] <= b[1] ? a : b));
      let ctaLabel = 'Review Evidence';
      let ctaRoute = `/claims`;
      if (lowest[0] === 'medicalEvidence') {
        ctaLabel = 'Add Medical Evidence';
        ctaRoute = '/health/visits';
      } else if (lowest[0] === 'currentSeverity') {
        ctaLabel = 'Log Symptoms';
        ctaRoute = '/health/symptoms';
      } else if (lowest[0] === 'statements') {
        ctaLabel = 'Get Buddy Statement';
        ctaRoute = '/prep/buddy-statement';
      } else if (lowest[0] === 'examPrep') {
        ctaLabel = 'Prep for C&P Exam';
        ctaRoute = '/prep/exam';
      } else if (lowest[0] === 'serviceConnection') {
        ctaLabel = 'Strengthen Service Link';
        ctaRoute = '/claims';
      }

      return {
        id: uc.id,
        name,
        score: readiness.overallScore,
        tip: readiness.tips[0] || 'Keep building evidence for this condition.',
        ctaLabel,
        ctaRoute,
      };
    });
  }, [userConditions, data]);

  // Claim Insights — rule-based observations
  const claimInsights = useMemo(
    () => ClaimIntelligence.getInsights(data, userConditions),
    [data, userConditions],
  );

  const displayName = profile.firstName
    ? `${profile.firstName}${profile.lastName ? ' ' + profile.lastName : ''}`
    : 'Veteran';
  const branchLabel = getAllBranchLabels(profile);

  const separationDateParsed = profile.separationDate
    ? new Date(profile.separationDate + 'T00:00:00')
    : null;

  const setSeparationDate = useProfileStore((s) => s.setSeparationDate);
  const handleSeparationDateChange = useCallback((date: Date | null) => {
    if (date) {
      const formatted = date.toISOString().split('T')[0];
      setSeparationDate(formatted);
    }
  }, [setSeparationDate]);

  const phaseLabel = JOURNEY_PHASE_LABELS[currentPhase] || `Phase ${currentPhase + 1}`;

  // Monthly compensation estimate
  const monthlyCompensation = useMemo(
    () => getMonthlyCompensation(combinedRating),
    [combinedRating],
  );

  // TDIU eligibility check (simple — schedular criteria)
  const tdiuSuggestion = useMemo(() => {
    const approvedRatings = userConditions
      .filter((c) => c.claimStatus === 'approved' && typeof c.rating === 'number' && c.rating > 0)
      .map((c) => c.rating as number);
    if (approvedRatings.length === 0) return false;
    const hasOneAt60 = approvedRatings.some((r) => r >= 60);
    const hasOneAt40 = approvedRatings.some((r) => r >= 40);
    return hasOneAt60 || (combinedRating >= 70 && hasOneAt40);
  }, [userConditions, combinedRating]);

  // Medication rule readiness
  const medRuleDismissed = useMemo(() => {
    const ts = localStorage.getItem('vcs_medrule_dismissed');
    if (!ts) return false;
    // Re-show monthly
    return Date.now() - parseInt(ts, 10) < 30 * 24 * 60 * 60 * 1000;
  }, []);
  const hasMedications = data.medications.length > 0;

  return (
    <PageContainer className="space-y-4 animate-fade-in">
      {/* Section 1: Alert Zone */}
      <IntentToFileBanner />

      {/* Promoted Smart Reminders (high priority) */}
      {promotedReminders.length > 0 && (
        <div className="space-y-2">
          {promotedReminders.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={vcsSpring}
              className="flex items-start gap-3 p-3 rounded-2xl border border-gold/30 bg-gold/5"
            >
              <Bell className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
                {r.actionRoute && (
                  <button
                    onClick={() => navigate(r.actionRoute!)}
                    className="mt-2 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
                  >
                    Take action &rarr;
                  </button>
                )}
              </div>
              <button
                onClick={() => dismissReminder(r.id)}
                className="p-1 rounded-lg hover:bg-accent transition-colors shrink-0"
                aria-label="Dismiss reminder"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* First Session Welcome Card */}
      {isFirstSession && profile.hasCompletedOnboarding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl border border-gold/30 bg-linear-to-br from-gold/10 to-gold/5 p-5 space-y-3"
        >
          <h2 className="text-lg font-bold text-foreground">
            Welcome{profile.firstName ? `, ${profile.firstName}` : ''}!
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile.branch && BRANCH_LABELS[profile.branch as Branch]
              ? `Thank you for your service in the ${BRANCH_LABELS[profile.branch as Branch]}. `
              : 'Thank you for your service. '}
            {profile.claimGoal === 'initial'
              ? "Let's build your first VA disability claim. Start by filing an Intent to File to protect your effective date."
              : profile.claimGoal === 'increase'
                ? "Let's work on increasing your current rating. Start by adding your rated conditions so we can identify opportunities."
                : profile.claimGoal === 'appeal'
                  ? "We'll help you understand your denial and build a stronger appeal. Start by adding the denied condition."
                  : profile.claimGoal === 'secondary'
                    ? "We'll help you find and claim secondary conditions. Add your primary conditions first so we can identify connections."
                    : "Let's get your claim organized. Start by adding your conditions below."}
          </p>
          <div className="flex gap-2 pt-1">
            {profile.claimGoal === 'initial' && !profile.intentToFileFiled && (
              <button
                onClick={() => navigate('/claims/itf')}
                className="flex-1 py-2.5 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition-colors"
              >
                File Intent to File
              </button>
            )}
            <button
              onClick={() => navigate('/claims')}
              className="flex-1 py-2.5 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition-colors"
            >
              {userConditions.length === 0 ? 'Add Your Conditions' : 'View Conditions'}
            </button>
            <button
              onClick={() => setFirstSessionComplete()}
              className="py-2.5 px-4 rounded-xl border border-border text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {!session && (
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 active:scale-[0.98] transition-all text-left"
        >
          <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <LogIn className="h-4 w-4 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Sign in to sync your data</p>
            <p className="text-xs text-muted-foreground">Keep your claim data backed up and accessible across devices</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      )}

      {profile.separationDate && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={vcsSpring}>
          <BDDCountdown separationDate={separationDateParsed} onSeparationDateChange={handleSeparationDateChange} />
        </motion.div>
      )}

      {/* Section 2: Compact Greeting Row */}
      <div className="rounded-2xl border border-border bg-card p-3 overflow-hidden max-w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-foreground font-semibold truncate">{displayName}</p>
              {streak.currentStreak > 0 && (
                <span className="shrink-0 text-xs font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded-full">
                  &#x1F525;{streak.currentStreak}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {[branchLabel, `${userConditions.length} condition${userConditions.length !== 1 ? 's' : ''}`].filter(Boolean).join(' · ')}
            </p>
          </div>
          <ExportButton />
          <button
            onClick={() => navigate('/settings/edit-profile')}
            className="p-2 rounded-lg hover:bg-accent transition-colors shrink-0"
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Section 3: Combined Rating Ring */}
      <Link to="/claims/calculator" className="block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl bg-card border border-border p-4 hover:bg-accent/30 transition-colors cursor-pointer overflow-hidden max-w-full"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" role="img" aria-label={`Combined VA rating: ${combinedRating} percent`}>
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="var(--gold-md, #C5A55A)" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${combinedRating}, 100`}
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${combinedRating}, 100` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-base">
                {combinedRating}%
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">My Combined Rating</p>
              {(() => {
                const ratedConditions = userConditions.filter(uc => uc.rating !== undefined);
                if (ratedConditions.length === 0) {
                  return <p className="text-sm text-muted-foreground mt-1">Add conditions with ratings to calculate</p>;
                }
                return (
                  <div className="mt-1 space-y-0.5">
                    {ratedConditions.slice(0, 4).map(uc => {
                      const details = getConditionById(uc.conditionId);
                      return (
                        <p key={uc.id} className="text-xs text-muted-foreground truncate">
                          {details?.abbreviation || details?.name || getConditionDisplayName(uc)}: {uc.rating}%
                        </p>
                      );
                    })}
                    {ratedConditions.length > 4 && (
                      <p className="text-xs text-muted-foreground">+{ratedConditions.length - 4} more</p>
                    )}
                  </div>
                );
              })()}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </motion.div>
      </Link>

      {/* Section 4: Quick Access Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={vcsSpring}
        className="grid grid-cols-2 gap-2"
      >
        <Link
          to="/claims/vault"
          aria-label={`Documents & Scan — ${vaultDocCount > 0 ? `${vaultDocCount} stored` : 'No docs yet'}`}
          className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
            <FolderOpen className="h-4 w-4 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Documents</p>
            <p className="text-[11px] text-muted-foreground">
              {vaultDocCount > 0 ? `${vaultDocCount} stored` : 'No docs yet'}
            </p>
          </div>
          <Camera className="h-4 w-4 text-gold/60 shrink-0" />
        </Link>
        <Link
          to="/claims/deadlines"
          aria-label={`Deadlines — ${activeDeadlines > 0 ? `${activeDeadlines} active` : 'None set'}`}
          className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Deadlines</p>
            <p className="text-[11px] text-muted-foreground">
              {activeDeadlines > 0 ? `${activeDeadlines} active` : 'None set'}
            </p>
          </div>
        </Link>
        <Link
          to="/claims/journey"
          aria-label={`Journey — ${phaseLabel}`}
          className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
            <Map className="h-4 w-4 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Journey</p>
            <p className="text-[11px] text-muted-foreground">{phaseLabel}</p>
          </div>
        </Link>
        {userConditions.length > 0 ? (
          <button
            onClick={() => { impactMedium(); setShowDrillDown(!showDrillDown); }}
            aria-label={`Readiness — ${readinessScore}% — ${readinessLabel}`}
            className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors text-left"
          >
            <ReadinessRing score={readinessScore} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Readiness</p>
              <p className="text-[11px] text-muted-foreground">{readinessLabel}</p>
            </div>
          </button>
        ) : (
          <Link
            to="/claims"
            aria-label="Add Conditions — Start your claim"
            className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <Plus className="h-4 w-4 text-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Add Conditions</p>
              <p className="text-[11px] text-muted-foreground">Start your claim</p>
            </div>
          </Link>
        )}
      </motion.div>

      {/* Readiness Drill-Down (expands when readiness tapped) */}
      <AnimatePresence>
        {showDrillDown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-border bg-card p-4 overflow-hidden"
          >
            <ReadinessDrillDown onClose={() => setShowDrillDown(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sync Status */}
      <div className="flex justify-end">
        <SyncStatusBadge />
      </div>

      {/* Section 4b: Condition Intelligence Cards */}
      {conditionCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl bg-card border border-border p-4 overflow-hidden max-w-full"
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-gold" />
            Condition Readiness
          </h3>
          <div className="space-y-2">
            {conditionCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-secondary/30"
              >
                <ReadinessRing score={card.score} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{card.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{card.tip}</p>
                </div>
                <button
                  onClick={() => navigate(card.ctaRoute)}
                  className="shrink-0 text-[11px] font-medium text-gold bg-gold/10 px-2.5 py-1.5 rounded-lg hover:bg-gold/20 transition-colors whitespace-nowrap"
                >
                  {card.ctaLabel}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section 4c: Claim Insights */}
      {claimInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl bg-card border border-border p-4 overflow-hidden max-w-full"
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-gold" />
            Claim Insights
          </h3>
          <div className="space-y-2">
            {claimInsights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  'flex items-start gap-2 p-2.5 rounded-xl text-xs',
                  insight.category === 'positive'
                    ? 'bg-gold/5 border border-gold/20'
                    : insight.category === 'actionable'
                      ? 'bg-gold/5 border border-gold/20'
                      : 'bg-muted/50 border border-border',
                )}
              >
                <span className={cn(
                  'shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full',
                  insight.category === 'positive' ? 'bg-gold' : insight.category === 'actionable' ? 'bg-gold' : 'bg-muted-foreground',
                )} />
                <p className="text-muted-foreground">{insight.text}</p>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-muted-foreground/50 mt-2">
            Based on your documented data. Not a rating prediction.
          </p>
        </motion.div>
      )}

      {/* Section 5: Your Next Steps (primary CTA — promoted from Section 6) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={vcsSpring}
        className="rounded-2xl bg-card border border-gold/20 p-4 overflow-hidden max-w-full"
      >
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gold" />
          Your Next Steps
        </h3>
        {userConditions.length === 0 ? (
          <div className="space-y-2">
            {([
              { step: 1, title: 'Add your conditions', desc: 'Tell us what you\'re claiming so we can tailor your tools.', route: '/claims', icon: Plus },
              { step: 2, title: 'Start logging symptoms', desc: 'Daily logs create the evidence trail the VA looks for.', route: '/health/symptoms', icon: Activity },
              { step: 3, title: 'Build your statement', desc: 'We\'ll help you write a personal statement in your words.', route: '/prep/personal-statement', icon: FileText },
            ] as const).map(({ step, title, desc, route, icon: Icon }) => (
              <button
                key={step}
                onClick={() => navigate(route)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-xs font-bold text-gold">
                  {step}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        ) : unifiedNextItems.length > 0 ? (
          <div className="space-y-2">
            {unifiedNextItems.slice(0, 3).map((item, i) => (
              <button
                key={item.id}
                onClick={() => item.route && navigate(item.route)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <span
                  className={cn(
                    'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    item.priority === 'urgent'
                      ? 'bg-gold/20 text-gold'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[
              { title: 'Log your symptoms daily', description: 'Build an evidence trail with consistent symptom logs.', route: '/health/symptoms' },
              { title: 'Prepare for your C&P exam', description: 'Know what to expect and how to describe your conditions.', route: '/prep/exam' },
              { title: 'Generate a personal statement', description: 'Create a compelling statement for your claim.', route: '/prep/personal-statement' },
            ].map((step, i) => (
              <button
                key={i}
                onClick={() => navigate(step.route)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-xs font-bold text-gold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Section 5b: Export Claim Packet */}
      {userConditions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl bg-card border border-gold/20 p-4 overflow-hidden max-w-full"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Export Evidence Packet</p>
                <p className="text-[11px] text-muted-foreground">Download your claim data as a PDF report</p>
              </div>
            </div>
            <ExportButton variant="prominent" />
          </div>
        </motion.div>
      )}

      {/* Section 6: 2026 Medication Rule Banner */}
      {hasMedications && !medRuleDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
        >
          <button
            onClick={() => navigate('/prep/medication-rule')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 text-left"
          >
            <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-4 w-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">2026 VA Medication Rule</p>
              <p className="text-xs text-muted-foreground">Check if your {data.medications.length} medication{data.medications.length !== 1 ? 's are' : ' is'} properly documented</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gold shrink-0" />
          </button>
        </motion.div>
      )}

      {/* Section 6b: Quick Daily Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={vcsSpring}
        className="rounded-2xl bg-card border border-border p-4 overflow-hidden max-w-full"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Heart className="w-4 h-4 text-gold" />
            Daily Quick Log
          </h3>
          {todayLogged && (
            <span className="text-[10px] text-success font-medium bg-success/10 px-2 py-0.5 rounded-full">
              Logged today
            </span>
          )}
        </div>
        {!quickLogOpen ? (
          <button
            onClick={() => setQuickLogOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
          >
            <span className="shrink-0 w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center">
              <Plus className="h-3.5 w-3.5 text-gold" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Log how you're feeling</p>
              <p className="text-xs text-muted-foreground">Daily logs build your evidence trail</p>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Overall feeling slider */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Overall Feeling: {quickLogFeeling}/10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={quickLogFeeling}
                onChange={(e) => setQuickLogFeeling(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Worst</span><span>Best</span>
              </div>
            </div>

            {/* Flare-up toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-foreground">Flare-up today?</span>
              </div>
              <button
                type="button"
                onClick={() => { impactLight(); setQuickLogFlareUp(!quickLogFlareUp); }}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  quickLogFlareUp ? 'bg-gold' : 'bg-muted',
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 rounded-full bg-white transition-transform',
                    quickLogFlareUp ? 'translate-x-6' : 'translate-x-1',
                  )}
                />
              </button>
            </div>

            {/* Flare-up details (conditional) */}
            {quickLogFlareUp && (
              <div className="space-y-3 p-3 rounded-xl border border-gold/20 bg-gold/5">
                {/* Severity */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Severity: {quickLogFlareUpSeverity}/10
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={quickLogFlareUpSeverity}
                    onChange={(e) => setQuickLogFlareUpSeverity(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration</label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(FLARE_UP_DURATIONS).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setQuickLogFlareUpDuration(key)}
                        className={cn(
                          'text-[11px] px-3 py-2 min-h-[36px] rounded-full border transition-colors',
                          quickLogFlareUpDuration === key
                            ? 'bg-gold/20 border-gold/40 text-gold'
                            : 'border-border text-muted-foreground hover:bg-accent',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Triggers */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Triggers</label>
                  <div className="flex flex-wrap gap-1.5">
                    {FLARE_UP_TRIGGERS.map((trigger) => (
                      <button
                        key={trigger}
                        type="button"
                        onClick={() =>
                          setQuickLogFlareUpTriggers((prev) =>
                            prev.includes(trigger)
                              ? prev.filter((t) => t !== trigger)
                              : [...prev, trigger],
                          )
                        }
                        className={cn(
                          'text-[11px] px-3 py-2 min-h-[36px] rounded-full border transition-colors',
                          quickLogFlareUpTriggers.includes(trigger)
                            ? 'bg-gold/20 border-gold/40 text-gold'
                            : 'border-border text-muted-foreground hover:bg-accent',
                        )}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activities affected */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Activities affected</label>
                  <input
                    type="text"
                    value={quickLogFlareUpActivities}
                    onChange={(e) => setQuickLogFlareUpActivities(e.target.value)}
                    placeholder="e.g., couldn't walk, missed work..."
                    className="w-full text-sm bg-muted/50 border border-border rounded-xl px-4 py-3 min-h-[44px] text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Flare note */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
                  <input
                    type="text"
                    value={quickLogFlareNote}
                    onChange={(e) => setQuickLogFlareNote(e.target.value)}
                    placeholder="Describe the flare-up..."
                    className="w-full text-sm bg-muted/50 border border-border rounded-xl px-4 py-3 min-h-[44px] text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-2">
              <button
                onClick={() => setQuickLogOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  notifySuccess();
                  addQuickLog({
                    date: new Date().toISOString().slice(0, 10),
                    overallFeeling: quickLogFeeling,
                    hadFlareUp: quickLogFlareUp,
                    flareUpNote: quickLogFlareNote,
                    flareUpSeverity: quickLogFlareUp ? quickLogFlareUpSeverity : undefined,
                    flareUpDuration: quickLogFlareUp && quickLogFlareUpDuration ? quickLogFlareUpDuration as QuickLogEntry['flareUpDuration'] : undefined,
                    flareUpTriggers: quickLogFlareUp && quickLogFlareUpTriggers.length > 0 ? quickLogFlareUpTriggers : undefined,
                    flareUpActivitiesAffected: quickLogFlareUp && quickLogFlareUpActivities ? quickLogFlareUpActivities : undefined,
                    createdAt: new Date().toISOString(),
                  });
                  // Follow-up: if feeling is low or flare-up, suggest logging symptoms
                  if (quickLogFeeling <= 3 || quickLogFlareUp) {
                    setQuickLogFollowUp(true);
                  }
                  setQuickLogOpen(false);
                  setQuickLogFeeling(5);
                  setQuickLogFlareUp(false);
                  setQuickLogFlareNote('');
                  setQuickLogFlareUpSeverity(5);
                  setQuickLogFlareUpDuration('');
                  setQuickLogFlareUpTriggers([]);
                  setQuickLogFlareUpActivities('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition-colors"
              >
                Save Log
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Log Follow-up: suggest logging detailed symptoms */}
      {quickLogFollowUp && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gold/5 border border-gold/20 p-4"
        >
          <p className="text-sm font-semibold text-foreground mb-1">Tough day? Document it.</p>
          <p className="text-xs text-muted-foreground mb-3">
            Detailed symptom logs strengthen your claim. Log what you&apos;re experiencing while it&apos;s fresh.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/health/symptoms')}
              className="flex-1 py-2 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition-colors"
            >
              Log Symptoms
            </button>
            <button
              onClick={() => setQuickLogFollowUp(false)}
              className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:bg-accent transition-colors"
            >
              Later
            </button>
          </div>
        </motion.div>
      )}

      {/* Section 6c: Contextual Feature Discovery */}
      {userConditions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl bg-card border border-border p-4 overflow-hidden max-w-full"
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-gold" />
            Discover Tools for Your Claim
          </h3>
          <div className="space-y-2">
            {symptoms.length === 0 && (
              <button
                onClick={() => navigate('/health/symptoms')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <Activity className="h-4 w-4 text-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Start logging symptoms</p>
                  <p className="text-xs text-muted-foreground">Daily symptom logs are one of the strongest evidence types</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            )}
            {symptoms.length >= 3 && (
              <button
                onClick={() => navigate('/claims/evidence-strength')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <Target className="h-4 w-4 text-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Evidence Strength Analyzer</p>
                  <p className="text-xs text-muted-foreground">See how your {symptoms.length} symptom logs align with VA rating criteria</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            )}
            {data.buddyContacts.length === 0 && (
              <button
                onClick={() => navigate('/prep/buddy-statement')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <FileText className="h-4 w-4 text-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Get buddy statements</p>
                  <p className="text-xs text-muted-foreground">Third-party evidence strengthens your claim</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            )}
            {userConditions.some((uc) => uc.claimStatus === 'denied') && (
              <button
                onClick={() => navigate('/claims/decision-decoder')}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <AlertTriangle className="h-4 w-4 text-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Decision Decoder</p>
                  <p className="text-xs text-muted-foreground">Understand your denial in plain English and see your options</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Section 7: Compensation + Benefits + TDIU Discovery Row */}
      {combinedRating > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="grid grid-cols-2 gap-2"
        >
          <Link
            to="/prep/compensation"
            className="flex items-center gap-3 p-3 rounded-2xl border border-success/20 bg-success/5 hover:bg-success/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <DollarSign className="h-4 w-4 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">${monthlyCompensation.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo</p>
              <p className="text-[11px] text-muted-foreground">Estimated pay</p>
            </div>
          </Link>
          <Link
            to="/prep/benefits"
            className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4 text-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Benefits</p>
              <p className="text-[11px] text-muted-foreground">Discover eligibility</p>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Section 8: TDIU Suggestion */}
      {tdiuSuggestion && combinedRating < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
        >
          <button
            onClick={() => navigate('/prep/tdiu')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 active:scale-[0.98] transition-all text-left"
          >
            <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <Briefcase className="h-4 w-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">You may qualify for TDIU</p>
              <p className="text-xs text-muted-foreground">Get compensated at the 100% rate — check eligibility</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gold shrink-0" />
          </button>
        </motion.div>
      )}

      {/* Section 9: Remaining Smart Reminders */}
      {remainingReminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl bg-card border border-border p-4 space-y-3 overflow-hidden max-w-full"
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            Reminders
          </h3>
          {remainingReminders.map((r) => (
            <div
              key={r.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-2xl border',
                r.priority === 'high'
                  ? 'border-gold/30 bg-gold/5'
                  : 'border-border bg-secondary',
              )}
            >
              <AlertTriangle
                className={cn(
                  'h-4 w-4 shrink-0 mt-0.5',
                  r.priority === 'high' ? 'text-gold' : 'text-muted-foreground',
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
              </div>
              <button
                onClick={() => dismissReminder(r.id)}
                className="p-1 rounded-lg hover:bg-accent transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Ask Intel — AI Assistant Sheet */}
      <AskIntelSheet />
    </PageContainer>
  );
}
