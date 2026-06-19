import * as Speech from 'expo-speech';

// Lee instrucciones y feedback en voz alta en español. Ver docs/TECH_SPEC.md §9.
// Singleton (mismo patrón que AudioManager) para poder silenciarlo globalmente
// desde Ajustes. Una sola voz a la vez: cada `speak` corta la anterior.

const DEFAULT_OPTIONS: Speech.SpeechOptions = {
  language: 'es-ES',
  rate: 0.85,
  pitch: 1.1, // un punto más agudo: suena más amable para niños
};

class SpeechManager {
  private static instance: SpeechManager;
  private enabled = true;

  static getInstance(): SpeechManager {
    if (!SpeechManager.instance) {
      SpeechManager.instance = new SpeechManager();
    }
    return SpeechManager.instance;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      Speech.stop();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  speak(text: string, options?: Speech.SpeechOptions): void {
    if (!this.enabled || !text) return;
    // Evita solapamientos: corta lo que se esté diciendo.
    Speech.stop();
    Speech.speak(text, { ...DEFAULT_OPTIONS, ...options });
  }

  stop(): void {
    Speech.stop();
  }
}

export default SpeechManager;
