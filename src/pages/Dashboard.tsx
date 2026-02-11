import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore, BRANCH_LABELS } from '@/store/useProfileStore';
import useAppStore from '@/store/useAppStore';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import {
  Plus,
  Activity,
  GraduationCap,
  FileText,
  FileCheck,
  ChevronRight,
  Zap,
  AlertTriangle,
  Download,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Check,
  Pencil,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { vcsSpring } from '@/constants/animations';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState, useMemo, useCallback } from 'react';
import { getConditionById } from '@/data/vaConditions';
import { getDiagnosticCodeForCondition } from '@/components/shared/ConditionSearchInput.utils';

export default function Dashboard() {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();
  const addDashboardQuickLog = useAppStore((s) => s.addDashboardQuickLog);
  const navigate = useNavigate();

  const claimConditions = data.claimConditions || [];

  // Intelligence Engine computations
  const readiness = useMemo(
    () => ClaimIntelligence.getOverallReadiness(userConditions, data, profile),
    [userConditions, data, profile]
  );

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

  // Combine userConditions info with claimConditions
  const allConditionNames = useMemo(() => {
    const names = new Set<string>();
    claimConditions.forEach((c) => names.add(c.name));
    userConditions.forEach((uc) => {
      const details = getConditionById(uc.conditionId);
      if (details) names.add(details.name);
    });
    return names;
  }, [claimConditions, userConditions]);

  // Quick log state
  const [painLevel, setPainLevel] = useState(5);
  const [selectedMood, setSelectedMood] = useState<'good' | 'okay' | 'bad' | null>(null);
  const [logSaved, setLogSaved] = useState(false);

  const handleSaveQuickLog = useCallback(() => {
    if (!selectedMood) return;
    addDashboardQuickLog(painLevel, selectedMood);
    setLogSaved(true);
    setTimeout(() => setLogSaved(false), 2000);
    setPainLevel(5);
    setSelectedMood(null);
  }, [painLevel, selectedMood, addDashboardQuickLog]);

  const displayName = profile.firstName
    ? `${profile.firstName}${profile.lastName ? ' ' + profile.lastName : ''}`
    : 'Veteran';
  const hasConditions = allConditionNames.size > 0;
  const branchLabel = profile.branch ? BRANCH_LABELS[profile.branch] : '';
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
            {serviceDateStr && (
              <p className="text-xs text-muted-foreground/70 truncate">{serviceDateStr}</p>
            )}
          </div>
          <button
            onClick={() => navigate('/settings/edit-profile')}
            className="p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Readiness Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={vcsSpring}
        className="rounded-xl bg-card border border-border p-4 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="currentColor" className="text-muted/30"
                strokeWidth="3"
              />
              <motion.circle
                cx="18" cy="18" r="15" fill="none"
                stroke="#3B82F6" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${readiness}, 100`}
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${readiness}, 100` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-base">
              {readiness}%
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">Claim Readiness</p>
            {hasConditions ? (
              <p className="text-sm text-muted-foreground mt-1">
                Based on {allConditionNames.size} condition{allConditionNames.size !== 1 ? 's' : ''} and your evidence
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Add your first condition to get started
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Row (2x2 grid) */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Add Condition', icon: Plus, route: '/claims', color: 'text-primary' },
          { label: 'Log Symptoms', icon: Activity, route: '/health/symptoms', color: 'text-emerald-500' },
          { label: 'Exam Packet', icon: FileCheck, route: '/cp-exam-packet', color: 'text-blue-500' },
          { label: 'Form Guide', icon: FileText, route: '/prep/form-guide', color: 'text-blue-500' },
        ].map((action) => (
          <Link
            key={action.route}
            to={action.route}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl',
              'border border-border bg-card',
              'hover:bg-accent/50 transition-colors',
              'active:scale-[0.98]',
              'min-h-[80px] justify-center'
            )}
          >
            <action.icon className={cn('h-6 w-6', action.color)} />
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>

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
            <p className="text-sm text-muted-foreground mb-3">
              No conditions yet. Tap Add Condition to start building your claim.
            </p>
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

      {/* Quick Daily Log Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...vcsSpring, delay: 0.2 }}
        className="rounded-xl bg-card border border-border p-4 shadow-sm"
      >
        <h3 className="font-bold text-sm text-foreground mb-3">Quick Daily Log</h3>
        {logSaved ? (
          <div className="flex items-center gap-2 py-3 justify-center text-emerald-500">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">Logged</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pain Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Pain Level</span>
                <span className="text-sm font-bold text-foreground">{painLevel}</span>
              </div>
              <Slider
                value={[painLevel]}
                onValueChange={([v]) => setPainLevel(v)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1</span>
                <span>10</span>
              </div>
            </div>

            {/* Mood Selector (icon-based) */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Mood</span>
              <div className="flex gap-2">
                {([
                  { mood: 'good' as const, icon: ThumbsUp, label: 'Good' },
                  { mood: 'okay' as const, icon: Meh, label: 'Okay' },
                  { mood: 'bad' as const, icon: ThumbsDown, label: 'Bad' },
                ]).map(({ mood, icon: Icon, label }) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border transition-colors min-h-[44px]',
                      selectedMood === mood
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-muted-foreground hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
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

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...vcsSpring, delay: 0.25 }}
          className="rounded-xl bg-card border border-border p-4 shadow-sm"
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#3B82F6]" />
            Next Steps
          </h3>
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
        </motion.div>
      )}

      {/* Conditions to Explore — only if recommendations exist */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...vcsSpring, delay: 0.3 }}
          className="rounded-xl bg-card border border-border p-4 shadow-sm"
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            Conditions to Explore
          </h3>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div
                key={rec.conditionId + i}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm font-medium text-foreground truncate">{rec.conditionName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{rec.reason}</p>
                </div>
                <Link
                  to="/claims/secondary-finder"
                  className="text-xs text-primary hover:underline shrink-0"
                >
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      )}
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
