import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useClaims } from '@/hooks/useClaims';

import { Pill, CheckCircle2, Circle, AlertTriangle, ChevronRight, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PageContainer } from '@/components/PageContainer';
import type { Medication } from '@/types/claims';

interface MedCheckItem {
  label: string;
  check: (med: Medication) => boolean;
  fixRoute: string;
  fixLabel: string;
}

const MED_CHECKLIST: MedCheckItem[] = [
  {
    label: 'Prescriber information recorded',
    check: (med) => !!med.prescriber?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Add prescriber',
  },
  {
    label: 'Functional impact described (on medication)',
    check: (med) => !!med.functionalImpactOnMed?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Describe impact',
  },
  {
    label: 'Functional impact described (without medication)',
    check: (med) => !!med.functionalImpactOffMed?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Describe impact',
  },
  {
    label: 'Side effects documented',
    check: (med) => !!med.sideEffects?.trim(),
    fixRoute: '/health/medications',
    fixLabel: 'Document side effects',
  },
  {
    label: 'Linked to a condition',
    check: (med) => !!med.prescribedFor?.trim() || (med.conditionTags?.length ?? 0) > 0,
    fixRoute: '/health/medications',
    fixLabel: 'Link condition',
  },
];

function getMedScore(med: Medication): number {
  const passed = MED_CHECKLIST.filter((item) => item.check(med)).length;
  return Math.round((passed / MED_CHECKLIST.length) * 100);
}

export default function MedicationRuleTool() {
  const { data } = useClaims();

  const analysis = useMemo(() => {
    const meds = data.medications;
    const totalItems = meds.length * MED_CHECKLIST.length;
    const passedItems = meds.reduce(
      (sum, med) => sum + MED_CHECKLIST.filter((item) => item.check(med)).length,
      0,
    );
    const overallScore = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0;
    const missingCount = totalItems - passedItems;
    return { meds, overallScore, missingCount, totalItems };
  }, [data.medications]);

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon bg-gold/10">
          <ShieldAlert className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">2026 Medication Rule</h1>
          <p className="text-muted-foreground text-sm">Check if your medications are documented for the new VA rule</p>
        </div>
      </div>

      {/* Explanation */}
      <Card className="border-gold/20 bg-gold/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
            <div className="space-y-1.5">
              <h3 className="font-semibold text-sm">What's Changing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Under the new 2026 VA medication rule, veterans must demonstrate that their medications are
                medically necessary for service-connected conditions. This means your medication records need
                to clearly show: who prescribed it, what condition it treats, how it affects your daily
                functioning, and what happens without it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      {analysis.meds.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Overall Readiness</p>
              <span className="text-lg font-bold text-foreground">{analysis.overallScore}%</span>
            </div>
            <Progress value={analysis.overallScore} className="h-2" />
            {analysis.missingCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {analysis.missingCount} item{analysis.missingCount !== 1 ? 's' : ''} missing across {analysis.meds.length} medication{analysis.meds.length !== 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Per-Medication Checklist */}
      {analysis.meds.length > 0 ? (
        <div className="space-y-4">
          {analysis.meds.map((med) => {
            const score = getMedScore(med);
            return (
              <Card key={med.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-medications" />
                      <CardTitle className="text-base">{med.name}</CardTitle>
                    </div>
                    <span className={`text-sm font-bold ${score === 100 ? 'text-success' : score >= 60 ? 'text-gold' : 'text-destructive'}`}>
                      {score}%
                    </span>
                  </div>
                  {med.dosage && (
                    <p className="text-xs text-muted-foreground">{med.dosage}{med.frequency ? ` · ${med.frequency}` : ''}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {MED_CHECKLIST.map((item) => {
                    const passed = item.check(med);
                    return (
                      <div key={item.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {passed ? (
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                          )}
                          <span className={`text-xs ${passed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {item.label}
                          </span>
                        </div>
                        {!passed && (
                          <Link
                            to={item.fixRoute}
                            className="text-[11px] text-gold hover:text-gold/80 flex-shrink-0 flex items-center gap-0.5"
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
            <p className="text-xs text-muted-foreground mb-4">Add your medications to check compliance with the new rule.</p>
            <Link to="/health/medications" className="text-sm text-gold hover:text-gold/80">
              Add Medications
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground/60 text-center px-4">
        This tool is for educational purposes only. Consult with your VSO or attorney
        for guidance specific to your situation.
      </p>
    </PageContainer>
  );
}
