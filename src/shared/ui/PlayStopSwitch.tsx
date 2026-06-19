import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import type { PlayStopSwitchColors, PlayStopSwitchProps } from './types';

const DEFAULTS: PlayStopSwitchColors = {
  trackActive: '#4ade80',
  trackInactive: '#f87171',
  thumb: '#ffffff',
  thumbBorder: '#00000022',
  trackBorder: '#00000033',
  icon: '#333333',
};

function PlayIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 4.75a.75.75 0 0 1 1.14-.64l13 7.25a.75.75 0 0 1 0 1.28l-13 7.25A.75.75 0 0 1 6 19.25V4.75z"
        fill={color}
      />
    </Svg>
  );
}

function StopIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="5" y="5" width="14" height="14" rx="2" fill={color} />
    </Svg>
  );
}

export function PlayStopSwitch({
  isPlaying,
  onToggle,
  colors = {},
  size = 1,
}: PlayStopSwitchProps) {
  const c: PlayStopSwitchColors = { ...DEFAULTS, ...colors };

  const TRACK_W = 80 * size;
  const TRACK_H = 44 * size;
  const THUMB_SIZE = 34 * size;
  const RADIUS = TRACK_H / 2;
  const PADDING = (TRACK_H - THUMB_SIZE) / 2;
  const TRAVEL = TRACK_W - THUMB_SIZE - PADDING * 2;
  const ICON_SIZE = 16 * size;

  const progress = useSharedValue(isPlaying ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isPlaying ? 1 : 0, { damping: 48, stiffness: 300 });
  }, [isPlaying]);

  const thumbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL }],
  }));

  const trackAnim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [c.trackInactive, c.trackActive]
    ),
  }));

  return (
    <Pressable onPress={onToggle} hitSlop={8}>
      <Animated.View
        style={[
          {
            width: TRACK_W,
            height: TRACK_H,
            borderRadius: RADIUS,
            borderWidth: 2 * size,
            borderColor: c.trackBorder,
            padding: PADDING,
            justifyContent: 'center',
            overflow: 'hidden',
          },
          trackAnim,
        ]}
      >
        {/* Top highlight */}
        <View
          style={{
            position: 'absolute',
            top: 4 * size,
            left: '15%',
            right: '15%',
            height: TRACK_H * 0.18,
            borderRadius: TRACK_H * 0.12,
            backgroundColor: '#ffffff',
            opacity: 0.35,
          }}
        />

        <View
          style={{
            width: '150%',
            position: 'absolute',
            bottom: 0,
            height: TRACK_H * 0.18,
            backgroundColor: '#000',
            opacity: 0.1,
          }}
        />

        {/* Thumb */}
        <Animated.View
          style={[
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: c.thumb,
              borderWidth: 1.5 * size,
              borderColor: c.thumbBorder,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 * size },
              shadowOpacity: 0.18,
              shadowRadius: 3 * size,
              elevation: 4,
            },
            thumbAnim,
          ]}
        >
          {isPlaying
            ? <StopIcon color={c.icon} size={ICON_SIZE} />
            : <PlayIcon color={c.icon} size={ICON_SIZE} />
          }
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
