import remoteConfig from '@react-native-firebase/remote-config';
import Log from '../log/Log';
import {FeaturesType} from './Features';
import Config from '../../Config';
import {L} from '../language';
import {TransfersOtherBanksErrors} from '../constants';
import CacheService from '../persistence/CacheService';
import {CacheObj} from '../persistence/models';
const AGCRemoteConfig = require('@react-native-agconnect/remoteconfig').default;
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

const defaultInterval = __DEV__ ? 0 : 3600;

const enableDeveloperMode = async () => {
  if (__DEV__) {
    const isGms = await DeviceInfo.hasGms();

    if (!isGms || Platform.OS !== 'ios') {
      try {
        await AGCRemoteConfig.setDeveloperMode(true);
      } catch (err) {
        Log.warn(TAG, 'Error, trying set developer mode on HMS', err);
      }
    }
  }
};

enableDeveloperMode();

export type ServerType = typeof Config.server;
export type SettingsType = typeof Config.settings;
export type SSLPinningType = typeof Config.sslPinning;
export type MutualAuthType = typeof Config.mutualAuth;
export type RecaptchaType = typeof Config.recaptcha;
export type RSAType = typeof Config.rsa;
export type LocaleType = typeof L;
export type TransfersOtherBanksErrorsType =
  typeof TransfersOtherBanksErrors.config;
export type FacephiAndroidLicenceType = typeof Config.facephiAndroidLicence;
export type FacephiIosLicenceType = typeof Config.facephiIosLicence;

const TAG = '[RemoteConfig]';
export default class RemoteConfig {
  static async update(interval = defaultInterval) {
    const isGms = await DeviceInfo.hasGms();
    try {
      if (isGms || Platform.OS === 'ios') {
        await remoteConfig().fetch(interval);
        const activated = await remoteConfig().fetchAndActivate();
        if (!activated) {
          Log.warn(TAG, 'update', '!activated');
        }
      } else {
        await AGCRemoteConfig.fetch(interval);
        await AGCRemoteConfig.applyLastFetched();
      }

      await this.updateRSA();
      await this.updateFeatures();
      await this.updateServer();
      await this.updateSettings();
      await this.updateSSLPining();
      await this.updateMutualAuth();
      await this.updateLocale();
      await this.updateCaptcha();
      await this.updateTransfersOtherBanksErrors();
      await this.updateFacephiAndroidLicense();
      await this.updateFacephiIosLicense();
    } catch (e) {
      Log.warn(TAG, 'update', e);
      this.load();
    }
  }

  static async load() {
    Log.debug(TAG, 'load');
    await this.loadRSA();
    await this.loadFeatures();
    await this.loadServer();
    await this.loadSettings();
    await this.loadSSLPining();
    await this.loadMutualAuth();
    await this.loadLocale();
    await this.loadCaptcha();
    await this.loadTransfersOtherBanksErrors();
    await this.updateFacephiAndroidLicense();
    await this.updateFacephiIosLicense();
  }

  private static async getValue(value: string) {
    const isGms = await DeviceInfo.hasGms();
    if (isGms || Platform.OS === 'ios') {
      const snapshot = await remoteConfig().getValue(value);
      return snapshot.asString();
    }
    {
      const snapshot = await AGCRemoteConfig.getValue(value);
      return snapshot;
    }
  }
  private static async updateRSA() {
    try {
      let value = JSON.stringify(Config.rsa);

      if (!value) {
        Log.warn(TAG, 'updateRSA', 'empty');
        return;
      }

      await CacheService.createOrUpdate(CacheObj.init('rsa', value));
      Log.debug(TAG, 'updateRSA', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateRSA', e);
    }
  }
  private static async updateFeatures() {
    try {
      const value = await this.getValue('features');

      if (!value) {
        Log.warn(TAG, 'updateFeatures', 'empty');
        return;
      }
      const data = JSON.parse(value) as FeaturesType;
      Config.features = Object.assign(Config.features, data);

      await CacheService.createOrUpdate(CacheObj.init('features', value));
      Log.debug(TAG, 'updateFeatures', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateFeatures', e);
    }
  }
  private static async updateCaptcha() {
    try {
      const value = await this.getValue('recaptcha');

      if (!value) {
        Log.warn(TAG, 'updateCaptcha', 'empty');
        return;
      }
      const data = JSON.parse(value) as RecaptchaType;
      Config.recaptcha = Object.assign(Config.recaptcha, data);

      await CacheService.createOrUpdate(CacheObj.init('recaptcha', value));
      Log.debug(TAG, 'updateCaptcha', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateCaptcha', e);
    }
  }
  private static async updateServer() {
    try {
      const value = await this.getValue('server');

      if (!value) {
        Log.warn(TAG, 'updateServer', 'empty');
        return;
      }
      const data = JSON.parse(value) as ServerType;
      Config.server = Object.assign(Config.server, data);

      await CacheService.createOrUpdate(CacheObj.init('server', value));
      Log.debug(TAG, 'updateServer', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateServer', e);
    }
  }
  private static async updateSettings() {
    try {
      const value = await this.getValue('settings');

      if (!value) {
        Log.warn(TAG, 'updateSettings', 'empty');
        return;
      }
      const data = JSON.parse(value) as SettingsType;
      Config.settings = Object.assign(Config.settings, data);
      await CacheService.createOrUpdate(CacheObj.init('settings', value));
      Log.debug(TAG, 'updateSettings', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateSettings', e);
    }
  }
  private static async updateSSLPining() {
    try {
      let value = JSON.stringify(Config.sslPinning);

      if (!value) {
        Log.warn(TAG, 'updateSSLPining', 'empty');
        return;
      }

      await CacheService.createOrUpdate(CacheObj.init('sslPinning', value));
      Log.debug(TAG, 'updateSSLPining', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateSSLPining', e);
    }
  }
  private static async updateMutualAuth() {
    try {
      let value = JSON.stringify(Config.mutualAuth);

      if (!value) {
        Log.warn(TAG, 'updateMutualAuth', 'empty');
        return;
      }

      await CacheService.createOrUpdate(CacheObj.init('mutualAuth', value));
      Log.debug(TAG, 'updateMutualAuth', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateMutualAuth', e);
    }
  }

  private static async updateLocale() {
    try {
      const value = await this.getValue('locale');

      if (!value) {
        Log.warn(TAG, 'updateLocale', 'empty');
        return;
      }
      const data = JSON.parse(value) as LocaleType;
      Object.keys(data).forEach(key => {
        const keyName = key as keyof LocaleType;
        L[keyName] = data[keyName];
      });

      await CacheService.createOrUpdate(CacheObj.init('locale', value));
      Log.debug(TAG, 'updateLocale', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateLocale', e);
    }
  }

  private static async updateTransfersOtherBanksErrors() {
    try {
      const value = await this.getValue('transfersOtherBanksErrors');

      if (!value) {
        Log.warn(TAG, 'updateTransfersOtherBanksErrors', 'empty');
        return;
      }
      const data = JSON.parse(value) as TransfersOtherBanksErrorsType;
      TransfersOtherBanksErrors.config = Object.assign(
        TransfersOtherBanksErrors.config,
        data,
      );
      await CacheService.createOrUpdate(
        CacheObj.init('transfersOtherBanksErrors', value),
      );
      Log.debug(TAG, 'updateTransfersOtherBanksErrors', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateTransfersOtherBanksErrors', e);
    }
  }

  private static async updateFacephiAndroidLicense() {
    try {
      const value = await this.getValue('facephiAndroidLicence');

      if (!value) {
        Log.warn(TAG, 'updateFacephiAndroidLicense', 'empty');
        return;
      }
      const data = JSON.parse(value) as FacephiAndroidLicenceType;
      Config.facephiAndroidLicence = Object.assign(
        Config.facephiAndroidLicence,
        data,
      );

      await CacheService.createOrUpdate(
        CacheObj.init('facephiAndroidLicence', value),
      );
      Log.debug(TAG, 'updateFacephiAndroidLicense', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateFacephiAndroidLicense', e);
    }
  }

  private static async updateFacephiIosLicense() {
    try {
      const value = await this.getValue('facephiIosLicence');

      if (!value) {
        Log.warn(TAG, 'updateFacephiIosLicense', 'empty');
        return;
      }
      const data = JSON.parse(value) as FacephiIosLicenceType;
      Config.facephiIosLicence = Object.assign(Config.facephiIosLicence, data);

      await CacheService.createOrUpdate(
        CacheObj.init('facephiIosLicence', value),
      );
      Log.debug(TAG, 'updateFacephiIosLicense', 'updated');
    } catch (e) {
      Log.warn(TAG, 'updateFacephiIosLicense', e);
    }
  }

  private static async loadRSA() {
    Log.debug(TAG, 'loadRSA');
    try {
      const cache = await CacheService.findOne('rsa');

      if (!!cache && !cache.value) {
        Log.warn(TAG, 'loadRSA', 'empty');
        return;
      }

      if (!!cache && !!cache.value) {
        const data = JSON.parse(cache.value) as RSAType;
        Config.rsa = Object.assign(Config.rsa, data);
        Log.debug(TAG, 'loadRSA', 'loaded');
      }
    } catch (e) {
      Log.info(TAG, 'loadRSA', e);
    }
    return;
  }

  private static async loadFeatures() {
    Log.debug(TAG, 'loadFeatures');
    try {
      const cache = await CacheService.findOne('features');
      if (!!cache && !cache.value) {
        Log.warn(TAG, 'loadFeatures', 'empty');
        return;
      }
      if (!!cache && cache.value) {
        const data = JSON.parse(cache.value) as FeaturesType;
        Config.features = Object.assign(Config.features, data);
        Log.debug(TAG, 'loadFeatures', 'loaded');
      }
    } catch (e) {
      Log.info(TAG, 'loadFeatures', e);
    }
  }

  private static async loadCaptcha() {
    Log.debug(TAG, 'loadCaptcha');
    try {
      const cache = await CacheService.findOne('recaptcha');
      if (!!cache && !cache.value) {
        Log.warn(TAG, 'loadCaptcha', 'empty');
        return;
      }
      if (!!cache && !!cache.value) {
        const data = JSON.parse(cache.value) as RecaptchaType;
        Config.recaptcha = Object.assign(Config.recaptcha, data);
        Log.debug(TAG, 'loadCaptcha', 'loaded');
      }
    } catch (e) {
      Log.info(TAG, 'loadCaptcha', e);
    }
  }
  private static async loadServer() {
    Log.debug(TAG, 'loadServer');
    try {
      const cache = await CacheService.findOne('server');
      if (!!cache && !cache.value) {
        Log.warn(TAG, 'loadServer', 'empty');
        return;
      }

      if (!!cache && !!cache.value) {
        const data = JSON.parse(cache.value) as ServerType;
        Config.server = Object.assign(Config.server, data);
        Log.debug(TAG, 'loadServer', 'loaded');
      }
    } catch (e) {
      Log.info(TAG, 'loadServer', e);
    }
  }
  private static async loadSettings() {
    Log.debug(TAG, 'loadSettings');
    try {
      const cache = await CacheService.findOne('settings');
      if (!cache) {
        return;
      }
      if (!cache.value) {
        Log.warn(TAG, 'loadSettings', 'empty');
        return;
      }
      const data = JSON.parse(cache.value) as SettingsType;
      Config.settings = Object.assign(Config.settings, data);
      Log.debug(TAG, 'loadSettings', 'loaded');
    } catch (e) {
      Log.info(TAG, 'loadSettings', e);
    }
  }
  private static async loadSSLPining() {
    Log.debug(TAG, 'loadSSLPining');
    try {
      const cache = await CacheService.findOne('sslPinning');
      if (!cache) {
        return;
      }
      if (!cache.value) {
        Log.warn(TAG, 'loadSSLPining', 'empty');
        return;
      }
      const data = JSON.parse(cache.value) as SSLPinningType;
      Config.sslPinning = Object.assign(Config.sslPinning, data);
      Log.debug(TAG, 'loadSSLPining', 'loaded');
    } catch (e) {
      Log.info(TAG, 'loadSSLPining', e);
    }
  }
  private static async loadMutualAuth() {
    Log.debug(TAG, 'loadMutualAuth');
    try {
      const cache = await CacheService.findOne('mutualAuth');
      if (!cache) {
        return;
      }
      if (!cache.value) {
        Log.warn(TAG, 'loadMutualAuth', 'empty');
        return;
      }
      const data = JSON.parse(cache.value) as MutualAuthType;
      Config.mutualAuth = Object.assign(Config.mutualAuth, data);
      Log.debug(TAG, 'loadMutualAuth', 'loaded');
    } catch (e) {
      Log.info(TAG, 'loadMutualAuth', e);
    }
  }
  private static async loadLocale() {
    Log.debug(TAG, 'loadLocale');
    try {
      const cache = await CacheService.findOne('locale');
      if (!cache) {
        return;
      }
      if (!cache.value) {
        Log.warn(TAG, 'loadLocale', 'empty');
        return;
      }
      const data = JSON.parse(cache.value) as LocaleType;
      Object.keys(data).forEach(key => {
        const keyName = key as keyof LocaleType;
        L[keyName] = data[keyName];
      });
      Log.debug(TAG, 'loadLocale', 'loaded');
    } catch (e) {
      Log.info(TAG, 'loadLocale', e);
    }
  }
  private static async loadTransfersOtherBanksErrors() {
    Log.debug(TAG, 'loadTransfersOtherBanksErrors');
    try {
      const cache = await CacheService.findOne('transfersOtherBanksErrors');
      if (!cache) {
        return;
      }
      if (!cache.value) {
        Log.warn(TAG, 'loadTransfersOtherBanksErrors', 'empty');
        return;
      }
      const data = JSON.parse(cache.value) as TransfersOtherBanksErrorsType;
      TransfersOtherBanksErrors.config = Object.assign(
        TransfersOtherBanksErrors.config,
        data,
      );
      Log.debug(TAG, 'loadTransfersOtherBanksErrors', 'loaded');
    } catch (e) {
      Log.info(TAG, 'loadTransfersOtherBanksErrors', e);
    }
  }
}
