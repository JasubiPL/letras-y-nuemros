import {
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@shared/ui/useColorScheme';
import AudioManager from '@services/audio/AudioManager';
import { SOUND_MAP } from '@services/audio/sounds';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      },1000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    let isMounted = true;
    const audio = AudioManager.getInstance();

    const startBgMusic = async () => {
      try {
        await audio.preloadSounds(SOUND_MAP);
        await audio.playBgMusic(
          require('@assets/music/background-music.mp3'),
          true
        );

        if (!isMounted) {
          await audio.cleanup();
          return;
        }
      } catch (error) {
        console.warn('No se pudo reproducir la música de fondo:', error);
      }
    };

    void startBgMusic();

    return () => {
      isMounted = false;
      const stopBgMusic = async () => {
        try {
          await audio.cleanup();
        } catch (error) {
          console.warn('No se pudo detener la música de fondo:', error);
        }
      };

      void stopBgMusic();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="activity/play" options={{ headerShown: false }} />
        <Stack.Screen
          name="activity/complete"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="profile/setup" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
