import { useState, useMemo } from 'react';
import { format, differenceInDays, addDays, subDays, isWithinInterval } from 'date-fns';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface BDDCountdownProps {
  separationDate: Date | null;
  onSeparationDateChange: (date: Date | null) => void;
}

export function BDDCountdown({ separationDate, onSeparationDateChange }: BDDCountdownProps) {
  const [open, setOpen] = useState(false);

  const bddStatus = useMemo(() => {
    if (!separationDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sepDate = new Date(separationDate);
    sepDate.setHours(0, 0, 0, 0);

    const daysUntilSeparation = differenceInDays(sepDate, today);
    const bddWindowStart = subDays(sepDate, 180);
    const bddWindowEnd = subDays(sepDate, 90);

    const isInBDDWindow = isWithinInterval(today, { start: bddWindowStart, end: bddWindowEnd });
    const isTooEarly = today < bddWindowStart;
    const isTooLate = today > bddWindowEnd;
    const daysUntilWindowOpens = differenceInDays(bddWindowStart, today);
    const daysLeftInWindow = differenceInDays(bddWindowEnd, today);

    return {
      daysUntilSeparation,
      isInBDDWindow,
      isTooEarly,
      isTooLate,
      daysUntilWindowOpens,
      daysLeftInWindow,
      bddWindowStart,
      bddWindowEnd,
    };
  }, [separationDate]);

  return (
    <Card className={cn(
      'data-card',
      bddStatus?.isInBDDWindow && 'border-success/30 bg-success/5',
      bddStatus?.isTooLate && 'border-destructive/30 bg-destructive/5'
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          BDD Claim Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Separation Date (ETS/DOS)
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !separationDate && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {separationDate ? format(separationDate, 'PPP') : 'Select your separation date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={separationDate || undefined}
                  onSelect={(date) => {
                    onSeparationDateChange(date || null);
                    setOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status Display */}
          {bddStatus && (
            <div className="space-y-4">
              {/* Days until separation */}
              <div className="text-center py-4 bg-muted/50 rounded-lg">
                <p className="text-4xl font-bold text-foreground">{bddStatus.daysUntilSeparation}</p>
                <p className="text-sm text-muted-foreground">days until separation</p>
              </div>

              {/* BDD Window Status */}
              {bddStatus.isInBDDWindow && (
                <div className="flex gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-success">You're in the BDD window!</p>
                    <p className="text-sm text-foreground/80">
                      You have <strong>{bddStatus.daysLeftInWindow} days</strong> left to file your BDD claim.
                      File now to get your rating decision soon after separation.
                    </p>
                  </div>
                </div>
              )}

              {bddStatus.isTooEarly && (
                <div className="flex gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">BDD window opens soon</p>
                    <p className="text-sm text-foreground/80">
                      The BDD window opens in <strong>{bddStatus.daysUntilWindowOpens} days</strong> 
                      ({format(bddStatus.bddWindowStart, 'MMM d, yyyy')}). Use this time to gather 
                      medical records, buddy statements, and document your conditions.
                    </p>
                  </div>
                </div>
              )}

              {bddStatus.isTooLate && bddStatus.daysUntilSeparation > 0 && (
                <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">BDD window has closed</p>
                    <p className="text-sm text-foreground/80">
                      You're now within 90 days of separation. You must wait until after your 
                      separation date to file a standard VA disability claim.
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline visualization */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>180 days (window opens)</span>
                  <span>90 days (window closes)</span>
                  <span>Separation</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  {/* Full bar representing 180 days */}
                  <div 
                    className="absolute h-full bg-success/50" 
                    style={{ 
                      left: '0%', 
                      width: '50%' 
                    }} 
                  />
                  {/* Current position marker */}
                  {bddStatus.daysUntilSeparation <= 180 && bddStatus.daysUntilSeparation > 0 && (
                    <div 
                      className="absolute top-0 w-1 h-full bg-primary"
                      style={{ 
                        left: `${((180 - bddStatus.daysUntilSeparation) / 180) * 100}%` 
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {format(bddStatus.bddWindowStart, 'MMM d')}
                  </span>
                  <span className="text-muted-foreground">
                    {format(bddStatus.bddWindowEnd, 'MMM d')}
                  </span>
                  <span className="font-medium text-foreground">
                    {format(separationDate!, 'MMM d')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!separationDate && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Enter your separation date to see your BDD claim timeline
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
