import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, ClipboardCheck, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const initialChecklist: ChecklistItem[] = [
  { id: 'review-visits', label: 'Review all your documented medical visits', checked: false },
  { id: 'bring-records', label: 'Bring copies of service treatment records', checked: false },
  { id: 'list-symptoms', label: 'List all current symptoms and their frequency', checked: false },
  { id: 'note-impact', label: 'Note how conditions affect daily life and work', checked: false },
  { id: 'bring-meds', label: 'Bring list of all medications', checked: false },
  { id: 'arrive-early', label: 'Arrive 15 minutes early', checked: false },
  { id: 'be-honest', label: "Be honest but thorough - describe your worst days", checked: false },
  { id: 'no-minimize', label: "Don't minimize symptoms", checked: false },
  { id: 'bring-buddy', label: 'Bring a buddy for support if allowed', checked: false },
];

const STORAGE_KEY = 'cpExamChecklist';

export function CPExamPrepTab() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialChecklist;
      }
    }
    return initialChecklist;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
    } catch {
      // Storage full or unavailable
    }
  }, [checklist]);

  const handleCheck = (id: string, checked: boolean) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const completedCount = checklist.filter(item => item.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-6">
      <Alert className="border-primary/30 bg-primary/5">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground">
          <strong>The C&P exam is crucial</strong> — it's how the VA determines your rating. Be prepared and don't leave anything out.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">C&P Exam Preparation Checklist</CardTitle>
                <CardDescription>Complete these steps before your Compensation & Pension exam</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progressPercent}%</div>
              <div className="text-xs text-muted-foreground">{completedCount}/{checklist.length} complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checklist.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={(checked) => handleCheck(item.id, checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor={item.id}
                  className={`flex-1 text-sm cursor-pointer ${
                    item.checked ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}
                >
                  <span className="font-medium text-muted-foreground mr-2">{index + 1}.</span>
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {completedCount === checklist.length && (
            <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/30 text-center">
              <p className="text-success font-medium"><Sparkles className="h-4 w-4 inline" /> You're fully prepared for your C&P exam!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pro Tips for Your C&P Exam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">!</div>
            <p>Describe your <strong className="text-foreground">worst days</strong>, not your best. The examiner needs to understand the full impact.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">!</div>
            <p>If a condition causes <strong className="text-foreground">secondary issues</strong> (e.g., pain causing sleep problems), mention all of them.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">!</div>
            <p>The examiner may not read your entire file. Be ready to <strong className="text-foreground">summarize key incidents</strong> and dates.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">!</div>
            <p>You can request a copy of the <strong className="text-foreground">DBQ (Disability Benefits Questionnaire)</strong> after your exam.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
