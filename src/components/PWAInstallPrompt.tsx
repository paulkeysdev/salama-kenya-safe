import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt if user hasn't installed and hasn't dismissed recently
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Card className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
              Install Salama Kenya
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-600 dark:text-blue-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Install this app on your device for faster access and offline support
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button 
            onClick={handleInstall}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="border-blue-300 text-blue-700 dark:text-blue-300"
          >
            Maybe Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};