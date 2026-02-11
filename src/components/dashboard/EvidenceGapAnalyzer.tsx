import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Stethoscope,
  AlertCircle,
  Activity,
  Users,
  FileText,
  Lightbulb,
} from 'lucide-react';
import type { ClaimCondition } from '@/types/claims';

interface EvidenceGap {
  type: 'medical' | 'exposure' | 'symptom' | 'buddy' | 'document';
  label: string;
  description: string;
  link: string;
  icon: typeof Stethoscope;
  isMet: boolean;
}

interface ConditionAnalysis {
  condition: ClaimCondition;
  readinessScore: number;
  gaps: EvidenceGap[];
  strengths: string[];
}

export function EvidenceGapAnalyzer() {
  const { data } = useClaims();
  const claimConditions = useMemo(() => data.claimConditions ?? [], [data.claimConditions]);

  const analyses = useMemo((): ConditionAnalysis[] => {
    return claimConditions.map(condition => {
      const gaps: EvidenceGap[] = [];
      const strengths: string[] = [];
      let score = 0;

      // Medical visits linked
      const hasMedical = condition.linkedMedicalVisits.length > 0;
      if (hasMedical) {
        score += 25;
        strengths.push(`${condition.linkedMedicalVisits.length} medical visit(s) linked`);
      }
      gaps.push({
        type: 'medical',
        label: 'Medical Documentation',
        description: hasMedical 
          ? 'Medical visits document your condition in official records'
          : 'Link medical visits showing diagnosis or treatment for this condition',
        link: '/health/visits',
        icon: Stethoscope,
        isMet: hasMedical,
      });

      // Symptoms documented
      const hasSymptoms = condition.linkedSymptoms.length >= 3;
      const symptomCount = condition.linkedSymptoms.length;
      if (hasSymptoms) {
        score += 25;
        strengths.push(`${symptomCount} symptom entries showing ongoing issues`);
      } else if (symptomCount > 0) {
        score += 10;
      }
      gaps.push({
        type: 'symptom',
        label: 'Symptom Documentation',
        description: hasSymptoms
          ? 'Symptoms show chronic, ongoing nature of condition'
          : `Add ${3 - symptomCount} more symptom entries to show pattern (${symptomCount}/3)`,
        link: '/health/symptoms',
        icon: Activity,
        isMet: hasSymptoms,
      });

      // Exposures (if applicable - check if any exposures exist)
      const hasExposures = condition.linkedExposures.length > 0;
      if (data.exposures.length > 0) {
        if (hasExposures) {
          score += 20;
          strengths.push('Service exposure linked to condition');
        }
        gaps.push({
          type: 'exposure',
          label: 'Service Connection (Exposure)',
          description: hasExposures
            ? 'Exposure helps establish service connection'
            : 'Link exposures that may have caused or worsened this condition',
          link: '/health/exposures',
          icon: AlertCircle,
          isMet: hasExposures,
        });
      } else {
        score += 10; // Partial credit if no exposures tracked
      }

      // Buddy statements
      const hasBuddy = condition.linkedBuddyContacts.length > 0;
      if (hasBuddy) {
        score += 15;
        strengths.push('Buddy statement provides third-party evidence');
      }
      gaps.push({
        type: 'buddy',
        label: 'Buddy Statement',
        description: hasBuddy
          ? 'Third-party witness strengthens your claim'
          : 'A buddy statement from someone who witnessed your condition is powerful evidence',
        link: '/prep/buddy-statement',
        icon: Users,
        isMet: hasBuddy,
      });

      // Documents (nexus letter is key)
      const hasNexusChecklist = data.documents.some(d =>
        d.name.includes('Nexus') &&
        (d.status === 'Obtained' || d.status === 'Submitted')
      );
      const hasNexusUploaded = (data.uploadedDocuments ?? []).some(doc =>
        doc.documentType === 'nexus' ||
        doc.title.toLowerCase().includes('nexus')
      );
      const hasNexus = hasNexusChecklist || hasNexusUploaded;
      if (hasNexus) {
        score += 15;
        strengths.push('Nexus letter links condition to service');
      }
      gaps.push({
        type: 'document',
        label: 'Nexus Letter',
        description: hasNexus
          ? 'Medical opinion linking condition to service'
          : 'A nexus letter from a doctor significantly increases approval odds',
        link: '/settings/vault',
        icon: FileText,
        isMet: hasNexus,
      });

      return {
        condition,
        readinessScore: Math.min(score, 100),
        gaps,
        strengths,
      };
    });
  }, [claimConditions, data]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success/10 border-success/30';
    if (score >= 50) return 'bg-warning/10 border-warning/30';
    return 'bg-destructive/10 border-destructive/30';
  };

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Evidence Gap Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Search className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Add conditions to your Claim Builder to analyze evidence gaps
            </p>
            <p className="text-xs text-muted-foreground">
              The analyzer will show what evidence you need for each condition
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
          <Search className="h-5 w-5 text-primary" />
          Evidence Gap Analyzer
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Per-condition readiness scores and missing evidence
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {analyses.map(({ condition, readinessScore, gaps, strengths }) => (
          <div key={condition.id} className={`rounded-lg border p-4 ${getScoreBg(readinessScore)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">{condition.name}</h4>
              <Badge variant="outline" className={getScoreColor(readinessScore)}>
                {readinessScore}% Ready
              </Badge>
            </div>

            <Progress value={readinessScore} className="h-2 mb-4" />

            {/* Gaps */}
            <div className="space-y-2">
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-2 rounded-md ${
                    gap.isMet ? 'bg-success/5' : 'bg-background'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {gap.isMet ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${gap.isMet ? 'text-success' : 'text-foreground'}`}>
                      {gap.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{gap.description}</p>
                  </div>
                  {!gap.isMet && (
                    <Button variant="ghost" size="sm" asChild className="flex-shrink-0 h-7">
                      <Link to={gap.link}>
                        Add
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Strengths summary */}
            {strengths.length > 0 && (
              <div className="mt-3 pt-3 border-t border-success/20">
                <p className="text-xs font-medium text-success mb-1">Evidence Strengths:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {strengths.map((s, i) => (
                    <li key={i}>✓ {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {/* Overall tip */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <Lightbulb className="h-3 w-3 inline text-primary" /> <strong className="text-foreground">Tip:</strong> Aim for 80%+ readiness on each
            condition before filing. The VA looks for medical documentation, symptom patterns, 
            and service connection evidence.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
