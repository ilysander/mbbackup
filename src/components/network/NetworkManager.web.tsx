import * as React from 'react';
import {
  AppState,
  AppStateStatus,
  NativeEventSubscription,
  Platform,
  View,
} from 'react-native';
import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import pinch from 'react-native-pinch';
import {Emitter} from '../../resources/listeners';
import {Log} from '../../resources/log';
import {Validate} from '../../resources/functions';
import {NavigationContainerRef} from '@react-navigation/native';

const TAG = '[NetworkManager]';

export interface NetworkManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface NetworkManagerState {
  isConnected: boolean;
  appState: AppStateStatus;
}

export default class NetworkManager extends React.Component<
  NetworkManagerProps,
  NetworkManagerState
> {
  static isConnected = true;
  state: NetworkManagerState = {
    isConnected: true,
    appState: 'active',
  };

  timeout!: NodeJS.Timeout;
  listener?: NetInfoSubscription;
  changeSubscription?: NativeEventSubscription;

  componentDidMount() {
    NetworkManager.isConnected = this.state.isConnected;
    this.changeSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
    this.listener = NetInfo.addEventListener(this.onChangeState);
    this.updateState();
  }

  componentWillUnmount() {
    this.listener && this.listener();
    this.changeSubscription && this.changeSubscription.remove();
  }

  componentDidUpdate(
    _prevProps: NetworkManagerProps,
    prevState: NetworkManagerState,
  ) {
    if (prevState.isConnected !== this.state.isConnected) {
      NetworkManager.isConnected = this.state.isConnected;
    }
  }

  updateState = async () => {
    try {
      const state = await NetInfo.fetch();
      this.onChangeState(state);
    } catch (e) {
      Log.exception(TAG, 'updateState', e);
    }
  };

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    const {appState} = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      this.updateState();
    }
    this.setState({appState: nextAppState || ''});
  };

  onChangeState = (state: NetInfoState) => {
    const isConnectedState = state.isConnected;
    Log.debug(TAG, 'onChangeState', isConnectedState);

    if (Validate.isDemo()) {
      this.setState({isConnected: true});
      return;
    }

    if (Platform.OS !== 'ios') {
      const isConnected = !!isConnectedState;
      this.setState({isConnected});
      Emitter.emit('onChangeNetworkState', {isConnected});
      return;
    }
    this.timeout && clearTimeout(this.timeout);

    this.timeout = setTimeout(async () => {
      let isConnected = isConnectedState;
      try {
        const response = await pinch.fetch('https://www.google.com', {
          method: 'HEAD',
          timeoutInterval: 4 * 1000,
        });
        Log.debug(TAG, 'onChangeState', 'response', response);
        isConnected = response.status === 200;
      } catch (e) {
        isConnected = false;
        Log.warn(TAG, 'onChangeState', e);
      }
      this.setState({isConnected});
      Emitter.emit('onChangeNetworkState', {isConnected});
    }, 2000);
  };

  render() {
    const {accessibilityLabel} = this.props;
    return <View accessibilityLabel={accessibilityLabel} />;
  }
}
