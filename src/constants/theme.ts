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
    pastel: {
      pink: '#FFB3C6',
      peach: '#FFCBA4',
      yellow: '#FFF0A0',
      mint: '#B5EAD7',
      sky: '#AED9F7',
      lavender: '#C9B8F5',
      coral: '#FFADAD',
      lilac: '#DDB8F5',
    },
  },
  fonts: {
    // Baloo 2 — títulos, botones, elementos destacados
    title: 'Baloo2_400Regular',
    titleMedium: 'Baloo2_500Medium',
    titleSemiBold: 'Baloo2_600SemiBold',
    titleBold: 'Baloo2_700Bold',
    titleExtraBold: 'Baloo2_800ExtraBold',
    // Nunito — texto de cuerpo, instrucciones, labels
    body: 'Nunito_400Regular',
    bodySemiBold: 'Nunito_600SemiBold',
    bodyBold: 'Nunito_700Bold',
  },
  typography: {
    heading: {
      fontFamily: 'Baloo2_800ExtraBold',
      fontSize: 28,
    },
    body: {
      fontFamily: 'Nunito_400Regular',
      fontSize: 18,
    },
    button: {
      fontFamily: 'Baloo2_700Bold',
      fontSize: 20,
    },
    label: {
      fontFamily: 'Nunito_600SemiBold',
      fontSize: 14,
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
