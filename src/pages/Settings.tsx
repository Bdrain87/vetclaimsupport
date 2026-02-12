import { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Clock, FileDown, Scale, Shield, FileText, AlertTriangle, ChevronRight, User, Plus, Trash2, Briefcase, Info, HelpCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { ShareWithVSO } from '@/components/dashboard/ShareWithVSO';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { DataBackup } from '@/components/settings/DataBackup';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore, type Branch, type ServicePeriod } from '@/store/useProfileStore';
import { PageContainer } from '@/components/PageContainer';

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
  const [profileForm, setProfileForm] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
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
    profile.setFirstName(profileForm.firstName);
    profile.setLastName(profileForm.lastName);

    // Save service periods
    profile.setServicePeriods(servicePeriods);

    // Also keep legacy fields in sync with the first period for backward compat
    const first = servicePeriods[0];
    if (first) {
      if (first.branch) {
        profile.setBranch(first.branch as Branch);
      }
      profile.setMOS(first.mos, first.jobTitle);
      profile.setServiceDates({ start: first.startDate, end: first.endDate });
    }

    toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
  };

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(getInitialReminderSettings);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const scheduleReminder = useCallback(() => {
    // Clear any existing scheduled notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
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

    // Schedule notifications if enabled
    if (reminderSettings.enabled && notificationPermission === 'granted') {
      scheduleReminder();
    }
  }, [reminderSettings, notificationPermission, scheduleReminder]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Your browser does not support notifications.',
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
        // Show a test notification
        new Notification('Vet Claim Support', {
          body: 'Reminder notifications are now enabled!',
          icon: '/pwa-icons/icon-192x192.png',
        });
      } else if (permission === 'denied') {
        toast({
          title: 'Notifications Blocked',
          description: 'Please enable notifications in your browser settings.',
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

      {/* Profile Section */}
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
                placeholder="First name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service History */}
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
                    placeholder="e.g., 11B"
                  />
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
                  <Label htmlFor={`startDate-${period.id}`}>Start Date</Label>
                  <Input
                    id={`startDate-${period.id}`}
                    type="date"
                    value={period.startDate}
                    onChange={(e) => handleUpdateServicePeriod(period.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`endDate-${period.id}`}>End Date</Label>
                  <Input
                    id={`endDate-${period.id}`}
                    type="date"
                    value={period.endDate}
                    onChange={(e) => handleUpdateServicePeriod(period.id, 'endDate', e.target.value)}
                  />
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
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

      {/* Notifications */}
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
                Enable notifications in your browser settings to receive reminders.
              </p>
            </div>
          )}

          {notificationPermission === 'default' && (
            <div className="p-3 rounded-lg bg-muted border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Enable browser notifications to receive symptom logging reminders.
              </p>
              <Button onClick={requestNotificationPermission} size="sm">
                Enable Notifications
              </Button>
            </div>
          )}

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminders" className="text-base">Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications to log symptoms
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
            <Label>Reminder Frequency</Label>
            <Select
              value={reminderSettings.frequency}
              onValueChange={(value: 'daily' | 'weekly') => 
                setReminderSettings(prev => ({ ...prev, frequency: value }))
              }
              disabled={!reminderSettings.enabled}
            >
              <SelectTrigger className="w-full" aria-label="Reminder frequency">
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
              <SelectTrigger className="w-full" aria-label="Reminder time">
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

      {/* Export & Share - Mobile only */}
      <Card className="md:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export & Share
          </CardTitle>
          <CardDescription>Share your evidence with your VSO or export as PDF</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ShareWithVSO />
          <ExportButton />
        </CardContent>
      </Card>

      {/* Data Backup */}
      <DataBackup />

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
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Privacy Policy</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/terms"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Terms of Service</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/disclaimer"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="font-medium text-foreground">Disclaimer</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      {/* More Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            More
          </CardTitle>
          <CardDescription>Additional resources and account management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            to="/settings/about"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">About VCS</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/export-data"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileDown className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Export Data</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/delete-account"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <span className="font-medium text-foreground">Delete Account</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/glossary"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Glossary</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            to="/settings/faq"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">FAQ</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      {/* Data Info */}
      <Card>
        <CardHeader>
          <CardTitle>Data Privacy</CardTitle>
          <CardDescription>How your data is handled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Most of your personal documents and health data are stored locally on your device using browser storage (IndexedDB and localStorage). Some features use cloud services to function.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">AI Features:</strong> When you use AI-powered features, the specific information you choose to analyze is sent to third-party AI services for processing. This data is not permanently stored by these services but does leave your device during analysis. You control what gets analyzed.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Cloud Sync:</strong> If you use account or sync features, some data may be transmitted to our cloud infrastructure. See our <Link to="/settings/privacy" className="text-gold underline">Privacy Policy</Link> and <Link to="/settings/terms" className="text-gold underline">Terms of Service</Link> for full details on what data is collected, how it is used, and your rights.
          </p>
          <p className="text-sm text-muted-foreground">
            We are committed to minimizing data collection and giving you control over your information.
          </p>
        </CardContent>
      </Card>

      {/* Reset Onboarding */}
      <div className="flex justify-center pt-2 pb-4">
        <button
          onClick={() => {
            profile.resetProfile();
            navigate('/onboarding');
          }}
          className="text-muted-foreground hover:text-foreground text-sm underline"
        >
          Reset Onboarding
        </button>
      </div>

    </PageContainer>
  );
}
