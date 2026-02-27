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
  Search, Plus, ChevronRight, AlertCircle,
  Link2, Trash2, Edit, Filter, Shield, FileText,
  Stethoscope, Calendar, PersonStanding, Compass, Calculator,
  Zap, AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useUserConditions } from '@/hooks/useUserConditions';
import { useClaims } from '@/hooks/useClaims';
import { useProfileStore } from '@/store/useProfileStore';
import { ClaimIntelligence, type Recommendation } from '@/services/claimIntelligence';
import useAppStore from '@/store/useAppStore';
import { PageContainer } from '@/components/PageContainer';
import { ConditionSelector } from '@/components/shared/ConditionSelector';
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
  pending: 'bg-gold/20 text-foreground border-gold/30',
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
  readinessScore?: number;
  onView: () => void;
  onRemove: () => void;
  onNavigate?: (path: string) => void;
}

function ReadinessRing({ score }: { score: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? 'text-green-500' : score >= 40 ? 'text-gold' : 'text-red-500';
  return (
    <div className="relative flex-shrink-0" title={`Readiness: ${score}%`}>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
        <circle
          cx="18" cy="18" r={r} fill="none" strokeWidth="3" strokeLinecap="round"
          stroke="currentColor" className={color}
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${color}`}>
        {score}
      </span>
    </div>
  );
}

function ConditionCard({ userCondition, conditionDetails, readinessScore, onView, onRemove, onNavigate }: ConditionCardProps) {
  const evidenceProgress = userCondition.evidenceTotal && userCondition.evidenceTotal > 0
    ? (userCondition.evidenceChecked || 0) / userCondition.evidenceTotal * 100
    : 0;

  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onView}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onView(); } }}
      tabIndex={0}
      role="button"
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
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-gold/10 text-foreground border-gold/30 flex-shrink-0">
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

          <div className="flex items-center gap-1 flex-shrink-0">
            {readinessScore !== undefined && userCondition.claimStatus !== 'approved' && (
              <ReadinessRing score={readinessScore} />
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
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
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => onNavigate(`/prep/exam?condition=${encodeURIComponent(conditionDetails.name)}`)}>
                <Stethoscope className="h-3 w-3 mr-1" />
                C&P Prep
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={() => onNavigate(`/prep/personal-statement?condition=${encodeURIComponent(conditionDetails.name)}`)}>
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

  const readinessScores = useMemo(() => {
    const scores: Record<string, number> = {};
    for (const uc of userConditions) {
      if (uc.claimStatus === 'approved') continue;
      const details = getConditionDetails(uc);
      if (details) {
        const r = ClaimIntelligence.getConditionReadiness(details.name, data);
        scores[uc.id] = r.overallScore;
      }
    }
    return scores;
  }, [userConditions, data, getConditionDetails]);

  const evidenceGaps = useMemo(() => {
    const claimConditions = data.claimConditions || [];
    const gaps: { conditionName: string; missing: string[]; conditionId?: string }[] = [];
    claimConditions.forEach((c) => {
      const matchingUserCondition = userConditions.find(uc => {
        const details = getConditionDetails(uc);
        return (details?.name && c.name && details.name.toLowerCase() === c.name.toLowerCase()) || uc.conditionId === c.id || uc.id === c.id;
      });
      if (matchingUserCondition?.claimStatus === 'approved') return;
      const missing: string[] = [];
      if (c.linkedMedicalVisits.length === 0) missing.push('Medical records');
      if (c.linkedSymptoms.length === 0) missing.push('Symptom logs');
      if (c.linkedBuddyContacts.length === 0) missing.push('Buddy statements');
      if (missing.length > 0) {
        // Use the userCondition ID for navigation (matches ConditionDetail param)
        gaps.push({ conditionName: c.name, missing, conditionId: matchingUserCondition?.id || c.id });
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
  const [previewRec, setPreviewRec] = useState<Recommendation | null>(null);
  const previewCondition = previewRec ? getConditionById(previewRec.conditionId) : null;

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
          className="w-full rounded-xl p-3 text-left bg-[rgba(240,192,0,0.08)] border border-gold/20 hover:bg-[rgba(240,192,0,0.12)] transition-colors"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {evidenceGaps.length} condition{evidenceGaps.length !== 1 ? 's' : ''} need more evidence
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {evidenceGaps[0]?.conditionName}: missing {evidenceGaps[0]?.missing?.join(', ')}
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
              <ConditionSelector
                onSelect={(selected) => {
                  const vaCondition = getConditionById(selected.conditionId);
                  if (vaCondition) {
                    setSelectedCondition(vaCondition);
                  } else {
                    // Fallback for non-DB conditions (MOS/presumptive)
                    setSelectedCondition({ id: selected.conditionId || selected.name, name: selected.name, abbreviation: selected.name, category: 'other', diagnosticCode: '', typicalRatings: '', description: '', commonSecondaries: [], keywords: [], bodySystem: '' } as VACondition);
                  }
                }}
                label="Condition Name"
                placeholder="Search conditions (e.g., PTSD, Tinnitus)"
                excludeIds={userConditions.map(c => c.conditionId)}
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
            aria-label="Search conditions"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary conditions */}
          {filteredConditions.filter(uc => uc.isPrimary).map(uc => {
            const details = getConditionDetails(uc);
            const secondaries = filteredConditions.filter(s => !s.isPrimary && s.linkedPrimaryId === uc.id);
            const checked = conditionEvidenceChecks[uc.id] || [];
            return (
              <div key={uc.id} className="space-y-2">
                  <ConditionCard
                    userCondition={{
                      ...uc,
                      hasSecondaries: secondaries.length > 0,
                      secondariesCount: secondaries.length,
                      evidenceChecked: checked.length,
                      evidenceTotal: EVIDENCE_TOTAL,
                    }}
                    conditionDetails={details ?? null}
                    readinessScore={readinessScores[uc.id]}
                    onView={() => handleViewCondition(uc.id)}
                    onRemove={() => handleRemoveCondition(uc.id)}
                    onNavigate={(path) => navigate(path)}
                  />
                {secondaries.length > 0 && (
                  <div className="ml-6 border-l-2 border-primary/20 pl-4 space-y-3">
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
                            readinessScore={readinessScores[sec.id]}
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
                <ConditionCard
                  key={uc.id}
                  userCondition={{
                    ...uc,
                    hasSecondaries: false,
                    secondariesCount: 0,
                    evidenceChecked: checked.length,
                    evidenceTotal: EVIDENCE_TOTAL,
                  }}
                  conditionDetails={details ?? null}
                  readinessScore={readinessScores[uc.id]}
                  onView={() => handleViewCondition(uc.id)}
                  onRemove={() => handleRemoveCondition(uc.id)}
                  onNavigate={(path) => navigate(path)}
                />
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
                  onClick={() => setPreviewRec(rec)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-gold/30 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-foreground truncate">{rec.conditionName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 break-words">
                      {diagnosticCodeResult ? `DC ${diagnosticCodeResult.code} · ` : ''}{rec.reason}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gold flex-shrink-0" />
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

      {/* Condition Preview Dialog */}
      <Dialog open={!!previewRec} onOpenChange={(open) => { if (!open) setPreviewRec(null); }}>
        <DialogContent className="max-w-[92vw] sm:max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>{previewRec?.conditionName}</DialogTitle>
            <DialogDescription>
              {previewCondition?.description || previewRec?.reason}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-6 py-3 text-sm">
            {previewCondition?.diagnosticCode && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="whitespace-nowrap">DC {previewCondition.diagnosticCode}</Badge>
                {previewCondition.typicalRatings && (
                  <Badge variant="outline" className="whitespace-nowrap">{previewCondition.typicalRatings}</Badge>
                )}
              </div>
            )}
            {previewCondition?.bodySystem && (
              <p className="text-muted-foreground break-words">
                <span className="font-medium text-foreground">Body System:</span> {previewCondition.bodySystem}
              </p>
            )}
            {previewRec?.reason && (
              <p className="text-muted-foreground break-words">
                <span className="font-medium text-foreground">Why consider this:</span> {previewRec.reason}
              </p>
            )}
            {previewCondition?.commonSecondaries && previewCondition.commonSecondaries.length > 0 && (
              <div>
                <p className="font-medium text-foreground mb-1.5">Common Secondaries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {previewCondition.commonSecondaries.slice(0, 5).map(s => {
                    const sec = getConditionById(s);
                    return (
                      <Badge key={s} variant="secondary" className="text-xs whitespace-nowrap">
                        {sec?.name || s}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 px-6 pb-6 pt-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setPreviewRec(null)}>Not Now</Button>
            <Button className="w-full sm:w-auto" onClick={() => {
              if (previewRec) addCondition(previewRec.conditionId);
              setPreviewRec(null);
            }}>
              <Plus className="h-4 w-4 mr-1" />
              Add to My Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
