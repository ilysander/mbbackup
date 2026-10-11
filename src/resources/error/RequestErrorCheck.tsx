import {Log} from '../../resources/log';
const TAG = '[RequestErrorCheck]';
export default class RequestErrorCheck {
  static async track(body: any) {
    Log.debug(TAG, 'makeTrack');
    try {
      const bodyString = JSON.stringify(body);
      Log.warn('bodyString', bodyString);
    } catch (error) {
      Log.error(TAG, (error as any).message);
    }
  }
}
