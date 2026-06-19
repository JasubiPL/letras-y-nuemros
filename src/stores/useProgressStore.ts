import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Subject } from '@appTypes/activity';
import type { SubjectProgress, UserProgress } from '@appTypes/progress';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Progreso por perfil, persistido. Ver docs/TECH_SPEC.md §8.
// El desbloqueo de niveles lo decide el ActivityRunner (umbral de aciertos)
// y se materializa llamando a `completeLevel` solo cuando el nivel se aprueba.

const TOTAL_LEVELS = 10;

const emptySubjectProgress = (): SubjectProgress => ({
  currentLevel: 1,
  stars: {},
  completed: [],
});

const emptyUserProgress = (): UserProgress => ({
  letters: emptySubjectProgress(),
  numbers: emptySubjectProgress(),
  lastPlayed: Date.now(),
});

interface ProgressState {
  byProfile: Record<string, UserProgress>;
  getProgress: (profileId: string) => UserProgress;
  getSubjectProgress: (profileId: string, subject: Subject) => SubjectProgress;
  getLevelStars: (profileId: string, subject: Subject, level: number) => number;
  isLevelUnlocked: (profileId: string, subject: Subject, level: number) => boolean;
  recordActivity: (profileId: string, subject: Subject, activityId: string) => void;
  completeLevel: (
    profileId: string,
    subject: Subject,
    level: number,
    stars: number
  ) => void;
  resetProfile: (profileId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      byProfile: {},

      getProgress: (profileId) => get().byProfile[profileId] ?? emptyUserProgress(),

      getSubjectProgress: (profileId, subject) =>
        get().getProgress(profileId)[subject],

      getLevelStars: (profileId, subject, level) =>
        get().getSubjectProgress(profileId, subject).stars[level] ?? 0,

      isLevelUnlocked: (profileId, subject, level) =>
        level <= get().getSubjectProgress(profileId, subject).currentLevel,

      recordActivity: (profileId, subject, activityId) =>
        set((state) => {
          const user = state.byProfile[profileId] ?? emptyUserProgress();
          const subj = user[subject];
          if (subj.completed.includes(activityId)) return state;
          return {
            byProfile: {
              ...state.byProfile,
              [profileId]: {
                ...user,
                lastPlayed: Date.now(),
                [subject]: {
                  ...subj,
                  completed: [...subj.completed, activityId],
                },
              },
            },
          };
        }),

      completeLevel: (profileId, subject, level, stars) =>
        set((state) => {
          const user = state.byProfile[profileId] ?? emptyUserProgress();
          const subj = user[subject];
          const bestStars = Math.max(subj.stars[level] ?? 0, stars);
          // Aprobar el nivel actual desbloquea el siguiente (tope 10).
          const nextLevel =
            level >= subj.currentLevel
              ? Math.min(level + 1, TOTAL_LEVELS)
              : subj.currentLevel;
          return {
            byProfile: {
              ...state.byProfile,
              [profileId]: {
                ...user,
                lastPlayed: Date.now(),
                [subject]: {
                  ...subj,
                  currentLevel: nextLevel,
                  stars: { ...subj.stars, [level]: bestStars },
                },
              },
            },
          };
        }),

      resetProfile: (profileId) =>
        set((state) => {
          const next = { ...state.byProfile };
          delete next[profileId];
          return { byProfile: next };
        }),
    }),
    {
      name: 'progress-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ byProfile: state.byProfile }),
    }
  )
);
