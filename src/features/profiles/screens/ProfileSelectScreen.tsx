import type { ChildProfile } from '@appTypes/progress';
import { THEME } from '@constants/theme';
import { useSound } from '@hooks/useSound';
import { OutlinedRainbowText } from '@shared/ui/OutlinedRainbowText';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { PressableBounce } from '@shared/ui/PressableBounce';
import { useChildThemeStore } from '@stores/useChildThemeStore';
import { useProfilesStore } from '@stores/useProfilesStore';
import { goToProfileSetup } from '@utils/nav';
import { useRouter } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Pantalla de inicio: elegir qué hijo juega (o crear el primer perfil).
export default function ProfileSelectScreen() {
  const router = useRouter();
  const { playTap } = useSound();
  const profiles = useProfilesStore((s) => s.profiles);
  const setActiveProfile = useProfilesStore((s) => s.setActiveProfile);
  const setChildType = useChildThemeStore((s) => s.setChildType);

  const pick = (p: ChildProfile) => {
    playTap();
    setActiveProfile(p.id);
    setChildType(p.childType);
    router.push('/(tabs)/menu');
  };

  const hasProfiles = profiles.length > 0;

  return (
    <ImageBackground
      source={require('@assets/images/backgrounds/bg-select-child.webp')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.duration(500)} style={styles.titleWrap}>
          <OutlinedRainbowText
            text={hasProfiles ? '¿Quién juega hoy?' : '¡Hola!'}
            textStyle={styles.title}
          />
        </Animated.View>

        {hasProfiles ? (
          <ScrollView contentContainerStyle={styles.grid}>
            {profiles.map((p, i) => (
              <Animated.View key={p.id} entering={FadeInDown.duration(400).delay(i * 80)}>
                <PressableBounce style={styles.card} onPress={() => pick(p)}>
                  <ProfileAvatar emoji={p.avatar} childType={p.childType} size={84} />
                  <Text style={styles.name} numberOfLines={1}>
                    {p.name}
                  </Text>
                </PressableBounce>
              </Animated.View>
            ))}
            <Animated.View entering={FadeInDown.duration(400).delay(profiles.length * 80)}>
              <PressableBounce
                style={styles.card}
                onPress={() => {
                  playTap();
                  goToProfileSetup();
                }}
              >
                <View style={styles.addCircle}>
                  <Text style={styles.addPlus}>＋</Text>
                </View>
                <Text style={styles.name}>Nuevo</Text>
              </PressableBounce>
            </Animated.View>
          </ScrollView>
        ) : (
          <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.emptyWrap}>
            <PressableBounce
              style={styles.createBtn}
              onPress={() => {
                playTap();
                goToProfileSetup();
              }}
            >
              <Text style={styles.createText}>Crear mi perfil</Text>
            </PressableBounce>
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  titleWrap: {
    marginTop: 56,
    alignSelf: 'center',
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 32,
    gap: 8,
  },
  card: {
    width: 120,
    alignItems: 'center',
    gap: 8,
    margin: 8,
  },
  name: {
    fontSize: 18,
    fontFamily: THEME.fonts.titleBold,
    color: THEME.colors.text.primary,
  },
  addCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlus: {
    fontSize: 44,
    color: '#2A2A2A',
    fontFamily: THEME.fonts.titleExtraBold,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtn: {
    backgroundColor: THEME.colors.success,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#2A2A2A',
  },
  createText: {
    fontSize: 24,
    color: '#FFF8F8',
    fontFamily: THEME.fonts.titleExtraBold,
  },
});
