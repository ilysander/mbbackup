import { Keyboard } from 'react-native';
import { Log } from '../log';

const TAG = '[KeyboardUtil]';
export default class KeyboardUtil {
  static hide() {
    Log.debug(TAG, 'hide');
    Keyboard.dismiss();
  }
}
