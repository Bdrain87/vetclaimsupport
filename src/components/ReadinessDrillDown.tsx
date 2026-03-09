import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSentinel } from '@/hooks/useSentinel';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useProfileStore } from '@/store/useProfileStore';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Target, FileText, Stethoscope, Users, User } from 'lucide-react';

interface ReadinessItem {
  label: string;
  score: number;
  maxScore: number;
  route: string;
  icon: React.ElementType;
  tip: string;
}

export function ReadinessDrillDown({ onClose }: { onClose?: () => void }) {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();
  const { score } = useSentinel();

  const items = useMemo((): ReadinessItem[] => {
    const hasConditions = userConditions.length > 0;
    const conditionScore = Math.min(30, userConditions.length * 10);

    const medicalEntries = data.medicalVisits?.length || 0;
    const medScore = Math.min(25, medicalEntries * 5);

    const symptomEntries = data.symptoms?.length || 0;
    const symptomScore = Math.min(20, symptomEntries * 2);

    const hasBuddies = (data.buddyContacts?.length || 0) > 0;
    const hasStatements = (data.buddyContacts || []).some((b: Record<string, unknown>) => b.statement);
    const serviceScore = hasBuddies ? (hasStatements ? 15 : 8) : 0;

    const profileComplete = !!(profile.firstName && profile.branch && profile.mosCode);
    const hasServiceDates = !!(profile.serviceDates?.start);
    const profileScore = (profileComplete ? 6 : 0) + (hasServiceDates ? 4 : 0);

    return [
      {
        label: 'Conditions Added',
        score: conditionScore,
        maxScore: 30,
        route: '/claims',
        icon: Target,
        tip: hasConditions
          ? `${userConditions.length} condition${userConditions.length !== 1 ? 's' : ''} tracked. Add more to strengthen your claim.`
          : 'Add your conditions to start building your claim.',
      },
      {
        label: 'Medical Evidence',
        score: medScore,
        maxScore: 25,
        route: '/health/visits',
        icon: Stethoscope,
        tip: medicalEntries > 0
          ? `${medicalEntries} medical visit${medicalEntries !== 1 ? 's' : ''} logged. Keep adding treatment records.`
          : 'Log medical visits and treatment records to support your claim.',
      },
      {
        label: 'Symptom Documentation',
        score: symptomScore,
        maxScore: 20,
        route: '/health/symptoms',
        icon: FileText,
        tip: symptomEntries > 0
          ? `${symptomEntries} symptom log${symptomEntries !== 1 ? 's' : ''}. 30+ days of logging significantly strengthens evidence.`
          : 'Start logging symptoms daily — frequency and severity patterns are powerful evidence.',
      },
      {
        label: 'Supporting Statements',
        score: serviceScore,
        maxScore: 15,
        route: '/prep/buddy-statement',
        icon: Users,
        tip: hasBuddies
          ? (hasStatements ? 'Buddy statements collected.' : 'Buddy contacts added. Request their written statements.')
          : 'Add buddy contacts who can verify your condition and service connection.',
      },
      {
        label: 'Profile Complete',
        score: profileScore,
        maxScore: 10,
        route: '/settings/edit-profile',
        icon: User,
        tip: profileComplete
          ? (hasServiceDates ? 'Profile complete.' : 'Add your service dates to complete your profile.')
          : 'Complete your profile with branch, MOS, and service dates.',
      },
    ];
  }, [userConditions, data, profile]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Claim Readiness Breakdown</h3>
        <span className="text-xs text-muted-foreground">{score}/100</span>
      </div>

      {items.map((item) => {
        const pct = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
        const isDone = pct >= 100;
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            to={item.route}
            onClick={onClose}
            className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
          >
            <div className="mt-0.5">
              {isDone ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-gold" />
              ) : (
                <Icon className="h-4.5 w-4.5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.score}/{item.maxScore}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pct >= 100 ? '#22c55e' : pct >= 50 ? '#C5A55A' : '#ef4444',
                  }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.tip}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          </Link>
        );
      })}
    </motion.div>
  );
}
