import { NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';
import {
  AppState,
  AppStateStatus,
  BackHandler,
  EmitterSubscription,
  Keyboard,
  NativeEventSubscription,
  Platform,
  View,
} from 'react-native';
import { Log } from '../../resources/log';
import { KeyboardUtil } from '../../resources/util';

const TAG = '[KeyboardManager]';

export interface KeyboardManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface KeyboardManagerState {
  isEnabled: boolean;
  appState: AppStateStatus | '';
}

export default class KeyboardManager extends React.Component<
  KeyboardManagerProps,
  KeyboardManagerState
> {
  state: KeyboardManagerState = {
    isEnabled: false,
    appState: '',
  };

  keyboardWillShowListener!: EmitterSubscription;
  keyboardWillHideListener!: EmitterSubscription;

  appStateSubscription?: NativeEventSubscription;

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    // AppState.removeEventListener('change', this.handleAppStateChange);
    this.appStateSubscription && this.appStateSubscription.remove();
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    const { appState } = this.state;
    if (
      appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      Platform.OS === 'android'
    ) {
      KeyboardUtil.hide();
    }
    this.setState({ appState: nextAppState || '' });
  };
  handleBackPress = () => {
    Log.debug(TAG, 'handleBackPress');
    const { isEnabled } = this.state;
    if (!isEnabled) {
      return false;
    }
    KeyboardUtil.hide();
    return true;
  };

  keyboardWillShow = () => {
    this.setState({
      isEnabled: true,
    });
  };

  keyboardWillHide = () => {
    this.setState({
      isEnabled: false,
    });
  };

  render() {
    const { accessibilityLabel } = this.props;
    return <View accessibilityLabel={accessibilityLabel} />;
  }
}
