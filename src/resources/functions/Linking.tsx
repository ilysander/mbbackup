import { Linking as BaseLinking, Platform } from 'react-native';
import { CustomTabs } from 'react-native-custom-tabs';
import Colors from '../constants/Colors';
import { Log } from '../log';

const TAG = '[Linking]';
export default class Linking {
  static canOpenURL(url: string): Promise<boolean> {
    return BaseLinking.canOpenURL(url);
  }

  static async openURL(url: string): Promise<boolean> {
    if (Platform.OS === 'android') {
      /**
       * el trycatch es necesario en caso CustomTabs genere un error
       * y necesitamos omitirlo y dejar que Linking de react-native
       * funcione normalmente
       */
      try {
        const opened = await CustomTabs.openURL(url, {
          toolbarColor: Colors.grey1,
          enableUrlBarHiding: true,
          showPageTitle: true,
          enableDefaultShare: true,
          animations: {
            startEnter: 'slide_in_bottom',
            startExit: 'slide_out_bottom',
            endEnter: 'slide_in_bottom',
            endExit: 'slide_out_bottom',
          },
          headers: {},
          forceCloseOnRedirection: true,
        });
        if (opened) {
          return opened;
        }
      } catch (e) {
        Log.warn(TAG, 'openURL', 'CustomTabs', e);
      }
    }

    return BaseLinking.openURL(url);
  }
}
