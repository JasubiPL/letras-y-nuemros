import { CARTOON_BUTTON_THEMES } from '@constants/Colors';
import { THEME } from '@constants/theme';
import { PressableBounce } from '@shared/ui/PressableBounce';
import { StyleSheet, Text, View } from 'react-native';

// Tarjeta de nivel para el selector. Tres estados:
// - available: jugable.
// - locked: aún no desbloqueado (candado).
// - soon: desbloqueado pero sin contenido todavía (Fase 1 = niveles 4-10).

export type LevelState = 'available' | 'locked' | 'soon';

interface LevelCardProps {
  level: number;
  label: string;
  stars: number; // 0..3
  state: LevelState;
  onPress: () => void;
}

export function LevelCard({ level, label, stars, state, onPress }: LevelCardProps) {
  const locked = state !== 'available';
  const theme =
    state === 'available'
      ? CARTOON_BUTTON_THEMES.greenAccent
      : CARTOON_BUTTON_THEMES.silver;

  return (
    <PressableBounce
      onPress={locked ? undefined : onPress}
      disabled={locked}
      style={[
        styles.card,
        { backgroundColor: theme.bg, borderColor: theme.border, opacity: locked ? 0.65 : 1 },
      ]}
    >
      <View style={[styles.badge, { backgroundColor: theme.highlight }]}>
        <Text style={styles.badgeText}>{state === 'locked' ? '🔒' : level}</Text>
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      {state === 'soon' ? (
        <Text style={styles.soon}>Pronto</Text>
      ) : (
        <Text style={styles.stars}>
          {'★'.repeat(stars)}
          <Text style={styles.starsEmpty}>{'★'.repeat(3 - stars)}</Text>
        </Text>
      )}
    </PressableBounce>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    borderRadius: 20,
    borderWidth: 3,
    padding: 14,
    margin: 8,
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 24,
    fontFamily: THEME.fonts.titleExtraBold,
    color: '#2A2A2A',
  },
  label: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: THEME.fonts.bodyBold,
    color: '#2A2A2A',
    minHeight: 38,
  },
  stars: {
    fontSize: 20,
    color: THEME.colors.accent,
  },
  starsEmpty: {
    color: 'rgba(0,0,0,0.18)',
  },
  soon: {
    fontSize: 13,
    fontFamily: THEME.fonts.bodyBold,
    color: '#636E72',
  },
});
