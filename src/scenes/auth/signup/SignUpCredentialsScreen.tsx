import * as React from 'react';
import {
  InteractionManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
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
  ExpirationTime,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  MessageCenter,
  NetworkStatusAlert,
  SafeAreaView,
  TextInput,
  TextInputMasked,
  CardView,
  Captcha,
} from '../../../components/ui';
import Config from '../../../Config';
import {
  ErrorRequest,
  Formats,
  RegisterError,
} from '../../../resources/constants';
import { Size } from '../../../resources/dimensions';
import { Validate, Sanitizer } from '../../../resources/functions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import { MaskModel } from '../../../resources/persistence/models';
import { KeyboardUtil } from '../../../resources/util';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  MobileStep1ErrorResponse,
  MobileStep1Response,
} from '../../../api/backend/response/SignUp';
import Features from '../../../resources/remote/Features';
import perf from '@react-native-firebase/perf';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import MobileServiceManager from '../../../components/mobile-service/MobileServiceManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SecureKeyboardApi from '../../../components/ui/SecureKeyboardApi';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 30,
    marginBottom: 30,
  } as ViewStyle,
  header: {
    marginTop: 10,
    marginBottom: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 20,
  } as ViewStyle,
  underLineText: {
    textDecorationLine: 'underline',
  } as ViewStyle,
  containerRow: {
    marginTop: 0,
  } as ViewStyle,
  infoContact: {
    paddingBottom: 40,
  } as ViewStyle,
  captcha: {
    marginBottom: 20,
  } as ViewStyle,
  cardView: {
    paddingBottom: 0,
  } as ViewStyle,
});
const TAG = '[SignUpCredentialsScreen]';

const ErrorCodes = {
  InvalidPhone: '201',
};

const ErrorNoField = {
  usedCard: RegisterError.UsedCard,
  incorrectInfo: RegisterError.IncorrectInfo,
};

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isValid: boolean;
  cardSaved?: MaskModel;
  payload?: string;
  dictionary: string[];
}

class SignUpCredentialsScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isValid: false,
    isLoading: false,
    dictionary: [],
  };

  timeoutCheckValues!: number;

  scroll!: ScrollView | null;
  document!: TextInput | null;
  cardNumber!: TextInputMasked | null;
  atmPass!: TextInput | null;
  cellphoneNumber!: TextInput | null;
  message!: MessageCenter | null;
  interaction!: any;
  trace!: any | null;
  captcha!: Captcha | null;

  isValid = (showError = true) => {
    const cardNumberIsValid = this.cardNumber
      ? this.cardNumber.isValid(showError)
      : false;
    const atmPassIsValid = this.atmPass
      ? this.atmPass.isValid(showError)
      : false;
    const captchaIsValid = Features.isAllowedTo('Captcha')
      ? this.captcha
        ? this.captcha.isValid(showError)
        : false
      : true;

    const documentIsValid = this.document
      ? this.document.isValid(showError)
      : false;

    const isValid = [
      cardNumberIsValid,
      atmPassIsValid,
      captchaIsValid,
      documentIsValid,
    ].every(value => value);

    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      !cardNumberIsValid &&
        this.trace &&
        this.trace.incrementMetric('cardNumberInvalid', 1);
      !atmPassIsValid &&
        this.trace &&
        this.trace.incrementMetric('passwordInvalid', 1);

      if (Features.isAllowedTo('Captcha') && !captchaIsValid) {
        this.trace && this.trace.incrementMetric('captchaInvalid', 1);
      }
      !isValid && this.trace && this.trace.incrementMetric('error', 1);
    }

    this.setState({ isValid });

    return isValid && NetworkManager.isConnected;
  };
  blur = async () => {
    KeyboardUtil.hide();
  };

  tryToSubmit = async () => {
    this.blur();

    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      if (!this.isValid()) {
        return;
      }
      this.setState({ isLoading: true });
      await this.submit();
      /**
       * es importante resetear el captcha en cada envio
       * asi nos aseguramos que siempre que intente
       * se le pedira completarlo nuevamente
       */
      this.captcha && this.captcha.reset();
      this.setState({ isLoading: false });
    });
  };

  submit = async () => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && (await this.trace.incrementMetric('submit', 1));
    }

    const { navigation } = this.props;
    const { payload, dictionary } = this.state;

    try {
      const cardNumber = this.cardNumber ? this.cardNumber.getValue() : '';
      const documentNumber = this.document ? this.document.getValue() : '';
      const atmPass = Sanitizer.safeText(
        this.atmPass ? this.atmPass.getValue() : '',
        dictionary
      );
      const captcha = this.captcha ? this.captcha.getValue() : '';

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
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.trace && (await this.trace.incrementMetric('OkResponse', 1));
        }

        const data = body.data as MobileStep1Response;
        const exchangeToken = data._exchangeToken;

        navigation.navigate('SignUpSMS', {
          cardNumber,
          exchangeToken,
          phoneNumber: data.mobileNumber || data._mobileNumber,
          documentNumber,
          atmPass,
          payload,
          captcha,
        });
        return;
      }
      let hasError = false;
      const error = body.data as MobileStep1ErrorResponse;

      if (error.code === ErrorCodes.InvalidPhone) {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.trace && (await this.trace.incrementMetric('invalidPhone', 1));
        }

        AnalyticsEvent.track(A.seed_card_reg + '_cel_invalido');
        navigation.navigate('SignUpInvalid');
        return;
      }

      if (error.NO_FIELD === ErrorNoField.incorrectInfo) {
        AnalyticsEvent.track(A.seed_card_reg + '_err_incorr_info');
      }

      if (Validate.includes('captcha incorrecto', body.message)) {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.trace &&
            (await this.trace.incrementMetric('captchaResponseInvalid', 1));
        }

        this.captcha && this.captcha.setError(body.message);
        hasError = true;
      }

      if (Config.features.EnableNewRequestKeyFour) {
        if (Validate.includes('Error de validación', body.message)) {
          if (MobileServiceManager.isGms || Platform.OS === 'ios') {
            this.trace &&
              (await this.trace.incrementMetric(
                'informationResponseInvalid',
                1
              ));
          }

          hasError = true;
        }
      }

      const debitCardError = error._debitcardNumber;
      if (debitCardError) {
        this.cardNumber &&
          this.cardNumber.setError(
            this.renderCardErrorForgotPassword(debitCardError)
          );
        hasError = true;
      }

      if (error.NO_FIELD) {
        this.message &&
          this.message.show(
            {
              id: 'credentials',
              message: error.NO_FIELD,
            },
            () => {
              this.scroll && this.scroll.scrollTo({ y: 0, animated: true });
            }
          );
        hasError = true;
      }

      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      AnalyticsEvent.track(A.seed_card_reg + '_err_red');
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  onChangeValues = () => {
    this.captcha && this.captcha.clearError();
    this.message && this.message.hideAll();
    this.isValid(false);
  };

  onChangeCaptcha = () => {
    /**
     * aqui no se puede llamar a this.message.hideAll()
     * porque this.captcha.reset(); llama nuevamente a este metodo
     * y limpia el error que pueda generarse asi que this.message.hideAll()
     * se llama en onPress de Captcha
     */
    const isValid = this.isValid(false);
    if (isValid) {
      this.blur();
      requestAnimationFrame(() => {
        this.scroll && this.scroll.scrollToEnd();
      });
    }
  };

  focus = () => {
    Log.debug(TAG, 'focus');
    this.document && this.document.focus();
  };

  componentDidMount() {
    Log.debug(TAG, 'componentDidMount');
    AnalyticsEvent.track(A.seed_card_reg + '_inicio');
    Emitter.on('onSignUpTimeout', this.onSignUpTimeout);
    this.focus();
  }
  onFocus = async () => {
    this.trace = perf().newTrace('SignUpCredentialsScreen');
    await this.trace.start();
  };

  onBlur = async () => {
    this.trace && (await this.trace.stop());
  };

  onSignUpTimeout = (data: any) => {
    const { navigation } = this.props;
    if (!Features.isAllowedTo('Captcha')) {
      this.clearForm();
      if (MobileServiceManager.isGms || Platform.OS === 'ios') {
        this.trace && this.trace.incrementMetric('onSignUpTimeout', 1);
      }

      navigation.navigate('SignUpCredentials');
      return;
    }

    Log.debug(TAG, 'onSignUpTimeout', data);
    if (data && data.message) {
      this.scroll && this.scroll.scrollTo({ y: 0, animated: true });
      this.interaction && this.interaction.cancel();
      this.interaction = InteractionManager.runAfterInteractions(() => {
        this.message && this.message.show({ id: 'expiration', ...data });
      });
    }
    this.clearForm();
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && this.trace.incrementMetric('onSignUpTimeout', 1);
    }

    navigation.navigate('SignUpCredentials');
  };

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    Emitter.off('onSignUpTimeout', this.onSignUpTimeout);
    this.interaction && this.interaction.cancel();
  }

  onPressInputCreditCard = () => {
    this.setState({ cardSaved: undefined }, () => {
      this.cardNumber && this.cardNumber.focus();
    });
  };

  clearForm = () => {
    this.blur();
    let { cardSaved } = this.state;
    const cardNumber = this.cardNumber ? this.cardNumber.getValue() : '';

    if (
      !cardSaved &&
      cardNumber &&
      this.cardNumber &&
      this.cardNumber.isValid()
    ) {
      cardSaved = Validate.createMasked(cardNumber, 4);
    }
    this.setState({ cardSaved });
    this.atmPass && this.atmPass.setValue('');

    this.cardNumber && this.cardNumber.clearError();

    const isValid = this.isValid(false);
    this.setState({ isValid });
  };

  goToForgotPassword = () => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && this.trace.incrementMetric('goToForgotPassword', 1);
    }

    if (Features.isAllowedTo('ForgotPasswordWeb')) {
      this.props.navigation.navigate('ForgotPasswordWeb');
    } else {
      this.props.navigation.navigate('ForgotPasswordCredentials');
    }
  };

  onPressCapcha = () => {
    this.blur();
    this.message && this.message.hideAll();
  };

  renderCardErrorForgotPassword = (message: string) => {
    if (
      message.includes('en uso') ||
      message.includes('ya se encuentra registrado')
    ) {
      return (
        <Text>
          {L.signupcredentialsscreen_error_debitcardnumber}{' '}
          <Text onPress={this.goToForgotPassword} style={styles.underLineText}>
            {L.signupcredentialsscreen_error_debitcardnumber_click}
          </Text>
        </Text>
      );
    }
    return message;
  };
  onFocusPassword = async() => {

    if (Config.features.KeyboardByApi) {
      this.atmPass && this.atmPass.setValue('');
      Emitter.emit('onSecureKeyboardApiLoading');

      let activity = 'signup.mobile.step2';
      if(Config.features.EnableNewRequestKeyFour){
        activity = 'signup.mobile.step1';
      }

      const response = await SecureKeyboardApi.callApiKb(activity);
      if(response){
         const {payload,dictionary} = response;
         this.setState({ payload, dictionary });
           Emitter.emit('onSecureKeyboardApi', dictionary);
      }

    }
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    const { isFocused } = this.props;
    if (prevProps.isFocused !== isFocused) {
      if (isFocused) {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.onFocus();
        }
      } else {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.onBlur();
        }
      }
    }
  }

  render() {
    const { isLoading, cardSaved, isValid } = this.state;
    const { isFocused, navigation } = this.props;
    return (
      <Container>
        <ExpirationTime
          timeout={Config.settings.timeoutExpirationSignUp}
          onExpiry={this.clearForm}
        />
        <FormSteps total={4} current={1} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleScreenHeight(),
          }}
          ref={ref => {
            this.scroll = ref;
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              <MessageCenter
                accessibilityLabel={'signupcredentialsscreen_messagecenter'}
                ref={ref => {
                  this.message = ref;
                }}
                style={styles.networkStatus}
              />

              <Header
                accessibilityLabel={
                  'signupcredentialsscreen_header_personal_data'
                }
                style={styles.header}
                title={L.signupcredentialsscreen_header_personal_data}
                center
              />

              <CardView padding style={styles.cardView}>
                <TextInput
                  textContentType={'none'}
                  accessibilityLabel={
                    'signupcredentialsscreen_textinput_document'
                  }
                  accessibilityErrorInput={'signupcredentials_document'}
                  imageSource={require('../../../assets/images/document-icon.png')}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  formatText={Formats.Document}
                  label={L.signupcredentialsscreen_textinput_document}
                  ref={ref => {
                    this.document = ref;
                  }}
                  onSubmitEditing={() => {
                    this.cardNumber && this.cardNumber.focus();
                  }}
                  blurOnSubmit={false}
                  maxLength={15}
                  onChangeText={this.onChangeValues}
                  labelSubtitle={
                    L.signupcredentialsscreen_textinput_document_subtitle
                  }
                  containerStyle={styles.containerRow}
                />

                <TextInputMasked
                  textContentType={'username'}
                  onPress={this.onPressInputCreditCard}
                  mask={cardSaved}
                  accessibilityLabel={
                    'signupcredentialsscreen_textinput_card_number'
                  }
                  accessibilityErrorInput={'signupcredentials_card_number'}
                  imageSource={require('../../../assets/images/card-icon.png')}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  label={L.signupcredentialsscreen_textinput_card_number}
                  labelSubtitle={
                    L.signupcredentialsscreen_textinput_card_number_subtitle
                  }
                  ref={ref => {
                    this.cardNumber = ref;
                  }}
                  onSubmitEditing={() => {
                    this.atmPass && this.atmPass.focus();
                  }}
                  onChangeText={this.onChangeValues}
                  blurOnSubmit={false}
                  formatText={Formats.DebitCard}
                  containerStyle={styles.containerRow}
                />

                <TextInput
                  textContentType={'none'}
                  accessibilityErrorInput={'signupcredentials_password'}
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'signupcredentialsscreen_textinput_atmpassword'
                  }
                  imageSource={require('../../../assets/images/password-icon.png')}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  secureTextEntry
                  label={L.signupcredentialsscreen_textinput_atmpassword}
                  ref={ref => {
                    this.atmPass = ref;
                  }}
                  onChangeText={this.onChangeValues}
                  blurOnSubmit
                  formatText={Formats.ATMKey}
                  labelSubtitle={
                    L.signupcredentialsscreen_textinput_atmpassword_subtitle
                  }
                  containerStyle={styles.containerRow}
                  onFocus={this.onFocusPassword}
                />

                {Features.isAllowedTo('Captcha') && (
                  <Captcha
                    accessibilityLabel={'signupcredentialsscreen_captcha'}
                    ref={ref => {
                      this.captcha = ref;
                    }}
                    onIsValid={this.onChangeCaptcha}
                    onPress={this.onPressCapcha}
                    style={styles.captcha}
                  />
                )}
              </CardView>

              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={'signupcredentialsscreen_button_continue'}
                  loading={isLoading}
                  title={L.signupcredentialsscreen_button_continue}
                  onPress={this.tryToSubmit}
                  disabled={!isValid}
                  allowOnPress
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                style={styles.infoContact}
                navigate={navigation.navigate}
                accessibilityLabel={'signupcredentialsscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type SignUpCredentialsScreenType = SignUpCredentialsScreen;
export default withFocused<SignUpCredentialsScreen, Props>(
  SignUpCredentialsScreen
);
