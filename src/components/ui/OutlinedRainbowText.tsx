import Colors from '@constants/Colors';
import { useColorScheme } from '@components/useColorScheme';
import { useState } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

type SegmentMode = 'auto' | 'words' | 'letters';

type OutlinedRainbowTextProps = {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  palette?: readonly string[];
  segmentMode?: SegmentMode;
  outerOutlineColor?: string;
  innerOutlineColor?: string;
  outerOutlineSize?: number;
  innerOutlineSize?: number;
};

type Offset = { x: number; y: number };

const buildOutlineOffsets = (size: number): Offset[] => {
  const roundedSize = Math.max(1, Math.round(size));
  const diagonalSize = Math.max(1, roundedSize - 1);

  return [
    { x: -roundedSize, y: 0 },
    { x: roundedSize, y: 0 },
    { x: 0, y: -roundedSize },
    { x: 0, y: roundedSize },
    { x: -diagonalSize, y: -diagonalSize },
    { x: -diagonalSize, y: diagonalSize },
    { x: diagonalSize, y: -diagonalSize },
    { x: diagonalSize, y: diagonalSize },
  ];
};

const getSegments = (text: string, mode: SegmentMode) => {
  const resolvedMode = mode === 'auto' ? (text.includes(' ') ? 'words' : 'letters') : mode;

  if (resolvedMode === 'letters') {
    return Array.from(text).map((part) => ({
      value: part,
      colorize: !/^\s+$/.test(part),
    }));
  }

  return text.split(/(\s+)/).filter(Boolean).map((part) => ({
    value: part,
    colorize: !/^\s+$/.test(part),
  }));
};

const shufflePalette = (palette: readonly string[], seed: number) => {
  const result = [...palette];
  let state = seed || 1;

  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }

  return result;
};

export function OutlinedRainbowText({
  text,
  textStyle,
  containerStyle,
  palette,
  segmentMode = 'auto',
  outerOutlineColor = '#FFFFFF',
  innerOutlineColor = '#000000',
  outerOutlineSize = 4,
  innerOutlineSize = 2,
}: OutlinedRainbowTextProps) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const activePalette = palette ?? themeColors.wordPalette;
  const [paletteSeed] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const mixedPalette = activePalette.length > 0 ? shufflePalette(activePalette, paletteSeed) : ['#FFFFFF'];
  const segments = getSegments(text, segmentMode);
  const outerOffsets = buildOutlineOffsets(outerOutlineSize);
  const innerOffsets = buildOutlineOffsets(innerOutlineSize);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {outerOffsets.map((offset, index) => (
        <Text
          key={`outer-outline-${index}`}
          style={[
            textStyle,
            styles.outline,
            { color: outerOutlineColor, left: offset.x, top: offset.y },
          ]}
        >
          {text}
        </Text>
      ))}

      {innerOffsets.map((offset, index) => (
        <Text
          key={`inner-outline-${index}`}
          style={[
            textStyle,
            styles.outline,
            { color: innerOutlineColor, left: offset.x, top: offset.y },
          ]}
        >
          {text}
        </Text>
      ))}

      <Text style={[textStyle, styles.balloonShade]}>{text}</Text>
      <Text style={[textStyle, styles.balloonHighlight]}>{text}</Text>

      <Text style={[textStyle, styles.balloonMain]}>
        {segments.map((segment, index) => {
          if (!segment.colorize) {
            return <Text key={`segment-space-${index}`}>{segment.value}</Text>;
          }

          const color = mixedPalette[index % mixedPalette.length];
          return (
            <Text key={`segment-color-${index}`} style={{ color }}>
              {segment.value}
            </Text>
          );
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  outline: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  balloonShade: {
    position: 'absolute',
    left: 1,
    top: 2,
    color: 'rgba(0,0,0,0.24)',
  },
  balloonHighlight: {
    position: 'absolute',
    left: -1,
    top: -1,
    color: 'rgba(255,255,255,0.72)',
  },
  balloonMain: {
    textShadowColor: 'rgba(255, 255, 255, 0.45)',
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 6,
  },
});
