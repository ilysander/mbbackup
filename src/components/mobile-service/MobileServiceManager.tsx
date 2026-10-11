import * as React from 'react';
import { View } from 'react-native';
import { Log } from '../../resources/log';
import DeviceInfo from 'react-native-device-info';
import { NavigationContainerRef } from '@react-navigation/native';

const TAG = '[MobileServiceManager]';
export interface HmsMobileServiceProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface HmsMobileServiceState { }

export default class MobileServiceManager extends React.Component<
  HmsMobileServiceProps,
  HmsMobileServiceState
> {
  static isGms = false;

  async componentDidMount() {
    await this.checkMobileService();
  }

  checkMobileService = async () => {
    try {
      const isGms = await DeviceInfo.hasGms();
      MobileServiceManager.isGms = isGms;
      Log.debug(TAG, 'Success', 'check mobile service: ', isGms);
    } catch (error) {
      Log.error(TAG, 'Error, check mobile service', error);
    }
  };

  render() {
    const { accessibilityLabel } = this.props;
    return <View accessibilityLabel={accessibilityLabel} />;
  }
}
