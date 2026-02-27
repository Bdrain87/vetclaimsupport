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
  ThumbsUp,
  Meh,
  ThumbsDown,
  Check,
  Pencil,
  User,
  Target,
  Compass,
  Brain,
  Moon,
  Ear,
  Bone,
  FileText,
  Shield,
  LogIn,
  FolderOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { vcsSpring } from '@/constants/animations';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getConditionById } from '@/data/vaConditions';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { IntentToFileBanner } from '@/components/dashboard/IntentToFileBanner';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { ClaimReadiness } from '@/components/dashboard/ClaimReadiness';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import { useSmartReminders } from '@/hooks/useSmartReminders';
import { useFeatureFlag } from '@/store/useFeatureFlagStore';

export default function Dashboard() {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();
  const addDashboardQuickLog = useAppStore((s) => s.addDashboardQuickLog);
  const vaultDocCount = useAppStore((s) => s.claimDocuments.length);
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const streak = useStreakTracker();
  const reminders = useSmartReminders();
  const showReadiness = useFeatureFlag('dashboardConditionReadiness');
  const showRecommendations = useFeatureFlag('dashboardRecommendations');

  const readinessScore = useMemo(
    () => ClaimIntelligence.getOverallReadiness(userConditions, data, profile),
    [userConditions, data, profile]
  );

  const evidenceCompleteness = useMemo(() => {
    const claimableConditions = userConditions.filter((uc) => uc.claimStatus !== 'approved');
    const total = claimableConditions.length;
    if (total === 0) return null;
    const claimConditions = data.claimConditions || [];
    let complete = 0;
    for (const uc of claimableConditions) {
      const details = getConditionById(uc.conditionId);
      const name = details?.name?.toLowerCase();
      const match = name
        ? claimConditions.find((c) => c.name.toLowerCase() === name)
        : undefined;
      if (match) {
        let score = 0;
        if (match.linkedMedicalVisits.length > 0) score += 25;
        if (match.linkedExposures.length > 0) score += 25;
        if (match.linkedSymptoms.length > 0) score += 25;
        if (match.linkedBuddyContacts.length > 0) score += 25;
        if (score >= 75) complete++;
      }
    }
    return { total, complete, incomplete: total - complete };
  }, [userConditions, data.claimConditions]);

  const nextSteps = useMemo(
    () => ClaimIntelligence.getNextSteps(profile, userConditions, data),
    [profile, userConditions, data]
  );

  // B-2: Condition-driven tool recommendations
  const conditionRecommendations = useMemo(() => {
    if (userConditions.length === 0) return [];
    const recs: { icon: typeof Brain; label: string; route: string; reason: string }[] = [];
    const added = new Set<string>();

    for (const uc of userConditions) {
      const details = getConditionById(uc.conditionId);
      const cat = details?.category ?? '';
      const name = (details?.name ?? uc.conditionId).toLowerCase();

      if (cat === 'mental-health' || name.includes('ptsd') || name.includes('anxiety') || name.includes('depression')) {
        if (!added.has('symptoms')) {
          recs.push({ icon: Brain, label: 'PTSD / Mental Health Logger', route: '/health/symptoms', reason: 'Track symptoms for your mental health claim' });
          added.add('symptoms');
        }
        if (!added.has('stressor')) {
          recs.push({ icon: FileText, label: 'Stressor Statement', route: '/prep/stressor', reason: 'Document your stressor events' });
          added.add('stressor');
        }
      }

      if (name.includes('migraine') || name.includes('headache')) {
        if (!added.has('migraines')) {
          recs.push({ icon: Brain, label: 'Migraine Tracker', route: '/health/migraines', reason: 'Log prostrating attacks for DC 8100' });
          added.add('migraines');
        }
      }

      if (name.includes('sleep') || name.includes('apnea') || name.includes('insomnia')) {
        if (!added.has('sleep')) {
          recs.push({ icon: Moon, label: 'Sleep Tracker', route: '/health/sleep', reason: 'Document CPAP usage & sleep quality' });
          added.add('sleep');
        }
      }

      if (cat === 'ear' || name.includes('tinnitus') || name.includes('hearing')) {
        if (!added.has('exposures')) {
          recs.push({ icon: Ear, label: 'Noise Exposure Logger', route: '/health/exposures', reason: 'Document in-service noise exposure' });
          added.add('exposures');
        }
      }

      if (cat === 'musculoskeletal' || name.includes('back') || name.includes('knee') || name.includes('spine') || name.includes('shoulder')) {
        if (!added.has('bodymap')) {
          recs.push({ icon: Bone, label: 'Body Map', route: '/claims/body-map', reason: 'Map pain points & range of motion' });
          added.add('bodymap');
        }
      }
    }

    // Always recommend personal statement & C&P prep if there are pending conditions
    if (userConditions.some(uc => uc.claimStatus !== 'approved')) {
      if (!added.has('statement')) {
        recs.push({ icon: FileText, label: 'Personal Statement', route: '/prep/personal-statement', reason: 'Build your statement for each condition' });
        added.add('statement');
      }
      if (!added.has('cpexam')) {
        recs.push({ icon: Shield, label: 'C&P Exam Prep', route: '/prep/exam', reason: 'Prepare for your compensation exam' });
        added.add('cpexam');
      }
    }

    return recs.slice(0, 6);
  }, [userConditions]);

  // Calculate combined VA rating using VA math (approved conditions only, round to nearest 10)
  const combinedRating = useMemo(() => {
    const ratings = userConditions
      .filter(uc => uc.claimStatus === 'approved')
      .map(uc => uc.rating)
      .filter((r): r is number => r !== undefined && r > 0);
    return combineRatings(ratings);
  }, [userConditions]);

  // Quick log state
  const [painLevel, setPainLevel] = useState(5);
  const [selectedMood, setSelectedMood] = useState<'good' | 'okay' | 'bad' | null>(null);
  const [logSaved, setLogSaved] = useState(false);
  const [logCondition, setLogCondition] = useState('general');
  const [logNotes, setLogNotes] = useState('');
  // Use local date (not UTC) to avoid timezone-related off-by-one
  const [logDate, setLogDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const handleSaveQuickLog = useCallback(() => {
    if (!selectedMood) return;
    addDashboardQuickLog(painLevel, selectedMood, logCondition, logNotes, logDate);
    setLogSaved(true);
    setTimeout(() => setLogSaved(false), 2000);
    setPainLevel(5);
    setSelectedMood(null);
    setLogCondition('general');
    setLogNotes('');
    const d = new Date();
    setLogDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }, [painLevel, selectedMood, logCondition, logNotes, logDate, addDashboardQuickLog]);

  const displayName =profile.firstName
    ? `${profile.firstName}${profile.lastName ? ' ' + profile.lastName : ''}`
    : 'Veteran';
  const branchLabel = getAllBranchLabels(profile);

  // Multi-service-period display
  const servicePeriods = profile.servicePeriods || [];
  const mostRecentPeriod = servicePeriods.length > 0
    ? servicePeriods[servicePeriods.length - 1]
    : null;
  const additionalPeriodsCount = servicePeriods.length > 1 ? servicePeriods.length - 1 : 0;

  const serviceDateStr = profile.serviceDates?.start
    ? `${new Date(profile.serviceDates.start).toLocaleDateString()} – ${profile.serviceDates.end ? new Date(profile.serviceDates.end).toLocaleDateString() : 'Present'}`
    : '';

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

  return (
    <PageContainer className="space-y-4 animate-fade-in pb-4">
      {/* Intent to File Banner */}
      <IntentToFileBanner />

      {/* Sign-in prompt for unauthenticated users */}
      {!session && (
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-gold/30 bg-gold/5 text-left"
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

      {/* BDD Countdown — shown when user has a separation date */}
      {profile.separationDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
        >
          <BDDCountdown
            separationDate={separationDateParsed}
            onSeparationDateChange={handleSeparationDateChange}
          />
        </motion.div>
      )}

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden max-w-full">
        <div className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
            <User className="h-6 w-6 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold truncate">{displayName}</p>
            {branchLabel && (
              <p className="text-sm text-muted-foreground truncate" style={{ writingMode: 'horizontal-tb' }}>
                {branchLabel}
              </p>
            )}
            {mostRecentPeriod?.mos ? (
              <p className="text-xs text-muted-foreground truncate">
                {mostRecentPeriod.mos} — {mostRecentPeriod.jobTitle}
                {additionalPeriodsCount > 0 && (
                  <span className="text-primary ml-1">(+{additionalPeriodsCount} service periods)</span>
                )}
              </p>
            ) : profile.mosCode ? (
              <p className="text-xs text-muted-foreground truncate">
                {profile.mosCode} — {profile.mosTitle}
              </p>
            ) : null}
            {serviceDateStr && (
              <p className="text-xs text-muted-foreground/70 truncate">{serviceDateStr}</p>
            )}
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

      {/* My Current Rating — Clickable to go to Rating Calculator */}
      <Link to="/claims/calculator" className="block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-xl bg-card border border-border p-4 shadow-sm hover:bg-accent/30 transition-colors cursor-pointer overflow-hidden max-w-full"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" role="img" aria-label={`Combined VA rating: ${combinedRating} percent`}>
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="currentColor" className="text-muted/30"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="var(--gold-md, #F0C000)" strokeWidth="3"
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
                  return (
                    <p className="text-sm text-muted-foreground mt-1">
                      Add conditions with ratings to calculate
                    </p>
                  );
                }
                return (
                  <div className="mt-1 space-y-0.5">
                    {ratedConditions.slice(0, 4).map(uc => {
                      const details = getConditionById(uc.conditionId);
                      return (
                        <p key={uc.id} className="text-xs text-muted-foreground truncate">
                          {details?.abbreviation || details?.name || uc.conditionId}: {uc.rating}%
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

      {/* Streak & Smart Reminders */}
      {(streak.currentStreak > 0 || reminders.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-xl bg-card border border-border p-4 shadow-sm space-y-3 overflow-hidden max-w-full"
        >
          {streak.currentStreak > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">&#x1F525;</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {streak.currentStreak}-day logging streak
                </p>
                <p className="text-xs text-muted-foreground">
                  {streak.totalLoggingDays} total days logged
                  {streak.longestStreak > streak.currentStreak &&
                    ` · Best: ${streak.longestStreak} days`}
                </p>
              </div>
            </div>
          )}
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
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Claim Readiness Score — only show if there are non-approved conditions */}
      {userConditions.some((uc) => uc.claimStatus !== 'approved') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
        >
          <Link to="/claims" className="block">
            <div className="rounded-xl bg-card border border-border p-4 shadow-sm hover:bg-accent/30 transition-colors overflow-hidden max-w-full">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90" role="img" aria-label={`Claim readiness: ${readinessScore} percent`}>
                    <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={readinessScore >= 70 ? '#22c55e' : readinessScore >= 40 ? 'var(--gold-md)' : '#ef4444'}
                      strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${readinessScore}, 100`}
                      initial={{ strokeDasharray: '0, 100' }}
                      animate={{ strokeDasharray: `${readinessScore}, 100` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Target className="h-5 w-5 text-foreground" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">Claim Readiness: {readinessScore}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {readinessScore >= 70 ? 'Strong position — consider filing soon' : readinessScore >= 40 ? 'Building evidence — keep logging' : 'Early stage — add conditions and evidence'}
                  </p>
                  {evidenceCompleteness && evidenceCompleteness.incomplete > 0 && (
                    <p className="text-xs text-gold mt-0.5">
                      {evidenceCompleteness.incomplete} of {evidenceCompleteness.total} conditions need more evidence
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          </Link>
          {/* Per-condition readiness breakdown */}
          {showReadiness && (
            <div className="mt-2">
              <ClaimReadiness userConditions={userConditions} claimsData={data} />
            </div>
          )}
        </motion.div>
      )}

      {/* Document Vault Quick Link */}
      <Link to="/settings/vault" className="block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className="rounded-xl bg-card border border-border p-4 shadow-sm hover:bg-accent/30 transition-colors cursor-pointer overflow-hidden max-w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">Document Vault</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {vaultDocCount > 0
                  ? `${vaultDocCount} document${vaultDocCount === 1 ? '' : 's'} stored`
                  : 'Store and organize your claim documents'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </motion.div>
      </Link>

      {/* Recommended for Your Claims */}
      {showRecommendations && conditionRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...vcsSpring, delay: 0.2 }}
          className="rounded-xl bg-card border border-border p-4 shadow-sm overflow-hidden max-w-full"
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-gold" />
            Recommended for Your Claims
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {conditionRecommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <Link
                  key={rec.route}
                  to={rec.route}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-secondary/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{rec.label}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{rec.reason}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Next Steps — always rendered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.25 }}
        className="rounded-xl bg-card border border-border p-4 shadow-sm overflow-hidden max-w-full"
      >
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gold" />
          What to Do Next
        </h3>
        {nextSteps.length > 0 ? (
          <div className="space-y-2.5">
            {nextSteps.slice(0, 5).map((step, i) => (
              <div key={step.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5',
                    step.priority === 'urgent'
                      ? 'bg-gold/20 text-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{step.title}</p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
                  )}
                </div>
                {step.actionRoute && (
                  <Link
                    to={step.actionRoute}
                    className="text-gold text-xs hover:text-gold-hl shrink-0 mt-0.5"
                  >
                    Go
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {[
              { title: 'Add your first condition', description: 'Start tracking conditions you plan to claim.', route: '/claims' },
              { title: 'Log your symptoms daily', description: 'Build an evidence trail with consistent symptom logs.', route: '/health/symptoms' },
              { title: 'Generate a personal statement', description: 'Create a compelling statement for your claim.', route: '/prep/personal-statement' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 bg-gold/20 text-foreground">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{step.description}</p>
                </div>
                <Link
                  to={step.route}
                  className="text-gold text-xs hover:text-gold-hl shrink-0 mt-0.5"
                >
                  Go
                </Link>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Daily Log Widget — at the BOTTOM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.3 }}
        className="rounded-xl bg-card border border-border p-4 shadow-sm overflow-hidden max-w-full"
      >
        <h3 className="font-bold text-sm text-foreground mb-3">Quick Daily Log</h3>
        {logSaved ? (
          <div className="flex items-center gap-2 py-3 justify-center text-emerald-500">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">Logged</span>
          </div>
        ) : (
          <div className="space-y-3 min-w-0 w-full overflow-hidden">
            {/* Date Selector */}
            <div className="space-y-1.5 min-w-0 w-full overflow-hidden">
              <label htmlFor="quick-log-date" className="text-xs text-muted-foreground">Date</label>
              <div className="w-full overflow-hidden">
                <Input
                  id="quick-log-date"
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="h-10 w-full max-w-full"
                />
              </div>
            </div>

            {/* Condition Selector */}
            <div className="space-y-1.5">
              <label htmlFor="quick-log-condition" className="text-xs text-muted-foreground">Condition</label>
              <Select value={logCondition} onValueChange={setLogCondition}>
                <SelectTrigger className="h-10" id="quick-log-condition" aria-label="Condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  {userConditions.map(uc => {
                    const details = getConditionById(uc.conditionId);
                    return (
                      <SelectItem key={uc.id} value={uc.id}>
                        {details?.abbreviation || details?.name || uc.conditionId}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Pain Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span id="pain-level-label" className="text-xs text-muted-foreground">Pain Level</span>
                <span className="text-sm font-bold text-foreground">{painLevel}</span>
              </div>
              <Slider
                value={[painLevel]}
                onValueChange={([v]) => setPainLevel(v)}
                min={1}
                max={10}
                step={1}
                className="w-full"
                aria-label={`Pain level: ${painLevel} out of 10`}
              />
              <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
                <span>1</span>
                <span>10</span>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="space-y-2" role="radiogroup" aria-label="Mood">
              <span className="text-xs text-muted-foreground">Mood</span>
              <div className="flex gap-2">
                {([
                  { mood: 'good' as const, icon: ThumbsUp, label: 'Good' },
                  { mood: 'okay' as const, icon: Meh, label: 'Okay' },
                  { mood: 'bad' as const, icon: ThumbsDown, label: 'Bad' },
                ]).map(({ mood, icon: Icon, label }) => (
                  <button
                    key={mood}
                    role="radio"
                    aria-checked={selectedMood === mood}
                    aria-label={`Mood: ${label}`}
                    onClick={() => setSelectedMood(mood)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-colors min-h-[44px]',
                      selectedMood === mood
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-muted-foreground hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label htmlFor="quick-log-notes" className="text-xs text-muted-foreground">Notes (optional)</label>
              <Textarea
                id="quick-log-notes"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Symptoms, triggers, activities affected..."
                className="min-h-[60px] resize-none text-sm"
              />
            </div>

            {/* Save Button */}
            <Button
              size="sm"
              className="w-full"
              disabled={!selectedMood}
              onClick={handleSaveQuickLog}
            >
              Save Log
            </Button>
            {!selectedMood && (
              <p className="text-xs text-muted-foreground text-center">
                Select a mood to save your log
              </p>
            )}
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}

// Helper to score evidence completeness for a claim condition
