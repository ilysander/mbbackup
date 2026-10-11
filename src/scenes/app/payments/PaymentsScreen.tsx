const moment = require('moment');
import * as React from 'react';
import { StyleSheet, TextStyle, ViewStyle, Text } from 'react-native';
import API from '../../../api';
import PaymentsTypes from '../../../components/payments/PaymentsTypes';
import TypesItem from '../../../components/types/TypesItem';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  Panel,
  SafeAreaView,
  Button,
} from '../../../components/ui';
import Config from '../../../Config';
import { Size } from '../../../resources/dimensions';
import { Validate, Linking } from '../../../resources/functions';
import { L } from '../../../resources/language';
import { Emitter } from '../../../resources/listeners';
import { Log } from '../../../resources/log';
import { AlertEvent } from '../../../components/alert/AlertManager';
import Features from '../../../resources/remote/Features';
import NewAccountFlashMessage from '../../../components/ui/NewAccountFlashMessage';
import { Colors } from '../../../resources/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  otherPaymentsPanelStyle: {
    marginTop: 30,
  } as ViewStyle,
  otherTypesItem: {
    paddingHorizontal: 20,
  } as ViewStyle,
  colorFlashMessage: {
    color: Colors.primaryLight,
  } as TextStyle,
});

const TAG = '[PaymentsScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, any>;
}

export interface State {
  isLoading: boolean;
  isBetweenOfficeHours: boolean;
  isLoadingAccountsAndLoans: boolean;
  accounts: any[];
  loans: any[];
  user?: any;
}

class PaymentsScreen extends React.Component<Props & FocusedProps, State> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsscreen_title,
  //   headerLeft: <View />,
  // };

  state: State = {
    isLoading: false,
    isBetweenOfficeHours: false,
    isLoadingAccountsAndLoans: false,
    accounts: [],
    loans: [],
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      this.load();
    }
  }

  isBetweenOfficeHours = (date: string) => {
    const parsedDate = moment(date).utcOffset(Config.settings.countryTimezone);
    return (
      parsedDate.isoWeekday() !== 7 &&
      Validate.isBetweenHours(
        date,
        Config.settings.startTimePayments,
        Config.settings.endTimePayments
      )
    );
  };

  load = async () => {
    const { isLoadingAccountsAndLoans } = this.state;
    if (isLoadingAccountsAndLoans) {
      Log.info(TAG, 'load', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true, isLoadingAccountsAndLoans: true });
    try {
      const response = await API.Execute.widgetsProducts();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const isBetweenOfficeHours = this.isBetweenOfficeHours(
        response.headers.date || response.headers.Date
      );
      const { loans: loansMap, accountsCA } = response.body.data.productMap;
      const loans = loansMap.products;

      const accounts = [...accountsCA.products];
      this.setState({ accounts, loans, isBetweenOfficeHours });
      await this.loadProfile();
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({ isLoadingAccountsAndLoans: false });
    this.setLoadingOff();
  };

  loadProfile = async () => {
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadProfile', response);
      }
      const user = response.body.data;
      this.setState({ user });
    } catch (e) {
      Log.exception(TAG, 'loadProfile', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadProfile',
        e,
      });
    }
  };

  setLoadingOff = () => {
    const { isLoadingAccountsAndLoans } = this.state;
    if (!isLoadingAccountsAndLoans) {
      this.setState({ isLoading: false });
    }
  };

  goToServicePayments = () => {
    this.props.navigation.navigate('PaymentsServicesChooseCategory');
  };

  goToServicePaymentsWeb = async () => {
    try {
      await Linking.openURL(Config.settings.servicePaymentsUrl);
    } catch (e) {
      Log.debug(TAG, 'goToServicePaymentsWeb', e);
    }
  };

  render() {
    const { navigation, isFocused } = this.props;
    const {
      isLoading,
      accounts,
      loans,
      isBetweenOfficeHours,
      user,

    } = this.state;
    const hasAccounts = accounts && accounts.length > 0;
    const isAllowedNewAccount = Validate.isAllowedNewAccount();
    return (
      <Container>
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
              {!hasAccounts && !!user && (
                <NewAccountFlashMessage
                  user={user}
                  navigation={navigation}
                  title={L.paymentsscreen_flashmessage_title}
                  message={
                    <Text>
                      {isAllowedNewAccount
                        ? L.paymentsscreen_flashmessage_message_newaccount
                        : L.paymentsscreen_flashmessage_message}
                    </Text>
                  }
                  styleColor={styles.colorFlashMessage}
                  typeColor={'primaryLight'}
                />
              )}
              {Features.isAllowedTo('PaymentsLoans') && (
                <Panel
                  accessibilityLabel={'paymentsscreen_panel_my_loans'}
                  title={L.paymentsscreen_panel_my_loans}
                >
                  <PaymentsTypes
                    accessibilityLabel={'paymentsscreen_paymentstypes'}
                    navigation={navigation}
                    accounts={accounts}
                    loans={loans}
                    isBetweenOfficeHours={isBetweenOfficeHours}
                    isFocused={isFocused}
                    user={user}
                  />
                </Panel>
              )}

              {(Features.isAllowedTo('PaymentsServices') ||
                Features.isAllowedTo('PaymentsServicesWeb')) && (
                  <Panel
                    accessibilityLabel={'paymentsscreen_panel_other_payments'}
                    title={L.paymentsscreen_panel_other_payments}
                    style={styles.otherPaymentsPanelStyle}
                  >
                    {Features.isAllowedTo('PaymentsServices') && (
                      <TypesItem
                        style={styles.otherTypesItem}
                        accessibilityLabel={
                          'paymentstypes_typesitem_go_to_pay_my_services'
                        }
                        title={L.paymentstypes_typesitem_go_to_pay_my_services}
                        onPress={this.goToServicePayments}
                        enabled={hasAccounts}
                        last
                        active
                      />
                    )}
                    {Features.isAllowedTo('PaymentsServicesWeb') && (
                      <TypesItem
                        style={styles.otherTypesItem}
                        accessibilityLabel={
                          'paymentstypes_typesitem_go_to_pay_my_services'
                        }
                        title={L.paymentstypes_typesitem_go_to_pay_my_services}
                        onPress={this.goToServicePaymentsWeb}
                        enabled={hasAccounts}
                        last
                      >
                        <Button
                          small
                          accessibilityLabel={
                            'paymentstypes_typesitem_go_to_pay_my_services_go_to_web'
                          }
                          title={L.paymentstypes_button_go_to_web}
                          disabled={!hasAccounts}
                        />

                      </TypesItem>
                    )}
                  </Panel>
                )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <LoadingOverlay isLoading={isLoading} />
      </Container>
    );
  }
}

export type PaymentsScreenType = PaymentsScreen;
export default withFocused<PaymentsScreen, Props>(PaymentsScreen);
