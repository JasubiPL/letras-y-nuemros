import { AVATARS } from '@features/profiles/data/avatars';
import { THEME } from '@constants/theme';
import { useSound } from '@hooks/useSound';
import { CartoonButton } from '@shared/ui/CartoonButton';
import { BackArrowIcon } from '@shared/ui/icons/BackArrowIcon';
import { OutlinedRainbowText } from '@shared/ui/OutlinedRainbowText';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { PressableBounce } from '@shared/ui/PressableBounce';
import { useChildThemeStore } from '@stores/useChildThemeStore';
import { useProfilesStore } from '@stores/useProfilesStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Crear un perfil: nombre + niño/niña + avatar de un set fijo.
export default function ProfileSetupScreen() {
  const router = useRouter();
  const { playTap } = useSound();
  const addProfile = useProfilesStore((s) => s.addProfile);
  const setActiveProfile = useProfilesStore((s) => s.setActiveProfile);
  const setChildType = useChildThemeStore((s) => s.setChildType);

  const [name, setName] = useState('');
  const [childType, setLocalChild] = useState<'girl' | 'boy'>('girl');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const canCreate = name.trim().length > 0;

  const create = () => {
    if (!canCreate) return;
    playTap();
    const profile = addProfile({ name, childType, avatar });
    setActiveProfile(profile.id);
    setChildType(childType);
    router.replace('/(tabs)/menu');
  };

  return (
    <ImageBackground
      source={require('@assets/images/backgrounds/bg-select-child.webp')}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <PressableBounce
            onPress={() => {
              playTap();
              router.back();
            }}
            hitSlop={8}
          >
            <BackArrowIcon size={32} />
          </PressableBounce>
        </View>

        <OutlinedRainbowText text="Crea tu perfil" textStyle={styles.title} />

        <ProfileAvatar emoji={avatar} childType={childType} size={96} />

        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          placeholderTextColor="#9AA5B1"
          value={name}
          onChangeText={setName}
          maxLength={14}
          textAlign="center"
        />

        <View style={styles.toggleRow}>
          <PressableBounce
            style={[styles.toggle, childType === 'girl' && styles.toggleActive]}
            onPress={() => {
              playTap();
              setLocalChild('girl');
            }}
          >
            <Text style={styles.toggleText}>Niña</Text>
          </PressableBounce>
          <PressableBounce
            style={[styles.toggle, childType === 'boy' && styles.toggleActive]}
            onPress={() => {
              playTap();
              setLocalChild('boy');
            }}
          >
            <Text style={styles.toggleText}>Niño</Text>
          </PressableBounce>
        </View>

        <View style={styles.avatarGrid}>
          {AVATARS.map((a) => (
            <PressableBounce
              key={a}
              onPress={() => {
                playTap();
                setAvatar(a);
              }}
            >
              <ProfileAvatar emoji={a} childType={childType} size={56} selected={a === avatar} />
            </PressableBounce>
          ))}
        </View>

        <CartoonButton
          label="Crear"
          color="greenAccent"
          disabled={!canCreate}
          onPress={create}
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 20,
  },
  header: {
    width: '100%',
    marginTop: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 34,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
  },
  input: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#2A2A2A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 22,
    fontFamily: THEME.fonts.titleBold,
    color: THEME.colors.text.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggle: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#2A2A2A',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  toggleActive: {
    backgroundColor: THEME.colors.accent,
  },
  toggleText: {
    fontSize: 20,
    fontFamily: THEME.fonts.titleBold,
    color: '#2A2A2A',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
});
