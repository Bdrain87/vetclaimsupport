import { useCallback, useMemo, useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ClipboardList,
  FileText,
  FolderOpen,
  MessageSquare,
  Link2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Users,
  Activity,
} from 'lucide-react';
import { getConditionChecklist, ConditionChecklist } from '@/data/conditionChecklists';

interface EvidenceStatus {
  hasMedicalVisits: boolean;
  medicalVisitCount: number;
  hasSymptoms: boolean;
  symptomCount: number;
  hasBuddyStatements: boolean;
  buddyCount: number;
  hasExposures: boolean;
  exposureCount: number;
  hasNexusLetter: boolean;
  hasSleepStudy: boolean;
  usesCPAP: boolean;
  hasMigraineLog: boolean;
  migraineCount: number;
}

export function ConditionSpecificChecklist() {
  const { data } = useClaims();
  const claimConditions = useMemo(() => data.claimConditions ?? [], [data.claimConditions]);
  const [expandedCondition, setExpandedCondition] = useState<string | null>(
    claimConditions[0]?.id || null
  );

  // Calculate evidence status for a condition
  const getEvidenceStatus = useCallback((conditionId: string): EvidenceStatus => {
    const condition = claimConditions.find(c => c.id === conditionId);
    if (!condition) {
      return {
        hasMedicalVisits: false, medicalVisitCount: 0,
        hasSymptoms: false, symptomCount: 0,
        hasBuddyStatements: false, buddyCount: 0,
        hasExposures: false, exposureCount: 0,
        hasNexusLetter: false, hasSleepStudy: false,
        usesCPAP: false, hasMigraineLog: false, migraineCount: 0,
      };
    }

    const linkedVisits = condition.linkedMedicalVisits.length;
    const linkedSymptoms = condition.linkedSymptoms.length;
    const linkedBuddies = condition.linkedBuddyContacts.length;
    const linkedExposures = condition.linkedExposures.length;

    // Check for nexus letter
    const hasNexus = data.documents.some(d => 
      d.name.toLowerCase().includes('nexus') && 
      (d.status === 'Obtained' || d.status === 'Submitted')
    );

    // Check for sleep-specific evidence
    const usesCPAP = data.sleepEntries?.some(s => s.usesCPAP) || false;
    const hasSleepStudy = data.documents.some(d => 
      d.name.toLowerCase().includes('sleep study') && 
      (d.status === 'Obtained' || d.status === 'Submitted')
    );

    // Check for migraine log
    const migraineCount = data.migraines?.length || 0;

    return {
      hasMedicalVisits: linkedVisits > 0,
      medicalVisitCount: linkedVisits,
      hasSymptoms: linkedSymptoms >= 3,
      symptomCount: linkedSymptoms,
      hasBuddyStatements: linkedBuddies > 0,
      buddyCount: linkedBuddies,
      hasExposures: linkedExposures > 0,
      exposureCount: linkedExposures,
      hasNexusLetter: hasNexus,
      hasSleepStudy,
      usesCPAP,
      hasMigraineLog: migraineCount >= 5,
      migraineCount,
    };
  }, [claimConditions, data]);

  // Calculate readiness score
  const calculateReadiness = (checklist: ConditionChecklist, status: EvidenceStatus): number => {
    let score = 0;
    const maxScore = 100;

    // Medical documentation (30 points)
    if (status.hasMedicalVisits) score += 30;

    // Symptom documentation (20 points)
    if (status.hasSymptoms) score += 20;
    else if (status.symptomCount > 0) score += 10;

    // Buddy statements (15 points)
    if (status.hasBuddyStatements) score += 15;

    // Nexus letter (20 points)
    if (status.hasNexusLetter) score += 20;

    // Condition-specific (15 points)
    const name = checklist.name.toLowerCase();
    if (name.includes('sleep') || name.includes('apnea')) {
      if (status.usesCPAP) score += 15;
    } else if (name.includes('migraine')) {
      if (status.hasMigraineLog) score += 15;
    } else if (status.hasExposures) {
      score += 15;
    }

    return Math.min(Math.round((score / maxScore) * 100), 100);
  };

  const conditionsWithChecklists = useMemo(() => {
    return claimConditions
      .map(condition => {
        const checklist = getConditionChecklist(condition.name);
        const evidenceStatus = getEvidenceStatus(condition.id);
        const readinessScore = checklist ? calculateReadiness(checklist, evidenceStatus) : 0;
        
        return {
          condition,
          checklist,
          evidenceStatus,
          readinessScore,
        };
      })
      .filter(c => c.checklist !== null);
  }, [claimConditions, getEvidenceStatus]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Condition-Specific Checklists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Add conditions to see tailored checklists with required forms and recommended evidence
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conditionsWithChecklists.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Condition-Specific Checklists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No specific checklists available for your conditions. Check the Reference section for general guidance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Condition-Specific Checklists
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Tailored forms, evidence requirements, and your logged evidence status
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {conditionsWithChecklists.map(({ condition, checklist, evidenceStatus, readinessScore }) => {
          const isExpanded = expandedCondition === condition.id;

          return (
            <div key={condition.id} className="border rounded-lg overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/30 flex items-center justify-between"
                onClick={() => setExpandedCondition(isExpanded ? null : condition.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{checklist!.name}</h4>
                    <Badge variant="outline" className={getScoreColor(readinessScore)}>
                      {readinessScore}% Ready
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">DC {checklist!.diagnosticCode}</p>
                  <Progress value={readinessScore} className="h-1.5 mt-2 w-32" />
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>

              {isExpanded && (
                <div className="border-t p-4">
                  {/* Evidence Status Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      {evidenceStatus.hasMedicalVisits ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs">
                        {evidenceStatus.medicalVisitCount} Medical Visit{evidenceStatus.medicalVisitCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {evidenceStatus.hasSymptoms ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs">
                        {evidenceStatus.symptomCount} Symptom{evidenceStatus.symptomCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {evidenceStatus.hasBuddyStatements ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs">
                        {evidenceStatus.buddyCount} Buddy Statement{evidenceStatus.buddyCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {evidenceStatus.hasNexusLetter ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs">Nexus Letter</span>
                    </div>
                  </div>

                  <Tabs defaultValue="evidence">
                    <TabsList className="w-full grid grid-cols-4">
                      <TabsTrigger value="evidence" className="text-xs">
                        <FolderOpen className="h-3 w-3 mr-1 hidden sm:inline" />
                        Evidence
                      </TabsTrigger>
                      <TabsTrigger value="forms" className="text-xs">
                        <FileText className="h-3 w-3 mr-1 hidden sm:inline" />
                        Forms
                      </TabsTrigger>
                      <TabsTrigger value="questions" className="text-xs">
                        <MessageSquare className="h-3 w-3 mr-1 hidden sm:inline" />
                        Exam
                      </TabsTrigger>
                      <TabsTrigger value="secondary" className="text-xs">
                        <Link2 className="h-3 w-3 mr-1 hidden sm:inline" />
                        Secondary
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="evidence" className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground mb-3">
                        ✓ = You have this | ○ = Recommended but missing
                      </p>
                      {checklist!.recommendedEvidence.map((ev, idx) => {
                        // Determine if user has this evidence type
                        const hasEvidence = (() => {
                          const item = ev.item.toLowerCase();
                          if (item.includes('medical') || item.includes('treatment')) {
                            return evidenceStatus.hasMedicalVisits;
                          }
                          if (item.includes('buddy') || item.includes('statement')) {
                            return evidenceStatus.hasBuddyStatements;
                          }
                          if (item.includes('nexus')) {
                            return evidenceStatus.hasNexusLetter;
                          }
                          if (item.includes('cpap')) {
                            return evidenceStatus.usesCPAP;
                          }
                          if (item.includes('sleep study')) {
                            return evidenceStatus.hasSleepStudy;
                          }
                          if (item.includes('migraine') || item.includes('log')) {
                            return evidenceStatus.hasMigraineLog;
                          }
                          if (item.includes('symptom')) {
                            return evidenceStatus.hasSymptoms;
                          }
                          return false;
                        })();

                        return (
                          <div 
                            key={idx} 
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              hasEvidence ? 'bg-success/5 border border-success/20' : 'bg-muted/30'
                            }`}
                          >
                            {hasEvidence ? (
                              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm ${hasEvidence ? 'text-success font-medium' : ''}`}>
                                {ev.item}
                                {ev.required && !hasEvidence && (
                                  <Badge variant="destructive" className="ml-2 text-xs">
                                    Important
                                  </Badge>
                                )}
                                {hasEvidence && (
                                  <Badge variant="outline" className="ml-2 text-xs text-success border-success/30">
                                    ✓ Logged
                                  </Badge>
                                )}
                              </p>
                              {ev.description && (
                                <p className="text-xs text-muted-foreground mt-1">{ev.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </TabsContent>

                    <TabsContent value="forms" className="mt-4 space-y-2">
                      {checklist!.requiredForms.map((form, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2">
                          <div className="h-5 w-5 rounded border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm">
                              {form.item}
                              {form.required && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Required
                                </Badge>
                              )}
                            </p>
                            {form.description && (
                              <p className="text-xs text-muted-foreground">{form.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="questions" className="mt-4">
                      <p className="text-xs text-muted-foreground mb-3">
                        Prepare answers to these likely C&P exam questions:
                      </p>
                      <ul className="space-y-2">
                        {checklist!.examQuestions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded-lg">
                            <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="secondary" className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground mb-3">
                        Conditions you may be able to claim secondary to {checklist!.name}:
                      </p>
                      {checklist!.secondaryConditions.map((sec, idx) => (
                        <div key={idx} className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                          <p className="font-medium text-sm text-purple-600 dark:text-purple-400">{sec.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{sec.connection}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>

                  {/* Pro Tips */}
                  {checklist!.tips.length > 0 && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        Pro Tips for {checklist!.name}
                      </p>
                      <ul className="space-y-1">
                        {checklist!.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
