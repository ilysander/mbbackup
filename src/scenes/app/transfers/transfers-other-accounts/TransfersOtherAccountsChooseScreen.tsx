import * as React from 'react';
import { InteractionManager, StyleSheet, ViewStyle } from 'react-native';

import API from '../../../../api';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import {
  FrequentContactType,
  AccountItemSavingsAll,
} from '../../../../api/backend/response/Execute';
import ExchangeRate from '../../../../components/exchange/ExchangeRate';
import NetworkManager from '../../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import AccountSelector from '../../../../components/transfers/AccountSelector';
import FrequentContact from '../../../../components/transfers/FrequentContact';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  Selector,
  TextInput,
  TextInputAmount,
  CardView,
  SectionHeader,
  SelectorTag,
} from '../../../../components/ui';
import Config from '../../../../Config';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import {
  Currencies,
  ErrorRequest,
  Formats,
} from '../../../../resources/constants';
import { Currency } from '../../../../resources/constants/Currencies';
import { Size } from '../../../../resources/dimensions';
import { Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import Session from '../../../../api/Session';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 40,
    marginBottom: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  accountSelectorOrigin: {
    marginBottom: 20,
  } as ViewStyle,
  selector: {
    marginTop: 5,
  } as ViewStyle,
  sectionHeaderAmount: {
    marginTop: 10,
  } as ViewStyle,
  exchangeRate: {
    marginBottom: 10,
  } as ViewStyle,
});

const TAG = '[TransfersOtherAccountsChooseScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  accounts: AccountItemSavingsAll[];
  indexOrigin: number;
  currencyIndex: number;
  isLoading: boolean;
  currencies: Currency[];
  frequentContact?: FrequentContactType;
  isValid: boolean;
}

class TransfersOtherAccountsChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.transfersscreen_title,
  // };
  state: State = {
    accounts: [],
    indexOrigin: -1,
    currencyIndex: -1,
    isLoading: false,
    currencies: [Currencies.PEN, Currencies.USD],
    isValid: false,
  };

  interaction!: any;
  amountInput!: TextInputAmount | null;
  currencySelector!: Selector<Currency> | null;
  targetInput!: TextInput | FrequentContact | null;

  getAccountOrigin = () => {
    const { accounts, indexOrigin } = this.state;
    if (indexOrigin < 0) {
      return;
    }
    return accounts[indexOrigin];
  };
  getCurrency = () => {
    let currency;
    if (this.currencySelector) {
      currency = this.currencySelector.getValue();
    }
    return currency || Currencies.PEN;
  };

  componentDidMount() {
    Log.debug(TAG, 'componentDidMount');
    this.load();
  }

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    this.interaction && this.interaction.cancel();
  }

  load = () => {
    const { route } = this.props;
    const accounts = route.params ? route.params.accounts ? route.params.accounts : [] : [];
    const frequentContact = route.params && route.params.frequentContact;
    // const accounts = this.props.navigation.getParam('accounts', []);
    // const frequentContact = this.props.navigation.getParam('contact');

    this.setState({ accounts, frequentContact }, () => {
      if (accounts.length === 1) {
        AnalyticsEvent.track(
          A.transfersotheraccountschoosescreen_event_origin_autoassigned
        );
        this.changeOriginAccountBase(0);
      }
      this.chooseCurrencyByFrequentContact();
    });
  };

  getCurrencyByLabel = (currency: any) => {
    const { currencies } = this.state;
    return (
      currencies.find(item => item.label.toString() === currency.toString()) ||
      Currencies.PEN
    );
  };
  chooseCurrencyByFrequentContact = () => {
    const { frequentContact } = this.state;
    if (frequentContact && frequentContact.currency) {
      const currency = this.getCurrencyByLabel(frequentContact.currency);
      this.currencySelector && this.currencySelector.setValue(currency);
    }
  };
  changeCurrency = (index: number) => {
    this.amountInput && this.amountInput.setValue('');
    this.setState({ currencyIndex: index });
  };
  changeOriginAccount = (indexOrigin: number) => {
    AnalyticsEvent.track(
      A.transfersotheraccountschoosescreen_accountselector_origin
    );
    this.changeOriginAccountBase(indexOrigin);
  };

  changeOriginAccountBase = (indexOrigin: number) => {
    const { accounts } = this.state;
    const origin = accounts[indexOrigin];
    const currency = this.getCurrencyByLabel(origin.currency);

    this.currencySelector && this.currencySelector.setValue(currency);
    InteractionManager.runAfterInteractions(() => {
      this.setState({ indexOrigin });
      this.targetInput && this.targetInput.focus();
    });
  };
  isValid = () => {
    const amountIsValid = this.isValidAmount();
    const targetIsValid = this.isValidTarget();
    const { indexOrigin } = this.state;

    const isValid = [indexOrigin !== -1, amountIsValid, targetIsValid].every(
      item => item
    );

    this.setState({ isValid });

    return isValid && NetworkManager.isConnected;
  };

  isValidAmount = () => {
    if (!this.amountInput) {
      return false;
    }
    const isValid = this.amountInput.isValid();
    if (!isValid) {
      return false;
    }

    const amount = this.amountInput.getValue();
    if (amount < this.getMinAmount()) {
      this.amountInput.setError(
        `${L.transfersotheraccountschoosescreen_textinput_amount_minimal_error
        } ${this.getMinAmountFormatted()}`
      );
      return false;
    }
    if (amount > this.getMaxAmount()) {
      this.amountInput.setError(
        `${L.transfersotheraccountschoosescreen_textinput_amount_limit_error
        } ${this.getMaxAmountFormatted()}`
      );
      return false;
    }
    if (!this.isValidFunds(amount)) {
      this.amountInput.setError(
        L.transfersotheraccountschoosescreen_textinput_amount_balance_error
      );
      return false;
    }
    return true;
  };
  isValidTarget = () => {
    if (!this.targetInput) {
      return false;
    }
    const isValid = this.targetInput.isValid();
    if (!isValid) {
      return false;
    }
    const target = this.targetInput.getValue();
    if (![9, 10].includes(target.length)) {
      this.targetInput.setError(
        L.transfersmyaccountschoosescreen_textinput_target_invalid
      );
      return false;
    }
    return true;
  };

  isValidFunds = (amount: number) => {
    const accountOrigin = this.getAccountOrigin();
    if (!accountOrigin) {
      return false;
    }
    return amount <= accountOrigin.availableBalance;
  };

  tryToSubmit = () => {
    this.blur();

    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'submit',
        e: '',
      });
      return;
    }

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

  onBlur = () => {
    this.isValid();
  };

  onBlurTarget = () => {
    this.isValid();
    if (!this.targetInput) {
      return;
    }
    this.isValidTarget();
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
    const { navigation } = this.props;
    const origin = this.getAccountOrigin();
    const currency = this.getCurrency();

    if (!origin) {
      return;
    }

    try {
      const amount = this.amountInput
        ? this.amountInput.getValue().toString()
        : '';
      const response = await API.Execute.transfersLocalPreview(
        {
          quantity: amount,
          currency: currency.label,
        },
        origin.idProduct,
        this.targetInput ? this.targetInput.getValue() : ''
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      const body = response.body;
      const data = body.data;
      const error = data as DefaultErrorResponse;
      if (body.code === API.ResponseCode.OK) {
        const resume = data.transferData;
        const { frequentContact } = this.state;
        navigation.navigate('TransfersOtherAccountsConfirm', {
          resume,
          origin,
          currency,
          frequentContact,
          amountInput: amount,
        });
      } else if (error.ToAccount) {
        if (error.ToAccount.includes('bloqueada')) {
          this.targetInput &&
            this.targetInput.setError(
              L.transfersotheraccountschoosescreen_target_invalid_blocked
            );
        } else {
          this.targetInput &&
            this.targetInput.setError(
              L.transfersotheraccountschoosescreen_target_invalid
            );
        }
      } else if (
        error.Amount &&
        !error.Amount.toLowerCase().includes('error interno')
      ) {
        this.amountInput &&
          this.amountInput.setError(
            `${L.transfersotheraccountschoosescreen_textinput_amount_limit_day_error1
            }${this.getMaxAmountFormatted()}${L.transfersotheraccountschoosescreen_textinput_amount_limit_day_error2
            }`
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
  };

  blur = () => {
    KeyboardUtil.hide();
  };
  onSubmitEditingTarget = () => {
    const isValid = this.isValidTarget();
    if (!isValid) {
      return;
    }
    this.amountInput && this.amountInput.focus();
  };

  getMinAmount = () => {
    const currency = this.getCurrency();
    if (currency.label === Currencies.USD.label) {
      return Config.settings.limitMinTransfersOtherAccountsUSD;
    }

    return Config.settings.limitMinTransfersOtherAccountsPEN;
  };
  getMinAmountFormatted = () => {
    const currency = this.getCurrency();
    return Amount.format(this.getMinAmount(), currency.label);
  };

  getMaxAmount = () => {
    const currency = this.getCurrency();
    if (currency.label === Currencies.USD.label) {
      return Config.settings.limitTransfersOtherAccountsUSD;
    }

    return Config.settings.limitTransfersOtherAccountsPEN;
  };
  getMaxAmountFormatted = () => {
    const currency = this.getCurrency();
    return Amount.format(this.getMaxAmount(), currency.label);
  };

  render() {
    const {
      isLoading,
      indexOrigin,
      currencies,
      accounts,
      frequentContact,
      isValid,
    } = this.state;
    const { isFocused } = this.props;
    const accountOrigin = this.getAccountOrigin();
    const currency = this.getCurrency();
    const isSameCurrency = accountOrigin
      ? currency.label === accountOrigin.currency
      : true;
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
                center
                style={styles.header}
                accessibilityLabel={
                  'transfersotheraccountschoosescreen_sectionheader_accounts'
                }
                title={L.transfersotheraccountschoosescreen_sectionheader_title}
              />
              <CardView
                accessibilityLabel={
                  'transfersotheraccountschoosescreen_cardview'
                }
                padding
              >
                <AccountSelector
                  accessibilityLabel={
                    'transfersotheraccountschoosescreen_accountselector_title_origin'
                  }
                  title={
                    L.transfersotheraccountschoosescreen_accountselector_title_origin
                  }
                  placeholder={
                    L.transfersotheraccountschoosescreen_accountselector_placeholder_origin
                  }
                  values={accounts}
                  selectedIndex={indexOrigin}
                  readOnly={accounts.length === 1}
                  onPress={this.changeOriginAccount}
                  style={styles.accountSelectorOrigin}
                />
                {!frequentContact && (
                  <>
                    <SectionHeader
                      accessibilityLabel={
                        'transfersotheraccountschoosescreen_sectionheader_target'
                      }
                      title={
                        L.transfersotheraccountschoosescreen_sectionheader_target
                      }
                    />
                    <TextInput
                      keyboardType={'numeric'}
                      autoCorrect={false}
                      onBlur={this.onBlurTarget}
                      blurOnSubmit={false}
                      accessibilityLabel={
                        'transfersotheraccountschoosescreen_textinput_target'
                      }
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      ref={ref => {
                        this.targetInput = ref;
                      }}
                      formatText={Formats.Account}
                      onSubmitEditing={this.onSubmitEditingTarget}
                    />
                  </>
                )}
                {frequentContact && (
                  <FrequentContact
                    accessibilityLabel={
                      'transfersotheraccountschoosescreen_textinput_target'
                    }
                    containerStyle={{ marginBottom: 20 }}
                    ref={ref => {
                      this.targetInput = ref;
                    }}
                    formatText={Formats.Account}
                    frequentContact={frequentContact}
                  />
                )}
                <SectionHeader
                  accessibilityLabel={
                    'transfersotheraccountschoosescreen_sectionheader_currency'
                  }
                  title={
                    L.transfersotheraccountschoosescreen_sectionheader_currency
                  }
                />
                <SelectorTag
                  style={styles.selector}
                  accessibilityLabel={
                    'transfersotheraccountschoosescreen_segmented_currency'
                  }
                  options={currencies.map(item => ({
                    label: `${item.symbol} ${item.code}`,
                    value: item,
                  }))}
                  ref={ref => {
                    this.currencySelector = ref;
                  }}
                  defaultValue={Currencies.PEN}
                  onSelectIndex={this.changeCurrency}
                />
                {!isSameCurrency && (
                  <ExchangeRate
                    accent
                    style={styles.exchangeRate}
                    accessibilityLabel={
                      'transfersotheraccountschoosescreen_exchangerate'
                    }
                  />
                )}
                <SectionHeader
                  style={styles.sectionHeaderAmount}
                  accessibilityLabel={
                    'transfersotheraccountschoosescreen_sectionheader_amount'
                  }
                  title={
                    L.transfersotheraccountschoosescreen_sectionheader_amount
                  }
                  subtitle={`${L.transfersotheraccountschoosescreen_sectionheader_amount_subtitle_part1
                    } ${this.getMinAmountFormatted()} ${L.transfersotheraccountschoosescreen_sectionheader_amount_subtitle_part2
                    }  ${this.getMaxAmountFormatted()}`}
                />

                <TextInputAmount
                  keyboardType={'decimal-pad'}
                  showClearButton={false}
                  autoCorrect={false}
                  onFocus={this.clearAmount}
                  onBlur={this.onBlur}
                  blurOnSubmit
                  accessibilityLabel={
                    'transfersotheraccountschoosescreen_textinput_amount'
                  }
                  autoCapitalize={'none'}
                  currency={currency.symbol}
                  ref={ref => {
                    this.amountInput = ref;
                  }}
                  formatText={Formats.Amount}
                />
              </CardView>

              <Button
                style={styles.buttons}
                accessibilityLabel={
                  'transfersotheraccountschoosescreen_button_continue'
                }
                allowOnPress
                disabled={!isValid}
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.transfersotheraccountschoosescreen_button_continue}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type TransfersOtherAccountsChooseScreenType = TransfersOtherAccountsChooseScreen;
export default withFocused<TransfersOtherAccountsChooseScreen, Props>(
  TransfersOtherAccountsChooseScreen
);
