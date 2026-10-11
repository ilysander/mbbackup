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

class ForgotPasswordWebScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions = ({
  //   navigation,
  // }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
  //   title: L.forgotpasswordstack_title,
  //   headerLeft: (
  //     <BackIcon
  //       onPress={() => {
  //         navigation.getParam('shouldGoBack')
  //           ? navigation.goBack()
  //           : navigation.navigate('SignIn');
  //       }}
  //     />
  //   ),
  // });

  componentDidMount() {
    if (!Features.isAllowedTo('ForgotPasswordWeb')) {
      this.props.navigation.goBack();
    }
  }

  render() {
    if (!Features.isAllowedTo('ForgotPasswordWeb')) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Browser
          accessibilityLabel={'forgotpasswordwebscreen_browser'}
          source={{ uri: Config.settings.forgotPasswordUrl }}
        />
      </View>
    );
  }
}

export type ForgotPasswordWebScreenType = ForgotPasswordWebScreen;
export default withFocused<ForgotPasswordWebScreen, Props>(
  ForgotPasswordWebScreen
);
