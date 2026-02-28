import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore } from '@/store/useProfileStore';
import { getAllBranchLabels } from '@/utils/veteranProfile';
import { combineRatings } from '@/utils/vaMath';
import useAppStore from '@/store/useAppStore';
import { ClaimIntelligence } from '@/services/claimIntelligence';
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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { vcsSpring } from '@/constants/animations';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getConditionById } from '@/data/vaConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { IntentToFileBanner } from '@/components/dashboard/IntentToFileBanner';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import { useSmartReminders } from '@/hooks/useSmartReminders';
import { getMonthlyCompensation } from '@/services/vaCompensation';
import {
  DollarSign,
  Briefcase,
  Gift,
  ShieldAlert,
} from 'lucide-react';

const JOURNEY_PHASE_LABELS = ['Research', 'Evidence', 'Filing', 'C&P Exam', 'Decision'];

export default function Dashboard() {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();
  const vaultDocCount = useAppStore((s) => s.claimDocuments.length);
  const activeDeadlines = useAppStore((s) => (s.deadlines ?? []).filter((d) => !d.completed).length);
  const currentPhase = useAppStore((s) => s.journeyProgress?.currentPhase ?? 0);
  const symptoms = useAppStore((s) => s.symptoms);
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const streak = useStreakTracker();
  const reminders = useSmartReminders();

  const readinessScore = useMemo(
    () => ClaimIntelligence.getOverallReadiness(userConditions, data, profile),
    [userConditions, data, profile]
  );

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
  const readinessLabel = readinessScore >= 70 ? 'Strong' : readinessScore >= 40 ? 'Building' : 'Early';

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
    <PageContainer className="space-y-4 animate-fade-in pb-4">
      {/* Section 1: Alert Zone */}
      <IntentToFileBanner />

      {!session && (
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 text-left"
        >
          <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
            <LogIn className="h-4 w-4 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Sign in to sync your data</p>
            <p className="text-xs text-muted-foreground">Keep your claim data backed up and accessible across devices</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
          <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-foreground font-semibold truncate">{displayName}</p>
              {streak.currentStreak > 0 && (
                <span className="flex-shrink-0 text-xs font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded-full">
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
            className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
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
            <div className="relative w-16 h-16 flex-shrink-0">
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
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
          aria-label={`Documents — ${vaultDocCount > 0 ? `${vaultDocCount} stored` : 'No docs yet'}`}
          className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="h-4 w-4 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Documents</p>
            <p className="text-[11px] text-muted-foreground">
              {vaultDocCount > 0 ? `${vaultDocCount} stored` : 'No docs yet'}
            </p>
          </div>
        </Link>
        <Link
          to="/claims/deadlines"
          aria-label={`Deadlines — ${activeDeadlines > 0 ? `${activeDeadlines} active` : 'None set'}`}
          className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
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
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Map className="h-4 w-4 text-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Journey</p>
            <p className="text-[11px] text-muted-foreground">{phaseLabel}</p>
          </div>
        </Link>
        {userConditions.length > 0 ? (
          <Link
            to="/claims"
            aria-label={`Readiness — ${readinessScore}% — ${readinessLabel}`}
            className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
              <Target className="h-4 w-4 text-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Readiness</p>
              <p className="text-[11px] text-muted-foreground">{readinessScore}% — {readinessLabel}</p>
            </div>
          </Link>
        ) : (
          <Link
            to="/claims"
            aria-label="Add Conditions — Start your claim"
            className="flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
              <Plus className="h-4 w-4 text-gold" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Add Conditions</p>
              <p className="text-[11px] text-muted-foreground">Start your claim</p>
            </div>
          </Link>
        )}
      </motion.div>

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
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-xs font-bold text-gold">
                  {step}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
                    'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
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
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-xs font-bold text-gold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Section 6: 2026 Medication Rule Banner */}
      {hasMedications && !medRuleDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
        >
          <button
            onClick={() => navigate('/prep/medication-rule')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-left"
          >
            <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">2026 VA Medication Rule</p>
              <p className="text-xs text-muted-foreground">Check if your {data.medications.length} medication{data.medications.length !== 1 ? 's are' : ' is'} properly documented</p>
            </div>
            <ChevronRight className="h-4 w-4 text-amber-400 flex-shrink-0" />
          </button>
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
            className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 text-emerald-400" />
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
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
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
            className="w-full flex items-center gap-3 p-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 text-left"
          >
            <div className="h-9 w-9 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">You may qualify for TDIU</p>
              <p className="text-xs text-muted-foreground">Get compensated at the 100% rate — check eligibility</p>
            </div>
            <ChevronRight className="h-4 w-4 text-purple-400 flex-shrink-0" />
          </button>
        </motion.div>
      )}

      {/* Section 9: Smart Reminders (conditional) */}
      {reminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-2xl bg-card border border-border p-4 space-y-3 overflow-hidden max-w-full"
        >
          {reminders.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                r.priority === 'high'
                  ? 'border-gold/30 bg-[rgba(240,192,0,0.05)]'
                  : 'border-border bg-secondary',
              )}
            >
              <AlertTriangle
                className={cn(
                  'h-4 w-4 flex-shrink-0 mt-0.5',
                  r.priority === 'high' ? 'text-gold' : 'text-muted-foreground',
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </PageContainer>
  );
}
