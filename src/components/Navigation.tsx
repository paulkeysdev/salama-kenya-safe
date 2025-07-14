import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, AlertTriangle, Users, Map, User, Settings } from 'lucide-react';
import { t } from '@/utils/localization';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobile?: boolean;
  isOpen?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  isMobile = false,
  isOpen = false 
}) => {
  const navItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'emergency', icon: AlertTriangle, label: t('nav.emergency') },
    { id: 'contacts', icon: Users, label: t('nav.contacts') },
    { id: 'map', icon: Map, label: t('nav.map') },
    { id: 'profile', icon: User, label: t('nav.profile') },
    { id: 'settings', icon: Settings, label: t('nav.settings') },
  ];

  if (isMobile) {
    return (
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 space-y-2 mt-16">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              onClick={() => onTabChange(item.id)}
              className="w-full justify-start gap-3 h-12"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 bg-background/95 backdrop-blur">
      <div className="flex items-center p-2 gap-1">
        {navItems.slice(0, 4).map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange(item.id)}
            className="flex-col gap-1 h-14 w-16 text-xs"
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate">{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};