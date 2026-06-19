import { THEME } from '@constants/theme';
import { useSound } from '@hooks/useSound';
import { CartoonButton } from '@shared/ui/CartoonButton';
import { BackArrowIcon } from '@shared/ui/icons/BackArrowIcon';
import { OutlinedRainbowText } from '@shared/ui/OutlinedRainbowText';
import type { CartoonColor } from '@shared/ui/types';
import { useChildThemeStore } from '@stores/useChildThemeStore';
import { goToNumbersMenu } from '@utils/nav';
import { useRouter } from 'expo-router';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

export default function MenuScreen() {
  const { playTap } = useSound();
  const router = useRouter();
  const childType = useChildThemeStore((state) => state.childType);
  const selectedChildType = childType ?? 'girl';

  const background = childType === 'girl'
    ? require('@assets/images/backgrounds/bg-menu-girl.webp')
    : require('@assets/images/backgrounds/bg-menu-boy.webp');

    const colorButton: Record<'girl' | 'boy', CartoonColor[]> = {
      girl: ['pink', 'purple', 'yellow'],
      boy: ['greenAccent', 'silver', 'gold'],
    };
  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <CartoonButton 
          label=""
          icon={<BackArrowIcon size={36} />}
          color='redAccent'
          width={48}
          height={48}
          onPress={() => {
            playTap();
            router.back();
          }}
        />
      </View>
      <View style={styles.container}>
      <OutlinedRainbowText 
        text='¿Que aprenderas hoy?'
        accent
        textStyle={styles.title}
      />
        <CartoonButton
          iconAbsolute
          iconContainerStyle={{ top: -45, left: 190 }}
          icon={
            <Image
              source={require('@assets/images/items/abc.webp')}
              style={{ width: 110, height: 110 }}
              resizeMode="contain"
            />
          }
          label="Letras"
          color={colorButton[selectedChildType][0]}
          onPress={() => { 
            playTap();
            router.push('/(tabs)/lettersScreens/lettersMenu');
          }}
        />
        <CartoonButton
          iconAbsolute
          iconContainerStyle={{ top: -40, left: -40 }}
          icon={
            <Image
              source={require('@assets/images/items/numbers-blocks.webp')}
              style={{ width: 110, height: 110 }}
              resizeMode="contain"
            />
          }
          label="Números"
          color={colorButton[selectedChildType][1]}
          onPress={() => {
            playTap();
            goToNumbersMenu();
          }}
        />
        <CartoonButton
          iconAbsolute
          iconContainerStyle={{ top: -35, left: 200 }}
          icon={
            <Image
              source={require('@assets/images/items/settings.webp')}
              style={{ width: 110, height: 110 }}
              resizeMode="contain"
            />
          }
          label="Config"
          color={colorButton[selectedChildType][2]}
          onPress={() => { 
            playTap();
            router.push('/(tabs)/settings');
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    height: 48,
    marginTop: 32,
    padding: 16,
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 24,
    padding: 16,
    marginTop: 48,
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
  }
});
