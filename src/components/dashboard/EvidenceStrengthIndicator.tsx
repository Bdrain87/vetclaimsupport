import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Activity, 
  Stethoscope, 
  Pill, 
  Users,
  ChevronRight 
} from 'lucide-react';
import type { ClaimCondition, ClaimsData } from '@/types/claims';

interface EvidenceStrengthIndicatorProps {
  condition: ClaimCondition;
  data: ClaimsData;
  compact?: boolean;
}

interface EvidenceCategory {
  key: string;
  label: string;
  shortLabel: string;
  icon: typeof Stethoscope;
  link: string;
  hasEvidence: boolean;
  count: number;
}

export function calculateEvidenceStrength(condition: ClaimCondition, data: ClaimsData) {
  // Calculate based on: symptoms (25%), medical visits (25%), medications (25%), exposures (25%)
  let score = 0;
  
  const hasSymptoms = condition.linkedSymptoms.length > 0;
  const hasMedicalVisits = condition.linkedMedicalVisits.length > 0;
  const hasExposures = condition.linkedExposures.length > 0;
  const hasBuddyStatements = condition.linkedBuddyContacts.length > 0;
  
  // Check if there are medications that might relate to this condition
  const hasMedications = data.medications.some(med => 
    med.prescribedFor.toLowerCase().includes(condition.name.toLowerCase()) ||
    condition.name.toLowerCase().includes(med.prescribedFor.toLowerCase())
  );

  if (hasSymptoms) score += 25;
  if (hasMedicalVisits) score += 25;
  if (hasMedications || hasExposures) score += 25; // Combined: medications OR exposures/service connection
  if (hasBuddyStatements) score += 25;

  return {
    score,
    hasSymptoms,
    hasMedicalVisits,
    hasMedications,
    hasExposures,
    hasBuddyStatements,
  };
}

export function getStrengthLevel(score: number): { 
  label: string; 
  variant: 'destructive' | 'warning' | 'success';
  bgClass: string;
  textClass: string;
} {
  if (score >= 75) {
    return { 
      label: 'Strong', 
      variant: 'success',
      bgClass: 'bg-success/15',
      textClass: 'text-success',
    };
  }
  if (score >= 50) {
    return { 
      label: 'Building', 
      variant: 'warning',
      bgClass: 'bg-warning/15',
      textClass: 'text-warning',
    };
  }
  return { 
    label: 'Needs Work', 
    variant: 'destructive',
    bgClass: 'bg-destructive/15',
    textClass: 'text-destructive',
  };
}

export function EvidenceStrengthIndicator({ condition, data, compact = false }: EvidenceStrengthIndicatorProps) {
  const strength = calculateEvidenceStrength(condition, data);
  const level = getStrengthLevel(strength.score);

  const categories: EvidenceCategory[] = [
    {
      key: 'symptoms',
      label: 'Add symptom logs',
      shortLabel: 'Symptoms',
      icon: Activity,
      link: '/symptoms',
      hasEvidence: strength.hasSymptoms,
      count: condition.linkedSymptoms.length,
    },
    {
      key: 'medical',
      label: 'Add medical visit',
      shortLabel: 'Medical Visits',
      icon: Stethoscope,
      link: '/medical-visits',
      hasEvidence: strength.hasMedicalVisits,
      count: condition.linkedMedicalVisits.length,
    },
    {
      key: 'medications',
      label: 'Log medications',
      shortLabel: 'Medications',
      icon: Pill,
      link: '/medications',
      hasEvidence: strength.hasMedications,
      count: data.medications.filter(med => 
        med.prescribedFor.toLowerCase().includes(condition.name.toLowerCase())
      ).length,
    },
    {
      key: 'buddy',
      label: 'Add buddy statement',
      shortLabel: 'Buddy Statement',
      icon: Users,
      link: '/buddy-contacts',
      hasEvidence: strength.hasBuddyStatements,
      count: condition.linkedBuddyContacts.length,
    },
  ];

  const missingCategories = categories.filter(c => !c.hasEvidence);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={level.variant} className="text-[10px] px-2 py-0.5">
          {level.label}
        </Badge>
        <span className={`text-xs ${level.textClass}`}>{strength.score}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Strength Badge and Progress */}
      <div className="flex items-center gap-3">
        <Badge variant={level.variant} className="font-semibold">
          {level.label}
        </Badge>
        <div className="flex-1">
          <Progress 
            value={strength.score} 
            className={`h-2 ${level.bgClass}`}
          />
        </div>
        <span className={`text-sm font-medium ${level.textClass}`}>
          {strength.score}%
        </span>
      </div>

      {/* What's Missing Section */}
      {missingCategories.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            What's Missing:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingCategories.map((cat) => (
              <Link
                key={cat.key}
                to={cat.link}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <cat.icon className="h-3 w-3" />
                {cat.label}
                <ChevronRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Summary for completed items */}
      {categories.filter(c => c.hasEvidence).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c.hasEvidence).map((cat) => (
            <span 
              key={cat.key}
              className="inline-flex items-center gap-1 text-xs text-success"
            >
              <cat.icon className="h-3 w-3" />
              {cat.count} {cat.shortLabel}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
