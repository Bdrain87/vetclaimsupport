import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore } from '@/store/useProfileStore';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import {
  Stethoscope,
  AlertTriangle,
  Activity,
  Pill,
  FileWarning,
  ShieldCheck,
  ChevronRight,
  Plus,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  Users,
  Shield,
  Zap,
  Lightbulb,
  TrendingUp,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { vcsSpring } from '@/constants/animations';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { EnhancedRatingCalculator } from '@/components/dashboard/EnhancedRatingCalculator';
import { ApprovedConditionsSection } from '@/components/dashboard/ApprovedConditionsSection';

import { IntentToFileCard } from '@/components/dashboard/IntentToFileCard';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { MobileNavGrid } from '@/components/dashboard/MobileNavGrid';
import { QuickLogWidget } from '@/components/dashboard/QuickLogWidget';
import { EvidenceGapAnalyzer } from '@/components/dashboard/EvidenceGapAnalyzer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ConditionsExplorer } from '@/components/dashboard/ConditionsExplorer';
import { SymptomPatterns } from '@/components/dashboard/SymptomPatterns';
import { SymptomInsights } from '@/components/dashboard/SymptomInsights';
import { DeadlinesReminders } from '@/components/dashboard/DeadlinesReminders';
import { ClaimsJourneyRoadmap } from '@/components/dashboard/ClaimsJourneyRoadmap';
import { ContextualGuidance } from '@/components/dashboard/ContextualGuidance';
import { GuidedActionBanner } from '@/components/dashboard/GuidedActionBanner';
import { PremiumStatsGrid } from '@/components/dashboard/PremiumStatsGrid';
import { DBQHelp } from '@/components/tools/DBQHelp';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ConditionSearchInput } from '@/components/shared/ConditionSearchInput';
import { getDiagnosticCodeForCondition } from '@/components/shared/ConditionSearchInput.utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMilestones } from '@/hooks/useMilestones';
import { MilestoneToast } from '@/components/MilestoneToast';

export default function Dashboard() {
  const { data, setSeparationDate, addClaimCondition, deleteClaimCondition, updateClaimCondition } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newConditionName, setNewConditionName] = useState('');
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(null);
  const [dismissedRecs, setDismissedRecs] = useState<Set<string>>(new Set());
  const [dismissedInsights, setDismissedInsights] = useState<Set<number>>(new Set());

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
    () => ClaimIntelligence.getRecommendations(profile, userConditions, data)
      .filter(r => !dismissedRecs.has(r.conditionId)),
    [profile, userConditions, data, dismissedRecs]
  );

  const logInsights = useMemo(
    () => ClaimIntelligence.getLogInsights(data)
      .filter((_, i) => !dismissedInsights.has(i)),
    [data, dismissedInsights]
  );

  // Log streak calculation
  const logStreak = useMemo(() => {
    const allDates = new Set<string>();
    [...data.symptoms, ...data.quickLogs].forEach(entry => {
      const d = 'date' in entry ? entry.date : ('createdAt' in entry ? entry.createdAt : '');
      if (d) allDates.add(new Date(d).toDateString());
    });
    [...data.sleepEntries, ...data.migraines].forEach(entry => {
      if (entry.date) allDates.add(new Date(entry.date).toDateString());
    });
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      if (allDates.has(checkDate.toDateString())) {
        streak++;
      } else if (i > 0) break;
    }
    return streak;
  }, [data.symptoms, data.quickLogs, data.sleepEntries, data.migraines]);

  // Milestones tracking
  const { updateProgress, recentlyUnlocked, clearRecentlyUnlocked } = useMilestones();

  useEffect(() => {
    const symptomCount = data.symptoms?.length || 0;
    const documentCount = data.documents?.length || 0;
    const buddyCount = data.buddyContacts?.length || 0;

    if (symptomCount > 0) updateProgress('first-symptom', 1);
    if (symptomCount >= 10) updateProgress('symptoms-10', symptomCount);
    if (symptomCount >= 50) updateProgress('symptoms-50', symptomCount);
    if (documentCount > 0) updateProgress('first-document', 1);
    if (documentCount >= 5) updateProgress('documents-5', documentCount);
    if (documentCount >= 20) updateProgress('documents-20', documentCount);
    if (buddyCount > 0) updateProgress('first-buddy', 1);
    if (buddyCount >= 3) updateProgress('buddies-3', buddyCount);
    if (logStreak >= 7) updateProgress('symptom-streak-7', logStreak);
    if (logStreak >= 30) updateProgress('symptom-streak-30', logStreak);

    // All sections milestone
    const hasSymptoms = symptomCount > 0;
    const hasSleep = (data.sleepEntries?.length || 0) > 0;
    const hasMigraines = (data.migraines?.length || 0) > 0;
    const hasMeds = (data.medications?.length || 0) > 0;
    if (hasSymptoms && hasSleep && hasMigraines && hasMeds) {
      updateProgress('all-sections', 1);
    }
  }, [data, logStreak, updateProgress]);

  const handleAddCondition = () => {
    if (!newConditionName.trim()) return;
    addClaimCondition({
      name: newConditionName.trim(),
      linkedMedicalVisits: [],
      linkedExposures: [],
      linkedSymptoms: [],
      linkedDocuments: [],
      linkedBuddyContacts: [],
      notes: '',
      createdAt: new Date().toISOString(),
    });
    setNewConditionName('');
    setIsAddOpen(false);
  };

  const getEvidenceScore = (condition: typeof claimConditions[0]) => {
    let score = 0;
    if (condition.linkedMedicalVisits.length > 0) score += 25;
    if (condition.linkedExposures.length > 0) score += 25;
    if (condition.linkedSymptoms.length > 0) score += 25;
    if (condition.linkedBuddyContacts.length > 0) score += 25;
    return score;
  };

  const handleQuickAddCondition = (conditionName: string) => {
    // Check if already added
    if (claimConditions.some(c => c.name.toLowerCase() === conditionName.toLowerCase())) {
      toast({
        title: 'Already tracking',
        description: `${conditionName} is already in your conditions list`,
      });
      return;
    }
    
    addClaimCondition({
      name: conditionName,
      linkedMedicalVisits: [],
      linkedExposures: [],
      linkedSymptoms: [],
      linkedDocuments: [],
      linkedBuddyContacts: [],
      notes: '',
      createdAt: new Date().toISOString(),
    });
    
    toast({
      title: 'Condition added',
      description: `${conditionName} added - tap to link evidence`,
    });
    
    // Auto-expand the newly added condition
    const newId = Date.now().toString(); // This matches how IDs are typically generated
    setTimeout(() => {
      const addedCondition = data.claimConditions?.find(c => c.name === conditionName);
      if (addedCondition) {
        setExpandedConditionId(addedCondition.id);
      }
    }, 100);
  };

  const toggleLink = (conditionId: string, type: 'medicalVisits' | 'exposures' | 'symptoms' | 'buddyContacts', itemId: string) => {
    const condition = claimConditions.find(c => c.id === conditionId);
    if (!condition) return;

    const fieldMap = {
      medicalVisits: 'linkedMedicalVisits',
      exposures: 'linkedExposures',
      symptoms: 'linkedSymptoms',
      buddyContacts: 'linkedBuddyContacts',
    } as const;

    const field = fieldMap[type];
    const currentLinks = condition[field] || [];
    const newLinks = currentLinks.includes(itemId)
      ? currentLinks.filter(id => id !== itemId)
      : [...currentLinks, itemId];

    updateClaimCondition(conditionId, { [field]: newLinks });
  };

  // Removed COMMON_CONDITIONS logic - now handled by ConditionsExplorer

  const stats = [
    { title: 'Medical', value: data.medicalVisits.length, icon: Stethoscope, href: '/medical-visits' },
    { title: 'Exposures', value: data.exposures.length, icon: AlertTriangle, href: '/exposures' },
    { title: 'Symptoms', value: data.symptoms.length, icon: Activity, href: '/symptoms' },
    { title: 'Meds', value: data.medications.length, icon: Pill, href: '/medications' },
  ];

  const missingSummaries = data.medicalVisits.filter(v => !v.gotAfterVisitSummary).length;
  const documentsObtained = data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length;
  const buddyStatements = data.buddyContacts.filter(b => b.statementStatus === 'Received' || b.statementStatus === 'Submitted').length;

  const separationDate = data.separationDate ? new Date(data.separationDate) : null;
  
  const handleSeparationDateChange = (date: Date | null) => {
    setSeparationDate(date ? date.toISOString() : null);
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8 md:pb-4 overflow-x-hidden max-w-full">
      {/* Hero Header with Native Share */}
      <DashboardHeader />

      {/* Intent to File Pro Tip - Most Important First */}
      <IntentToFileCard />

      {/* Veteran-Built Badge */}
      <div className="flex justify-center">
        <div className="premium-badge-primary gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          <span>Built by a 100% Disabled Veteran</span>
        </div>
      </div>

      {/* PREMIUM STATS GRID - Key metrics at a glance */}
      <PremiumStatsGrid />

      {/* CLAIM READINESS + KEY METRICS - Intelligence driven */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Readiness Ring */}
        <div className={cn("stat-card flex flex-col items-center justify-center gap-1 min-h-[110px] p-3")}>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-white/[0.06]" strokeWidth="2.5" />
              <motion.circle
                cx="18" cy="18" r="15" fill="none" stroke="#C8A628" strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${readiness}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${readiness}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-sm">
              {readiness}%
            </span>
          </div>
          <p className="text-[10px] font-medium text-muted-foreground">Readiness</p>
        </div>

        {/* Conditions Count */}
        <Link to="/conditions" className={cn("stat-card flex flex-col items-center justify-center gap-1 min-h-[110px] p-3 hover:border-primary/30")}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{claimConditions.length}</p>
          <p className="text-[10px] font-medium text-muted-foreground">
            Conditions{recommendations.length > 0 ? ` · ${recommendations.length} to explore` : ''}
          </p>
        </Link>

        {/* Evidence Items */}
        <Link to="/documents" className={cn("stat-card flex flex-col items-center justify-center gap-1 min-h-[110px] p-3 hover:border-primary/30")}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {data.medicalVisits.length + data.documents.length + data.buddyContacts.length}
          </p>
          <p className="text-[10px] font-medium text-muted-foreground">Evidence Items</p>
        </Link>

        {/* Log Streak */}
        <Link to="/health-log" className={cn("stat-card flex flex-col items-center justify-center gap-1 min-h-[110px] p-3 hover:border-primary/30")}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C8A628]/10">
            <Zap className="h-5 w-5 text-[#C8A628]" />
          </div>
          <p className="text-2xl font-bold text-foreground">{logStreak}</p>
          <p className="text-[10px] font-medium text-muted-foreground">
            Day{logStreak !== 1 ? 's' : ''} Streak
          </p>
        </Link>
      </div>

      {/* YOUR NEXT STEPS - Intelligence powered */}
      {nextSteps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={vcsSpring}
          className={cn("rounded-2xl bg-card border border-border p-4 shadow-sm")}
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#C8A628]" />
            Your Next Steps
          </h3>
          <div className="space-y-2.5">
            {nextSteps.slice(0, 4).map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...vcsSpring, delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5",
                  step.priority === 'urgent' ? 'bg-[#C8A628]/20 text-[#C8A628]' : 'bg-muted text-muted-foreground'
                )}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{step.title}</p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  )}
                </div>
                {step.actionRoute && (
                  <Link to={step.actionRoute} className="text-[#C8A628] text-xs hover:text-[#E8D05A] shrink-0 mt-0.5">
                    Go →
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CONDITIONS TO EXPLORE - Intelligence powered recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...vcsSpring, delay: 0.1 }}
          className={cn("rounded-2xl bg-card border border-border p-4 shadow-sm")}
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#C8A628]" />
            Conditions to Explore
          </h3>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec, i) => (
              <motion.div
                key={rec.conditionId + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...vcsSpring, delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm font-medium text-foreground truncate">{rec.conditionName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{rec.reason}</p>
                  <span className={cn(
                    "inline-block text-[10px] mt-1 px-1.5 py-0.5 rounded-full",
                    rec.strength === 'strong' ? 'bg-[#C8A628]/15 text-[#C8A628]' :
                    rec.strength === 'moderate' ? 'bg-muted text-muted-foreground' : 'bg-muted text-muted-foreground/60'
                  )}>
                    {rec.strength} connection
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setDismissedRecs(prev => new Set(prev).add(rec.conditionId))}
                    className="text-muted-foreground hover:text-foreground p-1"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#C8A628] hover:text-[#E8D05A] text-xs h-8 px-2"
                    onClick={() => handleQuickAddCondition(rec.conditionName)}
                  >
                    Add →
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* INSIGHTS FROM YOUR LOGS - Intelligence powered */}
      {logInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...vcsSpring, delay: 0.15 }}
          className={cn("rounded-2xl bg-card border border-border p-4 shadow-sm")}
        >
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#C8A628]" />
            Insights from Your Logs
          </h3>
          <div className="space-y-2">
            {logInsights.slice(0, 3).map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary border-l-2 border-[#C8A628]/30"
              >
                <p className="text-xs text-muted-foreground flex-1">{insight.message}</p>
                <button
                  onClick={() => setDismissedInsights(prev => new Set(prev).add(i))}
                  className="text-muted-foreground hover:text-foreground p-0.5 shrink-0"
                  aria-label="Dismiss insight"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* GUIDED ACTION BANNER - What to do next */}
      <GuidedActionBanner onOpenAddCondition={() => setIsAddOpen(true)} />

      {/* CLAIMS JOURNEY ROADMAP - Visual progress */}
      <ClaimsJourneyRoadmap />

      {/* CONTEXTUAL GUIDANCE - Smart nudges */}
      <ContextualGuidance onOpenAddCondition={() => setIsAddOpen(true)} />

      {/* CONDITIONS WORTH EXPLORING - Unified Smart Section */}
      <ConditionsExplorer 
        claimConditions={claimConditions}
        onAddCondition={handleQuickAddCondition}
      />

      {/* CONDITIONS - THE FOCAL POINT - Premium Styling */}
      <div className={cn(
        "rounded-2xl overflow-hidden",
        "bg-card",
        "border border-border",
        "shadow-lg"
      )} style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground tracking-tight">Conditions You're Claiming</h2>
                <p className="text-xs text-muted-foreground">{claimConditions.length} condition{claimConditions.length !== 1 ? 's' : ''} tracked</p>
              </div>
            </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 h-10 min-h-[44px] px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline font-semibold">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Condition to Claim</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>What condition are you claiming?</Label>
                    <ConditionSearchInput
                      value={newConditionName}
                      onChange={setNewConditionName}
                      placeholder="Type to search VA conditions (e.g., elbow, tinnitus)..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Search shows VA diagnostic codes. You can also type a custom condition name.
                    </p>
                  </div>
                  <Button onClick={handleAddCondition} className="w-full bg-gradient-to-r from-primary to-primary/90" disabled={!newConditionName.trim()}>
                    Add Condition
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {claimConditions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">No conditions added yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-[320px] mx-auto">
                Start by adding the disabilities or conditions you're claiming. Then track evidence for each one.
              </p>
              <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-gradient-to-r from-primary to-primary/90 shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                <Plus className="h-4 w-4" />
                Add Your First Condition
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {claimConditions.map((condition) => {
                const score = getEvidenceScore(condition);
                const scoreColor = score >= 75 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-muted-foreground';
                const isExpanded = expandedConditionId === condition.id;
                
                return (
                  <div
                    key={condition.id}
                    className={cn(
                      "rounded-xl overflow-hidden",
                      "bg-secondary",
                      "border border-border",
                      "transition-all duration-200",
                      isExpanded && "border-primary/30"
                    )}
                  >
                    {/* Condition Header - Tappable */}
                    <button
                      onClick={() => setExpandedConditionId(isExpanded ? null : condition.id)}
                      className={cn(
                        "w-full flex items-center justify-between",
                        "p-3",
                        "transition-all duration-200",
                        "hover:bg-muted",
                        "active:scale-[0.99]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn(
                          "flex items-center justify-center h-9 w-9 rounded-full flex-shrink-0",
                          score >= 75 ? "bg-success/20" : score >= 50 ? "bg-warning/20" : "bg-muted/30"
                        )}>
                          {score >= 75 ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="font-medium text-foreground truncate">{condition.name}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={scoreColor}>{score}% evidence</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {condition.linkedMedicalVisits.length + condition.linkedSymptoms.length + condition.linkedExposures.length + condition.linkedBuddyContacts.length} items
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <ChevronDown className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )} />
                      </div>
                    </button>

                    {/* Expanded Evidence Linking */}
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-3 border-t border-border">
                        {/* Evidence Categories */}
                        <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <Stethoscope className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{condition.linkedMedicalVisits.length} Medical</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <Activity className="h-4 w-4 text-success" />
                            <span className="text-foreground">{condition.linkedSymptoms.length} Symptoms</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <span className="text-foreground">{condition.linkedExposures.length} Exposures</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{condition.linkedBuddyContacts.length} Buddies</span>
                          </div>
                        </div>

                        {/* Link Medical Visits */}
                        {data.medicalVisits.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <Stethoscope className="h-3 w-3" /> Link Medical Visits
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.medicalVisits.slice(0, 5).map((visit) => (
                                <label key={visit.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedMedicalVisits.includes(visit.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'medicalVisits', visit.id)}
                                  />
                                  <span className="truncate">
                                    {new Date(visit.date).toLocaleDateString()} - {visit.reason || visit.visitType}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Link Symptoms */}
                        {data.symptoms.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <Activity className="h-3 w-3" /> Link Symptoms
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.symptoms.slice(0, 5).map((symptom) => (
                                <label key={symptom.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedSymptoms.includes(symptom.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'symptoms', symptom.id)}
                                  />
                                  <span className="truncate">{symptom.symptom} ({symptom.bodyArea})</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Link Exposures */}
                        {data.exposures.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <AlertTriangle className="h-3 w-3" /> Link Exposures
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.exposures.map((exposure) => (
                                <label key={exposure.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedExposures.includes(exposure.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'exposures', exposure.id)}
                                  />
                                  <span className="truncate">{exposure.type} - {exposure.location}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Link Buddy Contacts */}
                        {data.buddyContacts.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <Users className="h-3 w-3" /> Link Buddy Statements
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.buddyContacts.map((buddy) => (
                                <label key={buddy.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedBuddyContacts.includes(buddy.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'buddyContacts', buddy.id)}
                                  />
                                  <span className="truncate">{buddy.name} ({buddy.rank})</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No evidence prompt */}
                        {data.medicalVisits.length === 0 && data.symptoms.length === 0 && data.exposures.length === 0 && data.buddyContacts.length === 0 && (
                          <div className="text-center py-3">
                            <p className="text-xs text-muted-foreground mb-2">No evidence logged yet</p>
                            <Button size="sm" variant="outline" onClick={() => navigate('/symptoms')} className="text-xs h-10 min-h-[44px]">
                              Start Logging Evidence
                            </Button>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 min-h-[44px] text-xs text-destructive hover:text-destructive px-3"
                            onClick={() => deleteClaimCondition(condition.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 min-h-[44px] text-xs px-3"
                            onClick={() => navigate('/medical-visits')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Evidence
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Quick add more */}
              <button
                onClick={() => setIsAddOpen(true)}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "p-3 rounded-xl",
                  "border border-dashed border-primary/30",
                  "text-primary text-sm",
                  "transition-all duration-200",
                  "hover:bg-primary/5 hover:border-primary/50",
                  "active:scale-[0.98]"
                )}
              >
                <Plus className="h-4 w-4" />
                Add another condition
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Stats - Premium glassmorphism cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Link
            key={stat.title}
            to={stat.href}
            className={cn(
              "stat-card group animate-fade-in",
              "flex flex-col items-center justify-center gap-2",
              "min-h-[100px] p-4",
              "hover:border-primary/30 hover:translate-y-[-2px]",
              "active:scale-[0.98]"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground number-display number-animate">{stat.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Log - Compact inline */}
      <QuickLogWidget />

      {/* Navigation Grid - Hidden on mobile */}
      <div className="hidden md:block">
        <MobileNavGrid />
      </div>

      {/* Evidence Status - Premium info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className={cn(
          "info-card group",
          "flex flex-col items-center justify-center gap-2",
          "min-h-[90px] animate-fade-in"
        )} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/10 group-hover:bg-warning/20 transition-colors">
            <FileWarning className="h-5 w-5 text-warning" />
          </div>
          <span className="text-2xl font-bold text-foreground number-display">
            {data.medicalVisits.length - missingSummaries}/{data.medicalVisits.length}
          </span>
          <span className="text-xs font-medium text-muted-foreground text-center">Summaries</span>
        </div>
        <div className={cn(
          "info-card group",
          "flex flex-col items-center justify-center gap-2",
          "min-h-[90px] animate-fade-in"
        )} style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground number-display">{documentsObtained}/{data.documents.length}</span>
          <span className="text-xs font-medium text-muted-foreground text-center">Documents</span>
        </div>
        <div className={cn(
          "info-card group",
          "flex flex-col items-center justify-center gap-2",
          "min-h-[90px] col-span-2 sm:col-span-1 animate-fade-in"
        )} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
            <ShieldCheck className="h-5 w-5 text-success" />
          </div>
          <span className="text-2xl font-bold text-foreground number-display">{buddyStatements}</span>
          <span className="text-xs font-medium text-muted-foreground text-center">Buddy Statements</span>
        </div>
      </div>

      {/* Symptom Insights */}
      <SymptomInsights />

      {/* Symptom Patterns */}
      <SymptomPatterns />

      {/* Deadlines & Reminders */}
      <DeadlinesReminders />

      {/* My Approved Conditions */}
      <ApprovedConditionsSection />

      {/* BDD & Calculator */}
      <div className="grid gap-3 lg:grid-cols-2">
        <BDDCountdown 
          separationDate={separationDate} 
          onSeparationDateChange={handleSeparationDateChange} 
        />
        <EnhancedRatingCalculator />
      </div>

      {/* Collapsible More Tools */}
      <details className="group">
        <summary className={cn(
          "flex items-center justify-between",
          "min-h-[48px] px-4 py-3 rounded-2xl",
          "bg-card border border-border shadow-sm",
          "cursor-pointer list-none",
          "transition-all duration-300 ease-out",
          "hover:bg-secondary",
          "active:scale-[0.98]"
        )}>
          <span className="text-sm font-medium text-foreground">More Tools</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform duration-300" />
        </summary>
        <div className="mt-3 space-y-3">
          <DashboardInsights />
          <EvidenceGapAnalyzer />
          <DBQHelp />
        </div>
      </details>

      {/* Milestone Toast */}
      {recentlyUnlocked && (
        <MilestoneToast
          milestone={recentlyUnlocked}
          onClose={clearRecentlyUnlocked}
        />
      )}
    </div>
  );
}