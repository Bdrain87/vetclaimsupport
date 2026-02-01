import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Pill, Plus, Trash2, Edit, Calendar, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MedicationCombobox } from '@/components/ui/medication-combobox';
import { exportMedications } from '@/utils/pdfExport';
import type { Medication } from '@/types/claims';

export default function Medications() {
  const { data, addMedication, updateMedication, deleteMedication } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Medication, 'id'>>({
    startDate: '',
    endDate: '',
    name: '',
    prescribedFor: '',
    sideEffects: '',
    stillTaking: false,
  });

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      name: '',
      prescribedFor: '',
      sideEffects: '',
      stillTaking: false,
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
    });
    setEditingId(medication.id);
    setIsOpen(true);
  };

  const currentMeds = data.medications.filter(m => m.stillTaking);
  const pastMeds = data.medications.filter(m => !m.stillTaking);

  return (
    <div className="space-y-6 animate-fade-in overflow-x-hidden max-w-full">
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
          <Button variant="outline" onClick={() => exportMedications(data.medications)} className="gap-2 hidden sm:flex">
            <Download className="h-4 w-4" />
            Export PDF
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
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <MedicationCombobox
                  value={formData.name}
                  onValueChange={(name, prescribedFor) => {
                    setFormData({ 
                      ...formData, 
                      name,
                      // Auto-fill prescribed for if selecting from list and field is empty
                      prescribedFor: prescribedFor && !formData.prescribedFor ? prescribedFor : formData.prescribedFor
                    });
                  }}
                  placeholder="Search or type medication name..."
                />
                <p className="text-xs text-muted-foreground">
                  Search common VA/military medications or type a custom name
                </p>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
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

              <div className="space-y-2">
                <Label htmlFor="sideEffects">Side Effects</Label>
                <Textarea 
                  id="sideEffects" 
                  placeholder="Any side effects experienced..."
                  value={formData.sideEffects}
                  onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                />
              </div>

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

      {/* Current Medications */}
      {currentMeds.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Current Medications</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentMeds.map((med) => (
              <Card key={med.id} className="data-card">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <span className="badge-success">Active</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(med)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteMedication(med.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{med.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {med.prescribedFor && (
                    <p className="text-muted-foreground">For: {med.prescribedFor}</p>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Since {new Date(med.startDate).toLocaleDateString()}
                  </div>
                  {med.sideEffects && (
                    <div className="flex items-start gap-2 text-destructive/80 bg-destructive/5 rounded p-2 mt-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{med.sideEffects}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Medications */}
      {pastMeds.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Past Medications</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastMeds.map((med) => (
              <Card key={med.id} className="data-card opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                      Discontinued
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(med)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteMedication(med.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{med.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {med.prescribedFor && (
                    <p className="text-muted-foreground">For: {med.prescribedFor}</p>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(med.startDate).toLocaleDateString()} - {med.endDate ? new Date(med.endDate).toLocaleDateString() : 'N/A'}
                  </div>
                  {med.sideEffects && (
                    <div className="flex items-start gap-2 text-muted-foreground bg-muted/50 rounded p-2 mt-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{med.sideEffects}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {data.medications.length === 0 && (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No medications logged yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">Track all prescriptions during service.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
