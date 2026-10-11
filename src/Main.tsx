import React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import RemoteConfig from './resources/remote/RemoteConfig';
import { Validate } from './resources/functions';
import Session from './api/Session';
import { InitialAppScreen } from './resources/initialAppScreen';
import { TypeInitialStart, Colors } from './resources/constants';
import { MaskService } from './resources/persistence';
import { MaskType } from './resources/persistence/models/MaskModel';
import { AnalyticsEvent } from './resources/analytics';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  containerIOS: {
    backgroundColor: Colors.primary,
  } as ViewStyle,
  image: {
    alignSelf: 'center',
    width: 250,
    height: 126,
    marginTop: Platform.OS === 'android' ? 24 : 0,
  } as ImageStyle,
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 40,
  } as ViewStyle,
});

interface Props { }

interface State {
  loaded: boolean;
}

export default class Main extends React.PureComponent<Props, State> {
  static App?: any;
  static isGms: boolean = true;

  state: State = {
    loaded: false,
  };

  async componentDidMount() {
    const isGms = await DeviceInfo.hasGms();

    if (!isGms && Platform.OS !== 'ios') {
      await AnalyticsEvent.enableAnalyticsHms();
    }

    this.getInitialScreen();
    this.load();
  }
  getInitialScreen = async () => {
    try {
      const sesion = await Session.onboardingGet('SignIn');
      if (sesion === undefined) {
        let cardNumber;
        cardNumber = await MaskService.findOneByType(MaskType.CARDNUMBER);
        if (cardNumber === undefined) {
          InitialAppScreen.InitialAppScreen = TypeInitialStart.Onboarding;
        } else {
          InitialAppScreen.InitialAppScreen = TypeInitialStart.SignIn;
        }
      } else {
        InitialAppScreen.InitialAppScreen = TypeInitialStart.SignIn;
      }
    } catch (e) {
      let cardNumber;
      try {
        cardNumber = await MaskService.findOneByType(MaskType.CARDNUMBER);
        if (cardNumber === undefined) {
          InitialAppScreen.InitialAppScreen = TypeInitialStart.Onboarding;
        } else {
          InitialAppScreen.InitialAppScreen = TypeInitialStart.SignIn;
        }
      } catch (e) {
        InitialAppScreen.InitialAppScreen = TypeInitialStart.Onboarding;
      }
    }
  };

  load = async () => {
    Validate.allowRemoteConfig() && (await RemoteConfig.update());
    setTimeout(() => {
      Main.App = require('./App').default;
      this.setState({ loaded: true });
    }, 0);
  };

  render() {
    const { loaded } = this.state;
    if (typeof Main.App !== 'undefined' && loaded) {
      const App = Main.App;
      return <App />;
    }
    return (
      <View
        style={[styles.container, Platform.OS === 'ios' && styles.containerIOS]}
      >
        {Platform.OS === 'ios' && (
          <View>
            <Image
              style={styles.image}
              source={require('./assets/images/logo.png')}
            />
          </View>
        )}
        <View style={styles.footer}>
          <ActivityIndicator color={Colors.white} size={'large'} />
        </View>
      </View>
    );
  }
}
