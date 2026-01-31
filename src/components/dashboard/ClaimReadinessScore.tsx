import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';

interface ReadinessCriteria {
  id: string;
  label: string;
  met: boolean;
  weight: number;
  tip: string;
}

export function ClaimReadinessScore() {
  const { data } = useClaims();

  const criteria: ReadinessCriteria[] = [
    {
      id: 'separation-date',
      label: 'Separation date set',
      met: !!data.separationDate,
      weight: 20,
      tip: 'Set your separation date for BDD timeline tracking',
    },
    {
      id: 'medical-visits',
      label: 'At least 3 medical visits logged',
      met: data.medicalVisits.length >= 3,
      weight: 20,
      tip: `Log ${Math.max(0, 3 - data.medicalVisits.length)} more medical visits`,
    },
    {
      id: 'symptoms',
      label: 'At least 2 symptoms documented',
      met: data.symptoms.length >= 2,
      weight: 20,
      tip: `Document ${Math.max(0, 2 - data.symptoms.length)} more symptoms`,
    },
    {
      id: 'exposures',
      label: 'At least 1 exposure logged',
      met: data.exposures.length >= 1,
      weight: 20,
      tip: 'Log any hazardous exposures during service',
    },
    {
      id: 'buddy-contact',
      label: 'At least 1 buddy contact added',
      met: data.buddyContacts.length >= 1,
      weight: 20,
      tip: 'Add a buddy who can provide a supporting statement',
    },
  ];

  const totalScore = criteria.reduce(
    (acc, criterion) => acc + (criterion.met ? criterion.weight : 0),
    0
  );

  const missingCriteria = criteria.filter(c => !c.met);

  // SVG circle parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (totalScore / 100) * circumference;

  const getScoreColor = () => {
    if (totalScore >= 80) return 'text-success';
    if (totalScore >= 60) return 'text-primary';
    if (totalScore >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getStrokeColor = () => {
    if (totalScore >= 80) return 'stroke-success';
    if (totalScore >= 60) return 'stroke-primary';
    if (totalScore >= 40) return 'stroke-warning';
    return 'stroke-destructive';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          Claim Readiness Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Progress */}
          <div className="relative flex-shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                className="stroke-muted"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                className={`${getStrokeColor()} transition-all duration-500`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor()}`}>
                {totalScore}%
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex-1 space-y-2">
            {criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-center gap-2 text-sm"
              >
                {criterion.met ? (
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span
                  className={criterion.met ? 'text-muted-foreground' : 'text-foreground'}
                >
                  {criterion.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips for improvement */}
        {missingCriteria.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Next step to improve your score:
            </p>
            <p className="text-sm text-foreground">
              {missingCriteria[0].tip}
            </p>
          </div>
        )}

        {totalScore === 100 && (
          <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/30 text-center">
            <p className="text-sm text-success font-medium">
              🎉 Your claim documentation is comprehensive!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
