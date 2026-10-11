import { NativeModules } from 'react-native';

const { RNSelphiFacePluginModule } = NativeModules;

export const ErrorCodes = {
  STOPPED_MANUALLY: 'StoppedManually',
  TIMEOUT: 'Timeout',
  CAMERA_PERMISSION_DENIED: 'CameraPermissionDenied',
  EMPTY_TEMPLATE_RAW: 'EmptyTemplateRaw',
};

const RNSelphi = RNSelphiFacePluginModule;
export default RNSelphi;
