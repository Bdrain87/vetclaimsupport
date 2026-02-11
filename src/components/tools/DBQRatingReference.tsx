import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Scale,
  FileText,
  MessageSquare,
  Link2,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
} from 'lucide-react';
import { getDBQCondition } from '@/data/dbqCriteria';

export function DBQRatingReference() {
  const { data } = useClaims();
  const claimConditions = useMemo(() => data.claimConditions ?? [], [data.claimConditions]);

  const conditionsWithCriteria = useMemo(() => {
    return claimConditions.map(condition => ({
      condition,
      dbq: getDBQCondition(condition.name),
    })).filter(c => c.dbq !== null);
  }, [claimConditions]);

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            VA Rating Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Scale className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Add conditions to your Claim Builder to see rating criteria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conditionsWithCriteria.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            VA Rating Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Info className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No matching DBQ criteria found for your conditions.
              Check the Reference section for the full disability database.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          VA Rating Criteria
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Official rating percentages based on 38 CFR Part 4
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditionsWithCriteria.map(({ condition, dbq }) => {
          if (!dbq) return null;

          return (
          <div key={condition.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{dbq.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Diagnostic Code: {dbq.diagnosticCode}
                  </p>
                </div>
                <Badge variant="outline">
                  {dbq.ratings.map(r => `${r.percentage}%`).join(' / ')}
                </Badge>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Rating Levels */}
              <div>
                <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Rating Criteria
                </h5>
                <div className="space-y-3">
                  {dbq.ratings.map((rating, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant="secondary"
                          className={
                            rating.percentage >= 50 ? 'bg-success/20 text-success' :
                            rating.percentage >= 30 ? 'bg-warning/20 text-warning' :
                            'bg-muted'
                          }
                        >
                          {rating.percentage}%
                        </Badge>
                        <Progress 
                          value={rating.percentage} 
                          className="flex-1 h-2"
                        />
                      </div>
                      <p className="text-sm text-foreground">{rating.criteria}</p>
                      {rating.keyEvidence.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Key Evidence:</p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {rating.keyEvidence.map((ev, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0 mt-0.5" />
                                {ev}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Tips */}
              {dbq.examTips.length > 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="tips">
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Exam Tips ({dbq.examTips.length})
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {dbq.examTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {/* Secondary Conditions */}
              {dbq.secondaryConditions.length > 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="secondary">
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Common Secondary Conditions ({dbq.secondaryConditions.length})
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        {dbq.secondaryConditions.map((sec, idx) => (
                          <Badge key={idx} variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                            {sec}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        These conditions may be claimed as secondary if caused by your primary condition.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
          );
        })}

        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <Lightbulb className="h-3 w-3 inline text-primary" /> <strong className="text-foreground">Tip:</strong> The VA uses these criteria to
            determine your rating percentage. Document evidence that matches the higher rating levels.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
