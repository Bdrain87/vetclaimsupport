import { useState, useMemo } from 'react';
import { Search, Shield, CheckCircle2, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ConflictCard } from '@/components/ConflictCard';
import { ConflictDetail } from '@/components/ConflictDetail';
import { conflicts, searchConditions, getAllPresumptiveConditions, Conflict } from '@/data/conflictConditions';
import { PageContainer } from '@/components/PageContainer';

type FilterType = 'all' | 'presumptive';

export default function ConditionsByConflict() {
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Search across all conditions
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchConditions(searchQuery);
  }, [searchQuery]);

  // Get all presumptive conditions for stats
  const allPresumptive = useMemo(() => getAllPresumptiveConditions(), []);

  // Filter conflicts based on presumptive filter
  const filteredConflicts = useMemo(() => {
    if (filter === 'presumptive') {
      return conflicts.filter(c =>
        c.commonConditions.some(g => g.presumptive)
      );
    }
    return conflicts;
  }, [filter]);

  const handleSelectConflict = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setSearchQuery('');
  };

  const handleClearSelection = () => {
    setSelectedConflict(null);
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conditions by Conflict</h1>
          <p className="text-muted-foreground">
            Find common conditions and presumptive claims by service era
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{conflicts.length}</div>
            <div className="text-xs text-muted-foreground">Service Eras</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{allPresumptive.length}</div>
            <div className="text-xs text-muted-foreground">Presumptive Conditions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {conflicts.reduce((acc, c) => acc + c.exposures.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Documented Exposures</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {conflicts.reduce((acc, c) => acc + c.resources.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">VA Resources</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      {!selectedConflict && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conditions across all eras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search conflicts"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="gap-1"
            >
              <Filter className="h-4 w-4" />
              All
            </Button>
            <Button
              variant={filter === 'presumptive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('presumptive')}
              className="gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              Presumptive Only
            </Button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults && searchResults.length > 0 && !selectedConflict && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-3">
              Found {searchResults.length} matching conditions
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map(({ condition, conflict, group }, index) => (
                <div
                  key={`${condition}-${index}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                  onClick={() => handleSelectConflict(conflict)}
                >
                  <div className="flex items-center gap-2">
                    {group.presumptive ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className="text-sm">{condition}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {conflict.name}
                    </Badge>
                    {group.presumptive && (
                      <Badge className="text-xs bg-success/15 text-success border-success/30">
                        Presumptive
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults && searchResults.length === 0 && searchQuery.trim() && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No conditions found matching "{searchQuery}". Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Conflict Detail View */}
      {selectedConflict && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Back to all eras
          </Button>
          <ConflictDetail conflict={selectedConflict} />
        </div>
      )}

      {/* Conflict Grid */}
      {!selectedConflict && !searchQuery.trim() && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredConflicts.map((conflict) => (
            <ConflictCard
              key={conflict.id}
              conflict={conflict}
              onClick={() => handleSelectConflict(conflict)}
            />
          ))}
        </div>
      )}

      {/* Info Card */}
      {!selectedConflict && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Understanding Presumptive Conditions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The VA recognizes certain conditions as "presumptive" for veterans who served in specific locations
              or time periods. This means if you have the condition and meet the service requirements, the VA
              automatically assumes it's connected to your service.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">= Presumptive (easier to claim)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                <span className="text-muted-foreground">= Requires nexus evidence</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
