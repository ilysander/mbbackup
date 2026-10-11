import { Log } from '../../resources/log';
import ScreenName from './ScreensLabels';
import { ScreensLabelsType } from '.';

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

export default class AnalyticsEvent {
  static track(
    event: string,
    _params?: AnalyticsTrackParams,
    _fbEvent?: string,
    _fbParams?: AnalyticsTrackParams
  ) {
    if (!event) {
      Log.error(TAG, 'track', 'missing name');
      return;
    }
    if (event.length > LimitEvent) {
      Log.warn(TAG, 'track', 'event.length > ' + LimitEvent, event);
      event = event.substring(0, LimitEvent);
    }
  }

  static trackScreen(screen: ScreensLabelsType) {
    let screenName = ScreenName[screen];
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
  }
}
