import { useCallback } from 'react';
import AudioManager from '@services/audio/AudioManager';

export function useSound() {
  const audio = AudioManager.getInstance();

  const playTap = useCallback(() => audio.playSound('tap'), []);
  const playCorrect = useCallback(() => audio.playSound('correct'), []);
  const playWrong = useCallback(() => audio.playSound('wrong'), []);
  const playCelebration = useCallback(() => audio.playSound('celebration'), []);

  return { playTap, playCorrect, playWrong, playCelebration };
}
