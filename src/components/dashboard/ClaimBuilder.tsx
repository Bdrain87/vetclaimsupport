import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Briefcase, Plus, Trash2, ChevronDown, ChevronUp, 
  Stethoscope, AlertTriangle, Activity, Users, FileCheck,
  CheckCircle2, Circle
} from 'lucide-react';
import type { ClaimCondition } from '@/types/claims';

export function ClaimBuilder() {
  const { data, addClaimCondition, updateClaimCondition, deleteClaimCondition } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [newConditionName, setNewConditionName] = useState('');
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);

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

  const getEvidenceScore = (condition: ClaimCondition) => {
    let score = 0;
    if (condition.linkedMedicalVisits.length > 0) score += 25;
    if (condition.linkedExposures.length > 0) score += 25;
    if (condition.linkedSymptoms.length > 0) score += 25;
    if (condition.linkedBuddyContacts.length > 0) score += 25;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Claim Builder
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Condition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Condition to Claim</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Condition Name</Label>
                  <Input
                    placeholder="e.g., Tinnitus, PTSD, Lower Back Pain"
                    value={newConditionName}
                    onChange={(e) => setNewConditionName(e.target.value)}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 300);
                    }}
                  />
                </div>
                <Button onClick={handleAddCondition} className="w-full" disabled={!newConditionName.trim()}>
                  Add Condition
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Link your evidence to specific conditions you're claiming
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
            const score = getEvidenceScore(condition);
            
            return (
              <div key={condition.id} className="border rounded-lg overflow-hidden">
                <div
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30"
                  onClick={() => setExpandedCondition(isExpanded ? null : condition.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{condition.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={getScoreColor(score)}>{score}% evidence linked</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClaimCondition(condition.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3 border-t bg-muted/10 space-y-4">
                    {/* Evidence Checklist */}
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {condition.linkedMedicalVisits.length > 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Medical Visits ({condition.linkedMedicalVisits.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {condition.linkedExposures.length > 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Exposures ({condition.linkedExposures.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {condition.linkedSymptoms.length > 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Symptoms ({condition.linkedSymptoms.length})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {condition.linkedBuddyContacts.length > 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Buddy Statements ({condition.linkedBuddyContacts.length})</span>
                      </div>
                    </div>

                    {/* Link Medical Visits */}
                    {data.medicalVisits.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" /> Link Medical Visits
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {data.medicalVisits.slice(0, 5).map((visit) => (
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
                      </div>
                    )}

                    {/* Link Exposures */}
                    {data.exposures.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Link Exposures
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
                          <Activity className="h-3 w-3" /> Link Symptoms
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {data.symptoms.slice(0, 5).map((symptom) => (
                            <div key={symptom.id} className="flex items-center gap-2 text-xs">
                              <Checkbox
                                checked={condition.linkedSymptoms.includes(symptom.id)}
                                onCheckedChange={() => toggleLink(condition.id, 'symptoms', symptom.id)}
                              />
                              <span className="truncate">{symptom.symptom} ({symptom.bodyArea})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Link Buddy Contacts */}
                    {data.buddyContacts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <Users className="h-3 w-3" /> Link Buddy Statements
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
