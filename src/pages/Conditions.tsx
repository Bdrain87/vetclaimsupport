import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search, Plus, ChevronRight, AlertCircle, ClipboardList,
  Activity, Link2, FileText, Trash2, Edit, Filter
} from 'lucide-react';

import { useUserConditions } from '@/hooks/useUserConditions';
import {
  vaConditions,
  searchConditions,
  getConditionById,
  type VACondition,
} from '@/data/vaConditions';

// Body system options for filtering
const bodySystems = [
  { value: 'all', label: 'All Body Systems' },
  { value: 'musculoskeletal', label: 'Musculoskeletal' },
  { value: 'mental', label: 'Mental Health' },
  { value: 'neurological', label: 'Neurological' },
  { value: 'respiratory', label: 'Respiratory' },
  { value: 'cardiovascular', label: 'Cardiovascular' },
  { value: 'digestive', label: 'Digestive' },
  { value: 'skin', label: 'Skin' },
  { value: 'endocrine', label: 'Endocrine' },
  { value: 'ear', label: 'Ear/Hearing' },
  { value: 'eye', label: 'Eye/Vision' },
  { value: 'genitourinary', label: 'Genitourinary' },
];

interface ConditionCardProps {
  userCondition: {
    id: string;
    conditionId: string;
    rating?: number;
    claimedRating?: number;
    notes?: string;
    evidenceCount?: number;
    totalEvidenceNeeded?: number;
    hasSecondaries?: boolean;
  };
  conditionDetails: VACondition | null;
  onView: () => void;
  onRemove: () => void;
}

function ConditionCard({ userCondition, conditionDetails, onView, onRemove }: ConditionCardProps) {
  const evidenceProgress = userCondition.evidenceCount && userCondition.totalEvidenceNeeded
    ? (userCondition.evidenceCount / userCondition.totalEvidenceNeeded) * 100
    : 0;

  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-all group"
      onClick={onView}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {conditionDetails?.abbreviation || conditionDetails?.name || userCondition.conditionId}
              </h3>
              {userCondition.hasSecondaries && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  <Link2 className="h-3 w-3 mr-1" />
                  Secondaries
                </Badge>
              )}
            </div>

            {conditionDetails?.diagnosticCode && (
              <p className="text-xs text-muted-foreground mb-2">
                DC {conditionDetails.diagnosticCode}
              </p>
            )}

            <div className="flex items-center gap-3 mb-3">
              {userCondition.rating !== undefined && (
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                  Current: {userCondition.rating}%
                </Badge>
              )}
              {userCondition.claimedRating !== undefined && userCondition.claimedRating !== userCondition.rating && (
                <Badge variant="outline" className="text-xs">
                  Claimed: {userCondition.claimedRating}%
                </Badge>
              )}
            </div>

            {/* Evidence Progress */}
            {userCondition.totalEvidenceNeeded && userCondition.totalEvidenceNeeded > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Evidence</span>
                  <span className="font-medium">
                    {userCondition.evidenceCount || 0}/{userCondition.totalEvidenceNeeded}
                  </span>
                </div>
                <Progress value={evidenceProgress} className="h-1.5" />
              </div>
            )}
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>

        {/* Actions */}
        <div
          className="flex gap-2 mt-3 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="sm" onClick={onView}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onRemove}>
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Conditions() {
  const navigate = useNavigate();
  const {
    conditions: userConditions,
    addCondition,
    removeCondition,
    getConditionDetails,
  } = useUserConditions();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [bodySystemFilter, setBodySystemFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Add condition form state
  const [newConditionSearch, setNewConditionSearch] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<VACondition | null>(null);
  const [newRating, setNewRating] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Autocomplete results
  const autocompleteResults = useMemo(() => {
    if (newConditionSearch.trim().length < 2) return [];
    const existingIds = userConditions.map(c => c.conditionId);
    return searchConditions(newConditionSearch, existingIds).slice(0, 8);
  }, [newConditionSearch, userConditions]);

  // Filtered user conditions
  const filteredConditions = useMemo(() => {
    return userConditions.filter(uc => {
      const details = getConditionDetails(uc);

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          details?.name.toLowerCase().includes(query) ||
          details?.abbreviation?.toLowerCase().includes(query) ||
          details?.diagnosticCode?.includes(query) ||
          uc.conditionId.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Body system filter
      if (bodySystemFilter !== 'all' && details) {
        const matchesSystem = details.bodySystem?.toLowerCase().includes(bodySystemFilter);
        if (!matchesSystem) return false;
      }

      return true;
    });
  }, [userConditions, searchQuery, bodySystemFilter, getConditionDetails]);

  // Close autocomplete on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle add condition
  const handleAddCondition = useCallback(() => {
    if (!selectedCondition) return;

    addCondition(selectedCondition.id, {
      rating: newRating ? parseInt(newRating) : undefined,
    });

    // Reset form
    setNewConditionSearch('');
    setSelectedCondition(null);
    setNewRating('');
    setShowAddDialog(false);
  }, [selectedCondition, newRating, addCondition]);

  // Handle autocomplete selection
  const handleSelectCondition = (condition: VACondition) => {
    setSelectedCondition(condition);
    setNewConditionSearch(condition.abbreviation || condition.name);
    setShowAutocomplete(false);
  };

  // Handle view/edit condition
  const handleViewCondition = (conditionId: string) => {
    navigate(`/conditions/${conditionId}`);
  };

  // Handle remove condition
  const handleRemoveCondition = (id: string) => {
    removeCondition(id);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Conditions</h1>
            <p className="text-muted-foreground text-sm">
              {userConditions.length} condition{userConditions.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Condition</DialogTitle>
              <DialogDescription>
                Search for a VA-recognized condition to add to your claim.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Condition Search with Autocomplete */}
              <div className="space-y-2 relative" ref={autocompleteRef}>
                <Label htmlFor="condition-search">Condition Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="condition-search"
                    placeholder="Search conditions (e.g., PTSD, Tinnitus)"
                    value={newConditionSearch}
                    onChange={(e) => {
                      setNewConditionSearch(e.target.value);
                      setSelectedCondition(null);
                      setShowAutocomplete(e.target.value.length >= 2);
                    }}
                    onFocus={() => {
                      if (newConditionSearch.length >= 2) setShowAutocomplete(true);
                    }}
                    className={`pl-10 ${selectedCondition ? 'border-green-500' : ''}`}
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showAutocomplete && autocompleteResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {autocompleteResults.map(condition => (
                        <button
                          key={condition.id}
                          type="button"
                          onClick={() => handleSelectCondition(condition)}
                          className="w-full text-left px-3 py-2 hover:bg-muted/50 border-b border-border/50 last:border-0 transition-colors"
                        >
                          <div className="font-medium">{condition.abbreviation}</div>
                          {condition.name !== condition.abbreviation && (
                            <div className="text-xs text-muted-foreground">{condition.name}</div>
                          )}
                          {condition.diagnosticCode && (
                            <div className="text-xs text-primary mt-0.5">DC {condition.diagnosticCode}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCondition && (
                  <Badge className="mt-1 bg-green-500">
                    Selected: {selectedCondition.abbreviation}
                  </Badge>
                )}
              </div>

              {/* Rating Selection */}
              <div className="space-y-2">
                <Label htmlFor="rating">Current/Claimed Rating (optional)</Label>
                <Select value={newRating} onValueChange={setNewRating}>
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not yet rated</SelectItem>
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(r => (
                      <SelectItem key={r} value={r.toString()}>{r}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCondition} disabled={!selectedCondition}>
                Add Condition
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={bodySystemFilter} onValueChange={setBodySystemFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {bodySystems.map(system => (
              <SelectItem key={system.value} value={system.value}>
                {system.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conditions List */}
      {filteredConditions.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredConditions.map(uc => {
            const details = getConditionDetails(uc);
            return (
              <ConditionCard
                key={uc.id}
                userCondition={{
                  ...uc,
                  evidenceCount: uc.evidenceCount || 0,
                  totalEvidenceNeeded: uc.totalEvidenceNeeded || 5,
                  hasSecondaries: uc.secondaryConditions && uc.secondaryConditions.length > 0,
                }}
                conditionDetails={details}
                onView={() => handleViewCondition(uc.id)}
                onRemove={() => handleRemoveCondition(uc.id)}
              />
            );
          })}
        </div>
      ) : userConditions.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Activity className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">No conditions yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Add your first condition to start tracking evidence and preparing for your C&P exams.
                </p>
              </div>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Condition
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* No Results State */
        <Card className="border-dashed">
          <CardContent className="py-8">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                No conditions match your search.
              </p>
              <Button variant="ghost" onClick={() => { setSearchQuery(''); setBodySystemFilter('all'); }}>
                Clear filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {userConditions.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {userConditions.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Conditions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {userConditions.filter(c => c.rating !== undefined).length}
                </div>
                <div className="text-xs text-muted-foreground">Rated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">
                  {userConditions.filter(c => c.rating === undefined).length}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
