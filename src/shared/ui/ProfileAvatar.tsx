import type { ChildType } from '@appTypes/progress';
import { CARTOON_BUTTON_THEMES } from '@constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

// Avatar circular con emoji. Color de fondo según niño/niña; borde verde si
// está seleccionado (en el grid de creación de perfil).

interface ProfileAvatarProps {
  emoji: string;
  size?: number;
  childType?: ChildType;
  selected?: boolean;
}

export function ProfileAvatar({
  emoji,
  size = 80,
  childType = 'girl',
  selected = false,
}: ProfileAvatarProps) {
  const theme =
    childType === 'girl' ? CARTOON_BUTTON_THEMES.pink : CARTOON_BUTTON_THEMES.blue;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.bg,
          borderColor: selected ? CARTOON_BUTTON_THEMES.greenAccent.bg : theme.border,
          borderWidth: selected ? 4 : 3,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
