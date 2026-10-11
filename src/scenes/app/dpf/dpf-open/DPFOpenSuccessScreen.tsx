import * as React from 'react';
const moment = require('moment');
import { BackHandler, StyleSheet, View, ViewStyle } from 'react-native';
import API from '../../../../api';
import { CoreReadTransactionDPFOpenResponse } from '../../../../api/backend/response/Execute';
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
import {
  Colors,
  TransactionType,
  FrequencyDeposit,
} from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Sanitizer, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../../components/transactions/ShareReceipt';
import { Amount } from '../../../../resources/money';
import { AlertEvent } from '../../../../components/alert/AlertManager';
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
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
});

const TAG = '[DPFOpenSuccessScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  resume: any;
}

class DPFOpenSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.dpfopensuccessscreen_title,
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
        L.dpfopensuccessscreen_shareconstance_title
      );
  };
  goToProfile = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  load = async () => {
    const { route } = this.props;

    let resume = route.params && route.params.resume;
    const idTransaction = route.params && route.params.idTransaction;
    const frequentContactName = route.params && route.params.frequentContactName;
    const origin = route.params && route.params.origin;
    const target = route.params && route.params.target;

    Emitter.emit('onClearDPFForm');
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
    const targetLabel = Sanitizer.getAccountFormattedFromLabel(
      target.shortLabel,
      target.number
    );
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionDPFOpenResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { data } = response.body.data.transaction;
      let frequentContact = '';
      if (frequentContactName) {
        frequentContact = frequentContactName;
      }
      const totalAmount = data.amount.quantity;
      resume = {
        ...resume,
        isSameCurrency: true,
        currencyLabel: resume.debitAccountCurrency,
        amount: data.amount.quantity,
        currency: data.amount.currency,
        transaction: `${data.operationNumber}`,
        date: data.date,
        userEmail: data.userEmail,
        creditAccountLabel: originLabel,
        debitAccountLabel: targetLabel,
        isFrequentContact: data.isFrequentContact,
        itf: data.itf,
        loanCurrency: data.amount.currency,
        totalAmount,
        frequentContact,
        interest: data.interest,
        totalPaymentInterest: data.totalPaymentInterest,
        term: data.termPrimer,
        trea: data.trea,
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
    const {
      term,
      returnDate,
      creditAccountLabel,
      debitAccountLabel,
      trea,
      frequency,
      totalAmount,
      totalPaymentInterest,
    } = resume;
    const termFormatted = `${term} ${L.sharereceiptdpf_period_label.toLowerCase()}`;

    const returnDateFormatted = `${moment(
      returnDate,
      L.sharereceiptdpf_date_of_deposit_format_source
    ).format(L.sharereceiptdpf_date_of_deposit_format)}`;
    const currency = resume.currency;
    const totalAmountObject = Validate.formatAmount(totalAmount, currency);
    const operationNumber = resume.transaction;
    const date = moment(
      resume.date,
      L.sharereceiptdpf_date_format_source
    ).format(L.sharereceiptdpf_date_format);

    const content: ShareReceiptItem[] = [];
    if (typeof totalAmountObject.valueFormatted === 'string') {
      content.push({
        title: L.sharereceiptdpf_total_amount,
        details: [
          totalAmountObject.valueFormatted,
          `${L.sharereceiptdpf_label_trea.toUpperCase()}: ${trea}`,
          `${L.sharereceiptdpf_label_interest}: ${Amount.format(
            totalPaymentInterest,
            currency
          )}`,
        ],
      });
    }
    content.push({
      title: L.sharereceiptdpf_term_of_deposit_label,
      details: [termFormatted],
    });
    content.push({
      title: L.sharereceiptdpf_date_of_deposit_label,
      details: [returnDateFormatted],
    });
    content.push({
      title: L.sharereceiptdpf_frequency_of_deposit_of_interest_label,
      details: [
        FrequencyDeposit.AtTheEnd === frequency
          ? L.sharereceiptdpf_text_frequency_of_deposit_of_interest_label
          : L.sharereceiptdpf_text_frequency_deposit_every_month,
      ],
    });
    content.push({
      title: L.sharereceiptdpf_source_account,
      details: [creditAccountLabel],
    });
    content.push({
      title: L.sharereceiptdpf_target_account,
      details: [debitAccountLabel],
    });
    content.push({
      title: L.sharereceiptdpf_transaction_number,
      details: [operationNumber],
    });
    content.push({
      title: L.sharereceiptdpf_date,
      details: [date],
    });

    return content;
  };

  render() {
    const { isFocused, route } = this.props;
    const { isLoading, resume } = this.state;
    const { frequentContact } = resume;

    const origin = route.params && route.params.origin;
    const content = this.generateDataReceipt();
    return (
      <Container>
        <FormSteps total={4} current={4} />
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
                accessibilityLabel={'dpfopensuccessscreen_subtitle'}
                title={L.dpfopensuccessscreen_subtitle}
              />

              <View style={styles.formContainer}>
                <LoadingOverlay
                  isLoading={isLoading}
                  duration={isLoading ? 0 : 200}
                  style={styles.loadingOverlay}
                />
                <View style={isLoading && { opacity: 0 }}>
                  <TransactionRecord
                    transactionType={TransactionType.DPF}
                    resume={resume}
                    frequentContact={frequentContact}
                    panelTitle={L.dpfopensuccessscreen_panel_title}
                    panelItemTitle={L.dpfopensuccessscreen_panelitem_amount}
                    origin={origin}
                  />
                  <View style={styles.buttons}>
                    <Button
                      accessibilityLabel={'dpfopensuccessscreen_button_share'}
                      onPress={this.share}
                      title={L.dpfopensuccessscreen_button_share}
                    />
                  </View>
                  <View style={styles.footer}>
                    <ConfirmationSendingMessage
                      userEmail={resume.userEmail}
                      onPress={this.goToProfile}
                    />
                  </View>
                </View>
              </View>

              <ShareReceipt
                ref={ref => {
                  this.shareView = ref;
                }}
                title={L.sharereceiptdpf_title}
                content={content}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type DPFOpenSuccessScreenType = DPFOpenSuccessScreen;
export default withFocused<DPFOpenSuccessScreen, Props>(DPFOpenSuccessScreen);
