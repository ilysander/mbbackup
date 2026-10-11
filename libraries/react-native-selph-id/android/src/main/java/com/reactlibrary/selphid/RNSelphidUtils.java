package com.reactlibrary.selphid;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class RNSelphidUtils {
    /**
     * @param bitmap the bitmap image to convert
     * @param imageFormat the bitmap compress Format to convert
     * @description Compress bitmap using jpeg, convert to Base64 encoded string, and return to JavaScript.
     */
    static String processPicture(Bitmap bitmap, Bitmap.CompressFormat imageFormat, int quality) {
        if (bitmap == null)
            return null;
        try
        {
            //JPEG comprime -> int de quality
            //PNG no comprime -> no es necesario configurar la quality
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            if (bitmap.compress(imageFormat, quality, stream)) {
                byte[] code = stream.toByteArray();
                byte[] output = Base64.encode(code, Base64.NO_WRAP);
                String js_out = new String(output);
                return js_out;
            }
        } catch (Exception e) {
            throw e;
        }
        return null;
    }

    static Bitmap getBitmapFromAsset(Context context, String filePath) throws IOException {
        try {
            AssetManager assetManager = context.getAssets();
            InputStream istr = assetManager.open(filePath);
            return BitmapFactory.decodeStream(istr);
        } catch (IOException e) {
            throw e;
        }
    }

    static Bitmap getBitmapFromBase64(String base64Image) throws IOException {
        try {
            String cleanImage       = base64Image.replace("data:image/png;base64,", "").replace("data:image/jpeg;base64,", "");
            byte[] decodedString    = Base64.decode(cleanImage, Base64.DEFAULT);
            Bitmap decodedByte      = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            return decodedByte;
        } catch (Exception e) {
            throw e;
        }
    }

    public static void checkCameraPermissions(Context context) {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED)
        {
            // Permission is not granted
            Log.d("checkCameraPermissions", "No Camera Permissions");
            ActivityCompat.requestPermissions((Activity) context,
                    new String[] { Manifest.permission.CAMERA },
                    100);
        }
    }
}