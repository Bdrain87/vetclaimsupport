import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Target,
  FileText,
  Stethoscope,
  Users,
  Activity,
  Shield,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface GuidedActionBannerProps {
  onOpenAddCondition?: () => void;
}

interface GuidedAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  priority: number;
}

export function GuidedActionBanner({ onOpenAddCondition }: GuidedActionBannerProps) {
  const { data } = useClaims();
  const navigate = useNavigate();

  const nextAction = useMemo((): GuidedAction | null => {
    const hasConditions = (data.claimConditions?.length || 0) > 0;
    const hasServiceHistory = data.serviceHistory.length > 0;
    const hasMedicalVisits = data.medicalVisits.length > 0;
    const hasSymptoms = data.symptoms.length > 0;
    const hasBuddyContacts = data.buddyContacts.length > 0;

    // Priority order of actions
    if (!hasConditions) {
      return {
        id: 'add-condition',
        icon: <Target className="h-5 w-5" />,
        label: 'Add Your First Condition',
        description: 'Start by telling us what you\'re claiming',
        href: '#add-condition', // Special href to trigger modal
        priority: 1,
      };
    }

    if (!hasServiceHistory) {
      return {
        id: 'add-service',
        icon: <Shield className="h-5 w-5" />,
        label: 'Document Your Service',
        description: 'Add assignments, bases, and duties',
        href: '/service-history',
        priority: 2,
      };
    }

    if (!hasMedicalVisits) {
      return {
        id: 'add-medical',
        icon: <Stethoscope className="h-5 w-5" />,
        label: 'Log Medical Visits',
        description: 'Document in-service treatment',
        href: '/medical-visits',
        priority: 3,
      };
    }

    if (!hasSymptoms) {
      return {
        id: 'add-symptoms',
        icon: <Activity className="h-5 w-5" />,
        label: 'Start Symptom Journal',
        description: 'Track how conditions affect you',
        href: '/symptoms',
        priority: 4,
      };
    }

    if (!hasBuddyContacts) {
      return {
        id: 'add-buddy',
        icon: <Users className="h-5 w-5" />,
        label: 'Add Witness Contacts',
        description: 'Get buddy statements to support your claim',
        href: '/buddy-statements',
        priority: 5,
      };
    }

    // Check if conditions need more evidence
    const weakConditions = data.claimConditions?.filter(c => {
      const hasLinkedEvidence = c.linkedMedicalVisits.length > 0 || c.linkedSymptoms.length > 0;
      return !hasLinkedEvidence;
    }) || [];

    if (weakConditions.length > 0) {
      return {
        id: 'link-evidence',
        icon: <FileText className="h-5 w-5" />,
        label: 'Link Evidence to Conditions',
        description: `${weakConditions.length} condition${weakConditions.length > 1 ? 's need' : ' needs'} more evidence`,
        href: '/',
        priority: 6,
      };
    }

    // All basics complete
    return null;
  }, [data]);

  // If all core actions complete, don't show banner
  if (!nextAction) {
    return null;
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5",
      "border border-primary/30",
      "p-4"
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex items-center gap-4">
        <div className="flex-shrink-0 p-3 rounded-xl bg-primary/20 text-primary">
          {nextAction.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">Next Step</span>
          </div>
          <h3 className="font-semibold text-foreground truncate">
            {nextAction.label}
          </h3>
          <p className="text-xs text-muted-foreground">
            {nextAction.description}
          </p>
        </div>

        {nextAction.href === '#add-condition' ? (
          <Button 
            size="sm" 
            className="gap-1 flex-shrink-0"
            onClick={() => onOpenAddCondition?.()}
          >
            Go
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Link to={nextAction.href} className="flex-shrink-0">
            <Button size="sm" className="gap-1">
              Go
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
