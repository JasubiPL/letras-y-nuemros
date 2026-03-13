import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  volume: number;
  musicEnabled: boolean;
  hapticsEnabled: boolean;

  setVolume: (volume: number) => void;
  toggleMusic: () => void;
  toggleHaptics: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      volume: 1.0,
      musicEnabled: true,
      hapticsEnabled: true,

      setVolume: (volume) => set({ volume }),
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
