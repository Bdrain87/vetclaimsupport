import { useMemo } from 'react';
import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { ClaimCondition, ClaimsData } from '@/types/claims';

interface EvidenceRequirement {
  id: string;
  label: string;
  description: string;
  isCritical: boolean;
  check: (condition: ClaimCondition, data: ClaimsData) => { met: boolean; count?: number; required?: number };
}

// PTSD-specific evidence requirements
const ptsdRequirements: EvidenceRequirement[] = [
  {
    id: 'buddy_statements',
    label: 'Buddy Statements (2+ recommended)',
    description: 'Fellow service members who witnessed events or symptoms',
    isCritical: true,
    check: (condition, _data) => {
      const count = condition.linkedBuddyContacts.length;
      return { met: count >= 2, count, required: 2 };
    },
  },
  {
    id: 'medical_treatment',
    label: 'Medical Records Showing Treatment',
    description: 'Mental health visits, therapy records, or psychiatric evaluations',
    isCritical: true,
    check: (condition, data) => {
      const mentalHealthVisits = data.medicalVisits.filter(v => 
        condition.linkedMedicalVisits.includes(v.id) && 
        (v.visitType === 'Mental Health' || (v.reason ?? '').toLowerCase().includes('mental') || (v.reason ?? '').toLowerCase().includes('ptsd'))
      );
      return { met: mentalHealthVisits.length > 0, count: mentalHealthVisits.length };
    },
  },
  {
    id: 'stressor_statement',
    label: 'Stressor Statement',
    description: 'Detailed personal statement describing traumatic events',
    isCritical: true,
    check: (condition, _data) => {
      // Check for symptoms/notes that indicate stressor documentation
      const hasDetailedSymptoms = condition.linkedSymptoms.length > 0;
      const hasNotes = Boolean(condition.notes && condition.notes.length > 50);
      return { met: hasDetailedSymptoms || hasNotes };
    },
  },
  {
    id: 'symptom_logs',
    label: 'Symptom Logs',
    description: 'Regular documentation of PTSD symptoms and their impact',
    isCritical: false,
    check: (condition) => {
      const count = condition.linkedSymptoms.length;
      return { met: count >= 3, count, required: 3 };
    },
  },
  {
    id: 'medications',
    label: 'Medications for Mental Health',
    description: 'Prescriptions for anxiety, depression, or sleep related to PTSD',
    isCritical: false,
    check: (_condition, data) => {
      const relatedMeds = data.medications.filter(med =>
        (med.prescribedFor ?? '').toLowerCase().includes('ptsd') ||
        (med.prescribedFor ?? '').toLowerCase().includes('anxiety') ||
        (med.prescribedFor ?? '').toLowerCase().includes('depression') ||
        (med.prescribedFor ?? '').toLowerCase().includes('sleep')
      );
      return { met: relatedMeds.length > 0, count: relatedMeds.length };
    },
  },
];

// Physical condition evidence requirements
const physicalRequirements: EvidenceRequirement[] = [
  {
    id: 'medical_records',
    label: 'Medical Records',
    description: 'Documentation of diagnosis and treatment in service',
    isCritical: true,
    check: (condition) => {
      const count = condition.linkedMedicalVisits.length;
      return { met: count > 0, count };
    },
  },
  {
    id: 'doctor_summary',
    label: 'Doctor Summary',
    description: 'Medical opinion linking condition to service',
    isCritical: true,
    check: (_condition, data) => {
      // Check uploaded documents for doctor summaries / nexus letters
      const hasDoctorSummary = data.uploadedDocuments?.some(doc =>
        doc.documentType === 'nexus' ||
        doc.title.toLowerCase().includes('nexus') ||
        doc.title.toLowerCase().includes('doctor summar') ||
        doc.description?.toLowerCase().includes('nexus') ||
        doc.description?.toLowerCase().includes('doctor summar')
      );
      return { met: !!hasDoctorSummary };
    },
  },
  {
    id: 'buddy_statements',
    label: 'Buddy Statements',
    description: 'Witnesses who observed your condition or limitations',
    isCritical: false,
    check: (condition) => {
      const count = condition.linkedBuddyContacts.length;
      return { met: count >= 1, count, required: 1 };
    },
  },
  {
    id: 'symptom_logs',
    label: 'Symptom Logs',
    description: 'Regular documentation showing frequency and severity',
    isCritical: false,
    check: (condition) => {
      const count = condition.linkedSymptoms.length;
      return { met: count >= 3, count, required: 3 };
    },
  },
  {
    id: 'imaging',
    label: 'Imaging/X-rays (if applicable)',
    description: 'Diagnostic imaging supporting your condition',
    isCritical: false,
    check: (condition, data) => {
      // Check for imaging in medical visits or uploaded documents
      const hasImaging = data.medicalVisits.some(v =>
        condition.linkedMedicalVisits.includes(v.id) &&
        ((v.diagnosis ?? '').toLowerCase().includes('x-ray') ||
         (v.diagnosis ?? '').toLowerCase().includes('mri') ||
         (v.diagnosis ?? '').toLowerCase().includes('ct scan') ||
         (v.treatment ?? '').toLowerCase().includes('imaging'))
      );
      const hasUploadedImaging = data.uploadedDocuments?.some(doc =>
        doc.title.toLowerCase().includes('x-ray') ||
        doc.title.toLowerCase().includes('mri') ||
        doc.title.toLowerCase().includes('imaging') ||
        doc.title.toLowerCase().includes('radiology')
      );
      return { met: hasImaging || !!hasUploadedImaging };
    },
  },
  {
    id: 'service_connection',
    label: 'Service Connection Evidence',
    description: 'Exposures or incidents linking condition to service',
    isCritical: false,
    check: (condition) => {
      const count = condition.linkedExposures.length;
      return { met: count > 0, count };
    },
  },
];

// Hearing-related condition requirements
const hearingRequirements: EvidenceRequirement[] = [
  {
    id: 'audiogram',
    label: 'Audiogram/Hearing Test',
    description: 'Current hearing test results',
    isCritical: true,
    check: (_condition, data) => {
      const hasAudiogram = data.uploadedDocuments?.some(doc =>
        doc.title.toLowerCase().includes('audiogram') ||
        doc.title.toLowerCase().includes('hearing test')
      );
      return { met: !!hasAudiogram };
    },
  },
  {
    id: 'noise_exposure',
    label: 'Noise Exposure Documentation',
    description: 'Evidence of hazardous noise exposure during service',
    isCritical: true,
    check: (condition, data) => {
      const noiseExposures = data.exposures.filter(e => 
        condition.linkedExposures.includes(e.id) && e.type === 'Noise'
      );
      return { met: noiseExposures.length > 0, count: noiseExposures.length };
    },
  },
  {
    id: 'buddy_statements',
    label: 'Buddy Statements',
    description: 'Witnesses to noise exposure or hearing difficulties',
    isCritical: false,
    check: (condition) => {
      const count = condition.linkedBuddyContacts.length;
      return { met: count >= 1, count, required: 1 };
    },
  },
  {
    id: 'mos_evidence',
    label: 'Service Job Code Evidence',
    description: 'Job code showing noise-hazardous duties',
    isCritical: false,
    check: (_condition, data) => {
      const hasServiceHistory = data.serviceHistory.length > 0;
      return { met: hasServiceHistory };
    },
  },
];

function getConditionType(conditionName: string): 'ptsd' | 'hearing' | 'physical' {
  const lowerName = conditionName.toLowerCase();
  
  if (lowerName.includes('ptsd') || lowerName.includes('anxiety') || 
      lowerName.includes('depression') || lowerName.includes('mental health') ||
      lowerName.includes('mst') || lowerName.includes('trauma')) {
    return 'ptsd';
  }
  
  if (lowerName.includes('tinnitus') || lowerName.includes('hearing') ||
      lowerName.includes('ear')) {
    return 'hearing';
  }
  
  return 'physical';
}

function getRequirements(conditionType: 'ptsd' | 'hearing' | 'physical'): EvidenceRequirement[] {
  switch (conditionType) {
    case 'ptsd':
      return ptsdRequirements;
    case 'hearing':
      return hearingRequirements;
    default:
      return physicalRequirements;
  }
}

interface EvidenceGapAnalysisProps {
  condition: ClaimCondition;
  data: ClaimsData;
}

export function EvidenceGapAnalysis({ condition, data }: EvidenceGapAnalysisProps) {
  const analysis = useMemo(() => {
    const conditionType = getConditionType(condition.name);
    const requirements = getRequirements(conditionType);
    
    const results = requirements.map(req => ({
      ...req,
      result: req.check(condition, data),
    }));
    
    const metCount = results.filter(r => r.result.met).length;
    const totalCount = results.length;
    const score = Math.round((metCount / totalCount) * 100);
    
    const criticalMissing = results.filter(r => r.isCritical && !r.result.met);
    
    return { results, score, criticalMissing, conditionType };
  }, [condition, data]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressBg = (score: number) => {
    if (score >= 80) return 'bg-success/20';
    if (score >= 50) return 'bg-warning/20';
    return 'bg-destructive/20';
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-primary" />
          Evidence Gap Analysis
        </h5>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}%
          </span>
          <span className="text-xs text-muted-foreground">complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress
        value={analysis.score}
        className={`h-1.5 ${getProgressBg(analysis.score)}`}
        aria-label={`Evidence completeness: ${analysis.score}%`}
      />

      {/* Critical Missing Alert */}
      {analysis.criticalMissing.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-2" role="alert">
          <p className="text-xs font-medium text-destructive flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Missing Critical Evidence:
          </p>
          <ul className="mt-1 space-y-0.5">
            {analysis.criticalMissing.map(item => (
              <li key={item.id} className="text-xs text-destructive/80 ml-4">
                • {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Checklist */}
      <div className="space-y-1.5">
        {analysis.results.map(item => (
          <div 
            key={item.id}
            className={`flex items-start gap-2 p-1.5 rounded-md transition-colors ${
              !item.result.met && item.isCritical 
                ? 'bg-destructive/5' 
                : item.result.met 
                  ? 'bg-success/5' 
                  : ''
            }`}
          >
            {item.result.met ? (
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
            ) : (
              <Circle className={`h-4 w-4 shrink-0 mt-0.5 ${
                item.isCritical ? 'text-destructive' : 'text-muted-foreground'
              }`} />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${
                !item.result.met && item.isCritical 
                  ? 'text-destructive' 
                  : item.result.met 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
              }`}>
                {item.label}
                {item.isCritical && !item.result.met && (
                  <span className="ml-1 text-[9px] font-semibold text-destructive uppercase">
                    Critical
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.description}
                {item.result.count !== undefined && (
                  <span className="ml-1">
                    ({item.result.count}{item.result.required ? `/${item.result.required}` : ''})
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Condition Type Tag */}
      <div className="flex justify-end">
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
          {analysis.conditionType === 'ptsd' ? 'Mental Health' : analysis.conditionType} condition
        </span>
      </div>
    </div>
  );
}
