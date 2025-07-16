import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe,
  Volume2,
  Vibrate
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { localization } from '@/utils/localization';

interface SettingsData {
  location_sharing_enabled: boolean;
  emergency_notifications_enabled: boolean;
}

export const Settings = () => {
  const [settings, setSettings] = useState<SettingsData>({
    location_sharing_enabled: true,
    emergency_notifications_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    
    // Check system theme preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('location_sharing_enabled, emergency_notifications_enabled')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (profileData) {
        setSettings({
          location_sharing_enabled: profileData.location_sharing_enabled ?? true,
          emergency_notifications_enabled: profileData.emergency_notifications_enabled ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof SettingsData, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    localization.setLanguage(lang);
    toast({
      title: "Language Changed",
      description: `Language changed to ${lang === 'en' ? 'English' : 'Swahili'}`,
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd apply the theme here
    toast({
      title: "Theme Changed",
      description: `Switched to ${!darkMode ? 'dark' : 'light'} mode`,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Privacy & Safety Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Label htmlFor="location-sharing">Location Sharing</Label>
                <Badge variant="secondary" className="text-xs">Recommended</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow trusted contacts to see your location during emergencies
              </p>
            </div>
            <Switch
              id="location-sharing"
              checked={settings.location_sharing_enabled}
              onCheckedChange={(value) => updateSetting('location_sharing_enabled', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="emergency-notifications">Emergency Notifications</Label>
                <Badge variant="secondary" className="text-xs">Recommended</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive alerts and notifications about safety incidents
              </p>
            </div>
            <Switch
              id="emergency-notifications"
              checked={settings.emergency_notifications_enabled}
              onCheckedChange={(value) => updateSetting('emergency_notifications_enabled', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Use dark theme for better visibility at night
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="sound-enabled">Sound Alerts</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Play sounds for emergency alerts and notifications
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Vibrate className="h-4 w-4" />
                <Label htmlFor="vibration-enabled">Vibration</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Use vibration for emergency alerts
              </p>
            </div>
            <Switch
              id="vibration-enabled"
              checked={vibrationEnabled}
              onCheckedChange={setVibrationEnabled}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Label>Language</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant={localization.getLanguage() === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageChange('en')}
              >
                English
              </Button>
              <Button
                variant={localization.getLanguage() === 'sw' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageChange('sw')}
              >
                Kiswahili
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emergency" />
            Emergency Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <h4 className="font-semibold text-warning mb-2">Emergency Button</h4>
            <p className="text-sm text-muted-foreground">
              Press and hold the emergency button for 3 seconds to trigger an alert. 
              This will notify your emergency contacts and share your location.
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Quick Actions</h4>
            <p className="text-sm text-muted-foreground">
              Access emergency services quickly from the emergency tab. 
              Direct calling buttons are available for Police (999) and Medical (911).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};