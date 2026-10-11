const moment = require('moment');
import * as React from 'react';
import {
  Animated,
  InteractionManager,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import API from '../../../../api';
import ExchangeRate from '../../../../components/exchange/ExchangeRate';
import Info from '../../../../components/info/Info';
import NetworkManager from '../../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import AccountSelector from '../../../../components/transfers/AccountSelector';
import {
  Button,
  CardView,
  Container,
  Content,
  FormSteps,
  KeyboardAvoidingView,
  LoadingOverlay,
  MessageCenter,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
  InfoMessage,
} from '../../../../components/ui';
import TextInputAmount from '../../../../components/ui/TextInputAmount';
import {A, AnalyticsEvent} from '../../../../resources/analytics';
import {
  Colors,
  StatementType,
  ErrorRequest,
} from '../../../../resources/constants';
import {Size} from '../../../../resources/dimensions';
import {Validate, Font} from '../../../../resources/functions';
import {L} from '../../../../resources/language';
import {Emitter} from '../../../../resources/listeners';
import {Log} from '../../../../resources/log';
import {Amount} from '../../../../resources/money';
import {KeyboardUtil} from '../../../../resources/util';
import {
  DateFormat,
  MinTabContentHeight,
  TabHeight,
  TabNames,
} from './choose/Constants';
import {AlertEvent} from '../../../../components/alert/AlertManager';
import Session from '../../../../api/Session';
import SelectorAmount from './choose/SelectorAmount';
import {DefaultErrorResponse} from '../../../../api/backend/response/Error';
import {LoansItem} from '../../../../api/backend/response/Execute';
import LoanResume from '../../../../components/loans/LoanResume';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 40,
  } as ViewStyle,
  messageItem: {
    marginTop: 10,
  } as ViewStyle,
  formSteps: {
    marginBottom: 10,
  } as ViewStyle,
  info: {
    marginBottom: 10,
    marginTop: 20,
  } as ViewStyle,
  loadingOverlay: {
    backgroundColor: Colors.grey1,
  } as ViewStyle,
  exchangeRate: {
    marginTop: 10,
  } as ViewStyle,
  header: {
    ...Font({weight: 'Bold'}),
    fontSize: 16,
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 5,
  } as TextStyle,
  cardSelectorAmount: {
    flex: 1,
    marginBottom: 20,
  } as ViewStyle,
  loanResume: {
    marginTop: 10,
  } as ViewStyle,
  infoMessage: {
    marginTop: 15,
  } as ViewStyle,
});

const TAG = '[PaymentsOwnLoansChooseScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export interface State {
  fees: any[];
  accounts: any[];
  loan?: LoansItem;
  indexOrigin: number;
  isValid: boolean;
  isLoading: boolean;
  isLoadingFees: boolean;
  offsetY: number;
  lastOffsetY: number;
  currentTab: string;
  tabHeightAnim: Animated.Value;
  scrollMinHeight: number;
  errorFee?: string;
  monthlyFee?: boolean;
  isLastPayment: boolean;
}

class PaymentsOwnLoansChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsscreen_title,
  // };

  state: State = {
    fees: [],
    accounts: [],
    indexOrigin: -1,
    offsetY: 0,
    lastOffsetY: 0,
    isValid: false,
    isLoading: false,
    isLoadingFees: false,
    currentTab: TabNames.Fee,
    isLastPayment: false,
    tabHeightAnim: new Animated.Value(MinTabContentHeight + TabHeight),
    scrollMinHeight: Size.getVisibleTabScreenHeight(),
  };
  amountInput = React.createRef<TextInputAmount>();
  accountOrigin!: AccountSelector | null;
  loan!: LoanResume | null;
  message!: MessageCenter | null;
  animation!: Animated.CompositeAnimation;
  timeoutScroll!: NodeJS.Timeout;
  timeoutOnScroll!: number;
  interaction!: any;
  scroll!: ScrollView | null;

  getAccountOrigin = () => {
    const {accounts, indexOrigin} = this.state;
    if (indexOrigin < 0) {
      return {};
    }
    return accounts[indexOrigin];
  };

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.interaction && this.interaction.cancel();
    this.timeoutScroll && clearTimeout(this.timeoutScroll);
  }

  load = () => {
    const {route} = this.props;
    const accounts = route.params
      ? route.params.accounts
        ? route.params.accounts
        : []
      : [];
    const loan = route.params && route.params.loan;

    this.setState({accounts, loan}, () => {
      if (accounts.length === 1) {
        AnalyticsEvent.track(
          A.paymentsownloanschoosescreen_event_origin_autoassigned,
        );
        this.changeAccountOriginBase(0);
      }
      this.loadStatements();
    });
  };

  buildFees = (data: any) => {
    const fees = [];

    for (const statement of data.statements) {
      if (
        (statement.status === StatementType.Pending &&
          statement.showPendingFee === 0) ||
        statement.status === StatementType.Due
      ) {
        continue;
      }
      const fee = this.getItemByStatement(0, statement);
      if (fee) {
        fees.push(fee);
        break;
      }
    }

    if (fees.length === 1) {
      fees[0].selected = true;
    }
    return fees;
  };

  loadStatements = async () => {
    const {loan} = this.state;
    const {navigation} = this.props;
    const {isLoadingFees} = this.state;
    if (isLoadingFees || !loan) {
      return;
    }

    this.setState({isLoadingFees: true});
    try {
      const response = await API.Execute.loansListStatements(
        loan.idProduct,
        loan.currency,
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const fees = this.buildFees(response.body.data);
      const statements = response.body.data.statements || [];
      const isLastPayment = statements.length === 1;
      if (fees.length === 0) {
        navigation.replace('PaymentsOwnLoansUpToDate', {
          fees: statements,
          currency: response.body.data.currency,
          loan,
        });
        return;
      }
      this.setState({fees, isLastPayment}, () => {
        this.isValidSilent();
      });
    } catch (e) {
      Log.exception(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({isLoadingFees: false});
  };
  getItemByStatement = (i: number, statement: any) => {
    if (
      statement.status === StatementType.Due ||
      statement.status === StatementType.Pending
    ) {
      return {
        statement,
        selected: false,
        enabled: i === 0,
      };
    }
    return null;
  };

  changeAccountOrigin = (indexOrigin: number) => {
    AnalyticsEvent.track(A.paymentsownloanschoosescreen_accountselector_origin);
    this.changeAccountOriginBase(indexOrigin);
  };

  changeAccountOriginBase = (indexOrigin: number) => {
    this.setState({indexOrigin}, () => {
      this.isValidSilent();
      this.isValidAccountOrigin();
    });
  };
  getAccountsValid = () => {
    const {accounts} = this.state;
    return accounts;
  };

  isValidSilent = () => {
    const {indexOrigin} = this.state;
    const loanAmount = this.getLoanAmount();
    const isValidAmount = parseFloat(loanAmount.amount.quantity) > 0;
    const isValidAccount = indexOrigin >= 0;

    const isValid = isValidAmount && isValidAccount;
    this.setState({isValid});
  };
  isValid = () => {
    const {currentTab} = this.state;
    let isValid = false;
    if (currentTab === TabNames.Partial) {
      isValid = this.isValidPartial();
    }
    if (currentTab === TabNames.Fee) {
      isValid = this.isValidFee();
    }
    const account = this.getAccountOrigin();
    if (!account.idProduct) {
      this.accountOrigin &&
        this.accountOrigin.setError(
          L.paymentsownloanschoosescreen_origin_account_empty_error,
        );
      return false;
    }
    isValid = isValid && this.isValidAccountOrigin();
    this.setState({isValid});
    return isValid && NetworkManager.isConnected;
  };
  isValidFee = () => {
    const {fees} = this.state;
    const isValid = fees.some(fee => fee.selected);
    if (!isValid) {
      this.setState({
        errorFee: L.paymentsownloanschoosescreen_fee_empty_error,
      });
    } else {
      this.setState({errorFee: undefined});
    }
    return isValid;
  };

  isValidAccountOrigin = () => {
    this.accountOrigin && this.accountOrigin.clearError();
    const account = this.getAccountOrigin();
    if (!account.idProduct) {
      return false;
    }
    const loanAmount = this.getLoanAmount();
    const isSameCurrency = this.isSameCurrency();

    if (
      isSameCurrency &&
      parseFloat(loanAmount.amount.quantity) >
        parseFloat(account.availableBalance)
    ) {
      const {currentTab} = this.state;
      if (currentTab === TabNames.Partial) {
        return this.isValidPartialSomeAccountOrigin();
      }
      if (currentTab === TabNames.Fee) {
        return this.isValidFeeSomeAccountOrigin();
      }
    }

    return true;
  };
  isValidPartialSomeAccountOrigin = () => {
    if (!this.accountOrigin) {
      return false;
    }
    const {hasMinimumAmount, someValidAccount} =
      this.isValidSomeAccountOrigin();

    if (!hasMinimumAmount) {
      this.accountOrigin.setError(
        L.paymentsownloanschoosescreen_origin_account_zero_amount_error,
      );
      return false;
    }

    if (someValidAccount) {
      this.accountOrigin.setError(
        L.paymentsownloanschoosescreen_origin_account_invalid_amount_error,
      );
    } else {
      this.accountOrigin.setError(
        L.paymentsownloanschoosescreen_origin_account_zero_amount_error,
      );
    }
    return false;
  };

  isValidFeeSomeAccountOrigin = () => {
    return this.isValidPartialSomeAccountOrigin();
  };

  isValidSomeAccountOrigin = () => {
    const {loan} = this.state;
    if (!loan) {
      return {hasMinimumAmount: false, someValidAccount: false};
    }
    const loanAmount = this.getLoanAmount();
    const accounts = this.getAccountsValid();
    const accountsSameCurrency = accounts.filter(account => {
      return account.currency.toString() === loan.currency.toString();
    });
    let hasMinimumAmount = false;
    let someValidAccount = false;

    for (const account of accounts) {
      if (parseFloat(account.availableBalance) > 0) {
        hasMinimumAmount = true;
      }
    }
    for (const account of accountsSameCurrency) {
      if (
        parseFloat(loanAmount.amount.quantity) <=
        parseFloat(account.availableBalance)
      ) {
        someValidAccount = true;
      }
    }

    return {hasMinimumAmount, someValidAccount};
  };
  isValidPartial = () => {
    const {loan} = this.state;
    if (!loan) {
      return false;
    }
    const input = this.amountInput.current;
    if (!input) {
      return true;
    }
    const isValid = input.isValid();
    if (!isValid) {
      return false;
    }

    const amount = input.getValue();
    if (amount <= 0) {
      input.setError(
        L.paymentsownloanschoosescreen_textinput_amount_zero_error,
      );
      return false;
    }
    if (!this.isValidFunds(amount)) {
      input.setError(
        `${
          L.paymentsownloanschoosescreen_textinput_amount_exceeds_error
        } ${Amount.format(this.getTotalAmount(), loan.currency)}`,
      );
      return false;
    }

    return true;
  };

  getTotalAmount = () => {
    const {fees} = this.state;
    if (fees.length < 1) {
      return 0;
    }
    let total = 0;
    for (const fee of fees) {
      const {statement} = fee;
      total += parseFloat(statement.totalAmount || statement.amount || '');
    }
    return total;
  };
  isValidFunds = (amount: number) => {
    return amount <= this.getTotalAmount();
  };

  onChangeTab = (currentTab: string) => {
    this.setState({currentTab}, () => {
      this.isValidSilent();
      this.isValidAccountOrigin();
    });
  };

  onChangeFees = (fees: any[]) => {
    this.setState({fees, errorFee: undefined}, () => {
      this.isValidSilent();
    });
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.pop();
  };

  onBlurAmount = () => {
    this.isValidSilent();
  };

  getLoanAmount = () => {
    const {currentTab, loan, fees} = this.state;
    if (!loan) {
      return {};
    }
    const loanAmount = {
      amount: {currency: loan.currency, quantity: ''},
      payTotal: '0',
      totalAmount: '0',
      otherAmountQuantity: '',
      pendingPayment: {
        amount: '0',
        selected: false.toString(),
      },
      oldPayments: {
        amount: '0',
        fees: '0',
        selected: false.toString(),
      },
      lastLoanId: loan.idProduct,
    } as any;
    let lastDueDate = '';
    for (const fee of fees) {
      const {statement} = fee;
      lastDueDate = moment(statement.dueDate).format(DateFormat);
    }
    loanAmount.lastDueDate = lastDueDate;

    if (currentTab === TabNames.Partial) {
      const amountInput = this.getAmountInputValue();
      loanAmount.amount.quantity = amountInput.toString();
      loanAmount.otherAmountQuantity = amountInput.toString();
      return loanAmount;
    }

    if (currentTab === TabNames.Fee) {
      return this.getLoanAmountFee(fees, loanAmount);
    }
  };

  getAmountInputValue = () => {
    if (!this.amountInput || !this.amountInput.current) {
      return 0;
    }
    return this.amountInput.current.getValue() || 0;
  };

  getLoanAmountFee = (fees: any[], loanAmount: any) => {
    let amount = 0;
    let totalFees = 0;
    for (const fee of fees) {
      const {statement} = fee;
      if (!fee.selected) {
        continue;
      }
      if (statement.status === StatementType.Pending) {
        loanAmount.pendingPayment = {
          amount: (statement.totalAmount || statement.amount).toString(),
          dueDate: moment(statement.dueDate).format(DateFormat),
          selected: true.toString(),
        };
      } else if (statement.status === StatementType.Due) {
        amount += parseFloat(statement.totalAmount || statement.amount);
        totalFees++;
      }
    }
    if (totalFees > 0) {
      loanAmount.oldPayments = {
        amount: amount.toString(),
        fees: totalFees.toString(),
        selected: true.toString(),
      };
    }
    loanAmount.amount.quantity = (
      parseFloat(loanAmount.oldPayments.amount) +
      parseFloat(loanAmount.pendingPayment.amount)
    ).toString();

    return loanAmount;
  };

  setAccountOriginError = (data: any) => {
    const {currentTab} = this.state;
    if (data.debitAccount.includes('bloqueada')) {
      this.accountOrigin &&
        this.accountOrigin.setError(
          L.paymentsownloanschoosescreen_origin_account_invalid_blocked,
        );
    } else if (
      data.debitAccount.includes('monto a pagar debe ser menor o igual')
    ) {
      if (currentTab === TabNames.Partial) {
        this.amountInput &&
          this.amountInput.current &&
          this.amountInput.current.setError(
            L.paymentsownloanschoosescreen_textinput_account_balance_exceeds_error,
          );
      }
      if (currentTab === TabNames.Fee) {
        this.accountOrigin &&
          this.accountOrigin.setError(
            L.paymentsownloanschoosescreen_textinput_account_balance_exceeds_error,
          );
      }
    } else {
      this.accountOrigin && this.accountOrigin.setError(data.debitAccount);
    }
  };

  tryToSubmit = () => {
    this.blur();
    const isValid = this.isValid();
    this.setState({isValid});

    if (!isValid) {
      return;
    }
    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      this.setState({isLoading: true});
      await this.submit();
      this.setState({isLoading: false});
    });
  };

  submit = async () => {
    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'submit',
        e: '',
      });
      return;
    }
    const {navigation} = this.props;
    const {loan, isLastPayment, currentTab} = this.state;
    if (!loan) {
      return;
    }
    try {
      const origin = this.getAccountOrigin();
      const loanAmount = this.getLoanAmount();
      const response = await API.Execute.payLoanOwnPreview6(
        loan.idProduct,
        loanAmount,
        origin.idProduct,
        '',
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      const body = response.body;
      const data = body.data;
      if (body.code === API.ResponseCode.OK) {
        const isFeePayment = currentTab === TabNames.Fee;

        navigation.navigate('PaymentsOwnLoansConfirm', {
          resume: data,
          origin,
          loan,
          loanAmount,
          isFeePayment,
          isLastPayment: isFeePayment && isLastPayment,
        });
        return;
      }

      const error = data as DefaultErrorResponse;
      let hasError = false;
      if (error.debitAccount) {
        this.setAccountOriginError(error);

        hasError = true;
      }

      if (error.loanAmount) {
        this.amountInput &&
          this.amountInput.current &&
          this.amountInput.current.setError(error.loanAmount);
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
  isSameCurrency = () => {
    const {loan} = this.state;
    const origin = this.getAccountOrigin();
    let isSameCurrency = true;
    if (origin && origin.currency && loan && loan.currency) {
      isSameCurrency = origin.currency === loan.currency;
    }
    return isSameCurrency;
  };

  onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.timeoutOnScroll && clearTimeout(this.timeoutOnScroll);
    const offsetY = e.nativeEvent.contentOffset.y;
    this.timeoutScroll = setTimeout(() => {
      this.setState({offsetY});
    }, 200);
    const {onScroll} = this.props;
    typeof onScroll === 'function' && onScroll(e);
  };

  render() {
    const {
      isLoading,
      indexOrigin,
      accounts,
      errorFee,
      isLoadingFees,
      loan,
      isValid,
      fees,
      scrollMinHeight,
      isLastPayment,
    } = this.state;
    const {isFocused, navigation} = this.props;
    const isSameCurrency = this.isSameCurrency();
    return (
      <Container>
        <FormSteps total={3} current={1} style={styles.formSteps} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: scrollMinHeight,
          }}
          onScroll={this.onScroll}
          scrollEventThrottle={100}
          ref={ref => {
            this.scroll = ref;
          }}>
          <LoadingOverlay
            isLoading={isLoadingFees}
            duration={isLoadingFees ? 0 : 100}
            style={styles.loadingOverlay}
          />
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert />
              <MessageCenter
                style={styles.messageItem}
                accessibilityLabel={
                  'paymentsownloanschoosescreen_messagecenter'
                }
                ref={ref => {
                  this.message = ref;
                }}
              />

              {!!loan && (
                <>
                  <LoanResume
                    ref={ref => {
                      this.loan = ref;
                    }}
                    accessibilityLabel={'paymentsownloanschoosescreen_loanitem'}
                    navigation={navigation}
                    loan={loan}
                    style={styles.loanResume}
                  />
                  <Text style={styles.header}>
                    {L.paymentsownloanschoosescreen_subtitle}
                  </Text>
                  <CardView style={styles.cardSelectorAmount}>
                    <SelectorAmount
                      screenProps={{
                        loan,
                        fees,
                        isLastPayment,
                        amountInput: this.amountInput,
                        onBlurAmount: this.onBlurAmount,
                        onChangeFees: this.onChangeFees,
                        errorFee,
                        onChangeTab: this.onChangeTab,
                      }}
                    />
                  </CardView>
                </>
              )}

              <CardView padding>
                <AccountSelector
                  accessibilityLabel={
                    'paymentsownloanschoosescreen_accountselector_title_origin'
                  }
                  title={
                    L.paymentsownloanschoosescreen_sectionheader_origin_account
                  }
                  placeholder={
                    L.paymentsownloanschoosescreen_accountselector_placeholder_origin
                  }
                  ref={ref => {
                    this.accountOrigin = ref;
                  }}
                  values={accounts}
                  selectedIndex={indexOrigin}
                  readOnly={accounts.length === 1}
                  onPress={this.changeAccountOrigin}
                />

                {!isSameCurrency && (
                  <ExchangeRate
                    style={styles.exchangeRate}
                    accent
                    accessibilityLabel={
                      'paymentsownloanschoosescreen_exchangerate'
                    }
                  />
                )}
              </CardView>
              <InfoMessage
                accessibilityLabel={'info_loans_description'}
                style={styles.infoMessage}
                message={L.info_loans_description}
              />
              <SpacedView style={styles.buttons}>
                <Button
                  light
                  accessibilityLabel={
                    'paymentsownloanschoosescreen_button_cancel'
                  }
                  onPress={this.goBack}
                  title={L.paymentsownloanschoosescreen_button_cancel}
                />
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={
                    'paymentsownloanschoosescreen_button_continue'
                  }
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  title={L.paymentsownloanschoosescreen_button_continue}
                />
              </SpacedView>
            </Content>
            <Content vertical={false} style={styles.info}>
              <Info
                center
                accessibilityLabel={'paymentsownloanschoosescreen_info'}
                title={L.paymentsownloanschoosescreen_infocontact_title}
                subtitle={L.paymentsownloanschoosescreen_infocontact_subtitle}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsOwnLoansChooseScreenType = PaymentsOwnLoansChooseScreen;
export default withFocused<PaymentsOwnLoansChooseScreen, Props>(
  PaymentsOwnLoansChooseScreen,
);
