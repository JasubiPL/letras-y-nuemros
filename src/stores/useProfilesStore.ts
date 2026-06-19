import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChildProfile, ChildType } from '@appTypes/progress';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Perfiles por hijo, persistidos. Ver docs/TECH_SPEC.md §8.
// El `childType` del perfil activo alimenta useChildThemeStore (tema visual).

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

interface NewProfileInput {
  name: string;
  childType: ChildType;
  avatar: string;
}

interface ProfilesState {
  profiles: ChildProfile[];
  activeProfileId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  addProfile: (input: NewProfileInput) => ChildProfile;
  removeProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;
  getActiveProfile: () => ChildProfile | null;
}

export const useProfilesStore = create<ProfilesState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      addProfile: (input) => {
        const profile: ChildProfile = {
          id: createId(),
          name: input.name.trim(),
          childType: input.childType,
          avatar: input.avatar,
          createdAt: Date.now(),
        };
        set((state) => ({
          profiles: [...state.profiles, profile],
          // El primer perfil queda activo automáticamente.
          activeProfileId: state.activeProfileId ?? profile.id,
        }));
        return profile;
      },

      removeProfile: (id) =>
        set((state) => {
          const profiles = state.profiles.filter((p) => p.id !== id);
          const activeProfileId =
            state.activeProfileId === id
              ? (profiles[0]?.id ?? null)
              : state.activeProfileId;
          return { profiles, activeProfileId };
        }),

      setActiveProfile: (id) => set({ activeProfileId: id }),

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find((p) => p.id === activeProfileId) ?? null;
      },
    }),
    {
      name: 'profiles-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        } else if (typeof window !== 'undefined') {
          // No bloquea la entrada para siempre si el almacenamiento local falla.
          useProfilesStore.setState({ hasHydrated: true });
        }
      },
    }
  )
);
