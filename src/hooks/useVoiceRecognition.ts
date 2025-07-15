import { useState, useEffect, useCallback } from 'react';
import { t, localization } from '@/utils/localization';
import { useToast } from '@/hooks/use-toast';

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceCommand {
  en: string[];
  sw: string[];
  action: string;
}

const voiceCommands: VoiceCommand[] = [
  {
    en: ['help me', 'emergency', 'danger', 'help'],
    sw: ['nisaidie', 'dharura', 'hatari', 'msaada'],
    action: 'emergency'
  },
  {
    en: ['i am safe', 'safe now', 'all good', 'im safe'],
    sw: ['niko salama', 'salama sasa', 'niko sawa', 'nimesalama'],
    action: 'safe'
  },
  {
    en: ['call police', 'police help', 'call cops'],
    sw: ['piga simu polisi', 'polisi msaada', 'ita polisi'],
    action: 'callPolice'
  },
  {
    en: ['share location', 'send location', 'my location'],
    sw: ['shiriki mahali', 'tuma mahali', 'mahali nilipo'],
    action: 'shareLocation'
  }
];

interface UseVoiceRecognitionProps {
  onEmergency?: () => void;
  onSafe?: () => void;
  onCallPolice?: () => void;
  onShareLocation?: () => void;
}

export const useVoiceRecognition = ({
  onEmergency,
  onSafe,
  onCallPolice,
  onShareLocation
}: UseVoiceRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognition();
      
      speechRecognition.continuous = true;
      speechRecognition.interimResults = false;
      speechRecognition.lang = localization.getLanguage() === 'sw' ? 'sw-KE' : 'en-US';
      
      setRecognition(speechRecognition);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const matchCommand = useCallback((transcript: string): string | null => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    const currentLang = localization.getLanguage();
    
    for (const command of voiceCommands) {
      const phrases = command[currentLang];
      for (const phrase of phrases) {
        if (normalizedTranscript.includes(phrase.toLowerCase())) {
          return command.action;
        }
      }
    }
    return null;
  }, []);

  const executeCommand = useCallback((action: string) => {
    switch (action) {
      case 'emergency':
        onEmergency?.();
        break;
      case 'safe':
        onSafe?.();
        break;
      case 'callPolice':
        onCallPolice?.();
        break;
      case 'shareLocation':
        onShareLocation?.();
        break;
    }
  }, [onEmergency, onSafe, onCallPolice, onShareLocation]);

  const startListening = useCallback(() => {
    if (!recognition || !isSupported) return;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: t('voice.listening'),
        description: t('voice.voiceActivated'),
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const matchedAction = matchCommand(transcript);
      
      if (matchedAction) {
        executeCommand(matchedAction);
        stopListening();
      } else {
        toast({
          title: t('voice.commandNotRecognized'),
          description: `"${transcript}"`,
          variant: 'destructive'
        });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: t('form.error'),
        description: t('voice.commandNotRecognized'),
        variant: 'destructive'
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [recognition, isSupported, matchCommand, executeCommand, toast]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      toast({
        title: t('voice.voiceDeactivated'),
      });
    }
  }, [recognition, toast]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  };
};