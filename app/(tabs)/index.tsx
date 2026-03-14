import { THEME } from '@constants/theme';
import { Image, ImageBackground, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { View } from '@components/Themed';
import { OutlinedRainbowText } from '@components/ui/OutlinedRainbowText';
import { useSound } from '@hooks/useSound';
import { useChildThemeStore } from '@stores/useChildThemeStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { playTap } = useSound();
  const girlScale = useSharedValue(1);
  const boyScale = useSharedValue(1);
  const { setChildType } = useChildThemeStore();

  const girlAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: girlScale.value }],
  }));

  const boyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boyScale.value }],
  }));

  return (
    <ImageBackground
      source={require('@assets/images/backgrounds/bg-select-child.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Animated.View
          style={styles.titleWrapper}
          entering={FadeInUp.duration(600)}
        >
          <OutlinedRainbowText
            text="¡Hola!"
            textStyle={styles.title}
          />
          <OutlinedRainbowText
            text="¿Eres niño o niña?"
            textStyle={styles.subtitle}
          />
        </Animated.View>
        <Animated.View
          style={styles.buttonsRow}
          entering={FadeInDown.duration(700).delay(180)}
        >
          <Animated.View entering={FadeInDown.duration(600).delay(260)}>
            <Animated.View style={girlAnimatedStyle}>
              <Pressable
                style={styles.pressable}
                onPress={() =>{
                  playTap();
                  setChildType('girl');
                  router.push('/(tabs)/menu');
                }}
                onPressIn={() => {
                  girlScale.value = withSpring(0.92, { damping: 36, stiffness: 420 });
                }}
                onPressOut={() => {
                  girlScale.value = withSpring(1, { damping: 36, stiffness: 420 });
                }}
              >
                <Image
                  source={require('@assets/images/girl-child-button.webp')}
                  accessibilityLabel="Soy Niña"
                  style={styles.childButton}
                  resizeMode="contain"
                />
              </Pressable>
            </Animated.View>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(600).delay(360)}>
            <Animated.View style={boyAnimatedStyle}>
              <Pressable
                style={styles.pressable}
                onPress={() => {
                  playTap();
                  setChildType('boy');
                  router.push('/(tabs)/menu');
                }}
                onPressIn={() => {
                  boyScale.value = withSpring(0.92, { damping: 36, stiffness: 420 });
                }}
                onPressOut={() => {
                  boyScale.value = withSpring(1, { damping: 36, stiffness: 420 });
                }}
              >
                <Image
                  source={require('@assets/images/boy-child-button.webp')}
                  accessibilityLabel="Soy Niño"
                  style={styles.childButton}
                  resizeMode="contain"
                />
              </Pressable>
            </Animated.View>
          </Animated.View>
        </Animated.View>
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
