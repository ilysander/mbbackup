package com.facebook.react.textinput;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class ReactTextInputSubmitEditingEvent extends Event<ReactTextInputSubmitEditingEvent> {

    private static final String EVENT_NAME = "topSubmitEditing";

    private String mText;

    @Deprecated
    public ReactTextInputSubmitEditingEvent(int viewId, String text) {
        this(-1, viewId, text);
    }

    public ReactTextInputSubmitEditingEvent(int surfaceId, int viewId, String text) {
        super(viewId);
        mText = text;
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
        eventData.putString("text", mText);
        return eventData;
    }
}
