import type { Activity, Subject } from '@appTypes/activity';
import {
  generateLettersLevel,
  LETTER_LEVEL_META,
  LETTERS_IMPLEMENTED_LEVELS,
  LETTERS_TOTAL_LEVELS,
} from '@features/letters/data/curriculum';
import {
  generateNumbersLevel,
  NUMBER_LEVEL_META,
  NUMBERS_IMPLEMENTED_LEVELS,
  NUMBERS_TOTAL_LEVELS,
} from '@features/numbers/data/curriculum';

// Punto único que mapea (materia, nivel) → datos. Lo usan el selector de
// niveles y el runner. Al añadir una materia/ruta se amplía solo aquí.

export function getLevelActivities(subject: Subject, level: number): Activity[] {
  if (subject === 'letters') return generateLettersLevel(level);
  if (subject === 'numbers') return generateNumbersLevel(level);
  return [];
}

export function getTotalLevels(subject: Subject): number {
  return subject === 'letters' ? LETTERS_TOTAL_LEVELS : NUMBERS_TOTAL_LEVELS;
}

export function getImplementedLevels(subject: Subject): number {
  return subject === 'letters' ? LETTERS_IMPLEMENTED_LEVELS : NUMBERS_IMPLEMENTED_LEVELS;
}

export function getLevelLabel(subject: Subject, level: number): string {
  const meta =
    subject === 'letters' ? LETTER_LEVEL_META[level] : NUMBER_LEVEL_META[level];
  return meta?.label ?? `Nivel ${level}`;
}

export function getLevelLetters(subject: Subject, level: number): string[] {
  if (subject === 'letters') return LETTER_LEVEL_META[level]?.letters ?? [];
  return [];
}
