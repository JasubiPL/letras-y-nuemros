// Catálogo de efectos de sonido. Ver docs/TECH_SPEC.md §9.
//
// IMPORTANTE: solo incluir aquí archivos que EXISTAN en assets/music/.
// Un require() a un archivo inexistente rompe el bundle de Metro.
//
// Mientras falten correct/wrong/celebration, el feedback funciona con
// voz (TTS) + háptica. Para activar los chimes: suelta los .mp3 en
// assets/music/ (fuentes CC0: kenney.nl, mixkit.co) y descomenta la línea.
export const SOUND_MAP = {
  tap: require('@assets/music/tap.mp3'),
  // correct: require('@assets/music/correct.mp3'),
  // wrong: require('@assets/music/wrong.mp3'),
  // celebration: require('@assets/music/celebration.mp3'),
} as Record<string, any>;
