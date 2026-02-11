import React, { useState } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface QuickJournalEntryProps {
  onSave?: () => void;
  onCancel?: () => void;
}

const impactOptions = [
  { value: 'none', label: 'No impact today', color: 'text-success-500' },
  { value: 'mild', label: 'Some difficulty with tasks', color: 'text-success-400' },
  { value: 'moderate', label: 'Had to modify activities', color: 'text-warning-500' },
  { value: 'severe', label: 'Couldn\'t do normal activities', color: 'text-warning-600' },
  { value: 'extreme', label: 'Needed help with basic tasks', color: 'text-destructive' },
];

export function QuickJournalEntry({ onSave, onCancel }: QuickJournalEntryProps) {
  const { data, addSymptom } = useClaims();
  const [painLevel, setPainLevel] = useState(5);
  const [affectedConditions, setAffectedConditions] = useState<string[]>([]);
  const [impact, setImpact] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const claimConditions = data.claimConditions || [];

  const handleSave = async () => {
    setIsSaving(true);

    // Create a symptom entry for each affected condition
    const baseEntry = {
      date: new Date().toISOString().split('T')[0],
      severity: painLevel <= 3 ? 'Mild' : painLevel <= 6 ? 'Moderate' : 'Severe',
      duration: 'Daily',
      notes: `Pain Level: ${painLevel}/10\nImpact: ${impactOptions.find(o => o.value === impact)?.label || 'Not specified'}\n\n${notes}`,
      triggers: [],
      frequency: 'Daily',
    };

    // If conditions are selected, create entries for each
    if (affectedConditions.length > 0) {
      for (const conditionId of affectedConditions) {
        const condition = claimConditions.find(c => c.id === conditionId);
        if (condition) {
          addSymptom({
            ...baseEntry,
            symptom: `${condition.name} - Daily Log`,
            bodyArea: 'General',
          });
        }
      }
    } else {
      // Create a general entry if no conditions selected
      addSymptom({
        ...baseEntry,
        symptom: 'Daily Health Log',
        bodyArea: 'General',
      });
    }

    setIsSaving(false);
    onSave?.();
  };

  const toggleCondition = (conditionId: string) => {
    setAffectedConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const getPainColor = () => {
    if (painLevel <= 3) return 'text-success-500';
    if (painLevel <= 6) return 'text-warning-500';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">How are you feeling today?</h2>
        <p className="text-sm text-muted-foreground mt-1">Quick entry - takes less than 30 seconds</p>
      </div>

      {/* Pain Level Slider */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Pain/Discomfort Level</Label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10"
            value={painLevel}
            onChange={(e) => setPainLevel(Number(e.target.value))}
            className={cn(
              "w-full h-2 rounded-full appearance-none cursor-pointer",
              "bg-muted",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:w-6",
              "[&::-webkit-slider-thumb]:h-6",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:cursor-pointer",
              "[&::-webkit-slider-thumb]:transition-transform",
              "[&::-webkit-slider-thumb]:hover:scale-110",
              painLevel <= 3
                ? "[&::-webkit-slider-thumb]:bg-success-500"
                : painLevel <= 6
                  ? "[&::-webkit-slider-thumb]:bg-warning-500"
                  : "[&::-webkit-slider-thumb]:bg-destructive"
            )}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>0 (None)</span>
            <span className={cn("text-2xl font-bold", getPainColor())}>{painLevel}</span>
            <span>10 (Worst)</span>
          </div>
        </div>
      </div>

      {/* Affected Conditions - Quick checkboxes */}
      {claimConditions.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Conditions affected today</Label>
          <div className="flex flex-wrap gap-2">
            {claimConditions.map((condition) => {
              const isSelected = affectedConditions.includes(condition.id);
              return (
                <button
                  key={condition.id}
                  type="button"
                  onClick={() => toggleCondition(condition.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    "border transition-all duration-200",
                    "active:scale-95",
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary border-border hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded flex items-center justify-center",
                    isSelected ? "bg-primary" : "border border-muted-foreground/30"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {condition.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Impact on Daily Activities - Quick select */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Impact on daily activities</Label>
        <div className="space-y-2">
          {impactOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setImpact(option.value)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left",
                "border transition-all duration-200",
                "active:scale-[0.98]",
                impact === option.value
                  ? "bg-primary/10 border-primary"
                  : "bg-secondary border-border hover:border-primary/30"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                impact === option.value
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30"
              )}>
                {impact === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={cn(
                "text-sm",
                impact === option.value ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Notes (optional)</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific symptoms, triggers, or limitations..."
          className="min-h-[80px] resize-none"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-12"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex-1 h-12",
            "bg-success-500 hover:bg-success-600 text-white"
          )}
        >
          <Check className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Entry'}
        </Button>
      </div>
    </div>
  );
}

export default QuickJournalEntry;
