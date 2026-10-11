const moment = require('moment');
import API from '.';
import Config from '../Config';
import {Log} from '../resources/log';
import UserService from '../resources/persistence/UserService';
import {UserModel, UserObj} from '../resources/persistence/models/UserModel';
import EmailStatusModel, {
  EmailStatusObj,
} from '../resources/persistence/models/EmailStatusModel';
import {
  OnboardingObj,
  OnboardingModel,
} from '../resources/persistence/models/OnboardingModel';
import {Environment, GetResponse} from './backend/response/Session';
import Emitter from '../resources/listeners/Emitter';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import {AnalyticsEvent, A} from '../resources/analytics';
import {PreferencesUserDataModifyPreResponse} from './backend/response/Execute';
import ReminderAlertService from '../resources/persistence/ReminderAlertService';

interface DataListLoading {
  loading: boolean;
  lastRequestTime: Date;
  dataList: any[];
}
interface DataLoading<T> {
  loading: boolean;
  lastRequestTime?: Date;
  data: T;
}

interface LpdpData {
  value?: boolean;
  show: boolean;
}
import MobileServiceManager from '../components/mobile-service/MobileServiceManager';
import {Platform} from 'react-native';

const TAG = '[Session]';
export default class Session {
  static accessToken?: string;
  static activeEnvironment?: Environment;
  static user?: UserModel;
  static profile?: PreferencesUserDataModifyPreResponse;
  static expiresAt: Date = new Date();
  static timeout?: NodeJS.Timeout;
  static onboarding?: OnboardingModel;
  static emailStatus?: EmailStatusModel;

  // DataSession

  static dataAccounts?: DataListLoading;
  static dataLoans?: DataListLoading;
  static dataCreditline?: DataLoading<any>;
  static dataLpdp: DataLoading<LpdpData> = {
    loading: false,
    data: {
      value: undefined,
      show: false,
    },
    lastRequestTime: undefined,
  };

  static getActiveEnvironment() {
    return Session.activeEnvironment;
  }

  static hasPhone() {
    if (!Session.profile) {
      return false;
    }
    return !!Session.profile.mobilePhone;
  }

  static setProfile(profile: PreferencesUserDataModifyPreResponse) {
    Session.profile = profile;
    this.getLpdp();
  }

  static getDocumentNumber() {
    if (!Session.profile || !Session.profile.client) {
      return;
    }
    return Session.profile.client._documentNumber;
  }
  static getDocumentType() {
    if (!Session.profile || !Session.profile.client) {
      return;
    }
    return Session.profile.client.documentType;
  }
  static getDocumentCountry() {
    if (!Session.profile || !Session.profile.client) {
      return '';
    }
    return Session.profile.client.documentCountry || '';
  }

  static async getLpdp() {
    try {
      ReminderAlertService.preValidateLPDP();
    } catch (e) {
      Log.warn(TAG, (e as any).message);
    }
  }

  static setActiveEnvironment(environment: Environment) {
    Session.activeEnvironment = environment;
  }

  static getAccessToken() {
    return Session.accessToken;
  }

  static async createUserIfNotExists(session: GetResponse) {
    const user = UserObj.init(session.user);
    Session.user = user;
    try {
      const findUser = await UserService.findOne(user.id);
      if (findUser) {
        return;
      }
    } catch (e) {
      Log.warn(TAG, 'error', (e as any).message);
      await UserService.create(user);
    }
  }

  static async onboardingSave(onboardingValue: string) {
    const onboarding = OnboardingObj.init(onboardingValue);
    Session.onboarding = onboarding;
    try {
      const findOnboarding = await UserService.onboardingGet(onboarding.id);
      if (findOnboarding) {
        return;
      }
    } catch (e) {
      await UserService.onboardingSave(onboarding);
    }
  }

  static async emailStatusSave(key: string, emailStatusValue: string) {
    const emailStatus = EmailStatusObj.init(key, emailStatusValue);
    Session.emailStatus = emailStatus;
    try {
      const findEmailStatus = await UserService.emailStatusGet(emailStatus.id);
      if (findEmailStatus) {
        return;
      }
    } catch (e) {
      await UserService.emailStatusSave(emailStatus);
    }
  }

  static async emailStatusUpdate(key: string, emailStatusValue: string) {
    const emailStatus = EmailStatusObj.init(key, emailStatusValue);
    Session.emailStatus = emailStatus;
    await UserService.emailStatusSave(emailStatus);
  }

  static async onboardingGet(
    onboardingValue: string,
  ): Promise<(OnboardingModel & Realm.Object) | undefined> {
    const onboarding = OnboardingObj.init(onboardingValue);
    Session.onboarding = onboarding;
    const findOnboarding = await UserService.onboardingGet(onboarding.id);
    return findOnboarding;
  }

  static async emailStatusGet(
    key: string,
    emailStatusValue: string,
  ): Promise<(EmailStatusModel & Realm.Object) | undefined> {
    try {
      const emailStatus = EmailStatusObj.init(key, emailStatusValue);
      Session.emailStatus = emailStatus;
      const findEmailStatus = await UserService.emailStatusGet(emailStatus.id);
      return findEmailStatus;
    } catch (error) {
      return;
    }
  }

  // Inicio Session
  static async save(accessToken: string) {
    Session.accessToken = accessToken;
    Session.expiresAt = moment()
      .add(Config.settings.sessionIncreaseSeconds, 'seconds')
      .toDate();
    const session = await Session.updateExpirationDate();

    if (session && session.user) {
      if (MobileServiceManager.isGms || Platform.OS === 'ios') {
        crashlytics().setUserId(session.user);
        analytics().setUserProperties({
          id: session.user,
          ip: session.ip,
          environment: session.environment
            ? session.environment.toString()
            : '',
          lang: session.lang,
          status: session.status,
          channel: session.channel,
        });
      }
      await Session.createUserIfNotExists(session);
    }
    Emitter.emit('onSessionStatus', true);
    AnalyticsEvent.track(A.session_save);
  }

  // Termina Session(logout = el usuario cierra la sesion)
  static async clear(logout = true) {
    Session.timeout && clearTimeout(Session.timeout);
    Session.user = undefined;
    if (logout) {
      Session.logout();
    }
    Session.accessToken = undefined;
    Emitter.emit('onTourManagerStop');
    Emitter.emit('onSessionStatus', false);
    AnalyticsEvent.track(A.session_clear);

    this.clearData();
  }

  static async clearData() {
    // Session.accounts = [];
  }

  static async logout() {
    try {
      await API.Session.delete();
    } catch (e) {
      Log.debug(TAG, 'logout', e);
    }
  }

  static async registerActivity() {
    Log.debug(TAG, 'registerActivity');
    Session.timeout && clearTimeout(Session.timeout);
    Session.timeout = setTimeout(Session.extendExpirationDate, 10 * 1000);
  }

  static async extendExpirationDate() {
    Log.debug(TAG, 'extendExpirationDate');
    const isLoggedIn = !!Session.accessToken;
    if (!isLoggedIn) {
      Log.debug(TAG, 'extendExpirationDate', '!isLoggedIn');
      return;
    }
    try {
      await API.Session.put();
    } catch (e) {
      Log.exception(TAG, 'extendExpirationDate-put', e);
    }
    await Session.updateExpirationDate();
  }

  static async updateExpirationDate() {
    let session;
    try {
      const response = await API.Session.get();
      session = response.body.data;
      const headerDate = response.headers.Date || response.headers.date;
      const secondsDiff = moment
        .duration(moment().diff(moment(headerDate)))
        .asSeconds();
      Session.expiresAt = moment(session.expiresAt)
        .add(secondsDiff, 'seconds')
        .toDate();
    } catch (e) {
      Log.exception(TAG, 'updateExpirationDate', e);
    }
    return session;
  }
}
