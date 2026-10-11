import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ViewStyle,
  InteractionManager,
} from 'react-native';
import API from '../../../api';
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
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  CardView,
} from '../../../components/ui';
import { ErrorRequest } from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import { AlertEvent } from '../../../components/alert/AlertManager';
import ConfirmCode from '../../../components/sms/ConfirmCode';
import { MobileStep2Response } from '../../../api/backend/response/Enrollment';
import { MobileStep2ErrorResponse } from '../../../api/backend/response/Recover';
import Config from '../../../Config';

import Features from '../../../resources/remote/Features';
import {
  MobileStep1ErrorResponse,
  MobileStep1Response,
} from '../../../api/backend/response/Recover';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const styles = StyleSheet.create({
  buttons: {
    marginTop: 30,
    marginBottom: 40,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
});

const TAG = '[ForgotPasswordSMSScreen]';
const ErrorCodes = {
  InvalidPhone: '201',
};

export interface Params {
  phoneNumber: string;
  cardNumber: string;
  atmPass: string;
  exchangeToken: string;
  documentNumber: string;
  captcha: string;
  payload: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isValid: boolean;
  allowSubmit: boolean;
  showResend: boolean;
  exchangeTokenResend: string;
  pressResend: boolean;
}

class ForgotPasswordSMSScreen extends React.Component<
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
    showResend: !Features.isAllowedTo('Captcha'),
    exchangeTokenResend: '',
    pressResend: false,
  };

  code!: ConfirmCode | null;
  interaction!: any;
  timeoutMinimal!: any;
  intervalAllow!: any;

  blur = () => {
    Log.debug(TAG, 'blur');
    this.code && this.code.blur();
  };

  isValid = (showError = true) => {
    if (!this.code) {
      return false;
    }
    const isValid = this.code.isValid(showError);
    this.setState({ isValid });

    return isValid && NetworkManager.isConnected;
  };

  tryToSubmit = async () => {
    this.blur();

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
    this.setState({ isLoading: true });
    try {
      const { navigation, route } = this.props;
      const code = this.code ? this.code.getValue() : '';


      const cardNumber = route.params && route.params.cardNumber;
      const payload = route.params && route.params.payload;
      const atmPass = route.params && route.params.atmPass;
      const exchangeTokenRaw = route.params && route.params.exchangeToken;

      const exchangeToken = this.state.pressResend
        ? this.state.exchangeTokenResend
        : exchangeTokenRaw

      let response;
      if (Config.features.EnableNewRequestKeyFour) {
        response = await API.Recover.mobileStep2(
          cardNumber,
          code,
          exchangeToken
        );
      } else {
        response = await API.Recover.mobileStep2Old(
          cardNumber,
          code,
          atmPass,
          exchangeToken,
          payload
        );
      }

      const body = response.body;
      const isValid = body.code === API.ResponseCode.OK;
      if (isValid) {
        const data = body.data as MobileStep2Response;
        const exchangeToken = data._exchangeToken;
        /**
         * esto es importante para no eliminar el tiempo de espera al enviar al paso3
         */
        this.code && this.code.clearTimeoutSMS();
        navigation.navigate('ForgotPasswordReset', {
          cardNumber,
          exchangeToken,
        });
        return;
      }
      const error = body.data as MobileStep2ErrorResponse;

      const errorMessage = error._validationCode;
      if (errorMessage) {
        this.code && this.code.setCodeError(errorMessage);
        return;
      }

      if (error._debitcardPIN || error._debitcardNumber || body.message) {
        const validationError =
          error._debitcardPIN || error._debitcardNumber || body.message;
        navigation.navigate('ForgotPasswordCredentials', { validationError });
        return;
      }

      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e: ErrorRequest.Default,
      });
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  componentDidMount() {
    Log.debug(TAG, 'componentDidMount');
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.checkMinimal();
  }

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

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

  onReadCode = (code: string) => {
    Log.debug(TAG, 'onReadCode');
    this.code && this.code.setValue(code);
  };

  onTimeout = () => {
    if (this.state.showResend) {
      return;
    }
    Emitter.emit('onForgotPasswordTimeout', {
      message: L.forgotpasswordsmsscreen_timeout,
      type: 'info',
    });
  };

  onResend = async () => {

    try {
      const { navigation, route } = this.props;

      const cardNumber = route.params && route.params.cardNumber;
      const payload = route.params && route.params.payload;
      const atmPass = route.params && route.params.atmPass;
      const captcha = route.params && route.params.captcha;
      const documentNumber = route.params && route.params.documentNumber;

      let response;
      if (Config.features.EnableNewRequestKeyFour) {
        response = await API.Recover.mobileStep1(
          cardNumber,
          documentNumber,
          atmPass,
          payload || '',
          captcha
        );
      } else {
        response = await API.Recover.mobileStep1Old(
          cardNumber,
          documentNumber,
          captcha
        );
      }
      const body = response.body;
      const isValid = body.code === API.ResponseCode.OK;
      if (isValid) {
        const data = body.data as MobileStep1Response;
        this.setState({
          exchangeTokenResend: data._exchangeToken,
          pressResend: true,
        });

        return;
      }

      let hasError = false;
      const error = body.data as MobileStep1ErrorResponse;
      if (error.code === ErrorCodes.InvalidPhone) {
        navigation.navigate('SignUpInvalid');
        return;
      }

      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  onChangeCode = () => {
    this.isValid(false);
  };
  render() {
    const { isLoading, isValid } = this.state;
    const { isFocused, route, navigation } = this.props;
    const phoneNumber = route.params && route.params.phoneNumber;


    return (
      <Container>
        <FormSteps total={4} current={2} />
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
                center
                accessibilityLabel={'forgotpasswordsmsscreen_header_data'}
                style={styles.header}
                title={L.forgotpasswordsmsscreen_header_title}
              />
              <CardView padding>
                <ConfirmCode
                  phoneNumber={phoneNumber}
                  accessibilityTooltip={'forgotpasswordsms_open_modal'}
                  accessibilityLabel={'forgotpasswordsmsscreen_textinputcode_otp'}
                  accessibilityLabelLink={'forgotpasswordsms_link'}
                  accessibilityLabelModal={'forgotpasswordsms_modal_open'}
                  accessibilityAction={'forgotpasswordsms_confirm_modalactionbtn'}
                  accessibilityErrorInput={'forgotpasswordsms_errorinput'}
                  showResend={this.state.showResend}
                  autoFocus={false}
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  onTimeout={this.onTimeout}
                  timeoutInvalid={Config.settings.timeoutForgotPasswordSMS}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <View style={styles.buttons}>
                <Button
                  allowOnPress
                  accessibilityLabel={'forgotpasswordsmsscreen_button_continue'}
                  loading={isLoading}
                  disabled={!isValid}
                  title={L.forgotpasswordsmsscreen_button_continue}
                  onPress={this.tryToSubmit}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'forgotpasswordsmsscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ForgotPasswordSMSScreenType = ForgotPasswordSMSScreen;
export default withFocused<ForgotPasswordSMSScreen, Props>(
  ForgotPasswordSMSScreen
);
