import { CartoonButton } from '@components/ui/CartoonButton';
import { BackArrowIcon } from '@components/ui/icons/BackArrowIcon';
import { OutlinedRainbowText } from '@components/ui/OutlinedRainbowText';
import type { CartoonColor } from '@components/ui/types';
import { THEME } from '@constants/theme';
import { useSound } from '@hooks/useSound';
import { useChildThemeStore } from '@stores/useChildThemeStore';
import { useRouter } from 'expo-router';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

export default function MenuScreen() {
  const { playTap } = useSound();
  const router = useRouter();
  const childType = useChildThemeStore((state) => state.childType);
  const selectedChildType = childType ?? 'girl';

  const bg = childType === 'girl'
    ? require('@assets/images/backgrounds/bg-menu-girl.webp')
    : require('@assets/images/backgrounds/bg-menu-boy.webp');

    const colorButton: Record<'girl' | 'boy', CartoonColor[]> = {
      girl: ['pink', 'purple', 'yellow'],
      boy: ['greenAccent', 'silver', 'gold'],
    };
  return (
    <ImageBackground
      source={bg}
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
            router.push('/');
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
          onPress={() => { playTap(); }}
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
          onPress={() => { playTap(); }}
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
          onPress={() => { playTap(); }}
        />
        <CartoonButton
          iconAbsolute
          iconContainerStyle={{ top: -40, left: -40 }}
          icon={
            <Image
              source={require('@assets/images/items/donate.webp')}
              style={{ width: 110, height: 110 }}
              resizeMode="contain"
            />
          }
          label="Donar"
          color="diamond"
          onPress={() => { playTap(); }}
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
