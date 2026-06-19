import type { Subject } from '@appTypes/activity';
import { THEME } from '@constants/theme';
import {
  getImplementedLevels,
  getLevelLabel,
  getTotalLevels,
} from '@features/activities/registry';
import { LevelCard, type LevelState } from '@shared/ui/LevelCard';
import { BackArrowIcon } from '@shared/ui/icons/BackArrowIcon';
import { OutlinedRainbowText } from '@shared/ui/OutlinedRainbowText';
import { PressableBounce } from '@shared/ui/PressableBounce';
import { useChildThemeStore } from '@stores/useChildThemeStore';
import { useProfilesStore } from '@stores/useProfilesStore';
import { useProgressStore } from '@stores/useProgressStore';
import { goToPlay } from '@utils/nav';
import { router } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';

interface LevelSelectScreenProps {
  subject: Subject;
}

export function LevelSelectScreen({ subject }: LevelSelectScreenProps) {
  const childType = useChildThemeStore((s) => s.childType);
  const profileId = useProfilesStore((s) => s.activeProfileId) ?? 'default';
  const currentLevel = useProgressStore(
    (s) => s.getSubjectProgress(profileId, subject).currentLevel
  );
  const getLevelStars = useProgressStore((s) => s.getLevelStars);

  const total = getTotalLevels(subject);
  const implemented = getImplementedLevels(subject);
  const levels = Array.from({ length: total }, (_, i) => i + 1);

  const background =
    childType === 'girl'
      ? require('@assets/images/backgrounds/bg-letters-menu-girl.webp')
      : require('@assets/images/backgrounds/bg-letters-menu-boy.webp');

  const stateFor = (level: number): LevelState => {
    if (level > currentLevel) return 'locked';
    if (level > implemented) return 'soon';
    return 'available';
  };

  return (
    <ImageBackground source={background} style={styles.bg} resizeMode="cover">
      <View style={styles.header}>
        <PressableBounce onPress={() => router.back()} hitSlop={8}>
          <BackArrowIcon size={36} />
        </PressableBounce>
      </View>
      <OutlinedRainbowText
        text="Elige un nivel"
        accent={childType === 'boy'}
        textStyle={styles.title}
      />
      <ScrollView contentContainerStyle={styles.grid}>
        {levels.map((level) => (
          <LevelCard
            key={level}
            level={level}
            label={getLevelLabel(subject, level)}
            stars={getLevelStars(profileId, subject, level)}
            state={stateFor(level)}
            onPress={() => goToPlay(subject, level)}
          />
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  header: {
    marginTop: 32,
    padding: 16,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: THEME.fonts.titleExtraBold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
});
