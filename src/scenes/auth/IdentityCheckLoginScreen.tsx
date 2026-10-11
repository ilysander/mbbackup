import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  ScrollView,
  ImageStyle,
  TextStyle,
  BackHandler,
  Platform,
} from 'react-native';
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
  FacephiButton,
  TextInput,
} from '../../components/ui';
import Config from '../../Config';
import { Size } from '../../resources/dimensions';
import { L } from '../../resources/language';
import { Font, Validate } from '../../resources/functions';
import {
  Colors,
  ErrorRequest,
  BiometricConst,
  TypeInitialStart,
} from '../../resources/constants';
import { Log } from '../../resources/log';
import { Emitter } from '../../resources/listeners';
import { AlertEvent } from '../../components/alert/AlertManager';
import { KeyboardUtil } from '../../resources/util';
import API from '../../api';
import { ErrorRequestItem } from '../../resources/constants/ErrorRequest';
import DeviceInfo from '../../resources/deviceset/DeviceInfo';
import { RequestError, RequestErrorCheck } from '../../resources/error';
import {
  LoginWithSecondFactorAndPasswordStep1MobileResponse,
  LoginWithSecondFactorAndPasswordStep2MobileResponse,
  SelectEnvironmentResponse,
} from '../../api/backend/response/Session';
import ExternalApi from '../../api/backend/ExternalApi';
import Session from '../../api/Session';
import { InitialAppScreen } from '../../resources/initialAppScreen';
import TransactionSessionId from '../../resources/idTransaction/idTransaction';
import { MaskType } from '../../resources/persistence/models/MaskModel';
import { MaskService } from '../../resources/persistence';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnalyticsEvent } from '../../resources/analytics';
import RNSelphID from 'react-native-selph-id';
import RNSelphi from 'react-native-selphi';
import * as WidgetSelphiEnums from 'react-native-selphi/ts/WidgetSelphiEnums';
import { WidgetSelphiConfiguration } from 'react-native-selphi/ts/WidgetSelphiConfigurations';
import * as WidgetSelphidEnums from 'react-native-selph-id/ts/WidgetSelphidEnums';
import {
  WidgetSelphidConfiguration,
  SelphIDResult,
} from 'react-native-selph-id/ts/WidgetSelphidConfiguration';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
    marginBottom: 40,
  } as ViewStyle,
  networkStatus: {
    marginTop: 0,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  subtitleHeader: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 18,
    ...Font(),
  } as TextStyle,
  cardView: {
    marginBottom: 20,
    borderRadius: 8,
  } as ViewStyle,
  title: {
    fontSize: 28,
    lineHeight: 38,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  icon: {
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.grey4,
    width: 6,
    marginLeft: 16,
  } as ImageStyle,
  headerTrace: {
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  validationButton: {
    fontSize: 16,
  } as ViewStyle,
});

const TAG = '[IdentityCheckLoginScreen]';
export interface Props extends NativeStackScreenProps<any, any> {}
export interface State {
  isLoading: boolean;
  isValid: boolean;
  liveToken: string;
  frontDniImage: string;
  backDniImage: string;
  selfieDniImage: string;
  doiOCRTokenFront: string;
  doiOCRTokenBack: string;
  selfie: string;
  doiFaceToken: string;
  selfieTemplate: string;
  credentialsReady: boolean;
  activeBackButton: boolean;
  activeLiveButton: boolean;
  header: string;
}

class IdentityCheckLoginScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions = ({
  //   navigation,
  // }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
  //   title: L.identitycheckloginscreen_title,
  //   gesturesEnabled: false,
  //   headerLeft: (
  //     <BackIcon
  //       onPress={() => {
  //         navigation.navigate('EnrollmentBlockAd');
  //       }}
  //     />
  //   ),
  // });

  state: State = {
    isLoading: false,
    isValid: false,
    frontDniImage: '',
    liveToken: '',
    backDniImage: '',
    selfieDniImage: '',
    doiOCRTokenFront: '',
    doiOCRTokenBack: '',
    doiFaceToken: '',
    selfie: '',
    selfieTemplate: '',
    credentialsReady: false,
    activeBackButton: false,
    activeLiveButton: false,
    header: '',
  };
  interaction!: any;
  scroll!: ScrollView | null;

  credentialsReady = () => {
    const { liveToken, doiOCRTokenFront, doiOCRTokenBack } = this.state;
    const liveIsValid = !!liveToken;
    const frontTokIsValid = !!doiOCRTokenFront;
    const backTokIsValid = !!doiOCRTokenBack;
    const credentialsReady = [
      frontTokIsValid,
      backTokIsValid,
      liveIsValid,
    ].every(value => value);
    this.setState({ credentialsReady });
  };

  blur = async () => {
    KeyboardUtil.hide();
  };

  tryToSubmit = async () => {
    // const { credentialsReady } = this.state;
    // if (credentialsReady) {
    //   this.blur();
    //   this.interaction && this.interaction.cancel();
    //   this.interaction = InteractionManager.runAfterInteractions(async () => {
    //     this.setState({ isLoading: true });
    await this.submit();
    //     this.setState({ isLoading: false });
    //   });
    // }
  };

  submit = async () => {
    try {
      const { selfie, selfieTemplate, doiOCRTokenBack, doiFaceToken } =
        this.state;
      const { navigation, route } = this.props;

      const document = route.params && route.params.document;
      const idTransaction = route.params && route.params.idTransaction;

      const deviceInfoRaw = DeviceInfo.deviceInfoLoadWoDevId();
      const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;

      const deviceInfo = {
        ...deviceInfoRaw,
        physicalDeviceId,
      };
      const documentNumber = document;
      const deviceDate = new Date().toISOString();
      const _selfieTemplate = selfieTemplate;
      const _doiFaceToken = doiFaceToken;
      const _doiOCRToken = doiOCRTokenBack;
      const _selfie = selfie;
      const response = await API.Session.enrollmentUpdateDeviceByBio(
        idTransaction,
        deviceInfo,
        documentNumber,
        deviceDate,
        _selfie,
        _selfieTemplate,
        _doiFaceToken,
        _doiOCRToken,
      );
      const body = response.body;
      const isValid = body.code === API.ResponseCode.OK;

      this.writeTrace('UpdateDevice', response);
      if (isValid) {
        this.blur();
        const success = await this.tryToLogin();
        if (success) {
          this.setState({ isLoading: false }, () => {
            navigation.navigate('App');
          });
          return;
        } else {
          this.setState({ isLoading: false });
        }
        return;
      } else {
        if (body.code == API.ResponseCode.ENROLLMENTBLACK) {
          this.props.navigation.navigate('EnrollmentBlackList');
        } else {
          this.props.navigation.navigate('EnrollmentBlockVal', {
            statusCode: body.statusCode,
          });
        }
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

  writeTrace(nameTrace: string, response: any) {
    const printHeader = JSON.stringify(response);
    const header = this.state.header + nameTrace + printHeader;
    this.setState({ header: header });
  }

  cleanState = () => {
    this.setState({
      isLoading: false,
      isValid: false,
      frontDniImage: '',
      liveToken: '',
      backDniImage: '',
      selfieDniImage: '',
      doiOCRTokenFront: '',
      doiOCRTokenBack: '',
      doiFaceToken: '',
      selfie: '',
      selfieTemplate: '',
      credentialsReady: false,
      activeBackButton: false,
      activeLiveButton: false,
    });
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillunmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  goToLogin = async () => {
    this.props.navigation.pop();
  };

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    this.goToLogin();
    return true;
  };

  getCaptureDocConfiguration = (): WidgetSelphidConfiguration => {
    const docConf: WidgetSelphidConfiguration = {
      debug: false,
      fullscreen: true,
      locale: BiometricConst.languaje.spanish,
      showResultAfterCapture: true,
      showTutorial: false,
      scanMode: WidgetSelphidEnums.WidgetScanMode.Search,
      specificData: BiometricConst.countryDocCode.per,
      documentType: WidgetSelphidEnums.WidgetDocumentType.IdCard,
    };
    return docConf;
  };

  getSelphiConfiguration = (): WidgetSelphiConfiguration => {
    const selphiConf: WidgetSelphiConfiguration = {
      debug: false,
      fullscreen: true,
      locale: BiometricConst.languaje.spanish,
      crop: false,
      stabilizationMode: true,
      cropPercent: 1.0,
      enableImages: false,
      livenessMode: WidgetSelphiEnums.WidgetLivenessMode.PassiveMode,
      frontalCameraPreferred: true,
      tutorial: false,
    };
    return selphiConf;
  };

  onValidationStart = (typeOfValidation: string) => {
    const { doiOCRTokenFront } = this.state;
    switch (typeOfValidation) {
      case WidgetSelphidEnums.WidgetOperation.Front:
        this.captureDocument(WidgetSelphidEnums.WidgetOperation.Front, '');
        break;
      case WidgetSelphidEnums.WidgetOperation.Back:
        this.captureDocument(
          WidgetSelphidEnums.WidgetOperation.Back,
          doiOCRTokenFront,
        );
        break;
      case BiometricConst.testMode.liveness:
        this.makeSelphi();
        break;
    }
  };

  captureDocument = async (
    typeOfValidation: WidgetSelphidEnums.WidgetOperation,
    doiOCRToken: string,
  ) => {
    let license =
      Platform.OS === 'ios'
        ? JSON.stringify(Config.facephiIosLicence)
        : JSON.stringify(Config.facephiAndroidLicence);

    try {
      const result: SelphIDResult = (await RNSelphID.startCapture(
        typeOfValidation,
        BiometricConst.libs.documentZip,
        license,
        doiOCRToken,
        this.getCaptureDocConfiguration(),
      )) as SelphIDResult;

      this.processResultCaptureDocument(result, typeOfValidation);
    } catch (error: any) {
      Log.debug(TAG, 'captureDocument', error);
      this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
    }
  };

  saveDocData = (typeOfValidation: string, data: any) => {
    switch (typeOfValidation) {
      case BiometricConst.testMode.frontDoc:
        AnalyticsEvent.trackScreen('IdentityCheckLoginDniFrontFinal');
        this.setState({
          frontDniImage: data.frontDocumentImage,
          activeBackButton: true,
          doiOCRTokenFront: data.tokenOCR,
          doiFaceToken: data.tokenFaceImage,
        });
        AnalyticsEvent.trackScreen('IdentityCheckLoginDniBack');
        break;
      case BiometricConst.testMode.backDoc:
        AnalyticsEvent.trackScreen('IdentityCheckLoginDniBackFinal');
        this.setState({
          backDniImage: data.backDocumentImage,
          activeLiveButton: true,
          doiOCRTokenBack: data.tokenOCR,
        });
        AnalyticsEvent.trackScreen('IdentityCheckLoginLive');
        break;
    }
  };

  launchError = (e: ErrorRequestItem, typeOfValidation: string) => {
    this.cleanData(typeOfValidation);
    Emitter.emit<AlertEvent>('onAlert', {
      tag: TAG,
      method: 'launchError',
      e: e,
    });
  };

  cleanData = (typeOfValidation: string) => {
    if (typeOfValidation === 'mode_selfie') {
      this.setState({
        selfieDniImage: '',
        liveToken: '',
        selfie: '',
        selfieTemplate: '',
      });
    } else {
      this.setState({
        frontDniImage: '',
        activeBackButton: false,
        doiOCRTokenFront: '',
        doiFaceToken: '',
        backDniImage: '',
        doiOCRTokenBack: '',
      });
    }
  };

  processResultCaptureDocument(
    result: SelphIDResult,
    typeOfValidation: string,
  ) {
    switch (result.finishStatus) {
      case WidgetSelphidEnums.WidgetFinishStatus.Ok:
        this.saveDocData(typeOfValidation, result);
        break;
      case WidgetSelphidEnums.WidgetFinishStatus.Error:
        if (
          result.errorType ===
          WidgetSelphidEnums.WidgetErrorType.CameraPermissionDenied
        ) {
          this.launchError(ErrorRequest.PermissionBiometric, typeOfValidation);
        } else {
          this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
        }
        break;
      case WidgetSelphidEnums.WidgetFinishStatus.CancelByUser:
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'launchError',
          e: ErrorRequest.DefaultBiometric,
        });
        break;
      default:
        this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
        break;
    }
  }

  makeSelphi = async () => {
    const typeOfValidation = 'mode_selfie';
    try {
      const result = await RNSelphi.startExtraction(
        BiometricConst.libs.selphiZip,
        this.getSelphiConfiguration(),
      );
      AnalyticsEvent?.trackScreen('IdentityCheckSignupLiveFinal');
      this.processResultLiveness(result, typeOfValidation);
    } catch (error: any) {
      this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
      Log.error(TAG, 'makeSelphi', error);
    }
  };

  processResultLiveness(result: any, typeOfValidation: string) {
    const data = result;
    const limitGlassesScore = 0.3;
    switch (parseInt(data.finishStatus, 10)) {
      case WidgetSelphiEnums.WidgetFinishStatus.Ok:
        if (data.eyeGlassesScore < limitGlassesScore) {
          AnalyticsEvent.trackScreen('IdentityCheckLoginResumen');
          this.setState({
            selfieDniImage: data.bestImageCropped,
            liveToken: '3',
            selfie: data.bestImage,
            selfieTemplate: data.templateRaw,
          });
          this.credentialsReady();
        } else {
          this.launchError(ErrorRequest.BlockObject, typeOfValidation);
        }
        return;
      case WidgetSelphiEnums.WidgetFinishStatus.Error:
        if (data.errorType) {
          switch ((data.errorType, 10)) {
            case WidgetSelphiEnums.WidgetErrorType.CameraPermissionDenied:
              this.launchError(
                ErrorRequest.PermissionBiometric,
                typeOfValidation,
              );
              break;
            case WidgetSelphiEnums.WidgetErrorType.HardwareError:
              this.launchError(ErrorRequest.LowPerfBiometric, typeOfValidation);
              break;
            default:
              this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
          }
        } else {
          this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
        }
        return;
      case WidgetSelphidEnums.WidgetFinishStatus.CancelByUser:
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'launchError',
          e: ErrorRequest.DefaultBiometric,
        });
        return;
      default:
        this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
    }
    if (data.livenessDiagnostic === null) {
      this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
      return;
    }
    switch (parseInt(data.livenessDiagnostic, 10)) {
      case WidgetSelphiEnums.WidgetLivenessDiagnostic.UnsuccessLight:
        this.launchError(ErrorRequest.PoorLight, typeOfValidation);
        return;
      case WidgetSelphiEnums.WidgetLivenessDiagnostic.UnsuccessGlasses:
        this.launchError(ErrorRequest.LiveGlasses, typeOfValidation);
        return;
      case WidgetSelphiEnums.WidgetLivenessDiagnostic.UnsuccessLowPerformance:
        this.launchError(ErrorRequest.LowPerfBiometric, typeOfValidation);
        return;
      default:
        this.launchError(ErrorRequest.DefaultBiometric, typeOfValidation);
        return;
    }
  }

  tryToLogin = async () => {
    const { route } = this.props;

    const document = route.params && route.params.document;
    const cardNumber = route.params && route.params.cardNumber;
    const password = route.params && route.params.password;
    const captcha = route.params && route.params.captcha;
    const payload = route.params && route.params.payload;
    const remember = route.params && route.params.remember;

    const bodyStep1 = await this.loginWithSecondFactorAndPasswordStep1(
      cardNumber,
      password,
      document,
      captcha,
      payload,
      remember,
    );
    if (!bodyStep1) {
      return false;
    }
    if (!bodyStep1.data.hasSelectedSecuritySeal) {
      return false;
    }
    const bodyStep2 = await this.loginWithSecondFactorAndPasswordStep2(
      bodyStep1.data,
    );
    const bodyEnvironment = await this.selectEnvironment(bodyStep2.data);
    let accessToken = bodyEnvironment.data._accessToken;
    if (!accessToken) {
      const bodyGeneralConditions = await this.acceptGeneralConditions(
        bodyEnvironment.data,
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
    InitialAppScreen.IdentityCheckLoginScreen = TypeInitialStart.BioEnroll;
    TransactionSessionId.idTransaction = bodyStep2.idTransaction;
    await Session.save(accessToken);
    return true;
  };

  loginWithSecondFactorAndPasswordStep1 = async (
    cardNumber: string,
    password: string,
    document: string,
    captcha: string,
    payload: string,
    remember: boolean,
  ) => {
    Log.debug(
      TAG,
      'loginWithSecondFactorAndPasswordStep1',
      'API.Session.loginWithSecondFactorAndPasswordStep1Mobile',
    );
    const { navigation } = this.props;
    const deviceDate = DeviceInfo.deviceDate();
    const userInfo = DeviceInfo.userInfoLoad(document);
    const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
    const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
    const deviceId = await deviceInfoRaw.deviceId;

    const deviceInfo = {
      ...deviceInfoRaw,
      physicalDeviceId,
      deviceId,
    };
    const response =
      await API.Session.loginWithSecondFactorAndPasswordStepDNI1EnrollmentMobile(
        cardNumber,
        password,
        captcha,
        payload,
        deviceInfo,
        userInfo,
        deviceDate,
      );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    this.writeTrace('loginWithSecondFactorAndPasswordStep1', response);
    if (!isValid) {
      throw new RequestError(TAG, 'loginWithSecondFactorAndPasswordStep1', '');
    }

    if (!body.data.hasSelectedSecuritySeal) {
      this.setState({ isLoading: false }, () => {
        navigation.navigate('SecuritySeal', { data: body.data });
      });
    }
    const isSaveCard = remember;
    if (isSaveCard) {
      const docSaved = Validate.createMasked(document, 2, MaskType.DOCUMENT);
      try {
        if (
          !Config.features.LoginWithDniBiometric &&
          !Config.features.LoginWithDniConventional
        ) {
          const cardSaved = Validate.createMasked(
            cardNumber,
            4,
            MaskType.CARDNUMBER,
          );
          await MaskService.create(cardSaved);
        }
        await MaskService.create(docSaved);
      } catch (e) {
        RequestErrorCheck.track(body);
        Log.warn(TAG, 'loginWithSecondFactorAndPasswordStep1', e);
      }
    }
    return body;
  };

  loginWithSecondFactorAndPasswordStep2 = async (
    data: LoginWithSecondFactorAndPasswordStep1MobileResponse,
  ) => {
    Log.debug(
      TAG,
      'loginWithSecondFactorAndPasswordStep2',
      'API.Session.loginWithSecondFactorAndPasswordStep2Mobile',
    );
    const response =
      await API.Session.loginWithSecondFactorAndPasswordStep2Mobile(
        data._exchangeToken,
        '',
      );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      throw new RequestError(
        TAG,
        'loginWithSecondFactorAndPasswordStep2',
        body.message,
      );
    }
    return body;
  };

  selectEnvironment = async (
    data: LoginWithSecondFactorAndPasswordStep2MobileResponse,
  ) => {
    Log.debug(TAG, 'selectEnvironment', 'API.Session.selectEnvironment');
    const response = await API.Session.selectEnvironment(
      data._exchangeToken,
      '-1',
    );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      throw new RequestError(TAG, 'selectEnvironment', body.message);
    }
    ExternalApi.updateToken(body.data.previousLoginInfo.idUser);
    return body;
  };

  acceptGeneralConditions = async (data: SelectEnvironmentResponse) => {
    Log.debug(
      TAG,
      'acceptGeneralConditions',
      'API.Session.acceptGeneralConditions',
    );
    const response = await API.Session.acceptGeneralConditions(
      data._exchangeToken || data._accessToken,
      true,
    );
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      throw new RequestError(TAG, 'acceptGeneralConditions', body.message);
    }
    return body;
  };

  render() {
    const { isFocused } = this.props;
    const {
      isLoading,
      frontDniImage,
      backDniImage,
      selfieDniImage,
      credentialsReady,
      activeBackButton,
      activeLiveButton,
      header,
    } = this.state;

    return (
      <Container>
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleScreenHeight(),
          }}
          ref={ref => {
            this.scroll = ref;
          }}>
          <SafeAreaView>
            <Content center>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Header
                center
                accessibilityLabel={'identitycheckloginscreen_header'}
                style={styles.header}
                titleStyle={styles.title}
                subtitleStyle={styles.subtitleHeader}
                title={L.identitycheckloginscreen_header_text}
                subtitle={L.identitycheckloginscreen_body_text}
              />
              <FacephiButton
                accessibilityLabel={'validation_dni_front'}
                onValidationStart={typeOfValidation => {
                  AnalyticsEvent.trackScreen(
                    'IdentityCheckLoginDniFrontInstru',
                  );
                  this.onValidationStart(typeOfValidation);
                }}
                typeOfValidation={BiometricConst.testMode.frontDoc}
                active={true}
                capturedImage={frontDniImage}
                title={L.identitycheckloginscreen_facephibutton_front_title}
                subtitle={
                  L.identitycheckloginscreen_facephibutton_front_subtitle
                }
                iconFrontImage={require('../../assets/images/dni-front-icon.png')}
              />
              <FacephiButton
                accessibilityLabel={'validation_dni_back'}
                onValidationStart={typeOfValidation => {
                  AnalyticsEvent.trackScreen('IdentityCheckLoginDniBackInstru');
                  this.onValidationStart(typeOfValidation);
                }}
                typeOfValidation={BiometricConst.testMode.backDoc}
                active={activeBackButton}
                capturedImage={backDniImage}
                title={L.identitycheckloginscreen_facephibutton_back_title}
                subtitle={
                  L.identitycheckloginscreen_facephibutton_back_subtitle
                }
                iconFrontImage={require('../../assets/images/dni-back-icon.png')}
              />
              <FacephiButton
                accessibilityLabel={'validation_live'}
                onValidationStart={typeOfValidation => {
                  AnalyticsEvent.trackScreen('IdentityCheckLoginLiveInstru');
                  this.onValidationStart(typeOfValidation);
                }}
                typeOfValidation={BiometricConst.testMode.liveness}
                // active={true}
                active={activeLiveButton}
                capturedImage={selfieDniImage}
                title={L.identitycheckloginscreen_facephibutton_live_title}
                subtitle={
                  L.identitycheckloginscreen_facephibutton_live_subtitle
                }
                iconFrontImage={require('../../assets/images/selfie-icon.png')}
              />
              <Button
                accessibilityLabel={'identitycheckloginscreen_button_continue'}
                title={L.identitycheckloginscreen_button_text}
                loading={isLoading}
                style={styles.buttons}
                textStyle={styles.validationButton}
                onPress={this.tryToSubmit}
                disabled={!credentialsReady}
                allowOnPress
              />
              {Config.features.HeaderTraceEnabled && (
                <TextInput
                  label={L.header_trace}
                  value={header}
                  accessibilityLabel={
                    'identitycheckloginscreen_textinput_header_trace'
                  }
                  containerStyle={styles.headerTrace}
                />
              )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type IdentityCheckLoginScreenType = IdentityCheckLoginScreen;
export default withFocused<IdentityCheckLoginScreen, Props>(
  IdentityCheckLoginScreen,
);
