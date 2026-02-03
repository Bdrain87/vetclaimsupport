import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { vaDisabilitiesBySystem, allVADisabilities, totalDisabilitiesCount, VADisability } from '@/data/vaDisabilities';
import { getRequiredFormsForCondition, universalForms, VAForm } from '@/data/vaRequiredForms';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());

  const filteredDisabilities = useMemo(() => {
    let results = allVADisabilities;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(lower) ||
          d.description.toLowerCase().includes(lower) ||
          (d.bodySystem?.toLowerCase().includes(lower) ?? false)
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
      const system = d.bodySystem ?? 'Other';
      if (!groups[system]) {
        groups[system] = [];
      }
      groups[system].push(d);
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

  const toggleCondition = (conditionId: string) => {
    const newExpanded = new Set(expandedConditions);
    if (newExpanded.has(conditionId)) {
      newExpanded.delete(conditionId);
    } else {
      newExpanded.add(conditionId);
    }
    setExpandedConditions(newExpanded);
  };

  const getConditionId = (condition: VADisability, idx: number) => 
    `${condition.diagnosticCode}-${condition.name}-${idx}`;

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
                <div className="divide-y">
                  {conditions.map((condition, idx) => {
                    const conditionId = getConditionId(condition, idx);
                    const isExpanded = expandedConditions.has(conditionId);
                    const requiredForms = getRequiredFormsForCondition(condition.name, condition.diagnosticCode);
                    
                    return (
                      <Collapsible
                        key={conditionId}
                        open={isExpanded}
                        onOpenChange={() => toggleCondition(conditionId)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-3 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">{condition.name}</span>
                                {condition.diagnosticCode && (
                                  <Badge variant="outline" className="font-mono text-xs shrink-0">
                                    DC {condition.diagnosticCode}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {condition.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <Badge variant="secondary" className="font-mono text-xs">
                                {condition.typicalRatings}
                              </Badge>
                              {requiredForms.length > 0 && (
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {requiredForms.length} form{requiredForms.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-3 pb-3 pt-1 space-y-3 bg-muted/20 border-t">
                            {/* Rating Criteria */}
                            {condition.ratingCriteria && (
                              <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">Rating Criteria</h4>
                                <p className="text-sm">{condition.ratingCriteria}</p>
                              </div>
                            )}
                            
                            {/* Required Forms */}
                            {requiredForms.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Required VA Forms for This Condition
                                </h4>
                                <div className="space-y-2">
                                  {requiredForms.map((form) => (
                                    <FormCard key={form.formNumber} form={form} />
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Universal Forms Reminder */}
                            <div className="pt-2 border-t border-border/50">
                              <p className="text-xs text-muted-foreground">
                                <strong>Also Required:</strong> VA Form 21-526EZ (Main Application), 
                                21-4138 (Personal Statement), 21-4142 (Medical Records Release)
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
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

// Form Card Component
function FormCard({ form }: { form: VAForm }) {
  return (
    <div className="flex items-start gap-3 p-2 bg-background rounded-md border border-border/50">
      <div className="p-1.5 bg-primary/10 rounded">
        <FileText className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-medium text-primary">{form.formNumber}</span>
          <span className="text-sm font-medium">{form.name}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{form.description}</p>
      </div>
      {form.url && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            window.open(form.url, '_blank');
          }}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
