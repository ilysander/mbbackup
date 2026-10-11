import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
  InteractionManager,
  Text,
  View,
} from 'react-native';
import {
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  NetworkStatusAlert,
  Panel,
  ItemSelector,
  Button,
  FormSteps,
  CardView,
  InfoMessage,
} from '../../../../components/ui';
import { L } from '../../../../resources/language';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import { Size } from '../../../../resources/dimensions';
import { Font, Validate } from '../../../../resources/functions';
import {
  LoansItem,
  LoanPostponementPreviewResponse,
} from '../../../../api/backend/response/Execute';
import ResumeAccountReschedule from '../../../../components/loans/ResumeAccountReschedule';
import { Loan, Colors, ErrorRequest } from '../../../../resources/constants';
import API from '../../../../api';
import { Log } from '../../../../resources/log';
import { Emitter } from '../../../../resources/listeners';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import { Amount } from '../../../../resources/money';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const moment = require('moment');

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 10,
    marginTop: 10,
  } as ViewStyle,
  content: {
    marginTop: 10,
  } as ViewStyle,
  cardSelector: {
    padding: 20,
  } as ViewStyle,
  buttonCalculate: {
    marginBottom: 30,
    paddingVertical: 10,
  } as ViewStyle,
  titleButton: {
    fontSize: 16,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  subtitleModal: {
    marginTop: 8,
  } as TextStyle,
  buttonReschedule: {
    marginVertical: 30,
  } as ViewStyle,
  cardCalculation: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 8,
  } as ViewStyle,
  textTitleCalculation: {
    color: Colors.primary,
    fontSize: 18,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  textNewFeeCalculation: {
    color: Colors.primary,
    fontSize: 26,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  textDetailCalculation: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  textDetailTceaCalculation: {
    color: Colors.grey6,
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
  textOldFeeCalculation: {
    color: Colors.primaryLight,
    ...Font({ weight: 'Bold', style: 'Italic' }),
  } as TextStyle,
  infoMessage: {
    marginBottom: 20,
    backgroundColor: Colors.white,
  } as ViewStyle,
  titleLinkDescription: {
    fontSize: 13,
    lineHeight: 15,
    color: Colors.primaryLight,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  oldFee: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  } as ViewStyle,
  titlePanel: {
    fontSize: 18,
    lineHeight: 22,
  } as TextStyle,
  subtitlePanel: {
    fontSize: 13,
    lineHeight: 15,
    marginTop: 5,
    marginBottom: 10,
  } as TextStyle,
});

export interface NavigationParams {
  loan: LoansItem;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  loan?: LoansItem;
  periodGraceIndex: number;
  termIndex: number;
  isValid: boolean;
  isCalculateFee: boolean;
  isLoading: boolean;
  isLoadingCalculateFee: boolean;
  feeCalculated: number;
  tceaCalculated: number;
  datePayCalculated: string;
  currencyCalculated: number;
  amountLoanCalculated: string;
  periodGraceCalculated: number;
  termCalculated: number;
}

const TAG = '[LoansRescheduleConfirmScreen]';
class LoansRescheduleConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.loansrescheduleconfirmscreen_title,
  // };

  state: State = {
    periodGraceIndex: 0,
    termIndex: 0,
    isValid: false,
    isCalculateFee: false,
    isLoading: false,
    isLoadingCalculateFee: false,
    feeCalculated: 0,
    tceaCalculated: 0,
    datePayCalculated: '',
    currencyCalculated: 0,
    amountLoanCalculated: '',
    periodGraceCalculated: 0,
    termCalculated: 0,
  };

  scroll!: ScrollView | null;

  componentDidMount() {
    const { route } = this.props;
    const loan = route.params && route.params.loan;

    this.setState({ loan });
  }

  onSelectPeriodGrace = (index: number) => {
    this.setState({ periodGraceIndex: index, isCalculateFee: false }, () => {
      this.isValidItemSelected();
    });
  };

  onSelectTerm = (index: number) => {
    this.setState({ termIndex: index, isCalculateFee: false }, () => {
      this.isValidItemSelected();
    });
  };

  isValidItemSelected = () => {
    const { periodGraceIndex, termIndex } = this.state;

    this.setState({
      isValid: periodGraceIndex === 0 && termIndex === 0 ? false : true,
    });
  };

  scrollToEnd = () => {
    InteractionManager.runAfterInteractions(() => {
      this.scroll && this.scroll.scrollToEnd();
    });
  };

  calculateFee = async () => {
    const { periodGraceIndex, termIndex } = this.state;
    const { route } = this.props;
    const loan = route.params && route.params.loan;

    this.setState({ isLoadingCalculateFee: true });

    try {
      const termCalculated =
        loan.totalFees - loan.paidFees + Loan.Terms[termIndex].quantity;
      const response = await API.Execute.requestLoanPostponementPreview({
        sendOTP: false,
        amount: 0,
        term: termCalculated,
        payday: 0,
        currency: parseInt(loan.currency, 10),
        grace: {
          period: Loan.PeriodsGrace[periodGraceIndex].quantity,
          type: 'H',
        },
        reschedule: {
          loansId: loan.idProduct,
          type: 19,
          monthsadd: Loan.Terms[termIndex].quantity,
          freezequotas: 0,
        },
        documents: {
          delivery: {
            type: 0,
            destination: '',
          },
        },
      });
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const data = response.body.data as LoanPostponementPreviewResponse;

        const { fee, tcea, currency } = data;
        this.setState(
          {
            currencyCalculated: currency.id,
            feeCalculated: fee.amount,
            tceaCalculated: tcea,
            datePayCalculated: fee.expirationdate,
            isLoadingCalculateFee: false,
            isCalculateFee: true,
          },
          () => {
            this.scrollToEnd();
          }
        );
        return;
      }
      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.NO_FIELD) {
        hasError = true;
      }
      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      this.setState({ isLoadingCalculateFee: false, isCalculateFee: false });
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
      this.setState({ isLoadingCalculateFee: false, isCalculateFee: false });
    }
  };

  goToVerify = async () => {
    const { periodGraceIndex, termIndex } = this.state;
    const { navigation, route } = this.props;
    const loan = route.params && route.params.loan;

    this.setState({ isLoading: true });

    try {
      const termCalculated =
        loan.totalFees - loan.paidFees + Loan.Terms[termIndex].quantity;
      const response = await API.Execute.requestLoanPostponementPreview({
        sendOTP: true,
        amount: 0,
        term: termCalculated,
        payday: 0,
        currency: parseInt(loan.currency, 10),
        grace: {
          period: Loan.PeriodsGrace[periodGraceIndex].quantity,
          type: 'H',
        },
        reschedule: {
          loansId: loan.idProduct,
          type: 19,
          monthsadd: Loan.Terms[termIndex].quantity,
          freezequotas: 0,
        },
        documents: {
          delivery: {
            type: 0,
            destination: '',
          },
        },
      });
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const data = response.body.data as LoanPostponementPreviewResponse;
        const { fee, tcea, currency, grace, reschedule, operation } = data;
        const requesttotalamount = !!reschedule.loans?.length
          ? reschedule.loans[0].requesttotalamount
          : 0;
        const numberLoan = !!reschedule.loans?.length
          ? reschedule.loans[0].id
          : 0;

        this.setState({ isLoading: false });
        navigation.navigate('LoansRescheduleVerify', {
          loan,
          numberLoan,
          amountLoan: requesttotalamount,
          fee: fee.amount,
          tcea,
          periodGrace: grace.period,
          term: reschedule.monthsadd,
          datePay: fee.expirationdate,
          currency: currency.id,
          operationNumber: operation.number,
          operationDate: operation.date,
        });
        return;
      }
      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.NO_FIELD) {
        hasError = true;
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      }
      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      this.setState({ isLoading: false });
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isFocused, navigation, route } = this.props;
    const {
      loan,
      periodGraceIndex,
      termIndex,
      isValid,
      isCalculateFee,
      feeCalculated,
      tceaCalculated,
      datePayCalculated,
      currencyCalculated,
      isLoadingCalculateFee,
      isLoading,
    } = this.state;
    // const loanFee = navigation.getParam('loan');
    const loanFee = route.params && route.params.loan;

    const date = moment(
      datePayCalculated,
      L.loansrescheduleconfirmscreen_input_format_date
    )
      .format(L.loansrescheduleconfirmscreen_output_format_date)
      .toLowerCase();
    const { fees } = loanFee;
    const fee = !!fees?.length ? fees[0].amount : 0;

    return (
      <Container>
        <FormSteps total={4} current={2} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
          ref={ref => {
            this.scroll = ref;
          }}
        >
          <SafeAreaView>
            {!!loan && (
              <ResumeAccountReschedule
                accessibilityLabel={'loanrescheduleconfirmscreen_resume'}
                account={loan}
                navigation={navigation}
              />
            )}
            <Content center vertical style={styles.content}>
              <NetworkStatusAlert style={styles.networkStatus} />
              <InfoMessage
                accessibilityLabel={'loansrescheduleconfirmscreen_infomessage'}
                style={styles.infoMessage}
                typeColor={'primaryLight'}
                isMessage={false}
                isCustomMessage
                customMessage={
                  <View>
                    <Text style={styles.titleLinkDescription}>
                      {L.loansrescheduleconfirmscreen_infomesagge_text1}
                    </Text>
                  </View>
                }
              />
              <Panel
                accessibilityLabel={
                  'loanrescheduleconfirmscreen_add_periodgrace'
                }
                title={L.loansrescheduleconfirmscreen_box_title1}
                titleStyle={styles.titlePanel}
                subtitle={L.loansrescheduleconfirmscreen_box_infomessage1}
                subtitleStyle={styles.subtitlePanel}
                contentStyle={styles.cardSelector}
              >
                <ItemSelector
                  selectedIndex={periodGraceIndex}
                  values={Loan.PeriodsGrace.map(periodGrace => {
                    return `${periodGrace.title}`;
                  })}
                  accessibilityLabel={
                    'loansreschedulemessagescreen_period_item_selector'
                  }
                  title={L.loansrescheduleconfirmscreen_box_items1}
                  onPress={this.onSelectPeriodGrace}
                />
              </Panel>
              <Panel
                accessibilityLabel={'loanrescheduleconfirmscreen_add_term'}
                title={L.loansrescheduleconfirmscreen_box_title2}
                titleStyle={styles.titlePanel}
                subtitle={L.loansrescheduleconfirmscreen_box_infomessage2}
                subtitleStyle={styles.subtitlePanel}
                contentStyle={styles.cardSelector}
              >
                <ItemSelector
                  selectedIndex={termIndex}
                  values={Loan.Terms.map(term => {
                    return `${term.title}`;
                  })}
                  accessibilityLabel={
                    'loansrescheduleconfirmscreen_term_item_selector'
                  }
                  title={L.loansrescheduleconfirmscreen_box_items2}
                  placeholder={L.loansrescheduleconfirmscreen_box_items3}
                  hiddenSubtitle={false}
                  subtitle={`${L.loansrescheduleconfirmscreen_pending_fees
                    }${loanFee.totalFees - loanFee.paidFees}${L.loansrescheduleconfirmscreen_fees_label
                    }`}
                  styleSubtitle={styles.subtitleModal}
                  onPress={this.onSelectTerm}
                />
              </Panel>
              <Button
                disabled={!isValid}
                loading={isLoadingCalculateFee}
                accessibilityLabel={
                  'loansrescheduleconfirmscreen_button_calculate'
                }
                light
                title={L.loansrescheduleconfirmscreen_button}
                onPress={this.calculateFee}
                style={styles.buttonCalculate}
                textStyle={styles.titleButton}
              />
              {isCalculateFee && (
                <>
                  <CardView style={styles.cardCalculation}>
                    <Text style={styles.textTitleCalculation}>
                      {L.loansrescheduleconfirmscreen_card_title}
                    </Text>
                    <Text style={styles.textNewFeeCalculation}>
                      {Amount.format(
                        feeCalculated,
                        currencyCalculated.toString()
                      )}
                    </Text>
                    <Text style={styles.textDetailTceaCalculation}>
                      {L.loansrescheduleconfirmscreen_card_tcea}
                      {tceaCalculated}
                      {'%'}
                    </Text>
                    <Text style={styles.textDetailCalculation}>
                      {L.loansrescheduleconfirmscreen_card_fee}
                      {date}
                    </Text>
                    <View style={styles.oldFee}>
                      <Text style={styles.textOldFeeCalculation}>
                        {L.loansrescheduleconfirmscreen_card_oldfee}
                      </Text>
                      <Text style={styles.textOldFeeCalculation}>
                        {!!loan && Amount.format(fee, loan.currency)}
                      </Text>
                    </View>
                  </CardView>
                  <Button
                    accessibilityLabel={
                      'loansrescheduleconfirmscreen_button_reprogramar'
                    }
                    title={L.loansrescheduleconfirmscreen_button_reschedule}
                    onPress={this.goToVerify}
                    loading={isLoading}
                    textStyle={styles.titleButton}
                    style={styles.buttonReschedule}
                  />
                </>
              )}
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansRescheduleConfirmScreenType = LoansRescheduleConfirmScreen;
export default withFocused<LoansRescheduleConfirmScreen, Props>(
  LoansRescheduleConfirmScreen
);
