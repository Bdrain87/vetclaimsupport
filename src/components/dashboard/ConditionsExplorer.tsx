import { useState } from 'react';
import { AIDisclaimer } from '@/components/ui/AIDisclaimer';
import {
  Target,
  Sparkles,
  Link2,
  Loader2,
  Brain,
  Ear,
  Moon,
  Bone,
  Flame,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClaims } from '@/hooks/useClaims';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { secondaryConditions } from '@/data/secondaryConditions';
import { sanitizePHI } from '@/utils/phiSanitizer';

// Common VA disability conditions with icons
const COMMON_CONDITIONS = [
  { name: 'PTSD', icon: Brain, category: 'Mental Health' },
  { name: 'Tinnitus', icon: Ear, category: 'Hearing' },
  { name: 'Hearing Loss', icon: Ear, category: 'Hearing' },
  { name: 'Sleep Apnea', icon: Moon, category: 'Sleep' },
  { name: 'Migraines', icon: Brain, category: 'Neurological' },
  { name: 'Lower Back Pain', icon: Bone, category: 'Musculoskeletal' },
  { name: 'Knee Condition', icon: Bone, category: 'Musculoskeletal' },
  { name: 'Burn Pit Exposure', icon: Flame, category: 'Toxic Exposure' },
  { name: 'Anxiety', icon: Brain, category: 'Mental Health' },
  { name: 'Depression', icon: Brain, category: 'Mental Health' },
  { name: 'Neck Pain', icon: Bone, category: 'Musculoskeletal' },
  { name: 'Shoulder Condition', icon: Bone, category: 'Musculoskeletal' },
];

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

interface ConditionsExplorerProps {
  claimConditions: Array<{
    id: string;
    name: string;
    linkedMedicalVisits: string[];
    linkedExposures: string[];
    linkedSymptoms: string[];
    linkedDocuments: string[];
    linkedBuddyContacts: string[];
    notes: string;
    createdAt: string;
  }>;
  onAddCondition: (name: string) => void;
}

export function ConditionsExplorer({ claimConditions, onAddCondition }: ConditionsExplorerProps) {
  const { data } = useClaims();
  const { toast } = useToast();
  
  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [expandedTier, setExpandedTier] = useState<'evidence' | 'secondary' | 'common' | null>(null);
  const [expandedAISuggestion, setExpandedAISuggestion] = useState<number | null>(null);

  // Check if user has logged data for AI analysis
  const hasLoggedData = 
    data.medicalVisits.length > 0 || 
    data.exposures.length > 0 || 
    data.symptoms.length > 0 ||
    data.medications.length > 0 ||
    data.serviceHistory.length > 0;

  // Get secondary conditions based on claimed conditions
  const getSecondaryConditionsForClaims = () => {
    if (claimConditions.length === 0) return [];
    
    const secondaries: Array<{
      primaryCondition: string;
      secondaryCondition: string;
      medicalConnection: string;
    }> = [];
    
    claimConditions.forEach(claim => {
      const matching = secondaryConditions.filter(sc => 
        sc.primaryCondition.toLowerCase().includes(claim.name.toLowerCase()) ||
        claim.name.toLowerCase().includes(sc.primaryCondition.toLowerCase())
      );
      
      matching.forEach(m => {
        // Don't suggest conditions already being claimed
        if (!claimConditions.some(c => 
          c.name.toLowerCase() === m.secondaryCondition.toLowerCase()
        )) {
          // Avoid duplicates
          if (!secondaries.some(s => s.secondaryCondition === m.secondaryCondition)) {
            secondaries.push({
              primaryCondition: claim.name,
              secondaryCondition: m.secondaryCondition,
              medicalConnection: m.medicalConnection,
            });
          }
        }
      });
    });
    
    return secondaries.slice(0, 8); // Limit to 8 suggestions
  };

  // Filter common conditions not already tracked
  const availableCommonConditions = COMMON_CONDITIONS.filter(
    c => !claimConditions.some(cc => cc.name.toLowerCase() === c.name.toLowerCase())
  );

  const secondaryForClaims = getSecondaryConditionsForClaims();

  // AI Analysis function
  const analyzeEvidence = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const summaryParts = [
        `Medical visits: ${data.medicalVisits.map((v: { diagnosis?: string; treatment?: string }) => [v.diagnosis, v.treatment].filter(Boolean).join(' - ')).join('; ')}`,
        `Symptoms: ${data.symptoms.map((s: { name?: string; severity?: string }) => [s.name, s.severity].filter(Boolean).join(' ')).join('; ')}`,
        `Exposures: ${data.exposures.map((e: { type?: string }) => e.type).filter(Boolean).join('; ')}`,
        `Medications: ${data.medications.map((m: { name?: string }) => m.name).filter(Boolean).join('; ')}`,
      ];
      const rawPrompt = `You are an expert VA disability claims analyst. Based on the following veteran health evidence, suggest VA disabilities they may qualify for. Respond in JSON with a "suggestions" array where each has: condition, category, evidenceStrength (Strong/Moderate/Weak), reasoning, supportingEvidence (array), additionalEvidence (array), typicalRating. Also include overallAssessment and priorityActions.\n\n${summaryParts.join('\n')}`;
      const prompt = sanitizePHI(rawPrompt);

      const { data: responseData, error: invokeError } = await supabase.functions.invoke('analyze-disabilities', {
        body: { prompt }
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      // The edge function returns { analysis: "raw text" } — parse into structured format
      let parsed: AnalysisResult;
      if (responseData.suggestions) {
        parsed = responseData as AnalysisResult;
      } else if (responseData.analysis) {
        // Try to extract JSON from the raw AI response
        const text = responseData.analysis as string;
        let jsonParsed = false;
        try {
          const jsonMatch = text.match(/\{[\s\S]*"suggestions"[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]) as AnalysisResult;
            jsonParsed = true;
          }
        } catch { /* not JSON */ }
        if (!jsonParsed!) {
          // Fallback: display raw analysis as a single suggestion
          parsed = {
            suggestions: [{
              condition: 'AI Analysis Results',
              category: 'General',
              evidenceStrength: 'Moderate' as const,
              reasoning: text,
              supportingEvidence: [],
              additionalEvidence: [],
              typicalRating: 'See analysis',
            }],
            overallAssessment: text,
            priorityActions: [],
          };
        }
      } else {
        throw new Error('Unexpected response format');
      }

      setAnalysisResult(parsed!);
      setExpandedTier('evidence');
      toast({
        title: 'Analysis Complete',
        description: `Found ${parsed!.suggestions?.length || 0} conditions based on your evidence.`,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze data';
      setAnalysisError(errorMessage);
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddCondition = (name: string) => {
    if (claimConditions.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: 'Already tracking',
        description: `${name} is already in your conditions list`,
      });
      return;
    }
    onAddCondition(name);
    toast({
      title: 'Condition added',
      description: `${name} added — tap to link evidence`,
    });
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
      case 'Strong': return <CheckCircle2 className="h-3 w-3" />;
      case 'Moderate': return <AlertCircle className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  // Check if any tier has content
  const hasTier1 = hasLoggedData;
  const hasTier2 = secondaryForClaims.length > 0;
  const hasTier3 = availableCommonConditions.length > 0;

  if (!hasTier1 && !hasTier2 && !hasTier3) {
    return null; // Nothing to show
  }

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground">Conditions Worth Exploring</h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Discover conditions you may qualify for based on your evidence
        </p>
      </div>

      {/* Tier 1: Based on Your Evidence (AI-powered) */}
      {hasTier1 && (
        <div className={cn(
          "rounded-xl border overflow-hidden",
          "bg-card",
          expandedTier === 'evidence' ? "border-primary/30" : "border-border"
        )}>
          <button
            onClick={() => setExpandedTier(expandedTier === 'evidence' ? null : 'evidence')}
            className={cn(
              "w-full flex items-center justify-between",
              "p-3",
              "hover:bg-secondary transition-colors"
            )}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Based on Your Evidence</span>
              {analysisResult && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {analysisResult.suggestions?.length || 0} found
                </Badge>
              )}
            </div>
            {expandedTier === 'evidence' ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {expandedTier === 'evidence' && (
            <div className="p-3 pt-0 space-y-3 border-t border-border">
              {/* Legal Disclaimer */}
              <div className="p-2 bg-warning/5 border border-warning/20 rounded-lg">
                <p className="text-[10px] text-muted-foreground">
                  <strong className="text-foreground">Disclaimer:</strong> These are research suggestions based on your logged data, NOT medical diagnoses. Consult a healthcare provider and VSO.
                </p>
              </div>

              {!analysisResult ? (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Analyze your {data.medicalVisits.length} visits, {data.symptoms.length} symptoms, and {data.exposures.length} exposures
                  </p>
                  <Button onClick={analyzeEvidence} disabled={isAnalyzing} size="sm" className="gap-2">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Analyze My Evidence
                      </>
                    )}
                  </Button>
                  {analysisError && (
                    <p className="text-xs text-destructive mt-2">{analysisError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <AIDisclaimer variant="banner" />
                  {analysisResult.suggestions?.slice(0, 6).map((suggestion, idx) => (
                    <div 
                      key={idx}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <div 
                        className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/30"
                        onClick={() => setExpandedAISuggestion(expandedAISuggestion === idx ? null : idx)}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={cn(
                            "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border",
                            getStrengthColor(suggestion.evidenceStrength)
                          )}>
                            {getStrengthIcon(suggestion.evidenceStrength)}
                            <span className="hidden sm:inline">{suggestion.evidenceStrength}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">
                            {suggestion.condition}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-muted-foreground">
                            {suggestion.typicalRating}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCondition(suggestion.condition);
                            }}
                          >
                            + Add
                          </Button>
                        </div>
                      </div>
                      
                      {expandedAISuggestion === idx && (
                        <div className="px-2 pb-2 space-y-2 border-t border-border bg-muted/20">
                          <p className="text-xs text-muted-foreground pt-2">{suggestion.reasoning}</p>
                          {suggestion.supportingEvidence && suggestion.supportingEvidence.length > 0 && (
                            <div>
                              <p className="text-[10px] font-medium text-success flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Your Evidence
                              </p>
                              <ul className="text-[10px] text-muted-foreground pl-4">
                                {suggestion.supportingEvidence.slice(0, 3).map((e, i) => (
                                  <li key={i}>• {e}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    onClick={analyzeEvidence} 
                    variant="ghost" 
                    size="sm" 
                    disabled={isAnalyzing}
                    className="w-full text-xs gap-1"
                  >
                    {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    Re-analyze
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tier 2: Secondary to Your Claims */}
      {hasTier2 && (
        <div className={cn(
          "rounded-xl border overflow-hidden",
          "bg-card",
          expandedTier === 'secondary' ? "border-purple-500/30" : "border-border"
        )}>
          <button
            onClick={() => setExpandedTier(expandedTier === 'secondary' ? null : 'secondary')}
            className={cn(
              "w-full flex items-center justify-between",
              "p-3",
              "hover:bg-secondary transition-colors"
            )}
          >
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-foreground">Secondary to Your Claims</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-500/10 text-purple-500">
                {secondaryForClaims.length}
              </Badge>
            </div>
            {expandedTier === 'secondary' ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {expandedTier === 'secondary' && (
            <div className="p-3 pt-0 space-y-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground pt-2">
                These conditions are commonly linked to your claimed disabilities
              </p>
              {secondaryForClaims.map((secondary, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 border border-purple-500/20 rounded-lg bg-purple-500/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {secondary.secondaryCondition}
                    </p>
                    <p className="text-[10px] text-purple-500">
                      Secondary to: {secondary.primaryCondition}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs flex-shrink-0"
                    onClick={() => handleAddCondition(secondary.secondaryCondition)}
                  >
                    + Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tier 3: Common Conditions (Always show as fallback) */}
      {hasTier3 && (
        <div className={cn(
          "rounded-xl border overflow-hidden",
          "bg-card",
          expandedTier === 'common' ? "border-border" : "border-border"
        )}>
          <button
            onClick={() => setExpandedTier(expandedTier === 'common' ? null : 'common')}
            className={cn(
              "w-full flex items-center justify-between",
              "p-3",
              "hover:bg-secondary transition-colors"
            )}
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Common VA Conditions</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {availableCommonConditions.length}
              </Badge>
            </div>
            {expandedTier === 'common' ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {expandedTier === 'common' && (
            <div className="p-3 pt-0 border-t border-border">
              <p className="text-[10px] text-muted-foreground pt-2 mb-2">
                Commonly claimed service-connected conditions
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableCommonConditions.slice(0, 12).map((condition) => {
                  const IconComponent = condition.icon;
                  return (
                    <button
                      key={condition.name}
                      onClick={() => handleAddCondition(condition.name)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5",
                        "p-3 rounded-xl",
                        "bg-secondary border border-border",
                        "transition-all duration-200",
                        "hover:border-primary/30",
                        "active:scale-95",
                        "group"
                      )}
                    >
                      <IconComponent className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] sm:text-xs text-center text-foreground leading-tight group-hover:text-primary transition-colors">
                        {condition.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center italic">
        Tap any condition to add and start building evidence
      </p>
    </div>
  );
}
