package com.reactlibrary.selphi;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facephi.fphiwidgetcore.WidgetConfiguration;
import com.facephi.fphiwidgetcore.WidgetLivenessMode;
import org.json.JSONObject;

public class
RNSelphiFacePluginConfiguration extends ReactContextBaseJavaModule
{
    private static final String SELPHI_LOG_PARAM_NAME = "selphiLogInfo";
    private static final String SELPHI_LOG_EVENT_NAME = "onSelphiLogEvent";
    private static final String SELPHI_LOG_QR_PARAM_NAME = "qrData";
    private static final String SELPHI_LOG_QR_EVENT_NAME = "onSelphiLogQREvent";

    @Override
    public String getName() {
        return null;
    }

    protected enum ConfigurationParams {
        CONF_DEBUG("debug"),
        CONF_FULLSCREEN("fullscreen"),
        CONF_FRONTAL_CAMERA_PREFERRED("frontalCameraPreferred"),
        CONF_LOCALE("locale"),
        CONF_LIVENESS_MODE("livenessMode"),
        CONF_ENABLE_IMAGES("enableImages"),
        CONF_JPG_QUALITY("jpgQuality"),
        CONF_U_TAGS("uTags"),
        CONF_DESIRED_CAMERA_WIDTH("desiredCameraWidth"),
        CONF_DESIRED_CAMERA_HEIGHT("desiredCameraHeight"),
        CONF_STABILIZATION_MODE("stabilizationMode"),
        CONF_TEMPLATE_RAW_OPTIMIZED("templateRawOptimized"),
        CONF_QR_FLAG("qrMode"),
        CONF_ENABLE_EVENT_LISTENER("enableWidgetEventListener"),
        CONF_TRANSLATIONS_CONTENT("translationsContent"),
        CONF_VIEWS_CONTENT("viewsContent"),
        CONF_CAMERA_ID("cameraId"),
        CONF_CROP_PERCENT("cropPercent"),
        CONF_CROP("crop"),
        CONF_PARAMS("params"),
        CONF_TUTORIAL("tutorial"),
        CONF_SHOW_RESULT_AFTER_CAPTURE("showResultAfterCapture");

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
     *
     * @return
     */
    public static WidgetConfiguration createWidgetConfiguration(String resourcesPath, JSONObject config, Activity currentActivity, ReactApplicationContext reactContext) throws Exception {
        try {
            WidgetConfiguration conf = new WidgetConfiguration();

            conf.setResourcesPath(resourcesPath + ".zip");

            return processJSONConfiguration(conf, config, currentActivity, reactContext);
        } catch (Exception exc) {
            throw exc;
        }
    }

    /**
     * Processes the JSON input argument and sets the configuration of the User Control.
     *
     * @param hybridConfiguration ReadableMap with input JS arguments.
     * @param currentActivity
     * @param reactContext
     * @return Configuration of the widget
     */
    private static WidgetConfiguration processJSONConfiguration(WidgetConfiguration widgetConfiguration, JSONObject hybridConfiguration, final Activity currentActivity, final ReactApplicationContext reactContext) throws Exception {
        try {
            JSONObject actualObject = hybridConfiguration;

            if (actualObject.length() == 0) return widgetConfiguration;

            if (actualObject.has(ConfigurationParams.CONF_SHOW_RESULT_AFTER_CAPTURE.getName()))
                widgetConfiguration.setShowAfterCapture(actualObject.getBoolean(ConfigurationParams.CONF_SHOW_RESULT_AFTER_CAPTURE.getName()));
            if (actualObject.has(ConfigurationParams.CONF_DEBUG.getName()))
                widgetConfiguration.setDebug(actualObject.getBoolean(ConfigurationParams.CONF_DEBUG.getName()));
            if (actualObject.has(ConfigurationParams.CONF_TUTORIAL.getName()))
                widgetConfiguration.setTutorialFlag(actualObject.getBoolean(ConfigurationParams.CONF_TUTORIAL.getName()));
            if (actualObject.has(ConfigurationParams.CONF_FULLSCREEN.getName()))
                widgetConfiguration.setFullscreen(actualObject.getBoolean(ConfigurationParams.CONF_FULLSCREEN.getName()));
            if (actualObject.has(ConfigurationParams.CONF_LOCALE.getName()))
                widgetConfiguration.setLocale(actualObject.getString(ConfigurationParams.CONF_LOCALE.getName()));
            if (actualObject.has(ConfigurationParams.CONF_ENABLE_IMAGES.getName()))
                widgetConfiguration.logImages(actualObject.optBoolean(ConfigurationParams.CONF_ENABLE_IMAGES.getName(), true));
            if (actualObject.has(ConfigurationParams.CONF_JPG_QUALITY.getName()))
                widgetConfiguration.setJPGQuality((float) actualObject.optDouble(ConfigurationParams.CONF_JPG_QUALITY.getName(), 0.8f));
            if (actualObject.has(ConfigurationParams.CONF_DESIRED_CAMERA_WIDTH.getName()))
                widgetConfiguration.setParam("DesiredCameraWidth", String.valueOf(actualObject.optInt(ConfigurationParams.CONF_DESIRED_CAMERA_WIDTH.getName())));
            if (actualObject.has(ConfigurationParams.CONF_DESIRED_CAMERA_HEIGHT.getName()))
                widgetConfiguration.setParam("DesiredCameraHeight", String.valueOf(actualObject.optInt(ConfigurationParams.CONF_DESIRED_CAMERA_HEIGHT.getName())));
            if (actualObject.has(ConfigurationParams.CONF_STABILIZATION_MODE.getName()))
                widgetConfiguration.setStabilizationMode(actualObject.optBoolean(ConfigurationParams.CONF_STABILIZATION_MODE.getName(), false));
            if (actualObject.has(ConfigurationParams.CONF_TEMPLATE_RAW_OPTIMIZED.getName()))
                widgetConfiguration.setTemplateRawOptimized(actualObject.optBoolean(ConfigurationParams.CONF_TEMPLATE_RAW_OPTIMIZED.getName(), false));
            if (actualObject.has(ConfigurationParams.CONF_FRONTAL_CAMERA_PREFERRED.getName())) {
                boolean isFrontalCamera = actualObject.optBoolean(ConfigurationParams.CONF_FRONTAL_CAMERA_PREFERRED.getName(), true);
                if (isFrontalCamera) widgetConfiguration.setFrontFacingCameraAsPreferred();
                else widgetConfiguration.setBackFacingCameraAsPreferred();
            }

            if (actualObject.has(ConfigurationParams.CONF_CROP_PERCENT.getName()))
                if (widgetConfiguration.getExtractionConfig() != null)
                    widgetConfiguration.getExtractionConfig().setCropImagePercent((float) actualObject.getDouble(ConfigurationParams.CONF_CROP_PERCENT.getName()));
            if (actualObject.has(ConfigurationParams.CONF_CROP.getName()))
                if (widgetConfiguration.getExtractionConfig() != null)
                    widgetConfiguration.getExtractionConfig().setCropImageDebug(actualObject.getBoolean(ConfigurationParams.CONF_CROP.getName()));

            if (actualObject.has(ConfigurationParams.CONF_LIVENESS_MODE.getName())) {
                String livenessMode = actualObject.optString(ConfigurationParams.CONF_LIVENESS_MODE.getName());
                if (livenessMode.equalsIgnoreCase("PASSIVE")) {
                    widgetConfiguration.setParam("DesiredCameraWidth", "1280");
                    widgetConfiguration.setParam("DesiredCameraHeight", "720");
                    widgetConfiguration.setLivenessMode(WidgetLivenessMode.LIVENESS_PASSIVE);
                } else widgetConfiguration.setLivenessMode(WidgetLivenessMode.LIVENESS_NONE);
            }

            if (actualObject.has(ConfigurationParams.CONF_U_TAGS.getName())) {
                String userTagsStr = actualObject.optString("uTags", null);
                byte[] userTags;
                if (userTagsStr != null && !userTagsStr.isEmpty()) {
                    userTags = Base64.decode(userTagsStr, Base64.DEFAULT);
                    widgetConfiguration.setUserTags(userTags);
                }
            }

            if (actualObject.has(ConfigurationParams.CONF_ENABLE_EVENT_LISTENER.getName())
                    && actualObject.getBoolean(ConfigurationParams.CONF_ENABLE_EVENT_LISTENER.getName())) {
                widgetConfiguration.setIFPhiWidgetEventListener_classname("com.reactlibrary.selphi.RNSelphiFaceEventListener");
                // Preparing observer to the log singleton object
                StartEventListener(currentActivity, reactContext);
            }

            if (actualObject.has(ConfigurationParams.CONF_QR_FLAG.getName())
                    && actualObject.getBoolean(ConfigurationParams.CONF_QR_FLAG.getName())) {
                StartEventQRListener(widgetConfiguration, (AppCompatActivity) currentActivity, reactContext, actualObject);
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
            if (actualObject.has(ConfigurationParams.CONF_PARAMS.getName())) {
                JSONObject parameters = actualObject.getJSONObject(ConfigurationParams.CONF_PARAMS.getName());

                for (int i = 0; i < parameters.names().length(); i++)
                {
                    widgetConfiguration.setParam(parameters.names().getString(i), String.valueOf(parameters.get(parameters.names().getString(i))));
                }
            }
        } 
        catch (Exception exc) {
            throw exc;
        }
        return widgetConfiguration;
    }

    private static void StartEventQRListener(WidgetConfiguration widgetConfiguration, final AppCompatActivity currentActivity, final ReactApplicationContext reactContext, JSONObject actualObject) {
        widgetConfiguration.setQRFlag(actualObject.optBoolean(ConfigurationParams.CONF_QR_FLAG.getName(), false));
        widgetConfiguration.setIFPhiWidgetQR_classname("com.reactlibrary.selphi.RNSelphiFaceEventQRListener");
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                /*RNSelphiFaceLogQRModel.getLogModel().getCurrentLog().observe(currentActivity, new Observer<String>() {
                    @Override
                    public void onChanged(String logData) {
                        WritableMap params = Arguments.createMap();
                        // pass data instead of jsonData if data is a String
                        params.putString(SELPHI_LOG_QR_PARAM_NAME, logData);
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(SELPHI_LOG_QR_EVENT_NAME, params);
                    }
                });*/
                RNSelphiFaceLogQRModel.getLogModel().getCurrentLog().observeForever(new Observer<String>() {
                    @Override
                    public void onChanged(String logData) {
                        WritableMap params = Arguments.createMap();
                        // pass data instead of jsonData if data is a String
                        params.putString(SELPHI_LOG_QR_PARAM_NAME, logData);
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(SELPHI_LOG_QR_EVENT_NAME, params);
                    }
                });
            }
        });
    }

    private static void StartEventListener(final Activity currentActivity, final ReactApplicationContext reactContext) throws Exception {
        if (currentActivity != null) {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    RNSelphiFaceLogModel.getLogModel().getCurrentLog().observe((AppCompatActivity) currentActivity, new Observer<String>() {
                        @Override
                        public void onChanged(String logData) {
                            WritableMap params = Arguments.createMap();
                            // pass data instead of jsonData if data is a String
                            params.putString(SELPHI_LOG_PARAM_NAME, logData);
                            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit(SELPHI_LOG_EVENT_NAME, params);
                        }
                    });
                }
            });
        } else {
            throw new Exception("NativeError: Current activity is null.");
        }
    }
}