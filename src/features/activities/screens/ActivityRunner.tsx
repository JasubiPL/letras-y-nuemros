import type { Activity, Subject } from '@appTypes/activity';
import { THEME } from '@constants/theme';
import { useHaptics } from '@hooks/useHaptics';
import { useSound } from '@hooks/useSound';
import { useSpeech } from '@hooks/useSpeech';
import { MultipleChoice } from '@shared/components/MultipleChoice';
import { CartoonButton } from '@shared/ui/CartoonButton';
import { BackArrowIcon } from '@shared/ui/icons/BackArrowIcon';
import { PressableBounce } from '@shared/ui/PressableBounce';
import { useProfilesStore } from '@stores/useProfilesStore';
import { useProgressStore } from '@stores/useProgressStore';
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
const LIVES_PER_LEVEL = 3;

export function ActivityRunner({ subject, level, activities }: ActivityRunnerProps) {
  const { playCorrect, playWrong } = useSound();
  const { speak, stop } = useSpeech();
  const { success, warning } = useHaptics();
  const profileId = useProfilesStore((state) => state.activeProfileId);
  const recordActivity = useProgressStore((state) => state.recordActivity);

  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(LIVES_PER_LEVEL);
  const [failed, setFailed] = useState(false);
  const [round, setRound] = useState(0); // fuerza remontar al reiniciar el nivel
  const correctRef = useRef(0);
  const missedRef = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phonicsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = activities[index];

  // Locutar el enunciado (y el sonido de la letra en fonética) al entrar.
  useEffect(() => {
    if (!current) return;
    missedRef.current = false;
    speak(current.prompt);
    if (current.payload.kind === 'phonics') {
      const letter = current.payload.letter;
      phonicsTimer.current = setTimeout(() => speak(letter), 1300);
      return () => {
        if (phonicsTimer.current) clearTimeout(phonicsTimer.current);
      };
    }
  }, [index, round, current, speak]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (phonicsTimer.current) clearTimeout(phonicsTimer.current);
      stop();
    },
    [stop]
  );

  const payload = current?.payload;

  let options: string[] = [];
  let correct = '';
  if (payload?.kind === 'recognition') {
    options = payload.options;
    correct = payload.target;
  } else if (payload?.kind === 'phonics') {
    options = payload.options;
    correct = payload.letter;
  } else if (payload?.kind === 'counting') {
    options = payload.options.map(String);
    correct = String(payload.count);
  }

  // Estímulo visual para contar: los emojis a contar.
  const stimulus =
    payload?.kind === 'counting'
      ? Array.from({ length: payload.count }, () => payload.emoji).join(' ')
      : null;

  const finish = () => {
    goToComplete(subject, level, correctRef.current, activities.length);
  };

  const advance = () => {
    if (index + 1 >= activities.length) finish();
    else setIndex((i) => i + 1);
  };

  const handleAttempt = (isCorrect: boolean) => {
    if (phonicsTimer.current) {
      clearTimeout(phonicsTimer.current);
      phonicsTimer.current = null;
    }

    if (isCorrect) {
      if (!missedRef.current) correctRef.current += 1;
      if (profileId && current) {
        recordActivity(profileId, subject, current.id);
      }
      success();
      playCorrect();
      speak('¡Muy bien!');
      advanceTimer.current = setTimeout(advance, ADVANCE_DELAY_MS);
    } else {
      missedRef.current = true;
      warning();
      playWrong();
      const remaining = lives - 1;
      setLives(remaining);
      if (remaining <= 0) {
        setFailed(true);
        speak('¡Casi! Vamos a intentarlo otra vez');
      } else {
        speak('Inténtalo de nuevo');
      }
    }
  };

  const restart = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (phonicsTimer.current) clearTimeout(phonicsTimer.current);
    correctRef.current = 0;
    missedRef.current = false;
    setLives(LIVES_PER_LEVEL);
    setFailed(false);
    setIndex(0);
    setRound((r) => r + 1);
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
        {current && (
          <View style={styles.lives}>
            {Array.from({ length: LIVES_PER_LEVEL }).map((_, i) => (
              <Text key={i} style={styles.heart}>
                {i < lives ? '❤️' : '🤍'}
              </Text>
            ))}
          </View>
        )}
      </View>

      {current ? (
        <Animated.View
          key={`${current.id}-${round}`}
          entering={FadeIn.duration(300)}
          style={styles.stage}
        >
          {stimulus && <Text style={styles.stimulus}>{stimulus}</Text>}
          <Text style={styles.prompt}>{current.prompt}</Text>
          <MultipleChoice
            key={`${current.id}-${round}`}
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

      {failed && (
        <View style={styles.overlay}>
          <View style={styles.failCard}>
            <Text style={styles.failTitle}>¡Casi!</Text>
            <Text style={styles.failMsg}>
              Se acabaron los intentos.{'\n'}¿Lo intentamos otra vez?
            </Text>
            <CartoonButton
              label="Volver a intentar"
              color="greenAccent"
              onPress={restart}
            />
            <CartoonButton label="Salir" color="silver" onPress={() => router.back()} />
          </View>
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
  stimulus: {
    fontSize: 40,
    lineHeight: 52,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  lives: {
    flexDirection: 'row',
    gap: 2,
  },
  heart: {
    fontSize: 18,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  failCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 360,
  },
  failTitle: {
    fontSize: 36,
    fontFamily: THEME.fonts.titleExtraBold,
    color: THEME.colors.primary,
  },
  failMsg: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: THEME.fonts.bodyBold,
    color: THEME.colors.text.secondary,
  },
});
