export enum WidgetLivenessMode {
  PassiveMode = 'PASSIVE',
  None = 'NONE',
}
export const WidgetErrorType = {
  UnknownError: 1,
  NoError: 2,
  CameraPermissionDenied: 3,
  SettingsPermissionDenied: 4,
  HardwareError: 5,
  ExtractionLicenseError: 6,
  UnexpectedCaptureError: 7,
  ControlNotInitializedError: 8,
  BadExtractorConfiguration: 9,
};
export enum WidgetFinishStatus {
  Ok = 1,
  Error = 2,
  CancelByUser = 3,
  Timeout = 4,
}
export enum WidgetLivenessDiagnostic {
  NotRated = 1,
  PhotoDetected = 2,
  LivenessDetected = 3,
  Unsuccess = 4,
  UnsuccessLowPerformance = 5,
  UnsuccessGlasses = 6,
  UnsuccessLight = 7,
}
