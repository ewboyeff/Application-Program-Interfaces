import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlatformSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  telegram: string;
  instagram: string;
}

interface SettingsState {
  settings: PlatformSettings;
  updateSettings: (s: Partial<PlatformSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: {
        name:      'Charity Index Uzbekistan',
        email:     'info@charityindex.uz',
        phone:     '+998 71 123 45 67',
        address:   "Toshkent, O'zbekiston",
        telegram:  '',
        instagram: '',
      },
      updateSettings: (s) =>
        set({ settings: { ...get().settings, ...s } }),
    }),
    { name: 'platform-settings' }
  )
);
