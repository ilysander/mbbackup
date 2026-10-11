package com.reactlibrary.selphi;


import android.util.Log;

import com.facephi.fphiwidgetcore.IFPhiWidgetQR;

import java.util.regex.Pattern;

public class RNSelphiFaceQRValidator implements IFPhiWidgetQR {

    public static String evaluatorReg="";

    @Override
    public boolean isValidQR(String QRData) {
        Log.w("cordova test", "Expression regular: " + QRData + " qrData: " + QRData);

        boolean toReturn = Pattern.matches(evaluatorReg, QRData);
        Log.w("cordova test", "Match result: " + toReturn);

        return toReturn;
        //Pattern p = Pattern.compile(evaluatorReg);
        //Matcher m = p.matcher(QRData);
        //return (m.matches());
    }
}
