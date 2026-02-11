import { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useEvidence } from '@/hooks/useEvidence';
import { AlertTriangle, Plus, Trash2, Edit, Calendar, MapPin, Shield, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { exportExposures } from '@/utils/pdfExport';
import { BranchExposuresSelector } from '@/components/exposures/BranchExposuresSelector';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { PageContainer } from '@/components/PageContainer';
import type { Exposure, ExposureType } from '@/types/claims';

// Extended exposure types including branch-specific ones
const exposureTypes: ExposureType[] = [
  'Burn pit', 
  'Jet fuel', 
  'Chemicals', 
  'Noise', 
  'Radiation', 
  'Asbestos', 
  'Extreme temps',
  'Diesel exhaust',
  'Depleted uranium',
  'Sand/dust',
  'Contaminated water (Camp Lejeune)',
  'Herbicides',
  'Paint fumes',
  'Hydraulic fluid',
  'PFAS chemicals',
  'Contaminated water',
  'Other',
];

export default function Exposures() {
  const { data, addExposure, updateExposure, deleteExposure } = useClaims();
  const { documents, setAllDocuments } = useEvidence();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Exposure, 'id'>>({
    date: '',
    type: 'Burn pit',
    duration: '',
    location: '',
    details: '',
    ppeProvided: false,
    witnesses: '',
  });

  const resetForm = () => {
    setFormData({
      date: '',
      type: 'Burn pit',
      duration: '',
      location: '',
      details: '',
      ppeProvided: false,
      witnesses: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateExposure(editingId, formData);
    } else {
      addExposure(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (exposure: Exposure) => {
    setFormData({
      date: exposure.date,
      type: exposure.type,
      duration: exposure.duration,
      location: exposure.location,
      details: exposure.details,
      ppeProvided: exposure.ppeProvided,
      witnesses: exposure.witnesses,
    });
    setEditingId(exposure.id);
    setIsOpen(true);
  };

  // Handle quick-add from branch selector
  const handleQuickAddExposure = (exposureName: string) => {
    // Map common exposure names to our type
    const typeMapping: Record<string, ExposureType> = {
      'Burn pits': 'Burn pit',
      'Diesel exhaust': 'Diesel exhaust',
      'Depleted uranium': 'Depleted uranium',
      'Sand/dust': 'Sand/dust',
      'Contaminated water (Camp Lejeune)': 'Contaminated water (Camp Lejeune)',
      'Noise': 'Noise',
      'Herbicides': 'Herbicides',
      'Asbestos': 'Asbestos',
      'Jet fuel': 'Jet fuel',
      'Paint fumes': 'Paint fumes',
      'Contaminated water': 'Contaminated water',
      'Radiation': 'Radiation',
      'Hydraulic fluid': 'Hydraulic fluid',
      'PFAS chemicals': 'PFAS chemicals',
    };

    const exposureType = typeMapping[exposureName] || 'Other';
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: exposureType,
      duration: '',
      location: '',
      details: exposureName !== exposureType ? `${exposureName}` : '',
      ppeProvided: false,
      witnesses: '',
    });
    setIsOpen(true);
  };

  const getExposureColor = (type: string) => {
    const colors: Record<string, string> = {
      'Burn pit': 'bg-blue-500/10 text-blue-600 ring-blue-500/20',
      'Jet fuel': 'bg-purple-500/10 text-purple-600 ring-purple-500/20',
      'Chemicals': 'bg-red-500/10 text-red-600 ring-red-500/20',
      'Noise': 'bg-blue-500/10 text-blue-600 ring-blue-500/20',
      'Radiation': 'bg-blue-500/10 text-blue-600 ring-blue-500/20',
      'Asbestos': 'bg-gray-500/10 text-gray-600 ring-gray-500/20',
      'Extreme temps': 'bg-cyan-500/10 text-cyan-600 ring-cyan-500/20',
      'Diesel exhaust': 'bg-stone-500/10 text-stone-600 ring-stone-500/20',
      'Depleted uranium': 'bg-blue-500/10 text-blue-600 ring-blue-500/20',
      'Sand/dust': 'bg-blue-600/10 text-blue-700 ring-blue-600/20',
      'Contaminated water (Camp Lejeune)': 'bg-teal-500/10 text-teal-600 ring-teal-500/20',
      'Contaminated water': 'bg-teal-500/10 text-teal-600 ring-teal-500/20',
      'Herbicides': 'bg-green-500/10 text-green-600 ring-green-500/20',
      'Paint fumes': 'bg-pink-500/10 text-pink-600 ring-pink-500/20',
      'Hydraulic fluid': 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/20',
      'PFAS chemicals': 'bg-rose-500/10 text-rose-600 ring-rose-500/20',
    };
    return colors[type] || 'bg-exposure/10 text-exposure ring-exposure/20';
  };

  return (
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-exposure/10">
            <AlertTriangle className="h-5 w-5 text-exposure" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Exposures</h1>
            <p className="text-muted-foreground text-sm">Document hazardous exposures during service</p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" onClick={() => exportExposures(data.exposures)} className="gap-2 hidden sm:flex">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Exposure
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Exposure' : 'Log Exposure'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
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
                  <Label htmlFor="type">Exposure Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: ExposureType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exposureTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input 
                    id="duration" 
                    placeholder="e.g., 6 months, daily for 1 year"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Base, deployment location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea 
                  id="details" 
                  placeholder="Describe the exposure circumstances..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="ppe" className="text-base">PPE Provided?</Label>
                  <p className="text-sm text-muted-foreground">Was protective equipment issued?</p>
                </div>
                <Switch 
                  id="ppe"
                  checked={formData.ppeProvided}
                  onCheckedChange={(checked) => setFormData({ ...formData, ppeProvided: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="witnesses">Witnesses</Label>
                <Input 
                  id="witnesses" 
                  placeholder="Names of others who can verify"
                  value={formData.witnesses}
                  onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
                />
              </div>

              {/* Evidence Attachments - only show when editing */}
              {editingId && (
                <div className="pt-2 border-t border-border">
                  <EvidenceAttachment
                    entryType="exposure"
                    entryId={editingId}
                    documents={documents}
                    onDocumentsChange={setAllDocuments}
                  />
                </div>
              )}

              </div>
              <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Save'} Exposure
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Branch-Specific Exposures Selector */}
      <BranchExposuresSelector onSelectExposure={handleQuickAddExposure} />

      {/* Exposures List */}
      {data.exposures.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No exposures logged yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">Document hazardous exposures for PACT Act claims.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.exposures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((exposure) => (
            <Card key={exposure.id} className="data-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getExposureColor(exposure.type)}`}>
                      {exposure.type}
                    </span>
                    {!exposure.ppeProvided && (
                      <span className="badge-warning">
                        No PPE Provided
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]" onClick={() => handleEdit(exposure)} aria-label="Edit exposure">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]" onClick={() => deleteExposure(exposure.id)} aria-label="Delete exposure">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(exposure.date).toLocaleDateString()}
                  </div>
                  {exposure.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {exposure.location}
                    </div>
                  )}
                  {exposure.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      {exposure.duration}
                    </div>
                  )}
                  {exposure.witnesses && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {exposure.witnesses}
                    </div>
                  )}
                </div>
                
                {exposure.details && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm">{exposure.details}</p>
                  </div>
                )}

                <EvidenceThumbnails
                  entryType="exposure"
                  entryId={exposure.id}
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
