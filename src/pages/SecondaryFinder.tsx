import { useState, useMemo } from 'react';
import {
  Search,
  Link2,
  ChevronRight,
  FileText,
  AlertCircle,
  CheckCircle2,
  Star,
  Info,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { secondaryConditions, SecondaryConnection } from '@/data/secondaryConditions';

interface GroupedSecondary {
  condition: string;
  connections: Array<{
    primary: string;
    medicalConnection: string;
    category: string;
  }>;
}

// Group by primary condition for better UI
function groupByPrimary(conditions: SecondaryConnection[]): Record<string, SecondaryConnection[]> {
  const groups: Record<string, SecondaryConnection[]> = {};
  conditions.forEach(c => {
    if (!groups[c.primaryCondition]) {
      groups[c.primaryCondition] = [];
    }
    groups[c.primaryCondition].push(c);
  });
  return groups;
}

// Get unique primary conditions
function getUniquePrimaries(conditions: SecondaryConnection[]): string[] {
  return [...new Set(conditions.map(c => c.primaryCondition))].sort();
}

// Get unique categories
function getUniqueCategories(conditions: SecondaryConnection[]): string[] {
  return [...new Set(conditions.map(c => c.category))].sort();
}

// Popular secondary claims (most commonly claimed)
const popularSecondaries = [
  'Sleep Apnea',
  'Migraines',
  'Erectile Dysfunction',
  'Peripheral Neuropathy',
  'Radiculopathy',
  'Hypertension',
  'GERD',
  'Depression',
];

export default function SecondaryFinder() {
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const primaries = useMemo(() => getUniquePrimaries(secondaryConditions), []);
  const categories = useMemo(() => getUniqueCategories(secondaryConditions), []);
  const groupedConditions = useMemo(() => groupByPrimary(secondaryConditions), []);

  // Filter conditions based on selection
  const filteredConditions = useMemo(() => {
    let filtered = secondaryConditions;

    if (selectedPrimary) {
      filtered = filtered.filter(c => c.primaryCondition === selectedPrimary);
    }

    if (selectedCategory) {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.secondaryCondition.toLowerCase().includes(query) ||
          c.primaryCondition.toLowerCase().includes(query) ||
          c.medicalConnection.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedPrimary, selectedCategory, searchQuery]);

  // Get secondaries for selected primary
  const selectedPrimarySecondaries = selectedPrimary ? groupedConditions[selectedPrimary] || [] : [];

  const handleClearFilters = () => {
    setSelectedPrimary(null);
    setSelectedCategory(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Link2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Secondary Conditions Finder</h1>
          <p className="text-muted-foreground">
            Find secondary conditions to claim based on your primary disabilities
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{primaries.length}</div>
            <div className="text-xs text-muted-foreground">Primary Conditions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{secondaryConditions.length}</div>
            <div className="text-xs text-muted-foreground">Secondary Connections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{categories.length}</div>
            <div className="text-xs text-muted-foreground">Body Systems</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Pills */}
      {(selectedPrimary || selectedCategory || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedPrimary && (
            <Badge variant="secondary" className="gap-1">
              Primary: {selectedPrimary}
              <button onClick={() => setSelectedPrimary(null)} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">×</button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Primary Conditions List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-foreground">Select Primary Condition</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {primaries.map((primary) => {
              const count = groupedConditions[primary]?.length || 0;
              const isSelected = selectedPrimary === primary;
              return (
                <button
                  key={primary}
                  onClick={() => setSelectedPrimary(isSelected ? null : primary)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary/50 text-foreground'
                      : 'bg-card border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{primary}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Conditions Display */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPrimary ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">
                  Secondary Conditions for {selectedPrimary}
                </h2>
                <Badge className="bg-success/15 text-success border-success/30">
                  {selectedPrimarySecondaries.length} found
                </Badge>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {[...new Set(selectedPrimarySecondaries.map(c => c.category))].map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Conditions Grid */}
              <div className="space-y-3">
                {filteredConditions.map((condition, idx) => (
                  <Card key={`${condition.primaryCondition}-${condition.secondaryCondition}-${idx}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {condition.secondaryCondition}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {condition.category}
                            </Badge>
                            {popularSecondaries.includes(condition.secondaryCondition) && (
                              <Badge className="text-xs bg-amber-500/15 text-amber-500 border-amber-500/30">
                                <Star className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {condition.medicalConnection}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ArrowRight className="h-3 w-3" />
                            <span>Claimed as secondary to: <strong>{condition.primaryCondition}</strong></span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Popular Secondaries when nothing selected */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Most Commonly Claimed Secondaries
                  </CardTitle>
                  <CardDescription>
                    These secondary conditions are frequently claimed and have strong medical connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {popularSecondaries.map((condition) => {
                      const connections = secondaryConditions.filter(
                        c => c.secondaryCondition === condition
                      );
                      return (
                        <div
                          key={condition}
                          className="p-3 rounded-lg border border-border bg-muted/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{condition}</span>
                            <Badge variant="outline" className="text-xs">
                              {connections.length} primaries
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Can be secondary to: {connections.slice(0, 3).map(c => c.primaryCondition).join(', ')}
                            {connections.length > 3 && ` +${connections.length - 3} more`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* How to Use */}
              <Card className="bg-primary/5 border-primary/30">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    How to Use This Tool
                  </h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      <span>Select your already service-connected (primary) condition from the left</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      <span>Review secondary conditions you may be able to claim</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      <span>Note the medical connection and gather evidence to support it</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">4.</span>
                      <span>Get a nexus letter from a doctor connecting the conditions</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Warning */}
              <Card className="border-warning/30 bg-warning/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Important Notes</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• You must have a current diagnosis of the secondary condition</li>
                        <li>• A medical nexus letter is usually required to establish the connection</li>
                        <li>• The primary condition must be service-connected first</li>
                        <li>• Consult with a VSO before filing secondary claims</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
