// Modelo de dominio de las actividades de aprendizaje.
// Una Activity es un objeto de DATOS; un único ActivityRunner la interpreta
// y monta la mecánica de juego correspondiente. Ver docs/TECH_SPEC.md §5.

export type Subject = 'letters' | 'numbers';

export type ActivityType =
  // Letras
  | 'letter_recognition' // reconocer una letra entre opciones
  | 'phonics' // asociar letra ↔ sonido
  | 'syllables' // identificar / formar una sílaba
  | 'word_building' // construir una palabra corta
  // Números
  | 'counting' // contar objetos (emojis)
  | 'number_recognition' // reconocer un número entre opciones
  | 'ordering' // ordenar una secuencia numérica
  | 'comparison' // ¿cuál tiene más / menos?
  | 'basic_operations'; // suma / resta simple

// --- Payloads (unión discriminada por `kind`) ---
// Se discrimina por `kind` y no por ActivityType porque varios tipos
// comparten la misma forma de datos (p. ej. reconocer letra o número).

export interface RecognitionPayload {
  kind: 'recognition';
  target: string; // lo que hay que encontrar: 'A', '7'…
  options: string[]; // opciones mostradas (incluye target)
}

export interface PhonicsPayload {
  kind: 'phonics';
  letter: string; // letra cuyo sonido se pronuncia por TTS
  options: string[];
}

export interface CountingPayload {
  kind: 'counting';
  emoji: string; // objeto a contar, p. ej. '🍎'
  count: number; // cantidad real
  options: number[];
}

export interface OrderingPayload {
  kind: 'ordering';
  sequence: number[]; // secuencia correcta; se baraja al mostrarla
}

export interface ComparisonPayload {
  kind: 'comparison';
  left: number;
  right: number;
  ask: 'more' | 'less';
}

export interface OperationPayload {
  kind: 'operation';
  a: number;
  b: number;
  op: '+' | '-';
  options: number[];
}

export interface WordPayload {
  kind: 'word';
  word: string;
  syllables: string[];
  image?: string; // clave de imagen/emoji opcional
}

export type ActivityPayload =
  | RecognitionPayload
  | PhonicsPayload
  | CountingPayload
  | OrderingPayload
  | ComparisonPayload
  | OperationPayload
  | WordPayload;

export interface Activity {
  id: string; // 'L1-rec-01'
  subject: Subject;
  type: ActivityType;
  level: number; // 1..10
  prompt: string; // texto + base del TTS: "¿Dónde está la A?"
  payload: ActivityPayload;
  reward: number; // estrellas que otorga (1..3)
}
