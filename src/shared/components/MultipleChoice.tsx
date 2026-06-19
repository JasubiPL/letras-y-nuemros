import type { CartoonColor } from '@shared/ui/types';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { OptionCard, type OptionStatus } from './OptionCard';

// Mecánica base: elegir la opción correcta entre 2-4 tarjetas grandes.
// Reporta cada intento por `onAttempt`; al acertar se bloquea. El padre
// (ActivityRunner) da el feedback (voz/sonido/háptica) y avanza.
// Se reinicia entre actividades remontándolo con `key={activity.id}`.

interface MultipleChoiceProps {
  options: string[];
  correct: string;
  colors?: CartoonColor[];
  onAttempt: (isCorrect: boolean) => void;
}

const DEFAULT_COLORS: CartoonColor[] = ['blue', 'purple', 'orange', 'pink'];
const WRONG_RESET_MS = 700;

export function MultipleChoice({
  options,
  correct,
  colors = DEFAULT_COLORS,
  onAttempt,
}: MultipleChoiceProps) {
  const [statuses, setStatuses] = useState<Record<string, OptionStatus>>({});
  const [solved, setSolved] = useState(false);

  const handlePress = (option: string) => {
    if (solved) return;

    if (option === correct) {
      setStatuses((s) => ({ ...s, [option]: 'correct' }));
      setSolved(true);
      onAttempt(true);
    } else {
      setStatuses((s) => ({ ...s, [option]: 'wrong' }));
      onAttempt(false);
      setTimeout(() => {
        setStatuses((s) => ({ ...s, [option]: 'idle' }));
      }, WRONG_RESET_MS);
    }
  };

  return (
    <View style={styles.row}>
      {options.map((option, i) => (
        <OptionCard
          key={option}
          label={option}
          status={statuses[option] ?? 'idle'}
          color={colors[i % colors.length]}
          disabled={solved}
          onPress={() => handlePress(option)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
