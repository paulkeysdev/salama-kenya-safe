import { useState, useEffect } from 'react';

interface EmergencyIncident {
  id: string;
  timestamp: string;
  location?: GeolocationPosition;
  type: 'emergency' | 'safe';
  dangerWords?: string[];
}

interface OfflineContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending sync count on load
    updatePendingSyncCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const storeEmergencyIncident = (incident: Omit<EmergencyIncident, 'id' | 'timestamp'>) => {
    const newIncident: EmergencyIncident = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...incident
    };

    const stored = JSON.parse(localStorage.getItem('emergency-incidents') || '[]');
    stored.push(newIncident);
    localStorage.setItem('emergency-incidents', JSON.stringify(stored));
    
    updatePendingSyncCount();

    // Register background sync if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Background sync will be handled by service worker
        console.log('Service worker ready for background sync');
      });
    }

    return newIncident;
  };

  const storeOfflineContact = (contact: Omit<OfflineContact, 'id'>) => {
    const newContact: OfflineContact = {
      id: crypto.randomUUID(),
      ...contact
    };

    const stored = JSON.parse(localStorage.getItem('offline-contacts') || '[]');
    stored.push(newContact);
    localStorage.setItem('offline-contacts', JSON.stringify(stored));

    return newContact;
  };

  const getOfflineContacts = (): OfflineContact[] => {
    return JSON.parse(localStorage.getItem('offline-contacts') || '[]');
  };

  const updateOfflineContact = (id: string, updates: Partial<OfflineContact>) => {
    const contacts = getOfflineContacts();
    const index = contacts.findIndex(c => c.id === id);
    
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates };
      localStorage.setItem('offline-contacts', JSON.stringify(contacts));
    }
  };

  const deleteOfflineContact = (id: string) => {
    const contacts = getOfflineContacts().filter(c => c.id !== id);
    localStorage.setItem('offline-contacts', JSON.stringify(contacts));
  };

  const syncPendingData = async () => {
    if (!isOnline) return;

    try {
      // Sync emergency incidents
      const incidents = JSON.parse(localStorage.getItem('emergency-incidents') || '[]');
      
      if (incidents.length > 0) {
        console.log('Syncing pending emergency incidents...');
        
        // Here you would typically send to your backend
        // For now, we'll just clear them after a delay to simulate sync
        setTimeout(() => {
          localStorage.removeItem('emergency-incidents');
          updatePendingSyncCount();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to sync pending data:', error);
    }
  };

  const updatePendingSyncCount = () => {
    const incidents = JSON.parse(localStorage.getItem('emergency-incidents') || '[]');
    setPendingSyncCount(incidents.length);
  };

  const getStoredUserPreferences = () => {
    return JSON.parse(localStorage.getItem('user-preferences') || '{}');
  };

  const storeUserPreferences = (preferences: any) => {
    const current = getStoredUserPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem('user-preferences', JSON.stringify(updated));
  };

  return {
    isOnline,
    pendingSyncCount,
    storeEmergencyIncident,
    storeOfflineContact,
    getOfflineContacts,
    updateOfflineContact,
    deleteOfflineContact,
    getStoredUserPreferences,
    storeUserPreferences,
    syncPendingData
  };
};