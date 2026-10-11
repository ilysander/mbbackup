package com.reactlibrary.selphi;

import androidx.lifecycle.MutableLiveData;

public class RNSelphiFaceLogQRModel {
    private static RNSelphiFaceLogQRModel mLogModelInstance;
    // Create a LiveData with a String
    private MutableLiveData<String> currentLog;

    public static RNSelphiFaceLogQRModel getLogModel() {
        //instantiate a new CustomerLab if we didn't instantiate one yet
        if (mLogModelInstance == null) {
            mLogModelInstance = new RNSelphiFaceLogQRModel();
        }
        return mLogModelInstance;
    }

    public void setCurrentLogJSON(String qr) {
        //String logJSON = "{\"qrData\":\""+qr+"\"}";
        currentLog.postValue(qr);
    }

    public MutableLiveData<String> getCurrentLog() {
        if (currentLog == null) {
            currentLog = new MutableLiveData<String>();
        }
        return currentLog;
    }
}