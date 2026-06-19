import { create } from 'zustand';

type ChildType = 'boy' | 'girl' | null;

type ChildThemeState = {
  childType: ChildType;
  setChildType: (type: Exclude<ChildType, null>) => void;
};

export const useChildThemeStore = create<ChildThemeState>((set) => ({
  childType: null,
  setChildType: (type) => set({ childType: type }),
}));