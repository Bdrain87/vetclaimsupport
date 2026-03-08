import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { safeFormatDate } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ChevronLeft, Scale, FileText, Link2, Stethoscope, CheckCircle2,
  AlertTriangle, Info, ExternalLink, Trash2, BookOpen,
  Activity, TrendingUp, Clock, Brain, Moon, ArrowRight,
  Sparkles, Loader2, ChevronDown, FileCheck, Plus, Pill, Users, Circle,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { vaConditions, getConditionById } from '@/data/vaConditions';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { getRatingCriteriaByCondition } from '@/data/vaResources/ratingCriteria';
import { getDBQByCondition } from '@/data/vaResources/dbqReference';
import { useAIGenerate } from '@/hooks/useAIGenerate';
import useAppStore from '@/store/useAppStore';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import { AIContentBadge } from '@/components/ui/AIContentBadge';
import { ConditionAutocomplete } from '@/components/shared/ConditionAutocomplete';
import { PageContainer } from '@/components/PageContainer';
import { EvidenceGapAlert } from '@/components/EvidenceGapAlert';
import { useEvidence } from '@/hooks/useEvidence';
import { EvidenceAttachment } from '@/components/shared/EvidenceAttachment';
import { ProgressRing } from '@/components/ui/progress-ring';

// Lazy-load RatingGuidance so criteria data is not bundled until needed
const LazyRatingGuidance = lazy(() => import('@/components/RatingGuidance'));

// Common ratings for selector
const commonRatings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Evidence checklist items
const EVIDENCE_ITEMS = [
  { name: 'Service Treatment Records (STRs)', required: true, description: 'Records from your time in service' },
  { name: 'Post-service medical records', required: true, description: 'Civilian treatment records showing ongoing condition' },
  { name: 'Current diagnosis from healthcare provider', required: true, description: 'Formal diagnosis of the condition' },
  { name: 'Doctor summary', required: true, description: 'Medical opinion linking condition to service' },
  { name: 'Buddy/Lay statements', required: false, description: 'Statements from people who witnessed your condition' },
  { name: 'Personal statement', required: false, description: 'Your account of symptoms and impact' },
  { name: 'VA C&P exam scheduled/completed', required: false, description: 'Compensation & Pension examination' },
  { name: 'Medication records', required: false, description: 'Records of prescriptions for this condition' },
  { name: 'Symptom log entries', required: false, description: 'Logged symptom entries from the app' },
  { name: 'Sleep log entries', required: false, description: 'Sleep tracking data if applicable' },
];

function EvidenceChecklistCard({ conditionId, conditionName, onNavigate }: { conditionId: string; conditionName: string; onNavigate: (path: string) => void }) {
  const checkedItems = useAppStore((s) => s.conditionEvidenceChecks[conditionId] || []);
  const toggleCheck = useAppStore((s) => s.toggleEvidenceCheck);

  const completedCount = checkedItems.length;
  const totalCount = EVIDENCE_ITEMS.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Evidence Checklist</CardTitle>
        <CardDescription>
          Recommended evidence to support your claim for {conditionName}
        </CardDescription>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Evidence: {completedCount}/{totalCount} items</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {EVIDENCE_ITEMS.map((item) => {
          const isChecked = checkedItems.includes(item.name);
          return (
            <button
              key={item.name}
              onClick={() => toggleCheck(conditionId, item.name)}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 w-full text-left hover:bg-muted/70 transition-colors"
            >
              <CheckCircle2 className={`h-5 w-5 mt-0.5 flex-shrink-0 transition-colors ${isChecked ? 'text-success' : 'text-muted-foreground/40'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`font-medium text-sm min-w-0 ${isChecked ? 'line-through text-muted-foreground' : ''}`}>{item.name}</span>
                  {item.required && (
                    <Badge variant="outline" className="text-xs flex-shrink-0">Required</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </button>
          );
        })}

        <Button variant="outline" className="w-full mt-4" onClick={() => onNavigate('/claims/vault')}>
          <FileText className="h-4 w-4 mr-2" />
          Go to Documents Hub
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ConditionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useClaims();
  const {
    conditions: userConditions,
    addCondition,
    updateCondition,
    removeCondition,
    getConditionDetails,
  } = useUserConditions();
  const { documents, setAllDocuments } = useEvidence();

  // Find the claim condition from the app store (for claimCondition ID lookups)
  const claimConditions = useMemo(() => data.claimConditions || [], [data.claimConditions]);
  const claimCondition = useMemo(() => {
    return claimConditions.find(c => c.id === id);
  }, [claimConditions, id]);

  // Find the user condition (by user condition ID, by database condition ID, or by matching claimCondition name)
  const userCondition = useMemo(() => {
    const byId = userConditions.find(c => c.id === id);
    if (byId) return byId;
    // Also check if ID matches a database condition ID that the user has added
    const byConditionId = userConditions.find(c => c.conditionId === id);
    if (byConditionId) return byConditionId;
    // If we found a claimCondition, try to find a matching userCondition by name
    if (claimCondition) {
      return userConditions.find(c => {
        const details = getConditionById(c.conditionId);
        return details?.name.toLowerCase() === claimCondition.name.toLowerCase();
      });
    }
    return undefined;
  }, [userConditions, id, claimCondition]);

  // Get condition details from database - try user condition first, then claimCondition name, then direct DB lookup
  const conditionDetails = useMemo(() => {
    if (userCondition) return getConditionDetails(userCondition);
    // If we have a claimCondition, try to find VA condition by name
    if (claimCondition) {
      const allConditions = vaConditions;
      const match = allConditions.find(c => c.name?.toLowerCase() === claimCondition.name?.toLowerCase());
      if (match) return match;
    }
    // If not a tracked condition, try looking up directly in the database
    if (id) return getConditionById(id);
    return null;
  }, [userCondition, getConditionDetails, id, claimCondition]);

  // Whether this is a "browse" view (condition not yet tracked by user)
  const isBrowseMode = !userCondition && !!conditionDetails;

  // Derive a simplified condition key for looking up rating criteria / DBQ data
  const ratingCriteriaKey = useMemo(() => {
    if (!conditionDetails) return null;
    return conditionDetails.name.toLowerCase()
      .replace(/post-traumatic stress disorder/i, 'ptsd')
      .replace(/lumbosacral strain.*/i, 'lumbar-spine')
      .replace(/knee.*/i, 'knee')
      .replace(/sleep apnea.*/i, 'sleep-apnea')
      .replace(/migraine.*/i, 'migraines')
      .replace(/tinnitus/i, 'tinnitus');
  }, [conditionDetails]);

  // Get rating criteria if available
  const ratingCriteria = useMemo(() => {
    if (!ratingCriteriaKey) return null;
    return getRatingCriteriaByCondition(ratingCriteriaKey);
  }, [ratingCriteriaKey]);

  // Get DBQ reference if available
  const dbqReference = useMemo(() => {
    if (!conditionDetails) return null;
    const key = conditionDetails.name.toLowerCase()
      .replace(/post-traumatic stress disorder/i, 'ptsd')
      .replace(/lumbosacral strain.*/i, 'back-spine')
      .replace(/knee.*/i, 'knee')
      .replace(/sleep apnea.*/i, 'sleep-apnea')
      .replace(/migraine.*/i, 'migraines')
      .replace(/hearing loss|tinnitus/i, 'hearing-tinnitus');
    return getDBQByCondition(key);
  }, [conditionDetails]);

  // Intelligence: condition readiness
  const conditionReadiness = useMemo(() => {
    if (!conditionDetails) return null;
    return ClaimIntelligence.getConditionReadiness(conditionDetails.name, data);
  }, [conditionDetails, data]);

  // Intelligence: evidence completeness
  const evidenceCompleteness = useMemo(() => {
    if (!conditionDetails || !userCondition) return null;
    return ClaimIntelligence.getConditionEvidenceCompleteness(conditionDetails.name, userCondition, data);
  }, [conditionDetails, userCondition, data]);

  // Intelligence: symptom frequency
  const frequencyReport = useMemo(() => {
    if (!conditionDetails) return null;
    return ClaimIntelligence.getSymptomFrequency(conditionDetails.name, data, 90);
  }, [conditionDetails, data]);

  // Related health log entries (tagged to this condition)
  const relatedLogs = useMemo(() => {
    if (!conditionDetails) return [];
    const name = conditionDetails.name;
    const logs: { type: string; date: string; label: string; severity?: number }[] = [];

    (data.symptoms || []).forEach(s => {
      if (s.conditionTags?.includes(name) || s.bodyArea?.toLowerCase().includes(name.toLowerCase())) {
        logs.push({ type: 'symptom', date: s.date, label: s.symptom, severity: s.severity });
      }
    });
    (data.sleepEntries || []).forEach(s => {
      if (s.conditionTags?.includes(name)) {
        logs.push({ type: 'sleep', date: s.date, label: `${s.hoursSlept}h - ${s.quality}` });
      }
    });
    (data.migraines || []).forEach(m => {
      if (m.conditionTags?.includes(name)) {
        logs.push({ type: 'migraine', date: m.date, label: `${m.severity} - ${m.duration}` });
      }
    });

    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [conditionDetails, data]);

  // AI state
  const { generate: aiGenerate, isLoading: aiLoading, error: aiError } = useAIGenerate('VA_SPEAK_TRANSLATOR');
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);

  // Local state for editing
  const [editRating, setEditRating] = useState<string>(
    userCondition?.rating?.toString() || 'not-rated'
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Reset editRating when the condition changes (navigating between conditions)
  useEffect(() => {
    setEditRating(userCondition?.rating?.toString() || 'not-rated');
  }, [id, userCondition?.rating]);

  // Handle adding condition from browse mode
  const handleAddThisCondition = () => {
    if (!conditionDetails) return;
    const result = addCondition(conditionDetails.id);
    if (result) {
      navigate(`/claims/${result.id}`, { replace: true });
    }
  };

  // Handle not found
  if (!conditionDetails) {
    return (
      <PageContainer className="py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Condition Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This condition doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/claims')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Conditions
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  // Handle rating update
  const handleRatingUpdate = (value: string) => {
    setEditRating(value);
    if (!userCondition) return;
    const rating = value && value !== 'not-rated' ? parseInt(value) : undefined;
    updateCondition(userCondition.id, { rating });
  };

  // Handle delete
  const handleDelete = () => {
    if (!userCondition) return;
    removeCondition(userCondition.id);
    navigate('/claims');
  };

  const handleGenerateAIInsights = async () => {
    if (!conditionDetails) return;

    const symptomNames = (data.symptoms || []).map(s => s.symptom);
    const medicationNames = (data.medications || []).map(m => m.name);
    const hasNexus = (data.uploadedDocuments || []).some(d =>
      d.title?.toLowerCase().includes('nexus')
    );
    const hasBuddyStatements = (data.buddyContacts || []).length > 0;

    const prompt = `Analyze a veteran's claim for ${conditionDetails.name} and provide strategic insights.

CONDITION: ${conditionDetails.name}
${conditionDetails.diagnosticCode ? `DIAGNOSTIC CODE: DC ${conditionDetails.diagnosticCode}` : ''}
CURRENT RATING: ${userCondition?.rating !== undefined ? `${userCondition.rating}%` : 'Not yet rated'}

EVIDENCE AVAILABLE:
- Medical visits logged: ${(data.medicalVisits || []).length}
- Symptoms logged: ${symptomNames.length > 0 ? symptomNames.slice(0, 5).join(', ') : 'None'}
- Medications: ${medicationNames.length > 0 ? medicationNames.slice(0, 5).join(', ') : 'None'}
- Doctor summary: ${hasNexus ? 'Yes' : 'No'}
- Buddy statements: ${hasBuddyStatements ? 'Yes' : 'No'}
- Service history entries: ${(data.serviceHistory || []).length}

${conditionReadiness ? `READINESS SCORE: ${conditionReadiness.overallScore}%
- Medical Evidence: ${conditionReadiness.components.medicalEvidence}%
- Service Connection: ${conditionReadiness.components.serviceConnection}%
- Current Severity: ${conditionReadiness.components.currentSeverity}%` : ''}

Provide:
1. STRENGTH ASSESSMENT: What's strong in this claim, what's weak
2. EVIDENCE GAPS: Specific evidence that's missing
3. SUGGESTED NEXT STEPS: Prioritized actions to strengthen the claim
4. KEY RATING CRITERIA: What the veteran should focus on documenting for this specific condition

Be specific and actionable. Reference 38 CFR Part 4 criteria where applicable.`;

    const result = await aiGenerate(prompt);
    if (result) setAiInsights(result);
  };

  // Evidence completion percentage — computed from linked items on the claim condition
  const evidenceCount = claimCondition
    ? ((claimCondition.linkedMedicalVisits?.length ?? 0) > 0 ? 1 : 0)
      + ((claimCondition.linkedSymptoms?.length ?? 0) > 0 ? 1 : 0)
      + ((claimCondition.linkedExposures?.length ?? 0) > 0 ? 1 : 0)
      + ((claimCondition.linkedDocuments?.length ?? 0) > 0 ? 1 : 0)
      + ((claimCondition.linkedBuddyContacts?.length ?? 0) > 0 ? 1 : 0)
    : 0;
  const totalEvidenceNeeded = 5;
  const evidenceProgress = (evidenceCount / totalEvidenceNeeded) * 100;

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/claims')} className="mb-2">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Conditions
      </Button>

      {/* Add This Condition Banner (Browse Mode) */}
      {isBrowseMode && (
        <Alert className="border-primary/30 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-3">
            <span className="text-sm">
              You're viewing condition details. Add it to track evidence and prepare for your claim.
            </span>
            <Button size="sm" onClick={handleAddThisCondition} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              Add This Condition
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-2xl break-words">
                {conditionDetails.abbreviation || conditionDetails.name}
              </CardTitle>
              {conditionDetails.name !== conditionDetails.abbreviation && (
                <CardDescription className="text-base mt-1">
                  {conditionDetails.name}
                </CardDescription>
              )}
              {conditionDetails.diagnosticCode && (
                <Badge variant="outline" className="mt-2">
                  DC {conditionDetails.diagnosticCode}
                </Badge>
              )}
            </div>
            {!isBrowseMode && (
              <div className="flex gap-2">
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive" aria-label="Remove condition">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Remove Condition</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove this condition? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Remove Condition
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isBrowseMode && userCondition ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Rating Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Rating</label>
              <Select value={editRating} onValueChange={handleRatingUpdate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-rated">Not yet rated</SelectItem>
                  {commonRatings.map(r => (
                    <SelectItem key={r} value={r.toString()}>{r}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Evidence Progress */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Evidence Status</label>
              <div className="flex items-center gap-3">
                <ProgressRing
                  value={evidenceCompleteness?.score ?? evidenceProgress}
                  size="sm"
                  variant={
                    (evidenceCompleteness?.score ?? evidenceProgress) >= 80 ? 'success' :
                    (evidenceCompleteness?.score ?? evidenceProgress) >= 50 ? 'warning' : 'danger'
                  }
                />
                <div className="flex-1 space-y-1">
                  {evidenceCompleteness ? (
                    <div className="space-y-0.5">
                      {evidenceCompleteness.items.slice(0, 4).map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5 text-xs">
                          {item.complete ? (
                            <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="h-3 w-3 text-muted-foreground/40 flex-shrink-0" />
                          )}
                          <span className={item.complete ? 'text-muted-foreground line-through' : 'text-foreground'}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {evidenceCount} of {totalEvidenceNeeded} items
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="space-y-3">
              {conditionDetails.bodySystem && (
                <div>
                  <span className="text-sm font-medium">Body System: </span>
                  <Badge variant="secondary">{conditionDetails.bodySystem}</Badge>
                </div>
              )}
              {conditionDetails.keywords && conditionDetails.keywords.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Related Terms:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {conditionDetails.keywords.slice(0, 6).map((s: string) => (
                      <Badge key={s} variant="outline" className="text-xs truncate max-w-full">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button onClick={handleAddThisCondition} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add This Condition to My Claim
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intelligence: Readiness & Frequency */}
      {conditionReadiness && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Readiness Score */}
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Claim Readiness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <ProgressRing
                  value={conditionReadiness.overallScore}
                  size="sm"
                  variant={conditionReadiness.overallScore >= 70 ? 'success' : conditionReadiness.overallScore >= 40 ? 'warning' : 'danger'}
                  label="Ready"
                />
                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Medical</span><span>{conditionReadiness.components.medicalEvidence}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Service Link</span><span>{conditionReadiness.components.serviceConnection}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Severity</span><span>{conditionReadiness.components.currentSeverity}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Statements</span><span>{conditionReadiness.components.statements}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Exam Prep</span><span>{conditionReadiness.components.examPrep}%</span></div>
                </div>
              </div>
              {evidenceCompleteness && evidenceCompleteness.recommendations.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Next Steps to Strengthen</p>
                  {evidenceCompleteness.recommendations.slice(0, 3).map((rec, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(rec.route)}
                      className="w-full text-left flex items-start gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec.action} <span className="text-primary font-medium">(+{rec.pointsGain}pts)</span></span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Frequency & Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Log Activity (90 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {frequencyReport && frequencyReport.totalEntries > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-xl font-bold">{frequencyReport.totalEntries}</p>
                      <p className="text-xs text-muted-foreground">Entries</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-xl font-bold">{frequencyReport.averageSeverity.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">Avg Severity</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className={`text-xl font-bold ${
                        frequencyReport.trend === 'worsening' ? 'text-destructive' :
                        frequencyReport.trend === 'improving' ? 'text-success' :
                        'text-muted-foreground'
                      }`}>
                        {frequencyReport.trend === 'worsening' ? '↑' :
                         frequencyReport.trend === 'improving' ? '↓' : '→'}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{frequencyReport.trend.replace('-', ' ')}</p>
                    </div>
                  </div>
                  {Object.keys(frequencyReport.symptomCounts).length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Top Symptoms</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(frequencyReport.symptomCounts)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([symptom, count]) => (
                            <Badge key={symptom} variant="secondary" className="text-xs truncate max-w-full">
                              {symptom} ({count})
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <Activity className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No tagged logs yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate('/health/symptoms')}
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Log Symptoms
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/health/symptoms')}>
          <Activity className="h-3 w-3 mr-1" /> Log Symptom
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate(`/claims/secondary-finder?condition=${encodeURIComponent(conditionDetails.id)}`)}>
          <Link2 className="h-3 w-3 mr-1" /> Find Secondaries
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate(`/prep/doctor-summary?primary=${encodeURIComponent(conditionDetails.id)}`)}>
          <FileText className="h-3 w-3 mr-1" /> Doctor Summary
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate(`/prep/exam?condition=${encodeURIComponent(conditionDetails.id)}`)}>
          <Stethoscope className="h-3 w-3 mr-1" /> Exam Prep
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate(`/cp-exam-packet?condition=${encodeURIComponent(conditionDetails.id)}`)}>
          <FileCheck className="h-3 w-3 mr-1" /> Exam Packet
        </Button>
      </div>

      {/* Rating Criteria — lazy loaded */}
      {conditionDetails && ratingCriteriaKey && (
        <ErrorBoundary
          fallback={
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardContent className="py-8 text-center">
                <AlertTriangle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Rating criteria failed to load.</p>
              </CardContent>
            </Card>
          }
        >
          <Suspense
            fallback={
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="py-8 text-center">
                  <Scale className="h-6 w-6 text-muted-foreground mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-muted-foreground">Loading rating criteria...</p>
                </CardContent>
              </Card>
            }
          >
            <LazyRatingGuidance
              conditionId={ratingCriteriaKey}
              conditionName={conditionDetails.abbreviation || conditionDetails.name}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* AI Claim Insights */}
      <Collapsible open={aiInsightsOpen} onOpenChange={setAiInsightsOpen}>
        <Card className="border-primary/20">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Claim Insights
                </CardTitle>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${aiInsightsOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {!aiInsights ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered analysis of your claim strength, evidence gaps, and suggested next steps.
                  </p>
                  <Button
                    onClick={handleGenerateAIInsights}
                    disabled={aiLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {aiLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {aiLoading ? 'Analyzing...' : 'Generate Analysis'}
                  </Button>
                  {aiError && !aiLoading && (
                    <Alert className="border-warning/30 bg-warning/5">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <AlertDescription className="text-sm">{aiError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <AIDisclaimer variant="banner" />
                  <AIContentBadge timestamp={new Date().toISOString()} />
                  <div className="p-4 rounded-lg bg-muted/30 border text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto overflow-x-hidden leading-relaxed break-words">
                    {aiInsights}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAiInsights(null);
                      handleGenerateAIInsights();
                    }}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Regenerate
                  </Button>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Research Legal Precedent */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-5 w-5 text-gold" />
            Research Legal Precedent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Use these verified legal databases to find case law relevant to your claim:
            </p>
            <div className="space-y-2 overflow-hidden">
              <a href="https://www.va.gov/decision-reviews/board-appeal/" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm">
                Board of Veterans' Appeals (BVA) Decisions
              </a>
              <a href="https://www.uscourts.cavc.gov/opinions.php" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm">
                Court of Appeals for Veterans Claims (CAVC)
              </a>
              <a href="https://scholar.google.com/" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm">
                Google Scholar — Legal Opinions
              </a>
              <a href="https://www.law.cornell.edu/uscode/text/38" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 text-gold hover:text-gold-hl text-sm">
                38 U.S.C. — Veterans' Benefits (Cornell Law)
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Health Logs */}
      {relatedLogs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Related Logs
            </CardTitle>
            <CardDescription>Entries tagged to {conditionDetails?.abbreviation || conditionDetails?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {relatedLogs.map((log, i) => (
                <div key={`${log.type}-${log.date}-${i}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                  {log.type === 'symptom' && <Activity className="h-4 w-4 text-success flex-shrink-0" />}
                  {log.type === 'sleep' && <Moon className="h-4 w-4 text-indigo-400 flex-shrink-0" />}
                  {log.type === 'migraine' && <Brain className="h-4 w-4 text-gold flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{log.label}</p>
                    <p className="text-xs text-muted-foreground">{safeFormatDate(log.date)}</p>
                  </div>
                  {log.severity !== undefined && (
                    <Badge variant="outline" className="text-xs">{log.severity}/10</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="criteria" className="space-y-4">
        <TabsList className="w-full grid grid-cols-4 overflow-hidden">
          <TabsTrigger value="criteria" className="text-xs sm:text-sm">
            <Scale className="h-4 w-4 mr-1 hidden sm:inline" />
            Criteria
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1 hidden sm:inline" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="exam" className="text-xs sm:text-sm">
            <Stethoscope className="h-4 w-4 mr-1 hidden sm:inline" />
            C&P Exam
          </TabsTrigger>
          <TabsTrigger value="secondary" className="text-xs sm:text-sm">
            <Link2 className="h-4 w-4 mr-1 hidden sm:inline" />
            Secondary
          </TabsTrigger>
        </TabsList>

        {/* Rating Criteria Tab */}
        <TabsContent value="criteria" className="space-y-4">
          {ratingCriteria ? (
            <>
              <Alert className="bg-primary/5 border-primary/30">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Rating criteria from 38 CFR Part 4 - VA Schedule for Rating Disabilities
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {ratingCriteria.ratingLevels.map(level => (
                  <Card
                    key={level.percentage}
                    className={userCondition?.rating === level.percentage ? 'border-primary' : ''}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge
                          className={
                            level.percentage === 0 ? 'bg-muted-foreground' :
                            level.percentage <= 30 ? 'bg-gold' :
                            level.percentage <= 70 ? 'bg-gold' :
                            'bg-success'
                          }
                        >
                          {level.percentage}%
                        </Badge>
                        {userCondition?.rating === level.percentage && (
                          <Badge variant="outline" className="text-xs">Current</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{level.description}</p>

                      <div>
                        <h5 className="text-xs font-medium text-muted-foreground mb-1">
                          Keywords to Mention:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {level.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs truncate max-w-full">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {level.examTips && level.examTips.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground mb-1">
                            Exam Tips:
                          </h5>
                          <ul className="space-y-1">
                            {level.examTips.map((tip, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {level.commonMistakes && level.commonMistakes.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-destructive mb-1">
                            Common Mistakes:
                          </h5>
                          <ul className="space-y-1">
                            {level.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                                <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                                {mistake}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* General Tips */}
              <Card className="bg-success/5 border-success/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-success flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    General Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ratingCriteria.generalTips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-success flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center space-y-3">
                <Scale className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  We don't have specific rating criteria mapped for {conditionDetails.abbreviation || conditionDetails.name} yet. You can look up rating criteria using the VA's Schedule for Rating Disabilities (VASRD).
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://www.ecfr.gov/current/title-38/chapter-I/part-4', '_blank', 'noopener,noreferrer')}
                  >
                    View VASRD on eCFR <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="link" size="sm" onClick={() => navigate('/claims/calculator')}>
                    Use Rating Calculator <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-4">
          {userCondition?.claimStatus === 'approved' ? (
            <Card>
              <CardContent className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
                <h3 className="font-semibold text-foreground">Condition Already Approved</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  This condition is already service-connected and approved. Additional evidence collection is typically only needed if you are pursuing a rating increase.
                </p>
                <Button variant="outline" size="sm" onClick={() => {
                  const el = document.getElementById('evidence-checklist-approved');
                  if (el) el.classList.toggle('hidden');
                }}>
                  View Evidence Checklist Anyway
                </Button>
                <div id="evidence-checklist-approved" className="hidden pt-4">
                  <EvidenceChecklistCard
                    conditionId={id || ''}
                    conditionName={conditionDetails.abbreviation || conditionDetails.name}
                    onNavigate={navigate}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <EvidenceGapAlert
                conditionId={id || ''}
                conditionName={conditionDetails.abbreviation || conditionDetails.name}
              />
              <EvidenceChecklistCard
                conditionId={id || ''}
                conditionName={conditionDetails.abbreviation || conditionDetails.name}
                onNavigate={navigate}
              />
            </>
          )}

          {/* Linked Medications */}
          {(() => {
            const linkedMeds = data.medications.filter(
              (m) =>
                m.conditionTags?.includes(id || '') ||
                m.conditionTags?.includes(userCondition?.conditionId || '') ||
                m.prescribedFor === (conditionDetails.abbreviation || conditionDetails.name),
            );
            return (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Linked Medications ({linkedMeds.length})
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => navigate('/health/medications')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {linkedMeds.length > 0 ? linkedMeds.map((m) => (
                    <div key={m.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">{m.name}</p>
                        {m.dosage && (
                          <p className="text-xs text-muted-foreground">{m.dosage}{m.frequency ? ` · ${m.frequency}` : ''}</p>
                        )}
                      </div>
                      {m.effectiveness && m.effectiveness !== '' && (
                        <Badge variant="outline" className="text-[10px]">{m.effectiveness.replace(/_/g, ' ')}</Badge>
                      )}
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No medications linked yet. Add medications and tag this condition.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })()}

          {/* Linked Buddy Letters */}
          {(() => {
            const condName = conditionDetails.abbreviation || conditionDetails.name || '';
            const linkedBuddies = data.buddyContacts.filter(
              (b) =>
                b.whatTheyWitnessed?.toLowerCase().includes(condName.toLowerCase()) ||
                b.relationship?.toLowerCase().includes(condName.toLowerCase()),
            );
            return (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Buddy Statements ({linkedBuddies.length})
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => navigate('/prep/buddy-statement')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {linkedBuddies.length > 0 ? linkedBuddies.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">{b.rank ? `${b.rank} ` : ''}{b.name}</p>
                        {b.relationship && (
                          <p className="text-xs text-muted-foreground">{b.relationship}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px]">{b.statementStatus}</Badge>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No buddy statements linked. Add contacts who witnessed this condition.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })()}

          {/* Nexus Letter CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Need a nexus letter?</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    A nexus letter from a qualified provider can be the most important piece of evidence in your claim.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => navigate(`/prep/nexus-guide?condition=${userCondition?.id || ''}`)}
                  >
                    Nexus Letter Guide <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* C&P Exam Tab */}
        <TabsContent value="exam" className="space-y-4">
          {dbqReference ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  C&P Exam Preparation
                </CardTitle>
                <CardDescription>
                  Form {dbqReference.formNumber} - {dbqReference.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Questions */}
                <div>
                  <h4 className="font-medium mb-3">What the Examiner Will Ask</h4>
                  <div className="space-y-3">
                    {dbqReference.keyQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium text-sm">{q.question}</p>
                        <p className="text-xs text-primary mt-1">{q.whyItMatters}</p>
                        {q.tips && q.tips.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {q.tips.map((tip, tipIdx) => (
                              <li key={tipIdx} className="text-xs text-muted-foreground flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Prep Tips */}
                <div>
                  <h4 className="font-medium mb-2 text-success">Preparation Tips</h4>
                  <ul className="space-y-2">
                    {dbqReference.prepTips.map((tip, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Common Mistakes */}
                <div>
                  <h4 className="font-medium mb-2 text-destructive">Common Mistakes to Avoid</h4>
                  <ul className="space-y-2">
                    {dbqReference.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full" onClick={() => navigate(`/prep/exam?condition=${encodeURIComponent(conditionDetails.name)}`)}>
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Full Exam Prep Guide
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center space-y-3">
                <Stethoscope className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  We don't have a specific DBQ reference mapped for {conditionDetails.abbreviation || conditionDetails.name} yet. Use our general exam prep tools or view DBQ forms on VA.gov.
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/prep/exam?condition=${encodeURIComponent(conditionDetails.name)}`)}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    General Exam Prep Guide
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/prep/dbq?condition=${encodeURIComponent(conditionDetails.name)}`)}>
                    <FileText className="h-4 w-4 mr-2" />
                    DBQ Form Guidance Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Secondary Conditions Tab */}
        <TabsContent value="secondary" className="space-y-4">
          <Alert className="bg-primary/5 border-primary/30">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Secondary conditions are disabilities caused or aggravated by your service-connected conditions.
              Each secondary can be rated and compensated separately.
            </AlertDescription>
          </Alert>

          {conditionDetails.commonSecondaries && conditionDetails.commonSecondaries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Secondary Conditions</CardTitle>
                <CardDescription>
                  Frequently linked to {conditionDetails.abbreviation || conditionDetails.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conditionDetails.commonSecondaries.map((secondary, idx) => {
                    const secondaryDetails = getConditionById(secondary);
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 gap-2 overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Link2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{secondaryDetails?.name || secondary}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/claims/${secondary}`)}>
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Secondary Conditions</CardTitle>
              <CardDescription>
                Search by diagnostic code, name, or keyword
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConditionAutocomplete
                onSelect={(c) => navigate(`/claims/${c.id}`)}
                placeholder="Search by code, name, or keyword..."
                showBodySystem
              />
              {!conditionDetails.commonSecondaries?.length && (
                <p className="text-muted-foreground text-sm mt-3">
                  We don't have specific secondary conditions mapped for {conditionDetails.abbreviation || conditionDetails.name} yet. Use the search above or the Secondary Condition Finder.
                </p>
              )}
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate(`/claims/secondary-finder?condition=${encodeURIComponent(conditionDetails.name)}`)}>
                <Link2 className="h-4 w-4 mr-2" />
                Explore Secondary Conditions Finder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attach Evidence for This Condition */}
      {id && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attach Evidence</CardTitle>
            <CardDescription>Photos, medical records, or documents supporting this condition</CardDescription>
          </CardHeader>
          <CardContent>
            <EvidenceAttachment
              entryType="claim-condition"
              entryId={id}
              documents={documents}
              onDocumentsChange={setAllDocuments}
            />
          </CardContent>
        </Card>
      )}

      {/* View DBQ Button */}
      {conditionDetails.diagnosticCode && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://www.va.gov/find-forms/?q=dbq', '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View DBQ Forms on VA.gov
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
