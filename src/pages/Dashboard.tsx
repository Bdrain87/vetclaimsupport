import { useClaims } from '@/context/ClaimsContext';
import { 
  Stethoscope, 
  AlertTriangle, 
  Activity, 
  Pill,
  FileWarning,
  ShieldCheck,
  ChevronRight,
  Plus,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  Users,
} from 'lucide-react';
import { BDDCountdown } from '@/components/dashboard/BDDCountdown';
import { RatingCalculator } from '@/components/dashboard/RatingCalculator';

import { IntentToFileCard } from '@/components/dashboard/IntentToFileCard';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { MobileNavGrid } from '@/components/dashboard/MobileNavGrid';
import { QuickLogWidget } from '@/components/dashboard/QuickLogWidget';
import { EvidenceGapAnalyzer } from '@/components/dashboard/EvidenceGapAnalyzer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ConditionsExplorer } from '@/components/dashboard/ConditionsExplorer';
import { SymptomPatterns } from '@/components/dashboard/SymptomPatterns';
import { SymptomInsights } from '@/components/dashboard/SymptomInsights';
import { DeadlinesReminders } from '@/components/dashboard/DeadlinesReminders';
import { ClaimsJourneyRoadmap } from '@/components/dashboard/ClaimsJourneyRoadmap';
import { ContextualGuidance } from '@/components/dashboard/ContextualGuidance';
import { GuidedActionBanner } from '@/components/dashboard/GuidedActionBanner';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ConditionSearchInput, getDiagnosticCodeForCondition } from '@/components/shared/ConditionSearchInput';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { data, setSeparationDate, addClaimCondition, deleteClaimCondition, updateClaimCondition } = useClaims();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newConditionName, setNewConditionName] = useState('');
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(null);

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
    setIsAddOpen(false);
  };

  const getEvidenceScore = (condition: typeof claimConditions[0]) => {
    let score = 0;
    if (condition.linkedMedicalVisits.length > 0) score += 25;
    if (condition.linkedExposures.length > 0) score += 25;
    if (condition.linkedSymptoms.length > 0) score += 25;
    if (condition.linkedBuddyContacts.length > 0) score += 25;
    return score;
  };

  const handleQuickAddCondition = (conditionName: string) => {
    // Check if already added
    if (claimConditions.some(c => c.name.toLowerCase() === conditionName.toLowerCase())) {
      toast({
        title: 'Already tracking',
        description: `${conditionName} is already in your conditions list`,
      });
      return;
    }
    
    addClaimCondition({
      name: conditionName,
      linkedMedicalVisits: [],
      linkedExposures: [],
      linkedSymptoms: [],
      linkedDocuments: [],
      linkedBuddyContacts: [],
      notes: '',
      createdAt: new Date().toISOString(),
    });
    
    toast({
      title: 'Condition added',
      description: `${conditionName} added - tap to link evidence`,
    });
    
    // Auto-expand the newly added condition
    const newId = Date.now().toString(); // This matches how IDs are typically generated
    setTimeout(() => {
      const addedCondition = data.claimConditions?.find(c => c.name === conditionName);
      if (addedCondition) {
        setExpandedConditionId(addedCondition.id);
      }
    }, 100);
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

  // Removed COMMON_CONDITIONS logic - now handled by ConditionsExplorer

  const stats = [
    { title: 'Medical', value: data.medicalVisits.length, icon: Stethoscope, href: '/medical-visits' },
    { title: 'Exposures', value: data.exposures.length, icon: AlertTriangle, href: '/exposures' },
    { title: 'Symptoms', value: data.symptoms.length, icon: Activity, href: '/symptoms' },
    { title: 'Meds', value: data.medications.length, icon: Pill, href: '/medications' },
  ];

  const missingSummaries = data.medicalVisits.filter(v => !v.gotAfterVisitSummary).length;
  const documentsObtained = data.documents.filter(d => d.status === 'Obtained' || d.status === 'Submitted').length;
  const buddyStatements = data.buddyContacts.filter(b => b.statementStatus === 'Received' || b.statementStatus === 'Submitted').length;

  const separationDate = data.separationDate ? new Date(data.separationDate) : null;
  
  const handleSeparationDateChange = (date: Date | null) => {
    setSeparationDate(date ? date.toISOString() : null);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-8 md:pb-4 overflow-x-hidden max-w-full">
      {/* Hero Header with Native Share */}
      <DashboardHeader />

      {/* GUIDED ACTION BANNER - What to do next */}
      <GuidedActionBanner onOpenAddCondition={() => setIsAddOpen(true)} />

      {/* CLAIMS JOURNEY ROADMAP - Visual progress */}
      <ClaimsJourneyRoadmap />

      {/* CONTEXTUAL GUIDANCE - Smart nudges */}
      <ContextualGuidance onOpenAddCondition={() => setIsAddOpen(true)} />

      {/* CONDITIONS WORTH EXPLORING - Unified Smart Section */}
      <ConditionsExplorer 
        claimConditions={claimConditions}
        onAddCondition={handleQuickAddCondition}
      />

      {/* CONDITIONS - THE FOCAL POINT */}
      <div className={cn(
        "rounded-2xl overflow-hidden",
        "bg-card shadow-sm",
        "border border-primary/20"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Conditions You're Claiming</h2>
            </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1 h-10 min-h-[44px] px-3">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Condition to Claim</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>What condition are you claiming?</Label>
                    <ConditionSearchInput
                      value={newConditionName}
                      onChange={setNewConditionName}
                      placeholder="Type to search VA conditions (e.g., elbow, tinnitus)..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Search shows VA diagnostic codes. You can also type a custom condition name.
                    </p>
                  </div>
                  <Button onClick={handleAddCondition} className="w-full" disabled={!newConditionName.trim()}>
                    Add Condition
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {claimConditions.length === 0 ? (
            <div className="text-center py-6">
              <Target className="h-10 w-10 text-primary/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No conditions added yet</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-[280px] mx-auto">
                Start by adding the disabilities or conditions you're claiming. Then track evidence for each one.
              </p>
              <Button onClick={() => setIsAddOpen(true)} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Your First Condition
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {claimConditions.map((condition) => {
                const score = getEvidenceScore(condition);
                const scoreColor = score >= 75 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-muted-foreground';
                const isExpanded = expandedConditionId === condition.id;
                
                return (
                  <div
                    key={condition.id}
                    className={cn(
                      "rounded-xl overflow-hidden",
                      "bg-secondary",
                      "border border-border",
                      "transition-all duration-200",
                      isExpanded && "border-primary/30"
                    )}
                  >
                    {/* Condition Header - Tappable */}
                    <button
                      onClick={() => setExpandedConditionId(isExpanded ? null : condition.id)}
                      className={cn(
                        "w-full flex items-center justify-between",
                        "p-3",
                        "transition-all duration-200",
                        "hover:bg-muted",
                        "active:scale-[0.99]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn(
                          "flex items-center justify-center h-9 w-9 rounded-full flex-shrink-0",
                          score >= 75 ? "bg-success/20" : score >= 50 ? "bg-warning/20" : "bg-muted/30"
                        )}>
                          {score >= 75 ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="font-medium text-foreground truncate">{condition.name}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={scoreColor}>{score}% evidence</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {condition.linkedMedicalVisits.length + condition.linkedSymptoms.length + condition.linkedExposures.length + condition.linkedBuddyContacts.length} items
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <ChevronDown className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )} />
                      </div>
                    </button>

                    {/* Expanded Evidence Linking */}
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-3 border-t border-border">
                        {/* Evidence Categories */}
                        <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <Stethoscope className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{condition.linkedMedicalVisits.length} Medical</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <Activity className="h-4 w-4 text-success" />
                            <span className="text-foreground">{condition.linkedSymptoms.length} Symptoms</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <span className="text-foreground">{condition.linkedExposures.length} Exposures</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-foreground">{condition.linkedBuddyContacts.length} Buddies</span>
                          </div>
                        </div>

                        {/* Link Medical Visits */}
                        {data.medicalVisits.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <Stethoscope className="h-3 w-3" /> Link Medical Visits
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.medicalVisits.slice(0, 5).map((visit) => (
                                <label key={visit.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedMedicalVisits.includes(visit.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'medicalVisits', visit.id)}
                                  />
                                  <span className="truncate">
                                    {new Date(visit.date).toLocaleDateString()} - {visit.reason || visit.visitType}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Link Symptoms */}
                        {data.symptoms.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <Activity className="h-3 w-3" /> Link Symptoms
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.symptoms.slice(0, 5).map((symptom) => (
                                <label key={symptom.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedSymptoms.includes(symptom.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'symptoms', symptom.id)}
                                  />
                                  <span className="truncate">{symptom.symptom} ({symptom.bodyArea})</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Link Exposures */}
                        {data.exposures.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <AlertTriangle className="h-3 w-3" /> Link Exposures
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.exposures.map((exposure) => (
                                <label key={exposure.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedExposures.includes(exposure.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'exposures', exposure.id)}
                                  />
                                  <span className="truncate">{exposure.type} - {exposure.location}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Link Buddy Contacts */}
                        {data.buddyContacts.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                              <Users className="h-3 w-3" /> Link Buddy Statements
                            </p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {data.buddyContacts.map((buddy) => (
                                <label key={buddy.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-muted cursor-pointer">
                                  <Checkbox
                                    checked={condition.linkedBuddyContacts.includes(buddy.id)}
                                    onCheckedChange={() => toggleLink(condition.id, 'buddyContacts', buddy.id)}
                                  />
                                  <span className="truncate">{buddy.name} ({buddy.rank})</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No evidence prompt */}
                        {data.medicalVisits.length === 0 && data.symptoms.length === 0 && data.exposures.length === 0 && data.buddyContacts.length === 0 && (
                          <div className="text-center py-3">
                            <p className="text-xs text-muted-foreground mb-2">No evidence logged yet</p>
                            <Button size="sm" variant="outline" onClick={() => navigate('/symptoms')} className="text-xs h-10 min-h-[44px]">
                              Start Logging Evidence
                            </Button>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 min-h-[44px] text-xs text-destructive hover:text-destructive px-3"
                            onClick={() => deleteClaimCondition(condition.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 min-h-[44px] text-xs px-3"
                            onClick={() => navigate('/medical-visits')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Evidence
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Quick add more */}
              <button
                onClick={() => setIsAddOpen(true)}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "p-3 rounded-xl",
                  "border border-dashed border-primary/30",
                  "text-primary text-sm",
                  "transition-all duration-200",
                  "hover:bg-primary/5 hover:border-primary/50",
                  "active:scale-[0.98]"
                )}
              >
                <Plus className="h-4 w-4" />
                Add another condition
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Stats - 2x2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            to={stat.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5",
              "min-h-[88px] p-4 rounded-2xl",
              "bg-card border border-border shadow-sm",
              "transition-all duration-300 ease-out",
              "active:scale-95 active:bg-secondary",
              "hover:bg-secondary"
            )}
          >
            <stat.icon className="h-5 w-5 text-foreground" />
            <p className="text-2xl font-bold text-foreground number-display">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Log - Compact inline */}
      <QuickLogWidget />

      {/* Navigation Grid - Hidden on mobile */}
      <div className="hidden md:block">
        <MobileNavGrid />
      </div>

      {/* Evidence Status - 2x2 mobile, 3 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className={cn(
          "flex flex-col items-center justify-center gap-1.5",
          "min-h-[80px] p-4 rounded-2xl",
          "bg-card border border-border shadow-sm",
          "transition-all duration-300 ease-out"
        )}>
          <FileWarning className="h-5 w-5 text-foreground" />
          <span className="text-xl font-bold text-foreground">
            {data.medicalVisits.length - missingSummaries}/{data.medicalVisits.length}
          </span>
          <span className="text-xs text-muted-foreground text-center">Summaries</span>
        </div>
        <div className={cn(
          "flex flex-col items-center justify-center gap-1.5",
          "min-h-[80px] p-4 rounded-2xl",
          "bg-card border border-border shadow-sm",
          "transition-all duration-300 ease-out"
        )}>
          <Activity className="h-5 w-5 text-foreground" />
          <span className="text-xl font-bold text-foreground">{documentsObtained}/{data.documents.length}</span>
          <span className="text-xs text-muted-foreground text-center">Documents</span>
        </div>
        <div className={cn(
          "flex flex-col items-center justify-center gap-1.5",
          "min-h-[80px] p-4 rounded-2xl",
          "bg-card border border-border shadow-sm",
          "transition-all duration-300 ease-out",
          "col-span-2 sm:col-span-1"
        )}>
          <ShieldCheck className="h-5 w-5 text-foreground" />
          <span className="text-xl font-bold text-foreground">{buddyStatements}</span>
          <span className="text-xs text-muted-foreground text-center">Buddy Statements</span>
        </div>
      </div>

      {/* Symptom Insights */}
      <SymptomInsights />

      {/* Symptom Patterns */}
      <SymptomPatterns />

      {/* Deadlines & Reminders */}
      <DeadlinesReminders />

      {/* Intent to File Card */}
      <IntentToFileCard />

      {/* BDD & Calculator */}
      <div className="grid gap-3 lg:grid-cols-2">
        <BDDCountdown 
          separationDate={separationDate} 
          onSeparationDateChange={handleSeparationDateChange} 
        />
        <RatingCalculator />
      </div>

      {/* Collapsible More Tools */}
      <details className="group">
        <summary className={cn(
          "flex items-center justify-between",
          "min-h-[48px] px-4 py-3 rounded-2xl",
          "bg-card border border-border shadow-sm",
          "cursor-pointer list-none",
          "transition-all duration-300 ease-out",
          "hover:bg-secondary",
          "active:scale-[0.98]"
        )}>
          <span className="text-sm font-medium text-foreground">More Tools</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform duration-300" />
        </summary>
        <div className="mt-3 space-y-3">
          <DashboardInsights />
          <EvidenceGapAnalyzer />
        </div>
      </details>
    </div>
  );
}