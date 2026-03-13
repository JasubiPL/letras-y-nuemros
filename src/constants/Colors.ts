import { THEME } from './theme';

export default {
  light: {
    text: THEME.colors.text.primary,
    background: THEME.colors.background,
    tint: THEME.colors.primary,
    tabIconDefault: THEME.colors.text.light,
    tabIconSelected: THEME.colors.primary,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A2E',
    tint: THEME.colors.secondary,
    tabIconDefault: '#636E72',
    tabIconSelected: THEME.colors.secondary,
  },
};
