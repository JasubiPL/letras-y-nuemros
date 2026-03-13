export type Subject = 'letters' | 'numbers';

export type LetterActivityType =
  | 'letter_recognition'  // Reconocer una letra entre varias
  | 'phonics'             // Asociar letra con su sonido
  | 'word_building'       // Formar palabras con letras
  | 'syllables';          // Identificar sílabas

export type NumberActivityType =
  | 'number_recognition'  // Reconocer un número entre varios
  | 'counting'            // Contar objetos
  | 'ordering'            // Ordenar números de menor a mayor
  | 'basic_operations';   // Suma y resta básica

export type ActivityType = LetterActivityType | NumberActivityType;

export type InteractionType = 'multiple_choice' | 'drag_and_drop' | 'tap_select' | 'sequence';

export interface Activity {
  id: string;
  subject: Subject;
  type: ActivityType;
  interaction: InteractionType;
  level: number;          // 1-10 dificultad progresiva
  title: string;
  instruction: string;    // Texto que se lee al niño (TTS)
  data: ActivityData;
}

export type ActivityData =
  | LetterRecognitionData
  | CountingData
  | MultipleChoiceData
  | OrderingData;

export interface LetterRecognitionData {
  target: string;         // Letra o número objetivo
  options: string[];      // Opciones a mostrar
}

export interface CountingData {
  count: number;          // Cantidad correcta
  maxOption: number;      // Número máximo en opciones
  emoji: string;          // Emoji del objeto a contar
}

export interface MultipleChoiceData {
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface OrderingData {
  sequence: number[];     // Secuencia correcta
  shuffled: number[];     // Secuencia desordenada
}
