import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { t } from '@/utils/localization';
import { useToast } from '@/hooks/use-toast';

interface EmergencyButtonProps {
  onEmergencyTrigger?: () => void;
  onSafeStatus?: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onEmergencyTrigger,
  onSafeStatus
}) => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmergency = async () => {
    setIsLoading(true);
    setIsEmergency(true);
    
    toast({
      title: t('emergency.sendingAlert'),
      description: t('voice.dangerAlert'),
    });

    // Simulate emergency alert process
    setTimeout(() => {
      toast({
        title: t('emergency.alertSent'),
        description: t('voice.locationShared'),
      });
      setIsLoading(false);
      onEmergencyTrigger?.();
    }, 2000);
  };

  const handleSafe = () => {
    setIsEmergency(false);
    toast({
      title: t('emergency.safeNow'),
      description: t('voice.safeConfirm'),
    });
    onSafeStatus?.();
  };

  const callEmergency = (number: string, service: string) => {
    window.open(`tel:${number}`, '_self');
    toast({
      title: `${t('actions.call')} ${service}`,
      description: `${t('actions.call')}: ${number}`,
    });
  };

  if (isEmergency) {
    return (
      <Card className="w-full max-w-md mx-auto bg-emergency/10 border-emergency/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-emergency mx-auto animate-pulse-emergency" />
            <h2 className="text-xl font-bold text-emergency">
              {t('emergency.dangerDetected')}
            </h2>
            <p className="text-muted-foreground">
              {t('voice.dangerAlert')}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => callEmergency('999', t('map.police'))}
                className="h-14 flex-col gap-1"
              >
                <Phone className="h-5 w-5" />
                <span className="text-xs">{t('emergency.callPolice')}</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => callEmergency('911', t('map.hospital'))}
                className="h-14 flex-col gap-1"
              >
                <Phone className="h-5 w-5" />
                <span className="text-xs">{t('emergency.callAmbulance')}</span>
              </Button>
            </div>

            <Button
              variant="safe"
              onClick={handleSafe}
              className="w-full h-12 mt-4"
            >
              <Shield className="h-5 w-5" />
              {t('emergency.safeNow')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Button
        variant="emergency"
        size="lg"
        onClick={handleEmergency}
        disabled={isLoading}
        className="w-full h-20 text-lg font-bold rounded-xl shadow-lg"
      >
        <AlertTriangle className="h-8 w-8" />
        {isLoading ? t('emergency.sendingAlert') : t('emergency.helpMe')}
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => callEmergency('999', t('map.police'))}
          className="h-12 flex-col gap-1"
        >
          <Phone className="h-4 w-4" />
          <span className="text-xs">{t('emergency.callPolice')}</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              const message = `${t('emergency.shareLocation')}: https://maps.google.com/?q=${latitude},${longitude}`;
              navigator.share?.({ text: message }) || 
              navigator.clipboard?.writeText(message);
              toast({
                title: t('emergency.shareLocation'),
                description: t('voice.locationShared'),
              });
            });
          }}
          className="h-12 flex-col gap-1"
        >
          <MapPin className="h-4 w-4" />
          <span className="text-xs">{t('emergency.shareLocation')}</span>
        </Button>
      </div>
    </div>
  );
};