import { useState, useMemo, useCallback } from 'react';
import { safeFormatDate } from '@/utils/dateUtils';
import { Briefcase, Plus, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { useEvidence } from '@/hooks/useEvidence';
import { EvidenceAttachment, EvidenceThumbnails } from '@/components/shared/EvidenceAttachment';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/PageContainer';
import { useToast } from '@/hooks/use-toast';
import { useUserConditions } from '@/hooks/useUserConditions';
import { getConditionById } from '@/data/vaConditions';
import { getConditionDisplayName } from '@/utils/conditionResolver';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import useAppStore from '@/store/useAppStore';
import { EMPLOYMENT_IMPACT_TYPES } from '@/types/claims';
import type { EmploymentImpactEntry } from '@/types/claims';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function WorkImpact() {
  const entries = useAppStore((s) => s.employmentImpactEntries);
  const { addEntry, deleteEntry } = useMemo(() => {
    const s = useAppStore.getState();
    return { addEntry: s.addEmploymentImpact, deleteEntry: s.deleteEmploymentImpact };
  }, []);
  const { conditions: userConditions } = useUserConditions();
  const { documents, setAllDocuments } = useEvidence();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: todayStr(),
    type: '' as EmploymentImpactEntry['type'] | '',
    hoursLost: '',
    condition: '',
    description: '',
    notes: '',
  });

  const resetForm = () => setFormData({ date: todayStr(), type: '', hoursLost: '', condition: '', description: '', notes: '' });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.description) return;
    addEntry({
      date: formData.date,
      type: formData.type as EmploymentImpactEntry['type'],
      hoursLost: parseFloat(formData.hoursLost) || 0,
      condition: formData.condition,
      description: formData.description,
      notes: formData.notes || undefined,
    });
    setIsOpen(false);
    resetForm();
    toast({ title: 'Work impact logged', description: 'This documentation strengthens TDIU and increased rating claims.' });
  }, [formData, addEntry, toast]);

  const stats = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const recent = entries.filter((e) => e.date >= cutoffStr);
    const totalHours = recent.reduce((sum, e) => sum + e.hoursLost, 0);
    const missedDays = recent.filter((e) => e.type === 'missed-work').length;
    return { count: recent.length, totalHours, missedDays };
  }, [entries]);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  );

  return (
    <PageContainer className="py-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20">
            <Briefcase className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Work Impact</h1>
            <p className="text-muted-foreground text-sm">Track how conditions affect employment</p>
          </div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Log
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Work Impact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Impact type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData((p) => ({ ...p, type: v as EmploymentImpactEntry['type'] }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(EMPLOYMENT_IMPACT_TYPES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Hours lost</Label>
                <Input type="number" min="0" step="0.5" placeholder="e.g., 8" value={formData.hoursLost} onChange={(e) => setFormData((p) => ({ ...p, hoursLost: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Related condition</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData((p) => ({ ...p, condition: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    {userConditions.map((uc) => {
                      const details = getConditionById(uc.conditionId);
                      return <SelectItem key={uc.id} value={details?.name || getConditionDisplayName(uc)}>{getConditionDisplayName(uc)}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>What happened?</Label>
                <Textarea placeholder="Describe how your condition impacted work..." value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </div>
              <Button type="submit" disabled={!formData.type || !formData.description} className="w-full">Save Entry</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Why this matters */}
      <div className="flex gap-3 p-3 rounded-2xl border border-primary/20 bg-primary/5">
        <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Employment impact documentation is critical for TDIU claims and increased ratings. The VA needs
          evidence of how your conditions affect your ability to work, earn income, and perform job duties.
        </p>
      </div>

      {/* 30-Day Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-2xl">
          <CardContent className="py-3 px-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.count}</p>
            <p className="text-xs text-muted-foreground">Events (30d)</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="py-3 px-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.totalHours}</p>
            <p className="text-xs text-muted-foreground">Hours Lost</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="py-3 px-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.missedDays}</p>
            <p className="text-xs text-muted-foreground">Days Missed</p>
          </CardContent>
        </Card>
      </div>

      {/* Entry List */}
      {sorted.length === 0 ? (
        <Card className="border-dashed rounded-2xl">
          <CardContent className="py-8 text-center">
            <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No work impact entries yet.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Tap "Log" above to start tracking.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Entries
          </h3>
          {sorted.map((entry) => (
            <Card key={entry.id} className="rounded-2xl">
              <CardContent className="py-3 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px]">
                        {EMPLOYMENT_IMPACT_TYPES[entry.type]}
                      </Badge>
                      {entry.hoursLost > 0 && (
                        <Badge variant="secondary" className="text-[10px]">{entry.hoursLost}h lost</Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground">{entry.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{safeFormatDate(entry.date)}</span>
                      {entry.condition && entry.condition !== 'general' && (
                        <span>· {entry.condition}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <EvidenceAttachment
                      entryType="employment-impact"
                      entryId={entry.id}
                      documents={documents}
                      onDocumentsChange={setAllDocuments}
                      compact
                    />
                    <Button variant="ghost" size="sm" className="text-muted-foreground h-8 w-8 p-0" onClick={() => setDeleteId(entry.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <EvidenceThumbnails
                  entryType="employment-impact"
                  entryId={entry.id}
                  documents={documents}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete entry?"
        description="This work impact entry will be permanently deleted."
        onConfirm={() => { if (deleteId) { deleteEntry(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />
    </PageContainer>
  );
}
