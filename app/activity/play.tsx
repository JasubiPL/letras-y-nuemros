import type { Subject } from '@appTypes/activity';
import { getLevelActivities } from '@features/activities/registry';
import { ActivityRunner } from '@features/activities/screens/ActivityRunner';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

export default function PlayScreen() {
  const params = useLocalSearchParams<{ subject: Subject; level: string }>();
  const subject = (params.subject ?? 'letters') as Subject;
  const level = Number(params.level ?? '1');

  const activities = useMemo(
    () => getLevelActivities(subject, level),
    [subject, level]
  );

  return <ActivityRunner subject={subject} level={level} activities={activities} />;
}
