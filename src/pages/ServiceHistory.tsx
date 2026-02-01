import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Shield, Plus, Trash2, Edit, Calendar, MapPin, Briefcase, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { exportServiceHistory } from '@/utils/pdfExport';
import type { ServiceEntry } from '@/types/claims';

export default function ServiceHistory() {
  const { data, addServiceEntry, updateServiceEntry, deleteServiceEntry } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ServiceEntry, 'id'>>({
    startDate: '',
    endDate: '',
    base: '',
    unit: '',
    afsc: '',
    duties: '',
    hazards: '',
  });

  const resetForm = () => {
    setFormData({
      startDate: '',
      endDate: '',
      base: '',
      unit: '',
      afsc: '',
      duties: '',
      hazards: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateServiceEntry(editingId, formData);
    } else {
      addServiceEntry(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (entry: ServiceEntry) => {
    setFormData({
      startDate: entry.startDate,
      endDate: entry.endDate,
      base: entry.base,
      unit: entry.unit,
      afsc: entry.afsc,
      duties: entry.duties,
      hazards: entry.hazards,
    });
    setEditingId(entry.id);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="section-header mb-0">
          <div className="section-icon bg-service/10">
            <Shield className="h-5 w-5 text-service" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service History</h1>
            <p className="text-muted-foreground">Document deployments and duty stations</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportServiceHistory(data.serviceHistory)} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Entry
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{editingId ? 'Edit Service Entry' : 'Add Service Entry'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="base">Base/Location</Label>
                  <Input 
                    id="base" 
                    placeholder="e.g., Nellis AFB, NV"
                    value={formData.base}
                    onChange={(e) => setFormData({ ...formData, base: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input 
                    id="unit" 
                    placeholder="e.g., 57th Wing"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="afsc">AFSC/MOS (Job Code)</Label>
                <Input 
                  id="afsc" 
                  placeholder="e.g., 2A3X3 (Air Force) or 11B (Army/Marines)"
                  value={formData.afsc}
                  onChange={(e) => setFormData({ ...formData, afsc: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duties">Duties & Responsibilities</Label>
                <Textarea 
                  id="duties" 
                  placeholder="Describe your primary duties..."
                  value={formData.duties}
                  onChange={(e) => setFormData({ ...formData, duties: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hazards">Hazards & Conditions</Label>
                <Textarea 
                  id="hazards" 
                  placeholder="Physical demands, environmental hazards, exposure risks..."
                  value={formData.hazards}
                  onChange={(e) => setFormData({ ...formData, hazards: e.target.value })}
                  rows={3}
                />
              </div>

              </div>
              <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-border bg-background">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Save'} Entry
                </Button>
              </div>
            </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Service History List */}
      {data.serviceHistory.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No service history logged yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">Document each duty station and deployment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.serviceHistory.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((entry) => (
            <Card key={entry.id} className="data-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(entry.startDate).toLocaleDateString()} - {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteServiceEntry(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-service" />
                  {entry.base}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  {entry.unit && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      {entry.unit}
                    </div>
                  )}
                  {entry.afsc && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {entry.afsc}
                    </div>
                  )}
                </div>
                
                {entry.duties && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Duties</p>
                    <p className="text-sm">{entry.duties}</p>
                  </div>
                )}

                {entry.hazards && (
                  <div className="flex items-start gap-2 text-sm bg-exposure/5 border border-exposure/20 rounded-lg p-3">
                    <AlertTriangle className="h-4 w-4 text-exposure mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-exposure text-xs uppercase tracking-wide mb-1">Hazards</p>
                      <p className="text-foreground/80">{entry.hazards}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
