# Números y Letras

App educativa infantil, offline y de uso familiar para practicar lectoescritura y
matemáticas básicas en español.

## Versión 1.0

- Letras: niveles 1-3 (vocales y fonética).
- Números: niveles 1-10 (conteo, reconocimiento, orden, comparación y operaciones).
- Perfiles independientes con progreso y estrellas persistidos en el dispositivo.
- Instrucciones por voz, feedback háptico y música; funciona sin conexión.
- Distribución privada mediante EAS Build (APK/TestFlight), sin monetización ni analytics.

## Desarrollo

Requisitos: Node.js, npm y las herramientas/plataformas que requiera Expo.

```bash
npm ci
npm start
```

Antes de generar una build:

```bash
npm run verify
```

Ese comando valida TypeScript y la configuración Expo, y exporta iOS, Android y web.
Las comprobaciones de Expo Doctor necesitan conexión a internet.

## Builds privadas

```bash
# APK interno
npx eas build -p android --profile preview

# iOS interno
npx eas build -p ios --profile preview

# Producción / TestFlight
npx eas build -p ios --profile production
```

La configuración y el checklist de entrega están en
[`docs/PHASE5_PREP.md`](docs/PHASE5_PREP.md). El alcance y los siguientes pasos viven
en [`docs/ROADMAP.md`](docs/ROADMAP.md).
