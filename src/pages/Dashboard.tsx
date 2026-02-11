import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore, BRANCH_LABELS } from '@/store/useProfileStore';
import useAppStore from '@/store/useAppStore';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import {
  Plus,
  ChevronRight,
  Zap,
  AlertTriangle,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Check,
  Pencil,
  User,
  Calculator,
  Heart,
  Languages,
  ClipboardCheck,
  FileSignature,
  Shield,
  Users,
  DollarSign,
  FileCheck as FileCheckIcon,
  Package,
  Search,
  Compass,
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
import { useState, useMemo, useCallback } from 'react';
import { getConditionById } from '@/data/vaConditions';
import { getDiagnosticCodeForCondition } from '@/components/shared/ConditionSearchInput.utils';
import { ExportButton } from '@/components/dashboard/ExportButton';

export default function Dashboard() {
  const { data } = useClaims();
  const { conditions: userConditions, addCondition } = useUserConditions();
  const profile = useProfileStore();
  const addDashboardQuickLog = useAppStore((s) => s.addDashboardQuickLog);
  const navigate = useNavigate();

  const claimConditions = useMemo(() => data.claimConditions || [], [data.claimConditions]);

  const nextSteps = useMemo(
    () => ClaimIntelligence.getNextSteps(profile, userConditions, data),
    [profile, userConditions, data]
  );

  const recommendations = useMemo(
    () => ClaimIntelligence.getRecommendations(profile, userConditions, data),
    [profile, userConditions, data]
  );

  // Evidence gaps: count conditions missing evidence
  const evidenceGaps = useMemo(() => {
    const gaps: { conditionName: string; missing: string[]; conditionId?: string }[] = [];
    claimConditions.forEach((c) => {
      const missing: string[] = [];
      if (c.linkedMedicalVisits.length === 0) missing.push('Medical records');
      if (c.linkedSymptoms.length === 0) missing.push('Symptom logs');
      if (c.linkedBuddyContacts.length === 0) missing.push('Buddy statements');
      if (missing.length > 0) {
        gaps.push({ conditionName: c.name, missing, conditionId: c.id });
      }
    });
    return gaps;
  }, [claimConditions]);

  // Calculate combined VA rating using VA math (approved conditions only, round to nearest 10)
  const combinedRating = useMemo(() => {
    const ratings = userConditions
      .filter(uc => uc.claimStatus === 'approved')
      .map(uc => uc.rating)
      .filter((r): r is number => r !== undefined && r > 0)
      .sort((a, b) => b - a); // Sort descending

    if (ratings.length === 0) return 0;

    let combined = 0;
    for (const rating of ratings) {
      const remaining = 100 - combined;
      combined = combined + (remaining * rating / 100);
    }
    return Math.round(combined / 10) * 10;
  }, [userConditions]);

  // Quick log state
  const [painLevel, setPainLevel] = useState(5);
  const [selectedMood, setSelectedMood] = useState<'good' | 'okay' | 'bad' | null>(null);
  const [logSaved, setLogSaved] = useState(false);
  const [logCondition, setLogCondition] = useState('general');
  const [logNotes, setLogNotes] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSaveQuickLog = useCallback(() => {
    if (!selectedMood) return;
    addDashboardQuickLog(painLevel, selectedMood, logCondition, logNotes, logDate);
    setLogSaved(true);
    setTimeout(() => setLogSaved(false), 2000);
    setPainLevel(5);
    setSelectedMood(null);
    setLogCondition('general');
    setLogNotes('');
    setLogDate(new Date().toISOString().split('T')[0]);
  }, [painLevel, selectedMood, logCondition, logNotes, logDate, addDashboardQuickLog]);

  // Handle adding a recommended condition
  const handleAddRecommendation = useCallback((conditionId: string) => {
    addCondition(conditionId);
  }, [addCondition]);

  const displayName = profile.firstName
    ? `${profile.firstName}${profile.lastName ? ' ' + profile.lastName : ''}`
    : 'Veteran';
  const branchLabel = profile.branch ? BRANCH_LABELS[profile.branch] : '';

  // Multi-service-period display
  const servicePeriods = profile.servicePeriods || [];
  const mostRecentPeriod = servicePeriods.length > 0
    ? servicePeriods[servicePeriods.length - 1]
    : null;
  const additionalPeriodsCount = servicePeriods.length > 1 ? servicePeriods.length - 1 : 0;

  const serviceDateStr = profile.serviceDates?.start
    ? `${new Date(profile.serviceDates.start).toLocaleDateString()} – ${profile.serviceDates.end ? new Date(profile.serviceDates.end).toLocaleDateString() : 'Present'}`
    : '';

  return (
    <PageContainer className="space-y-4 animate-fade-in pb-8 md:pb-4 overflow-x-hidden">
      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <User className="h-6 w-6 text-[#3B82F6]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold truncate">{displayName}</p>
            {mostRecentPeriod ? (
              <>
                <p className="text-sm text-muted-foreground" style={{ writingMode: 'horizontal-tb' }}>
                  {mostRecentPeriod.branch ? BRANCH_LABELS[mostRecentPeriod.branch as keyof typeof BRANCH_LABELS] || mostRecentPeriod.branch : branchLabel}
                </p>
                {mostRecentPeriod.mos && (
                  <p className="text-xs text-muted-foreground truncate">
                    {mostRecentPeriod.mos} — {mostRecentPeriod.jobTitle}
                    {additionalPeriodsCount > 0 && (
                      <span className="text-primary ml-1">(+{additionalPeriodsCount} more)</span>
                    )}
                  </p>
                )}
              </>
            ) : (
              <>
                {branchLabel && (
                  <p className="text-sm text-muted-foreground" style={{ writingMode: 'horizontal-tb' }}>
                    {branchLabel}
                  </p>
                )}
                {profile.mosCode && (
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.mosCode} — {profile.mosTitle}
                  </p>
                )}
              </>
            )}
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
          className="rounded-xl bg-card border border-border p-4 shadow-sm hover:bg-accent/30 transition-colors cursor-pointer"
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
                  stroke="#3B82F6" strokeWidth="3"
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
              {userConditions.filter(uc => uc.rating !== undefined).length > 0 ? (
                <div className="mt-1 space-y-0.5">
                  {userConditions.filter(uc => uc.rating !== undefined).slice(0, 4).map(uc => {
                    const details = getConditionById(uc.conditionId);
                    return (
                      <p key={uc.id} className="text-xs text-muted-foreground truncate">
                        {details?.abbreviation || details?.name || uc.conditionId}: {uc.rating}%
                      </p>
                    );
                  })}
                  {userConditions.filter(uc => uc.rating !== undefined).length > 4 && (
                    <p className="text-xs text-muted-foreground">+{userConditions.filter(uc => uc.rating !== undefined).length - 4} more</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  Add conditions with ratings to calculate
                </p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </motion.div>
      </Link>

      {/* Tools & Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.05 }}
        className="rounded-xl bg-card border border-border p-4 shadow-sm"
      >
        <h3 className="font-bold text-sm text-foreground mb-3">Tools & Features</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
          {[
            { name: 'Rating Calculator', icon: Calculator, path: '/claims/calculator' },
            { name: 'VA-Speak Translator', icon: Languages, path: '/prep/va-speak' },
            { name: 'C&P Exam Prep', icon: ClipboardCheck, path: '/prep/exam' },
            { name: 'Doctor Summary', icon: FileSignature, path: '/prep/nexus-letter' },
            { name: 'Stressor Statement', icon: Shield, path: '/prep/stressor' },
            { name: 'Buddy Statement', icon: Users, path: '/prep/buddy-statement' },
            { name: 'Back Pay Estimator', icon: DollarSign, path: '/prep/back-pay' },
            { name: 'Health Trackers', icon: Heart, path: '/health' },
            { name: 'DBQ Prep', icon: FileCheckIcon, path: '/prep/dbq' },
            { name: 'Claim Packet', icon: Package, path: '/prep/packet' },
          ].map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="flex flex-col items-center gap-1.5 min-w-[76px] p-2 rounded-xl border border-border bg-secondary hover:bg-accent/50 transition-colors snap-start"
            >
              <tool.icon className="h-5 w-5 text-blue-500" />
              <span className="text-[10px] font-medium text-foreground text-center leading-tight">{tool.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Active Conditions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.1 }}
        className="rounded-xl bg-card border border-border shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-foreground">Your Conditions</h2>
            {claimConditions.length > 0 && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                {claimConditions.length}
              </span>
            )}
          </div>
          <Link to="/claims" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>

        {claimConditions.length === 0 && userConditions.length === 0 ? (
          <div className="px-4 pb-4 pt-2 text-center">
            <button onClick={() => navigate('/claims')} className="text-sm text-muted-foreground mb-3 hover:text-primary transition-colors cursor-pointer">
              No conditions yet — tap here to add your first condition.
            </button>
            <Button size="sm" variant="outline" onClick={() => navigate('/claims')}>
              <Plus className="h-4 w-4 mr-1" />
              Add Condition
            </Button>
          </div>
        ) : (
          <div className="px-4 pb-4 space-y-2">
            {claimConditions.slice(0, 5).map((condition) => {
              const evidenceCount =
                condition.linkedMedicalVisits.length +
                condition.linkedSymptoms.length +
                condition.linkedExposures.length +
                condition.linkedBuddyContacts.length;
              const score = getEvidenceScore(condition);
              const diagResult = getDiagnosticCodeForCondition(condition.name);
              const diagCode = diagResult?.code;

              return (
                <Link
                  key={condition.id}
                  to={`/claims/${condition.id}`}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl',
                    'bg-secondary border border-border',
                    'hover:bg-accent/50 transition-colors',
                    'active:scale-[0.99]'
                  )}
                >
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full flex-shrink-0',
                      score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-blue-500' : 'bg-muted-foreground/40'
                    )}
                    role="img"
                    aria-label={score >= 75 ? 'Strong evidence' : score >= 50 ? 'Moderate evidence' : 'Needs more evidence'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{condition.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {diagCode ? `DC ${diagCode} · ` : ''}{evidenceCount} evidence item{evidenceCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              );
            })}
            {/* Also show userConditions not in claimConditions */}
            {userConditions.slice(0, Math.max(0, 5 - claimConditions.length)).map((uc) => {
              const details = getConditionById(uc.conditionId);
              if (!details) return null;
              // Skip if already shown in claimConditions
              if (claimConditions.some((cc) => cc.name.toLowerCase() === details.name.toLowerCase())) return null;
              return (
                <Link
                  key={uc.id}
                  to={`/claims/${uc.id}`}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl',
                    'bg-secondary border border-border',
                    'hover:bg-accent/50 transition-colors'
                  )}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{details.abbreviation || details.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {details.diagnosticCode ? `DC ${details.diagnosticCode}` : 'Tracking'}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Evidence Gaps Alert */}
      {evidenceGaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...vcsSpring, delay: 0.15 }}
        >
          <button
            onClick={() => {
              const firstGap = evidenceGaps[0];
              if (firstGap?.conditionId) navigate(`/claims/${firstGap.conditionId}`);
            }}
            className={cn(
              'w-full rounded-xl p-4 text-left',
              'bg-blue-500/10 border border-blue-500/20',
              'hover:bg-blue-500/15 transition-colors'
            )}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Evidence Gaps Found ({evidenceGaps.length})
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {evidenceGaps[0]?.conditionName}: missing {evidenceGaps[0]?.missing.join(', ')}
                  {evidenceGaps.length > 1 && ` (+${evidenceGaps.length - 1} more)`}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          </button>
        </motion.div>
      )}

      {/* Conditions to Explore — always rendered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.2 }}
        className="rounded-xl bg-card border border-border p-4 shadow-sm"
      >
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#3B82F6]" />
          Conditions You May Want to Consider
        </h3>
        {recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.slice(0, 4).map((rec, i) => {
              const diagResult = getDiagnosticCodeForCondition(rec.conditionName);
              const diagCode = diagResult?.code;
              return (
                <div
                  key={rec.conditionId + i}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-sm font-medium text-foreground truncate">{rec.conditionName}</p>
                    {diagCode && (
                      <p className="text-xs text-muted-foreground">DC {diagCode}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{rec.reason}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-8"
                    onClick={() => handleAddRecommendation(rec.conditionId)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Search className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Add your MOS and conditions to see personalized suggestions.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => navigate('/claims/secondary-finder')}
            >
              Explore Conditions
            </Button>
          </div>
        )}
      </motion.div>

      {/* Next Steps — always rendered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.25 }}
        className="rounded-xl bg-card border border-border p-4 shadow-sm"
      >
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-[#3B82F6]" />
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
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{step.title}</p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  )}
                </div>
                {step.actionRoute && (
                  <Link
                    to={step.actionRoute}
                    className="text-[#3B82F6] text-xs hover:text-[#60A5FA] shrink-0 mt-0.5"
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
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 bg-[#3B82F6]/20 text-[#3B82F6]">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
                <Link
                  to={step.route}
                  className="text-[#3B82F6] text-xs hover:text-[#60A5FA] shrink-0 mt-0.5"
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
        className="rounded-xl bg-card border border-border p-4 shadow-sm"
      >
        <h3 className="font-bold text-sm text-foreground mb-3">Quick Daily Log</h3>
        {logSaved ? (
          <div className="flex items-center gap-2 py-3 justify-center text-emerald-500">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">Logged</span>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Date Selector */}
            <div className="space-y-1.5">
              <label htmlFor="quick-log-date" className="text-xs text-muted-foreground">Date</label>
              <Input
                id="quick-log-date"
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="h-10"
              />
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
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}

// Helper to score evidence completeness for a claim condition
function getEvidenceScore(condition: {
  linkedMedicalVisits: string[];
  linkedExposures: string[];
  linkedSymptoms: string[];
  linkedBuddyContacts: string[];
}) {
  let score = 0;
  if (condition.linkedMedicalVisits.length > 0) score += 25;
  if (condition.linkedExposures.length > 0) score += 25;
  if (condition.linkedSymptoms.length > 0) score += 25;
  if (condition.linkedBuddyContacts.length > 0) score += 25;
  return score;
}
