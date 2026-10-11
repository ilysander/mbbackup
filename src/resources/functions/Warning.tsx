import ErrorRequest from '../constants/ErrorRequest';
import { ErrorRequestItem } from '../constants/ErrorRequest';
import {
  AlertManagerMessageUpdateState,
  AlertManagerMessageMediaState,
} from '../../components/alert/AlertManager';
import { L } from '../language';
import TypeAlertScreen from '../constants/AlertType';

export default class Warning {
  static createMessage(
    title: string = '',
    message: string = '',
    code: string = '1000'
  ): ErrorRequestItem {
    return {
      title,
      message,
      code: code.toString(),
    };
  }

  static createMessageByError(e: any): ErrorRequestItem {
    let messageWarning = ErrorRequest.Default;

    const code = (e.code || '').toString();
    for (const name in ErrorRequest) {
      if ((ErrorRequest as any)[name].code === code) {
        messageWarning = (ErrorRequest as any)[name];
        break;
      }
    }
    return messageWarning;
  }

  static createUpdateMessage(): AlertManagerMessageUpdateState {
    return {
      icon: require('../../assets/images/info-icon.png'),
      title: L.error_request_update_title,
      message: L.error_request_update,
      confirmText: L.error_request_update_confirm,
    };
  }

  static createMessageMedia(
    type = TypeAlertScreen.DEFAULT
  ): AlertManagerMessageMediaState {
    let state: AlertManagerMessageMediaState = {};

    switch (type) {
      case TypeAlertScreen.PAYMENTS: {
        state = {
          icon: require('../../assets/images/adn-man-important.png'),
          title: L.error_request_loans_title,
          message1: L.error_request_loans_message,
          confirmText: L.error_request_loans_confirmText,
        };
        break;
      }
      default: {
        state = {
          icon: require('../../assets/images/adn-man-important.png'),
          title: L.error_request_media_title,
          message1: L.error_request_media_message1,
          message2: L.error_request_media_message2,
          message3: L.error_request_media_message3,
          confirmText: L.error_request_media_confirmText,
        };
      }
    }

    return {
      icon: require('../../assets/images/adn-man-important.png'),
      ...state,
    };
  }
}
