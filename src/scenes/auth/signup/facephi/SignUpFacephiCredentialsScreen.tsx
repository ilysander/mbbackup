import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  ScrollView,
  InteractionManager,
  ImageStyle,
  TextStyle,
  BackHandler,
  Platform,
} from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  FormSteps,
  TextInputDni,
  FacephiButton,
} from '../../../../components/ui';
import Config from '../../../../Config';
import { Size } from '../../../../resources/dimensions';
import { L } from '../../../../resources/language';
import { Font } from '../../../../resources/functions';
import {
  Colors,
  ErrorRequest,
  BiometricConst,
} from '../../../../resources/constants';
import { Log } from '../../../../resources/log';
import { Emitter } from '../../../../resources/listeners';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { KeyboardUtil } from '../../../../resources/util';
import RNSelphID from 'react-native-selph-id';
import RNSelphi from 'react-native-selphi';
import * as WidgetSelphiEnums from 'react-native-selphi/ts/WidgetSelphiEnums';
import { WidgetSelphiConfiguration } from 'react-native-selphi/ts/WidgetSelphiConfigurations';
import * as WidgetSelphidEnums from 'react-native-selph-id/ts/WidgetSelphidEnums';
import {
  WidgetSelphidConfiguration,
  SelphIDResult,
} from 'react-native-selph-id/ts/WidgetSelphidConfiguration';
import API from '../../../../api';
import { ErrorRequestItem } from '../../../../resources/constants/ErrorRequest';
import { MobileBioStep1Response } from '../../../../api/backend/response/SignUpBio';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
});

const TAG = '[SignUpFacephiCredentialsScreen]';

export interface Params {}
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
  documentIsValid: boolean;
  dniCompleted: boolean;
  activeBackButton: boolean;
  activeLiveButton: boolean;
}

class SignUpFacephiCredentialsScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.signupstack_title,
    gesturesEnabled: false,
  };

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
    documentIsValid: false,
    dniCompleted: false,
    activeBackButton: false,
    activeLiveButton: false,
  };

  document!: TextInputDni | null;
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

  focus = () => {
    Log.debug(TAG, 'focus');
    this.document && this.document.focus();
  };

  tryToSubmit = async () => {
    const { credentialsReady } = this.state;
    if (credentialsReady) {
      this.blur();
      this.interaction && this.interaction.cancel();
      this.interaction = InteractionManager.runAfterInteractions(async () => {
        this.setState({ isLoading: true });
        const documentNumber = this.document ? this.document.getValue() : '';
        const captcha = '';
        await this.submit(documentNumber, captcha);
        this.setState({ isLoading: false });
      });
    }
  };

  submit = async (documentNumber: string, captcha: string) => {
    const { navigation } = this.props;
    try {
      const { selfie, selfieTemplate, doiOCRTokenBack, doiFaceToken } =
        this.state;
      const response = await API.SignUpBio.mobileBioStep1(
        documentNumber,
        captcha,
        selfie,
        selfieTemplate,
        doiOCRTokenBack,
        doiFaceToken,
      );
      const body = response.body;
      const isValid = body.code === API.ResponseCode.OK;
      if (isValid) {
        const data = body.data as MobileBioStep1Response;
        const exchangeToken = data._exchangeToken;
        navigation.navigate('SignUpFacephiReset', {
          exchangeToken,
          documentNumber,
        });
        this.cleanState();
        return;
      } else {
        this.cleanState();
        AnalyticsEvent?.track(A.seed_dni_reg + '_err_val_biometrica');
        this.props.navigation.navigate('GenericError');
      }
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      AnalyticsEvent?.track(A.seed_dni_reg + '_err_red');
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

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
      documentIsValid: false,
      dniCompleted: false,
      activeBackButton: false,
      activeLiveButton: false,
    });
    this.document && this.document.setValue('');
  };

  componentDidMount() {
    this.focus();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    AnalyticsEvent?.track(A.seed_dni_reg + '_inicio');
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

  onDniCompleted = (onDniCompleted: boolean) => {
    onDniCompleted
      ? this.credentialsReady()
      : this.setState({ credentialsReady: onDniCompleted });
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

  saveDocData = (typeOfValidation: string, data: SelphIDResult) => {
    switch (typeOfValidation) {
      case BiometricConst.testMode.frontDoc:
        AnalyticsEvent?.trackScreen('IdentityCheckSignupDniFrontFinal');
        this.setState({
          frontDniImage: data.frontDocumentImage || '',
          activeBackButton: true,
          doiOCRTokenFront: data.tokenOCR || '',
          doiFaceToken: data.tokenFaceImage || '',
        });
        AnalyticsEvent?.trackScreen('IdentityCheckSignupDniBack');
        break;
      case BiometricConst.testMode.backDoc:
        AnalyticsEvent?.trackScreen('IdentityCheckSignupDniBackFinal');
        this.setState({
          backDniImage: data.backDocumentImage || '',
          activeLiveButton: true,
          doiOCRTokenBack: data.tokenOCR || '',
        });
        AnalyticsEvent?.trackScreen('IdentityCheckSignupLive');
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
        AnalyticsEvent?.trackScreen('IdentityCheckSignupResumen');
        if (data.eyeGlassesScore < limitGlassesScore) {
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
          switch (parseInt(data.errorType, 10)) {
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
    } = this.state;

    return (
      <Container>
        <FormSteps total={3} current={1} />
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
                accessibilityLabel={'signupfacephicredentialscreen_header'}
                style={styles.header}
                titleStyle={styles.title}
                subtitleStyle={styles.subtitleHeader}
                title={L.signupfacephiscreen_header_title}
                subtitle={L.signupfacephiscreen_header_subtitle}
              />
              <TextInputDni
                accessibilityErrorInput={'signUpFacephi_error_document'}
                onDniCompleted={onDniCompleted =>
                  this.onDniCompleted(onDniCompleted)
                }
                ref={ref => {
                  this.document = ref;
                }}
              />
              <FacephiButton
                accessibilityLabel={'signup_front_dni'}
                onValidationStart={typeOfValidation => {
                  this.onValidationStart(typeOfValidation);
                  AnalyticsEvent?.trackScreen(
                    'IdentityCheckSignupDniFrontInstru',
                  );
                }}
                typeOfValidation={BiometricConst.testMode.frontDoc}
                active={true}
                capturedImage={frontDniImage}
                title={L.signupfacephiscreen_facephibutton_front_title}
                subtitle={L.signupfacephiscreen_facephibutton_front_subtitle}
                iconFrontImage={require('../../../../assets/images/dni-front-icon.png')}
              />
              <FacephiButton
                accessibilityLabel={'signup_back_dni'}
                onValidationStart={typeOfValidation => {
                  AnalyticsEvent?.trackScreen(
                    'IdentityCheckSignupDniBackInstru',
                  );
                  this.onValidationStart(typeOfValidation);
                }}
                typeOfValidation={BiometricConst.testMode.backDoc}
                active={activeBackButton}
                capturedImage={backDniImage}
                title={L.signupfacephiscreen_facephibutton_back_title}
                subtitle={L.signupfacephiscreen_facephibutton_back_subtitle}
                iconFrontImage={require('../../../../assets/images/dni-back-icon.png')}
              />
              <FacephiButton
                accessibilityLabel={'signup_live'}
                onValidationStart={typeOfValidation => {
                  AnalyticsEvent?.trackScreen('IdentityCheckSignupLiveInstru');
                  this.onValidationStart(typeOfValidation);
                }}
                typeOfValidation={BiometricConst.testMode.liveness}
                active={activeLiveButton}
                capturedImage={selfieDniImage}
                title={L.signupfacephiscreen_facephibutton_live_title}
                subtitle={L.signupfacephiscreen_facephibutton_live_subtitle}
                iconFrontImage={require('../../../../assets/images/selfie-icon.png')}
              />
              <Button
                accessibilityLabel={
                  'signupfacephicredentialsscreen_button_continue'
                }
                title={L.signupfacephiscreen_button_continue}
                loading={isLoading}
                style={styles.buttons}
                onPress={this.tryToSubmit}
                disabled={!credentialsReady}
                allowOnPress
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type SignUpFacephiCredentialsScreenType = SignUpFacephiCredentialsScreen;
export default withFocused<SignUpFacephiCredentialsScreen, Props>(
  SignUpFacephiCredentialsScreen,
);
