import SpeechManager from '@services/speech/SpeechManager';
import type * as Speech from 'expo-speech';
import { useCallback } from 'react';

// Acceso ergonómico al TTS desde componentes. Ver docs/TECH_SPEC.md §9.
export function useSpeech() {
  const speech = SpeechManager.getInstance();

  const speak = useCallback(
    (text: string, options?: Speech.SpeechOptions) => speech.speak(text, options),
    []
  );
  const stop = useCallback(() => speech.stop(), []);

  return { speak, stop };
}
