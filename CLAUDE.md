# Números y Letras — App Educativa Infantil

App para enseñar a niños a leer y hacer matemáticas básicas en español.
React Native + Expo SDK 55 | TypeScript | Zustand | Reanimated 4

---

## Stack Tecnológico

| Categoría | Herramienta |
|-----------|-------------|
| Framework | Expo SDK 55, React Native 0.83 |
| Navegación | Expo Router (file-based) — Stack únicamente, **NUNCA usar Tabs** |
| Estado | Zustand 5 + AsyncStorage (persistido) |
| Animaciones | React Native Reanimated 4 + Lottie |
| Gestos | React Native Gesture Handler |
| Audio | expo-av (AudioManager singleton) |
| TTS | expo-speech (instrucciones habladas en español) |
| Haptics | expo-haptics (feedback táctil) |

---

## Estructura del Proyecto

```
numeros-y-letras/
├── app/                            # Expo Router
│   ├── _layout.tsx                 # Root layout (fonts, theme, splash)
│   ├── +html.tsx                   # Web HTML config
│   ├── +not-found.tsx              # 404
│   ├── (tabs)/                     # Grupo de rutas (sin tab bar)
│   │   ├── _layout.tsx             # Stack layout, sin tabs
│   │   └── index.tsx               # Home — elegir Letras o Números
│   └── activity/                   # Activity screens (fullscreen modal)
│       ├── [activityId].tsx        # Pantalla de actividad dinámica
│       └── complete.tsx            # Celebración post-actividad
│
├── src/
│   ├── components/                 # Componentes reutilizables
│   │   ├── ui/                     # UI genérica (botones, cards, progress bars)
│   │   ├── animations/             # Efectos (confetti, transiciones)
│   │   ├── activities/             # Componentes de actividad (opciones, drag, etc.)
│   │   ├── Themed.tsx              # Text/View con soporte light/dark
│   │   ├── useColorScheme.ts       # Hook color scheme (nativo)
│   │   ├── useColorScheme.web.ts   # Hook color scheme (web)
│   │   ├── useClientOnlyValue.ts   # Client-only value (nativo)
│   │   └── useClientOnlyValue.web.ts
│   │
│   ├── hooks/
│   │   ├── useSound.ts             # Reproducir sonidos via AudioManager
│   │   ├── useAnimation.ts         # useBounce(), useShake()
│   │   └── useHaptics.ts           # Feedback táctil
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── useProgressStore.ts     # Progreso por materia (persistido)
│   │   ├── useSettingsStore.ts     # Config usuario (persistido)
│   │   └── useActivityStore.ts     # Estado de actividad en curso
│   │
│   ├── services/
│   │   ├── audio/
│   │   │   ├── AudioManager.ts     # Singleton precarga/reproduce sonidos
│   │   │   └── sounds.ts           # Catálogo de sonidos
│   │   ├── storage/
│   │   └── activities/
│   │
│   ├── constants/
│   │   ├── Colors.ts               # Colores light/dark (usa THEME)
│   │   ├── theme.ts                # Tema infantil completo
│   │   ├── animations.ts           # Spring configs, duraciones
│   │   └── curriculum.ts           # Orden de letras/números, generadores de actividades
│   │
│   ├── types/
│   │   ├── activity.ts             # Subject, ActivityType, Activity, data types
│   │   └── progress.ts             # SubjectProgress, UserProgress
│   │
│   └── utils/
│
├── assets/
│   ├── fonts/SpaceMono-Regular.ttf
│   └── images/
│
├── CLAUDE.md
├── app.json
├── tsconfig.json
├── babel.config.js
└── package.json
```

---

## Modelo de Dominio

### Materias (Subject)
- **letters** — Lectoescritura en español
- **numbers** — Matemáticas básicas

### Tipos de Actividad

**Letras:**
- `letter_recognition` — Reconocer letra entre opciones
- `phonics` — Asociar letra con su sonido
- `word_building` — Formar palabras
- `syllables` — Identificar sílabas

**Números:**
- `number_recognition` — Reconocer número entre opciones
- `counting` — Contar objetos (emojis)
- `ordering` — Ordenar secuencias numéricas
- `basic_operations` — Suma/resta básica

### Progresión por Niveles (curriculum.ts)

**Letras** (LETTER_ORDER):
- Nivel 1-2: Vocales (A, E, I, O, U)
- Nivel 3-4: Consonantes frecuentes (M, P, S, L, T)
- Nivel 5-6: Consonantes comunes (N, D, R, C, B)
- Nivel 7-8: Consonantes menos frecuentes (F, G, H, J, V)
- Nivel 9-10: Restantes (K, Ñ, Q, W, X, Y, Z)

**Números** (NUMBER_ORDER):
- Nivel 1-2: 1-5 (contar)
- Nivel 3-4: 6-10 (contar)
- Nivel 5-6: 11-15 (reconocer)
- Nivel 7-8: 16-20 (reconocer)
- Nivel 9-10: Operaciones básicas

### TTS (expo-speech)
Todas las instrucciones se leen en voz alta en español (`es-ES`, rate: 0.8).
Feedback verbal: "¡Muy bien!" / "Inténtalo de nuevo".

---

## Path Aliases (tsconfig.json)

```
@components/*  → src/components/*
@hooks/*       → src/hooks/*
@stores/*      → src/stores/*
@services/*    → src/services/*
@constants/*   → src/constants/*
@appTypes/*    → src/types/*        (no @types/* — conflicto con DefinitelyTyped)
@utils/*       → src/utils/*
@assets/*      → assets/*
```

---

## Convenciones

- **Componentes**: PascalCase (`AnimatedButton.tsx`)
- **Hooks**: camelCase con `use` (`useSound.ts`)
- **Stores**: camelCase con `use` (`useProgressStore.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`ANIMATION.SPRING_CONFIG`)
- **Types**: PascalCase (`Activity`, `Subject`)
- **Idioma UI**: Español
- **Estructura componente**: Imports → Types → Component → Styles
- **Navegación**: NUNCA usar `<Tabs>` de expo-router. Toda la navegación es con `Stack` y botones con `router.push()`

---

## Siguiente Paso (MVP)

- [ ] Agregar assets de audio (efectos: tap, correct, wrong, celebration)
- [ ] Implementar componentes UI reutilizables (AnimatedButton, Card, ProgressBar)
- [ ] Agregar actividades de fonética (letra → sonido con TTS)
- [ ] Agregar actividades de contar con drag & drop
- [ ] Agregar actividades de formar palabras (sílabas)
- [ ] Agregar animaciones Lottie de celebración
- [ ] Implementar avance automático de nivel
- [ ] Testing en iOS y Android
- [ ] Configurar EAS Build
