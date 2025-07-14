export type Language = 'en' | 'sw';

export interface LocalizedText {
  en: string;
  sw: string;
}

export const translations = {
  // App Name & Branding
  appName: {
    en: "Sister in Safety Net",
    sw: "Dada wa Usalama"
  },
  
  // Navigation
  nav: {
    home: { en: "Home", sw: "Nyumbani" },
    emergency: { en: "Emergency", sw: "Dharura" },
    contacts: { en: "Contacts", sw: "Anwani" },
    map: { en: "Map", sw: "Ramani" },
    profile: { en: "Profile", sw: "Wasifu" },
    settings: { en: "Settings", sw: "Mipangilio" },
  },

  // Emergency
  emergency: {
    title: { en: "Emergency", sw: "Dharura" },
    helpMe: { en: "Help Me!", sw: "Nisaidie!" },
    safeNow: { en: "I'm Safe Now", sw: "Niko Salama Sasa" },
    dangerDetected: { en: "Danger Detected", sw: "Hatari Imegunduliwa" },
    sendingAlert: { en: "Sending Alert...", sw: "Inatuma Onyo..." },
    alertSent: { en: "Alert Sent Successfully", sw: "Onyo Limetumwa Kikamilifu" },
    callPolice: { en: "Call Police", sw: "Piga Simu Polisi" },
    callAmbulance: { en: "Call Ambulance", sw: "Piga Simu Ambulensi" },
    shareLocation: { en: "Share My Location", sw: "Shiriki Mahali Nilipo" },
  },

  // Contacts
  contacts: {
    title: { en: "Emergency Contacts", sw: "Anwani za Dharura" },
    addContact: { en: "Add Contact", sw: "Ongeza Anwani" },
    editContact: { en: "Edit Contact", sw: "Hariri Anwani" },
    name: { en: "Name", sw: "Jina" },
    phone: { en: "Phone Number", sw: "Nambari ya Simu" },
    relationship: { en: "Relationship", sw: "Uhusiano" },
    primary: { en: "Primary Contact", sw: "Anwani Kuu" },
    save: { en: "Save", sw: "Hifadhi" },
    cancel: { en: "Cancel", sw: "Ghairi" },
    delete: { en: "Delete", sw: "Futa" },
    confirm: { en: "Confirm", sw: "Thibitisha" },
  },

  // Map & Location
  map: {
    title: { en: "Safety Map", sw: "Ramani ya Usalama" },
    nearbyHelp: { en: "Nearby Help", sw: "Msaada wa Karibu" },
    police: { en: "Police Station", sw: "Kituo cha Polisi" },
    hospital: { en: "Hospital", sw: "Hospitali" },
    safePlace: { en: "Safe Place", sw: "Mahali pa Usalama" },
    dangerZone: { en: "Danger Zone", sw: "Eneo la Hatari" },
    myLocation: { en: "My Location", sw: "Mahali Nilipo" },
  },

  // Voice & Alerts
  voice: {
    dangerAlert: { en: "Danger detected! Help is being called.", sw: "Hatari imegunduliwa! Msaada unaitwa." },
    safeConfirm: { en: "You are now marked as safe.", sw: "Umewekwa kama mtu aliye salama." },
    locationShared: { en: "Your location has been shared with emergency contacts.", sw: "Mahali ulipo umeshirikiwa na anwani za dharura." },
  },

  // Forms & Validation
  form: {
    required: { en: "This field is required", sw: "Sehemu hii inahitajika" },
    invalidPhone: { en: "Please enter a valid phone number", sw: "Tafadhali ingiza nambari sahihi ya simu" },
    invalidEmail: { en: "Please enter a valid email", sw: "Tafadhali ingiza barua pepe sahihi" },
    success: { en: "Success!", sw: "Imefanikiwa!" },
    error: { en: "Error occurred", sw: "Kosa limetokea" },
  },

  // Common Actions
  actions: {
    call: { en: "Call", sw: "Piga Simu" },
    message: { en: "Message", sw: "Ujumbe" },
    share: { en: "Share", sw: "Shiriki" },
    report: { en: "Report", sw: "Ripoti" },
    help: { en: "Help", sw: "Msaada" },
    close: { en: "Close", sw: "Funga" },
    back: { en: "Back", sw: "Rudi" },
    next: { en: "Next", sw: "Ifuatayo" },
  },

  // Status Messages
  status: {
    online: { en: "Online", sw: "Mtandaoni" },
    offline: { en: "Offline", sw: "Nje ya Mtandao" },
    connecting: { en: "Connecting...", sw: "Inaunganisha..." },
    loading: { en: "Loading...", sw: "Inapakia..." },
    noData: { en: "No data available", sw: "Hakuna data iliyopo" },
  }
} as const;

export class LocalizationService {
  private static instance: LocalizationService;
  private currentLanguage: Language = 'en';

  static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('sister-safety-language', language);
  }

  getLanguage(): Language {
    if (!this.currentLanguage) {
      const saved = localStorage.getItem('sister-safety-language') as Language;
      this.currentLanguage = saved || 'en';
    }
    return this.currentLanguage;
  }

  translate(key: string): string {
    const keys = key.split('.');
    let current: any = translations;
    
    for (const k of keys) {
      current = current?.[k];
      if (!current) break;
    }
    
    if (current && typeof current === 'object' && this.currentLanguage in current) {
      return current[this.currentLanguage];
    }
    
    return key; // Return key as fallback
  }

  t = this.translate.bind(this);
}

export const localization = LocalizationService.getInstance();
export const t = localization.t.bind(localization);