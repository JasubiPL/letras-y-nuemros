import { CARTOON_BUTTON_THEMES } from '@constants/Colors';
import { THEME } from '@constants/theme';
import type { CartoonColor } from '@shared/ui/types';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Tarjeta de opción para MultipleChoice. Estados visuales: normal, correcta
// (verde + ✓, rebote) e incorrecta (rojo + ✗, sacudida).

export type OptionStatus = 'idle' | 'correct' | 'wrong';

interface OptionCardProps {
  label: string;
  status: OptionStatus;
  color?: CartoonColor;
  disabled?: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OptionCard({
  label,
  status,
  color = 'blue',
  disabled = false,
  onPress,
}: OptionCardProps) {
  const theme = CARTOON_BUTTON_THEMES[color];
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (status === 'correct') {
      scale.value = withSequence(withSpring(1.12), withSpring(1));
    } else if (status === 'wrong') {
      shake.value = withSequence(
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(-6, { duration: 55 }),
        withTiming(0, { duration: 55 })
      );
    }
  }, [status, scale, shake]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shake.value }],
  }));

  const bg =
    status === 'correct'
      ? CARTOON_BUTTON_THEMES.greenAccent.bg
      : status === 'wrong'
        ? CARTOON_BUTTON_THEMES.redAccent.bg
        : theme.bg;

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      style={[styles.card, { backgroundColor: bg, borderColor: theme.border }, animStyle]}
    >
      <Text
        style={[styles.label, { color: status === 'idle' ? theme.text : '#FFF8F8' }]}
      >
        {label}
      </Text>
      {status === 'correct' && <Text style={styles.badge}>✓</Text>}
      {status === 'wrong' && <Text style={styles.badge}>✗</Text>}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 104,
    height: 104,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  label: {
    fontSize: 52,
    fontFamily: THEME.fonts.titleExtraBold,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontSize: 22,
    color: '#FFF8F8',
  },
});
