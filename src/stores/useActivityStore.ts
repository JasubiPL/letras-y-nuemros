import { create } from 'zustand';
import type { Activity, Subject } from '@appTypes/activity';

interface ActivityState {
  currentActivity: Activity | null;
  currentSubject: Subject | null;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  isCompleted: boolean;

  startActivity: (activity: Activity) => void;
  answerCorrect: () => void;
  answerWrong: () => void;
  completeActivity: () => void;
  resetActivity: () => void;
  getStars: () => number;
}

export const useActivityStore = create<ActivityState>()((set, get) => ({
  currentActivity: null,
  currentSubject: null,
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  isCompleted: false,

  startActivity: (activity) =>
    set({
      currentActivity: activity,
      currentSubject: activity.subject,
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      isCompleted: false,
    }),

  answerCorrect: () =>
    set((state) => ({
      score: state.score + 10,
      totalQuestions: state.totalQuestions + 1,
      correctAnswers: state.correctAnswers + 1,
    })),

  answerWrong: () =>
    set((state) => ({
      totalQuestions: state.totalQuestions + 1,
    })),

  completeActivity: () => set({ isCompleted: true }),

  resetActivity: () =>
    set({
      currentActivity: null,
      currentSubject: null,
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      isCompleted: false,
    }),

  getStars: () => {
    const { correctAnswers, totalQuestions } = get();
    if (totalQuestions === 0) return 0;
    const ratio = correctAnswers / totalQuestions;
    if (ratio >= 0.9) return 3;
    if (ratio >= 0.7) return 2;
    return 1;
  },
}));
