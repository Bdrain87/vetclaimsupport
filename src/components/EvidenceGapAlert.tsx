import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, AlertTriangle, FileText, Users, Stethoscope,
  ClipboardList, FileCheck, Activity, Shield, ChevronRight,
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { cn } from '@/lib/utils';

// Evidence types that VA typically looks for, by category
interface EvidenceRequirement {
  id: string;
  name: string;
  icon: React.ReactNode;
  /** Whether this is typically required for service connection */
  importance: 'critical' | 'recommended' | 'helpful';
  /** How to check if the veteran has this */
  checkFn: (conditionId: string, state: AppState) => boolean;
  /** Action path to address missing evidence */
  actionPath: string;
  actionLabel: string;
  /** Description shown when missing */
  missingDescription: string;
}

interface AppState {
  checkedItems: string[];
  hasBuddyContacts: boolean;
  hasSymptomLogs: boolean;
  hasSleepLogs: boolean;
  hasMedicalVisits: boolean;
  hasMedications: boolean;
  hasUploadedDocs: boolean;
}

const EVIDENCE_REQUIREMENTS: EvidenceRequirement[] = [
  {
    id: 'diagnosis',
    name: 'Current Medical Diagnosis',
    icon: <Stethoscope className="h-4 w-4" />,
    importance: 'critical',
    checkFn: (cid, state) => state.checkedItems.includes('Current diagnosis from healthcare provider'),
    actionPath: '/health/visits',
    actionLabel: 'Log Medical Visit',
    missingDescription: 'A formal diagnosis from a healthcare provider is typically needed to establish a current disability.',
  },
  {
    id: 'str',
    name: 'Service Treatment Records',
    icon: <FileCheck className="h-4 w-4" />,
    importance: 'critical',
    checkFn: (cid, state) => state.checkedItems.includes('Service Treatment Records (STRs)'),
    actionPath: '/claims/vault',
    actionLabel: 'Upload STRs',
    missingDescription: 'In-service medical records help establish that the condition began during or was aggravated by service.',
  },
  {
    id: 'nexus',
    name: 'Doctor Summary / Medical Opinion',
    icon: <FileText className="h-4 w-4" />,
    importance: 'critical',
    checkFn: (cid, state) => state.checkedItems.includes('Doctor summary'),
    actionPath: '/prep/doctor-summary',
    actionLabel: 'Build Doctor Summary',
    missingDescription: 'A medical opinion linking your condition to service is one of the most important pieces of evidence for service connection.',
  },
  {
    id: 'personal-statement',
    name: 'Personal Statement',
    icon: <FileText className="h-4 w-4" />,
    importance: 'recommended',
    checkFn: (cid, state) => state.checkedItems.includes('Personal statement'),
    actionPath: '/prep/personal-statement',
    actionLabel: 'Write Statement',
    missingDescription: 'Your personal account of how the condition started, how it affects your daily life, and its connection to service.',
  },
  {
    id: 'buddy-statement',
    name: 'Buddy / Lay Statement',
    icon: <Users className="h-4 w-4" />,
    importance: 'recommended',
    checkFn: (cid, state) => state.checkedItems.includes('Buddy/Lay statements') || state.hasBuddyContacts,
    actionPath: '/prep/buddy-statement',
    actionLabel: 'Build Buddy Statement',
    missingDescription: 'Statements from people who witnessed your condition in service or can attest to your current symptoms.',
  },
  {
    id: 'post-service-records',
    name: 'Post-Service Medical Records',
    icon: <ClipboardList className="h-4 w-4" />,
    importance: 'recommended',
    checkFn: (cid, state) => state.checkedItems.includes('Post-service medical records') || state.hasMedicalVisits,
    actionPath: '/health/visits',
    actionLabel: 'Log Visits',
    missingDescription: 'Civilian medical records showing ongoing treatment help prove your condition is current and chronic.',
  },
  {
    id: 'symptom-logs',
    name: 'Symptom Documentation',
    icon: <Activity className="h-4 w-4" />,
    importance: 'helpful',
    checkFn: (cid, state) => state.hasSymptomLogs,
    actionPath: '/health/symptoms',
    actionLabel: 'Log Symptoms',
    missingDescription: 'Regular symptom logs strengthen your case by showing frequency, severity, and impact on daily life.',
  },
  {
    id: 'medications',
    name: 'Medication Records',
    icon: <Shield className="h-4 w-4" />,
    importance: 'helpful',
    checkFn: (cid, state) => state.checkedItems.includes('Medication records') || state.hasMedications,
    actionPath: '/health/medications',
    actionLabel: 'Log Medications',
    missingDescription: 'Records of medications prescribed for this condition support the severity of your disability.',
  },
];

function getImportanceColor(importance: EvidenceRequirement['importance']) {
  switch (importance) {
    case 'critical': return { text: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20', badge: 'bg-destructive/10 text-destructive border-destructive/30' };
    case 'recommended': return { text: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20', badge: 'bg-gold/10 text-gold border-gold/30' };
    case 'helpful': return { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', badge: 'bg-primary/10 text-primary border-primary/30' };
  }
}

export function EvidenceGapAlert({ conditionId, conditionName }: {
  conditionId: string;
  conditionName: string;
}) {
  const navigate = useNavigate();
  const checkedItems = useAppStore((s) => s.conditionEvidenceChecks[conditionId] || []);
  const hasBuddyContacts = useAppStore((s) => s.buddyContacts.length > 0);
  const hasSymptomLogs = useAppStore((s) => s.symptoms.length > 0);
  const hasSleepLogs = useAppStore((s) => s.sleepEntries.length > 0);
  const hasMedicalVisits = useAppStore((s) => s.medicalVisits.length > 0);
  const hasMedications = useAppStore((s) => s.medications.length > 0);
  const hasUploadedDocs = useAppStore((s) => s.uploadedDocuments.length > 0);

  const state: AppState = useMemo(() => ({
    checkedItems,
    hasBuddyContacts,
    hasSymptomLogs,
    hasSleepLogs,
    hasMedicalVisits,
    hasMedications,
    hasUploadedDocs,
  }), [checkedItems, hasBuddyContacts, hasSymptomLogs, hasSleepLogs, hasMedicalVisits, hasMedications, hasUploadedDocs]);

  const analysis = useMemo(() => {
    const results = EVIDENCE_REQUIREMENTS.map(req => ({
      ...req,
      present: req.checkFn(conditionId, state),
    }));

    const present = results.filter(r => r.present);
    const missing = results.filter(r => !r.present);
    const criticalMissing = missing.filter(r => r.importance === 'critical');
    const recommendedMissing = missing.filter(r => r.importance === 'recommended');
    const helpfulMissing = missing.filter(r => r.importance === 'helpful');

    const score = Math.round((present.length / results.length) * 100);

    return {
      results,
      present,
      missing,
      criticalMissing,
      recommendedMissing,
      helpfulMissing,
      score,
    };
  }, [conditionId, state]);

  if (analysis.missing.length === 0) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="font-semibold text-sm text-success">Evidence looks strong</p>
              <p className="text-xs text-muted-foreground">All typical evidence items are marked as present for {conditionName}.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className={cn('h-4 w-4', analysis.criticalMissing.length > 0 ? 'text-destructive' : 'text-gold')} />
              Evidence Gap Analysis
            </CardTitle>
            <CardDescription className="mt-1">
              {analysis.criticalMissing.length > 0
                ? `${analysis.criticalMissing.length} critical item${analysis.criticalMissing.length > 1 ? 's' : ''} missing`
                : `${analysis.missing.length} recommended item${analysis.missing.length > 1 ? 's' : ''} could strengthen your claim`
              }
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{analysis.score}%</p>
            <p className="text-[10px] text-muted-foreground">Evidence Score</p>
          </div>
        </div>
        <Progress
          value={analysis.score}
          className={cn(
            'h-2 mt-2',
            analysis.score < 40 && '[&>div]:bg-destructive',
            analysis.score >= 40 && analysis.score < 70 && '[&>div]:bg-gold',
            analysis.score >= 70 && '[&>div]:bg-success',
          )}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Missing items grouped by importance */}
        {analysis.criticalMissing.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Critical — Typically Required</p>
            {analysis.criticalMissing.map(item => {
              const colors = getImportanceColor(item.importance);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.actionPath)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left',
                    colors.bg, colors.border, 'hover:opacity-80'
                  )}
                >
                  <span className={cn('mt-0.5 shrink-0', colors.text)}>{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <Badge variant="outline" className={cn('text-[10px]', colors.badge)}>Missing</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.missingDescription}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        )}

        {analysis.recommendedMissing.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gold uppercase tracking-wider">Recommended</p>
            {analysis.recommendedMissing.map(item => {
              const colors = getImportanceColor(item.importance);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.actionPath)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left',
                    colors.bg, colors.border, 'hover:opacity-80'
                  )}
                >
                  <span className={cn('mt-0.5 shrink-0', colors.text)}>{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <Badge variant="outline" className={cn('text-[10px]', colors.badge)}>Missing</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.missingDescription}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        )}

        {analysis.helpfulMissing.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Helpful</p>
            {analysis.helpfulMissing.map(item => {
              const colors = getImportanceColor(item.importance);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.actionPath)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left',
                    colors.bg, colors.border, 'hover:opacity-80'
                  )}
                >
                  <span className={cn('mt-0.5 shrink-0', colors.text)}>{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{item.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.missingDescription}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        )}

        {/* Present items collapsed */}
        {analysis.present.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">Present</p>
            <div className="flex flex-wrap gap-2">
              {analysis.present.map(item => (
                <Badge key={item.id} variant="outline" className="text-xs bg-success/5 text-success border-success/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
