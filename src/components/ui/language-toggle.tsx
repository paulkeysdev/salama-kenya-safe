import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { localization, type Language } from '@/utils/localization';

interface LanguageToggleProps {
  onLanguageChange?: (language: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ onLanguageChange }) => {
  const [currentLang, setCurrentLang] = React.useState<Language>(localization.getLanguage());

  const toggleLanguage = () => {
    const newLang: Language = currentLang === 'en' ? 'sw' : 'en';
    setCurrentLang(newLang);
    localization.setLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-card/80 hover:bg-card border-border/50"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">
        {currentLang === 'en' ? 'English' : 'Kiswahili'}
      </span>
    </Button>
  );
};