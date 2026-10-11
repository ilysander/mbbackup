import Config from '../../Config';
import {Log} from '../../resources/log';
import Request from '../util/Request';
import CacheService from '../../resources/persistence/CacheService';
import {CacheObj} from '../../resources/persistence/models';

const TAG = '[ExternalApi]';
export default class ExternalApi {
  static async updateToken(clientId: string, device: string = '') {
    if (
      Config.features.UpdateTokenUrlActive &&
      !!Config.settings.updateTokenUrl
    ) {
      try {
        const cacheObj = await CacheService.findOne('newFcmToken');

        if (!cacheObj) return;
        const registrationToken = cacheObj.value;

        if (registrationToken === undefined) {
          Log.info(
            TAG,
            'updateToken',
            'Token was not updated because there is no new one',
          );
          return;
        }

        const params = {
          clientId,
          registrationToken,
          device,
        };
        await Request.post(Config.settings.updateTokenUrl, params);
        await CacheService.delete(CacheObj.init('newFcmToken'));
      } catch (error) {
        const e = error as any;
        Log.error(TAG, 'error updateToken', e.message);
      }
    }
  }
}
