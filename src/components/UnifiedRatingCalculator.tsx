import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Calculator, Plus, Trash2, Info, ChevronDown, ChevronUp,
  Users, Heart, GraduationCap, UserPlus, DollarSign, AlertTriangle,
  RotateCcw, Sparkles, Link2, Check
} from 'lucide-react';
import { vaCompensationRates2024 } from '@/data/vaCompensationRates';
import { useUserConditions } from '@/context/UserConditionsContext';
import {
  vaConditions,
  searchConditions,
  getConditionById,
  type VACondition,
} from '@/data/vaConditions';
import { SecondaryConditionSuggestions } from '@/components/SecondaryConditionSuggestions';

// Storage key for localStorage persistence
const STORAGE_KEY = 'vet-claim-unified-calculator';

// Body part options with bilateral detection
type Side = 'left' | 'right' | 'none';

interface BodyPartOption {
  value: string;
  label: string;
  side: Side;
  basePart: string;
}

const bodyPartOptions: BodyPartOption[] = [
  { value: 'other', label: 'Other / Non-extremity (Back, Head, PTSD, etc.)', side: 'none', basePart: 'other' },
  // Shoulders
  { value: 'left_shoulder', label: 'Left Shoulder', side: 'left', basePart: 'shoulder' },
  { value: 'right_shoulder', label: 'Right Shoulder', side: 'right', basePart: 'shoulder' },
  // Elbows
  { value: 'left_elbow', label: 'Left Elbow', side: 'left', basePart: 'elbow' },
  { value: 'right_elbow', label: 'Right Elbow', side: 'right', basePart: 'elbow' },
  // Wrists
  { value: 'left_wrist', label: 'Left Wrist', side: 'left', basePart: 'wrist' },
  { value: 'right_wrist', label: 'Right Wrist', side: 'right', basePart: 'wrist' },
  // Hands
  { value: 'left_hand', label: 'Left Hand', side: 'left', basePart: 'hand' },
  { value: 'right_hand', label: 'Right Hand', side: 'right', basePart: 'hand' },
  // Arms (general)
  { value: 'left_arm', label: 'Left Arm (General)', side: 'left', basePart: 'arm' },
  { value: 'right_arm', label: 'Right Arm (General)', side: 'right', basePart: 'arm' },
  // Hips
  { value: 'left_hip', label: 'Left Hip', side: 'left', basePart: 'hip' },
  { value: 'right_hip', label: 'Right Hip', side: 'right', basePart: 'hip' },
  // Knees
  { value: 'left_knee', label: 'Left Knee', side: 'left', basePart: 'knee' },
  { value: 'right_knee', label: 'Right Knee', side: 'right', basePart: 'knee' },
  // Ankles
  { value: 'left_ankle', label: 'Left Ankle', side: 'left', basePart: 'ankle' },
  { value: 'right_ankle', label: 'Right Ankle', side: 'right', basePart: 'ankle' },
  // Feet
  { value: 'left_foot', label: 'Left Foot', side: 'left', basePart: 'foot' },
  { value: 'right_foot', label: 'Right Foot', side: 'right', basePart: 'foot' },
  // Legs (general)
  { value: 'left_leg', label: 'Left Leg (General)', side: 'left', basePart: 'leg' },
  { value: 'right_leg', label: 'Right Leg (General)', side: 'right', basePart: 'leg' },
  // Eyes
  { value: 'left_eye', label: 'Left Eye', side: 'left', basePart: 'eye' },
  { value: 'right_eye', label: 'Right Eye', side: 'right', basePart: 'eye' },
  // Ears
  { value: 'left_ear', label: 'Left Ear', side: 'left', basePart: 'ear' },
  { value: 'right_ear', label: 'Right Ear', side: 'right', basePart: 'ear' },
];

const commonRatings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// Condition interface
interface RatedCondition {
  id: string;
  name: string;
  rating: number;
  bodyPart: string;
  conditionId?: string; // Link to vaConditions database
  abbreviation?: string; // Display abbreviation
}

// Dependent types
type DependentType = 'spouse' | 'child_under_18' | 'child_in_school' | 'dependent_parent';

interface Dependent {
  id: string;
  type: DependentType;
  name: string;
}

const dependentTypeLabels: Record<DependentType, string> = {
  spouse: 'Spouse',
  child_under_18: 'Child (Under 18)',
  child_in_school: 'Child (18-23, in school)',
  dependent_parent: 'Dependent Parent',
};

const dependentTypeIcons: Record<DependentType, React.ReactNode> = {
  spouse: <Heart className="h-4 w-4" />,
  child_under_18: <Users className="h-4 w-4" />,
  child_in_school: <GraduationCap className="h-4 w-4" />,
  dependent_parent: <UserPlus className="h-4 w-4" />,
};

// Calculator state interface for persistence
interface CalculatorState {
  conditions: RatedCondition[];
  dependents: Dependent[];
  lastUpdated: number;
}

// VA Math: Combine ratings
function combineRatings(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  if (ratings.length === 1) return ratings[0];

  const sorted = [...ratings].sort((a, b) => b - a);
  let remaining = 100;

  for (const rating of sorted) {
    remaining = remaining - (remaining * (rating / 100));
  }

  return 100 - remaining;
}

// Calculate with bilateral factor
function calculateWithBilateral(conditions: RatedCondition[]): {
  exactCombined: number;
  officialRating: number;
  bilateralExact: number;
  bilateralWithFactor: number;
  hasBilateral: boolean;
  bilateralConditions: RatedCondition[];
  nonBilateralConditions: RatedCondition[];
} {
  if (conditions.length === 0) {
    return {
      exactCombined: 0,
      officialRating: 0,
      bilateralExact: 0,
      bilateralWithFactor: 0,
      hasBilateral: false,
      bilateralConditions: [],
      nonBilateralConditions: [],
    };
  }

  // Group conditions by body part base
  const partGroups: Record<string, RatedCondition[]> = {};
  const nonBilateralConditions: RatedCondition[] = [];

  for (const condition of conditions) {
    if (condition.rating <= 0) continue;

    const option = bodyPartOptions.find(o => o.value === condition.bodyPart);
    if (!option || option.side === 'none') {
      nonBilateralConditions.push(condition);
      continue;
    }

    const basePart = option.basePart;
    if (!partGroups[basePart]) partGroups[basePart] = [];
    partGroups[basePart].push(condition);
  }

  // Identify bilateral conditions
  const bilateralConditions: RatedCondition[] = [];

  for (const [, partConditions] of Object.entries(partGroups)) {
    const hasLeft = partConditions.some(c => {
      const opt = bodyPartOptions.find(o => o.value === c.bodyPart);
      return opt?.side === 'left';
    });
    const hasRight = partConditions.some(c => {
      const opt = bodyPartOptions.find(o => o.value === c.bodyPart);
      return opt?.side === 'right';
    });

    if (hasLeft && hasRight) {
      bilateralConditions.push(...partConditions);
    } else {
      nonBilateralConditions.push(...partConditions);
    }
  }

  const hasBilateral = bilateralConditions.length > 0;
  let bilateralExact = 0;
  let bilateralWithFactor = 0;
  let allRatingsForFinal: number[] = [];

  if (hasBilateral) {
    // Combine bilateral ratings
    const bilateralRatings = bilateralConditions.map(c => c.rating);
    bilateralExact = combineRatings(bilateralRatings);

    // Apply 10% bilateral factor
    bilateralWithFactor = bilateralExact * 1.10;
    const bilateralRounded = Math.round(bilateralWithFactor);

    allRatingsForFinal = [bilateralRounded];
  }

  // Add non-bilateral ratings
  const nonBilateralRatings = nonBilateralConditions.map(c => c.rating).filter(r => r > 0);
  allRatingsForFinal.push(...nonBilateralRatings);

  // Final combination
  const finalExact = combineRatings(allRatingsForFinal);

  // Round to nearest 10% per 38 CFR § 4.25
  const officialRating = Math.round(finalExact / 10) * 10;

  return {
    exactCombined: finalExact,
    officialRating,
    bilateralExact,
    bilateralWithFactor,
    hasBilateral,
    bilateralConditions,
    nonBilateralConditions,
  };
}

// Calculate compensation with dependents
function calculateCompensation(
  rating: number,
  dependents: Dependent[]
): {
  baseRate: number;
  spouseAddition: number;
  childrenAddition: number;
  schoolChildrenAddition: number;
  parentsAddition: number;
  totalMonthly: number;
  totalYearly: number;
  breakdown: { label: string; amount: number }[];
} {
  const rates = vaCompensationRates2024;
  const baseRate = rates.base[rating] || 0;

  // Dependents only apply at 30%+
  if (rating < 30) {
    return {
      baseRate,
      spouseAddition: 0,
      childrenAddition: 0,
      schoolChildrenAddition: 0,
      parentsAddition: 0,
      totalMonthly: baseRate,
      totalYearly: baseRate * 12,
      breakdown: [{ label: 'Base Rate', amount: baseRate }],
    };
  }

  // Count dependents by type
  const hasSpouse = dependents.some(d => d.type === 'spouse');
  const childrenUnder18 = dependents.filter(d => d.type === 'child_under_18').length;
  const childrenInSchool = dependents.filter(d => d.type === 'child_in_school').length;
  const dependentParents = dependents.filter(d => d.type === 'dependent_parent').length;

  const spouseAddition = hasSpouse ? (rates.spouse[rating] || 0) : 0;
  const childrenAddition = childrenUnder18 * (rates.childUnder18[rating] || 0);
  const schoolChildrenAddition = childrenInSchool * (rates.childSchool[rating] || 0);
  const parentsAddition = dependentParents * (rates.dependentParent[rating] || 0);

  const totalMonthly = baseRate + spouseAddition + childrenAddition + schoolChildrenAddition + parentsAddition;

  const breakdown: { label: string; amount: number }[] = [
    { label: 'Base Rate', amount: baseRate },
  ];

  if (spouseAddition > 0) breakdown.push({ label: 'Spouse', amount: spouseAddition });
  if (childrenAddition > 0) breakdown.push({ label: `Children Under 18 (${childrenUnder18})`, amount: childrenAddition });
  if (schoolChildrenAddition > 0) breakdown.push({ label: `Children in School (${childrenInSchool})`, amount: schoolChildrenAddition });
  if (parentsAddition > 0) breakdown.push({ label: `Dependent Parents (${dependentParents})`, amount: parentsAddition });

  return {
    baseRate,
    spouseAddition,
    childrenAddition,
    schoolChildrenAddition,
    parentsAddition,
    totalMonthly,
    totalYearly: totalMonthly * 12,
    breakdown,
  };
}

// Load state from localStorage
function loadState(): CalculatorState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load calculator state:', error);
  }
  return { conditions: [], dependents: [], lastUpdated: 0 };
}

// Save state to localStorage
function saveState(state: CalculatorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdated: Date.now() }));
  } catch (error) {
    console.warn('Failed to save calculator state:', error);
  }
}

export function UnifiedRatingCalculator() {
  // User conditions context
  const {
    conditions: userConditions,
    addCondition: addUserCondition,
    removeCondition: removeUserCondition,
    updateCondition: updateUserCondition,
    hasCondition,
    getConditionDetails,
  } = useUserConditions();

  // Load initial state from localStorage
  const [conditions, setConditions] = useState<RatedCondition[]>(() => loadState().conditions);
  const [dependents, setDependents] = useState<Dependent[]>(() => loadState().dependents);

  // Form state for new condition
  const [newConditionName, setNewConditionName] = useState('');
  const [newConditionRating, setNewConditionRating] = useState('');
  const [newConditionBodyPart, setNewConditionBodyPart] = useState('other');

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<VACondition[]>([]);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Form state for new dependent
  const [newDependentType, setNewDependentType] = useState<DependentType>('spouse');
  const [newDependentName, setNewDependentName] = useState('');

  // UI state
  const [showDependents, setShowDependents] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [syncedWithContext, setSyncedWithContext] = useState(false);

  // Auto-populate from user conditions context on mount
  useEffect(() => {
    if (!syncedWithContext && userConditions.length > 0) {
      const contextConditions: RatedCondition[] = userConditions.map(uc => {
        const details = getConditionDetails(uc);
        return {
          id: uc.id,
          name: details?.name || uc.conditionId,
          rating: uc.rating || 0,
          bodyPart: uc.bodyPart || 'other',
          conditionId: uc.conditionId,
          abbreviation: details?.abbreviation,
        };
      });

      // Merge with existing conditions, avoiding duplicates
      setConditions(prev => {
        const existingIds = new Set(prev.map(c => c.conditionId).filter(Boolean));
        const newConditions = contextConditions.filter(c => c.conditionId && !existingIds.has(c.conditionId));
        if (newConditions.length > 0) {
          return [...prev, ...newConditions];
        }
        return prev;
      });
      setSyncedWithContext(true);
    }
  }, [userConditions, syncedWithContext, getConditionDetails]);

  // Save to localStorage when state changes
  useEffect(() => {
    saveState({ conditions, dependents, lastUpdated: Date.now() });
  }, [conditions, dependents]);

  // Update autocomplete results when typing
  useEffect(() => {
    if (newConditionName.trim().length >= 2) {
      const existingConditionIds = conditions.map(c => c.conditionId).filter(Boolean) as string[];
      const results = searchConditions(newConditionName, existingConditionIds);
      setAutocompleteResults(results.slice(0, 8));
      setShowAutocomplete(results.length > 0);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    }
  }, [newConditionName, conditions]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate results
  const result = useMemo(() => calculateWithBilateral(conditions), [conditions]);
  const compensation = useMemo(
    () => calculateCompensation(result.officialRating, dependents),
    [result.officialRating, dependents]
  );

  // Check if a body part would create a bilateral pair
  const wouldBeBilateral = useCallback((bodyPart: string): boolean => {
    const option = bodyPartOptions.find(o => o.value === bodyPart);
    if (!option || option.side === 'none') return false;

    const basePart = option.basePart;
    const oppositeSide = option.side === 'left' ? 'right' : 'left';

    return conditions.some(c => {
      const condOption = bodyPartOptions.find(o => o.value === c.bodyPart);
      return condOption?.basePart === basePart && condOption?.side === oppositeSide;
    });
  }, [conditions]);

  // Handle autocomplete selection
  const handleAutocompleteSelect = useCallback((condition: VACondition) => {
    setNewConditionName(condition.abbreviation);
    setSelectedConditionId(condition.id);
    setShowAutocomplete(false);
  }, []);

  // Add condition
  const addCondition = useCallback(() => {
    if (!newConditionName.trim() || !newConditionRating) return;

    const rating = parseInt(newConditionRating);
    if (isNaN(rating) || rating < 0 || rating > 100) return;

    // Get condition details if selected from autocomplete
    const conditionDetails = selectedConditionId ? getConditionById(selectedConditionId) : null;

    const newCondition: RatedCondition = {
      id: crypto.randomUUID(),
      name: conditionDetails?.name || newConditionName.trim(),
      rating,
      bodyPart: newConditionBodyPart,
      conditionId: conditionDetails?.id,
      abbreviation: conditionDetails?.abbreviation,
    };

    setConditions(prev => [...prev, newCondition]);

    // Also add to user conditions context for app-wide sync
    if (conditionDetails) {
      addUserCondition(conditionDetails.id, {
        rating,
        bodyPart: newConditionBodyPart !== 'other' ? newConditionBodyPart : undefined,
      });
    }

    setNewConditionName('');
    setNewConditionRating('');
    setNewConditionBodyPart('other');
    setSelectedConditionId(null);
  }, [newConditionName, newConditionRating, newConditionBodyPart, selectedConditionId, addUserCondition]);

  // Remove condition
  const removeCondition = useCallback((id: string) => {
    const conditionToRemove = conditions.find(c => c.id === id);
    setConditions(prev => prev.filter(c => c.id !== id));

    // Also remove from user conditions context if it was linked
    if (conditionToRemove?.conditionId) {
      // Find the user condition with this conditionId
      const userCondition = userConditions.find(uc => uc.conditionId === conditionToRemove.conditionId);
      if (userCondition) {
        removeUserCondition(userCondition.id);
      }
    }
  }, [conditions, userConditions, removeUserCondition]);

  // Update condition rating
  const updateConditionRating = useCallback((id: string, rating: number) => {
    setConditions(prev => prev.map(c =>
      c.id === id ? { ...c, rating } : c
    ));

    // Also update in user conditions context
    const condition = conditions.find(c => c.id === id);
    if (condition?.conditionId) {
      const userCondition = userConditions.find(uc => uc.conditionId === condition.conditionId);
      if (userCondition) {
        updateUserCondition(userCondition.id, { rating });
      }
    }
  }, [conditions, userConditions, updateUserCondition]);

  // Add dependent
  const addDependent = useCallback(() => {
    // Only allow one spouse
    if (newDependentType === 'spouse' && dependents.some(d => d.type === 'spouse')) {
      return;
    }

    setDependents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: newDependentType,
        name: newDependentName.trim() || dependentTypeLabels[newDependentType],
      },
    ]);

    setNewDependentName('');
    if (newDependentType === 'spouse') {
      setNewDependentType('child_under_18');
    }
  }, [newDependentType, newDependentName, dependents]);

  // Remove dependent
  const removeDependent = useCallback((id: string) => {
    setDependents(prev => prev.filter(d => d.id !== id));
  }, []);

  // Reset all
  const resetAll = useCallback(() => {
    setConditions([]);
    setDependents([]);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Check if condition is bilateral
  const isConditionBilateral = (condition: RatedCondition): boolean => {
    return result.bilateralConditions.some(c => c.id === condition.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">VA Rating Calculator</h1>
          <p className="text-muted-foreground text-sm">
            Calculate your combined VA disability rating with automatic bilateral detection
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Add Conditions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Condition Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Condition
              </CardTitle>
              <CardDescription>
                Enter your service-connected disabilities. Body parts are auto-detected for bilateral factor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2 relative" ref={autocompleteRef}>
                  <Label htmlFor="condition-name">Condition Name</Label>
                  <Input
                    id="condition-name"
                    placeholder="Type to search (e.g., PTSD, Tinnitus)"
                    value={newConditionName}
                    onChange={(e) => {
                      setNewConditionName(e.target.value);
                      setSelectedConditionId(null);
                    }}
                    onFocus={() => {
                      if (autocompleteResults.length > 0) setShowAutocomplete(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (showAutocomplete && autocompleteResults.length > 0) {
                          handleAutocompleteSelect(autocompleteResults[0]);
                        } else {
                          addCondition();
                        }
                      } else if (e.key === 'Escape') {
                        setShowAutocomplete(false);
                      }
                    }}
                    className={selectedConditionId ? 'border-green-500' : ''}
                  />
                  {selectedConditionId && (
                    <Badge className="absolute right-2 top-8 bg-green-500 text-white text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Linked
                    </Badge>
                  )}

                  {/* Autocomplete Dropdown */}
                  {showAutocomplete && autocompleteResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                      <div className="max-h-[280px] overflow-y-auto">
                        {autocompleteResults.map(condition => {
                          const isAlreadyAdded = conditions.some(c => c.conditionId === condition.id);
                          return (
                            <button
                              key={condition.id}
                              type="button"
                              disabled={isAlreadyAdded}
                              onClick={() => handleAutocompleteSelect(condition)}
                              className={`w-full text-left px-3 py-2 hover:bg-muted/50 border-b border-border/50 last:border-0 transition-colors ${
                                isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium">{condition.abbreviation}</span>
                                  <span className="text-muted-foreground text-sm ml-2">
                                    {condition.name !== condition.abbreviation && condition.name}
                                  </span>
                                </div>
                                {isAlreadyAdded ? (
                                  <Badge variant="secondary" className="text-xs">Added</Badge>
                                ) : condition.typicalRatings ? (
                                  <span className="text-xs text-blue-600">{condition.typicalRatings}</span>
                                ) : null}
                              </div>
                              {condition.diagnosticCode && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  DC {condition.diagnosticCode}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition-rating">Rating %</Label>
                  <Select value={newConditionRating} onValueChange={setNewConditionRating}>
                    <SelectTrigger id="condition-rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonRatings.map(r => (
                        <SelectItem key={r} value={r.toString()}>{r}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body-part">Body Part</Label>
                  <Select value={newConditionBodyPart} onValueChange={setNewConditionBodyPart}>
                    <SelectTrigger id="body-part">
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyPartOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                          {wouldBeBilateral(opt.value) && ' ⚡'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {wouldBeBilateral(newConditionBodyPart) && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    This will create a bilateral pair! The 10% bilateral factor will be automatically applied.
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={addCondition} disabled={!newConditionName.trim() || !newConditionRating}>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </CardContent>
          </Card>

          {/* Conditions List */}
          {conditions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Your Conditions ({conditions.length})
                    {conditions.some(c => c.conditionId) && (
                      <Badge variant="outline" className="text-xs font-normal border-green-500/50 text-green-600">
                        <Link2 className="h-3 w-3 mr-1" />
                        Synced
                      </Badge>
                    )}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {conditions.map(condition => {
                  const isBilateral = isConditionBilateral(condition);
                  const bodyPartLabel = bodyPartOptions.find(o => o.value === condition.bodyPart)?.label || 'Other';
                  const displayName = condition.abbreviation || condition.name;
                  const fullName = condition.name;

                  return (
                    <div
                      key={condition.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isBilateral
                          ? 'border-amber-500/50 bg-amber-500/5'
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-medium cursor-default">{displayName}</span>
                            </TooltipTrigger>
                            {displayName !== fullName && (
                              <TooltipContent>
                                <p>{fullName}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                          <span className="text-xs text-muted-foreground">{bodyPartLabel}</span>
                        </div>
                        {isBilateral && (
                          <Badge variant="outline" className="border-amber-500 text-amber-600 text-xs">
                            Bilateral
                          </Badge>
                        )}
                        {condition.conditionId && (
                          <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">
                            <Link2 className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={condition.rating.toString()}
                          onValueChange={(value) => updateConditionRating(condition.id, parseInt(value))}
                        >
                          <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {commonRatings.map(r => (
                              <SelectItem key={r} value={r.toString()}>{r}%</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeCondition(condition.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Secondary Condition Suggestions - shows after first condition */}
          {conditions.some(c => c.conditionId) && (
            <SecondaryConditionSuggestions
              conditionIds={conditions.map(c => c.conditionId).filter(Boolean) as string[]}
              maxSuggestions={6}
              collapsible={true}
              defaultCollapsed={false}
            />
          )}

          {/* Dependents Section */}
          <Card>
            <Collapsible open={showDependents} onOpenChange={setShowDependents}>
              <CardHeader className="pb-3">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Dependents ({dependents.length})
                  </CardTitle>
                  {showDependents ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CollapsibleTrigger>
                <CardDescription>
                  Add dependents for additional compensation (requires 30%+ rating)
                </CardDescription>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {result.officialRating < 30 && (
                    <Alert className="border-blue-500/50 bg-blue-500/10">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-blue-700 dark:text-blue-300">
                        Dependent benefits require a combined rating of 30% or higher.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Add Dependent Form */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Dependent Type</Label>
                      <Select
                        value={newDependentType}
                        onValueChange={(v) => setNewDependentType(v as DependentType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="spouse"
                            disabled={dependents.some(d => d.type === 'spouse')}
                          >
                            Spouse {dependents.some(d => d.type === 'spouse') && '(Added)'}
                          </SelectItem>
                          <SelectItem value="child_under_18">Child (Under 18)</SelectItem>
                          <SelectItem value="child_in_school">Child (18-23, in school)</SelectItem>
                          <SelectItem value="dependent_parent">Dependent Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Name (Optional)</Label>
                      <Input
                        placeholder="e.g., John"
                        value={newDependentName}
                        onChange={(e) => setNewDependentName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addDependent()}
                      />
                    </div>

                    <div className="flex items-end">
                      <Button onClick={addDependent} className="w-full sm:w-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Dependents List */}
                  {dependents.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {dependents.map(dependent => (
                        <div
                          key={dependent.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            {dependentTypeIcons[dependent.type]}
                            <div>
                              <span className="font-medium">{dependent.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({dependentTypeLabels[dependent.type]})
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeDependent(dependent.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {/* Combined Rating Card */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Combined Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-6xl font-bold text-primary">
                  {result.officialRating}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Official VA Rating
                </p>
                {result.exactCombined > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Exact: {result.exactCombined.toFixed(2)}%
                  </p>
                )}
              </div>

              {result.hasBilateral && (
                <Alert className="border-amber-500/50 bg-amber-500/10 mt-4">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                    <strong>Bilateral Factor Applied!</strong>
                    <br />
                    Combined bilateral: {result.bilateralExact.toFixed(1)}%
                    <br />
                    After 10% factor: {result.bilateralWithFactor.toFixed(1)}%
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Compensation Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Monthly Compensation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(compensation.totalMonthly)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(compensation.totalYearly)}/year
                </p>
              </div>

              {/* Compensation Breakdown */}
              <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
                <CollapsibleTrigger className="flex items-center justify-between w-full mt-4 text-sm text-muted-foreground hover:text-foreground">
                  <span>View Breakdown</span>
                  {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 space-y-2 text-sm">
                    {compensation.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-mono">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="font-mono">{formatCurrency(compensation.totalMonthly)}</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {result.officialRating >= 30 && dependents.length === 0 && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Add dependents above for additional compensation
                </p>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  This calculator provides estimates only. Your actual VA rating
                  will be determined by the VA based on your complete medical record
                  and C&P examination findings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UnifiedRatingCalculator;
