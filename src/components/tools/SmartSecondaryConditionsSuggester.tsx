import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Link2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Search,
  Star,
  Lightbulb,
  FileText,
  Clock,
  Target,
  Pencil,
} from 'lucide-react';
import {
  secondaryConditions,
  type SecondaryConnection,
} from '@/data/secondaryConditions';

interface SuggestedSecondary extends SecondaryConnection {
  relevanceScore: number;
  userHasSymptoms: boolean;
  userHasMedication: boolean;
  actionableSteps: string[];
  firstPersonNarrative: string;
}

export function SmartSecondaryConditionsSuggester() {
  const { data } = useClaims();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const claimedConditions = useMemo(() => data.claimConditions?.map(c => c.name.toLowerCase()) ?? [], [data.claimConditions]);
  const userSymptoms = useMemo(() => data.symptoms?.map(s => s.symptom.toLowerCase()) ?? [], [data.symptoms]);
  const userMedications = useMemo(() => data.medications?.map(m => m.name.toLowerCase()) ?? [], [data.medications]);
  const userMedicalVisits = useMemo(() => data.medicalVisits ?? [], [data.medicalVisits]);

  // Get the earliest service date for narrative
  const earliestServiceDate = useMemo(() => {
    if (data.serviceHistory?.length > 0) {
      const dates = data.serviceHistory.map(s => new Date(s.startDate)).filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        return dates.sort((a, b) => a.getTime() - b.getTime())[0];
      }
    }
    return null;
  }, [data.serviceHistory]);

  // Smart suggestions based on user's claimed conditions
  const smartSuggestions = useMemo((): SuggestedSecondary[] => {
    if (claimedConditions.length === 0) return [];

    const suggestions: SuggestedSecondary[] = [];

    claimedConditions.forEach(claimedCondition => {
      // Find matching secondaries for this condition
      const matchingSecondaries = secondaryConditions.filter(sc => {
        const primaryLower = sc.primaryCondition.toLowerCase();
        return (
          claimedCondition.includes(primaryLower) ||
          primaryLower.includes(claimedCondition) ||
          // Handle common variations
          (claimedCondition.includes('back') && primaryLower.includes('lumbar')) ||
          (claimedCondition.includes('lumbar') && primaryLower.includes('back')) ||
          (claimedCondition.includes('ptsd') && primaryLower.includes('ptsd')) ||
          (claimedCondition.includes('knee') && primaryLower.includes('knee')) ||
          (claimedCondition.includes('tinnitus') && primaryLower.includes('tinnitus')) ||
          (claimedCondition.includes('sleep') && primaryLower.includes('sleep')) ||
          (claimedCondition.includes('migraine') && primaryLower.includes('migraine')) ||
          (claimedCondition.includes('diabetes') && primaryLower.includes('diabetes'))
        );
      });

      matchingSecondaries.forEach(secondary => {
        // Calculate relevance score
        let score = 50; // Base score for matching primary

        // Check if user already has symptoms related to this secondary
        const secondaryLower = secondary.secondaryCondition.toLowerCase();
        const hasRelatedSymptom = userSymptoms.some(s => 
          secondaryLower.includes(s) || s.includes(secondaryLower.split(' ')[0])
        );
        if (hasRelatedSymptom) score += 30;

        // Check if user is on medication that might indicate this condition
        const hasRelatedMed = userMedications.some(m => {
          // Common medication patterns
          if (secondaryLower.includes('hypertension') && (m.includes('lisinopril') || m.includes('metoprolol'))) return true;
          if (secondaryLower.includes('depression') && (m.includes('sertraline') || m.includes('prozac') || m.includes('lexapro'))) return true;
          if (secondaryLower.includes('anxiety') && (m.includes('xanax') || m.includes('buspar'))) return true;
          if (secondaryLower.includes('gerd') && (m.includes('omeprazole') || m.includes('pantoprazole'))) return true;
          if (secondaryLower.includes('sleep') && (m.includes('trazodone') || m.includes('ambien'))) return true;
          return false;
        });
        if (hasRelatedMed) score += 20;

        // Boost conditions that cross body systems (anti-pyramiding compliant)
        const primaryIsMental = secondary.primaryCondition.toLowerCase().includes('ptsd') ||
          secondary.primaryCondition.toLowerCase().includes('anxiety') ||
          secondary.primaryCondition.toLowerCase().includes('depression');
        const secondaryIsMental = secondary.category === 'Mental Health';
        if (primaryIsMental && !secondaryIsMental) score += 15;

        // Generate actionable steps
        const actionableSteps = generateActionableSteps(secondary, claimedCondition, userMedicalVisits);
        
        // Generate first-person narrative
        const narrative = generateFirstPersonNarrative(
          secondary, 
          claimedCondition, 
          earliestServiceDate,
          hasRelatedSymptom,
          hasRelatedMed
        );

        suggestions.push({
          ...secondary,
          relevanceScore: score,
          userHasSymptoms: hasRelatedSymptom,
          userHasMedication: hasRelatedMed,
          actionableSteps,
          firstPersonNarrative: narrative,
        });
      });
    });

    // Sort by relevance score
    return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [claimedConditions, userSymptoms, userMedications, userMedicalVisits, earliestServiceDate]);

  // Filter by search term
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return smartSuggestions;
    const lower = searchTerm.toLowerCase();
    return smartSuggestions.filter(s =>
      s.secondaryCondition.toLowerCase().includes(lower) ||
      s.primaryCondition.toLowerCase().includes(lower) ||
      s.category.toLowerCase().includes(lower)
    );
  }, [smartSuggestions, searchTerm]);

  const displayedSuggestions = showAll ? filteredSuggestions : filteredSuggestions.slice(0, 6);

  if (claimedConditions.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Smart Secondary Conditions Suggester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Link2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Add conditions to your Claim Builder to get personalized secondary condition suggestions.
            </p>
            <p className="text-sm text-muted-foreground">
              Secondary conditions can significantly increase your combined rating.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Anti-Pyramiding Notice */}
      <Alert className="border-warning/30 bg-warning/5">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertDescription>
          <strong>Anti-Pyramiding Rule (38 CFR 4.14):</strong> The VA cannot rate the same symptoms under 
          multiple conditions. Focus on secondaries that affect <span className="font-medium">different body systems</span>.
        </AlertDescription>
      </Alert>

      {/* Header Card */}
      <Card className="data-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Secondary Conditions for Your Claims
          </CardTitle>
          <CardDescription>
            Based on your {claimedConditions.length} claimed condition{claimedConditions.length !== 1 ? 's' : ''}, 
            here are secondary conditions you may qualify for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.claimConditions?.map(c => (
              <Badge key={c.id} variant="default" className="bg-primary/20 text-primary">
                {c.name}
              </Badge>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search secondary conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Found <span className="font-medium text-foreground">{filteredSuggestions.length}</span> potential 
            secondary conditions
          </p>
        </CardContent>
      </Card>

      {/* Suggestions List */}
      <div className="space-y-3">
        {displayedSuggestions.map((suggestion, idx) => (
          <Card 
            key={`${suggestion.primaryCondition}-${suggestion.secondaryCondition}-${idx}`}
            className={`data-card transition-all ${
              suggestion.relevanceScore >= 80 
                ? 'border-green-500/30 bg-green-500/5' 
                : suggestion.relevanceScore >= 60 
                  ? 'border-primary/30' 
                  : ''
            }`}
          >
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {suggestion.relevanceScore >= 80 && (
                  <Badge className="bg-green-500/20 text-green-700 dark:text-green-400">
                    <Star className="h-3 w-3 mr-1" />
                    High Match
                  </Badge>
                )}
                {suggestion.userHasSymptoms && (
                  <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    You've logged symptoms
                  </Badge>
                )}
                {suggestion.userHasMedication && (
                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-600 dark:text-purple-400">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Related medication
                  </Badge>
                )}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {suggestion.category}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{suggestion.primaryCondition}</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{suggestion.secondaryCondition}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                <span className="font-medium text-foreground/80">Medical Connection:</span>{' '}
                {suggestion.medicalConnection}
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="narrative" className="border-0">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Sample First-Person Statement</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm italic">
                      "{suggestion.firstPersonNarrative}"
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <Pencil className="h-3 w-3 inline text-muted-foreground" /> Customize this with your specific dates, symptoms, and experiences
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="actions" className="border-0">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-green-500" />
                      <span>Action Steps to Claim This</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {suggestion.actionableSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-500 font-medium">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuggestions.length > 6 && !showAll && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowAll(true)}
        >
          Show All {filteredSuggestions.length} Secondary Conditions
        </Button>
      )}

      {/* Pro Tip */}
      <Card className="data-card bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Pro Tip: Nexus Letters Are Key</p>
              <p className="text-muted-foreground">
                For secondary claims, you need a doctor's nexus letter stating the connection 
                is "at least as likely as not" (50% or greater probability). Use the Nexus Letter 
                Generator in Claim Tools to create a template for your doctor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function generateActionableSteps(
  secondary: SecondaryConnection, 
  primaryCondition: string,
  medicalVisits: { date: string; provider?: string; notes?: string }[]
): string[] {
  const steps: string[] = [];
  
  // Step 1: Get diagnosed
  steps.push(
    `Schedule an appointment with your doctor to discuss ${secondary.secondaryCondition.toLowerCase()} symptoms. Mention your service-connected ${primaryCondition}.`
  );

  // Step 2: Document symptoms
  steps.push(
    `Log symptoms daily in this app: when they started, severity (1-10), and how they affect daily activities.`
  );

  // Step 3: Get nexus letter
  steps.push(
    `Request a nexus letter from your doctor stating that your ${secondary.secondaryCondition} is "at least as likely as not" caused or aggravated by your ${primaryCondition}.`
  );

  // Step 4: Gather buddy statements
  steps.push(
    `Get a buddy statement from someone who has witnessed how this condition affects you. Include specific incidents and dates.`
  );

  // Step 5: File claim
  steps.push(
    `File VA Form 21-526EZ as a secondary claim. Attach your nexus letter, medical records, symptom log, and buddy statements.`
  );

  return steps;
}

function generateFirstPersonNarrative(
  secondary: SecondaryConnection,
  primaryCondition: string,
  earliestServiceDate: Date | null,
  hasSymptoms: boolean,
  hasMedication: boolean
): string {
  const serviceYear = earliestServiceDate ? earliestServiceDate.getFullYear() : '[YEAR]';
  const condition = secondary.secondaryCondition;
  const primary = secondary.primaryCondition;

  let narrative = `I began experiencing symptoms of ${condition.toLowerCase()} approximately [X months/years] after my ${primary} symptoms worsened. `;
  
  narrative += `Prior to my military service, which began in ${serviceYear}, I did not have any issues with ${condition.toLowerCase()}. `;
  
  narrative += `My doctor has explained that ${secondary.medicalConnection.toLowerCase()}. `;

  if (hasSymptoms) {
    narrative += `I have been documenting these symptoms regularly, and they significantly impact my daily life. `;
  }

  if (hasMedication) {
    narrative += `I am currently taking medication to manage this condition. `;
  }

  narrative += `I believe my ${condition} is directly caused by my service-connected ${primary} and respectfully request that the VA consider this secondary service connection claim.`;

  return narrative;
}
