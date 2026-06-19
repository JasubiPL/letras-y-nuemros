# Fase 5 — Empaquetado: preparación

> Punto de partida para retomar la Fase 5 (instalar la app en los dispositivos de
> los hijos). El **contenido del MVP está completo** y mergeado en `develop`:
> Fase 0 (motor), Fase 1 (Letras 1-3), Fase 3 (Números 1-10), Fase 4 (perfiles).
> Rama de trabajo: **`feature/packaging`** (creada desde `develop`).

---

## ✅ Lo que ya está listo
- `eas.json` con perfiles: `development`, **`preview`** (interno; Android = APK), `production`.
- `app.json` con `projectId` EAS (`30bd6437-b797-493d-b40c-11ebe4840770`), bundle ids
  `com.anonymous.numerosyletras` (iOS y Android) y permisos de audio.
- `tsc` limpio y `expo export` (ios) empaqueta sin errores en todas las fases.

## 🙋 Acciones del owner (solo tú puedes)
1. **Icono cuadrado**: reemplazar `assets/images/icon.png` por **1024×1024** (hoy es 497×502;
   es el único fallo de `expo-doctor`). Idealmente también revisar `adaptiveIcon.foregroundImage`.
2. **Cuenta EAS / login**: en tu terminal `! eas login` (o `npx eas login`) y confirmar que el
   proyecto sigue vinculado al `projectId` de `app.json`.
3. **(Opcional) Efectos de audio**: soltar `correct.mp3` / `wrong.mp3` / `celebration.mp3` en
   `assets/music/` y descomentar en `src/services/audio/sounds.ts`.
4. **Decisión botón "Donar"**: confirmado por defecto → **ocultarlo** en el build personal
   (ver tarea de código abajo). Si lo quieres como enlace, dilo.

## 🧑‍💻 Tareas de código para la próxima sesión (sin decisiones pendientes)
- [ ] **Ocultar el botón "Donar"** en `app/(tabs)/menu.tsx` (decisión ya acordada).
- [ ] Verificar `app.json` para build (versión, orientación) y que el splash/icono cargan.
- [ ] (Opcional) Lottie de celebración si llega el asset.

## 📦 Comandos de build (cuando el owner haya hecho login)
- **Android (APK interno)**: `eas build -p android --profile preview`
- **iOS (interno/TestFlight)**: `eas build -p ios --profile preview`
  - Para TestFlight formal: `eas build -p ios --profile production` + `eas submit -p ios`.
- Instalar el APK directamente en Android; en iOS vía TestFlight o dev build.

## Checklist de cierre de Fase 5
- [ ] Icono cuadrado + `expo-doctor` 21/21.
- [ ] Botón "Donar" oculto.
- [ ] Build de Android (APK) e iOS generados con EAS.
- [ ] Instalada y probada en los dispositivos reales de los niños. 🎉
