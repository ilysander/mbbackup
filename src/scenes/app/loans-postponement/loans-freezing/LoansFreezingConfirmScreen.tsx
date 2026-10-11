import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  NetworkStatusAlert,
  Separator,
  Button,
  FormSteps,
  CardView,
  Header,
  InfoMessage,
} from '../../../../components/ui';
import { L } from '../../../../resources/language';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import { Size } from '../../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../../resources/functions';
import {
  LoansItem,
  LoansItemFeeComplete,
  LoanPostponementPreviewResponse,
} from '../../../../api/backend/response/Execute';
import { Colors, ErrorRequest } from '../../../../resources/constants';
import { Amount } from '../../../../resources/money';
import API from '../../../../api';
import { Log } from '../../../../resources/log';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import { Emitter } from '../../../../resources/listeners';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 10,
    marginTop: 10,
  } as ViewStyle,
  cardView: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  titleButton: {
    fontSize: 16,
  } as TextStyle,
  buttonFreezing: {
    marginTop: 10,
    marginBottom: 30,
  } as ViewStyle,
  titleLoanCard: {
    fontSize: 13,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  textAmountLoanCard: {
    fontSize: 18,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  textMonthFreezing: {
    fontSize: 16,
    color: Colors.primaryLight,
    textAlign: 'center',
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  textBoldCard: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  separator: {
    marginVertical: 8,
    backgroundColor: Colors.white,
  } as ViewStyle,
  header: {
    marginTop: 32,
    marginBottom: 20,
  } as ViewStyle,
  infoMessage: {
    marginBottom: 20,
    backgroundColor: Colors.white,
  } as ViewStyle,
  textInfo: {
    fontSize: 13,
    lineHeight: 15,
    color: Colors.primaryLight,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  textInfoBold: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  textInfoSpace: {
    marginTop: 8,
  } as TextStyle,
  viewCustomInfo: {
    marginLeft: 4,
  } as ViewStyle,
  headeMain: {
    fontSize: 16,
  } as TextStyle,
  containerBody: {
    flex: 1,
  } as ViewStyle,
});

export interface NavigationParams {
  loan: LoansItem;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  loan?: LoansItem;
  feesFreezing: LoansItemFeeComplete[];
  isLoading: boolean;
}

const NRO_FEES = '<<NRO_FEES>>';
const TEXT_FEES = '<<TEXT_FEES>>';
const TAG = '[LoansFreezingConfirmScreen]';
class LoansFreezingConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.loansfreezingconfirmscreen_title,
  //   header: (props: HeaderProps) => {
  //     return <HeaderMain styleTitle={styles.headeMain} {...props} />;
  //   },
  // };

  scroll!: ScrollView | null;

  state: State = {
    feesFreezing: [],
    isLoading: false,
  };

  componentDidMount() {
    const { route } = this.props;
    const loan = route.params && route.params.loan;//navigation.getParam('loan');
    const feesFreezing = Validate.calculateFeesLoanPostponement(loan);
    this.setState({ loan, feesFreezing });
  }

  goToVerify = async () => {
    const { feesFreezing } = this.state;
    const { navigation, route } = this.props;
    const loan = route.params && route.params.loan

    this.setState({ isLoading: true });

    try {
      const feesFreezingCalculated = !!feesFreezing.length
        ? feesFreezing.length
        : 0;
      const response = await API.Execute.requestLoanPostponementPreview({
        sendOTP: true,
        amount: 0,
        term: feesFreezingCalculated,
        payday: 0,
        currency: parseInt(loan.currency, 10),
        grace: {
          period: 0,
          type: 'N',
        },
        reschedule: {
          loansId: loan.idProduct,
          type: 20,
          monthsadd: 0,
          freezequotas: feesFreezingCalculated,
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
        const { tcea, currency, reschedule, operation } = data;
        const numberLoan = !!reschedule.loans?.length
          ? reschedule.loans[0].id
          : 0;
        const numberCredit = !!reschedule.loans?.length
          ? reschedule.loans[0].number
          : 0;

        this.setState({ isLoading: false });
        navigation.navigate('LoansFreezingCodeVerify', {
          loan,
          feesFreezing,
          numberLoan,
          numberCredit,
          tcea,
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
    const { isFocused, route } = this.props;
    const { feesFreezing, isLoading } = this.state;
    const loan = route.params && route.params.loan;

    const nroFeeFreezing = feesFreezing.length;

    const textNroFeeCalculated = L.loansfreezingconfirmscreen_header_title.replace(
      NRO_FEES,
      nroFeeFreezing + ''
    );
    const textFeeCalculated = textNroFeeCalculated.replace(
      TEXT_FEES,
      nroFeeFreezing > 1
        ? L.loansfreezingconfirmscreen_title_plural_fee
        : L.loansfreezingconfirmscreen_title_singular_fee
    );

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
            <Content vertical>
              <NetworkStatusAlert style={styles.networkStatus} />
              <View style={styles.containerBody}>
                <Header
                  accessibilityLabel={'loansfreezingConfirmscreen_header'}
                  title={textFeeCalculated}
                  center
                  style={styles.header}
                />
                <CardView
                  accessibilityLabel={'loanfreezingconfirmscreen_minus_fees'}
                  style={styles.cardView}
                >
                  <View>
                    <Text style={styles.titleLoanCard}>
                      ‘{Sanitizer.cleanProductLabel(loan.shortLabel, loan)}’
                    </Text>
                    <Text style={styles.textAmountLoanCard}>
                      {Amount.format(loan.loanAmount, loan.currency)}
                    </Text>
                    <Separator style={styles.separator} />
                    <Text style={styles.textBoldCard}>
                      {nroFeeFreezing > 1
                        ? L.loansfreezingconfirmscreen_cardview_plural_fee +
                        L.loansfreezingconfirmscreen_cardview_freezing
                        : L.loansfreezingconfirmscreen_cardview_singular_fee +
                        L.loansfreezingconfirmscreen_cardview_freezing}
                    </Text>
                    {feesFreezing.map((feeFreezing, index) => {
                      return (
                        <Text
                          key={index}
                          style={styles.textMonthFreezing}
                        >{`${feeFreezing.nameMonth}`}</Text>
                      );
                    })}
                  </View>
                </CardView>
                <InfoMessage
                  accessibilityLabel={
                    'loansrescheduleconfirmscreen_infomessage'
                  }
                  style={styles.infoMessage}
                  typeColor={'primaryLight'}
                  isMessage={false}
                  isCustomMessage
                  customMessage={
                    <View style={styles.viewCustomInfo}>
                      <Text style={styles.textInfo}>
                        {L.loansfreezingconfirmscreen_infomessage_text1}
                        <Text style={styles.textInfoBold}>
                          {L.loansfreezingconfirmscreen_infomessage_text2}
                        </Text>
                        {nroFeeFreezing > 1
                          ? L.loansfreezingconfirmscreen_title_plural_fee_interest
                          : L.loansfreezingconfirmscreen_title_singular_fee_interest}
                      </Text>
                      <Text style={[styles.textInfo, styles.textInfoSpace]}>
                        {nroFeeFreezing > 1
                          ? L.loansfreezingconfirmscreen_title_plural_datepay
                          : L.loansfreezingconfirmscreen_title_singular_datepay}
                      </Text>
                    </View>
                  }
                />
              </View>
              <Button
                accessibilityLabel={
                  'loansfreezingconfirmscreen_button_reprogramar'
                }
                title={L.loansfreezingconfirmscreen_button_freezing}
                loading={isLoading}
                onPress={this.goToVerify}
                textStyle={styles.titleButton}
                style={styles.buttonFreezing}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansFreezingConfirmScreenType = LoansFreezingConfirmScreen;
export default withFocused<LoansFreezingConfirmScreen, Props>(
  LoansFreezingConfirmScreen
);
