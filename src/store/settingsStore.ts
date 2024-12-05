import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkingHours {
  start: string;
  end: string;
}

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  emailNotifications: boolean;
  defaultView: 'list' | 'grid' | 'calendar';
  language: 'fr' | 'en';
  workingHours: WorkingHours;
}

interface SettingsStore extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleEmailNotifications: () => void;
  setDefaultView: (view: Settings['defaultView']) => void;
  setLanguage: (lang: Settings['language']) => void;
  setWorkingHours: (hours: WorkingHours) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  notifications: true,
  darkMode: false,
  emailNotifications: true,
  defaultView: 'list',
  language: 'fr',
  workingHours: {
    start: '09:00',
    end: '18:00'
  }
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (newSettings) =>
        set((state) => ({
          ...state,
          ...newSettings,
        })),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      toggleNotifications: () =>
        set((state) => ({
          notifications: !state.notifications,
        })),

      toggleEmailNotifications: () =>
        set((state) => ({
          emailNotifications: !state.emailNotifications,
        })),

      setDefaultView: (view) =>
        set({
          defaultView: view,
        }),

      setLanguage: (lang) =>
        set({
          language: lang,
        }),

      setWorkingHours: (hours) =>
        set({
          workingHours: hours,
        }),

      resetSettings: () =>
        set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      skipHydration: typeof window === 'undefined',
    }
  )
);
