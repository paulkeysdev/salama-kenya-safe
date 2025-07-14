import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Shield, AlertTriangle, Building2, Plus } from 'lucide-react';
import { t } from '@/utils/localization';

interface SafetyLocation {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'safe' | 'danger';
  coordinates: { lat: number; lng: number };
  distance: string;
  description?: string;
}

export const SafetyMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SafetyLocation | null>(null);

  // Mock data - in real app this would come from database/API
  const safetyLocations: SafetyLocation[] = [
    {
      id: '1',
      name: 'Central Police Station',
      type: 'police',
      coordinates: { lat: -1.2921, lng: 36.8219 },
      distance: '0.5 km',
      description: '24/7 police services available'
    },
    {
      id: '2',
      name: 'Kenyatta National Hospital',
      type: 'hospital',
      coordinates: { lat: -1.3018, lng: 36.8079 },
      distance: '1.2 km',
      description: 'Emergency medical services'
    },
    {
      id: '3',
      name: 'Safe Haven Women Center',
      type: 'safe',
      coordinates: { lat: -1.2864, lng: 36.8172 },
      distance: '0.8 km',
      description: 'Women support center - 24/7'
    },
    {
      id: '4',
      name: 'Dark Alley Area',
      type: 'danger',
      coordinates: { lat: -1.2955, lng: 36.8145 },
      distance: '0.3 km',
      description: 'High crime area - avoid at night'
    }
  ];

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'police': return <Shield className="h-4 w-4" />;
      case 'hospital': return <Plus className="h-4 w-4" />;
      case 'safe': return <Building2 className="h-4 w-4" />;
      case 'danger': return <AlertTriangle className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'police': return 'bg-primary text-primary-foreground';
      case 'hospital': return 'bg-success text-success-foreground';
      case 'safe': return 'bg-accent text-accent-foreground';
      case 'danger': return 'bg-emergency text-emergency-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLocationLabel = (type: string) => {
    switch (type) {
      case 'police': return t('map.police');
      case 'hospital': return t('map.hospital');
      case 'safe': return t('map.safePlace');
      case 'danger': return t('map.dangerZone');
      default: return 'Location';
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const openInMaps = (location: SafetyLocation) => {
    const { lat, lng } = location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('map.title')}</h2>
        <Button onClick={getCurrentLocation} variant="outline" className="flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          {t('map.myLocation')}
        </Button>
      </div>

      {/* Map Placeholder - In real app, integrate Google Maps or OpenStreetMap */}
      <Card>
        <CardContent className="p-0">
          <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="text-center z-10">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">
                Interactive Map View
              </p>
              <p className="text-sm text-muted-foreground">
                Map integration pending - will show real locations
              </p>
            </div>
            
            {/* Mock location pins */}
            <div className="absolute top-4 left-4 bg-primary rounded-full p-2">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="absolute bottom-8 right-8 bg-success rounded-full p-2">
              <Plus className="h-4 w-4 text-success-foreground" />
            </div>
            <div className="absolute top-1/2 left-1/2 bg-emergency rounded-full p-2 transform -translate-x-1/2 -translate-y-1/2">
              <AlertTriangle className="h-4 w-4 text-emergency-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('map.nearbyHelp')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {safetyLocations.map((location) => (
            <Card 
              key={location.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Badge className={getLocationColor(location.type)}>
                      {getLocationIcon(location.type)}
                      {getLocationLabel(location.type)}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{location.distance}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium mb-1">{location.name}</h4>
                {location.description && (
                  <p className="text-sm text-muted-foreground mb-3">{location.description}</p>
                )}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openInMaps(location);
                    }}
                    className="flex-1"
                  >
                    <Navigation className="h-3 w-3" />
                    Directions
                  </Button>
                  {location.type === 'police' || location.type === 'hospital' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open('tel:999', '_self');
                      }}
                    >
                      {t('actions.call')}
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Location Status */}
      {userLocation && (
        <Card className="bg-accent/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="font-medium">{t('map.myLocation')}</span>
              <Badge variant="outline" className="ml-auto">
                {t('status.online')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};