import { StyleSheet } from 'react-native';

import { Text, View } from '@components/Themed';
import { THEME } from '@constants/theme';
import { useProgressStore } from '@stores/useProgressStore';

export default function ProgressScreen() {
  const letters = useProgressStore((s) => s.letters);
  const numbers = useProgressStore((s) => s.numbers);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Progreso</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔤 Letras</Text>
        <View style={styles.statsRow}>
          <StatCard label="Nivel" value={String(letters.currentLevel)} />
          <StatCard label="Estrellas" value={`⭐ ${letters.totalStars}`} />
          <StatCard label="Completadas" value={String(letters.completedActivities.length)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔢 Números</Text>
        <View style={styles.statsRow}>
          <StatCard label="Nivel" value={String(numbers.currentLevel)} />
          <StatCard label="Estrellas" value={`⭐ ${numbers.totalStars}`} />
          <StatCard label="Completadas" value={String(numbers.completedActivities.length)} />
        </View>
      </View>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xl,
  },
  section: {
    marginBottom: THEME.spacing.xl,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: THEME.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    backgroundColor: 'transparent',
  },
  statCard: {
    flex: 1,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    ...THEME.shadows.card,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
});
