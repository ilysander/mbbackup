import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  InteractionManager,
  TextStyle,
  ScrollView,
} from 'react-native';
import API from '../../../../api';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import AccountSelectorExpanded from '../../../../components/payments-services/AccountSelectorExpanded';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  Loading,
  CardView,
} from '../../../../components/ui';
import { AccountsType, ErrorRequest } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import {
  AccountItemSavingsAll,
  Bill,
} from '../../../../api/backend/response/Execute';
import NetworkManager from '../../../../components/network/NetworkManager';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import { CurrencyType } from '../../../../resources/persistence/models/AmountModel';
import InvalidPhoneAlert from '../../../../components/alert/InvalidPhoneAlert';
import { ReturnOptions } from '../../../../components/alert/ConfirmPhoneAlert';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    maxWidth: '75%',
    alignSelf: 'center',
  } as ViewStyle,
  formSteps: {
    marginBottom: 10,
  } as ViewStyle,
  info: {
    marginBottom: 40,
    marginTop: 30,
    height: 50,
  } as ViewStyle,
  content: {
    marginTop: 10,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
  } as TextStyle,
});

const TAG = '[PaymentsServicesChooseAccountScreen]';

export interface NavigationParams {
  bill: Bill;
  currency: CurrencyType;
  supplyLabel: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  accounts: AccountItemSavingsAll[];
  isLoading: boolean;
  isLoadingAccounts: boolean;
  isValid: boolean;
  accountIndex: number;
  currency: CurrencyType;
  bill?: Bill;
  supplyLabel?: string;
  showInvalidModal: boolean;
}

class PaymentsServicesChooseAccountScreen extends React.Component<
  Props & FocusedProps,
  State
> {


  state: State = {
    accounts: [],
    isLoading: false,
    isLoadingAccounts: false,
    isValid: false,
    currency: CurrencyType.PEN,
    accountIndex: -1,
    showInvalidModal: false,
  };

  accountSelector!: AccountSelectorExpanded | null;
  scroll!: ScrollView | null;

  componentDidMount() {
    const { route } = this.props;
    const currency = route.params ? route.params.currency : CurrencyType.PEN;
    const bill = route.params && route.params.bill;
    const supplyLabel = route.params && route.params.supplyLabel;

    this.setState({ currency, bill, supplyLabel }, () => {
      this.load();
    });
  }

  load = async () => {
    const { isLoadingAccounts, currency } = this.state;
    if (isLoadingAccounts) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    this.setState({ isLoadingAccounts: true });
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      let { accounts } = response.body.data;
      const validTypes = [AccountsType.SAVING_ACCOUNTS.family];
      accounts = (accounts || []).filter(
        account =>
          validTypes.includes(account.family) && account.currency === currency
      );
      const accountIndex = accounts.length === 1 ? 0 : -1;
      this.setState({ accounts, accountIndex }, () => {
        this.isValid();
      });
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({ isLoadingAccounts: false });
  };

  getAccount = () => {
    const { accountIndex, accounts } = this.state;
    if (accountIndex === -1) {
      return;
    }

    return accounts[accountIndex];
  };
  isValidAccount = (showErrors = true) => {
    this.accountSelector && this.accountSelector.clearError();
    const account = this.getAccount();
    const { bill } = this.state;
    if (!account) {
      showErrors &&
        this.accountSelector &&
        this.accountSelector.setError(
          L.paymentsserviceschooseaccountscreen_error_empty_account
        );
      return false;
    }
    const amount = bill ? bill.totalAmount : 0;
    if (account.availableBalance < amount) {
      showErrors &&
        this.accountSelector &&
        this.accountSelector.setError(
          L.paymentsserviceschooseaccountscreen_error_amount
        );
      showErrors && this.scrollToEnd();
      return false;
    }

    return true;
  };

  isValid = (showErrors = true) => {
    const isValid = [
      this.isValidAccount(showErrors),
      NetworkManager.isConnected,
    ].every(value => value);

    this.setState({ isValid });
    return isValid;
  };

  getProfile = async () => {
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadProfile', response);
      }
      return response.body.data;
    } catch (e) {
      Log.exception(TAG, 'loadProfile', e);
    }
    return;
  };

  tryToSubmit = async () => {
    const isValid = this.isValid();
    if (!isValid) {
      return;
    }
    this.setState({ isLoading: true });
    const user = await this.getProfile();
    if (!user) {
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadProfile',
        e: ErrorRequest.Default,
      });
    } else if (!user.mobilePhone) {
      this.setState({ showInvalidModal: true });
    } else {
      await this.submit();
    }

    this.setState({ isLoading: false });
  };

  submit = async () => {
    const account = this.getAccount();
    const { bill, supplyLabel } = this.state;
    if (!bill || !account) {
      Log.info(TAG, 'submit', 'empty data');
      return;
    }
    try {
      const response = await API.Execute.servicePaymentPreview({
        valueDate: '',
        debitAccount: account.idProduct,
        totalAmount: bill.totalAmount,
        billSelector: bill,
      });

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data;
        this.props.navigation.navigate('PaymentsServicesConfirm', {
          supplyLabel,
          resume,
          bill,
          origin: account,
        });
        return;
      }

      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.NO_FIELD) {
        this.accountSelector && this.accountSelector.setError(error.NO_FIELD);
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
  scrollToEnd = () => {
    InteractionManager.runAfterInteractions(() => {
      this.scroll && this.scroll.scrollToEnd();
    });
  };
  changeAccountOrigin = (accountIndex: number) => {
    this.setState({ accountIndex }, () => {
      const isValid = this.isValid();
      isValid && this.scrollToEnd();
    });
  };

  hideInvalidModal = () => {
    this.setState({ showInvalidModal: false });
  };

  getConfirmReturnOptions = (): ReturnOptions => {
    const { navigation } = this.props;

    return {
      success: {
        onPress: () => {
          navigation.navigate('PaymentsServicesChooseAccount');
        },
        title:
          L.paymentsserviceschooseaccountscreen_returnoptions_change_success,
      },
      cancel: {
        onPress: () => {
          navigation.navigate('PaymentsServicesChooseAccount');
        },
      },
    };
  };

  render() {
    const {
      isLoading,
      isLoadingAccounts,
      accountIndex,
      accounts,
      isValid,
      showInvalidModal,
    } = this.state;
    const { isFocused, navigation } = this.props;
    const returnOptions = this.getConfirmReturnOptions();

    return (
      <Container>
        {showInvalidModal && (
          <InvalidPhoneAlert
            accessibilityLabel={
              'paymentsserviceschooseaccountscreen_confirmcode'
            }
            returnOptions={returnOptions}
            navigation={navigation}
            onClose={this.hideInvalidModal}
          />
        )}
        <FormSteps total={4} current={2} style={styles.formSteps} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          ref={ref => {
            this.scroll = ref;
          }}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content style={styles.content}>
              <NetworkStatusAlert />

              <Header
                center
                style={styles.header}
                accessibilityLabel={
                  'paymentsserviceschooseaccountscreen_header_title'
                }
                title={L.paymentsserviceschooseaccountscreen_header_title}
              />
              <CardView>
                {isLoadingAccounts && <Loading margin={'large'} />}
                {!isLoadingAccounts && (
                  <AccountSelectorExpanded
                    accessibilityLabel={
                      'paymentsserviceschooseaccountscreen_accountselector'
                    }
                    ref={ref => {
                      this.accountSelector = ref;
                    }}
                    values={accounts}
                    selectedIndex={accountIndex}
                    readOnly={accounts.length === 1}
                    onPress={this.changeAccountOrigin}
                  />
                )}
              </CardView>
              <Button
                style={styles.info}
                textStyle={styles.buttonText}
                disabled={!isValid}
                allowOnPress
                accessibilityLabel={
                  'paymentsserviceschooseaccountscreen_button_continue'
                }
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.paymentsserviceschooseaccountscreen_button_continue}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsServicesChooseAccountScreenType = PaymentsServicesChooseAccountScreen;
export default withFocused<PaymentsServicesChooseAccountScreen, Props>(
  PaymentsServicesChooseAccountScreen
);
