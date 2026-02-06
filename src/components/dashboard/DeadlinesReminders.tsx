import { useState, useMemo, useEffect } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  CalendarClock, 
  Plus, 
  Trash2, 
  Clock, 
  AlertTriangle,
  FileText,
  Stethoscope,
  Scale,
  Bell,
  CheckCircle2,
  CalendarIcon,
} from 'lucide-react';
import { format, differenceInDays, addDays, addYears } from 'date-fns';
import { cn } from '@/lib/utils';
import type { DeadlineType } from '@/types/claims';

const deadlineTypeConfig: Record<DeadlineType, { 
  label: string; 
  icon: typeof FileText; 
  defaultDays?: number;
  description: string;
}> = {
  intent_to_file: { 
    label: 'Intent to File', 
    icon: FileText, 
    defaultDays: 365,
    description: '1 year from filing date to submit your claim'
  },
  cp_exam: { 
    label: 'C&P Exam', 
    icon: Stethoscope, 
    description: 'Scheduled Compensation & Pension examination'
  },
  nod_appeal: { 
    label: 'NOD Appeal', 
    icon: Scale, 
    defaultDays: 365,
    description: 'Notice of Disagreement - 1 year from decision'
  },
  hlr_appeal: { 
    label: 'Higher-Level Review', 
    icon: Scale, 
    defaultDays: 60,
    description: 'Higher-Level Review - 60 days from decision'
  },
  supplemental_claim: { 
    label: 'Supplemental Claim', 
    icon: FileText, 
    description: 'Supplemental claim with new evidence'
  },
  custom: { 
    label: 'Custom Reminder', 
    icon: Bell, 
    description: 'Personal reminder or deadline'
  },
};

function getUrgencyColor(daysRemaining: number): { 
  bg: string; 
  text: string; 
  border: string;
  label: string;
} {
  if (daysRemaining < 0) {
    return { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/50', label: 'Overdue' };
  }
  if (daysRemaining <= 7) {
    return { bg: 'bg-destructive/15', text: 'text-destructive', border: 'border-destructive/40', label: 'Urgent' };
  }
  if (daysRemaining <= 30) {
    return { bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/40', label: 'Soon' };
  }
  if (daysRemaining <= 90) {
    return { bg: 'bg-yellow-500/15', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/40', label: 'Upcoming' };
  }
  return { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', label: 'On Track' };
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = targetDate.getTime() - now.getTime();
  if (diff < 0) return null;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 7) return null; // Only show countdown for urgent deadlines

  return (
    <div className="flex items-center gap-1 text-xs font-mono bg-destructive/10 text-destructive px-2 py-1 rounded-md">
      <Clock className="h-3 w-3" />
      {days > 0 && <span>{days}d</span>}
      <span>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}

export function DeadlinesReminders() {
  const { data, addDeadline, updateDeadline, deleteDeadline } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [newDeadline, setNewDeadline] = useState({
    type: 'intent_to_file' as DeadlineType,
    title: '',
    date: '',
    notes: '',
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const deadlines = useMemo(() => data.deadlines ?? [], [data.deadlines]);

  const sortedDeadlines = useMemo(() => {
    return [...deadlines]
      .filter(d => !d.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [deadlines]);

  const handleAddDeadline = () => {
    if (!newDeadline.date) return;
    
    const config = deadlineTypeConfig[newDeadline.type];
    addDeadline({
      type: newDeadline.type,
      title: newDeadline.title || config.label,
      date: newDeadline.date,
      notes: newDeadline.notes,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    
    setNewDeadline({
      type: 'intent_to_file',
      title: '',
      date: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const handleTypeChange = (type: DeadlineType) => {
    const config = deadlineTypeConfig[type];
    let defaultDate = '';
    
    if (config.defaultDays) {
      defaultDate = addDays(new Date(), config.defaultDays).toISOString().split('T')[0];
    }
    
    setNewDeadline(prev => ({
      ...prev,
      type,
      title: config.label,
      date: defaultDate || prev.date,
    }));
  };

  const handleComplete = (id: string) => {
    updateDeadline(id, { completed: true });
  };

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Deadlines & Reminders
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Deadline</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Deadline Type</Label>
                  <Select value={newDeadline.type} onValueChange={(v) => handleTypeChange(v as DeadlineType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(deadlineTypeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {deadlineTypeConfig[newDeadline.type].description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Title (optional)</Label>
                  <Input
                    placeholder={deadlineTypeConfig[newDeadline.type].label}
                    value={newDeadline.title}
                    onChange={(e) => setNewDeadline(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deadline Date</Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newDeadline.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDeadline.date ? format(new Date(newDeadline.date), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newDeadline.date ? new Date(newDeadline.date) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setNewDeadline(prev => ({ ...prev, date: date.toISOString() }));
                            setDatePickerOpen(false);
                          }
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Any additional details..."
                    value={newDeadline.notes}
                    onChange={(e) => setNewDeadline(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddDeadline} className="w-full" disabled={!newDeadline.date}>
                  Add Deadline
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedDeadlines.length === 0 ? (
          <div className="text-center py-6">
            <CalendarClock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No deadlines set.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Track Intent to File, C&P exams, and appeal deadlines.
            </p>
          </div>
        ) : (
          sortedDeadlines.map((deadline) => {
            const daysRemaining = differenceInDays(new Date(deadline.date), new Date());
            const urgency = getUrgencyColor(daysRemaining);
            const config = deadlineTypeConfig[deadline.type];
            const Icon = config.icon;
            const isUrgent = daysRemaining <= 7 && daysRemaining >= 0;

            return (
              <div
                key={deadline.id}
                className={cn(
                  "rounded-xl p-3 border transition-all",
                  urgency.bg,
                  urgency.border
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-lg flex-shrink-0",
                      urgency.bg
                    )}>
                      <Icon className={cn("h-4 w-4", urgency.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(deadline.date), 'MMM d, yyyy')}
                      </p>
                      {deadline.notes && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {deadline.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        urgency.bg,
                        urgency.text
                      )}>
                        {daysRemaining < 0 
                          ? `${Math.abs(daysRemaining)}d overdue`
                          : daysRemaining === 0 
                            ? 'Today!'
                            : `${daysRemaining}d left`
                        }
                      </span>
                    </div>
                    {isUrgent && (
                      <CountdownTimer targetDate={new Date(deadline.date)} />
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-7 text-xs gap-1"
                    onClick={() => handleComplete(deadline.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Complete
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => deleteDeadline(deadline.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })
        )}

        {/* Quick Add Buttons */}
        {sortedDeadlines.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Quick Add:</p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => {
                  addDeadline({
                    type: 'intent_to_file',
                    title: 'Intent to File Deadline',
                    date: addYears(new Date(), 1).toISOString(),
                    notes: '',
                    completed: false,
                    createdAt: new Date().toISOString(),
                  });
                }}
              >
                <FileText className="h-3 w-3" />
                ITF (1 year)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => {
                  addDeadline({
                    type: 'hlr_appeal',
                    title: 'HLR Appeal Deadline',
                    date: addDays(new Date(), 60).toISOString(),
                    notes: '',
                    completed: false,
                    createdAt: new Date().toISOString(),
                  });
                }}
              >
                <Scale className="h-3 w-3" />
                HLR (60 days)
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
