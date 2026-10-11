import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
  ViewProps,
  AppState,
  NativeEventSubscription,
} from 'react-native';
import { Colors, Formats } from '../../resources/constants';
import { Font, Sanitizer, Validate } from '../../resources/functions';
import { L } from '../../resources/language';
import {
  TextInputCode,
  Loading,
  ButtonLink,
  AlertModalUpdate,
  AlertModal,
} from '../ui';
import SMSReader from '../sms/SMSReader';
import Log from '../../resources/log/Log';
import { Emitter } from '../../resources/listeners';
import { AlertEvent } from '../alert/AlertManager';
import API from '../../api';
import { Size } from '../../resources/dimensions';
import AsyncStorage from '@react-native-community/async-storage';
import { AnalyticsLabelsType } from '../../resources/analytics';
import { AnalyticsEvent } from '../../resources/analytics';

const styles = StyleSheet.create({
  containerTextMessage: {
    alignItems: 'flex-start',
    flex: 1,
  } as ViewStyle,
  containerText: {
    alignItems: 'flex-start',
  } as ViewStyle,
  descriptionText: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  textBold: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 14,
    paddingBottom: 20,
  } as TextStyle,
  imageIcon: {
    width: 32,
    height: 32,
    tintColor: Colors.accentDark,
  } as ImageStyle,
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  } as ViewStyle,
  notMyNumber: {
    width: Size.getWidth() * 0.8,
    marginTop: 3,
    padding: 0,
    alignSelf: 'flex-start',
    paddingBottom: 20,
  } as ViewStyle,
  notRecieveMyNumber: {
    marginLeft: Size.getWidth() * 0.01,
    marginTop: 4,
    paddingBottom: 5,
    alignSelf: 'flex-start',
  } as ViewStyle,
  titleNotMyNumber: {
    color: Colors.brown,
    ...Font({ weight: 'Regular', style: 'Italic' }),
  } as TextStyle,
  titleNotReceiveNumber: {
    fontSize: 16,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  inactiveResend: {
    color: Colors.grey4,
    fontSize: 14,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  iconButton: {
    tintColor: Colors.brown,
    width: 16,
    height: 16,
  } as ImageStyle,
  iconButtonCounter: {
    tintColor: Colors.grey4,
    marginLeft: 5,
    width: 6,
    height: 12,
  } as ImageStyle,
  iconResendActivate: {
    tintColor: Colors.primary,
  } as ImageStyle,
  labelResendActivate: {
    color: Colors.primary,
    fontSize: 14,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  notMyNumberModal: {
    color: Colors.grey6,
    fontSize: 16,
    textAlign: 'center',
    ...Font({ weight: 'Regular' }),
    marginBottom: 10,
    lineHeight: 20,
  } as ViewStyle,
  resendNumberModal: {
    color: Colors.grey6,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    ...Font({ weight: 'Regular' }),
    lineHeight: 20,
  } as ViewStyle,
  textActionNotMyNumberModal: {
    color: 'white',
    fontSize: 16,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  viewActionNotMyNumberModal: {
    backgroundColor: Colors.brown,
    borderWidth: 0,
    width: Size.getWidth() * 0.7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
    paddingTop: 0,
  } as ViewStyle,
  resendNumberTitleModal: {
    color: Colors.primary,
    fontSize: 22,
    paddingVertical: 5,
    marginTop: 3,
  } as TextStyle,
  confirmResendStyleActionButtonText: {
    color: 'white',
    fontSize: 16,
  } as TextStyle,
  confirmResendStyleActionButton: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.primary,
  } as ViewStyle,
  confirmResendStyleCancelButton: {
    borderColor: Colors.primary,
    paddingVertical: 8,
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  confirmResendStyleCancelText: {
    color: Colors.primary,
    fontSize: 16,
  } as TextStyle,
  counterStyle: {
    fontSize: 18,
    marginLeft: 10,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  counterImageStyle: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.grey4,
    marginLeft: 5,
    marginRight: 1,
  } as ImageStyle,
  containerCounterStyles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  loadingForResend: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  topOrganizer: {
    flex: 0.2,
    alignItems: 'center',
  } as ViewStyle,
  notMyNumberTitle: {
    marginBottom: 6,
    paddingVertical: 0,
    fontSize: 22,
  } as ViewStyle,
});

export interface ConfirmCodeProps extends ViewProps {
  onResend?: () => Promise<void>;
  refCode?: (ref: TextInputCode | null) => void;
  onChangeText?: (text: string) => void;
  onTimeout?: () => void;
  onPhoneNumber?: (phone: string) => void;
  format?: string;
  phoneNumber?: string;
  autoFocus?: boolean;
  timeoutInvalid?: number;
  showResend?: boolean;
  accessibilityLabel: AnalyticsLabelsType | string | any;
  accessibilityLabelLink?: AnalyticsLabelsType | string | any;
  accessibilityTooltip?: AnalyticsLabelsType | string | any;
  accessibilityAction?: AnalyticsLabelsType | string | any;
  accessibilityLabelModal?: AnalyticsLabelsType | string | any;
  accessibilityErrorInput?: AnalyticsLabelsType | string | any;
}

export interface ConfirmCodeState {
  isAllowedReadSMS: boolean;
  isLoading: boolean;
  focusResend: boolean;
  isLoadingResend: boolean;
  phoneNumber?: string;
  isTimeOuted: boolean;
  timerStart: number;
  isShowModalCancel: boolean;
  resendSMSModal: boolean;
  textLinkResend: string;
  appState: string;
  resendSMSWait: boolean;
}
export interface SMSMessage {
  receivedOtpMessage: () => {};
}
const Timeout = {
  Focus: 60 * 1000,
  TimeStart: 30,
  timerNewCount: 1000,
};
const TAG = '[ConfirmCode]';
export default class ConfirmCode extends React.Component<
  ConfirmCodeProps,
  ConfirmCodeState
> {
  static defaultProps = {
    timeoutInvalid: 3 * 60 * 1000,
    autoFocus: true,
    showResend: true,
    format: Formats.SMSKey,
  };

  state: ConfirmCodeState = {
    isAllowedReadSMS: false,
    isLoading: false,
    focusResend: false,
    isLoadingResend: false,
    isTimeOuted: false,
    timerStart: Timeout.TimeStart,
    isShowModalCancel: false,
    resendSMSModal: false,
    textLinkResend: L.confirmcode_text_resend_title,
    appState: AppState.currentState,
    resendSMSWait: false,
  };

  code!: TextInputCode | null;
  timeoutFocus!: NodeJS.Timeout;
  timeoutSMS!: NodeJS.Timeout;
  timeInterval!: NodeJS.Timeout;

  changeSubscription?: NativeEventSubscription;

  componentDidMount() {
    const { phoneNumber } = this.props;
    if (phoneNumber) {
      this.setState({ phoneNumber });
    } else {
      this.load();
    }
    this.listenTimeoutFocus();
    this.listenTimeoutSMS();
    this.listenTimeInteval();
  }

  saveActualTime = async () => {
    const sec = new Date().getSeconds();
    const min = new Date().getMinutes();
    const suma = (sec + min * 60).toString();
    await AsyncStorage.setItem('tiempoActual', suma);
  };
  timeExpired = async () => {
    const startTime = await AsyncStorage.getItem('tiempoActual');
    if (startTime == null) {
      return;
    }
    const sec = new Date().getSeconds();
    const min = new Date().getMinutes();
    const actualTime = sec + min * 60;
    const diff = actualTime - parseInt(startTime);
    if (diff > 3) {
      this.setState({ timerStart: this.state.timerStart - diff });
    }
  };

  componentWillUnmount() {
    this.clearTimeoutFocus();
    this.clearTimeoutSMS();
    this.clearTimeInterval();
  }

  resend = async () => {
    /**
     * aqui se verifica phoneNumber de props y no de state
     * porque solo cuando no se ingrese en prop es necesario pedirlo
     */
    // AnalyticsEvent.track(A.instantcashshortconfirmscreen_text_resend_sms_modal, L.confirmcode_alertmodal_resend_actionbutton)
    const { accessibilityLabelModal } = this.props;
    if (accessibilityLabelModal !== undefined) {
      const label = accessibilityLabelModal + '_rsend';
      AnalyticsEvent.track(label, L.confirmcode_alertmodal_resend_actionbutton);
    }

    const { onResend, phoneNumber } = this.props;
    if (typeof onResend !== 'function') {
      return;
    }
    this.setState({ resendSMSWait: true });
    setTimeout(() => {
      this.closeResendModalSMS();
    }, 100);

    this.code && this.code.setValue('');
    this.blur();
    this.clearTimeoutFocus();
    this.clearTimeoutSMS();

    this.setState({ isLoadingResend: true, isTimeOuted: false });

    await onResend();

    !phoneNumber && this.loadProfile();

    this.setState({ isLoadingResend: false });

    this.focusIfAllowed();
    this.listenTimeoutFocus();
    this.listenTimeoutSMS();

    this.setState({
      resendSMSWait: false,
      timerStart: Timeout.TimeStart,
      textLinkResend: L.confirmcode_text_resend_title,
    });
  };

  onBlur = () => {
    const { isLoadingResend, isTimeOuted } = this.state;
    if (isLoadingResend) {
      this.code && this.code.clearError();
    }
    if (isTimeOuted) {
      this.code && this.code.setError(L.confirmcode_error_timeout);
    }
  };
  blur = () => {
    this.code && this.code.blur();
  };
  clearTimeoutFocus = () => {
    this.timeoutFocus && clearTimeout(this.timeoutFocus);
  };

  clearTimeoutSMS = () => {
    this.timeoutSMS && clearTimeout(this.timeoutSMS);
  };
  clearTimeInterval = () => {
    this.saveActualTime();
    // AppState.removeEventListener('change', this._handleAppStateChange);
    this.changeSubscription &&  this.changeSubscription.remove();
    this.timeInterval && clearInterval(this.timeInterval);
  };

  listenTimeoutFocus = () => {
    this.clearTimeoutFocus();
    this.timeoutFocus = setTimeout(() => {
      this.setState({ focusResend: true });
    }, Timeout.Focus);
  };
  listenTimeInteval = () => {
    this.changeSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    this.timeInterval = setInterval(() => {
      this.setState({ timerStart: this.state.timerStart - 1 });
    }, Timeout.timerNewCount);
  };

  listenTimeoutSMS = () => {
    const { timeoutInvalid, onTimeout } = this.props;
    this.clearTimeoutSMS();
    this.timeoutSMS = setTimeout(() => {
      this.code && this.code.setError(L.confirmcode_error_timeout);
      this.setState({ isTimeOuted: true });
      const { onChangeText } = this.props;
      typeof onChangeText === 'function' && onChangeText('');
      typeof onTimeout === 'function' && onTimeout();
      this.setState({
        textLinkResend: L.confirmcode_error_timeout_resend_label,
        timerStart: 0,
      });
    }, timeoutInvalid);
  };

  onChangeText = (value: string) => {
    this.clearTimeoutFocus();
    this.setState({ focusResend: false });
    const { onChangeText } = this.props;
    typeof onChangeText === 'function' && onChangeText(value);
    const { isTimeOuted } = this.state;
    if (isTimeOuted) {
      this.code && this.code.setError(L.confirmcode_error_timeout);
    }
  };

  load = async () => {
    const { isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    this.loadProfile();
    this.setState({ isLoading: false });
  };
  loadProfile = async () => {
    const { onPhoneNumber } = this.props;

    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadProfile', response);
      }
      const user = response.body.data;
      this.setState({ phoneNumber: user.mobilePhone });
      typeof onPhoneNumber === 'function' && onPhoneNumber(user.mobilePhone);
    } catch (e) {
      Log.exception(TAG, 'loadProfile', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadProfile',
        e,
      });
    }
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
    const { autoFocus } = this.props;
    const { isAllowedReadSMS } = this.state;
    !isAllowedReadSMS && autoFocus && this.focus();
  };
  onReadCode = (code: string) => {
    Log.debug(TAG, 'onReadCode');
    this.code && this.code.setValue(code);
  };

  isValid = (showError = true) => {
    const { isTimeOuted } = this.state;
    if (isTimeOuted) {
      return false;
    }
    if (showError) {
      if (this.code) {
        return this.code.isValid();
      }
      return false;
    }
    const { format } = this.props;
    const value = this.code ? this.code.getValue() : '';
    const error = Validate.validateFormat(value, format);
    return !error;
  };

  setValue = (value: string) => {
    this.code && this.code.setValue(value);
  };

  getValue = () => {
    return this.code ? this.code.getValue() : '';
  };

  setCodeError = (error: string) => {
    const { accessibilityLabel } = this.props;
    let paramErrorModal;
    if (accessibilityLabel) {
      paramErrorModal = accessibilityLabel + '_error';
      try {
        (error || '').includes('usado')
          ? null
          : AnalyticsEvent.track(paramErrorModal, L.confirmcode_error_invalid);
      } catch (error) {
        Log.debug(TAG, 'onAlert', error);
      }
    }

    const errorCode = (error || '').includes('usado')
      ? L.confirmcode_error_used
      : L.confirmcode_error_invalid;
    this.code && this.code.setError(errorCode);
  };

  buttonLinkCounter = (
    label: string,
    counter: number
  ): React.ReactNode[] | React.ReactNode => {
    return !this.state.resendSMSWait ? (
      <View style={styles.containerCounterStyles}>
        <Text
          style={
            counter <= 0 ? styles.labelResendActivate : styles.inactiveResend
          }
        >
          {label}
          {counter > 0 && (
            <Text style={styles.counterStyle}>
              {'  '}
              {counter}
              {'s'}
            </Text>
          )}
        </Text>
        {counter > 0 && (
          <Image
            source={require('../../assets/images/icon-clock.png')}
            style={styles.counterImageStyle}
          />
        )}
      </View>
    ) : (
      <View style={styles.loadingForResend}>
        <Loading color={Colors.grey4} margin={'small'} />
      </View>
    );
  };

  notMyNumber = () => {
    const { accessibilityTooltip } = this.props;
    AnalyticsEvent.track(accessibilityTooltip, L.confirmcode_no_is_my_number);
    this.setState({ isShowModalCancel: true });
  };

  closeModalCancel = () => {
    const { accessibilityAction } = this.props;
    AnalyticsEvent.track(
      accessibilityAction,
      L.confirmcode_alertmodal_actionbutton
    );
    this.setState({ isShowModalCancel: false });
  };

  notReceiveSMSCode = () => {
    const { accessibilityLabelLink } = this.props;
    const { textLinkResend } = this.state;
    if (accessibilityLabelLink !== undefined)
      AnalyticsEvent.track(accessibilityLabelLink, textLinkResend);
    if (this.state.timerStart > 0) {
      return;
    } else {
      const { accessibilityLabelModal } = this.props;
      if (accessibilityLabelModal !== undefined)
        AnalyticsEvent.track(
          accessibilityLabelModal,
          L.confirmcode_title_resend_code_modal
        );
    }
    this.setState({ resendSMSModal: true });
  };

  closeResendModalSMS = () => {
    this.setState({ resendSMSModal: false });
  };

  closeResendModal = () => {
    const { accessibilityLabelModal } = this.props;
    if (accessibilityLabelModal !== undefined) {
      const label = accessibilityLabelModal + '_cancel';
      AnalyticsEvent.track(label, L.confirmcode_alertmodal_cancel_actionbutton);
    }
    this.closeResendModalSMS();
  };

  _handleAppStateChange = (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.timeExpired();
    } else {
      this.saveActualTime();
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    const {
      onResend,
      refCode,
      style,
      format,
      timeoutInvalid,
      showResend,
      accessibilityLabel,
      accessibilityLabelLink,
      accessibilityErrorInput,
      ...props
    } = this.props;
    const { isLoading, isLoadingResend, phoneNumber } = this.state;

    if (isLoading) {
      return (
        <View accessibilityLabel={'confirmcode'} style={style} {...props}>
          <Loading margin={'large'} />
        </View>
      );
    }
    /**
     * Para mostrar la duración en hora, minutos, o segundos
     * Se pueden usar asHours, asMinutes, asSeconds, etc.
     * https://momentjs.com/docs/#/durations/
     */

    return (
      <View accessibilityLabel={'confirmcode'} style={style} {...props}>
        <View style={styles.infoContainer}>
          <AlertModalUpdate
            title={L.confirmcode_no_is_my_number}
            message={L.confirmcode_sugest_for_update}
            messageStyle={styles.notMyNumberModal}
            visible={this.state.isShowModalCancel}
            titleStyle={styles.notMyNumberTitle}
            actionButton={{
              accessibilityLabel: 'confirmcode_alertmodal_actionbutton',
              title: L.confirmcode_alertmodal_actionbutton,
              preventClose: true,
              onPress: this.closeModalCancel,
              textStyle: styles.textActionNotMyNumberModal,
              light: true,
              style: styles.viewActionNotMyNumberModal,
            }}
            onClose={this.closeModalCancel}
          />

          <AlertModal
            title={L.confirmcode_title_resend_code_modal}
            message={L.confirmcode_bodyText_resend_code_modal}
            imgNeedTint={true}
            visible={this.state.resendSMSModal}
            messageStyle={styles.resendNumberModal}
            titleStyle={styles.resendNumberTitleModal}
            icon={require('../../assets/images/icon-resendOtp.png')}
            actionButton={{
              accessibilityLabel: 'confirmcode_alertmodal_resend_actionbutton',
              title: L.confirmcode_alertmodal_resend_actionbutton,
              preventClose: true,
              onPress: this.resend,
              textStyle: styles.confirmResendStyleActionButtonText,
              style: styles.confirmResendStyleActionButton,
            }}
            cancelButton={{
              accessibilityLabel: 'confirmcode_alertmodal_cancel_actionbutton',
              title: L.confirmcode_alertmodal_cancel_actionbutton,
              preventClose: true,
              onPress: this.closeResendModal,
              textStyle: styles.confirmResendStyleCancelText,
              style: styles.confirmResendStyleCancelButton,
            }}
            onClose={this.closeResendModalSMS}
          />
          <View style={styles.topOrganizer}>
            <Image
              style={styles.imageIcon}
              source={require('../../assets/images/icon-phone-otp.png')}
            />
          </View>
          <View style={styles.containerTextMessage}>
            <View style={styles.containerText}>
              <Text
                selectable
                accessibilityLabel={'confirmcode_text_code'}
                style={styles.descriptionText}
              >
                {L.confirmcode_text_code_description_part1}{' '}
                <Text style={styles.textBold}>
                  {L.confirmcode_text_code_description_part2}{' '}
                </Text>
                {L.confirmcode_text_code_description_part3}
                {!!phoneNumber && (
                  <Text
                    selectable
                    accessibilityLabel={'confirmcode_text_codenumber'}
                    style={styles.textBold}
                  >
                    {' '}
                    {Sanitizer.maskPhone(phoneNumber)}
                    {'.'}
                  </Text>
                )}{' '}
              </Text>
              <ButtonLink
                accent={'accentDark'}
                // accessibilityLabel={'confirmcode_no_is_my_number_enroll'}
                accessibilityLabel={accessibilityLabel}
                style={styles.notMyNumber}
                titleStyle={styles.titleNotMyNumber}
                onPress={this.notMyNumber}
                title={L.confirmcode_no_is_my_number}
                imageSource={require('../../assets/images/help-icon.png')}
                imagePosition={'right'}
                imageStyle={styles.iconButton}
              />
            </View>
          </View>
        </View>
        <SMSReader
          format={format}
          onCheckPermissions={this.onCheckPermissions}
          onReadCode={this.onReadCode}
        />
        <TextInputCode
          returnKeyType={'done'}
          keyboardType={'numeric'}
          accessibilityLabel={'confirmcode_textinputcode_otp'}
          accessibilityErrorInput={accessibilityErrorInput}
          ref={ref => {
            this.code = ref;
          }}
          editable={!isLoadingResend}
          onChangeText={this.onChangeText}
          formatText={format}
          onBlur={this.onBlur}
          blurOnSubmit
          autoCorrect={false}
        />

        {showResend && (
          <ButtonLink
            accent={'accentDark'}
            accessibilityLabel={accessibilityLabelLink}
            style={styles.notRecieveMyNumber}
            titleStyle={styles.titleNotReceiveNumber}
            onPress={this.notReceiveSMSCode}
            titleComponent={this.buttonLinkCounter(
              this.state.textLinkResend,
              this.state.timerStart
            )}
            imageSource={
              !this.state.resendSMSWait &&
              require('../../assets/images/arrow-icon.png')
            }
            imagePosition={'right'}
            imageStyle={[
              styles.iconButtonCounter,
              this.state.timerStart <= 0 && styles.iconResendActivate,
            ]}
          />
        )}
      </View>
    );
  }
}
