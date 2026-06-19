import type { Subject } from '@appTypes/activity';
import { router, type Href } from 'expo-router';

// Helpers de navegación hacia las pantallas de actividad.
//
// Los `as unknown as Href` son un workaround acotado: con `typedRoutes`
// activo, los tipos de rutas (.expo/types) se regeneran al arrancar Metro
// (`expo start`) y aún no incluyen `/activity/*` en este chequeo estático.
// Las rutas existen como ficheros, así que el cast es seguro; centralizarlo
// aquí mantiene las pantallas limpias y deja un único punto a revisar.

export function goToPlay(subject: Subject, level: number): void {
  router.push({
    pathname: '/activity/play',
    params: { subject, level: String(level) },
  } as unknown as Href);
}

export function replayLevel(subject: Subject, level: number): void {
  router.replace({
    pathname: '/activity/play',
    params: { subject, level: String(level) },
  } as unknown as Href);
}

export function goToComplete(
  subject: Subject,
  level: number,
  correct: number,
  total: number
): void {
  router.replace({
    pathname: '/activity/complete',
    params: {
      subject,
      level: String(level),
      correct: String(correct),
      total: String(total),
    },
  } as unknown as Href);
}
