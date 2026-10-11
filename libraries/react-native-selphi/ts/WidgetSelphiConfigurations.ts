/**
 * WidgetSelphiConfiguration.
 * @interface
 */
export interface WidgetSelphiConfiguration {
  debug?: boolean;
  enableImages?: boolean;
  fullscreen?: boolean;
  frontalCameraPreferred?: boolean;
  jpgQuality?: number;
  locale?: string;
  stabilizationMode?: boolean;
  templateRawOptimized?: boolean;
  enableGenerateTemplateRaw?: boolean;
  livenessMode?: string;
  uTags?: string;
  desiredCameraWidth?: number;
  desiredCameraHeight?: number;
  qrMode?: boolean;
  enableWidgetEventListener?: boolean;
  translationsContent?: string;
  viewsContent?: string;
  cameraId?: number;
  params?: any;
  crop?: boolean;
  cropPercent?: number;
  tutorial?: boolean;
  showResultAfterCapture?: boolean;
}
