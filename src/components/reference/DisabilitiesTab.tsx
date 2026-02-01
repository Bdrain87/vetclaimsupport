import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { vaDisabilitiesBySystem, allVADisabilities, totalDisabilitiesCount } from '@/data/vaDisabilities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DisabilitiesTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [expandedSystems, setExpandedSystems] = useState<Set<string>>(new Set(['Mental Health', 'Spine & Back']));

  const filteredDisabilities = useMemo(() => {
    let results = allVADisabilities;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(lower) ||
          d.description.toLowerCase().includes(lower) ||
          d.bodySystem.toLowerCase().includes(lower)
      );
    }

    if (selectedSystem !== 'all') {
      results = results.filter((d) => d.bodySystem === selectedSystem);
    }

    return results;
  }, [searchTerm, selectedSystem]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof filteredDisabilities> = {};
    filteredDisabilities.forEach((d) => {
      if (!groups[d.bodySystem]) {
        groups[d.bodySystem] = [];
      }
      groups[d.bodySystem].push(d);
    });
    return groups;
  }, [filteredDisabilities]);

  const toggleSystem = (system: string) => {
    const newExpanded = new Set(expandedSystems);
    if (newExpanded.has(system)) {
      newExpanded.delete(system);
    } else {
      newExpanded.add(system);
    }
    setExpandedSystems(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="p-3 bg-muted/50 border border-border rounded-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">
          This list is for informational purposes only. VA disability ratings are determined by the VA based on your specific medical evidence. Inclusion on this list does not guarantee service connection or any particular rating.
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="data-card">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="All Body Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Body Systems</SelectItem>
                {vaDisabilitiesBySystem.map((system) => (
                  <SelectItem key={system.name} value={system.name}>
                    {system.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Showing {filteredDisabilities.length} of {totalDisabilitiesCount} conditions • Complete 38 CFR Part 4 Schedule
          </p>
        </CardContent>
      </Card>

      {/* Results by System */}
      {Object.entries(groupedResults).map(([system, conditions]) => (
        <Card key={system} className="data-card overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors py-3"
            onClick={() => toggleSystem(system)}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                {system}
                <Badge variant="secondary" className="ml-2">
                  {conditions.length}
                </Badge>
              </span>
              {expandedSystems.has(system) ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
          {expandedSystems.has(system) && (
            <CardContent className="pt-0">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">DC</th>
                      <th className="text-left p-3 font-medium">Condition</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Description</th>
                      <th className="text-right p-3 font-medium whitespace-nowrap">Ratings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {conditions.map((condition, idx) => (
                      <tr key={`${condition.name}-${idx}`} className="hover:bg-muted/30">
                        <td className="p-3 text-muted-foreground font-mono text-xs">
                          {condition.diagnosticCode || '—'}
                        </td>
                        <td className="p-3 font-medium">
                          {condition.name}
                          {condition.diagnosticCode && (
                            <span className="text-muted-foreground font-normal text-xs ml-1">
                              (DC {condition.diagnosticCode})
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell text-xs">
                          {condition.description}
                        </td>
                        <td className="p-3 text-right">
                          <Badge variant="outline" className="font-mono text-xs">
                            {condition.typicalRatings}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {filteredDisabilities.length === 0 && (
        <Card className="data-card">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No conditions found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
