import { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClaims } from '@/context/ClaimsContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecondaryCondition {
  condition: string;
  connection: string;
  typicalRating: string;
}

interface DisabilitySuggestion {
  condition: string;
  category: string;
  evidenceStrength: 'Strong' | 'Moderate' | 'Needs More Evidence';
  reasoning: string;
  supportingEvidence: string[];
  additionalEvidence: string[];
  typicalRating: string;
  secondaryConditions?: SecondaryCondition[];
}

interface AnalysisResult {
  suggestions: DisabilitySuggestion[];
  overallAssessment: string;
  priorityActions: string[];
}

export function SuggestedDisabilities() {
  const { data } = useClaims();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const hasEnoughData = 
    data.medicalVisits.length > 0 || 
    data.exposures.length > 0 || 
    data.symptoms.length > 0 ||
    data.medications.length > 0 ||
    data.serviceHistory.length > 0;

  const analyzeData = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data: responseData, error: invokeError } = await supabase.functions.invoke('analyze-disabilities', {
        body: { 
          userData: {
            medicalVisits: data.medicalVisits,
            exposures: data.exposures,
            symptoms: data.symptoms,
            medications: data.medications,
            serviceHistory: data.serviceHistory,
          }
        }
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      setResult(responseData);
      toast({
        title: 'Analysis Complete',
        description: `Found ${responseData.suggestions?.length || 0} potential disabilities based on your evidence.`,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze data';
      setError(errorMessage);
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'bg-success/10 text-success border-success/20';
      case 'Moderate': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'Strong': return <CheckCircle2 className="h-4 w-4" />;
      case 'Moderate': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Primary': return 'bg-primary/10 text-primary';
      case 'Secondary': return 'bg-purple-500/10 text-purple-500';
      case 'PACT Act Presumptive': return 'bg-exposure/10 text-exposure';
      case 'Mental Health': return 'bg-symptoms/10 text-symptoms';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Conditions Worth Exploring
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Based on your entries, these are conditions other veterans have researched. This is NOT a diagnosis or medical opinion - it's simply a starting point for your own research. Many factors affect VA claims. Discuss any health concerns with your healthcare provider and claims questions with a VSO or VA-accredited attorney.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasEnoughData ? (
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Add some data to your tracker first (medical visits, exposures, symptoms, etc.) 
              to get AI-powered disability suggestions.
            </p>
          </div>
        ) : !result ? (
          <div className="text-center py-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Analyze your documented evidence to discover potential VA disabilities you may qualify for.
            </p>
            <Button onClick={analyzeData} disabled={isAnalyzing} className="gap-2">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing your evidence...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze My Evidence
                </>
              )}
            </Button>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Assessment */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Overall Assessment</h4>
              <p className="text-sm text-muted-foreground">{result.overallAssessment}</p>
            </div>

            {/* Priority Actions */}
            {result.priorityActions && result.priorityActions.length > 0 && (
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <h4 className="font-medium text-warning mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Priority Actions
                </h4>
                <ul className="space-y-1 text-sm text-foreground/80">
                  {result.priorityActions.map((action, idx) => (
                    <li key={idx}>• {action}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conditions to Research */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">
                Conditions to Research ({result.suggestions?.length || 0})
              </h4>
              {result.suggestions?.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  className="border rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleExpanded(idx)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStrengthColor(suggestion.evidenceStrength)}`}>
                        {getStrengthIcon(suggestion.evidenceStrength)}
                        {suggestion.evidenceStrength}
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">{suggestion.condition}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getCategoryColor(suggestion.category)}>
                            {suggestion.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Typical: {suggestion.typicalRating}
                          </span>
                        </div>
                      </div>
                    </div>
                    {expandedItems.has(idx) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  {expandedItems.has(idx) && (
                    <div className="p-3 border-t bg-muted/10 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Why You May Qualify</p>
                        <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                      </div>
                      
                      {suggestion.supportingEvidence && suggestion.supportingEvidence.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-success mb-1 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Your Supporting Evidence
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {suggestion.supportingEvidence.map((evidence, i) => (
                              <li key={i}>• {evidence}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {suggestion.additionalEvidence && suggestion.additionalEvidence.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-warning mb-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Evidence to Strengthen Claim
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {suggestion.additionalEvidence.map((evidence, i) => (
                              <li key={i}>• {evidence}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {suggestion.secondaryConditions && suggestion.secondaryConditions.length > 0 && (
                        <div className="mt-3 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                          <p className="text-sm font-medium text-purple-500 mb-2 flex items-center gap-1">
                            <Link2 className="h-3 w-3" />
                            Common Secondary Conditions
                          </p>
                          <div className="space-y-2">
                            {suggestion.secondaryConditions.map((secondary, i) => (
                              <div key={i} className="text-sm border-l-2 border-purple-500/30 pl-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-foreground">{secondary.condition}</span>
                                  <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                                    {secondary.typicalRating}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{secondary.connection}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            Secondary conditions can be claimed if caused or aggravated by your primary service-connected disability.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Re-analyze button */}
            <div className="pt-4 border-t">
              <Button onClick={analyzeData} variant="outline" disabled={isAnalyzing} className="w-full gap-2">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Re-analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Re-analyze with Updated Data
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
