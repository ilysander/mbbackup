export const WidgetCompressFormat = {
  PNG: 'png',
  JPEG: 'jpeg',
};

export enum WidgetOperation {
  Front = 'mode_front',
  Back = 'mode_back',
  Wizard = 'mode_wizard',
}

export enum WidgetScanMode {
  Generic = 'generic',
  Search = 'search',
  Specific = 'specific',
}

export enum WidgetDocumentType {
  IdCard = 'DT_IdCard',
  Passport = 'DT_Passport',
  DriverLicense = 'DT_DriverLicense',
  ForeignCard = 'DT_ForeignCard',
  CreditCard = 'DT_CreditCard',
  Custom = 'DT_Custom',
}

export enum WidgetErrorType {
  UnknownError = 1,
  NoError = 2,
  CameraPermissionDenied = 3,
  SettingsPermissionDenied = 4,
  HardwareError = 5,
  ExtractionLicenseError = 6,
  UnexpectedCaptureError = 7,
  ControlNotInitializedError = 8,
  BadExtractorConfiguration = 9,
}

export enum WidgetTimeout {
  Short = 'timeout_short',
  Medium = 'timeout_medium',
  Long = 'timeout_long',
}

export enum WidgetFinishStatus {
  Ok = 1,
  Error = 2,
  CancelByUser = 3,
  Timeout = 4,
}
