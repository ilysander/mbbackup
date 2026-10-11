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
  TextInputMasked,
  Button,
  Loading,
  Alert,
  AlertModalUpdate,
  DetailItem,
  Touchable,
  ModalEndorsement,
} from '../../../components/ui';
import FeesRowExpandible from '../../../components/loans/FeesRowExpandible';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import AccountSelector from '../../../components/transfers/AccountSelector';
import Log from '../../../resources/log/Log';
import API from '../../../api';
import { Validate, Font, Sanitizer } from '../../../resources/functions';
import {
  AccountsType,
  Colors,
  ErrorRequest,
  CreditLineOffer,
} from '../../../resources/constants';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  View,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  InteractionManager,
  ImageStyle,
  Animated,
  Image,
  Platform,
} from 'react-native';
import { MaskModel, MaskObj } from '../../../resources/persistence/models';
import NetworkManager from '../../../components/network/NetworkManager';
import { Amount } from '../../../resources/money';
import {
  ContentCreditLine,
  AccountItemSavingsAll,
  InsuranceItem,
  PreferencesUserDataModifyPreResponse,
  LoanPreviewResponse,
} from '../../../api/backend/response/Execute';
import Session from '../../../api/Session';
import { KeyboardUtil } from '../../../resources/util';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import ExpandableView from '../../../components/ui/ExpandableView';
import CardEmailNotify from '../../../components/email/CardEmailNotify';
import ModalInfoChangeEmail from '../../../components/email/ModalInfoChangeEmail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const initialBottomModal = Size.getProportionalHeight(-2);
const finalBottomModal = 0;
const animationEmergingModalTime = 450;

const styles = StyleSheet.create({
  formText: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
  } as TextStyle,
  formLabel: {
    marginBottom: 20,
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as ViewStyle,
  formLabelError: {
    marginBottom: 20,
    ...Font(),
    color: Colors.danger,
    fontSize: 14,
  } as ViewStyle,
  detailText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  detailTextBold: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  textHelp: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.brown,
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
  supplyCode: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 19,
  } as TextStyle,

  buttons: {
    marginBottom: 50,
    marginTop: 30,
  } as ViewStyle,
  marginTop: {
    marginTop: 28,
  } as ViewStyle,
  titleStyle: {
    fontSize: 30,
    lineHeight: 36,
  } as TextStyle,
  card: {
    paddingTop: 20,
    paddingBottom: 0,
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  cardMore: {
    paddingTop: 0,
    paddingBottom: 6,
    marginTop: 8,
  } as ViewStyle,
  cardOptions: {
    paddingTop: 0,
    paddingBottom: 6,
    marginTop: 6,
    marginBottom: 6,
  } as ViewStyle,
  subtitle: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 18,
    textAlign: 'center',
    color: Colors.grey6,
  } as TextStyle,
  subtitleGreen: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
  } as TextStyle,
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  detailsRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  insurancesTitle: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
    paddingTop: 0,
  } as TextStyle,
  insuranceDescription: {
    marginBottom: 13,
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  insuranceAmount: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 15,
  } as TextStyle,
  header: {
    marginVertical: 6,
  } as ViewStyle,
  expandableView: {
    paddingHorizontal: 20,
    marginTop: 10,
  } as ViewStyle,
  detailsLoading: {
    marginVertical: 20,
  } as ViewStyle,
  feeLoading: {
    marginVertical: 0,
  } as ViewStyle,
  alertTextTitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    fontSize: 18,
    color: Colors.accentDark,
    marginBottom: 20,
    marginTop: 10,
  } as TextStyle,
  alertTextMessage: {
    ...Font(),
    fontSize: 16,
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  alertButton: {
    width: '100%',
  } as ViewStyle,
  itemSelector: {
    marginBottom: 20,
  } as ViewStyle,

  forgotPassword: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,

  titleButtonSignUp: {
    fontSize: 16,
  } as TextStyle,
  titleButtonPassword: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  iconButtonForgot: {
    tintColor: Colors.primaryLight,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  editEmail: {
    marginTop: 2,
  } as ViewStyle,
  infoDocumentModal: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  } as ViewStyle,
  textActionInfoDocument: {
    color: 'white',
    fontSize: 16,
  } as TextStyle,
  viewActionInfoDocument: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    width: 280,
    height: 40,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  titleModalText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 18,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  insurancesContainer: {
    marginTop: 27,
  },
  insurancesTextContainer: {
    paddingLeft: 35,
    paddingTop: 0,
  },
  insuranceMoreContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  insuranceMoreSymbol: {
    fontSize: 30,
    paddingRight: 5,
    lineHeight: 30,
    marginBottom: 20,
    ...Font(),
    color: Colors.grey5,
  } as TextStyle,
  insuranceMoreDescription: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 13,
    paddingRight: 20,
  } as TextStyle,
  insuranceMoreTitle: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 11,
    marginBottom: 4,
    marginTop: 14,
  } as TextStyle,
  marginDetail: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  } as ViewStyle,
  textDetail: {
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
  tooltipContainer: {
    marginLeft: 60,
    position: 'absolute',
    top: 36,
  } as ViewStyle,
  helpButtonIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.secondary,
  } as ImageStyle,
  text: {
    ...Font(),
    color: Colors.grey5,
  } as TextStyle,
  igvText: {
    ...Font(),
    color: Colors.grey5,
    marginTop: 10,
  } as TextStyle,
  containerHelpDetail: {
    marginVertical: 10,
  } as ViewStyle,
  labelAskEndorsement: {
    ...Font(),
    color: Colors.brown,
  } as TextStyle,
  marginExpandableView: {
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey6,
    shadowOffset: { height: 4, width: 0 },
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    borderColor: Colors.grey2,
    elevation: 3,
    overflow: 'visible',
    paddingVertical: 10,
    padding: 5,
    paddingHorizontal: 15,
  } as ViewStyle,
  iconToolTip: {
    tintColor: Colors.brown,
    width: 16,
    height: 16,
    resizeMode: 'stretch',
    justifyContent: 'center',
  } as ImageStyle,
  openEndorsementView: {
    flexDirection: 'row',
    marginVertical: 10,
  } as ViewStyle,
  openEndorsementLabel: {
    justifyContent: 'center',
  } as ViewStyle,
  imageButtonlinkView: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  } as ViewStyle,
});
export interface Params {
  creditLine: ContentCreditLine;
  locked: boolean;
  seedA: 'eat_urpi_pres' | 'eat_urpi_ini';
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  indexTarget: number;
  optionList: number[];
  isLoading: boolean;
  accounts: AccountItemSavingsAll[];
  insurances: InsuranceItem[];
  creditLine?: ContentCreditLine;
  optionItemToRemove?: string;
  emailMasked?: MaskModel;
  user?: PreferencesUserDataModifyPreResponse;
  isValid: boolean;
  dataPreview?: LoanPreviewResponse;
  showLockAlert: boolean;
  showRemoveAlert: boolean;
  locked: boolean;
  isShowModalCancel: boolean;
  isLoadingFee: boolean;
  isShowModalChangeEmail: boolean;
  askForChange: boolean;
  openEndorsementModal: boolean;
  bottomPositionEmergingModal: Animated.Value;
}
const TAG = '[InstantCashShortStartScreen]';
class InstantCashShortStartScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    indexTarget: -1,
    optionList: [0, 1, 2, 3],
    optionItemToRemove: undefined,
    isLoading: false,
    creditLine: undefined,
    accounts: [],
    insurances: [],
    isValid: false,
    dataPreview: undefined,
    showLockAlert: false,
    showRemoveAlert: false,
    locked: false,
    isShowModalCancel: false,
    isLoadingFee: false,
    isShowModalChangeEmail: false,
    askForChange: false,
    openEndorsementModal: false,
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
  };

  interaction!: any;
  target!: AccountSelector | null;
  emailInput!: TextInputMasked | null;

  componentDidMount() {
    this.load();
  }

  load = async () => {
    await this.loadAccounts();
    await this.loadProfile();
    const { route } = this.props;
    const { insurances } = this.state;
    const ids = insurances.map(e => e.id).join(',');
    const selecteds = insurances.map(e => (e.selected ? 1 : 0)).join(',');

    const creditLine = route.params && route.params.creditLine;
    const locked = route.params ? route.params.locked : false;

    const { user } = this.state;
    if (user && user._mail) {
      const masked = Sanitizer.maskEmail(user._mail);
      const emailMasked = MaskObj.init(user._mail, masked);
      this.setState({ emailMasked });
      this.isValid(false);
    }
    this.setState({ creditLine, locked, isLoadingFee: false });

    if (locked) {
      return;
    }

    try {
      const params = {
        valueDate: '',
        debitAccount: '-999999',
        mail: 'abc@gmail.com',
        creditLine: creditLine.creditLine,
        payDay: creditLine.payDay.toString(),
        currency: creditLine.currencyKey + '',
        amount: creditLine.capitalAmount.toString(),
        typeOfOffer: CreditLineOffer.TypeOfOffer.Request,
        requestnumber: creditLine.requestNumber,
        requestType: CreditLineOffer.RequestType.Urpi,
        insurances: { ids, selecteds },
      };
      const response = await API.Execute.requestLoanPrePreview(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
        throw new Error(L.error_request_default);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const dataPreview = response.body.data as LoanPreviewResponse;
        this.setState({
          dataPreview,
          insurances: dataPreview.insurances ? dataPreview.insurances : [],
        });
        this.isValid(false);
      } else {
        const dataError = response.body.data as DefaultErrorResponse;
        if (dataError.NO_FIELD === 'Por favor, seleccione otro día de pago.') {
          this.setState({ askForChange: true });
        } else {
          throw new Error(L.error_request_default);
        }
      }
    } catch (e) {
      Log.exception(TAG, 'signIn', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'signIn',
        e,
      });
    }
  };
  loadProfile = async () => {
    const { isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadProfile', response);
      }
      const user = response.body.data;
      this.setState({ user });
    } catch (e) {
      Log.exception(TAG, 'loadProfile', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadProfile',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  loadAccounts = async () => {
    const { isLoading } = this.state;
    if (isLoading) {
      Log.info(TAG, 'loadAccounts', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      let { accounts } = response.body.data;
      const validTypes = [AccountsType.SAVING_ACCOUNTS.family];
      accounts = (accounts || []).filter(account =>
        validTypes.includes(account.family)
      );
      const indexTarget = accounts.length > 1 ? -1 : 0;
      this.setState({ accounts, indexTarget });
    } catch (e) {
      Log.info(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  changeTargetAccount = (indexTarget: number) => {
    const { accounts } = this.state;
    const validSelectedIndex = indexTarget > -1;
    const value = validSelectedIndex ? accounts[indexTarget] : undefined;
    AnalyticsEvent.track(A.instantcashshortstartscreen_accountselector_target_urpi, Sanitizer.getProductTitle(value))
    AnalyticsEvent.track(A.instantcashshortstartscreen_accountselector_target);
    this.setState({ indexTarget }, () => {
      this.isValidAccountTarget();
      this.isValid(false);
    });
  };

  getEmail = () => {
    const { emailMasked } = this.state;
    if (emailMasked) {
      return emailMasked.value || '';
    }
    return '';
  };

  onSelectOption = (index: string, selected?: boolean) => {
    this.blur();
    const { insurances } = this.state;
    if (!selected) {
      const elementIndex = insurances.findIndex(
        element => element.id === index
      );
      const newInsurances = [...insurances];
      newInsurances[elementIndex] = {
        ...newInsurances[elementIndex],
        selected: true,
      };
      this.setState({ insurances: newInsurances, isLoadingFee: true }, () => {
        this.isValid();
        this.load();
      });
    } else {
      this.setState({ showRemoveAlert: true, optionItemToRemove: index });
    }
  };

  onOptionRemove = () => {
    const { optionItemToRemove, insurances } = this.state;
    if (optionItemToRemove !== undefined) {
      const elementIndex = insurances.findIndex(
        element => element.id === optionItemToRemove
      );
      const newInsurances = [...insurances];
      newInsurances[elementIndex] = {
        ...newInsurances[elementIndex],
        selected: false,
      };
      this.setState(
        {
          insurances: newInsurances,
          showRemoveAlert: false,
          isLoadingFee: true,
        },
        () => {
          this.isValid();
          this.load();
        }
      );
    }
  };

  isValidEmail = () => {
    const email = this.getEmail();
    return !!email;
  };

  isValid = (showError = true) => {
    const isValidAccountTarget = this.isValidAccountTarget(showError);
    const isValidEmail = this.isValidEmail();
    const { dataPreview } = this.state;
    const isValid = [isValidAccountTarget, isValidEmail, dataPreview].every(
      item => !!item
    );
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  isValidAccountTarget = (showError = true) => {
    if (!this.target) {
      return false;
    }
    showError && this.target.clearError();
    const { indexTarget } = this.state;
    if (indexTarget === -1) {
      showError &&
        this.target.setError(
          L.instantcashshortstartscreen_error_account_target
        );
      return false;
    }
    return true;
  };

  getAccountTarget = () => {
    const { accounts, indexTarget } = this.state;
    if (indexTarget < 0) {
      return undefined;
    }
    return accounts[indexTarget];
  };

  getInsuranceSummary = (id: number) => {
    let bodyInsuranceSummary = '';
    switch (id) {
      case 1:
        bodyInsuranceSummary = L.insurance_summary_type_1;
        break;
      case 2:
        bodyInsuranceSummary = L.insurance_summary_type_2;
        break;
      case 3:
        bodyInsuranceSummary = L.insurance_summary_type_3;
        break;
      case 4:
        bodyInsuranceSummary = L.insurance_summary_type_4;
        break;
      case 5:
        bodyInsuranceSummary = L.insurance_summary_type_5;
        break;
      case 6:
        bodyInsuranceSummary = L.insurance_summary_type_6;
        break;
    }

    return bodyInsuranceSummary;
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
    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      const isValid = this.isValid(true);
      if (!isValid) {
        return;
      }
      this.setState({ isLoading: true });
      await this.submit();
      this.setState({ isLoading: false });
    });
  };

  submit = async () => {
    const { navigation, route } = this.props;
    const { insurances } = this.state;
    const creditLine = route.params && route.params.creditLine;
    const target = this.getAccountTarget();
    const email = this.getEmail();
    if (!target) {
      return;
    }

    const { locked } = this.state;
    if (locked) {
      this.setState({ showLockAlert: true });
      return;
    }

    const ids = insurances.map(e => e.id).join(',');
    const selecteds = insurances.map(e => (e.selected ? 1 : 0)).join(',');
    const insurancesList = insurances.filter(e => e.selected);

    const currency = creditLine.currencyKey + '';
    const params = {
      valueDate: '',
      debitAccount: target.idProduct,
      mail: email,
      creditLine: creditLine.creditLine,
      payDay: creditLine.payDay.toString(),
      amount: creditLine.capitalAmount.toString(),
      typeOfOffer: creditLine.typeOfOffer,
      requestnumber: creditLine.requestNumber,
      requestType: CreditLineOffer.RequestType.Urpi,
      currency,
      insurances: { ids, selecteds },
      deliverydocuments: {
        type: '1',
        _destination: email,
      },
    };
    try {
      const response = await API.Execute.requestLoanPreview(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const dataPreview = response.body.data;
        const seedA = route.params && route.params.seedA;


        navigation.navigate('InstantCashShortConfirm', {
          target,
          creditLine,
          email,
          dataPreview,
          currency,
          insurances: {
            ids,
            selecteds,
          },
          insurancesList,
          seedA,
        });
        const newSeedA = (seedA + '_calc_sig') as
          | 'eat_urpi_pres_calc_sig'
          | 'eat_urpi_ini_calc_sig';
        AnalyticsEvent.track(A[newSeedA]);
        AnalyticsEvent.track(A.eat_urpi_calc_sig);
        return;
      }

      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.creditAccount) {
        this.target && this.target.setError(error.creditAccount);
        hasError = true;
      }

      !hasError &&
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

  blur = () => {
    KeyboardUtil.hide();
  };

  closeLockAlert = () => {
    this.setState({ showLockAlert: false });
  };

  closeRemoveAlert = () => {
    this.setState({ showRemoveAlert: false });
  };

  closeModalTooltip = () => {
    this.setState({ isShowModalCancel: !this.state.isShowModalCancel });
  };

  actionModal = () => {
    AnalyticsEvent.track(A.instantcashshortstartscreen_modal_email_open_tooltip, L.instantcashshortstartscreen_alertmodal_title)
    this.closeModalTooltip();
  };

  changeShowModalChangeEmail = () => {
    this.setState({
      isShowModalChangeEmail: !this.state.isShowModalChangeEmail,
    });
  };

  toggleModalEmail = () => {
    AnalyticsEvent.track(A.instantcashshortstartscreen_modal_email_open, L.modalinfochangeemail_title)
    this.changeShowModalChangeEmail();
  };

  openEndorsementModal = async () => {
    await this.changeVisiblity(true);
    this.state.openEndorsementModal && this.showPanel();
  };

  closeEndorsementModal = async () => {
    this.dismissPanel();
  };
  changeVisiblity = async (val: boolean) => {
    this.setState({ openEndorsementModal: val });
  };
  showPanel() {
    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: finalBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start();
  }
  dismissPanel() {
    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: initialBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start(() => this.changeVisiblity(false));
  }

  render() {
    const {
      indexTarget,
      accounts,
      emailMasked,
      isValid,
      isLoading,
      locked,
      isLoadingFee,
      isShowModalChangeEmail,
      user,
      askForChange,
      openEndorsementModal,
      bottomPositionEmergingModal,
    } = this.state;
    const { navigation, route } = this.props;
    const {
      dataPreview,
      showLockAlert,
      showRemoveAlert,
      insurances,
    } = this.state;
    let { creditLine } = this.state;
    if (!creditLine) {
      creditLine = route.params && route.params.creditLine;

    }
    const currency = creditLine?.currencyKey + '';
    const loanUseId = creditLine?.loanUse;
    const loanDestination = creditLine?.loanDestinations.find(
      loanDestination => loanDestination.destinationId.toString() === loanUseId
    );
    const maxHeight =
      120 + insurances.filter(item => item.selected).length * 15;
    return (
      <Container>
        {showLockAlert && (
          <Alert
            message={
              <View>
                <Text style={styles.alertTextTitle}>
                  {L.instantcashshortstartscreen_alert_title}
                </Text>
                <Text style={styles.alertTextMessage}>
                  {L.instantcashshortstartscreen_alert_message}
                </Text>
              </View>
            }
            actionButton={{
              accessibilityLabel:
                'instantcashshortstartscreen_alert_button_understand',
              onPress: this.closeLockAlert,
              title: L.instantcashshortstartscreen_alert_button_understand,
              style: styles.alertButton,
            }}
          />
        )}
        <ModalEndorsement
          visible={openEndorsementModal}
          onClose={this.closeEndorsementModal}
          bottom={bottomPositionEmergingModal}
        />
        {showRemoveAlert && (
          <Alert
            message={
              <View>
                <Text style={styles.alertTextTitle}>
                  {L.instantcashshortstartscreen_alert_insurance_remove_title}
                </Text>
                <Text style={styles.alertTextMessage}>
                  {L.instantcashshortstartscreen_alert_insurance_remove_message}
                </Text>
              </View>
            }
            actionButton={{
              accessibilityLabel:
                'instantcashshortstartscreen_alert_button_agree',
              onPress: this.onOptionRemove,
              light: true,
              title: L.changecontactscreen_button_modal_trydelete_remove,
            }}
            cancelButton={{
              accessibilityLabel:
                'instantcashshortstartscreen_alert_button_cancel',
              onPress: this.closeRemoveAlert,
              light: false,
              title: L.changecontactscreen_button_modal_trydelete_close,
              style: styles.alertButton,
            }}
          />
        )}
        {!!user && isShowModalChangeEmail && (
          <ModalInfoChangeEmail
            accessibilityLabel={'instantcashshort_changeemailmodal'}
            onClose={this.changeShowModalChangeEmail}
            navigation={navigation}
            user={user}
          />
        )}
        <FormSteps current={1} total={3} />
        <SafeAreaView>
          <KeyboardAvoidingView
            enabled={true}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{
              minHeight: Size.getVisibleTabScreenHeight(),
            }}
          >
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <Header
                accessibilityLabel={'instantcashshortstartscreen_header_title'}
                style={styles.marginTop}
                title={L.instantcashshortstartscreen_header_title}
                center
              />
              <Header
                accessibilityLabel={'instantcashshortstartscreen_header_amount'}
                title={Amount.formatWithZero(
                  creditLine?.capitalAmount || 0,
                  creditLine?.currencyKey + ''
                )}
                style={styles.header}
                titleStyle={styles.titleStyle}
                center
              />
              <AlertModalUpdate
                titleStyle={styles.titleModalText}
                title={L.instantcashshortstartscreen_alertmodal_title}
                message={`${L.instantcashshortstartscreen_alertmodal_messagepart1}\n\n${L.instantcashshortstartscreen__alertmodal_messagepart2}`}
                messageStyle={styles.infoDocumentModal}
                visible={this.state.isShowModalCancel}
                actionButton={{
                  accessibilityLabel:
                    'instantcashshortstartscreen_alertmodal_actionbutton',
                  title: L.instantcashshortstartscreen_alertmodal_button,
                  preventClose: true,
                  onPress: this.closeModalTooltip,
                  textStyle: styles.textActionInfoDocument,
                  light: true,
                  style: styles.viewActionInfoDocument,
                }}
                onClose={this.closeModalTooltip}
              />

              {dataPreview ? (
                <>
                  <View style={styles.summaryContainer}>
                    <Text style={styles.subtitle}>
                      <Text style={styles.subtitleGreen}>
                        {dataPreview.term}{' '}
                        {dataPreview.term === '1'
                          ? L.instantcashshortstartscreen_text_part1_singular
                          : L.instantcashshortstartscreen_text_part1_plural}
                      </Text>
                      {L.instantcashshortstartscreen_text_part2}
                    </Text>
                    {isLoadingFee ? (
                      <Loading style={styles.feeLoading} />
                    ) : (
                      <Text style={styles.subtitle}>
                        <Text style={styles.subtitleGreen}>
                          {Amount.format(dataPreview.amountFee, currency)}
                        </Text>
                      </Text>
                    )}

                    <Text style={styles.subtitle}>
                      <Text>{L.instantcashshortstartscreen_text_part3}</Text>
                    </Text>
                  </View>

                  <View style={styles.insurancesContainer}>
                    {insurances.map(insurance => {
                      return (
                        <CardView style={styles.cardOptions} key={insurance.id}>
                          <View>
                            <FeesRowExpandible
                              accessibilityLabel={
                                'feesrowsexpandableview_toggle_active'
                              }
                              onPress={() => {
                                this.onSelectOption(
                                  insurance.id,
                                  insurance.selected
                                );
                              }}
                              selected={insurance.selected}
                              title={insurance.product.description}
                              mount={
                                insurance.rate.type === 1
                                  ? `${insurance.rate.value}%`
                                  : `${Amount.format(
                                    insurance.rate.value,
                                    currency
                                  )}`
                              }
                              style={styles.expandableView}
                              maxHeight={
                                this.getInsuranceSummary(insurance.type.id)
                                  .length /
                                2.1 +
                                160
                              }
                              position={'top'}
                            >
                              <View style={styles.insurancesTextContainer}>
                                <Text style={styles.insurancesTitle}>
                                  {
                                    L.instantcashshortstartscreen_text_insurance_type
                                  }
                                </Text>
                                <Text style={styles.insuranceDescription}>
                                  {insurance.type.description}
                                </Text>
                                <Text style={styles.insurancesTitle}>
                                  {
                                    L.instantcashshortstartscreen_text_insurance_total_amount
                                  }
                                </Text>
                                <Text style={styles.insuranceAmount}>
                                  {Amount.format(insurance.amount, currency)}
                                </Text>
                                <Text style={styles.insuranceMoreTitle}>
                                  {
                                    L.instantcashshortstartscreen_text_insurance_subtitle_list
                                  }
                                </Text>
                                <View style={styles.insuranceMoreContainer}>
                                  <Text
                                    style={[styles.insuranceMoreSymbol]}
                                  >{`•`}</Text>
                                  <Text style={styles.insuranceMoreDescription}>
                                    {this.getInsuranceSummary(
                                      insurance.type.id
                                    )}
                                  </Text>
                                </View>
                              </View>
                            </FeesRowExpandible>
                          </View>
                        </CardView>
                      );
                    })}
                  </View>
                  <ExpandableView
                    accessibilityLabel={
                      'instantcashshortstartscreen_resume_toogle_active'
                    }
                    style={styles.marginExpandableView}
                    maxHeight={maxHeight}
                  >
                    <DetailItem
                      label={L.instantcashchoosescreen_text_insurance}
                      accessibilityLabel={
                        'instantcashshortstartscreen_insurancedisposal'
                      }
                      text={Amount.format(
                        dataPreview.insuranceDisposal,
                        currency
                      )}
                      style={styles.marginDetail}
                      tooltipText={L.instantcashsuccessscreen_tooltip_message}
                      styleText={styles.textDetail}
                    />

                    <View style={styles.detailsRow}>
                      <Text style={styles.detailText}>
                        {L.instantcashshortstartscreen_text_itf}{' '}
                      </Text>
                      <Text style={styles.detailText}>
                        {Amount.format(dataPreview.itf, currency)}
                      </Text>
                    </View>
                    {insurances
                      .filter(item => item.selected)
                      .map(insurance => {
                        return (
                          <View style={styles.detailsRow} key={insurance.id}>
                            <Text style={styles.detailTextBold}>
                              {insurance.product.description}
                            </Text>
                            <Text style={styles.detailTextBold}>
                              {Amount.format(insurance.amount, currency)}
                            </Text>
                          </View>
                        );
                      })}
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailTextBold}>
                        {L.instantcashshortstartscreen_text_amounttodisburse}
                      </Text>
                      <Text style={styles.detailTextBold}>
                        {Amount.format(
                          creditLine?.amountToDisburse + '',
                          currency
                        )}
                      </Text>
                    </View>
                    <View style={styles.detailsRowBottom}>
                      <Text style={styles.detailTextBold}>
                        {L.instantcashshortstartscreen_text_tcea}
                      </Text>
                      <Text style={styles.detailTextBold}>
                        {dataPreview.rate}
                        {'%'}
                      </Text>
                    </View>
                    <View style={styles.containerHelpDetail}>
                      <Text style={styles.text}>
                        {L.instantcashshortstartscreen_text_help}
                      </Text>
                      <Text style={styles.igvText}>
                        {L.instantcashshortstartscreen_text_igv}
                      </Text>
                    </View>

                    <Touchable
                      accessibilityLabel={
                        'instantcashchoosescreen_choose_ask_endorsement'
                      }
                      onPress={this.openEndorsementModal}
                      style={styles.openEndorsementView}
                    >
                      <View style={styles.openEndorsementLabel}>
                        <Text style={[styles.labelAskEndorsement]}>
                          {L.instantcashshortstartscreen_buttonlink_title}
                        </Text>
                      </View>
                      <View style={styles.imageButtonlinkView}>
                        <Image
                          style={styles.iconToolTip}
                          source={require('../../../assets/images/help-icon.png')}
                        />
                      </View>
                    </Touchable>
                  </ExpandableView>
                </>
              ) : (
                <>
                  {!locked && !askForChange && (
                    <Loading style={styles.detailsLoading} />
                  )}
                </>
              )}

              <CardView padding style={styles.card}>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashshortstartscreen_text_pay_day'
                  }
                >
                  {L.instantcashshortstartscreen_text_pay_day}
                </Text>
                {locked ? (
                  <Text
                    style={styles.formLabelError}
                    accessibilityLabel={
                      'instantcashshortstartscreen_text_pay_day_description'
                    }
                  >
                    {
                      L.instantcashshortstartscreen_text_pay_day_description_locked
                    }
                  </Text>
                ) : askForChange ? (
                  <Text
                    style={styles.formLabelError}
                    accessibilityLabel={
                      'instantcashshortstartscreen_text_pay_day_description'
                    }
                  >
                    {
                      L.instantcashshortstartscreen_text_pay_day_description_askforchange
                    }
                  </Text>
                ) : (
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'instantcashshortstartscreen_text_pay_day_description'
                    }
                  >
                    {creditLine?.payDay +
                      ' ' +
                      L.instantcashshortstartscreen_text_pay_day_description}
                  </Text>
                )}
                {!!loanDestination && (
                  <>
                    <Text
                      style={styles.formText}
                      accessibilityLabel={
                        'instantcashshortstartscreen_text_amount'
                      }
                    >
                      {L.instantcashshortstartscreen_text_amount}
                    </Text>
                    <Text
                      style={styles.formLabel}
                      accessibilityLabel={
                        'instantcashshortstartscreen_text_destination_name_description'
                      }
                    >
                      {loanDestination.destinationName}
                    </Text>
                  </>
                )}
                <AccountSelector
                  readOnly={accounts.length < 2} // AccountSelector[readOnly] Esto es porque en esta vista se inicia sin cuentas, en la carga aparece 'seleccionar' cuando no tiene niguna, deberia tener un loader dentro del componente
                  accessibilityLabel={
                    'instantcashshortstartscreen_accountselector_title_target'
                  }
                  title={
                    L.instantcashshortstartscreen_accountselector_title_target
                  }
                  ref={ref => {
                    this.target = ref;
                  }}
                  values={accounts}
                  selectedIndex={indexTarget}
                  onPress={this.changeTargetAccount}
                />
                <View style={styles.marginTop} />
              </CardView>

              {!!emailMasked && (
                <CardEmailNotify
                  emailMasked={emailMasked}
                  actionModal={this.actionModal}
                  toggleModalEmail={this.toggleModalEmail}
                  titleTooltip={L.instantcashshortstartscreen_alertmodal_title}
                  message={L.instantcashshortscreen_cardemail_message}
                  tooltipMessage={L.instantcashshortscreen_cardemail_tooltip}
                  accessibilityLabelBase={'instantcashshortscreen_cardemail'}
                />
              )}
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={
                    'instantcashshortstartscreen_button_continue'
                  }
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  style={{ minHeight: 50, alignItems: 'center' }}
                  textStyle={{ fontSize: 16 }}
                  title={L.instantcashshortstartscreen_button_continue}
                />
              </View>
            </Content>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Container>
    );
  }
}

export type InstantCashShortStartScreenType = InstantCashShortStartScreen;
export default withFocused<InstantCashShortStartScreen, Props>(
  InstantCashShortStartScreen
);
