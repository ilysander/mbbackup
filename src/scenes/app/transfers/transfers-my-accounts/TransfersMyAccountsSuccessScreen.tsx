const moment = require('moment');
import * as React from 'react';
import { BackHandler, StyleSheet, View, ViewStyle } from 'react-native';

import API from '../../../../api';
import { CoreReadTransactionTransfersMyAccountsResponse } from '../../../../api/backend/response/Execute';
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
} from '../../../../components/ui';
import { Colors, Currencies } from '../../../../resources/constants';
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
  formContainer: {
    position: 'relative',
  } as ViewStyle,
  loadingOverlay: {
    backgroundColor: Colors.grey1,
  } as ViewStyle,
  buttons: {
    marginTop: 20,
    width: '100%',
    alignSelf: 'center',
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  footer: {
    alignItems: 'center',
    marginTop: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  marginBottom: {
    marginBottom: 20,
  } as ViewStyle,
});

const TAG = '[TransfersMyAccountsSuccessScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  resume: any;
}

class TransfersMyAccountsSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.transfersmyaccountssuccessscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
  // };

  state: State = {
    isLoading: false,
    resume: {},
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
    this.goToTransfersMenu();
    return true;
  };
  goToTransfersMenu = () => {
    const { navigation } = this.props;
    navigation.navigate('TransfersHome');
  };
  share = () => {
    this.shareView &&
      this.shareView.shareConstance(
        L.transfersmyaccountssuccessscreen_shareconstance_title
      );
  };
  load = async () => {
    const { route } = this.props;
    let resume = route.params && route.params.resume;
    const idTransaction = route.params && route.params.idTransaction;
    // let resume = this.props.navigation.getParam('resume');
    // const idTransaction = this.props.navigation.getParam('idTransaction');
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionTransfersMyAccountsResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { data } = response.body.data.transaction;
      resume = {
        ...resume,
        amount: data.amount.quantity,
        currency: data.amount.currency,
        transaction: `${data.codigoAutorizacion}`,
        date: data.date,
        userEmail: data.userEmail,
        originLabel: data.debitAccountLabel,
        targetLabel: data.destinationAccountLabel,
        typeTransaction: 'TRANSFER',
      };
      this.setState({ resume, isLoading: false });
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

  goToProfile = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };

  generateDataReceipt = () => {
    const { resume } = this.state;
    const type = L.transfersmyaccountssuccessscreen_type;
    const {
      amount,
      currency,
      originLabel,
      targetLabel,
      isSameCurrency,
      debitAmount,
      exchangeRate,
      creditAccountHolder,
      date,
      transaction,
      currencyLabel,
    } = resume;
    const detailsAmount: string[] = [];
    detailsAmount.push(Amount.format(amount, currency));
    if (!isSameCurrency) {
      detailsAmount.push(
        L.shareconstance_purchase_label +
        ': ' +
        Amount.format(exchangeRate, Currencies.PEN.label)
      );
      detailsAmount.push(
        L.shareconstance_sale_label +
        ': ' +
        Amount.format(debitAmount, currencyLabel)
      );
    }

    const content: ShareReceiptItem[] = [
      { title: L.shareconstance_amount, details: detailsAmount },
      { title: L.shareconstance_transaction_type, details: [type] },
      { title: L.shareconstance_source_account, details: [originLabel] },
      {
        title: creditAccountHolder
          ? L.shareconstance_target_account
          : L.shareconstance_target_account_same_holder,
        details: [targetLabel],
      },
      {
        title: L.shareconstance_date,
        details: [
          moment(date, L.shareconstance_date_format_source).format(
            L.shareconstance_date_format
          ),
        ],
      },
      creditAccountHolder && {
        title: L.shareconstance_recipient,
        details: [Sanitizer.titleCase(creditAccountHolder)],
      },
      { title: L.shareconstance_transaction_number, details: [transaction] },
    ];
    return content;
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { isLoading, resume } = this.state;
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
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Header
                center
                style={styles.header}
                accessibilityLabel={'transfersmyaccountssuccessscreen_subtitle'}
                title={L.transfersmyaccountssuccessscreen_subtitle}
              />
              <View style={styles.formContainer}>
                <LoadingOverlay
                  isLoading={isLoading}
                  duration={isLoading ? 0 : 200}
                  style={styles.loadingOverlay}
                />
                <View style={isLoading && { opacity: 0 }}>
                  <TransactionRecord
                    type={L.transfersmyaccountssuccessscreen_type}
                    resume={resume}
                    panelTitle={L.transfersmyaccountssuccessscreen_panel_title}
                    panelItemTitle={
                      L.transfersmyaccountssuccessscreen_panelitem_amount
                    }
                  />
                  {!resume.userEmail && (
                    <AddEmailCard
                      navigation={navigation}
                      accessibilityLabel={
                        'transfersmyaccountssuccessscreen_ademailcard'
                      }
                    />
                  )}
                  <View style={styles.footer}>
                    <ConfirmationSendingMessage
                      userEmail={resume.userEmail}
                      onPress={this.goToProfile}
                    />
                  </View>

                  <View style={styles.buttons}>
                    <Button
                      accessibilityLabel={
                        'transfersmyaccountssuccessscreen_button_share'
                      }
                      onPress={this.share}
                      title={L.transfersmyaccountssuccessscreen_button_share}
                      light
                      style={styles.marginBottom}
                    />
                    <Button
                      accessibilityLabel={
                        'newaccountsuccessscreen_button_end_title'
                      }
                      onPress={this.goToTransfersMenu}
                      title={L.newaccountsuccessscreen_button_end_title}
                      style={styles.marginBottom}
                    />
                  </View>
                </View>
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={L.shareconstance_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type TransfersMyAccountsSuccessScreenType = TransfersMyAccountsSuccessScreen;
export default withFocused<TransfersMyAccountsSuccessScreen, Props>(
  TransfersMyAccountsSuccessScreen
);
