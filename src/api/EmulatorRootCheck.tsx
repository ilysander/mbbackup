import {Platform} from 'react-native';
import {Log} from '../resources/log';
import Config from '../Config';
import JailMonkey from 'jail-monkey';
import {AnalyticsEvent, A} from '../resources/analytics';
const TAG = '[EmulatorRootCheck]';

export default class EmulatorRootCheck {
  static token: string;

  static checkAndroidRootDevice() {
    Log.debug(TAG, 'checkAndroidRootDevice');
    try {
      const trustFall = !Config.debug.allowRoot && JailMonkey.isJailBroken();
      const isDeviceDebugged =
        Platform.OS === 'android' ? JailMonkey.isDeviceDebugged() : false;

      AnalyticsEvent.track(A.root_status, {
        rooted: Number(trustFall),
        adb: Number(isDeviceDebugged),
        fakeLocation: Number(JailMonkey.canMockLocation()),
      });

      return trustFall;
    } catch (error) {
      Log.error(TAG, (error as any).message);
    }
  }
}
