import { Platform } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import HMSAnalytics from '@hmscore/react-native-hms-analytics';
import { Log } from '../../resources/log';
import ScreenName from './ScreensLabels';
import ScreenClassName from './ScreensClass';
import { ScreensLabelsType } from '.';
import DeviceInfo from 'react-native-device-info';
import { ScreensEvents } from './ScreenEvents';

// https://stackoverflow.com/questions/40465270/screen-tracking-support-firebase-9-8/48117692#48117692
const LimitScreen = 36;

// https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.Event
const LimitEvent = 40;

// https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.Param
export const LimitParam = 40;

// Eventos Standard de Facebook:
// https://developers.facebook.com/docs/marketing-api/app-event-api/

const TAG = '[AnalyticsEvent]';
export interface AnalyticsTrackParams {
  [name: string]: string | number;
}

export function updateEventSubseccion(key: string, subSeccion: string | any) {
  ScreensEvents[key] = Object.assign({}, ScreensEvents[key], {
    SubSeccion: subSeccion,
  });
}

export function setEventValue(key: string, value: string | any) {
  ScreensEvents[key] = Object.assign({}, ScreensEvents[key], { Valor: value });
}

export function setAmountCourrency(
  key: string,
  amount: string | any,
  currency: string | any
) {
  ScreensEvents[key] = Object.assign({}, ScreensEvents[key], {
    Monto: amount,
    Moneda: currency,
  });
}

export default class AnalyticsEvent {
  static async enableAnalyticsHms() {
    try {
      const isGms = await DeviceInfo.hasGms();
      if (!isGms || Platform.OS !== 'ios') {
        await HMSAnalytics.getInstance();
        await HMSAnalytics.enableLog();
        await HMSAnalytics.setAnalyticsEnabled(true);
      }
    } catch (error) {
      Log.error(TAG, 'Error, enable analytics on HMS', 'error');
    }
  }

  static async trackEvent(typeEvent: string, params: object) {
    try {
      const isGms = await DeviceInfo.hasGms();

      if (!typeEvent) {
        Log.error(TAG, 'track', 'missing name');
        return;
      }
      if (typeEvent.length > LimitEvent) {
        Log.warn(TAG, 'track', 'event.length > ' + LimitEvent, typeEvent);
        typeEvent = typeEvent.substring(0, LimitEvent);
      }
      Log.error(TAG, 'track', typeEvent);

      if (Object.keys(params).length > 2) {
        if (isGms || Platform.OS === 'ios') {
          analytics().logEvent(typeEvent, params);
        } else {
          try {
            await HMSAnalytics.onEvent(typeEvent, params);
          } catch (e) {
            Log.error(TAG, 'Error to track event analytics on HMS');
          }
        }
      }
    } catch (error) {
      Log.error(TAG, 'ErrorTrack', error);
    }
  }

  static async track(
    event?: string,
    params?: AnalyticsTrackParams | string,
    fbEvent?: string,
    fbParams?: AnalyticsTrackParams
  ) {
    try {
      const isGms = await DeviceInfo.hasGms();

      if (!event) {
        Log.error(TAG, 'track', 'missing name');
        return;
      }
      if (event.length > LimitEvent) {
        Log.warn(TAG, 'track', 'event.length > ' + LimitEvent, event);
        event = event.substring(0, LimitEvent);
      }

      if (isGms || Platform.OS === 'ios') {
        try {
          if (params !== undefined) {
            if (typeof params === 'string') {
              setEventValue(event, params);
            }
            if (Object.keys(ScreensEvents[event]).length > 2) {
              analytics()
                .logEvent('virtualEventApp', ScreensEvents[event]);
            }
          } else {
            analytics().logEvent(event, params);
          }
        } catch (error) {}
      } else {
        try {
          if (params !== undefined) {
            if (typeof params === 'string') {
              setEventValue(event, params);
            }
            if (Object.keys(ScreensEvents[event]).length > 2) {
              HMSAnalytics.onEvent('virtualEventApp', ScreensEvents[event]);
            }
          } else {
            HMSAnalytics.onEvent(event, params);
          }
        } catch (e) {
          Log.error(TAG, 'Error to track event analytics on HMS');
        }
      }
    } catch (error) {
      Log.warn(TAG, 'ErrorTrack', error);
    }
  }

  static async trackScreen(screen: ScreensLabelsType, param?: any) {
    const isGms = await DeviceInfo.hasGms();
    let screenName = ScreenName[screen];
    let className;

    if (param === undefined || param === '') {
      className = ScreenClassName[screen];
    } else {
      if (param) {
        className = ScreenClassName[screen];
        className = className + `:${param}`;
      }
    }

    if (!screenName) {
      Log.warn(TAG, 'trackScreen', 'missing screenName for', screen);
      screenName = screen;
    }
    if (screenName.length > LimitScreen) {
      Log.warn(
        TAG,
        'trackScreen',
        'screenName.length > ' + LimitScreen,
        screenName
      );
      screenName = screenName.substring(0, LimitScreen);
    }

    if (isGms || Platform.OS === 'ios') {
      analytics().logEvent('Screen_view', {
        screen_name: screenName,
        screen_class: className,
      });
    } else {
      try {
        const eventId = 'Screen_view';
        const bundle = {
          screen_name: screenName,
          screen_class: className,
        };
        HMSAnalytics.onEvent(eventId, bundle);
        await HMSAnalytics.pageStart(screen, className);
        await HMSAnalytics.pageEnd(screen);
      } catch (e) {
        Log.error(TAG, 'Error to track screen analytics on HMS');
      }
    }
  }

  static setUserProperties(userProperties: any) {
    try {
      analytics().setUserProperties(userProperties);
    } catch (error) {
      Log.warn(TAG, 'ErrorTrack setUserProperties ', error);
    }
  }
}
