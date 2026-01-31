import { useMemo, useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ClipboardList,
  FileText,
  FolderOpen,
  MessageSquare,
  Link2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { getConditionChecklist } from '@/data/conditionChecklists';

export function ConditionSpecificChecklist() {
  const { data } = useClaims();
  const claimConditions = data.claimConditions || [];
  const [expandedCondition, setExpandedCondition] = useState<string | null>(
    claimConditions[0]?.id || null
  );

  const conditionsWithChecklists = useMemo(() => {
    return claimConditions
      .map(condition => ({
        condition,
        checklist: getConditionChecklist(condition.name),
      }))
      .filter(c => c.checklist !== null);
  }, [claimConditions]);

  if (claimConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Condition-Specific Checklists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Add conditions to see tailored checklists with required forms and recommended evidence
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conditionsWithChecklists.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Condition-Specific Checklists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No specific checklists available for your conditions. Check the Reference section for general guidance.
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
          <ClipboardList className="h-5 w-5 text-primary" />
          Condition-Specific Checklists
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Tailored forms, evidence, and questions for each condition
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {conditionsWithChecklists.map(({ condition, checklist }) => {
          const isExpanded = expandedCondition === condition.id;

          return (
            <div key={condition.id} className="border rounded-lg overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-muted/30 flex items-center justify-between"
                onClick={() => setExpandedCondition(isExpanded ? null : condition.id)}
              >
                <div>
                  <h4 className="font-medium">{checklist!.name}</h4>
                  <p className="text-xs text-muted-foreground">DC {checklist!.diagnosticCode}</p>
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>

              {isExpanded && (
                <div className="border-t p-4">
                  <Tabs defaultValue="forms">
                    <TabsList className="w-full grid grid-cols-4">
                      <TabsTrigger value="forms" className="text-xs">
                        <FileText className="h-3 w-3 mr-1 hidden sm:inline" />
                        Forms
                      </TabsTrigger>
                      <TabsTrigger value="evidence" className="text-xs">
                        <FolderOpen className="h-3 w-3 mr-1 hidden sm:inline" />
                        Evidence
                      </TabsTrigger>
                      <TabsTrigger value="questions" className="text-xs">
                        <MessageSquare className="h-3 w-3 mr-1 hidden sm:inline" />
                        Exam
                      </TabsTrigger>
                      <TabsTrigger value="secondary" className="text-xs">
                        <Link2 className="h-3 w-3 mr-1 hidden sm:inline" />
                        Secondary
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="forms" className="mt-4 space-y-2">
                      {checklist!.requiredForms.map((form, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2">
                          <Checkbox id={`form-${condition.id}-${idx}`} />
                          <div className="flex-1">
                            <label
                              htmlFor={`form-${condition.id}-${idx}`}
                              className="text-sm cursor-pointer"
                            >
                              {form.item}
                              {form.required && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Required
                                </Badge>
                              )}
                            </label>
                            {form.description && (
                              <p className="text-xs text-muted-foreground">{form.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="evidence" className="mt-4 space-y-2">
                      {checklist!.recommendedEvidence.map((ev, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2">
                          <Checkbox id={`ev-${condition.id}-${idx}`} />
                          <div className="flex-1">
                            <label
                              htmlFor={`ev-${condition.id}-${idx}`}
                              className="text-sm cursor-pointer"
                            >
                              {ev.item}
                              {ev.required && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Important
                                </Badge>
                              )}
                            </label>
                            {ev.description && (
                              <p className="text-xs text-muted-foreground">{ev.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="questions" className="mt-4">
                      <ul className="space-y-2">
                        {checklist!.examQuestions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="secondary" className="mt-4 space-y-2">
                      {checklist!.secondaryConditions.map((sec, idx) => (
                        <div key={idx} className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                          <p className="font-medium text-sm text-purple-600">{sec.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{sec.connection}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>

                  {/* Tips */}
                  {checklist!.tips.length > 0 && (
                    <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        Pro Tips
                      </p>
                      <ul className="space-y-1">
                        {checklist!.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
