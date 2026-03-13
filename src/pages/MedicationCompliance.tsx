import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useClaims } from '@/hooks/useClaims';

import {
  Pill,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageContainer } from '@/components/PageContainer';
import type { Medication } from '@/types/claims';

// ---------------------------------------------------------------------------
// Compliance checklist items
// ---------------------------------------------------------------------------

interface ComplianceItem {
  id: string;
  label: string;
  check: (med: Medication) => boolean;
  fixRoute: string;
  fixLabel: string;
}

const COMPLIANCE_CHECKLIST: ComplianceItem[] = [
  {
    id: 'prescriber',
    label: 'Prescriber documented',
    check: (med) => !!med.prescriber?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Add prescriber',
  },
  {
    id: 'impact-on',
    label: 'On-med functional impact logged',
    check: (med) => !!med.functionalImpactOnMed?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Log impact',
  },
  {
    id: 'impact-off',
    label: 'Off-med functional impact logged',
    check: (med) => !!med.functionalImpactOffMed?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Log impact',
  },
  {
    id: 'side-effects',
    label: 'Side effects documented',
    check: (med) => !!med.sideEffects?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Document effects',
  },
  {
    id: 'linked-condition',
    label: 'Linked to condition',
    check: (med) => !!med.prescribedFor?.trim() || (med.conditionTags?.length ?? 0) > 0,
    fixRoute: '/health/medications',
    fixLabel: 'Link condition',
  },
];

function getMedScore(med: Medication): number {
  const passed = COMPLIANCE_CHECKLIST.filter((item) => item.check(med)).length;
  return Math.round((passed / COMPLIANCE_CHECKLIST.length) * 100);
}

function scoreColor(score: number): string {
  if (score === 100) return 'text-success';
  if (score >= 60) return 'text-gold';
  return 'text-destructive';
}

function scoreBg(score: number): string {
  if (score === 100) return 'bg-success/10';
  if (score >= 60) return 'bg-gold/10';
  return 'bg-destructive/10';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MedicationCompliance() {
  const { data } = useClaims();

  const analysis = useMemo(() => {
    const meds = data.medications;
    const totalItems = meds.length * COMPLIANCE_CHECKLIST.length;
    const passedItems = meds.reduce(
      (sum, med) => sum + COMPLIANCE_CHECKLIST.filter((item) => item.check(med)).length,
      0,
    );
    const overallScore = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0;
    const missingCount = totalItems - passedItems;
    const fullyCompliant = meds.filter((m) => getMedScore(m) === 100).length;
    return { meds, overallScore, missingCount, totalItems, fullyCompliant };
  }, [data.medications]);

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-gold/10">
          <ShieldCheck className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medication Compliance</h1>
          <p className="text-muted-foreground text-sm">
            VA 2026 rule compliance dashboard
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-gold/30 bg-gold/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-gold mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Important:</span>{' '}
              VA may reduce your rating if medication compliance is not documented under the 2026 rule.
              Ensure every medication has complete documentation below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      {analysis.meds.length > 0 && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Overall Compliance Score</p>
              </div>
              <span className={`text-2xl font-bold ${scoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}%
              </span>
            </div>
            <Progress value={analysis.overallScore} className="h-2.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {analysis.fullyCompliant} of {analysis.meds.length} medication{analysis.meds.length !== 1 ? 's' : ''} fully compliant
              </span>
              {analysis.missingCount > 0 && (
                <span>
                  {analysis.missingCount} gap{analysis.missingCount !== 1 ? 's' : ''} to fix
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-Medication Cards */}
      {analysis.meds.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground px-1">Per-Medication Breakdown</h2>
          {analysis.meds.map((med) => {
            const score = getMedScore(med);
            return (
              <Card key={med.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${scoreBg(score)}`}>
                        <Pill className="h-4 w-4 text-medications" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{med.name}</CardTitle>
                        {med.dosage && (
                          <p className="text-xs text-muted-foreground">
                            {med.dosage}{med.frequency ? ` \u00b7 ${med.frequency}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${scoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-1">
                  {COMPLIANCE_CHECKLIST.map((item) => {
                    const passed = item.check(med);
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-2 py-0.5">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {passed ? (
                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive/60 shrink-0" />
                          )}
                          <span className={`text-xs ${passed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {item.label}
                          </span>
                        </div>
                        {!passed && (
                          <Link
                            to={item.fixRoute}
                            className="text-[11px] text-gold hover:text-gold/80 shrink-0 flex items-center gap-0.5 font-medium"
                          >
                            Fix <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Pill className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No medications tracked</p>
            <p className="text-xs text-muted-foreground mb-4">
              Add your medications to check compliance with the VA 2026 rule.
            </p>
            <Link
              to="/health/medications"
              className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold/80 font-medium"
            >
              Add Medications <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground/60 text-center px-4">
        This tool is for educational purposes only. It does not constitute legal or medical advice.
        Consult with your VSO or attorney for guidance specific to your situation.
      </p>
    </PageContainer>
  );
}
