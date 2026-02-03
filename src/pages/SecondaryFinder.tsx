import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Link2,
  ChevronRight,
  FileText,
  AlertCircle,
  Star,
  Info,
  TrendingUp,
  ArrowRight,
  FileSignature,
  Database,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { secondaryConditions, SecondaryConnection } from '@/data/secondaryConditions';
import { vaDisabilitiesBySystem } from '@/data/vaDisabilities';

// Get ALL conditions from vaDisabilities (780+)
const getAllConditions = (): string[] => {
  const conditions = new Set<string>();
  vaDisabilitiesBySystem.forEach(system => {
    system.conditions.forEach(condition => {
      conditions.add(condition.name);
    });
  });
  return [...conditions].sort();
};

// Get primaries that have secondary connections
const getPrimariesWithConnections = (): Set<string> => {
  return new Set(secondaryConditions.map(c => c.primaryCondition));
};

// Group by primary condition
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

// Get unique categories
function getUniqueCategories(conditions: SecondaryConnection[]): string[] {
  return [...new Set(conditions.map(c => c.category))].sort();
}

// Popular secondary claims
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
  const [showAllConditions, setShowAllConditions] = useState(false);

  // ALL conditions from VA database
  const allConditions = useMemo(() => getAllConditions(), []);
  const primariesWithConnections = useMemo(() => getPrimariesWithConnections(), []);
  const categories = useMemo(() => getUniqueCategories(secondaryConditions), []);
  const groupedConditions = useMemo(() => groupByPrimary(secondaryConditions), []);

  // Get display list based on mode
  const displayConditions = useMemo(() => {
    if (showAllConditions) {
      return allConditions;
    }
    return [...primariesWithConnections].sort();
  }, [allConditions, primariesWithConnections, showAllConditions]);

  // Filter displayed conditions by search
  const filteredDisplayConditions = useMemo(() => {
    if (!searchQuery.trim()) return displayConditions;
    const query = searchQuery.toLowerCase();
    return displayConditions.filter(c => c.toLowerCase().includes(query));
  }, [displayConditions, searchQuery]);

  // Filter secondary conditions based on selection
  const filteredConditions = useMemo(() => {
    let filtered = secondaryConditions;

    if (selectedPrimary) {
      filtered = filtered.filter(c => c.primaryCondition === selectedPrimary);
    }

    if (selectedCategory) {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    return filtered;
  }, [selectedPrimary, selectedCategory]);

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{allConditions.length}+</div>
            <div className="text-xs text-muted-foreground">Total Conditions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{primariesWithConnections.size}</div>
            <div className="text-xs text-muted-foreground">With Secondary Data</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{secondaryConditions.length}</div>
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

      {/* Toggle All Conditions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={!showAllConditions ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAllConditions(false)}
          >
            <Database className="h-4 w-4 mr-2" />
            With Secondary Data ({primariesWithConnections.size})
          </Button>
          <Button
            variant={showAllConditions ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAllConditions(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            All Conditions ({allConditions.length}+)
          </Button>
        </div>
        {(selectedPrimary || selectedCategory || searchQuery) && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search all conditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Pills */}
      {(selectedPrimary || selectedCategory) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedPrimary && (
            <Badge variant="secondary" className="gap-1">
              Primary: {selectedPrimary}
              <button onClick={() => setSelectedPrimary(null)} className="ml-1 hover:text-destructive" aria-label="Clear primary filter">×</button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-destructive" aria-label="Clear category filter">×</button>
            </Badge>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conditions List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-foreground">
            Select Primary Condition
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredDisplayConditions.length} shown)
            </span>
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {filteredDisplayConditions.map((condition) => {
              const hasData = primariesWithConnections.has(condition);
              const count = groupedConditions[condition]?.length || 0;
              const isSelected = selectedPrimary === condition;
              return (
                <button
                  key={condition}
                  onClick={() => {
                    if (hasData) {
                      setSelectedPrimary(isSelected ? null : condition);
                    }
                  }}
                  disabled={!hasData}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary/50 text-foreground'
                      : hasData
                      ? 'bg-card border-border hover:bg-muted/50 cursor-pointer'
                      : 'bg-muted/30 border-border/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-sm ${!hasData && 'text-muted-foreground'}`}>
                      {condition}
                    </span>
                    {hasData ? (
                      <Badge variant="secondary" className="text-xs bg-success/15 text-success">
                        {count} secondaries
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        No data yet
                      </Badge>
                    )}
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
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-semibold text-foreground">
                  Secondary Conditions for {selectedPrimary}
                </h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/15 text-success border-success/30">
                    {selectedPrimarySecondaries.length} found
                  </Badge>
                  <Link to={`/nexus-letter?primary=${encodeURIComponent(selectedPrimary)}`}>
                    <Button size="sm" className="gap-2">
                      <FileSignature className="h-4 w-4" />
                      Generate Nexus Letter
                    </Button>
                  </Link>
                </div>
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
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                        <Link to={`/nexus-letter?primary=${encodeURIComponent(condition.primaryCondition)}&secondary=${encodeURIComponent(condition.secondaryCondition)}`}>
                          <Button variant="outline" size="sm" className="gap-1 shrink-0">
                            <FileSignature className="h-3 w-3" />
                            Nexus
                          </Button>
                        </Link>
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
                      <span>Click "Generate Nexus Letter" to create a letter template for your doctor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">4.</span>
                      <span>Get the nexus letter signed by a medical professional</span>
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
