import { MusicIcon } from '@components/ui/icons/Music';
import { SoundIcon } from '@components/ui/icons/SoundIcon';
import { OutlinedText } from '@components/ui/OutlinedText';
import { PlayStopSwitch } from '@components/ui/PlayStopSwitch';
import { CARTOON_BUTTON_THEMES } from '@constants/Colors';
import { THEME } from '@constants/theme';
import { useSound } from '@hooks/useSound';
import AudioManager from '@services/audio/AudioManager';
import { useChildThemeStore } from '@stores/useChildThemeStore';
import { router } from 'expo-router';
import { useState } from 'react';
import { PressableBounce } from '@components/ui/PressableBounce';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

const audio = AudioManager.getInstance();

export default function SettingsScreen() {
  const { playTap } = useSound();
  const [musicOn, setMusicOn] = useState(() => audio.isMusicEnabled());
  const [soundOn, setSoundOn] = useState(() => audio.isSoundEnabled());
  const childType = useChildThemeStore((state) => state.childType);
  const background = childType === 'girl'
    ? require('@assets/images/backgrounds/bg-settings-girl.webp') 
    : require('@assets/images/backgrounds/bg-settings-boy.webp');

  return (
    <ImageBackground
      source={background}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Ajustes</Text>
          <View style={ styles.controls}>
            <View style={styles.controlItem}>
              <View style={styles.itemContainer}>
                <OutlinedText
                  svgRenderer={(color) => <MusicIcon color={color} width={32} height={32} />}
                  outlineColor='#000000'
                />
                <OutlinedText
                  text="Música" 
                  textStyle={styles.itemText}
                />
              </View>
              <PlayStopSwitch isPlaying={musicOn} onToggle={() => { const next = !musicOn; setMusicOn(next); audio.setMusicEnabled(next); }} />
            </View>
            <View style={styles.controlItem}>
              <View style={styles.itemContainer}>
                <OutlinedText
                  svgRenderer={(color) => <SoundIcon color={color} width={32} height={32} />}
                  outlineColor='#000000'
                />
                <OutlinedText
                  text="Efectos" 
                  textStyle={styles.itemText}
                />
              </View>
              <PlayStopSwitch isPlaying={soundOn} onToggle={() => { const next = !soundOn; setSoundOn(next); audio.setSoundEnabled(next); }} />
            </View>
          </View>
          <PressableBounce
            onPress={() => { router.back(); playTap(); }}
            hitSlop={8}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Volver</Text>
            <View style={styles.backHighlight} />
            <View style={styles.backShadow} />
          </PressableBounce>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 16,
  },
  header:{
    marginTop: 36,
    padding: 16,
    alignItems: 'center',
  },
  title:{
    marginTop: -44,
    fontSize: 24,
    width: '70%',
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
    color: '#fff',
    backgroundColor: CARTOON_BUTTON_THEMES.gold.bg,
    paddingHorizontal: 32,
    paddingVertical: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    borderRadius: 8,
  },
  content:{
    backgroundColor: CARTOON_BUTTON_THEMES.gold.highlight,
    display: 'flex',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
    borderWidth: 6,
    borderColor: CARTOON_BUTTON_THEMES.gold.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  controls: {
    marginTop: 16,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  controlItem:{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CARTOON_BUTTON_THEMES.gold.bg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: CARTOON_BUTTON_THEMES.gold.shadow,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    marginTop: 2,
    color: '#fff',
    fontSize: 24,
    fontFamily: THEME.fonts.bodyBold,
  },
  backButton: {
    padding: 16,
    backgroundColor: CARTOON_BUTTON_THEMES.redAccent.bg,
    borderRadius: 16,
    marginTop: 24,
    width: '50%',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  backText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: THEME.fonts.titleExtraBold,
  },
  backHighlight: {
    position: 'absolute',
    width: '100%',
    height: 8,
    borderRadius: 4,
    top: 4,
    left: '15%',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  backShadow: {
    position: 'absolute',
    width: '150%',
    height: 12,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },

})
