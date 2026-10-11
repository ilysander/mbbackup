const moment = require('moment');
import API from '.';
import Config from '../Config';
import {Log} from '../resources/log';
import {UserService} from '../resources/persistence';
import {UserModel} from '../resources/persistence/models';
import {Environment, GetResponse} from './backend/response/Session';
import {Emitter} from '../resources/listeners';
import {AnalyticsEvent, A} from '../resources/analytics';
import {PreferencesUserDataModifyPreResponse} from './backend/response/Execute';
import {UserObj} from '../resources/persistence/models/UserModel';

const TAG = '[Session]';
export default class Session {
  static accessToken?: string;
  static activeEnvironment?: Environment;
  static user?: UserModel;
  static profile?: PreferencesUserDataModifyPreResponse;
  static expiresAt: Date = new Date();
  static timeout?: NodeJS.Timeout;

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
    } catch (error) {
      const e = error as any;
      Log.warn(TAG, 'error', e.message);
      await UserService.create(user);
    }
  }

  static async save(accessToken: string) {
    Session.accessToken = accessToken;
    Session.expiresAt = moment()
      .add(Config.settings.sessionIncreaseSeconds, 'seconds')
      .toDate();
    const session = await Session.updateExpirationDate();

    if (session) {
      await Session.createUserIfNotExists(session);
    }
    Emitter.emit('onSessionStatus', true);
    AnalyticsEvent.track(A.session_save);
  }

  static async clear(logout = true) {
    Session.timeout && clearTimeout(Session.timeout);
    Session.user = undefined;
    if (logout) {
      Session.logout();
    }
    Session.accessToken = undefined;
    Emitter.emit('onSessionStatus', false);
    AnalyticsEvent.track(A.session_clear);
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
