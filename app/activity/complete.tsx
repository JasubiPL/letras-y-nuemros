import { StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp, BounceIn } from 'react-native-reanimated';

import { Text, View } from '@components/Themed';
import { THEME } from '@constants/theme';
import { useActivityStore } from '@stores/useActivityStore';

export default function CompleteScreen() {
  const { correctAnswers, totalQuestions, resetActivity } = useActivityStore();

  const ratio = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
  const starsDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

  const message =
    stars === 3
      ? '¡Perfecto! 🎉'
      : stars === 2
        ? '¡Muy bien! 👏'
        : '¡Buen intento! 💪';

  const handleContinue = () => {
    resetActivity();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={BounceIn.delay(200).duration(800)}>
        <Text style={styles.stars}>{starsDisplay}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).duration(600)}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.score}>
          {correctAnswers} de {totalQuestions} correctas
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(1000).duration(600)}>
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xl,
  },
  stars: {
    fontSize: 64,
    marginBottom: THEME.spacing.xl,
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  score: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: THEME.spacing.xxl,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xxl,
    borderRadius: THEME.borderRadius.lg,
    ...THEME.shadows.card,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
