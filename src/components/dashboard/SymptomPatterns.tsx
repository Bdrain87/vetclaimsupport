import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays, parseISO, getDay } from 'date-fns';

const chartConfig = {
  count: {
    label: 'Symptoms',
    color: 'hsl(var(--success))',
  },
};

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SymptomPatterns() {
  const { data } = useClaims();

  const { chartData, topSymptoms, dayPatterns, insights } = useMemo(() => {
    const symptoms = data.symptoms || [];
    
    if (symptoms.length === 0) {
      return { chartData: [], topSymptoms: [], dayPatterns: [], insights: [] };
    }

    // Generate last 30 days of data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'MMM d'),
        count: 0,
      };
    });

    // Count symptoms per day
    symptoms.forEach((symptom) => {
      const symptomDate = format(parseISO(symptom.date), 'yyyy-MM-dd');
      const dayData = last30Days.find((d) => d.date === symptomDate);
      if (dayData) {
        dayData.count += 1;
      }
    });

    // Get top symptoms
    const symptomCounts: Record<string, number> = {};
    symptoms.forEach((s) => {
      symptomCounts[s.symptom] = (symptomCounts[s.symptom] || 0) + 1;
    });
    const topSymptomsList = Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Day of week patterns
    const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    symptoms.forEach((s) => {
      const dayOfWeek = getDay(parseISO(s.date));
      dayCounts[dayOfWeek] += 1;
    });
    const dayPatternsList = Object.entries(dayCounts)
      .map(([day, count]) => ({ day: DAYS_OF_WEEK[parseInt(day)], count }))
      .sort((a, b) => b.count - a.count);

    // Generate insights
    const insightsList: string[] = [];
    
    // Worst day insight
    if (dayPatternsList[0]?.count > 0) {
      const worstDay = dayPatternsList[0].day;
      const worstCount = dayPatternsList[0].count;
      if (worstCount >= 2) {
        insightsList.push(`Symptoms tend to be more frequent on ${worstDay}s`);
      }
    }

    // Recent trend insight
    const last7Days = last30Days.slice(-7);
    const first7Days = last30Days.slice(0, 7);
    const recentTotal = last7Days.reduce((sum, d) => sum + d.count, 0);
    const earlierTotal = first7Days.reduce((sum, d) => sum + d.count, 0);
    
    if (recentTotal > earlierTotal && earlierTotal > 0) {
      insightsList.push('Symptom frequency has increased in the past week');
    } else if (recentTotal < earlierTotal && recentTotal > 0) {
      insightsList.push('Symptom frequency has decreased compared to earlier');
    }

    // High severity insight
    const highSeveritySymptoms = symptoms.filter((s) => s.severity >= 7);
    if (highSeveritySymptoms.length > 0) {
      const percent = Math.round((highSeveritySymptoms.length / symptoms.length) * 100);
      if (percent >= 30) {
        insightsList.push(`${percent}% of logged symptoms are high severity (7+)`);
      }
    }

    // Body area pattern
    const bodyAreaCounts: Record<string, number> = {};
    symptoms.forEach((s) => {
      if (s.bodyArea) {
        bodyAreaCounts[s.bodyArea] = (bodyAreaCounts[s.bodyArea] || 0) + 1;
      }
    });
    const topBodyArea = Object.entries(bodyAreaCounts).sort(([, a], [, b]) => b - a)[0];
    if (topBodyArea && topBodyArea[1] >= 2) {
      insightsList.push(`Most symptoms are in the ${topBodyArea[0]} area`);
    }

    return {
      chartData: last30Days,
      topSymptoms: topSymptomsList,
      dayPatterns: dayPatternsList,
      insights: insightsList.slice(0, 3),
    };
  }, [data.symptoms]);

  if (data.symptoms.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Symptom Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Activity className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">No symptoms logged yet</p>
            <p className="text-xs text-muted-foreground">
              Start logging symptoms to see patterns and trends
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success" />
          Symptom Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Line Chart */}
        <div className="h-[160px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                className="fill-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                className="fill-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--success))' }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center -mt-2">
          Symptoms logged over the past 30 days
        </p>

        {/* Top Symptoms Summary */}
        {topSymptoms.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Most Common Symptoms
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {topSymptoms.map((symptom, _idx) => (
                <div
                  key={symptom.name}
                  className="p-2 rounded-lg bg-secondary text-center"
                >
                  <p className="text-sm font-medium text-foreground truncate" title={symptom.name}>
                    {symptom.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{symptom.count}x logged</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day Patterns */}
        {dayPatterns.length > 0 && dayPatterns[0].count > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Day of Week Distribution
            </p>
            <div className="flex gap-1">
              {DAYS_OF_WEEK.map((day) => {
                const dayData = dayPatterns.find((d) => d.day === day);
                const count = dayData?.count || 0;
                const maxCount = Math.max(...dayPatterns.map((d) => d.count));
                const intensity = maxCount > 0 ? count / maxCount : 0;
                
                return (
                  <div key={day} className="flex-1 text-center">
                    <div
                      className="h-8 rounded-sm mb-1 transition-colors"
                      style={{
                        backgroundColor: `hsl(var(--success) / ${0.1 + intensity * 0.7})`,
                      }}
                      title={`${day}: ${count} symptoms`}
                    />
                    <p className="text-[10px] text-muted-foreground">{day.slice(0, 2)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pattern Insights */}
        {insights.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Insights
            </p>
            <div className="space-y-1.5">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 text-xs text-foreground"
                >
                  <span className="text-success">•</span>
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
