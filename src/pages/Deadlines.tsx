import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Clock, AlertTriangle, Plus, Trash2, CalendarDays,
  Shield, Scale, Stethoscope, FileText, Bell, CheckCircle2,
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { COMP_RATES_2026 } from '@/data/compRates2026';
import { PageContainer } from '@/components/PageContainer';
import { cn } from '@/lib/utils';
import type { DeadlineType, Deadline } from '@/types/claims';

const DEADLINE_META: Record<DeadlineType, {
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  defaultDaysFromNow?: number;
}> = {
  intent_to_file: {
    label: 'Intent to File',
    icon: <Shield className="h-4 w-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    description: 'You have 1 year from filing your ITF to submit your full claim. Missing this deadline means a later effective date and less back pay.',
    defaultDaysFromNow: 365,
  },
  cp_exam: {
    label: 'C&P Exam',
    icon: <Stethoscope className="h-4 w-4" />,
    color: 'text-purple-600 dark:text-purple-400',
    description: 'Your compensation and pension examination. Missing it can result in claim denial.',
  },
  nod_appeal: {
    label: 'Notice of Disagreement',
    icon: <Scale className="h-4 w-4" />,
    color: 'text-red-600 dark:text-red-400',
    description: 'Board of Veterans Appeals appeal. Must be filed within 1 year of the decision you are appealing.',
    defaultDaysFromNow: 365,
  },
  hlr_appeal: {
    label: 'Higher-Level Review',
    icon: <Scale className="h-4 w-4" />,
    color: 'text-orange-600 dark:text-orange-400',
    description: 'A senior reviewer re-examines your claim. Must be filed within 1 year of the decision.',
    defaultDaysFromNow: 365,
  },
  supplemental_claim: {
    label: 'Supplemental Claim',
    icon: <FileText className="h-4 w-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    description: 'Submit new and relevant evidence. Must be filed within 1 year of the decision to preserve effective date.',
    defaultDaysFromNow: 365,
  },
  custom: {
    label: 'Custom Deadline',
    icon: <CalendarDays className="h-4 w-4" />,
    color: 'text-gray-600 dark:text-gray-400',
    description: 'A custom deadline you want to track.',
  },
};

function getDaysRemaining(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyLevel(daysRemaining: number): 'expired' | 'critical' | 'urgent' | 'warning' | 'healthy' {
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= 7) return 'critical';
  if (daysRemaining <= 30) return 'urgent';
  if (daysRemaining <= 90) return 'warning';
  return 'healthy';
}

function getUrgencyStyles(urgency: ReturnType<typeof getUrgencyLevel>) {
  switch (urgency) {
    case 'expired': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-500 text-white' };
    case 'critical': return { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30' };
    case 'urgent': return { bg: 'bg-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30' };
    case 'warning': return { bg: 'bg-yellow-500/5', border: 'border-yellow-500/20', text: 'text-yellow-600 dark:text-yellow-400', badge: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30' };
    case 'healthy': return { bg: 'bg-green-500/5', border: 'border-green-500/20', text: 'text-green-600 dark:text-green-400', badge: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30' };
  }
}

function DeadlineCard({ deadline, onDelete, onComplete }: {
  deadline: Deadline;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const daysRemaining = getDaysRemaining(deadline.date);
  const urgency = getUrgencyLevel(daysRemaining);
  const styles = getUrgencyStyles(urgency);
  const meta = DEADLINE_META[deadline.type];
  const totalDays = meta.defaultDaysFromNow || 365;
  const elapsed = totalDays - daysRemaining;
  const progress = Math.max(0, Math.min(100, (elapsed / totalDays) * 100));

  // Calculate cost of missing ITF deadline
  const itfCostPerMonth = deadline.type === 'intent_to_file'
    ? (COMP_RATES_2026[50] || 0)
    : 0;

  return (
    <Card className={cn('border-0 shadow-md transition-all', deadline.completed && 'opacity-60')}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg', styles.bg)}>
            <span className={meta.color}>{meta.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{deadline.title}</h3>
              <Badge variant="outline" className={cn('text-[10px]', styles.badge)}>
                {urgency === 'expired' ? 'EXPIRED' : `${daysRemaining}d left`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(deadline.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-1">
            {!deadline.completed && (
              <Button variant="ghost" size="sm" onClick={() => onComplete(deadline.id)} title="Mark complete">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => onDelete(deadline.id)} title="Remove">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {!deadline.completed && (
          <>
            <Progress
              value={progress}
              className={cn('h-1.5', urgency === 'critical' && '[&>div]:bg-red-500', urgency === 'urgent' && '[&>div]:bg-orange-500')}
            />

            {urgency !== 'healthy' && (
              <Alert className={cn('py-2', styles.bg, styles.border)}>
                <AlertTriangle className={cn('h-3.5 w-3.5', styles.text)} />
                <AlertDescription className={cn('text-xs', styles.text)}>
                  {urgency === 'expired' && 'This deadline has passed. Contact a VSO immediately to discuss your options.'}
                  {urgency === 'critical' && `Only ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining. Take action now.`}
                  {urgency === 'urgent' && `${daysRemaining} days remaining. Start preparing now to meet this deadline.`}
                  {urgency === 'warning' && `${daysRemaining} days remaining. Plan ahead to gather everything you need.`}
                  {deadline.type === 'intent_to_file' && urgency !== 'expired' && itfCostPerMonth > 0 && (
                    <span className="block mt-1 font-medium">
                      Missing this deadline could cost ~${itfCostPerMonth.toLocaleString()}/month in back pay.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {deadline.notes && (
          <p className="text-xs text-muted-foreground italic">{deadline.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Deadlines() {
  const deadlines = useAppStore((s) => s.deadlines);
  const addDeadline = useAppStore((s) => s.addDeadline);
  const updateDeadline = useAppStore((s) => s.updateDeadline);
  const deleteDeadline = useAppStore((s) => s.deleteDeadline);
  const intentToFileDate = useProfileStore((s) => s.intentToFileDate);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newType, setNewType] = useState<DeadlineType>('intent_to_file');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Auto-create ITF deadline if user has ITF date but no ITF deadline
  const hasItfDeadline = deadlines.some(d => d.type === 'intent_to_file');

  const sortedDeadlines = useMemo(() => {
    const active = deadlines.filter(d => !d.completed);
    const completed = deadlines.filter(d => d.completed);

    active.sort((a, b) => {
      const daysA = getDaysRemaining(a.date);
      const daysB = getDaysRemaining(b.date);
      return daysA - daysB;
    });

    return { active, completed };
  }, [deadlines]);

  const urgentCount = useMemo(() => {
    return sortedDeadlines.active.filter(d => {
      const days = getDaysRemaining(d.date);
      return days <= 30;
    }).length;
  }, [sortedDeadlines.active]);

  const handleAdd = useCallback(() => {
    if (!newDate) return;
    const meta = DEADLINE_META[newType];
    addDeadline({
      type: newType,
      title: newTitle || meta.label,
      date: newDate,
      notes: newNotes,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setShowAddDialog(false);
    setNewTitle('');
    setNewDate('');
    setNewNotes('');
    setNewType('intent_to_file');
  }, [newType, newTitle, newDate, newNotes, addDeadline]);

  const handleComplete = useCallback((id: string) => {
    updateDeadline(id, { completed: true });
  }, [updateDeadline]);

  return (
    <PageContainer className="py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Deadline Tracker</h1>
            <p className="text-muted-foreground">Never miss a critical VA deadline</p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {/* ITF Warning */}
      {intentToFileDate && !hasItfDeadline && (
        <Alert className="border-blue-500/30 bg-blue-500/5">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            You have an Intent to File date ({new Date(intentToFileDate).toLocaleDateString()}) but no ITF
            deadline tracked here. Would you like to add it?
            <Button
              variant="outline"
              size="sm"
              className="ml-3"
              onClick={() => {
                const expiry = new Date(intentToFileDate);
                expiry.setFullYear(expiry.getFullYear() + 1);
                addDeadline({
                  type: 'intent_to_file',
                  title: 'Intent to File Expiration',
                  date: expiry.toISOString().split('T')[0],
                  notes: `ITF filed on ${new Date(intentToFileDate).toLocaleDateString()}`,
                  completed: false,
                  createdAt: new Date().toISOString(),
                });
              }}
            >
              Add ITF Deadline
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Urgent Summary */}
      {urgentCount > 0 && (
        <Alert className="border-red-500/30 bg-red-500/5">
          <Bell className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            <strong>{urgentCount} deadline{urgentCount > 1 ? 's' : ''}</strong> due within 30 days.
            Review and take action on each one below.
          </AlertDescription>
        </Alert>
      )}

      {/* Active Deadlines */}
      {sortedDeadlines.active.length === 0 && sortedDeadlines.completed.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center space-y-3">
            <div className="p-4 rounded-full bg-muted inline-flex">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No deadlines tracked</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Add your VA deadlines to get reminders and never miss a filing date.
              Track your Intent to File, appeal deadlines, C&P exams, and more.
            </p>
            <Button variant="outline" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Deadline
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {sortedDeadlines.active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Active Deadlines</h2>
              {sortedDeadlines.active.map(d => (
                <DeadlineCard
                  key={d.id}
                  deadline={d}
                  onDelete={deleteDeadline}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}

          {sortedDeadlines.completed.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <h2 className="text-sm font-semibold text-muted-foreground">Completed</h2>
              {sortedDeadlines.completed.map(d => (
                <DeadlineCard
                  key={d.id}
                  deadline={d}
                  onDelete={deleteDeadline}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Deadline Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Deadline</DialogTitle>
            <DialogDescription>
              Track a VA deadline to get reminders and alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Deadline Type</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as DeadlineType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEADLINE_META).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        {meta.icon}
                        {meta.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{DEADLINE_META[newType].description}</p>
            </div>

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder={DEADLINE_META[newType].label}
              />
            </div>

            <div className="space-y-2">
              <Label>Deadline Date</Label>
              <Input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                placeholder="e.g., Decision letter dated Jan 15, 2026"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!newDate}>Add Deadline</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
