const moment = require('moment');
import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';
import Session from '../../api/Session';
import { L } from '../../resources/language';
import { AlertModal } from '../ui';

export interface SessionManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface SessionManagerState {
  isNearExpiry: boolean;
  isExpired: boolean;
  isConnected: boolean;
}

export default class SessionManager extends React.Component<
  SessionManagerProps,
  SessionManagerState
> {
  state: SessionManagerState = {
    isNearExpiry: false,
    isExpired: false,
    isConnected: true,
  };

  interval!: any;

  checkSession = async () => {
    const { expiresAt, accessToken } = Session;
    if (!accessToken) {
      return;
    }
    const animationDuration = 20;
    const diff = moment.duration(moment(expiresAt).diff(moment())).asSeconds();
    const isExpired = diff < animationDuration;
    let isNearExpiry = diff < 15 + animationDuration;
    if (isExpired) {
      isNearExpiry = false;
    }

    if (isExpired) {
      Session.clear(false);

      this.navigate('SignIn');
    }

    this.setState({ isNearExpiry, isExpired });
  };

  closeSession = () => {
    Session.clear();
    this.navigate('SignIn');
    this.hideAlert();
  };

  startInterval = () => {
    this.stopInterval();
    this.interval = setInterval(() => {
      this.checkSession();
    }, 5 * 1000);
  };

  stopInterval = () => {
    this.interval && clearInterval(this.interval);
  };

  navigate = (route: string) => {
    const navigateAction = CommonActions.navigate({
      name: route,
      params: {},
    });
    const navigation = this.props.navigation();
    navigation && navigation.dispatch(navigateAction);
  };

  hideAlert = () => {
    this.setState({ isNearExpiry: false, isExpired: false });
  };

  extendSession = async () => {
    this.stopInterval();
    this.hideAlert();
    await Session.extendExpirationDate();
    this.startInterval();
  };

  componentDidMount() {
    this.startInterval();
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  onChangeState = (isConnected: boolean) => {
    this.setState({ isConnected });
  };

  render() {
    const { isExpired, isNearExpiry } = this.state;
    const { accessibilityLabel } = this.props;
    const { accessToken } = Session;
    const isLoggedIn = !!accessToken;

    return (
      <View accessibilityLabel={accessibilityLabel}>
        {isLoggedIn && isNearExpiry && (
          <AlertModal
            visible
            accessibilityLabel={'sessionmanager_alertmodal_isnearexpiry'}
            title={L.sessionmanager_near_expiry_title}
            message={L.sessionmanager_near_expiry_message}
            onClose={this.hideAlert}
            cancelButton={{
              onPress: this.closeSession,
              title: L.alertmodaloptionsneartoexpire_button_cancel,
              accessibilityLabel: 'alertmodaloptionsneartoexpire_button_cancel',
            }}
            actionButton={{
              onPress: this.extendSession,
              accessibilityLabel:
                'alertmodaloptionsneartoexpire_button_success',
              title: L.alertmodaloptionsneartoexpire_button_success,
            }}
          />
        )}
        {isExpired && (
          <AlertModal
            visible
            accessibilityLabel={'sessionmanager_alertmodal_isexpired'}
            title={L.sessionmanager_has_expired_title}
            message={L.sessionmanager_has_expired_message}
            onClose={this.hideAlert}
            onSuccess={this.hideAlert}
          />
        )}
      </View>
    );
  }
}
