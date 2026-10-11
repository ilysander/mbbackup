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
  Modal,
  FormSteps,
  CardView,
  Button,
  Loading,
  Touchable,
  ButtonLink,
  ModalInsuranceInfoResume,
  ModalInsuranceConfirm,
} from '../../../components/ui';
import { FlatList } from 'react-native';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import Log from '../../../resources/log/Log';
import API from '../../../api';
import { Validate, Font } from '../../../resources/functions';
import { Colors } from '../../../resources/constants';
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
  Image,
} from 'react-native';
import NetworkManager from '../../../components/network/NetworkManager';
import { Amount } from '../../../resources/money';
import {
  ContentCreditLine,
  OptionsList,
  LoanDestination,
  AccountItemSavingsAll,
  PreferencesUserDataModifyPreResponse,
  InsuranceItem,
  InsuranceDetail,
} from '../../../api/backend/response/Execute';
import { KeyboardUtil } from '../../../resources/util';
import {
  A,
  AnalyticsEvent,
  AnalyticsLabelsType,
  K,
} from '../../../resources/analytics';
import Config from '../../../Config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setEventValue, updateEventSubseccion } from '../../../resources/analytics/AnalyticsEvent';

const styles = StyleSheet.create({
  amountText: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 15,
    color: Colors.grey6,
  } as TextStyle,
  title: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
  titleQuote: {
    ...Font({ weight: 'Regular' }),
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.grey6,
  } as TextStyle,
  titleCenter: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  titleBold: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
  titleBoldBig: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 16,
    color: Colors.grey6,
  } as TextStyle,
  titleBoldBox: {
    ...Font({ weight: 'Bold' }),
    fontSize: 16,
    color: Colors.primary,
    paddingLeft: 10,
  } as TextStyle,
  modalContainer: {
    height: 510,
    padding: 20,
    justifyContent: 'space-between',
  } as ViewStyle,
  imageStyle: {
    width: 80,
    height: 56,
  } as ImageStyle,
  buttons: {
    marginBottom: 50,
    marginTop: 30,
  } as ViewStyle,
  marginTop: {
    marginTop: 20,
  } as ViewStyle,
  titleStyle: {
    ...Font({ weight: 'Bold' }),
    fontSize: 26,
    lineHeight: 28,
    textAlign: 'center',
    color: Colors.primary,
  } as TextStyle,
  titleStyleSmall: {
    ...Font({ weight: 'Bold' }),
    color: Colors.secondary,
    fontSize: 22,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginTop: 10,
  } as TextStyle,
  card: {
    marginTop: 10,
    height: 195,
    margin: 10,
    width: '45%',
    justifyContent: 'space-between',
  } as ViewStyle,
  cardSelected: {
    marginTop: 10,
    width: '45%',
    height: 195,
    margin: 10,
    justifyContent: 'space-between',
    borderColor: Colors.primaryLight,
  } as ViewStyle,
  cardSumary: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    // margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  insuranceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  } as ViewStyle,
  insuranceLabel: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary,
    padding: 2,
    paddingLeft: 10,
    paddingRight: 5,
    marginRight: -20,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  } as ViewStyle,
  insuranceLabelText: {
    color: Colors.white,
    fontStyle: 'italic',
    fontSize: 13,
  } as TextStyle,
  toggleButton: {
    flexDirection: 'row',
    height: 28,
    padding: 2,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  separator: {
    marginLeft: 5,
  } as ViewStyle,
  moreIcon: {
    tintColor: Colors.primaryLight,
    marginLeft: 5,
    marginTop: 3,
    width: 6,
    height: 12,
  } as ImageStyle,
  bigTitleContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  mainTitle: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'center',
    color: Colors.neutral,
    fontSize: 14,
    paddingBottom: 10,
    minHeight: 45,
    alignItems: 'center',
    lineHeight: 15,
    paddingTop: 5,
    paddingHorizontal: 16,
  } as TextStyle,
  mainTitleSumary: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'left',
    color: Colors.grey6,
    fontSize: 14,
    paddingBottom: 10,
    lineHeight: 15,
    paddingTop: 5,
  } as TextStyle,
  mainSumary: {
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'left',
    color: Colors.primaryLight,
    fontSize: 14,
    paddingBottom: 10,
    lineHeight: 15,
    paddingTop: 5,
  } as TextStyle,
  darkerText: {
    color: Colors.grey6,
    paddingBottom: 0,
  } as TextStyle,
  moreInfo: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 13,
  } as TextStyle,
  modalHeadText: {
    ...Font({ weight: 'Bold' }),
    marginTop: 10,
    color: Colors.primary,
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 19,
  } as TextStyle,
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: Colors.grey3,
  } as ImageStyle,
  iconHighLight: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
    tintColor: Colors.shine,
  } as ImageStyle,
  iconOption: {
    width: 24,
    height: 24,
    marginRight: 4,
    tintColor: Colors.grey3,
  } as ImageStyle,
  iconActive: {
    tintColor: Colors.primaryLight,
  } as ImageStyle,
  textInputContainer: {
    marginTop: 0,
    marginBottom: 0,
  } as ViewStyle,
  smallAmount: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primaryLight,
    fontSize: 16,
    textAlign: 'center',
  } as TextStyle,
  bigAmount: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 20,
  } as TextStyle,
  subtitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.secondary,
    fontSize: 16,
  } as TextStyle,
  modalHead: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  } as ViewStyle,
  modalOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 80,
    paddingBottom: 10,
    paddingTop: 5,
  } as ViewStyle,
  modalOptionButon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  } as ViewStyle,
  modalInfoSection: {
    paddingBottom: 10,
  } as ViewStyle,
  buttonText: {
    paddingHorizontal: 20,
  } as TextStyle,
  titleAmount: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
    fontSize: 14,
  } as TextStyle,
  sectionInsurances: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  } as ViewStyle,
  dotStyle: {
    color: Colors.grey6,
    fontSize: 20,
    paddingRight: 5,
    lineHeight: 20,
  } as TextStyle,
  noteContainer: {
    marginTop: 10,
  } as ViewStyle,
  modalNoteContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  } as ViewStyle,
  sumaryContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 5,
  } as ViewStyle,
  checkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 5,
  } as ViewStyle,
  noteText: {
    fontSize: 12,
    color: Colors.primary,
  } as TextStyle,
  dotNoteContainer: {
    paddingRight: 5,
    color: Colors.primary,
  } as TextStyle,
  detailSumaryContainer: {
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  } as ViewStyle,
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  moreInfoButton: {
    paddingTop: 9,
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  panel: {
    marginBottom: 0,
  } as ViewStyle,
  iconCheck: {
    width: 20,
    height: 20,
    marginRight: 1,
    marginLeft: 5,
    tintColor: Colors.grey3,
  } as ImageStyle,
  iconCheckActive: {
    tintColor: Colors.white,
  } as ImageStyle,
  iconCheckText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.white,
    paddingRight: 4,
    paddingLeft: 6,
  } as TextStyle,
  insuranceTitle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey5,
    fontSize: 16,
  } as TextStyle,
  insuranceTextBold: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
  } as TextStyle,
  insurancesSmallTitle: {
    color: Colors.grey6,
    textAlign: 'right',
  } as TextStyle,
  insuranceDescription: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  pacificoLogo: {
    width: 149,
    height: 18,
  } as ImageStyle,
  textLinkView: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,
  buttonLinkText: {
    textAlign: 'left',
    ...Font({ weight: 'SemiBold' }),
    color: Colors.secondary,
    fontSize: 14,
  } as TextStyle,
  iconButton: {
    tintColor: Colors.secondary,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  boxHeder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginBottom: 20,
  } as ViewStyle,
  boxHeaderText: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  loadingText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.secondary,
    fontSize: 14,
  } as TextStyle,
  loadingTextContainer: {
    marginBottom: 100,
  } as ViewStyle,
  titleSmall: {
    ...Font({ weight: 'Regular' }),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  loadingIcon: {
    paddingBottom: 20,
  } as ViewStyle,
  listInsurancesContainer: {
    overflow: 'visible',
  } as ViewStyle,
});
export interface Params {
  destination: LoanDestination;
  amount: number;
  creditLine: ContentCreditLine;
  option: OptionsList;
  paymentDate: string;
  seedA: 'eat_flargo_pres' | 'eat_flargo_ini';
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface ExpandableItem {
  title: string;
  description: string;
  maxHeight: number;
}
export interface ValuesModal {
  amount: string;
  amountTotal: string;
  numberFee: string;
  direction: string;
}

export interface State {
  indexTarget: number;
  description: string;
  isLoading: boolean;
  isLoadingInsurances: boolean;
  isShowingLoadingText: boolean;
  isRecalculated: boolean;
  isRecalculateLoading: boolean;
  modalType: number;
  modalTitle: string;
  modalInput: boolean;
  modalOptions: boolean;
  plan2Selected: boolean;
  plan1Selected: boolean;
  plan1Title: string;
  plan2Title: string;
  planIndex: number;
  accounts: AccountItemSavingsAll[];
  user?: PreferencesUserDataModifyPreResponse;
  isValid: boolean;
  isShowModalCancel: boolean;
  showModal: boolean;
  amount: string;
  amountFee: string;
  rate: string;
  insurancesOrigin: InsuranceItem[];
  insurances: InsuranceItem[];
  insuranceSelecteds: InsuranceDetail[];
  insurancesParams: number[];
  selectedInsurance: boolean;
  currentExpandableItems: ExpandableItem[];
  currentItemId: number;
  currentProductId: number;
  currentTypeId: number;
  currentProductSelected: boolean;
  currentValuesModal: ValuesModal;
  currentSuggestedValuesModal: {
    amount: string;
    productType: number;
    productId: number;
  };
}

export interface CardOptions {
  showed: boolean | undefined;
  selected: boolean | undefined;
}

const TAG = '[InstantCashSelectInsuranceScreen]';
class InstantCashSelectInsuranceScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions = {
  //   title: L.instantcashchoosescreen_title,
  // };

  private modalInsuranceInfoResume!: ModalInsuranceInfoResume | null;
  private modalInsuranceConfirm!: ModalInsuranceConfirm | null;

  state: State = {
    indexTarget: -1,
    description: '',
    isLoading: false,
    isLoadingInsurances: true,
    isShowingLoadingText: false,
    isRecalculated: false,
    isRecalculateLoading: false,
    accounts: [],
    modalTitle: '',
    modalInput: false,
    modalOptions: false,
    modalType: 1,
    planIndex: 0,
    plan2Selected: false,
    plan1Selected: true,
    plan1Title: '',
    plan2Title: '',
    isValid: true,
    isShowModalCancel: false,
    showModal: false,
    amountFee: '',
    rate: '',
    amount: '',
    insuranceSelecteds: [],
    insurancesOrigin: [],
    insurances: [],
    insurancesParams: [1, 2, 3, 4, 5, 6],
    selectedInsurance: true,
    currentExpandableItems: [],
    currentItemId: 0, // Borrar
    currentProductId: 0,
    currentProductSelected: false,
    currentTypeId: 0,
    currentValuesModal: {
      amount: '',
      amountTotal: '',
      numberFee: '',
      direction: '',
    },
    currentSuggestedValuesModal: { amount: '', productType: 0, productId: 0 },
  };

  interaction!: any;
  insurances!: InsuranceItem[] | null;

  componentDidMount() {
    this.load();
  }
  load = async () => {
    await this.loadRecalculate();
    await this.loadProfile();
    const { user } = this.state;
    if (user && user._mail) {
      this.isValid();
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

  goTimeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  loadRecalculate = async () => {
    const { isLoading, insurancesParams, isRecalculated } = this.state;
    const { route } = this.props;
    if (isLoading) {
      Log.info(TAG, 'loadRecalculate', 'Recalculate insurances');
      return;
    }

    const amount = route.params ? (route.params.amount + '') : '';
    const option = route.params && route.params.option;
    const creditLine = route.params && route.params.creditLine;

    const paymentDate = route.params ? (route.params.paymentDate + '') : '';
    this.setState({ isLoading: true, isRecalculateLoading: true, amount });

    // const amount = navigation.getParam('amount').toString();
    // this.setState({ isLoading: true, isRecalculateLoading: true, amount });
    // const option = navigation.getParam('option');
    // const creditLine = navigation.getParam('creditLine');
    // const paymentDate = navigation.getParam('paymentDate').toString();

    const insurancesIDs =
      insurancesParams.join(',') === '' ? '0' : insurancesParams.join(',');

    let params = {
      currency: '1',
      productId: creditLine.productKey,
      term: option.numberFee.toString(),
      amount: amount,
      payDay: paymentDate,
      graceType: '0',
      gracePeriod: '0',
      insurances: {
        ids: insurancesIDs,
      },
      numberAffiliates: '1',
    };
    try {
      const response = await API.Execute.requestLoanRecalculate(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadRecalculate', response);
      }
      let { insurances } = response.body.data;
      let { amountFee } = response.body.data;
      let { rate } = response.body.data;
      const insurancesOrigin = isRecalculated
        ? this.state.insurancesOrigin
        : insurances;
      insurances = insurances
        .filter(
          (item, index, self) =>
            index === self.findIndex(t => t.type.code === item.type.code)
        )
        .filter(item => item.type.code !== 'OI' && item.type.code !== 'OM'); // OCULTAR ONCORESPALDO (OI) Y FAMILIA (OM);

      if (
        parseFloat(amount) <
        parseFloat(Config.settings.instantCashShortProfilingAmount.toString())
      ) {
        insurances = insurances.filter(item => item.type.code === 'DP'); // Solamente VPF
      } else {
        insurances = insurances.filter(item => item.type.code !== 'DP'); // Todos los demás.
      }

      insurances = insurances.map(obj => ({
        ...obj,
        selected: false,
        showed: false,
        id: obj.product.id.toString(),
        policy: this.getIndexInsurance(obj.type.id),
      }));
      insurances = insurances.sort((a, b) => (a.policy > b.policy ? 1 : -1));
      const newInsurancesParams = isRecalculated ? insurancesParams : [];
      let newinsurances = isRecalculated ? this.state.insurances : insurances;
      const newAmountFee = isRecalculated
        ? amountFee
        : option.amountFee.toString();
      const newRate = isRecalculated ? rate.toString() : option.tcea.toString();
      let indexVariant = newinsurances.findIndex(x => x.product.id === 2);
      if (!isRecalculated) {
        // Segunda llamada
        params.insurances.ids = '2';
        const newResponse = await API.Execute.requestLoanRecalculate(params);
        if (!Validate.validateStatusCode(response.status)) {
          Log.withStatusCode(TAG, 'loadRecalculate', response);
        }
        const { data } = newResponse.body;
        const indexNew = data.insurances.findIndex(x => x.product.id === 2);
        if (indexNew !== -1 && indexVariant !== -1) {
          const amountNew = data.insurances[indexNew].amount;
          newinsurances[indexVariant].amount = amountNew;
        }
      } else {
        const indexNew = insurances.findIndex(x => x.product.id === 2);
        if (indexNew !== -1 && indexVariant !== -1) {
          const amountNew = insurances[indexNew].amount;
          newinsurances[indexVariant].amount = amountNew;
        }
      }
      if (insurances.length > 0) {
        this.setState({ isShowingLoadingText: true });
        await this.goTimeout(2500); // Tiempo de espera mostrando mensaje
        const currentSuggestedValuesModal = {
          amount: `${(insurances[0].amount / option.numberFee).toFixed(2)}`,
          productType: insurances[0].type.id,
          productId: insurances[0].product.id,
        };
        this.setState({
          insurances: newinsurances,
          amountFee: newAmountFee,
          rate: newRate,
          isLoadingInsurances: false,
          insurancesParams: newInsurancesParams,
          currentSuggestedValuesModal,
          insurancesOrigin,
        });
      } else {
        this.setState(
          {
            insurances: newinsurances,
            //insurances: insurancesOrigin,
            amountFee: newAmountFee,
            rate: newRate,
            isLoadingInsurances: false,
            insurancesParams: newInsurancesParams,
            insurancesOrigin,
          },
          () => !isRecalculated && this.tryToSubmit()
        );
      }
    } catch (e) {
      Log.info(TAG, 'loadRecalculate', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadRecalculate',
        e,
      });
    }
    this.setState({ isLoading: false, isRecalculateLoading: false });
  };

  getIcon = (itemId: number, intent: boolean) => {
    let icon;
    if (itemId === 1) {
      if (intent) {
        icon = require('../../../assets/images/icon-hand-money-float-green.png');
      } else {
        icon = require('../../../assets/images/icon-hand-money-float.png');
      }
    } else if (itemId === 4) {
      if (intent) {
        icon = require('../../../assets/images/icon-hand-family-green.png');
      } else {
        icon = require('../../../assets/images/icon-hand-family.png');
      }
    } else if (itemId === 2) {
      if (intent) {
        icon = require('../../../assets/images/icon-hand-tie-green.png');
      } else {
        icon = require('../../../assets/images/icon-hand-tie.png');
      }
    } else if (itemId === 3) {
      if (intent) {
        icon = require('../../../assets/images/icon-hand-store-green.png');
      } else {
        icon = require('../../../assets/images/icon-hand-store.png');
      }
    }
    return icon;
  };

  getAccesibilityLabel = (
    itemId: number,
    type: string
  ): AnalyticsLabelsType => {
    let label = 'instantcashselectinsurance_button_default';
    switch (itemId) {
      case 1:
        if (type === 'select') {
          label = 'instantcashselectinsurance_select_finantialprotection';
        } else if (type === 'modal') {
          label = 'instantcashselectinsurance_modal_finantialprotection';
        } else {
          label = 'instantcashselectinsurance_cancel_finantialprotection';
        }
        break;
      case 2:
        if (type === 'select') {
          label = 'instantcashselectinsurance_select_oncological';
        } else if (type === 'modal') {
          label = 'instantcashselectinsurance_modal_oncological';
        } else {
          label = 'instantcashselectinsurance_cancel_oncological';
        }
        break;
      case 3:
        if (type === 'select') {
          label = 'instantcashselectinsurance_select_business';
        } else if (type === 'modal') {
          label = 'instantcashselectinsurance_modal_business';
        } else {
          label = 'instantcashselectinsurance_cancel_business';
        }
        break;
      case 4:
        if (type === 'select') {
          label = 'instantcashselectinsurance_select_family';
        } else if (type === 'modal') {
          label = 'instantcashselectinsurance_modal_family';
        } else {
          label = 'instantcashselectinsurance_cancel_family';
        }
        break;
      default:
        break;
    }
    return label as AnalyticsLabelsType;
  };

  isValid = () => {
    const { isLoading, isRecalculateLoading } = this.state;
    const isValid = !isLoading && !isRecalculateLoading;
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  showModalInfo = (typeId: number) => {
    const { route } = this.props;
    const creditLine = route.params && route.params.creditLine;
    let modalOptions = false;
    let modalInput = false;
    let showModal = true;
    let modalTitle = '';
    let direction = '';
    let insuranceSelecteds;
    let plan1Title = '';
    let plan2Title = '';

    if (typeId === 1) {
      let item_2 = this.state.insurances.filter(
        item => item.product.id === 2
      )[0];
      modalOptions = false;
      modalTitle = L.instantcash_insurance_modal_title_1;
      insuranceSelecteds = [
        {
          id: 1,
          direction,
          product: { id: 2 },
          description: L.instantcash_insurance_modal_desc_2,
          amount: Amount.format(
            item_2.amount,
            creditLine.currencyKey.toString()
          ),
          rate: Amount.toFixedSingle(item_2.rate.value, 2) + '%',
          summary: L.instantcash_insurance_modal_sumary_2,
          note: L.instantcash_insurance_modal_note_2,
        },
      ];
    } else if (typeId === 4) {
      let item_3 = this.state.insurancesOrigin.filter(
        item => item.product.id === 3
      )[0];
      let item_4 = this.state.insurancesOrigin.filter(
        item => item.product.id === 4
      )[0];
      modalOptions = !!item_3 && !!item_4;
      modalTitle = L.instantcash_insurance_modal_title_4;
      plan1Title = L.instantcash_insurance_modal_option_3;
      plan2Title = L.instantcash_insurance_modal_option_4;
      insuranceSelecteds = [];
      if (!!item_3) {
        insuranceSelecteds.push({
          id: typeId,
          direction,
          product: { id: 3 },
          description: L.instantcash_insurance_modal_desc_3,
          amount: Amount.format(
            item_3.amount,
            creditLine.currencyKey.toString()
          ),
          rate: Amount.format(
            item_3.rate.value,
            creditLine.currencyKey.toString()
          ),
          summary: L.instantcash_insurance_modal_sumary_3,
          note: L.instantcash_insurance_modal_note_3,
        });
      }
      if (!!item_4) {
        insuranceSelecteds.push({
          id: typeId,
          direction,
          product: { id: 4 },
          description: L.instantcash_insurance_modal_desc_4,
          amount: Amount.format(
            item_4.amount,
            creditLine.currencyKey.toString()
          ),
          rate: Amount.format(
            item_4.rate.value,
            creditLine.currencyKey.toString()
          ),
          summary: L.instantcash_insurance_modal_sumary_4,
          note: L.instantcash_insurance_modal_note_4,
        });
      }
    } else if (typeId === 3) {
      let item_1 = this.state.insurances.filter(
        item => item.product.id === 1
      )[0];
      direction = item_1.direction;
      modalOptions = false;
      modalInput = true;
      modalTitle = L.instantcash_insurance_modal_title_3;
      insuranceSelecteds = [
        {
          id: typeId,
          direction,
          product: { id: 1 },
          description: L.instantcash_insurance_modal_desc_1,
          amount: Amount.format(
            item_1.amount,
            creditLine.currencyKey.toString()
          ),
          rate: Amount.toFixedSingle(item_1.rate.value, 2) + '%',
          summary: L.instantcash_insurance_modal_sumary_1,
          note: L.instantcash_insurance_modal_note_1,
        },
      ];
    } else if (typeId === 2) {
      let item_5 = this.state.insurancesOrigin.filter(
        item => item.product.id === 5
      )[0];
      let item_6 = this.state.insurancesOrigin.filter(
        item => item.product.id === 6
      )[0];
      modalOptions = !!item_5 && !!item_6;
      modalTitle = L.instantcash_insurance_modal_title_2;
      plan1Title = L.instantcash_insurance_modal_option_5;
      plan2Title = L.instantcash_insurance_modal_option_6;
      insuranceSelecteds = [];
      if (!!item_5) {
        insuranceSelecteds.push({
          id: typeId,
          direction,
          product: { id: 5 },
          description: L.instantcash_insurance_modal_desc_5,
          amount: Amount.format(
            item_5.amount,
            creditLine.currencyKey.toString()
          ),
          rate: Amount.format(
            item_5.rate.value,
            creditLine.currencyKey.toString()
          ),
          summary: L.instantcash_insurance_modal_sumary_5,
          note: L.instantcash_insurance_modal_note_5,
        });
      }
      if (!!item_6) {
        insuranceSelecteds.push({
          id: typeId,
          direction,
          product: { id: 6 },
          description: L.instantcash_insurance_modal_desc_6,
          amount: Amount.format(
            item_6.amount,
            creditLine.currencyKey.toString()
          ),
          rate: Amount.format(
            item_6.rate.value,
            creditLine.currencyKey.toString()
          ),
          summary: L.instantcash_insurance_modal_sumary_6,
          note: L.instantcash_insurance_modal_note_6,
        });
      }
    } else {
      showModal = false;
    }
    if (insuranceSelecteds) {
      this.setState({
        showModal,
        modalOptions,
        modalInput,
        modalTitle,
        insuranceSelecteds,
        modalType: typeId,
        plan1Selected: true,
        plan2Selected: false,
        planIndex: 0,
        plan1Title,
        plan2Title,
      });
    }
  };

  changeModalOption = () => {
    if (this.state.plan1Selected) {
      this.setState({
        plan1Selected: false,
        plan2Selected: true,
        planIndex: 1,
      });
    } else {
      this.setState({
        plan1Selected: true,
        plan2Selected: false,
        planIndex: 0,
      });
    }
  };

  closeModalInfo = () => {
    this.setState({ showModal: false });
  };

  tryToSubmit = async () => {
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

  submit = async () => {
    const { navigation, route } = this.props;
    const { insurancesParams, amount, insurancesOrigin } = this.state;

    const option = route.params && route.params.option;
    const creditLine = route.params && route.params.creditLine;
    const destination = route.params && route.params.destination;
    const paymentDate = route.params && route.params.paymentDate;
    const seedA = route.params && route.params.seedA;

    const insurancesSelecteds = insurancesOrigin.filter(item =>
      insurancesParams.includes(item.product.id)
    );
    navigation.navigate('InstantCashChoose', {
      amount,
      creditLine,
      option,
      paymentDate,
      destination,
      insurances: insurancesSelecteds,
      seedA,
    });

    const newSeedA = (seedA + '_seguros_sig') as
      | 'eat_flargo_pres_seguros_sig'
      | 'eat_flargo_ini_seguros_sig';
    AnalyticsEvent.track(A[newSeedA]);
    AnalyticsEvent.track(A.eat_flargo_seguros_sig);
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  recalculateData(product_id: number, selected: boolean) {
    const { isRecalculated } = this.state;
    let { insurancesParams } = this.state;
    if (selected || isRecalculated) {
      if (product_id === 3 || product_id === 4) {
        // Familia protegida
        insurancesParams = insurancesParams.filter(
          item => item !== 3 && item !== 4
        );
        selected && insurancesParams.push(product_id);
      } else if (product_id === 5 || product_id === 6) {
        // OncoRespaldo
        insurancesParams = insurancesParams.filter(
          item => item !== 5 && item !== 6
        );
        selected && insurancesParams.push(product_id);
      } else {
        if (selected && insurancesParams.indexOf(product_id) === -1) {
          insurancesParams.push(product_id);
        }
        if (!selected) {
          insurancesParams = insurancesParams.filter(
            item => item !== product_id
          );
        }
      }
      this.setState(
        { isRecalculated: true, isRecalculateLoading: true, insurancesParams },
        () => {
          this.loadRecalculate();
        }
      );
    }
  }

  updateInsurance(id: number, product_id: number, itemAttributes: CardOptions) {
    const index = this.state.insurances.findIndex(x => x.type.id === id);
    if (index === -1) {
      return false;
    } else {
      this.setState({
        insurances: [
          ...this.state.insurances.slice(0, index),
          Object.assign({}, this.state.insurances[index], itemAttributes),
          ...this.state.insurances.slice(index + 1),
        ],
      });
      if (itemAttributes.selected !== undefined && itemAttributes.showed) {
        this.recalculateData(product_id, itemAttributes.selected);
      }
      return true;
    }
  }

  actionModal = () => {
    this.setState({ isShowModalCancel: !this.state.isShowModalCancel });
  };

  cardPress = (typeId: number, product_id: number) => {
    this.showModalInfo(typeId);
    this.updateInsurance(typeId, product_id, {
      showed: true,
      selected: undefined,
    });
  };

  selectInsurance = (id: number, product_id: number) => {
    this.updateInsurance(id, product_id, { selected: true, showed: true });
    this.setState({ showModal: false });
  };

  unSelectInsurance = (id: number, product_id: number) => {
    this.updateInsurance(id, product_id, { selected: false, showed: true });
    this.setState({ showModal: false });
  };

  trackChangeSwitch = (
    typeId: number,
    accessibilityLabel: string,
  ) => {
    setEventValue(accessibilityLabel, this.getTitleInsurance(typeId));
    const param = K[accessibilityLabel]
    AnalyticsEvent.trackEvent('virtualEventApp', param)
  }

  toogleInsurance = (
    typeId: number,
    product_id: number,
    selected: boolean | undefined
  ) => {
    if (!selected) {
      this.selectInsurance(typeId, product_id);
    } else {
      this.unSelectInsurance(typeId, product_id);
    }
  };

  getTitleInsurance = (indexTarget: number) => {
    let titleInsurance = '';
    switch (indexTarget) {
      case 1:
        titleInsurance = L.instantcash_insurance_title_1;
        break;
      case 2:
        titleInsurance = L.instantcash_insurance_title_2;
        break;
      case 3:
        titleInsurance = L.instantcash_insurance_title_3;
        break;
      case 4:
        titleInsurance = L.instantcash_insurance_title_4;
        break;
    }
    return titleInsurance;
  };

  getDetailInsurance = (indexTarget: number) => {
    let titleInsurance = '';
    switch (indexTarget) {
      case 1:
        titleInsurance = L.instantcash_insurance_card_title_1;
        break;
      case 2:
        titleInsurance = L.instantcash_insurance_card_title_2;
        break;
      case 3:
        titleInsurance = L.instantcash_insurance_card_title_3;
        break;
      case 4:
        titleInsurance = L.instantcash_insurance_card_title_4;
        break;
    }
    return titleInsurance;
  };

  getIndexInsurance = (indexTarget: number) => {
    let indexInsurance = '0';
    switch (indexTarget) {
      case 1:
        indexInsurance = '1';
        break;
      case 2:
        indexInsurance = '4';
        break;
      case 3:
        indexInsurance = '3';
        break;
      case 4:
        indexInsurance = '2';
        break;
    }
    return indexInsurance;
  };

  onInfoPress = (
    currentTypeId: number,
    currentProductId: number,
    currentProductSelected: boolean = false,
    currentValuesModal: ValuesModal
  ) => {
    setEventValue(A.instantcashselectinsurancescreen_active_modal, this.getTitle(currentTypeId));
    updateEventSubseccion(A.instantcashselectinsurancescreen_active_modal, this.getTitle(currentTypeId))
    const labelModal = K[A.instantcashselectinsurancescreen_active_modal];
    AnalyticsEvent.trackEvent('virtualEventApp', labelModal);
    let currentExpandableItems: ExpandableItem[] = [];
    switch (currentTypeId) {
      case 3:
        currentExpandableItems = [
          {
            title: L.instantcash_insurance_detail_3_part1_title,
            description: `${currentValuesModal.direction}`,
            maxHeight: 10,
          },
          {
            title: L.instantcash_insurance_detail_3_part2_title,
            description: L.instantcash_insurance_detail_3_part2_description,
            maxHeight: 50,
          },
          {
            title: L.instantcash_insurance_detail_3_part3_title,
            description: L.instantcash_insurance_detail_3_part3_description,
            maxHeight: 80,
          },
          {
            title: L.instantcash_insurance_detail_3_part4_title,
            description: L.instantcash_insurance_detail_3_part4_description,
            maxHeight: 80,
          },
          {
            title: L.instantcash_insurance_detail_3_part5_title,
            description: L.instantcash_insurance_detail_3_part5_description,
            maxHeight: 80,
          },
          {
            title: L.instantcash_insurance_detail_3_part6_title,
            description: L.instantcash_insurance_detail_3_part6_description,
            maxHeight: 80,
          },
        ];
        break;
      case 1:
        currentExpandableItems = [
          {
            title: L.instantcash_insurance_detail_1_part1_title,
            description: L.instantcash_insurance_detail_1_part1_description,
            maxHeight: 50,
          },
          {
            title: L.instantcash_insurance_detail_1_part2_title,
            description: L.instantcash_insurance_detail_1_part2_description,
            maxHeight: 40,
          },
          {
            title: L.instantcash_insurance_detail_1_part3_title,
            description: L.instantcash_insurance_detail_1_part3_description,
            maxHeight: 90,
          },
          {
            title: L.instantcash_insurance_detail_1_part4_title,
            description: L.instantcash_insurance_detail_1_part4_description,
            maxHeight: 60,
          },
          {
            title: L.instantcash_insurance_detail_1_part5_title,
            description: L.instantcash_insurance_detail_1_part5_description,
            maxHeight: 60,
          },
        ];
        break;
      case 2:
        currentExpandableItems = [
          {
            title: L.instantcash_insurance_detail_2_part1_title,
            description: L.instantcash_insurance_detail_2_part1_description,
            maxHeight: 60,
          },
          {
            title: L.instantcash_insurance_detail_2_part2_title,
            description: L.instantcash_insurance_detail_2_part2_description,
            maxHeight: 90,
          },
          {
            title: L.instantcash_insurance_detail_2_part3_title,
            description: L.instantcash_insurance_detail_2_part3_description,
            maxHeight: 60,
          },
          {
            title: L.instantcash_insurance_detail_2_part4_title,
            description: L.instantcash_insurance_detail_2_part4_description,
            maxHeight: 60,
          },
        ];
        break;
    }

    this.setState(
      {
        currentExpandableItems,
        currentItemId: currentTypeId,
        currentTypeId,
        currentProductId,
        currentProductSelected,
        currentValuesModal,
      },
      () => this.modalInsuranceInfoResume?.showPanel()
    );
  };

  getTitle(itemId: number) {
    let pretitle = '';
    switch (itemId) {
      case 1:
        pretitle = L.instantcash_modalinforesume_insurance_title_1;
        break;
      case 2:
        pretitle = L.instantcash_modalinforesume_insurance_title_2;
        break;
      case 3:
        pretitle = L.instantcash_modalinforesume_insurance_title_3;
        break;
      case 4:
        pretitle = L.instantcash_modalinforesume_insurance_title_4;
        break;
      default:
        pretitle = L.instantcash_modalinforesume_insurance_title_default;
        break;
    }
    return pretitle;
  }

  selectModalLoanInfo = async () => {
    const { currentItemId } = this.state
    updateEventSubseccion('modalinforesume_button_accept', this.getTitle(currentItemId))
    this.turnOnSelectedInsurance();
    this.modalInsuranceInfoResume?.dismissPanel();
  };
  closeModalLoanInfo = async () => {
    this.modalInsuranceInfoResume?.dismissPanel();
  };

  selectModalConfirm = async () => {
    this.tryToSubmit();
  };
  closeModalConfirm = async () => {
    this.modalInsuranceConfirm?.dismissPanel();
  };

  handleSelectInsurance = () => {
    const {
      currentTypeId,
      currentProductId,
      currentProductSelected,
    } = this.state;
    this.toogleInsurance(
      currentTypeId,
      currentProductId,
      currentProductSelected
    );
  };

  turnOnSelectedInsurance = () => {
    let selected = this.state.currentProductSelected;
    if (!selected) {
      this.handleSelectInsurance();
    }
  };

  checkInsurances = () => {
    if (this.state.insurancesParams.length > 0) {
      this.tryToSubmit();
    } else {
      this.modalInsuranceConfirm?.showPanel();
    }
  };

  render() {
    const {
      isRecalculateLoading,
      isLoadingInsurances,
      isShowingLoadingText,
      isValid,
      plan1Selected,
      plan2Selected,
      isLoading,
      showModal,
      insuranceSelecteds,
      planIndex,
      modalOptions,
      modalType,
      modalTitle,
      modalInput,
      insurances,
      amountFee,
      rate,
      insurancesParams,
    } = this.state;
    const { isFocused, route } = this.props;

    console.log('insurances size:',insurances.length)

    const creditLine = route.params && route.params.creditLine;
    const option = route.params && route.params.option;
    return (
      <Container>
        <Modal visible={showModal}>
          {insuranceSelecteds.length > 0 && (
            <>
              <View style={styles.modalContainer}>
                <View style={styles.modalHead}>
                  <Image
                    accessibilityLabel={'buttonimage_image'}
                    style={styles.imageStyle}
                    source={this.getIcon(modalType, true)}
                  />
                  <Text style={styles.modalHeadText}>{modalTitle}</Text>
                </View>
                <View>
                  {modalOptions && (
                    <View>
                      <Text style={styles.title}>
                        {L.instantcash_insurance_choose_plan}
                      </Text>
                      <View style={styles.modalOptionContainer}>
                        <Touchable
                          onPress={() => this.changeModalOption()}
                          accessibilityLabel="instantcashselectinsurance_select_plan"
                          style={styles.modalOptionButon}
                        >
                          {plan1Selected && (
                            <Image
                              accessibilityLabel={'feesrow_checkbox_active'}
                              style={[styles.iconOption, styles.iconActive]}
                              resizeMode={'contain'}
                              source={require('../../../assets/images/radio-button-selected.png')}
                            />
                          )}
                          {!plan1Selected && (
                            <Image
                              accessibilityLabel={'feesrow_checkbox_active'}
                              style={styles.iconOption}
                              resizeMode={'contain'}
                              source={require('../../../assets/images/radio-button-unselected.png')}
                            />
                          )}
                          <Text style={styles.titleBold}>
                            {this.state.plan1Title}
                          </Text>
                        </Touchable>
                        <Touchable
                          onPress={() => this.changeModalOption()}
                          accessibilityLabel={
                            'instantcashselectinsurance_change_option'
                          }
                          style={styles.modalOptionButon}
                        >
                          {plan2Selected && (
                            <Image
                              accessibilityLabel={'feesrow_checkbox_active'}
                              style={[styles.iconOption, styles.iconActive]}
                              resizeMode={'contain'}
                              source={require('../../../assets/images/radio-button-selected.png')}
                            />
                          )}
                          {!plan2Selected && (
                            <Image
                              accessibilityLabel={'feesrow_checkbox_active'}
                              style={styles.iconOption}
                              resizeMode={'contain'}
                              source={require('../../../assets/images/radio-button-unselected.png')}
                            />
                          )}
                          <Text style={styles.titleBold}>
                            {this.state.plan2Title}
                          </Text>
                        </Touchable>
                      </View>
                    </View>
                  )}
                  <View style={styles.modalInfoSection}>
                    <Text style={styles.title}>
                      {L.instantcash_insurance_title}
                    </Text>
                    <Text style={styles.titleBoldBig}>
                      {insuranceSelecteds[planIndex]['description']}
                    </Text>
                    <Text style={styles.title}>
                      <Text style={styles.titleAmount}>
                        {insuranceSelecteds[planIndex]['rate']}
                      </Text>
                      {insuranceSelecteds[planIndex].product.id === 2
                        ? L.instantcash_insurance_pay_unique
                        : L.instantcash_insurance_pay_month}
                    </Text>
                  </View>
                  <View style={styles.modalInfoSection}>
                    <Text style={styles.titleBold}>
                      {L.instantcash_insurance_modal_total_amount}
                    </Text>
                    <Text style={[styles.amountText]}>
                      {insuranceSelecteds[planIndex]['amount']}
                    </Text>
                  </View>
                  <Text style={styles.title}>
                    {L.instantcash_insurance_coverage_title}
                  </Text>
                  <View style={styles.sumaryContainer}>
                    <Text style={styles.dotStyle}>{`•`}</Text>
                    <Text style={styles.titleBold}>
                      {insuranceSelecteds[planIndex]['summary']}
                    </Text>
                  </View>
                  {modalInput && (
                    <View style={styles.modalInfoSection}>
                      <Text style={styles.title}>
                        {L.instantcash_insurance_modal_address_title}
                      </Text>
                      <Text>{insuranceSelecteds[planIndex]['direction']}</Text>
                    </View>
                  )}
                  <View style={styles.modalNoteContainer}>
                    <Text style={styles.dotNoteContainer}>{`*`}</Text>
                    <Text style={styles.noteText}>
                      {insuranceSelecteds[planIndex]['note']}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    disabled={isRecalculateLoading}
                    light
                    allowOnPress
                    accessibilityLabel={this.getAccesibilityLabel(
                      insuranceSelecteds[planIndex].product.id,
                      'cancel'
                    )}
                    onPress={() =>
                      this.unSelectInsurance(
                        insuranceSelecteds[planIndex]['id'],
                        insuranceSelecteds[planIndex].product.id
                      )
                    }
                    loading={false}
                    title={L.instantcash_insurance_modal_button_no}
                    textStyle={styles.buttonText}
                  />
                  <Button
                    disabled={isRecalculateLoading}
                    allowOnPress
                    accessibilityLabel={this.getAccesibilityLabel(
                      insuranceSelecteds[planIndex].product.id,
                      'select'
                    )}
                    onPress={() =>
                      this.selectInsurance(
                        insuranceSelecteds[planIndex]['id'],
                        insuranceSelecteds[planIndex].product.id
                      )
                    }
                    loading={false}
                    title={L.instantcash_insurance_modal_button_yes}
                    textStyle={styles.buttonText}
                  />
                </View>
              </View>
            </>
          )}
        </Modal>
        <FormSteps total={4} current={1} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              {isLoadingInsurances ? (
                <View style={styles.loadingContainer}>
                  <Loading
                    margin={'large'}
                    size={'large'}
                    style={styles.loadingIcon}
                    color={Colors.secondary}
                  />
                  <View style={styles.loadingTextContainer}>
                    <Text style={styles.loadingText}>
                      {isShowingLoadingText
                        ? L.instantcash_insurance_loading_msg
                        : ''}
                    </Text>
                  </View>
                </View>
              ) : (
                <>
                  <Header
                    accessibilityLabel={
                      'instantcashinsurancesscreen_header_title'
                    }
                    style={styles.marginTop}
                    title={L.instantcash_insurance_pretitle}
                    titleStyle={[styles.titleStyleSmall]}
                    center
                  />
                  <View style={styles.boxHeder}>
                    <Text style={styles.boxHeaderText}>
                      {L.instantcash_insurance_logo_text}
                    </Text>
                    <Image
                      style={styles.pacificoLogo}
                      source={require('../../../assets/images/pacifico-seguros-logo.png')}
                    />
                  </View>
                  {insurances.length>0 && (
                    <>
                    {insurances.map(item=>{
                      return (
                        <View style={{ marginVertical: 10 }} key={item.id+''}>
                        <CardView
                          style={[
                            styles.cardSumary,
                            { backgroundColor: Colors.secondaryLight },
                          ]}
                        >
                          <View style={styles.insuranceLabel}>
                            <Text style={styles.insuranceLabelText}>
                              {L.instantcash_insurance_label_text}
                            </Text>
                          </View>
                          <View style={{ padding: 0 }}>
                            <View style={styles.insuranceContainer}>
                              <Touchable
                                accessibilityLabel="instantcashinsurancesscreen_toggle_button"
                                disabled={isRecalculateLoading}
                                onPress={() => {
                                  this.toogleInsurance(
                                    item.type.id,
                                    item.product.id,
                                    item.selected
                                  );
                                  this.trackChangeSwitch(item?.type?.id, 'efectalt_flargo_seg_toggle_active')
                                }}
                                style={[
                                  styles.toggleButton,
                                  {
                                    backgroundColor: item.selected
                                      ? Colors.secondary
                                      : Colors.grey3,
                                  },
                                ]}
                              >
                                {item.selected ? (
                                  <>
                                    <Text style={styles.iconCheckText}>
                                      {L.instantcashinsurancesscreen_toggle_yes}
                                    </Text>

                                    <Image
                                      style={[
                                        styles.iconCheck,
                                        styles.iconCheckActive,
                                      ]}
                                      resizeMode={'contain'}
                                      source={require('../../../assets/images/item-checked-icon.png')}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Image
                                      style={[
                                        styles.iconCheck,
                                        styles.iconCheckActive,
                                      ]}
                                      resizeMode={'contain'}
                                      source={require('../../../assets/images/item-unchecked-icon.png')}
                                    />
                                    <Text style={styles.iconCheckText}>
                                      {L.instantcashinsurancesscreen_toggle_no}
                                    </Text>
                                  </>
                                )}
                              </Touchable>
                              <View style={{ width: '50%' }}>
                                <View>
                                  <Text style={styles.insuranceTextBold}>
                                    {this.getTitleInsurance(item.type.id)}
                                  </Text>
                                  <Text style={styles.insuranceDescription}>
                                    {this.getDetailInsurance(item.type.id)}
                                  </Text>
                                </View>
                                <View style={{ marginTop: 12 }}>
                                  <ButtonLink
                                    accent={'primaryLight'}
                                    accessibilityLabel={
                                      'newaccount_textlink_title_know_more'
                                    }
                                    style={styles.textLinkView}
                                    titleStyle={styles.buttonLinkText}
                                    onPress={() =>
                                      this.onInfoPress(
                                        item.type.id,
                                        item.product.id,
                                        item.selected,
                                        {
                                          amount: `${(
                                            item.amount / option.numberFee
                                          ).toFixed(2)}`,
                                          amountTotal: `${item.amount}`,
                                          numberFee: `${option.numberFee}`,
                                          direction: item.direction,
                                        }
                                      )
                                    }
                                    title={
                                      L.instantcashinsurancesscreen_insurance_detail
                                    }
                                    imageSource={require('../../../assets/images/arrow-icon.png')}
                                    imagePosition={'right'}
                                    imageStyle={styles.iconButton}
                                  />
                                </View>
                              </View>
                              <View>
                                <Text
                                  style={[
                                    styles.insuranceTextBold,
                                    { color: Colors.secondary },
                                  ]}
                                >{`+S/ ${(
                                  item.amount / option.numberFee
                                ).toFixed(2)}`}</Text>
                                <Text style={styles.insurancesSmallTitle}>
                                  {' '}
                                  {
                                    L.instantcashinsurancesscreen_insurance_period
                                  }
                                </Text>
                              </View>
                            </View>
                          </View>
                        </CardView>
                      </View>
                      )
                    })}
                    </>
                  )}

                  <View>
                    <Text style={styles.titleBoldBox}>
                      {L.instantcashinsurancesscreen_calculate_title}
                    </Text>
                    <CardView
                      style={
                        insurancesParams.length === 0
                          ? styles.cardSumary
                          : [styles.cardSumary, { height: 140 }]
                      }
                    >
                      <Text style={styles.title}>
                        {`${option.numberFee} cuotas`}
                      </Text>
                      {isRecalculateLoading ? (
                        <Loading margin={'medium'} />
                      ) : (
                        <>
                          <Text style={styles.bigAmount}>
                            {Amount.format(
                              amountFee,
                              creditLine.currencyKey.toString()
                            )}
                          </Text>
                          <Text
                            style={styles.titleSmall}
                          >{`${L.instantcashinsurancesscreen_tcea} ${rate}%`}</Text>
                        </>
                      )}
                      <View style={styles.noteContainer}>
                        <Text style={styles.titleQuote}>
                          {insurancesParams.length === 0
                            ? ''
                            : L.instantcashinsurancesscreen_calculate_msg}
                        </Text>
                      </View>
                    </CardView>
                  </View>
                  <View style={styles.buttons}>
                    <Button
                      disabled={!isValid}
                      allowOnPress
                      accessibilityLabel={
                        'instantcashinsurancesscreen_button_continue'
                      }
                      onPress={() => this.checkInsurances()}
                      loading={isLoading}
                      title={L.instantcashchoosescreen_button_continue}
                    />
                  </View>
                </>
              )}
            </Content>
          </SafeAreaView>
          <ModalInsuranceInfoResume
            accessibilityLabel={'analytics_test'}
            ref={ref => {
              this.modalInsuranceInfoResume = ref;
            }}
            onPress={this.selectModalLoanInfo}
            onClose={this.closeModalLoanInfo}
            expandableItems={this.state.currentExpandableItems}
            itemId={this.state.currentItemId}
            valuesModal={this.state.currentValuesModal}
          />

          <ModalInsuranceConfirm
            accessibilityLabel={'instantcash_modal_insurance_close'}
            ref={ref => {
              this.modalInsuranceConfirm = ref;
            }}
            onPress={() =>
              this.toogleInsurance(
                this.state.currentSuggestedValuesModal.productType,
                this.state.currentSuggestedValuesModal.productId,
                false
              )
            }
            onPressCancel={this.selectModalConfirm}
            onClose={this.closeModalConfirm}
            valuesModal={this.state.currentSuggestedValuesModal}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashSelectInsuranceScreenType = InstantCashSelectInsuranceScreen;
export default withFocused<InstantCashSelectInsuranceScreen, Props>(
  InstantCashSelectInsuranceScreen
);
