import * as React from 'react';
import {View, Platform, PermissionsAndroid} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import Log from '../../resources/log/Log';
import {CacheObj} from '../../resources/persistence/models/CacheModel';
import {Emitter} from '../../resources/listeners';
import CacheService from '../../resources/persistence/CacheService';
import DeviceInfo from 'react-native-device-info';
import notifee, {
  AndroidBadgeIconType,
  AndroidCategory,
  AndroidVisibility,
} from '@notifee/react-native';
import {CommonActions, NavigationContainerRef} from '@react-navigation/native';
import MobileServiceManager from '../mobile-service/MobileServiceManager';
import {Colors} from '../../resources/constants';
import {L} from '../../resources/language';

const TAG = '[NotificationManager]';

export interface NotificationManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface NotificationManagerState {}

export default class NotificationManager extends React.Component<
  NotificationManagerProps,
  NotificationManagerState
> {
  static async checkPermissions() {
    // Android - requesting permissions on Android API level 33+
    if (MobileServiceManager.isGms) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return;
    }
    // iOS - requesting permissions on iOS devices
    if (Platform.OS === 'ios') {
      const status = await messaging().hasPermission();

      if (status === messaging.AuthorizationStatus.NOT_DETERMINED) {
        try {
          const authStatus = await messaging().requestPermission();

          Log.info(TAG, 'Authorization status:', authStatus);
        } catch (e) {
          Log.warn(TAG, 'checkPermissions', e);
        }
      }
    }
  }
  state: NotificationManagerState = {};

  notificationOpenedListener!: any;
  onTokenRefreshListener!: any;
  timeout!: NodeJS.Timeout;
  unsubscribe: any;
  unsubscribeForegroundMessage?: () => void;

  async componentDidMount() {
    const isGms = await DeviceInfo.hasGms();
    if (isGms || Platform.OS === 'ios') {
      Emitter.on('onSessionStatus', this.onSessionStatus);

      this.checkToken();
      this.onTokenRefreshListener = messaging().onTokenRefresh(fcmToken => {
        this.checkToken(fcmToken);
      });
      await NotificationManager.checkPermissions();
    }
  }

  async componentWillUnmount() {
    const isGms = await DeviceInfo.hasGms();
    if (isGms || Platform.OS === 'ios') {
      typeof this.onTokenRefreshListener === 'function' &&
        this.onTokenRefreshListener();
      Emitter.off('onSessionStatus', this.onSessionStatus);
      this.notificationOpenedListener && this.notificationOpenedListener();
      this.unsubscribeForegroundMessage && this.unsubscribeForegroundMessage();
    }
  }

  handleForegroundMessage = () => {
    this.unsubscribeForegroundMessage = messaging().onMessage(
      async remoteMessage => {
        Log.info(TAG, 'handleForegroundMessage', remoteMessage);
        await this.displayNotification(remoteMessage);
      },
    );
  };

  static handleBackgroundMessage = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      Log.info(TAG, 'handleBackgroundMessage', remoteMessage);
    });
  };

  displayNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    let channelId: string | undefined;
    const isGms = await DeviceInfo.hasGms();

    if (Platform.OS === 'ios') {
      // Request permissions (required for iOS)
      await notifee.requestPermission();
    }
    if (isGms) {
      // Create a channel (required for Android)
      channelId = await notifee.createChannel({
        id: 'reminders',
        name: L.notification_reminders_name,
      });
    }

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      id: remoteMessage.messageId,
      android: {
        channelId,
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        category: AndroidCategory.REMINDER,
        badgeIconType: AndroidBadgeIconType.LARGE,
        color: Colors.primary,
        visibility: AndroidVisibility.PUBLIC,
      },
    });
  };

  saveNewToken = async (fcmToken: string) => {
    await CacheService.createOrUpdate(CacheObj.init('fcmToken', fcmToken));
    await CacheService.createOrUpdate(CacheObj.init('newFcmToken', fcmToken));
    Log.info(TAG, 'saveNewToken', fcmToken);
  };

  checkToken = async (currentFcmToken = '') => {
    const cacheObj = await CacheService.findOne('fcmToken');
    const tokenSaved = cacheObj?.value;
    if (!currentFcmToken) {
      currentFcmToken = await messaging().getToken();
    }
    if (tokenSaved !== currentFcmToken) {
      this.saveNewToken(currentFcmToken);
    } else {
      Log.info(TAG, 'checkToken', 'No new token');
    }
  };

  onSessionStatus = (active: boolean) => {
    Log.debug(TAG, 'onSessionStatus', active);
    if (active) {
      /**
       * se necesita un timeout porque el evento se envia cuando inicia sesion
       * y luego existe un navigate por eso tiene 2 segundos se tiempo extra para
       * que espere el navigate
       */
      this.timeout = setTimeout(() => {
        this.handleForegroundMessage();
      }, 2000);
    } else {
      this.timeout && clearTimeout(this.timeout);
    }
  };

  navigate = (routeName: string, params: any = {}) => {
    const navigateAction = CommonActions.navigate({name: routeName});
    const navigation = this.props.navigation();
    navigation && navigation.dispatch(navigateAction);
  };

  render() {
    const {accessibilityLabel} = this.props;
    return <View accessibilityLabel={accessibilityLabel} />;
  }
}
