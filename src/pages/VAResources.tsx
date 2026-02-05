import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ExternalLink, Search, BookOpen, FileText, Shield, ChevronDown, ChevronRight,
  MapPin, Calendar, AlertTriangle, CheckCircle2, Info, Building2, Scale, Heart
} from 'lucide-react';

// Import data
import { vaOfficialResources, type VAResource } from '@/data/vaResources/index';
import { getAllDBQReferences, type DBQReference } from '@/data/vaResources/dbqReference';
import {
  burnPitPresumptives,
  agentOrangePresumptives,
  pactActLocations,
  checkPACTActEligibility,
  type PresumptiveCondition,
  type EligibleLocation,
} from '@/data/vaResources/pactAct';

// Official Links Tab Component
function OfficialLinksTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return vaOfficialResources;
    const query = searchQuery.toLowerCase();
    return vaOfficialResources.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedResources = useMemo(() => {
    const groups: Record<string, VAResource[]> = {
      reference: [],
      search: [],
      forms: [],
      benefits: [],
      tools: [],
    };
    filteredResources.forEach(r => {
      if (groups[r.category]) {
        groups[r.category].push(r);
      }
    });
    return groups;
  }, [filteredResources]);

  const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    reference: { label: 'Reference Materials', icon: <BookOpen className="h-5 w-5" /> },
    search: { label: 'Search Tools', icon: <Search className="h-5 w-5" /> },
    forms: { label: 'Forms & DBQs', icon: <FileText className="h-5 w-5" /> },
    benefits: { label: 'Benefits Information', icon: <Heart className="h-5 w-5" /> },
    tools: { label: 'VA Tools', icon: <Building2 className="h-5 w-5" /> },
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Resource Groups */}
      {Object.entries(groupedResources).map(([category, resources]) => {
        if (resources.length === 0) return null;
        const { label, icon } = categoryLabels[category];

        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
              <h3 className="font-semibold">{label}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {resource.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {resource.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      {/* Legal Footer */}
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs text-muted-foreground">
          All links go to official VA.gov and government websites. Information is public domain.
          This app is not affiliated with the U.S. Department of Veterans Affairs.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// DBQ Guide Tab Component
function DBQGuideTab() {
  const [expandedDBQ, setExpandedDBQ] = useState<string | null>(null);
  const dbqReferences = getAllDBQReferences();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Disability Benefit Questionnaires (DBQs) are the forms examiners use to evaluate your conditions.
        Understanding what they ask helps you prepare.
      </p>

      {dbqReferences.map(dbq => (
        <Collapsible
          key={dbq.id}
          open={expandedDBQ === dbq.id}
          onOpenChange={(open) => setExpandedDBQ(open ? dbq.id : null)}
        >
          <Card className={expandedDBQ === dbq.id ? 'border-primary/50' : ''}>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-base">{dbq.name}</CardTitle>
                      <CardDescription className="text-xs">
                        Form {dbq.formNumber} | DC {dbq.diagnosticCodes.join(', ')}
                      </CardDescription>
                    </div>
                  </div>
                  {expandedDBQ === dbq.id ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {/* Conditions Covered */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Conditions Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {dbq.conditionsCovered.map((condition, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Key Questions */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Key Questions Asked</h4>
                  <div className="space-y-3">
                    {dbq.keyQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50">
                        <p className="font-medium text-sm">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Why it matters: {q.whyItMatters}
                        </p>
                        {q.tips && q.tips.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {q.tips.map((tip, tipIdx) => (
                              <li key={tipIdx} className="text-xs text-primary flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* What Determines Rating */}
                <div>
                  <h4 className="text-sm font-medium mb-2">What Determines Your Rating</h4>
                  <ul className="space-y-1">
                    {dbq.whatDeterminesRating.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <Scale className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Common Mistakes */}
                <div>
                  <h4 className="text-sm font-medium mb-2 text-destructive">Common Mistakes to Avoid</h4>
                  <ul className="space-y-1">
                    {dbq.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prep Tips */}
                <Alert className="bg-green-500/10 border-green-500/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <span className="font-medium text-green-700 dark:text-green-400">Preparation Tips:</span>
                    <ul className="mt-2 space-y-1">
                      {dbq.prepTips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-green-700 dark:text-green-400">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}

// PACT Act Tab Component
function PACTActTab() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState<ReturnType<typeof checkPACTActEligibility> | null>(null);
  const [activeSection, setActiveSection] = useState<'burn-pit' | 'agent-orange' | 'checker'>('burn-pit');

  const handleCheckEligibility = () => {
    if (selectedLocations.length === 0 || !startDate || !endDate) return;
    const result = checkPACTActEligibility(
      selectedLocations,
      new Date(startDate),
      new Date(endDate)
    );
    setEligibilityResult(result);
  };

  const handleLocationToggle = (locationId: string) => {
    setSelectedLocations(prev =>
      prev.includes(locationId)
        ? prev.filter(l => l !== locationId)
        : [...prev, locationId]
    );
    setEligibilityResult(null);
  };

  const renderConditionsList = (conditions: PresumptiveCondition[], title: string) => (
    <div>
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {conditions.map(condition => (
          <div
            key={condition.id}
            className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{condition.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{condition.description}</p>
              </div>
              {condition.addedDate && (
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  Added {new Date(condition.addedDate).getFullYear()}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeSection === 'burn-pit' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveSection('burn-pit')}
        >
          Burn Pit Conditions ({burnPitPresumptives.length})
        </Button>
        <Button
          variant={activeSection === 'agent-orange' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveSection('agent-orange')}
        >
          Agent Orange ({agentOrangePresumptives.length})
        </Button>
        <Button
          variant={activeSection === 'checker' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveSection('checker')}
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Check Eligibility
        </Button>
      </div>

      {/* Burn Pit Section */}
      {activeSection === 'burn-pit' && (
        <div className="space-y-4">
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <Shield className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              The PACT Act added {burnPitPresumptives.length} conditions as presumptive for veterans who served
              in covered locations. If you have one of these conditions, the VA will presume it was caused by service.
            </AlertDescription>
          </Alert>

          {renderConditionsList(
            burnPitPresumptives.filter(c => !c.name.toLowerCase().includes('cancer')),
            'Respiratory Conditions'
          )}
          <Separator />
          {renderConditionsList(
            burnPitPresumptives.filter(c => c.name.toLowerCase().includes('cancer')),
            'Cancers'
          )}
        </div>
      )}

      {/* Agent Orange Section */}
      {activeSection === 'agent-orange' && (
        <div className="space-y-4">
          <Alert className="bg-green-500/10 border-green-500/30">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Veterans who served in Vietnam, Thailand (at specific bases), Korea (DMZ), and other locations
              between 1962-1975 may be eligible for Agent Orange presumptive conditions.
            </AlertDescription>
          </Alert>

          {renderConditionsList(agentOrangePresumptives, 'Agent Orange Presumptive Conditions')}
        </div>
      )}

      {/* Eligibility Checker Section */}
      {activeSection === 'checker' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                PACT Act Eligibility Checker
              </CardTitle>
              <CardDescription>
                Select your service locations and dates to check if you qualify for presumptive conditions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Service Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setEligibilityResult(null);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Service End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setEligibilityResult(null);
                    }}
                  />
                </div>
              </div>

              {/* Location Selection */}
              <div className="space-y-3">
                <Label>Service Locations (select all that apply)</Label>

                {/* Burn Pit Locations */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Middle East / Africa (Burn Pits)</p>
                  <div className="flex flex-wrap gap-2">
                    {pactActLocations
                      .filter(l => l.exposureType === 'burn-pit')
                      .map(location => (
                        <Button
                          key={location.id}
                          variant={selectedLocations.includes(location.id) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleLocationToggle(location.id)}
                        >
                          {location.name}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Agent Orange Locations */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Southeast Asia (Agent Orange)</p>
                  <div className="flex flex-wrap gap-2">
                    {pactActLocations
                      .filter(l => l.exposureType === 'agent-orange')
                      .map(location => (
                        <Button
                          key={location.id}
                          variant={selectedLocations.includes(location.id) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleLocationToggle(location.id)}
                        >
                          {location.name}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckEligibility}
                disabled={selectedLocations.length === 0 || !startDate || !endDate}
                className="w-full"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Check My Eligibility
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {eligibilityResult && (
            <Card className={eligibilityResult.isEligible ? 'border-green-500/50 bg-green-500/5' : 'border-destructive/50 bg-destructive/5'}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 ${eligibilityResult.isEligible ? 'text-green-600' : 'text-destructive'}`}>
                  {eligibilityResult.isEligible ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      You May Be Eligible!
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5" />
                      No Matches Found
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eligibilityResult.isEligible ? (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Matched Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {eligibilityResult.matchedLocations.map(loc => (
                          <Badge key={loc.id} className="bg-green-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {loc.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Exposure Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {eligibilityResult.exposureTypes.map(type => (
                          <Badge key={type} variant="outline">
                            {type === 'burn-pit' ? 'Burn Pit Exposure' : 'Agent Orange Exposure'}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Presumptive Conditions You Qualify For ({eligibilityResult.eligibleConditions.length})
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2 max-h-64 overflow-y-auto">
                        {eligibilityResult.eligibleConditions.map(condition => (
                          <div key={condition.id} className="p-2 rounded bg-green-500/10 text-sm">
                            {condition.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Alert className="bg-primary/10 border-primary/30">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Next Step:</strong> File your claim as soon as possible.
                        The VA cannot grant an effective date earlier than your filing date,
                        so filing now maximizes your potential back pay.
                      </AlertDescription>
                    </Alert>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Your service dates and locations did not match our database of covered areas.
                    However, you may still be eligible through individual claims. Consult with a
                    VSO or VA for personalized guidance.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Legal Footer */}
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs text-muted-foreground">
          Information sourced from Public Law 117-168 (PACT Act) and VA.gov.
          This tool provides general information only and does not constitute legal advice.
          Consult with a VA-accredited representative for personalized guidance.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Main VA Resources Page
export default function VAResources() {
  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">VA Resources</h1>
          <p className="text-muted-foreground text-sm">
            Official links, DBQ guides, and PACT Act information
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="official-links" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="official-links" className="text-xs sm:text-sm">
            <ExternalLink className="h-4 w-4 mr-1 hidden sm:inline" />
            Official Links
          </TabsTrigger>
          <TabsTrigger value="dbq-guide" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1 hidden sm:inline" />
            DBQ Guide
          </TabsTrigger>
          <TabsTrigger value="pact-act" className="text-xs sm:text-sm">
            <Shield className="h-4 w-4 mr-1 hidden sm:inline" />
            PACT Act
          </TabsTrigger>
        </TabsList>

        <TabsContent value="official-links" className="mt-6">
          <OfficialLinksTab />
        </TabsContent>

        <TabsContent value="dbq-guide" className="mt-6">
          <DBQGuideTab />
        </TabsContent>

        <TabsContent value="pact-act" className="mt-6">
          <PACTActTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
