import { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Briefcase, Plus, Trash2, ChevronDown, ChevronUp, 
  Stethoscope, AlertTriangle, Activity, Users, FileDown,
} from 'lucide-react';
import { EvidenceStrengthIndicator } from './EvidenceStrengthIndicator';
import { getStrengthLevel, calculateEvidenceStrength } from './EvidenceStrengthIndicator.utils';
import { RelatedConditions } from './RelatedConditions';
import { EvidenceGapAnalysis } from './EvidenceGapAnalysis';
import { ConditionSearchInput } from '@/components/shared/ConditionSearchInput';
import { exportConditionEvidence } from '@/utils/pdfExport';
import { toast } from 'sonner';
import type { ClaimCondition } from '@/types/claims';

export function ClaimBuilder() {
  const { data, addClaimCondition, updateClaimCondition, deleteClaimCondition } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [newConditionName, setNewConditionName] = useState('');
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);
  const [showAllMedicalVisits, setShowAllMedicalVisits] = useState(false);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);

  const claimConditions = data.claimConditions || [];

  const handleAddCondition = () => {
    if (!newConditionName.trim()) return;
    addClaimCondition({
      name: newConditionName.trim(),
      linkedMedicalVisits: [],
      linkedExposures: [],
      linkedSymptoms: [],
      linkedDocuments: [],
      linkedBuddyContacts: [],
      notes: '',
      createdAt: new Date().toISOString(),
    });
    setNewConditionName('');
    setIsOpen(false);
  };

  const toggleLink = (conditionId: string, type: 'medicalVisits' | 'exposures' | 'symptoms' | 'buddyContacts', itemId: string) => {
    const condition = claimConditions.find(c => c.id === conditionId);
    if (!condition) return;

    const fieldMap = {
      medicalVisits: 'linkedMedicalVisits',
      exposures: 'linkedExposures',
      symptoms: 'linkedSymptoms',
      buddyContacts: 'linkedBuddyContacts',
    } as const;

    const field = fieldMap[type];
    const currentLinks = condition[field] || [];
    const newLinks = currentLinks.includes(itemId)
      ? currentLinks.filter(id => id !== itemId)
      : [...currentLinks, itemId];

    updateClaimCondition(conditionId, { [field]: newLinks });
  };

  const handleExportEvidence = (condition: ClaimCondition, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const strength = calculateEvidenceStrength(condition, data);
    
    // Get linked items
    const linkedSymptoms = data.symptoms.filter(s => condition.linkedSymptoms.includes(s.id));
    const linkedMedicalVisits = data.medicalVisits.filter(v => condition.linkedMedicalVisits.includes(v.id));
    const linkedExposures = data.exposures.filter(e => condition.linkedExposures.includes(e.id));
    const linkedBuddyContacts = data.buddyContacts.filter(b => condition.linkedBuddyContacts.includes(b.id));
    
    // Get medications related to this condition
    const linkedMedications = data.medications.filter(med => 
      med.prescribedFor.toLowerCase().includes(condition.name.toLowerCase()) ||
      condition.name.toLowerCase().includes(med.prescribedFor.toLowerCase())
    );
    
    exportConditionEvidence(
      condition.name,
      condition.createdAt,
      strength.score,
      linkedSymptoms,
      linkedMedicalVisits,
      linkedMedications,
      linkedExposures,
      linkedBuddyContacts
    );
    
    toast.success(`Evidence package exported for ${condition.name}`);
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Conditions You're Claiming
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Condition to Claim</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Condition Name</Label>
                  <ConditionSearchInput
                    value={newConditionName}
                    onChange={setNewConditionName}
                    placeholder="Type to search VA conditions..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Search shows VA diagnostic codes. You can also type a custom name.
                  </p>
                </div>
                <Button onClick={handleAddCondition} className="w-full" disabled={!newConditionName.trim()}>
                  Add Condition
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Build evidence for each condition to strengthen your claim
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {claimConditions.length === 0 ? (
          <div className="text-center py-6">
            <Briefcase className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No conditions added yet.</p>
            <p className="text-xs text-muted-foreground">Add conditions you plan to claim and link supporting evidence.</p>
          </div>
        ) : (
          claimConditions.map((condition) => {
            const isExpanded = expandedCondition === condition.id;
            const strength = calculateEvidenceStrength(condition, data);
            const level = getStrengthLevel(strength.score);
            
            return (
              <div 
                key={condition.id} 
                className={`border rounded-lg overflow-hidden transition-colors ${level.bgClass} border-opacity-50`}
              >
                {/* Collapsed Header */}
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => setExpandedCondition(isExpanded ? null : condition.id)}
                >
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`inline-block h-3 w-3 rounded-full flex-shrink-0 ${
                          strength.score >= 75 ? 'bg-green-500' : strength.score >= 50 ? 'bg-gold' : 'bg-red-500'
                        }`}
                        aria-label={level.label}
                      />
                      <div>
                        <h4 className="font-semibold text-foreground truncate">{condition.name}</h4>
                        <span className={`text-xs ${level.textClass}`}>{level.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 gap-1 text-xs"
                        onClick={(e) => handleExportEvidence(condition, e)}
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        Export
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClaimCondition(condition.id);
                        }}
                        aria-label="Remove condition"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                  
                  {/* Evidence Strength Indicator */}
                  <EvidenceStrengthIndicator 
                    condition={condition} 
                    data={data}
                    compact={false}
                  />
                  
                  {/* Related Conditions (Anti-Pyramiding Compliant) */}
                  <RelatedConditions 
                    conditionName={condition.name}
                    existingConditionNames={claimConditions.map(c => c.name)}
                  />
                  
                  {/* Evidence Gap Analysis */}
                  <EvidenceGapAnalysis condition={condition} data={data} />
                </div>

                {/* Expanded Content - Link Evidence */}
                {isExpanded && (
                  <div className="p-3 border-t bg-background/50 space-y-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Link your logged evidence to this condition:
                    </p>

                    {/* Link Medical Visits */}
                    {data.medicalVisits.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" /> Medical Visits
                        </p>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {(showAllMedicalVisits ? data.medicalVisits : data.medicalVisits.slice(0, 5)).map((visit) => (
                            <div key={visit.id} className="flex items-center gap-2 text-xs">
                              <Checkbox
                                checked={condition.linkedMedicalVisits.includes(visit.id)}
                                onCheckedChange={() => toggleLink(condition.id, 'medicalVisits', visit.id)}
                              />
                              <span className="truncate">
                                {new Date(visit.date).toLocaleDateString()} - {visit.reason || visit.visitType}
                              </span>
                            </div>
                          ))}
                        </div>
                        {data.medicalVisits.length > 5 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs w-full"
                            onClick={(e) => { e.stopPropagation(); setShowAllMedicalVisits(!showAllMedicalVisits); }}
                          >
                            {showAllMedicalVisits ? 'Show Less' : `Show All (${data.medicalVisits.length})`}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Link Exposures */}
                    {data.exposures.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Exposures
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {data.exposures.map((exposure) => (
                            <div key={exposure.id} className="flex items-center gap-2 text-xs">
                              <Checkbox
                                checked={condition.linkedExposures.includes(exposure.id)}
                                onCheckedChange={() => toggleLink(condition.id, 'exposures', exposure.id)}
                              />
                              <span className="truncate">{exposure.type} - {exposure.location}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Link Symptoms */}
                    {data.symptoms.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <Activity className="h-3 w-3" /> Symptoms
                        </p>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {(showAllSymptoms ? data.symptoms : data.symptoms.slice(0, 5)).map((symptom) => (
                            <div key={symptom.id} className="flex items-center gap-2 text-xs">
                              <Checkbox
                                checked={condition.linkedSymptoms.includes(symptom.id)}
                                onCheckedChange={() => toggleLink(condition.id, 'symptoms', symptom.id)}
                              />
                              <span className="truncate">{symptom.symptom} ({symptom.bodyArea})</span>
                            </div>
                          ))}
                        </div>
                        {data.symptoms.length > 5 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs w-full"
                            onClick={(e) => { e.stopPropagation(); setShowAllSymptoms(!showAllSymptoms); }}
                          >
                            {showAllSymptoms ? 'Show Less' : `Show All (${data.symptoms.length})`}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Link Buddy Contacts */}
                    {data.buddyContacts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <Users className="h-3 w-3" /> Buddy Statements
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {data.buddyContacts.map((buddy) => (
                            <div key={buddy.id} className="flex items-center gap-2 text-xs">
                              <Checkbox
                                checked={condition.linkedBuddyContacts.includes(buddy.id)}
                                onCheckedChange={() => toggleLink(condition.id, 'buddyContacts', buddy.id)}
                              />
                              <span className="truncate">{buddy.name} ({buddy.rank})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {data.medicalVisits.length === 0 && 
                     data.exposures.length === 0 && 
                     data.symptoms.length === 0 && 
                     data.buddyContacts.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        No evidence logged yet. Use the "What's Missing" links above to start logging.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
