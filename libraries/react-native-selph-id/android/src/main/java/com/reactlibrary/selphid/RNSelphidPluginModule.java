package com.reactlibrary.selphid;

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
import com.facephi.fphiselphidwidgetcore.WidgetPersistentData;
import com.facephi.fphiselphidwidgetcore.WidgetSelphIDConfiguration;
import com.facephi.fphiselphidwidgetcore.WidgetSelphIDResult;
import org.json.JSONObject;
import java.util.ArrayList;
import static com.facephi.fphiselphidwidgetcore.WidgetSelphIDConfiguration.getWidgetVersion;
import static com.reactlibrary.selphid.RNSelphidUtils.checkCameraPermissions;

public class RNSelphidPluginModule extends ReactContextBaseJavaModule
{
    private static final int SELPHID_PLUGIN_OPERATION = 29100;
    private static int imageQuality = 95;

    private static final String NATIVE_RESULT_ERROR = "8203";
    private static String compressFormat = "JPEG";

    private final ReactApplicationContext reactContext;
    private Promise mResultPromise;

    public RNSelphidPluginModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "RNSelphidPluginModule";
    }

    /**
     * Launches the document capture process.
     *
     * @return                     True if plugin handles a particular action, and "false" otherwise. Note that this does indicate the success or failure of the handling.
     *                             Indicating success is failure is done by calling the appropriate method on the callbackContext. While our code only passes back a message
     */
    @ReactMethod
    public void startCapture(String operationMode, String resourcesPath, String license, String ocrPreviousData, ReadableMap config, Promise promise) {
      try {
        mResultPromise = promise;
        launchWidgetCapture(operationMode, resourcesPath, license, ocrPreviousData, config);
      } catch (Exception e) {
        mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
      }
    }

    @ReactMethod
    public void startTest(String operationMode, String resourcesPath, String license, String ocrPreviousData, ReadableMap config, String testImageName, Promise promise) {
      try {
        mResultPromise = promise;

        Bitmap testing = RNSelphidUtils.getBitmapFromAsset(reactContext, testImageName);
        WidgetPersistentData.getInstance().setTestingImage(testing);
        launchWidgetCapture(operationMode, resourcesPath, license, ocrPreviousData, config);
      } catch (Exception e) {
        mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
      }
    }

    @ReactMethod
    public void startTestBase64(String operationMode, String resourcesPath, String license, String ocrPreviousData, ReadableMap config, String testImageNameBase64, Promise promise) {
        try {
            mResultPromise = promise;

            Bitmap testing = RNSelphidUtils.getBitmapFromBase64(testImageNameBase64);
            WidgetPersistentData.getInstance().setTestingImage(testing);
            launchWidgetCapture(operationMode, resourcesPath, license, ocrPreviousData, config);
        } catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
        }
    }

    @ReactMethod
    public void getDeviceCameras(Promise promise) {
        try {
            checkCameraPermissions(getCurrentActivity());

            mResultPromise = promise;
            WidgetSelphIDConfiguration conf = new WidgetSelphIDConfiguration();
            ArrayList<String> cameras = conf.getDeviceCameras();

            mResultPromise.resolve(cameras.toString());
        }
        catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
        }
    }

    @ReactMethod
    public void getVersion(Promise promise) {
        try {
            mResultPromise = promise;

            WritableMap result = new WritableNativeMap();
            result.putString("version", getWidgetVersion());

            mResultPromise.resolve(result);
        }
        catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
        }
    }

    @ReactMethod
    public void tokenize(String data, Promise promise) {
        try {
            mResultPromise = promise;
            WidgetSelphIDConfiguration conf = new WidgetSelphIDConfiguration();
            String tokenized = conf.tokenize(data);

            mResultPromise.resolve(tokenized);
        }
        catch (Exception e) {
            mResultPromise.reject(NATIVE_RESULT_ERROR,e.getMessage());
        }
    }
    
    /**
     * Launches the Widget capture process.
     *
     * @return                     True if plugin handles a particular action, and "false" otherwise. Note that this does indicate the success or failure of the handling.
     *                             Indicating success is failure is done by calling the appropriate method on the callbackContext. While our code only passes back a message
     */
    private void launchWidgetCapture(String operationMode, String resourcesPath, String license, String ocrPreviousData, ReadableMap config) {
        try {
            Activity currentActivity = getCurrentActivity();
            checkImageParameters(config);
            if (currentActivity != null) {
                Intent intent = new Intent(currentActivity, com.facephi.selphid.Widget.class);
                intent.putExtra("configuration", RNSelphidConfiguration.createWidgetConfiguration(operationMode, resourcesPath, license, ocrPreviousData, config, this.getCurrentActivity(), this.reactContext));
                currentActivity.startActivityForResult(intent, SELPHID_PLUGIN_OPERATION);
            } else {
              System.err.println("Error: Problem getting the current activity.");
              mResultPromise.reject(NATIVE_RESULT_ERROR, "Error: Problem getting the current activity.");
            }
        } catch (Exception exc) {
            System.err.println("Exception: " + exc.getMessage());
            mResultPromise.reject(NATIVE_RESULT_ERROR,exc.getMessage());
        }
    }

    private void checkImageParameters(ReadableMap config) {
        try {
            JSONObject cfg =  new JSONObject(config.toHashMap());
            compressFormat = cfg.optString("compressFormat", "JPEG");
            imageQuality = cfg.optInt("imageQuality", 95);

            if (imageQuality > 0 && imageQuality < 90) {
                Log.w("Warning", "imageQuality selection not recommended");
            }
            if (imageQuality < 0 || imageQuality > 100) {
                imageQuality = 95;
            }
        }
        catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
  
      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
        try 
        {
          if (requestCode != SELPHID_PLUGIN_OPERATION) return;
  
          WidgetSelphIDResult ucResult = intent.getParcelableExtra("result");
          if(ucResult != null) {
              RNSelphidOutputBundle output = new RNSelphidOutputBundle(ucResult, compressFormat, imageQuality);
              mResultPromise.resolve(output.ReturnOutputJSON(ucResult.getCaptureProgress()));
          } else
              mResultPromise.reject(NATIVE_RESULT_ERROR, "Error: Widget result is null.");

        } catch (Exception exc) {
          mResultPromise.reject(NATIVE_RESULT_ERROR,exc.getMessage());
        }
      }
    };
}