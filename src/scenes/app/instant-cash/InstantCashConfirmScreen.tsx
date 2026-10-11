import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  CheckBox,
  CheckBoxMulti,
  SelectInsuranceModal,
  ButtonLink,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  Header,
  FormSteps,
  CardView,
  Button,
  Tooltip,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import ConfirmCode from '../../../components/sms/ConfirmCode';
import Log from '../../../resources/log/Log';
import API from '../../../api';
import { Validate, Font, Sanitizer } from '../../../resources/functions';
import {
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
  ImageStyle,
} from 'react-native';
import ExpandableView from '../../../components/ui/ExpandableView';
import NetworkManager from '../../../components/network/NetworkManager';
import TermsModal from '../../../components/info/TermsModal';
import { Amount } from '../../../resources/money';
import {
  LoanPreviewResponse,
  OptionsList,
  ContentCreditLine,
  LoanDestination,
  AccountItemSavingsAll,
  InsuranceItem,
} from '../../../api/backend/response/Execute';
import { KeyboardUtil } from '../../../resources/util';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import { AnalyticsTrackParams } from '../../../resources/analytics/AnalyticsEvent';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  formText: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
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
    padding: 20,
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
    marginBottom: 20,
    marginTop: 40,
  } as ViewStyle,
  marginToggle: {
    marginTop: 10,
  } as ViewStyle,
  marginTop: {
    marginHorizontal: 20,
    marginTop: 20 + 10, // 10 adicional por formsteps
    marginBottom: 20,
  } as ViewStyle,
  marginExpandableView: {
    marginHorizontal: 0,
  } as ViewStyle,
  insurancesCard: {
    marginTop: 20,
  } as TextStyle,
  insurancesContainer: {
    flexWrap: 'wrap',
    paddingRight: 20,
  } as TextStyle,
  textTerms: {
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  textTermsLinks: {
    color: Colors.primary,
    fontWeight: 'bold',
  } as TextStyle,
  cardText: {
    flexWrap: 'wrap',
    paddingRight: 20,
  } as TextStyle,
  tooltipContainer: {
    marginLeft: 98,
    position: 'absolute',
    top: 7,
  } as ViewStyle,
  helpButtonIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.secondary,
  } as ImageStyle,
});

export interface Params {
  resume: LoanPreviewResponse;
  target: AccountItemSavingsAll;
  option: OptionsList;
  creditLine: ContentCreditLine;
  email: string;
  destination: LoanDestination;
  insurances: InsuranceItem[];
  seedA: 'eat_flargo_pres' | 'eat_flargo_ini';
  insurancesJoin: string;
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isAllowedReadSMS: boolean;
  isValid: boolean;
  isTermsValid: boolean;
  showTerms: boolean;
  showInsuranceTerms: boolean;
  showTermsComunications: boolean;
  showTermsPersonalData: boolean;
  isLoadingResend: boolean;
  isLoading: boolean;
  option?: OptionsList;
  resume?: LoanPreviewResponse;
  target?: AccountItemSavingsAll;
  isRequiredTerms: boolean;
  insurances: InsuranceItem[];
  isTermInsurancesValid: boolean;
  firstTermsInsurancesValid: boolean;
  showInsurancesList: boolean;
  bodyInsuranceTerms: string;
  insurancesList: InsuranceItem[];
  termsValueOne?: boolean;
  termsValueTwo?: boolean;
  termsValueFinal?: boolean;
}

const TAG = '[InstantCashConfirmScreen]';
class InstantCashConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isLoading: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    isValid: false,
    isTermsValid: true,
    showTerms: false,
    showInsuranceTerms: false,
    showTermsComunications: false,
    showTermsPersonalData: false,
    option: undefined,
    resume: undefined,
    target: undefined,
    isRequiredTerms: true,
    isTermInsurancesValid: false,
    firstTermsInsurancesValid: false,
    showInsurancesList: false,
    bodyInsuranceTerms: '',
    insurancesList: [],
    insurances: [],
    termsValueOne: false,
    termsValueTwo: false,
    termsValueFinal: false,
  };
  code!: ConfirmCode | null;
  terms!: CheckBox | null;
  termsInsurances!: CheckBoxMulti | null;
  termsPersonalData!: CheckBox | null;

  componentDidMount() {
    this.load();
  }

  load = async () => {
    const { route } = this.props;

    const resume = route.params && route.params.resume;
    const target = route.params && route.params.target;
    const option = route.params && route.params.option;
    const insurances = route.params && route.params.insurances;

    this.setState({
      resume,
      target,
      option,
      insurances,
    });
  };

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

  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isTermsValid: value, termsValueOne: value }, () =>
      this.isValid(false)
    );
  };

  onChangeChekboxTermsInsurancesValue = (value: boolean) => {
    this.setState(
      {
        isTermInsurancesValid: value,
        firstTermsInsurancesValid: true,
        termsValueTwo: value,
      },
      () => this.isValid()
    );
  };

  showTermsPersonalDataTrack = (title: string) => {
    AnalyticsEvent.track(A.InstantCashConfirmScreenLinkFour, title);
    AnalyticsEvent.track(A.InstantCashConfirmScreenModalFour, title);
  };

  showTermsComunicationsTrack = (title: string) => {
    AnalyticsEvent.track(A.InstantCashConfirmScreenLinkThree, title);
    AnalyticsEvent.track(A.InstantCashConfirmScreenModalThree, title);
  };

  showInsurancesTrack = (title: string) => {
    AnalyticsEvent.track(A.InstantCashConfirmScreenLinkTwo, title);
    AnalyticsEvent.track(A.InstantCashConfirmScreenModalTwo, title);
  };

  showInsurancesList = () => {
    if (this.state.insurances.length === 1) {
      this.changeTargetInsurance(this.state.insurances[0].type.id);
    } else {
      this.setState({ showInsurancesList: true });
    }
  };

  changeTargetInsurance = (indexTarget: number) => {
    this.closeInsurancesList();
    let bodyInsuranceTerms = '';
    switch (indexTarget) {
      case 1:
        bodyInsuranceTerms = L.termsmodal_instantcash_proteccion_financiera;
        break;
      case 2:
        bodyInsuranceTerms = L.termsmodal_instantcash_oncorespaldo;
        break;
      case 3:
        bodyInsuranceTerms = L.termsmodal_instantcash_negocio_protegido;
        break;
      case 4:
        bodyInsuranceTerms = L.termsmodal_instantcash_familia_protegida;
        break;
    }
    this.setState({ bodyInsuranceTerms }, () => {
      this.showInsuranceTerms();
    });
  };

  showTerms = () => {
    AnalyticsEvent.track(
      A.InstantCashConfirmScreenModal,
      L.loanscashconfirmscreen_terms_1
    );
    this.setState({ showTerms: true });
  };

  showInsuranceTerms = () => {
    this.setState({ showInsuranceTerms: true });
  };

  showTermsComunications = () => {
    this.setState({ showTermsComunications: true });
  };

  showTermsPersonalData = () => {
    this.setState({ showTermsPersonalData: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };

  closeInsurancesList = () => {
    this.setState({ showInsurancesList: false });
  };

  closeInsuranceTerms = () => {
    this.setState({ showInsuranceTerms: false });
  };

  closeTermsComunications = () => {
    this.setState({ showTermsComunications: false });
  };

  closeTermsPersonalData = () => {
    this.setState({ showTermsPersonalData: false });
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  onAcceptInsuranceTerms = () => {
    this.termsInsurances && this.termsInsurances.setValue(true);
    this.closeInsuranceTerms();
  };

  onAcceptTermsPersonalData = () => {
    this.termsPersonalData && this.termsPersonalData.setValue(true);
    this.closeTermsPersonalData();
  };

  toggleInsuranceModal = () => {
    this.setState({ showInsurancesList: !this.state.showInsurancesList });
  };

  isValidTerms = (showError = true) => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    if (showError) {
      this.setState({ isTermsValid });
    }
    return isTermsValid;
  };

  isValidTermsInsurance = (showError = true) => {
    const isTermInsurancesValid = this.termsInsurances
      ? this.termsInsurances.getValue()
      : false;
    if (showError) {
      this.setState({ isTermInsurancesValid });
    }
    return isTermInsurancesValid;
  };

  isValid = (showErrors = true) => {
    const isValidCode = this.isValidCode(showErrors);
    const isValidTerms = this.isValidTerms(showErrors);
    const isValidTermsInsurance =
      this.isValidTermsInsurance(showErrors) ||
      this.state.insurancesList.length === 0;
    const isValid = [isValidCode, isValidTerms, isValidTermsInsurance].every(
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

  loanParams = () => {
    const { route } = this.props;

    const resume = route.params && route.params.resume;
    const destination = route.params && route.params.destination;
    const option = route.params && route.params.option;

    const amount = resume.requestedAmount;
    const paymentDate = option.payDay.toString();

    return {
      paymentDate,
      amount,
      destination: Sanitizer.titleCase(destination.destinationName),
    } as AnalyticsTrackParams;
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

    const resume = route.params && route.params.resume;
    const target = route.params && route.params.target;
    const option = route.params && route.params.option;
    const email = route.params && route.params.email;
    const insurances = route.params && route.params.insurances;
    const destination = route.params && route.params.destination;
    const creditLine = route.params && route.params.creditLine;


    try {
      const amount = resume.requestedAmount;
      const currency = option.currency;
      const params = {
        currency,
        valueDate: '',
        _otp: this.code ? this.code.getValue() : '',
        aceptTermAndCondition: 'true',
        debitAccount: target.idProduct,
        _mail: email,
        amountFee: option.numberFee,
        creditLine: option.creditLine,
        payDay: option.payDay.toString(),
        numberFee: option.numberFee.toString(),
        amount: amount.toString(),
        wayToPay: destination.destinationId.toString(),
        typeofoffer: CreditLineOffer.TypeOfOffer.Disposition,
        requesttype: CreditLineOffer.RequestType.Disposition,
        requestnumber: '0',
        deliverydocuments: {
          type: '1',
          _destination: email,
        },
        accountId: option.accountKeyr,
        productId: creditLine.productKey,
        debitProductID: '0',
        creditProductID: target.idProduct,
        insuranceProduct: '1',
        graceType: '0',
        gracePeriod: '0',
        numberAffiliates: '1',
        channel: 'phonegap',
        insurances: {
          ids: '0',
          insuranceSelecteds: '0',
          insuranceTermsAccepted: 'true',
        },
      };
      const response = await API.Execute.requestLoanDisbursmentSend(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }

      const error = response.body.data as DefaultErrorResponse;
      if (response.body.code === API.ResponseCode.OK) {
        const idTransaction = response.body.idTransaction;
        const seedA = route.params && route.params.seedA;
        navigation.navigate('InstantCashSuccess', {
          idTransaction,
          amount,
          currency,
          target,
          insurances,
          itfFormated: Amount.format(response.body.data.itf, currency),
          seedA,
        });

        const currencyFormat = Sanitizer.getCurrencyByLabel(currency)!;
        const paramsInstantCash = {
          transaction_id: idTransaction,
          value: parseFloat(amount.toString()),
          currency: currencyFormat.code,
          coupon: 'EfectivoAltoque',
          items: [
            {
              item_id: 'EAT111',
              item_name: 'EfectivoAltoque',
              item_category: 'Desembolso',
              price: parseFloat(amount.toString()),
              quantity: 1,
            },
          ],
        };
        AnalyticsEvent.trackEvent('purchase', paramsInstantCash);

        const newSeedA = (seedA + '_confirm_sig') as
          | 'eat_flargo_pres_confirm_sig'
          | 'eat_flargo_ini_confirm_sig';
        AnalyticsEvent.track(A[newSeedA]);
        AnalyticsEvent.track(A.eat_flargo_confirm_sig);
        return;
      }
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

      let resume = route.params && route.params.resume;
      const target = route.params && route.params.target;
      const option = route.params && route.params.option;
      const destination = route.params && route.params.destination;
      const email = route.params && route.params.email;
      const creditLine = route.params && route.params.creditLine;
      const insurancesJoin = route.params && route.params.insurancesJoin;

      const params = {
        valueDate: '',
        debitAccount: target.idProduct,
        creditLine: option.creditLine,
        payDay: option.payDay.toString(),
        numberFee: option.numberFee.toString(),
        currency: option.currency,
        amount: resume.requestedAmount.toString(),
        wayToPay: destination.destinationId.toString(),
        typeOfOffer: CreditLineOffer.TypeOfOffer.Disposition,
        requestType: CreditLineOffer.RequestType.Disposition,
        requestnumber: '0',
        deliverydocuments: {
          type: '1',
          _destination: email,
        },
        accountId: option.accountKeyr,
        productId: creditLine.productKey,
        graceType: '0',
        gracePeriod: '0',
        numberAffiliates: '1',
        debitProductID: '0',
        creditProductID: target.idProduct,
        insuranceTermsAccepted: '1',
        insuranceProduct: insurancesJoin === '' ? '0' : insurancesJoin,
        amountFee: option.numberFee,
        insurances: {
          ids: insurancesJoin === '' ? '0' : insurancesJoin,
        },
      };
      const response = await API.Execute.requestLoanDisbursmentPreview(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'onResend', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        resume = response.body.data as LoanPreviewResponse;
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

  getInsuranceTitle = (id: number) => {
    switch (id) {
      case 1:
        return L.instantcash_insurance_title_1;
      case 2:
        return L.instantcash_insurance_title_2;
      case 3:
        return L.instantcash_insurance_title_3;
      case 4:
        return L.instantcash_insurance_title_4;
      default:
        return '';
    }
  };

  render() {
    const {
      isTermsValid,
      showTerms,
      showInsuranceTerms,
      bodyInsuranceTerms,
      showTermsComunications,
      showInsurancesList,
      showTermsPersonalData,
      isValid,
      isLoading,
      isTermInsurancesValid,
      firstTermsInsurancesValid,
      termsValueOne,
      termsValueTwo,
      termsValueFinal,
    } = this.state;
    const { route, isFocused } = this.props;
    let { resume, option, target, insurances } = this.state;
    if (!resume || !option || !target) {

      resume = route.params && route.params.resume;
      option = route.params && route.params.option;
      target = route.params && route.params.target;
    }

    const { currency } = option as { currency: string };
    const requestAMount = Amount.format((resume as any).requestedAmount, currency);
    const amount = Amount.format((resume as any).amount, currency);
    const targetName = Sanitizer.getProductTitle(target);
    const amountFee = Amount.format((resume as any).amountFee, currency);
    const insuranceDisposal = Amount.format((resume as any).insuranceDisposal, currency);
    const { insuranceDisposalRate, rate, payDay, term } = (resume as any);

    return (
      <Container>
        <SelectInsuranceModal
          key={'modal'}
          accessibilityLabel={'insuranceselector_modal'}
          visible={showInsurancesList}
          onPressItem={this.changeTargetInsurance}
          values={insurances}
          onClose={this.toggleInsuranceModal}
        />
        <TermsModal
          accessibilityLabel={'instantcashconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_instantcash}
          onClose={this.closeTerms}
          closeButton={{
            title: L.instantcashconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.instantcashconfirmscreen_modal_button_accept, //modal1
            onPress: this.onAcceptTerms,
          }}
        />
        <TermsModal
          accessibilityLabel={'instantcashshortconfirmscreen_termsmodal'}
          visible={showInsuranceTerms}
          body={bodyInsuranceTerms}
          onClose={this.closeInsuranceTerms}
          closeButton={{
            title: L.instantcashconfirmscreen_modal_button_close,
            onPress: this.closeInsuranceTerms,
          }}
          actionButton={{
            title: L.instantcashconfirmscreen_modal_button_accept, //modal2
            onPress: this.onAcceptInsuranceTerms,
          }}
        />
        <TermsModal
          accessibilityLabel={'instantcashshortconfirmscreen_termsmodal_clau'}
          visible={showTermsPersonalData}
          title={L.termsmodal_instantcash_personal_data_title}
          body={L.termsmodal_instantcash_personal_data_protection}
          onClose={this.closeTermsPersonalData}
          closeButton={{
            title: L.instantcashconfirmscreen_modal_button_close,
            onPress: this.closeTermsPersonalData,
          }}
          actionButton={{
            title: L.instantcashconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTermsPersonalData,
          }}
        />
        <TermsModal
          accessibilityLabel={
            'instantcashshortconfirmscreen_termsmodal_certificate'
          }
          visible={showTermsComunications}
          title={L.termsmodal_instantcash_comunications_certify_title}
          body={L.termsmodal_instantcash_comunications_certify}
          onClose={this.closeTermsComunications}
          closeButton={{
            title: L.instantcashconfirmscreen_modal_button_close,
            onPress: this.closeTermsComunications,
          }}
          actionButton={{
            title: L.instantcashconfirmscreen_modal_button_accept,
            onPress: this.onAcceptInsuranceTerms,
          }}
        />

        <FormSteps total={4} current={3} />
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
                accessibilityLabel={'instantcashconfirmscreen_header_title'}
                style={styles.marginTop}
                title={L.instantcashconfirmscreen_header_title}
                center
              />

              <CardView style={styles.cardOverview}>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_request_amount'
                  }
                >
                  {L.instantcashconfirmscreen_text_request_amount}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_request_amount_description'
                  }
                >
                  {requestAMount}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_target_account'
                  }
                >
                  {L.instantcashconfirmscreen_text_target_account}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_target_account_description'
                  }
                >
                  {targetName}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_amount_fee'
                  }
                >
                  {L.instantcashconfirmscreen_text_amount_fee}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_amount_fee_description'
                  }
                >
                  {amountFee}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={'instantcashconfirmscreen_text_term'}
                >
                  {L.instantcashconfirmscreen_text_term}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_term_description'
                  }
                >
                  {term}{' '}
                  {term === '1'
                    ? L.instantcashconfirmscreen_text_term_label_singular
                    : L.instantcashconfirmscreen_text_term_label_plural}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={'instantcashconfirmscreen_text_pay_day'}
                >
                  {L.instantcashconfirmscreen_text_pay_day}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashconfirmscreen_text_pay_day_description'
                  }
                >
                  {payDay} {L.instantcashconfirmscreen_text_paymentdate_label}
                </Text>
                <ExpandableView
                  accessibilityLabel={
                    'instantcashconfirmscreen_expandable_view'
                  }
                  maxHeight={140 + insurances.length * 40}
                  toggleContainerStyle={styles.marginToggle}
                  style={styles.marginExpandableView}
                >
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'instantcashconfirmscreen_text_pay_tcea'
                    }
                  >
                    {L.instantcashconfirmscreen_text_pay_tcea}
                  </Text>
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'instantcashconfirmscreen_text_pay_tcea_description'
                    }
                  >
                    {rate}
                    {'%'}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={styles.formLabel}
                      accessibilityLabel={
                        'instantcashconfirmscreen_text_insurance_disposal'
                      }
                    >
                      {L.instantcashconfirmscreen_text_insurance_disposal}
                    </Text>
                    <Tooltip
                      showInitial={false}
                      infoColor={true}
                      tooltipPosition={'right'}
                      tooltipStyle={{ padding: 12 }}
                      navigation={this.props.navigation}
                      imageStyle={styles.helpButtonIcon}
                      style={styles.tooltipContainer}
                      accessibilityLabel={
                        'instantcashconfirmscreen_email_tooltip'
                      }
                      message={
                        <Text>
                          {L.instantcashconfirmscreen_tooltip_message}
                        </Text>
                      }
                      imageSource={require('../../../assets/images/help-icon.png')}
                    />
                  </View>
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'instantcashconfirmscreen_text_insurance_disposal_description'
                    }
                  >
                    {insuranceDisposal} {'('}
                    {insuranceDisposalRate}
                    {'%)'}
                  </Text>
                  {insurances.map((item, index) => (
                    <View key={index}>
                      <Text
                        style={styles.formLabel}
                        accessibilityLabel={
                          'instantcashconfirmscreen_text_insurance_disposal'
                        }
                      >
                        {this.getInsuranceTitle(item.type.id)}
                      </Text>
                      <Text
                        style={styles.formText}
                        accessibilityLabel={
                          'instantcashconfirmscreen_text_amount_fee_description'
                        }
                      >
                        {Amount.format(item.amount, currency)}
                      </Text>
                    </View>
                  ))}
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={'instantcashconfirmscreen_text_amount'}
                  >
                    {L.instantcashconfirmscreen_text_amount}
                  </Text>
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'instantcashconfirmscreen_text_amount_description'
                    }
                  >
                    {amount}
                  </Text>
                </ExpandableView>
              </CardView>
              <CardView style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={'instantcashconfirmscreen_confirmcode'}
                  accessibilityAction={'instantcashconfirmscreen_actionbtn'}
                  accessibilityLabelLink={
                    'instantcashconfirmscreen_code_resend'
                  }
                  accessibilityLabelModal={
                    'instantcashconfirmscreen_modal_open'
                  }
                  accessibilityErrorInput={
                    'instantcashconfirmscreen_error_input'
                  }
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <CardView style={styles.cardSMSConfirm}>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={
                    !termsValueOne
                      ? 'instantcashconfirmscreen_checkbox_terms'
                      : 'instantcashconfirmscreen_checkbox_terms_off'
                  }
                  analyticsParams={
                    L.instantcashconfirmscreen_checkbox_terms_part1 +
                    L.instantcashconfirmscreen_checkbox_terms_part2
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={L.instantcashconfirmscreen_checkbox_terms_part1}
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'instantcashconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={L.instantcashconfirmscreen_checkbox_terms_part2}
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.instantcashconfirmscreen_texterror_terms
                  }
                />
              </CardView>
              {insurances.length > 0 && (
                <CardView padding style={styles.insurancesCard}>
                  <CheckBoxMulti
                    ref={ref => {
                      this.termsInsurances = ref;
                    }}
                    accessibilityLabel={
                      !termsValueTwo
                        ? 'instantcashshortconfirmscreencheckbox_terms_two'
                        : 'instantcashshortconfirmscreencheckbox_terms_two_off'
                    }
                    onChangeValue={this.onChangeChekboxTermsInsurancesValue}
                    analyticsParams={
                      L.instantcashconfirmscreen_checkbox_termsinsurances_part1 +
                      L.instantcashconfirmscreen_checkbox_termsinsurances_part2 +
                      L.instantcashconfirmscreen_checkbox_termsinsurances_part3 +
                      L.instantcashconfirmscreen_checkbox_termsinsurances_part4
                    }
                    container={
                      <Text style={styles.insurancesContainer}>
                        <Text style={styles.textTerms}>
                          {
                            L.instantcashconfirmscreen_checkbox_termsinsurances_part1
                          }
                        </Text>
                        <Text
                          onPress={() => {
                            this.showInsurancesList();
                            this.showInsurancesTrack(
                              L.instantcashconfirmscreen_checkbox_termsinsurances_part2
                            );
                          }}
                          // onPress={this.showInsurancesList}
                          style={styles.textTermsLinks}
                        >
                          {
                            L.instantcashconfirmscreen_checkbox_termsinsurances_part2
                          }
                        </Text>
                        <Text style={styles.textTerms}>
                          {
                            L.instantcashconfirmscreen_checkbox_termsinsurances_part3
                          }
                        </Text>
                        <Text
                          onPress={() => {
                            this.showTermsComunications();
                            this.showTermsComunicationsTrack(
                              L.instantcashconfirmscreen_checkbox_termsinsurances_part4
                            );
                          }}
                          style={styles.textTermsLinks}
                        >
                          {
                            L.instantcashconfirmscreen_checkbox_termsinsurances_part4
                          }
                        </Text>
                        <Text style={styles.textTerms}>
                          {
                            L.instantcashconfirmscreen_checkbox_termsinsurances_part5
                          }
                        </Text>
                      </Text>
                    }
                    errorMessage={
                      isTermInsurancesValid || !firstTermsInsurancesValid
                        ? ''
                        : L.instantcashshortconfirmscreen_texterror_terms
                    }
                  />
                </CardView>
              )}
              <CardView padding style={{ marginTop: 20 }}>
                <CheckBoxMulti
                  ref={ref => {
                    this.termsPersonalData = ref;
                  }}
                  accessibilityLabel={
                    !termsValueFinal
                      ? 'instantcashshortconfirmscreencheckbox_terms_final'
                      : 'instantcashshortconfirmscreencheckbox_terms_final_off'
                  }
                  analyticsParams={
                    L.instantcashconfirmscreen_checkbox_dataprotect_part1 +
                    L.instantcashconfirmscreen_checkbox_dataprotect_part2
                  }
                  onChangeValue={value => {
                    this.setState({ termsValueFinal: value });
                  }}
                  container={
                    <Text style={styles.cardText}>
                      <Text style={styles.textTerms}>
                        {L.instantcashconfirmscreen_checkbox_dataprotect_part1}
                      </Text>
                      <Text
                        onPress={() => {
                          this.showTermsPersonalData();
                          this.showTermsPersonalDataTrack(
                            L.instantcashconfirmscreen_checkbox_dataprotect_part2
                          );
                        }}
                        style={styles.textTermsLinks}
                      >
                        {L.instantcashconfirmscreen_checkbox_dataprotect_part2}
                      </Text>
                    </Text>
                  }
                />
              </CardView>
              <View style={styles.buttons}>
                <Button
                  disabled={
                    !isValid ||
                    (!isTermInsurancesValid && insurances.length > 0)
                  }
                  allowOnPress
                  accessibilityLabel={
                    'instantcashconfirmscreen_button_continue'
                  }
                  analyticsParams={this.loanParams}
                  onPress={this.tryToSubmit}
                  loading={isValid && isLoading}
                  title={L.instantcashconfirmscreen_button_continue}
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashConfirmScreenType = InstantCashConfirmScreen;
export default withFocused<InstantCashConfirmScreen, Props>(
  InstantCashConfirmScreen
);
