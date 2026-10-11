import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  CheckBox,
  TextLink,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  Header,
  FormSteps,
  CardView,
  Button,
  Separator,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import ConfirmCode from '../../../components/sms/ConfirmCode';
import Log from '../../../resources/log/Log';
import { Font, Validate } from '../../../resources/functions';
import API from '../../../api';
import { Colors, ErrorRequest } from '../../../resources/constants';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  View,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import NetworkManager from '../../../components/network/NetworkManager';
import TermsModal from '../../../components/info/TermsModal';
import DeclarationPEP from '../../../components/alert/DeclarationPEP';
import DeclarationPDP from '../../../components/alert/DeclarationPDP';
import { KeyboardUtil } from '../../../resources/util';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import {
  AccountResponse,
  AccountSendResponse,
} from '../../../api/backend/response/NewAccount';
import Modal from '../../../components/ui/ModalStandingUp';
import LoadingMibanco from '../../../components/ui/LoadingMibanco';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  tooltipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  tooltipStyle: {
    backgroundColor: Colors.secondary,
    width: 154,
  } as ViewStyle,
  helpRememberButtonIcon: {
    marginLeft: 6,
  } as ImageStyle,
  helpButtonIcon: {
    marginBottom: 5,
    width: 16,
    height: 16,
    tintColor: Colors.secondary,
  } as ImageStyle,
  boldText: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  formText: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as TextStyle,
  placeholderText: {
    ...Font(),
    fontSize: 13,
    marginLeft: 10,
    color: Colors.grey5,
  } as TextStyle,
  formLabel: {
    textAlign: 'left',
    ...Font(),
    marginTop: 10,
    color: Colors.grey5,
    fontSize: 14,
    lineHeight: 16,
  } as ViewStyle,
  cardView: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  cardSMSConfirm: {
    padding: 20,
  } as ViewStyle,
  cardOverview: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  buttons: {
    marginBottom: 50,
    marginTop: 10,
  } as ViewStyle,
  btnTextStyle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
  } as TextStyle,
  termsText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    textAlign: 'left',
    fontSize: 14,
    paddingLeft: 5,
  } as TextStyle,
  termsText2: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    textAlign: 'left',
    fontSize: 14,
    paddingLeft: 10,
  } as TextStyle,
  editButton: {
    ...Font({ weight: 'Regular' }),
    fontSize: 13,
    marginLeft: 4,
    marginTop: 0,
    color: Colors.grey5,
  } as TextStyle,
  separator: {
    marginBottom: 10,
    marginTop: 10,
  } as ViewStyle,
  marginToggle: {
    marginTop: 10,
  } as ViewStyle,
  marginTop: {
    marginHorizontal: 20,
    marginTop: 30, //  + 10 adicional por formsteps
    marginBottom: 20,
  } as ViewStyle,
  marginExpandableView: {
    marginHorizontal: 0,
  } as ViewStyle,
  footerText: {
    textAlign: 'left',
    ...Font({ weight: 'Regular' }),
    color: Colors.grey5,
    fontSize: 12,
  } as TextStyle,
  containerDesgravamen: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  button: {
    height: 50,
  } as ViewStyle,
  buttonModal: {
    minHeight: 40,
  } as ViewStyle,
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  textLoading: {
    marginTop: 12,
    ...Font({ weight: 'Regular' }),
    fontSize: 14,
    textAlign: 'center',
    color: Colors.grey1,
    lineHeight: 19,
  } as TextStyle,
});

export interface Params {
  email: string;
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isAllowedReadSMS: boolean;
  isValid: boolean;
  isTermsValid: boolean;
  isTermsPEPValid: boolean;
  showTerms: boolean;
  showTermsPEP: boolean;
  showTermsPDP: boolean;
  isLoadingResend: boolean;
  isLoading: boolean;
  isRequiredTerms: boolean;
  isLoadingTermsPEP: boolean;
  isLoadingTermsPDP: boolean;
  isTermsPDP: boolean;
  resume?: any;
}

const TAG = '[NewAccountConfirmScreen]';
class NewAccountConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.newaccountscreen_title,
  };

  state: State = {
    isTermsPDP: false,
    isLoading: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    isValid: false,
    isTermsValid: true,
    isTermsPEPValid: true,
    showTerms: false,
    showTermsPEP: false,
    showTermsPDP: false,
    isRequiredTerms: true,
    isLoadingTermsPEP: false,
    isLoadingTermsPDP: false,
    resume: undefined,
  };
  code!: ConfirmCode | null;
  terms!: CheckBox | null;
  termsPEP!: CheckBox | null;
  termsPDP!: CheckBox | null;

  componentDidMount() { }

  blur = () => {
    KeyboardUtil.hide();
  };

  focus = () => {
    Log.debug(TAG, 'focus');
    this.code && this.code.focus();
  };

  onCheckPermissions = (isAllowedReadSMS: boolean) => {
    this.setState({ isAllowedReadSMS }, () => {
      this.focusIfAllowed();
    });
  };

  focusIfAllowed = () => {
    const { isAllowedReadSMS } = this.state;
    !isAllowedReadSMS && this.focus();
  };

  onReadCode = (code: string) => {
    Log.debug(TAG, 'onReadCode');
    this.code && this.code.setValue(code);
  };

  isValidTerms = (showError = true) => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    if (showError) {
      this.setState({ isTermsValid });
    }
    return isTermsValid;
  };

  isValidPEPTerms = (showError = true) => {
    const isTermsPEPValid = this.termsPEP ? this.termsPEP.getValue() : false;
    if (showError) {
      this.setState({ isTermsPEPValid });
    }
    return isTermsPEPValid;
  };

  onChangeCheckboxTermsPDP = (value: boolean) => {
    if (value != true) {
      this.setState({ showTermsPDP: value, isTermsPDP: value }, () =>
        this.isValid(false)
      );
    } else {
      this.setState({ isTermsPDP: value });
    }
    //Validacion en BE de si usuario desea o no que se use la data
  };

  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isTermsValid: value }, () => this.isValid(false));
  };

  onChangeCheckboxTermsEATValue = (value: boolean) => {
    this.setState({ showTermsPEP: value }, () => this.isValid(false));
    this.setState({ isTermsPEPValid: value }, () => this.isValid(false));
  };

  showTerms = () => {
    this.setState({ showTerms: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  showTermsPEP = () => {
    this.setState({ showTermsPEP: true });
  };

  rejectTermsPEP = () => {
    this.termsPEP && this.termsPEP.setValue(false);
  };

  closeTermsPEP = () => {
    this.setState({ showTermsPEP: false });
  };

  showTermsPDP = () => {
    this.setState({ showTermsPDP: true });
  };

  rejectTermsPDP = () => {
    this.termsPDP && this.termsPDP.setValue(false);
  };

  closeTermsPDP = () => {
    this.setState({ showTermsPDP: false });
  };

  onAcceptTermsPDP = () => {
    this.termsPDP && this.termsPDP.setValue(true);
    this.closeTermsPDP();
  };

  onAcceptTermsPEP = () => {
    this.termsPEP && this.termsPEP.setValue(true);
    this.closeTermsPEP();
  };

  isValid = (showErrors = true) => {
    const isValidCode = this.isValidCode(showErrors);
    const isValidTerms = this.isValidTerms(showErrors);
    const isValidPEPTerms = this.isValidPEPTerms(showErrors);
    const isValid = [isValidCode, isValidTerms, isValidPEPTerms].every(
      item => !!item
    );
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  isValidCode = (showErrors = true) => {
    return this.code && this.code.isValid(showErrors);
  };

  onChangeCode = () => {
    this.isValid(false);
  };

  tryToSubmit = () => {
    this.blur();
    if (this.isValid()) {
      this.setState({ isLoading: true });
      this.submit();
    }
  };

  submit = async () => {
    const { navigation, route } = this.props;
    const { isTermsPEPValid, isTermsValid, isTermsPDP } = this.state;
    // const email = navigation.getParam('email');
    const email = route.params && route.params.email;
    try {
      const response = await API.NewAccount.newAccountSend(
        email,
        this.code ? this.code.getValue() : '',
        isTermsValid,
        isTermsPEPValid,
        isTermsPDP
      );

      if (response.body.code === API.ResponseCode.OK) {
        const accountResume = response.body.data as AccountSendResponse;
        this.setState({ isLoading: false });
        navigation.navigate('NewAccountSuccess', {
          idTransaction: response.body.idTransaction,
          email,
          accountResume,
        });
        return;
      }
      const error = response.body.data as DefaultErrorResponse;
      if (error.otp || error._otp) {
        this.code && this.code.setCodeError(error.otp || error._otp);
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  onResend = async () => {
    this.blur();
    AnalyticsEvent.track(A.instantcashconfirmscreen_text_resend_sms);
    this.setState({ isLoadingResend: true });
    try {
      const { route } = this.props;
      const email = route.params && route.params.email;
      const response = await API.NewAccount.newAccountPreview(email);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'onResend', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data as AccountResponse;
        this.setState({ resume });
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'onResend',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'onResend', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'onResend',
        e,
      });
    }
    this.setState({ isLoadingResend: false }, () => {
      this.code && this.code.setValue('');
      this.focusIfAllowed();
    });
  };

  render() {
    const {
      isTermsValid,
      isLoadingTermsPEP,
      isLoadingTermsPDP,
      isTermsPEPValid,
      showTerms,
      showTermsPEP,
      showTermsPDP,
      isValid,
      isLoading,
    } = this.state;
    const { isFocused } = this.props;
    return (
      <Container>
        <Modal
          visible={isLoading}
          onClose={() => {
            this.setState({ isLoading: false });
          }}
        >
          <View style={styles.loadingContainer}>
            <View style={{ width: 70, height: 70 }}>
              <LoadingMibanco
                accessibilityLabel={'instantcashsuccessscreen_happy'}
                style={{
                  height: 70,
                  paddingTop: 0,
                  marginTop: 0,
                }}
              />
            </View>
            <Text style={styles.textLoading}>
              {L.instantcashconfirmscreen_loading_new_account}
            </Text>
          </View>
        </Modal>
        <TermsModal
          accessibilityLabel={'newaccountconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_newaccount}
          onClose={this.closeTerms}
          closeButton={{
            title: L.newaccountconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
            style: styles.buttonModal,
          }}
          actionButton={{
            title: L.newaccountconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
            style: styles.buttonModal,
          }}
        />

        <DeclarationPDP
          accessibilityLabel={'newaccountconfirmscreen_termsmodaldata'}
          visible={showTermsPDP}
          onReject={this.rejectTermsPDP}
          onClose={this.closeTermsPDP}
          onAgree={this.onAcceptTermsPDP}
          loading={isLoadingTermsPDP}
        />
        <DeclarationPEP
          accessibilityLabel={'newaccountconfirmsscreen_declaration_alert'}
          visible={showTermsPEP}
          onReject={this.rejectTermsPEP}
          onClose={this.closeTermsPEP}
          onAgree={this.onAcceptTermsPEP}
          loading={isLoadingTermsPEP}
        />
        <FormSteps total={3} current={2} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight:
              Size.getVisibleTabScreenHeight() + Size.getHeaderBarHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <Header
                accessibilityLabel={'newaccountconfirmscreen_header_title'}
                style={styles.marginTop}
                title={L.newaccountscreen_header_title}
                center
              />
              <CardView style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={'newaccountconfirmscreen_confirmcode'}
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <CardView style={styles.cardView}>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={'newaccountconfirmscreen_checkbox_terms'}
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={L.newaccountscreen_checkbox_terms_part1}
                  rightContainer={
                    <TextLink
                      styleTitle={styles.termsText}
                      accessibilityLabel={
                        'newaccountconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={L.newaccountscreen_checkbox_terms_part2}
                    />
                  }
                  errorMessage={
                    isTermsValid ? '' : L.newaccountscreen_texterror_terms
                  }
                />
              </CardView>
              <CardView style={styles.cardView}>
                <CheckBox
                  ref={ref => {
                    this.termsPEP = ref;
                  }}
                  isPEPDeclaration={true}
                  accessibilityLabel={'newaccountscreen_checkbox_termsPEP'}
                  onChangeValue={this.onChangeCheckboxTermsEATValue}
                  placeholder={L.newaccountscreen_alertmodal_message}
                  errorMessage={
                    isTermsPEPValid ? '' : L.newaccountscreen_PEP_modal_error
                  }
                />
                <Separator style={styles.separator} />
                <View>
                  <Text
                    accessibilityLabel={
                      'newaccountconfirmscreen_checkbox_footer'
                    }
                    style={styles.footerText}
                  >
                    {L.newaccountscreen_checkbox_footer}
                  </Text>
                </View>
              </CardView>
              <CardView style={styles.cardView}>
                <CheckBox
                  ref={ref => {
                    this.termsPDP = ref;
                  }}
                  accessibilityLabel={
                    'newaccountconfirmscreen_checkbox_terms_data'
                  }
                  onChangeValue={this.onChangeCheckboxTermsPDP}
                  placeholder={L.newaccountscreen_checkbox_terms_data_part1}
                  rightContainer={
                    <TextLink
                      styleTitle={styles.termsText}
                      accessibilityLabel={
                        'newaccountconfirmscreen_buttonlink_terms_data'
                      }
                      onPress={this.showTermsPDP}
                      title={L.newaccountscreen_checkbox_terms_data_part2}
                    />
                  }
                  placeholderMessage2={
                    <TextLink
                      styleTitle={styles.termsText2}
                      accessibilityLabel={
                        'newaccountconfirmscreen_buttonlink_terms_data'
                      }
                      onPress={this.showTermsPDP}
                      title={L.newaccountscreen_checkbox_terms_data_part3}
                    />
                  }
                />
              </CardView>
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'newaccountconfirmscreen_button_continue'}
                  style={styles.button}
                  onPress={this.tryToSubmit}
                  loading={isValid && isLoading}
                  title={L.newaccountscreen_button_continue}
                  textStyle={styles.btnTextStyle}
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type NewAccountConfirmScreenType = NewAccountConfirmScreen;
export default withFocused<NewAccountConfirmScreen, Props>(
  NewAccountConfirmScreen
);
