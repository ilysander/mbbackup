package com.reactlibrary.selphi;

import android.util.Log;
import com.facephi.fphiwidgetcore.IFPhiWidgetQR;
import java.util.Observable;
import java.util.Observer;

public class RNSelphiFaceEventQRListener implements IFPhiWidgetQR, Observer
{
    public static Boolean isValidQR = false;

    @Override
    public boolean isValidQR(String s) {
        Log.i("qrData: ", s);
        RNSelphiFaceLogQRModel.getLogModel().setCurrentLogJSON(s);
        if (RNSelphiFaceEventQRListener.isValidQR == true)
        {
            RNSelphiFaceLogQRModel.getLogModel().setCurrentLogJSON(""); //RE INITIALICE THE STRING. VERY IMPORTANT.
            return true;
        }
        return false;
    }

    @Override
    public void update(Observable observable, Object o) {
        RNSelphiFaceEventQRListener.isValidQR = Boolean.parseBoolean(o.toString());
    }
}
