import { WidgetErrorType, WidgetFinishStatus } from './WidgetSelphidEnums';

/**
 * WidgetSelphidConfiguration.
 * @interface
 */
export interface WidgetSelphidConfiguration {
  debug?: boolean;
  fullScreen?: boolean;
  frontalCameraPreferred?: boolean;
  tokenImageQuality?: number;
  widgetTimeout?: number;
  showResultAfterCapture?: boolean;
  showTutorial?: boolean;
  scanMode?: string;
  specificData?: string;
  documentType?: string;
  videoFilename?: string;
  fullscreen?: boolean;
  locale?: string;
  documentModels?: string;
  enableWidgetEventListener?: boolean;
  generateRawImages?: boolean;
  translationsContent?: string;
  viewsContent?: string;
  cameraId?: number;
  params?: any;
}
export interface SelphIDResult {
  finishStatus: WidgetFinishStatus;
  finishStatusDescription?: string;
  errorType: WidgetErrorType;
  errorMessage?: string;
  frontDocumentImage?: string;
  backDocumentImage?: string;
  faceImage?: string;
  signatureImage?: string;
  fingerprintImage?: string;
  documentData?: string;
  tokenFrontDocumentImage?: string;
  tokenBackDocumentImage?: string;
  tokenFrontDocument?: string;
  tokenFaceImage?: string;
  tokenOCR?: string;
  documentCaptured?: string;
  captureProgress: number;
  matchingSidesScore: number;
  rawFrontDocument?: string;
  rawBackDocument?: string;
  tokenRawFrontDocument?: string;
  tokenRawBackDocument?: string;
  lastActionBeforeCapture?: string;
  timeoutDiagnostic?: string;
}
