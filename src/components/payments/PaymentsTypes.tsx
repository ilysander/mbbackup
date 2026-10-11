import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Config from '../../Config';
import { Linking, Validate } from '../../resources/functions';
import { L } from '../../resources/language';
import { Emitter } from '../../resources/listeners';
import { Log } from '../../resources/log';
import TypesItem from '../types/TypesItem';
import Features from '../../resources/remote/Features';
import { Button } from '../ui/index';
import NotAllowedAlert from '../../components/alert/NotAllowedAlert';
import { AlertEvent } from '../../components/alert/AlertManager';
import { ErrorRequest, TypeAlertScreen } from '../../resources/constants/index';
import { NavigationProp } from '@react-navigation/native';

const TAG = '[PaymentsTypes]';

export interface PaymentsTypesProps {
  accessibilityLabel: string;
  navigation: NavigationProp<any, any>;
  accounts?: any[];
  loans?: any[];
  isBetweenOfficeHours?: boolean;
  isFocused?: boolean;
  user: any;
}

export interface PaymentsTypesState {
  isLoadingProfile: boolean;
  showNotAllowedModal: boolean;
}

export default class PaymentsTypes extends React.Component<
  PaymentsTypesProps,
  PaymentsTypesState
> {
  state: PaymentsTypesState = {
    isLoadingProfile: true,
    showNotAllowedModal: false,
  };
  goToLoansWeb = async () => {
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
      Log.debug(TAG, 'goToLoansWeb', e);
    }
  };

  goToLoans = async () => {
    const { accounts, loans, user, isBetweenOfficeHours } = this.props;

    if (!isBetweenOfficeHours) {
      Emitter.emit<AlertEvent>('onAlertMedia', {
        tag: TAG,
        method: 'load',
        e: ErrorRequest.Default,
        typeAlert: TypeAlertScreen.PAYMENTS,
      });

      return
    }

    if (!!user) {
      if (!!user.mobilePhone) {
        this.props.navigation.navigate('PaymentsThirdPartiesChoose', {
          accounts,
          loans,
        });
      } else {
        this.setState({ showNotAllowedModal: true });
      }
    }
  };

  onPressMyLoans = () => {
    const { accounts, loans, isBetweenOfficeHours } = this.props;
    if (isBetweenOfficeHours) {
      if (loans && loans.length === 1) {
        const isExpired = Validate.isLoanExpired(loans[0]);
        if (isExpired) {
          Emitter.emit('onToast', {
            id: 'loan_due',
            message: L.paymentstypes_toast_loan_due_error,
            action: {
              onPress: this.goToLoansWeb,
              title: L.paymentstypes_toast_go_to_web,
            },
          });
          return;
        }
        this.props.navigation.navigate('PaymentsOwnLoansChoose', {
          accounts,
          loan: loans[0],
        });
        return;
      }
      this.props.navigation.navigate('PaymentsOwnLoansList', {
        accounts,
        loans,
      });
    } else {
      Emitter.emit<AlertEvent>('onAlertMedia', {
        tag: TAG,
        method: 'load',
        e: ErrorRequest.Default,
        typeAlert: TypeAlertScreen.PAYMENTS,
      });
      return
    }
  };

  hideNotAllowedModal = () => {
    this.setState({ showNotAllowedModal: false });
  };

  render() {
    const { accounts, accessibilityLabel, loans, user, isBetweenOfficeHours } = this.props;
    const { showNotAllowedModal } = this.state;
    const hasAccounts = accounts && accounts.length > 0;
    const hasLoans = loans && loans.length > 0;
    return (
      <View
        style={{ paddingHorizontal: 20 }}
        accessibilityLabel={accessibilityLabel}
      >
        {showNotAllowedModal && (
          <NotAllowedAlert
            title={L.paymentstypes_toast_other_loans_notallowedalert_title}
            description={
              L.paymentstypes_toast_other_loans_notallowedalert_description
            }
            accessibilityLabel={'paymentstypes_item_own_loans_notallowedalert'}
            accessibilityLabelBtn={
              'paymentstypes_item_own_loans_notallowedalert_btn'
            }
            onClose={this.hideNotAllowedModal}
          />
        )}
        {Features.isAllowedTo('PaymentsOwnLoans') &&
          (hasLoans || !hasAccounts) && (
            <TypesItem
              accessibilityLabel={'paymentstypes_item_own_loans'}
              active
              enabled={hasAccounts}
              title={L.paymentstypes_typesitem_title_own_loans}
              onPress={this.onPressMyLoans}
            />
          )}
        {Features.isAllowedTo('PaymentsOtherLoans') && (
          <TypesItem
            last
            active={!!user}
            enabled={hasAccounts}
            accessibilityLabel={'paymentstypes_item_other_loans'}
            title={L.paymentstypes_typesitem_title_other_loans}
            onPress={this.goToLoans}
          >
            {!user ? <ActivityIndicator /> : <View />}
          </TypesItem>
        )}
        {Features.isAllowedTo('PaymentsOtherLoansWeb') && (
          <TypesItem
            last
            enabled={hasAccounts}
            accessibilityLabel={'paymentstypes_item_other_loans_go_to_web'}
            title={L.paymentstypes_typesitem_title_other_loans}
            onPress={this.goToLoansWeb}
          >
            {isBetweenOfficeHours ? <Button
              small
              accessibilityLabel={'paymentstypes_item_other_loans_go_to_web'}
              typeColor={'primary'}
              title={L.paymentstypes_button_go_to_web}
              disabled={!hasAccounts}
            /> : <View />}

          </TypesItem>
        )}
      </View>
    );
  }
}
