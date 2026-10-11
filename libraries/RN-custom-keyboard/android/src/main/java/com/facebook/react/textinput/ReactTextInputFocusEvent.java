package com.facebook.react.textinput;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by eagleliu on 2017/9/12.
 */
public class ReactTextInputFocusEvent extends Event<ReactTextInputFocusEvent> {

    private static final String EVENT_NAME = "topFocus";

    @Deprecated
    public ReactTextInputFocusEvent(int viewId) {
        this(-1, viewId);
    }

    public ReactTextInputFocusEvent(int surfaceId, int viewId) {
        super(viewId);
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public boolean canCoalesce() {
        return false;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("target", getViewTag());
        return eventData;
    }

}
