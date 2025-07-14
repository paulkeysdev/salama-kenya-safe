import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Shield, Menu } from 'lucide-react';
import { t } from '@/utils/localization';

interface AppHeaderProps {
  onMenuToggle?: () => void;
  onLanguageChange?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuToggle, onLanguageChange }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">
                {t('appName')}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Your safety, our priority
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle onLanguageChange={onLanguageChange} />
          
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-success/10 text-success text-xs rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            {t('status.online')}
          </div>
        </div>
      </div>
    </header>
  );
};