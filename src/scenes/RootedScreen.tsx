import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  BackHandler,
  Image,
  ImageStyle,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import InfoContact from '../components/info/InfoContact';
import {FocusedProps, withFocused} from '../components/screen/ScreenContainer';
import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  Version,
} from '../components/ui';
import Config from '../Config';
import {A, AnalyticsEvent} from '../resources/analytics';
import {Colors} from '../resources/constants';
import {Size} from '../resources/dimensions';
import {Font, Linking} from '../resources/functions';
import {L} from '../resources/language';
import {Log} from '../resources/log';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  } as ViewStyle,
  statusBar: {
    height: Size.getStatusBarHeight(),
  } as ViewStyle,
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  } as ViewStyle,
  messageContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    maxWidth: 290,
    paddingBottom: 10,
  } as ViewStyle,
  buttons: {
    marginHorizontal: 10,
    marginTop: 30,
  } as ViewStyle,
  titleText: {
    ...Font({weight: 'Bold'}),
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
  } as TextStyle,
  descriptionText: {
    ...Font({weight: 'Medium'}),
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 20,
  } as TextStyle,
  link: {
    ...Font({weight: 'Bold'}),
    textDecorationLine: 'underline',
  } as TextStyle,
  message: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  logo: {
    width: '80%',
    height: 135,
    alignSelf: 'center',
  } as ImageStyle,
  version: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,
  } as ViewStyle,
  versionLabelStyle: {color: Colors.grey5} as TextStyle,
});

const TAG = '[RootedScreen]';

export interface Props extends NativeStackScreenProps<any, any> {}

export interface State {}

class RootedScreen extends React.Component<Props & FocusedProps, State> {
  timeout!: NodeJS.Timeout;

  exitApp = () => {
    this.timeout && clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      BackHandler.exitApp();
    }, 600);
  };

  goToHomebankingLink = async () => {
    AnalyticsEvent.track(A.rootedscreen_link_homebanking);
    try {
      await Linking.openURL(Config.settings.frontendUrl);
    } catch (e) {
      Log.debug(TAG, 'goToHomebankingLink', e);
    }
  };

  goToHomebankingButton = async () => {
    try {
      await Linking.openURL(Config.settings.frontendUrl);
    } catch (e) {
      Log.debug(TAG, 'goToHomebankingButton', e);
    }
  };

  render() {
    const {isFocused, navigation} = this.props;
    return (
      <View style={styles.container}>
        <View
          style={[
            Platform.OS === 'ios' && styles.statusBar,
            {backgroundColor: Colors.primary},
          ]}>
          <StatusBar
            backgroundColor={Colors.primary}
            barStyle={'light-content'}
            animated
          />
        </View>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleHeight(),
          }}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.messageContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/images/logo-colorful.png')}
                resizeMode={'contain'}
              />
              <View style={styles.message}>
                <Text
                  style={styles.titleText}
                  accessibilityLabel={'rootedscreen_text_warning'}>
                  {Platform.OS === 'android'
                    ? L.rootedscreen_text_warning_android
                    : L.rootedscreen_text_warning_ios}
                </Text>
                <Text
                  accessibilityLabel={'rootedscreen_text_description'}
                  style={styles.descriptionText}>
                  {L.rootedscreen_text_description}
                </Text>
                <Text
                  accessibilityLabel={'rootedscreen_text_options'}
                  style={styles.descriptionText}>
                  {Platform.OS === 'ios' ? (
                    L.rootedscreen_text_options_ios
                  ) : (
                    <Text>
                      {L.rootedscreen_text_options_android_part1}{' '}
                      <Text
                        style={styles.link}
                        onPress={this.goToHomebankingLink}>
                        {L.rootedscreen_text_options_android_part2}
                      </Text>
                      {'.'}
                    </Text>
                  )}
                </Text>
              </View>
              {Platform.OS === 'android' && (
                <View style={styles.buttons}>
                  <Button
                    accessibilityLabel={'rootedscreen_button_exit'}
                    title={L.rootedscreen_button_exit}
                    onPress={this.exitApp}
                  />
                </View>
              )}
              {Platform.OS === 'ios' && (
                <View style={styles.buttons}>
                  <Button
                    accessibilityLabel={'rootedscreen_button_homebanking'}
                    title={L.rootedscreen_button_homebanking}
                    onPress={this.goToHomebankingButton}
                  />
                </View>
              )}
            </View>
            <InfoContact
              navigate={navigation.navigate}
              accessibilityLabel={'rootedscreen_infocontact'}
            />
            <Version
              style={styles.version}
              labelStyle={styles.versionLabelStyle}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export type RootedScreenType = RootedScreen;
export default withFocused<RootedScreen, Props>(RootedScreen);
