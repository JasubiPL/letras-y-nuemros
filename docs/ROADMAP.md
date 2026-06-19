# Plan de Trabajo por Fases — Números y Letras

> Plan de ejecución detallado. Complementa [`TECH_SPEC.md`](TECH_SPEC.md) (el *qué* y *por qué*); este documento es el *cómo* y *en qué orden*.
> Cada fase deja la app **ejecutable** y, a partir de la Fase 1, **jugable**.

**Convención de commits**: Conventional Commits en inglés (`feat:`, `fix:`, `refactor:`, `docs:`…).
**Estrategia de audio**: el feedback funciona desde el día 1 con **TTS + háptica**; los efectos `correct/wrong/celebration.mp3` se enchufan después sin tocar lógica (solo añadir al `SOUND_MAP`).

---

## Fase 0 — Fundaciones
*Objetivo: la base invisible sobre la que se monta todo. La app sigue corriendo igual, pero ya tiene cerebro.*

- [ ] **Tipos de dominio** — `src/types/activity.ts` (`Subject`, `ActivityType`, `Activity`, payloads como unión discriminada) y `src/types/progress.ts` (`ChildProfile`, `SubjectProgress`, `UserProgress`).
- [ ] **Store de progreso** — `src/stores/useProgressStore.ts` (Zustand + `persist` con AsyncStorage): `recordActivity`, `completeLevel`, `unlockNext`, `getLevelStars`.
- [ ] **Store de perfiles** — `src/stores/useProfilesStore.ts` (persistido): CRUD de perfiles + perfil activo. Conecta `childType` del perfil activo con `useChildThemeStore`.
- [ ] **TTS** — `src/services/speech/SpeechManager.ts` con `speak(text, { language:'es-ES', rate:0.8 })`, cola y respeto del toggle de voz.
- [ ] **Háptica** — `src/hooks/useHaptics.ts` (`success` / `warning` / `light`), respeta ajuste.
- [ ] **Audio** — añadir `correct/wrong/celebration` al `SOUND_MAP` (apuntando a archivos que llegarán); que `playSound` no falle si el archivo aún no existe.
- [ ] **Verificar**: `npx tsc --noEmit` sin errores; la app arranca igual que antes.

**Entregable**: tipos + estado persistente + voz/háptica listos para usarse. Sin cambios visibles aún.

---

## Fase 1 — Primera vertical jugable ⭐ *(primer hito que los niños pueden tocar)*
*Objetivo: un juego completo de Letras de punta a punta — menú de niveles → jugar → celebrar → progreso guardado.*

- [ ] **`MultipleChoice`** — `src/shared/components/MultipleChoice.tsx`: 2-4 `OptionCard` grandes; al tocar resuelve acierto/error.
- [ ] **`OptionCard`** — tarjeta cartoon reutilizando `CartoonButton`/tema; estados normal/correcto/incorrecto con animación Reanimated.
- [ ] **`ActivityRunner`** — `app/activity/[activityId].tsx` + `src/features/.../ActivityRunner.tsx`: recibe `subject`+`level`, recorre las actividades, lee el prompt por TTS, gestiona el bucle acierto/error (sonido+háptica+voz), al terminar navega a `complete`.
- [ ] **`CompleteScreen`** — `app/activity/complete.tsx`: estrellas obtenidas + celebración (placeholder de confeti hasta tener Lottie) + botones "Otra vez" / "Volver".
- [ ] **`LevelSelectScreen`** (genérico) + **`LevelCard`** — lista de niveles 1-10 con candado/estrellas; navega al runner.
- [ ] **Currículo Letras N1-3** — `src/features/letters/data/curriculum.ts` + generador de actividades (`letter_recognition` y `phonics`) para vocales.
- [ ] **Conectar** `lettersMenu` → `LevelSelectScreen` (letras) → `ActivityRunner` → `CompleteScreen`, persistiendo progreso.
- [ ] **Verificar en dispositivo**: jugar N1 completo, fallar a propósito, completar, ver estrellas y que el nivel quede registrado tras reiniciar la app.

**Entregable**: bucle de aprendizaje completo y real para los 3 primeros niveles de Letras.

---

## Fase 2 — Letras completas
*Objetivo: los 10 niveles de Letras con todas sus mecánicas.*

- [ ] **`DragAndDrop`** — `src/shared/components/DragAndDrop.tsx` (Gesture Handler + Reanimated): arrastrar sílabas/letras a su sitio.
- [ ] **`SequenceGame`** — para ordenar (se reutilizará en Números).
- [ ] **Currículo Letras N4-10** — sílabas (`syllables`) y palabras (`word_building`); generadores correspondientes.
- [ ] **Imágenes/emoji** para `word_building` (palabra ↔ ilustración).
- [ ] **Verificar**: recorrer los 10 niveles de Letras; desbloqueo progresivo correcto.

**Entregable**: módulo de Letras 100% jugable.

---

## Fase 3 — Números completos
*Objetivo: el módulo de Matemáticas, reutilizando las mecánicas ya hechas.*

- [ ] **`NumbersMenuScreen`** — `src/features/numbers/screens/` + ruta `(tabs)/numbersScreens/numbersMenu` (fondos `bg-numbers-menu-*` ya existen).
- [ ] **Conectar** el botón "Números" del menú principal (hoy es no-op).
- [ ] **Mecánica `comparison`** (más/menos) si no se cubrió con `MultipleChoice`.
- [ ] **Currículo Números N1-10** — `counting`, `number_recognition`, `ordering`, `comparison`, `basic_operations`; generadores.
- [ ] **Verificar**: recorrer los 10 niveles de Números.

**Entregable**: app completa de contenido (20 niveles jugables).

---

## Fase 4 — Perfiles y pulido
*Objetivo: experiencia redonda para varios hijos.*

- [ ] **`ProfileSetupScreen`** — crear perfil (nombre + niño/niña + avatar de un set fijo).
- [ ] **Selector de perfil** en `index` (si hay >0 perfiles, elegir; si no, crear).
- [ ] **Ajuste de Voz (TTS)** en Settings + gestión de perfiles.
- [ ] **Lottie** de celebración real en `CompleteScreen` (`assets/lottie/`).
- [ ] **Pulido visual**: estrellas, candados, transiciones entre pantallas, animaciones de entrada.
- [ ] **Verificar**: dos perfiles con progresos independientes que persisten.

**Entregable**: app lista para el uso diario de los niños.

---

## Fase 5 — Empaquetado
*Objetivo: instalarla en los dispositivos reales.*

- [ ] **Pruebas** en iOS y Android (físicos).
- [ ] **Decidir botón "Donar"** (ocultar en build personal).
- [ ] **EAS Build** interno → TestFlight (iOS) / APK (Android).
- [ ] **Instalar** en los dispositivos de los niños.

**Entregable**: la app en las manos de tus hijos. 🎉

---

## Decisiones menores asumidas (cambiar aquí si hace falta)
1. Botón "Donar" → oculto en build personal.
2. Desbloqueo de nivel → ≥70% de aciertos; reintentar nunca penaliza.
3. 8 ejercicios por nivel.
4. Avatares → set fijo de imágenes (sin permisos de cámara).
