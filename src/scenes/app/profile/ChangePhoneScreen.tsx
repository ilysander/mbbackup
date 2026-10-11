import * as React from 'react';
import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import API from '../../../api';
import InfoContact from '../../../components/info/InfoContact';
import ValidationModal from '../../../components/modal/ValidationModal';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import SMSReader from '../../../components/sms/SMSReader';
import {
  Button,
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  Loading,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
  TextInput,
  TextInputCode,
  CardView,
  SectionHeader,
} from '../../../components/ui';
import {ChangeTextProps} from '../../../components/ui/TextInputCode';
import {A, AnalyticsEvent} from '../../../resources/analytics';
import {Colors, ErrorRequest, Formats} from '../../../resources/constants';
import {Size} from '../../../resources/dimensions';
import {Font, Validate} from '../../../resources/functions';
import {L} from '../../../resources/language';
import {Emitter} from '../../../resources/listeners';
import {Log} from '../../../resources/log';
import {KeyboardUtil} from '../../../resources/util';
import {AlertEvent} from '../../../components/alert/AlertManager';
import {ReturnOptions} from '../../../components/alert/ConfirmPhoneAlert';
import {CommunicationConfigurationsItem} from '../../../api/backend/response/Execute';
import Features from '../../../resources/remote/Features';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  subtitleOneTimePassword: {
    ...Font(),
    color: Colors.grey5,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 16,
  } as TextStyle,
  button: {
    marginTop: 30,
    alignSelf: 'center',
  } as ViewStyle,
  buttons: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  smsContainer: {
    alignItems: 'center',
    marginTop: 20,
  } as ViewStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  valueText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    marginBottom: 15,
  } as TextStyle,
  codeContainer: {
    marginTop: 20,
  } as ViewStyle,
  header: {marginBottom: 20} as ViewStyle,
  label: {
    ...Font({weight: 'SemiBold'}),
    color: Colors.grey6,
  } as TextStyle,
});

const TAG = '[ChangePhoneScreen]';

export interface NavigationParams {
  current: string;
  returnOptions?: ReturnOptions;
}
export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, NavigationParams>;
}

export interface State {
  current: string;
  isAllowedReadSMS: boolean;
  showValidationModal: boolean;
  isValidOTP: boolean;
  isSent: boolean;
  isLoading: boolean;
  isLoadingResend: boolean;
}

class ChangePhoneScreen extends React.Component<Props & FocusedProps, State> {
  state: State = {
    current: '',
    isAllowedReadSMS: false,
    showValidationModal: false,
    isValidOTP: false,
    isSent: false,
    isLoading: false,
    isLoadingResend: false,
  };
  code!: TextInputCode | null;
  number!: TextInput | null;
  confirmatm!: ValidationModal | null;
  timeoutSuccess!: NodeJS.Timeout;
  isReallyMounted!: boolean;

  goBack = () => {
    this.props.navigation.goBack();
  };

  onAlert = () => {
    this.setState({showValidationModal: false});
  };

  componentDidMount() {
    if (!Features.isAllowedTo('ChangePhone')) {
      this.goBack();
    } else {
      this.load();
      this.isReallyMounted = true;
      Emitter.on('onAlert', this.onAlert);
    }
  }

  componentWillUnmount() {
    this.isReallyMounted = false;
    Emitter.off('onAlert', this.onAlert);
    this.timeoutSuccess && clearTimeout(this.timeoutSuccess);
  }

  load = async () => {
    const {route} = this.props;
    const current = route.params && route.params.current;
    this.setState({current});
  };

  showConfirmModal = () => {
    KeyboardUtil.hide();
    this.setState({showValidationModal: true});
  };

  focusIfAllowed = () => {
    const {isAllowedReadSMS} = this.state;
    !isAllowedReadSMS && this.code && this.code.focus();
  };

  onCheckPermissions = (isAllowedReadSMS: boolean) => {
    this.setState({isAllowedReadSMS}, () => {
      this.focusIfAllowed();
    });
  };
  onReadCode = (code: string) => {
    Log.debug(TAG, 'onReadCode');
    this.code && this.code.setValue(code);
  };

  cancelValidationModal = () => {
    this.setState({showValidationModal: false});
    AnalyticsEvent.track(A.changephonescreen_button_cancel_atm);

    const {navigation, route} = this.props;
    const returnOptions = route.params && route.params.returnOptions;
    if (
      returnOptions &&
      returnOptions.cancel &&
      typeof returnOptions.cancel.onPress === 'function'
    ) {
      returnOptions.cancel.onPress();
    } else {
      navigation.navigate('Queries');
    }
  };
  resendCode = () => {
    KeyboardUtil.hide();
    this.validate();
  };
  validate = async () => {
    const {isLoadingResend} = this.state;
    if (isLoadingResend) {
      return;
    }
    let isSent = this.number ? this.number.isValid() : false;
    this.setState({isSent, isLoadingResend: true});
    if (isSent) {
      try {
        const mobilePhone = this.number ? this.number.getValue() : '';
        const response =
          await API.Execute.preferencesUserdataUpdateMobilePhoneSend(
            mobilePhone,
          );
        if (!Validate.validateStatusCode(response.status)) {
          Log.withStatusCode(TAG, 'validate', response);
        }
      } catch (e) {
        Log.exception(TAG, 'validate', e);
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'validate',
          e,
        });
        isSent = false;
      }
    }
    this.setState({isSent, isLoadingResend: false}, () => {
      this.focusIfAllowed();
    });
  };

  onChangeCode = ({isCompleted}: ChangeTextProps) => {
    this.setState({isValidOTP: isCompleted});
  };

  getCommunicationConfigurationsValue = (
    config: CommunicationConfigurationsItem[],
    value: string,
  ) => {
    let options = null;

    const communicationType = config.filter(
      el => el.communicationType === value,
    );
    const Items = [
      communicationType[0].subscribedSMS,
      communicationType[0].subscribedMail,
    ];
    if (communicationType[0].subscribedSMS) {
      options = 'SMS';
    }
    if (communicationType[0].subscribedMail) {
      options = 'MAIL';
    }
    if (Items.every(x => !x)) {
      options = null;
    }
    if (Items.every(x => x)) {
      options = ['MAIL', 'SMS'];
    }
    return options;
  };

  getProfile = async () => {
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'getProfile', response);
      }
      return response.body.data;
    } catch (e) {
      Log.exception(TAG, 'getProfile', e);
    }
    return;
  };

  tryToChange = async () => {
    this.setState({isLoading: true});
    AnalyticsEvent.track(A.changephonescreen_button_accept_atm);
    try {
      const user = await this.getProfile();
      if (!user) {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'tryToChange',
          e: ErrorRequest.Default,
        });
        return;
      }
      const {
        _securitySeal,
        defaultEnvironment,
        communicationConfigurations: config,
      } = user;

      const mobilePhone = this.number ? this.number.getValue() : '';
      const mobilePhoneCode = this.code ? this.code.getValue() : '';
      const response = await API.Execute.preferencesUserdataModifySend({
        mobilePhone,
        mobilePhoneCode,
        _securitySeal: _securitySeal.toString(),
        defaultEnvironment: defaultEnvironment.toString(),
        _atm: this.confirmatm ? this.confirmatm.getValue() || '' : '',
        message: this.getCommunicationConfigurationsValue(config, 'message'),
        promos: this.getCommunicationConfigurationsValue(config, 'promos'),
        userBlock: this.getCommunicationConfigurationsValue(
          config,
          'userBlock',
        ),
        loanExpiration: this.getCommunicationConfigurationsValue(
          config,
          'loanExpiration',
        ),
      });
      const body = response.body;
      const isValid = body.code === API.ResponseCode.OK;
      if (isValid) {
        const {navigation, route} = this.props;
        this.timeoutSuccess = setTimeout(() => {
          this.setState({showValidationModal: false, isLoading: false});
          const returnOptions = route.params && route.params.returnOptions;
          this.isReallyMounted &&
            navigation.navigate('ChangeProfileSuccess', {
              updatedItem: 'phone',
              updatedValue: mobilePhone,
              returnOptions,
            });
        }, 1000);
        return;
      }
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'tryToChange',
        e: ErrorRequest.Default,
      });
    } catch (e) {
      Log.exception(TAG, 'mobileFinish', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'tryToChange',
        e,
      });
    }
    this.setState({isLoading: false});
  };

  render() {
    const {
      isLoading,
      current,
      showValidationModal,
      isSent,
      isValidOTP,
      isLoadingResend,
    } = this.state;
    const {isFocused, navigation} = this.props;

    if (!Features.isAllowedTo('ChangePhone')) {
      return null;
    }
    return (
      <Container>
        <ValidationModal
          ref={ref => {
            this.confirmatm = ref;
          }}
          visible={showValidationModal}
          accessibilityLabel={'changephonescreen_validationmodal'}
          isLoading={isLoading}
          description={L.changephonescreen_validationmodal_description}
          placeholderText={L.changephonescreen_validationmodal_placeholder}
          formatText={Formats.ATMKey}
          type={'atm'}
          onCancel={this.cancelValidationModal}
          onClose={this.cancelValidationModal}
          onSuccess={this.tryToChange}
        />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}>
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Header
                center
                accessibilityLabel={'changephonescreen_header_title'}
                title={L.changephonescreen_header_title}
                style={styles.header}
              />
              <CardView padding>
                {!!current && (
                  <>
                    <SectionHeader
                      accessibilityLabel={
                        'changephonescreen_label_current_phone'
                      }
                      title={L.changephonescreen_text_current_phone}
                    />
                    <Text
                      style={styles.valueText}
                      accessibilityLabel={
                        'changephonescreen_text_current_phone'
                      }>
                      {current}
                    </Text>
                  </>
                )}
                <TextInput
                  labelStyle={styles.label}
                  blurOnSubmit
                  accessibilityLabel={'changephonescreen_textinput_new_phone'}
                  ref={ref => {
                    this.number = ref;
                  }}
                  autoCapitalize={'none'}
                  keyboardType={'phone-pad'}
                  textContentType={'telephoneNumber'}
                  label={
                    !current
                      ? L.changephonescreen_text_phone
                      : L.changephonescreen_text_new_phone
                  }
                  showClearButton={!isSent}
                  editable={!isSent}
                  autoCorrect={false}
                  onSubmitEditing={this.validate}
                  formatText={Formats.CellphoneNumber}
                  returnKeyType={'done'}
                />
              </CardView>
              {isSent && (
                <View style={styles.smsContainer}>
                  <CardView padding>
                    <Text
                      style={styles.subtitleOneTimePassword}
                      accessibilityLabel={'changephonescreen_text_otp'}>
                      {L.changephonescreen_text_otp}{' '}
                      {`(${this.number ? this.number.getValue() : ''})`}
                    </Text>
                    <SMSReader
                      format={Formats.SMSChangePhoneKey}
                      onCheckPermissions={this.onCheckPermissions}
                      onReadCode={this.onReadCode}
                    />
                    <View style={styles.codeContainer}>
                      {!isLoadingResend && (
                        <TextInputCode
                          keyboardType={'numeric'}
                          blurOnSubmit
                          accessibilityLabel={
                            'changephonescreen_textinputcode_otp'
                          }
                          ref={ref => {
                            this.code = ref;
                          }}
                          onChangeTextCustom={this.onChangeCode}
                          formatText={Formats.SMSChangePhoneKey}
                          autoCorrect={false}
                          returnKeyType={'done'}
                        />
                      )}
                      {isLoadingResend && (
                        <Loading size={'large'} color={Colors.primary} />
                      )}
                    </View>
                    <Button
                      accessibilityLabel={'changephonescreen_buttonlink_resend'}
                      typeColor={'accentDark'}
                      loading={isLoadingResend}
                      style={styles.button}
                      light
                      small
                      onPress={this.resendCode}
                      title={L.changephonescreen_buttonlink_resend}
                    />
                  </CardView>
                  <SpacedView style={styles.buttons}>
                    <Button
                      light
                      accessibilityLabel={'changephonescreen_button_back'}
                      onPress={this.goBack}
                      title={L.changephonescreen_button_back}
                    />
                    <Button
                      accessibilityLabel={'changephonescreen_button_save'}
                      onPress={this.showConfirmModal}
                      disabled={!isValidOTP}
                      title={L.changephonescreen_button_save}
                    />
                  </SpacedView>
                </View>
              )}
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'changephonescreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type ChangePhoneScreenType = ChangePhoneScreen;
export default withFocused<ChangePhoneScreen, Props>(ChangePhoneScreen);
