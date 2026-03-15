import type { ReactNode } from 'react';
import type {
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type CartoonColor =
  | 'pink'
  | 'pinkAccent'
  | 'purple'
  | 'purpleAccent'
  | 'red'
  | 'redAccent'
  | 'brown'
  | 'brownAccent'
  | 'blue'
  | 'blueAccent'
  | 'yellow'
  | 'yellowAccent'
  | 'green'
  | 'greenAccent'
  | 'orange'
  | 'orangeAccent'
  | 'gold'
  | 'silver'
  | 'diamond';

export interface CartoonButtonTheme {
  bg: string;
  shadow: string;
  highlight: string;
  border: string;
  text: string;
}

export interface CartoonButtonProps {
  label: string;
  icon?: ReactNode;
  iconAbsolute?: boolean;
  iconContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  color?: CartoonColor;
  width?: number;
  height?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

export type SegmentMode = 'auto' | 'words' | 'letters';

export type OutlinedRainbowTextProps = {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  palette?: readonly string[];
  accent?: boolean;
  acent?: boolean;
  segmentMode?: SegmentMode;
  outerOutlineColor?: string;
  innerOutlineColor?: string;
  outerOutlineSize?: number;
  innerOutlineSize?: number;
};

export type Offset = { x: number; y: number };

export type BackArrowIconProps = {
  size?: number;
  color?: string;
  strokeColor?: string;
};

export type PressableBounceProps = PressableProps & {
  children: ReactNode;
};

export type ButtonRectangleGlossSize = number | { width: number; height: number };

export type ButtonRectangleGlossProps = {
  color?: string;
  width?: number;
  height?: number;
  size?: ButtonRectangleGlossSize;
};

export type OutlinedProps = {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  svgRenderer?: (color: string) => ReactNode;
  color?: string;
  outlineColor?: string;
  outlineSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

export type PlayStopSwitchColors = {
  trackActive: string;
  trackInactive: string;
  thumb: string;
  thumbBorder: string;
  trackBorder: string;
  icon: string;
};

export type PlayStopSwitchProps = {
  isPlaying: boolean;
  onToggle: () => void;
  colors?: Partial<PlayStopSwitchColors>;
  size?: number;
};
