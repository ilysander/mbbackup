import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import API from '../../../../api';
import TermsModal from '../../../../components/info/TermsModal';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  ButtonLink,
  CardView,
  CheckBox,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
} from '../../../../components/ui';
import {
  Colors,
  Currencies,
  ErrorRequest,
} from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import ModalTermsLPDP from '../../../../components/terms-lpdp/ModalTermsLPDP';
import CheckLPDP from '../../../../components/terms-lpdp/CheckLPDP';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AnalyticsEvent from '../../../../resources/analytics/AnalyticsEvent.web';
import { A } from '../../../../resources/analytics';

const semiboldText = {
  textAlign: 'left',
  color: Colors.grey6,
  ...Font({ weight: 'Bold' }),
};
const styles = StyleSheet.create({
  formText: {
    color: Colors.grey6,
    ...Font(),
    fontSize: 14,
    lineHeight: 16,
  } as TextStyle,
  formLabelBold: {
    ...semiboldText,
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 16,
  } as ViewStyle,
  leftText: {
    ...Font({ weight: 'Medium' }),
    fontSize: 13,
    lineHeight: 15,
    color: Colors.grey4,
  } as TextStyle,
  formMainLabel: {
    ...semiboldText,
    color: Colors.accent,
    fontSize: 14,
    lineHeight: 16,
  } as ViewStyle,
  formMainAccent: {
    ...semiboldText,
    color: Colors.accent,
    fontSize: 20,
    lineHeight: 24,
  } as ViewStyle,
  footerContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 33,
  } as ViewStyle,
  detailsButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 0,
  } as ViewStyle,
  splitLine: {
    marginTop: 10,
  } as ViewStyle,
  cardView: {
    padding: 20,
  } as ViewStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  spaceLine: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
});

const TAG = '[PaymentsOwnLoansConfirmScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  resume?: any;
  loan?: any;
  showTerms: boolean;
  isTermsValid: boolean;
  exchangeRate: string;
  exchange: any;
  isSameCurrency: boolean;
  showDetails: boolean;
}

class PaymentsOwnLoansConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsscreen_title,
  // };
  state: State = {
    isLoading: false,
    resume: undefined,
    loan: undefined,
    showTerms: false,
    isTermsValid: true,
    exchangeRate: '',
    exchange: '',
    isSameCurrency: false,
    showDetails: false,
  };

  terms!: CheckBox | null;

  modalTermsLpdp!: ModalTermsLPDP | null;
  checkLpdp!: CheckLPDP | null;

  componentDidMount() {
    const { route } = this.props;

    const resume = route.params && route.params.resume;
    const loan = route.params && route.params.loan;

    // const resume = navigation.getParam('resume');
    // const loan = navigation.getParam('loan');

    const { creditCurrency } = resume;
    const { currency } = resume.loanAmount;
    let isSameCurrency = true;
    let exchangeRate = '';
    let exchange = '';

    if (creditCurrency !== currency) {
      isSameCurrency = false;
      const values = resume.exchangeRate.split(' ');
      exchange = Amount.format(resume.exchange, Currencies.PEN.label, {
        precision: 3,
      });
      exchangeRate = Amount.format(values[values.length - 1], creditCurrency);
    }
    this.setState({
      resume,
      loan,
      exchangeRate,
      exchange,
      isSameCurrency,
      showDetails: isSameCurrency,
    });
  }

  tryToSubmit = () => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    this.setState({ isTermsValid });
    if (!isTermsValid) {
      return;
    }
    this.submit();
  };

  submit = async () => {
    this.setState({ isLoading: true });

    const { navigation, route } = this.props;
    const { exchangeRate, exchange, isSameCurrency } = this.state;
    // const resume = navigation.getParam('resume');
    // const loan = navigation.getParam('loan');
    // const origin = navigation.getParam('origin');
    // const loanAmount = navigation.getParam('loanAmount');
    // const isFeePayment = navigation.getParam('isFeePayment');
    // const isLastPayment = navigation.getParam('isLastPayment');


    const resume = route.params && route.params.resume;
    const loan = route.params && route.params.loan;
    const origin = route.params && route.params.origin;
    const loanAmount = route.params && route.params.loanAmount;
    const isFeePayment = route.params && route.params.isFeePayment;
    const isLastPayment = route.params && route.params.isLastPayment;

    const debitAccount = resume.debitAccount;
    const valueData = '';
    const acceptTermAndCondition = true;
    try {
      const response = await API.Execute.payLoanOwnSend6(
        resume.loan,
        loanAmount,
        debitAccount,
        valueData,
        acceptTermAndCondition
      );
      const { body } = response;
      if (body.code === API.ResponseCode.OK) {
        const { idTransaction } = response.body;
        this.checkLpdp && this.checkLpdp.trySave();
        navigation.navigate('PaymentsOwnLoansSuccess', {
          idTransaction,
          resume,
          loan,
          origin,
          exchange,
          exchangeRate,
          isSameCurrency,
          isFeePayment,
          isLastPayment,
        });
        AnalyticsEvent.track(
          A.fb_payment_cuota,
          {},
          A.fee_payment,
          {
            fb_content_type: 'EfectivoAltoque',
            value: this.state.resume.loanAmount.quantity,
            _valueToSum: this.state.resume.loanAmount.totalAmount,
            fb_currency: loanAmount,
          }
        );
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

  goBack = () => {
    this.props.navigation.goBack();
  };
  blur = () => {
    Log.debug(TAG, 'blur');
    KeyboardUtil.hide();
  };
  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isTermsValid: value });
  };

  showTerms = () => {
    this.setState({ showTerms: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  showTermsLpdp = () => {
    this.modalTermsLpdp && this.modalTermsLpdp.showPanel();
  };

  /* NOSONAR */
  render() {
    const { isLoading, isTermsValid, showTerms, showDetails } = this.state;
    const { isFocused, route } = this.props;
    const { exchange, exchangeRate, isSameCurrency } = this.state;


    const resume = route.params && route.params.resume;
    const loan = route.params && route.params.loan;
    const origin = route.params && route.params.origin;

    const currencyLoan = resume.loanAmount.currency;
    const {
      capital = 0,
      itf = 0,
      overdue = 0,
      interest = 0,
      eeccAmount = 0,
      otherAmountWithoutEECC = 0,
    } = resume;
    const capitalFormatted = Validate.formatAmount(capital, currencyLoan);
    const itfFormatted = Validate.formatAmount(itf, currencyLoan);
    const overdueFormatted = Validate.formatAmount(overdue, currencyLoan);
    const interestFormatted = Validate.formatAmount(interest, currencyLoan);
    const otherFormatted = Validate.formatAmount(
      otherAmountWithoutEECC,
      currencyLoan
    );
    const eeccAmountFormatted = Validate.formatAmount(eeccAmount, currencyLoan);

    const amountMoney = Amount.format(
      resume.loanAmount.quantity,
      resume.loanAmount.currency
    );

    const targetLoanLabel = Sanitizer.getAccountFormattedFromLabel(
      resume.loanLabel,
      loan.loanNumber
    );
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
    return (
      <Container>
        <TermsModal
          accessibilityLabel={'paymentsownloansconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_paymentsownsloans}
          onClose={this.closeTerms}
          closeButton={{
            title: L.paymentsownloansconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.paymentsownloansconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
          }}
        />
        <FormSteps total={3} current={2} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />

              <Header
                center
                style={styles.header}
                title={L.paymentsownloansconfirmscreen_header_title}
                accessibilityLabel={
                  'paymentsownloansconfirmscreen_header_title'
                }
              />
              {!isSameCurrency && (
                <>
                  <CardView style={styles.cardView}>
                    <View>
                      <Text
                        style={styles.formMainLabel}
                        accessibilityLabel={
                          'paymentsownloansconfirmscreen_text_amount'
                        }
                      >
                        {L.paymentsownloansconfirmscreen_text_amount}
                      </Text>
                      <Text style={styles.formMainAccent}>{amountMoney}</Text>

                      <ButtonLink
                        accent={'primary'}
                        strong
                        accessibilityLabel={
                          'paymentsownloansconfirmscreen_buttonlink_details'
                        }
                        onPress={this.toggleDetails}
                        title={
                          showDetails
                            ? L.paymentsownloansconfirmscreen_buttonlink_close_details
                            : L.paymentsownloansconfirmscreen_buttonlink_show_details
                        }
                        hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
                        style={styles.detailsButtonContainer}
                      />
                    </View>
                    {showDetails && (
                      <>
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'paymentsownloansconfirmscreen_text_amountdetails_capital'
                          }
                        >
                          {L.transactionpaymentloan_capital_label}:{' '}
                          {capitalFormatted.valueFormatted}
                        </Text>
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'paymentsownloansconfirmscreen_text_amountdetails_interest'
                          }
                        >
                          {L.transactionpaymentloan_interest_label}:{' '}
                          {interestFormatted.valueFormatted}
                        </Text>
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'paymentsownloansconfirmscreen_text_amountdetails_overdue'
                          }
                        >
                          {L.transactionpaymentloan_overdue_label}:{' '}
                          {overdueFormatted.valueFormatted}
                        </Text>
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'paymentsownloansconfirmscreen_text_amountdetails_bankstatement'
                          }
                        >
                          {L.shareconstance_paymentloan_bankingstatus}:{' '}
                          {eeccAmountFormatted.valueFormatted}
                        </Text>
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'paymentsownloansconfirmscreen_text_amountdetails_itf'
                          }
                        >
                          {L.transactionpaymentloan_itf_label}:{' '}
                          {itfFormatted.valueFormatted}
                        </Text>
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'paymentsownloansconfirmscreen_text_amountdetails_other'
                          }
                        >
                          {L.transactionpaymentloan_other_label}:{' '}
                          {otherFormatted.valueFormatted}
                        </Text>
                      </>
                    )}
                    <View style={styles.splitLine} />
                    <Text
                      style={styles.formLabelBold}
                      accessibilityLabel={
                        'paymentsownloansconfirmscreen_text_exchange'
                      }
                    >
                      {L.paymentsownloansconfirmscreen_text_exchange}
                      {':'} {exchange}
                    </Text>
                    <View style={styles.splitLine} />
                    <Text
                      style={styles.formLabelBold}
                      accessibilityLabel={
                        'paymentsownloansconfirmscreen_text_exchange_rate'
                      }
                    >
                      {L.paymentsownloansconfirmscreen_text_exchange_rate}
                      {':'} {exchangeRate}
                    </Text>
                  </CardView>

                  <View style={{ marginVertical: 10 }} />

                  <CardView style={styles.cardView}>
                    <Text
                      style={styles.formText}
                      accessibilityLabel={
                        'paymentsownloansconfirmscreen_text_payment_type'
                      }
                    >
                      {L.paymentsownloansconfirmscreen_text_payment_type}
                    </Text>
                    <Text
                      style={styles.formLabelBold}
                      accessibilityLabel={
                        'paymentsownloansconfirmscreen_text_payment_type_description'
                      }
                    >
                      {
                        L.paymentsownloansconfirmscreen_text_payment_type_description
                      }
                    </Text>
                    <View style={styles.splitLine} />
                    <Text
                      style={styles.formText}
                      accessibilityLabel={
                        'paymentsownloansconfirmscreen_text_account_destiny'
                      }
                    >
                      {L.paymentsownloansconfirmscreen_text_account_destiny}
                    </Text>
                    <Text style={styles.formLabelBold}>{targetLoanLabel}</Text>

                    <View style={styles.splitLine} />
                    <Text
                      style={styles.formText}
                      accessibilityLabel={
                        'paymentsownloansconfirmscreen_text_account_origin'
                      }
                    >
                      {L.paymentsownloansconfirmscreen_text_account_origin}
                    </Text>
                    <Text style={styles.formLabelBold}>{originLabel}</Text>
                  </CardView>
                </>
              )}

              {isSameCurrency && (
                <CardView style={styles.cardView}>
                  <Text
                    style={styles.formMainLabel}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_amount'
                    }
                  >
                    {L.paymentsownloansconfirmscreen_text_amount}
                  </Text>
                  <Text style={styles.formMainAccent}>{amountMoney}</Text>

                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_amountdetails_capital'
                    }
                  >
                    {L.transactionpaymentloan_capital_label}:{' '}
                    {capitalFormatted.valueFormatted}
                  </Text>
                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_amountdetails_interest'
                    }
                  >
                    {L.transactionpaymentloan_interest_label}:{' '}
                    {interestFormatted.valueFormatted}
                  </Text>
                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_amountdetails_overdue'
                    }
                  >
                    {L.transactionpaymentloan_overdue_label}:{' '}
                    {overdueFormatted.valueFormatted}
                  </Text>
                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_amountdetails_bankstatement'
                    }
                  >
                    {L.transactionpaymentloan_bankingstatus}:{' '}
                    {eeccAmountFormatted.valueFormatted}
                  </Text>
                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_amountdetails_itf'
                    }
                  >
                    {L.transactionpaymentloan_itf_label}:{' '}
                    {itfFormatted.valueFormatted}
                  </Text>
                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_amountdetails_other'
                    }
                  >
                    {L.transactionpaymentloan_other_label}:{' '}
                    {otherFormatted.valueFormatted}
                  </Text>

                  <View style={styles.splitLine} />
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_payment_type'
                    }
                  >
                    {L.paymentsownloansconfirmscreen_text_payment_type}
                  </Text>
                  <Text
                    style={styles.formLabelBold}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_payment_type_description'
                    }
                  >
                    {
                      L.paymentsownloansconfirmscreen_text_payment_type_description
                    }
                  </Text>
                  <View style={styles.splitLine} />
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_account_destiny'
                    }
                  >
                    {L.paymentsownloansconfirmscreen_text_account_destiny}
                  </Text>
                  <Text style={styles.formLabelBold}>{targetLoanLabel}</Text>
                  <View style={styles.splitLine} />
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'paymentsownloansconfirmscreen_text_account_origin'
                    }
                  >
                    {L.paymentsownloansconfirmscreen_text_account_origin}
                  </Text>
                  <Text style={styles.formLabelBold}>{originLabel}</Text>
                </CardView>
              )}

              <View style={styles.spaceLine} />

              <CardView padding>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={
                    'paymentsownloansconfirmscreen_checkbox_terms'
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={
                    L.paymentsownloansconfirmscreen_checkbox_terms_part1
                  }
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'paymentsownloansconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={
                        L.paymentsownloansconfirmscreen_checkbox_terms_part2
                      }
                      style={{ paddingVertical: 0 }}
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.paymentsownloansconfirmscreen_texterror_terms
                  }
                />
              </CardView>

              <CheckLPDP
                ref={ref => {
                  this.checkLpdp = ref;
                }}
                showTermsLpdp={this.showTermsLpdp}
                accessibilityLabelCheck={
                  'paymentsownloansconfirmscreen_checkbox_terms_lpdp'
                }
                accessibilityLabelLinkOpenModal={
                  'paymentsownloansconfirmscreen_checklink_terms_lpdp'
                }
              />

              <SpacedView style={styles.footerContainer}>
                <Button
                  light
                  title={L.paymentsownloansconfirmscreen_button_back}
                  accessibilityLabel={
                    'paymentsownloansconfirmscreen_button_back'
                  }
                  onPress={this.goBack}
                  big
                />
                <Button
                  loading={isLoading}
                  title={L.paymentsownloansconfirmscreen_button_confirm}
                  accessibilityLabel={
                    'paymentsownloansconfirmscreen_button_confirm'
                  }
                  onPress={this.tryToSubmit}
                  big
                />
              </SpacedView>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <ModalTermsLPDP
          ref={ref => {
            this.modalTermsLpdp = ref;
          }}
          accessibilityLabel={'paymentsownloansconfirmscreen_modalldpdp'}
          accessibilityLabelButtonClose={
            'paymentsownloansconfirmscreen_modalldpdp_close'
          }
          accessibilityLabelExpandableItem={
            'paymentsownloansconfirmscreen_modalldpdp_toggle'
          }
        />
      </Container>
    );
  }
}

export type PaymentsOwnLoansConfirmScreenType = PaymentsOwnLoansConfirmScreen;
export default withFocused<PaymentsOwnLoansConfirmScreen, Props>(
  PaymentsOwnLoansConfirmScreen
);
