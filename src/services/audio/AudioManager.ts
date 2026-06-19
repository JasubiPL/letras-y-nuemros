type PlayerLike = {
  play?: () => Promise<void> | void;
  pause?: () => Promise<void> | void;
  seekTo?: (seconds: number) => Promise<void> | void;
  remove?: () => Promise<void> | void;
  release?: () => Promise<void> | void;
  loop?: boolean;
  volume?: number;
};

type ExpoAudioModuleLike = {
  setAudioModeAsync?: (mode: {
    playsInSilentMode?: boolean;
    shouldPlayInBackground?: boolean;
  }) => Promise<void>;
  createAudioPlayer?: (source: any) => PlayerLike;
};

class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<string, PlayerLike> = new Map();
  private bgMusic: PlayerLike | null = null;
  private audioModule: ExpoAudioModuleLike | null = null;
  private musicEnabled = true;
  private soundEnabled = true;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async getAudioModule(): Promise<ExpoAudioModuleLike | null> {
    if (this.audioModule) {
      return this.audioModule;
    }

    try {
      const expoAudio = await import('expo-audio');
      this.audioModule = expoAudio as unknown as ExpoAudioModuleLike;
      return this.audioModule;
    } catch (error) {
      console.warn('Módulo nativo de audio no disponible en este build:', error);
      return null;
    }
  }

  async preloadSounds(soundMap: Record<string, any>): Promise<void> {
    const audio = await this.getAudioModule();
    if (!audio?.createAudioPlayer) {
      return;
    }

    if (audio.setAudioModeAsync) {
      await audio.setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
      });
    }

    const entries = Object.entries(soundMap);
    entries.forEach(([key, source]) => {
      const player = audio.createAudioPlayer?.(source);
      if (player) {
        this.sounds.set(key, player);
      }
    });
  }

  async setMusicEnabled(enabled: boolean): Promise<void> {
    this.musicEnabled = enabled;
    if (!this.bgMusic) return;
    if (enabled) {
      if (this.bgMusic.play) await this.bgMusic.play();
    } else {
      if (this.bgMusic.pause) await this.bgMusic.pause();
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  async playSound(key: string): Promise<void> {
    if (!this.soundEnabled) return;
    const player = this.sounds.get(key);
    if (player) {
      if (player.seekTo) {
        await player.seekTo(0);
      }
      if (player.play) {
        await player.play();
      }
    }
  }

  async playBgMusic(source: any, loop = true): Promise<void> {
    const audio = await this.getAudioModule();
    if (!audio?.createAudioPlayer) {
      return;
    }

    if (this.bgMusic) {
      if (this.bgMusic.pause) {
        await this.bgMusic.pause();
      }
      if (this.bgMusic.remove) {
        await this.bgMusic.remove();
      } else if (this.bgMusic.release) {
        await this.bgMusic.release();
      }
    }

    const player = audio.createAudioPlayer(source);
    player.loop = loop;
    player.volume = 0.05;
    this.bgMusic = player;
    if (this.musicEnabled && player.play) {
      await player.play();
    }
  }

  async cleanup(): Promise<void> {
    for (const sound of this.sounds.values()) {
      if (sound.remove) {
        await sound.remove();
      } else if (sound.release) {
        await sound.release();
      }
    }
    this.sounds.clear();
    if (this.bgMusic) {
      if (this.bgMusic.remove) {
        await this.bgMusic.remove();
      } else if (this.bgMusic.release) {
        await this.bgMusic.release();
      }
      this.bgMusic = null;
    }
  }
}

export default AudioManager;
