import * as React from 'react';
import { StyleSheet, TouchableOpacityProps, ViewStyle } from 'react-native';
import LayoutAnimations from '../../resources/constants/LayoutAnimations';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import NetworkManager from '../network/NetworkManager';
import AlertMessage from './AlertMessage';

const TAG = '[NetworkStatusAlert]';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  } as ViewStyle,
});

export interface NetworkStatus {
  isConnected: boolean;
}

type AlertMessageSingleProps = Exclude<
  TouchableOpacityProps,
  'accessibilityLabel' | 'children'
>;

export interface NetworkStatusAlertProps extends AlertMessageSingleProps {
  onChangeNetworkStatus?: (isConnected: boolean) => void;
  children?: React.ReactNode[] | React.ReactChild;
}

export interface NetworkStatusAlertState {
  isConnected: boolean;
}

export default class NetworkStatusAlert extends React.Component<
  NetworkStatusAlertProps,
  NetworkStatusAlertState
> {
  state: NetworkStatusAlertState = {
    isConnected: true,
  };

  isReallyMounted: boolean = false;

  componentDidMount() {
    this.isReallyMounted = true;
    Emitter.on('onChangeNetworkState', this.onChangeNetworkState);
    const isConnected = NetworkManager.isConnected;
    this.onChangeNetworkState({ isConnected });
  }

  componentWillUnmount() {
    this.isReallyMounted = false;
    Emitter.off('onChangeNetworkState', this.onChangeNetworkState);
  }

  onChangeNetworkState = ({ isConnected }: NetworkStatus) => {
    Log.debug(TAG, 'onChangeNetworkState', isConnected);
    if (!this.isReallyMounted) {
      return;
    }

    LayoutAnimations.default();
    this.setState({ isConnected });

    const { onChangeNetworkStatus } = this.props;
    if (typeof onChangeNetworkStatus === 'function') {
      onChangeNetworkStatus(!isConnected);
    }
  };

  render() {
    const { ...props } = this.props;
    const { isConnected } = this.state;

    if (isConnected) {
      return null;
    }
    return (
      <AlertMessage
        {...props}
        accessibilityLabel={'networkstatusalert_message'}
        message={L.networkstatusalert_message}
        style={styles.container}
      />
    );
  }
}
