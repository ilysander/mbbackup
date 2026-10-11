import * as React from 'react';
import {
  ImageStyle,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  BackHandler,
  InteractionManager,
  ScrollView,
  Platform,
} from 'react-native';
import API from '../../api';
import {
  LoginWithSecondFactorAndPasswordStep1MobileResponse,
  LoginWithSecondFactorAndPasswordStep2MobileResponse,
  SelectEnvironmentResponse,
} from '../../api/backend/response/Session';
import Session from '../../api/Session';
import NetworkManager from '../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../components/screen/ScreenContainer';
import {
  CopilotProps,
  withCopilot,
} from '../../components/tour/CopilotContainer';
import CopilotStep from '../../components/tour/CopilotStep';
import WalkthroughableView from '../../components/tour/WalkthroughableView';
import Button from '../../components/ui/Button';
import ButtonExternal from '../../components/ui/ButtonExternal';
import ButtonLink from '../../components/ui/ButtonLink';
import Container from '../../components/ui/Container';
import Content from '../../components/ui/Content';
import KeyboardAvoidingView from '../../components/ui/KeyboardAvoidingView';
import NetworkStatusAlert from '../../components/ui/NetworkStatusAlert';
import SafeAreaView from '../../components/ui/SafeAreaView';
import TextInput from '../../components/ui/TextInput';
import TextInputMasked from '../../components/ui/TextInputMasked';
import Tooltip from '../../components/ui/Tooltip';
import Captcha from '../../components/ui/Captcha';
import MaintenanceView from '../../components/ui/MaintenanceView';
import ModalRegisterMode from '../../components/ui/ModalRegisterMode';

import Config from '../../Config';
import { AnalyticsEvent, A, K } from '../../resources/analytics';
import Colors from '../../resources/constants/Colors';
import ErrorRequest from '../../resources/constants/ErrorRequest';
import Formats from '../../resources/constants/Formats';
import MaintenanceStatus from '../../resources/constants/MaintenanceStatus';
import TypeInitialStart from '../../resources/constants/TypeInitialStart';
import { Size } from '../../resources/dimensions';
import { RequestError, RequestErrorCheck } from '../../resources/error';
import { Font, Linking, Validate, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import { MaskService } from '../../resources/persistence';
import { CacheObj, MaskModel } from '../../resources/persistence/models';
import { KeyboardUtil } from '../../resources/util';
import { AlertEvent } from '../../components/alert/AlertManager';
import Features from '../../resources/remote/Features';
import { MaskType } from '../../resources/persistence/models/MaskModel';
import perf from '@react-native-firebase/perf';
import AlertMaintenanceModal from '../../components/ui/AlertMaintenanceModal';
import CheckBox from '../../components/ui/CheckBox';
import { InitialAppScreen } from '../../resources/initialAppScreen';
import TransactionSessionId from '../../resources/idTransaction/idTransaction';
import DeviceInfo from '../../resources/deviceset/DeviceInfo';
import ExternalApi from '../../api/backend/ExternalApi';
import LoginIncorrectInfoModal from '../../components/info/LoginIncorrectInfoModal';
import CacheService from '../../resources/persistence/CacheService';
import MobileServiceManager from '../../components/mobile-service/MobileServiceManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SecureKeyboardApi from '../../components/ui/SecureKeyboardApi';
import { SHA256 } from 'crypto-js';
import { ResponseBody } from '../../api/util/Request';
import {
  setEventValue,
  updateEventSubseccion,
} from '../../resources/analytics/AnalyticsEvent';
import {
  WidgetsProductsResponse,
  ContentCreditLine,
} from '../../api/backend/response/Execute';
import analytics from '@react-native-firebase/analytics';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  } as ViewStyle,
  cardNumberLabel: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  boldText: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  underlineText: {
    textDecorationLine: 'underline',
  } as ViewStyle,
  helpButtonIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.secondary,
  } as ImageStyle,
  tooltipContainer: {
    marginLeft: 5,
  } as ViewStyle,
  containerButtonSecondary: {
    marginBottom: 20,
    borderRadius: 20,
  } as ViewStyle,
  signIn: {
    marginTop: Features.isAllowedTo('Captcha') ? 0 : 20,
    marginBottom: 30,
    padding: 14,
    borderWidth: 0,
  } as ViewStyle,
  forgotPassword: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,
  captcha: {
    marginVertical: 15,
  } as ViewStyle,
  buttonSignUp: {
    marginLeft: -20,
    marginRight: -20,
    padding: 0,
    alignItems: 'center',
    marginTop: 8,
  } as ViewStyle,
  titleSignUp: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 14,
    color: Colors.grey5,
    lineHeight: 17,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  titleButtonSignUp: {
    fontSize: 16,
  } as TextStyle,
  titleButtonPassword: {
    fontSize: 14,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 40,
  } as ViewStyle,
  footerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  } as ViewStyle,
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  } as ViewStyle,
  helpRememberButtonIcon: {
    marginLeft: 6,
  } as ImageStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  labelBold: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  labelRegular: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey5,
  } as TextStyle,
  marginWithoutCaptcha: {
    marginBottom: 0,
  } as ViewStyle,
  containerInternetKey: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  icon: {
    tintColor: Colors.grey5,
    width: 12,
    height: 16,
  } as ImageStyle,
  iconExtraButtonSignUp: {
    marginRight: 8,
  } as ImageStyle,
  iconButtonSignUp: {
    height: 14,
    width: 7,
    marginLeft: 8,
  } as ImageStyle,
  iconInputDocuments: {
    width: 16,
    height: 12,
  } as ImageStyle,
  iconInputPassword: {
    width: 13,
    height: 16,
  } as ImageStyle,
  iconUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
  } as ImageStyle,
  iconRememberMe: {
    width: 24,
    height: 24,
    borderRadius: 12,
  } as ImageStyle,
  inputPassword: {
    letterSpacing: 3,
    paddingBottom: 10,
    paddingTop: 10,
    fontSize: 14,
  } as TextStyle,
  iconButton: {
    tintColor: Colors.primaryLight,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  iconButtonGrey: {
    tintColor: Colors.grey5,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  docContainer: {
    marginTop: 0,
    marginBottom: 20,
  } as ViewStyle,
  usernameContainer: {
    marginTop: 0,
    marginBottom: 10,
  } as ViewStyle,
  passwordContainer: {
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  headerTrace: {
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  content: {
    paddingHorizontal: 40,
    paddingTop: 10,
  } as ViewStyle,
  titleButtonSignIn: {
    fontSize: 16,
  } as TextStyle,
  placeholderCheckbox: {
    fontSize: 14,
    marginLeft: 4,
  } as TextStyle,
});

const TAG = '[SignInScreen]';

const ErrorTypes = {
  Incorrect: 'Incorrect',
  Block: 'Block',
  AutoUnblock: 'AutoUnblock',
};
export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationProp<any, any>;
}

export interface State {
  isLoading: boolean;
  isValid: boolean;
  isChecked: boolean;
  cardSaved?: MaskModel;
  docSaved?: MaskModel;
  payload: string;
  showToolTip: boolean;
  dictionary: string[];
  activeModalRegisterMode: boolean;
  enrollValFailed: boolean;
  header: string;
  visibleErrorLoginModal: boolean;
  titleIncorrectModal: string;
  subTitleIncorrectModalText: string;
  creditLine?: ContentCreditLine;
  isLoadingCreditline?: boolean;
  statusError?: any;
}

class SignInCopilot extends React.Component<
  Props & FocusedProps & CopilotProps,
  State
> {
  state: State = {
    isLoading: false,
    isChecked: false,
    isValid: false,
    payload: '',
    showToolTip: false,
    dictionary: [],
    activeModalRegisterMode: false,
    enrollValFailed: false,
    header: '',
    visibleErrorLoginModal: false,
    titleIncorrectModal: '',
    subTitleIncorrectModalText: '',
    statusError: null,
  };
  private checkbox!: CheckBox | null;
  private password!: TextInput | null;
  private document!: TextInputMasked | null;
  private cardNumber!: TextInputMasked | null;
  private captcha!: Captcha | null;
  private scroll!: ScrollView | null;
  private interaction!: any;
  private trace!: any | null;
  private modalRegister!: ModalRegisterMode | null;

  async componentDidMount() {
    this.loadDefaults();
    this.demoValid();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.removeDemoConfig();
  }

  hashString(param: string) {
    const hash = SHA256(param).toString();
    return hash;
  }

  onFocus = async () => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace = perf().newTrace('SignInScreen');
      await this.trace.start();
    }

    await this.scrollTop();
    this.setState({ showToolTip: true });
  };

  scrollTop = async () => {
    this.scroll && (await this.scroll.scrollTo());
  };

  onBlur = async () => {
    this.trace && (await this.trace.stop());
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  demoValid = () => {
    Validate.isDemo() &&
      setTimeout(() => {
        this.isValid();
      }, 0);
  };
  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      BackHandler.exitApp();
      return false;
    }

    if (InitialAppScreen.InitialAppScreen === TypeInitialStart.SignIn) {
      BackHandler.exitApp();
      return true;
    }
    return false;
  };

  loadDefaults = async () => {
    try {
      if (
        !Config.features.LoginWithDniBiometric &&
        !Config.features.LoginWithDniConventional
      ) {
        const cardNumber = await MaskService.findOneByType(MaskType.CARDNUMBER);
        const document = await MaskService.findOneByType(MaskType.DOCUMENT);
        const cardSaved = Validate.createMasked(cardNumber.value || '', 4);
        const docSaved = Validate.createMasked(document.value || '', 2);
        this.setState({ cardSaved, docSaved }, () => {
          this.checkbox && this.checkbox.setValue(true);
        });
      } else {
        const document = await MaskService.findOneByType(MaskType.DOCUMENT);
        const docSaved = Validate.createMasked(document.value || '', 2);
        this.setState({ docSaved }, () => {
          this.checkbox && this.checkbox.setValue(true);
        });
      }
    } catch (e) {
      Log.debug(TAG, 'loadDefaults', e);
    }
  };

  safeReturnValue(value: any) {
    if (!value) {
      return {
        ok: true,
      };
    }
    return value;
  }

  getLoanPosition(loans: { products: any[] }, position: number): any {
    const products = loans?.products;
    const loan = products[position - 1];
    if (typeof loan === 'undefined') {
      return '(not available)';
    }
    return loan;
  }

  sumSolesCA(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.currency === '1') {
        if (product.hasOwnProperty('availableBalance')) {
          return total + product.availableBalance;
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  sumDolaresCA(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.currency === '2') {
        if (product.hasOwnProperty('availableBalance')) {
          return total + product.availableBalance;
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  sumTotalCTS(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.hasOwnProperty('balance')) {
        return total + product.balance;
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  sumTotalDPF(value: any) {
    const sumTotal = value.products.reduce((total: any, product: any) => {
      if (product.hasOwnProperty('capital')) {
        return total + product.capital;
      } else {
        return total;
      }
    }, 0);

    return sumTotal === 0
      ? '(not available)'
      : Math.round(sumTotal * 100) / 100;
  }

  getUsedLineCredit = async () => {
    try {
      const response = await API.Execute.creditlineDisplay();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.data) {
        const list = response.body.data.contentList || [];
        const creditLine = list.length > 0 ? list[0] : undefined;
        if (!creditLine) {
          Log.info(TAG, 'load', 'no creditLine');
        }
        if (creditLine) {
          const instacashType = await Validate.instantCashType(creditLine);
          const hasNewProduct = instacashType
            ? instacashType?.code === 3
            : false;
          const typeDisposition = hasNewProduct
            ? '2da disposición'
            : '1ra disposición';
          this.setState({
            creditLine,
            isLoadingCreditline: true,
          });
          return {
            creditLine,
            isLoadingCreditline: true,
            typeDisposition,
          };
        }
      }
    } catch (e) {
      Log.info(TAG, 'load', e);
      this.setState({ isLoadingCreditline: true });
    }
    return {
      creditLine: undefined,
      isLoadingCreditline: false,
      typeDisposition: '(not available)',
    };
  };

  setStateByResponse = async (body: ResponseBody<WidgetsProductsResponse>) => {
    const data = this.safeReturnValue(body.data);
    const productMap = this.safeReturnValue(data.productMap);
    const prestamo1 = this.getLoanPosition(productMap?.loans, 1);
    const prestamo2 = this.getLoanPosition(productMap?.loans, 2);
    const prestamo3 = this.getLoanPosition(productMap?.loans, 3);
    const responseCredit = await this.getUsedLineCredit();
    const { creditLine, typeDisposition } = responseCredit;

    const accountProperties = new Map<string, string | number>();
    accountProperties.set(
      'TotalAhorrosSoles',
      productMap.accountsCA
        ? this.sumSolesCA(productMap.accountsCA)
        : '(not available)'
    );
    accountProperties.set(
      'TotalAhorrosDolares',
      productMap.accountsCA
        ? this.sumDolaresCA(productMap.accountsCA)
        : '(not available)'
    );
    accountProperties.set(
      'TotalCTS',
      productMap.accountsCTS
        ? this.sumTotalCTS(productMap.accountsCTS)
        : '(not available)'
    );
    accountProperties.set(
      'TotalDPF',
      productMap.deposits
        ? this.sumTotalDPF(productMap.deposits)
        : '(not available)'
    );
    accountProperties.set(
      'PrestamoActivo1',
      typeof prestamo1 === 'string' ? prestamo1 : prestamo1?.loanAmount
    );
    accountProperties.set(
      'PrestamoActivo2',
      typeof prestamo2 === 'string' ? prestamo2 : prestamo2?.loanAmount
    );
    accountProperties.set(
      'PrestamoActivo3',
      typeof prestamo3 === 'string' ? prestamo3 : prestamo3?.loanAmount
    );
    accountProperties.set('TipoLead', typeDisposition);
    accountProperties.set(
      'LineaUtilizada',
      creditLine?.withdrawnCreditLineAmount
        ? creditLine?.withdrawnCreditLineAmount
        : '(not available)'
    );
    accountProperties.set(
      'LineaDisponible',
      creditLine?.avaiCredLAmountWithoutTax
        ? creditLine?.avaiCredLAmountWithoutTax
        : '(not available)'
    );

    const userProperties: { [key: string]: string } = {};
    accountProperties.forEach((value, key) => {
      userProperties[key] = value.toString();
    });
    AnalyticsEvent.setUserProperties(userProperties);
  };

  loadAccountListData = async () => {
    try {
      const response = await API.Execute.widgetsProducts();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const body = response.body;
      if (body.code === API.ResponseCode.OK) {
        this.setStateByResponse(body);
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'load',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
  };

  submit = async () => {
    const remember = this.isSavedCard().toString();
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && (await this.trace.incrementMetric('submit', 1));
      this.trace && this.trace.putAttribute('remember', remember);
    }

    const cardNumber = this.cardNumber ? this.cardNumber.getValue() : '';
    const ky = this.password ? this.password.getValue() : '';
    const document = this.document ? this.document.getValue() : '';

    if (Validate.needRevision()) {
      await this.validateRevision(document, ky);
    }

    const { payload, dictionary } = this.state;
    const { navigation, route } = this.props;
    const a_seed = route.params ? route.params.a_seed : 'demo_fix';
    // const a_seed = navigation.getParam('a_seed');
    try {
      const success = await this.signInApi(
        cardNumber,
        Sanitizer.safeText(ky, dictionary),
        document,
        this.captcha ? this.captcha.getValue() : '',
        payload
      );
      if (success) {
        const header = this.state.header + 'SUCCESS';
        this.setState({ header });
        AnalyticsEvent.track(A.signin_success, {
          remember,
          method: 'app',
        });
        this.loadAccountListData();
        analytics().setUserId(this.hashString(document));
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.trace && this.trace.incrementMetric('OkResponse', 1);
        }

        this.setState({ isLoading: false }, () => {
          navigation.navigate('App');
          if (!!a_seed) {
            AnalyticsEvent.track(a_seed + '_logok');
          }
        });

        return;
      }
      this.setState({ isLoading: false });
    } catch (error) {
      const e = error as any;
      if (!!a_seed) {
        AnalyticsEvent.track(a_seed + '_logerr');
      }
      if (MobileServiceManager.isGms || Platform.OS === 'ios') {
        this.trace && (await this.trace.incrementMetric('errorResponse', 1));
      }

      if (e.name === 'RequestError') {
        if (
          Config.features.LoginWithDniBiometric &&
          Config.features.LoginWithDniConventional
        ) {
          this.password &&
            this.password.setError(e.message || L.signinscreen_error_default);
        } else {
          this.password &&
            this.password.setError(
              e.message || L.signinscreen_error_default_bm
            );
        }
      } else {
        const TEX2 = this.state.header + '-ERRORPORALGO-' + e;
        this.setState({ header: TEX2 });
        Log.exception(TAG, 'signIn', e);
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'signIn',
          e,
        });
      }
    }
  };

  isSavedCard = () => {
    return this.checkbox ? this.checkbox.getValue() : false;
  };

  loginWithSecondFactorAndPasswordStep1 = async (
    cardNumber: string,
    password: string,
    document: string,
    captcha: string,
    payload: string
  ) => {
    Log.debug(
      TAG,
      'loginWithSecondFactorAndPasswordStep1',
      'API.Session.loginWithSecondFactorAndPasswordStep1Mobile'
    );
    const deviceDate = DeviceInfo.deviceDate();
    const userInfo = DeviceInfo.userInfoLoad(document);
    // const deviceInfo = DeviceInfo.deviceInfoLoad();
    
    const deviceInfoRaw = DeviceInfo.deviceInfoLoad();
    const physicalDeviceId = await deviceInfoRaw.physicalDeviceId;
    const deviceId = await deviceInfoRaw.deviceId;

    const deviceInfo = {
      ...deviceInfoRaw,
      physicalDeviceId,
      deviceId
    }

    const { navigation, route } = this.props;
    // const a_seed = navigation.getParam('a_seed');
    const a_seed = route.params ? route.params.a_seed : 'demo_fix';
    // const a_seed = navigation.getParam('a_seed');
    const response =
      Config.features.LoginWithDniBiometric ||
        Config.features.LoginWithDniConventional
        ? Config.features.EnrollmentProcess
          ? await API.Session.loginWithSecondFactorAndPasswordStepDNI1EnrollmentMobile(
            cardNumber,
            password,
            captcha,
            payload,
            deviceInfo,
            userInfo,
            deviceDate
          )
          : await API.Session.loginWithSecondFactorAndPasswordStepDNI1Mobile(
            cardNumber,
            password,
            document,
            captcha,
            payload
          )
        : Config.features.EnrollmentProcess
          ? await API.Session.loginWithSecondFactorAndPasswordStepDNI1EnrollmentMobile(
            cardNumber,
            password,
            captcha,
            payload,
            deviceInfo,
            userInfo,
            deviceDate
          )
          : await API.Session.loginWithSecondFactorAndPasswordStep1Mobile(
            cardNumber,
            password,
            document,
            captcha,
            payload
          );
    const body = response.body;
    const isValid =
      body.code === API.ResponseCode.OK ||
      body.code === API.ResponseCode.ENROLLMENTERROR ||
      body.code === API.ResponseCode.ENROLLMENTNOBIO ||
      body.code === API.ResponseCode.ENROLLMENTBYBIO;
    this.writeTrace(
      '1-API.Session.loginWithSecondFactorAndPasswordStep1Mobile',
      response
    );
    if (!isValid) {
      const stateCode = response?.status;
      switch (body.code) {
        case API.LoginResponseCode.BLOCKED:
          if (Config.features.EnableAutomaticUnblock) {
            RequestErrorCheck.track(body);
            this.chooseErrorType(ErrorTypes.AutoUnblock, stateCode);
          } else {
            RequestErrorCheck.track(body);
            this.chooseErrorType(ErrorTypes.Incorrect, stateCode);
          }
          break;
        case API.LoginResponseCode.INVALIDDATA:
          RequestErrorCheck.track(body);
          this.chooseErrorType(ErrorTypes.Incorrect, stateCode);
          break;
        default:
          if (
            body.code === API.LoginResponseCode.THREEINTENTS ||
            body.code === API.LoginResponseCode.INCORRECTCARD ||
            body.code === API.LoginResponseCode.NOTROBOT ||
            body.code === API.LoginResponseCode.DOCINCORR
          ) {
            RequestErrorCheck.track(body);
            this.chooseErrorType(ErrorTypes.Incorrect, stateCode);
          } else {
            RequestErrorCheck.track(body);
            throw new RequestError(
              TAG,
              'loginWithSecondFactorAndPasswordStep1',
              ''
            );
          }
          break;
      }
    }
    if (
      body.code === API.ResponseCode.ENROLLMENTERROR ||
      body.code === API.ResponseCode.ENROLLMENTNOBIO
    ) {
      this.setState({ isLoading: false }, () => this.openEnrollError());
      this.password && this.password.setValue('');
      return;
    }
    if (body.code === API.ResponseCode.ENROLLMENTBYBIO) {
      const idTransaction = response.body.idTransaction;
      const remember = this.isSavedCard();
      this.setState({ isLoading: false }, () =>
        this.goToEnrollmentLogin(
          document,
          cardNumber,
          password,
          captcha,
          payload,
          idTransaction,
          remember
        )
      );
      this.password && this.password.setValue('');
      return;
    }
    if (!body.data._exchangeToken) {
      const hasPhoneNumber = !!body.data.phoneNumber;
      if (hasPhoneNumber) {
        this.password && this.password.setValue('');
        const isSaveCard = this.isSavedCard();
        this.setState({ isLoading: false }, () => {
          navigation.navigate('EnrollmentSMS', {
            password,
            captcha,
            keyboardToken: payload,
            document,
            phoneNumber: body.data.phoneNumber,
            isSaveCard,
            cardNumber,
          });
          if (!!a_seed) {
            AnalyticsEvent.track(a_seed + '_logok_enrol');
          }
        });
      }
      return;
    }

    const isSaveCard = this.isSavedCard();
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
            MaskType.CARDNUMBER
          );
          await MaskService.create(cardSaved);
        }
        await MaskService.create(docSaved);
      } catch (e) {
        RequestErrorCheck.track(body);
        Log.warn(TAG, 'loginWithSecondFactorAndPasswordStep1', e);
      }
    }
    if (!body.data.hasSelectedSecuritySeal) {
      this.setState({ isLoading: false }, () => {
        navigation.navigate('SecuritySeal', { data: body.data });
        if (!!a_seed) {
          AnalyticsEvent.track(a_seed + '_logok_ss');
        }
      });
    }
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
    this.writeTrace(
      '2-API.Session.loginWithSecondFactorAndPasswordStep2Mobile',
      response
    );
    const body = response.body;
    const status = response.status;
    const isValid = body.code === API.ResponseCode.OK;

    if (!isValid) {
      this.setState({ statusError: status });
      RequestErrorCheck.track(body);
      throw new RequestError(
        TAG,
        'loginWithSecondFactorAndPasswordStep2',
        body.message
      );
    }
    return body;
  };

  selectEnvironment = async (
    data: LoginWithSecondFactorAndPasswordStep2MobileResponse
  ) => {
    Log.debug(TAG, 'selectEnvironment', 'API.Session.selectEnvironment');
    const response = await API.Session.selectEnvironment(
      data._exchangeToken,
      '-1'
    );
    this.writeTrace('3-API.Session.selectEnvironment', response);
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      RequestErrorCheck.track(body);
      throw new RequestError(TAG, 'selectEnvironment', body.message);
    }
    const previousLoginInfo = body.data.previousLoginInfo;
    if (previousLoginInfo === null || previousLoginInfo === undefined) {
      ExternalApi.updateToken(body.data.username);
      AnalyticsEvent.track('ups_nopreviouslogin');
    } else {
      ExternalApi.updateToken(previousLoginInfo.idUser);
    }

    return body;
  };

  writeTrace(nameTrace: string, response: any) {
    const printHeader = JSON.stringify(response);
    const header = this.state.header + nameTrace + printHeader;
    this.setState({ header });
  }

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
    this.writeTrace('4-API.Session.acceptGeneralConditions', response);
    const body = response.body;
    const isValid = body.code === API.ResponseCode.OK;
    if (!isValid) {
      RequestErrorCheck.track(body);
      throw new RequestError(TAG, 'acceptGeneralConditions', body.message);
    }
    return body;
  };

  signInApi = async (
    cardNumber: string,
    password: string,
    document: string,
    captcha: string,
    payload: string
  ) => {
    const bodyStep1 = await this.loginWithSecondFactorAndPasswordStep1(
      cardNumber,
      password,
      document,
      captcha,
      payload
    );
    if (!bodyStep1) {
      return false;
    }
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
    InitialAppScreen.IdentityCheckLoginScreen = TypeInitialStart.NoBioEnroll;
    TransactionSessionId.idTransaction = bodyStep2.idTransaction;
    await Session.save(accessToken);
    return true;
  };

  goToSignUp = () => {
    if (Features.isAllowedTo('SignUpWeb')) {
      this.props.navigation.navigate('SignUpWeb');
    } else {
      if (
        !Config.features.LoginWithDniBiometric ||
        Config.features.LoginWithDniConventional
      ) {
        this.props.navigation.navigate('SignUpCredentials');
      } else {
        this.modalRegister?.showPanel();
      }
    }
  };

  goToForgotPassword = () => {
    if (Features.isAllowedTo('ForgotPasswordWeb')) {
      this.props.navigation.navigate('ForgotPasswordWeb');
    } else {
      this.props.navigation.navigate('ForgotPasswordCredentials');
    }
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  tryToSubmit = () => {
    this.blur();

    const { route } = this.props;
    // const a_seed = navigation.getParam('a_seed');
    const a_seed = route.params ? route.params.a_seed : 'demo_fix';
    // const a_seed = navigation.getParam('a_seed');
    if (!!a_seed) {
      AnalyticsEvent.track(a_seed + '_log');
    }

    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      const isValid = this.isValid();
      if (!isValid) {
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

  isValid = (showError = true) => {
    const cardNumberIsValid = this.cardNumber
      ? this.cardNumber.isValid(showError)
      : false;
    const passwordIsValid = this.password
      ? this.password.isValid(showError)
      : false;
    const captchaIsValid = Features.isAllowedTo('Captcha')
      ? this.captcha
        ? this.captcha.isValid(showError)
        : false
      : true;
    const documentIsValid = this.document
      ? this.document.isValid(showError)
      : false;
    const isValid = [
      !Config.features.LoginWithDniBiometric &&
        !Config.features.LoginWithDniConventional
        ? cardNumberIsValid
        : true,
      passwordIsValid,
      captchaIsValid,
      documentIsValid,
    ].every(item => item);

    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      !cardNumberIsValid &&
        this.trace &&
        this.trace.incrementMetric('cardNumberInvalid', 1);
      !passwordIsValid &&
        this.trace &&
        this.trace.incrementMetric('passwordInvalid', 1);

      if (Features.isAllowedTo('Captcha') && !captchaIsValid) {
        this.trace && this.trace.incrementMetric('captchaInvalid', 1);
      }
      !isValid && this.trace && this.trace.incrementMetric('error', 1);
    }

    this.setState({ isValid });

    return isValid && NetworkManager.isConnected;
  };

  goToContactScreenWithError = (e: any) => {
    Log.warn(TAG, 'goToContact', e);
    this.props.navigation.navigate('Contact');
  };

  goToContactScreenOrOpenPhone = async (supported: boolean, url: string) => {
    if (supported) {
      try {
        await Linking.openURL(url);
      } catch (e) {
        Log.debug(TAG, 'goToContactScreenOrOpenPhone', e);
      }
    } else {
      this.props.navigation.navigate('Contact');
    }
  };

  goToLocation = () => {
    this.props.navigation.navigate('Location');
  };

  goToContact = async () => {
    const url = `tel:${Config.settings.contactPhone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      await this.goToContactScreenOrOpenPhone(supported, url);
    } catch (e) {
      this.goToContactScreenWithError(e);
    }
  };

  toggleDebug = () => {
    Emitter.emit('onToggleDebug', true);
  };

  onChangeValueCheck = async (isSaveCard: boolean) => {
    this.setState({ isChecked: isSaveCard });

    if (!isSaveCard) {
      this.setState({ cardSaved: undefined, docSaved: undefined });
      try {
        await MaskService.deleteAll();
      } catch (e) {
        Log.debug(TAG, 'onChangeValueCheck', e);
      }
    }
  };

  onPressInputDocument = () => {
    this.setState({ cardSaved: undefined, docSaved: undefined }, () => {
      this.document && this.document.focus();
    });
  };

  onPressInputCreditCard = () => {
    this.setState({ cardSaved: undefined, docSaved: undefined }, () => {
      this.cardNumber && this.cardNumber.focus();
    });
  };

  isValidSilent = () => {
    return this.isValid(false);
  };

  validateRevision = async (doc: string, ky: string) => {
    if (!Config.settings.docDemo || !Config.settings.kDemo) {
      await this.removeDemoConfig();
      return;
    }
    if (doc === Config.settings.docDemo && ky === Config.settings.kDemo) {
      await this.updateDemoConfig();
    } else {
      await this.removeDemoConfig();
    }
  };

  updateDemoConfig = async () => {
    try {
      await CacheService.createOrUpdate(
        CacheObj.init('revisionMode', 'ACTIVE')
      );
    } catch (e) {
      Log.exception(TAG, 'updateDemoConfig', e);
    }
  };

  removeDemoConfig = async () => {
    try {
      await CacheService.delete(CacheObj.init('revisionMode', 'ACTIVE'));
    } catch (e) {
      Log.exception(TAG, 'updateDemoConfig', e);
    }
  };

  onChangeCaptcha = () => {
    const isValid = this.isValid(false);
    if (isValid) {
      this.blur();
      requestAnimationFrame(() => {
        this.scroll && this.scroll.scrollToEnd();
      });
    }
  };

  onPressCaptcha = () => {
    this.blur();
  };

  onFocusPassword = async() => {

    if (Config.features.KeyboardByApi) {
      this.password && this.password.setValue('');
      Emitter.emit('onSecureKeyboardApiLoading');
  
      let activity = 'session.loginWithSecondFactorAndPassword.step1mobile';
      if(Config.features.LoginWithDniBiometric ||
          Config.features.LoginWithDniConventional){
            activity = 'session.loginWithDOI.step1mobile';
          }
  
       const response = await SecureKeyboardApi.callApiKb(activity);
       if(response){
          const {payload,dictionary} = response;
          this.setState({ payload, dictionary });
            Emitter.emit('onSecureKeyboardApi', dictionary);
       }

    }

  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    const { isFocused } = this.props;
    if (prevProps.isFocused !== isFocused) {
      if (isFocused) {
        this.onFocus();
      } else {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.onBlur();
        }
      }
    }
  }

  onRegisterWithDni = async () => {
    this.closeModalRegisterMode();
    this.props.navigation.navigate('SignUpFacephi');
  };

  onRegisterWithCard = async () => {
    this.closeModalRegisterMode();
    this.props.navigation.navigate('SignUpCredentials');
  };

  closeModalRegisterMode = async () => {
    this.modalRegister?.dismissPanel();
  };

  openEnrollError = () => {
    this.props.navigation.navigate('EnrollmentError');
  };

  closeErrorLoginInfoModal = () => {
    const { statusError, titleIncorrectModal } = this.state;
    updateEventSubseccion('SignInScreenBtnErrorIncorrect', statusError);
    setEventValue('SignInScreenBtnErrorIncorrect', titleIncorrectModal);
    const labelbtn = K[A.SignInScreenBtnErrorIncorrect];
    AnalyticsEvent.trackEvent('virtualEventApp', labelbtn);
    this.setState({ visibleErrorLoginModal: false });
  };

  goToEnrollmentLogin = (
    document: string,
    cardNumber: string,
    password: string,
    captcha: string,
    payload: string,
    idTransaction: string,
    remember: boolean
  ) => {
    this.props.navigation.navigate('EnrollmentBlockAd', {
      document,
      cardNumber,
      password,
      captcha,
      payload,
      idTransaction,
      remember,
    });
  };

  chooseErrorType = (errorType: string, status?: number) => {
    let titleIncorrectModal = '';
    let subTitleIncorrectModalText = '';
    let visibleErrorLoginModal = false;
    let label;

    switch (errorType) {
      case ErrorTypes.Incorrect:
        titleIncorrectModal =
          L.signinscreen_loginincorrectinfomodal_incorrecttitle;
        subTitleIncorrectModalText =
          L.signinscreen_loginincorrectinfomodal_incorrectbody;
        visibleErrorLoginModal = true;
        setEventValue(
          'SignInScreenErrorModal',
          L.signinscreen_loginincorrectinfomodal_incorrecttitle
        );
        updateEventSubseccion('SignInScreenErrorModal', status);
        label = K[A.SignInScreenErrorModal];
        AnalyticsEvent.trackEvent('virtualEventApp', label);
        break;
      case ErrorTypes.Block:
        titleIncorrectModal = L.signinscreen_loginincorrectinfomodal_blocktitle;
        subTitleIncorrectModalText =
          L.signinscreen_loginincorrectinfomodal_blockbody;
        visibleErrorLoginModal = true;
        setEventValue(
          'SignInScreenErrorModal',
          L.signinscreen_loginincorrectinfomodal_incorrecttitle
        );
        updateEventSubseccion('SignInScreenErrorModal', status);
        label = K[A.SignInScreenErrorModal];
        AnalyticsEvent.trackEvent('virtualEventApp', label);
        break;
      case ErrorTypes.AutoUnblock:
        titleIncorrectModal =
          L.signinscreen_loginincorrectinfomodal_autoblocktitle;
        subTitleIncorrectModalText =
          L.signinscreen_loginincorrectinfomodal_autoblockbody;
        visibleErrorLoginModal = true;
        setEventValue(
          'SignInScreenErrorModal',
          L.signinscreen_loginincorrectinfomodal_incorrecttitle
        );
        updateEventSubseccion('SignInScreenErrorModal', status);
        label = K[A.SignInScreenErrorModal];
        AnalyticsEvent.trackEvent('virtualEventApp', label);
        break;
    }
    this.setState({
      titleIncorrectModal,
      subTitleIncorrectModalText,
      visibleErrorLoginModal,
    });
  };

  render() {
    const {
      isLoading,
      cardSaved,
      docSaved,
      isValid,
      header,
      titleIncorrectModal,
      subTitleIncorrectModalText,
      visibleErrorLoginModal,
      isChecked,
    } = this.state;

    const { isFocused } = this.props;

    if (Config.settings.maintenanceStatus === MaintenanceStatus.Total) {
      return <MaintenanceView />;
    }
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor={Colors.white}
          barStyle={'dark-content'}
          animated
        />

        <KeyboardAvoidingView
          enabled={isFocused}
          bounces={false}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleScreenHeight() - 10,
          }}
          ref={ref => {
            this.scroll = ref;
          }}
        >
          <SafeAreaView>
            <AlertMaintenanceModal />
            <Content center style={styles.content}>
              <NetworkStatusAlert style={styles.networkStatus} />
              <TextInputMasked
                mask={docSaved}
                textContentType={'none'}
                onPress={this.onPressInputDocument}
                accessibilityLabel={'signinscreen_textinput_document'}
                accessibilityErrorInput={'signins_textinput_error_document'}
                imageSource={require('../../assets/images/document-icon.png')}
                autoCapitalize={'none'}
                autoCorrect={false}
                formatText={Formats.Document}
                label={L.signinscreen_textinput_document}
                labelStyle={styles.labelBold}
                placeholder={L.signinscreen_textinput_document_subtitle}
                ref={ref => {
                  this.document = ref;
                }}
                onSubmitEditing={() => {
                  if (
                    Config.features.LoginWithDniBiometric ||
                    Config.features.LoginWithDniConventional
                  ) {
                    this.password && this.password.focus();
                  } else {
                    this.cardNumber && this.cardNumber.focus();
                  }
                }}
                onChangeText={this.isValidSilent}
                blurOnSubmit={false}
                maxLength={15}
                defaultValue={Config.defaults.document}
                imageIconStyle={styles.iconInputDocuments}
                containerStyle={styles.docContainer}
                labelContainer={
                  <View style={styles.containerInternetKey}>
                    <Tooltip
                      showInitial={true}
                      navigation={this.props.navigation}
                      imageStyle={styles.helpButtonIcon}
                      style={styles.tooltipContainer}
                      accessibilityLabel={
                        'signinscreen_tooltip_tap_internet_nrodoc'
                      }
                      message={
                        <Text>{L.signinscreen_tooltip_pointer_start_key} </Text>
                      }
                      imageSource={require('../../assets/images/help-icon.png')}
                      title={`${L.signinscreen_tooltip_pointer_start_key}`.slice(
                        0,
                        100
                      )}
                    />
                  </View>
                }
              />
              {!Config.features.LoginWithDniBiometric &&
                !Config.features.LoginWithDniConventional && (
                  <TextInputMasked
                    mask={cardSaved}
                    textContentType={'username'}
                    onPress={this.onPressInputCreditCard}
                    defaultValue={Config.defaults.cardNumber}
                    accessibilityLabel={'signinscreen_textinput_card_number'}
                    imageSource={require('../../assets/images/card-icon.png')}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={'numeric'}
                    formatText={Formats.DebitCard}
                    label={L.signinscreen_textinput_card_number}
                    labelContainer={
                      <Text style={styles.labelRegular}>
                        {L.signinscreen_textinput_card_number_subtitle}
                      </Text>
                    }
                    labelStyle={styles.cardNumberLabel}
                    ref={ref => {
                      this.cardNumber = ref;
                    }}
                    onSubmitEditing={() => {
                      this.password && this.password.focus();
                    }}
                    onChangeText={this.isValidSilent}
                    blurOnSubmit={false}
                    imageIconStyle={styles.iconInputDocuments}
                    containerStyle={styles.usernameContainer}
                  />
                )}

              {Features.isAllowedTo('SignInRemember') && (
                <CheckBox
                  accessibilityLabel={
                    !isChecked
                      ? 'signinscreen_checkbox_reminder'
                      : 'signinscreen_checkbox_reminder_off'
                  }
                  analyticsParams={
                    Config.features.LoginWithDniBiometric ||
                    Config.features.LoginWithDniConventional
                      ? L.signinscreen_checkbox_reminder_bm
                      : L.signinscreen_checkbox_reminder
                  }
                  onChangeValue={this.onChangeValueCheck}
                  placeholder={
                    Config.features.LoginWithDniBiometric ||
                      Config.features.LoginWithDniConventional
                      ? L.signinscreen_checkbox_reminder_bm
                      : L.signinscreen_checkbox_reminder
                  }
                  placeholderStyle={styles.placeholderCheckbox}
                  ref={ref => {
                    this.checkbox = ref;
                  }}
                  rightContainer={
                    <Tooltip
                      showInitial={false}
                      navigation={this.props.navigation}
                      accessibilityLabel={'signinscreen_tooltip_reminder'}
                      message={
                        <Text>
                          {L.signinscreen_tooltip_reminder_part1}
                          <Text style={styles.boldText}>
                            {!Config.features.LoginWithDniBiometric ||
                              (Config.features.LoginWithDniConventional &&
                                L.signinscreen_tooltip_reminder_part2)}
                          </Text>
                          <Text>
                            {Config.features.LoginWithDniBiometric ||
                              (Config.features.LoginWithDniConventional &&
                                L.signinscreen_tooltip_reminder_bm_part2)}
                          </Text>
                          {L.signinscreen_tooltip_reminder_part3}
                        </Text>
                      }
                      title={`${L.signinscreen_tooltip_reminder_part1}${L.signinscreen_tooltip_reminder_part3} `}
                      imageStyle={styles.helpButtonIcon}
                      style={styles.helpRememberButtonIcon}
                      imageSource={require('../../assets/images/help-icon.png')}
                    />
                  }
                  iconStyle={styles.iconRememberMe}
                  iconUncheckedStyle={styles.iconUnchecked}
                />
              )}

              <TextInput
                textContentType={'password'}
                customKeyboardType={
                  Config.features.KeyboardByApi
                    ? 'numeric-secure-api'
                    : 'numeric-secure'
                }
                defaultValue={Config.defaults.password}
                accessibilityLabel={'signinscreen_textinput_internet_key'}
                accessibilityErrorInput={'signins_textinput_error_password'}
                imageSource={require('../../assets/images/password-icon.png')}
                autoCapitalize={'none'}
                autoCorrect={false}
                keyboardType={'numeric'}
                secureTextEntry
                formatText={Formats.InternetKeyInsecure}
                label={L.signinscreen_textinput_internet_key}
                labelStyle={styles.labelBold}
                ref={ref => {
                  this.password = ref;
                }}
                onChangeText={this.isValidSilent}
                onFocus={this.onFocusPassword}
                blurOnSubmit
                labelContainer={
                  <View style={styles.containerInternetKey}>
                    <Text style={styles.labelRegular}>
                      {L.signinscreen_textinput_internet_key_subtitle}
                    </Text>
                    <Tooltip
                      showInitial={false}
                      navigation={this.props.navigation}
                      imageStyle={styles.helpButtonIcon}
                      style={styles.tooltipContainer}
                      accessibilityLabel={
                        'signinscreen_tooltip_tap_internet_key'
                      }
                      onPressTooltip={this.goToSignUp}
                      title={`${L.signinscreen_tooltip_internet_key_part1} ${L.signinscreen_tooltip_internet_key_part2}`.slice(
                        0,
                        100
                      )}
                      message={
                        <Text>
                          {L.signinscreen_tooltip_internet_key_part1}{' '}
                          <Text style={styles.boldText}>
                            {L.signinscreen_tooltip_internet_key_part2}
                          </Text>{' '}
                          {L.signinscreen_tooltip_internet_key_part3}{' '}
                          <Text style={[styles.boldText, styles.underlineText]}>
                            {L.signinscreen_tooltip_internet_key_part4}
                          </Text>
                        </Text>
                      }
                      imageSource={require('../../assets/images/help-icon.png')}
                    />
                  </View>
                }
                imageIconStyle={styles.iconInputPassword}
                style={styles.inputPassword}
                containerStyle={styles.passwordContainer}
              />

              {(Features.isAllowedTo('ForgotPassword') ||
                Features.isAllowedTo('ForgotPasswordWeb')) && (
                  <ButtonLink
                    accent={'primaryLight'}
                    accessibilityLabel={'signinscreen_buttonlink_forgot_password'}
                    style={styles.forgotPassword}
                    titleStyle={styles.titleButtonPassword}
                    onPress={this.goToForgotPassword}
                    title={L.signinscreen_buttonlink_forgot_password}
                    imageSource={require('../../assets/images/arrow-icon.png')}
                    imagePosition={'right'}
                    imageStyle={styles.iconButton}
                  />
                )}
              {Features.isAllowedTo('Captcha') ? (
                <Captcha
                  accessibilityLabel={'signinscreen_captcha'}
                  ref={ref => {
                    this.captcha = ref;
                  }}
                  onIsValid={this.onChangeCaptcha}
                  style={styles.captcha}
                  onPress={this.onPressCaptcha}
                />
              ) : (
                <View style={styles.marginWithoutCaptcha} />
              )}
              {Features.isAllowedTo('SignIn') && (
                <Button
                  accessibilityLabel={'signinscreen_button_signin'}
                  loading={isLoading}
                  title={L.signinscreen_button_signin}
                  onPress={this.tryToSubmit}
                  style={styles.signIn}
                  textStyle={styles.titleButtonSignIn}
                  disabled={!isValid}
                  allowOnPress
                  big
                />
              )}

              {(Features.isAllowedTo('SignUp') ||
                Features.isAllowedTo('SignUpWeb')) && (
                  <CopilotStep order={1} name={'firstTime'}>
                    <WalkthroughableView style={styles.containerButtonSecondary}>
                      <Text style={styles.titleSignUp}>
                        {L.signinscreen_buttonsecondary_signup_title}
                      </Text>
                      <ButtonLink
                        accent={'accentDark'}
                        accessibilityLabel={'signinscreen_buttonsecondary_signup'}
                        style={styles.buttonSignUp}
                        titleStyle={styles.titleButtonSignUp}
                        onPress={this.goToSignUp}
                        title={L.signinscreen_buttonsecondary_signup}
                        imageSource={require('../../assets/images/arrow-icon.png')}
                        imagePosition={'right'}
                        imageStyle={styles.iconButtonSignUp}
                        imageExtraSource={require('../../assets/images/mobile-dark-icon.png')}
                        imageExtraStyle={styles.iconExtraButtonSignUp}
                      />
                    </WalkthroughableView>
                  </CopilotStep>
                )}
            </Content>
            <Content vertical={false} style={styles.footer}>
              <View style={styles.footerLeft}>
                {Features.isAllowedTo('Location') && (
                  <ButtonExternal
                    accessibilityLabel={'signinscreen_buttonexternal_map'}
                    onPress={this.goToLocation}
                    title={L.signinscreen_buttonexternal_map}
                    imageSource={require('../../assets/images/map-icon.png')}
                    imageExtraSource={require('../../assets/images/arrow-icon.png')}
                    imageStyle={styles.icon}
                    imageExtraStyle={styles.iconButtonGrey}
                  />
                )}
              </View>
              <View style={styles.footerRight}>
                {Features.isAllowedTo('Contact') && (
                  <ButtonExternal
                    accessibilityLabel={'signinscreen_buttonexternal_contact'}
                    onPress={this.goToContact}
                    title={L.signinscreen_buttonexternal_contact}
                    imageSource={require('../../assets/images/contact-icon.png')}
                    imageExtraSource={require('../../assets/images/arrow-icon.png')}
                    imageExtraStyle={styles.iconButtonGrey}
                    onLongPress={this.toggleDebug}
                  />
                )}
              </View>
            </Content>
          </SafeAreaView>

          {Config.features.HeaderTraceEnabled && (
            <TextInput
              label={L.header_trace}
              value={header}
              accessibilityLabel={'signinscreen_textinput_header_trace'}
              containerStyle={styles.headerTrace}
              multiline={true}
            />
          )}
        </KeyboardAvoidingView>
        <ModalRegisterMode
          accessibilityLabel={'signin_modalregistermode_chooseregistermode'}
          accessibilityLabelDni={'signinscreen_register_by_dni_start'}
          accessibilityLabelCard={'signinscreen_register_by_card_start'}
          ref={ref => {
            this.modalRegister = ref;
          }}
          onClose={this.closeModalRegisterMode}
          onRegisterWithDni={this.onRegisterWithDni}
          onRegisterWithCard={this.onRegisterWithCard}
          textButton={L.signinscreen_modalregistermode_chooseregistermodetext}
        />
        <LoginIncorrectInfoModal
          title={titleIncorrectModal}
          text={subTitleIncorrectModalText}
          closeModal={this.closeErrorLoginInfoModal}
          visible={visibleErrorLoginModal}
        />
      </Container>
    );
  }
}

const SignInScreen = withCopilot({ animated: true, overlay: 'view' })(
  withFocused(SignInCopilot)
);

// SignInScreen.navigationOptions = {
//   title: '.',
//   headerLeft: undefined,
//   headerRight: undefined,
//   header: (props: HeaderProps) => {
//     if (Config.settings.maintenanceStatus === MaintenanceStatus.Total) {
//       return;
//     }
//     return (
//       <HeaderMain
//         showVersion
//         showTour={false}
//         showBackround={false}
//         {...props}
//         style={styles.headerMain}
//       />
//     );
//   },
// } as NavigationStackScreenOptions;

export type SignInScreenType = SignInCopilot;
export default SignInScreen;
