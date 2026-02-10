import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Target,
  FileText,
  Users,
  Stethoscope,
  Calendar,
  Activity,
  Brain,
  Shield,
  Clock,
  TrendingUp,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface GuidanceNudge {
  id: string;
  type: 'action' | 'tip' | 'warning' | 'milestone';
  priority: number; // 1-5, higher = more important
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
  condition: string; // For display purposes
}

interface ContextualGuidanceProps {
  onOpenAddCondition?: () => void;
}

export function ContextualGuidance({ onOpenAddCondition }: ContextualGuidanceProps) {
  const { data } = useClaims();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const nudges = useMemo((): GuidanceNudge[] => {
    const result: GuidanceNudge[] = [];

    // === HIGH PRIORITY NUDGES ===

    // No conditions added - most critical
    if ((data.claimConditions?.length || 0) === 0) {
      result.push({
        id: 'no-conditions',
        type: 'action',
        priority: 5,
        icon: <Target className="h-5 w-5" />,
        title: 'Start Building Your Claim',
        message: 'Add the conditions you\'re claiming. This is the foundation of your VA claim - everything else links to your conditions.',
        action: { label: 'Add Condition', href: '#add-condition' },
        condition: 'No conditions added',
      });
    }

    // Has conditions but no medical evidence
    if ((data.claimConditions?.length || 0) > 0 && data.medicalVisits.length === 0) {
      result.push({
        id: 'conditions-no-medical',
        type: 'warning',
        priority: 5,
        icon: <Stethoscope className="h-5 w-5" />,
        title: 'Document Your Medical History',
        message: `You're claiming ${data.claimConditions?.length} condition${data.claimConditions?.length !== 1 ? 's' : ''}, but haven't logged any medical visits. The VA needs to see in-service treatment records.`,
        action: { label: 'Log Medical Visits', href: '/medical-visits' },
        condition: 'Conditions without medical evidence',
      });
    }

    // No service history
    if (data.serviceHistory.length === 0) {
      result.push({
        id: 'no-service-history',
        type: 'action',
        priority: 4,
        icon: <Shield className="h-5 w-5" />,
        title: 'Add Your Service History',
        message: 'Your service assignments, duties, and locations help establish where and how you were exposed to conditions.',
        action: { label: 'Add Service History', href: '/service-history' },
        condition: 'Missing service history',
      });
    }

    // === CONDITION-SPECIFIC NUDGES ===

    // Has PTSD-related condition but no stressor documentation
    const hasPtsdCondition = data.claimConditions?.some(c => 
      c.name.toLowerCase().includes('ptsd') || 
      c.name.toLowerCase().includes('anxiety') ||
      c.name.toLowerCase().includes('depression')
    );
    if (hasPtsdCondition && (data.ptsdSymptoms?.length || 0) === 0) {
      result.push({
        id: 'ptsd-no-symptoms',
        type: 'action',
        priority: 4,
        icon: <Brain className="h-5 w-5" />,
        title: 'Track Your PTSD Symptoms',
        message: 'PTSD claims require documented symptoms matching 38 CFR 4.130 criteria. Regular symptom logging strengthens your case.',
        action: { label: 'Log PTSD Symptoms', href: '/symptoms' },
        condition: 'PTSD claimed without symptom tracking',
      });
    }

    // Has sleep apnea but no sleep entries
    const hasSleepApnea = data.claimConditions?.some(c => 
      c.name.toLowerCase().includes('sleep apnea')
    );
    if (hasSleepApnea && (data.sleepEntries?.length || 0) === 0) {
      result.push({
        id: 'sleep-apnea-no-tracking',
        type: 'action',
        priority: 4,
        icon: <Activity className="h-5 w-5" />,
        title: 'Track Your Sleep',
        message: 'Sleep apnea claims benefit from CPAP usage logs and sleep quality tracking. The VA looks at treatment compliance.',
        action: { label: 'Log Sleep', href: '/sleep' },
        condition: 'Sleep apnea without sleep tracking',
      });
    }

    // Has migraines condition but no migraine entries
    const hasMigraines = data.claimConditions?.some(c => 
      c.name.toLowerCase().includes('migraine') ||
      c.name.toLowerCase().includes('headache')
    );
    if (hasMigraines && data.migraines.length === 0) {
      result.push({
        id: 'migraines-no-tracking',
        type: 'action',
        priority: 4,
        icon: <Activity className="h-5 w-5" />,
        title: 'Log Your Migraines',
        message: 'Migraine ratings depend on frequency and severity. Track each episode to show prostrating attacks.',
        action: { label: 'Log Migraines', href: '/migraines' },
        condition: 'Migraines claimed without tracking',
      });
    }

    // === EVIDENCE GAP NUDGES ===

    // Conditions with weak evidence
    const weakConditions = data.claimConditions?.filter(c => {
      const score = (c.linkedMedicalVisits.length > 0 ? 25 : 0) +
                   (c.linkedSymptoms.length > 0 ? 25 : 0);
      return score < 50;
    }) || [];
    
    if (weakConditions.length > 0 && (data.claimConditions?.length || 0) > 0) {
      const conditionNames = weakConditions.slice(0, 2).map(c => c.name).join(' & ');
      result.push({
        id: 'weak-evidence',
        type: 'warning',
        priority: 4,
        icon: <AlertTriangle className="h-5 w-5" />,
        title: 'Strengthen Your Evidence',
        message: `${conditionNames} need${weakConditions.length === 1 ? 's' : ''} more linked evidence. Expand each condition card to link medical visits and symptoms.`,
        action: { label: 'Review Conditions', href: '/claims' },
        condition: 'Low evidence strength',
      });
    }

    // Has medical visits but no symptoms
    if (data.medicalVisits.length > 0 && data.symptoms.length === 0) {
      result.push({
        id: 'visits-no-symptoms',
        type: 'tip',
        priority: 3,
        icon: <Activity className="h-5 w-5" />,
        title: 'Start a Symptom Journal',
        message: 'Regular symptom tracking shows the VA how your conditions affect daily life. Even 1-2 entries per week helps.',
        action: { label: 'Track Symptoms', href: '/symptoms' },
        condition: 'Medical visits without symptom tracking',
      });
    }

    // No buddy contacts
    if (data.buddyContacts.length === 0 && (data.claimConditions?.length || 0) > 0) {
      result.push({
        id: 'no-buddies',
        type: 'tip',
        priority: 3,
        icon: <Users className="h-5 w-5" />,
        title: 'Add Witness Contacts',
        message: 'Fellow service members who witnessed your condition can provide powerful supporting statements.',
        action: { label: 'Add Buddy Contacts', href: '/buddy-statements' },
        condition: 'No buddy contacts',
      });
    }

    // Buddy contacts not requested
    const unrequestedBuddies = data.buddyContacts.filter(b => b.statementStatus === 'Not Requested').length;
    if (unrequestedBuddies > 0) {
      result.push({
        id: 'buddies-not-requested',
        type: 'action',
        priority: 3,
        icon: <Users className="h-5 w-5" />,
        title: 'Request Buddy Statements',
        message: `You have ${unrequestedBuddies} contact${unrequestedBuddies > 1 ? 's' : ''} who could provide statements. Use the Buddy Statement Generator in Tools.`,
        action: { label: 'View Contacts', href: '/buddy-statements' },
        condition: 'Pending buddy requests',
      });
    }

    // === TIMELINE NUDGES ===

    // BDD window approaching
    if (data.separationDate) {
      const sepDate = new Date(data.separationDate);
      const today = new Date();
      const daysUntilSep = Math.ceil((sepDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilSep > 90 && daysUntilSep <= 180) {
        result.push({
          id: 'bdd-window',
          type: 'milestone',
          priority: 5,
          icon: <Clock className="h-5 w-5" />,
          title: 'You\'re in the BDD Window!',
          message: `Only ${daysUntilSep} days until separation. Filing now means faster processing and potential back pay from day 1.`,
          action: { label: 'View Checklist', href: '/claim-checklist' },
          condition: 'BDD window active',
        });
      } else if (daysUntilSep > 0 && daysUntilSep <= 90) {
        result.push({
          id: 'bdd-closing',
          type: 'warning',
          priority: 5,
          icon: <AlertTriangle className="h-5 w-5" />,
          title: 'BDD Window Closing Soon',
          message: `Only ${daysUntilSep} days left to file before separation. After this, you'll need to file a standard claim.`,
          action: { label: 'Start Filing', href: '/claim-checklist' },
          condition: 'BDD window closing',
        });
      }
    }

    // No Intent to File
    const hasItf = data.deadlines?.some(d => d.type === 'intent_to_file') || false;
    if (!hasItf && (data.claimConditions?.length || 0) > 0) {
      result.push({
        id: 'no-itf',
        type: 'action',
        priority: 4,
        icon: <Calendar className="h-5 w-5" />,
        title: 'File an Intent to File',
        message: 'Protect your effective date! Filing an ITF locks in your start date for back pay calculations.',
        action: { label: 'Learn More', href: '/settings/itf' },
        condition: 'No Intent to File',
      });
    }

    // === PROGRESS NUDGES ===

    // Good progress celebration
    const totalEvidence = data.medicalVisits.length + data.symptoms.length + data.exposures.length;
    if (totalEvidence >= 10 && (data.claimConditions?.length || 0) >= 2) {
      const hasStrongEvidence = data.claimConditions?.every(c => 
        c.linkedMedicalVisits.length > 0 || c.linkedSymptoms.length > 0
      );
      if (hasStrongEvidence) {
        result.push({
          id: 'strong-progress',
          type: 'milestone',
          priority: 2,
          icon: <TrendingUp className="h-5 w-5" />,
          title: 'Great Progress!',
          message: 'Your evidence is building nicely. Consider preparing for your C&P exam and reviewing your claim checklist.',
          action: { label: 'Prep for Exam', href: '/exam-prep' },
          condition: 'Strong evidence base',
        });
      }
    }

    // Sort by priority
    return result.sort((a, b) => b.priority - a.priority);
  }, [data]);

  const visibleNudges = nudges.filter(n => !dismissedIds.includes(n.id)).slice(0, 3);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
  };

  if (visibleNudges.length === 0) return null;

  const typeStyles = {
    action: 'bg-primary/10 border-primary/30 text-primary',
    tip: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    milestone: 'bg-success/10 border-success/30 text-success',
  };

  const iconBgStyles = {
    action: 'bg-primary/20 text-primary',
    tip: 'bg-blue-500/20 text-blue-500',
    warning: 'bg-warning/20 text-warning',
    milestone: 'bg-success/20 text-success',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Smart Guidance</h3>
        <Badge variant="secondary" className="text-xs">
          {visibleNudges.length} {visibleNudges.length === 1 ? 'tip' : 'tips'}
        </Badge>
      </div>

      <div className="space-y-2">
        {visibleNudges.map((nudge) => (
          <Card
            key={nudge.id}
            className={cn(
              "relative overflow-hidden border",
              typeStyles[nudge.type]
            )}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 p-2 rounded-lg",
                  iconBgStyles[nudge.type]
                )}>
                  {nudge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm text-foreground">
                      {nudge.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleDismiss(nudge.id)}
                      aria-label="Dismiss tip"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {nudge.message}
                  </p>
                  {nudge.action && (
                    nudge.action.href === '#add-condition' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-0 mt-2 gap-1",
                          "text-primary hover:text-primary"
                        )}
                        onClick={() => onOpenAddCondition?.()}
                      >
                        {nudge.action.label}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Link to={nudge.action.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-7 px-0 mt-2 gap-1",
                            nudge.type === 'action' && "text-primary hover:text-primary",
                            nudge.type === 'tip' && "text-blue-500 hover:text-blue-500",
                            nudge.type === 'warning' && "text-warning hover:text-warning",
                            nudge.type === 'milestone' && "text-success hover:text-success"
                          )}
                        >
                          {nudge.action.label}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {nudges.length > 3 && visibleNudges.length < nudges.length && (
        <p className="text-xs text-muted-foreground text-center">
          +{nudges.length - visibleNudges.length} more tips available
        </p>
      )}
    </div>
  );
}
