const moment = require('moment');
import * as React from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import API from '../../../../api';
import {
  CoreReadTransactionPaymentsServicesResponse,
  AccountItemSavingsAll,
} from '../../../../api/backend/response/Execute';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import TransactionRecord from '../../../../components/transactions/TransactionRecord';
import {
  Button,
  Container,
  Content,
  FormSteps,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
} from '../../../../components/ui';
import { Colors } from '../../../../resources/constants';
import TransactionType from '../../../../resources/constants/TransactionType';
import { Size } from '../../../../resources/dimensions';
import { Validate, Sanitizer } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import ConfirmationSendingMessage from '../../../../components/transfers/ConfirmationSendingMessage';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../../components/transactions/ShareReceipt';
import AddEmailCard from '../../../../components/email/AddEmailCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
  } as ViewStyle,
  formSteps: {
    marginBottom: 10,
  } as ViewStyle,
  formContainer: {
    marginVertical: 20,
    position: 'relative',
  } as ViewStyle,
  buttons: {
    marginTop: 20,
    marginBottom: 40,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  loadingOverlay: {
    backgroundColor: Colors.grey1,
  } as ViewStyle,
  content: {
    marginTop: 10,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
  } as TextStyle,
  button: {
    paddingVertical: 9,
    alignItems: 'center',
  } as ViewStyle,
});

const TAG = '[PaymentsServicesSuccessScreen]';

export interface NavigationParams {
  idTransaction: string;
  origin: AccountItemSavingsAll;
  supplyLabel: string;
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isLoadingMovements: boolean;
  resume: any;
  origin?: AccountItemSavingsAll;
}

class PaymentsServicesSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {


  state: State = {
    isLoading: false,
    isLoadingMovements: false,
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
    this.goToPaymentsMenu();
    return true;
  };

  goToPaymentsMenu = () => {
    const { navigation } = this.props;
    navigation.navigate('PaymentsHome');
  };

  finish = async () => {
    const { navigation } = this.props;
    navigation.popToTop();
  };

  loadResumeAccount = async () => {
    const { origin } = this.state;
    try {
      if (!origin) {
        return;
      }
      const response = await API.Execute.accountsRead(origin.idProduct);
      const originUpdate = response.body.data.account;
      return originUpdate;
    } catch (e) {
      Log.exception(TAG, 'loadResumeAccount', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadResumeAccount',
        e,
      });
    }
    return;
  };

  share = () => {
    this.shareView &&
      this.shareView.shareConstance(
        L.paymentsservicessuccessscreen_sharereceipt_title
      );
  };

  load = async () => {
    const { route } = this.props;
    const idTransaction = route.params && route.params.idTransaction;
    const supplyLabel = route.params && route.params.supplyLabel;
    const origin = route.params && route.params.origin;

    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionPaymentsServicesResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { transaction } = response.body.data;
      const resume = {
        ...transaction.data,
        supplyLabel: Sanitizer.titleCase(supplyLabel),
        amount: transaction.data.totalAmount,
        clientName: transaction.data.billSelector.clientName,
        companyName: transaction.data.billSelector.companyName,
        clientCode: `${transaction.data.billSelector.clientCode}`,
        ticketNumber: `${transaction.data.billSelector.ticketNumber}`,
        date: transaction.submitDateTime,
        operationNumberPayment: transaction.data.operationNumberPayment,
        operationNumberTopaz: transaction.data.operationNumberTopaz,
      };
      this.setState({ resume, origin, isLoading: false });
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
    const { resume, origin } = this.state;

    const originLabel = origin
      ? Sanitizer.getAccountFormattedFromLabel(origin.shortLabel, origin.number)
      : '';

    const date = moment(
      resume.date,
      L.paymentsservicessuccessscreen_sharereceipt_date_input_format
    ).format(L.paymentsservicessuccessscreen_sharereceipt_date_output_format);

    const content: ShareReceiptItem[] = [
      {
        title: L.paymentsservicessuccessscreen_sharereceipt_amount,
        details: [resume.amount],
      },
      {
        title: L.paymentsservicessuccessscreen_sharereceipt_origin_account,
        details: [originLabel],
      },
      {
        title: L.paymentsservicessuccessscreen_sharereceipt_bill_owner,
        details: [resume.clientName],
      },
      {
        title: L.paymentsservicessuccessscreen_sharereceipt_company,
        details: [resume.companyName],
      },
      {
        title:
          L.paymentsservicessuccessscreen_sharereceipt_client_code +
          ' ' +
          resume.supplyLabel,
        details: [resume.clientCode],
      },
      {
        title: L.paymentsservicessuccessscreen_sharereceipt_ticket_number,
        details: [resume.ticketNumber],
      },
      {
        title: L.paymentsservicessuccessscreen_sharereceipt_date,
        details: [date],
      },
      {
        title:
          L.paymentsservicessuccessscreen_sharereceipt_transaction_number_company +
          ' ' +
          Sanitizer.titleCase(resume.companyName),
        details: [resume.operationNumberPayment],
      },
      {
        title:
          L.paymentsservicessuccessscreen_sharereceipt_transaction_number_bank,
        details: [resume.operationNumberTopaz],
      },
    ];

    return content;
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { isLoading, resume, origin } = this.state;
    const content = this.generateDataReceipt();
    return (
      <Container>
        <FormSteps total={4} current={4} style={styles.formSteps} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
          scrollEventThrottle={100}
        >
          <SafeAreaView>
            <Content style={styles.content}>
              <NetworkStatusAlert style={styles.networkStatus} />

              <View style={styles.formContainer}>
                <LoadingOverlay
                  isLoading={isLoading}
                  duration={isLoading ? 0 : 200}
                  style={styles.loadingOverlay}
                />
                <View style={isLoading && { opacity: 0 }}>
                  {origin && (
                    <TransactionRecord
                      panelTitle={L.paymentsservicessuccessscreen_subtitle}
                      transactionType={TransactionType.PAYMENTSERVICES}
                      resume={resume}
                      origin={origin}
                    />
                  )}
                  {!resume.userEmail && (
                    <AddEmailCard
                      navigation={navigation}
                      accessibilityLabel={
                        'paymentsservicessuccessscreen_ademailcard'
                      }
                    />
                  )}
                  <ConfirmationSendingMessage
                    userEmail={resume.userEmail}
                    style={{ marginTop: 20 }}
                  />
                  <View style={styles.buttons}>
                    <SpacedView vertical>
                      <Button
                        textStyle={styles.buttonText}
                        style={styles.button}
                        typeColor={'primary'}
                        light
                        accessibilityLabel={
                          'paymentsservicessuccessscreen_button_share'
                        }
                        onPress={this.share}
                        title={L.paymentsservicessuccessscreen_button_share}
                      />
                      <Button
                        style={styles.button}
                        textStyle={styles.buttonText}
                        typeColor={'primary'}
                        accessibilityLabel={
                          'paymentsservicessuccessscreen_button_movements'
                        }
                        onPress={this.finish}
                        title={L.paymentsservicessuccessscreen_button_movements}
                      />
                    </SpacedView>
                  </View>
                </View>
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={L.paymentsservicessuccessscreen_sharereceipt_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsServicesSuccessScreenType = PaymentsServicesSuccessScreen;
export default withFocused<PaymentsServicesSuccessScreen, Props>(
  PaymentsServicesSuccessScreen
);
