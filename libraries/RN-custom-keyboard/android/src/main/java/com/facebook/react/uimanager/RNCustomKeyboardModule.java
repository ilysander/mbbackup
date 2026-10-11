package com.facebook.react.uimanager;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.ResultReceiver;
import android.text.Editable;
import android.transition.Slide;
import android.transition.Transition;
import android.transition.TransitionManager;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.RelativeLayout;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.textinput.ReactTextInputBlurEvent;
import com.facebook.react.textinput.ReactTextInputEndEditingEvent;
import com.facebook.react.textinput.ReactTextInputFocusEvent;
import com.facebook.react.textinput.ReactTextInputKeyPressEvent;
import com.facebook.react.textinput.ReactTextInputSubmitEditingEvent;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.textinput.ReactEditText;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

import cn.reactnative.customkeyboard.R;

public class RNCustomKeyboardModule extends ReactContextBaseJavaModule {
    private static final String TAG = "RNCustomKeyboardModule";
    private final int TAG_ID = 0xdeadbeaf;
    private final ReactApplicationContext reactContext;
    private final ArrayList<ViewGroup> modalViews = new ArrayList<>();
    private Dialog dialog;
    private boolean shouldBlur = true;
    private ReactRootView rootView = null;
    private final Handler mHandler = new Handler(Looper.getMainLooper());

    @SuppressLint("UseSparseArrays")
    private final Map<Integer, Integer> mKeyboardToMaxInputLength = new HashMap<>();
    @SuppressLint("UseSparseArrays")
    private final Map<Integer, Integer> mKeyboardToHeight = new HashMap<>();
    @SuppressLint("UseSparseArrays")
    private final Map<Integer, Boolean> mInstalledList = new HashMap<>();

    public RNCustomKeyboardModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    private ReactEditText getEditById(int id) {
        ReactEditText view = null;
        try {
            UIViewOperationQueue uii = getContext().getNativeModule(UIManagerModule.class).getUIImplementation().getUIViewOperationQueue();
            view = (ReactEditText) uii.getNativeViewHierarchyManager().resolveView(id);

            Log.i(TAG, "getEditById success using ui :" + id);
            return view;
        } catch (Exception e) {
            Log.i(TAG, "failed to getEditById " + e.getMessage());
        }

        return view;
    }

    private void recursiveLoopChildren(ViewGroup view) {
        Log.i(TAG, "recursiveLoopChildren ------ getSimpleName=" + view.getClass().getSimpleName());

        if (view.getClass().getSimpleName().equalsIgnoreCase("ReactModalHostView")) {
            modalViews.add(view);
        }

        for (int i = view.getChildCount() - 1; i >= 0; i--) {
            final View child = view.getChildAt(i);

            if (child instanceof ViewGroup) {
                recursiveLoopChildren((ViewGroup) child);
            }
        }
    }


    private void showKeyboard(final ReactEditText edit, final int tag, final String type) {
        final RNCustomKeyboardModule self = this;
        final Activity activity = getCurrentActivity();
        Log.i(TAG, "showKeyboard - init");
        final ResultReceiver receiver = new ResultReceiver(mHandler) {
            @Override
            protected void onReceiveResult(int resultCode, Bundle resultData) {
                Log.i(TAG, "showKeyboard - resultCode=" + resultCode);

                if (resultCode == InputMethodManager.RESULT_SHOWN || resultCode == InputMethodManager.RESULT_UNCHANGED_SHOWN) {
                    self.showKeyboard(edit, tag, type);
                    return;
                }
                if (resultCode == InputMethodManager.RESULT_UNCHANGED_HIDDEN || resultCode == InputMethodManager.RESULT_HIDDEN) {
                    mHandler.post(() -> {
                        if (!edit.isFocused()) {
                            Log.i(TAG, "showKeyboard !edit.isFocused()");
                            return;
                        }
                        if (activity == null) {
                            Log.i(TAG, "showKeyboard activity==null");
                            return;
                        }
                        Log.i(TAG, "showKeyboard edit.isFocused()");

                        View keyboard = (View) edit.getTag(TAG_ID);
                        if (keyboard == null) {
                            Log.i(TAG, "keyboard == null");
                            self.doInstall(edit, tag, type);
                            self.showKeyboard(edit, tag, type);
                            return;
                        }
                        if (keyboard.getParent() != null) {
                            ((ViewGroup) keyboard.getParent()).removeView(keyboard);
                        }
                        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                        final ViewGroup view = activity.getWindow().getDecorView().findViewById(android.R.id.content);


                        if (view == null) {
                            Log.i(TAG, "findViewById(android.R.id.content) == null");
                            return;
                        }
                        if (!view.hasWindowFocus()) {
                            Log.i(TAG, "showKeyboard !view.hasWindowFocus()");

                            int theme = R.style.Theme_FullScreenDialog;
                            if (dialog != null) {
                                dialog.dismiss();
                                dialog = null;
                            }
                            dialog = new Dialog(edit.getContext(), theme);
                            dialog.setContentView(keyboard, layoutParams);
                            dialog.setOnKeyListener(
                                    (dialog, keyCode, event) -> {
                                        if (event.getAction() == KeyEvent.ACTION_UP) {
                                            if (keyCode == KeyEvent.KEYCODE_BACK) {
                                                edit.clearFocus();
                                                return true;
                                            } else {
                                                return activity.onKeyUp(keyCode, event);

                                            }
                                        }
                                        return false;
                                    });

                            keyboard.setOnTouchListener((viewKeyboard, event) -> {
                                Log.d(TAG, "keyboard => setOnTouchListener");
                                int x = (int) event.getRawX();
                                int y = (int) event.getRawY();

                                Log.d(TAG, "position " + x + "-" + y);
                                Log.d(TAG, "event.getAction() " + event.getAction());

                                switch (event.getAction()) {
                                    case MotionEvent.ACTION_DOWN:
                                        Log.d(TAG, "Touch outside the dialog ");
                                        if (dialog != null) {
                                            dialog.dismiss();
                                            dialog = null;
                                        }
                                        // NO ACTIVAR ESTA LINEA PORQUE SE MALOGRA EL EVENTO TOUCH
                                        //                                             activity.dispatchTouchEvent(event);
                                        edit.clearFocus();

                                        return true;
                                    case MotionEvent.ACTION_UP:
                                        viewKeyboard.performClick();
                                        break;
                                    default:
                                        break;
                                }
                                return false;
                            });

                            dialog.show();
                        } else {

                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                                //  Transition t = new Fade();
                                Transition t = new Slide(Gravity.BOTTOM);
                                TransitionManager.beginDelayedTransition(view, t);
                            }

                            view.addView(keyboard, layoutParams);
                        }


                        Integer keyboardHeight = mKeyboardToHeight.get(tag);
                        if (null != keyboardHeight) {
                            final View rootView = self.rootView.getRootView();
                            rootView.invalidate();
                            final Rect visibleViewArea = new Rect();
                            rootView.getWindowVisibleDisplayFrame(visibleViewArea);

                            if (visibleViewArea.isEmpty()) {
                                Log.w(TAG, "visibleViewArea.isEmpty()");
                                return;
                            }
                            final WritableMap params = Arguments.createMap();
                            WritableMap coordinates = Arguments.createMap();

                            final float coordinateY = PixelUtil.toDIPFromPixel(visibleViewArea.bottom) - keyboardHeight;
                            coordinates.putDouble("screenY", coordinateY);
                            coordinates.putDouble("screenX", PixelUtil.toDIPFromPixel(visibleViewArea.left));
                            coordinates.putDouble("width", PixelUtil.toDIPFromPixel(visibleViewArea.width()));
                            coordinates.putDouble("height", keyboardHeight);
                            params.putMap("endCoordinates", coordinates);
                            // this value is for can handle custom spacing on android
                            params.putBoolean("custom", true);

                            mHandler.postDelayed(() -> self.sendEvent("keyboardDidShow", params), 100);

                        }
                    });
                }
            }
        };
        mHandler.post(() -> {
            InputMethodManager im = ((InputMethodManager) getContext().getSystemService(Activity.INPUT_METHOD_SERVICE));
            if (im != null) {
                activity.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
                boolean resultHideSoft = im.hideSoftInputFromWindow(edit.getRootView().getWindowToken(), 0, receiver);
                if (!resultHideSoft) {
                    Bundle b = new Bundle();
                    receiver.send(3, b);
                }
            }
        });
    }

    private ReactApplicationContext getContext() {
        return getReactApplicationContext();
    }

    private static EventDispatcher getEventDispatcher(
            ReactContext reactContext, ReactEditText editText) {
        return UIManagerHelper.getEventDispatcherForReactTag(reactContext, editText.getId());
    }

    private void sendFocusChangeListener(ReactEditText editText, boolean hasFocus) {
        if (editText == null) {
            return;
        }
        EventDispatcher eventDispatcher = getEventDispatcher(reactContext, editText);
        if (hasFocus) {
            eventDispatcher.dispatchEvent(
                    new ReactTextInputFocusEvent(-1,
                            editText.getId()));
        } else {
            if (dialog != null) {
                dialog.dismiss();
                dialog = null;
            }
            eventDispatcher.dispatchEvent(new ReactTextInputBlurEvent(editText.getId()));
            eventDispatcher.dispatchEvent(
                    new ReactTextInputEndEditingEvent(-1,
                            editText.getId(),
                            editText.getText().toString()));
        }
    }

    private int installRetryRef = 0;

    @ReactMethod
    public void install(final int tag, final String type, final int maxInputLength, final int height) {


        if (mInstalledList.get(tag) != null && mInstalledList.get(tag) == Boolean.TRUE) {
            Log.e(TAG, "installed so skip:" + tag);

            return;
        }
        if (maxInputLength > 0) {
            mKeyboardToMaxInputLength.put(tag, maxInputLength);
        }

        mKeyboardToHeight.put(tag, height);


        ReactEditText edit = getEditById(tag);
        if (edit == null) {
            Log.e(TAG, "install edit==null, tag=" + tag + " retry=" + installRetryRef);
            if (installRetryRef > 100) {
                Log.e(TAG, "install edit==null limit times try install tag=" + tag + " retry=" + installRetryRef);
                return;
            }
            installRetryRef++;
            mHandler.postDelayed(() -> install(tag, type, maxInputLength, height), 30);
            return;
        }
        installRetryRef = 0;
        Log.e(TAG, "install edit!=null, tag=" + tag + " doInstall");
        doInstall(edit, tag, type);


    }

    private void doInstall(final ReactEditText edit, final int tag, final String type) {


        mHandler.post(() -> {
            View keyboard = createCustomKeyboard(tag, type);
            edit.setTag(TAG_ID, keyboard);
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            edit.setShowSoftInputOnFocus(false);
        }

        edit.setOnFocusChangeListener((v, hasFocus) -> {
            Log.i(TAG, "onFocusChange hasFocus=" + hasFocus + " - " + tag);
            final ReactEditText edit1 = (ReactEditText) v;
            sendFocusChangeListener(edit1, hasFocus);

            if (hasFocus) {
                showKeyboard(edit1, tag, type);
            } else {
                mHandler.removeCallbacksAndMessages(null);
                if (shouldBlur) {
                    Log.d(TAG, "setOnFocusChangeListener: shouldBlur=>" + shouldBlur + " - " + tag);
                    sendEvent("keyboardDidHide", null);
                }
                shouldBlur = true;
                mHandler.postDelayed(() -> {
                    View keyboard = (View) edit1.getTag(TAG_ID);
                    if (keyboard != null && keyboard.getParent() != null) {

                        ViewGroup container = ((ViewGroup) keyboard.getParent());
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                            Transition t = new Slide(Gravity.BOTTOM);
                            TransitionManager.beginDelayedTransition(container, t);
                        }

                        container.removeView(keyboard);
                    }
                    sendEvent("keyboardDidHide", null);
                }, 200);
            }
        });

        mInstalledList.put(tag, Boolean.TRUE);
    }


    private View createCustomKeyboard(int tag, String type) {
        Log.d(TAG, "createCustomKeyboard: " + tag);

        Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.d(TAG, "createCustomKeyboard - activity==null" + tag);
            return null;
        }
        RelativeLayout layout = new RelativeLayout(getContext());
        rootView = new ReactRootView(this.getReactApplicationContext());
        rootView.setBackgroundColor(Color.argb(0, 218, 218, 218));

        Bundle bundle = new Bundle();
        bundle.putInt("tag", tag);
        bundle.putString("type", type);
        Log.d(TAG, "tag type" + tag + type);

        rootView.startReactApplication(
                getInstanceManager(),
                "CustomKeyboard",
                bundle);

        Integer height = mKeyboardToHeight.get(tag);
        height = height == null ? 250 : height;
        final float scale = activity.getResources().getDisplayMetrics().density;
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, Math.round(height * scale));
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
        layout.addView(rootView, layoutParams);

        return layout;
    }

    private ReactInstanceManager getInstanceManager() {
        Activity activity = getCurrentActivity();
        ReactApplication application = null;
        if (activity != null) {
            application = (ReactApplication) activity.getApplication();
        }
        if (application != null) {
            return application.getReactNativeHost().getReactInstanceManager();
        }
        return null;
    }

    @ReactMethod
    public void uninstall(final int tag) {
        mHandler.removeCallbacksAndMessages(null);
        mHandler.post(() -> {
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            edit.setTag(TAG_ID, null);
            mInstalledList.put(tag, Boolean.FALSE);
        });
    }

    @ReactMethod
    public void getSelectionRange(final int tag, final Callback callback) {
        WritableMap responseMap = Arguments.createMap();
        try {
            ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }
            int start = Math.max(edit.getSelectionStart(), 0);
            int end = Math.max(edit.getSelectionEnd(), 0);
            Editable text = edit.getText();
            if (text != null) {
                responseMap.putString("text", text.toString());
                responseMap.putInt("start", start);
                responseMap.putInt("end", end);
            } else {
                Log.e(TAG, "getSelectionRange text=null");
                responseMap.putNull("text");
            }
            callback.invoke(responseMap);
        } catch (Exception e) {
            Log.e(TAG, "getSelectionRange error=" + e.getMessage());
            responseMap.putNull("text");
            callback.invoke(responseMap);
        }
    }

    @ReactMethod
    public void insertText(final int tag, final String text) {
        mHandler.post(() -> {
            //Log.d(TAG, "insertText: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            Integer maxLength = mKeyboardToMaxInputLength.get(tag);
            if (maxLength != null && edit.getText().length() >= maxLength) {
                return;
            }

            int start = Math.max(edit.getSelectionStart(), 0);
            int end = Math.max(edit.getSelectionEnd(), 0);
            edit.getText().replace(Math.min(start, end), Math.max(start, end),
                    text, 0, text.length());
        });
    }


    @ReactMethod
    public void insertKey(final int tag, final String text) {
        mHandler.post(() -> {
            Log.d(TAG, "insertKey: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            EventDispatcher eventDispatcher = getEventDispatcher(reactContext, edit);
            eventDispatcher.dispatchEvent(
                    new ReactTextInputKeyPressEvent(-1,
                            edit.getId(),
                            edit.getText().toString()));

        });
    }


    @ReactMethod
    public void setText(final int tag, final String text) {
        mHandler.post(() -> {
            Log.d(TAG, "setText: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }
            edit.setText(text);
        });
    }

    @ReactMethod
    public void getText(final int tag,
                        final Promise promise) {
        mHandler.post(() -> {
            Log.d(TAG, "getText: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            try {
                WritableMap resultData = new WritableNativeMap();
                resultData.putString("text", edit.getText().toString());
                promise.resolve(resultData);
            } catch (Exception e) {
                promise.reject("8001", e);
            }
        });
    }

    @ReactMethod
    public void submitEditing(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "submitEditing: " + tag);

            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            if (edit.getBlurOnSubmit()) {
                Log.d(TAG, "submitEditing: getBlurOnSubmit" + tag + "-" + edit.getBlurOnSubmit());
                edit.clearFocus();
            } else {
                shouldBlur = false;
            }

            EventDispatcher eventDispatcher = getEventDispatcher(reactContext, edit);
            eventDispatcher.dispatchEvent(new ReactTextInputSubmitEditingEvent(-1, edit.getId(), edit.getText().toString()));

        });
    }


    @ReactMethod
    public void backSpace(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "backSpace: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            int start = Math.max(edit.getSelectionStart(), 0);
            int end = Math.max(edit.getSelectionEnd(), 0);
            if (start != end) {
                edit.getText().delete(start, end);
            } else if (start > 0) {
                edit.getText().delete(start - 1, end);
            }
        });
    }

    @ReactMethod
    public void doDelete(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "doDelete: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            int start = Math.max(edit.getSelectionStart(), 0);
            int end = Math.max(edit.getSelectionEnd(), 0);
            if (start != end) {
                edit.getText().delete(start, end);
            } else if (start > 0) {
                edit.getText().delete(start, end + 1);
            }
        });
    }

    @ReactMethod
    public void moveLeft(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "moveLeft: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            int start = Math.max(edit.getSelectionStart(), 0);
            int end = Math.max(edit.getSelectionEnd(), 0);
            if (start != end) {
                edit.setSelection(start, start);
            } else {
                edit.setSelection(start - 1, start - 1);
            }
        });
    }

    @ReactMethod
    public void moveRight(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "moveRight: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            int start = Math.max(edit.getSelectionStart(), 0);
            int end = Math.max(edit.getSelectionEnd(), 0);
            if (start != end) {
                edit.setSelection(end, end);
            } else if (start > 0) {
                edit.setSelection(end + 1, end + 1);
            }
        });
    }

    @ReactMethod
    public void deleteLeftAll(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "deleteLeftAll: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            int end = Math.max(edit.getSelectionEnd(), 0);
            if (0 != end) {
                edit.getText().delete(0, end);
            }
        });
    }

    @ReactMethod
    public void hideKeyboard(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "hideKeyboard: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                Log.d(TAG, "hideKeyboard: tag not found " + tag);
                return;
            }

            Log.d(TAG, "hideKeyboard: clearing");
            edit.clearFocus();
        });
    }

    @ReactMethod
    public void switchSystemKeyboard(final int tag) {
        mHandler.post(() -> {
            Log.d(TAG, "switchSystemKeyboard: " + tag);
            final ReactEditText edit = getEditById(tag);
            if (edit == null) {
                return;
            }

            View keyboard = (View) edit.getTag(TAG_ID);
            if (keyboard.getParent() != null) {
                ((ViewGroup) keyboard.getParent()).removeView(keyboard);
            }
            mHandler.post(() -> {
                InputMethodManager im = ((InputMethodManager) getReactApplicationContext().getSystemService(Activity.INPUT_METHOD_SERVICE));
                if (im != null) {
                    im.showSoftInput(edit, InputMethodManager.SHOW_IMPLICIT);
                }
            });
        });
    }

    @Override
    public String getName() {
        return "CustomKeyboard";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        Log.d(TAG, "sendEvent: " + eventName);

        ReactInstanceManager instance = this.getInstanceManager();
        if (instance != null) {
            ReactContext context = instance.getCurrentReactContext();
            if (context != null) {
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(eventName, params);
            }
        }
    }
}
