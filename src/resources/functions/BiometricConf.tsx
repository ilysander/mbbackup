export interface CaptureDocConf {
  debug: boolean;
  showResultAfterCapture: boolean;
  showTutorial: boolean;
  scanMode: string;
  specificData: string;
  fullscreen: boolean;
  locale: string;
}

export interface SelphiConf {
  debug: boolean;
  fullscreen: boolean;
  locale: string;
  enableWritePermissions: boolean;
  crop: boolean;
  cropPercent: number;
  sceneTimeout: number;
  enableImages: boolean;
  livenessMode: string;
  frontalCameraPreferred: boolean;
}

export default class BiometricConf {
  static getSelphiConfiguration = (
    debug: boolean,
    fullscreen: boolean,
    locale: string,
    enableWritePermissions: boolean,
    crop: boolean,
    cropPercent: number,
    sceneTimeout: number,
    enableImages: boolean,
    livenessMode: string,
    frontalCameraPreferred: boolean
  ): SelphiConf => {
    const SelphiConf = {
      debug: debug,
      fullscreen: fullscreen,
      locale: locale,
      enableWritePermissions: enableWritePermissions,
      crop: crop,
      cropPercent: cropPercent,
      sceneTimeout: sceneTimeout,
      enableImages: enableImages,
      livenessMode: livenessMode,
      frontalCameraPreferred: frontalCameraPreferred,
    };
    return SelphiConf;
  };

  static getCaptureDocConfiguration = (
    debug: boolean,
    fullscreen: boolean,
    locale: string,
    showResultAfterCapture: boolean,
    showTutorial: boolean,
    scanMode: string,
    specificData: string
  ): CaptureDocConf => {
    const SelphidConf = {
      debug: debug,
      fullscreen: fullscreen,
      locale: locale,
      showResultAfterCapture: showResultAfterCapture,
      showTutorial: showTutorial,
      scanMode: scanMode,
      specificData: specificData,
    };
    return SelphidConf;
  };
}
