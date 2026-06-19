# Fase 5 — Empaquetado: preparación

> Punto de partida para retomar la Fase 5 (instalar la app en los dispositivos de
> los hijos). El **contenido del MVP está completo** y mergeado en `develop`:
> Fase 0 (motor), Fase 1 (Letras 1-3), Fase 3 (Números 1-10), Fase 4 (perfiles).
> Rama de trabajo: **`feature/packaging`** (creada desde `develop`).

---

## ✅ Lo que ya está listo
- `eas.json` con perfiles: `development`, **`preview`** (interno; Android = APK), `production`.
- `app.json` con `projectId` EAS (`30bd6437-b797-493d-b40c-11ebe4840770`) y bundle ids
  `com.anonymous.numerosyletras` (iOS y Android).
- Icono principal cuadrado de **1024×1024**.
- Botón "Donar" oculto en el build personal.
- Audio configurado solo para reproducción en primer plano, sin solicitar acceso al
  micrófono ni declarar servicios que la app no usa.
- Comando de cierre local: `npm run verify` (tipos + Expo Doctor + export de todas las plataformas).
- `tsc` limpio y `expo export` (ios) empaqueta sin errores en todas las fases.

## 🙋 Acciones del owner (solo tú puedes)
1. **Cuenta EAS / login**: en tu terminal `eas login` (o `npx eas login`) y confirmar que el
   proyecto sigue vinculado al `projectId` de `app.json`.
2. **(Opcional) Efectos de audio**: soltar `correct.mp3` / `wrong.mp3` / `celebration.mp3` en
   `assets/music/` y descomentar en `src/services/audio/sounds.ts`.

## 🧑‍💻 Mejoras opcionales posteriores
- [ ] Sustituir el feedback de TTS/háptica por efectos dedicados cuando existan los assets.
- [ ] Añadir Lottie de celebración si llega el asset.

## 📦 Comandos de build (cuando el owner haya hecho login)
- **Android (APK interno)**: `eas build -p android --profile preview`
- **iOS (interno/TestFlight)**: `eas build -p ios --profile preview`
  - Para TestFlight formal: `eas build -p ios --profile production` + `eas submit -p ios`.
- Instalar el APK directamente en Android; en iOS vía TestFlight o dev build.

## Checklist de cierre de Fase 5
- [x] Icono cuadrado + `expo-doctor` 21/21.
- [x] Botón "Donar" oculto.
- [ ] Build de Android (APK) e iOS generados con EAS.
- [ ] Instalada y probada en los dispositivos reales de los niños. 🎉
