import { useEffect, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeIn, useAnimatedStyle } from 'react-native-reanimated';
import * as Speech from 'expo-speech';

import { Text, View } from '@components/Themed';
import { THEME } from '@constants/theme';
import { getLetterActivities, getNumberActivities } from '@constants/curriculum';
import { useProgressStore } from '@stores/useProgressStore';
import { useActivityStore } from '@stores/useActivityStore';
import { useSettingsStore } from '@stores/useSettingsStore';
import { useBounce } from '@hooks/useAnimation';
import { useHaptics } from '@hooks/useHaptics';
import type { Activity, Subject, LetterRecognitionData, CountingData } from '@appTypes/activity';

export default function ActivityScreen() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const subject = activityId as Subject;

  const progress = useProgressStore((s) => s[subject]);
  const completeActivityProgress = useProgressStore((s) => s.completeActivity);
  const { startActivity, answerCorrect, answerWrong, correctAnswers, totalQuestions } =
    useActivityStore();
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);

  const haptics = useHaptics();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentActivity = activities[currentIndex];

  useEffect(() => {
    const acts =
      subject === 'letters'
        ? getLetterActivities(progress.currentLevel)
        : getNumberActivities(progress.currentLevel);
    setActivities(acts);
    if (acts.length > 0) {
      startActivity(acts[0]);
    }
  }, [subject, progress.currentLevel]);

  useEffect(() => {
    if (currentActivity?.instruction) {
      Speech.speak(currentActivity.instruction, { language: 'es-ES', rate: 0.8 });
    }
  }, [currentActivity?.id]);

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const data = currentActivity.data as LetterRecognitionData | CountingData;
    const target = 'target' in data ? data.target : String((data as CountingData).count);
    const correct = option === target;

    setIsCorrect(correct);

    if (correct) {
      answerCorrect();
      if (hapticsEnabled) haptics.success();
      Speech.speak('¡Muy bien!', { language: 'es-ES' });
    } else {
      answerWrong();
      if (hapticsEnabled) haptics.error();
      Speech.speak('Inténtalo de nuevo', { language: 'es-ES' });
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);

      if (currentIndex < activities.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // Activity set complete
        const total = totalQuestions + 1;
        const correct = correctAnswers + (correct ? 1 : 0);
        const ratio = total > 0 ? correct / total : 0;
        const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;

        completeActivityProgress(subject, `${subject}-level-${progress.currentLevel}`, stars);
        router.replace('/activity/complete' as any);
      }
    }, 1500);
  };

  if (!currentActivity) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const data = currentActivity.data as LetterRecognitionData & CountingData;
  const options = data.options ?? generateCountingOptions(data.count, data.maxOption);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>✕</Text>
        </Pressable>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {activities.length}
        </Text>
      </View>

      <Animated.View entering={FadeIn.duration(400)} key={currentActivity.id}>
        <Text style={styles.instruction}>{currentActivity.instruction}</Text>

        {data.emoji && (
          <Text style={styles.emojiRow}>
            {Array.from({ length: data.count }, () => data.emoji).join(' ')}
          </Text>
        )}

        {data.target && !data.emoji && (
          <Text style={styles.targetDisplay}>{data.target}</Text>
        )}

        <View style={styles.optionsGrid}>
          {options.map((option: string, i: number) => (
            <OptionButton
              key={`${currentActivity.id}-${i}`}
              label={option}
              onPress={() => handleSelect(option)}
              state={
                selectedOption === null
                  ? 'default'
                  : option === selectedOption
                    ? isCorrect
                      ? 'correct'
                      : 'wrong'
                    : 'default'
              }
              disabled={selectedOption !== null}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function generateCountingOptions(count: number, max: number): string[] {
  const options = new Set<number>([count]);
  while (options.size < 4) {
    const n = Math.floor(Math.random() * max) + 1;
    if (n !== count) options.add(n);
  }
  return [...options].sort(() => Math.random() - 0.5).map(String);
}

function OptionButton({
  label,
  onPress,
  state,
  disabled,
}: {
  label: string;
  onPress: () => void;
  state: 'default' | 'correct' | 'wrong';
  disabled: boolean;
}) {
  const { animatedStyle, bounce } = useBounce();

  const bgColor =
    state === 'correct'
      ? THEME.colors.success
      : state === 'wrong'
        ? THEME.colors.error
        : THEME.colors.surface;

  return (
    <Pressable
      onPress={() => {
        bounce();
        onPress();
      }}
      disabled={disabled}>
      <Animated.View
        style={[
          styles.optionButton,
          { backgroundColor: bgColor },
          animatedStyle,
        ]}>
        <Text
          style={[
            styles.optionText,
            state !== 'default' && { color: '#FFFFFF' },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 16,
    opacity: 0.6,
  },
  instruction: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  emojiRow: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  targetDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: THEME.spacing.md,
    backgroundColor: 'transparent',
  },
  optionButton: {
    width: 140,
    height: 80,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.card,
  },
  optionText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
