const moment = require('moment');
import * as React from 'react';
import { BackHandler, StyleSheet, View, ViewStyle } from 'react-native';

import API from '../../../../api';
import { CoreReadTransactionTransfersOtherBanksResponse } from '../../../../api/backend/response/Execute';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
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
import { Colors } from '../../../../resources/constants';
import TransactionType from '../../../../resources/constants/TransactionType';
import { Size } from '../../../../resources/dimensions';
import { Validate, Sanitizer } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../../components/transactions/ShareReceipt';
import AddEmailCard from '../../../../components/email/AddEmailCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
  } as ViewStyle,
  formContainer: {
    position: 'relative',
  } as ViewStyle,
  buttons: {
    marginTop: 20,
    width: '100%',
    alignSelf: 'center',
  } as ViewStyle,
  footer: {
    alignItems: 'center',
    marginTop: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  loadingOverlay: {
    backgroundColor: Colors.grey1,
  } as ViewStyle,
  marginBottom: {
    marginBottom: 20,
  } as ViewStyle,
});

const TAG = '[TransfersOtherBanksSuccessScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  resume: any;
}

class TransfersOtherBanksSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.transfersotheraccountssuccessscreen_title,
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
        L.transfersotheraccountssuccessscreen_shareconstance_title
      );
  };
  goToProfile = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  load = async () => {
    const { navigation, route } = this.props;


    let resume = route.params && route.params.resume;
    const idTransaction = route.params && route.params.idTransaction;
    const frequentContactName = route.params && route.params.frequentContactName;
    const origin = route.params && route.params.origin;


    // let resume = navigation.getParam('resume');
    // const idTransaction = navigation.getParam('idTransaction');
    // const frequentContactName = navigation.getParam('frequentContactName');
    // const origin = navigation.getParam('origin');
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionTransfersOtherBanksResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { data } = response.body.data.transaction;
      let frequentContact = '';
      if (frequentContactName) {
        frequentContact = frequentContactName;
      } else if (data.isFrequentContact) {
        frequentContact = data.frequentContact;
      }
      resume = {
        ...resume,
        isSameCurrency: true,
        currencyLabel: resume.debitAccountCurrency,
        amount: data.amount.quantity,
        currency: data.amount.currency,
        transaction: `${data.operationNumber}`,
        date: data.date,
        userEmail: data.userEmail,
        origin,
        targetLabel: data.destinationAccount,
        mibancoComission: data.mibancoComission,
        interbankComission: data.interbankComission,
        beneficiary: data.beneficiary,
        isFrequentContact: data.isFrequentContact,
        bankName: data.bankName,
        itf: data.itf,
        loanCurrency: data.amount.currency,
        requestedAmount: data.requestedAmount,
        totalAmount: data.totalAmount.quantity,
        frequentContact,
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
  generateDataReceipt = () => {
    const { resume } = this.state;
    const currency = resume.currency;

    const totalAmountObject = Validate.formatAmount(
      resume.totalAmount,
      currency
    );
    const amountObject = Validate.formatAmount(resume.amount, currency);
    const interbankComissionObject = Validate.formatAmount(
      resume.interbankComission,
      currency
    );
    const mibancoComissionObject = Validate.formatAmount(
      resume.mibancoComission,
      currency
    );
    const itfObject = Validate.formatAmount(resume.itf, currency);
    const originLabel = resume.origin
      ? Sanitizer.getAccountFormattedFromLabel(
        resume.origin.shortLabel,
        resume.origin.number
      )
      : '';

    const beneficiaryName = Sanitizer.titleCase(resume.beneficiary);
    const isBeneficiaryOk = !!beneficiaryName;
    const frequentContactName = resume.frequentContact;
    const isFrequentContact = !!frequentContactName;
    const operationNumber = resume.transaction;
    const date = moment(
      resume.date,
      L.sharereceiptotherbanks_date_format_source
    ).format(L.sharereceiptotherbanks_date_format);

    const content: ShareReceiptItem[] = [
      {
        title: L.sharereceiptotherbanks_total_amount,
        details: [
          totalAmountObject.valueFormatted,
          L.sharereceiptotherbanks_transfer_amount +
          ': ' +
          amountObject.valueFormatted,
          L.sharereceiptotherbanks_interbank_commission +
          ': ' +
          interbankComissionObject.valueFormatted,
          L.sharereceiptotherbanks_mibanco_commission +
          ': ' +
          mibancoComissionObject.valueFormatted,
          !itfObject.isEmpty &&
          L.sharereceiptotherbanks_itf + ': ' + itfObject.valueFormatted,
        ],
      },
      {
        title: L.sharereceiptotherbanks_transaction_type,
        details: [L.sharereceiptotherbanks_transaction_type_description],
      },
      {
        title: L.sharereceiptotherbanks_source_account,
        details: [originLabel],
      },
      {
        title: L.sharereceiptotherbanks_target_account,
        details: [resume.bankName, Sanitizer.formatTextCCI(resume.targetLabel)],
      },
    ];

    if (isBeneficiaryOk) {
      content.push({
        title: L.sharereceiptotherbanks_beneficiary,
        details: [beneficiaryName],
      });
    }

    if (isFrequentContact) {
      content.push({
        title: L.sharereceiptotherbanks_frequent_account,
        details: [frequentContactName],
      });
    }

    content.push({
      title: L.sharereceiptotherbanks_transaction_number,
      details: [operationNumber],
    });

    content.push({
      title: L.sharereceiptotherbanks_date,
      details: [date],
    });

    return content;
  };

  render() {
    const { navigation, route, isFocused } = this.props;
    const { isLoading, resume } = this.state;
    const { frequentContact } = resume;
    // const origin = navigation.getParam('origin');
    const origin = route.params && route.params.origin;
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
                accessibilityLabel={
                  'transfersotheraccountssuccessscreen_subtitle'
                }
                title={L.transfersotherbankssuccessscreen_subtitle}
              />
              <View style={styles.formContainer}>
                <LoadingOverlay
                  isLoading={isLoading}
                  duration={isLoading ? 0 : 200}
                  style={styles.loadingOverlay}
                />
                <View style={isLoading && { opacity: 0 }}>
                  <TransactionRecord
                    transactionType={TransactionType.TRANSFEROTHERBANKS}
                    type={L.transfersotherbankssuccessscreen_type}
                    resume={resume}
                    frequentContact={frequentContact}
                    panelTitle={L.transfersotherbankssuccessscreen_panel_title}
                    panelItemTitle={
                      L.transfersotherbankssuccessscreen_panelitem_amount
                    }
                    origin={origin}
                  />
                  {!resume.userEmail ? (
                    <AddEmailCard
                      navigation={navigation}
                      accessibilityLabel={
                        'transfersotherbankssuccessscreen_ademailcard'
                      }
                    />
                  ) : (
                    <View style={styles.footer}>
                      <ConfirmationSendingMessage
                        userEmail={resume.userEmail}
                        onPress={this.goToProfile}
                      />
                    </View>
                  )}
                  <View style={styles.buttons}>
                    <Button
                      accessibilityLabel={
                        'transfersotherbankssuccessscreen_button_share'
                      }
                      onPress={this.share}
                      title={L.transfersotherbankssuccessscreen_button_share}
                      style={styles.marginBottom}
                      medium
                      light
                    />
                    <Button
                      accessibilityLabel={
                        'newaccountsuccessscreen_button_end_title'
                      }
                      onPress={this.goToTransfersMenu}
                      title={L.newaccountsuccessscreen_button_end_title}
                      medium
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
              title={L.sharereceiptotherbanks_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type TransfersOtherBanksSuccessScreenType = TransfersOtherBanksSuccessScreen;
export default withFocused<TransfersOtherBanksSuccessScreen, Props>(
  TransfersOtherBanksSuccessScreen
);
