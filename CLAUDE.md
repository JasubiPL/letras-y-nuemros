# Números y Letras — App Educativa Infantil

App para enseñar a niños a leer y hacer matemáticas básicas en español.
React Native + Expo SDK 56 | TypeScript | Zustand | Reanimated 4

> 📄 **Documentos de referencia** (leer antes de implementar):
> - [`docs/TECH_SPEC.md`](docs/TECH_SPEC.md) — Especificación técnica completa (arquitectura, modelo de dominio, currículo de los 20 niveles, mecánicas).
> - [`docs/ROADMAP.md`](docs/ROADMAP.md) — Plan de trabajo por fases con checklists.
>
> **Decisiones de producto cerradas**: uso personal (sideload, sin tiendas) · edades mixtas · perfiles por hijo con progreso persistido · 10 niveles de Letras + 10 de Números · sin monetización real.

---

## Stack Tecnológico

| Categoría | Herramienta |
|-----------|-------------|
| Framework | Expo SDK 56, React Native 0.85 |
| Navegación | Expo Router (file-based) — Stack únicamente, **NUNCA usar Tabs** |
| Estado | Zustand 5 + AsyncStorage (persistido) |
| Animaciones | React Native Reanimated 4 + Lottie |
| Gestos | React Native Gesture Handler |
| Audio | expo-audio (AudioManager singleton) |
| TTS | expo-speech (instrucciones habladas en español) |
| Haptics | expo-haptics (feedback táctil) |

---

## Estructura del Proyecto

```
numeros-y-letras/
├── app/                            # Expo Router (thin wrappers)
│   ├── _layout.tsx                 # Root layout (fonts, theme, splash)
│   ├── +html.tsx                   # Web HTML config
│   ├── +not-found.tsx              # 404
│   ├── (tabs)/                     # Grupo de rutas (sin tab bar)
│   │   ├── _layout.tsx             # Stack layout, sin tabs
│   │   ├── index.tsx               # Home — elegir niño o niña
│   │   ├── menu.tsx                # Menú principal — Letras, Números, Config, Donar
│   │   └── settings.tsx            # Pantalla de ajustes
│   └── activity/                   # Activity screens (fullscreen modal)
│       ├── [activityId].tsx        # Pantalla de actividad dinámica
│       └── complete.tsx            # Celebración post-actividad
│
├── src/
│   ├── shared/                     # Componentes y utilidades reutilizables
│   │   ├── ui/                     # UI genérica (CartoonButton, PressableBounce, etc.)
│   │   │   ├── icons/              # Iconos SVG (BackArrow, Music, Sound)
│   │   │   ├── Themed.tsx          # Text/View con soporte light/dark
│   │   │   ├── useColorScheme.ts   # Hook color scheme (nativo)
│   │   │   └── useColorScheme.web.ts
│   │   ├── animations/             # Efectos compartidos (confetti, transiciones)
│   │   └── components/             # Componentes de juego compartidos (MultipleChoice, DragAndDrop)
│   │
│   ├── features/                   # Módulos por funcionalidad
│   │   ├── letters/                # Módulo de Lectoescritura
│   │   │   ├── screens/            # Menú de juegos de letras
│   │   │   ├── components/         # Componentes específicos de letras
│   │   │   └── data/               # Currículo y generadores de letras
│   │   │
│   │   ├── numbers/                # Módulo de Matemáticas
│   │   │   ├── screens/            # Menú de juegos de números
│   │   │   ├── components/         # Componentes específicos de números
│   │   │   └── data/               # Currículo y generadores de números
│   │   │
│   │   └── settings/               # Módulo de Configuración
│   │       └── screens/
│   │
│   ├── hooks/                      # Hooks transversales
│   │   └── useSound.ts             # Reproducir sonidos via AudioManager
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── useChildThemeStore.ts   # Tipo de niño seleccionado (tema visual)
│   │   ├── useProfilesStore.ts     # [planificado] Perfiles por hijo (persistido)
│   │   └── useProgressStore.ts     # [planificado] Progreso por perfil (persistido)
│   │
│   ├── services/
│   │   └── audio/
│   │       ├── AudioManager.ts     # Singleton precarga/reproduce sonidos
│   │       └── sounds.ts           # Catálogo de sonidos
│   │
│   ├── constants/
│   │   ├── Colors.ts               # Colores light/dark (usa THEME)
│   │   ├── theme.ts                # Tema infantil completo
│   │   └── animations.ts           # Spring configs, duraciones
│   │
│   ├── types/
│   │   ├── activity.ts             # Subject, ActivityType, Activity, data types
│   │   └── progress.ts             # SubjectProgress, UserProgress
│   │
│   └── utils/
│
├── assets/
│   ├── fonts/
│   ├── images/
│   └── music/
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
- `comparison` — ¿Cuál tiene más / menos?
- `basic_operations` — Suma/resta básica

### Progresión por Niveles (curriculum.ts)

**Letras** (LETTER_ORDER):
- Nivel 1-2: Vocales (A, E, I, O, U)
- Nivel 3-4: Consonantes frecuentes (M, P, S, L, T)
- Nivel 5-6: Consonantes comunes (N, D, R, C, B)
- Nivel 7-8: Consonantes menos frecuentes (F, G, H, J, V)
- Nivel 9-10: Restantes (K, Ñ, Q, W, X, Y, Z)

**Números** (NUMBER_ORDER) — foco 1-10:
- Nivel 1-2: Contar (1-3, luego 1-5)
- Nivel 3: Reconocer números 1-5
- Nivel 4-5: Contar y reconocer 6-10
- Nivel 6: Ordenar secuencias 1-10
- Nivel 7: Comparar (más / menos)
- Nivel 8-9: Sumar y restar hasta 10
- Nivel 10: Mixto / repaso

> Detalle completo de cada nivel en `docs/TECH_SPEC.md` §6.

### TTS (expo-speech)
Todas las instrucciones se leen en voz alta en español (`es-ES`, rate: 0.8).
Feedback verbal: "¡Muy bien!" / "Inténtalo de nuevo".

---

## Path Aliases (tsconfig.json)

```
@shared/*      → src/shared/*
@features/*    → src/features/*
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

## Siguiente Paso

El plan de trabajo completo, por fases y con checklists, vive en **[`docs/ROADMAP.md`](docs/ROADMAP.md)**.

Resumen de fases:
- **Fase 0** — Fundaciones: tipos de dominio, stores de perfil/progreso, TTS, háptica, efectos de audio.
- **Fase 1** — Primera vertical jugable: `MultipleChoice` + `ActivityRunner` + celebración + Letras N1-3. ⭐
- **Fase 2** — Letras completas (sílabas, palabras, drag & drop).
- **Fase 3** — Números completos (menú + 10 niveles).
- **Fase 4** — Perfiles y pulido (selector, Lottie, estrellas, candados).
- **Fase 5** — Empaquetado (pruebas iOS/Android, EAS Build interno).
