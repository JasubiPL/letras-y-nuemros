# Plan de Trabajo por Fases — Números y Letras

> Plan de ejecución detallado. Complementa [`TECH_SPEC.md`](TECH_SPEC.md) (el *qué* y *por qué*); este documento es el *cómo* y *en qué orden*.
> Cada fase deja la app **ejecutable** y, a partir de la Fase 1, **jugable**.

**Convención de commits**: Conventional Commits en inglés (`feat:`, `fix:`, `refactor:`, `docs:`…).
**Estrategia de audio**: el feedback funciona desde el día 1 con **TTS + háptica**; los efectos `correct/wrong/celebration.mp3` se enchufan después sin tocar lógica (solo añadir al `SOUND_MAP`).

---

## Fase 0 — Fundaciones ✅ *(completada)*
*Objetivo: la base invisible sobre la que se monta todo. La app sigue corriendo igual, pero ya tiene cerebro.*

- [x] **Tipos de dominio** — `src/types/activity.ts` (`Subject`, `ActivityType`, `Activity`, payloads como unión discriminada por `kind`) y `src/types/progress.ts` (`ChildProfile`, `SubjectProgress`, `UserProgress`).
- [x] **Store de progreso** — `src/stores/useProgressStore.ts` (Zustand + `persist` con AsyncStorage): `recordActivity`, `completeLevel`, `getLevelStars`, `isLevelUnlocked`.
- [x] **Store de perfiles** — `src/stores/useProfilesStore.ts` (persistido): CRUD de perfiles + perfil activo. (Conexión `childType` → `useChildThemeStore` se cablea al construir el flujo de entrada en Fase 1/4.)
- [x] **TTS** — `src/services/speech/SpeechManager.ts` + `src/hooks/useSpeech.ts`: `speak(text, { language:'es-ES', rate:0.85 })`, corta solapamientos, respeta toggle.
- [x] **Háptica** — `src/hooks/useHaptics.ts` (`success` / `warning` / `light`), con `setHapticsEnabled` para Ajustes.
- [x] **Audio** — `SOUND_MAP` documentado con placeholders de `correct/wrong/celebration` (sin romper Metro); el feedback cae a TTS + háptica mientras falten los .mp3.
- [x] **Verificado**: `tsc --noEmit` sin errores; sin cambios de comportamiento (módulos aditivos).

**Entregable**: tipos + estado persistente + voz/háptica listos para usarse. Sin cambios visibles aún. ✅

---

## Fase 1 — Primera vertical jugable ⭐ *(código completo — pendiente prueba en dispositivo)*
*Objetivo: un juego completo de Letras de punta a punta — menú de niveles → jugar → celebrar → progreso guardado.*

- [x] **`MultipleChoice`** — `src/shared/components/MultipleChoice.tsx`: 2-4 `OptionCard` grandes; al tocar resuelve acierto/error y reporta cada intento.
- [x] **`OptionCard`** — tarjeta cartoon con tema; estados normal/correcto (rebote + ✓) / incorrecto (sacudida + ✗) con Reanimated.
- [x] **`ActivityRunner`** — `app/activity/play.tsx` + `src/features/activities/screens/ActivityRunner.tsx`: recibe `subject`+`level`, recorre las actividades, lee el prompt por TTS, gestiona acierto/error (sonido+háptica+voz), puntúa por aciertos a la primera y navega a `complete`.
- [x] **`CompleteScreen`** — `app/activity/complete.tsx`: estrellas por precisión + celebración (animación de estrellas; Lottie llega en Fase 4) + "Otra vez" / "Volver"; guarda el nivel (desbloquea el siguiente).
- [x] **`LevelSelectScreen`** (genérico) + **`LevelCard`** — niveles 1-10 con estados available / locked / "Pronto" y estrellas ganadas.
- [x] **Currículo Letras N1-3** — `src/features/letters/data/curriculum.ts` + generador (`letter_recognition` y `phonics`); `registry.ts` mapea materia+nivel → actividades.
- [x] **Conectar** menú de Letras → `LevelSelectScreen` → `ActivityRunner` → `CompleteScreen`, persistiendo progreso; rutas `activity/*` registradas en el Stack raíz.
- [x] **Verificado (estático)**: `tsc --noEmit` limpio; `expo export` (ios) empaqueta sin errores.
- [ ] **Verificar en dispositivo** (tu turno): jugar N1 completo, fallar a propósito, completar, ver estrellas y que el nivel quede registrado tras reiniciar la app.

**Nota de diseño**: cada nivel da **3 vidas (corazones)**; cada respuesta incorrecta resta una. Al perder las 3 aparece un menú "Volver a intentar" que reinicia el nivel desde cero. Completar un nivel desbloquea el siguiente; las estrellas reflejan aciertos a la primera (3=100%, 2=≥60%, 1=resto). Niveles 4-10 se muestran como "Pronto" hasta tener su currículo (Fase 2).

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

## Fase 3 — Números completos ✅ *(código completo — pendiente prueba en dispositivo)*
*Objetivo: el módulo de Matemáticas, reutilizando las mecánicas ya hechas.*

- [x] **`NumberMenuScreen`** — `src/features/numbers/screens/` + ruta `(tabs)/numbersScreens/numbersMenu` (fondos `bg-numbers-menu-*`). Reusa el `LevelSelectScreen` genérico (ahora consciente de la materia para el fondo).
- [x] **Conectar** el botón "Números" del menú principal (`goToNumbersMenu`).
- [x] **`counting`** con estímulo visual (emojis) en el runner; el resto de tipos se modelan como `recognition` (elección de número), incluida la comparación más/menos.
- [x] **Currículo Números N1-10** — `src/features/numbers/data/curriculum.ts`: contar, reconocer, ordenar (¿qué número sigue?), comparar, sumar/restar; `registry.ts` amplía a Números.
- [x] **Verificado (estático)**: `tsc` limpio; `expo export` (ios) empaqueta sin errores.
- [ ] **Verificar en dispositivo** (tu turno): recorrer los 10 niveles de Números.

**Nota**: las mecánicas de arrastre (drag & drop) y secuencia quedan para el evolutivo; los 10 niveles de Números funcionan con `MultipleChoice` + estímulo de conteo.

**Entregable**: app con contenido de Números completo (10 niveles jugables) además de Letras 1-3.

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
2. Desbloqueo de nivel → completar el nivel lo desbloquea; **3 vidas** por nivel (3 fallos → menú "Volver a intentar" que reinicia). Estrellas por aciertos a la primera.
3. 8 ejercicios por nivel.
4. Avatares → set fijo de imágenes (sin permisos de cámara).

---

## Alcance del MVP vs Evolutivo

**MVP** = el motor actual con **niveles planos** por materia: Letras (Fases 1-2),
Números (Fase 3), perfiles (Fase 4) y empaquetado (Fase 5). Es lo que terminamos primero.

**Post-MVP (evolutivo)** = mejoras que se añaden en futuras actualizaciones, una vez
cerrado el MVP:

- **Rutas de aprendizaje en Letras** (agrupar niveles por tema: vocales, consonantes,
  sílabas, escribir palabras, comprensión lectora). Diseño completo y decisiones
  acordadas en **[`TECH_SPEC.md`](TECH_SPEC.md) §16**. Reorganizará los niveles planos
  de Letras; por eso se hace después del MVP.
- Idea relacionada para revisar al planificar la Fase 2: dado que las rutas
  reorganizarán Letras, quizá convenga mantener Letras en el nivel actual durante el
  MVP y priorizar Números + perfiles + empaquetado, en vez de construir Letras 4-10
  planos que luego se reordenan. **A decidir con el owner.**
