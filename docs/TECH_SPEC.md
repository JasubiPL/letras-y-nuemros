# Especificación Técnica — Números y Letras

> App educativa infantil para enseñar a leer y a hacer matemáticas básicas en español.
> Documento maestro del producto y la arquitectura. Versión 1.0 — 2026-06-19.

---

## 1. Visión

Una app de aprendizaje para los hijos del autor (uso personal, **no se publica en tiendas**).
Cada hijo elige su perfil, juega actividades cortas y celebradas, y va **subiendo de nivel**
a su propio ritmo. Pensada para **edades mixtas**: arranca en pre-lectura/pre-conteo y escala
hasta leer palabras y hacer operaciones hasta 10.

### Principios de diseño
- **Cero fricción para un niño**: tocar imágenes grandes, audio que explica todo, nada de texto que haya que leer para poder jugar.
- **Siempre positivo**: el error nunca penaliza; se invita a intentar de nuevo con voz amable.
- **Feedback multisensorial**: sonido + háptica + animación en cada acción.
- **Offline total**: todo el contenido vive en el bundle. Sin red, sin cuentas, sin analytics.
- **Escalable por datos, no por código**: añadir niveles/actividades = añadir datos al currículo, no escribir pantallas nuevas.

---

## 2. Decisiones de producto (cerradas)

| Decisión | Elección | Implicación técnica |
|----------|----------|---------------------|
| Edades | **Mixtas** | Niveles que escalan de pre-lectura a lectura; dificultad por nivel |
| Distribución | **Solo para sus hijos** (sideload / TestFlight / APK) | Sin política de privacidad, sin COPPA, sin IAP. EAS Build interno opcional |
| Perfiles | **Uno por hijo**, con progreso guardado | Store de perfiles + progreso persistido en AsyncStorage |
| Currículo | **10 niveles de Letras + 10 de Números** | Ver §6 |
| Monetización | Ninguna real | Botón "Donar" → enlace externo opcional o se elimina (ver §13) |

---

## 3. Estado actual del código (línea base)

### Ya construido y sólido ✅
- **Navegación**: Expo Router, Stack-only (nunca Tabs). Flujo: `index` (elegir niño/niña) → `menu` → `lettersScreens/lettersMenu` / `settings`.
- **Tema**: `src/constants/theme.ts` (colores, 8 fuentes Baloo2/Nunito, spacing, radios, sombras) + 19 paletas de botón cartoon en `Colors.ts`.
- **UI base**: `CartoonButton`, `PressableBounce`, `OutlinedText`, `OutlinedRainbowText`, `PlayStopSwitch`, iconos SVG (BackArrow, Music, Sound).
- **Audio**: `AudioManager` (singleton, carga perezosa de `expo-audio`, música de fondo en loop a vol. 0.05, mute de música/efectos) + hook `useSound`.
- **Estado**: `useChildThemeStore` (Zustand) guarda `childType: 'boy' | 'girl' | null` (en memoria, sin persistir).
- **Pantallas**: Home, Menú principal (Letras/Números/Config/Donar), Settings (toggles música/efectos), Menú de Letras (placeholder).

### Falta por construir ❌ (lo que cubre esta spec)
- Todo el **motor de actividades** y las **mecánicas de juego**.
- **Currículo** de letras y números (datos de los 20 niveles).
- **Sistema de perfiles** persistente + **seguimiento de progreso**.
- **Menú de Números** + sus submenús de juego (los fondos ya existen).
- **TTS** (instrucciones habladas) — `expo-speech` instalado pero sin usar.
- **Háptica** — `expo-haptics` instalado pero sin usar.
- **Pantalla de celebración** post-actividad + animaciones Lottie.
- **Assets de audio** faltantes: `correct`, `wrong`, `celebration` (hoy `useSound` los llama pero no existen → no suenan).

---

## 4. Arquitectura técnica

### 4.1 Capas
```
app/                      ← Expo Router. Wrappers finos que solo renderizan una screen de src/features.
  (tabs)/                 ← Grupo de rutas SIN tab bar (solo Stack).
  activity/[activityId]   ← Runner genérico de actividad (fullscreen).
  activity/complete       ← Celebración.

src/features/<feature>/   ← Lógica por módulo (letters, numbers, settings, profiles).
  screens/                ← Pantallas (menús de juego).
  components/             ← Componentes específicos del módulo.
  data/                   ← Currículo + generadores de actividades.

src/shared/               ← Reutilizable entre features (ui, components de juego, animations).
src/stores/               ← Zustand (perfiles, progreso, tema de niño).
src/services/             ← AudioManager, TTS, haptics.
src/constants/ types/ utils/
```

### 4.2 Patrón clave: **actividad dirigida por datos**
Una **Activity** es un objeto de datos, no una pantalla. Un único **ActivityRunner** lee el tipo
de actividad y monta la mecánica de juego correspondiente. Esto permite tener cientos de
ejercicios sin escribir pantallas nuevas.

```
Currículo (data) → genera → Activity[] → ActivityRunner → GameMechanic (por tipo) → Resultado → Progreso + Celebración
```

### 4.3 Stack tecnológico (sin cambios respecto a package.json actual)
Expo SDK 55 · RN 0.83 · React 19 · Expo Router · Zustand 5 · Reanimated 4 · `expo-audio` · `expo-speech` · `expo-haptics` · `lottie-react-native` · `react-native-gesture-handler` · `react-native-svg`.

> Nota: el `CLAUDE.md` menciona `expo-av`; la realidad es **`expo-audio`** (correcto en SDK 55). Se actualizará el CLAUDE.md.

---

## 5. Modelo de dominio (`src/types/`)

### 5.1 Materia y actividades
```ts
type Subject = 'letters' | 'numbers';

type ActivityType =
  // Letras
  | 'letter_recognition'   // reconocer una letra entre opciones (visual)
  | 'phonics'              // asociar letra ↔ sonido (TTS lo dice, el niño elige)
  | 'syllables'            // identificar/formar una sílaba (ma, pe, si...)
  | 'word_building'        // construir una palabra corta con sílabas/letras
  // Números
  | 'counting'             // contar objetos (emojis) y elegir el número
  | 'number_recognition'   // reconocer un número entre opciones
  | 'ordering'             // ordenar una secuencia numérica
  | 'comparison'           // ¿cuál tiene más / menos?
  | 'basic_operations';    // suma / resta simple
```

### 5.2 Definición de una actividad (datos)
```ts
interface Activity {
  id: string;                 // 'L1-rec-01'
  subject: Subject;
  type: ActivityType;
  level: number;              // 1..10
  prompt: string;             // texto + base del TTS: "¿Dónde está la A?"
  payload: ActivityPayload;   // datos específicos del tipo (union discriminada)
  reward: number;             // estrellas que otorga (1..3)
}

// Ejemplos de payload (union discriminada por ActivityType)
interface RecognitionPayload { target: string; options: string[]; }              // letter_recognition / number_recognition
interface PhonicsPayload      { sound: string; options: string[]; }               // phonics
interface CountingPayload     { emoji: string; count: number; options: number[]; }// counting
interface OrderingPayload     { sequence: number[]; }                             // ordering (se barajan)
interface ComparisonPayload   { left: number; right: number; ask: 'more'|'less'; }// comparison
interface OperationPayload    { a: number; b: number; op: '+'|'-'; options: number[]; } // basic_operations
interface WordPayload         { word: string; syllables: string[]; image?: string; }    // word_building / syllables
```

### 5.3 Perfil y progreso
```ts
interface ChildProfile {
  id: string;
  name: string;               // "Mateo"
  childType: 'boy' | 'girl';  // reusa el tema visual existente
  avatar: string;             // clave de imagen/emoji
  createdAt: number;
}

interface SubjectProgress {
  currentLevel: number;       // nivel desbloqueado más alto (1..10)
  stars: Record<number, number>; // estrellas por nivel
  completed: string[];        // ids de actividades completadas
}

interface UserProgress {
  profileId: string;
  letters: SubjectProgress;
  numbers: SubjectProgress;
  lastPlayed: number;
}
```

---

## 6. Currículo completo

Cada nivel = ~6-10 actividades generadas. Se desbloquea el siguiente nivel al completar el actual
(umbral configurable, p. ej. ≥70% de aciertos). El currículo vive en
`src/features/letters/data/curriculum.ts` y `src/features/numbers/data/curriculum.ts`.

### 6.1 Letras (lectoescritura)
Orden de letras: **A E I O U · M P S L T · N D R C B · F G H J V · K Ñ Q LL · W X Y Z**

| Nivel | Contenido | Tipos de actividad | Meta pedagógica |
|------:|-----------|--------------------|-----------------|
| 1 | Vocales **A, E** | letter_recognition | Reconocer forma de vocal |
| 2 | Vocales **I, O, U** | letter_recognition | Completar las 5 vocales |
| 3 | Repaso vocales | phonics | Sonido de cada vocal |
| 4 | **M, P** | letter_recognition, phonics | Primeras consonantes |
| 5 | **S, L, T** | phonics, syllables | Sílabas: ma, pe, si, lo, tu… |
| 6 | **N, D, R** | syllables | Leer sílabas directas |
| 7 | **C, B, F** | syllables, word_building | Unir 2 sílabas |
| 8 | **G, H, J, V** | word_building | Palabras de 2 sílabas (casa, gato) |
| 9 | **K, Ñ, Q, LL** | word_building | Palabras con dígrafos |
| 10 | **W, X, Y, Z** + repaso | word_building | Leer palabras completas |

### 6.2 Números (matemáticas)
Orden: contar → reconocer → ordenar → comparar → operar.

| Nivel | Contenido | Tipos de actividad | Meta pedagógica |
|------:|-----------|--------------------|-----------------|
| 1 | Cantidades **1-3** | counting | Contar pocos objetos |
| 2 | Cantidades **1-5** | counting | Conteo estable hasta 5 |
| 3 | Números **1-5** | number_recognition | Símbolo ↔ cantidad |
| 4 | Cantidades **6-10** | counting | Contar hasta 10 |
| 5 | Números **6-10** | number_recognition | Reconocer 6-10 |
| 6 | Secuencias **1-10** | ordering | Orden numérico |
| 7 | Más / menos (1-10) | comparison | Comparar cantidades |
| 8 | Sumas hasta **5** | basic_operations | Suma concreta (con apoyo visual) |
| 9 | Suma/resta hasta **10** | basic_operations | Operar con símbolos |
| 10 | Mixto / repaso | basic_operations, comparison | Consolidación |

---

## 7. Mecánicas de juego (componentes de `src/shared/components/`)

Cada `ActivityType` se mapea a una mecánica reutilizable:

| Mecánica | Tipos que usa | Interacción | Componente |
|----------|---------------|-------------|------------|
| **MultipleChoice** | letter_recognition, number_recognition, phonics, counting, comparison, basic_operations | Tocar la opción correcta entre 2-4 tarjetas grandes | `MultipleChoice.tsx` |
| **DragAndDrop** | word_building, syllables | Arrastrar sílabas/letras a su sitio (Gesture Handler + Reanimated) | `DragAndDrop.tsx` |
| **Sequence** | ordering | Tocar en orden / arrastrar a posición | `SequenceGame.tsx` |

**Bucle común de una actividad** (gestionado por `ActivityRunner`):
1. Mostrar prompt → **TTS lo lee** en `es-ES` (rate 0.8).
2. Niño interactúa.
3. **Acierto** → `playCorrect()` + háptica `success` + animación de tarjeta + voz "¡Muy bien!".
4. **Error** → `playWrong()` + háptica `warning` + voz "Inténtalo de nuevo" (sin avanzar, sin castigo).
5. Al terminar las N actividades del nivel → navegar a `activity/complete` (confeti/Lottie + estrellas).

---

## 8. Perfiles y progreso

- **Nuevo store** `useProfilesStore` (Zustand + AsyncStorage): CRUD de perfiles, perfil activo.
- **Nuevo store** `useProgressStore` (Zustand + AsyncStorage): `UserProgress` por `profileId`; acciones `recordActivity`, `completeLevel`, `unlockNext`, `getLevelStars`.
- **Persistencia**: `persist` middleware de Zustand con `createJSONStorage(() => AsyncStorage)`.
- **Flujo de entrada actualizado**:
  `index` → si no hay perfiles, crear uno (nombre + niño/niña + avatar) → seleccionar perfil → `menu`.
  El `childType` del perfil activo alimenta el `useChildThemeStore` existente (fondos/colores).
- **Desbloqueo**: nivel N+1 disponible cuando el nivel N alcanza el umbral. Niveles bloqueados se ven con candado.

---

## 9. Audio, voz y háptica

| Servicio | Estado | Acción |
|----------|--------|--------|
| Efectos (`AudioManager`/`useSound`) | Parcial | **Añadir** `correct.mp3`, `wrong.mp3`, `celebration.mp3` a `assets/music/` y al `SOUND_MAP` |
| Música de fondo | ✅ Funciona | Sin cambios |
| **TTS** (`expo-speech`) | Sin usar | **Crear** `src/services/speech/SpeechManager.ts`: `speak(text, { language:'es-ES', rate:0.8 })`, cola, respeta toggle de efectos |
| **Háptica** (`expo-haptics`) | Sin usar | **Crear** `useHaptics` (success/warning/light), respeta ajuste |

Nuevo ajuste en Settings: **Voz (TTS) on/off** además de Música y Efectos.

---

## 10. Mapa de navegación (objetivo)

```
/ (index)                         Seleccionar / crear perfil
└─ /(tabs)/menu                   Menú: Letras · Números · Config · Donar
   ├─ /(tabs)/lettersScreens/lettersMenu   Niveles de Letras (1-10, con candados)
   │   └─ /activity/[activityId]?subject=letters&level=N   Runner
   │       └─ /activity/complete   Celebración
   ├─ /(tabs)/numbersScreens/numbersMenu   Niveles de Números (1-10)   ← NUEVO
   │   └─ /activity/[activityId]?subject=numbers&level=N
   │       └─ /activity/complete
   └─ /(tabs)/settings            Música · Efectos · Voz · (gestión de perfiles)
```
Todo con `Stack` + `router.push()`. **Nunca `<Tabs>`.**

---

## 11. Inventario de componentes

### Reutilizar (ya existen)
`CartoonButton`, `PressableBounce`, `OutlinedText`, `OutlinedRainbowText`, `PlayStopSwitch`, iconos SVG, `AudioManager`, `useSound`, tema y colores.

### Construir
- **Juego**: `MultipleChoice`, `DragAndDrop`, `SequenceGame`, `OptionCard`, `ProgressDots`.
- **UI**: `LevelCard` (con candado/estrellas), `StarRating`, `ActivityHeader` (back + progreso), `Confetti`/Lottie celebración, `ProfileAvatar`, `ProfilePicker`.
- **Pantallas**: `NumbersMenuScreen`, `LevelSelectScreen` (genérico letras/números), `ActivityRunner`, `CompleteScreen`, `ProfileSetupScreen`.
- **Servicios/stores**: `SpeechManager`, `useHaptics`, `useProfilesStore`, `useProgressStore`.
- **Datos**: `letters/data/curriculum.ts` + generadores; `numbers/data/curriculum.ts` + generadores.

---

## 12. Assets faltantes

| Tipo | Faltan | Notas |
|------|--------|-------|
| Audio | `correct.mp3`, `wrong.mp3`, `celebration.mp3` | Hoy `useSound` los invoca y no existen |
| Lottie | 1-2 animaciones de celebración (`assets/lottie/`) | Carpeta no existe aún |
| Imágenes | Avatares de perfil; ilustraciones para `word_building` (opcional, se puede usar emoji) | `assets/images/items/` |
| Fonts | — | Se cargan vía `@expo-google-fonts`, `assets/fonts/` vacío y está bien |

---

## 13. Decisiones pendientes (menores)

1. **Botón "Donar"**: ¿enlace externo a un café/donación, o se elimina al ser uso familiar? → *propuesta: ocultar en build personal.*
2. **Umbral de desbloqueo** de nivel: ¿completar todas / ≥70% aciertos? → *propuesta: ≥70%, sin bloquear si reintenta.*
3. **N.º de ejercicios por nivel**: → *propuesta: 8.*
4. **Avatares**: ¿set fijo de emojis/animales, o foto? → *propuesta: set fijo de imágenes lindas, cero permisos de cámara.*

---

## 14. Roadmap por fases

> Cada fase deja la app ejecutable. Orden pensado para validar pronto con los niños.

**Fase 0 — Fundaciones (sin UI nueva visible)**
- Tipos de dominio (`src/types/activity.ts`, `progress.ts`).
- `useProfilesStore` + `useProgressStore` con persistencia.
- `SpeechManager` (TTS) + `useHaptics`.
- Añadir efectos de audio faltantes al `SOUND_MAP`.

**Fase 1 — Vertical completa (1 juego de punta a punta)** ⭐ *primer hito jugable*
- `MultipleChoice` + `OptionCard`.
- `ActivityRunner` + `CompleteScreen` (con celebración).
- `LevelSelectScreen` genérico + `LevelCard`.
- Currículo de Letras **Nivel 1-3** (reconocimiento + fonética).
- Conectar `lettersMenu` → niveles → runner → celebración → progreso guardado.

**Fase 2 — Letras completas**
- Mecánicas `DragAndDrop` y `Sequence`.
- Currículo de Letras **Nivel 4-10** (sílabas, palabras).

**Fase 3 — Números completos**
- `NumbersMenuScreen` (fondos ya existen).
- Currículo de Números **Nivel 1-10** (reusa MultipleChoice/Sequence).

**Fase 4 — Perfiles y pulido**
- `ProfileSetupScreen` + selector en `index`.
- Ajuste de Voz en Settings + gestión de perfiles.
- Animaciones Lottie, estrellas, candados, transiciones.

**Fase 5 — Empaquetado**
- Pruebas en iOS/Android.
- EAS Build interno (TestFlight / APK) para instalar en los dispositivos de los niños.

---

## 15. Convenciones (recordatorio)
- Componentes PascalCase · hooks/stores `useX` camelCase · constantes UPPER_SNAKE.
- UI en **español**; git/commits/PRs en **inglés** (Conventional Commits).
- Estructura de archivo: Imports → Types → Component → Styles.
- Navegación **solo Stack**.
- Path aliases: `@shared @features @hooks @stores @services @constants @appTypes @utils @assets`.
