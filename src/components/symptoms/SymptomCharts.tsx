import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SeverityTrendData {
  date: string;
  severity: number;
}

interface ConditionStatsData {
  name: string;
  count: number;
}

interface SeverityTrendChartProps {
  data: SeverityTrendData[];
}

interface ConditionStatsChartProps {
  data: ConditionStatsData[];
}

export function SeverityTrendChart({ data }: SeverityTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          stroke="hsl(var(--border))"
        />
        <YAxis
          domain={[0, 10]}
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          stroke="hsl(var(--border))"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            color: 'hsl(var(--popover-foreground))',
          }}
        />
        <Line type="monotone" dataKey="severity" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ConditionStatsChart({ data }: ConditionStatsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          stroke="hsl(var(--border))"
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            color: 'hsl(var(--popover-foreground))',
          }}
        />
        <Bar dataKey="count" fill="#D4AF37" />
      </BarChart>
    </ResponsiveContainer>
  );
}
