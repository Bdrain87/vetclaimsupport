import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useMemo } from 'react';

export function SymptomInsights() {
  const { data } = useClaims();

  const { totalCount, mostFrequent } = useMemo(() => {
    const symptoms = data.symptoms || [];
    
    if (symptoms.length === 0) {
      return { totalCount: 0, mostFrequent: null };
    }

    // Count symptom occurrences
    const symptomCounts: Record<string, number> = {};
    symptoms.forEach((s) => {
      symptomCounts[s.symptom] = (symptomCounts[s.symptom] || 0) + 1;
    });

    // Find most frequent
    const sorted = Object.entries(symptomCounts).sort(([, a], [, b]) => b - a);
    const topSymptom = sorted[0] ? { name: sorted[0][0], count: sorted[0][1] } : null;

    return {
      totalCount: symptoms.length,
      mostFrequent: topSymptom,
    };
  }, [data.symptoms]);

  if (totalCount === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/10">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Symptom Insights</p>
              <p className="text-xs text-muted-foreground">No symptoms logged yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/10">
            <Activity className="h-5 w-5 text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Symptom Insights</p>
            <p className="text-xs text-muted-foreground">
              You've logged <span className="font-medium text-foreground">{totalCount}</span> symptom{totalCount !== 1 ? 's' : ''}.
              {mostFrequent && (
                <> Most common: <span className="font-medium text-success">{mostFrequent.name}</span></>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
