export interface SubjectProgress {
  currentLevel: number;
  completedActivities: string[];
  stars: Record<string, number>; // activityId -> estrellas (1-3)
  totalStars: number;
}

export interface UserProgress {
  letters: SubjectProgress;
  numbers: SubjectProgress;
}

export function createEmptySubjectProgress(): SubjectProgress {
  return {
    currentLevel: 1,
    completedActivities: [],
    stars: {},
    totalStars: 0,
  };
}
