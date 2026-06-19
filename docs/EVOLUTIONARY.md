# Evolutivo — mejoras post-v1.0.0

> Backlog consolidado de mejoras a añadir **después** del MVP (v1.0.0).
> El MVP es el motor con niveles planos: Letras 1-3, Números 1-10, perfiles por
> hijo, empaquetado. Cada ítem aquí es opcional y se aborda en su propia rama
> (una feature por rama → PR a `develop`).

---

## 1. Rutas de aprendizaje en Letras  *(la grande)*
Agrupar los niveles de Letras en rutas temáticas (vocales, consonantes, sílabas,
escribir palabras, comprensión lectora). **Diseño completo y decisiones acordadas
en [`TECH_SPEC.md`](TECH_SPEC.md) §16.** Reorganiza los niveles planos actuales.
Incluye el tipo nuevo `reading_comprehension` (Claude redacta los cuentos, el
owner los revisa) y progreso por ruta.

## 2. Mecánicas nuevas
- **Drag & drop** (`react-native-gesture-handler` + Reanimated): arrastrar sílabas/
  letras para formar palabras; arrastrar para ordenar números.
- **Secuencia** real (hoy "ordenar" es "¿qué número sigue?" con opciones).
- Necesarias para Letras 4-10 (sílabas, palabras) y para enriquecer Números.

## 3. Contenido
- **Letras 4-10**: sílabas y palabras (hoy implementados 1-3; 4-10 aparecen como "Pronto").
- Ilustraciones/emoji para formar palabras.
- Textos cortos de comprensión lectora.

## 4. Pulido y assets
- **Efectos de audio**: `correct.mp3` / `wrong.mp3` / `celebration.mp3` en
  `assets/music/` + descomentar en `src/services/audio/sounds.ts` (hoy: TTS + háptica).
- **Lottie** de celebración real en `CompleteScreen` (hoy: animación de estrellas).
- Candados con arte, transiciones entre pantallas, más animaciones de entrada.

## 5. Perfiles
- Borrar/editar perfiles y gestión avanzada (hoy: crear, elegir, cambiar).

## 6. Distribución
- iOS: submit formal a TestFlight (`eas build --profile production` + `eas submit`).
- Botón "Donar" como enlace externo, si alguna vez se quiere (hoy: eliminado).

## 7. Otros
- Números podría adoptar también el sistema de rutas.
- Avance/dificultad adaptativa según desempeño.
