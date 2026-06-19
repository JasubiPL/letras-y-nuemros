import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { PressableBounceProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableBounce({ children, onPress, style, ...props }: PressableBounceProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPressIn={() => { scale.value = withSpring(0.93, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 20, stiffness: 350 }); }}
      onPress={onPress}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
