import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { BackArrowIconProps } from '../types';

export function BackArrowIcon({
  size = 28,
  color = '#FFF8F8',
  strokeColor = '#2A2A2A',
}: BackArrowIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.9 4.9L8.2 11.6C7.98 11.82 7.98 12.18 8.2 12.4L14.9 19.1C15.14 19.34 15.54 19.34 15.78 19.1L16.9 17.98C17.14 17.74 17.14 17.34 16.9 17.1L13.3 13.5H19.6C19.95 13.5 20.25 13.2 20.25 12.85V11.15C20.25 10.8 19.95 10.5 19.6 10.5H13.3L16.9 6.9C17.14 6.66 17.14 6.26 16.9 6.02L15.78 4.9C15.54 4.66 15.14 4.66 14.9 4.9Z"
        fill={color}
        stroke={strokeColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
