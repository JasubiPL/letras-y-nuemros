import { Audio } from 'expo-av';

class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<string, Audio.Sound> = new Map();
  private bgMusic: Audio.Sound | null = null;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async preloadSounds(soundMap: Record<string, any>): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    const entries = Object.entries(soundMap);
    await Promise.all(
      entries.map(async ([key, source]) => {
        const { sound } = await Audio.Sound.createAsync(source);
        this.sounds.set(key, sound);
      })
    );
  }

  async playSound(key: string): Promise<void> {
    const sound = this.sounds.get(key);
    if (sound) {
      await sound.replayAsync();
    }
  }

  async playBgMusic(source: any, loop = true): Promise<void> {
    if (this.bgMusic) {
      await this.bgMusic.stopAsync();
      await this.bgMusic.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync(source, {
      isLooping: loop,
      volume: 0.3,
    });
    this.bgMusic = sound;
    await sound.playAsync();
  }

  async cleanup(): Promise<void> {
    for (const sound of this.sounds.values()) {
      await sound.unloadAsync();
    }
    this.sounds.clear();
    if (this.bgMusic) {
      await this.bgMusic.unloadAsync();
    }
  }
}

export default AudioManager;
