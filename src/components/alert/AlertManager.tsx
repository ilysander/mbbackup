import * as React from 'react';
import { ImageSourcePropType } from 'react-native';
import { A, AnalyticsEvent,K } from '../../resources/analytics';
import Warning from '../../resources/functions/Warning';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import AlertModal from '../ui/AlertModal';
import ToastCenter from '../ui/ToastCenter';
import MaintenanceModal from '../ui/MaintenanceModal';
import {
  AnalyticsTrackParams,
  LimitParam,
} from '../../resources/analytics/AnalyticsEvent';
import Config from '../../Config';
import AlertModalUpdate from '../ui/AlertModalUpdate';
import AlertModalMedia from '../ui/AlertModalMedia';
import { ToastProps } from '../ui/Toast';
import { TypeAlertScreen } from '../../resources/constants';
import { CommonActions, NavigationContainerRef } from '@react-navigation/native';

const TAG = '[AlertManager]';

export interface AlertEvent {
  tag: string;
  method: string;
  e: any;
  typeAlert?: TypeAlertScreen;
}

export interface AlertManagerMessageState {
  icon?: ImageSourcePropType;
  title?: string;
  message?: string;
}
export interface AlertManagerMessageUpdateState {
  icon?: ImageSourcePropType;
  title?: string;
  message?: string;
  confirmText?: string;
}
export interface AlertManagerMessageMediaState {
  icon?: ImageSourcePropType;
  title?: string;
  message1?: string;
  message2?: string;
  message3?: string;
  confirmText?: string;
}
export interface AlertManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface AlertManagerState {
  message?: AlertManagerMessageState;
  toast?: ToastProps;
  maintenance: boolean;
  isConnected: boolean;
  messageUpdate?: AlertManagerMessageUpdateState;
  messageMedia?: AlertManagerMessageMediaState;
  tag?: string;
  e?: any;
  type?: TypeAlertScreen;
}

interface NetworkState {
  isConnected: boolean;
}

export default class AlertManager extends React.Component<
  AlertManagerProps,
  AlertManagerState
> {
  state: AlertManagerState = {
    message: undefined,
    toast: undefined,
    maintenance: false,
    isConnected: true,
    messageUpdate: undefined,
    messageMedia: undefined,
    tag: undefined,
    e: {},
  };

  toastCenter!: ToastCenter | null;

  componentDidMount() {
    Emitter.on('onAlert', this.onAlert);
    Emitter.on('onAlertUpdate', this.onAlertUpdate);
    Emitter.on('onAlertMedia', this.onAlertMedia);
    Emitter.on('onToast', this.onToast);
    Emitter.on('onChangeNetworkState', this.onChangeNetworkState);
  }

  componentWillUnmount() {
    Emitter.off('onAlert', this.onAlert);
    Emitter.off('onAlertUpdate', this.onAlertUpdate);
    Emitter.off('onAlertMedia', this.onAlertMedia);
    Emitter.off('onToast', this.onToast);
    Emitter.off('onChangeNetworkState', this.onChangeNetworkState);
  }
  onChangeNetworkState = ({ isConnected }: NetworkState) => {
    this.setState({ isConnected });
  };

  onToast = (toast: ToastProps) => {
    this.toastCenter && this.toastCenter.show(toast);
  };

  navigate = (routeName: string) => {
    const navigateAction = CommonActions.navigate({ name: routeName });
    const navigation = this.props.navigation();
    navigation && navigation.dispatch(navigateAction);
    // const navigateAction = NavigationActions.navigate({
    //   routeName,
    //   params: {},
    // });
    // const navigation = this.props.navigation();
    // navigation && navigation.dispatch(navigateAction);
  };

  updateScreenEventValue(
    key: string,
    subSeccion: string | number,
    value: string | number
  ): void {
    K[key] = Object.assign({}, K[key], {
      SubSeccion: subSeccion,
      Valor: value,
    });
  }

  trackAlert = (event: AlertEvent) => {
    let params: AnalyticsTrackParams = {};
    const { e, method, tag } = event;
    if (e.name && e.name === 'CodeError') {
      params = {
        name: e.name,
        tag: e.tag,
        method: e.method,
        message: (e.message || '').substring(0, LimitParam),
        code: e.code,
        stack: (e.stack || '').substring(0, LimitParam),
      };
    } else if (e.name && e.name === 'RequestError') {
      params = {
        name: e.name,
        tag: e.tag,
        method: e.method,
        message: (e.message || '').substring(0, LimitParam),
        code: e.code,
      };
    } else if (e.code) {
      params = {
        name: 'ExceptionError',
        code: e.code,
        tag: e.tag || tag,
        method: e.method || method,
        message: (e.message || '').substring(0, LimitParam),
      };
    } else if (e) {
      params = {
        name: 'JavascriptError',
        tag: e.tag || tag,
        method: e.method || method,
        message: e.toString().substring(0, LimitParam),
      };
    } else {
      params = {
        name: 'UnknownError',
        tag,
        method,
      };
    }

    const label = params?.tag
      .toString()
      .split('[')[1]
      .split(']')[0];
    this.updateScreenEventValue(label, params?.code, params?.message);
    const modalEvents = K[label];
    AnalyticsEvent.trackEvent('virtualEventApp', modalEvents);
  };
  onAlert = (event: AlertEvent) => {
    const { e, tag } = event;
    this.setState({ tag, e });
    Log.debug(TAG, 'onAlert', e);
    const { isConnected } = this.state;
    if (!isConnected) {
      Log.info(TAG, 'onAlert', '!isConnected');
      return;
    }
    const maintenance = Config.settings.maintenanceMode;
    this.trackAlert(event);
    if (maintenance) {
      this.setState({ maintenance });
    } else {
      this.setState({ message: Warning.createMessageByError(e) });
    }
  };
  onAlertUpdate = (event: AlertEvent) => {
    const { e } = event;
    Log.debug(TAG, 'onAlert', e);
    const { isConnected } = this.state;
    if (!isConnected) {
      Log.info(TAG, 'onAlert', '!isConnected');
      return;
    }
    const maintenance = Config.settings.maintenanceMode;

    this.trackAlert(event);
    if (maintenance) {
      this.setState({ maintenance });
    } else {
      this.setState({ messageUpdate: Warning.createUpdateMessage() });
    }
  };
  onAlertMedia = (event: AlertEvent) => {
    const { e, typeAlert } = event;
    Log.debug(TAG, 'onAlert', e);
    const { isConnected } = this.state;
    if (!isConnected) {
      Log.info(TAG, 'onAlert', '!isConnected');
      return;
    }
    const maintenance = Config.settings.maintenanceMode;

    this.trackAlert(event);
    if (maintenance) {
      this.setState({ maintenance });
    } else {
      this.setState({
        messageMedia: Warning.createMessageMedia(typeAlert),
        type: typeAlert,
      });
    }
  };

  btnsuccess = (isModalMedia?: boolean) => {
    const { message, code } = this.state.e;

    let label = this.state.tag
      ?.toString()
      .split('[')[1]
      .split(']')[0];
    label = label + 'btm_modal';
    this.updateScreenEventValue(label, code, message);
    let buttonEvent;
    if (label !== undefined) {
      buttonEvent = K[label];
    }

    if (buttonEvent) AnalyticsEvent.trackEvent('virtualEventApp', buttonEvent);

    Log.debug(TAG, 'close');
    this.setState({
      message: undefined,
      maintenance: false,
      messageUpdate: undefined,
      messageMedia: undefined,
      tag: undefined,
      e: {},
    });
    if (isModalMedia) {
      this.navigate('Queries');
    }
  };

  close = (isModalMedia?: boolean) => {
    Log.debug(TAG, 'close');
    const { type } = this.state;
    this.setState({
      message: undefined,
      maintenance: false,
      messageUpdate: undefined,
      messageMedia: undefined,
      tag: undefined,
      e: {},
      type: TypeAlertScreen.DEFAULT,
    });
    if (isModalMedia && type == TypeAlertScreen.DEFAULT) {
      this.navigate('Queries');
    }
  };

  render() {
    const { message, maintenance, messageUpdate, messageMedia } = this.state;
    const { accessibilityLabel } = this.props;

    return [
      <MaintenanceModal
        accessibilityLabel={accessibilityLabel}
        key={'maintenance'}
        visible={!!maintenance}
        onSuccess={this.close}
        onClose={this.close}
      />,
      <AlertModal
        accessibilityLabel={accessibilityLabel}
        key={'modal'}
        visible={!!message}
        onSuccess={this.btnsuccess}
        onClose={this.close}
        {...message}
      />,
      <AlertModalUpdate
        accessibilityLabel={accessibilityLabel}
        key={'modalupdate'}
        visible={!!messageUpdate}
        onSuccess={this.close}
        onClose={this.close}
        {...messageUpdate}
      />,
      <AlertModalMedia
        accessibilityLabel={accessibilityLabel}
        key={'modalmedia'}
        visible={!!messageMedia}
        onSuccess={() => {
          this.close(true);
        }}
        {...messageMedia}
      />,
      <ToastCenter
        key={'toast'}
        ref={ref => {
          this.toastCenter = ref;
        }}
      />,
    ];
  }
}
