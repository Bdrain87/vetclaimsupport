import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  CheckCircle2, 
  Flame, 
  Wind,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function QuickLogWidget() {
  const { data, addQuickLog } = useClaims();
  const { toast } = useToast();
  const [feeling, setFeeling] = useState(5);
  const [hadFlareUp, setHadFlareUp] = useState(false);
  const [flareUpNote, setFlareUpNote] = useState('');
  const [cpapUsed, setCpapUsed] = useState<boolean | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const loggedToday = data.quickLogs?.some(log => log.date === today);
  const usesCPAP = data.sleepEntries?.some(s => s.usesCPAP);

  const handleQuickLog = () => {
    setIsSubmitting(true);
    
    addQuickLog({
      date: today,
      overallFeeling: feeling,
      hadFlareUp,
      flareUpNote: hadFlareUp ? flareUpNote : '',
      cpapUsed: usesCPAP ? cpapUsed : undefined,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: '✓ Daily Log Saved',
      description: `Feeling: ${feeling}/10${hadFlareUp ? ' • Flare-up noted' : ''}`,
    });

    setFeeling(5);
    setHadFlareUp(false);
    setFlareUpNote('');
    setCpapUsed(undefined);
    setIsSubmitting(false);
  };

  const getFeelingLabel = (value: number) => {
    if (value <= 3) return 'Rough';
    if (value <= 6) return 'Okay';
    return 'Good';
  };

  if (loggedToday) {
    const todayLog = data.quickLogs?.find(log => log.date === today);
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Today's Log Complete</p>
          <p className="text-xs text-muted-foreground">
            Feeling: {todayLog?.overallFeeling}/10
            {todayLog?.hadFlareUp && ' • Flare-up noted'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-card border border-border shadow-sm overflow-hidden">
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-base font-semibold text-foreground">Quick Daily Log</h3>
            <p className="text-xs text-muted-foreground">Track your patterns</p>
          </div>
        </div>

        {/* Feeling Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">How are you feeling?</Label>
            <span className="text-2xl font-bold number-display text-foreground">
              {feeling}
            </span>
          </div>
          <Slider
            value={[feeling]}
            onValueChange={([v]) => setFeeling(v)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span className="font-medium text-foreground">{getFeelingLabel(feeling)}</span>
            <span>10</span>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-0 rounded-xl overflow-hidden bg-secondary border border-border">
          {/* Flare-up Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Flame className="h-4 w-4 text-warning" />
              <Label htmlFor="flare-up" className="text-sm cursor-pointer text-foreground">
                Any flare-ups?
              </Label>
            </div>
            <Switch
              id="flare-up"
              checked={hadFlareUp}
              onCheckedChange={setHadFlareUp}
            />
          </div>

          {/* CPAP Toggle */}
          {usesCPAP && (
            <>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Wind className="h-4 w-4 text-primary" />
                  <Label htmlFor="cpap" className="text-sm cursor-pointer text-foreground">
                    CPAP used?
                  </Label>
                </div>
                <Switch
                  id="cpap"
                  checked={cpapUsed === true}
                  onCheckedChange={setCpapUsed}
                />
              </div>
            </>
          )}
        </div>

        {/* Flare-up Note */}
        {hadFlareUp && (
          <Textarea
            placeholder="Brief note about the flare-up..."
            value={flareUpNote}
            onChange={(e) => setFlareUpNote(e.target.value)}
            className="min-h-[80px]"
          />
        )}

        {/* Submit */}
        <Button 
          onClick={handleQuickLog} 
          className="w-full"
          disabled={isSubmitting}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Log Today
        </Button>
      </CardContent>
    </Card>
  );
}