package com.reactlibrary.selphi;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;


public class RNSelphiFaceImageUtils {
    public static Bitmap toBitmap(String strBase64) {
        try {
            // If the parameter is a URIImage then cleans the header.
            String cleanImage = strBase64.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "");
            byte[] decodedString = Base64.decode(cleanImage, Base64.NO_WRAP);
            return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
        } catch(Exception exc) {
            throw exc;
        }
    }

    public static String toBase64(byte[] input) {
        try {
            return Base64.encodeToString(input, Base64.NO_WRAP);
        } catch(Exception exc) {
            throw exc;
        }
    }
}
