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

  const getFeelingColor = (value: number) => {
    if (value <= 3) return 'text-red-400';
    if (value <= 6) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getFeelingLabel = (value: number) => {
    if (value <= 3) return 'Rough';
    if (value <= 6) return 'Okay';
    return 'Good';
  };

  if (loggedToday) {
    const todayLog = data.quickLogs?.find(log => log.date === today);
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        </div>
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
    <Card className="data-card overflow-hidden">
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Quick Daily Log</h3>
            <p className="text-xs text-muted-foreground">Track your patterns</p>
          </div>
        </div>

        {/* Feeling Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">How are you feeling?</Label>
            <span className={cn("text-2xl font-bold number-display", getFeelingColor(feeling))}>
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
            <span className={cn("font-medium", getFeelingColor(feeling))}>{getFeelingLabel(feeling)}</span>
            <span>10</span>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-2 rounded-xl overflow-hidden bg-white/[0.03]">
          {/* Flare-up Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                <Flame className="h-4 w-4 text-orange-400" />
              </div>
              <Label htmlFor="flare-up" className="text-sm cursor-pointer">
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
              <div className="border-t border-white/[0.04]" />
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <Wind className="h-4 w-4 text-blue-400" />
                  </div>
                  <Label htmlFor="cpap" className="text-sm cursor-pointer">
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