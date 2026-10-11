import * as React from 'react';
import { AppState as AppStateRN, AppStateStatus, NativeEventSubscription } from 'react-native';

export interface AppStateProps {
  onActive?: (state: AppStateStatus) => void;
  onInactive?: (state: AppStateStatus) => void;
}

export interface AppStateState {
  appState: AppStateStatus;
}

export default class AppState extends React.Component<
  AppStateProps,
  AppStateState
> {
  state: AppStateState = {
    appState: AppStateRN.currentState,
  };

  isReallyMounted: boolean = false;
  changeSubscription?: NativeEventSubscription;

  componentDidMount() {
    this.isReallyMounted = true;
    this.changeSubscription = AppStateRN.addEventListener('change', this.onChangeAppState);
  }

  componentWillUnmount() {
    this.isReallyMounted = false;
    // AppStateRN.removeEventListener('change', this.onChangeAppState);
    this.changeSubscription && this.changeSubscription.remove();
  }

  onChangeAppState = (nextAppState: AppStateStatus) => {
    if (!this.isReallyMounted) {
      return;
    }
    const { onInactive, onActive } = this.props;
    const { appState } = this.state;
    if (nextAppState.match(/inactive|background/)) {
      typeof onInactive === 'function' && onInactive(nextAppState);
    } else if (
      appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      typeof onActive === 'function' && onActive(nextAppState);
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return null;
  }
}
