import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../components/screen/ScreenContainer';
import { Browser } from '../../components/ui';
import Config from '../../Config';
import { Colors } from '../../resources/constants';
import Features from '../../resources/remote/Features';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class LocationScreen extends React.Component<Props & FocusedProps, State> {

  componentDidMount() {
    if (!Features.isAllowedTo('Location')) {
      this.props.navigation.goBack();
    }
  }

  render() {
    if (!Features.isAllowedTo('Location')) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Browser
          requireLocation
          accessibilityLabel={'locationscreen_browser'}
          source={{ uri: Config.settings.locationUrl }}
        />
      </View>
    );
  }
}

export type LocationScreenType = LocationScreen;
export default withFocused<LocationScreen, Props>(LocationScreen);
