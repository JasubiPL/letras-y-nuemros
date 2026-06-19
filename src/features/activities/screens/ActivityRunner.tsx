import type { Activity, Subject } from '@appTypes/activity';
import { THEME } from '@constants/theme';
import { useHaptics } from '@hooks/useHaptics';
import { useSound } from '@hooks/useSound';
import { useSpeech } from '@hooks/useSpeech';
import { MultipleChoice } from '@shared/components/MultipleChoice';
import { BackArrowIcon } from '@shared/ui/icons/BackArrowIcon';
import { PressableBounce } from '@shared/ui/PressableBounce';
import { goToComplete } from '@utils/nav';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

// Runner genérico de un nivel: recorre las actividades, locuta el enunciado,
// da feedback (voz + sonido + háptica) y al terminar navega a la celebración.
// Las estrellas se basan en aciertos a la primera; acabar el nivel siempre
// desbloquea el siguiente (reintentar nunca penaliza el avance).

interface ActivityRunnerProps {
  subject: Subject;
  level: number;
  activities: Activity[];
}

const ADVANCE_DELAY_MS = 1100;

export function ActivityRunner({ subject, level, activities }: ActivityRunnerProps) {
  const { playCorrect, playWrong } = useSound();
  const { speak } = useSpeech();
  const { success, warning } = useHaptics();

  const [index, setIndex] = useState(0);
  const correctRef = useRef(0);
  const missedRef = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = activities[index];

  // Locutar el enunciado (y el sonido de la letra en fonética) al entrar.
  useEffect(() => {
    if (!current) return;
    missedRef.current = false;
    speak(current.prompt);
    if (current.payload.kind === 'phonics') {
      const letter = current.payload.letter;
      const t = setTimeout(() => speak(letter), 1300);
      return () => clearTimeout(t);
    }
  }, [index, current, speak]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  const payload = current?.payload;
  const options =
    payload && (payload.kind === 'recognition' || payload.kind === 'phonics')
      ? payload.options
      : [];
  const correct =
    payload?.kind === 'recognition'
      ? payload.target
      : payload?.kind === 'phonics'
        ? payload.letter
        : '';

  const finish = () => {
    goToComplete(subject, level, correctRef.current, activities.length);
  };

  const advance = () => {
    if (index + 1 >= activities.length) finish();
    else setIndex((i) => i + 1);
  };

  const handleAttempt = (isCorrect: boolean) => {
    if (isCorrect) {
      if (!missedRef.current) correctRef.current += 1;
      success();
      playCorrect();
      speak('¡Muy bien!');
      advanceTimer.current = setTimeout(advance, ADVANCE_DELAY_MS);
    } else {
      missedRef.current = true;
      warning();
      playWrong();
      speak('Inténtalo de nuevo');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PressableBounce onPress={() => router.back()} hitSlop={8}>
          <BackArrowIcon size={32} />
        </PressableBounce>
        {current && (
          <View style={styles.dots}>
            {activities.map((a, i) => (
              <View
                key={a.id}
                style={[
                  styles.dot,
                  i < index && styles.dotDone,
                  i === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {current ? (
        <Animated.View key={current.id} entering={FadeIn.duration(300)} style={styles.stage}>
          <Text style={styles.prompt}>{current.prompt}</Text>
          <MultipleChoice
            key={current.id}
            options={options}
            correct={correct}
            onAttempt={handleAttempt}
          />
        </Animated.View>
      ) : (
        <View style={styles.stage}>
          <Text style={styles.prompt}>Pronto habrá más actividades aquí 🐣</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  dotDone: {
    backgroundColor: THEME.colors.success,
  },
  dotActive: {
    backgroundColor: THEME.colors.primary,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  prompt: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
    color: THEME.colors.text.primary,
    paddingHorizontal: 12,
  },
});
