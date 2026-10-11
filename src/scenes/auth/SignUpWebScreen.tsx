import { NativeStackScreenProps } from '@react-navigation/native-stack';
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  } as ViewStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State { }

class SignUpWebScreen extends React.Component<Props & FocusedProps, State> {

  componentDidMount() {
    if (!Features.isAllowedTo('SignUpWeb')) {
      this.props.navigation.goBack();
    }
  }

  render() {
    if (!Features.isAllowedTo('SignUpWeb')) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Browser
          accessibilityLabel={'signupwebscreen_browser'}
          source={{ uri: Config.settings.enrollmentUrl }}
        />
      </View>
    );
  }
}

export type SignUpWebScreenType = SignUpWebScreen;
export default withFocused<SignUpWebScreen, Props>(SignUpWebScreen);
