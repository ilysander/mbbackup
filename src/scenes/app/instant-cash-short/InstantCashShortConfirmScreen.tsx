import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  CheckBox,
  CheckBoxMulti,
  ButtonLink,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  Header,
  FormSteps,
  CardView,
  Button,
  SelectInsuranceModal,
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
import { View, StyleSheet, TextStyle, ViewStyle, Text } from 'react-native';
import NetworkManager from '../../../components/network/NetworkManager';
import TermsModal from '../../../components/info/TermsModal';
import {
  LoanPreviewResponse,
  AccountItemSavingsAll,
  ContentCreditLine,
  InsuranceItem,
} from '../../../api/backend/response/Execute';
import { KeyboardUtil } from '../../../resources/util';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import { Amount } from '../../../resources/money';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  containerHelpDetail: {
    marginVertical: 10,
  } as ViewStyle,
  containerExpandableView: {
    marginTop: 10,
  } as ViewStyle,
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  text: {
    ...Font(),
    color: Colors.grey5,
  } as TextStyle,
  subheader: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    fontSize: 18,
  } as TextStyle,
  feeDescription: {
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
    marginTop: 10,
    color: Colors.grey6,
    fontSize: 18,
    lineHeight: 24,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
  } as ViewStyle,
  cardOverview: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  buttons: {
    marginBottom: 50,
    marginTop: 40,
  } as ViewStyle,
  marginToggle: {
    marginTop: 10,
  } as ViewStyle,
  headerTop: {
    marginTop: 20 + 10, // 10 adicional por formsteps
  } as ViewStyle,
  headerBottom: {
    marginHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  marginTop: {
    marginHorizontal: 20,
    marginTop: 20 + 10, // 10 adicional por formsteps
    marginBottom: 20,
  } as ViewStyle,
  marginExpandableView: {
    marginHorizontal: 0,
  } as ViewStyle,
  modal: {
    backgroundColor: Colors.transparent,
    overflow: 'hidden',
    paddingBottom: 0,
    borderRadius: 6,
    paddingHorizontal: 0,
  } as ViewStyle,
  separator: {
    marginHorizontal: 5,
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
});

export interface Params {
  dataPreview: LoanPreviewResponse;
  creditLine: ContentCreditLine;
  target: AccountItemSavingsAll;
  email: string;
  currency: string;
  insurancesList: InsuranceItem[];
  insurances: {
    ids: string;
    selecteds: string;
    aceptTermAndCondition: string;
  };
  seedA: 'eat_urpi_pres' | 'eat_urpi_ini';
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isAllowedReadSMS: boolean;
  isValid: boolean;
  isTermsValid: boolean;
  isTermInsurancesValid: boolean;
  firstTermsInsurancesValid: boolean;
  firstTermValid: boolean;
  showTerms: boolean;
  showInsuranceTerms: boolean;
  showTermsPersonalData: boolean;
  showTermsComunications: boolean;
  showInsurancesList: boolean;
  insurancesList: InsuranceItem[];
  bodyInsuranceTerms: string;
  isLoadingResend: boolean;
  isLoading: boolean;
  creditLine?: ContentCreditLine;
  dataPreview?: LoanPreviewResponse;
  target?: AccountItemSavingsAll;
  isRequiredTerms: boolean;
  currency: string;
  isCheckTerms?: boolean;
  isCheckTermsInsurances?: boolean;
  isCheckPersonalData?: boolean;
}

const TAG = '[InstantCashShortConfirmScreen]';
class InstantCashShortConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.instantcashshortconfirmscreen_title,
  };

  state: State = {
    isLoading: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    isValid: false,
    isTermsValid: true,
    isTermInsurancesValid: true,
    firstTermValid: false,
    firstTermsInsurancesValid: false,
    showTerms: false,
    showInsuranceTerms: false,
    showTermsPersonalData: false,
    showTermsComunications: false,
    showInsurancesList: false,
    insurancesList: [],
    bodyInsuranceTerms: '',
    creditLine: undefined,
    dataPreview: undefined,
    target: undefined,
    isRequiredTerms: true,
    currency: '1',
  };
  code!: ConfirmCode | null;
  terms!: CheckBox | null;
  termsPersonalData!: CheckBox | null;
  termsInsurances!: CheckBoxMulti | null;

  componentDidMount() {

    const { route } = this.props;

    const insurancesList = route.params ? route.params.insurancesList : [];
    this.setState({
      insurancesList: insurancesList
    });
    this.load();
  }

  load = async () => {
    const { route } = this.props;
    const dataPreview = route.params && route.params.dataPreview;
    const target = route.params && route.params.target;
    const currency = route.params && route.params.currency;
    this.setState({
      dataPreview,
      target,
      currency,
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

  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isCheckTerms: value });
    this.setState({ isTermsValid: value, firstTermValid: true }, () =>
      this.isValid()
    );
  };

  onChangeChekboxTermsInsurancesValue = (value: boolean) => {
    this.setState({ isCheckTermsInsurances: value });
    this.setState(
      { isTermInsurancesValid: value, firstTermsInsurancesValid: true },
      () => this.isValid()
    );
  };

  onChangeChekboxTermsPersonalData = (value: boolean) => {
    this.setState({ isCheckPersonalData: value });
  };

  showTermsComunications = () => {
    AnalyticsEvent.track(
      A.instant_cash_short_confirmscreen_modal2,
      L.instantcashconfirmscreen_checkbox_termsinsurances_part4
    );
    this.setState({ showTermsComunications: true });
  };

  onTrackInsurances = (title: string) => {
    AnalyticsEvent.track(A.instant_cash_short_confirmscreen_2_urpi, title);
  };

  showInsurancesList = () => {
    if (this.state.insurancesList.length === 1) {
      this.changeTargetInsurance(this.state.insurancesList[0].type.id);
    } else {
      this.setState({ showInsurancesList: true });
    }
  };

  onTrackPersonalData = (title: string) => {
    AnalyticsEvent.track(A.instant_cash_short_confirmscreen_3_urpi, title);
  };

  showTerms = () => {
    AnalyticsEvent.track(
      A.instant_cash_short_confirmscreen_modal1,
      L.termsmodal_title
    );
    this.setState({ showTerms: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };

  showInsuranceTerms = () => {
    this.setState({ showInsuranceTerms: true });
  };

  closeInsuranceTerms = () => {
    this.setState({ showInsuranceTerms: false });
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  onAcceptInsuranceTerms = () => {
    this.termsInsurances && this.termsInsurances.setValue(true);
    this.closeInsuranceTerms();
  };

  showTermsPersonalData = () => {
    AnalyticsEvent.track(
      A.instant_cash_short_confirmscreen_modal3,
      L.instantcashconfirmscreen_checkbox_dataprotect_part2
    );
    this.setState({ showTermsPersonalData: true });
  };

  closeTermsPersonalData = () => {
    this.setState({ showTermsPersonalData: false });
  };

  closeTermsComunications = () => {
    this.setState({ showTermsComunications: false });
  };

  closeInsurancesList = () => {
    this.setState({ showInsurancesList: false });
  };

  onAcceptTermsPersonalData = () => {
    this.termsPersonalData && this.termsPersonalData.setValue(true);
    this.closeTermsPersonalData();
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

  toggleInsuranceModal = () => {
    this.setState({ showInsurancesList: !this.state.showInsurancesList });
  };

  isValid = async (showErrors = true) => {
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

  isValidCode = async (showErrors = true) => {
    return this.code && this.code.isValid(showErrors);
  };

  onChangeCode = async () => {
    this.isValid(false);
  };

  tryToSubmit = async () => {
    this.blur();
    const isValid = await this.isValid(false);
    if (isValid) {
      this.setState({ isLoading: true });
      this.submit();
    }
  };

  submit = async () => {
    const { navigation, route } = this.props;

    const dataPreview = route.params && route.params.dataPreview;
    const target = route.params && route.params.target;
    const email = route.params && route.params.email;
    const creditLine = route.params && route.params.creditLine;
    const currency = route.params && route.params.currency;
    const insurances = route.params && route.params.insurances || {
      ids: '',
      selecteds: '',
      aceptTermAndCondition: 'false',
    };

    insurances['aceptTermAndCondition'] = this.termsPersonalData?.state.checked
      ? 'true'
      : 'false';
    const params = {
      valueDate: '',
      _otp: this.code ? this.code.getValue() : '',
      aceptTermAndCondition: 'true',
      debitAccount: target.idProduct,
      _mail: email,
      payDay: dataPreview.payDay.toString(),
      amount: dataPreview.requestedAmount.toString(),
      typeOfOffer: CreditLineOffer.TypeOfOffer.Request,
      requestType: CreditLineOffer.RequestType.Urpi,
      requestnumber: creditLine.requestNumber,
      creditLine: creditLine.creditLine,
      currency,
      insurances,
      deliverydocuments: {
        type: '1',
        _destination: email,
      },
    };
    try {
      const response = await API.Execute.requestLoanSend(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const idTransaction = response.body.idTransaction;

        const seedA = route.params && route.params.seedA;

        const currencyFormat = Sanitizer.getCurrencyByLabel(currency)!;
        const paramsInstantCashShort = {
          transaction_id: idTransaction,
          value: dataPreview.requestedAmount,
          currency: currencyFormat.code,
          coupon: 'EfectivoAltoque',
          items: [
            {
              item_id: 'EAT22',
              item_name: 'EfectivoAltoqueFC',
              item_category: 'Desembolso',
              price: dataPreview.requestedAmount,
              quantity: 1,
            },
          ],
        };
        AnalyticsEvent.trackEvent('purchase', paramsInstantCashShort);
        navigation.navigate('InstantCashShortSuccess', {
          amount: dataPreview.requestedAmount,
          idTransaction,
          target,
          insurances,
          itfFormated: Amount.format(response.body.data.itf, currency),
          seedA,
          currency: currencyFormat.code,
        });

        const newSeedA = (seedA + '_confirm_sig') as
          | 'eat_urpi_pres_confirm_sig'
          | 'eat_urpi_ini_confirm_sig';
        AnalyticsEvent.track(A[newSeedA]);
        AnalyticsEvent.track(A.eat_urpi_confirm_sig);
        return;
      }
      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.creditAccount) {
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
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onResend = async () => {
    this.blur();
    AnalyticsEvent.track(A.instantcashshortconfirmscreen_text_resend_sms);
    this.setState({ isLoadingResend: true });
    try {
      const { route } = this.props;
      let dataPreview = route.params && route.params.dataPreview;
      const target = route.params && route.params.target;
      const email = route.params && route.params.email;
      const creditLine = route.params && route.params.creditLine;
      const currency = route.params && route.params.currency;

      const response = await API.Execute.requestLoanPreview({
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
        deliverydocuments: {
          type: '1',
          _destination: email,
        },
      });
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'onResend', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        dataPreview = response.body.data as LoanPreviewResponse;
        this.setState({ dataPreview });
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

  getTitleCheckTerms = () => {
    let text;
    text =
      L.instantcashshortconfirmscreen_checkbox_terms_part1 +
      ' ' +
      L.instantcashshortconfirmscreen_checkbox_terms_part2;
    return text;
  };

  render() {
    const {
      isTermsValid,
      isTermInsurancesValid,
      firstTermValid,
      firstTermsInsurancesValid,
      showTerms,
      showInsuranceTerms,
      showTermsPersonalData,
      showTermsComunications,
      showInsurancesList,
      insurancesList,
      bodyInsuranceTerms,
      isValid,
      isLoading,
      isCheckTerms,
      isCheckTermsInsurances,
      isCheckPersonalData,
    } = this.state;
    const { isFocused } = this.props;

    return (
      <Container>
        <SelectInsuranceModal
          key={'modal'}
          accessibilityLabel={'insuranceselector_modal'}
          visible={showInsurancesList}
          onPressItem={this.changeTargetInsurance}
          values={insurancesList}
          onClose={this.toggleInsuranceModal}
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
            title: L.instantcashconfirmscreen_modal_button_accept,
            onPress: this.onAcceptInsuranceTerms,
          }}
        />

        <TermsModal
          accessibilityLabel={'instantcashshortconfirmscreen_termsmodal_1'}
          visible={showTerms}
          body={L.termsmodal_content_instantcash}
          onClose={this.closeTerms}
          closeButton={{
            title: L.instantcashconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.instantcashconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
          }}
        />

        <TermsModal
          accessibilityLabel={'instantcashshortconfirmscreen_termsmodal_2'}
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

        <TermsModal
          accessibilityLabel={'instantcashshortconfirmscreen_termsmodal_3'}
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
          accessibilityLabel={'instantcashshortconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_instantcash}
          onClose={this.closeTerms}
          closeButton={{
            title: L.instantcashconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.instantcashconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
          }}
        />
        <FormSteps total={3} current={2} />
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
                accessibilityLabel={
                  'instantcashshortconfirmscreen_header_title'
                }
                style={styles.headerTop}
                title={L.instantcashshortconfirmscreen_header_title}
                center
              />
              <Header
                accessibilityLabel={
                  'instantcashshortconfirmscreen_header_title2'
                }
                style={styles.headerBottom}
                title={L.instantcashshortconfirmscreen_header_title2}
                center
              />

              <CardView style={styles.cardView} padding>
                <ConfirmCode
                  accessibilityLabel={
                    'instantcashshortconfirmscreen_confirmcode'
                  }
                  accessibilityTooltip={
                    'instcashshortconfirm_confirmcodetooltip'
                  }
                  accessibilityAction={'instantcashshort_actionbtn'}
                  accessibilityLabelLink={'instcashshort_confirm_codebtnlink'}
                  accessibilityLabelModal={'instcashshort_confirm_modal_open'}
                  accessibilityErrorInput={
                    'isntcashshortconfirm_error_textcodeurpi'
                  }
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <CardView padding>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={
                    !isCheckTerms
                      ? 'instantcashshortconfirmscreen_checkbox_terms_urpi_on'
                      : 'instantcashshortconfirmscreen_checkbox_terms_urpi_off'
                  }
                  analyticsParams={this.getTitleCheckTerms}
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={
                    L.instantcashshortconfirmscreen_checkbox_terms_part1
                  }
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'instantcashshortconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={
                        L.instantcashshortconfirmscreen_checkbox_terms_part2
                      }
                    />
                  }
                  errorMessage={
                    isTermsValid || !firstTermValid
                      ? ''
                      : L.instantcashshortconfirmscreen_texterror_terms
                  }
                />
              </CardView>
              {insurancesList.length > 0 && (
                <CardView padding style={styles.insurancesCard}>
                  <CheckBoxMulti
                    ref={ref => {
                      this.termsInsurances = ref;
                    }}
                    accessibilityLabel={
                      !isCheckTermsInsurances
                        ? 'instantcashshortconfirmscreen_checkbox_termsinsurances_urpi_on'
                        : 'instantcashshortconfirmscreen_checkbox_termsinsurances_urpi_off'
                    }
                    analyticsParams={
                      L.instantcashconfirmscreen_checkbox_termsinsurances_part4
                    }
                    onChangeValue={this.onChangeChekboxTermsInsurancesValue}
                    container={
                      <Text style={styles.insurancesContainer}>
                        <Text style={styles.textTerms}>
                          {
                            L.instantcashconfirmscreen_checkbox_termsinsurances_part1
                          }
                        </Text>
                        <Text
                          onPress={() => {
                            this.onTrackInsurances(
                              L.instantcashconfirmscreen_checkbox_termsinsurances_part1 +
                                L.instantcashconfirmscreen_checkbox_termsinsurances_part2
                            );
                            this.showInsurancesList();
                          }}
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
                          onPress={this.showTermsComunications}
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
                    !isCheckPersonalData
                      ? 'instantcashshortconfirmscreen_checkbox_termspersonaldata_urpi_on'
                      : 'instantcashshortconfirmscreen_checkbox_termspersonaldata_urpi_off'
                  }
                  analyticsParams={
                    L.instantcashconfirmscreen_checkbox_dataprotect_part2
                  }
                  onChangeValue={this.onChangeChekboxTermsPersonalData}
                  container={
                    <Text style={styles.cardText}>
                      <Text style={styles.textTerms}>
                        {L.instantcashconfirmscreen_checkbox_dataprotect_part1}
                      </Text>
                      <Text
                        onPress={() => {
                          this.showTermsPersonalData();
                          this.onTrackPersonalData(
                            L.instantcashconfirmscreen_checkbox_dataprotect_part1 +
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
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={
                    'instantcashshortconfirmscreen_button_continue'
                  }
                  style={{ minHeight: 50, alignItems: 'center' }}
                  textStyle={{ fontSize: 16 }}
                  onPress={this.tryToSubmit}
                  loading={isValid && isLoading}
                  title={L.instantcashshortconfirmscreen_button_continue}
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashShortConfirmScreenType = InstantCashShortConfirmScreen;
export default withFocused<InstantCashShortConfirmScreen, Props>(
  InstantCashShortConfirmScreen
);
