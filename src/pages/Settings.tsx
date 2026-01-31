import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Clock, FileDown, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { ShareWithVSO } from '@/components/dashboard/ShareWithVSO';
import { ExportButton } from '@/components/dashboard/ExportButton';

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
      console.error('Failed to parse reminder settings');
    }
  }
  return { enabled: false, frequency: 'daily', time: '09:00' };
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(getInitialReminderSettings);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(reminderSettings));
    
    // Schedule notifications if enabled
    if (reminderSettings.enabled && notificationPermission === 'granted') {
      scheduleReminder();
    }
  }, [reminderSettings, notificationPermission]);

  const scheduleReminder = () => {
    // Clear any existing scheduled notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_REMINDER',
        settings: reminderSettings,
      });
    }
  };

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
        new Notification('Evidence Tracker', {
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
    } catch (error) {
      console.error('Error requesting notification permission:', error);
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
      new Notification('Evidence Tracker Reminder', {
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
    <div className="space-y-8 animate-fade-in">
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
              <SelectTrigger className="w-full">
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
              <SelectTrigger className="w-full">
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

      {/* Data Info */}
      <Card>
        <CardHeader>
          <CardTitle>Data Privacy</CardTitle>
          <CardDescription>Your data is stored locally</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All your data is stored locally on your device using browser storage. 
            We never collect, transmit, or store your personal health information on our servers.
            Your data stays private and under your control.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
