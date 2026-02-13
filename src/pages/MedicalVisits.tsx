import { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useEvidence } from '@/hooks/useEvidence';
import { Stethoscope, Plus, Trash2, Edit, Calendar, MapPin, User, FileText, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { exportMedicalVisits } from '@/utils/pdfExport';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { PageContainer } from '@/components/PageContainer';
import type { MedicalVisit } from '@/types/claims';

const visitTypes = ['Sick Call', 'ER', 'Mental Health', 'PT', 'Dental', 'Specialist'] as const;

export default function MedicalVisits() {
  const { data, addMedicalVisit, updateMedicalVisit, deleteMedicalVisit } = useClaims();
  const { documents, setAllDocuments } = useEvidence();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<MedicalVisit, 'id'>>({
    date: '',
    visitType: 'Sick Call',
    location: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    provider: '',
    gotAfterVisitSummary: false,
    followUp: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      date: '',
      visitType: 'Sick Call',
      location: '',
      reason: '',
      diagnosis: '',
      treatment: '',
      provider: '',
      gotAfterVisitSummary: false,
      followUp: '',
      notes: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMedicalVisit(editingId, formData);
    } else {
      addMedicalVisit(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (visit: MedicalVisit) => {
    setFormData({
      date: visit.date,
      visitType: visit.visitType,
      location: visit.location,
      reason: visit.reason,
      diagnosis: visit.diagnosis,
      treatment: visit.treatment,
      provider: visit.provider,
      gotAfterVisitSummary: visit.gotAfterVisitSummary,
      followUp: visit.followUp,
      notes: visit.notes,
      relatedCondition: visit.relatedCondition || '',
    });
    setEditingId(visit.id);
    setIsOpen(true);
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Important Tip Alert */}
      <Alert className="border-warning/50 bg-warning/10">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <AlertTitle className="text-warning font-semibold">Important: Protect Your VA Claim</AlertTitle>
        <AlertDescription className="text-foreground/90 mt-2">
          <p className="mb-2">
            <strong>After every appointment</strong>, request and review your After-Visit Summary and medical notes. 
            Check that the doctor documented <strong>everything</strong> you discussed, including all symptoms, 
            complaints, and their severity.
          </p>
          <p>
            Errors or omissions in your medical records can hurt your VA claim later. 
            <strong> If something is missing or incorrect, request a correction immediately</strong> while it's fresh.
          </p>
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-medical/10">
            <Stethoscope className="h-5 w-5 text-medical" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medical Visits</h1>
            <p className="text-muted-foreground text-sm">Log all medical appointments during service</p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={() => exportMedicalVisits(data.medicalVisits)} className="gap-2 hidden sm:flex">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-12 min-h-[48px]">
                <Plus className="h-4 w-4" />
                Add Visit
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle>{editingId ? 'Edit Medical Visit' : 'Log Medical Visit'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto space-y-4 px-6 pb-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitType">Visit Type</Label>
                  <Select 
                    value={formData.visitType} 
                    onValueChange={(value: typeof visitTypes[number]) => setFormData({ ...formData, visitType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visitTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Base</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g., Wright-Patterson AFB"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input 
                    id="provider" 
                    placeholder="Doctor/Medic name"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input 
                  id="reason" 
                  placeholder="What brought you in?"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input 
                  id="diagnosis" 
                  placeholder="What were you diagnosed with?"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Textarea 
                  id="treatment" 
                  placeholder="Medications, procedures, therapies prescribed..."
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="summary" className="text-base">Got After-Visit Summary?</Label>
                  <p className="text-sm text-muted-foreground">Critical for your records</p>
                </div>
                <Switch 
                  id="summary"
                  checked={formData.gotAfterVisitSummary}
                  onCheckedChange={(checked) => setFormData({ ...formData, gotAfterVisitSummary: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUp">Follow-up</Label>
                <Input 
                  id="followUp" 
                  placeholder="Next appointment, referrals..."
                  value={formData.followUp}
                  onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedCondition">Related Condition (Optional)</Label>
                <Input 
                  id="relatedCondition" 
                  placeholder="e.g., Tinnitus, PTSD, Back Pain"
                  value={formData.relatedCondition || ''}
                  onChange={(e) => setFormData({ ...formData, relatedCondition: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Link this visit to a condition you're claiming
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Additional details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              {/* Evidence Attachments - only show when editing */}
              {editingId && (
                <div className="pt-2 border-t border-border">
                  <EvidenceAttachment
                    entryType="medical-visit"
                    entryId={editingId}
                    documents={documents}
                    onDocumentsChange={setAllDocuments}
                  />
                </div>
              )}

              </div>
              <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border bg-card sticky bottom-0 p-6 -mx-6 -mb-6 rounded-b-2xl">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="h-12 min-h-[48px] px-6">
                  Cancel
                </Button>
                <Button type="submit" className="h-12 min-h-[48px] px-6">
                  {editingId ? 'Update' : 'Save'} Visit
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Visits List */}
      {data.medicalVisits.length === 0 ? (
        <Card className="data-card">
          <CardContent className="empty-state">
            <Stethoscope className="empty-state-icon" />
            <p className="empty-state-title">No medical visits logged yet</p>
            <p className="empty-state-description">Document all medical appointments during service. Each visit can be linked to a claimed condition.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.medicalVisits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((visit, index) => (
            <Card key={visit.id} className="data-card group hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-medical/10 px-2.5 py-1 text-xs font-medium text-medical ring-1 ring-inset ring-medical/20">
                      {visit.visitType}
                    </span>
                    {!visit.gotAfterVisitSummary && (
                      <span className="badge-warning">
                        No After-Visit Summary
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(visit)} className="h-10 w-10 min-h-[44px] min-w-[44px]" aria-label="Edit visit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMedicalVisit(visit.id)} className="h-10 w-10 min-h-[44px] min-w-[44px]" aria-label="Delete visit">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2 break-words">{visit.reason || 'Medical Visit'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{new Date(visit.date).toLocaleDateString()}</span>
                  </div>
                  {visit.location && (
                    <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{visit.location}</span>
                    </div>
                  )}
                  {visit.provider && (
                    <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{visit.provider}</span>
                    </div>
                  )}
                </div>
                
                {visit.diagnosis && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Diagnosis</p>
                    <p className="text-sm">{visit.diagnosis}</p>
                  </div>
                )}

                {visit.treatment && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Treatment</p>
                    <p className="text-sm">{visit.treatment}</p>
                  </div>
                )}

                {visit.notes && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                    <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{visit.notes}</p>
                  </div>
                )}

                {/* Evidence Thumbnails */}
                <EvidenceThumbnails
                  entryType="medical-visit"
                  entryId={visit.id}
                  documents={documents}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
