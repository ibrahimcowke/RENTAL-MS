import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  full_name: string;
  role: 'admin' | 'landlord' | 'manager';
}

interface AppState {
  user: UserProfile | null;
  language: 'so' | 'en';
  currency: 'USD' | 'SOS';
  isDarkMode: boolean;
  setUser: (user: UserProfile | null) => void;
  setLanguage: (lang: 'so' | 'en') => void;
  setCurrency: (cur: 'USD' | 'SOS') => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      language: 'so', // Default to Somali
      currency: 'USD',
      isDarkMode: false,
      setUser: (user) => set({ user }),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'mogadishu-rental-storage',
    }
  )
);
