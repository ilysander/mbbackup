Pase a producción
=========================

Este documento define los pasos para realizar un pase a producción.

## Requisitos 

- Código fuente de proyecto - *(https://bitbucket.org/hbmovilmibanco/mibancomovil/downloads/?tab=tags)*
- HomeBrew - https://brew.sh - *(Gestor de Paquetes de MacOS)*.
- MacOS actualizado - *(Servidores)*.
- Acceso a Firebase - *(Seguridad de la información)*.
- Acceso a Google Developer Console - *(Seguridad de la información)*.
- Acceso a Apple Member Center - *(Seguridad de la información)*.
- JWT Key para Firebase - *(Seguridad de la información)*.
- P12 y Passphrase para RSA - *(Seguridad de la información)*.
- Credentials Secret para Firebase y Azure - *(Seguridad de la información)*.
- Release Notes para las tiendas, google y apple - *(PO)*.
- Capturas para las tiendas, google y apple - *(UI)*.


## Instalar Dependencias en MacOS 

Antes de comenzar asegurate de tener instalado lo siguiente:

- **Yarn**

```
brew install yarn
```


- **NodeJS 10**

```bash
brew install node@10
```

luego ejecutar

```bash
ln -sf /usr/local/opt/node@10/bin/node /usr/local/bin/node
```

- **NVM**

```bash
brew install nvm
```

luego asegurate de configurar NVM agregando el siguiente código al final de `~/.zshrc` o la shell que uses.

```
  export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
```

- **Watchman**

```bash
brew install watchman
```

- **Xcode**

Para descargar XCode debes hacerlo desde `App Store` o desde `Apple Developer Downloads`

- **Cocoapods**

```bash
sudo gem install cocoapods
```
- **Openjdk8**
```bash
brew tap AdoptOpenJDK/openjdk
brew cask install adoptopenjdk8
```

- **Android Studio**

```bash
brew cask install android-studio
```

- **BundleTool**

```
brew install bundletool
```

- **react-native-cli**

```bash
npm install -g react-native-cli
```

- **firebase-tools**

```bash
npm install -g firebase-tools
```

## Editar variables de entorno


Asegurate de agregar el siguiente código al final de `~/.zshrc` o la shell que uses.

```bash

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

export ANDROID_HOME=$HOME/Library/Android/sdk

export REACT_EDITOR=/usr/bin/code

export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"
export PATH="/usr/local/bin:$PATH"
export PATH="/usr/bin:$PATH"
export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH

export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm

```


# Compilación

## Preparación

### Preparación de Config.tsx-empty

Se tiene que editar `Config.tsx-empty` y se requiere que *(Seguridad de la información)* ingrese sus credenciales. en las secciones 

```javascript
  rsa: {
    passphrase: 'INGRESA_CLAVE_DE_P12',
    p12: `INGRESA_AQUI_VA_EL_ARCHIVO_P12_EN_BASE_64
SIN
ESPACIOS
EXTRA_A_LA_IZQUIERDA
PERO_CON_SALTOS_DE_LINEA`,
  },
```

### Preparación de .ENV

Antes de comenzar a compilar se tiene que crear el archivo `.env`, lo puedes hacer basandote en la plantilla `.env-dist`.

> Se puede tomar como referencia para este archivo otros que se encuentran en las carpetas de las versiones anteriores. 

Verificar lo siguiente:

- **BUILD_ID**: debes actualizarlo en cada compilación.
- **NEXUS_URL**: debe apuntar a la ruta correcta.
- **MAVEN_REPO_URL**: debe apuntar a la ruta correcta.
- **DEXGUARD_ENABLE**: debe ser `true`.
- **IXGUARD_ENABLE**: debe ser `true`.
- **JSCRAMBLER_ENABLE**: debe ser `true`.
- **ARTIFACT_DIR**: debe apuntar a la ruta correcta.

> Verifica los `*_USERNAME` y `*_PASSWORD` antes de ejecutar.


los campos siguientes los debe llenar Seguridad en caso de no estar llenos *(Seguridad de la información)*

```
RELEASE_STORE_PASSWORD="123456"
RELEASE_KEY_PASSWORD="123456"
```

#### Ejemplo de archivo 

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

DEXGUARD_ENABLE=true
DEXGUARD_LIBS=/home/user/guardsquare/DexGuard-8.5.08/lib
DEXGUARD_LICENSE=/home/user/guardsquare/dexguard-license.txt

IXGUARD_ENABLE=true
IXGUARD_LICENSE=/home/user/guardsquare/ixguard-license.txt

JSCRAMBLER_ENABLE=true

ARTIFACT_DIR=/home/user/artifacts

```


## Compilación

1. Para compilar el proyecto primero se instalaran las dependencias

```bash
bundle install
```

### Android 
1. Ejecutar comando

```bash
bundle exec fastlane android build_release
```

> Al finalizar si todo funciona correctamente en el `ARTIFACT_DIR` apareceran los archivos generados de los cuales para android se necesita el archivo con extensión: `.aab`, ejemplo: `mibancomovil-225-release-06-11-2019_14-44.aab`

### iOS 
1. Ejecutar comando

```bash
bundle exec fastlane ios build_release
```
> Al finalizar si todo funciona correctamente en el `ARTIFACT_DIR` apareceran los archivos generados de los cuales para android se necesita el archivo que termine en: `_ofuscated.ipa`, ejemplo: `mibancomovil-225-release-08-11-2019_11-57_ofuscated.ipa`

## Pruebas

Antes de publicar el archivo es importante realizar una prueba básica para ver si la aplicación puede ejecutarse, esto debido a que es posible que la ofuscación modifique el código y genere un crash que se verá al abrir la aplicación.


### Android

Para probar el archivo `.aab` se debe generar un `.apk` con el siguiente comando.

```bash
bundletool build-apks --bundle=app.aab --output=app.apks --mode=universal
```

Luego renombrar y extraer el archivo con el siguiente comando: 

```bash
mv app.apks app.apks.zip
unzip app.apks.zip
```

instalar el archivo `universal.apk` que se generó en un dispositivo y probar abrir la aplicación,
si es posible probar iniciar sesión y algunos flujos adicionales.



### iOS

- Para probar en iOS se requiere abrir XCode e ir al menú `Window > Organizer`
- En la parte izquierda asegurate de elegir `Mibanco` en la sección `iOS Apps` 
- Luego elegir la última compilación y elegir `Distribute App`.
- Luego elegir `Ad Hoc` y presionar `Next`
- Seguir los pasos de exportar tradicionales hasta guardar el `.ipa` en un directorio.
- Instalar ese `.ipa` en un dispositivo y probar los flujos posibles



## Publicación

Con los archivos generados ya es posible publicar en las tiendas.


### Android 

El archivo `.aab` se usará para publicar en la tienda de google, el proceso es el tradicional, para lo cual puedes seguir la guía: [Documento de publicación - Android](/docs/Documento de publicación - Android.md) 

### iOS

El archivo `*_ofuscated.ipa` se usará para publicar en la tienda de apple, para enviarlo a apple se usa la aplicación `Transporter` la cual debes descargarla desde  `App Store`. Luego iniciar sesión y elegir el `_ofuscated.ipa` para subir. 

El proceso es el tradicional, para lo cual puedes seguir la guía: [Documento de publicación - Android](/docs/Documento de publicación - iOS.md) 

## Cierre

Al final asegurate de borrar las credenciales de los archivos de configuración.