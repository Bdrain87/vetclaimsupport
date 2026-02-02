import { useMemo, useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Stethoscope,
  Users,
  Activity,
  Calendar,
  ArrowRight,
  Lightbulb,
  Clock,
  Target,
} from 'lucide-react';
import { getConditionChecklist, type ConditionChecklist } from '@/data/conditionChecklists';
import type { ClaimCondition } from '@/types/claims';

interface EvidenceItem {
  id: string;
  label: string;
  description: string;
  category: 'medical' | 'symptom' | 'buddy' | 'document' | 'form';
  required: boolean;
  completed: boolean;
  count?: number;
  link?: string;
  firstPersonTip?: string;
}

interface ConditionEvidence {
  condition: ClaimCondition;
  checklist: ConditionChecklist | null;
  readinessScore: number;
  items: EvidenceItem[];
  missingCritical: number;
  firstPersonStatement: string;
}

export function EnhancedEvidenceChecklist() {
  const { data } = useClaims();
  const claimConditions = data.claimConditions || [];
  const [expandedCondition, setExpandedCondition] = useState<string | null>(
    claimConditions[0]?.id || null
  );

  // Get earliest service date for narratives
  const serviceStartDate = useMemo(() => {
    if (data.serviceHistory?.length > 0) {
      const dates = data.serviceHistory.map(s => new Date(s.startDate)).filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        return dates.sort((a, b) => a.getTime() - b.getTime())[0];
      }
    }
    return null;
  }, [data.serviceHistory]);

  const conditionsWithEvidence = useMemo((): ConditionEvidence[] => {
    return claimConditions.map(condition => {
      const checklist = getConditionChecklist(condition.name);
      const items: EvidenceItem[] = [];
      let score = 0;
      let missingCritical = 0;

      // Medical visits evidence
      const linkedVisits = condition.linkedMedicalVisits.length;
      const hasMedical = linkedVisits > 0;
      if (hasMedical) score += 30;
      else missingCritical++;
      
      items.push({
        id: 'medical',
        label: 'Medical Documentation',
        description: hasMedical 
          ? `${linkedVisits} medical visit(s) linked showing diagnosis or treatment`
          : 'Link medical visits showing diagnosis, treatment, or ongoing care for this condition',
        category: 'medical',
        required: true,
        completed: hasMedical,
        count: linkedVisits,
        link: '/medical-visits',
        firstPersonTip: `"I first sought treatment for [condition] on [DATE] at [FACILITY]. My doctor diagnosed me with [DIAGNOSIS] and prescribed [TREATMENT]."`,
      });

      // Symptom documentation
      const linkedSymptoms = condition.linkedSymptoms.length;
      const hasSymptoms = linkedSymptoms >= 3;
      if (hasSymptoms) score += 25;
      else if (linkedSymptoms > 0) score += 10;
      if (linkedSymptoms < 3) missingCritical++;

      items.push({
        id: 'symptoms',
        label: `Symptom Log (${linkedSymptoms}/3 minimum)`,
        description: hasSymptoms
          ? `${linkedSymptoms} symptom entries documenting ongoing issues`
          : `Log at least 3 symptom entries to show pattern (you have ${linkedSymptoms})`,
        category: 'symptom',
        required: true,
        completed: hasSymptoms,
        count: linkedSymptoms,
        link: '/symptoms',
        firstPersonTip: `"My symptoms occur [FREQUENCY], typically lasting [DURATION]. On a scale of 1-10, the severity is usually [X] but reaches [Y] during flare-ups. This prevents me from [SPECIFIC ACTIVITIES]."`,
      });

      // Service connection (exposures)
      const linkedExposures = condition.linkedExposures.length;
      const hasExposures = linkedExposures > 0;
      if (hasExposures) score += 15;
      
      items.push({
        id: 'exposures',
        label: 'Service Connection Evidence',
        description: hasExposures
          ? `${linkedExposures} exposure(s) linked establishing in-service event`
          : 'Link exposures, incidents, or service duties that caused or contributed to this condition',
        category: 'document',
        required: true,
        completed: hasExposures,
        count: linkedExposures,
        link: '/exposures',
        firstPersonTip: `"During my service from [START DATE] to [END DATE] at [LOCATION], I was exposed to [HAZARD/EVENT]. This exposure occurred while performing my duties as [MOS/RATE]."`,
      });

      // Buddy statements
      const linkedBuddies = condition.linkedBuddyContacts.length;
      const hasBuddy = linkedBuddies > 0;
      if (hasBuddy) score += 15;

      items.push({
        id: 'buddy',
        label: 'Buddy/Lay Statement',
        description: hasBuddy
          ? `${linkedBuddies} buddy statement(s) providing third-party witness`
          : 'Get a statement from someone who witnessed your condition or the in-service event',
        category: 'buddy',
        required: false,
        completed: hasBuddy,
        count: linkedBuddies,
        link: '/buddy-contacts',
        firstPersonTip: `Ask your buddy to write: "I served with [NAME] at [LOCATION] from [DATE] to [DATE]. I personally witnessed [SPECIFIC INCIDENT/SYMPTOMS]. I observed that [NAME] [SPECIFIC OBSERVATIONS]."`,
      });

      // Nexus letter
      const hasNexus = data.documents.some(d => 
        d.name.toLowerCase().includes('nexus') && 
        (d.status === 'Obtained' || d.status === 'Submitted')
      );
      if (hasNexus) score += 15;

      items.push({
        id: 'nexus',
        label: 'Nexus Letter',
        description: hasNexus
          ? 'Medical opinion linking condition to service ✓'
          : 'Get a doctor\'s letter stating the connection is "at least as likely as not" related to service',
        category: 'document',
        required: false,
        completed: hasNexus,
        link: '/claim-tools?tab=nexus',
        firstPersonTip: `Ask your doctor to include: "It is my medical opinion that [VETERAN]'s [CONDITION] is at least as likely as not (50% probability or greater) related to their military service."`,
      });

      // Generate first-person statement template
      const serviceYear = serviceStartDate?.getFullYear() || '[YEAR]';
      const firstPersonStatement = generateConditionStatement(condition.name, serviceYear, checklist);

      return {
        condition,
        checklist,
        readinessScore: Math.min(score, 100),
        items,
        missingCritical,
        firstPersonStatement,
      };
    });
  }, [claimConditions, data, serviceStartDate]);

  const overallScore = useMemo(() => {
    if (conditionsWithEvidence.length === 0) return 0;
    const total = conditionsWithEvidence.reduce((sum, c) => sum + c.readinessScore, 0);
    return Math.round(total / conditionsWithEvidence.length);
  }, [conditionsWithEvidence]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Evidence Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ClipboardList className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Add conditions to your Claim Builder to see what evidence you need
            </p>
            <Button asChild variant="outline">
              <Link to="/dashboard">Go to Claim Builder</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className={`data-card ${getScoreBg(overallScore)}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Overall Claim Readiness
            </CardTitle>
            <Badge variant="outline" className={`text-lg px-3 py-1 ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore} className="h-3 mb-3" />
          <p className="text-sm text-muted-foreground">
            {overallScore >= 80 
              ? "✓ Your evidence is strong. Consider filing your claim."
              : overallScore >= 50
                ? "⚠️ You have good evidence but some gaps remain. Review missing items below."
                : "⚠️ Critical evidence is missing. Focus on the red items below before filing."}
          </p>
        </CardContent>
      </Card>

      {/* Per-Condition Checklists */}
      {conditionsWithEvidence.map(({ condition, checklist, readinessScore, items, missingCritical, firstPersonStatement }) => (
        <Card key={condition.id} className="data-card">
          <div
            className="p-4 cursor-pointer hover:bg-muted/30 flex items-center justify-between"
            onClick={() => setExpandedCondition(expandedCondition === condition.id ? null : condition.id)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-foreground">{condition.name}</h3>
                <Badge variant="outline" className={getScoreColor(readinessScore)}>
                  {readinessScore}% Ready
                </Badge>
                {missingCritical > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {missingCritical} Critical Missing
                  </Badge>
                )}
              </div>
              {checklist && (
                <p className="text-xs text-muted-foreground mt-1">
                  VA Diagnostic Code: {checklist.diagnosticCode}
                </p>
              )}
            </div>
            <ArrowRight className={`h-5 w-5 transition-transform ${expandedCondition === condition.id ? 'rotate-90' : ''}`} />
          </div>

          {expandedCondition === condition.id && (
            <CardContent className="border-t pt-4 space-y-4">
              {/* Evidence Items */}
              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border ${
                      item.completed 
                        ? 'bg-green-500/5 border-green-500/30' 
                        : item.required 
                          ? 'bg-red-500/5 border-red-500/30' 
                          : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : item.required ? (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${item.completed ? 'text-green-600 dark:text-green-400' : ''}`}>
                            {item.label}
                          </p>
                          {item.required && !item.completed && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        
                        {item.firstPersonTip && !item.completed && (
                          <div className="mt-2 p-2 bg-primary/5 rounded text-xs italic text-muted-foreground border border-primary/10">
                            <span className="text-primary font-medium not-italic">💡 Write it like this: </span>
                            {item.firstPersonTip}
                          </div>
                        )}
                      </div>
                      {item.link && !item.completed && (
                        <Button variant="ghost" size="sm" asChild className="flex-shrink-0 h-8">
                          <Link to={item.link}>
                            Add
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample First-Person Statement */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="statement" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Sample Personal Statement Template</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-muted/50 rounded-lg border text-sm leading-relaxed">
                      {firstPersonStatement}
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                      <Lightbulb className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>
                        Replace the bracketed [PLACEHOLDERS] with your specific information. 
                        Be specific about dates, locations, and how the condition affects your daily life.
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Condition-Specific Tips */}
              {checklist?.tips && checklist.tips.length > 0 && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-primary" />
                    Tips for {condition.name}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {checklist.tips.slice(0, 3).map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

function generateConditionStatement(conditionName: string, serviceYear: number | string, checklist: ConditionChecklist | null): string {
  const name = conditionName.toLowerCase();
  
  let statement = `I am writing to support my claim for ${conditionName}. `;
  statement += `During my military service, which began in ${serviceYear}, I [DESCRIBE THE IN-SERVICE EVENT, INJURY, OR EXPOSURE THAT CAUSED OR CONTRIBUTED TO THIS CONDITION].\n\n`;
  
  statement += `I first noticed symptoms of this condition on [DATE] while stationed at [LOCATION]. `;
  statement += `At that time, I experienced [DESCRIBE INITIAL SYMPTOMS]. `;
  statement += `I sought treatment at [FACILITY] on [DATE], where I was [DIAGNOSED/TREATED FOR].\n\n`;

  statement += `Currently, my condition affects me in the following ways:\n`;
  statement += `• Frequency: [HOW OFTEN SYMPTOMS OCCUR]\n`;
  statement += `• Severity: [RATE 1-10 AND DESCRIBE]\n`;
  statement += `• Duration: [HOW LONG EPISODES LAST]\n`;
  statement += `• Daily Impact: [SPECIFIC ACTIVITIES YOU CANNOT DO]\n\n`;

  if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression')) {
    statement += `My mental health symptoms specifically include [NIGHTMARES/FLASHBACKS/AVOIDANCE/HYPERVIGILANCE]. `;
    statement += `These symptoms occur [FREQUENCY] and have affected my relationships with [FAMILY/FRIENDS/COWORKERS]. `;
    statement += `I have [MISSED WORK/HAD DIFFICULTY MAINTAINING EMPLOYMENT] due to these symptoms.\n\n`;
  }

  if (name.includes('back') || name.includes('knee') || name.includes('shoulder')) {
    statement += `On my worst days, I cannot [SPECIFIC LIMITATIONS]. `;
    statement += `I have approximately [NUMBER] flare-ups per [WEEK/MONTH] lasting [DURATION]. `;
    statement += `I use [BRACE/CANE/MEDICATION] to manage my symptoms.\n\n`;
  }

  statement += `I respectfully request that the VA grant service connection for this condition based on the evidence provided.`;

  return statement;
}
