package com.reactlibrary.selphid;

import androidx.lifecycle.MutableLiveData;

public class RNSelphidLogModel {
    private static RNSelphidLogModel mLogModelInstance;
    // Create a LiveData with a String
    private MutableLiveData<String> currentLog;

    public static RNSelphidLogModel getLogModel() {
        //instantiate a new CustomerLab if we didn't instantiate one yet
        if (mLogModelInstance == null) {
            mLogModelInstance = new RNSelphidLogModel();
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