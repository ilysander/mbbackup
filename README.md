Mibanco Móvil
=============

Aplicación Móvil de mibanco.

# Configuración

El proyecto esta desarrollado en **react-native** y los pasos a seguir para preparar el proyecto estan en la guía oficial: https://facebook.github.io/react-native/docs/getting-started

# Requerimientos

Para poder ejecutar el proyecto se necesita lo siguiente:

- NodeJS 10
- NVM
- Yarn
- Watchman
- Xcode
- Cocoapods
- Openjdk8
- Android SDK
- Android Studio
- react-native-cli
- firebase-tools
- bundle (ruby)

Se recomienda usar `macOS` para el desarrollo en android e iOS pero se puede usar `Linux` tambien si solo se desea desarrollar en android.

> Para más información de como instalar las dependencias en `macOS` puedes ir al documento [Pase a producción > Instalar Dependencias en MacOS ](/RELEASE.md) 

# Desarrollo

## Preparación

Antes de comenzar a desarrollar se tiene que crear el archivo `src/Config.tsx`, lo puedes hacer basandote en los archivos plantilla que se encuentran en la misma carpeta.

- `Config.tsx-automation`: configuración para automatización.
- `Config.tsx-demo`: configuración para pruebas.
- `Config.tsx-dev`: configuración para el ambiente de desarrollo.
- `Config.tsx-empty`: configuración para producción que se usa cuando se tiene `firebase remote config`.
- `Config.tsx-qa`: configuración para QA.
- `Config.tsx-release`: configuración para producción.

> Si no tienes ningún ambiente de desarrollo disponible puedes usar `Config.tsx-demo` como plantilla ya que no requiere ningún servidor para funcionar.

## Ejecución

1. Antes de ejecutar el proyecto primero se debe instalar las dependencias

```bash
yarn
```

2. Para ejecutar el proyecto primero se debe iniciar el **packager**

```bash
yarn start
```

2. En otra ventana, ejecuta el proyecto en Android ó iOS

```bash
yarn android
```
ó
```bash
yarn ios
```

# Compilación

## Preparación

Antes de comenzar a compilar se tiene que crear el archivo `.env`, lo puedes hacer basandote en la plantilla `.env-dist`.


- DexGuard (Android)

Si se requiere usar `DexGuard` se tiene que configuar `DEXGUARD_ENABLE=true` y completar `DEXGUARD_LIBS` y `DEXGUARD_LICENSE`

- IxGuard (iOS)

Si se requiere usar `IxGuard` se tiene que configuar `IXGUARD_ENABLE=true` y completar `IXGUARD_LICENSE`

 - JSCrambler (Android e iOS)

Si se requiere usar `JSCrambler` se tiene que configuar `JSCRAMBLER_ENABLE=true` y asegurarse de tener conexión al servicio de `JSCrambler`

 - Slack

`SLACK_URL` es opcional y sirve para notificar al slack cuando se ejecute una compilación.

 - Artifact Dir

`ARTIFACT_DIR` es opcional y sirve como destino para guardar los archivos que se generen.

 - Nexus: `NEXUS_*`

`NEXUS_URL` es opcional y sirve como destino para subir los archivos que se generen.

 - Keystore: `RELEASE_*`

Todas las variables `RELEASE_*` son requeridas si vas ha realizar una compilación para android.

 - Maven: `MAVEN_*`

Todas las variables `MAVEN_*` son requeridas si vas ha realizar una compilación para android.


### Ejemplo de archivo 

```bash
BUILD_ID=100

NEXUS_URL=https://nexus.server.com
NEXUS_USERNAME=usuario
NEXUS_PASSWORD="123456"

RELEASE_STORE_FILE=/home/user/keys/app.keystore
RELEASE_KEY_ALIAS=app
RELEASE_STORE_PASSWORD="123456"
RELEASE_KEY_PASSWORD="123456"

MAVEN_REPO_URL=https://nexus.server.com/repository/app
MAVEN_REPO_USERNAME=mbnexus
MAVEN_REPO_PASSWORD="123456"

DEXGUARD_ENABLE=false
DEXGUARD_LIBS=/home/user/guardsquare/DexGuard-8.5.08/lib
DEXGUARD_LICENSE=/home/user/guardsquare/dexguard-license.txt

IXGUARD_ENABLE=false
IXGUARD_LICENSE=/home/user/guardsquare/ixguard-license.txt

JSCRAMBLER_ENABLE=false

ARTIFACT_DIR=/home/user/artifacts

SLACK_URL=https://hooks.slack.com/services/TOKEN/TOKEN/TOKEN

```

## Compilación

1. Para compilar el proyecto primero se instalaran las dependencias

```bash
bundle install
```

2. Luego ejecutar fastlane

```bash
bundle exec fastlane
```

El comando te mostrará una lista como la siguiente donde tendrás que elegir el número a ejecutar, luego se ejecutará todo el proceso de compilación.

```
+--------+--------------------------+-------------------------------------------+
|                            Available lanes to run                             |
+--------+--------------------------+-------------------------------------------+
| Number | Lane Name                | Description                               |
+--------+--------------------------+-------------------------------------------+
| 1      | ios typescript           | Typescript                                |
| 2      | ios jscrambler           | Download last source maps from jscrambler |
| 3      | ios build_dev            | Build DEV IPA                             |
| 4      | ios build_demo           | Build Demo IPA                            |
| 5      | ios build_qa             | Build QA IPA                              |
| 6      | ios build_automation     | Build Automation IPA                      |
| 7      | ios build_release        | Build Release IPA                         |
| 8      | ios build_release_qa     | Build Release QA IPA                      |
| 9      | android typescript       | Typescript                                |
| 10     | android jscrambler       | Download last source maps from jscrambler |
| 11     | android build_dev        | Build DEV APK                             |
| 12     | android build_demo       | Build Demo APK                            |
| 13     | android build_qa         | Build QA APK                              |
| 14     | android build_automation | Build Automation APK                      |
| 15     | android build_release    | Build Release Bundle                      |
| 16     | android build_release_qa | Build Release QA APK                      |
| 0      | cancel                   | No selection, exit fastlane!              |
+--------+--------------------------+-------------------------------------------+
[09:35:23]: Which number would you like run?
```

> Para poder compilar en `iOS` se requiere tener los `provisión profiles` y `certificados` configurados correctamente en la maquina donde se ejecute el script.

Si se desea ejecutar un comando directamente, se puede usar el siguiente comando:

```bash
bundle exec fastlane android build_demo
```

Donde `android build_demo` sería el nombre de la tarjeta a ejecutar.