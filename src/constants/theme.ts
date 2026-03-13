export const THEME = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    success: '#51CF66',
    error: '#FF6B6B',
    background: '#FFF9EC',
    surface: '#FFFFFF',
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
      light: '#B2BEC3',
    },
  },
  typography: {
    heading: {
      fontFamily: 'Quicksand-Bold',
      fontSize: 28,
    },
    body: {
      fontFamily: 'Quicksand-Regular',
      fontSize: 18,
    },
    button: {
      fontFamily: 'Quicksand-SemiBold',
      fontSize: 20,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
} as const;
