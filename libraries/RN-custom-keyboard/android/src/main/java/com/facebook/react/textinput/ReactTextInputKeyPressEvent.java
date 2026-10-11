package com.facebook.react.textinput;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by eagleliu on 2017/9/12.
 */
public class ReactTextInputKeyPressEvent extends Event<ReactTextInputKeyPressEvent> {


    public static final String EVENT_NAME = "topKeyPress";

    private String mKey;

    @Deprecated
    public ReactTextInputKeyPressEvent(int viewId, final String key) {
        this(-1, viewId, key);
    }

    public ReactTextInputKeyPressEvent(int surfaceId, int viewId, final String key) {
        super(viewId);
        mKey = key;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public boolean canCoalesce() {
        // We don't want to miss any textinput event, as event data is incremental.
        return false;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putString("key", mKey);

        return eventData;
    }

}
