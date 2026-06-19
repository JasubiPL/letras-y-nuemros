// Modelo de perfiles y progreso. Ver docs/TECH_SPEC.md §5.3 y §8.

export type ChildType = 'boy' | 'girl';

export interface ChildProfile {
  id: string;
  name: string; // "Mateo"
  childType: ChildType; // reusa el tema visual existente (fondos/colores)
  avatar: string; // clave de imagen/emoji
  createdAt: number;
}

export interface SubjectProgress {
  currentLevel: number; // nivel desbloqueado más alto (1..10)
  stars: Record<number, number>; // estrellas obtenidas por nivel
  completed: string[]; // ids de actividades completadas
}

export interface UserProgress {
  letters: SubjectProgress;
  numbers: SubjectProgress;
  lastPlayed: number;
}
