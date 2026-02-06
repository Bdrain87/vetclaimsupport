import { useState, useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useUserConditions } from '@/hooks/useUserConditions';
import { useEvidence } from '@/hooks/useEvidence';
import { getConditionById } from '@/data/vaConditions';
import {
  Heart, Activity, Brain, Moon, Pill, Plus, Download,
  Calendar, Clock, Zap, Target, TrendingUp, ChevronRight,
  AlertCircle, Sparkles, BarChart3, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Import individual log components
import Symptoms from './Symptoms';
import Migraines from './Migraines';
import Sleep from './Sleep';
import Medications from './Medications';

// Quick log entry types
type QuickLogType = 'symptom' | 'migraine' | 'sleep' | 'medication';

interface QuickLogOption {
  type: QuickLogType;
  icon: React.ElementType;
  label: string;
  description: string;
  gradient: string;
  iconColor: string;
  borderColor: string;
}

const quickLogOptions: QuickLogOption[] = [
  {
    type: 'symptom',
    icon: Activity,
    label: 'Log Symptom',
    description: 'Track pain, fatigue, or other symptoms',
    gradient: 'from-emerald-500/20 to-green-500/10',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    type: 'migraine',
    icon: Brain,
    label: 'Log Migraine',
    description: 'Track attacks with VA-aligned criteria',
    gradient: 'from-purple-500/20 to-violet-500/10',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    type: 'sleep',
    icon: Moon,
    label: 'Log Sleep',
    description: 'Track sleep quality and apnea symptoms',
    gradient: 'from-indigo-500/20 to-blue-500/10',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
  },
  {
    type: 'medication',
    icon: Pill,
    label: 'Add Medication',
    description: 'Track prescriptions and side effects',
    gradient: 'from-rose-500/20 to-pink-500/10',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
  },
];

const tabConfig = [
  { value: 'overview', label: 'Overview', icon: Heart },
  { value: 'symptoms', label: 'Symptoms', icon: Activity },
  { value: 'migraines', label: 'Migraines', icon: Brain },
  { value: 'sleep', label: 'Sleep', icon: Moon },
  { value: 'medications', label: 'Meds', icon: Pill },
];

export default function HealthLog() {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const [activeTab, setActiveTab] = useState('overview');
  const [conditionFilter, setConditionFilter] = useState<string | null>(null);

  // Build combined condition names for filter
  const allConditionNames = useMemo(() => {
    const names = new Set<string>();
    (data.claimConditions || []).forEach(c => names.add(c.name));
    userConditions.forEach(uc => {
      const details = getConditionById(uc.conditionId);
      if (details?.name) names.add(details.name);
    });
    return Array.from(names).sort();
  }, [data.claimConditions, userConditions]);

  // Calculate statistics (respects condition filter)
  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Apply condition filter to entries that have conditionTags
    const matchesFilter = (tags?: string[]) => {
      if (!conditionFilter) return true;
      return tags?.includes(conditionFilter) ?? false;
    };

    // Symptoms stats
    const allSymptoms = (data.symptoms || []).filter(s => matchesFilter(s.conditionTags));
    const recentSymptoms = allSymptoms.filter(s => new Date(s.date) >= thirtyDaysAgo);
    const avgSeverity = recentSymptoms.length > 0
      ? (recentSymptoms.reduce((sum, s) => sum + s.severity, 0) / recentSymptoms.length).toFixed(1)
      : 0;

    // Migraine stats
    const allMigraines = (data.migraines || []).filter(m => matchesFilter(m.conditionTags));
    const recentMigraines = allMigraines.filter(m => new Date(m.date) >= thirtyDaysAgo);
    const prostratingCount = recentMigraines.filter(m =>
      m.severity === 'Prostrating' || m.wasProstrating || m.requiredBedRest
    ).length;

    // Sleep stats
    const allSleep = (data.sleepEntries || []).filter(s => matchesFilter(s.conditionTags));
    const recentSleep = allSleep.filter(s => new Date(s.date) >= thirtyDaysAgo);
    const avgHours = recentSleep.length > 0
      ? (recentSleep.reduce((sum, s) => sum + s.hoursSlept, 0) / recentSleep.length).toFixed(1)
      : 0;
    const cpapNights = recentSleep.filter(s => s.usesCPAP && s.cpapUsedLastNight).length;

    // Medications (no condition tags, always show all)
    const currentMeds = (data.medications || []).filter(m => m.stillTaking).length;
    const medWithSideEffects = (data.medications || []).filter(m => m.stillTaking && m.sideEffects).length;

    return {
      symptoms: {
        total: allSymptoms.length,
        recent: recentSymptoms.length,
        avgSeverity,
      },
      migraines: {
        total: allMigraines.length,
        recent: recentMigraines.length,
        prostrating: prostratingCount,
      },
      sleep: {
        total: allSleep.length,
        recent: recentSleep.length,
        avgHours,
        cpapNights,
      },
      medications: {
        total: data.medications?.length || 0,
        current: currentMeds,
        withSideEffects: medWithSideEffects,
      },
    };
  }, [data, conditionFilter]);

  // Navigate to specific log tab
  const handleQuickLog = (type: QuickLogType) => {
    setActiveTab(type === 'symptom' ? 'symptoms' : type === 'medication' ? 'medications' : type);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150 opacity-50" />
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10">
              <Heart className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Health Log
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Track symptoms, sleep, migraines, and medications for your VA claim
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Premium Pills Style */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="relative">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-2xl" />

          <TabsList className="relative w-full h-auto p-1.5 bg-transparent grid grid-cols-5 gap-1">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 rounded-xl",
                  "text-xs sm:text-sm font-medium transition-all duration-300",
                  "data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10",
                  "data-[state=active]:border data-[state=active]:border-primary/20",
                  "hover:bg-background/50"
                )}
              >
                <tab.icon className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                  activeTab === tab.value ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="hidden xs:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Condition Filter Bar */}
          {allConditionNames.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filter by Condition</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setConditionFilter(null)}
                  className={
                    conditionFilter === null
                      ? 'px-3 py-1.5 rounded-full text-xs font-medium border bg-primary/20 border-primary/50 text-primary transition-colors'
                      : 'px-3 py-1.5 rounded-full text-xs font-medium border bg-muted border-border text-muted-foreground hover:border-primary/30 transition-colors'
                  }
                >
                  All
                </button>
                {allConditionNames.map(name => (
                  <button
                    key={name}
                    onClick={() => setConditionFilter(name)}
                    className={
                      conditionFilter === name
                        ? 'px-3 py-1.5 rounded-full text-xs font-medium border bg-primary/20 border-primary/50 text-primary transition-colors'
                        : 'px-3 py-1.5 rounded-full text-xs font-medium border bg-muted border-border text-muted-foreground hover:border-primary/30 transition-colors'
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Log Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Quick Log</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLogOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleQuickLog(option.type)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl p-4 text-left",
                    "bg-gradient-to-br", option.gradient,
                    "border", option.borderColor,
                    "transition-all duration-300",
                    "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl bg-background/50 backdrop-blur-sm",
                      "border border-white/10"
                    )}>
                      <option.icon className={cn("h-5 w-5", option.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground">{option.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">30-Day Summary</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Symptoms Card */}
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-emerald-500/30"
                onClick={() => setActiveTab('symptoms')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                      <Activity className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Symptoms</p>
                      <p className="text-2xl font-bold text-foreground">{stats.symptoms.recent}</p>
                    </div>
                  </div>
                  {stats.symptoms.recent > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>Avg severity: {stats.symptoms.avgSeverity}/10</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Migraines Card */}
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-purple-500/30"
                onClick={() => setActiveTab('migraines')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-purple-500/10">
                      <Brain className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Migraines</p>
                      <p className="text-2xl font-bold text-foreground">{stats.migraines.recent}</p>
                    </div>
                  </div>
                  {stats.migraines.prostrating > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="destructive" className="text-xs px-1.5 py-0">
                        {stats.migraines.prostrating} prostrating
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sleep Card */}
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-indigo-500/30"
                onClick={() => setActiveTab('sleep')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10">
                      <Moon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sleep Logs</p>
                      <p className="text-2xl font-bold text-foreground">{stats.sleep.recent}</p>
                    </div>
                  </div>
                  {stats.sleep.recent > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Avg: {stats.sleep.avgHours}h/night</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medications Card */}
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-rose-500/30"
                onClick={() => setActiveTab('medications')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-rose-500/10">
                      <Pill className="h-5 w-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Meds</p>
                      <p className="text-2xl font-bold text-foreground">{stats.medications.current}</p>
                    </div>
                  </div>
                  {stats.medications.withSideEffects > 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>{stats.medications.withSideEffects} with side effects</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>

            <Card>
              <CardContent className="p-4">
                {(() => {
                  // Combine all recent entries
                  const allEntries: { type: string; date: string; label: string; icon: React.ElementType }[] = [];

                  (data.symptoms || []).slice(0, 3).forEach(s => {
                    allEntries.push({
                      type: 'symptom',
                      date: s.date,
                      label: `${s.bodyArea || 'Symptom'}: ${s.symptom?.substring(0, 50) || 'Logged'}`,
                      icon: Activity,
                    });
                  });

                  (data.migraines || []).slice(0, 3).forEach(m => {
                    allEntries.push({
                      type: 'migraine',
                      date: m.date,
                      label: `Migraine: ${m.severity}${m.wasProstrating ? ' (Prostrating)' : ''}`,
                      icon: Brain,
                    });
                  });

                  (data.sleepEntries || []).slice(0, 3).forEach(s => {
                    allEntries.push({
                      type: 'sleep',
                      date: s.date,
                      label: `Sleep: ${s.hoursSlept}h - ${s.quality}`,
                      icon: Moon,
                    });
                  });

                  // Sort by date and take most recent 5
                  const sorted = allEntries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5);

                  if (sorted.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <Heart className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">No health logs yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Start tracking to build evidence for your claim
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      {sorted.map((entry, index) => (
                        <div
                          key={`${entry.type}-${entry.date}-${index}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors"
                        >
                          <entry.icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {entry.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>

          {/* VA Tip */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    Consistent Logging Strengthens Your Claim
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Regular health logs create a documented history that supports your VA disability claim
                    during C&P examinations. Track symptoms daily, log migraines with prostrating details,
                    and monitor sleep patterns for accurate rating evidence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Symptoms Tab */}
        <TabsContent value="symptoms" className="mt-0">
          <Symptoms />
        </TabsContent>

        {/* Migraines Tab */}
        <TabsContent value="migraines" className="mt-0">
          <Migraines />
        </TabsContent>

        {/* Sleep Tab */}
        <TabsContent value="sleep" className="mt-0">
          <Sleep />
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="mt-0">
          <Medications />
        </TabsContent>
      </Tabs>
    </div>
  );
}
