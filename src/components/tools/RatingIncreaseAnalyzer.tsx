import { useState, useMemo } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TrendingUp, CheckCircle2, Circle, AlertTriangle, ArrowRight, FileText, Calendar, Activity, Users, Pill, Info } from 'lucide-react';
import { getDBQCondition, type RatingLevel } from '@/data/dbqCriteria';
import { Link } from 'react-router-dom';

export function RatingIncreaseAnalyzer() {
  const { data } = useClaims();
  const [selectedCondition, setSelectedCondition] = useState('');
  const [currentRating, setCurrentRating] = useState<string>('');

  const claimedConditions = data.claimConditions || [];

  // Get the condition's rating criteria
  const conditionData = useMemo(() => {
    if (!selectedCondition) return null;
    return getDBQCondition(selectedCondition);
  }, [selectedCondition]);

  // Get the selected condition's linked evidence
  const conditionEvidence = useMemo(() => {
    const condition = claimedConditions.find(c => c.name === selectedCondition);
    if (!condition) return null;

    return {
      symptoms: data.symptoms.filter(s => condition.linkedSymptoms.includes(s.id)),
      medicalVisits: data.medicalVisits.filter(v => condition.linkedMedicalVisits.includes(v.id)),
      buddyContacts: data.buddyContacts.filter(b => condition.linkedBuddyContacts.includes(b.id)),
      medications: data.medications.filter(m => condition.linkedDocuments?.includes(m.id)),
      // Also check for PTSD symptoms if it's a mental health condition
      ptsdSymptoms: selectedCondition.toLowerCase().includes('ptsd') || 
                    selectedCondition.toLowerCase().includes('anxiety') ||
                    selectedCondition.toLowerCase().includes('depression')
                    ? data.ptsdSymptoms : [],
      // Check for migraine entries
      migraines: selectedCondition.toLowerCase().includes('migraine') ||
                 selectedCondition.toLowerCase().includes('headache')
                 ? data.migraines : [],
      // Check for sleep entries
      sleepEntries: selectedCondition.toLowerCase().includes('sleep') ||
                    selectedCondition.toLowerCase().includes('apnea')
                    ? data.sleepEntries : [],
    };
  }, [selectedCondition, claimedConditions, data]);

  // Calculate evidence counts for the condition
  const evidenceCounts = useMemo(() => {
    if (!conditionEvidence) return { total: 0, symptoms: 0, visits: 0, buddies: 0, specialized: 0 };
    
    return {
      symptoms: conditionEvidence.symptoms.length,
      visits: conditionEvidence.medicalVisits.length,
      buddies: conditionEvidence.buddyContacts.length,
      ptsd: conditionEvidence.ptsdSymptoms.length,
      migraines: conditionEvidence.migraines.length,
      sleep: conditionEvidence.sleepEntries.length,
      total: conditionEvidence.symptoms.length + 
             conditionEvidence.medicalVisits.length + 
             conditionEvidence.buddyContacts.length +
             conditionEvidence.ptsdSymptoms.length +
             conditionEvidence.migraines.length +
             conditionEvidence.sleepEntries.length,
    };
  }, [conditionEvidence]);

  // Get current and next rating levels
  const ratingAnalysis = useMemo(() => {
    if (!conditionData || !currentRating) return null;

    const currentRatingNum = parseInt(currentRating);
    const ratings = conditionData.ratings.sort((a, b) => a.percentage - b.percentage);
    
    const currentLevel = ratings.find(r => r.percentage === currentRatingNum);
    const nextLevel = ratings.find(r => r.percentage > currentRatingNum);
    const higherLevels = ratings.filter(r => r.percentage > currentRatingNum);

    return {
      current: currentLevel,
      next: nextLevel,
      higherLevels,
      maxRating: ratings[ratings.length - 1]?.percentage || 100,
    };
  }, [conditionData, currentRating]);

  // Check which evidence requirements are met for next level
  const evidenceCheckForNextLevel = useMemo(() => {
    if (!ratingAnalysis?.next || !conditionEvidence) return [];

    const checks: { requirement: string; met: boolean; hint: string }[] = [];
    const nextLevel = ratingAnalysis.next;

    // Check each key evidence requirement
    nextLevel.keyEvidence.forEach(evidence => {
      const evLower = evidence.toLowerCase();
      let met = false;
      let hint = '';

      // Check against our logged evidence
      if (evLower.includes('migraine') || evLower.includes('prostrating')) {
        const prostratingCount = conditionEvidence.migraines.filter(m => m.wasProstrating).length;
        if (nextLevel.percentage === 30) {
          met = prostratingCount >= 12;
          hint = `${prostratingCount}/12+ prostrating attacks logged`;
        } else if (nextLevel.percentage === 50) {
          const missedWorkCount = conditionEvidence.migraines.filter(m => m.economicImpact && m.economicImpact !== 'none').length;
          met = prostratingCount >= 24 && missedWorkCount >= 6;
          hint = `${prostratingCount} prostrating, ${missedWorkCount} with work impact`;
        } else {
          met = prostratingCount >= 6;
          hint = `${prostratingCount}/6+ prostrating attacks logged`;
        }
      } else if (evLower.includes('cpap')) {
        met = conditionEvidence.sleepEntries.some(s => s.usesCPAP);
        hint = met ? 'CPAP use documented' : 'No CPAP documentation found';
      } else if (evLower.includes('sleep study')) {
        met = conditionEvidence.sleepEntries.length > 0;
        hint = `${conditionEvidence.sleepEntries.length} sleep entries logged`;
      } else if (evLower.includes('panic') || evLower.includes('mood')) {
        const relevantSymptoms = conditionEvidence.ptsdSymptoms.filter(s => 
          s.selectedSymptoms.some(sym => 
            sym.toLowerCase().includes('panic') || 
            sym.toLowerCase().includes('mood') ||
            sym.toLowerCase().includes('anxiety')
          )
        );
        met = relevantSymptoms.length >= 3;
        hint = `${relevantSymptoms.length} relevant symptom entries`;
      } else if (evLower.includes('suicidal') || evLower.includes('ideation')) {
        const relevantSymptoms = conditionEvidence.ptsdSymptoms.filter(s => 
          s.selectedSymptoms.some(sym => sym.toLowerCase().includes('suicidal'))
        );
        met = relevantSymptoms.length > 0;
        hint = met ? 'Documented in symptom logs' : 'Not documented yet';
      } else if (evLower.includes('buddy') || evLower.includes('statement') || evLower.includes('witness')) {
        met = conditionEvidence.buddyContacts.length > 0;
        hint = `${conditionEvidence.buddyContacts.length} buddy contact(s)`;
      } else if (evLower.includes('range of motion') || evLower.includes('rom')) {
        met = conditionEvidence.symptoms.some(s => s.notes?.toLowerCase().includes('range') || s.notes?.toLowerCase().includes('rom'));
        hint = met ? 'ROM documented in symptoms' : 'Log ROM limitations in symptoms';
      } else if (evLower.includes('missed work') || evLower.includes('economic')) {
        const workImpact = conditionEvidence.migraines.filter(m => 
          m.economicImpact && m.economicImpact !== 'none'
        );
        met = workImpact.length >= 3;
        hint = `${workImpact.length} entries with work impact`;
      } else {
        // Generic check - do we have any related evidence?
        met = conditionEvidence.symptoms.length > 0 || 
              conditionEvidence.medicalVisits.length > 0;
        hint = met ? 'Some documentation exists' : 'Need more documentation';
      }

      checks.push({ requirement: evidence, met, hint });
    });

    return checks;
  }, [ratingAnalysis, conditionEvidence]);

  // Calculate readiness percentage for increase
  const readinessForIncrease = useMemo(() => {
    if (evidenceCheckForNextLevel.length === 0) return 0;
    const metCount = evidenceCheckForNextLevel.filter(c => c.met).length;
    return Math.round((metCount / evidenceCheckForNextLevel.length) * 100);
  }, [evidenceCheckForNextLevel]);

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="calculator-header">
        <div className="calculator-icon">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Rating Increase Analyzer</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Compare your current rating to higher tiers and see what evidence you need
          </p>
        </div>
      </div>

      {/* Condition & Rating Selection */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4 border-b border-border bg-muted/30">
          <CardTitle className="text-base font-semibold">Select Condition & Current Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={selectedCondition} onValueChange={(v) => { setSelectedCondition(v); setCurrentRating(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a claimed condition" />
                </SelectTrigger>
                <SelectContent>
                  {claimedConditions.map((condition) => (
                    <SelectItem key={condition.id} value={condition.name}>
                      {condition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {conditionData && (
              <div className="space-y-2">
                <Label>Your Current Rating</Label>
                <Select value={currentRating} onValueChange={setCurrentRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionData.ratings.map((rating) => (
                      <SelectItem key={rating.percentage} value={rating.percentage.toString()}>
                        {rating.percentage}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {selectedCondition && !conditionData && (
            <div className="p-3 rounded-lg bg-muted border">
              <p className="text-sm text-muted-foreground">
                Rating criteria not available for this condition. Try selecting a condition like PTSD, Migraines, Sleep Apnea, or Back Pain.
              </p>
            </div>
          )}

          {/* Evidence Summary */}
          {selectedCondition && evidenceCounts.total > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Your Logged Evidence for {selectedCondition}:</p>
              <div className="flex flex-wrap gap-2">
                {evidenceCounts.symptoms > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    {evidenceCounts.symptoms} Symptoms
                  </Badge>
                )}
                {evidenceCounts.visits > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {evidenceCounts.visits} Visits
                  </Badge>
                )}
                {evidenceCounts.buddies > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {evidenceCounts.buddies} Buddies
                  </Badge>
                )}
                {evidenceCounts.migraines > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    {evidenceCounts.migraines} Migraines
                  </Badge>
                )}
                {evidenceCounts.ptsd > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    {evidenceCounts.ptsd} PTSD Logs
                  </Badge>
                )}
                {evidenceCounts.sleep > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    {evidenceCounts.sleep} Sleep Logs
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      {ratingAnalysis && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Current Rating */}
          <Card className="border-muted overflow-hidden">
            <CardHeader className="pb-3 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Current Rating</CardTitle>
                <Badge variant="secondary" className="text-lg font-bold px-4 py-1">
                  {currentRating}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {ratingAnalysis.current ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ratingAnalysis.current.criteria}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Evidence at this level:</p>
                    <ul className="space-y-2">
                      {ratingAnalysis.current.keyEvidence.map((ev, i) => (
                        <li key={i} className="comparison-row text-xs py-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                            <span>{ev}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specific criteria for 0% rating</p>
              )}
            </CardContent>
          </Card>

          {/* Next Rating Level */}
          {ratingAnalysis.next ? (
            <Card className="border-primary/30 overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3 border-b border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">Next Level</CardTitle>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <Badge className="text-lg font-bold px-4 py-1 bg-primary">
                    {ratingAnalysis.next.percentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-sm leading-relaxed">
                  {ratingAnalysis.next.criteria}
                </p>

                {/* Evidence Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Evidence Requirements:</p>
                    <Badge 
                      variant={readinessForIncrease >= 75 ? "default" : readinessForIncrease >= 50 ? "secondary" : "outline"} 
                      className={`text-xs ${readinessForIncrease >= 75 ? 'bg-success' : ''}`}
                    >
                      {readinessForIncrease}% Ready
                    </Badge>
                  </div>
                  <Progress value={readinessForIncrease} className="h-2" />
                  
                  <ul className="space-y-2 mt-3">
                    {evidenceCheckForNextLevel.map((check, i) => (
                      <li 
                        key={i} 
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          check.met 
                            ? 'result-card-success border-success/30' 
                            : 'bg-muted/30 border-border hover:border-primary/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {check.met ? (
                            <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className={`text-sm font-medium ${check.met ? 'text-success' : 'text-foreground'}`}>
                              {check.requirement}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{check.hint}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="result-card-success overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Maximum Rating Achieved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You're at the maximum schedular rating for this condition ({currentRating}%).
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Higher Levels Overview */}
      {ratingAnalysis && ratingAnalysis.higherLevels.length > 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Higher Rating Levels</CardTitle>
            <CardDescription>Overview of all rating tiers above your current {currentRating}%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingAnalysis.higherLevels.map((level, idx) => (
                <div 
                  key={level.percentage} 
                  className={`p-3 rounded-lg border ${idx === 0 ? 'border-primary/30 bg-primary/5' : 'bg-muted/30'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={idx === 0 ? "default" : "outline"} className="font-bold">
                      {level.percentage}%
                    </Badge>
                    {idx === 0 && (
                      <Badge variant="secondary" className="text-[10px]">Next Target</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{level.criteria}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {selectedCondition && conditionData && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/symptoms`}>
                  <Activity className="h-4 w-4 mr-2" />
                  Log Symptoms
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/medical-visits">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Medical Visit
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/buddy-contacts">
                  <Users className="h-4 w-4 mr-2" />
                  Add Buddy Statement
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/tools?tab=nexus`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Get Nexus Letter
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Educational Reference Only</p>
          <p>This analysis is based on 38 CFR Part 4 criteria and your logged evidence. Actual VA ratings depend on C&P exam findings, medical records, and rater interpretation. Consult a VSO for personalized advice.</p>
        </div>
      </div>
    </div>
  );
}
