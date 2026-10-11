import * as React from 'react';
import { AppStateStatus } from 'react-native';
import { Log } from '../../resources/log';
import AppState from './AppState';

const TAG = '[ExpirationTime]';

export interface ExpirationTimeProps {
  timeout: number;
  onExpiry?: (diff: number) => void;
}

export interface ExpirationTimeState {
  lastTime?: Date;
  appState: AppStateStatus;
}

export default class ExpirationTime extends React.Component<
  ExpirationTimeProps,
  ExpirationTimeState
> {
  static defaultProps = {
    timeout: 60 * 1 * 1000,
  };

  onInactive = (appState: AppStateStatus) => {
    const lastTime = new Date();
    this.setState({ appState, lastTime });
  };
  onActive = (appState: AppStateStatus) => {
    this.setState({ appState });
    this.checkExpiry();
  };

  checkExpiry = () => {
    const { timeout, onExpiry } = this.props;
    const { lastTime } = this.state;
    if (!lastTime) {
      Log.info(TAG, 'checkExpiry', '!lastTime');
      return;
    }

    const interval = new Date().getTime() - lastTime.getTime();
    const diff = timeout - interval;
    if (diff < 0) {
      Log.info(TAG, 'checkExpiry', 'expired', diff);
      typeof onExpiry === 'function' && onExpiry(diff);
    } else {
      Log.debug(TAG, 'checkExpiry', 'not expired', diff);
    }
  };

  render() {
    return <AppState onActive={this.onActive} onInactive={this.onInactive} />;
  }
}
