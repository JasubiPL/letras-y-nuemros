import type { Activity } from '@appTypes/activity';

// Orden pedagógico de vocales y consonantes en español
export const LETTER_ORDER = [
  // Nivel 1-2: Vocales
  'A', 'E', 'I', 'O', 'U',
  // Nivel 3-4: Consonantes frecuentes
  'M', 'P', 'S', 'L', 'T',
  // Nivel 5-6: Consonantes comunes
  'N', 'D', 'R', 'C', 'B',
  // Nivel 7-8: Consonantes menos frecuentes
  'F', 'G', 'H', 'J', 'V',
  // Nivel 9-10: Consonantes restantes
  'K', 'Ñ', 'Q', 'W', 'X', 'Y', 'Z',
] as const;

// Orden progresivo de números
export const NUMBER_ORDER = [
  // Nivel 1-2: Números básicos
  1, 2, 3, 4, 5,
  // Nivel 3-4: Números medios
  6, 7, 8, 9, 10,
  // Nivel 5-6: Teens
  11, 12, 13, 14, 15,
  // Nivel 7-8: Números más grandes
  16, 17, 18, 19, 20,
  // Nivel 9-10: Operaciones básicas (suma/resta hasta 10)
] as const;

export function getLetterActivities(level: number): Activity[] {
  const lettersForLevel = LETTER_ORDER.slice(0, Math.min(level * 2 + 3, LETTER_ORDER.length));
  const targetLetters = LETTER_ORDER.slice(
    Math.max(0, (level - 1) * 2),
    Math.min(level * 2 + 1, LETTER_ORDER.length)
  );

  return targetLetters.map((letter, i) => {
    const distractors = lettersForLevel
      .filter((l) => l !== letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [...distractors, letter].sort(() => Math.random() - 0.5);

    return {
      id: `letter-${level}-${i}`,
      subject: 'letters',
      type: 'letter_recognition',
      interaction: 'tap_select',
      level,
      title: `Encuentra la ${letter}`,
      instruction: `¿Dónde está la letra ${letter}?`,
      data: {
        target: letter,
        options,
      },
    };
  });
}

export function getNumberActivities(level: number): Activity[] {
  const activities: Activity[] = [];

  if (level <= 4) {
    // Counting activities
    const maxNum = Math.min(level * 2 + 3, 10);
    const emojis = ['🍎', '⭐', '🐟', '🦋', '🌺'];

    for (let i = 0; i < 3; i++) {
      const count = Math.floor(Math.random() * maxNum) + 1;
      const emoji = emojis[i % emojis.length];

      activities.push({
        id: `number-count-${level}-${i}`,
        subject: 'numbers',
        type: 'counting',
        interaction: 'tap_select',
        level,
        title: `Cuenta los ${emoji}`,
        instruction: `¿Cuántos ${emoji} hay?`,
        data: {
          count,
          maxOption: maxNum,
          emoji,
        },
      });
    }
  } else if (level <= 7) {
    // Number recognition
    const maxNum = Math.min(level * 2, 20);

    for (let i = 0; i < 3; i++) {
      const target = Math.floor(Math.random() * maxNum) + 1;
      const distractors = Array.from({ length: 3 }, () => {
        let n;
        do {
          n = Math.floor(Math.random() * maxNum) + 1;
        } while (n === target);
        return n;
      });

      activities.push({
        id: `number-recog-${level}-${i}`,
        subject: 'numbers',
        type: 'number_recognition',
        interaction: 'tap_select',
        level,
        title: `Encuentra el ${target}`,
        instruction: `¿Dónde está el número ${target}?`,
        data: {
          target: String(target),
          options: [...distractors.map(String), String(target)].sort(() => Math.random() - 0.5),
        },
      });
    }
  } else {
    // Ordering activities
    const seqLength = Math.min(level - 4, 5);
    const start = Math.floor(Math.random() * 10) + 1;
    const sequence = Array.from({ length: seqLength }, (_, i) => start + i);
    const shuffled = [...sequence].sort(() => Math.random() - 0.5);

    activities.push({
      id: `number-order-${level}-0`,
      subject: 'numbers',
      type: 'ordering',
      interaction: 'sequence',
      level,
      title: 'Ordena los números',
      instruction: 'Pon los números en orden de menor a mayor',
      data: { sequence, shuffled },
    });
  }

  return activities;
}
