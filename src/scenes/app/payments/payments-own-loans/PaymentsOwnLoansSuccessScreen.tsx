const moment = require('moment');
import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import API from '../../../../api';
import { CoreReadTransactionPaymentsOwnLoansResponse } from '../../../../api/backend/response/Execute';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../../components/transactions/ShareReceipt';
import TransactionRecord from '../../../../components/transactions/TransactionRecord';
import ConfirmationSendingMessage from '../../../../components/transfers/ConfirmationSendingMessage';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  SafeAreaView,
  Happy,
  BannerPaidLoan,
} from '../../../../components/ui';
import { Colors, TransactionType } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Sanitizer, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import AddEmailCard from '../../../../components/email/AddEmailCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttonLink: {
    padding: 0,
    marginTop: 20,
  } as ViewStyle,
  button: {
    marginTop: 20,
    marginBottom: 20,
  } as ViewStyle,
  footer: {
    alignItems: 'center',
    marginTop: 20,
  } as ViewStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  buttonLinkTitle: {
    color: Colors.primary,
  } as ViewStyle,
  header: {
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  content: {
    position: 'relative',
  } as ViewStyle,
  loadingOverlay: {
    backgroundColor: Colors.grey1,
  } as ViewStyle,
  happyHeaderContainer: {
    paddingTop: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 2,
  } as ViewStyle,
  headerContainer: {
    paddingTop: 10,
  } as ViewStyle,
  contentMain: {
    paddingTop: 0,
  } as ViewStyle,
  detailContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  } as ViewStyle,
  marginDetail: {
    marginBottom: 10,
  } as ViewStyle,
  buttons: {
    marginTop: 20,
    marginBottom: 32,
  } as ViewStyle,
  marginButton: {
    marginBottom: 20,
    height: 40,
    minHeight: 40,
  } as ViewStyle,
  buttonTextShare: {
    fontSize: 16,
  } as TextStyle,
  buttonTextEnd: {
    fontSize: 16,
  } as TextStyle,
  happy: {
    width: Size.getWidth(),
    height: 162,
    marginTop: 20,
  } as ViewStyle,
});

const TAG = '[PaymentsOwnLoansSuccessScreen]';
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  resume: any;
  loan: any;
}

class PaymentsOwnLoansSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  state: State = {
    isLoading: false,
    resume: {},
    loan: {},
  };

  shareView!: ShareReceipt | null;

  componentDidMount() {
    this.load();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { isFocused } = this.props;
    if (!isFocused) {
      return false;
    }
    this.goToPaymentsHome();
    return true;
  };
  goToPaymentsHome = () => {
    const { navigation } = this.props;
    navigation.navigate('PaymentsHome');
  };
  updateMail = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  share = () => {
    this.shareView &&
      this.shareView.shareConstance(
        L.paymentsownloanssuccessscreen_shareconstance_title
      );
  };
  tooltipAction = () => {
    return true;
  };

  goToDetailLoan = () => {
    const { navigation } = this.props;
    const { loan } = this.state;
    const item = Object.assign({}, loan);
    navigation.navigate('Loan', { item });
  };

  load = async () => {
    const { route } = this.props;

    let resume = route.params && route.params.resume;
    const idTransaction = route.params && route.params.idTransaction;
    const loan = route.params && route.params.loan;

    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionPaymentsOwnLoansResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { data } = response.body.data.transaction;
      resume = {
        ...resume,
        capital: data.capital,
        interest: data.interest,
        overdue: data.overdue,
        debitAmount: data.debitAmount,
        currency: data.creditCurrency,
        operationNumber: `${data.operationNumber}`,
        itf: data.itf,
        date: data.date,
        userEmail: data.userEmail,
        originLabel: data.debitAccountLabel,
        targetLabel: data.loanLabel,
      };
      this.setState({ resume, loan, isLoading: false });
    } catch (e) {
      Log.exception(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
      this.setState({ isLoading: false });
    }
  };
  checkLoanAmount = (loanAmount: any) => {
    return !!(loanAmount && loanAmount.quantity && loanAmount.currency);
  };
  generateDataReceipt = () => {
    const { route } = this.props;
    const { resume, loan } = this.state;

    // const origin = navigation.getParam('origin');
    // const isSameCurrency = navigation.getParam('isSameCurrency');

    const origin = route.params && route.params.origin;
    const isSameCurrency = route.params && route.params.isSameCurrency;


    const {
      currency,
      debitAmount,
      creditAccountHolder,
      date,
      capital,
      interest = 0,
      overdue = 0,
      operationNumber,
      itf = 0,
      loanLabel,
      otherAmountWithoutEECC = 0,
      eeccAmount = 0,
      exchange,
      loanAmount,
    } = resume;
    let amountFormatted = '';
    let loanCurrency = '';
    if (this.checkLoanAmount(loanAmount)) {
      amountFormatted = Amount.format(loanAmount.quantity, loanAmount.currency);
      loanCurrency = loanAmount.currency;
    }
    const capitalFormatted = Validate.formatAmount(capital, loanCurrency);
    const itfFormatted = Validate.formatAmount(itf, loanCurrency);
    const overdueFormatted = Validate.formatAmount(overdue, loanCurrency);
    const interestFormatted = Validate.formatAmount(interest, loanCurrency);
    const otherFormatted = Validate.formatAmount(
      otherAmountWithoutEECC,
      loanCurrency
    );
    const eeccAmountLabel = Validate.formatAmount(eeccAmount, loanCurrency);
    const targetLoanLabel = Sanitizer.getAccountFormattedFromLabel(
      loanLabel,
      loan.loanNumber
    );
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );

    const detailsAmount: string[] = [];
    detailsAmount.push(amountFormatted);
    detailsAmount.push(
      L.shareconstance_paymentloan_capital_label +
      ': ' +
      capitalFormatted.valueFormatted
    );
    detailsAmount.push(
      L.shareconstance_paymentloan_interest_label +
      ': ' +
      interestFormatted.valueFormatted
    );
    detailsAmount.push(
      L.shareconstance_paymentloan_overdue_label +
      ': ' +
      overdueFormatted.valueFormatted
    );
    detailsAmount.push(
      L.shareconstance_paymentloan_bankingstatus +
      ': ' +
      eeccAmountLabel.valueFormatted
    );
    detailsAmount.push(
      L.shareconstance_paymentloan_itf_label +
      ': ' +
      itfFormatted.valueFormatted
    );
    detailsAmount.push(
      L.shareconstance_paymentloan_other_label +
      ': ' +
      otherFormatted.valueFormatted
    );

    const content: ShareReceiptItem[] = [
      {
        title: L.shareconstance_paymentloan_debitamount,
        details: detailsAmount,
      },

      {
        title: L.shareconstance_paymentloan_transaction_type,
        details: [L.paymentsownloanssuccessscreen_type],
      },
      {
        title: L.shareconstance_paymentloan_target_account_same_holder,
        details: [targetLoanLabel],
      },
      {
        title: L.shareconstance_paymentloan_source_account,
        details: [originLabel],
      },
      !isSameCurrency
        ? {
          title: L.shareconstance_paymentloan_purchase_label,
          details: [Amount.format(exchange, currency)],
        }
        : undefined,
      !isSameCurrency
        ? {
          title: L.shareconstance_paymentloan_sale_label,
          details: [Amount.format(debitAmount, currency)],
        }
        : undefined,
      {
        title: L.shareconstance_paymentloan_date,
        details: [
          moment(date, L.shareconstance_paymentloan_date_format_source).format(
            L.shareconstance_paymentloan_date_format
          ),
        ],
      },
      {
        title: L.shareconstance_paymentloan_transaction_number,
        details: [operationNumber],
      },
      creditAccountHolder && {
        title: L.shareconstance_paymentloan_recipient,
        details: [Sanitizer.titleCase(creditAccountHolder)],
      },
    ];
    return content;
  };

  render() {
    const { isFocused, navigation, route } = this.props;
    const { isLoading, resume, loan } = this.state;

    const frequentContact = route.params && route.params.frequentContact;
    const origin = route.params && route.params.origin;
    const isFeePayment = route.params && route.params.isFeePayment;
    const isLastPayment = route.params && route.params.isLastPayment;
    const content = this.generateDataReceipt();

    return (
      <Container>
        <FormSteps total={3} current={3} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            {isFeePayment && (
              <>
                <View style={styles.happyHeaderContainer}>
                  <NetworkStatusAlert style={styles.networkStatus} />
                </View>
                <Happy
                  accessibilityLabel={'paymentsownloanssuccessscreen_happy'}
                  title={
                    isLastPayment
                      ? L.paymentsownloanssuccessscreen_happy_completed_title
                      : L.paymentsownloanssuccessscreen_happy_title
                  }
                  subtitle={
                    isLastPayment
                      ? L.paymentsownloanssuccessscreen_happy_completed_subtitle
                      : L.paymentsownloanssuccessscreen_happy_subtitle
                  }
                  style={styles.happy}
                />
              </>
            )}
            <Content style={styles.contentMain}>
              {!isFeePayment && (
                <View style={styles.headerContainer}>
                  <NetworkStatusAlert style={styles.networkStatus} />
                  <Header
                    center
                    title={L.paymentsownloanssuccessscreen_subtitle}
                    style={styles.header}
                    accessibilityLabel={
                      'paymentsownloanssuccessscreen_subtitle'
                    }
                  />
                </View>
              )}

              <View style={styles.content}>
                <LoadingOverlay
                  isLoading={isLoading}
                  duration={isLoading ? 0 : 200}
                  style={styles.loadingOverlay}
                />
                <View style={isLoading && { opacity: 0 }}>
                  {isLastPayment && <BannerPaidLoan />}
                  <TransactionRecord
                    type={L.paymentsownloanssuccessscreen_type}
                    resume={resume}
                    frequentContact={frequentContact}
                    panelTitle={L.paymentsownloanssuccessscreen_panel_title}
                    panelItemTitle={
                      L.paymentsownloanssuccessscreen_panel_item_amount
                    }
                    transactionType={TransactionType.PAYMENT}
                    origin={origin}
                    loan={loan}
                  />
                  {!resume.userEmail && (
                    <AddEmailCard
                      navigation={navigation}
                      accessibilityLabel={
                        'paymentsownloanssuccessscreen_ademailcard'
                      }
                    />
                  )}
                  <View style={styles.footer}>
                    <ConfirmationSendingMessage
                      userEmail={resume.userEmail}
                      onPress={this.updateMail}
                    />
                  </View>
                  <View style={styles.buttons}>
                    <Button
                      accessibilityLabel={
                        'paymentsownloanssuccessscreen_button_share'
                      }
                      light
                      onPress={this.share}
                      title={L.paymentsownloanssuccessscreen_button_share}
                      style={styles.marginButton}
                      textStyle={styles.buttonTextShare}
                    />

                    <Button
                      accessibilityLabel={
                        'instantcashshortsuccessscreen_button_end_title'
                      }
                      onPress={this.goToPaymentsHome}
                      title={L.paymentsownloanssuccessscreen_button_end}
                      style={styles.marginButton}
                      textStyle={styles.buttonTextEnd}
                    />
                  </View>
                </View>
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={L.shareconstance_paymentloan_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsOwnLoansSuccessScreenType = PaymentsOwnLoansSuccessScreen;
export default withFocused<PaymentsOwnLoansSuccessScreen, Props>(
  PaymentsOwnLoansSuccessScreen
);
