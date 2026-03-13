import { StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text, View } from '@components/Themed';
import { THEME } from '@constants/theme';
import { useProgressStore } from '@stores/useProgressStore';

export default function HomeScreen() {
  const letters = useProgressStore((s) => s.letters);
  const numbers = useProgressStore((s) => s.numbers);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100).duration(600)}>
        <Text style={styles.title}>Números y Letras</Text>
        <Text style={styles.subtitle}>¿Qué quieres aprender hoy?</Text>
      </Animated.View>

      <View style={styles.cardsContainer}>
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Pressable
            style={[styles.card, { backgroundColor: THEME.colors.primary }]}
            onPress={() => router.push('/activity/letters' as any)}>
            <Text style={styles.cardEmoji}>🔤</Text>
            <Text style={styles.cardTitle}>Letras</Text>
            <Text style={styles.cardLevel}>Nivel {letters.currentLevel}</Text>
            <Text style={styles.cardStars}>⭐ {letters.totalStars}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <Pressable
            style={[styles.card, { backgroundColor: THEME.colors.secondary }]}
            onPress={() => router.push('/activity/numbers' as any)}>
            <Text style={styles.cardEmoji}>🔢</Text>
            <Text style={styles.cardTitle}>Números</Text>
            <Text style={styles.cardLevel}>Nivel {numbers.currentLevel}</Text>
            <Text style={styles.cardStars}>⭐ {numbers.totalStars}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: THEME.spacing.xxl,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.lg,
    backgroundColor: 'transparent',
  },
  card: {
    width: 150,
    height: 200,
    borderRadius: THEME.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.md,
    ...THEME.shadows.card,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: THEME.spacing.sm,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: THEME.spacing.xs,
  },
  cardLevel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  cardStars: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: THEME.spacing.xs,
  },
});
