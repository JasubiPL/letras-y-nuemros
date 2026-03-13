import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Subject } from '@appTypes/activity';
import { createEmptySubjectProgress, type SubjectProgress } from '@appTypes/progress';

interface ProgressState {
  letters: SubjectProgress;
  numbers: SubjectProgress;

  completeActivity: (subject: Subject, activityId: string, starsEarned: number) => void;
  advanceLevel: (subject: Subject) => void;
  getSubject: (subject: Subject) => SubjectProgress;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      letters: createEmptySubjectProgress(),
      numbers: createEmptySubjectProgress(),

      completeActivity: (subject, activityId, starsEarned) => {
        const current = get()[subject];
        const prevStars = current.stars[activityId] || 0;
        const bestStars = Math.max(prevStars, starsEarned);

        const newStars = { ...current.stars, [activityId]: bestStars };

        set({
          [subject]: {
            ...current,
            completedActivities: current.completedActivities.includes(activityId)
              ? current.completedActivities
              : [...current.completedActivities, activityId],
            stars: newStars,
            totalStars: Object.values(newStars).reduce((sum, s) => sum + s, 0),
          },
        });
      },

      advanceLevel: (subject) => {
        const current = get()[subject];
        set({
          [subject]: {
            ...current,
            currentLevel: current.currentLevel + 1,
          },
        });
      },

      getSubject: (subject) => get()[subject],

      resetProgress: () =>
        set({
          letters: createEmptySubjectProgress(),
          numbers: createEmptySubjectProgress(),
        }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
