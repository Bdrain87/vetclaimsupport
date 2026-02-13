import { useState, useEffect } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useEvidence } from '@/hooks/useEvidence';
import { Shield, Plus, Trash2, Edit, Calendar, MapPin, Briefcase, AlertTriangle, Download, Sword, Star, Plane } from 'lucide-react';
import { getSavedServiceDates, saveServiceDates } from '@/utils/veteranProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportServiceHistory } from '@/utils/pdfExport';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { MOSCombobox } from '@/components/ui/mos-combobox';
import { AwardsCombobox } from '@/components/ui/awards-combobox';
import { LocationAutocomplete } from '@/components/shared/LocationAutocomplete';
import type { ServiceEntry, CombatEntry, MajorEvent, DeploymentEntry, MajorEventType } from '@/types/claims';
import { PageContainer } from '@/components/PageContainer';

const COMBAT_ZONE_TYPES = ['Combat Zone', 'Hostile Fire Area', 'Imminent Danger Area', 'Hazardous Duty'] as const;
const MAJOR_EVENT_TYPES: MajorEventType[] = ['Injury', 'Accident', 'Assault/MST', 'Award/Decoration', 'TBI Event', 'Traumatic Event', 'Line of Duty Investigation', 'Other'];

export default function ServiceHistory() {
  const { 
    data, 
    addServiceEntry, updateServiceEntry, deleteServiceEntry,
    addCombatEntry, updateCombatEntry, deleteCombatEntry,
    addMajorEvent, updateMajorEvent, deleteMajorEvent,
    addDeployment, updateDeployment, deleteDeployment,
  } = useClaims();
  const { documents, setAllDocuments } = useEvidence();
  
  const [activeTab, setActiveTab] = useState('duty-stations');
  
  // Duty Station form state
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
  const [suggestedHazards, setSuggestedHazards] = useState<string[]>([]);
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [customHazard, setCustomHazard] = useState('');

  // Load saved service dates on mount
  useEffect(() => {
    const savedDates = getSavedServiceDates();
    if (savedDates.startDate || savedDates.endDate) {
      setFormData(prev => ({
        ...prev,
        startDate: prev.startDate || savedDates.startDate,
        endDate: prev.endDate || savedDates.endDate,
      }));
    }
  }, []);

  // Save service dates to localStorage when form data changes
  useEffect(() => {
    if (formData.startDate || formData.endDate) {
      saveServiceDates(formData.startDate, formData.endDate);
    }
  }, [formData.startDate, formData.endDate]);

  // Combat form state
  const [isCombatOpen, setIsCombatOpen] = useState(false);
  const [editingCombatId, setEditingCombatId] = useState<string | null>(null);
  const [combatForm, setCombatForm] = useState<Omit<CombatEntry, 'id'>>({
    startDate: '',
    endDate: '',
    location: '',
    combatZoneType: 'Combat Zone',
    receivedHostileFirePay: false,
    receivedImmDangerPay: false,
    directCombat: false,
    description: '',
    awards: '',
  });

  // Major Event form state
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Omit<MajorEvent, 'id'>>({
    date: '',
    type: 'Injury',
    title: '',
    location: '',
    description: '',
    documented: false,
    witnesses: '',
  });

  // Deployment form state
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [editingDeployId, setEditingDeployId] = useState<string | null>(null);
  const [deployForm, setDeployForm] = useState<Omit<DeploymentEntry, 'id'>>({
    startDate: '',
    endDate: '',
    operationName: '',
    location: '',
    unit: '',
    role: '',
    combatDeployment: false,
    hazardsEncountered: '',
    notes: '',
  });

  // Reset functions
  const resetForm = () => {
    setFormData({ startDate: '', endDate: '', base: '', unit: '', afsc: '', duties: '', hazards: '' });
    setEditingId(null);
    setSuggestedHazards([]);
    setSelectedHazards([]);
    setCustomHazard('');
  };

  // Handle MOS selection and hazards
  const handleMOSSelect = (code: string) => {
    setFormData({ ...formData, afsc: code });
  };

  const handleHazardsSuggested = (hazards: string[]) => {
    setSuggestedHazards(hazards);
    setSelectedHazards(hazards); // Pre-check all suggested hazards
  };

  const toggleHazard = (hazard: string) => {
    setSelectedHazards(prev =>
      prev.includes(hazard)
        ? prev.filter(h => h !== hazard)
        : [...prev, hazard]
    );
  };

  const addCustomHazard = () => {
    if (customHazard.trim() && !selectedHazards.includes(customHazard.trim())) {
      setSelectedHazards([...selectedHazards, customHazard.trim()]);
      setCustomHazard('');
    }
  };

  // Combine selected hazards into the form data on submit
  const handleSubmitWithHazards = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedHazards = selectedHazards.join(', ');
    const finalData = { ...formData, hazards: combinedHazards || formData.hazards };
    if (editingId) {
      updateServiceEntry(editingId, finalData);
    } else {
      addServiceEntry(finalData);
    }
    setIsOpen(false);
    resetForm();
  };

  const resetCombatForm = () => {
    setCombatForm({ startDate: '', endDate: '', location: '', combatZoneType: 'Combat Zone', receivedHostileFirePay: false, receivedImmDangerPay: false, directCombat: false, description: '', awards: '' });
    setEditingCombatId(null);
  };

  const resetEventForm = () => {
    setEventForm({ date: '', type: 'Injury', title: '', location: '', description: '', documented: false, witnesses: '' });
    setEditingEventId(null);
  };

  const resetDeployForm = () => {
    setDeployForm({ startDate: '', endDate: '', operationName: '', location: '', unit: '', role: '', combatDeployment: false, hazardsEncountered: '', notes: '' });
    setEditingDeployId(null);
  };

  // Submit handlers - use handleSubmitWithHazards for duty stations
  const handleSubmit = handleSubmitWithHazards;

  const handleCombatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCombatId) {
      updateCombatEntry(editingCombatId, combatForm);
    } else {
      addCombatEntry(combatForm);
    }
    setIsCombatOpen(false);
    resetCombatForm();
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEventId) {
      updateMajorEvent(editingEventId, eventForm);
    } else {
      addMajorEvent(eventForm);
    }
    setIsEventOpen(false);
    resetEventForm();
  };

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeployId) {
      updateDeployment(editingDeployId, deployForm);
    } else {
      addDeployment(deployForm);
    }
    setIsDeployOpen(false);
    resetDeployForm();
  };

  // Edit handlers
  const handleEdit = (entry: ServiceEntry) => {
    setFormData({ startDate: entry.startDate, endDate: entry.endDate, base: entry.base, unit: entry.unit, afsc: entry.afsc, duties: entry.duties, hazards: entry.hazards });
    setEditingId(entry.id);
    setIsOpen(true);
  };

  const handleEditCombat = (entry: CombatEntry) => {
    setCombatForm({ startDate: entry.startDate, endDate: entry.endDate, location: entry.location, combatZoneType: entry.combatZoneType, receivedHostileFirePay: entry.receivedHostileFirePay, receivedImmDangerPay: entry.receivedImmDangerPay, directCombat: entry.directCombat, description: entry.description, awards: entry.awards });
    setEditingCombatId(entry.id);
    setIsCombatOpen(true);
  };

  const handleEditEvent = (entry: MajorEvent) => {
    setEventForm({ date: entry.date, type: entry.type, title: entry.title, location: entry.location, description: entry.description, documented: entry.documented, witnesses: entry.witnesses });
    setEditingEventId(entry.id);
    setIsEventOpen(true);
  };

  const handleEditDeploy = (entry: DeploymentEntry) => {
    setDeployForm({ startDate: entry.startDate, endDate: entry.endDate, operationName: entry.operationName, location: entry.location, unit: entry.unit, role: entry.role, combatDeployment: entry.combatDeployment, hazardsEncountered: entry.hazardsEncountered, notes: entry.notes });
    setEditingDeployId(entry.id);
    setIsDeployOpen(true);
  };

  const combatHistory = data.combatHistory || [];
  const majorEvents = data.majorEvents || [];
  const deployments = data.deployments || [];

  return (
    <PageContainer className="space-y-6 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="section-header mb-0">
          <div className="section-icon bg-service/10">
            <Shield className="h-5 w-5 text-service" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Record</h1>
            <p className="text-muted-foreground text-sm">Document your military service history</p>
          </div>
        </div>

        <Button variant="outline" onClick={() => exportServiceHistory(data.serviceHistory)} className="gap-2 flex-shrink-0">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="flex flex-wrap w-full sm:grid sm:w-full sm:grid-cols-4 h-auto gap-1">
            <TabsTrigger value="duty-stations" className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap flex-shrink-0">
              <MapPin className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Duty Stations</span>
              <span className="sm:hidden">Stations</span>
            </TabsTrigger>
            <TabsTrigger value="combat" className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap flex-shrink-0">
              <Sword className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Combat</span>
              <span className="sm:hidden">Combat</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap flex-shrink-0">
              <Star className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Events</span>
              <span className="sm:hidden">Events</span>
            </TabsTrigger>
            <TabsTrigger value="deployments" className="text-xs sm:text-sm py-2 px-2 sm:px-3 whitespace-nowrap flex-shrink-0">
              <Plane className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Deployments</span>
              <span className="sm:hidden">Deploy</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* DUTY STATIONS TAB */}
        <TabsContent value="duty-stations" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Duty Station
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Duty Station' : 'Add Duty Station'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="base">Base/Location</Label>
                        <LocationAutocomplete
                          value={formData.base}
                          onChange={(val) => setFormData({ ...formData, base: val })}
                          onSelect={(val) => setFormData({ ...formData, base: val })}
                          placeholder="e.g., Nellis AFB, NV"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input id="unit" placeholder="e.g., 57th Wing" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>AFSC/MOS (Job Code)</Label>
                      <MOSCombobox
                        value={formData.afsc}
                        onValueChange={handleMOSSelect}
                        onHazardsSuggested={handleHazardsSuggested}
                        placeholder="Type code (e.g., 11B) or job title..."
                      />
                      <p className="text-xs text-muted-foreground">Search Army MOS, Air Force AFSC, Navy Rating, or Marine MOS</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duties">Duties & Responsibilities</Label>
                      <Textarea id="duties" placeholder="Describe your primary duties..." value={formData.duties} onChange={(e) => setFormData({ ...formData, duties: e.target.value })} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hazards & Conditions</Label>
                      {suggestedHazards.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">
                            Common hazards for this job code (uncheck if not applicable):
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {suggestedHazards.map((hazard) => (
                              <label key={hazard} className="flex items-center gap-2 text-sm cursor-pointer">
                                <Checkbox
                                  checked={selectedHazards.includes(hazard)}
                                  onCheckedChange={() => toggleHazard(hazard)}
                                />
                                <span className="text-foreground">{hazard}</span>
                              </label>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Input
                              placeholder="Add custom hazard..."
                              value={customHazard}
                              onChange={(e) => setCustomHazard(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHazard())}
                              className="flex-1"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={addCustomHazard}>
                              Add
                            </Button>
                          </div>
                          {selectedHazards.filter(h => !suggestedHazards.includes(h)).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedHazards.filter(h => !suggestedHazards.includes(h)).map(h => (
                                <Badge key={h} variant="secondary" className="gap-1">
                                  {h}
                                  <button type="button" onClick={() => toggleHazard(h)} className="ml-1 hover:text-destructive" aria-label={`Remove ${h}`}>×</button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Textarea
                          id="hazards"
                          placeholder="Physical demands, environmental hazards, exposure risks... (or select a job code above for suggestions)"
                          value={formData.hazards}
                          onChange={(e) => setFormData({ ...formData, hazards: e.target.value })}
                          rows={3}
                        />
                      )}
                    </div>

                    {/* Evidence Attachments - only show when editing */}
                    {editingId && (
                      <div className="pt-2 border-t border-border">
                        <EvidenceAttachment
                          entryType="service-entry"
                          entryId={editingId}
                          documents={documents}
                          onDocumentsChange={setAllDocuments}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingId ? 'Update' : 'Save'} Entry</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {data.serviceHistory.length === 0 ? (
            <Card className="data-card">
              <CardContent className="empty-state">
                <MapPin className="empty-state-icon" />
                <p className="empty-state-title">No duty stations logged yet</p>
                <p className="empty-state-description">Document each duty station and assignment during your military service.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...data.serviceHistory].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((entry, index) => (
                <Card key={entry.id} className="data-card group hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.startDate).toLocaleDateString()} - {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)} aria-label="Edit duty station"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteServiceEntry(entry.id)} aria-label="Delete duty station"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-service flex-shrink-0" />
                      <span className="break-words min-w-0">{entry.base}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 text-sm">
                      {entry.unit && <div className="flex items-center gap-2 text-muted-foreground min-w-0"><Shield className="h-4 w-4 flex-shrink-0" /><span className="truncate">{entry.unit}</span></div>}
                      {entry.afsc && <div className="flex items-center gap-2 text-muted-foreground min-w-0"><Briefcase className="h-4 w-4 flex-shrink-0" /><span className="truncate">{entry.afsc}</span></div>}
                    </div>
                    {entry.duties && <div><p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Duties</p><p className="text-sm">{entry.duties}</p></div>}
                    {entry.hazards && (
                      <div className="flex items-start gap-2 text-sm bg-exposure/5 border border-exposure/20 rounded-lg p-3">
                        <AlertTriangle className="h-4 w-4 text-exposure mt-0.5 flex-shrink-0" />
                        <div><p className="font-medium text-exposure text-xs uppercase tracking-wide mb-1">Hazards</p><p className="text-foreground/80">{entry.hazards}</p></div>
                      </div>
                    )}
                    <EvidenceThumbnails entryType="service-entry" entryId={entry.id} documents={documents} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* COMBAT TAB */}
        <TabsContent value="combat" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={isCombatOpen} onOpenChange={(open) => { setIsCombatOpen(open); if (!open) resetCombatForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Combat Zone
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingCombatId ? 'Edit Combat Zone' : 'Add Combat Zone'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCombatSubmit} className="flex flex-col">
                  <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" value={combatForm.startDate} onChange={(e) => setCombatForm({ ...combatForm, startDate: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" value={combatForm.endDate} onChange={(e) => setCombatForm({ ...combatForm, endDate: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Location/Country</Label>
                        <LocationAutocomplete
                          value={combatForm.location}
                          onChange={(val) => setCombatForm({ ...combatForm, location: val })}
                          onSelect={(val) => setCombatForm({ ...combatForm, location: val })}
                          placeholder="e.g., Afghanistan, Iraq, Kuwait"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Zone Type</Label>
                        <Select value={combatForm.combatZoneType} onValueChange={(v) => setCombatForm({ ...combatForm, combatZoneType: v as typeof combatForm.combatZoneType })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {COMBAT_ZONE_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Pay & Engagement</Label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={combatForm.receivedHostileFirePay} onCheckedChange={(c) => setCombatForm({ ...combatForm, receivedHostileFirePay: !!c })} />
                          Received Hostile Fire Pay (HFP)
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={combatForm.receivedImmDangerPay} onCheckedChange={(c) => setCombatForm({ ...combatForm, receivedImmDangerPay: !!c })} />
                          Received Imminent Danger Pay (IDP)
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={combatForm.directCombat} onCheckedChange={(c) => setCombatForm({ ...combatForm, directCombat: !!c })} />
                          Direct Combat Engagement
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Combat-Related Awards</Label>
                      <AwardsCombobox
                        value={combatForm.awards || ''}
                        onValueChange={(value) => setCombatForm({ ...combatForm, awards: value })}
                        placeholder="Type award name (e.g., CAB, Purple Heart)..."
                      />
                      <p className="text-xs text-muted-foreground">Search and select multiple awards, or type custom entries</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Describe combat operations, duties, and experiences..." value={combatForm.description} onChange={(e) => setCombatForm({ ...combatForm, description: e.target.value })} rows={3} />
                    </div>

                    {/* Evidence Attachments - only show when editing */}
                    {editingCombatId && (
                      <div className="pt-2 border-t border-border">
                        <EvidenceAttachment
                          entryType="combat"
                          entryId={editingCombatId}
                          documents={documents}
                          onDocumentsChange={setAllDocuments}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => setIsCombatOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingCombatId ? 'Update' : 'Save'} Combat Zone</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {combatHistory.length === 0 ? (
            <Card className="data-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sword className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">No combat zones documented yet.</p>
                <p className="text-sm text-muted-foreground text-center mt-1">Track hostile fire areas, imminent danger zones, and combat deployments.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...(combatHistory || [])].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((entry) => (
                <Card key={entry.id} className="data-card border-destructive/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.startDate).toLocaleDateString()} - {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCombat(entry)} aria-label="Edit combat entry"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCombatEntry(entry.id)} aria-label="Delete combat entry"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2 flex items-center gap-2 flex-wrap">
                      <Sword className="h-5 w-5 text-destructive flex-shrink-0" />
                      <span className="break-words min-w-0">{entry.location}</span>
                      <Badge variant="destructive" className="flex-shrink-0">{entry.combatZoneType}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {entry.receivedHostileFirePay && <Badge variant="outline">Hostile Fire Pay</Badge>}
                      {entry.receivedImmDangerPay && <Badge variant="outline">Imminent Danger Pay</Badge>}
                      {entry.directCombat && <Badge variant="destructive">Direct Combat</Badge>}
                    </div>
                    {entry.awards && <div><p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Awards</p><p className="text-sm">{entry.awards}</p></div>}
                    {entry.description && <p className="text-sm text-muted-foreground">{entry.description}</p>}
                    <EvidenceThumbnails entryType="combat" entryId={entry.id} documents={documents} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* MAJOR EVENTS TAB */}
        <TabsContent value="events" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={isEventOpen} onOpenChange={(open) => { setIsEventOpen(open); if (!open) resetEventForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingEventId ? 'Edit Major Event' : 'Add Major Event'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEventSubmit} className="flex flex-col">
                  <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Event Type</Label>
                        <Select value={eventForm.type} onValueChange={(v) => setEventForm({ ...eventForm, type: v as MajorEventType })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {MAJOR_EVENT_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input placeholder="Brief title of the event" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <LocationAutocomplete
                        value={eventForm.location}
                        onChange={(val) => setEventForm({ ...eventForm, location: val })}
                        onSelect={(val) => setEventForm({ ...eventForm, location: val })}
                        placeholder="Where did this occur?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Describe what happened in detail..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Witnesses</Label>
                      <Textarea placeholder="Names of people who can verify this event" value={eventForm.witnesses} onChange={(e) => setEventForm({ ...eventForm, witnesses: e.target.value })} rows={2} />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox checked={eventForm.documented} onCheckedChange={(c) => setEventForm({ ...eventForm, documented: !!c })} />
                      This event was documented in official service records
                    </label>

                    {/* Evidence Attachments - only show when editing */}
                    {editingEventId && (
                      <div className="pt-2 border-t border-border">
                        <EvidenceAttachment
                          entryType="major-event"
                          entryId={editingEventId}
                          documents={documents}
                          onDocumentsChange={setAllDocuments}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => setIsEventOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingEventId ? 'Update' : 'Save'} Event</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {majorEvents.length === 0 ? (
            <Card className="data-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">No major events documented yet.</p>
                <p className="text-sm text-muted-foreground text-center mt-1">Track injuries, incidents, awards, and significant service events.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...(majorEvents || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                <Card key={entry.id} className="data-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.date).toLocaleDateString()}
                        <Badge variant={entry.type === 'Award/Decoration' ? 'default' : entry.type === 'Assault/MST' || entry.type === 'Injury' ? 'destructive' : 'secondary'}>
                          {entry.type}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditEvent(entry)} aria-label="Edit event"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMajorEvent(entry.id)} aria-label="Delete event"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2 flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      {entry.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entry.location && <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{entry.location}</div>}
                    {entry.description && <p className="text-sm">{entry.description}</p>}
                    {entry.witnesses && <div><p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Witnesses</p><p className="text-sm text-muted-foreground">{entry.witnesses}</p></div>}
                    {entry.documented && <Badge variant="outline" className="bg-success/10 text-success border-success/30">Officially Documented</Badge>}
                    <EvidenceThumbnails entryType="major-event" entryId={entry.id} documents={documents} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* DEPLOYMENTS TAB */}
        <TabsContent value="deployments" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={isDeployOpen} onOpenChange={(open) => { setIsDeployOpen(open); if (!open) resetDeployForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Deployment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingDeployId ? 'Edit Deployment' : 'Add Deployment'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDeploySubmit} className="flex flex-col">
                  <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" value={deployForm.startDate} onChange={(e) => setDeployForm({ ...deployForm, startDate: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" value={deployForm.endDate} onChange={(e) => setDeployForm({ ...deployForm, endDate: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Operation Name</Label>
                        <Input placeholder="e.g., OEF, OIF, OND, OIR" value={deployForm.operationName} onChange={(e) => setDeployForm({ ...deployForm, operationName: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <LocationAutocomplete
                          value={deployForm.location}
                          onChange={(val) => setDeployForm({ ...deployForm, location: val })}
                          onSelect={(val) => setDeployForm({ ...deployForm, location: val })}
                          placeholder="e.g., Afghanistan, Iraq"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input placeholder="Deployed unit" value={deployForm.unit} onChange={(e) => setDeployForm({ ...deployForm, unit: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Role/Position</Label>
                        <Input placeholder="Your role during deployment" value={deployForm.role} onChange={(e) => setDeployForm({ ...deployForm, role: e.target.value })} />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox checked={deployForm.combatDeployment} onCheckedChange={(c) => setDeployForm({ ...deployForm, combatDeployment: !!c })} />
                      This was a combat deployment
                    </label>
                    <div className="space-y-2">
                      <Label>Hazards Encountered</Label>
                      <Textarea placeholder="Environmental hazards, burn pits, combat exposure, etc." value={deployForm.hazardsEncountered} onChange={(e) => setDeployForm({ ...deployForm, hazardsEncountered: e.target.value })} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea placeholder="Additional details about this deployment" value={deployForm.notes} onChange={(e) => setDeployForm({ ...deployForm, notes: e.target.value })} rows={2} />
                    </div>

                    {/* Evidence Attachments - only show when editing */}
                    {editingDeployId && (
                      <div className="pt-2 border-t border-border">
                        <EvidenceAttachment
                          entryType="deployment"
                          entryId={editingDeployId}
                          documents={documents}
                          onDocumentsChange={setAllDocuments}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => setIsDeployOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingDeployId ? 'Update' : 'Save'} Deployment</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {deployments.length === 0 ? (
            <Card className="data-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Plane className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">No deployments documented yet.</p>
                <p className="text-sm text-muted-foreground text-center mt-1">Track overseas deployments and operations.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...(deployments || [])].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((entry) => (
                <Card key={entry.id} className="data-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.startDate).toLocaleDateString()} - {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditDeploy(entry)} aria-label="Edit deployment"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteDeployment(entry.id)} aria-label="Delete deployment"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2 flex items-center gap-2 flex-wrap">
                      <Plane className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="break-words min-w-0">{entry.operationName} - {entry.location}</span>
                      {entry.combatDeployment && <Badge variant="destructive" className="flex-shrink-0">Combat</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      {entry.unit && <div className="flex items-center gap-2 text-muted-foreground"><Shield className="h-4 w-4" />{entry.unit}</div>}
                      {entry.role && <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="h-4 w-4" />{entry.role}</div>}
                    </div>
                    {entry.hazardsEncountered && (
                      <div className="flex items-start gap-2 text-sm bg-exposure/5 border border-exposure/20 rounded-lg p-3">
                        <AlertTriangle className="h-4 w-4 text-exposure mt-0.5 flex-shrink-0" />
                        <div><p className="font-medium text-exposure text-xs uppercase tracking-wide mb-1">Hazards</p><p className="text-foreground/80">{entry.hazardsEncountered}</p></div>
                      </div>
                    )}
                    {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
                    <EvidenceThumbnails entryType="deployment" entryId={entry.id} documents={documents} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
