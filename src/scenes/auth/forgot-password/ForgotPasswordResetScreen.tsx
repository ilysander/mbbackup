import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ViewStyle,
  InteractionManager,
} from 'react-native';
import API from '../../../api';
import { MobileStepFinishErrorResponse } from '../../../api/backend/response/Recover';
import InfoContact from '../../../components/info/InfoContact';
import NetworkManager from '../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  InfoMessage,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  TextInput,
  CardView,
} from '../../../components/ui';
import Config from '../../../Config';
import { Formats, TypeInitialStart } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import { KeyboardUtil } from '../../../resources/util';
import { AlertEvent } from '../../../components/alert/AlertManager';
import { InitialAppScreen } from '../../../resources/initialAppScreen';

import { Sanitizer } from '../../../resources/functions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SecureKeyboardApi from '../../../components/ui/SecureKeyboardApi';

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
  } as ViewStyle,
  buttons: {
    marginTop: 30,
    marginBottom: 40,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  header: {
    marginHorizontal: 20,
    marginTop: 20 + 10, // 10 adicional por formsteps
    marginBottom: 20,
  } as ViewStyle,
  infoMessage: {
    marginBottom: 10,
  } as ViewStyle,
});

const TAG = '[ForgotPasswordResetScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isValid: boolean;
  allowSubmit: boolean;
  payload?: string;
  dictionary: string[];
}

class ForgotPasswordResetScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions = {
  //   title: L.forgotpasswordstack_title,
  //   gesturesEnabled: false,
  //   headerLeft: (
  //     <BackIcon
  //       onPress={() => {
  //         Emitter.emit('onForgotPasswordTimeout', true);
  //       }}
  //     />
  //   ),
  // };
  state: State = {
    isLoading: false,
    isValid: false,
    allowSubmit: false,
    dictionary: [],
  };
  repeatAppPassword!: TextInput | null;
  appPassword!: TextInput | null;
  timeoutExpiry!: NodeJS.Timeout;
  isReallyMounted!: boolean;
  interaction!: any;
  timeoutMinimal!: any;
  intervalAllow!: any;

  isValidRepeatAppPassword = (showError = true) => {
    if (!this.repeatAppPassword || !this.appPassword) {
      return false;
    }
    const isValid = this.repeatAppPassword.isValid(showError);
    if (!isValid) {
      return false;
    }
    const appPassword = this.appPassword.getValue();
    const repeatAppPassword = this.repeatAppPassword.getValue();
    if (
      repeatAppPassword.length > 0 &&
      this.appPassword.isValid(showError) &&
      repeatAppPassword !== appPassword
    ) {
      this.repeatAppPassword.setError(
        L.error_format_internetkey_internetkeyrepeat_not_matched
      );
      return false;
    }
    this.repeatAppPassword.setError('');

    return true;
  };
  isValidPassword = (showError = true) => {
    if (!this.appPassword) {
      return false;
    }
    return this.appPassword.isValid(showError);
  };
  isValid = (showErrors = true) => {
    const appPasswordIsValid = this.isValidPassword(showErrors);
    const repeatAppPasswordIsValid = this.isValidRepeatAppPassword(showErrors);

    const isValid = [appPasswordIsValid, repeatAppPasswordIsValid].every(
      item => item
    );
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };
  onChangePassword = () => {
    this.isValid(false);
  };

  tryToSubmit = async () => {
    KeyboardUtil.hide();

    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      if (!this.isValid()) {
        return;
      }
      this.setState({ isLoading: true });
      await this.waitForAllow();
      await this.submit();
      this.setState({ isLoading: false });
    });
  };
  submit = async () => {
    try {
      const { navigation, route } = this.props;
      const cardNumber = route.params && route.params.cardNumber || '';
      const exchangeToken = route.params && route.params.exchangeToken || '';

      const { payload, dictionary } = this.state;
      const response = await API.Recover.mobileFinish(
        cardNumber,
        Sanitizer.safeText(
          this.appPassword ? this.appPassword.getValue() : '',
          dictionary
        ),
        Sanitizer.safeText(
          this.repeatAppPassword ? this.repeatAppPassword.getValue() : '',
          dictionary
        ),
        exchangeToken,
        payload
      );
      const body = response.body;
      const data = body.data;
      const isValid = body.code === API.ResponseCode.OK;
      InitialAppScreen.ShowToolTip = TypeInitialStart.ShowToolTip;

      if (isValid) {
        navigation.navigate('ForgotPasswordSuccess', {
          cardNumber,
        });
        return;
      }
      const error = data as MobileStepFinishErrorResponse;
      if (error._newPin) {
        this.appPassword &&
          this.appPassword.setError(L.forgotpasswordresetscreen_error_password);
      }
      this.repeatAppPassword &&
        this.repeatAppPassword.setError(
          L.forgotpasswordresetscreen_error_apppassword
        );
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  focus = () => {
    Log.debug(TAG, 'focus');
    this.appPassword && this.appPassword.focus();
  };
  componentDidMount() {
    this.isReallyMounted = true;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    this.focus();
    this.checkMinimal();

    this.timeoutExpiry = setTimeout(() => {
      const { isFocused } = this.props;
      this.isReallyMounted &&
        isFocused &&
        Emitter.emit('onForgotPasswordTimeout', {
          message: L.forgotpasswordresetscreen_timeout,
          type: 'info',
        });
    }, Config.settings.timeoutTokenExpirationForgotPassword);
  }

  componentWillUnmount() {
    this.isReallyMounted = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.timeoutExpiry && clearTimeout(this.timeoutExpiry);

    this.timeoutMinimal && clearTimeout(this.timeoutMinimal);
    this.intervalAllow && clearInterval(this.intervalAllow);
  }

  checkMinimal = () => {
    this.timeoutMinimal && clearTimeout(this.timeoutMinimal);
    this.timeoutMinimal = setTimeout(() => {
      this.setState({ allowSubmit: true });
    }, Config.settings.timeoutMinimalForgotPassword);
  };

  waitForAllow = async () => {
    this.intervalAllow && clearInterval(this.intervalAllow);
    return new Promise(resolve => {
      this.intervalAllow = setInterval(() => {
        const { allowSubmit } = this.state;
        if (allowSubmit) {
          this.intervalAllow && clearInterval(this.intervalAllow);
          resolve(true);
        }
      }, 1000);
    });
  };

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    Emitter.emit('onForgotPasswordTimeout', true);
    return true;
  };

  onFocusPassword = async() => {

    if (Config.features.KeyboardByApi) {
      this.appPassword && this.appPassword.setValue('');
      this.repeatAppPassword && this.repeatAppPassword.setValue('');
      Emitter.emit('onSecureKeyboardApiLoading');
      const activity = 'recover.mobile.finish';
      const response = await SecureKeyboardApi.callApiKb(activity);
      if(response){
         const {payload,dictionary} = response;
         this.setState({ payload, dictionary });
           Emitter.emit('onSecureKeyboardApi', dictionary);
      }

    }
  };


  onFocusPasswordRepeat = () =>{
    setTimeout(() => {
      const {dictionary} =  this.state;
      Emitter.emit('onSecureKeyboardApi', dictionary);
    }, 200);
  }
  render() {
    const { isLoading, isValid } = this.state;
    const { isFocused, navigation } = this.props;
    return (
      <Container>
        <FormSteps total={4} current={3} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Header
                style={styles.header}
                center
                accessibilityLabel={'forgotpasswordresetscreen_header_password'}
                title={L.forgotpasswordresetscreen_header_title}
              />
              <CardView style={styles.cardView}>
                <InfoMessage
                  accessibilityLabel={
                    'forgotpasswordresetscreen_texthelp_internet_key'
                  }
                  message={L.forgotpasswordresetscreen_texthelp_internet_key}
                  style={styles.infoMessage}
                />
                <TextInput
                  textContentType={'password'}
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'forgotpasswordresetscreen_textinput_internet_key'
                  }
                  accessibilityErrorInput={'forgotpasswordreset_errinputpassword'}
                  imageSource={require('../../../assets/images/password-icon.png')}
                  onChangeText={this.onChangePassword}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  secureTextEntry
                  label={L.forgotpasswordresetscreen_textinput_internet_key}
                  labelSubtitle={
                    L.forgotpasswordresetscreen_textinput_internet_key_subtitle
                  }
                  ref={ref => {
                    this.appPassword = ref;
                  }}
                  onSubmitEditing={() => {
                    this.repeatAppPassword && this.repeatAppPassword.focus();
                  }}
                  blurOnSubmit={false}
                  formatText={Formats.InternetKey}
                  onFocus={this.onFocusPassword}
                />
                <TextInput
                  textContentType={'password'}
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'forgotpasswordresetscreen_textinput_internet_key_repeat'
                  }
                  accessibilityErrorInput={'forgotpasswordreset_errinputpasswordre'}
                  imageSource={require('../../../assets/images/password-icon.png')}
                  onChangeText={this.onChangePassword}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  labelSubtitle={
                    L.forgotpasswordresetscreen_textinput_internet_key_repeat_subtitle
                  }
                  secureTextEntry
                  label={
                    L.forgotpasswordresetscreen_textinput_internet_key_repeat
                  }
                  ref={ref => {
                    this.repeatAppPassword = ref;
                  }}
                  onBlur={() => {
                    this.isValidRepeatAppPassword();
                  }}
                  blurOnSubmit
                  formatText={Formats.InternetKeyRepeat}
                  onFocus={this.onFocusPasswordRepeat}
                />
              </CardView>

              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'forgotpasswordresetscreen_button_submit'}
                  loading={isLoading}
                  title={L.forgotpasswordresetscreen_button_submit}
                  onPress={this.tryToSubmit}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'forgotpasswordresetscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ForgotPasswordResetScreenType = ForgotPasswordResetScreen;
export default withFocused<ForgotPasswordResetScreen, Props>(
  ForgotPasswordResetScreen
);
