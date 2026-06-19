import type { Activity } from '@appTypes/activity';
import { randomItem, sample, shuffle } from '@utils/array';

// Currículo de Letras. Ver docs/TECH_SPEC.md §6.1.
// Fase 1: niveles 1-3 con generador implementado (reconocimiento + fonética).
// Los metadatos de 4-10 existen para mostrarlos en el selector como "Pronto".

export const LETTER_ORDER = [
  'A', 'E', 'I', 'O', 'U',
  'M', 'P', 'S', 'L', 'T',
  'N', 'D', 'R', 'C', 'B',
  'F', 'G', 'H', 'J', 'V',
  'K', 'Ñ', 'Q', 'LL', 'W', 'X', 'Y', 'Z',
];

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export interface LetterLevelMeta {
  letters: string[];
  label: string;
}

export const LETTER_LEVEL_META: Record<number, LetterLevelMeta> = {
  1: { letters: ['A', 'E'], label: 'Vocales A · E' },
  2: { letters: ['I', 'O', 'U'], label: 'Vocales I · O · U' },
  3: { letters: VOWELS, label: 'Sonidos de vocales' },
  4: { letters: ['M', 'P'], label: 'M · P' },
  5: { letters: ['S', 'L', 'T'], label: 'S · L · T' },
  6: { letters: ['N', 'D', 'R'], label: 'N · D · R' },
  7: { letters: ['C', 'B', 'F'], label: 'C · B · F' },
  8: { letters: ['G', 'H', 'J', 'V'], label: 'G · H · J · V' },
  9: { letters: ['K', 'Ñ', 'Q', 'LL'], label: 'K · Ñ · Q · LL' },
  10: { letters: ['W', 'X', 'Y', 'Z'], label: 'W · X · Y · Z' },
};

export const LETTERS_TOTAL_LEVELS = 10;
export const LETTERS_IMPLEMENTED_LEVELS = 3;

const ITEMS_PER_LEVEL = 8;
const OPTIONS = 3;

export function generateLettersLevel(level: number): Activity[] {
  const meta = LETTER_LEVEL_META[level];
  if (!meta || level > LETTERS_IMPLEMENTED_LEVELS) return [];

  const isPhonics = level === 3;
  const activities: Activity[] = [];

  for (let i = 0; i < ITEMS_PER_LEVEL; i++) {
    const target = randomItem(meta.letters);
    const distractors = sample(
      VOWELS.filter((l) => l !== target),
      OPTIONS - 1
    );
    const options = shuffle([target, ...distractors]);

    activities.push(
      isPhonics
        ? {
            id: `L${level}-pho-${i + 1}`,
            subject: 'letters',
            type: 'phonics',
            level,
            prompt: '¿Qué letra suena así?',
            payload: { kind: 'phonics', letter: target, options },
            reward: 1,
          }
        : {
            id: `L${level}-rec-${i + 1}`,
            subject: 'letters',
            type: 'letter_recognition',
            level,
            prompt: `¿Dónde está la ${target}?`,
            payload: { kind: 'recognition', target, options },
            reward: 1,
          }
    );
  }

  return activities;
}
