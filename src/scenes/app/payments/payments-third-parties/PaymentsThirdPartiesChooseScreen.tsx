import * as React from 'react';
import {
  InteractionManager,
  StyleSheet,
  ViewStyle,
  Text,
  View,
  TextStyle,
  Platform,
} from 'react-native';
import API from '../../../../api';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import {
  FrequentContactType,
  AccountItemSavingsAll,
} from '../../../../api/backend/response/Execute';
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
  Alert,
} from '../../../../components/ui';
import Config from '../../../../Config';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import { Colors, Currencies, Formats } from '../../../../resources/constants';
import { Currency } from '../../../../resources/constants/Currencies';
import { Size } from '../../../../resources/dimensions';
import { Font, Validate } from '../../../../resources/functions';
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
    marginBottom: 50,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
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
  errorMessage: {
    marginTop: 4,
    backgroundColor: Colors.grey1,
    borderRadius: 12,
    borderColor: Colors.danger,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    minHeight: Platform.OS === 'android' ? 50 : 40,
  } as ViewStyle,
  alertButton: {
    width: '100%',
  } as ViewStyle,
});

const TAG = '[PaymentsThirdPartiesChooseScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  accounts: AccountItemSavingsAll[];
  indexOrigin: number;
  currencyIndex: number;
  isLoading: boolean;
  currencies: Currency[];
  frequentContact?: FrequentContactType;
  isShowModalCancel: boolean;
  isButtonAvailable: boolean;
}

class PaymentsThirdPartiesChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsthirdpartiesscreen_title,
  // };
  state: State = {
    accounts: [],
    indexOrigin: -1,
    currencyIndex: -1,
    isLoading: false,
    currencies: [Currencies.PEN, Currencies.USD],
    isButtonAvailable: false,
    isShowModalCancel: false,
  };
  interaction!: any;
  amountInput!: TextInputAmount | null;
  currencySelector!: Selector<Currency> | null;
  targetInput!: TextInput | FrequentContact | null;
  origin!: AccountSelector | null;

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
    this.setState({ accounts, frequentContact }, () => {
      if (accounts.length === 1) {
        AnalyticsEvent.track(
          A.paymentsthirdpartieschoosescreen_event_origin_autoassigned
        );
        this.changeOriginAccountBase(0, false);
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
      A.paymentsthirdpartieschoosescreen_accountselector_origin
    );

    this.changeOriginAccountBase(indexOrigin, true);
  };

  closeOriginModal = () => {
    const isValid = this.isValid(false);
    this.isValidOrigin(true);
    this.setState({ isButtonAvailable: isValid });
    return true;
  };

  /**
   * Validacion del indice de la cuenta origen "-1 si no tiene cuenta"
   */
  async changeOriginAccountBase(indexOrigin: number, showError = true) {
    await this.setState({ indexOrigin });
    const isValid = this.isValid(false);
    this.isValidAmount(showError);
    this.isValidOrigin(true);
    this.setState({ isButtonAvailable: isValid });
  }

  /**
   * Validacion principal de todos los elementos
   */
  isValid = (showError = true) => {
    const amountIsValid = this.isValidAmount(showError);
    const targetIsValid = this.isValidTarget(showError);
    const origin = this.isValidOrigin(showError);
    const isValid = [origin, amountIsValid, targetIsValid].every(item => item);
    return isValid && NetworkManager.isConnected;
  };

  /**
   * Validacion de la cuenta de origen
   */
  isValidOrigin = (showError = true) => {
    if (!this.origin) {
      return false;
    }
    const { indexOrigin } = this.state;
    if (indexOrigin === -1) {
      if (showError) {
        this.origin.setError(L.selectaccountmodal_title_error);
      }
      return false;
    } else {
      this.origin.setError('');
    }
    return true;
  };

  /**
   * Validacion del monto
   */
  isValidAmount = (showError = true) => {
    if (!this.amountInput) {
      return false;
    }
    const isValid = this.amountInput.isValid(showError);
    if (!isValid) {
      return false;
    }
    const amount = this.amountInput.getValue();
    if (amount < this.getMinAmount()) {
      if (showError) {
        this.amountInput.setError(
          `${L.paymentsthirdpartieschoosescreen_textinput_amount_minimal_error}`
        );
      }
      return false;
    }

    const { indexOrigin } = this.state;
    if (!this.isValidFunds(amount) && indexOrigin !== -1) {
      if (showError) {
        this.amountInput.setError(
          L.paymentsthirdpartieschoosescreen_textinput_amount_balance_error
        );
      }
      return false;
    }
    return true;
  };

  /**
   * Validacion del numero de prestamo
   */
  isValidTarget = (showError = true) => {
    if (!this.targetInput) {
      return false;
    }
    const isValid = this.targetInput.isValid(showError);
    if (!isValid) {
      return false;
    }
    const target = this.targetInput.getValue();
    if (![9, 15].includes(target.length)) {
      if (showError) {
        this.targetInput.setError(
          L.paymentsthirdpartieschoosescreen_textinput_target_invalid
        );
      }
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
    this.setState({ isButtonAvailable: false });
    this.setState({ isLoading: true });
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
      await this.submit();
      this.setState({ isLoading: false });
      this.setState({ isButtonAvailable: true });
    });
  };

  onBlurTarget = () => {
    if (!this.targetInput) {
      return;
    }
    this.onSubmitEditingTarget();
  };
  onBlurAmount = () => {
    if (!this.amountInput) {
      return;
    }
    this.onSubmitEditingAmount();
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
      const response = await API.Execute.thirdPartiesLocalPreview(
        '',
        this.targetInput ? this.targetInput.getValue() : '',
        {
          currency: currency.label,
          quantity: amount,
        },
        origin.idProduct
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      const body = response.body;
      const data = body.data;
      const error = data as DefaultErrorResponse;
      if (body.code === API.ResponseCode.OK) {
        const resume = data;
        const { frequentContact } = this.state;
        navigation.navigate('PaymentsThirdPartiesConfirm', {
          resume,
          origin,
          currency,
          frequentContact,
          loanAmount: amount,
          loan: this.targetInput,
        });
      } else if (error.debitAccount) {
        if (error.debitAccount.includes('El valor ingresado no es válido')) {
          this.setState({ isShowModalCancel: true });
        }
      } else if (error.NO_FIELD) {
        if (
          error.NO_FIELD.includes(
            'Lo sentimos. En estos momentos, no podemos procesar tu pago. Por favor, valide los datos ingresados y reintenta.'
          )
        ) {
          this.targetInput?.setError(
            `${L.paymentsthirdpartieschoosescreen_textinput_loan_number_error}`
          );
        } else {
          if (error.NO_FIELD.includes('Su pago no puede ser procesado')) {
            this.setState({ isShowModalCancel: true });
          }
        }
      } else {
        this.setState({ isShowModalCancel: true });
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
    const isValidTarget = this.isValidTarget();
    const isValid = this.isValid(false);
    this.setState({ isButtonAvailable: isValid });
    if (!isValidTarget) {
      return;
    }
    if (!isValid) {
      this.amountInput && this.amountInput.focus();
    } else {
      KeyboardUtil.hide();
    }
  };

  onSubmitEditingAmount = () => {
    setTimeout(() => {
      const isValid = this.isValid(false);
      this.isValidAmount();
      this.setState({ isButtonAvailable: isValid });
    }, 100);
  };

  getMinAmount = () => {
    const currency = this.getCurrency();
    if (currency.label === Currencies.USD.label) {
      return Config.settings.limitMinPaymentsAccountsUSD;
    }
    return Config.settings.limitMinPaymentsAccountsPEN;
  };

  getMinAmountFormatted = () => {
    const currency = this.getCurrency();
    return Amount.format(this.getMinAmount(), currency.label);
  };

  closeModalCancel = () => {
    this.setState({ isShowModalCancel: false });
  };

  render() {
    const {
      isLoading,
      indexOrigin,
      accounts,
      isButtonAvailable,
      isShowModalCancel,
    } = this.state;
    const { isFocused } = this.props;
    const currency = this.getCurrency();
    return (
      <Container>
        {isShowModalCancel && (
          <Alert
            message={
              <View>
                <Text style={styles.alertTextTitle}>
                  {L.paymentsthirdpartieschoosescreen_alertmodal_title}
                </Text>
                <Text style={styles.alertTextMessage}>
                  {L.paymentsthirdpartieschoosescreen_alertmodal_message}
                </Text>
                <Text style={styles.alertTextMessage}>
                  {L.paymentsthirdpartieschoosescreen_alertmodal_message2}
                </Text>
              </View>
            }
            actionButton={{
              accessibilityLabel:
                'paymentsthirdpartieschoosescreen_alert_button_agree',
              onPress: this.closeModalCancel,
              title: L.paymentsthirdpartieschoosescreen_alertmodal_actionbutton,
              style: styles.alertButton,
            }}
          />
        )}

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
                  'paymentsthirdpartieschoosescreen_sectionheader_accounts'
                }
                title={L.paymentsthirdpartieschoosescreen_sectionheader_title}
              />
              <CardView
                accessibilityLabel={'paymentsthirdpartieschoosescreen_cardview'}
                padding
              >
                <SectionHeader
                  accessibilityLabel={
                    'paymentsthirdpartieschoosescreen_sectionheader_target'
                  }
                  title={
                    L.paymentsthirdpartieschoosescreen_sectionheader_target
                  }
                />
                <TextInput
                  keyboardType={'numeric'}
                  autoCorrect={false}
                  onBlur={this.onBlurTarget}
                  blurOnSubmit={false}
                  accessibilityLabel={
                    'paymentsthirdpartieschoosescreen_textinput_target'
                  }
                  autoCapitalize={'none'}
                  ref={ref => {
                    this.targetInput = ref;
                  }}
                  formatText={Formats.AccountThirdParties}
                  onSubmitEditing={this.onSubmitEditingTarget}
                />
                <SectionHeader
                  accessibilityLabel={
                    'paymentsthirdpartieschoosescreen_sectionheader_amount'
                  }
                  title={
                    L.paymentsthirdpartieschoosescreen_sectionheader_amount
                  }
                />
                <TextInputAmount
                  keyboardType={'decimal-pad'}
                  showClearButton={false}
                  autoCorrect={false}
                  onFocus={this.clearAmount}
                  blurOnSubmit
                  onBlur={this.onBlurAmount}
                  accessibilityLabel={
                    'paymentsthirdpartieschoosescreen_textinput_amount'
                  }
                  autoCapitalize={'none'}
                  currency={currency.symbol}
                  ref={ref => {
                    this.amountInput = ref;
                  }}
                  formatText={Formats.AmountThirdParties}
                  onSubmitEditing={this.onSubmitEditingAmount}
                  onChangeText={this.onSubmitEditingAmount}
                />
                <AccountSelector
                  accessibilityLabel={
                    'paymentsthirdpartieschoosescreen_accountselector_title_origin'
                  }
                  title={
                    L.paymentsthirdpartieschoosescreen_accountselector_title_origin
                  }
                  placeholder={
                    L.paymentsthirdpartieschoosescreen_accountselector_placeholder_origin
                  }
                  values={accounts}
                  selectedIndex={indexOrigin}
                  readOnly={accounts.length === 1}
                  onPress={this.changeOriginAccount}
                  ref={ref => {
                    this.origin = ref;
                  }}
                  onCloseModal={this.closeOriginModal}
                />
              </CardView>
              <Button
                disabled={!isButtonAvailable}
                style={styles.buttons}
                accessibilityLabel={
                  'paymentsthirdpartieschoosescreen_button_continue'
                }
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.paymentsthirdpartieschoosescreen_button_continue}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsThirdPartiesChooseScreenType = PaymentsThirdPartiesChooseScreen;
export default withFocused<PaymentsThirdPartiesChooseScreen, Props>(
  PaymentsThirdPartiesChooseScreen
);
