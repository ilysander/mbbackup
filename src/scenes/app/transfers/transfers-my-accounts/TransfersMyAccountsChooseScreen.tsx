import * as React from 'react';
import { InteractionManager, StyleSheet, ViewStyle } from 'react-native';

import API from '../../../../api';
import ExchangeRate from '../../../../components/exchange/ExchangeRate';
import NetworkManager from '../../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import AccountSelector from '../../../../components/transfers/AccountSelector';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  TextInputAmount,
  SectionHeader,
  CardView,
} from '../../../../components/ui';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import {
  Currencies,
  ErrorRequest,
  Formats,
  AccountsType,
} from '../../../../resources/constants';
import { Currency } from '../../../../resources/constants/Currencies';
import { Size } from '../../../../resources/dimensions';
import { Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { AccountItemSavingsAll } from '../../../../api/backend/response/Execute';
import { Amount } from '../../../../resources/money/index';
import Config from '../../../../Config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 40,
    marginBottom: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  exchangeRate: {
    marginTop: 10,
    alignItems: 'center',
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  amountInput: {
    marginTop: 7,
    marginBottom: 0,
  } as ViewStyle,
  accountSelector: {
    marginBottom: 20,
  } as ViewStyle,
});

const TAG = '[TransfersMyAccountsChooseScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  accounts: AccountItemSavingsAll[];
  accountsTarget: AccountItemSavingsAll[];
  accountsWithCts: AccountItemSavingsAll[];
  indexCurrency: number;
  indexOrigin: number;
  indexTarget: number;
  isLoading: boolean;
  currencies: Currency[];
  isValid: boolean;
}

class TransfersMyAccountsChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.transfersscreen_title,
  // };
  state: State = {
    accounts: [],
    accountsTarget: [],
    accountsWithCts: [],
    indexCurrency: 0,
    indexOrigin: -1,
    indexTarget: -1,
    isLoading: false,
    currencies: [Currencies.PEN, Currencies.USD],
    isValid: false,
  };

  interaction!: any;
  amountInput!: TextInputAmount | null;
  exchangeRate!: ExchangeRate | null;

  componentDidMount() {
    Log.debug(TAG, 'componentDidMount');
    this.load();
  }

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    this.interaction && this.interaction.cancel();
  }

  getAccountOrigin = () => {
    const { accounts, indexOrigin, accountsWithCts } = this.state;
    if (indexOrigin < 0) {
      return;
    }
    return Config.features.EnableTransferCTS
      ? accountsWithCts[indexOrigin]
      : accounts[indexOrigin];
  };
  getAccountTarget = () => {
    const { accountsTarget, indexTarget } = this.state;
    if (indexTarget < 0) {
      return;
    }
    return accountsTarget[indexTarget];
  };
  getCurrency = () => {
    const { currencies, indexCurrency } = this.state;
    return currencies[indexCurrency] || {};
  };
  changeOriginAccount = (indexOrigin: number) => {
    AnalyticsEvent.track(
      A.transfersmyaccountschoosescreen_accountselector_origin
    );

    const { accounts, accountsWithCts } = this.state;
    const target = this.getAccountTarget();
    const origin = Config.features.EnableTransferCTS
      ? accountsWithCts[indexOrigin]
      : accounts[indexOrigin];

    const accountsTarget = Config.features.EnableTransferCTS
      ? accountsWithCts.filter(
        account =>
          account.idProduct !== origin.idProduct &&
          account.family !== AccountsType.CTS.family
      )
      : accounts.filter(account => account.idProduct !== origin.idProduct);
    let indexTarget = target
      ? accountsTarget.findIndex(
        account => account.idProduct === target.idProduct
      )
      : -1;
    if (target && target.idProduct === origin.idProduct) {
      indexTarget = -1;
    }

    this.setState({
      indexTarget,
      indexOrigin,
      accountsTarget,
    });
  };
  changeTargetAccount = (indexTarget: number) => {
    AnalyticsEvent.track(
      A.transfersmyaccountschoosescreen_accountselector_target
    );
    const { currencies, accountsTarget } = this.state;
    const target = accountsTarget[indexTarget];
    const indexCurrency = currencies.findIndex(
      item => item.label === target.currency
    );
    this.setState({
      indexTarget,
      indexCurrency,
    });

    this.amountInput && this.amountInput.focus();
  };
  load = () => {

    const { route } = this.props;

    const accounts = route.params ? route.params.accounts ? route.params.accounts : [] : [];
    const accountsWithCts = route.params ? route.params.accountsWithCts ? route.params.accountsWithCts : [] : [];


    // const accounts = this.props.navigation.getParam('accounts', []);
    // const accountsWithCts = this.props.navigation.getParam(
    //   'accountsWithCts',
    //   []
    // );
    this.setState({
      accounts,
      accountsTarget: Config.features.EnableTransferCTS
        ? accountsWithCts
        : accounts,
      accountsWithCts,
    });
  };
  onBlur = () => {
    this.isValid();
  };
  isValidFundsSameCurrency = (amount: number) => {
    const origin = this.getAccountOrigin();
    if (!origin) {
      return false;
    }
    return amount <= origin.availableBalance;
  };
  isValidFundsPEN = (amount: number) => {
    const origin = this.getAccountOrigin();
    if (!origin) {
      return false;
    }
    const currency = this.getCurrency();
    if (currency.label === Currencies.USD.label) {
      const sale =
        (this.exchangeRate ? this.exchangeRate.getSale() : 0) * amount;
      return sale <= origin.availableBalance;
    }
    return true;
  };
  isValidFundsUSD = (amount: number) => {
    const origin = this.getAccountOrigin();
    if (!origin) {
      return false;
    }
    const currency = this.getCurrency();
    if (currency.label === Currencies.PEN.label) {
      const purchase =
        amount / (this.exchangeRate ? this.exchangeRate.getPurchase() : 0);
      return purchase <= origin.availableBalance;
    }
    return true;
  };
  isValid = () => {
    const amountIsValid = this.isValidAmount();
    const { indexOrigin, indexTarget } = this.state;

    const isValid = [
      indexOrigin !== -1,
      indexTarget !== -1,
      amountIsValid,
    ].every(item => item);

    this.setState({ isValid });

    return isValid && NetworkManager.isConnected;
  };

  isValidFunds = (amount: number) => {
    let isValid;
    const origin = this.getAccountOrigin();
    if (!origin) {
      return false;
    }
    const currency = this.getCurrency();
    if (origin.currency === currency.label) {
      isValid = this.isValidFundsSameCurrency(amount);
    } else if (origin.currency === Currencies.USD.label) {
      isValid = this.isValidFundsUSD(amount);
    } else if (origin.currency === Currencies.PEN.label) {
      isValid = this.isValidFundsPEN(amount);
    }
    return isValid;
  };
  isValidAmount = () => {
    if (!this.amountInput) {
      return false;
    }
    const amountIsValid = this.amountInput.isValid();
    if (!amountIsValid) {
      return false;
    }

    const amount = this.amountInput.getValue();
    if (amount < this.getMinAmount()) {
      this.amountInput.setError(
        `${L.transfersmyaccountschoosescreen_textinput_amount_minimal_error
        } ${this.getMinAmountFormatted()}`
      );
      return false;
    }
    if (!this.isValidFunds(amount)) {
      this.amountInput.setError(
        L.transfersmyaccountschoosescreen_textinput_amount_balance_error
      );
      return false;
    }
    return true;
  };
  tryToSubmit = () => {
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
  clearAmount = () => {
    if (!this.amountInput) {
      return;
    }
    if (this.amountInput.getValue() <= 0) {
      this.amountInput.setValue('');
    }
  };
  submit = async () => {
    const origin = this.getAccountOrigin();
    const target = this.getAccountTarget();
    const currency = this.getCurrency();
    if (!origin || !target) {
      return;
    }

    try {
      this.blur();
      const { navigation } = this.props;

      const response = await API.Execute.transfersInternalPreview(
        {
          quantity: this.amountInput
            ? this.amountInput.getValue().toString()
            : '',
          currency: currency.label,
        },
        origin.idProduct,
        target.idProduct
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const isSameCurrency = origin.currency === target.currency;
        const resume = {
          ...response.body.data,
          isSameCurrency,
          target,
          origin,
        };
        navigation.navigate('TransfersMyAccountsConfirm', { resume });
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
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  getMinAmount = () => {
    const currency = this.getCurrency();
    if (currency.label === Currencies.USD.label) {
      return Config.settings.limitMinTransfersMyAccountsUSD;
    }

    return Config.settings.limitMinTransfersMyAccountsPEN;
  };
  getMinAmountFormatted = () => {
    const currency = this.getCurrency();
    return Amount.format(this.getMinAmount(), currency.label);
  };

  render() {
    const {
      isLoading,
      indexOrigin,
      indexTarget,
      accountsTarget,
      accounts,
      accountsWithCts,
      isValid,
    } = this.state;
    const { isFocused } = this.props;

    const accountOrigin = this.getAccountOrigin();
    const accountTarget = this.getAccountTarget();
    const currency = this.getCurrency();
    const minAmount = this.getMinAmountFormatted();
    const isSameCurrency =
      accountTarget && accountOrigin
        ? accountTarget.currency === accountOrigin.currency
        : true;

    const isBlockedTarget = indexOrigin === -1;

    return (
      <Container>
        <FormSteps total={3} current={1} />
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
                style={styles.header}
                center
                accessibilityLabel={
                  'transfersmyaccountschoosescreen_sectionheader_accounts'
                }
                title={L.transfersmyaccountschoosescreen_sectionheader_title}
              />
              <CardView
                accessibilityLabel={'transfersmyaccountschoosescreen_cardview'}
                padding
              >
                <AccountSelector
                  accessibilityLabel={
                    'transfersmyaccountschoosescreen_accountselector_title_origin'
                  }
                  title={
                    L.transfersmyaccountschoosescreen_accountselector_title_origin
                  }
                  placeholder={
                    L.transfersmyaccountschoosescreen_accountselector_placeholder_origin
                  }
                  values={
                    Config.features.EnableTransferCTS
                      ? accountsWithCts
                      : accounts
                  }
                  selectedIndex={indexOrigin}
                  onPress={this.changeOriginAccount}
                  style={styles.accountSelector}
                />

                <AccountSelector
                  accessibilityLabel={
                    'transfersmyaccountschoosescreen_accountselector_title_target'
                  }
                  title={
                    L.transfersmyaccountschoosescreen_accountselector_title_target
                  }
                  placeholder={
                    L.transfersmyaccountschoosescreen_accountselector_placeholder_target
                  }
                  values={accountsTarget}
                  disabled={isBlockedTarget}
                  selectedIndex={indexTarget}
                  onPress={this.changeTargetAccount}
                  style={styles.accountSelector}
                />

                <SectionHeader
                  accessibilityLabel={
                    'transfersmyaccountschoosescreen_panel_amount'
                  }
                  title={L.transfersmyaccountschoosescreen_sectionheader_amount}
                  subtitle={`${L.transfersmyaccountschoosescreen_sectionheader_subtitle} ${minAmount}`}
                />

                <TextInputAmount
                  returnKeyType={'done'}
                  containerStyle={styles.amountInput}
                  keyboardType={'decimal-pad'}
                  showClearButton={false}
                  autoCorrect={false}
                  onBlur={this.onBlur}
                  onFocus={this.clearAmount}
                  blurOnSubmit
                  accessibilityLabel={
                    'transfersmyaccountschoosescreen_textinput_amount'
                  }
                  autoCapitalize={'none'}
                  currency={currency.symbol}
                  defaultValue={''}
                  ref={ref => {
                    this.amountInput = ref;
                  }}
                  formatText={Formats.Amount}
                  help={
                    !isSameCurrency && (
                      <ExchangeRate
                        accent
                        ref={ref => {
                          this.exchangeRate = ref;
                        }}
                        centered
                        style={styles.exchangeRate}
                        accessibilityLabel={
                          'transfersmyaccountschoosescreen_exchangerate'
                        }
                      />
                    )
                  }
                />
              </CardView>

              <Button
                accessibilityLabel={
                  'transfersmyaccountschoosescreen_button_continue'
                }
                allowOnPress
                onPress={this.tryToSubmit}
                loading={isLoading}
                disabled={!isValid}
                style={styles.buttons}
                title={L.transfersmyaccountschoosescreen_button_continue}
                big
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type TransfersMyAccountsChooseScreenType = TransfersMyAccountsChooseScreen;
export default withFocused<TransfersMyAccountsChooseScreen, Props>(
  TransfersMyAccountsChooseScreen
);
