import { useState, useMemo } from 'react';
import { Search, ArrowRight, Link, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  secondaryConditions,
  secondaryCategories,
  primaryConditionsList,
} from '@/data/secondaryConditions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SecondaryConditionsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPrimary, setSelectedPrimary] = useState<string>('all');

  const filteredConditions = useMemo(() => {
    let results = secondaryConditions;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(
        (c) =>
          c.primaryCondition.toLowerCase().includes(lower) ||
          c.secondaryCondition.toLowerCase().includes(lower) ||
          c.medicalConnection.toLowerCase().includes(lower)
      );
    }

    if (selectedCategory !== 'all') {
      results = results.filter((c) => c.category === selectedCategory);
    }

    if (selectedPrimary !== 'all') {
      results = results.filter((c) => c.primaryCondition === selectedPrimary);
    }

    return results;
  }, [searchTerm, selectedCategory, selectedPrimary]);

  const groupedByPrimary = useMemo(() => {
    const groups: Record<string, typeof filteredConditions> = {};
    filteredConditions.forEach((c) => {
      if (!groups[c.primaryCondition]) {
        groups[c.primaryCondition] = [];
      }
      groups[c.primaryCondition].push(c);
    });
    return groups;
  }, [filteredConditions]);

  return (
    <div className="space-y-4">
      {/* Anti-pyramiding Disclaimer */}
      <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
        <p className="text-xs text-foreground leading-relaxed font-medium mb-1">
          ⚠️ Anti-Pyramiding Notice (38 CFR 4.14)
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The VA cannot rate the same symptoms under multiple conditions. For best results, focus on secondary conditions that affect <span className="font-medium text-foreground">different body systems</span> than your primary. Example: PTSD → Sleep Apnea (respiratory) rather than PTSD → Depression (same mental health symptoms).
        </p>
      </div>
      
      {/* General Disclaimer */}
      <div className="p-3 bg-muted/50 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">
          These connections are based on medical literature and common VA claim patterns. They are starting points for research only - not confirmation that you have these conditions. <span className="font-medium">Consult a VSO before filing.</span>
        </p>
      </div>

      {/* Explanation */}
      <Card className="data-card border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Link className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">
                Secondary Service Connection
              </p>
              <p className="text-muted-foreground">
                A secondary condition is a disability caused or aggravated by an already
                service-connected condition. To establish secondary connection, you need a medical
                nexus statement linking the secondary condition to your primary. These can
                significantly increase your combined rating.
              </p>
              <p className="text-xs text-warning/90 font-medium">
                <Lightbulb className="h-3 w-3 inline text-warning/90" /> Tip: Conditions affecting different body systems are easier to rate separately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="data-card">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conditions or connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedPrimary} onValueChange={setSelectedPrimary}>
                <SelectTrigger className="w-full sm:w-[260px]">
                  <SelectValue placeholder="All Primary Conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Primary Conditions</SelectItem>
                  {primaryConditionsList.map((primary) => (
                    <SelectItem key={primary} value={primary}>
                      {primary}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {secondaryCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Showing {filteredConditions.length} of {secondaryConditions.length} connections
          </p>
        </CardContent>
      </Card>

      {/* Results grouped by Primary */}
      {Object.entries(groupedByPrimary).map(([primary, connections]) => (
        <Card key={primary} className="data-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-primary">{primary}</span>
              <Badge variant="secondary">{connections.length} secondaries</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {connections.map((connection, idx) => {
              // Check if this crosses body systems (good for anti-pyramiding)
              const primaryIsMental = connection.primaryCondition.toLowerCase().includes('ptsd') || 
                                      connection.primaryCondition.toLowerCase().includes('anxiety') ||
                                      connection.primaryCondition.toLowerCase().includes('depression');
              const secondaryIsMental = connection.category === 'Mental Health';
              const crossesBodySystems = primaryIsMental ? !secondaryIsMental : true;
              
              return (
                <div
                  key={`${connection.primaryCondition}-${connection.secondaryCondition}-${idx}`}
                  className={`rounded-lg border p-3 hover:bg-muted/30 transition-colors ${
                    crossesBodySystems ? 'border-green-500/30 bg-green-500/5' : 'border-border'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-muted-foreground">{connection.primaryCondition}</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{connection.secondaryCondition}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {connection.category}
                    </Badge>
                    {crossesBodySystems && (
                      <Badge variant="secondary" className="text-[10px] bg-green-500/20 text-green-700 dark:text-green-400">
                        Different System ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/80">Medical Connection: </span>
                    {connection.medicalConnection}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {filteredConditions.length === 0 && (
        <Card className="data-card">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No secondary connections found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
