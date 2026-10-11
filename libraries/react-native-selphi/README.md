
# React-Native Selphi Plugin

## 1. Introducción

En este manual se documenta la configuración y funcionamiento de **FacePhi Selphi React-Native Widget 1.1.x** en aplicaciones desarrolladas para entorno React-Native. Se describen:

- Propiedades, métodos y comunicación que integran este widget.
- Ejemplos de integración del plugin en una aplicación React-Native.

### 1.1 Versión del widget

La versión del widget se puede consultar de la siguiente manera:

- Buscamos el fichero `package.json` en la raíz del plugin.
- En la etiqueta *version* se indica la versión.

### 1.2 Instalación del plugin

**Nota:** Considerar los siguientes valores:

- `<%PLUGIN_SELPHI_FACE_PATH%> = /lib/react-native-selphi-face-plugin`

Para instalar el plugin se deberán realizar los siguientes pasos:

- Acceder a <%APPLICATION_PATH%> y ejecutar:
  1. `yarn add <% PLUGIN_SELPHI_FACE_PATH %>`
  2. `yarn install`
  3. `cd ios`
  4. `pod install`

Después de ejecutar los pasos anteriores ya se puede lanzar las aplicaciones con el plugin instalado. Para lanzar el proyecto existen dos opciones:

1. Ejecutar desde el terminal los siguientes comandos:
   - `react-native run-android`
   - `react-native run-ios`
  
2. Desde diferentes IDE’s. Los proyectos generados en las carpetas Android y iOS, pueden abrirse,compilarse y depurar utilizando Android Studio y XCode respectivamente.  

#### 1.2.1 Solución de problemas

- Es importante comprobar que la ruta al plugin está correctamente definida en el fichero `package.json`:
  
        "dependencies": {
            "react-native-selphi-face-plugin": <% PLUGIN_SELPHI_FACE_PATH %>
        }

- **Android:** Si ocurren problemas de entorno o no se actualiza el plugin tras realizar nuevos cambios (problemas ocurridos debido a que no se genera correctamente el bundle de Android), ejecutar la siguiente secuencia de instrucciones tras lanzar el plugin:

  - `mkdir android/app/src/main/assets`
  - `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
  - `react-native run-android` (o abrir el proyecto con Android Studio y ejecutarlo)
  
  - **iOS:** Con la nueva actualización del XCODE: Version 12.5. 
    La versión de Flipper/Flipper-Folly clase Distributed_Mutex, que se encuentra en la podfile del example de programación podría fallar. Dando un error sin descripción en el build, pero mencionando que el error es en la mencionada clase.

    - `En el podfile comentar/eliminar la siguiente linea: use_flipper!({ 'Flipper' => '0.74.0' })`
    - `Luego por linea de commando ejecute los siguientes comandos(dentro de la carpeta ios del ejemplo de programación)`
    - `pod deintegrate`
    - `pod install` (o abrir el proyecto con Xcode y ejecutarlo)

***

## 2. API (Interfaz de programación de aplicaciones)

El plugin de Selphi para React-Native contiene una serie de enumerados de Javascript incluidos en la carpeta ***js***, dentro del fichero `WidgetSelphiEnums`, con la API necesaria para la comunicación entre la aplicación y las librerías nativas. A continuación se explican para qué sirve cada una de esos enumerados y el resto de propiedades que afectan al funcionamiento del plugin de Selphi.

### 2.1. Propiedades

A la hora de realizar la llamada al widget existe una serie de parámetros que se deben incluir. A continuación se comentarán brevemente:

#### 2.1.1. WidgetConfiguration

Consiste en un JSON Object que contiene una serie de propiedades que configurarán el funcionamiento del widget. En el apartado **2.2** se explican con de forma más exhaustiva en qué consisten esas propiedades.

#### 2.1.2. ResourcesPath

Establece el nombre del archivo de recursos que utilizará el widget para su configuración gráfica. Este fichero es customizable y se encuentra en el plugin en la ruta *Resources* para la plataforma **iOS** y en la ruta *assets* en el caso de **Android**.

### 2.2. Configuración

El paso de argumentos entre la clase principal del proyecto y el plugin realiza mediante un JSON object:

    const widgetConfiguration = {
        debug: false,
        fullscreen: true,
        locale: 'ES',
        enableWritePermissions: true,
        crop: false,
        cropPercent: 1.0,
        sceneTimeout: 0.0,
        enableImages: false,
        livenessMode: WidgetSelphiEnums.WidgetLivenessMode.PassiveMode,
        frontalCameraPreferred: true,
        stabilizationMode: true
    };

A continuación se comentarán todas las propiedades que pueden definirse en este objeto `WidgetConfiguration`:

> **Nota:** Todos los enumerados se encuentran definidos en el fichero *js/WidgetSelphiEnums.js*

#### 2.2.1. Crop (*boolean*)

    crop: false

Indica si las imágenes devueltas en el evento de finalización contienen sólo la zona de la cara detectada, con una ampliación dada por “CropPercent” o por el contrario se devuelve la imagen entera.

#### 2.2.2. CropPercent (*float*)

    cropPercent: 1.0

Especifica el porcentaje que se amplía la zona de la cara detectada para componer la imagen que se devuelve.

#### 2.2.3. Debug (*boolean*)

    debug: false

Establece el modo de depuración del widget.

#### 2.2.4. LivenessMode (*string*)

    livenessMode: WidgetSelphiEnums.WidgetLivenessMode.PassiveMode

Establece el modo liveness del widget. Los valores permitidos son:

- **LIVENESS_NONE**: Indica que no debe activarse el modo detección de foto en los procesos de autenticación.
- **LIVENESS_PASSIVE**: Indica que la prueba de vida pasiva se realiza en el servidor, enviando para tal fin la “BestImage” correspondiente.

#### 2.2.5. StabilizationMode (*boolean*)

    stabilizationMode: true

Propiedad que permite activar o desactivar el modo de estabilizado previo al proceso de detección facial. En caso de estar activado dara unas directrices para saber si está correctamente ubicado o no.

#### 2.2.6. UTags (*string*)

    uTags: string

Establece 4 bytes formateados a string base64 con datos que pueden ser configurados por la aplicación principal y que serán incorporados a las plantillas generadas por el extractor.

#### 2.2.7 Locale (*string*)

    locale: 'ES'

Fuerza al widget a utilizar la configuración de idioma indicado por el parámetro locale.
Este parámetro acepta tanto un código de idioma (p. ej. *en*) como un código de identificación regional (p. ej. *en_US*). Si el archivo de recursos del widget no tuviera una localización para el *locale* seleccionado su configuración pasaría a utilizar el idioma por defecto.

#### 2.2.8. FullScreen (*boolean*)

    fullscreen: true

Establece si se desea que el widget se arranque en modo pantalla completa, ocultando el status bar.

#### 2.2.9. EnableImages (*boolean*)

     enableImages: false

Indica si el widget devuelve a la aplicación las imágenes utilizadas durante la extracción o no. Se debe tener en cuenta que devolver las imágenes puede acarrear un aumento considerable en el uso de los recursos del dispositivo.

#### 2.2.10 FrontalCameraPreferred (*boolean*)

    frontalCameraPreferred: true

Propiedad que permite seleccionar la cámara frontal como cámara preferida.

#### 2.2.11 JPGQuality (*float*)

    jpgQuality: 0.95

Propiedad que permite establecer un porcentaje de calidad a la imagen de retorno (bestImage). El valor debe estar entre 0 y 1 (float).

#### 2.2.12 sceneTimeout (*float*)

    public void setSceneTimeout(float timeout)

Establece un valor de timeout en segundos para cada escena del widget.

#### 2.2.13 enableGenerateTemplateRaw (*boolean*)

    enableGenerateTemplateRaw: true
    
Fuerza el llamado del método generateTemplateRaw. Retornando el resultado en el parámetro bestImageTemplateRaw.

#### 2.2.14 enableWidgetEventListener (*boolean*)

    enableWidgetEventListener: true
    
Habilita el logueo de eventos que ocurren mientras se esta ejecutando el widget. De ésta manera se puede recolectar información de lo que el usuario esta haciendo. Debe implementarse para que funcione. Véase ejemplo de implementación en el apartado pto 6.   

## 3. Integración del plugin React-Native

### 3.1 Llamada al widget en modo Liveness Pasivo

Para poder ejecutar el modo pasivo, deberá realizarse la llamada al método StartWidget contenido en el espacio de nombres RNSelphiFacePluginModule, tal y como se especifica a continuación:

    await RNSelphiFacePluginModule.startExtraction(
        'fphi-selphi-widget-resources-selphi-live-1.2',
        {
          debug: false,
          fullscreen: true,
          locale: 'ES',
          enableWritePermissions: true,
          crop: false,
          cropPercent: 1.0,
          sceneTimeout: 0.0,
          enableImages: false,
          livenessMode: WidgetSelphiEnums.WidgetLivenessMode.PassiveMode,
          frontalCameraPreferred: true,
        },
      ).then(result => {
        this.processResult(result);
        })
     .catch(error => {
        alert(JSON.stringify(error));
       });

Para poder hacer uso de esta llamada, se necesita realizar los siguientes imports:

    import RNSelphiFacePluginModule from 'react-native-selphi-face-plugin';
    import * as WidgetSelphiEnums from 'react-native-selphi-face-plugin/js/WidgetSelphiEnums';

### 3.2 Resultado de la llamada al widget en Modo Pasivo

Tal y como se muestra en el ejemplo anterior, los resultados se devuelven mediante *Promesas* en forma de JSON Object, ya sea una operación satisfactoria y error:

    .then(result => {
        this.successProcess(result);
        })
     .catch(error => {
        alert(JSON.stringify(error));
    });

En caso de que el proceso se haya realizado correctamente, el resultado devolverá lo siguiente:

    {
        finishStatus: WidgetSelphiEnums.WidgetFinishStatus,
        template: stringBase64,
        images: Array(stringBase64),
        errorType: WidgetSelphiEnums.WidgetErrorType,
        errorMessage: string,
        templateRaw: stringBase64,
        bestImage: stringBase64,
        bestImageCropped: stringBase64,
        eyeGlassesScore: double,
        templateScore: double,
        qrData: string
    }

Los parámetros recibidos son los siguientes:

- **finishStatus**: Devuelve el diagnóstico global de la operación. Los posibles valores para el tipo de excepción son:
  - **WidgetFinishStatus.StoppedManually**: Excepción que se produce cuando el usuario para la extracción de forma manual.
  - **WidgetFinishStatus.Timeout**: Excepción que se produce cuando transcurre un tiempo máximo sin conseguir finalizar la extracción con éxito.
  - **WidgetExceptionType.Ok**: Excepción que se produce cuando el widget no tiene permiso de acceso a la cámara.
  - **WidgetExceptionType.Error**: Se ha producido un error, el cuál se indicará en el enumerado `errorType` y, opcionalmente, se mostrará un mensaje de información extra en la propiedad `errorMessage`.
- **template**: Devuelve la plantilla de usuario que se genera después del proceso de extracción.
- **templateRaw**: Devuelve la plantilla en bruto que se genera después del proceso de extracción.
- **images**: Si el flag `enableImages` se activó en la configuración, devuelve las imágenes que se obtienen durante el proceso de extracción. Las imágenes se devuelven ordenadas por el instante de tiempo en el que se obtuvieron.
- **errorType**: Devuelve el tipo de error que se ha producido (en el caso de que haya habido uno, lo cual se indica en el parámetro `finishStatus` con el valor `error`). Los valores que puede tener son los siguientes:
  - **UnknownError**. Error no gestionado. Posiblemente causado por un error en el bundle de recursos.
  - **NoError**: No ha ocurrido ningún error. El proceso puede continuar.
  - **CameraPermissionDenied**: Excepción que se produce cuando el widget no tiene permiso de acceso a la cámara.
  - **SettingsPermissionDenied**: Excepción que se produce cuando el widget no tiene permiso de acceso a la configuración del sistema (*deprecated*).
  - **HardwareError**: Excepción que surge cuando existe algún problema de hardware del dispositivo, normalmente causado porque los recursos disponibles son muy escasos.
  - **ExtractionLicenseError**: Excepción que ocurre cuando ha habido un problema de licencias en el servidor.
  - **UnexpectedCaptureError**: Excepción que ocurre durante la captura de frames por parte de la cámara.
  - **ControlNotInitializedError**: El configurador del widget no ha sido inicializado.
  - **BadExtractorConfiguration**: Problema surgido durante la configuración del widget.
- **errorMessage**: Indica un mensaje de error adicional en caso de ser necesario. Es un valor opcional.
- **bestImage**: Devuelve la mejor imagen extraída del proceso de registro o autenticación. Esta imagen es la imagen con el tamaño original extraída de la cámara.
- **bestImageCropped**: Devuelve una imagen recortada centrada en la cara del usuario. Esta imagen se obtiene a partir de la “bestImage”. Ésta es la imagen que se deberá utilizar como imagen característica del usuario que realizó el proceso de registro o autenticación a modo de ‘avatar’
- **eyeGlassesScore**: Devuelve la puntuación de la calidad del template.
- **templateScore**: Devuelve la puntuación de la probabilidad de que el usuario use gafas.
- **qrData**: Devuelve los datos del código QR capturado.
- **bestImageTemplateRaw**: Parámetro opcional. Solo visible si se setea el parámetro enableGenerateTemplateRaw en true. El widget devolverá el `templateRaw` en formato ***stringBase64***.

### 3.3 Llamada al método generateTemplateRaw

Genera un `templateRaw` a partir de una imagen URI (con cabecera) o una imagen en formato ***stringBase64***. El plugin la transforma a imagen nativa (***Bitmap*** en **Android** y ***UIImage*** en **IOS**) y se la envía al widget para generar el `templateRaw`. El widget devolverá el `templateRaw` en formato ***stringBase64***. Esta llamada es estática por lo que no requiere configuración del widget. Para realizar la llamada se debe ejecutar el siguiente código:

    await RNSelphiFacePluginModule.generateTemplateRaw(stringBase64Image)
    .then(result => {
        this.processResult(result);
        })
     .catch(error => {
        alert(JSON.stringify(error));
       });

***

## 4. Personalización del Widget

El widget permite la personalización de textos, imágenes, fuentes de letra y colores. La personalización se realiza mediante el archivo .zip suministrado con el widget. Este zip está compuesto de un fichero llamado `widget.xml` que contiene la definición de todas las pantallas del widget, cada una de ellas con una serie de elementos los cuales permiten realizar la personalización. El archivo zip también contiene una carpeta con recursos gráficos y otra carpeta con las traducciones de los textos.

### 4.1. Descripción básica

#### 4.1.1. Personalización de textos

La personalización de textos se realiza editando los textos de los archivos de traducciones existentes en el .zip de recursos.

    /strings/strings.es.xml
    /strings/strings.xml

#### 4.1.2. Personalización de imágenes

Para personalizar las imágenes que usa el widget se deben añadir las imágenes en el .zip de recursos. En el zip vienen 3 carpetas:

    /resources/163dpi
    /resources/326dpi
    /resources/489dpi

Estas carpetas corresponden a las diferentes densidades de pantalla y se pueden crear tantas carpetas de densidad como se desee. En estas carpetas están las versiones de las imágenes para cada una de las resoluciones.

Es necesario añadir las imágenes en todas las carpetas, ya que una vez determinada la resolución óptima para el dispositivo, el widget sólo carga imágenes de la carpeta con la resolución elegida.
Las imágenes son referenciadas desde el archivo `widget.xml`.

#### 4.1.3. Personalización de colores

La personalización de los colores de los botones se realiza desde el archivo `widget.xml`. En él se puede personalizar cualquier color de cualquier elemento gráfico que aparece en el widget. Simplemente basta con modificar el color de la propiedad deseada.

#### 4.1.4. Personalización de tipo de fuente

Los archivos de tipografía deben colocarse en la carpeta `/resources/163dpi` y una vez ahí pueden ser referenciados desde el archivo `widget.xml`. Para cambiar el tipo de letra de un elemento de texto bastaría con modificar la propiedad ‘font’ y poner el nombre del archivo correspondiente.

En el siguiente apartado se ampliará la información acerca del contenido del bundle de recursos y el modo de modificar.

### 4.2. Descripción avanzada

#### 4.2.1. Widget.xml

Este fichero contiene la definición de todas las propiedades que son configurables en los procesos de autenticación y registro. Está dividido por pantallas de navegación y dentro de cada etiqueta de pantalla se encuentran todas las propiedades que pueden modificarse.

#### 4.2.2. Carpeta strings

Esta carpeta contiene un fichero `strings.xml` por cada traducción que se desee soportar. El nombre debe estar formado de la siguiente manera:

    strings.(idioma).xml

Siendo (idioma) el código del idioma. Por ejemplo, `strings.es.xml` sería la traducción en castellano, `strings.en.xml` la traducción en inglés, `strings.es_ES.xml` el español de España o `strings.es_AR.xml` el español de Argentina.

Se puede forzar el idioma o dejar que el widget lo escoja en función de la configuración del dispositivo. A la hora de decidir cuál es el idioma a aplicar se sigue el siguiente orden:

- Buscar por código de localización (por ejemplo, “es_AR”).
- Si no encuentra ninguna que coincida, buscaría uno para el idioma genérico (es decir, en este caso sería “es”).
- Si tampoco existiese ningún resultado, entonces usaría el idioma por defecto.

A nivel de código es posible seleccionar la localización mediante la propiedad locale. Este parámetro acepta un string con el código de lenguaje que se desea utilizar (por ejemplo, “es” o “es_ES”).

#### 4.2.3. Carpeta resources

Contiene las carpetas con todos los recursos necesarios para poder modificarse, divididos en densidades. Es obligatorio generar las imágenes en todas las densidades ya que el widget espera encontrarlas en la carpeta correspondiente a la densidad del dispositivo. También se pueden crear nuevas carpetas con la densidad deseada.

#### 4.2.4. Elemento BACKGROUND

El elemento `background` se compone de 4 segmentos a los que se puede dar color independientemente:

- **top**: define el color de fondo el segmento o panel superior.
- **middle_top**: define el color de fondo del segmento o panel donde está situada la imagen de la cámara.
- **middle_bottom**: define el color de fondo el segmento o panel situado debajo de la imagen de la cámara.
- **bottom**: define el color de fondo el segmento o panel inferior.

También se pueden configurar ciertas propiedades que se usan solo en pantallas específicas. A continuación, las enumeramos haciendo referencia a las pantallas en la que son utilizadas:

- **pagination_separator (RegistrationTips, FaceMovementTips)**: define el color de la separación entre el panel inferior y el panel de debajo de la cámara.
- **mirror_border_color (RegistrationTips, FaceMovementTips)**: define el color del borde del círculo que rodea a la imagen de la cámara o del video de los consejos de registro. A este elemento también se le llama mirror o espejo.
- **mirror_border_width (RegistrationTips, FaceMovementTips)**: define el ancho del borde del círculo que rodea a la imagen de la cámara o del video de los consejos de registro. Si no deseáramos mostrar un borde, tendríamos que asignar un valor de 0.0 a esta propiedad.
- **mirror_mist_color (StartExtractor)**: define el color del círculo central en la pantalla previa a la extracción. Este color deberá tener siempre un valor de transparencia ya que debemos dejar ver la imagen de la cámara para que el usuario pueda colocarse correctamente antes de empezar con la extracción. El formato del color cuando se incluye un valor de transparencia es RGBA (El valor de alpha se indicará con el último byte).
- **mirror_color (Results)**: define el color de fondo del círculo que muestra los resultados del proceso de registro.

#### 4.2.5. Elemento BUTTON

- **background**: define el color de fondo el botón
- **decorator**: define el color de la sombra del botón
- **foreground**: define el color de la fuente del botón en caso de que el contenido sea un texto
- **content_type**: define el tipo de contenido del botón. Existen 2 tipos diferentes:
- **resource_id**: Content debe contener el nombre de un archivo en el bundle de recursos
- **text_id**: Content debe contener el identificador de un literal del fichero de traducciones del bundle de recursos
- **content**: define el contenido del botón. Puede ser tanto una imagen como el identificador de un literal.
- **align**: Define la alienación del contenido del botón, ya sea una imagen o un texto
- **font**: Define el tipo de letra utilizado si el contenido del botón es un texto
- **font_size**: Define el tamaño de la letra si el contenido del botón es un texto

#### 4.2.6. Elemento TEXT

Los elementos `text` se utilizan para definir el aspecto gráfico de los textos de cada una de las pantallas del widget. Estas son las propiedades que se pueden modificar:

- **color**: define el color del texto.
- **font**: define el tipo de fuente utilizado para mostrar el texto.
- **font_size**: define el tamaño de la fuente.

Hay que tener en cuenta que en la pantalla de resultados del registro los dos textos que definen la calidad del registro tienen forzado su color al color de la barra que indica la puntuación.

#### 4.2.7. Elemento IMAGE

- **value**: define el nombre del archivo que contiene la imagen a mostrar.

Los elementos `image` solo tienen la propiedad que define el archivo donde se encuentra la imagen físicamente en el bundle de recursos. Las imágenes se obtienen del bundle buscando en la carpeta apropiada de acuerdo con la densidad del dispositivo.

#### 4.2.8. Elemento VIDEO

- **value**: define el nombre del archivo que contiene el video a mostrar.

Los elementos `video` solo tienen la propiedad que define el archivo donde se encuentra el video físicamente en el bundle de recursos.

***

## 5. Requisitos

### 5.1. Requisitos mínimos para entorno Android

Para la correcta integración del widget de reconocimiento facial en un dispostivo Android, es necesario disponer de la siguiente versión del sistema operativo Android:

- API level 14 (Android 4.0)

En cuanto a la arquitectura del dispositivo móvil:

- armeabi-v7, x86, arm64 y x64

***

## 6. Implementacion del atributo enableWidgetEventListener

Se deberá agregar un listener como se muestra en el siguiente ejemplo de programación:

    // These params are used for logging purposes. It must be used if the configuration property "enableWidgetEventListener" is true.
    const widgetEmitter = new NativeEventEmitter(RNSelphiFacePluginModule); // For listening events
    const SELPHI_LOG_EVENT = 'onSelphiLogEvent';

    makeSelphi = async () => {
      try {
        console.log("starting...");
        /* init listener */
        const subscription = widgetEmitter.addListener(
          SELPHI_LOG_EVENT,
          (reminder) => console.log(reminder)
        );
        /* end listener */
        
        return await RNSelphiFacePluginModule.startExtraction(
          'fphi-selphi-widget-resources-selphi-live-1.2',
          {
            debug: false,
            fullscreen: true,
            enableImages: false,
            livenessMode: WidgetSelphiEnums.WidgetLivenessMode.PassiveMode,
            frontalCameraPreferred: true,
            enableWidgetEventListener: true,
          },
        )
          .then((result) => {
            // Don't forget to unsubscribe, typically in componentWillUnmount
            subscription.removeAllListeners();
            this.processResult(result);
          })
          .catch((error) => {
            // Don't forget to unsubscribe, typically in componentWillUnmount
            subscription.removeAllListeners();
            this.setState({
              message: JSON.stringify(error),
              bestImage: null,
              showError: true,
              textColorMessage: '#DE2222',
            });
          })
      } catch (error) {
        console.log(JSON.stringify(error));
      }
    };

## 7. Información de contacto

Para cualquier consulta general, por favor, póngase en contacto con nosotros a través de las siguientes vías:

- info@facephi.com
- <http://www.facephi.com>
- Avenida México, 20. Alicante 03008. España.
- (+34) 965 10 80 08

Si quiere realizar consultas comerciales, utilice los medios facilitados a continuación:

- sales@facephi.com
- (+34) 965 10 80 08

Ante cualquier duda técnica, sugerencia o reporte, contacte a través de:

- support@facephi.com
- (+34) 965 10 80 08

Si desea realizar o hacernos llegar cualquier tipo de sugerencia o detecta algún tipo de error, contacte a través de:

- feedback@facephi.com
- (+34) 965 10 80 08
