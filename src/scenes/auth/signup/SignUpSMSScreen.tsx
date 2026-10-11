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
import BackIcon from '../../../components/navigation/BackIcon';
import ConfirmCode from '../../../components/sms/ConfirmCode';
import { MobileStep2Response } from '../../../api/backend/response/Enrollment';
import { MobileStep2ErrorResponse } from '../../../api/backend/response/SignUp';
import { MobileStep1Response } from '../../../api/backend/response/SignUp';
import Config from '../../../Config';
import Features from '../../../resources/remote/Features';
import { A, AnalyticsEvent } from '../../../resources/analytics';
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

const TAG = '[SignUpSMSScreen]';
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

class SignUpSMSScreen extends React.Component<Props & FocusedProps, State> {
  static navigationOptions = {
    title: L.signupstack_title,
    gesturesEnabled: false,
    headerLeft: (
      <BackIcon
        onPress={() => {
          Emitter.emit('onSignUpTimeout', true);
        }}
      />
    ),
  };

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
  trace!: any;

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
    const a_seed = A.seed_card_reg_sms;
    try {
      const { navigation, route } = this.props;
      const code = this.code ? this.code.getValue() : '';

      const cardNumber = route.params && route.params.cardNumber;
      const exchangeTokenRaw = route.params && route.params.exchangeToken;
      const payload = route.params && route.params.payload;
      const atmPass = route.params && route.params.atmPass;
      const documentNumber = route.params && route.params.documentNumber;


      const exchangeToken = this.state.pressResend
        ? this.state.exchangeTokenResend
        : exchangeTokenRaw;

      let response;
      if (Config.features.EnableNewRequestKeyFour) {
        response = await API.SignUp.mobileStep2(
          cardNumber,
          code,
          exchangeToken
        );
      } else {
        response = await API.SignUp.mobileStep2Old(
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
        navigation.navigate('SignUpReset', {
          cardNumber,
          exchangeToken,
          documentNumber,
        });
        return;
      }
      const error = body.data as MobileStep2ErrorResponse;
      const errorMessage = error._validationCode;
      if (errorMessage) {
        this.code && this.code.setCodeError(errorMessage);
        AnalyticsEvent.track(a_seed + '_err_validation_code');
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
        AnalyticsEvent.track(a_seed + '_err_conexion');
      }
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      AnalyticsEvent.track(a_seed + '_err_red');
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  componentDidMount() {
    Log.debug(TAG, 'componentDidMount');
    AnalyticsEvent.track(A.seed_card_reg_sms + '_inicio');
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
    }, Config.settings.timeoutMinimalSignUp);
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
    Emitter.emit('onSignUpTimeout', true);
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
    Emitter.emit('onSignUpTimeout', {
      message: L.signupsmsscreen_timeout,
      type: 'info',
    });
  };

  onChangeCode = () => {
    this.isValid(false);
  };

  onResend = async () => {
    try {
      const { route } = this.props;

      const cardNumber = route.params && route.params.cardNumber;
      const documentNumber = route.params && route.params.documentNumber;
      const captcha = route.params && route.params.captcha;
      const atmPass = route.params && route.params.atmPass;
      const payload = route.params && route.params.payload;


      let response;
      if (Config.features.EnableNewRequestKeyFour) {
        response = await API.SignUp.mobileStep1(
          cardNumber,
          documentNumber,
          atmPass,
          payload || '',
          captcha
        );
      } else {
        response = await API.SignUp.mobileStep1Old(
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
        AnalyticsEvent.track(A.seed_card_reg_sms + '_reenvio_otp');
        return;
      }
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      AnalyticsEvent.track(A.seed_card_reg_sms + '_err_reenvio_otp');
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  render() {
    const { isLoading, isValid } = this.state;
    const { isFocused, navigation, route } = this.props;
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
                accessibilityLabel={'signupsmsscreen_header_data'}
                style={styles.header}
                title={L.signupsmsscreen_header_title}
              />
              <CardView padding>
                <ConfirmCode
                  phoneNumber={phoneNumber}
                  accessibilityLabel={'signupsmsscreen_textinputcode_otp'}
                  accessibilityLabelLink={'signupsmsscreen_textinputcode_otp_link'}
                  accessibilityTooltip={'signupsmss_confirm_modal_open'}
                  accessibilityAction={'signupsmss_confirm_modalactionbtn'}
                  accessibilityErrorInput={'signupsms_errorinput'}
                  showResend={this.state.showResend}
                  autoFocus={false}
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  onTimeout={this.onTimeout}
                  timeoutInvalid={Config.settings.timeoutSignUpSMS}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <View style={styles.buttons}>
                <Button
                  allowOnPress
                  accessibilityLabel={'signupsmsscreen_button_continue'}
                  loading={isLoading}
                  disabled={!isValid}
                  title={L.signupsmsscreen_button_continue}
                  onPress={this.tryToSubmit}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'signupsmsscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type SignUpSMSScreenType = SignUpSMSScreen;
export default withFocused<SignUpSMSScreen, Props>(SignUpSMSScreen);
