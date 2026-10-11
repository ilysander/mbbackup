const moment = require('moment');
import * as React from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import API from '../../../../api';
import { CoreReadTransactionPaymentsOwnLoansResponse } from '../../../../api/backend/response/Execute';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../../components/transactions/ShareReceipt';
import ConfirmationSendingMessage from '../../../../components/transfers/ConfirmationSendingMessage';
import {
  Button,
  CardView,
  Container,
  Content,
  FormSteps,
  KeyboardAvoidingView,
  LoadingOverlay,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
  Header,
} from '../../../../components/ui';
import { Colors } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import ExpandableView from '../../../../components/ui/ExpandableView';
import AddEmailCard from '../../../../components/email/AddEmailCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  marginComponent: {
    marginBottom: 20,
  } as ViewStyle,
  button: {
    paddingVertical: 9,
    alignItems: 'center',
  } as ViewStyle,
  footer: {
    alignItems: 'center',
    marginVertical: 20,
  } as ViewStyle,
  networkStatus: {
    marginBottom: 10,
  } as ViewStyle,
  header: {
    marginTop: 20,
    marginBottom: 20,
  } as ViewStyle,
  content: {
    position: 'relative',
  } as ViewStyle,
  loadingOverlay: {
    backgroundColor: Colors.grey1,
  } as ViewStyle,
  happyHeaderContainer: {
    paddingTop: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 2,
  } as ViewStyle,
  headerContainer: {
    paddingTop: 50,
  } as ViewStyle,
  contentMain: {
    paddingTop: 0,
  } as ViewStyle,
  buttons: {
    marginBottom: 40,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
  } as TextStyle,
  textItem: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
  textItemBold: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,

  marginToggle: {
    marginTop: 10,
  } as ViewStyle,
  marginExpandableView: {
    marginHorizontal: 0,
  } as ViewStyle,
  detailsContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  } as ViewStyle,
  detailsMargin: {
    marginBottom: 10,
  } as ViewStyle,
});

const TAG = '[PaymentsThirdPartiesSuccessScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  resume: any;
  loan: any;
  isExpandedView: boolean;
}

class PaymentsThirdPartiesSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  state: State = {
    isLoading: false,
    resume: {},
    loan: {},
    isExpandedView: false,
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
    this.goToPaymentsHome();
    return true;
  };
  goToPaymentsHome = () => {
    const { navigation } = this.props;
    navigation.navigate('PaymentsHome');
  };
  updateMail = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  share = () => {
    this.shareView &&
      this.shareView.shareConstance(
        L.paymentsthirdpartiessuccessscreen_shareconstance_email_title
      );
  };
  tooltipAction = () => {
    return true;
  };

  load = async () => {
    const { route } = this.props;


    let resume = route.params && route.params.resume;
    const idTransaction = route.params && route.params.idTransaction;
    const loan = route.params && route.params.loan;
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionPaymentsOwnLoansResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { data } = response.body.data.transaction;
      resume = {
        ...resume,
        capital: data.capital,
        interest: data.interest,
        overdue: data.overdue,
        debitAmount: data.debitAmount,
        currency: data.creditCurrency,
        operationNumber: `${data.operationNumber}`,
        itf: data.itf,
        date: data.date,
        userEmail: data.userEmail,
        originLabel: data.debitAccountLabel,
        targetLabel: data.loanLabel,
      };
      this.setState({ resume, loan, isLoading: false });
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
  checkLoanAmount = (loanAmount: any) => {
    return !!(loanAmount && loanAmount.quantity && loanAmount.currency);
  };
  generateDataReceipt = () => {
    const { route } = this.props;
    const { resume } = this.state;

    // const origin = navigation.getParam('origin');
    // const resumeParam = navigation.getParam('resume');


    const origin = route.params && route.params.origin;
    const resumeParam = route.params && route.params.resume;


    const {
      creditAccountHolder,
      date,
      capital,
      interest = 0,
      overdue = 0,
      operationNumber,
      itf = 0,
      otherAmountWithoutEECC = 0,
      eeccAmount = 0,
      loanAmount,
    } = resume;
    let amountFormatted = '';
    let loanCurrency = '';
    if (this.checkLoanAmount(loanAmount)) {
      amountFormatted = Amount.format(loanAmount.quantity, loanAmount.currency);
      loanCurrency = loanAmount.currency;
    }
    const capitalFormatted = Validate.formatAmount(capital, loanCurrency);
    const itfFormatted = Validate.formatAmount(itf, loanCurrency);
    const overdueFormatted = Validate.formatAmount(overdue, loanCurrency);
    const interestFormatted = Validate.formatAmount(interest, loanCurrency);
    const otherFormatted = Validate.formatAmount(
      otherAmountWithoutEECC,
      loanCurrency
    );
    const eeccAmountLabel = Validate.formatAmount(eeccAmount, loanCurrency);
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
    const loanResume = resumeParam.loan.replace(', ', ' (').concat(')');

    const content: ShareReceiptItem[] = [
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_debitamount,
        details: [amountFormatted],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_source_account,
        details: [originLabel],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_loan_number,
        details: [loanResume],
      },

      {
        title: L.paymentsthirdpartiessuccessscreen_detail_loan_owner,
        details: [Sanitizer.titleCase(creditAccountHolder)],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_capital_label,
        details: [capitalFormatted.valueFormatted],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_interest_label,
        details: [interestFormatted.valueFormatted],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_overdue_label,
        details: [overdueFormatted.valueFormatted],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_bankingstatus,
        details: [eeccAmountLabel.valueFormatted],
      },

      {
        title: L.paymentsthirdpartiessuccessscreen_detail_itf_label,
        details: [itfFormatted.valueFormatted],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_other_label,
        details: [otherFormatted.valueFormatted],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_transaction_number,
        details: [operationNumber],
      },
      {
        title: L.paymentsthirdpartiessuccessscreen_detail_date,
        details: [
          moment(
            date,
            L.paymentsthirdpartiessuccessscreen_detail_date_input_format
          ).format(
            L.paymentsthirdpartiessuccessscreen_detail_date_output_format
          ),
        ],
      },
    ];
    return content;
  };

  finish = async () => {
    const { navigation } = this.props;
    navigation.popToTop();
  };

  onExpandedToggle = (isExpandedView: boolean) => {
    this.setState({ isExpandedView });
  };

  render() {
    const { isFocused, navigation } = this.props;
    const { isLoading, resume, isExpandedView } = this.state;
    const content = this.generateDataReceipt();

    const contentVisible: ShareReceiptItem[] = [];
    const contentExpanded: ShareReceiptItem[] = [];

    content.forEach((row, index) => {
      contentVisible.push(row);
      if (!(3 < index && index < 10)) {
        contentExpanded.push(row);
      }
    });

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
            <Content style={styles.contentMain}>
              <View style={styles.headerContainer}>
                <NetworkStatusAlert style={styles.networkStatus} />
              </View>

              <View style={styles.content}>
                <LoadingOverlay
                  isLoading={isLoading}
                  duration={isLoading ? 0 : 200}
                  style={styles.loadingOverlay}
                />
                <View style={isLoading && { opacity: 0 }}>
                  <CardView
                    accessibilityLabel={
                      'paymentsthirdpartiessuccessscreen_cardview'
                    }
                    style={styles.marginComponent}
                  >
                    <Image
                      resizeMode={'stretch'}
                      style={{
                        width: '80%',
                        height: 32,
                        alignSelf: 'center',
                      }}
                      source={require('../../../../assets/images/flags-large.png')}
                    />
                    <Header
                      title={L.paymentsthirdpartiessuccessscreen_header}
                      center
                      accessibilityLabel={
                        'paymentsthirdpartiessuccessscreen_header'
                      }
                      style={styles.header}
                    />
                    <View style={styles.detailsContent}>
                      {isExpandedView
                        ? contentVisible.map(row => {
                          if (!row || !row.title || !row.details[0]) {
                            return;
                          }
                          return (
                            <View style={styles.detailsMargin}>
                              <Text style={styles.textItem}>{row.title}</Text>
                              <Text style={styles.textItemBold}>
                                {row.details}
                              </Text>
                            </View>
                          );
                        })
                        : contentExpanded.map(row => {
                          if (!row || !row.title || !row.details[0]) {
                            return;
                          }
                          return (
                            <View style={styles.detailsMargin}>
                              <Text style={styles.textItem}>{row.title}</Text>
                              <Text style={styles.textItemBold}>
                                {row.details}
                              </Text>
                            </View>
                          );
                        })}

                      <ExpandableView
                        accessibilityLabel={
                          'paymentsthirdpartiessuccessscreen_expandable_view'
                        }
                        maxHeight={0}
                        toggleContainerStyle={styles.marginToggle}
                        style={styles.marginExpandableView}
                        onToggle={this.onExpandedToggle}
                      />
                    </View>
                  </CardView>

                  {!resume.userEmail && (
                    <AddEmailCard
                      navigation={navigation}
                      accessibilityLabel={
                        'paymentsthirdpartiessuccessscreen_ademailcard'
                      }
                    />
                  )}

                  {!!resume.userEmail && (
                    <View style={styles.marginComponent}>
                      <ConfirmationSendingMessage
                        userEmail={resume.userEmail}
                        onPress={this.updateMail}
                      />
                    </View>
                  )}

                  <View style={styles.buttons}>
                    <SpacedView vertical>
                      <Button
                        textStyle={styles.buttonText}
                        style={styles.button}
                        typeColor={'primary'}
                        light
                        accessibilityLabel={
                          'paymentsthirdpartiessuccessscreen_button_share'
                        }
                        onPress={this.share}
                        title={L.paymentsthirdpartiessuccessscreen_button_share}
                      />
                      <Button
                        style={styles.button}
                        textStyle={styles.buttonText}
                        typeColor={'primary'}
                        accessibilityLabel={
                          'paymentsthirdpartiessuccessscreen_button_finish'
                        }
                        onPress={this.finish}
                        title={
                          L.paymentsthirdpartiessuccessscreen_button_finish
                        }
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
              title={L.paymentsthirdpartiessuccessscreen_shareconstance_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsThirdPartiesSuccessScreenType = PaymentsThirdPartiesSuccessScreen;
export default withFocused<PaymentsThirdPartiesSuccessScreen, Props>(
  PaymentsThirdPartiesSuccessScreen
);
