import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  CheckCircle2, 
  Flame, 
  Wind,
  ThumbsUp,
  ThumbsDown,
  Meh
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuickLogWidget() {
  const { data, addQuickLog } = useClaims();
  const { toast } = useToast();
  const [feeling, setFeeling] = useState(5);
  const [hadFlareUp, setHadFlareUp] = useState(false);
  const [flareUpNote, setFlareUpNote] = useState('');
  const [cpapUsed, setCpapUsed] = useState<boolean | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already logged today
  const today = new Date().toISOString().split('T')[0];
  const loggedToday = data.quickLogs?.some(log => log.date === today);

  // Check if user uses CPAP (has sleep entries with CPAP)
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

    // Reset form
    setFeeling(5);
    setHadFlareUp(false);
    setFlareUpNote('');
    setCpapUsed(undefined);
    setIsSubmitting(false);
  };

  const getFeelingEmoji = (value: number) => {
    if (value <= 3) return { icon: ThumbsDown, color: 'text-destructive', label: 'Rough day' };
    if (value <= 6) return { icon: Meh, color: 'text-warning', label: 'Getting by' };
    return { icon: ThumbsUp, color: 'text-success', label: 'Good day' };
  };

  const feelingInfo = getFeelingEmoji(feeling);

  if (loggedToday) {
    const todayLog = data.quickLogs?.find(log => log.date === today);
    return (
      <Card className="data-card border-success/30 bg-success/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Today's Log Complete</p>
              <p className="text-sm text-muted-foreground">
                Feeling: {todayLog?.overallFeeling}/10
                {todayLog?.hadFlareUp && ' • Flare-up noted'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Daily Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Feeling Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">How are you feeling today?</Label>
            <Badge variant="outline" className={feelingInfo.color}>
              <feelingInfo.icon className="h-3 w-3 mr-1" />
              {feeling}/10
            </Badge>
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
            <span>Worst</span>
            <span className={feelingInfo.color}>{feelingInfo.label}</span>
            <span>Best</span>
          </div>
        </div>

        {/* Flare-up Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <Label htmlFor="flare-up" className="text-sm cursor-pointer">
              Any flare-ups today?
            </Label>
          </div>
          <Switch
            id="flare-up"
            checked={hadFlareUp}
            onCheckedChange={setHadFlareUp}
          />
        </div>

        {/* Flare-up Note */}
        {hadFlareUp && (
          <Textarea
            placeholder="Brief note about the flare-up (optional)..."
            value={flareUpNote}
            onChange={(e) => setFlareUpNote(e.target.value)}
            className="h-16 text-sm"
          />
        )}

        {/* CPAP Toggle (if applicable) */}
        {usesCPAP && (
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-500" />
              <Label htmlFor="cpap" className="text-sm cursor-pointer">
                CPAP used last night?
              </Label>
            </div>
            <Switch
              id="cpap"
              checked={cpapUsed === true}
              onCheckedChange={setCpapUsed}
            />
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleQuickLog} 
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          <CheckCircle2 className="h-4 w-4" />
          Log Today
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Quick logs help track patterns for your VA claim
        </p>
      </CardContent>
    </Card>
  );
}
