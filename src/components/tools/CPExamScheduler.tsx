import { useState } from 'react';
import { Calendar, Clock, MapPin, Bell, FileText, Plus, Trash2, Edit2, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, differenceInDays, isBefore, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { useClaims } from '@/context/ClaimsContext';
import { toast } from 'sonner';

interface ScheduledExam {
  id: string;
  condition: string;
  date: Date;
  time: string;
  location: string;
  examiner: string;
  notes: string;
  reminder: boolean;
  reminderDays: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: Date;
}

const EXAM_TIMES = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

const EXAMINER_TYPES = [
  'VA Medical Center',
  'QTC Medical Services',
  'VES (Veterans Evaluation Services)',
  'LHI (Logistics Health Inc)',
  'Other Contract Examiner'
];

export function CPExamScheduler() {
  const { data } = useClaims();
  const [exams, setExams] = useState<ScheduledExam[]>(() => {
    const saved = localStorage.getItem('scheduled-cp-exams');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((exam: any) => ({
        ...exam,
        date: new Date(exam.date),
        createdAt: new Date(exam.createdAt)
      }));
    }
    return [];
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('');
  const [examiner, setExaminer] = useState('');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState('3');

  const saveExams = (updatedExams: ScheduledExam[]) => {
    localStorage.setItem('scheduled-cp-exams', JSON.stringify(updatedExams));
    setExams(updatedExams);
  };

  const resetForm = () => {
    setSelectedCondition('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setLocation('');
    setExaminer('');
    setNotes('');
    setReminder(true);
    setReminderDays('3');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!selectedCondition || !selectedDate || !selectedTime) {
      toast.error('Please fill in condition, date, and time');
      return;
    }

    const newExam: ScheduledExam = {
      id: editingId || crypto.randomUUID(),
      condition: selectedCondition,
      date: selectedDate,
      time: selectedTime,
      location,
      examiner,
      notes,
      reminder,
      reminderDays: parseInt(reminderDays),
      status: 'upcoming',
      createdAt: editingId ? exams.find(e => e.id === editingId)?.createdAt || new Date() : new Date()
    };

    if (editingId) {
      const updated = exams.map(e => e.id === editingId ? newExam : e);
      saveExams(updated);
      toast.success('Exam updated successfully');
    } else {
      saveExams([...exams, newExam]);
      toast.success('Exam scheduled successfully');
    }
    
    resetForm();
  };

  const handleEdit = (exam: ScheduledExam) => {
    setEditingId(exam.id);
    setSelectedCondition(exam.condition);
    setSelectedDate(exam.date);
    setSelectedTime(exam.time);
    setLocation(exam.location);
    setExaminer(exam.examiner);
    setNotes(exam.notes);
    setReminder(exam.reminder);
    setReminderDays(exam.reminderDays.toString());
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const updated = exams.filter(e => e.id !== id);
    saveExams(updated);
    toast.success('Exam removed');
  };

  const handleStatusChange = (id: string, status: 'completed' | 'cancelled') => {
    const updated = exams.map(e => e.id === id ? { ...e, status } : e);
    saveExams(updated);
    toast.success(`Exam marked as ${status}`);
  };

  const getExamStatus = (exam: ScheduledExam) => {
    if (exam.status === 'completed') return { label: 'Completed', color: 'bg-green-500/10 text-green-600' };
    if (exam.status === 'cancelled') return { label: 'Cancelled', color: 'bg-muted text-muted-foreground' };
    
    const daysUntil = differenceInDays(exam.date, new Date());
    if (isToday(exam.date)) return { label: 'Today!', color: 'bg-red-500/10 text-red-600' };
    if (daysUntil < 0) return { label: 'Past Due', color: 'bg-orange-500/10 text-orange-600' };
    if (daysUntil <= 3) return { label: `${daysUntil} days`, color: 'bg-amber-500/10 text-amber-600' };
    if (daysUntil <= 7) return { label: `${daysUntil} days`, color: 'bg-blue-500/10 text-blue-600' };
    return { label: `${daysUntil} days`, color: 'bg-muted text-muted-foreground' };
  };

  const upcomingExams = exams
    .filter(e => e.status === 'upcoming')
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const pastExams = exams
    .filter(e => e.status !== 'upcoming')
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const conditionOptions = data.claimConditions && data.claimConditions.length > 0 
    ? data.claimConditions.map(c => c.name)
    : ['PTSD', 'Lower Back Strain', 'Tinnitus', 'Sleep Apnea', 'Migraines', 'Knee Condition'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            C&P Exam Scheduler
          </CardTitle>
          <CardDescription>
            Track and manage your Compensation & Pension exam appointments. Stay organized and never miss an exam.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {isAdding ? (
        <Card className="data-card border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {editingId ? 'Edit Exam' : 'Schedule New Exam'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Condition */}
            <div className="space-y-2">
              <Label>Condition Being Examined</Label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition..." />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => isBefore(date, new Date())}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TIMES.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location / Address</Label>
              <Input
                placeholder="e.g., VA Medical Center, 123 Main St..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Examiner Type */}
            <div className="space-y-2">
              <Label>Examiner / Contractor</Label>
              <Select value={examiner} onValueChange={setExaminer}>
                <SelectTrigger>
                  <SelectValue placeholder="Who is conducting the exam?" />
                </SelectTrigger>
                <SelectContent>
                  {EXAMINER_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any special instructions, what to bring, parking info..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Reminder Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="text-sm">Reminder</span>
              </div>
              <div className="flex items-center gap-3">
                <Select value={reminderDays} onValueChange={setReminderDays} disabled={!reminder}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                  </SelectContent>
                </Select>
                <Switch checked={reminder} onCheckedChange={setReminder} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                {editingId ? 'Update Exam' : 'Schedule Exam'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full h-12">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Exam
        </Button>
      )}

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Upcoming Exams ({upcomingExams.length})
          </h3>
          {upcomingExams.map(exam => {
            const status = getExamStatus(exam);
            return (
              <Card key={exam.id} className="data-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{exam.condition}</h4>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(exam.date, 'EEE, MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {exam.time}
                        </span>
                      </div>
                      
                      {exam.location && (
                        <p className="text-sm flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {exam.location}
                        </p>
                      )}
                      
                      {exam.examiner && (
                        <p className="text-xs text-muted-foreground">{exam.examiner}</p>
                      )}
                      
                      {exam.notes && (
                        <p className="text-xs text-muted-foreground flex items-start gap-1 mt-2">
                          <FileText className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                          {exam.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(exam)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleStatusChange(exam.id, 'completed')}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(exam.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Past/Completed Exams */}
      {pastExams.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Past Exams ({pastExams.length})
          </h3>
          {pastExams.map(exam => (
            <Card key={exam.id} className="data-card opacity-60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{exam.condition}</span>
                      <Badge variant="outline" className={exam.status === 'completed' ? 'text-green-600' : ''}>
                        {exam.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(exam.date, 'MMM d, yyyy')} at {exam.time}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(exam.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {exams.length === 0 && !isAdding && (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No exams scheduled yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Add your C&P exam appointments to stay organized.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="data-card bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium">C&P Exam Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Arrive 15-30 minutes early with ID</li>
                <li>Bring all medical records and buddy statements</li>
                <li>Describe your <strong>worst days</strong>, not your best</li>
                <li>Never say "I'm fine" or minimize symptoms</li>
                <li>Use the C&P Exam Prep tool to prepare answers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
