package com.reactlibrary.selphid;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facephi.fphiselphidwidgetcore.WidgetSelphIDConfiguration;

import org.json.JSONObject;

public class RNSelphidConfiguration {
    /**
     * CONSTANTS
     **/
    private static final String SELPHID_LOG_EVENT_NAME = "onSelphidLogEvent";
    private static final String SELPHID_LOG_PARAM_NAME = "selphidLogInfo";

    protected enum ConfigurationParams {
        CONF_DEBUG("debug"),
        CONF_FULLSCREEN("fullscreen"),
        CONF_FRONTAL_CAMERA_PREFERRED("frontalCameraPreferred"),
        CONF_LOCALE("locale"),
        CONF_OCR_RESULTS("tokenImageQuality"),
        CONF_RESULT_AFTER_CAPTURE("showResultAfterCapture"),
        CONF_SCAN_MODE("scanMode"),
        CONF_SPECIFIC_DATA("specificData"),
        CONF_DOCUMENT_TYPE("documentType"),
        CONF_SHOW_TUTORIAL("showTutorial"),
        CONF_TOKEN_IMAGE_QUALITY("tokenImageQuality"),
        CONF_WIDGET_TIMEOUT("widgetTimeout"),
        CONF_VIDEO_FILENAME("videoFilename"),
        CONF_DOCUMENT_MODELS("documentModels"),
        CONF_ENABLE_EVENT_LISTENER("enableWidgetEventListener"),
        CONF_GENERATE_RAW_IMAGES("generateRawImages"),
        CONF_TRANSLATIONS_CONTENT("translationsContent"),
        CONF_VIEWS_CONTENT("viewsContent"),
        CONF_CAMERA_ID("cameraId"),
        CONF_PARAMS("params");

        private final String name;

        ConfigurationParams(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }
    
    /**
     * Configures the user control operation and launches the activity that will execute it.
     */
    public static WidgetSelphIDConfiguration createWidgetConfiguration(String mode, String resourcesPath, String license, String ocrPreviousData, ReadableMap config, Activity currentActivity, ReactApplicationContext reactContext) throws Exception {
        try { 
            WidgetSelphIDConfiguration conf = new WidgetSelphIDConfiguration();
            conf.setLicense(license);

            for (RNSelphidDocumentSide documentSide : RNSelphidDocumentSide.values())
                if(documentSide.getName().equals(mode)) {
                    conf.setDocumentSide(documentSide.getDocumentSide());
                    conf.setWizardMode(documentSide.getIsWizardMode());
                    break;
                }
            if(!conf.getWizardMode() && ocrPreviousData != null && !ocrPreviousData.isEmpty())
                conf.setTokenPreviousCaptureData(ocrPreviousData);
            conf.setResourcesPath(resourcesPath + ".zip");
            return processJSONConfiguration(conf, ocrPreviousData, config, currentActivity, reactContext);
        } catch (Exception exc) {
            throw exc;
        }
      }
      
    /**
   * Processes the JSON input argument and sets the configuration of the User Control.
   *
   * @param widgetConfiguration
   * @param ocrPreviousData
   * @param hybridConfiguration ReadableMap with input JS arguments.
   * @param currentActivity
   * @param reactContext
   * @return Configuration of the widget
   */
  private static WidgetSelphIDConfiguration processJSONConfiguration(WidgetSelphIDConfiguration widgetConfiguration, String ocrPreviousData, ReadableMap hybridConfiguration, final Activity currentActivity, final ReactApplicationContext reactContext) throws Exception {
      try {

          JSONObject actualObject =  new JSONObject(hybridConfiguration.toHashMap());

          if (actualObject.length() == 0) return widgetConfiguration;

          if (actualObject.has(ConfigurationParams.CONF_DEBUG.getName())) widgetConfiguration.setDebug(actualObject.getBoolean(ConfigurationParams.CONF_DEBUG.getName()));
          if (actualObject.has(ConfigurationParams.CONF_FULLSCREEN.getName())) widgetConfiguration.setFullscreen(actualObject.getBoolean(ConfigurationParams.CONF_FULLSCREEN.getName()));
          if (actualObject.has(ConfigurationParams.CONF_LOCALE.getName())) widgetConfiguration.setLocale(actualObject.getString(ConfigurationParams.CONF_LOCALE.getName()));
          if (actualObject.has(ConfigurationParams.CONF_RESULT_AFTER_CAPTURE.getName())) widgetConfiguration.setShowAfterCapture(actualObject.getBoolean(ConfigurationParams.CONF_RESULT_AFTER_CAPTURE.getName()));
          if (actualObject.has(ConfigurationParams.CONF_SHOW_TUTORIAL.getName())) widgetConfiguration.setTutorialFlag(actualObject.getBoolean(ConfigurationParams.CONF_SHOW_TUTORIAL.getName()));
          if (actualObject.has(ConfigurationParams.CONF_TOKEN_IMAGE_QUALITY.getName())) widgetConfiguration.setTokenImageQuality((float)actualObject.optDouble(ConfigurationParams.CONF_TOKEN_IMAGE_QUALITY.getName(), 0.8));
          if (actualObject.has(ConfigurationParams.CONF_SPECIFIC_DATA.getName())) widgetConfiguration.setSpecificData(actualObject.optString(ConfigurationParams.CONF_SPECIFIC_DATA.getName()));
          if (actualObject.has(ConfigurationParams.CONF_DOCUMENT_MODELS.getName())) widgetConfiguration.setDocumentModels(actualObject.optString(ConfigurationParams.CONF_DOCUMENT_MODELS.getName()));
          if (actualObject.has(ConfigurationParams.CONF_VIDEO_FILENAME.getName())) widgetConfiguration.setVideoFilename(actualObject.optString(ConfigurationParams.CONF_VIDEO_FILENAME.getName()));

          if (actualObject.has(ConfigurationParams.CONF_ENABLE_EVENT_LISTENER.getName()) &&
                  actualObject.getBoolean(ConfigurationParams.CONF_ENABLE_EVENT_LISTENER.getName())) {
              StartEventListener(widgetConfiguration, currentActivity, reactContext);
          }

          if (actualObject.has(ConfigurationParams.CONF_GENERATE_RAW_IMAGES.getName())) {
              boolean generateRawImages = actualObject.optBoolean(ConfigurationParams.CONF_GENERATE_RAW_IMAGES.getName(), false);
              widgetConfiguration.setGenerateRawImages(generateRawImages);
          }

          if(widgetConfiguration.getWizardMode() && ocrPreviousData != null && !ocrPreviousData.isEmpty())
            if (actualObject.has(ConfigurationParams.CONF_OCR_RESULTS.getName())) widgetConfiguration.setTokenPreviousCaptureData(ocrPreviousData);

          if (actualObject.has(ConfigurationParams.CONF_FRONTAL_CAMERA_PREFERRED.getName())) {
              boolean isFrontalCamera = actualObject.optBoolean(ConfigurationParams.CONF_FRONTAL_CAMERA_PREFERRED.getName(), true);
              if (isFrontalCamera) widgetConfiguration.setFrontFacingCameraAsPreferred();
              else widgetConfiguration.setBackFacingCameraAsPreferred();
          }

          if (actualObject.has(ConfigurationParams.CONF_SCAN_MODE.getName())) {
              String scanModeParam = actualObject.optString(ConfigurationParams.CONF_SCAN_MODE.getName());
              for (RNSelphidScanMode scanMode : RNSelphidScanMode.values())
                  if (scanMode.getName().equals(scanModeParam)) {
                      widgetConfiguration.setScanMode(scanMode.getScanMode());
                      break;
                  }
          }

          if (actualObject.has(ConfigurationParams.CONF_DOCUMENT_TYPE.getName())) {
              String documentTypeParam = actualObject.optString(ConfigurationParams.CONF_DOCUMENT_TYPE.getName());
              for (RNSelphidDocumentType docType : RNSelphidDocumentType.values())
                  if (docType.getName().equals(documentTypeParam)) {
                      widgetConfiguration.setDocumentType(docType.getDocumentType());
                      break;
                  }
          }

          if (actualObject.has(ConfigurationParams.CONF_WIDGET_TIMEOUT.getName())) {
              String timeoutParam = actualObject.optString(ConfigurationParams.CONF_WIDGET_TIMEOUT.getName());
              for (RNSelphidWidgetTimeout timeout : RNSelphidWidgetTimeout.values())
                  if (timeout.getName().equals(timeoutParam)) {
                      widgetConfiguration.setTimeout(timeout.getWidgetTimeout());
                      break;
                  }
          }

          if (actualObject.has(ConfigurationParams.CONF_VIEWS_CONTENT.getName())) {
              String viewsContent = actualObject.optString(ConfigurationParams.CONF_VIEWS_CONTENT.getName(), "");
              if (!viewsContent.equals(""))
                  widgetConfiguration.setViewsContent(viewsContent);
          }

          if (actualObject.has(ConfigurationParams.CONF_TRANSLATIONS_CONTENT.getName())) {
              String translationsContent = actualObject.optString(ConfigurationParams.CONF_TRANSLATIONS_CONTENT.getName(), "");
              if (!translationsContent.equals(""))
                  widgetConfiguration.setTranslationsContent(translationsContent);
          }

          if (actualObject.has(ConfigurationParams.CONF_CAMERA_ID.getName())) {
              widgetConfiguration.setCameraId(actualObject.getInt(ConfigurationParams.CONF_CAMERA_ID.getName()));
          }

          // Correct format -> params: {"key0": "value0", "key1": "value1", "key2": "value2"},
          // force_camera_rotation and force_input_orientation posible values: 0 to 3
          // {"force_input_orientation": "1", "force_camera_rotation": "0", "swap_camera_dimensions": "true"},
          if (actualObject.has(ConfigurationParams.CONF_PARAMS.getName())) {
              JSONObject parameters = actualObject.getJSONObject(ConfigurationParams.CONF_PARAMS.getName());

              for (int i = 0; i < parameters.names().length(); i++)
              {
                  widgetConfiguration.setParam(parameters.names().getString(i), String.valueOf(parameters.get(parameters.names().getString(i))));
              }
          }
      }
      catch(Exception exc) {
          throw exc;
      }
    return widgetConfiguration;
  }

    private static void StartEventListener(WidgetSelphIDConfiguration widgetConfiguration, final Activity currentActivity, final ReactApplicationContext reactContext) throws Exception {
        widgetConfiguration.setIFPhiWidgetSelphIDEventListener_classname("com.reactlibrary.selphid.RNSelphidEventListener");
        if (currentActivity != null) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    RNSelphidLogModel.getLogModel().getCurrentLog().observe((AppCompatActivity) currentActivity, new Observer<String>() {
                        @Override
                        public void onChanged(String logData) {
                            WritableMap params = Arguments.createMap();
                            // pass data instead of jsonData if data is a String
                            params.putString(SELPHID_LOG_PARAM_NAME, logData);
                            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit(SELPHID_LOG_EVENT_NAME, params);
                        }
                    });
                }
            });
        } else {
            throw new Exception("NativeError: Current activity is null.");
        }
    }
}