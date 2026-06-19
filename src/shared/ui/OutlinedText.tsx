import { Text, View } from 'react-native';
import type { OutlinedProps } from './types';

const OFFSETS = (s: number) => {
  const d = Math.max(1, s - 1);
  return [
    { x: -s, y:  0 }, { x:  s, y:  0 },
    { x:  0, y: -s }, { x:  0, y:  s },
    { x: -d, y: -d }, { x: -d, y:  d },
    { x:  d, y: -d }, { x:  d, y:  d },
  ];
};

export function OutlinedText({
  text,
  textStyle,
  svgRenderer,
  color = '#ffffff',
  outlineColor = '#000000',
  outlineSize = 2,
  containerStyle,
}: OutlinedProps) {
  const offsets = OFFSETS(outlineSize);

  if (svgRenderer) {
    return (
      <View style={[{ position: 'relative', alignSelf: 'flex-start' }, containerStyle]}>
        {offsets.map((o, i) => (
          <View key={i} style={{ position: 'absolute', left: o.x, top: o.y }}>
            {svgRenderer(outlineColor)}
          </View>
        ))}
        <View>{svgRenderer(color)}</View>
      </View>
    );
  }

  if (text) {
    return (
      <View style={[{ position: 'relative', alignSelf: 'flex-start' }, containerStyle]}>
        {offsets.map((o, i) => (
          <Text
            key={i}
            style={[textStyle, { position: 'absolute', left: o.x, top: o.y, color: outlineColor }]}
          >
            {text}
          </Text>
        ))}
        <Text style={[textStyle, { color }]}>{text}</Text>
      </View>
    );
  }

  return null;
}
