import { useState, useEffect, useCallback, useRef } from 'react';
import { safeFormatDateTime } from '@/utils/dateUtils';
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Clock, FileDown, Scale, Shield, FileText, AlertTriangle, ChevronRight, User, Plus, Trash2, Briefcase, Info, BookOpen, LogIn, LogOut, Calendar, Database, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { ShareWithVSO } from '@/components/dashboard/ShareWithVSO';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { DataBackup } from '@/components/settings/DataBackup';
import { VaultPasscode } from '@/components/settings/VaultPasscode';
import { SubscriptionCard } from '@/components/settings/SubscriptionCard';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { refreshEntitlementFromServer, invalidateEntitlementCache, hasPremiumAccess } from '@/services/entitlements';
import { useProfileStore, type Branch, type ServicePeriod } from '@/store/useProfileStore';
import { PageContainer } from '@/components/PageContainer';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/services/auth';
import { clearLocalData } from '@/services/accountManagement';
import { stopSync } from '@/services/syncEngine';
import { isNativeApp } from '@/lib/platform';
import { NOTIFICATION_COPY, DATA_PRIVACY_COPY, AI_COPY, CLAIM_DATES_COPY, LEGAL_VERSIONS, formatLegalDate } from '@/data/legalCopy';
import { getAIAuditLog, clearAIAuditLog, type AIAuditEntry } from '@/services/aiAuditLog';
import type { Session } from '@supabase/supabase-js';

const REMINDER_SETTINGS_KEY = 'va-claims-reminder-settings';

interface ReminderSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly';
  time: string;
}

const getInitialReminderSettings = (): ReminderSettings => {
  if (typeof window === 'undefined') {
    return { enabled: false, frequency: 'daily', time: '09:00' };
  }
  const stored = localStorage.getItem(REMINDER_SETTINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to default settings
    }
  }
  return { enabled: false, frequency: 'daily', time: '09:00' };
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const profile = useProfileStore();
  const [session, setSession] = useState<Session | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [auditLogOpen, setAuditLogOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState<AIAuditEntry[]>(() => getAIAuditLog().slice(0, 10));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s)).catch(() => {});
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    stopSync();
    await signOut();
    await clearLocalData();
    setSession(null);
    navigate('/auth', { replace: true });
    toast({ title: 'Signed Out', description: 'You have been signed out.' });
  };
  const [profileForm, setProfileForm] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    separationDate: profile.separationDate || '',
  });

  // Initialize service periods from store (or create default from legacy fields)
  const [servicePeriods, setServicePeriods] = useState<ServicePeriod[]>(() => {
    if (profile.servicePeriods && profile.servicePeriods.length > 0) {
      return profile.servicePeriods;
    }
    // Migrate legacy single-MOS data
    if (profile.branch || profile.mosCode) {
      return [{
        id: crypto.randomUUID(),
        branch: profile.branch || '',
        mos: profile.mosCode || '',
        jobTitle: profile.mosTitle || '',
        startDate: profile.serviceDates?.start || '',
        endDate: profile.serviceDates?.end || '',
      }];
    }
    return [{
      id: crypto.randomUUID(),
      branch: '',
      mos: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
    }];
  });

  const handleAddServicePeriod = () => {
    setServicePeriods(prev => [...prev, {
      id: crypto.randomUUID(),
      branch: '',
      mos: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
    }]);
  };

  const handleRemoveServicePeriod = (id: string) => {
    setServicePeriods(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateServicePeriod = (id: string, field: keyof ServicePeriod, value: string) => {
    setServicePeriods(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSaveProfile = () => {
    // Validate: end date cannot be before start date for any period
    for (const period of servicePeriods) {
      if (period.startDate && period.endDate && period.endDate < period.startDate) {
        toast({
          title: 'Invalid Dates',
          description: `Service Period: End Date cannot be before Start Date.`,
          variant: 'destructive',
        });
        return;
      }
    }

    profile.setFirstName(profileForm.firstName);
    profile.setLastName(profileForm.lastName);

    profile.setSeparationDate(profileForm.separationDate || '');

    profile.setServicePeriods(servicePeriods);

    const first = servicePeriods[0];
    if (first) {
      if (first.branch) {
        profile.setBranch(first.branch as Branch);
      }
      profile.setMOS(first.mos, first.jobTitle);
      if (first.startDate || first.endDate) {
        profile.setServiceDates({ start: first.startDate, end: first.endDate });
      }
    }

    toast({ title: 'Profile Saved', description: 'Your profile has been updated.' });
  };

  // Auto-save separation date with debounce
  const separationAutoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setSeparationDate = useProfileStore((s) => s.setSeparationDate);
  useEffect(() => {
    if (separationAutoSaveTimer.current) clearTimeout(separationAutoSaveTimer.current);
    separationAutoSaveTimer.current = setTimeout(() => {
      setSeparationDate(profileForm.separationDate || '');
    }, 800);
    return () => {
      if (separationAutoSaveTimer.current) clearTimeout(separationAutoSaveTimer.current);
    };
  }, [profileForm.separationDate, setSeparationDate]);

  // Post-checkout success handling — retry because the Stripe webhook may
  // still be processing when the user returns.
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) return;

    // Clear the query param immediately so we don't re-trigger on re-render
    searchParams.delete('session_id');
    setSearchParams(searchParams, { replace: true });

    let cancelled = false;
    const RETRY_DELAYS = [0, 2000, 4000, 8000]; // immediate, 2s, 4s, 8s

    (async () => {
      for (const delay of RETRY_DELAYS) {
        if (cancelled) return;
        if (delay > 0) await new Promise((r) => setTimeout(r, delay));
        if (cancelled) return;

        invalidateEntitlementCache();
        try {
          const status = await refreshEntitlementFromServer();
          if (status === 'premium' || status === 'lifetime') {
            toast({
              title: 'Welcome to Premium!',
              description: 'You now have full access to all features.',
            });
            return;
          }
        } catch {
          // Keep retrying
        }
      }

      // All retries exhausted
      if (!cancelled) {
        toast({
          title: 'Purchase is processing',
          description: 'It may take a moment. Try "Restore Purchases" below in a few seconds.',
          variant: 'destructive',
        });
      }
    })();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(getInitialReminderSettings);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const scheduleReminder = useCallback(() => {
    if (!isNativeApp && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_REMINDER',
        settings: reminderSettings,
      });
    }
  }, [reminderSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(reminderSettings));
    } catch {
      // Storage full or unavailable
    }

    if (reminderSettings.enabled && notificationPermission === 'granted') {
      scheduleReminder();
    }
  }, [reminderSettings, notificationPermission, scheduleReminder]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not Supported',
        description: isNativeApp ? 'Notification support requires a future app update.' : 'Your browser does not support notifications.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        toast({
          title: 'Notifications Enabled',
          description: 'You will receive reminders to log your symptoms.',
        });
        new Notification('Vet Claim Support', {
          body: 'Reminder notifications are now enabled!',
          icon: '/pwa-icons/icon-192x192.png',
        });
      } else if (permission === 'denied') {
        toast({
          title: 'Notifications Blocked',
          description: isNativeApp
            ? 'Open iOS Settings to enable notifications for VCS.'
            : 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        });
      }
    } catch {
      // Notification permission request failed
    }
  };

  const handleReminderToggle = (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    }
    setReminderSettings(prev => ({ ...prev, enabled }));
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Vet Claim Support Reminder', {
        body: 'Don\'t forget to log your symptoms today!',
        icon: '/pwa-icons/icon-192x192.png',
        tag: 'test-reminder',
      });
      toast({
        title: 'Test Notification Sent',
        description: 'Check your notification area.',
      });
    } else {
      toast({
        title: 'Enable Notifications First',
        description: 'Please enable notifications to test reminders.',
        variant: 'destructive',
      });
    }
  };

  const platformCopy = isNativeApp ? NOTIFICATION_COPY.ios : NOTIFICATION_COPY.web;

  return (
    <PageContainer className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <SettingsIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Customize your app experience</p>
        </div>
      </div>

      {/* Account — Phase 1D */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            {session?.user?.email || DATA_PRIVACY_COPY.localDefault}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {session ? (
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => navigate('/login')} className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}

          <button
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 text-xs text-gold hover:text-gold/80 transition-colors w-full justify-center"
          >
            <Database className="h-3 w-3" />
            What gets synced?
          </button>
        </CardContent>
      </Card>

      {/* What Gets Synced Modal — Phase 1D */}
      <AlertDialog open={showSyncModal} onOpenChange={setShowSyncModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What Gets Synced</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1.5">Stays on your device (local only)</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="text-success">&#x2713;</span>Health data & symptom logs</li>
                    <li className="flex items-start gap-2"><span className="text-success">&#x2713;</span>Documents & vault contents</li>
                    <li className="flex items-start gap-2"><span className="text-success">&#x2713;</span>Claim preparation data</li>
                    <li className="flex items-start gap-2"><span className="text-success">&#x2713;</span>AI-generated drafts</li>
                    <li className="flex items-start gap-2"><span className="text-success">&#x2713;</span>Service history & medications</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1.5">Syncs when signed in</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="text-gold">&#x21C4;</span>Premium entitlement</li>
                    <li className="flex items-start gap-2"><span className="text-gold">&#x21C4;</span>Account profile (email)</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Vault Passcode — Phase 1D */}
      <VaultPasscode />

      {/* Subscription — Phase 1A (compact banner) */}
      <SubscriptionCard />

      {/* Profile Section — Phase 1B */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First Name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last Name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service History — Phase 1B + 1C */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Service History
          </CardTitle>
          <CardDescription>Your military service periods. Add multiple if you served in different roles or branches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {servicePeriods.map((period, index) => (
            <div key={period.id} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Service Period {index + 1}</p>
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveServicePeriod(period.id)}
                    className="text-destructive hover:text-destructive h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`branch-${period.id}`}>Branch of Service</Label>
                <Select
                  value={period.branch}
                  onValueChange={(v) => handleUpdateServicePeriod(period.id, 'branch', v)}
                >
                  <SelectTrigger id={`branch-${period.id}`} aria-label="Branch of Service">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="army">Army</SelectItem>
                    <SelectItem value="navy">Navy</SelectItem>
                    <SelectItem value="air_force">Air Force</SelectItem>
                    <SelectItem value="marines">Marines</SelectItem>
                    <SelectItem value="coast_guard">Coast Guard</SelectItem>
                    <SelectItem value="space_force">Space Force</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`mos-${period.id}`}>MOS/Rating/AFSC</Label>
                  <Input
                    id={`mos-${period.id}`}
                    value={period.mos}
                    onChange={(e) => handleUpdateServicePeriod(period.id, 'mos', e.target.value)}
                    placeholder="e.g., 11B, 3E7X1"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Army: MOS (e.g., 11B) · Navy: Rating (e.g., HM) · Air Force: AFSC (e.g., 3E7X1)
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`jobTitle-${period.id}`}>Job Title</Label>
                  <Input
                    id={`jobTitle-${period.id}`}
                    value={period.jobTitle}
                    onChange={(e) => handleUpdateServicePeriod(period.id, 'jobTitle', e.target.value)}
                    placeholder="e.g., Infantryman"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`startDate-${period.id}`} className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Start Date
                  </Label>
                  <Input
                    id={`startDate-${period.id}`}
                    type="date"
                    value={period.startDate}
                    onChange={(e) => handleUpdateServicePeriod(period.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`endDate-${period.id}`} className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    End Date
                  </Label>
                  <Input
                    id={`endDate-${period.id}`}
                    type="date"
                    value={period.endDate}
                    onChange={(e) => handleUpdateServicePeriod(period.id, 'endDate', e.target.value)}
                  />
                  {period.startDate && period.endDate && period.endDate < period.startDate && (
                    <p className="text-[11px] text-destructive">End Date cannot be before Start Date.</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`dutyStation-${period.id}`}>Duty Station (optional)</Label>
                <Input
                  id={`dutyStation-${period.id}`}
                  value={period.dutyStation || ''}
                  onChange={(e) => handleUpdateServicePeriod(period.id, 'dutyStation', e.target.value)}
                  placeholder="e.g., Fort Bragg, NC"
                />
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={handleAddServicePeriod} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Service Period
          </Button>

          <Button onClick={handleSaveProfile} className="w-full">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Separation Date & Intent to File — Phase 1H */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Claim Dates
          </CardTitle>
          <CardDescription>Track your separation date and Intent to File</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="separationDate" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Separation Date (ETS/DOS)
            </Label>
            <Input
              id="separationDate"
              type="date"
              value={profileForm.separationDate}
              onChange={(e) => setProfileForm(prev => ({ ...prev, separationDate: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              {CLAIM_DATES_COPY.etsDefinition} Used to calculate your BDD filing window. Leave blank if already separated. {CLAIM_DATES_COPY.autoSaveLabel}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/prep/bdd-guide">
              <Button variant="outline" className="w-full text-sm">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Learn: BDD Guide
              </Button>
            </Link>
            <Link to="/claims/itf">
              <Button variant="outline" className="w-full text-sm">
                <Info className="h-4 w-4 mr-1.5" />
                Learn: Intent to File
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Control how the app looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0 flex-1">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                {theme === 'dark' ? 'Dark theme is active' : 'Light theme is active'}
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications — Phase 1E */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminder Notifications
          </CardTitle>
          <CardDescription>Get reminded to log your symptoms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Status */}
          {notificationPermission === 'denied' && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <BellOff className="h-4 w-4" />
                <span className="text-sm font-medium">Notifications are blocked</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {platformCopy.denied}
              </p>
            </div>
          )}

          {notificationPermission === 'default' && (
            <div className="p-3 rounded-lg bg-muted border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                {platformCopy.enable}
              </p>
              <Button onClick={requestNotificationPermission} size="sm">
                Enable Notifications
              </Button>
            </div>
          )}

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0 flex-1">
              <Label htmlFor="reminders" className="text-base">Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">
                {reminderSettings.enabled
                  ? 'Receiving notifications to log symptoms'
                  : NOTIFICATION_COPY.disabledHelper}
              </p>
            </div>
            <Switch
              id="reminders"
              checked={reminderSettings.enabled}
              onCheckedChange={handleReminderToggle}
              disabled={notificationPermission === 'denied'}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
            <Select
              value={reminderSettings.frequency}
              onValueChange={(value: 'daily' | 'weekly') =>
                setReminderSettings(prev => ({ ...prev, frequency: value }))
              }
              disabled={!reminderSettings.enabled}
            >
              <SelectTrigger className={`w-full ${!reminderSettings.enabled ? 'opacity-50' : ''}`} id="reminder-frequency" aria-label="Reminder frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reminder Time
            </Label>
            <Select
              value={reminderSettings.time}
              onValueChange={(value) =>
                setReminderSettings(prev => ({ ...prev, time: value }))
              }
              disabled={!reminderSettings.enabled}
            >
              <SelectTrigger className={`w-full ${!reminderSettings.enabled ? 'opacity-50' : ''}`} aria-label="Reminder time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:00">7:00 AM</SelectItem>
                <SelectItem value="08:00">8:00 AM</SelectItem>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="18:00">6:00 PM</SelectItem>
                <SelectItem value="20:00">8:00 PM</SelectItem>
                <SelectItem value="21:00">9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Test Button */}
          {notificationPermission === 'granted' && (
            <Button
              variant="outline"
              onClick={testNotification}
              className="w-full"
            >
              Send Test Notification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Export & Share — Phase 1F (Premium only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export & Share
          </CardTitle>
          <CardDescription>Export your evidence as PDF or share with your VSO</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {hasPremiumAccess() ? (
            <>
              <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
                <p className="text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3 inline mr-1 text-gold" />
                  Exported PDFs may contain sensitive health information. Review before sharing.
                </p>
              </div>
              <ExportButton />
              <ShareWithVSO />
            </>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-sm text-muted-foreground">Export & sharing requires Premium access.</p>
              <Link to="/claims/strategy">
                <Button variant="outline" size="sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Backup — Phase 1F */}
      <DataBackup />

      {/* Data Privacy — Phase 1G */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy
          </CardTitle>
          <CardDescription>How your data is handled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Local Storage:</strong>{' '}
            {DATA_PRIVACY_COPY.whatStaysLocal}
            {profile.vaultPasscodeSet ? ' Data is encrypted with your vault passcode.' : ' Enable a vault passcode for additional encryption.'}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">AI Features:</strong>{' '}
            {AI_COPY.scopeStatement}{' '}
            {AI_COPY.localVsCloud}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Cloud Sync:</strong>{' '}
            {DATA_PRIVACY_COPY.whatSyncs} See our{' '}
            <Link to="/settings/privacy" className="text-gold underline">Privacy Policy</Link> and{' '}
            <Link to="/settings/terms" className="text-gold underline">Terms of Service</Link> for full details.
          </p>
          <p className="text-sm text-muted-foreground">
            {DATA_PRIVACY_COPY.exportWarning}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            {DATA_PRIVACY_COPY.noTracking}
          </p>
        </CardContent>
      </Card>

      {/* AI Usage Log — Audit Trail */}
      <Card>
        <CardHeader>
          <button
            onClick={() => {
              if (!auditLogOpen) {
                setAuditEntries(getAIAuditLog().slice(0, 10));
              }
              setAuditLogOpen(prev => !prev);
            }}
            className="flex items-center justify-between w-full text-left"
          >
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                AI Usage Log
              </CardTitle>
              <CardDescription>Review recent AI data sends</CardDescription>
            </div>
            <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${auditLogOpen ? 'rotate-90' : ''}`} />
          </button>
        </CardHeader>
        {auditLogOpen && (
          <CardContent className="space-y-3">
            {auditEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No AI sends recorded</p>
            ) : (
              <>
                <div className="space-y-2">
                  {auditEntries.map((entry) => (
                    <div key={entry.id} className="p-3 rounded-lg bg-muted/50 border border-border text-sm space-y-1">
                      <p className="text-foreground font-medium">
                        {AI_COPY.auditLogEntry(safeFormatDateTime(entry.timestamp), entry.redactionMode)}
                      </p>
                      <p className="text-muted-foreground">
                        Redactions: <span className="font-medium text-foreground">{entry.redactionCount}</span>
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    clearAIAuditLog();
                    setAuditEntries([]);
                    toast({ title: 'Log Cleared', description: 'AI usage log has been cleared.' });
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Log
                </Button>
              </>
            )}
          </CardContent>
        )}
      </Card>

      {/* Legal Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Legal
          </CardTitle>
          <CardDescription>Privacy policy, terms of service, and disclaimers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            to="/settings/privacy"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gold" />
              <div>
                <span className="font-medium text-foreground">Privacy Policy</span>
                <p className="text-[11px] text-muted-foreground">v{LEGAL_VERSIONS.privacy.version} · {formatLegalDate(LEGAL_VERSIONS.privacy.effectiveDate)}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/terms"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gold" />
              <div>
                <span className="font-medium text-foreground">Terms of Service</span>
                <p className="text-[11px] text-muted-foreground">v{LEGAL_VERSIONS.terms.version} · {formatLegalDate(LEGAL_VERSIONS.terms.effectiveDate)}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/disclaimer"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-gold" />
              <div>
                <span className="font-medium text-foreground">Disclaimer</span>
                <p className="text-[11px] text-muted-foreground">v{LEGAL_VERSIONS.disclaimer.version} · {formatLegalDate(LEGAL_VERSIONS.disclaimer.effectiveDate)}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      {/* More — Phase 1I */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            More
          </CardTitle>
          <CardDescription>Additional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            to="/settings/about"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-gold" />
              <span className="font-medium text-foreground">About VCS</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      {/* Danger Zone — Phase 1I (Delete Account separated) */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            to="/settings/delete-account"
            className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">Delete Account & Data</span>
            </div>
            <ChevronRight className="h-4 w-4 text-destructive/60" />
          </Link>
        </CardContent>
      </Card>

      {/* Reset Onboarding */}
      <div className="flex justify-center pt-2 pb-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground text-sm underline">
              Reset Onboarding
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Onboarding?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset your profile and restart the onboarding process.
                Your claim data (symptoms, conditions, documents) will be preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  profile.resetProfile();
                  navigate('/onboarding');
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </PageContainer>
  );
}
