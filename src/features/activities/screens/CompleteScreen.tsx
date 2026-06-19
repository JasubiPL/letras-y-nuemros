import type { Subject } from '@appTypes/activity';
import { THEME } from '@constants/theme';
import { useHaptics } from '@hooks/useHaptics';
import { useSound } from '@hooks/useSound';
import { useSpeech } from '@hooks/useSpeech';
import { CartoonButton } from '@shared/ui/CartoonButton';
import { OutlinedRainbowText } from '@shared/ui/OutlinedRainbowText';
import { useProfilesStore } from '@stores/useProfilesStore';
import { useProgressStore } from '@stores/useProgressStore';
import { replayLevel } from '@utils/nav';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

// Celebración post-nivel. Calcula estrellas por aciertos a la primera,
// guarda el progreso (desbloquea el siguiente nivel) y ofrece repetir/volver.

function computeStars(correct: number, total: number): number {
  if (total === 0) return 1;
  const pct = correct / total;
  if (pct >= 1) return 3;
  if (pct >= 0.6) return 2;
  return 1;
}

export default function CompleteScreen() {
  const params = useLocalSearchParams<{
    subject: Subject;
    level: string;
    correct: string;
    total: string;
  }>();
  const subject = (params.subject ?? 'letters') as Subject;
  const level = Number(params.level ?? '1');
  const correct = Number(params.correct ?? '0');
  const total = Number(params.total ?? '0');
  const stars = computeStars(correct, total);

  const profileId = useProfilesStore((s) => s.activeProfileId) ?? 'default';
  const completeLevel = useProgressStore((s) => s.completeLevel);
  const { speak } = useSpeech();
  const { playCelebration } = useSound();
  const { success } = useHaptics();
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    completeLevel(profileId, subject, level, stars);
    success();
    playCelebration();
    speak('¡Lo lograste!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.duration(450)}>
        <OutlinedRainbowText text="¡Lo lograste!" textStyle={styles.title} />
      </Animated.View>

      <View style={styles.starsRow}>
        {[0, 1, 2].map((i) => (
          <Animated.Text
            key={i}
            entering={FadeInDown.delay(300 + i * 220).duration(420)}
            style={[
              styles.star,
              { color: i < stars ? THEME.colors.accent : 'rgba(0,0,0,0.15)' },
            ]}
          >
            ★
          </Animated.Text>
        ))}
      </View>

      <Text style={styles.score}>
        {correct} de {total} a la primera
      </Text>

      <View style={styles.buttons}>
        <CartoonButton
          label="Otra vez"
          color="yellow"
          onPress={() => replayLevel(subject, level)}
        />
        <CartoonButton label="Volver" color="greenAccent" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 24,
  },
  title: {
    fontSize: 42,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  star: {
    fontSize: 64,
  },
  score: {
    fontSize: 20,
    fontFamily: THEME.fonts.bodyBold,
    color: THEME.colors.text.secondary,
  },
  buttons: {
    marginTop: 12,
    gap: 16,
    alignItems: 'center',
  },
});
