import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';
import EmulatorRootCheck from '../../api/EmulatorRootCheck';

export interface RootManagerProps {
  accessibilityLabel: string;
  navigation: () => NavigationContainerRef<any> | null;
}

export interface RootManagerState { }

export default class RootManager extends React.Component<
  RootManagerProps,
  RootManagerState
> {
  isDeviceDebugged!: boolean;

  async componentDidMount() {
    const trustFall = await EmulatorRootCheck.checkAndroidRootDevice();
    if (trustFall) {
      this.navigate('Rooted');
    }
  }

  navigate = (routeName: string) => {
    const navigateAction = CommonActions.navigate({
      name: routeName,
      params: {}
    });
    const navigation = this.props.navigation();
    navigation && navigation.dispatch(navigateAction);
  };

  reset = (routeName: string) => {

    const resetAction = CommonActions.reset({ index: 0, routes: [{ name: routeName }] })


    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName })],
    // });
    const navigation = this.props.navigation();
    navigation && navigation.dispatch(resetAction);
  };

  render() {
    const { accessibilityLabel } = this.props;
    return <View accessibilityLabel={accessibilityLabel} />;
  }
}
