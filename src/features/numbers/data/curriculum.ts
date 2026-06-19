import type { Activity } from '@appTypes/activity';
import { randomItem, shuffle } from '@utils/array';

// Currículo de Números. Ver docs/TECH_SPEC.md §6.2. Foco 1-10.
// Todo se juega con MultipleChoice: 'counting' muestra emojis y se elige el
// número; el resto (reconocer, ordenar, comparar, operar) se modela como
// payload 'recognition' (enunciado de texto + opciones numéricas). Las mecánicas
// de arrastre/secuencia llegan en el evolutivo si hiciera falta.

export interface NumberLevelMeta {
  label: string;
}

export const NUMBER_LEVEL_META: Record<number, NumberLevelMeta> = {
  1: { label: 'Contar 1 a 3' },
  2: { label: 'Contar 1 a 5' },
  3: { label: 'Reconocer 1 a 5' },
  4: { label: 'Contar 6 a 10' },
  5: { label: 'Reconocer 6 a 10' },
  6: { label: 'Ordenar 1 a 10' },
  7: { label: 'Más y menos' },
  8: { label: 'Sumas hasta 5' },
  9: { label: 'Sumar y restar' },
  10: { label: 'Repaso' },
};

export const NUMBERS_TOTAL_LEVELS = 10;
export const NUMBERS_IMPLEMENTED_LEVELS = 10;

const ITEMS_PER_LEVEL = 8;
const EMOJIS = ['🍎', '⭐', '🐶', '🎈', '🐟', '🌸', '🍪', '🚗', '🦋', '🍓'];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Opciones numéricas únicas que incluyen la correcta, dentro de [min, max].
function numberOptions(correct: number, min: number, max: number, n = 3): string[] {
  const set = new Set<number>([correct]);
  let guard = 0;
  while (set.size < n && guard++ < 60) {
    set.add(randInt(Math.max(0, min), max));
  }
  return shuffle([...set]).map(String);
}

function counting(level: number, i: number, min: number, max: number): Activity {
  const count = randInt(min, max);
  const options = numberOptions(count, min, max).map(Number);
  return {
    id: `N${level}-cnt-${i}`,
    subject: 'numbers',
    type: 'counting',
    level,
    prompt: '¿Cuántos hay?',
    payload: { kind: 'counting', emoji: randomItem(EMOJIS), count, options },
    reward: 1,
  };
}

function recognition(level: number, i: number, min: number, max: number): Activity {
  const target = randInt(min, max);
  return {
    id: `N${level}-rec-${i}`,
    subject: 'numbers',
    type: 'number_recognition',
    level,
    prompt: `¿Dónde está el ${target}?`,
    payload: { kind: 'recognition', target: String(target), options: numberOptions(target, min, max) },
    reward: 1,
  };
}

function ordering(level: number, i: number): Activity {
  const start = randInt(1, 6);
  const seq = [start, start + 1, start + 2];
  const answer = start + 3;
  return {
    id: `N${level}-ord-${i}`,
    subject: 'numbers',
    type: 'ordering',
    level,
    prompt: `¿Qué número sigue? ${seq.join(', ')}…`,
    payload: { kind: 'recognition', target: String(answer), options: numberOptions(answer, 1, 10) },
    reward: 1,
  };
}

function comparison(level: number, i: number): Activity {
  const a = randInt(1, 10);
  let b = randInt(1, 10);
  while (b === a) b = randInt(1, 10);
  const askMore = Math.random() < 0.5;
  const target = askMore ? Math.max(a, b) : Math.min(a, b);
  return {
    id: `N${level}-cmp-${i}`,
    subject: 'numbers',
    type: 'comparison',
    level,
    prompt: askMore ? '¿Cuál es más grande?' : '¿Cuál es más pequeño?',
    payload: { kind: 'recognition', target: String(target), options: shuffle([String(a), String(b)]) },
    reward: 1,
  };
}

function operation(level: number, i: number, allowSub: boolean, maxResult: number): Activity {
  let a: number;
  let b: number;
  let op: '+' | '-';
  let result: number;
  if (allowSub && Math.random() < 0.5) {
    a = randInt(1, maxResult);
    b = randInt(0, a);
    op = '-';
    result = a - b;
  } else {
    result = randInt(1, maxResult);
    a = randInt(0, result);
    b = result - a;
    op = '+';
  }
  return {
    id: `N${level}-op-${i}`,
    subject: 'numbers',
    type: 'basic_operations',
    level,
    prompt: `¿Cuánto es ${a} ${op} ${b}?`,
    payload: { kind: 'recognition', target: String(result), options: numberOptions(result, 0, maxResult) },
    reward: 1,
  };
}

function makeItem(level: number, i: number): Activity {
  switch (level) {
    case 1:
      return counting(level, i, 1, 3);
    case 2:
      return counting(level, i, 1, 5);
    case 3:
      return recognition(level, i, 1, 5);
    case 4:
      return counting(level, i, 6, 10);
    case 5:
      return recognition(level, i, 6, 10);
    case 6:
      return ordering(level, i);
    case 7:
      return comparison(level, i);
    case 8:
      return operation(level, i, false, 5);
    case 9:
      return operation(level, i, true, 10);
    case 10: {
      const pick = randomItem(['rec', 'cmp', 'op'] as const);
      if (pick === 'rec') return recognition(level, i, 1, 10);
      if (pick === 'cmp') return comparison(level, i);
      return operation(level, i, true, 10);
    }
    default:
      return recognition(level, i, 1, 10);
  }
}

export function generateNumbersLevel(level: number): Activity[] {
  if (level < 1 || level > NUMBERS_IMPLEMENTED_LEVELS) return [];
  return Array.from({ length: ITEMS_PER_LEVEL }, (_, i) => makeItem(level, i + 1));
}
