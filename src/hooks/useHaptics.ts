import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

// Feedback táctil. Ver docs/TECH_SPEC.md §9.
// Flag a nivel de módulo para poder silenciarlo desde Ajustes (Fase 4),
// igual que el sonido en AudioManager.

let hapticsEnabled = true;

export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}

export function useHaptics() {
  const success = useCallback(() => {
    if (hapticsEnabled) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const warning = useCallback(() => {
    if (hapticsEnabled) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, []);

  const light = useCallback(() => {
    if (hapticsEnabled) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  return { success, warning, light };
}
