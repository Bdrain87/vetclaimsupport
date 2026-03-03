import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useEvidence } from '@/hooks/useEvidence';
import { useFeatureFlag } from '@/store/useFeatureFlagStore';
import { safeFormatDate } from '@/utils/dateUtils';
import { Pill, Plus, Trash2, Edit, Calendar, AlertCircle, Download, Loader2, Info, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MedicationCombobox } from '@/components/ui/medication-combobox';
import { exportMedications } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { PageContainer } from '@/components/PageContainer';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import type { Medication } from '@/types/claims';

const EFFECTIVENESS_OPTIONS = [
  { value: '', label: 'Not assessed' },
  { value: 'effective', label: 'Effective' },
  { value: 'partially_effective', label: 'Partially effective' },
  { value: 'not_effective', label: 'Not effective' },
] as const;

const EFFECTIVENESS_COLORS: Record<string, string> = {
  effective: 'text-success',
  partially_effective: 'text-gold',
  not_effective: 'text-destructive',
};

export default function Medications() {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const { data, addMedication, updateMedication, deleteMedication } = useClaims();
  const { documents, setAllDocuments } = useEvidence();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const showSideEffectStats = useFeatureFlag('medicationSideEffectStats');
  const { conditions: userConditions } = useUserConditions();
  const [formData, setFormData] = useState<Omit<Medication, 'id'>>({
    startDate: '',
    endDate: '',
    name: '',
    prescribedFor: '',
    sideEffects: '',
    stillTaking: false,
    dosage: '',
    frequency: '',
    prescriber: '',
    effectiveness: '',
    conditionTags: [],
    functionalImpactOnMed: '',
    functionalImpactOffMed: '',
  });

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      name: '',
      prescribedFor: '',
      sideEffects: '',
      stillTaking: false,
      dosage: '',
      frequency: '',
      prescriber: '',
      effectiveness: '',
      conditionTags: [],
      functionalImpactOnMed: '',
      functionalImpactOffMed: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMedication(editingId, formData);
    } else {
      addMedication(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (medication: Medication) => {
    setFormData({
      startDate: medication.startDate,
      endDate: medication.endDate,
      name: medication.name,
      prescribedFor: medication.prescribedFor,
      sideEffects: medication.sideEffects,
      stillTaking: medication.stillTaking,
      dosage: medication.dosage || '',
      frequency: medication.frequency || '',
      prescriber: medication.prescriber || '',
      effectiveness: medication.effectiveness || '',
      conditionTags: medication.conditionTags || [],
      functionalImpactOnMed: medication.functionalImpactOnMed || '',
      functionalImpactOffMed: medication.functionalImpactOffMed || '',
    });
    setEditingId(medication.id);
    setIsOpen(true);
  };

  const sortByDate = (a: Medication, b: Medication) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  const currentMeds = data.medications.filter(m => m.stillTaking).sort(sortByDate);
  const pastMeds = data.medications.filter(m => !m.stillTaking).sort(sortByDate);

  // Side-effect summary stats
  const sideEffectStats = useMemo(() => {
    const withSideEffects = data.medications.filter(m => m.sideEffects && m.sideEffects.trim().length > 0);
    const currentWithSideEffects = currentMeds.filter(m => m.sideEffects && m.sideEffects.trim().length > 0);
    return {
      total: data.medications.length,
      withSideEffects: withSideEffects.length,
      currentWithSideEffects: currentWithSideEffects.length,
    };
  }, [data.medications, currentMeds]);

  const renderMedCard = (med: Medication, isActive: boolean, index: number) => (
    <Card
      key={med.id}
      className={`data-card group hover:border-primary/30 transition-all duration-300 animate-fade-in ${!isActive ? 'opacity-75' : ''}`}
      style={isActive ? { animationDelay: `${index * 0.05}s` } : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          {isActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
              Discontinued
            </span>
          )}
          <div className={`flex gap-1 ${isActive ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px]" onClick={() => handleEdit(med)} aria-label="Edit medication">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px]" onClick={() => setDeleteTarget(med.id)} aria-label="Delete medication">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        <CardTitle className={`text-base mt-2 break-words line-clamp-2 ${isActive ? 'group-hover:text-primary transition-colors' : ''}`}>{med.name}</CardTitle>
        {med.dosage && (
          <p className="text-xs text-muted-foreground">{med.dosage}{med.frequency ? ` · ${med.frequency}` : ''}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {med.prescribedFor && (
          <p className="text-muted-foreground line-clamp-1">For: <span className="text-foreground">{med.prescribedFor}</span></p>
        )}
        {med.conditionTags && med.conditionTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {med.conditionTags.map((tagId) => {
              const uc = userConditions.find((c) => c.id === tagId);
              return (
                <span key={tagId} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                  {uc ? getConditionDisplayName(uc) : tagId}
                </span>
              );
            })}
          </div>
        )}
        {med.prescriber && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Stethoscope className="h-3.5 w-3.5" />
            <span className="text-xs">{med.prescriber}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {isActive
            ? `Since ${safeFormatDate(med.startDate)}`
            : `${safeFormatDate(med.startDate)} - ${safeFormatDate(med.endDate)}`
          }
        </div>
        {med.effectiveness && med.effectiveness !== '' && (
          <span className={`text-xs font-medium ${EFFECTIVENESS_COLORS[med.effectiveness] || 'text-muted-foreground'}`}>
            {EFFECTIVENESS_OPTIONS.find(o => o.value === med.effectiveness)?.label}
          </span>
        )}
        {med.sideEffects && (
          <div className={`flex items-start gap-2 ${isActive ? 'text-destructive/80 bg-destructive/5 border border-destructive/10 rounded-xl p-3' : 'text-muted-foreground bg-muted/50 rounded p-2'} mt-2`}>
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="text-xs line-clamp-3">{med.sideEffects}</span>
          </div>
        )}
        <EvidenceThumbnails
          entryType="medication"
          entryId={med.id}
          documents={documents}
        />
      </CardContent>
    </Card>
  );

  return (
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-medications/10">
            <Pill className="h-5 w-5 text-medications" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medications</h1>
            <p className="text-muted-foreground text-sm">Track prescriptions and their effects</p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" disabled={exporting} onClick={async () => {
            setExporting(true);
            try { await exportMedications(data.medications); } catch (err) { toast({ title: 'Export failed', description: err instanceof Error ? err.message : 'Could not generate PDF. Please try again.', variant: 'destructive' }); } finally { setExporting(false); }
          }} className="gap-2">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>

          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Medication
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
              <DialogDescription className="sr-only">Enter medication details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">

              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <MedicationCombobox
                  value={formData.name}
                  onValueChange={(name, prescribedFor) => {
                    setFormData({
                      ...formData,
                      name,
                      prescribedFor: prescribedFor && !formData.prescribedFor ? prescribedFor : formData.prescribedFor
                    });
                  }}
                  placeholder="Search or type medication name..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Search common VA/military medications or type a custom name
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 50mg, 10ml"
                    value={formData.dosage || ''}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., twice daily, as needed"
                    value={formData.frequency || ''}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  />
                </div>
              </div>

              {/* Prescriber */}
              <div className="space-y-2">
                <Label htmlFor="prescriber">Prescriber</Label>
                <Input
                  id="prescriber"
                  placeholder="e.g., Dr. Smith, VA Medical Center"
                  value={formData.prescriber || ''}
                  onChange={(e) => setFormData({ ...formData, prescriber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescribedFor">Prescribed For</Label>
                <Input
                  id="prescribedFor"
                  placeholder="Condition being treated"
                  value={formData.prescribedFor}
                  onChange={(e) => setFormData({ ...formData, prescribedFor: e.target.value })}
                />
              </div>

              {/* Linked Conditions — conditionTags chip selector */}
              {userConditions.length > 0 && (
                <div className="space-y-2">
                  <Label>Link to Conditions</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {userConditions.map((uc) => {
                      const name = getConditionDisplayName(uc);
                      const isSelected = formData.conditionTags?.includes(uc.id) ?? false;
                      return (
                        <button
                          key={uc.id}
                          type="button"
                          onClick={() => {
                            const tags = formData.conditionTags || [];
                            const next = isSelected
                              ? tags.filter((t) => t !== uc.id)
                              : [...tags, uc.id];
                            setFormData({ ...formData, conditionTags: next });
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Select the conditions this medication treats
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    min="1940-01-01"
                    max={today}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    min="1940-01-01"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.stillTaking}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="stillTaking" className="text-base">Still Taking?</Label>
                  <p className="text-sm text-muted-foreground">Currently on this medication</p>
                </div>
                <Switch
                  id="stillTaking"
                  checked={formData.stillTaking}
                  onCheckedChange={(checked) => setFormData({ ...formData, stillTaking: checked, endDate: checked ? '' : formData.endDate })}
                />
              </div>

              {/* Effectiveness */}
              <div className="space-y-2">
                <Label>Effectiveness</Label>
                <div className="flex gap-2 flex-wrap">
                  {EFFECTIVENESS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, effectiveness: opt.value as Medication['effectiveness'] })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        formData.effectiveness === opt.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side Effects */}
              <div className="space-y-2">
                <Label htmlFor="sideEffects">Side Effects</Label>
                <Textarea
                  id="sideEffects"
                  placeholder="e.g., Drowsiness (daily, moderate), stomach upset (after doses), weight gain (10 lbs since starting)..."
                  value={formData.sideEffects}
                  onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                  className="min-h-[80px]"
                />
                <p className="text-[11px] text-muted-foreground">
                  Include severity (mild/moderate/severe), frequency, and when side effects started.
                  Side effects may qualify as secondary conditions for VA claims.
                </p>
              </div>

              {/* Functional Impact */}
              <div className="space-y-2">
                <Label htmlFor="functionalImpactOnMed">Functional Impact — On Medication</Label>
                <Textarea
                  id="functionalImpactOnMed"
                  placeholder="Describe how this medication affects your daily activities when taking it..."
                  value={formData.functionalImpactOnMed || ''}
                  onChange={(e) => setFormData({ ...formData, functionalImpactOnMed: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="functionalImpactOffMed">Functional Impact — Without Medication</Label>
                <Textarea
                  id="functionalImpactOffMed"
                  placeholder="Describe your symptoms/limitations without this medication..."
                  value={formData.functionalImpactOffMed || ''}
                  onChange={(e) => setFormData({ ...formData, functionalImpactOffMed: e.target.value })}
                  rows={2}
                />
                <p className="text-[11px] text-muted-foreground">
                  VA raters compare your functioning with and without medication to assess severity.
                </p>
              </div>

              {/* Evidence Attachments - only show when editing */}
              {editingId && (
                <div className="pt-2 border-t border-border">
                  <EvidenceAttachment
                    entryType="medication"
                    entryId={editingId}
                    documents={documents}
                    onDocumentsChange={setAllDocuments}
                    compact={false}
                  />
                </div>
              )}

              </div>
              <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Save'} Medication
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Side Effects Summary & VA Guidance */}
      {showSideEffectStats && data.medications.length > 0 && (
        <div className="space-y-4">
          {/* Side Effect Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold">{sideEffectStats.total}</p>
                <p className="text-[11px] text-muted-foreground">Total Meds</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-destructive">{sideEffectStats.withSideEffects}</p>
                <p className="text-[11px] text-muted-foreground">With Side Effects</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-gold">{sideEffectStats.currentWithSideEffects}</p>
                <p className="text-[11px] text-muted-foreground">Active + Side Effects</p>
              </CardContent>
            </Card>
          </div>

          {/* VA Claims Guidance */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm">Why Side Effects Matter for VA Claims</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Medication side effects can support <strong>secondary service connection</strong> claims.
                    If a VA-prescribed medication causes a new condition (e.g., GERD from NSAIDs, erectile dysfunction from antidepressants),
                    you may be able to claim the side effect as a secondary condition.
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Document everything:</strong> Record specific side effects, when they started, severity, and impact on daily life.
                    This creates an evidence trail for secondary claims.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Current Medications */}
      {currentMeds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <h2 className="text-lg font-semibold text-foreground">Current Medications</h2>
            <span className="text-xs text-muted-foreground">({currentMeds.length})</span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {currentMeds.map((med, index) => renderMedCard(med, true, index))}
          </div>
        </div>
      )}

      {/* Past Medications */}
      {pastMeds.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Past Medications</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pastMeds.map((med, index) => renderMedCard(med, false, index))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {data.medications.length === 0 && (
        <Card className="data-card">
          <CardContent>
            <EmptyState
              icon={<Pill className="h-10 w-10" />}
              title="No medications logged yet"
              description="Track all prescriptions during service to build a complete medical history for your VA claim."
              whyItMatters="The 2026 VA medication rule requires documented treatment history. Side effects may qualify as secondary conditions."
              actionLabel="Add Medication"
              onAction={() => setIsOpen(true)}
            />
          </CardContent>
        </Card>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Medication?"
        description="This action cannot be undone. This will permanently delete this medication record."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => { if (deleteTarget) deleteMedication(deleteTarget); }}
      />
    </PageContainer>
  );
}
