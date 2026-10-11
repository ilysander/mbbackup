import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button } from '../ui';
import { AccountsType, ErrorRequest, TypeAlertScreen } from '../../resources/constants';
import { L } from '../../resources/language';
import Log from '../../resources/log/Log';
import { Validate, Linking } from '../../resources/functions';
import API from '../../api';
import {
  ContentCreditLine,
  LoansItem,
} from '../../api/backend/response/Execute';
import { Emitter } from '../../resources/listeners';
import { AlertEvent } from '../alert/AlertManager';
import Config from '../../Config';
import { ButtonProps } from '../ui/Button';
import { NavigationProp } from '@react-navigation/native';

export interface PayButtonProps extends ButtonProps {
  loan: LoansItem;
  navigation: NavigationProp<any, any>;
  isBetweenOfficeHours?: boolean;
}

export interface PayButtonState {
  isLoading: boolean;
  creditLine?: ContentCreditLine;
}

const styles = StyleSheet.create({
  buttonPay: {
    minWidth: 100,
  } as ViewStyle,
});

const TAG = '[PayButton]';
export default class PayButton extends React.Component<
  PayButtonProps,
  PayButtonState
> {
  state: PayButtonState = {
    isLoading: false,
  };

  loadAccounts = async () => {
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      let { accounts } = response.body.data;
      const validTypes = [AccountsType.SAVING_ACCOUNTS.family];
      accounts = (accounts || []).filter(account =>
        validTypes.includes(account.family)
      );
      return accounts;
    } catch (e) {
      Log.exception(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
    }
    return [];
  };

  goToPay = async () => {
    const { navigation, loan, isBetweenOfficeHours = true } = this.props;
    if (!isBetweenOfficeHours) {
      Emitter.emit<AlertEvent>('onAlertMedia', {
        tag: TAG,
        method: 'load',
        e: ErrorRequest.Default,
        typeAlert: TypeAlertScreen.PAYMENTS,
      });
      return
    }

    this.setState({ isLoading: true });
    const accounts = await this.loadAccounts();
    this.setState({ isLoading: false });
    if (accounts && accounts.length > 0) {
      navigation.navigate('PaymentsOwnLoansChoose', { loan, accounts });
    } else {
      navigation.navigate('NewAccountLoan', {});
    }
  };

  goToWeb = async () => {
    try {
      const { isBetweenOfficeHours } = this.props;
      if (!isBetweenOfficeHours) {
        Emitter.emit<AlertEvent>('onAlertMedia', {
          tag: TAG,
          method: 'load',
          e: ErrorRequest.Default,
          typeAlert: TypeAlertScreen.PAYMENTS,
        });
        return
      }

      await Linking.openURL(Config.settings.loanListUrl);
    } catch (e) {
      Log.debug(TAG, 'goToWeb', e);
    }
  };

  render() {
    const { style, loan, ...props } = this.props;
    const { isLoading } = this.state;

    const isExpired = Validate.isLoanExpired(loan);

    return (
      <Button
        small
        title={
          isLoading ? '' : isExpired ? L.paybutton_pay_web : L.paybutton_pay
        }
        onPress={isExpired ? this.goToWeb : this.goToPay}
        style={styles.buttonPay}
        loading={isLoading}
        {...props}
      />
    );
  }
}
