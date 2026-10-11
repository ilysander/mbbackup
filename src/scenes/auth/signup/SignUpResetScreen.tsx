import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ViewStyle,
  InteractionManager,
} from 'react-native';
import API from '../../../api';
import { MobileStepFinishErrorResponse } from '../../../api/backend/response/SignUp';
import InfoContact from '../../../components/info/InfoContact';
import TermsModal from '../../../components/info/TermsModal';
import NetworkManager from '../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Button,
  ButtonLink,
  CheckBox,
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
import Session from '../../../api/Session';
import { InitialAppScreen } from '../../../resources/initialAppScreen';
import { Sanitizer } from '../../../resources/functions';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import ModalTermsLPDP from '../../../components/terms-lpdp/ModalTermsLPDP';
import CheckLPDP from '../../../components/terms-lpdp/CheckLPDP';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SecureKeyboardApi from '../../../components/ui/SecureKeyboardApi';

const styles = StyleSheet.create({
  cardView: {
    padding: 20,
    marginBottom: 20,
  } as ViewStyle,
  cardTermsReset: {
    padding: 15,
  } as ViewStyle,
  buttons: {
    marginTop: 30,
    marginBottom: 20,
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

const TAG = '[SignUpResetScreen]';

export interface Params {
  cardNumber: string;
  exchangeToken: string;
  documentNumber: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  showTerms: boolean;
  isLoading: boolean;
  isTermsValid: boolean;
  isValid: boolean;
  allowSubmit: boolean;
  payload?: string;
  dictionary: string[];
  isChecked?: boolean;
}

class SignUpResetScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions = {
  //   title: L.signupstack_title,
  //   gesturesEnabled: false,
  //   headerLeft: (
  //     <BackIcon
  //       onPress={() => {
  //         Emitter.emit('onSignUpTimeout', true);
  //       }}
  //     />
  //   ),
  // };
  state: State = {
    showTerms: false,
    isLoading: false,
    isTermsValid: true,
    isValid: false,
    allowSubmit: false,
    dictionary: [],
    isChecked: false,
  };
  repeatAppPassword!: TextInput | null;
  appPassword!: TextInput | null;
  terms!: CheckBox | null;
  timeoutExpiry!: NodeJS.Timeout;
  isReallyMounted!: boolean;
  interaction!: any;
  timeoutMinimal!: any;
  intervalAllow!: any;

  modalTermsLpdp!: ModalTermsLPDP | null;
  checkLpdp!: CheckLPDP | null;

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
    const isValidTerms = this.isValidTerms(showErrors);

    const isValid = [
      appPasswordIsValid,
      repeatAppPasswordIsValid,
      isValidTerms,
    ].every(item => item);
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };
  onChangePassword = () => {
    this.isValid(false);
  };
  isValidTerms = (showError = true) => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    if (showError) {
      this.setState({ isTermsValid });
    }
    return isTermsValid;
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

      const response = await API.SignUp.mobileFinish(
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
        this.terms ? this.terms.getValue() : false,
        payload
      );

      const body = response.body;
      const data = body.data;
      const isValid = body.code === API.ResponseCode.OK;
      if (isValid) {
        await Session.onboardingSave(TypeInitialStart.SignIn);
        InitialAppScreen.ShowToolTip = TypeInitialStart.ShowToolTip;
        InitialAppScreen.InitialAppScreen = TypeInitialStart.SignIn;
        this.checkLpdp && this.checkLpdp.trySave();
        navigation.navigate('SignUpSuccess', {
          cardNumber,
        });
        return;
      }
      AnalyticsEvent.track(A.seed_card_reg_reset + '_validation_err');

      const error = data as MobileStepFinishErrorResponse;
      if (error._newPin) {
        this.appPassword &&
          this.appPassword.setError(L.signupresetscreen_error_password);
      }
      this.repeatAppPassword &&
        this.repeatAppPassword.setError(L.signupresetscreen_error_apppassword);
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      AnalyticsEvent.track(A.seed_card_reg_reset + '_err_red');
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };
  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isChecked: value });
    this.setState({ isTermsValid: value }, () => this.isValid(false));
  };
  focus = () => {
    Log.debug(TAG, 'focus');
    this.appPassword && this.appPassword.focus();
  };
  componentDidMount() {
    this.isReallyMounted = true;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    AnalyticsEvent.track(A.seed_card_reg_reset + '_inicio');

    this.focus();
    this.checkMinimal();

    this.timeoutExpiry = setTimeout(() => {
      const { isFocused } = this.props;
      this.isReallyMounted &&
        isFocused &&
        Emitter.emit('onSignUpTimeout', {
          message: L.signupresetscreen_timeout,
          type: 'info',
        });
    }, Config.settings.timeoutTokenExpirationSignUp);
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
  showTerms = () => {
    AnalyticsEvent.track('signUpResetShowTerms', L.termsmodal_title);
    this.setState({ showTerms: true });
  };
  closeTerms = () => {
    this.setState({ showTerms: false });
  };
  acceptTerms = () => {
    AnalyticsEvent.track(
      'signUpResetTermsModalacceptTerms',
      L.signupresetscreen_modal_button_accept
    );
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  onFocusPassword = async() => {

    if (Config.features.KeyboardByApi) {
      this.appPassword && this.appPassword.setValue('');
      this.repeatAppPassword && this.repeatAppPassword.setValue('');
      Emitter.emit('onSecureKeyboardApiLoading');
      const activity = 'signup.mobile.finish';
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

  showTermsLpdp = () => {
    this.modalTermsLpdp && this.modalTermsLpdp.showPanel();
  };

  render() {
    const {
      isLoading,
      isValid,
      showTerms,
      isTermsValid,
      isChecked,
    } = this.state;
    const { isFocused, navigation, route } = this.props;
    const documentNumber = route.params && route.params.documentNumber || '';

    return (
      <Container>
        <TermsModal
          accessibilityLabel={'signupresetscreen_termsmodal'}
          visible={showTerms}
          onClose={this.closeTerms}
          closeButton={{
            title: L.signupresetscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.signupresetscreen_modal_button_accept,
            onPress: this.acceptTerms,
          }}
        />
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
                accessibilityLabel={'signupresetscreen_header_password'}
                title={`${L.signupresetscreen_header_title}\n${L.signupresetscreen_header_title_part_2}`}
              />
              <CardView style={styles.cardView}>
                <InfoMessage
                  accessibilityLabel={'signupresetscreen_texthelp_internet_key'}
                  message={L.signupresetscreen_texthelp_internet_key}
                  style={styles.infoMessage}
                />
                <TextInput
                  textContentType={'password'}
                  accessibilityErrorInput={'signupreset_newpassword'}
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'signupresetscreen_textinput_internet_key'
                  }
                  imageSource={require('../../../assets/images/password-icon.png')}
                  onChangeText={this.onChangePassword}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  secureTextEntry
                  label={L.signupresetscreen_textinput_internet_key}
                  labelSubtitle={
                    L.signupresetscreen_textinput_internet_key_subtitle
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
                  accessibilityErrorInput={'signupreset_newpassword_repeated'}
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'signupresetscreen_textinput_internet_key_repeat'
                  }
                  imageSource={require('../../../assets/images/password-icon.png')}
                  onChangeText={this.onChangePassword}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  labelSubtitle={
                    L.signupresetscreen_textinput_internet_key_repeat_subtitle
                  }
                  secureTextEntry
                  label={L.signupresetscreen_textinput_internet_key_repeat}
                  ref={ref => {
                    this.repeatAppPassword = ref;
                  }}
                  blurOnSubmit
                  onBlur={() => {
                    this.isValidRepeatAppPassword();
                  }}
                  formatText={Formats.InternetKeyRepeat}
                  onFocus={this.onFocusPasswordRepeat}
                />
              </CardView>
              <CardView style={styles.cardTermsReset}>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={
                    !isChecked
                      ? 'signupresetscreen_checkbox_terms'
                      : 'signupresetscreen_checkbox_terms_off'
                  }
                  analyticsParams={
                    L.signupfacephiresetscreen_checkbox_terms_part1 +
                    ' ' +
                    L.signupfacephiresetscreen_checkbox_terms_part2
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={L.signupresetscreen_checkbox_terms_part1}
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={'signupresetscreen_buttonlink_terms'}
                      onPress={this.showTerms}
                      title={L.signupresetscreen_checkbox_terms_part2}
                    />
                  }
                  errorMessage={
                    isTermsValid ? '' : L.signupresetscreen_texterror_terms
                  }
                />
              </CardView>

              {!!documentNumber && (
                <CheckLPDP
                  ref={ref => {
                    this.checkLpdp = ref;
                  }}
                  dni={documentNumber}
                  showTermsLpdp={this.showTermsLpdp}
                  accessibilityLabelCheck={
                    'signupresetscreen_checkbox_terms_lpdp'
                  }
                  accessibilityLabelLinkOpenModal={
                    'signupresetscreen_checklink_terms_lpdp'
                  }
                />
              )}
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'signupresetscreen_button_continue'}
                  loading={isLoading}
                  title={L.signupresetscreen_button_submit}
                  onPress={this.tryToSubmit}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'signupresetscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <ModalTermsLPDP
          ref={ref => {
            this.modalTermsLpdp = ref;
          }}
          accessibilityLabel={'signupresetscreen_modalldpdp'}
          accessibilityLabelButtonClose={'signupresetscreen_modalldpdp_close'}
          accessibilityLabelExpandableItem={
            'signupresetscreen_modalldpdp_toggle'
          }
        />
      </Container>
    );
  }
}
export type SignUpResetScreenType = SignUpResetScreen;
export default withFocused<SignUpResetScreen, Props>(SignUpResetScreen);
