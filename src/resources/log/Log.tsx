import {Platform} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {Response} from '../../api/util/Request';
import MobileServiceManager from '../../components/mobile-service/MobileServiceManager';

const UNKNOWN_ERROR_CODE = 9999;

export default class Log {
  static withStatusCode(tag: string, method: string, response?: Response<any>) {
    const {status, body} = response || {status: 0, body: null};
    const message = `${tag} - ${method} => ${body ? JSON.stringify(body) : ''}`;

    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      crashlytics().recordError(new Error(message));
    }
  }

  static exception(tag: string, method: string, error: any) {
    let stack = '';
    if (error) {
      if (error.stack) {
        if (error.message) {
          stack = error.message + '\n\n';
        }
        stack += error.stack.toString();
      } else {
        stack = error.toString();
      }
    }

    const message = `${tag} - ${method} => ${stack}`;

    if (__DEV__) {
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      crashlytics().recordError(new Error(message));
    }
  }

  static format(type: string, tag: string, method?: string, params?: string[]) {
    return `[${type.toUpperCase()}] ${tag} - ${method} => ${
      params ? JSON.stringify(params) : ''
    }`;
  }

  static debug(tag: string, method?: string, ...params: any[]) {
    if (__DEV__) {
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      const message = this.format('debug', tag, method, params);
      crashlytics().log(message);
    }
  }

  static log(tag: string, method?: string, ...params: any[]) {
    if (__DEV__) {
      /* NOSONAR */
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      const message = this.format('log', tag, method, params);
      crashlytics().log(message);
    }
  }

  static info(tag: string, method?: string, ...params: any[]) {
    if (__DEV__) {
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      const message = this.format('info', tag, method, params);
      crashlytics().log(message);
    }
  }

  static warn(tag: string, method?: string, ...params: any[]) {
    if (__DEV__) {
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      const message = this.format('warn', tag, method, params);
      crashlytics().log(message);
    }
  }

  static error(tag: string, method?: string, ...params: any[]) {
    if (__DEV__) {
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      const message = this.format('error', tag, method, params);
      crashlytics().log(message);
    }
  }
}
