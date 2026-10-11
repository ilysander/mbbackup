package com.reactlibrary.selphi;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
//import com.facebook.react.bridge.Arguments;
//import com.facebook.react.bridge.WritableMap;

public class RNSelphiFaceLogModel extends ViewModel {
    private static RNSelphiFaceLogModel mLogModelInstance;
    // Create a LiveData with a String
    private MutableLiveData<String> currentLog;

    public static RNSelphiFaceLogModel getLogModel() {
        //instantiate a new CustomerLab if we didn't instantiate one yet
        if (mLogModelInstance == null) {
            mLogModelInstance = new RNSelphiFaceLogModel();
        }
        return mLogModelInstance;
    }

    public void setCurrentLogJSON(String time, String type, String info) {
        String logJSON = "{\"time\":\""+time+"\",\"type\":\""+type+"\", \"info\":\""+info+"\"}";
        currentLog.postValue(logJSON);
    }

    public MutableLiveData<String> getCurrentLog() {
        if (currentLog == null) {
            currentLog = new MutableLiveData<String>();
        }
        return currentLog;
    }
}
