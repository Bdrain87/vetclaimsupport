import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search, Plus, ChevronRight, AlertCircle, ClipboardList,
  Activity, Link2, Trash2, Edit, Filter, Shield, FileText,
  Stethoscope, Calendar, PersonStanding, Compass, Calculator,
  Zap, AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import useAppStore from '@/store/useAppStore';
import { PageContainer } from '@/components/PageContainer';
import { ConditionAutocomplete } from '@/components/shared/ConditionAutocomplete';
import { getDiagnosticCodeForCondition } from '@/components/shared/ConditionSearchInput.utils';
import {
  type VACondition,
  getConditionById,
} from '@/data/vaConditions';
import { getAllCategories, searchAllConditions } from '@/utils/conditionSearch';

// Build body system options dynamically from the unified index
const dynamicCategories = getAllCategories();
const bodySystems = [
  { value: 'all', label: 'All Body Systems' },
  ...dynamicCategories.map(c => ({ value: c.toLowerCase(), label: c })),
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[rgba(197,164,66,0.2)] text-gold-dk border-[rgba(197,164,66,0.3)]',
  approved: 'bg-green-500/20 text-green-600 border-green-500/30',
  denied: 'bg-red-500/20 text-red-600 border-red-500/30',
  appeal: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
  appeal: 'Appeal',
};

interface ConditionCardProps {
  userCondition: {
    id: string;
    conditionId: string;
    rating?: number;
    claimedRating?: number;
    notes?: string;
    hasSecondaries?: boolean;
    claimStatus?: string;
    serviceConnected?: boolean;
    secondariesCount?: number;
    evidenceChecked?: number;
    evidenceTotal?: number;
    dateAdded?: string;
  };
  conditionDetails: VACondition | null;
  onView: () => void;
  onRemove: () => void;
  onNavigate?: (path: string) => void;
}

function ConditionCard({ userCondition, conditionDetails, onView, onRemove, onNavigate }: ConditionCardProps) {
  const evidenceProgress = userCondition.evidenceTotal && userCondition.evidenceTotal > 0
    ? (userCondition.evidenceChecked || 0) / userCondition.evidenceTotal * 100
    : 0;

  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-all group"
      onClick={onView}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold truncate max-w-full group-hover:text-primary transition-colors">
                {conditionDetails?.abbreviation || conditionDetails?.name || userCondition.conditionId}
              </h3>
              {userCondition.claimStatus && (
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 truncate max-w-full ${STATUS_COLORS[userCondition.claimStatus] || ''}`}>
                  {STATUS_LABELS[userCondition.claimStatus] || userCondition.claimStatus}
                </Badge>
              )}
              {userCondition.serviceConnected && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-[rgba(197,164,66,0.1)] text-gold border-[rgba(197,164,66,0.3)] flex-shrink-0">
                  <Shield className="h-2.5 w-2.5 mr-0.5" />
                  SC
                </Badge>
              )}
            </div>

            {conditionDetails?.diagnosticCode && (
              <p className="text-xs text-muted-foreground mb-2">
                DC {conditionDetails.diagnosticCode}
              </p>
            )}

            <div className="flex items-center gap-3 mb-2 flex-wrap">
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
              {userCondition.secondariesCount !== undefined && userCondition.secondariesCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Link2 className="h-3 w-3 mr-1" />
                  {userCondition.secondariesCount} secondary{userCondition.secondariesCount !== 1 ? 'ies' : 'y'}
                </Badge>
              )}
            </div>

            {/* Evidence Progress */}
            {userCondition.evidenceTotal !== undefined && userCondition.evidenceTotal > 0 && (
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Evidence</span>
                  <span className="font-medium">
                    {userCondition.evidenceChecked || 0}/{userCondition.evidenceTotal}
                  </span>
                </div>
                <Progress value={evidenceProgress} className="h-1.5" />
              </div>
            )}

            {/* Date added */}
            {userCondition.dateAdded && (
              <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                Added {new Date(userCondition.dateAdded).toLocaleDateString()}
              </p>
            )}
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>

        {/* Quick Actions + Remove */}
        <div
          className="flex gap-1 mt-3 pt-3 border-t border-border flex-wrap sm:opacity-0 sm:group-hover:opacity-100 transition-opacity overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {conditionDetails && onNavigate && (
            <>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => onNavigate(`/prep/dbq?condition=${encodeURIComponent(conditionDetails.name)}`)}>
                <FileText className="h-3 w-3 mr-1" />
                DBQ
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => onNavigate('/prep/exam')}>
                <Stethoscope className="h-3 w-3 mr-1" />
                C&P Prep
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => onNavigate('/prep/personal-statement')}>
                <Edit className="h-3 w-3 mr-1" />
                Statement
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-destructive hover:text-destructive ml-auto" onClick={onRemove}>
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const CLAIM_TOOLS = [
  { label: 'Body Map', icon: PersonStanding, route: '/claims/body-map' },
  { label: 'Secondary Finder', icon: Compass, route: '/claims/secondary-finder' },
  { label: 'Rating Calculator', icon: Calculator, route: '/claims/calculator' },
  { label: 'Claim Strategy', icon: Zap, route: '/claims/strategy' },
];

export default function Conditions() {
  const navigate = useNavigate();
  const {
    conditions: userConditions,
    addCondition,
    removeCondition,
    getConditionDetails,
  } = useUserConditions();
  const { data } = useClaims();
  const profile = useProfileStore();

  const conditionEvidenceChecks = useAppStore(s => s.conditionEvidenceChecks);

  const recommendations = useMemo(
    () => ClaimIntelligence.getRecommendations(profile, userConditions, data),
    [profile, userConditions, data]
  );

  const evidenceGaps = useMemo(() => {
    const claimConditions = data.claimConditions || [];
    const gaps: { conditionName: string; missing: string[]; conditionId?: string }[] = [];
    claimConditions.forEach((c) => {
      const matchingUserCondition = userConditions.find(uc => {
        const details = getConditionDetails(uc);
        return details?.name.toLowerCase() === c.name.toLowerCase() || uc.conditionId === c.id;
      });
      if (matchingUserCondition?.claimStatus === 'approved') return;
      const missing: string[] = [];
      if (c.linkedMedicalVisits.length === 0) missing.push('Medical records');
      if (c.linkedSymptoms.length === 0) missing.push('Symptom logs');
      if (c.linkedBuddyContacts.length === 0) missing.push('Buddy statements');
      if (missing.length > 0) {
        gaps.push({ conditionName: c.name, missing, conditionId: c.id });
      }
    });
    return gaps;
  }, [data.claimConditions, userConditions, getConditionDetails]);

  // Must match the 10 items in ConditionDetail.tsx EVIDENCE_ITEMS
  const EVIDENCE_TOTAL = 10;

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [bodySystemFilter, setBodySystemFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Add condition form state
  const [selectedCondition, setSelectedCondition] = useState<VACondition | null>(null);
  const [newRating, setNewRating] = useState('');
  const [newClaimStatus, setNewClaimStatus] = useState<'pending' | 'approved'>('pending');
  const [isSecondary, setIsSecondary] = useState(false);
  const [linkedPrimaryId, setLinkedPrimaryId] = useState('');

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
        const matchesSystem = details.category === bodySystemFilter || details.bodySystem?.toLowerCase().includes(bodySystemFilter);
        if (!matchesSystem) return false;
      }

      return true;
    });
  }, [userConditions, searchQuery, bodySystemFilter, getConditionDetails]);

  // Get primary conditions for the secondary picker
  const primaryConditions = useMemo(() => {
    return userConditions.filter(c => c.isPrimary);
  }, [userConditions]);

  // Search VA database for conditions to add
  const databaseResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const existingIds = userConditions.map(c => c.conditionId);
    return searchAllConditions(searchQuery, { excludeIds: existingIds, limit: 8 });
  }, [searchQuery, userConditions]);

  // Handle add condition
  const handleAddCondition = useCallback(() => {
    if (!selectedCondition) return;

    const parsedRating = newRating && newRating !== 'not-rated' ? parseInt(newRating) : undefined;
    if (parsedRating !== undefined && isNaN(parsedRating)) return;

    addCondition(selectedCondition.id, {
      rating: parsedRating,
      claimStatus: newClaimStatus,
      serviceConnected: newClaimStatus === 'approved',
      isPrimary: !isSecondary,
      linkedPrimaryId: isSecondary && linkedPrimaryId ? linkedPrimaryId : undefined,
    });

    // Reset form
    setSelectedCondition(null);
    setNewRating('');
    setNewClaimStatus('pending');
    setIsSecondary(false);
    setLinkedPrimaryId('');
    setShowAddDialog(false);
  }, [selectedCondition, newRating, newClaimStatus, isSecondary, linkedPrimaryId, addCondition]);

  // Confirm remove state
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);

  // Handle view/edit condition
  const handleViewCondition = (conditionId: string) => {
    navigate(`/claims/${conditionId}`);
  };

  // Handle remove condition (with confirmation)
  const handleRemoveCondition = (id: string) => {
    const uc = userConditions.find(c => c.id === id);
    if (!uc) return;
    const details = getConditionDetails(uc);
    setRemoveTarget({ id, name: details?.name || 'this condition' });
  };

  const confirmRemoveCondition = () => {
    if (removeTarget) {
      removeCondition(removeTarget.id);
      setRemoveTarget(null);
    }
  };

  return (
    <PageContainer className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Claim</h1>
            <p className="text-muted-foreground text-sm">
              {userConditions.length} condition{userConditions.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
        </div>

        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {/* Quick Claim Tools */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {CLAIM_TOOLS.map((tool) => (
          <Link
            key={tool.route}
            to={tool.route}
            className="flex flex-col items-center gap-1.5 min-w-[72px] p-2.5 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-center"
          >
            <tool.icon className="h-5 w-5 text-gold" />
            <span className="text-[10px] font-medium text-foreground leading-tight">{tool.label}</span>
          </Link>
        ))}
      </div>

      {/* Evidence Gaps Alert */}
      {evidenceGaps.length > 0 && (
        <button
          onClick={() => {
            const firstGap = evidenceGaps[0];
            if (firstGap?.conditionId) navigate(`/claims/${firstGap.conditionId}`);
          }}
          className="w-full rounded-xl p-3 text-left bg-[rgba(197,164,66,0.08)] border border-[rgba(197,164,66,0.2)] hover:bg-[rgba(197,164,66,0.12)] transition-colors"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {evidenceGaps.length} condition{evidenceGaps.length !== 1 ? 's' : ''} need more evidence
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {evidenceGaps[0]?.conditionName}: missing {evidenceGaps[0]?.missing.join(', ')}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          </div>
        </button>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Condition</DialogTitle>
            <DialogDescription>
              Search for a VA-recognized condition to add to your claim.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Condition Name</Label>
              <ConditionAutocomplete
                onSelect={(condition) => setSelectedCondition(condition)}
                placeholder="Search conditions (e.g., PTSD, Tinnitus)"
                excludeIds={userConditions.map(c => c.conditionId)}
                autoFocus
              />
              {selectedCondition && (
                <Badge className="mt-1 bg-green-500">
                  Selected: {selectedCondition.abbreviation}
                </Badge>
              )}
            </div>

            {selectedCondition && primaryConditions.length > 0 && (
              <div className="space-y-2">
                <Label>Is this secondary to another condition?</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={!isSecondary ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setIsSecondary(false); setLinkedPrimaryId(''); }}
                  >
                    Primary
                  </Button>
                  <Button
                    type="button"
                    variant={isSecondary ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsSecondary(true)}
                  >
                    Secondary
                  </Button>
                </div>
                {isSecondary && (
                  <Select value={linkedPrimaryId} onValueChange={setLinkedPrimaryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary condition..." />
                    </SelectTrigger>
                    <SelectContent>
                      {primaryConditions.map(pc => {
                        const details = getConditionDetails(pc);
                        return (
                          <SelectItem key={pc.id} value={pc.id}>
                            {details?.abbreviation || details?.name || pc.conditionId}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Claim Status</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={newClaimStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewClaimStatus('pending')}
                >
                  New / Pending
                </Button>
                <Button
                  type="button"
                  variant={newClaimStatus === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewClaimStatus('approved')}
                >
                  Already Approved
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">{newClaimStatus === 'approved' ? 'Current VA Rating' : 'Claimed Rating (optional)'}</Label>
              <Select value={newRating} onValueChange={setNewRating}>
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-rated">Not yet rated</SelectItem>
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conditions or add new..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={bodySystemFilter} onValueChange={setBodySystemFilter}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by body system">
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

      {/* Conditions List — grouped with primaries first, secondaries indented below */}
      {filteredConditions.length > 0 ? (
        <div className="space-y-4">
          {/* Primary conditions */}
          {filteredConditions.filter(uc => uc.isPrimary).map(uc => {
            const details = getConditionDetails(uc);
            const secondaries = filteredConditions.filter(s => !s.isPrimary && s.linkedPrimaryId === uc.id);
            const checked = conditionEvidenceChecks[uc.id] || [];
            return (
              <div key={uc.id} className="space-y-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ConditionCard
                    userCondition={{
                      ...uc,
                      hasSecondaries: secondaries.length > 0,
                      secondariesCount: secondaries.length,
                      evidenceChecked: checked.length,
                      evidenceTotal: EVIDENCE_TOTAL,
                    }}
                    conditionDetails={details ?? null}
                    onView={() => handleViewCondition(uc.id)}
                    onRemove={() => handleRemoveCondition(uc.id)}
                    onNavigate={(path) => navigate(path)}
                  />
                </div>
                {secondaries.length > 0 && (
                  <div className="ml-6 border-l-2 border-primary/20 pl-4 grid gap-3 sm:grid-cols-2">
                    {secondaries.map(sec => {
                      const secDetails = getConditionDetails(sec);
                      const primaryDetails = getConditionDetails(uc);
                      const secChecked = conditionEvidenceChecks[sec.id] || [];
                      return (
                        <div key={sec.id} className="space-y-1">
                          <p className="text-xs text-muted-foreground truncate">
                            Secondary to: {primaryDetails?.abbreviation || primaryDetails?.name || uc.conditionId}
                          </p>
                          <ConditionCard
                            userCondition={{
                              ...sec,
                              hasSecondaries: false,
                              secondariesCount: 0,
                              evidenceChecked: secChecked.length,
                              evidenceTotal: EVIDENCE_TOTAL,
                            }}
                            conditionDetails={secDetails ?? null}
                            onView={() => handleViewCondition(sec.id)}
                            onRemove={() => handleRemoveCondition(sec.id)}
                            onNavigate={(path) => navigate(path)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {/* Unlinked secondaries (no matching primary in the list) */}
          {filteredConditions.filter(uc => !uc.isPrimary && !filteredConditions.some(p => p.isPrimary && p.id === uc.linkedPrimaryId)).map(uc => {
            const details = getConditionDetails(uc);
            const checked = conditionEvidenceChecks[uc.id] || [];
            return (
              <div key={uc.id} className="grid gap-4 sm:grid-cols-2">
                <ConditionCard
                  userCondition={{
                    ...uc,
                    hasSecondaries: false,
                    secondariesCount: 0,
                    evidenceChecked: checked.length,
                    evidenceTotal: EVIDENCE_TOTAL,
                  }}
                  conditionDetails={details ?? null}
                  onView={() => handleViewCondition(uc.id)}
                  onRemove={() => handleRemoveCondition(uc.id)}
                  onNavigate={(path) => navigate(path)}
                />
              </div>
            );
          })}
        </div>
      ) : userConditions.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed border-gold/30">
          <CardContent className="py-10">
            <div className="text-center space-y-5">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                <Shield className="h-7 w-7 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Start Building Your Claim</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Add conditions you want to claim. We&apos;ll help you track evidence, prepare for C&P exams, and build the strongest case possible.
                </p>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Button onClick={() => setShowAddDialog(true)} className="w-full max-w-[240px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add a Condition
                </Button>
                <Button variant="outline" onClick={() => navigate('/claims/body-map')} className="w-full max-w-[240px]">
                  <PersonStanding className="h-4 w-4 mr-2" />
                  Explore Body Map
                </Button>
                <Button variant="ghost" onClick={() => navigate('/claims/secondary-finder')} className="w-full max-w-[240px] text-muted-foreground">
                  <Compass className="h-4 w-4 mr-2" />
                  Find Secondary Conditions
                </Button>
              </div>
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
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {userConditions.length}
                </div>
                <div className="text-xs text-muted-foreground">Conditions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {userConditions.filter(c => c.rating !== undefined).length}
                </div>
                <div className="text-xs text-muted-foreground">Rated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">
                  {userConditions.filter(c => c.rating === undefined).length}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Conditions to Explore */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Compass className="h-4 w-4 text-gold" />
            Conditions to Explore
          </h2>
          <div className="space-y-2">
            {recommendations.slice(0, 4).map((rec) => {
              const diagnosticCodeResult = getDiagnosticCodeForCondition(rec.conditionId);
              return (
                <button
                  key={rec.conditionId}
                  onClick={() => {
                    addCondition(rec.conditionId);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-gold/30 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-foreground truncate">{rec.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                      {diagnosticCodeResult ? `DC ${diagnosticCodeResult.code} · ` : ''}{rec.reason}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-gold flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Add from VA Database */}
      {databaseResults.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Add from VA database
            </p>
            <div className="space-y-2">
              {databaseResults.map(result => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium truncate">{result.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {result.diagnosticCode && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">DC {result.diagnosticCode}</span>
                      )}
                      <span className="text-xs text-muted-foreground truncate">{result.category}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const vaCondition = getConditionById(result.id);
                      if (vaCondition) {
                        addCondition(vaCondition.id);
                      }
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remove Condition Confirmation Dialog */}
      <Dialog open={!!removeTarget} onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Condition</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {removeTarget?.name}? This will remove all associated evidence tracking for this condition.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRemoveCondition}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
