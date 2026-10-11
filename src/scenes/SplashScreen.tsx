import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Image,
  ImageStyle,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Config from '../Config';
import {Colors} from '../resources/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  logo: {
    width: 280,
    height: 155,
  } as ImageStyle,
});

export interface Props extends NativeStackScreenProps<any, any> {}

export interface State {}

export default class SplashScreen extends React.Component<Props, State> {
  timeout!: NodeJS.Timeout;
  isReallyMounted!: boolean;

  componentDidMount() {
    this.isReallyMounted = true;

    this.timeout = setTimeout(() => {
      this.isReallyMounted &&
        this.props.navigation &&
        this.props.navigation.navigate('Auth');
    }, Config.settings.timeoutSplash);
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
    this.isReallyMounted = false;
  }

  render() {
    return (
      <View
        style={styles.container}
        accessibilityLabel={'splashscreen_container'}>
        <StatusBar
          backgroundColor={Colors.primary}
          barStyle={'light-content'}
          animated
        />
        <Image
          accessibilityLabel={'splashscreen_animation'}
          source={require('../assets/images/splash.gif')}
          style={styles.logo}
        />
      </View>
    );
  }
}
