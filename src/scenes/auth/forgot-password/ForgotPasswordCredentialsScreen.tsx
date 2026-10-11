import * as React from 'react';
import { InteractionManager, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
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
import { ErrorRequest, Formats } from '../../../resources/constants';
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
} from '../../../api/backend/response/Recover';
import Features from '../../../resources/remote/Features';
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
const TAG = '[ForgotPasswordCredentialsScreen]';

const ErrorCodes = {
  InvalidPhone: '201',
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

class ForgotPasswordCredentialsScreen extends React.Component<
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
  private captcha!: Captcha | null;

  isValid = (showErrors = true) => {
    const isValid = [
      this.document ? this.document.isValid(showErrors) : false,
      this.cardNumber ? this.cardNumber.isValid(showErrors) : false,
      this.atmPass ? this.atmPass.isValid(showErrors) : false,
      Features.isAllowedTo('Captcha')
        ? this.captcha
          ? this.captcha.isValid(showErrors)
          : false
        : true,
    ].every(value => value);

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
        const exchangeToken = data._exchangeToken;

        navigation.navigate('ForgotPasswordSMS', {
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
        navigation.navigate('ForgotPasswordInvalid');
        return;
      }

      if (Validate.includes('captcha incorrecto', body.message)) {
        this.captcha && this.captcha.setError(body.message);
        hasError = true;
      }

      if (Config.features.EnableNewRequestKeyFour) {
        if (Validate.includes('Error de validación', body.message)) {
          hasError = true;
        }
      }

      const debitCardError = error._debitcardNumber;
      if (debitCardError) {
        this.cardNumber && this.cardNumber.setError(debitCardError);
        hasError = true;
      }

      if (Config.features.EnableNewRequestKeyFour) {
        const documentNumberError = error._documentNumber;
        if (documentNumber) {
          this.document && this.document.setError(documentNumberError);
          hasError = true;
        }
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
    Emitter.on('onForgotPasswordTimeout', this.onForgotPasswordTimeout);
    this.focus();
  }

  componentDidUpdate() {
    const { route } = this.props;
    const validationError = route.params && route.params.validationError;
    if (validationError) {
      this.cardNumber && this.cardNumber.setError(validationError);
    }
  }

  onForgotPasswordTimeout = (data: any) => {
    if (!Features.isAllowedTo('Captcha')) {
      this.clearForm();
      const { navigation } = this.props;
      navigation.navigate('ForgotPasswordCredentials');
      return;
    }

    Log.debug(TAG, 'onForgotPasswordTimeout', data);
    if (data && data.message) {
      this.scroll && this.scroll.scrollTo({ y: 0, animated: true });
      this.interaction && this.interaction.cancel();
      this.interaction = InteractionManager.runAfterInteractions(() => {
        this.message && this.message.show({ id: 'expiration', ...data });
      });
    }
    this.clearForm();
    const { navigation } = this.props;
    navigation.navigate('ForgotPasswordCredentials');
  };

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    Emitter.off('onForgotPasswordTimeout', this.onForgotPasswordTimeout);
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
  onFocusPassword = async() => {

    if (Config.features.KeyboardByApi) {
      this.atmPass && this.atmPass.setValue('');
      Emitter.emit('onSecureKeyboardApiLoading');

      let activity = 'recover.mobile.step2';
      if(Config.features.EnableNewRequestKeyFour){
        activity = 'recover.mobile.recover.mobile.step1';
      }
      const response = await SecureKeyboardApi.callApiKb(activity);
      if(response){
         const {payload,dictionary} = response;
         this.setState({ payload, dictionary });
           Emitter.emit('onSecureKeyboardApi', dictionary);
      }

    }
  };
  render() {
    const { isLoading, cardSaved, isValid } = this.state;
    const { isFocused, navigation } = this.props;
    return (
      <Container>
        <ExpirationTime
          timeout={Config.settings.timeoutExpirationForgotPassword}
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
                accessibilityLabel={
                  'forgotpasswordcredentialsscreen_messagecenter'
                }
                ref={ref => {
                  this.message = ref;
                }}
                style={styles.networkStatus}
              />

              <Header
                accessibilityLabel={
                  'forgotpasswordcredentialsscreen_header_personal_data'
                }
                style={styles.header}
                title={L.forgotpasswordcredentialsscreen_header_personal_data}
                center
              />

              <CardView padding style={styles.cardView}>
                <TextInput
                  textContentType={'none'}
                  accessibilityLabel={
                    'forgotpasswordcredentialsscreen_textinput_document'
                  }
                  imageSource={require('../../../assets/images/document-icon.png')}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  formatText={Formats.Document}
                  label={L.forgotpasswordcredentialsscreen_textinput_document}
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
                    L.forgotpasswordcredentialsscreen_textinput_document_subtitle
                  }
                  containerStyle={styles.containerRow}
                />

                <TextInputMasked
                  textContentType={'username'}
                  onPress={this.onPressInputCreditCard}
                  mask={cardSaved}
                  accessibilityLabel={
                    'forgotpasswordcredentialsscreen_textinput_card_number'
                  }
                  imageSource={require('../../../assets/images/card-icon.png')}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  label={
                    L.forgotpasswordcredentialsscreen_textinput_card_number
                  }
                  labelSubtitle={
                    L.forgotpasswordcredentialsscreen_textinput_card_number_subtitle
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
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'forgotpasswordcredentialsscreen_textinput_atmpassword'
                  }
                  imageSource={require('../../../assets/images/password-icon.png')}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  secureTextEntry
                  label={
                    L.forgotpasswordcredentialsscreen_textinput_atmpassword
                  }
                  ref={ref => {
                    this.atmPass = ref;
                  }}
                  onChangeText={this.onChangeValues}
                  blurOnSubmit
                  formatText={Formats.ATMKey}
                  labelSubtitle={
                    L.forgotpasswordcredentialsscreen_textinput_atmpassword_subtitle
                  }
                  containerStyle={styles.containerRow}
                  onFocus={this.onFocusPassword}
                />

                {Features.isAllowedTo('Captcha') && (
                  <Captcha
                    accessibilityLabel={
                      'forgotpasswordcredentialsscreen_captcha'
                    }
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
                  accessibilityLabel={
                    'forgotpasswordcredentialsscreen_button_continue'
                  }
                  loading={isLoading}
                  title={L.forgotpasswordcredentialsscreen_button_continue}
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
                accessibilityLabel={
                  'forgotpasswordcredentialsscreen_infocontact'
                }
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ForgotPasswordCredentialsScreenType = ForgotPasswordCredentialsScreen;
export default withFocused<ForgotPasswordCredentialsScreen, Props>(
  ForgotPasswordCredentialsScreen
);
