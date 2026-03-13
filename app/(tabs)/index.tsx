import { THEME } from '@constants/theme';
import { Image, ImageBackground, Pressable, StyleSheet } from 'react-native';

import { View } from '@components/Themed';
import { OutlinedRainbowText } from '@components/ui/OutlinedRainbowText';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('@assets/images/backgrounds/bg-select-child.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <OutlinedRainbowText
            text="¡Hola!"
            textStyle={styles.title}
          />
          <OutlinedRainbowText
            text="¿Eres niño o niña?"
            textStyle={styles.subtitle}
          />
        </View>
        <View style={styles.buttonsRow}>
          <Pressable style={styles.pressable}>
            <Image
              source={require('@assets/images/girl-child-button.webp')}
              accessibilityLabel="Soy Niña"
              style={styles.childButton}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.pressable}>
            <Image
              source={require('@assets/images/boy-child-button.webp')}
              accessibilityLabel="Soy Niño"
              style={styles.childButton}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  titleWrapper: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 48,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
  },
  subtitle: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
  },
  pressable:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsRow: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  childButton: {
  width: 280,
  height: 280,
  },
});
