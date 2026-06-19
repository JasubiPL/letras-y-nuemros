import type { Activity, Subject } from '@appTypes/activity';
import {
  generateLettersLevel,
  LETTER_LEVEL_META,
  LETTERS_IMPLEMENTED_LEVELS,
  LETTERS_TOTAL_LEVELS,
} from '@features/letters/data/curriculum';

// Punto único que mapea (materia, nivel) → datos. Lo usan el selector de
// niveles y el runner. Al añadir Números (Fase 3) se amplía solo aquí.

export function getLevelActivities(subject: Subject, level: number): Activity[] {
  if (subject === 'letters') return generateLettersLevel(level);
  return [];
}

export function getTotalLevels(subject: Subject): number {
  return subject === 'letters' ? LETTERS_TOTAL_LEVELS : 10;
}

export function getImplementedLevels(subject: Subject): number {
  return subject === 'letters' ? LETTERS_IMPLEMENTED_LEVELS : 0;
}

export function getLevelLabel(subject: Subject, level: number): string {
  if (subject === 'letters') {
    return LETTER_LEVEL_META[level]?.label ?? `Nivel ${level}`;
  }
  return `Nivel ${level}`;
}

export function getLevelLetters(subject: Subject, level: number): string[] {
  if (subject === 'letters') return LETTER_LEVEL_META[level]?.letters ?? [];
  return [];
}
