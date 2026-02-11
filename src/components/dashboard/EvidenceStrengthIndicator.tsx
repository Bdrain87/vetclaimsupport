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
import { calculateEvidenceStrength, getStrengthLevel } from './EvidenceStrengthIndicator.utils';

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

export function EvidenceStrengthIndicator({ condition, data, compact = false }: EvidenceStrengthIndicatorProps) {
  const strength = calculateEvidenceStrength(condition, data);
  const level = getStrengthLevel(strength.score);

  const categories: EvidenceCategory[] = [
    {
      key: 'symptoms',
      label: 'Add symptom logs',
      shortLabel: 'Symptoms',
      icon: Activity,
      link: '/health/symptoms',
      hasEvidence: strength.hasSymptoms,
      count: condition.linkedSymptoms.length,
    },
    {
      key: 'medical',
      label: 'Add medical visit',
      shortLabel: 'Medical Visits',
      icon: Stethoscope,
      link: '/health/visits',
      hasEvidence: strength.hasMedicalVisits,
      count: condition.linkedMedicalVisits.length,
    },
    {
      key: 'medications',
      label: 'Log medications',
      shortLabel: 'Medications',
      icon: Pill,
      link: '/health/medications',
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
      link: '/prep/buddy-statement',
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
