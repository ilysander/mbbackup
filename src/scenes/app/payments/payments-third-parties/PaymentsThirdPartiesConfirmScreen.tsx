import * as React from 'react';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import API from '../../../../api';
import TermsModal from '../../../../components/info/TermsModal';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';

import { A, AnalyticsEvent } from '../../../../resources/analytics';
import ConfirmCode from '../../../../components/sms/ConfirmCode';
import ExpandableView from '../../../../components/ui/ExpandableView';
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
} from '../../../../components/ui';
import {
  Colors,
  Currencies,
  ErrorRequest,
} from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';

import NetworkManager from '../../../../components/network/NetworkManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
  buttonStyle: {
    minHeight: 40,
  } as ViewStyle,
  formLabelBold: {
    ...semiboldText,
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 16,
  } as ViewStyle,
  formLabelCapitalize: {
    ...semiboldText,
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 16,
    textTransform: 'capitalize',
  } as ViewStyle,
  cardView: {
    padding: 20,
    marginBottom: 20,
  } as ViewStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  formLabel: {
    textAlign: 'left',
    ...Font(),
    marginTop: 10,
    color: Colors.grey5,
    fontSize: 14,
    lineHeight: 16,
  } as ViewStyle,
  cardOverview: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  marginToggle: {
    marginTop: 10,
  } as ViewStyle,
  marginExpandableView: {
    marginHorizontal: 0,
  } as ViewStyle,
  buttons: {
    marginTop: 40,
    marginBottom: 50,
  } as ViewStyle,
});

const TAG = '[PaymentsThirdPartiesConfirmScreen]';

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
  isRequiredTerms: boolean;
  isAllowedReadSMS: boolean;
  isLoadingResend: boolean;
  isValid: boolean;
}

class PaymentsThirdPartiesConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsthirdpartiesscreen_title,
  // };
  state: State = {
    isValid: false,
    isLoading: false,
    resume: undefined,
    loan: undefined,
    showTerms: false,
    isTermsValid: true,
    exchangeRate: '',
    exchange: '',
    isSameCurrency: false,
    showDetails: false,
    isRequiredTerms: true,
    isAllowedReadSMS: false,
    isLoadingResend: false,
  };
  code!: ConfirmCode | null;
  terms!: CheckBox | null;

  componentDidMount() {
    const { route } = this.props;
    const resume = route.params && route.params.resume;
    const loan = route.params && route.params.loan;

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

  isValidCode = (showErrors = true) => {
    return this.code && this.code.isValid(showErrors);
  };

  isValid = (showErrors = true) => {
    const isValidCode = this.isValidCode(showErrors);
    const isValidTerms = this.isValidTerms(showErrors);
    const isValid = [isValidCode, isValidTerms].every(item => !!item);
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  focus = () => {
    Log.debug(TAG, 'focus');
    this.code && this.code.focus();
  };

  onChangeCode = () => {
    this.isValid(false);
  };

  tryToSubmit = () => {
    const { isRequiredTerms } = this.state;
    if (isRequiredTerms) {
      const isTermsValid = this.terms ? this.terms.getValue() : false;
      this.setState({ isTermsValid });
      if (!isTermsValid) {
        return;
      }
    }
    this.submit();
  };

  submit = async () => {
    this.setState({ isLoading: true });
    const { navigation, route } = this.props;
    const { exchangeRate, exchange, isSameCurrency } = this.state;
    const loan = route.params && route.params.loan;
    const origin = route.params && route.params.origin;
    const isFeePayment = route.params && route.params.isFeePayment;
    const isLastPayment = route.params && route.params.isLastPayment;
    const resume = route.params && route.params.resume;
    const loanAmount = route.params && route.params.loanAmount;


    const debitAccount = resume.debitAccount;
    const valueData = '';
    const acceptTermAndCondition = true;
    const otpCode = this.code ? this.code.getValue() : '';
    try {
      const response = await API.Execute.payLoanThirdPartiesSend7(
        valueData,
        false, //isFrequentContact
        acceptTermAndCondition,
        otpCode,
        resume.loan,
        {
          quantity: loanAmount,
          currency: resume.loanAmount.currency,
        },
        debitAccount
      );
      const { body } = response;
      if (body.code === API.ResponseCode.OK) {
        const { idTransaction } = response.body;
        navigation.navigate('PaymentsThirdPartiesSuccess', {
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

  blur = () => {
    Log.debug(TAG, 'blur');
    KeyboardUtil.hide();
  };

  onChangeCheckboxTermsValue = async (value: boolean) => {
    await this.setState({ isTermsValid: value });
    this.isValid(false);
  };

  showTerms = () => {
    this.setState({ showTerms: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  onResend = async () => {
    this.blur();
    AnalyticsEvent.track(A.paymentsthirdpartiesconfirmscreen_text_resend_sms);
    this.setState({ isLoadingResend: true });
    try {
      const { route } = this.props;

      let resume = route.params && route.params.resume;
      const origin = route.params && route.params.origin;
      const currency = route.params && route.params.currency;
      const loan = route.params && route.params.loan;

      const response = await API.Execute.thirdPartiesLocalPreview(
        '',
        loan ? loan.getValue() : '',
        {
          currency: currency.label,
          quantity: resume.totalAmount,
        },
        origin.idProduct
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'onResend', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        resume = response.body.data;
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

  focusIfAllowed = () => {
    const { isAllowedReadSMS } = this.state;
    !isAllowedReadSMS && this.focus();
  };

  render() {
    const { isLoading, isTermsValid, showTerms, isValid } = this.state;
    const { isFocused, route } = this.props;
    const { isRequiredTerms } = this.state;

    const resume = route.params && route.params.resume;
    const origin = route.params && route.params.origin;
    const totalAmount = Amount.format(resume.totalAmount, Currencies.PEN.label);
    const capital = Amount.format(resume.capital, Currencies.PEN.label);
    const interest = Amount.format(resume.interest, Currencies.PEN.label);
    const overdue = Amount.format(resume.overdue, Currencies.PEN.label);
    const itf = Amount.format(resume.itf, Currencies.PEN.label);
    const otherAmount = Amount.format(resume.otherAmount, Currencies.PEN.label);
    const eeccAmount = Amount.format(resume.eeccAmount, Currencies.PEN.label);
    const numberAccount = origin.extraInfo.split('|')[4];
    const account_name = origin.shortLabel
      ? origin.shortLabel.replace(numberAccount, '').trim()
      : origin.shortLabel.replace(numberAccount, '').trim();
    const loan = resume.loan.replace(', ', ' (').concat(')');
    return (
      <Container>
        <TermsModal
          accessibilityLabel={'paymentsthirdpartiesconfirmscreen_terms_modal'}
          visible={showTerms}
          body={L.termsmodal_content_paymentthirdpartiesloans}
          onClose={this.closeTerms}
          closeButton={{
            title: L.paymentsthirdpartiesconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
            style: styles.buttonStyle,
          }}
          actionButton={{
            title: L.paymentsthirdpartiesconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
            style: styles.buttonStyle,
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
                title={L.paymentsthirdpartiesconfirmscreen_header_title}
                accessibilityLabel={
                  'paymentsthirdpartiesconfirmscreen_header_title'
                }
              />
              <CardView style={styles.cardOverview}>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_request_amount'
                  }
                >
                  {L.paymentsthirdpartiesconfirmscreen_text_amount}
                </Text>
                <Text
                  style={styles.formLabelBold}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_request_amount_description'
                  }
                >
                  {totalAmount}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_origin_account'
                  }
                >
                  {L.paymentsthirdpartiesconfirmscreen_text_origin_account}
                </Text>
                <Text
                  style={styles.formLabelBold}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_origin_account_description'
                  }
                >
                  {account_name}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_loan_number'
                  }
                >
                  {L.paymentsthirdpartiesconfirmscreen_text_loan_number}
                </Text>
                <Text
                  style={styles.formLabelBold}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_loan_number_description'
                  }
                >
                  {loan}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_loan_owner'
                  }
                >
                  {L.paymentsthirdpartiesconfirmscreen_text_loan_owner}
                </Text>
                <Text
                  style={styles.formLabelCapitalize}
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_text_loan_owner_description'
                  }
                >
                  {resume.loanHolder}
                </Text>
                <ExpandableView
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_expandable_view'
                  }
                  maxHeight={250}
                  toggleContainerStyle={styles.marginToggle}
                  style={styles.marginExpandableView}
                >
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_capital'
                    }
                  >
                    {L.paymentsthirdpartiesconfirmscreen_text_capital}
                  </Text>
                  <Text
                    style={styles.formLabelBold}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_capital_description'
                    }
                  >
                    {capital}
                  </Text>
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_fee'
                    }
                  >
                    {L.paymentsthirdpartiesconfirmscreen_text_fee}
                  </Text>
                  <Text
                    style={styles.formLabelBold}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_fee_description'
                    }
                  >
                    {interest}
                  </Text>
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_fee_penalty'
                    }
                  >
                    {L.paymentsthirdpartiesconfirmscreen_text_fee_penalty}
                  </Text>
                  <Text
                    style={styles.formLabelBold}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_fee_penalty_description'
                    }
                  >
                    {overdue}
                  </Text>
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_account_status'
                    }
                  >
                    {L.paymentsthirdpartiesconfirmscreen_text_account_status}
                  </Text>
                  <Text
                    style={styles.formLabelBold}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_account_status_description'
                    }
                  >
                    {eeccAmount}
                  </Text>
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_itf'
                    }
                  >
                    {L.paymentsthirdpartiesconfirmscreen_text_itf}
                  </Text>
                  <Text
                    style={styles.formLabelBold}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_itf_description'
                    }
                  >
                    {itf}
                  </Text>
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_others'
                    }
                  >
                    {L.paymentsthirdpartiesconfirmscreen_text_others}
                  </Text>
                  <Text
                    style={styles.formLabelBold}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_text_others_description'
                    }
                  >
                    {otherAmount}
                  </Text>
                </ExpandableView>
              </CardView>
              <CardView style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={
                    'paymentsthirdpartiesconfirmscreen_confirmcode'
                  }
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              {isRequiredTerms && (
                <CardView padding>
                  <CheckBox
                    ref={ref => {
                      this.terms = ref;
                    }}
                    accessibilityLabel={
                      'paymentsthirdpartiesconfirmscreen_checkbox_terms'
                    }
                    onChangeValue={this.onChangeCheckboxTermsValue}
                    placeholder={
                      L.paymentsthirdpartiesconfirmscreen_checkbox_terms_part1
                    }
                    rightContainer={
                      <ButtonLink
                        accent={'primary'}
                        accessibilityLabel={
                          'paymentsthirdpartiesconfirmscreen_buttonlink_terms'
                        }
                        onPress={this.showTerms}
                        title={
                          L.paymentsthirdpartiesconfirmscreen_checkbox_terms_part2
                        }
                        style={{ paddingVertical: 0 }}
                      />
                    }
                    errorMessage={
                      isTermsValid
                        ? ''
                        : L.paymentsthirdpartiesconfirmscreen_texterror_terms
                    }
                  />
                </CardView>
              )}
              <Button
                disabled={!isValid}
                style={styles.buttons}
                accessibilityLabel={
                  'paymentsthirdpartiesconfirmscreen_button_confirm'
                }
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.paymentsthirdpartiesconfirmscreen_button_confirm}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsThirdPartiesConfirmScreenType = PaymentsThirdPartiesConfirmScreen;
export default withFocused<PaymentsThirdPartiesConfirmScreen, Props>(
  PaymentsThirdPartiesConfirmScreen
);
