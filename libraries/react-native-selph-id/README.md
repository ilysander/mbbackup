
# React-Native SelphID Plugin

## 1. Introducción

En este manual se documenta la configuración y funcionamiento de **FacePhi SelphID ReactNative Widget 1.2.0** en aplicaciones desarrolladas para el entorno React-Native. Se describen:

- Gestión interna de cámaras y resoluciones.
- Asistente en los procesos de captura de la parte frontal y trasera del documento.
- Extracción de la información contenida en el documento.
- Obtención de las imágenes de la parte frontal, trasera y otros datos relevantes.

### 1.1 Versión del widget

La versión del widget se puede consultar de la siguiente manera:

- Buscamos el fichero `package.json` en la raíz del plugin.
- En la etiqueta *version* se indica la versión.

### 1.2 Instalación del plugin

#### 1.2.1 Preparar instalación para iOS

Para la versión de iOS, a la hora de añadir nuestro plugin a la aplicación final, previamente se deberán de tener en cuenta los siguientes puntos:

- ***Añadir podspec del plugin al Podfile.*** En iOS el plugin utiliza un ***podspec*** que instala todo el código nativo, frameworks y recursos necesarios para el funcionamiento del widget. Para hacer uso de este ***podspec*** se deberá añadir en el **Podfile** de la aplicación la siguiente línea:

        pod 'RNSelphidPluginModule', :path => '../node_modules/react-native-selphid-plugin/ios'

    En el ejemplo de programación incluido se puede comprobar un caso práctico.

- ***Deshabilitar el BITCODE.*** Si la aplicación que va a integrar el plugin tiene el BITCODE activado dará un error de compilación. Para evitar que esto ocurra deberá desactivarse el BITCODE:
  - *Desde el proyecto de XCODE.* Simplemente accediendo al menú de `Build Settings`, en la sección `Build Options`, se deberá indicar el parámetro `Enable Bitcode` como `No`.
- ***Añadir permisos de cámara.*** Para usar el widget es necesario indicar el permiso de cámara en el fichero `info.plist`de la aplicación (incluido dentro del proyecto de la carpeta ***ios***). Habrá que editar el fichero con un editor de texto y añadir el siguiente par *clave/valor*:

        <key> NSCameraUsageDescription </key>
        <string>$(PRODUCT_NAME) uses the camera</string>

    O también se puede modificar desde el XCODE accediendo al fichero y añadiendo la siguiente entrada:
    `Key: Privacy - Camera Usage Description`
    `Value: $(PRODUCT_NAME) uses the camera`

#### 1.2.2 Preparar instalación para Android

- La versión de SDK mínima que exigen nuestras librerías nativas es la **17**, por lo que si la aplicación tiene definida una *SDK mínima* inferior, habrá que modificarla para evitar un error de compilación. Para ello, habrá que acceder al `build.gradle`de la aplicación (ubicado en la carpeta ***android***) y modificar el siguiente parámetro:

        buildscript {
            ext {
                minSdkVersion = 17
            }
        }

- En caso de compilar en modo ***debug*** (en modo ***release*** no es necesario), es posible que no se actualice el plugin tras realizar nuevos cambios, por lo que se recomienda ejecutar la siguiente secuencia de instrucciones tras instalar el plugin:

  - `mkdir android/app/src/main/assets`
  - `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
  - `react-native run-android` (o abrir el proyecto con Android Studio y ejecutarlo)

#### 1.2.3 Instalación del plugin

**Nota:** Considerar los siguientes valores:

- `<%PLUGIN_SELPHID_PATH%> = /lib/react-native-selphid-plugin`

Para instalar el plugin se deberán realizar los siguientes pasos:

- Asegurarse de que `@react-native-community/cli` se encuentra instalado:

        npm install @react-native-community/cli

- Es importante comprobar que la ruta al plugin está correctamente definida en el fichero `package.json`:
  
        "dependencies": {
            "react-native-selphid-plugin": <% PLUGIN_SELPHID_PATH %>
        }

- Acceder a <%APPLICATION_PATH%> y ejecutar:
  1. `yarn add <% PLUGIN_SELPHID_PATH %>`
  2. `yarn install`
  3. `cd ios`
  4. `pod install`

Después de ejecutar los pasos anteriores ya se puede lanzar las aplicaciones con el plugin instalado. Para lanzar el proyecto existen dos opciones:

1. Ejecutar desde el terminal los siguientes comandos:
   - `react-native run-android`
   - `react-native run-ios`
  
2. Desde diferentes IDE’s. Los proyectos generados en las carpetas Android y iOS, pueden abrirse,compilarse y depurar utilizando Android Studio y XCode respectivamente.

***

## 2. Configurar el widget

### 2.1. WidgetConfiguration

El paso de argumentos entre la clase principal del proyecto y el plugin realiza mediante una objeto `JSON Object`. A continuación se muestra un ejemplo de inicialización:

	const widgetConfiguration = {
		debug: false,
		showResultAfterCapture: true,
		showTutorial: false,
		scanMode: WidgetSelphidEnums.WidgetScanMode.Search,
		specificData: "ES|<ALL>",
		fullscreen: true,
		locale: ''
	}

A continuación se comentarán todas las propiedades que pueden definirse en este `JSON Object`:

#### 2.2.1. ShowResultAfterCapture (*boolean*)

    showResultAfterCapture: false;

Indica si mostrar o no una pantalla con la imagen capturada del documento después del proceso de análisis. En esta pantalla se le da al usuario la posibilidad de repetir el proceso de captura si la imagen que se obtuvo del documento no fuera correcta.

#### 2.2.2. ScanMode (*WidgetScanMode*)

    scanMode: SelphIDScanMode.Search;

Este enumerado se define en la clase `js/WidgetSelphidEnums.js`. Indica el modo de escaneo OCR de los documentos. Dependiendo de la elección, se escanearán y buscarán varios tipos de documentos o uno en concreto. Este modo puede ser de tres tipos:

- **SelphIDScanMode.Generic**: El modo genérico que permite escanear cualquier tipo de documento independiente del país o el tipo de documento. El resultado de este modo no es tan preciso como los siguientes pero permite escanear varios documentos estándar.
- **SelphIDScanMode.Search**: El modo de búsqueda permitirá utilizar una whitelist y blacklist, y buscará en los documentos que cumplan dichas condiciones. Estas condiciones se indican en la variable "specificData". De este modo se permite realizar la búsqueda acotando el número de plantillas, y haciendo que la búsqueda sea mucho más afinada que en el caso genérico.
- **SelphIDScanMode.Specific**: Búsqueda de un documento específico. Estas condiciones se indican en la propiedad "specificData" que se muestra en lo sucesivo.

#### 2.2.3. SpecificData (*string*)

Esta propiedad permite definir qué documentos se escanearán durante el proceso, en caso de declarar el modo de escaneo (scanMode) a GenericMode, SpecificMode o SearchMode.

Un ejemplo de configuración que permita escanear todos los documentos de nacionalidad española sería el siguiente:

    scanMode: WidgetScanMode.Search;
    specificData: “ES|<ALL>”; // Código ISO de España (ES)

#### 2.2.4. Debug (*bool*)

    debug: false;

Establece el modo de depuración del widget.

#### 2.2.5 Locale (*String*)

    locale: "ES";

Es un string que permite cambiar la localización y el idioma del widget. Ejemplos de valores que pueden tener son los siguientes:

- “es” para español.
- “en” para inglés.
- “fr” para francés.

En definitiva, dependerá del nombre que aparezca en el fichero strings.xml del lenguaje que se desee seleccionar (strings-es.xml, strings-en.xml, strings-fr.xml).

En el zip de recursos, el cual se encuentra dentro de la carpeta strings, se pueden añadir los ficheros strings-xx.xml correspondientes a cada localización que se requiere incorporar en el widget.

#### 2.2.6. FullScreen (*bool*)

    fullscreen: true;

Establece si se desea que el widget se arranque en modo pantalla completa, ocultando el status bar.

#### 2.2.7. DocumentType (*WidgetDocumentType*)

    documentType: SelphIDDocumentType.IDCard;

Este enumerado se define en la clase `js/WidgetSelphidEnums.js`. Especificado en la clase `WidgetDocumentType`:

- **IDCard**: Establece que se capturarán documentos de identidad o tarjetas.
- **Passport**: Establece que se capturarán pasaportes.
- **DriverLicense**: Establece que se capturarán licencias de conducir.
- **CreditCard**: Establece que se capturarán tarjetas de crédito.

#### 2.2.8. TokenImageQuality (*double*)

    tokenFaceImage: 0.9;

Especifica la calidad de compresión del tokenFaceImage.

#### 2.2.9 enableWidgetEventListener (*boolean*)

    enableWidgetEventListener: true
    
Habilita el logueo de eventos que ocurren mientras se esta ejecutando el widget. De ésta manera se puede recolectar información de lo que el usuario esta haciendo. Debe implementarse para que funcione. Véase ejemplo de implementación en el apartado pto 6.   

***

## 3. Ejecutar el widget

Para poder ejecutar el modo pasivo, deberá realizarse la llamada al método `startSelphIDWidget` contenido en la clase `SelphidPlugin` tal y como se especifica a continuación:

    {
      debug: false,
      showResultAfterCapture: true,
      showTutorial: false,
      scanMode: WidgetSelphidEnums.WidgetScanMode.Search,
      specificData: 'PE|<ALL>',
      fullscreen: true,
      locale: '',
    });

### 3.1. onSuccessWizardCapture

Es el evento callback que se ejecuta cuando el widget devuelve un resultado correcto tras la operación de captura. A este callback se retornará un ***JSON Object*** con todas los parámetros resultantes del proceso de captura, en formato clave-valor.

#### 3.2. onErrorWizardCapture

Es el evento que se ejecuta cuando se ha producido un problema durante el proceso de captura en el widget.

### 3.3. WidgetOperation

Este enumerado se define en la clase `js/WidgetSelphidEnums.js`. A la hora de realizar la llamada al widget existe una serie de parámetros que se deben incluir. La clase `SelphIDOperation`, que se encuentra en la contiene los modos de captura que pueden realizarse. Estos son:

- **Front**: El widget queda configurado para realizar la captura de la parte frontal del documento. Devuelve los datos obtenidos en este lado del documento.
- **Back**: El widget queda configurado para realizar la captura de la parte trasera del documento. Devuelve los datos obtenidos en este lado del documento.
- **Wizard**: El widget queda configurado para realizar secuencialmente la captura de la parte frontal del documento y, sin finalizar la ejecución del widget, realizar la captura de la parte trasera. Es el método de captura recomendado.

### 3.4. resourcesPath

Establece el nombre del archivo de recursos que utilizará el widget para su configuración gráfica. Este fichero es customizable y se encuentra en el plugin en la ruta raíz. Su instalación es transparente al usuario, simplemente se añadirá a los proyectos de las respectivas plataformas durante la instalación. En el ***apartado 4*** se explica con más detalle el funcionamiento de este bundle de recursos y cómo modificarlo.

### 3.5. ocrData

Cuando la captura del documento se realiza en 2 llamadas (modo Wizard desactivado), esta propiedad permite pasar un diccionario con la información de la captura previa. De esta manera el widget puede combinar los resultados de ambas lecturas de una manera inteligente y así devolver la información combinada de ambas capturas. También permite al widget calcular un grado de similitud de los datos de ambas caras.

En el caso que la captura de ambas caras del documento se realice en una única llamada esto no es necesario ya que el widget internamente hace este proceso.

### 3.6. config

Es un objeto de la `JSON Object`, que contiene la configuración del widget para el proceso de captura. En el ***apartado 2*** se explica el contenido de este objeto.

### 3.7. widgetLicense

El widget de SelphID está licenciado y para hacer uso de él se requerirá de una licencia (fichero .lic) válida que será otorgada por Facephi. Para hacer uso de esta licencia se deberá pasar el contenido del fichero (ya sea leyéndolo del fichero directamente o copiándolo a una variable en formato ***string***) como parámetro de entrada de la llamada al widget.

***

## 4. Recepción del resultado

### 4.1 Recepción del resultado

Al finalizar la llamada del widget, es posible adquirir toda la información obtenida de la captura del documento (ya sea la parte frontal, trasera o ambas a la vez). Los resultado se devuelven en formato ***JSON Object*** con todos los parámetros que retorna el plugin en formato clave-valor.

Es importante reseñar que la información obtenida en este objeto se devuelve duplicada, mostrándola a su vez en abierto (por ejemplo, frontDocumentImage para la imagen de la captura frontal del documento), como tokenizado y encriptado (por ejemplo, tokenFrontDocumentImage para la imagen de la captura frontal del documento).

Dependiendo del tipo de licencia utilizada se podrán obtener un tipo de parámetros o ambos. La información tokenizada es recomendable utilizarla para enviarla de forma segura al servidor donde esté instalada la SDK de SelphID, mientras que los datos en abierto deben utilizarse únicamente en fases de desarrollo y test.

En caso de que el proceso se haya realizado correctamente, el resultado devolverá lo siguiente:

    {
        finishStatus = SelphIDFinishStatus;
        frontDocumentImage = stringBase64;
        backDocumentImage = stringBase64;
        faceImage = stringBase64;
        rawBackDocumentImage = stringBase64;
        rawFrontDocumentImage = stringBase64;
        signatureImage = stringBase64;
        fingerprintImage = stringBase64;
        tokenOCR = stringBase64;
        tokenFaceImage = stringBase64;
        tokenFrontDocument = stringBase64;
        tokenBackDocument = stringBase64;
        tokenRawFrontDocument = stringBase64;
        tokenRawBackDocument = stringBase64;
        documentData = string;
        errorType = SelphIDErrorType;
        errorMessage = string;
        timeoutStatus = number;
        documentCaptured = string;
    }

Los parámetros recibidos son los siguientes:

- **finishStatus**: Devuelve el diagnóstico global de la operación. Los posibles valores para el tipo de excepción son:
  - **WidgetFinishStatus.CancelByUser**: Excepción que se produce cuando el usuario para la extracción de forma manual.
  - **WidgetFinishStatus.Timeout**: Excepción que se produce cuando transcurre un tiempo máximo sin conseguir finalizar la extracción con éxito.
  - **WidgetFinishStatus.Ok**: Excepción que se produce cuando el widget no tiene permiso de acceso a la cámara.
  - **WidgetFinishStatus.Error**: Se ha producido un error, el cuál se indicará en el enumerado `errorType` y, opcionalmente, se mostrará un mensaje de información extra en la propiedad `errorMessage`.
- **frontDocument/tokenFrontDocument**: La imagen frontal del documento procesada, limpiada y recortada por los bordes y su token correspondiente.
- **backDocument/tokenBackDocument**: La imagen trasera del documento procesada, limpiada y recortada por los bordes y su token asociado.
- **faceImage/tokenFaceImage**: La imagen del rostro que se ha encontrado en el documento, en caso de que exista y su token asociado.
- **matchingSidesScore**: Esta propiedad devuelve un cálculo de la similitud de los datos leídos entre el front y el back del documento. El cálculo se realiza comprobando la similitud entre los campos comunes leídos en ambas caras. El resultado del cálculo será un valor entre 0.0 y 1.0 para el caso de que existan campos comunes en el documento. Cuanto mayor es el valor, más similares son los datos comparados.
Si el cálculo devuelve -1.0 es que el documento no contiene campos comunes o aún no se tiene información de las dos caras.
- **timeoutStatus**: Esta propiedad devuelve el estado en el que se encontraba el proceso de captura cuando el widget terminó. Estos son los posibles valores:

        Front_Detection_None = 0
        Front_Detection_Uncertain = 1
        Front_Detection_Completed = 2
        Front_Document_Analyzed = 3
        Back_Detection_None = 4
        Back_Detection_Uncertain = 5
        Back_Detection_Completed = 6
        Back_Document_Analyzed = 7

  - 0: En la lectura del Front, el widget termino sin poder haber detectado nada. Generalmente cuando no se pone ningún - documento.
  - 1: En la lectura del Front, el widget termino habiendo detectado parcialmente un documento. En este caso algunos de los elementos esperados se han conseguido detectar, pero no todos los necesarios.
  - 2: En la lectura del Front, el widget termino habiendo completado la detección de todos los elementos del documento. Si el widget acaba en este estado es porque el análisis de OCR no se ha podido completar con éxito
  - 3: En la lectura del Front, el widget termino habiendo analizado y extraído todo el OCR del documento. Este es el estado en el que acabaría una lectura correcta del Front de un documento.
  - Los estados del 4 al 7 son exactamente iguales solo que se refieren al resultado del proceso cuando se analiza el back.

- **errorType**: Devuelve el tipo de error que se ha producido (en el caso de que haya habido uno, lo cual se indica en el parámetro `finishStatus` con el valor `error`). Se definen en la clase `WidgetErrorType`. Los valores que puede tener son los siguientes:
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

### 4.2. Diccionario ocrResults

Este diccionario contiene todos los datos detectados en el documento. Las claves de cada campo están codificadas de tal forma que la propia clave contiene información de donde se ha obtenido el valor. Así, por ejemplo, la clave Front/MRZ/DocumentNumber indica el valor del DocumentNumber que se ha leído en el Front del documento y en la región del MRZ. Estas claves dependen del documento capturado y por tanto serán diferentes entre distintos países y modelos de documento.

El diccionario también contiene claves con nombres más genéricos y que no llevan información relativa a la ubicación. Estas claves contienen el dato más completo de todos los leídos para dicho campo.

Estas claves son los siguientes:

FirstName: El valor asociado a esta clave contiene el nombre del usuario.
LastName: El valor asociado a esta clave contiene los apellidos del usuario.
DateOfBirth: El valor asociado a esta clave contiene la fecha de nacimiento detectada en el documento.
Gender: El valor asociado a esta clave contiene el sexo del usuario detectado en el documento.
Nationality: El valor asociado a esta clave contiene la nacionalidad del usuario detectado en el documento.
DocumentNumber: El valor asociado a esta clave contiene el número de documento.
DateOfExpiry: El valor asociado a esta clave contiene la fecha de expiración del documento.
Issuer: El valor asociado a esta clave contiene el editor del documento.
DateofIssue: El valor asociado a esta clave contiene la fecha de expedición del documento.
PlaceOfBirth: El valor asociado a esta clave contiene el lugar de nacimiento del usuario.
Address: El valor asociado a esta clave contiene la dirección detectada en el documento.

***

## 5. Personalización del Widget

El widget permite la personalización de textos, imágenes, fuentes de letra y colores. La personalización se realiza mediante el archivo .zip suministrado con el widget. Este zip está compuesto de un fichero llamado `widget.xml` que contiene la definición de todas las pantallas del widget, cada una de ellas con una serie de elementos los cuales permiten realizar la personalización. El archivo zip también contiene una carpeta con recursos gráficos y otra carpeta con las traducciones de los textos.

### 5.1. Descripción básica

#### 5.1.1. Personalización de textos

La personalización de textos se realiza editando los textos de los archivos de traducciones existentes en el .zip de recursos.

    /strings/strings.es.xml
    /strings/strings.xml

#### 5.1.2. Personalización de imágenes

Para personalizar las imágenes que usa el widget se deben añadir las imágenes en el .zip de recursos. En el zip vienen 3 carpetas:

    /resources/163dpi
    /resources/326dpi
    /resources/489dpi

Estas carpetas corresponden a las diferentes densidades de pantalla y se pueden crear tantas carpetas de densidad como se desee. En estas carpetas están las versiones de las imágenes para cada una de las resoluciones.

Es necesario añadir las imágenes en todas las carpetas, ya que una vez determinada la resolución óptima para el dispositivo, el widget sólo carga imágenes de la carpeta con la resolución elegida.
Las imágenes son referenciadas desde el archivo `widget.xml`.

#### 5.1.3. Personalización de colores

La personalización de los colores de los botones se realiza desde el archivo `widget.xml`. En él se puede personalizar cualquier color de cualquier elemento gráfico que aparece en el widget. Simplemente basta con modificar el color de la propiedad deseada.

#### 5.1.4. Personalización de tipo de fuente

Los archivos de tipografía deben colocarse en la carpeta `/resources/163dpi` y una vez ahí pueden ser referenciados desde el archivo `widget.xml`. Para cambiar el tipo de letra de un elemento de texto bastaría con modificar la propiedad ‘font’ y poner el nombre del archivo correspondiente.

En el siguiente apartado se ampliará la información acerca del contenido del bundle de recursos y el modo de modificar.

### 5.2. Descripción avanzada

#### 5.2.1. Widget.xml

Este fichero contiene la definición de todas las propiedades que son configurables en los procesos de autenticación y registro. Está dividido por pantallas de navegación y dentro de cada etiqueta de pantalla se encuentran todas las propiedades que pueden modificarse.

#### 5.2.2. Carpeta strings

Esta carpeta contiene un fichero `strings.xml` por cada traducción que se desee soportar. El nombre debe estar formado de la siguiente manera:

    strings.(idioma).xml

Siendo (idioma) el código del idioma. Por ejemplo, `strings.es.xml` sería la traducción en castellano, `strings.en.xml` la traducción en inglés, `strings.es_ES.xml` el español de España o `strings.es_AR.xml` el español de Argentina.

Se puede forzar el idioma o dejar que el widget lo escoja en función de la configuración del dispositivo. A la hora de decidir cuál es el idioma a aplicar se sigue el siguiente orden:

- Buscar por código de localización (por ejemplo, “es_AR”).
- Si no encuentra ninguna que coincida, buscaría uno para el idioma genérico (es decir, en este caso sería “es”).
- Si tampoco existiese ningún resultado, entonces usaría el idioma por defecto.

A nivel de código es posible seleccionar la localización mediante la propiedad locale. Este parámetro acepta un string con el código de lenguaje que se desea utilizar (por ejemplo, “es” o “es_ES”).

#### 5.2.3. Carpeta resources

Contiene las carpetas con todos los recursos necesarios para poder modificarse, divididos en densidades. Es obligatorio generar las imágenes en todas las densidades ya que el widget espera encontrarlas en la carpeta correspondiente a la densidad del dispositivo. También se pueden crear nuevas carpetas con la densidad deseada.

#### 5.2.4. Elemento BACKGROUND

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

#### 5.2.5. Elemento BUTTON

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

#### 5.2.6. Elemento TEXT

Los elementos `text` se utilizan para definir el aspecto gráfico de los textos de cada una de las pantallas del widget. Estas son las propiedades que se pueden modificar:

- **color**: define el color del texto.
- **font**: define el tipo de fuente utilizado para mostrar el texto.
- **font_size**: define el tamaño de la fuente.

Hay que tener en cuenta que en la pantalla de resultados del registro los dos textos que definen la calidad del registro tienen forzado su color al color de la barra que indica la puntuación.

#### 5.2.7. Elemento IMAGE

- **value**: define el nombre del archivo que contiene la imagen a mostrar.

Los elementos `image` solo tienen la propiedad que define el archivo donde se encuentra la imagen físicamente en el bundle de recursos. Las imágenes se obtienen del bundle buscando en la carpeta apropiada de acuerdo con la densidad del dispositivo.

#### 5.2.8. Elemento VIDEO

- **value**: define el nombre del archivo que contiene el video a mostrar.

Los elementos `video` solo tienen la propiedad que define el archivo donde se encuentra el video físicamente en el bundle de recursos.

## 6. Implementar enableWidgetEventListener

Se deberá agregar un listener como se muestra en el siguiente ejemplo de programación:

    /* import NativeEventEmitter */
    import { StyleSheet, ScrollView, Platform, NativeEventEmitter } from 'react-native';

    // These params are used for logging purposes. It must be used if the configuration property "enableWidgetEventListener" is true.
    const widgetEmitter = new NativeEventEmitter(RNSelphidPluginModule); // For listening events
    const SELPHID_LOG_EVENT = 'onSelphidLogEvent';

    makeSelphID = async () => {
      try {
        let subscription = widgetEmitter.addListener(
          SELPHID_LOG_EVENT,
          (reminder) => console.log(reminder)
        );

        let license;
        if (Platform.OS === 'ios') {
          license = JSON.stringify(WidgetSelphIDConstants.licenseiOS);
        } else {
          license = JSON.stringify(WidgetSelphIDConstants.licenseAndroid);
        }

        return await RNSelphidPluginModule.startCapture(
          WidgetSelphIDEnums.WidgetOperation.Wizard,
          WidgetSelphIDConstants.SELPHID_RESOURCE_PATH,
          license,
          '', // ocrPreviousResults (tokenOCR)
          this.getPluginConfiguration(),
        )
          .then((result) => {
            // It’s really important to unsubscribe your listeners once they’re not needed anymore or you’ll end up leaking memory. 
            subscription.remove();

            this.processResult(result);
          })
          .catch((error) => {
            // It’s really important to unsubscribe your listeners once they’re not needed anymore or you’ll end up leaking memory. 
            subscription.remove();

            this.setState({
              message: JSON.stringify(error),
              frontDocumentImage: null,
              backDocumentImage: null,
              faceImage: null,
              ocrContent: null,
              showError: true,
              textColorMessage: '#DE2222',
            });
          });
      } catch (error) {
        //alert(JSON.stringify(error));
      }
    };

## 7. Implementar modo startTest

Para poder utilizar el modo test se deberá reemplazar el método startCapture por starTest. Dentro del método, se deberá agregar un nuevo parametro que es el nombre de la imagen a testear, tal como se muestra en el ejemplo de programación:

    makeSelphID = async () => {
      try {
        let license;
        if (Platform.OS === 'ios') {
          license = JSON.stringify(WidgetSelphIDConstants.licenseiOS);
        } else {
          license = JSON.stringify(WidgetSelphIDConstants.licenseAndroid);
        }
        
        //REPLACE startCapture by startTest
        return await RNSelphidPluginModule.startTest(
          WidgetSelphIDEnums.WidgetOperation.Front, //Mode Wizard is not allowed for testing purpose. You need to choose FRONT or BACK
          WidgetSelphIDConstants.SELPHID_RESOURCE_PATH,
          license,
          '', // ocrPreviousResults (tokenOCR)
          this.getPluginConfiguration(),
          'document_test_front.jpg' //new parameter: FILE NAME
        )
          .then((result) => {
            // It’s really important to unsubscribe your listeners once they’re not needed anymore or you’ll end up leaking memory. 
            subscription.remove();

            this.processResult(result);
          })
          .catch((error) => {
            // It’s really important to unsubscribe your listeners once they’re not needed anymore or you’ll end up leaking memory. 
            subscription.remove();

            this.setState({
              message: JSON.stringify(error),
              frontDocumentImage: null,
              backDocumentImage: null,
              faceImage: null,
              ocrContent: null,
              showError: true,
              textColorMessage: '#DE2222',
            });
          });
      } catch (error) {
        //alert(JSON.stringify(error));
      }
    };
    
IMPORTANTE:
La imagenes para la plataforma ANDROID deberán incluirse en la carpeta app/src/main/assets.
Las imagenes para la plataforma IOS deberán incluirse en el COPY BUNDLE RESOURSES 

***

## 8. Información de contacto

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
