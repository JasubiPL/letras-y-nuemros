import { THEME } from './theme';

export default {
  light: {
    text: THEME.colors.text.primary,
    background: THEME.colors.background,
    tint: THEME.colors.primary,
    tabIconDefault: THEME.colors.text.light,
    tabIconSelected: THEME.colors.primary,
    wordPalette: [
      THEME.colors.primary,
      THEME.colors.secondary,
      THEME.colors.success,
      THEME.colors.accent,
      THEME.colors.pastel.lavender,
      THEME.colors.pastel.coral,
    ],
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A2E',
    tint: THEME.colors.secondary,
    tabIconDefault: '#636E72',
    tabIconSelected: THEME.colors.secondary,
    wordPalette: [
      THEME.colors.pastel.coral,
      THEME.colors.secondary,
      THEME.colors.accent,
      THEME.colors.success,
      THEME.colors.pastel.sky,
      THEME.colors.pastel.lilac,
    ],
  },
};
