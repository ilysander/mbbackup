import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  Header,
  FormSteps,
  CardView,
  Button,
  CheckBox,
  TextLink,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import {L} from '../../../resources/language';
import Log from '../../../resources/log/Log';
import {Font, Validate} from '../../../resources/functions';
import {Colors, ErrorRequest} from '../../../resources/constants';
import {Emitter} from '../../../resources/listeners';
import {AlertEvent} from '../../../components/alert/AlertManager';
import {View, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import NetworkManager from '../../../components/network/NetworkManager';
import Session from '../../../api/Session';
import {KeyboardUtil} from '../../../resources/util';
import ConfirmCode from '../../../components/sms/ConfirmCode';
import DeviceInfo from '../../../resources/deviceset/DeviceInfo';
import API from '../../../api';
import {PreferencesUserDataModifyPreResponse} from '../../../api/backend/response/Execute';
import TermsModal from '../../../components/info/TermsModal';
import {DefaultErrorResponse} from '../../../api/backend/response/Error';
import CheckLPDP from '../../../components/terms-lpdp/CheckLPDP';
import ModalTermsLPDP from '../../../components/terms-lpdp/ModalTermsLPDP';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginBottom: 50,
    marginTop: 30,
  } as ViewStyle,
  marginTop: {
    marginHorizontal: 20,
    marginTop: 30,
  } as ViewStyle,
  card: {
    marginTop: 20,
  } as ViewStyle,
  headerTitle: {
    fontSize: 22,
  } as TextStyle,
  termsTextBold: {
    ...Font({weight: 'Bold'}),
    color: Colors.primary,
    textAlign: 'left',
    fontSize: 14,
    paddingLeft: 5,
  } as TextStyle,
});

export interface Params {
  user: PreferencesUserDataModifyPreResponse;
  email: string;
}
export interface Props extends NativeStackScreenProps<any, any> {}

export interface State {
  isLoading: boolean;
  isValid: boolean;
  isAllowedReadSMS: boolean;
  isLoadingResend: boolean;
  showTerms: boolean;
  isTermsValid: boolean;
}
const TAG = '[UpdateEmailConfirmScreen]';
class UpdateEmailConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.updateemailconfirmscreen_title,
  };

  state: State = {
    isLoading: false,
    isValid: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    isTermsValid: true,
    showTerms: false,
  };

  code!: ConfirmCode | null;
  terms!: CheckBox | null;

  modalTermsLpdp!: ModalTermsLPDP | null;
  checkLpdp!: CheckLPDP | null;

  isValid = () => {
    const terms = this.terms ? this.terms.getValue() : false;
    const code = this.code ? this.code.getValue() : '';
    const isCodeValid = code.length === 5;
    const isValid = terms && isCodeValid; // Prueba hasta integracion
    if (isValid) {
      this.setState({isValid});
      return isValid && NetworkManager.isConnected;
    }
    this.setState({isValid});
    return isValid && NetworkManager.isConnected;
  };

  tryToSubmit = async () => {
    this.blur();
    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'tryToSubmit',
        e: '',
      });
      return;
    }

    const isValid = this.isValid();
    if (!isValid) {
      return;
    }
    this.setState({isLoading: true});
    await this.submit();
    this.setState({isLoading: false});
  };

  submit = async () => {
    const {navigation, route} = this.props;

    const email = route.params && route.params.email;
    const user = route.params && route.params.user;
    const otpCode = this.code ? this.code.getValue() : '';
    try {
      const userInfo = DeviceInfo.userInfoLoad(user.client._documentNumber); // TODO verificar que es la forma de obtener el documento

      const deviceDate = DeviceInfo.deviceDate();
      const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
      const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
      const deviceId = await deviceInfoRaw.deviceId;

      const deviceInfo = {
        ...deviceInfoRaw,
        physicalDeviceId,
        deviceId,
      };
      const requestEmail = {
        key: 'email',
        value: email,
      };
      const response = await API.Execute.updateEmail(
        deviceInfo,
        userInfo,
        deviceDate,
        requestEmail,
        user.client.idAddress,
        user.client.addressType,
        user.client.addressFormat,
        email,
        otpCode,
      );
      const error = response.body.data as DefaultErrorResponse;
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'UpdateEmailSuccess', response);
      }

      if (response.body.code === API.ResponseCode.OK) {
        this.checkLpdp && this.checkLpdp.trySave();

        navigation.navigate('UpdateEmailSuccess');
      } else if (error._otp) {
        this.code && this.code.setCodeError(error._otp);
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
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  onResend = async () => {
    this.blur();
    this.setState({isLoadingResend: true});
    const {route} = this.props;

    const email = route.params && route.params.email;
    const user = route.params && route.params.user;
    try {
      const userInfo = DeviceInfo.userInfoLoad(user.client._documentNumber); // TODO verificar que es la forma de obtener el documento

      const deviceDate = DeviceInfo.deviceDate();
      const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
      const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
      const deviceId = await deviceInfoRaw.deviceId;

      const deviceInfo = {
        ...deviceInfoRaw,
        physicalDeviceId,
        deviceId,
      };
      const requestEmail = {
        key: 'email',
        value: email,
      };
      const response = await API.Session.updateEmailSendOTP(
        deviceInfo,
        userInfo,
        deviceDate,
        requestEmail,
      );

      if (!Validate.validateStatusCode(response.status)) {
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
    this.setState({isLoadingResend: false}, () => {
      this.code && this.code.setValue('');
    });
  };
  onChangeCode = () => {
    this.isValid();
  };

  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({isTermsValid: value}, () => this.isValid());
  };

  showTerms = () => {
    this.setState({showTerms: true});
  };

  closeTerms = () => {
    this.setState({showTerms: false});
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  showTermsLpdp = () => {
    this.modalTermsLpdp && this.modalTermsLpdp.showPanel();
  };

  render() {
    const {isValid, isLoading, isTermsValid, showTerms} = this.state;

    const {route} = this.props;
    let dni = '';
    const user = route.params && route.params.user;
    if (!!user) {
      dni = user.client._documentNumber;
    }

    return (
      <Container>
        <TermsModal
          accessibilityLabel={'updateemailconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.terms_updateemail}
          onClose={this.closeTerms}
          actionButton={{
            title: L.updateemailconfirmscreen_terms_btn_ok,
            onPress: this.onAcceptTerms,
          }}
        />
        <FormSteps current={2} total={3} />
        <SafeAreaView>
          <KeyboardAvoidingView
            enabled={true}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{
              minHeight: Size.getVisibleTabScreenHeight(),
            }}>
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <Header
                accessibilityLabel={
                  'updateemailconfirmscreen_changeheader_title'
                }
                style={styles.marginTop}
                titleStyle={styles.headerTitle}
                title={L.updateemailconfirmscreen_changeheader_title}
                center
              />
              <CardView padding style={styles.card}>
                <ConfirmCode
                  accessibilityLabel={'updateemailconfirmscreen_confirmcode'}
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <CardView padding style={styles.card}>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={'updateemailconfirmscreen_checkbox_terms'}
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={L.updateemailconfirmscreen_checkbox_terms_part1}
                  iconUncheckedStyle={{tintColor: Colors.grey3}}
                  rightContainer={
                    <TextLink
                      styleTitle={styles.termsTextBold}
                      accessibilityLabel={
                        'updateemailconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={L.updateemailconfirmscreen_checkbox_terms_part2}
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.updateemailconfirmscreen_texterror_terms
                  }
                />
              </CardView>

              {!!dni && (
                <CheckLPDP
                  ref={ref => {
                    this.checkLpdp = ref;
                  }}
                  dni={dni}
                  showTermsLpdp={this.showTermsLpdp}
                  accessibilityLabelCheck={
                    'updateemailconfirmscreen_checkbox_terms_lpdp'
                  }
                  accessibilityLabelLinkOpenModal={
                    'updateemailconfirmscreen_checklink_terms_lpdp'
                  }
                />
              )}

              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={
                    'updateemailconfirmscreen_button_continue'
                  }
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  big
                  title={L.updateemailconfirmscreen_button_next}
                />
              </View>
            </Content>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <ModalTermsLPDP
          ref={ref => {
            this.modalTermsLpdp = ref;
          }}
          accessibilityLabel={'updateemailconfirmscreen_modalldpdp'}
          accessibilityLabelButtonClose={
            'updateemailconfirmscreen_modalldpdp_close'
          }
          accessibilityLabelExpandableItem={
            'updateemailconfirmscreen_modalldpdp_toggle'
          }
        />
      </Container>
    );
  }
}

export type UpdateEmailConfirmScreenType = UpdateEmailConfirmScreen;
export default withFocused<UpdateEmailConfirmScreen, Props>(
  UpdateEmailConfirmScreen,
);
