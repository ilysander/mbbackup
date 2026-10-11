
# React-Native Selphi Plugin

## 1. Introduction

This manual documents the configuration and operation of **FacePhi Selphi React-Native Widget 1.1.x** in applications developed for the React-Native environment. Described are:

- Properties, methods and communication that make up this widget.
- Examples of plugin integration in a React-Native application.

### 1.1 Version of the widget

The version of the widget can be consulted in the following way:

- We look for the tab `package.json` in the root of the plugin.
- In the tab *version* the versión is indicated.

### 1.2 Instalation of the plugin

**Nota:** Consider the following values:

- `<%PLUGIN_SELPHI_FACE_PATH%> = /lib/react-native-selphi-face-plugin`

To install the plugin the following steps must be performed:

- Access <%APPLICATION_PATH%> and execute:
  1. `yarn add <% PLUGIN_SELPHI_FACE_PATH %>`
  2. `yarn install`
  3. `cd ios`
  4. `pod install`

After running the above steps you can launch the applications with the plugin installed. To launch the project there are two options:

1. Execute  the following commands from the terminal:
   - `react-native run-android`
   - `react-native run-ios`
  
2. From different IDE’s. Projects generated in the Android and iOS folders can be opened, compiled and debugged using Android Studio and XCode respectively.   

#### 1.2.1 Troubleshooting

- It is important to check that the path to the plugin is correctly defined in the file `package.json`:
  
        "dependencies": {
            "react-native-selphi-face-plugin": <% PLUGIN_SELPHI_FACE_PATH %>
        }

- **Android:** If environment problems occur or the plugin is not updated after making new changes, execute the following sequence of instructions after launching the plugin:

  - `mkdir android/app/src/main/assets`
  - `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
  - `react-native run-android` (or open the project with Android Studio and execute it)

- **iOS:** With the new XCODE update: Version 12.5. 
  The Flipper/Flipper-Folly class Distributed_Mutex, found in the podfile of the programming example, might crash. Giving an error without a description in the build, but mentioning that the error is in the aforementioned class.

  - `In the podfile comment/delete the folowing line: use_flipper!({ 'Flipper' => '0.74.0' })`
  - `Then by command line run the following commands(in the ios folder).`
  - `pod deintegrate`
  - `pod install` (o abrir el proyecto con Xcode y ejecutarlo)
***

## 2. API (Application Programming Interface)

The Selphi plugin for React-Native contains a number of Javascript listings included in the ***js***, within the file `WidgetSelphiEnums`, with the API necessary for the communication between the application and the native libraries. Below is an explanation of what each of those listed are for and the other properties that affect the operation of the Selphi plugin.

### 2.1. Properties

When calling the widget there are a number of parameters that must be included. These will be discussed briefly below:

#### 2.1.1. Mode

Sets the mode in which the widget behaves, having a specific mode for each possible scenario.
The possible modes are defined by the listed `WidgetMode`, and are as follows:

- **Authenticate**: The widget is configured to perform best image and template extraction processes required for authentication.
  
#### 2.1.2. WidgetConfiguration

It consists of a JSON Object that contains a set of properties that will configure the operation of the widget.  In part **2.2** it is explained in more detail what these properties consist of.

#### 2.1.3. ResourcesPath

Sets the name of the resource file the widget will use for its graphical configuration. This file is customizable and can be found in the plugin in the path *Resources* for the platform **iOS** and in the path *assets* in the case of **Android**.

### 2.2. Configuration

The parameter passing between the main class of the project and the plugin is done by a JSON object:

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

Next, all the properties that can be defined in this object `WidgetConfiguration` will be discussed:

> **Nota:** All the enumerations are defined in the file *js/WidgetSelphiEnums.js*

#### 2.2.1. Crop (*boolean*)

    crop: false

Indicates whether the images returned in the completion event contain only the area of the detected face, with a magnification given by “CropPercent” or else the entire image is returned.

#### 2.2.2. CropPercent (*float*)

    cropPercent: 1.0

Specifies the percentage that the area of the detected face is enlarged to compose the image that is returned.

#### 2.2.3. Debug (*boolean*)

    debug: false

Sets the debug mode for the widget.

#### 2.2.4. LivenessMode (*string*)

    livenessMode: WidgetSelphiEnums.WidgetLivenessMode.PassiveMode
	
: Sets the liveness mode of the widget. The allowed values are:

- **LIVENESS_NONE**: Indicates that the photo detection mode should not be enabled in the authentication processes.
- **LIVENESS_PASSIVE**: It indicates that the passive liveness test is performed on the server, sending the corresponding “BestImage” for this purpose.

#### 2.2.5. StabilizationMode (*boolean*)

    stabilizationMode: true

Property that allows the activation or deactivation of the stabilized mode before the face detection process. In the case of it being activated it will give some guidelines to know if it is correctly located or not.

#### 2.2.6. UTags (*string*)

    uTags: string

It sets 4 bytes formatted to string base64 with data that can be configured by the main application and that will be incorporated to the templates generated by the extractor.

#### 2.2.7 Locale (*string*)

    locale: 'ES'

This forces the widget to use the language setting indicated by the locale parameter.
This parameter accepts both a language code (e.g. *en*) such as a regional identification code (e.g. *en_US*). If the widget resource file doesn´t have a location for the *locale* selecting your configuration, it will use the default language.

#### 2.2.8. FullScreen (*boolean*)

    fullscreen: true

Establishes if you want the widget to start in full screen mode, hiding the status bar.

#### 2.2.9. EnableImages (*boolean*)

     enableImages: false

Indicates whether the widget returns to the application the images used during extraction or not. Please note that returning the images may result in a considerable increase in the use of device resources.

#### 2.2.10 FrontalCameraPreferred (*boolean*)

    frontalCameraPreferred: true

Property that allows you to select the front camera as your preferred camera.

#### 2.2.11 JPGQuality (*float*)

    jpgQuality: 0.95

Property that allows setting a percentage of quality to the return image (bestImage). The value must be between 0 and 1 (float).

#### 2.2.12 sceneTimeout (*float*)

    public void setSceneTimeout(float timeout)

Sets a timeout value in seconds for each scene in the widget.

#### 2.2.13 enableGenerateTemplateRaw (*boolean*)

    enableGenerateTemplateRaw: true
    
Forces the call of the generateTemplateRaw method. Returning the result in the bestImageTemplateRaw parameter.

#### 2.2.14 enableWidgetEventListener (*boolean*)

    enableWidgetEventListener: true
    
Enables logging of events that occur while the widget is running. In this way, information about what the user is doing can be collected. It must be implemented for it to work. See implementation example is in section point 6.

## 3. Integration of the React-Native plugin 

### 3.1 Calling the widget in Passive Liveness mode

To be able to run the passive mode,the call to the method StartWidget contained in the name space RNSelphiFacePluginModule must be made, as specified below:

    await RNSelphiFacePluginModule.startExtraction(
        WidgetSelphiEnums.WidgetMode.Authenticate,
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

In order to make use of this call, the following imports need to be made:

    import RNSelphiFacePluginModule from 'react-native-selphi-face-plugin';
    import * as WidgetSelphiEnums from 'react-native-selphi-face-plugin/js/WidgetSelphiEnums';

### 3.2 Passive Mode Widget Call Result

As shown in the example above, the results are returned by *Promesas* in the form of a JSON Object, either a successful operation or an error:

    .then(result => {
        this.successProcess(result);
        })
     .catch(error => {
        alert(JSON.stringify(error));
    });

In the case that the process has been performed correctly, the result will return the following:

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

The parameters received are as follows:

- **finishStatus**: Returns the global diagnosis of the operation. The possible values for the type of exception are:
  - **WidgetFinishStatus.StoppedManually**: Exception that occurs when the user stops the extraction manually.
  - **WidgetFinishStatus.Timeout**: Exception that occurs when a maximum time passes without being able to finish the extraction successfully.
  - **WidgetExceptionType.Ok**: This exception is when the widget is not allowed to access the camera.
  - **WidgetExceptionType.Error**: An error has occurred, which will be indicated in the 'errorType' listing and, optionally, an extra information message will be displayed in the 'errorMessage' property.
- **template**: Returns the user template that is generated after the extraction process.
- **templateRaw**: Returns the raw template generated after the extraction process.
- **images**: If the flag `enableImages` was activated in the setup, it returns the images obtained during the extraction process. The images are returned sorted by the moment in time they were taken.
- **errorType**: Returns the type of error that has occurred (in the case that there has been one, which is indicated in the parameter `finishStatus` with the value `error`). It is defined in the class `WidgetErrorType`. The values it can have are the following:
  - **UnknownError**. Error not managed. Possibly caused by an error in the resource bundle.
  - **NoError**: No error has occurred. The process can continue.  
- **CameraPermissionDenied**: Exception produced when the widget doesn´t have permission to access the camera.
  - **SettingsPermissionDenied**: Exception produced when the widget doesn´t have permission to access the configuration of the system(*deprecated*).
  - **HardwareError**: Exception that arises when there is a hardware problem in the device, usually because the available resources are very scarce.
  - **ExtractionLicenseError**: Exception that occurs when there has been a problem with licences on the server.
  - **UnexpectedCaptureError**: Exception that occurs during the capture of frames by the camera.
  - **ControlNotInitializedError**: The widget configurator has not been initialized.
  - **BadExtractorConfiguration**: A problem has come up during the configuration of the widget. 
- **errorMessage**: Indicates an additional error message if necessary. It is an optional value.
- **bestImage**: Returns the best image extracted from the registration or authentication process. This image is the original size image extracted from the camera.
- **bestImageCropped**: Returns a cropped image centered on the user's face. This image is obtained from the “bestImage”. This is the image that should be used as the characteristic image of the user who performed the registration or authentication process as ‘avatar’
- **eyeGlassesScore**: Returns the score of the template quality.
- **templateScore**: Returns the score for the probability of the user wearing glasses.
- **qrData**: Returns captured QR code data.
- **bestImageTemplateRaw**: Optional parameter. Only visible if the enableGenerateTemplateRaw parameter is set to true. The widget will return the `templateRaw` in ***stringBase64*** format.

### 3.3 Called the generateTemplateRaw method

Generates a `templateRaw` from an URL image (with heading) or an image in format ***stringBase64***. The plugin transforms the native image (***Bitmap*** in **Android** and ***UIImage*** in **IOS**) and sends it to the widget to generate the `templateRaw`. The widget returns the `templateRaw` en formato ***stringBase64***. This call is static so no widget configuration is required. To make the call you must execute the following code:

    await RNSelphiFacePluginModule.generateTemplateRaw(stringBase64Image)
    .then(result => {
        this.processResult(result);
        })
     .catch(error => {
        alert(JSON.stringify(error));
       });

***

## 4. Widget Customization


The widget allows the customization of text, images, fonts and colors. Customization is done through the .zip file provided with the widget. This zip is composed of a file called `widget.xml` that contains the definition of all the screens of the widget, each one of them with a series of elements which allow the customization. The zip file also contains a folder with graphic resources and another folder with the translations of the texts.

### 4.1. Basic description


#### 4.1.1. Text customization

Text customization is done by editing the texts in the existing translation files in the .zip resource.

    /strings/strings.es.xml
    /strings/strings.xml

#### 4.1.2. Image customization

To customize the images that the widget uses, you must add the images to the resource .zip file. In the zip there are 3 folders:

    /resources/163dpi
    /resources/326dpi
    /resources/489dpi

These folders correspond to the different screen densities and you can create as many density folders as you want.  The versions of the images for each of the resolutions are in these folders.

It is necessary to add the images in all the folders because once the optimal resolution for the device has been determined, the widget only loads images from the folder with the chosen resolution.
The images are referenced from the `widget.xml` file.



#### 4.1.3. Color customization

Button color customization is done from the `widget.xml` file. Here you can customize any color of any graphic element that appears in the widget. Simply modify the color of the desired property.

#### 4.1.4. Font type customization

Typography files should be placed in the `/resources/163dpi` 
and once there they can be referenced from the `widget.xml` file. To change the font of a text element, just modify the 'font' property and put the name of the corresponding file.

In the following section we will expand on the content of the resource bundle and how to modify it.

### 4.2. Advanced description

#### 4.2.1. Widget.xml

This file contains the definition of all the properties that are configurable in the authentication and registration processes. It is divided by navigation screens and inside each screen label there are all the properties that can be modified.

#### 4.2.2. Strings folder

This folder contains one `strings.xml` file for each translation you wish to support. The name must be formed as follows:

    strings.(idioma).xml

(idioma) being the language code. For example, `strings.es.xml` would be the translation in Spanish, `strings.en.xml` the translation in English, `strings.es_ES.xml` the Spanish in Spain`strings.es_AR.xml` the Spanish in Argentina.

You can force the language or let the widget choose it depending on the device settings. When deciding which language to apply, the following order is followed:

- Search by localization code (e.g. "es_AR").
- If it doesn't find any that match, it will look for one for the generic language (i.e. in this case it would be "es").
- If there were no results either, then I would use the default language.

At the code level, it is possible to select the localization through the locale property. This parameter accepts a string with the language code you want to use (for example, “es” o “es_ES”).

#### 4.2.3. Resources folder

It contains the folders with all the necessary resources to be able to modify them, divided in densities. It is mandatory to generate the images in all densities since the widget expects to find them in the folder corresponding to the density of the device. It is also possible to create new folders with the desired density.

 #### 4.2.4. BACKGROUND element 


The `background` element consists of 4 segments that can be colored independently:

- **top**: defines the background color of the upper segment or panel.
- **middle_top**: defines the background color of the segment or panel where the camera image is located.
- **middle_bottom**: defines the color of the background segment or panel below the camera image.
- **bottom**: defines the color of the background segment or lower panel.

You can also set certain properties that are used only on specific screens. We list them below with reference to the screens in which they are used:

- **pagination_separator (RegistrationTips, FaceMovementTips)**: defines the color of the separation between the bottom panel and the panel underneath the camera.
- **mirror_border_color (RegistrationTips, FaceMovementTips)**: defines the color of the edge of the circle surrounding the camera or video image in the registration tips. This element is also called mirror.
- **mirror_border_width (RegistrationTips, FaceMovementTips)**: defines the width of the edge of the circle surrounding the camera or video image of the registration tips. If we do not want to show a border, we would have to assign a value of 0.0 to this property.
- **mirror_mist_color (StartExtractor)**: defines the color of the central circle on the screen before extraction. This color must always have a transparency value since we must let the camera image be seen so that the user can position himself correctly before starting the extraction. The color format when a transparency value is included is RGBA (The alpha value will be indicated with the last byte).
- **mirror_color (Results)**: defines the background color of the circle which shows the results of the registration process.

#### 4.2.5. BUTTON element 


- **background**: defines the background color of the button
- **decorator**: defines the color of the shadow of the button
- **foreground**: defines the color of the button's font in case the content is a text
- **content_type**: defines the type of content of the button. There are 2 different types:
- **resource_id**: Content must contain the name of a file in the resource bundle
- **text_id**: Content must contain the identifier of a literal from the translation file of the resource bundle
- **content**: defines the content of the button. It can be either an image or the identifier of a literal.
- **align**: Defines the alienation of the button's content, either an image or text
- **font**: Defines the font used if the button's content is a text
- **font_size**: Defines the font size if the button's content is text

#### 4.2.6. TEXT Element

`text` elements are used to define the graphic appearance of the texts on each of the widget screens. These are the properties that can be modified:

- **color**: defines the color of the text.
- **font**: defines the type of Font used to show the text.
- **font_size**: defines the size of the Font. 
It should be noted that on the screen of registry results the two texts that define the quality of the registry have their color forced to the color of the bar that indicates the score.

#### 4.2.7.  IMAGE element                                                            

- **value**: defines the name of the file containing the image to be displayed.

The `image` elements only have the property that defines the file where the image is physically located in the resource bundle. The images are obtained from the bundle by searching the appropriate folder according to the density of the device.

#### 4.2.8. VIDEO element

- **value**: defines the name of the file containing the image to be displayed.

The `video` elements only have the property that defines the file where the video is physically located in the resource bundle.

***

## 5. Requirements

### 5.1. minimum requirements for Android environment

For proper integration of the facial recognition widget into an Android device, the following version of the Android operating system is required:

- API level 14 (Android 4.0)

In terms of the architecture of the mobile device:

- armeabi-v7, x86, arm64 y x64

***

## 6. enableWidgetEventListener Implementation

A listener must be added as shown in the following programming example:

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
    
## 7. Contact information

For any general questions, please contact us in the following ways:

- info@facephi.com
- <http://www.facephi.com>
- Avenida México, 20. Alicante 03008. España.
- (+34) 965 10 80 08

If you wish to make commercial inquiries, please use the means provided below:

- sales@facephi.com
- (+34) 965 10 80 08

For any technical question, suggestion or report, please contact:

- support@facephi.com
- (+34) 965 10 80 08

If you wish to make or send us any type of suggestion or detect any type of error, please contact:

- feedback@facephi.com
- (+34) 965 10 80 08



