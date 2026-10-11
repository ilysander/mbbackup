package com.reactlibrary.selphi;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.util.Log;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facephi.fphiwidgetcore.WidgetConfiguration;
import com.facephi.fphiwidgetcore.WidgetResult;
import org.json.JSONObject;
import java.util.ArrayList;
import static com.facephi.fphiwidgetcore.WidgetConfiguration.getWidgetVersion;
import static com.reactlibrary.selphi.RNSelphiFaceUtils.checkCameraPermissions;

public class RNSelphiFacePluginModule extends ReactContextBaseJavaModule
{
    /**
     * CONSTANTS
     **/
    //private static final String ACTION_GET_SELPHI_LOG = "ACTION_GET_SELPHI_LOG";
    //private static final String SELPHI_LOG_EVENT_NAME = "onSelphiLogEvent";
    //private static final String SELPHI_LOG_PARAM_NAME = "selphiLogInfo";
    private static final int SELPHI_FACE_PLUGIN_OPERATION_AUTHENTICATE = 19101;
    private float _jpgQuality = 0.8f;
    private static final String NATIVE_RESULT_ERROR = "8203";

    public static final RNSelphiFaceObservableQR s = new RNSelphiFaceObservableQR(false);
    private static final RNSelphiFaceEventQRListener obs = new RNSelphiFaceEventQRListener();

    /**
     * ENVIRONMENT VARIABLES
     **/
    private final ReactApplicationContext reactContext;
    private Promise mResultPromise;
    private boolean _enableGenerateTemplateRaw = false;
    private boolean _enableQR = false;

    public RNSelphiFacePluginModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "RNSelphiFacePluginModule";
    }

    @ReactMethod
    public void qrValid() {
        try {
            s.setIsValid(true);
        }
        catch (Exception e)
        {
            Log.e("qrValid Exception: ", e.toString());
        }
    }

    @ReactMethod
    public void startExtraction(String resourcesPath, ReadableMap config, Promise promise) {
        try
        {
            mResultPromise = promise;
            JSONObject jsonObject = new JSONObject(config.toHashMap());

            _enableGenerateTemplateRaw = jsonObject.optBoolean("enableGenerateTemplateRaw", false);
            _enableQR = jsonObject.optBoolean("qrMode", false);
            if (_enableQR) {
                s.addObserver(obs); // Add the Observer
                if (s.getIsValid()) {
                    // IMPORTANT. // Make changes to the Subject.
                    s.setIsValid(false);
                }
            }
            this.launchActivityUC(RNSelphiFacePluginConfiguration.createWidgetConfiguration(resourcesPath, jsonObject, this.getCurrentActivity(), this.reactContext), SELPHI_FACE_PLUGIN_OPERATION_AUTHENTICATE);
        }
        catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR, e.getMessage());
        }
    }

    @ReactMethod
    public void generateTemplateRaw(String imageBase64, Promise promise) {
        try {
            mResultPromise = promise;
            Bitmap bmpImage = RNSelphiFaceImageUtils.toBitmap(imageBase64);
            byte[] bmpTemplate = WidgetConfiguration.generateTemplateRawFromBitmap(bmpImage);
            mResultPromise.resolve(RNSelphiFaceImageUtils.toBase64(bmpTemplate));
        } catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR, e.getMessage());
        }
    }

    @ReactMethod
    public void getDeviceCameras(Promise promise)
    {
        try {
            checkCameraPermissions(getCurrentActivity());

            mResultPromise = promise;
            WidgetConfiguration conf = new WidgetConfiguration();
            ArrayList<String> cameras = conf.getDeviceCameras();

            mResultPromise.resolve(cameras.toString());
        }
        catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
        }
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        try 
        {
            mResultPromise = promise;
            WritableMap result = new WritableNativeMap();
            result.putString("version", getWidgetVersion());

            mResultPromise.resolve(result);
        }
        catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
        }
    }

    /**
     * Launches the User Control Activity selected by the user.
     *
     * @param conf      The User Control configuration
     * @param operation Index of the User Control operation
     * @return True if plugin handles a particular action, and "false" otherwise. Note that this does indicate the success or failure of the handling.
     * Indicating success is failure is done by calling the appropriate method on the callbackContext. While our code only passes back a message
     */
    private boolean launchActivityUC(WidgetConfiguration conf, int operation) {
        Activity currentActivity = getCurrentActivity();
        try {
            if (currentActivity != null) {
                Intent intent = new Intent(currentActivity, com.facephi.selphi.Widget.class);
                intent.putExtra("configuration", conf);

                currentActivity.startActivityForResult(intent, operation);
            }
        }
        catch (Exception exc) {
            System.err.println("Exception: " + exc.getMessage());
            mResultPromise.reject(NATIVE_RESULT_ERROR, exc.getMessage());
        }
        return true;
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            try
            {
                if (requestCode != SELPHI_FACE_PLUGIN_OPERATION_AUTHENTICATE)
                {
                    return;
                }

                WidgetResult ucResult = intent.getParcelableExtra("result");
                RNSelphiFaceOutputBundle output = new RNSelphiFaceOutputBundle(ucResult, _jpgQuality, _enableGenerateTemplateRaw);

                mResultPromise.resolve(output.ReturnOutputJSON());
            }
            catch (Exception exc) {
                mResultPromise.reject(NATIVE_RESULT_ERROR, exc.getMessage());
            }
            return;
        }
    };
}