const moment = require('moment');
import * as React from 'react';
import {
  withFocused,
  FocusedProps,
} from '../../../components/screen/ScreenContainer';
import {
  View,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
  BackHandler,
} from 'react-native';
import {
  Container,
  FormSteps,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  NetworkStatusAlert,
  Header,
  LoadingOverlay,
  Happy,
  Button,
  CardView,
  DetailItem,
  ECDigitalBanner,
} from '../../../components/ui';
import Channels from '../../../components/loans/Channels';
import Size from '../../../resources/dimensions/Size';
import ConfirmationSendingMessage from '../../../components/transfers/ConfirmationSendingMessage';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../components/transactions/ShareReceipt';
import ExpandableView from '../../../components/ui/ExpandableView';
import { L } from '../../../resources/language';
import { Sanitizer, Validate } from '../../../resources/functions';
import API from '../../../api';
import Log from '../../../resources/log/Log';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  CoreReadTransactionInstantCashResponse,
  AccountItemSavingsAll,
  InsuranceItem,
} from '../../../api/backend/response/Execute';
import { AnalyticsEvent, A, K } from '../../../resources/analytics';
import { Amount } from '../../../resources/money';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  setAmountCourrency,
  setEventValue,
} from '../../../resources/analytics/AnalyticsEvent';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
    marginBottom: 32,
  } as ViewStyle,
  footer: {
    alignSelf: 'center',
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  marginDetail: {
    marginBottom: 10,
  } as ViewStyle,
  happy: {
    height: 182,
    paddingTop: 0,
    marginTop: 0,
  } as ViewStyle,
  happyContent: {
    marginHorizontal: 20,
  } as ViewStyle,
  cardView: {
    alignItems: 'center',
  } as ViewStyle,
  flags: {
    width: '80%',
    height: 32,
  } as ImageStyle,
  content: {
    paddingTop: 0,
  } as ViewStyle,
  detailContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  } as ViewStyle,
  marginButton: {
    marginBottom: 20,
  } as ViewStyle,
  channels: {
    marginTop: 20,
  } as ViewStyle,
  callMessage: {
    marginTop: 20,
  } as ViewStyle,
});
export interface Params {
  idTransaction: string;
  amount: number;
  currency: string;
  target: AccountItemSavingsAll;
  itfFormated: string;
  insurances: InsuranceItem[];
  seedA: 'eat_flargo_pres' | 'eat_flargo_ini';
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isLoadingLoan: boolean;
  transaction?: CoreReadTransactionInstantCashResponse;
  insurances: InsuranceItem[];
}
const TAG = '[InstantCashSuccessScreen]';
class InstantCashSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isLoading: false,
    isLoadingLoan: false,
    insurances: [],
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
    this.goToLoansMenu();
    return true;
  };
  goToLoansMenu = () => {
    const { navigation, route } = this.props;
    navigation.navigate('LoansHome');
    const seedA = route.params && route.params.seedA;
    const newSeedA = (seedA + '_exito_sig') as
      | 'eat_flargo_pres_exito_sig'
      | 'eat_flargo_ini_exito_sig';
    AnalyticsEvent.track(A[newSeedA]);
    AnalyticsEvent.track(A.eat_flargo_exito_sig);
  };

  load = async () => {
    const { route } = this.props;

    const idTransaction = route.params && route.params.idTransaction;
    const insurances = route.params && route.params.insurances;

    this.setState({ isLoading: true, insurances });
    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionInstantCashResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { transaction } = response.body.data;
      this.setState({ transaction, isLoading: false });

      const message =
        L.instantcashsuccessscreen_happy_title +
        L.instantcashsuccessscreen_happy_subtitle;
      setEventValue(A.instantCashSuccessScreenCongratulations, message);
      /*
       * este bloque este en try catch para evitar errores inesperados
       */
      try {
        const amount = route.params && route.params.amount;//currency
        const currency = Sanitizer.getCurrencyByLabel(
          route.params && route.params.currency
        )!;
        setAmountCourrency(
          A.instantCashSuccessScreenCongratulations,
          amount,
          currency.code
        );
        const paramsEat = K[A.instantCashSuccessScreenCongratulations];
        AnalyticsEvent.trackEvent('virtualEventApp', paramsEat);

        AnalyticsEvent.track(
          A.instantcash_success,
          {
            coupon: 'EfectivoAltoque',
            currency: currency.code,
            value: amount,
            transaction_id: idTransaction,
          },
          A.fb_instantcash_success,
          {
            fb_content_type: 'EfectivoAltoque',
            value: amount,
            _valueToSum: amount,
            fb_currency: currency.code,
          }
        );
      } catch (e) {
        Log.exception(TAG, 'load', e);
      }
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

  updateMail = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  share = () => {
    this.shareView &&
      this.shareView.shareConstance(L.instantcashsuccessscreen_header_title);
  };
  goToLoan = async () => {
    const { navigation } = this.props;
    const { transaction } = this.state;
    if (!transaction) {
      return;
    }

    this.setState({ isLoadingLoan: true });
    try {
      const response = await API.Execute.loansRead(transaction.data.loan, '');
      navigation.navigate('Loan', { item: response.body.data.loan });
    } catch (e) {
      Log.warn(TAG, 'goToLoan', e);
    }
    this.setState({ isLoadingLoan: false });
  };

  getTargetLabel = () => {
    const { route } = this.props;

    const target = route.params && route.params.target;

    return Sanitizer.getAccountFormattedFromLabel(
      target.shortLabel,
      target.number
    );
  };

  getInsuranceTitle = (id: number) => {
    switch (id) {
      case 1:
        return L.instantcashsuccess_insurance_title_1;
      case 2:
        return L.instantcashsuccess_insurance_title_2;
      case 3:
        return L.instantcashsuccess_insurance_title_3;
      case 4:
        return L.instantcashsuccess_insurance_title_4;
      case 5:
        return L.instantcashsuccess_insurance_title_5;
      case 6:
        return L.instantcashsuccess_insurance_title_6;
      default:
        return '';
    }
  };

  getAmount = (amountData: any) => {
    let amountValue = '';
    if (typeof amountData === 'string') {
      amountValue = amountData;
    } else if (typeof amountData.currency === 'string') {
      amountValue = Amount.format(amountData.quantity, amountData.currency);
    }
    return amountValue;
  };

  generateDataReceipt = () => {
    const { transaction } = this.state;
    if (!transaction) {
      return [];
    }
    const { route } = this.props;


    const itfFormated = route.params && route.params.itfFormated;
    const currency = route.params && route.params.currency;
    const targetLabel = this.getTargetLabel();
    const amountValue = this.getAmount(transaction.data.amount);

    const insurances: ShareReceiptItem[] = [];

    transaction.data.insurances.map(item => {
      insurances.push({
        title: this.getInsuranceTitle(item.product.id),
        details: [Amount.format(item.amount, currency)],
      });
    });
    const content: ShareReceiptItem[] = [
      {
        title: L.instantcashsuccessscreen_requestedamount,
        details: [Amount.format(transaction.data.requestedAmount, currency)],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_debitaccountticket,
        details: [targetLabel],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_amountfee,
        details: [Amount.format(transaction.data.amountFee, currency)],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_numberfee,
        details: [
          transaction.data.numberFee +
          ' ' +
          L.instantcashsuccessscreen_detailitem_numberfee_detail,
        ],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_payday,
        details: [
          `${transaction.data.payDay} ${L.instantcash_insurance_each_month}`,
        ],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_tcea,
        details: [`${transaction.data.rate} %`],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_insurancedisposal,
        details: [
          Amount.format(transaction.data.insuranceDisposal, currency) +
          ' (' +
          transaction.data.insuranceDisposalRate +
          '%)',
        ],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_itf,
        details: [itfFormated],
      },

      ...insurances,
      {
        title: L.instantcashsuccessscreen_detailitem_totalamount,
        details: [amountValue],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_operationnumber,
        details: [transaction.data.operationNumber.toString()],
      },
      {
        title: L.instantcashsuccessscreen_detailitem_creationdatetime,
        details: [
          moment(
            transaction.submitDateTime,
            L.instantcashsuccessscreen_detailitem_date_input_format
          ).format(L.instantcashsuccessscreen_detailitem_date_output_format),
        ],
      },
    ];

    return content;
  };

  render() {
    const { isFocused, route } = this.props;
    const { transaction, isLoading } = this.state;
    const content = this.generateDataReceipt();
    const targetLabel = this.getTargetLabel();

    const itfFormated = route.params && route.params.itfFormated;
    const currency = route.params && route.params.currency;

    let amountValue = '';
    if (transaction) {
      amountValue = this.getAmount(transaction.data.amount);
    }
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
            <Content vertical style={styles.content}>
              <Happy
                accessibilityLabel={'instantcashsuccessscreen_happy'}
                title={L.instantcashsuccessscreen_happy_title}
                subtitle={L.instantcashsuccessscreen_happy_subtitle}
                style={styles.happy}
                contentStyle={styles.happyContent}
              />
              <NetworkStatusAlert style={styles.networkStatus} />
              <CardView style={styles.cardView}>
                <LoadingOverlay isLoading={isLoading} duration={200} />
                <Image
                  resizeMode={'stretch'}
                  style={styles.flags}
                  source={require('../../../assets/images/flags-large.png')}
                />
                <Header
                  center
                  title={L.instantcashsuccessscreen_header_title}
                  accessibilityLabel={'instantcashsuccessscreen_header'}
                  style={styles.header}
                />
                {!!transaction && (
                  <View style={styles.detailContainer}>
                    <DetailItem
                      label={L.instantcashsuccessscreen_requestedamount}
                      accessibilityLabel={
                        'instantcashsuccessscreen_label_requestedamount'
                      }
                      text={Amount.format(
                        transaction.data.requestedAmount,
                        currency
                      )}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={
                        L.instantcashsuccessscreen_detailitem_debitaccountticket
                      }
                      accessibilityLabel={
                        'instantcashsuccessscreen_detailitem_debitaccountticket'
                      }
                      text={targetLabel}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.instantcashsuccessscreen_detailitem_amountfee}
                      accessibilityLabel={
                        'instantcashsuccessscreen_detailitem_amountfee'
                      }
                      text={Amount.format(transaction.data.amountFee, currency)}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.instantcashsuccessscreen_detailitem_numberfee}
                      accessibilityLabel={
                        'instantcashsuccessscreen_detailitem_numberfee'
                      }
                      text={
                        transaction.data.numberFee +
                        ' ' +
                        L.instantcashsuccessscreen_detailitem_numberfee_detail
                      }
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.instantcashsuccessscreen_detailitem_payday}
                      accessibilityLabel={
                        'instantcashsuccessscreen_detailitem_payday'
                      }
                      text={`${transaction.data.payDay} ${L.instantcash_insurance_each_month}`}
                      style={styles.marginDetail}
                    />
                    <ExpandableView
                      accessibilityLabel={
                        'instantcashsuccessscreen_expandableview'
                      }
                      maxHeight={290 + transaction.data.insurances.length * 40}
                    >
                      <DetailItem
                        label={L.instantcashsuccessscreen_detailitem_tcea}
                        accessibilityLabel={
                          L.instantcashsuccessscreen_detailitem_tcea
                        }
                        text={`${transaction.data.rate} %`}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashsuccessscreen_detailitem_insurancedisposal
                        }
                        accessibilityLabel={
                          'instantcashsuccessscreen_detailitem_insurancedisposal'
                        }
                        text={
                          Amount.format(
                            transaction.data.insuranceDisposal,
                            currency
                          ) +
                          ' (' +
                          transaction.data.insuranceDisposalRate +
                          '%)'
                        }
                        style={styles.marginDetail}
                        tooltipText={L.instantcashsuccessscreen_tooltip_message}
                      />
                      <DetailItem
                        label={L.instantcashsuccessscreen_detailitem_itf}
                        accessibilityLabel={
                          'instantcashsuccessscreen_detailitem_itf'
                        }
                        text={itfFormated}
                        style={styles.marginDetail}
                      />
                      {transaction.data.insurances.map((item, index) => (
                        <DetailItem
                          key={index}
                          label={this.getInsuranceTitle(item.product.id)}
                          accessibilityLabel={
                            'instantcashconfirmscreen_text_insurance_disposal'
                          }
                          text={Amount.format(item.amount, currency)}
                          style={styles.marginDetail}
                        />
                      ))}
                      <DetailItem
                        label={
                          L.instantcashsuccessscreen_detailitem_totalamount
                        }
                        accessibilityLabel={
                          'instantcashsuccessscreen_detailitem_totalamount'
                        }
                        text={amountValue}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashsuccessscreen_detailitem_operationnumber
                        }
                        accessibilityLabel={
                          'instantcashsuccessscreen_detailitem_operationnumber'
                        }
                        text={transaction.data.operationNumber.toString()}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashsuccessscreen_detailitem_creationdatetime
                        }
                        accessibilityLabel={
                          'instantcashsuccessscreen_detailitem_creationdatetime'
                        }
                        text={moment(
                          transaction.submitDateTime,
                          L.instantcashsuccessscreen_detailitem_date_input_format
                        ).format(
                          L.instantcashsuccessscreen_detailitem_date_output_format
                        )}
                      />
                    </ExpandableView>
                  </View>
                )}
              </CardView>

              {!!transaction && (
                <>
                  <Channels style={styles.channels} />

                  <ECDigitalBanner />
                  {!!transaction.data.userEmail && (
                    <ConfirmationSendingMessage
                      style={styles.footer}
                      userEmail={transaction.data.userEmail}
                      onPress={this.updateMail}
                    />
                  )}
                </>
              )}
              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={'instantcashsuccessscreen_button_share'}
                  light
                  onPress={this.share}
                  title={L.instantcashsuccessscreen_button_share_title}
                  style={styles.marginButton}
                />
                <Button
                  accessibilityLabel={'instantcashsuccessscreen_button_end'}
                  onPress={this.goToLoansMenu}
                  title={L.instantcashsuccessscreen_button_end_title}
                  style={styles.marginButton}
                />
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={L.shareconstance_instantcash_title}
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashSuccessScreenType = InstantCashSuccessScreen;
export default withFocused<InstantCashSuccessScreen, Props>(
  InstantCashSuccessScreen
);
