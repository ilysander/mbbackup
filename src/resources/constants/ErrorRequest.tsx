import { ImageSourcePropType } from 'react-native';
import { L } from '../language';

export interface ErrorRequest {
  Certificate: ErrorRequestItem;
  Timeout: ErrorRequestItem;
  Default: ErrorRequestItem;
  PermissionBiometric: ErrorRequestItem;
  LowPerfBiometric: ErrorRequestItem;
  LiveGlasses: ErrorRequestItem;
  PoorLight: ErrorRequestItem;
  Unknow: ErrorRequestItem;
  DefaultBiometric: ErrorRequestItem;
  BlockObject: ErrorRequestItem;
}

export interface ErrorRequestItem {
  code: string;
  icon?: ImageSourcePropType;
  title: string;
  message: string;
}

export default {
  Certificate: {
    code: '1401',
    icon: require('../../assets/images/error-icon.png'),
    title: L.error_request_certificate_title,
    message: L.error_request_certificate,
  },
  Timeout: {
    code: '1408',
    icon: require('../../assets/images/error-icon.png'),
    title: L.error_request_timeout_title,
    message: L.error_request_timeout,
  },
  Default: {
    code: '1000',
    icon: require('../../assets/images/error-icon.png'),
    title: L.error_request_default_title,
    message: L.error_request_default,
  },
  PermissionBiometric: {
    code: '1501',
    icon: require('../../assets/images/error-icon.png'),
    title: 'Necesitas activar permisos',
    message:
      'Por favor, activa los permisos para usar a la cámara desde la configuración de tu celular.',
  },
  LowPerfBiometric: {
    code: '1502',
    icon: require('../../assets/images/error-icon.png'),
    title: '¡Ups!',
    message:
      'Ocurrió un error inesperado. Parece que tu celular tiene poca memoria o recursos. Por favor, inténtalo nuevamente.',
  },
  LiveGlasses: {
    code: '1503',
    icon: require('../../assets/images/error-icon.png'),
    title: '¡Ups!',
    message:
      'No se pudo capturar bien la imagen. ¿Capaz tienes lentes puestos? Reinténtalo sin ellos.',
  },
  PoorLight: {
    code: '1504',
    icon: require('../../assets/images/error-icon.png'),
    title: '¡Ups!',
    message:
      'No se pudo capturar bien la imagen. ¿Capaz no hay buena iluminación? Reinténtalo otra vez.',
  },
  Unknow: {
    code: '1505',
    icon: require('../../assets/images/error-icon.png'),
    title: '¡Ups!',
    message: 'Ocurrió un error inesperado. Por favor, inténtalo nuevamente.',
  },
  BlockObject: {
    code: '1506',
    icon: require('../../assets/images/error-icon.png'),
    title: '¡Ups!',
    message:
      'No se pudo capturar bien la imagen. ¿Capaz no hay buena iluminación, estás usando lentes o algo no deja ver tu cara claramente?',
  },
  DefaultBiometric: {
    code: '1507',
    icon: require('../../assets/images/error-icon.png'),
    title: '¡Ups!',
    message:
      'No se pudo capturar bien la imagen. Por favor, inténtalo nuevamente.',
  },
} as ErrorRequest;
