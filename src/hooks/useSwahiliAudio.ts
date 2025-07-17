import { useCallback } from 'react';

interface SwahiliAudioHook {
  playDangerDetected: () => Promise<void>;
  playPleaseHelp: () => Promise<void>;
  playEmergencyActivated: () => Promise<void>;
  playSafeStatus: () => Promise<void>;
  isAudioSupported: boolean;
}

export const useSwahiliAudio = (): SwahiliAudioHook => {
  const isAudioSupported = 'Audio' in window;

  const playAudio = useCallback(async (filename: string) => {
    if (!isAudioSupported) {
      console.warn('Audio not supported in this browser');
      return;
    }

    try {
      const audio = new Audio(`/audio/${filename}`);
      audio.volume = 0.8;
      
      // Handle both success and failure gracefully
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });

      await audio.play();
    } catch (error) {
      console.error(`Failed to play audio ${filename}:`, error);
      
      // Fallback: try to speak the text if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(getSwahiliText(filename));
        utterance.lang = 'sw-KE';
        speechSynthesis.speak(utterance);
      }
    }
  }, [isAudioSupported]);

  const getSwahiliText = (filename: string): string => {
    const textMap: Record<string, string> = {
      'danger-detected-sw.mp3': 'Hatari imetambuliwa!',
      'please-send-help-sw.mp3': 'Tafadhali toa msaada',
      'emergency-activated-sw.mp3': 'Dharura imeanzishwa',
      'safe-status-sw.mp3': 'Usalama umehakikishwa'
    };
    return textMap[filename] || '';
  };

  const playDangerDetected = useCallback(() => 
    playAudio('danger-detected-sw.mp3'), [playAudio]);

  const playPleaseHelp = useCallback(() => 
    playAudio('please-send-help-sw.mp3'), [playAudio]);

  const playEmergencyActivated = useCallback(() => 
    playAudio('emergency-activated-sw.mp3'), [playAudio]);

  const playSafeStatus = useCallback(() => 
    playAudio('safe-status-sw.mp3'), [playAudio]);

  return {
    playDangerDetected,
    playPleaseHelp,
    playEmergencyActivated,
    playSafeStatus,
    isAudioSupported
  };
};