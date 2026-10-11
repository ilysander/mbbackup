import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ViewStyle,
  InteractionManager,
} from 'react-native';
import API from '../../api';
import InfoContact from '../../components/info/InfoContact';
import NetworkManager from '../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  CardView,
  TextInput,
} from '../../components/ui';
import { ErrorRequest, TypeInitialStart } from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import { AlertEvent } from '../../components/alert/AlertManager';
import ConfirmCode from '../../components/sms/ConfirmCode';
import Config from '../../Config';
import Features from '../../resources/remote/Features';
import {
  LoginWithSecondFactorAndPasswordStep1MobileResponse,
  LoginWithSecondFactorAndPasswordStep2MobileResponse,
  SelectEnvironmentResponse,
} from '../../api/backend/response/Session';
import { RequestError } from '../../resources/error';
import ExternalApi from '../../api/backend/ExternalApi';
import Session from '../../api/Session';
import { InitialAppScreen } from '../../resources/initialAppScreen';
import { A, AnalyticsEvent } from '../../resources/analytics';
import { Validate } from '../../resources/functions';
import { MaskType } from '../../resources/persistence/models/MaskModel';
import { MaskService } from '../../resources/persistence';
import DeviceInfo from '../../resources/deviceset/DeviceInfo';
import TransactionSessionId from '../../resources/idTransaction/idTransaction';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  sendButton: {
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
  headerTrace: {
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
});

const TAG = '[EnrollmentSMSScreen]';

export interface Params {
  password: string;
  captcha: string;
  keyboardToken: string;
  document: string;
  phoneNumber: string;
  isSaveCard: boolean;
  cardNumber: string;
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
  header: string;
}

class EnrollmentSMSScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions = {
  //   title: L.enrollment_title,
  //   gesturesEnabled: false,
  // };

  state: State = {
    isLoading: false,
    isValid: false,
    allowSubmit: false,
    showResend: !Features.isAllowedTo('Captcha'),
    exchangeTokenResend: '',
    pressResend: false,
    header: '',
  };

  code!: ConfirmCode | null;
  interaction!: any;
  timeoutMinimal!: any;
  intervalAllow!: any;
  trace!: any | null;

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

  tryToSubmit = () => {
    this.blur();
    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      const isValid = this.isValid();
      if (!isValid) {
        return;
      }
      this.setState({ isLoading: true });
      await this.submit();
      this.setState({ isLoading: false });
    });
  };

  selectEnvironment = async (
    data: LoginWithSecondFactorAndPasswordStep2MobileResponse
  ) => {
    Log.debug(TAG, 'selectEnvironment', 'API.Session.selectEnvironment');
    const response = await API.Session.selectEnvironment(
      data._exchangeToken,
      '-1'
    );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      throw new RequestError(TAG, 'selectEnvironment', body.message);
    }
    const previousLoginInfo = body.data.previousLoginInfo;
    if (previousLoginInfo === null || previousLoginInfo === undefined) {
      ExternalApi.updateToken(body.data.username);
    } else {
      ExternalApi.updateToken(previousLoginInfo.idUser);
    }
    return body;
  };

  acceptGeneralConditions = async (data: SelectEnvironmentResponse) => {
    Log.debug(
      TAG,
      'acceptGeneralConditions',
      'API.Session.acceptGeneralConditions'
    );
    const response = await API.Session.acceptGeneralConditions(
      data._exchangeToken || data._accessToken,
      true
    );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      throw new RequestError(TAG, 'acceptGeneralConditions', body.message);
    }
    return body;
  };

  isSavedCard = () => {
    const { route } = this.props;
    const savedDoc = route.params && route.params.isSaveCard;
    return savedDoc;
  };

  submit = async () => {
    const remember = this.isSavedCard().toString();
    this.trace && (await this.trace.incrementMetric('submit', 1));
    const success = await this.signInApi();
    if (success) {
      this.trace && this.trace.incrementMetric('OkResponse', 1);
      this.setState({ isLoading: false }, () => {
        AnalyticsEvent.track(A.signin_success_enroll_sms, {
          remember,
          method: 'app',
        });
        this.props.navigation.navigate('App');
      });

      return;
    } else {
      this.setState({ isLoading: false });
    }
  };

  signInApi = async () => {
    const bodyStep1 = await this.loginWithSecondFactorAndPasswordStep1();
    if (!bodyStep1.data.hasSelectedSecuritySeal) {
      return false;
    }
    const bodyStep2 = await this.loginWithSecondFactorAndPasswordStep2(
      bodyStep1.data
    );
    const bodyEnvironment = await this.selectEnvironment(bodyStep2.data);
    let accessToken = bodyEnvironment.data._accessToken;
    if (!accessToken) {
      const bodyGeneralConditions = await this.acceptGeneralConditions(
        bodyEnvironment.data
      );
      accessToken = bodyGeneralConditions.data._accessToken;
    }
    const activeEnvironment =
      bodyEnvironment.data.environments[
      bodyEnvironment.data.activeIdEnvironment
      ];
    Session.setActiveEnvironment(activeEnvironment);
    await Session.onboardingSave(TypeInitialStart.SignIn);
    InitialAppScreen.InitialAppScreen = TypeInitialStart.SignIn;
    TransactionSessionId.idTransaction = bodyStep2.idTransaction;
    await Session.save(accessToken);
    return true;
  };

  loginWithSecondFactorAndPasswordStep1 = async () => {
    Log.debug(
      TAG,
      'loginWithSecondFactorAndPasswordStep1',
      'API.Session.loginWithSecondFactorAndPasswordStep1Mobile'
    );
    const { route } = this.props;
    const code = this.code ? this.code.getValue() : '';

    const document = route.params && route.params.document;

    const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
    const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
    const deviceId = await deviceInfoRaw.deviceId;

      const deviceInfo = {
        ...deviceInfoRaw,
        physicalDeviceId,
        deviceId
      }
    const deviceDate = DeviceInfo.deviceDate();
    const userInfo = DeviceInfo.userInfoLoad(document);
    const accessInfo = { otpCode: code };
    const response = await API.Session.loginWithSecondFactorAndPasswordStepDNI2Mobile(
      deviceInfo,
      userInfo,
      accessInfo,
      deviceDate
    );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    const header = JSON.stringify(response.headers);
    this.setState({ header: header });
    if (!isValid) {
      this.setState({ isLoading: false });
      this.code && this.code.setCodeError(L.enrollment_sms_error_code);
    }

    const isSaveCard = this.isSavedCard();
    if (isSaveCard) {
      const docSaved = Validate.createMasked(document, 2, MaskType.DOCUMENT);
      try {
        await MaskService.create(docSaved);
      } catch (e) {
        Log.warn(TAG, 'loginWithSecondFactorAndPasswordStep1', e);
      }
    }
    if (!body.data.hasSelectedSecuritySeal) {
      this.setState({ isLoading: false }, () => {
        this.props.navigation.navigate('SecuritySeal', { data: body.data });
      });
    }
    this.code && this.code.clearTimeoutSMS();
    return body;
  };

  loginWithSecondFactorAndPasswordStep2 = async (
    data: LoginWithSecondFactorAndPasswordStep1MobileResponse
  ) => {
    Log.debug(
      TAG,
      'loginWithSecondFactorAndPasswordStep2',
      'API.Session.loginWithSecondFactorAndPasswordStep2Mobile'
    );
    const response = await API.Session.loginWithSecondFactorAndPasswordStep2Mobile(
      data._exchangeToken,
      ''
    );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      throw new RequestError(
        TAG,
        'loginWithSecondFactorAndPasswordStep2',
        body.message
      );
    }
    return body;
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
    }, Config.settings.timeoutMinimalEnrollment);
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
    this.props.navigation.pop();
    return true;
  };

  onReadCode = (code: string) => {
    Log.debug(TAG, 'onReadCode');
    this.code && this.code.setValue(code);
  };

  onChangeCode = () => {
    this.isValid(false);
  };

  onResend = async () => {
    try {
      const { route } = this.props;

      const password = route.params && route.params.password;
      const captcha = route.params && route.params.captcha;
      const keyboardToken = route.params && route.params.keyboardToken;
      const document = route.params && route.params.document;
      const cardNumber = route.params && route.params.cardNumber;

      const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
      const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
      const deviceId = await deviceInfoRaw.deviceId;
  
        const deviceInfo = {
          ...deviceInfoRaw,
          physicalDeviceId,
          deviceId
        }
      const deviceDate = DeviceInfo.deviceDate();
      const userInfo = DeviceInfo.userInfoLoad(document);

      const response = await API.Session.loginWithSecondFactorAndPasswordStepDNI1EnrollmentMobile(
        cardNumber,
        password,
        captcha,
        keyboardToken,
        deviceInfo,
        userInfo,
        deviceDate
      );
      const body = response.body;
      const isValid = body.code === API.ResponseCode.OK;
      const header = JSON.stringify(response.headers);
      this.setState({ header: header });
      if (isValid) {
        this.setState({
          pressResend: true,
        });
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

  render() {
    const { isLoading, isValid, header } = this.state;
    const { isFocused, navigation, route } = this.props;

    const phoneNumber = route.params && route.params.phoneNumber;


    return (
      <Container>
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
                accessibilityLabel={'enrollmentsmsscreen_header_data'}
                style={styles.header}
                title={L.enrollmentsmsscreen_header_title}
              />
              <CardView padding>
                <ConfirmCode
                  phoneNumber={phoneNumber}
                  accessibilityLabel={'enrollmentsmsscreen_textinputcode_otp'}
                  showResend={this.state.showResend}
                  autoFocus={false}
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  timeoutInvalid={Config.settings.timeoutEnrollmentSMS}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <View style={styles.sendButton}>
                <Button
                  allowOnPress
                  accessibilityLabel={'enrollmentsmsscreen_button_continue'}
                  loading={isLoading}
                  disabled={!isValid}
                  title={L.enrollmentsmsscreen_button_continue}
                  onPress={this.tryToSubmit}
                />
              </View>
              {Config.features.HeaderTraceEnabled && (
                <TextInput
                  label={L.header_trace}
                  value={header}
                  accessibilityLabel={'signinscreen_textinput_header_trace'}
                  containerStyle={styles.headerTrace}
                />
              )}
            </Content>
            <Content vertical={false}>
              <InfoContact
                navigate={navigation.navigate}
                accessibilityLabel={'enrollmentsmsscreen_infocontact'}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type EnrollmentSMSScreenType = EnrollmentSMSScreen;
export default withFocused<EnrollmentSMSScreen, Props>(EnrollmentSMSScreen);
