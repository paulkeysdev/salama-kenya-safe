import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Navigation } from '@/components/Navigation';
import { EmergencyButton } from '@/components/EmergencyButton';
import { ContactManager } from '@/components/ContactManager';
import { SafetyMap } from '@/components/SafetyMap';
import { Profile } from '@/components/Profile';
import { Settings } from '@/components/Settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Map, AlertTriangle, Clock, Wifi, WifiOff } from 'lucide-react';
import { t, localization } from '@/utils/localization';
import { useToast } from '@/hooks/use-toast';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { USSDFallback } from '@/components/USSDFallback';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isOnline } = useOfflineStorage();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleLanguageChange = () => {
    // Force re-render when language changes
    setActiveTab(prev => prev);
  };

  const renderHomeContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary rounded-full p-3">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{t('appName')}</h2>
              <p className="text-muted-foreground">
                Welcome to your personal safety network
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">{t('nav.contacts')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Map className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Safe Places</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-xs text-muted-foreground">Protection</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-success mx-auto mb-2" />
            ) : (
              <WifiOff className="h-6 w-6 text-warning mx-auto mb-2" />
            )}
            <p className="text-2xl font-bold">{isOnline ? 'ON' : 'OFF'}</p>
            <p className="text-xs text-muted-foreground">{t('status.online')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Button */}
      <div className="flex justify-center">
        <EmergencyButton />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Safety Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge className="bg-success/10 text-success">TIP</Badge>
            <p className="text-sm">Share your location with trusted contacts when traveling alone</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-warning/10 text-warning">ALERT</Badge>
            <p className="text-sm">Avoid poorly lit areas, especially at night</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-primary/10 text-primary">INFO</Badge>
            <p className="text-sm">Keep emergency contacts updated and easily accessible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmergencyContent = () => (
    <div className="space-y-6">
      <Card className="bg-emergency/5 border-emergency/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emergency">
            <AlertTriangle className="h-5 w-5" />
            {t('emergency.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            In case of emergency, use the button below or call emergency services directly.
          </p>
          <div className="flex justify-center">
            <EmergencyButton />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="h-16 flex-col gap-2"
          onClick={() => window.open('tel:999', '_self')}
        >
          <AlertTriangle className="h-6 w-6" />
          Police: 999
        </Button>
        
        <Button
          variant="outline"
          className="h-16 flex-col gap-2"
          onClick={() => window.open('tel:911', '_self')}
        >
          <AlertTriangle className="h-6 w-6" />
          Medical: 911
        </Button>
      </div>
    </div>
  );

  const renderCurrentTime = () => {
    return (
      <div className="text-center mb-4">
        <p className="text-lg font-semibold">
          {currentTime.toLocaleDateString('en-KE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-2xl font-bold text-primary">
          {currentTime.toLocaleTimeString('en-KE', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'emergency':
        return renderEmergencyContent();
      case 'contacts':
        return <ContactManager />;
      case 'map':
        return <SafetyMap />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'ussd':
        return <USSDFallback />;
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onLanguageChange={handleLanguageChange}
      />
      
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobile={true}
        isOpen={isMobileMenuOpen}
      />

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="container mx-auto px-4 py-6 pb-24">
        <PWAInstallPrompt />
        <OfflineIndicator />
        {renderCurrentTime()}
        {!isOnline && activeTab === 'home' && (
          <div className="mb-6">
            <USSDFallback />
          </div>
        )}
        {(isOnline || activeTab !== 'ussd') && renderContent()}
      </main>

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobile={false}
      />
    </div>
  );
};

export default Index;
