import * as React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  InteractionManager,
  BackHandler,
  Text,
  TextStyle,
} from 'react-native';
import API from '../../../../api';
import { MobileStepFinishErrorResponse } from '../../../../api/backend/response/SignUp';
import InfoContact from '../../../../components/info/InfoContact';
import TermsModal from '../../../../components/info/TermsModal';
import NetworkManager from '../../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
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
  ConfirmModal,
} from '../../../../components/ui';
import Config from '../../../../Config';
import {
  Formats,
  Colors,
  TypeInitialStart,
} from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import BackIcon from '../../../../components/navigation/BackIcon';
import Session from '../../../../api/Session';
import { InitialAppScreen } from '../../../../resources/initialAppScreen';

import { Sanitizer, Font } from '../../../../resources/functions';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SecureKeyboardApi from '../../../../components/ui/SecureKeyboardApi';

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
    marginTop: 30, // 10 adicional por formsteps
    marginBottom: 20,
  } as ViewStyle,
  infoMessage: {
    marginBottom: 10,
  } as ViewStyle,
  infoContact: {
    marginBottom: 50,
  } as ViewStyle,
  warningTitle: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 20,
  } as TextStyle,
  warningMessage: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'center',
  } as TextStyle,
  labelStyle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
  } as TextStyle,
});

const TAG = '[SignUpFacephiResetScreen]';

export interface Params {
  documentNumber: string;
  exchangeToken: string;
  a_seed: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  showTerms: boolean;
  isLoading: boolean;
  isTermsValid: boolean;
  isValid: boolean;
  showBackWarning: boolean;
  payload?: string;
  dictionary: string[];
  isChecked?: boolean;
}

class SignUpFacephiResetScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.signupstack_title,
    gesturesEnabled: false,
    headerLeft: (
      <BackIcon
        onPress={() => {
          Emitter.emit('onTryBack', true);
        }}
      />
    ),
  };
  state: State = {
    showTerms: false,
    isLoading: false,
    isTermsValid: true,
    isValid: false,
    showBackWarning: false,
    dictionary: [],
    isChecked: false,
  };
  repeatAppPassword!: TextInput | null;
  appPassword!: TextInput | null;
  terms!: CheckBox | null;
  isReallyMounted!: boolean;
  interaction!: any;

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
      await this.submit();
      this.setState({ isLoading: false });
    });
  };
  submit = async () => {
    const { navigation, route } = this.props;
    try {
      const documentNumber = route.params && route.params.documentNumber || '';
      const exchangeToken = route.params && route.params.exchangeToken || '';

      const { payload, dictionary } = this.state;

      const response = await API.SignUpBio.mobileBioFinish(
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
        this.setState({ isLoading: false });
        InitialAppScreen.ShowToolTip = TypeInitialStart.ShowToolTip;
        InitialAppScreen.InitialAppScreen = TypeInitialStart.SignIn;
        navigation.navigate('SignUpFacephiSuccess', {
          documentNumber,
        });
        return;
      }
      const error = data as MobileStepFinishErrorResponse;
      if (error._newPin) {
        this.appPassword &&
          this.appPassword.setError(L.signupfacephiresetscreen_error_password);
        AnalyticsEvent.track(A.seed_dni_reg_reset + '_err_clave');
      }
      this.repeatAppPassword &&
        this.repeatAppPassword.setError(
          L.signupfacephiresetscreen_error_apppassword
        );
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      AnalyticsEvent.track(A.seed_dni_reg_reset + '_err_red');
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
    Emitter.on('onTryBack', this.onTryBack);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    AnalyticsEvent.track(A.seed_dni_reg_reset + '_inicio');
    this.focus();
  }

  componentWillUnmount() {
    this.isReallyMounted = false;
    Emitter.off('onTryBack', this.onTryBack);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  onTryBack = () => {
    this.setState({ showBackWarning: true });
  };

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    Emitter.emit('onTryBack', true);
    return true;
  };
  showTerms = () => {
    setTimeout(() => {
      AnalyticsEvent.track(
        'signupfacephiresetscreen_open_terms',
        L.termsmodal_title
      );
    }, 2000);
    this.setState({ showTerms: true });
  };
  closeTerms = () => {
    this.setState({ showTerms: false });
  };
  acceptTerms = () => {
    AnalyticsEvent.track(
      'signUpFacephiCredentialsModalAccept',
      L.signupfacephiresetscreen_terms_btn_accept
    );
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  onFocusPassword = async() => {


    if (Config.features.KeyboardByApi) {
      this.appPassword && this.appPassword.setValue('');
      this.repeatAppPassword && this.repeatAppPassword.setValue('');
      Emitter.emit('onSecureKeyboardApiLoading');
      const activity = 'signup.mobile.doi.finish';
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

  hideBackWarning = () => {
    this.setState({ showBackWarning: false });
  };

  back = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      isLoading,
      isValid,
      showTerms,
      isTermsValid,
      showBackWarning,
      isChecked,
    } = this.state;
    const { isFocused, navigation } = this.props;

    return (
      <Container>
        {showBackWarning && (
          <ConfirmModal
            isWarningMode={true}
            onSuccess={this.hideBackWarning}
            onCancel={this.back}
            onClose={this.hideBackWarning}
            containerStyle={{ paddingBottom: 0 }}
            actionTitle={L.signupfacephiresetscreen_confirmmodal_btn_action}
            cancelTitle={L.signupfacephiresetscreen_confirmmodal_btn_cancel}
          >
            <Text style={styles.warningTitle}>
              {L.signupfacephiresetscreen_confirmmodal_title}
            </Text>
            <Text style={styles.warningMessage}>
              {L.signupfacephiresetscreen_confirmmodal_message}
            </Text>
          </ConfirmModal>
        )}

        <TermsModal
          accessibilityLabel={'signupfacephiresetscreen_termsmodal'}
          visible={showTerms}
          onClose={this.closeTerms}
          closeButton={{
            title: L.signupfacephiresetscreen_terms_btn_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.signupfacephiresetscreen_terms_btn_accept,
            onPress: this.acceptTerms,
          }}
          body={L.termsmodal_content_signup_facephi}
        />
        <FormSteps total={3} current={2} />
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
                accessibilityLabel={'signupfacephiresetscreen_header_password'}
                title={`${L.signupfacephiresetscreen_header_title}\n${L.signupfacephiresetscreen_header_title_part_2}`}
              />
              <CardView style={styles.cardView}>
                <InfoMessage
                  accessibilityLabel={
                    'signupfacephiresetscreen__texthelp_internet_key'
                  }
                  message={L.signupfacephiresetscreen_texthelp_internet_key}
                  style={styles.infoMessage}
                />
                <TextInput
                  textContentType={'password'}
                  accessibilityErrorInput={'signupfacephireset_errorpass1'}
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'signupfacephiresetscreen_textinput_internet_key'
                  }
                  imageSource={require('../../../../assets/images/password-icon.png')}
                  onChangeText={this.onChangePassword}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  secureTextEntry
                  label={L.signupfacephiresetscreen_textinput_internet_label}
                  labelStyle={styles.labelStyle}
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
                  accessibilityErrorInput={'signupfacephireset_errorpass2'}
                  customKeyboardType={
                    Config.features.KeyboardByApi
                      ? 'numeric-secure-api'
                      : 'numeric-secure'
                  }
                  accessibilityLabel={
                    'signupfacephiresetscreen_textinput_internet_key_repeat'
                  }
                  imageSource={require('../../../../assets/images/password-icon.png')}
                  onChangeText={this.onChangePassword}
                  autoCapitalize={'none'}
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  labelStyle={styles.labelStyle}
                  secureTextEntry
                  label={
                    L.signupfacephiresetscreen_textinput_internet_key_repeat
                  }
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
                      ? 'signupfacephiresetscreen_checkbox_terms'
                      : 'signupfacephiresetscreen_checkbox_terms_off'
                  }
                  analyticsParams={
                    L.signupfacephiresetscreen_checkbox_terms_part1 +
                    ' ' +
                    L.signupfacephiresetscreen_checkbox_terms_part2
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={L.signupfacephiresetscreen_checkbox_terms_part1}
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'signupfacephiresetscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={L.signupfacephiresetscreen_checkbox_terms_part2}
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.signupfacephiresetscreen_texterror_terms
                  }
                />
              </CardView>
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={
                    'signupfacephiresetscreen_button_continue'
                  }
                  loading={isLoading}
                  title={L.signupfacephiresetscreen_button_submit}
                  onPress={this.tryToSubmit}
                />
              </View>
            </Content>
            <Content vertical={false}>
              <InfoContact
                style={styles.infoContact}
                navigate={navigation.navigate}
                accessibilityLabel={'signupfacephiresetscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}
export type SignUpFacephiResetScreenType = SignUpFacephiResetScreen;
export default withFocused<SignUpFacephiResetScreen, Props>(
  SignUpFacephiResetScreen
);
