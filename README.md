<p align="center">
  <img src="assets/images/logo-splash-icon.png" width="180" alt="Logo de Números y Letras" />
</p>

# Números y Letras

App educativa infantil para practicar lectoescritura y matemáticas básicas en
español. Está diseñada para uso familiar: funciona sin conexión, no tiene anuncios,
cuentas externas, analytics ni monetización.

## Qué incluye la v1

| Módulo | Contenido |
| --- | --- |
| Letras | 3 niveles de vocales, reconocimiento visual y fonética |
| Números | 10 niveles de conteo, reconocimiento, secuencias, comparación, suma y resta |
| Perfiles | Un perfil por niño, con avatar, tema y progreso independiente |
| Progreso | Desbloqueo de niveles, estrellas e historial persistidos en el dispositivo |
| Experiencia | Instrucciones por voz, háptica, música, animaciones y tres vidas por nivel |

Las actividades están dirigidas por datos: un mismo motor interpreta el currículo y
presenta cada ejercicio. Esto permite añadir contenido sin crear una pantalla distinta
para cada nivel.

## Stack

- Expo SDK 56, React Native 0.85 y TypeScript.
- Expo Router con navegación basada en `Stack`.
- Zustand y AsyncStorage para perfiles y progreso local.
- Reanimated, Expo Speech, Expo Audio y Expo Haptics.

## Ejecutar en local

Requisitos: Node.js, npm y un entorno compatible con Expo.

```bash
git clone https://github.com/JasubiPL/letras-y-nuemros.git
cd letras-y-nuemros
npm ci
npm start
```

Desde el menú de Expo puedes abrir la app en Android, iOS o web. También están
disponibles estos comandos:

| Comando | Acción |
| --- | --- |
| `npm run android` | Ejecuta el proyecto nativo de Android |
| `npm run ios` | Ejecuta el proyecto nativo de iOS |
| `npm run web` | Inicia la versión web |
| `npm run typecheck` | Comprueba los tipos de TypeScript |
| `npm run doctor` | Valida dependencias y configuración de Expo |
| `npm run build:verify` | Exporta Android, iOS y web en modo producción |
| `npm run verify` | Ejecuta todas las comprobaciones anteriores |

> Expo Doctor consulta la API de Expo y necesita conexión a internet.

## Builds privadas

El proyecto se distribuye de forma privada mediante EAS Build. Antes de compilar:

```bash
npm run verify
npx eas login
```

Después puedes generar las builds configuradas en [`eas.json`](eas.json):

```bash
# APK interno para Android
npx eas build -p android --profile preview

# Distribución interna para iOS
npx eas build -p ios --profile preview

# Build de producción para TestFlight
npx eas build -p ios --profile production
```

## Privacidad y funcionamiento offline

Todo el currículo y los recursos viven dentro de la aplicación. Los perfiles y el
progreso se guardan únicamente en el dispositivo mediante AsyncStorage. La app no
necesita acceso al micrófono ni reproducción de audio en segundo plano.

## Documentación

- [`docs/ROADMAP.md`](docs/ROADMAP.md): fases, alcance actual y estado del trabajo.
- [`docs/TECH_SPEC.md`](docs/TECH_SPEC.md): arquitectura, dominio y currículo.
- [`docs/PHASE5_PREP.md`](docs/PHASE5_PREP.md): checklist de empaquetado y distribución.
- [`docs/EVOLUTIONARY.md`](docs/EVOLUTIONARY.md): mejoras previstas después de la v1.

## Estado del proyecto

La v1 está lista para builds internas. Las siguientes ampliaciones —Letras 4-10,
drag & drop, rutas de aprendizaje y celebraciones más elaboradas— están documentadas
en el backlog evolutivo.

Proyecto privado de uso familiar. © 2026 Jasubip.
