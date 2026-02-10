import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  AlertTriangle, Info, ExternalLink, Trash2, Edit, BookOpen,
  Activity, TrendingUp, Clock, Brain, Moon, Zap, ArrowRight
} from 'lucide-react';

import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionById, type VACondition } from '@/data/vaConditions';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import { getRatingCriteriaByCondition, type RatingCriteria } from '@/data/vaResources/ratingCriteria';
import { getDBQByCondition, type DBQReference } from '@/data/vaResources/dbqReference';

// Common ratings for selector
const commonRatings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function ConditionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useClaims();
  const {
    conditions: userConditions,
    updateCondition,
    removeCondition,
    getConditionDetails,
  } = useUserConditions();

  // Find the user condition
  const userCondition = useMemo(() => {
    return userConditions.find(c => c.id === id);
  }, [userConditions, id]);

  // Get condition details from database
  const conditionDetails = useMemo(() => {
    if (!userCondition) return null;
    return getConditionDetails(userCondition);
  }, [userCondition, getConditionDetails]);

  // Get rating criteria if available
  const ratingCriteria = useMemo(() => {
    if (!conditionDetails) return null;
    // Try to find rating criteria by condition name or a simplified key
    const key = conditionDetails.name.toLowerCase()
      .replace(/post-traumatic stress disorder/i, 'ptsd')
      .replace(/lumbosacral strain.*/i, 'lumbar-spine')
      .replace(/knee.*/i, 'knee')
      .replace(/sleep apnea.*/i, 'sleep-apnea')
      .replace(/migraine.*/i, 'migraines')
      .replace(/tinnitus/i, 'tinnitus');
    return getRatingCriteriaByCondition(key);
  }, [conditionDetails]);

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

  // Local state for editing
  const [editRating, setEditRating] = useState<string>(
    userCondition?.rating?.toString() || ''
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Handle not found
  if (!userCondition || !conditionDetails) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
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
      </div>
    );
  }

  // Handle rating update
  const handleRatingUpdate = (value: string) => {
    setEditRating(value);
    const rating = value ? parseInt(value) : undefined;
    updateCondition(userCondition.id, { rating });
  };

  // Handle delete
  const handleDelete = () => {
    removeCondition(userCondition.id);
    navigate('/claims');
  };

  // Evidence completion percentage
  const evidenceProgress = userCondition.evidenceCount && userCondition.totalEvidenceNeeded
    ? (userCondition.evidenceCount / userCondition.totalEvidenceNeeded) * 100
    : 0;

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/claims')} className="mb-2">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Conditions
      </Button>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
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
            <div className="flex gap-2">
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-destructive">
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Rating Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Rating</label>
              <Select value={editRating} onValueChange={handleRatingUpdate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not yet rated</SelectItem>
                  {commonRatings.map(r => (
                    <SelectItem key={r} value={r.toString()}>{r}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Evidence Progress */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Evidence Status</label>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {userCondition.evidenceCount || 0} of {userCondition.totalEvidenceNeeded || 5} items
                  </span>
                  <span className="font-medium">{Math.round(evidenceProgress)}%</span>
                </div>
                <Progress value={evidenceProgress} />
              </div>
            </div>
          </div>
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
                <div className="relative h-16 w-16">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray={`${conditionReadiness.overallScore * 0.975} 97.5`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {conditionReadiness.overallScore}%
                  </span>
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Medical</span><span>{conditionReadiness.components.medicalEvidence}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Service Link</span><span>{conditionReadiness.components.serviceConnection}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Severity</span><span>{conditionReadiness.components.currentSeverity}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Statements</span><span>{conditionReadiness.components.statements}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Exam Prep</span><span>{conditionReadiness.components.examPrep}%</span></div>
                </div>
              </div>
              {conditionReadiness.tips.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-border">
                  {conditionReadiness.tips.slice(0, 3).map((tip, i) => (
                    <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <Zap className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      {tip}
                    </p>
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
                  <div className="grid grid-cols-3 gap-3 text-center">
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
                        frequencyReport.trend === 'improving' ? 'text-green-500' :
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
                            <Badge key={symptom} variant="secondary" className="text-xs">
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
        <Button variant="outline" size="sm" onClick={() => navigate('/claims/secondary-finder')}>
          <Link2 className="h-3 w-3 mr-1" /> Find Secondaries
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/prep/nexus-letter')}>
          <FileText className="h-3 w-3 mr-1" /> Nexus Letter
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/prep/exam')}>
          <Stethoscope className="h-3 w-3 mr-1" /> Exam Prep
        </Button>
      </div>

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
                  {log.type === 'symptom' && <Activity className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                  {log.type === 'sleep' && <Moon className="h-4 w-4 text-indigo-400 flex-shrink-0" />}
                  {log.type === 'migraine' && <Brain className="h-4 w-4 text-purple-400 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{log.label}</p>
                    <p className="text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString()}</p>
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
        <TabsList className="w-full grid grid-cols-4">
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
                    className={userCondition.rating === level.percentage ? 'border-primary' : ''}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge
                          className={
                            level.percentage === 0 ? 'bg-gray-500' :
                            level.percentage <= 30 ? 'bg-blue-500' :
                            level.percentage <= 70 ? 'bg-blue-500' :
                            'bg-green-500'
                          }
                        >
                          {level.percentage}%
                        </Badge>
                        {userCondition.rating === level.percentage && (
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
                            <Badge key={idx} variant="secondary" className="text-xs">
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
                                <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
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
              <Card className="bg-green-500/5 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-green-700 dark:text-green-400 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    General Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ratingCriteria.generalTips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
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
                    onClick={() => window.open('https://www.ecfr.gov/current/title-38/chapter-I/part-4', '_blank')}
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evidence Checklist</CardTitle>
              <CardDescription>
                Recommended evidence to support your claim for {conditionDetails.abbreviation || conditionDetails.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Service Treatment Records', required: true, description: 'Records from your time in service' },
                { name: 'Nexus Letter', required: true, description: 'Medical opinion linking condition to service' },
                { name: 'Current Medical Records', required: true, description: 'Recent treatment records' },
                { name: 'Buddy Statements', required: false, description: 'Statements from fellow service members' },
                { name: 'Personal Statement', required: false, description: 'Your account of symptoms and impact' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/settings/vault')}>
                <FileText className="h-4 w-4 mr-2" />
                Go to Documents Hub
              </Button>
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
                                <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
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
                  <h4 className="font-medium mb-2 text-green-600">Preparation Tips</h4>
                  <ul className="space-y-2">
                    {dbqReference.prepTips.map((tip, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
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

                <Button variant="outline" className="w-full" onClick={() => navigate('/prep/exam')}>
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
                  <Button variant="outline" size="sm" onClick={() => navigate('/prep/exam')}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    General Exam Prep Guide
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/prep/dbq')}>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Potential Secondary Conditions</CardTitle>
              <CardDescription>
                Common conditions linked to {conditionDetails.abbreviation || conditionDetails.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conditionDetails.commonSecondaries && conditionDetails.commonSecondaries.length > 0 ? (
                <div className="space-y-2">
                  {conditionDetails.commonSecondaries.map((secondary, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{secondary}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  We don't have specific secondary conditions mapped for {conditionDetails.abbreviation || conditionDetails.name} yet. Use the Secondary Condition Finder to explore potential secondary claims.
                </p>
              )}

              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/claims/secondary-finder')}>
                <Link2 className="h-4 w-4 mr-2" />
                Explore Secondary Conditions Finder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View DBQ Button */}
      {conditionDetails.diagnosticCode && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://www.va.gov/health-care/get-medical-records/dbq-medical-evidence/', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View DBQ Forms on VA.gov
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
