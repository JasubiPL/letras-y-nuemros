import { StyleSheet, Switch, Pressable, Alert } from 'react-native';

import { Text, View } from '@components/Themed';
import { THEME } from '@constants/theme';
import { useSettingsStore } from '@stores/useSettingsStore';
import { useProgressStore } from '@stores/useProgressStore';

export default function SettingsScreen() {
  const { musicEnabled, hapticsEnabled, toggleMusic, toggleHaptics } = useSettingsStore();
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const handleReset = () => {
    Alert.alert(
      'Reiniciar Progreso',
      '¿Estás seguro? Se perderá todo el progreso.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', style: 'destructive', onPress: resetProgress },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>🎵 Música</Text>
        <Switch value={musicEnabled} onValueChange={toggleMusic} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>📳 Vibración</Text>
        <Switch value={hapticsEnabled} onValueChange={toggleHaptics} />
      </View>

      <View style={styles.divider} />

      <Pressable style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reiniciar Progreso</Text>
      </Pressable>
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    backgroundColor: 'transparent',
  },
  settingLabel: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: THEME.spacing.lg,
  },
  resetButton: {
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.error,
    alignItems: 'center',
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
