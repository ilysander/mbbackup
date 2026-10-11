package com.reactlibrary.selphid;

import android.graphics.Bitmap;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facephi.fphiselphidwidgetcore.WidgetSelphIDResult;

import org.json.JSONException;
import org.json.JSONObject;

public class RNSelphidOutputBundle
{
    private int _finishStatus = 1;
    private int _errorDiagnostic = 2;
    private String _errorMessage = null;

    private String _timeoutDiagnostic = null;
    private String _documentCaptured = null;
    private String _frontDocumentImage = null;
    private String _backDocumentImage = null;
    private String _faceImage = null;
    private String _signatureImage = null;
    private String _fingerprintImage = null;

    private String _rawFrontDocumentImage = null;
    private String _rawBackDocumentImage = null;
    private String _tokenRawFrontDocument = null;
    private String _tokenRawBackDocument = null;
    private String _lastActionBeforeCapture = null;

    private String _tokenOCR = null;
    private String _tokenFaceImage = null;
    private String _tokenFrontDocument = null;
    private String _tokenBackDocument = null;
    private String _documentData = null;
    private float _matchingSidesScore = 0.0f;
    private int _timeoutStatus = -1;

    /**
     * @description Default constructor. Process the User Control result and encapsulates his values
     * @param result Control result
     * @param compressFormat
     * @param imageQuality
     */
    public RNSelphidOutputBundle(WidgetSelphIDResult result, String compressFormat, int imageQuality) {
        Bitmap.CompressFormat format = Bitmap.CompressFormat.JPEG;

        _lastActionBeforeCapture = result.getLastActionBeforeClose();

        if (result.getException() != null)
        {
            _errorMessage = result.getException().getMessage();

            if (result.getException().getExceptionType() != null)
            {
                switch (result.getException().getExceptionType()) {
                    case StoppedManually:
                        _finishStatus = 3; // CancelByUser
                        _errorDiagnostic = 2; // NoError
                        return;
                    case Timeout:
                        _timeoutDiagnostic = result.getTimeoutDiagnostic();
                        _finishStatus = 4; // Timeout
                        _errorDiagnostic = 2; // NoError
                        return;
                    case None:
                        _finishStatus = 1; // Ok
                        _errorDiagnostic = 2; // NoError
                        break;
                    case CameraPermissionDenied:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 3; // CameraPermissionDenied
                        return;
                    case SettingsPermissionDenied:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 4; // SettingsPermissionDenied
                        return;
                    case HardwareError:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 5; // HardwareError
                        return;
                    /** NUEVOS CASES **/
                    case ExtractionLicenseError:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 6; // ExtractionLicenseError
                        return;
                    case UnexpectedCaptureError:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 7; // UnexpectedCaptureError
                        return;
                    case ControlNotInitializedError:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 8; // ControlNotInitializedError
                        return;
                    case BadExtractorConfiguration:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 9; // ControlNotInitializedError
                        return;
                    default:
                        _finishStatus = 2; // Error
                        _errorDiagnostic = 1; // UnknownError
                        return;
                }
            }
            else
            {
                _finishStatus = 2; // Error
                _errorDiagnostic = 1; // UnknownError
                _errorMessage = result.getException().getMessage();
                return;
            }
        }

        if (compressFormat.toUpperCase().contains("PNG")) {
            format = Bitmap.CompressFormat.PNG;
        }

        _frontDocumentImage = RNSelphidUtils.processPicture(result.getDocumentFrontImage(), format, imageQuality);
        _backDocumentImage = RNSelphidUtils.processPicture(result.getDocumentBackImage(), format, imageQuality);
        _faceImage = RNSelphidUtils.processPicture(result.getFaceImage(), format, imageQuality);
        _signatureImage = RNSelphidUtils.processPicture(result.getSignatureImage(), format, imageQuality);
        _fingerprintImage = RNSelphidUtils.processPicture(result.getFingerprintImage(), format, imageQuality);
        _rawFrontDocumentImage = RNSelphidUtils.processPicture(result.getRawDocumentFrontImage(), format, imageQuality);
        _rawBackDocumentImage = RNSelphidUtils.processPicture(result.getRawDocumentBackImage(), format, imageQuality);

             // TODO TESTING STUB
        _tokenOCR = result.getTokenOCR();
        _tokenFaceImage = result.getTokenFaceImage();
        _tokenFrontDocument = result.getTokenFrontDocument();
        _tokenBackDocument  = result.getTokenBackDocument();
        _tokenRawBackDocument = result.getTokenRawBackDocument();
        _tokenRawFrontDocument = result.getTokenRawFrontDocument();

        if (result.ocrResults != null)
            _documentData = (new JSONObject(result.ocrResults)).toString();

        _documentCaptured = result.getDocumentCaptured();
        _matchingSidesScore = result.getMatchingSidesScore();
    }


    public WritableMap ReturnOutputJSON(int timeoutStatus) throws JSONException {
        WritableMap result = new WritableNativeMap();

        result.putInt("finishStatus", _finishStatus);
        result.putInt("errorType", _errorDiagnostic);
        result.putString("errorMessage", _errorMessage);
        result.putInt("timeoutStatus", timeoutStatus);
        result.putInt("captureProgress", timeoutStatus);

        if(_timeoutDiagnostic != null) result.putString("timeoutDiagnostic", _timeoutDiagnostic);
        if(_frontDocumentImage != null) result.putString("frontDocumentImage", _frontDocumentImage);
        if(_backDocumentImage != null) result.putString("backDocumentImage", _backDocumentImage);
        if(_rawFrontDocumentImage != null) result.putString("rawFrontDocument", _rawFrontDocumentImage);
        if(_rawBackDocumentImage != null) result.putString("rawBackDocument", _rawBackDocumentImage);
        if(_tokenRawFrontDocument != null) result.putString("tokenRawFrontDocument", _tokenRawFrontDocument);
        if(_tokenRawBackDocument != null) result.putString("tokenRawBackDocument", _tokenRawBackDocument);

        if(_faceImage != null) result.putString("faceImage", _faceImage);
        if(_signatureImage != null) result.putString("signatureImage", _signatureImage);
        if(_fingerprintImage != null) result.putString("fingerprintImage", _fingerprintImage);

        if(_tokenOCR != null) result.putString("tokenOCR", _tokenOCR);
        if(_tokenFaceImage != null) result.putString("tokenFaceImage", _tokenFaceImage);
        if(_tokenFrontDocument != null) result.putString("tokenFrontDocument", _tokenFrontDocument);
        if(_tokenBackDocument != null) result.putString("tokenBackDocument", _tokenBackDocument);
        if(_documentData != null) result.putString("documentData", _documentData);
        if(_documentCaptured != null) result.putString("lastDocumentCaptured", _documentCaptured);
        if(_lastActionBeforeCapture != null) result.putString("lastActionBeforeCapture", _lastActionBeforeCapture);

        result.putDouble("matchingSidesScore", _matchingSidesScore);

        return result;
    }
}