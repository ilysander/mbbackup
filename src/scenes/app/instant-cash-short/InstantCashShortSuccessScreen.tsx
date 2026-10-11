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
import Size from '../../../resources/dimensions/Size';
import ConfirmationSendingMessage from '../../../components/transfers/ConfirmationSendingMessage';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../components/transactions/ShareReceipt';
import ExpandableView from '../../../components/ui/ExpandableView';
import {L} from '../../../resources/language';
import {Sanitizer, Validate} from '../../../resources/functions';
import API from '../../../api';
import Log from '../../../resources/log/Log';
import {Emitter} from '../../../resources/listeners';
import {AlertEvent} from '../../../components/alert/AlertManager';
import {
  CoreReadTransactionInstantCashResponse,
  AccountItemSavingsAll,
} from '../../../api/backend/response/Execute';
import {AnalyticsEvent, A, K} from '../../../resources/analytics';
import Channels from '../../../components/loans/Channels';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  setAmountCourrency,
  setEventValue,
} from '../../../resources/analytics/AnalyticsEvent';
import {ParamListBase} from '@react-navigation/native';

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
    marginBottom: 20,
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
  callMessage: {
    marginTop: 20,
  } as ViewStyle,
  channels: {
    marginTop: 0,
  } as ViewStyle,
});
export interface Params {
  idTransaction: string;
  target: AccountItemSavingsAll;
  itfFormated: string;
  seedA: 'eat_urpi_pres' | 'eat_urpi_ini';
  amount: number;
  currency: string;
}

export interface P extends ParamListBase {
  InstantCashShortSuccess: {
    idTransaction: string;
    target: AccountItemSavingsAll;
    itfFormated: string;
    seedA: 'eat_urpi_pres' | 'eat_urpi_ini';
    amount: number;
    currency: string;
  };
}
// export interface Props extends NativeStackScreenProps<any, any> {
// }
export type Props = NativeStackScreenProps<P, 'InstantCashShortSuccess'>;

export interface State {
  isLoading: boolean;
  transaction?: CoreReadTransactionInstantCashResponse;
}
const TAG = '[InstantCashShortSuccessScreen]';
const SIZE_REGULAR = 290;
const SIZE_ITEM = 44;
class InstantCashShortSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  state: State = {
    isLoading: false,
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
    const {isFocused} = this.props;
    if (!isFocused) {
      return false;
    }
    this.goToLoansMenu();
    return true;
  };
  goToLoansMenu = () => {
    const {navigation, route} = this.props;
    const seedA = route.params && route.params.seedA;
    navigation.navigate('LoansHome');
    const newSeedA = (seedA + '_exito_sig') as
      | 'eat_urpi_pres_exito_sig'
      | 'eat_urpi_ini_exito_sig';
    AnalyticsEvent.track(A[newSeedA]);
    AnalyticsEvent.track(A.eat_urpi_exito_sig);
  };

  load = async () => {
    const {route} = this.props;
    const idTransaction = route.params && route.params.idTransaction;

    try {
      const amount = route.params && route.params.amount;
      const currency = route.params && route.params.currency;
      const message =
        L.instantcashshortsuccessscreen_happy_title +
        L.instantcashshortsuccessscreen_happy_subtitle;
      setEventValue(A.instantCashShortSuccessScreenUrpi, message);
      setAmountCourrency(A.instantCashShortSuccessScreenUrpi, amount, currency);
      const paramsEatShort = K[A.instantCashShortSuccessScreenUrpi];
      AnalyticsEvent.trackEvent('virtualEventApp', paramsEatShort);

      AnalyticsEvent.track(
        A.instantcash_short_success,
        {
          coupon: 'EfectivoAltoqueFC',
          currency: currency,
          value: amount,
          transaction_id: idTransaction,
        },
        A.fb_instantcash_success_urpi,
        {
          fb_content_type: 'EfectivoAltoqueFC',
          value: amount,
          _valueToSum: amount,
          fb_currency: currency,
        },
      );
    } catch (e) {
      Log.exception(TAG, 'load', e);
    }

    this.setState({isLoading: true});
    try {
      const response =
        await API.Execute.coreReadTransaction<CoreReadTransactionInstantCashResponse>(
          idTransaction,
        );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const {transaction} = response.body.data;
      this.setState({transaction, isLoading: false});

      /**
       * este bloque este en try catch para evitar errores inesperados
       */
    } catch (e) {
      Log.exception(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
      this.setState({isLoading: false});
    }
  };

  updateMail = () => {
    const {navigation} = this.props;
    navigation.navigate('Profile');
  };
  share = () => {
    this.shareView &&
      this.shareView.shareConstance(
        L.instantcashshortsuccessscreen_header_title,
      );
  };

  getTargetLabel = () => {
    const {route} = this.props;

    const target = route.params && route.params.target;

    return Sanitizer.getAccountFormattedFromLabel(
      target.shortLabel,
      target.number,
    );
  };

  generateDataReceipt = () => {
    const {transaction} = this.state;
    if (!transaction) {
      return [];
    }

    const targetLabel = this.getTargetLabel();
    const {route} = this.props;
    const itfFormated = route.params && route.params.itfFormated;

    const insurances: ShareReceiptItem[] = [];
    transaction.data.insurances.map(item => {
      insurances.push({
        title: `${item.product.description}`,
        details: [
          `${L.instantcashsuccessscreen_text_currencysymbol} ${item.amount}`,
        ],
      });
    });
    const content: ShareReceiptItem[] = [
      {
        title: L.instantcashshortsuccessscreen_requestedamount,
        details: [transaction.data.requestedAmount],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_debitaccountticket,
        details: [targetLabel],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_amountfee,
        details: [transaction.data.amountFee],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_numberfee,
        details: [transaction.data.term],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_payday,
        details: [transaction.data.payDay],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_tcea,
        details: [transaction.data.rate],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_insurancedisposal,
        details: [transaction.data.insuranceDisposal],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_itf,
        details: [itfFormated],
      },
      ...insurances,
      {
        title: L.instantcashshortsuccessscreen_detailitem_totalamount,
        details: [transaction.data.amount],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_operationnumber,
        details: [transaction.data.operationNumber.toString()],
      },
      {
        title: L.instantcashshortsuccessscreen_detailitem_creationdatetime,
        details: [
          moment(
            transaction.submitDateTime,
            L.instantcashshortsuccessscreen_detailitem_date_input_format,
          ).format(
            L.instantcashshortsuccessscreen_detailitem_date_output_format,
          ),
        ],
      },
    ];

    return content;
  };

  render() {
    const {isFocused, route} = this.props;
    const {transaction, isLoading} = this.state;
    const content = this.generateDataReceipt();
    const targetLabel = this.getTargetLabel();

    const itfFormated = route.params && route.params.itfFormated;

    return (
      <Container>
        <FormSteps total={3} current={3} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}>
          <SafeAreaView>
            <Content vertical style={styles.content}>
              <Happy
                accessibilityLabel={'instantcashshortsuccessscreen_happy'}
                title={L.instantcashshortsuccessscreen_happy_title}
                subtitle={L.instantcashshortsuccessscreen_happy_subtitle}
                style={styles.happy}
                contentStyle={styles.happyContent}
              />
              <NetworkStatusAlert style={styles.networkStatus} />

              <CardView style={styles.cardView}>
                <Image
                  resizeMode={'stretch'}
                  style={styles.flags}
                  source={require('../../../assets/images/flags-large.png')}
                />
                <Header
                  center
                  title={L.instantcashshortsuccessscreen_header_title}
                  accessibilityLabel={
                    'instantcashshortsuccessscreen_header_title'
                  }
                  style={styles.header}
                />
                {isLoading && (
                  <View style={{height: 150}}>
                    <LoadingOverlay isLoading={true} duration={200} />
                  </View>
                )}
                {!!transaction && (
                  <View style={styles.detailContainer}>
                    <DetailItem
                      label={L.instantcashshortsuccessscreen_requestedamount}
                      accessibilityLabel={
                        'instantcashshortsuccessscreen_label_requestedamount'
                      }
                      text={transaction.data.requestedAmount}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={
                        L.instantcashshortsuccessscreen_detailitem_debitaccountticket
                      }
                      accessibilityLabel={
                        'instantcashshortsuccessscreen_detailitem_debitaccountticket'
                      }
                      text={targetLabel}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={
                        L.instantcashshortsuccessscreen_detailitem_amountfee
                      }
                      accessibilityLabel={
                        'instantcashshortsuccessscreen_detailitem_amountfee'
                      }
                      text={transaction.data.amountFee}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={
                        L.instantcashshortsuccessscreen_detailitem_numberfee
                      }
                      accessibilityLabel={
                        'instantcashshortsuccessscreen_detailitem_numberfee'
                      }
                      text={transaction.data.term}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.instantcashshortsuccessscreen_detailitem_payday}
                      accessibilityLabel={
                        'instantcashshortsuccessscreen_detailitem_payday'
                      }
                      text={`${transaction.data.payDay}`}
                      style={styles.marginDetail}
                    />
                    <ExpandableView
                      accessibilityLabel={
                        'instantcashshortsuccessscreen_expandableview'
                      }
                      maxHeight={
                        transaction.data.insurances
                          ? transaction.data.insurances.length * SIZE_ITEM +
                            SIZE_REGULAR
                          : SIZE_REGULAR
                      }>
                      <DetailItem
                        label={L.instantcashshortsuccessscreen_detailitem_tcea}
                        accessibilityLabel={
                          'instantcashshortsuccessscreen_detailitem_tcea'
                        }
                        text={`${transaction.data.rate}`}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashshortsuccessscreen_detailitem_insurancedisposal
                        }
                        accessibilityLabel={
                          'instantcashshortsuccessscreen_detailitem_insurancedisposal'
                        }
                        text={`${transaction.data.insuranceDisposal}`}
                        style={styles.marginDetail}
                        tooltipText={L.instantcashsuccessscreen_tooltip_message}
                      />
                      <DetailItem
                        label={L.instantcashshortsuccessscreen_detailitem_itf}
                        accessibilityLabel={
                          'instantcashshortsuccessscreen_detailitem_itf'
                        }
                        text={itfFormated}
                        style={styles.marginDetail}
                      />
                      {transaction.data.insurances &&
                        transaction.data.insurances.map((insurance, index) => (
                          <DetailItem
                            key={index}
                            label={`${insurance.product.description}`}
                            accessibilityLabel={
                              'instantcashshortsuccessscreen_detailitem_insurancedisposal'
                            }
                            text={`${L.instantcashsuccessscreen_text_currencysymbol} ${insurance.amount}`}
                            style={styles.marginDetail}
                          />
                        ))}
                      <DetailItem
                        label={
                          L.instantcashshortsuccessscreen_detailitem_totalamount
                        }
                        accessibilityLabel={
                          'instantcashshortsuccessscreen_detailitem_totalamount'
                        }
                        text={transaction.data.amount}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashshortsuccessscreen_detailitem_operationnumber
                        }
                        accessibilityLabel={
                          'instantcashshortsuccessscreen_detailitem_operationnumber'
                        }
                        text={transaction.data.operationNumber.toString()}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashshortsuccessscreen_detailitem_creationdatetime
                        }
                        accessibilityLabel={
                          'instantcashshortsuccessscreen_detailitem_creationdatetime'
                        }
                        text={moment(
                          transaction.submitDateTime,
                          L.instantcashshortsuccessscreen_detailitem_date_input_format,
                        ).format(
                          L.instantcashshortsuccessscreen_detailitem_date_output_format,
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
                  {!!transaction.data.mail && (
                    <ConfirmationSendingMessage
                      style={styles.footer}
                      userEmail={transaction.data.mail}
                      onPress={this.updateMail}
                    />
                  )}
                </>
              )}
              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={
                    'instantcashshortsuccessscreen_button_share_title'
                  }
                  light
                  onPress={this.share}
                  title={L.instantcashshortsuccessscreen_button_share_title}
                  style={styles.marginButton}
                  textStyle={{fontSize: 16}}
                />

                <Button
                  accessibilityLabel={
                    'instantcashshortsuccessscreen_button_end_title'
                  }
                  onPress={this.goToLoansMenu}
                  title={L.instantcashshortsuccessscreen_button_end_title}
                  style={styles.marginButton}
                  textStyle={{fontSize: 16}}
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

export type InstantCashShortSuccessScreenType = InstantCashShortSuccessScreen;
export default withFocused<InstantCashShortSuccessScreen, Props>(
  InstantCashShortSuccessScreen,
);
