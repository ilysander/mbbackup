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
  Text,
  TextStyle,
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
} from '../../../components/ui';
import Channels from '../../../components/loans/Channels';
import Size from '../../../resources/dimensions/Size';
import ConfirmationSendingMessage from '../../../components/transfers/ConfirmationSendingMessage';
import ShareReceipt, {
  ShareReceiptItem,
} from '../../../components/transactions/ShareReceipt';
import ExpandableView from '../../../components/ui/ExpandableView';
import { L } from '../../../resources/language';
import { Font, Validate } from '../../../resources/functions';
import API from '../../../api';
import Log from '../../../resources/log/Log';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  CoreReadTransactionInstantCashResponse,
  DigitalLoanPreviewResponse,
  OptionListChip,
} from '../../../api/backend/response/Execute';
import { AnalyticsEvent, A } from '../../../resources/analytics';
import Config from '../../../Config';
import { Amount } from '../../../resources/money';
import { Colors } from '../../../resources/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const ChangeDestinyMailEECC = Config.features.ChangeDestinyMailEECC;

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
    minHeight: 40,
    // paddingVertical: 0
  } as ViewStyle,
  channels: {
    marginTop: 20,
  } as ViewStyle,
  callMessage: {
    marginTop: 20,
  } as ViewStyle,
  textEECCMessage: {
    ...Font({ weight: 'Medium' }),
    color: Colors.accentDark,
    fontSize: 13,
  } as TextStyle,
});
export interface Params {
  idTransaction: string;
  currency: string;
  resume: DigitalLoanPreviewResponse;
  optionSelected: OptionListChip;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isLoadingLoan: boolean;
  transaction?: CoreReadTransactionInstantCashResponse;
}
const TAG = '[InstantCashFastSuccessScreen]';
class InstantCashFastSuccessScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.instantcashfastsuccessscreen_title,
  //   headerLeft: <View />,
  //   gesturesEnabled: false,
  // };

  state: State = {
    isLoading: false,
    isLoadingLoan: false,
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
    const { navigation } = this.props;
    navigation.navigate('LoansHome');
  };

  load = async () => {
    const { route } = this.props;
    const idTransaction = route.params && route.params.idTransaction;
    const resume = route.params && route.params.resume;
    const currency = route.params && route.params.currency;

    try {
      const response = await API.Execute.coreReadTransaction<
        CoreReadTransactionInstantCashResponse
      >(idTransaction);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      const { transaction } = response.body.data;
      this.setState({ transaction, isLoading: false });

      /**
       * este bloque este en try catch para evitar errores inesperados
       */
      try {

        AnalyticsEvent.track(
          A.instantcash_success,
          {
            coupon: 'EfectivoAltoqueFast',
            currency: currency,
            value: resume.amount,
            transaction_id: idTransaction,
          },
          A.fb_instantcash_success,
          {
            fb_content_type: 'EfectivoAltoqueFast',
            value: resume.amount,
            _valueToSum: resume.amount,
            fb_currency: currency,
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
      this.shareView.shareConstance(
        L.instantcashfastsuccessscreen_header_title
      );
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
    const resume = route.params && route.params.resume;


    return resume.debitAccount;
  };

  generateDataReceipt = () => {
    const { transaction } = this.state;
    if (!transaction) {
      return [];
    }
    const { route } = this.props;

    const optionSelected = route.params && route.params.optionSelected;
    const currency = route.params && route.params.currency;

    const itfFormated = Amount.format(optionSelected.itf, currency);
    const targetLabel = this.getTargetLabel();
    let amountValue = '';
    const amountData = (transaction.data.amount as unknown) as any;
    if (typeof amountData === 'string') {
      amountValue = amountData;
    } else if (typeof amountData.currency === 'string') {
      amountValue = Amount.format(amountData.quantity, amountData.currency);
    }
    const content: ShareReceiptItem[] = [
      {
        title: L.instantcashfastsuccessscreen_requestedamount,
        details: [transaction.data.requestedAmount],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_debitaccountticket,
        details: [targetLabel],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_amountfee,
        details: [transaction.data.amountFee],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_numberfee,
        details: [
          transaction.data.numberFee +
          ' ' +
          L.instantcashfastsuccessscreen_detailitem_numberfee_detail,
        ],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_payday,
        details: [transaction.data.payDay.toString()],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_tcea,
        details: [transaction.data.rate],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_insurancedisposal,
        details: [transaction.data.insuranceDisposal],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_itf,
        details: [itfFormated],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_totalamount,
        details: [amountValue],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_operationnumber,
        details: [transaction.data.operationNumber.toString()],
      },
      {
        title: L.instantcashfastsuccessscreen_detailitem_creationdatetime,
        details: [
          moment(
            transaction.submitDateTime,
            L.instantcashfastsuccessscreen_detailitem_date_input_format
          ).format(
            L.instantcashfastsuccessscreen_detailitem_date_output_format
          ),
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

    const optionSelected = route.params && route.params.optionSelected;
    const currency = route.params && route.params.currency;


    const itfFormated = Amount.format(optionSelected.itf, currency);

    let amountValue = '';
    if (transaction) {
      const amountData = (transaction.data.amount as unknown) as any;
      if (typeof amountData === 'string') {
        amountValue = amountData;
      } else if (typeof amountData.currency === 'string') {
        amountValue = Amount.format(amountData.quantity, amountData.currency);
      }
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
                accessibilityLabel={'instantcashfastsuccessscreen_happy'}
                title={L.instantcashfastsuccessscreen_happy_title}
                subtitle={
                  'Hemos depositado tu préstamo\nen tu cuenta de ahorros.'
                }
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
                  title={L.instantcashfastsuccessscreen_header_title}
                  accessibilityLabel={'instantcashfastsuccessscreen_header'}
                  style={styles.header}
                />
                {!!transaction && (
                  <View style={styles.detailContainer}>
                    <DetailItem
                      label={L.instantcashfastsuccessscreen_requestedamount}
                      accessibilityLabel={
                        'instantcashfastsuccessscreen_label_requestedamount'
                      }
                      text={Amount.format(
                        transaction.data.requestedAmount,
                        currency
                      )}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={
                        L.instantcashfastsuccessscreen_detailitem_debitaccountticket
                      }
                      accessibilityLabel={
                        'instantcashfastsuccessscreen_detailitem_debitaccountticket'
                      }
                      text={targetLabel}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={
                        L.instantcashfastsuccessscreen_detailitem_amountfee
                      }
                      accessibilityLabel={
                        'instantcashfastsuccessscreen_detailitem_amountfee'
                      }
                      text={Amount.format(transaction.data.amountFee, currency)}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={
                        L.instantcashfastsuccessscreen_detailitem_numberfee
                      }
                      accessibilityLabel={
                        'instantcashfastsuccessscreen_detailitem_numberfee'
                      }
                      text={
                        transaction.data.term +
                        ' ' +
                        L.instantcashfastsuccessscreen_detailitem_numberfee_detail
                      }
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.instantcashfastsuccessscreen_detailitem_payday}
                      accessibilityLabel={
                        'instantcashfastsuccessscreen_detailitem_payday'
                      }
                      text={`${transaction.data.payDay} ${L.instantcashfastsuccessscreen_insurance_each_month}`}
                      style={styles.marginDetail}
                    />
                    <ExpandableView
                      accessibilityLabel={
                        'instantcashfastsuccessscreen_expandableview'
                      }
                      maxHeight={290 + 0 * 40}
                    >
                      <DetailItem
                        label={L.instantcashfastsuccessscreen_detailitem_tcea}
                        accessibilityLabel={
                          'instantcashfastsuccessscreen_detailitem_tcea'
                        }
                        text={`${transaction.data.rate} %`}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashfastsuccessscreen_detailitem_insurancedisposal
                        }
                        accessibilityLabel={
                          'instantcashfastsuccessscreen_detailitem_insurancedisposal'
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
                        tooltipText={
                          L.instantcashfastsuccessscreen_tooltip_message
                        }
                      />
                      <DetailItem
                        label={L.instantcashfastsuccessscreen_detailitem_itf}
                        accessibilityLabel={
                          'instantcashfastsuccessscreen_detailitem_itf'
                        }
                        text={itfFormated}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashfastsuccessscreen_detailitem_totalamount
                        }
                        accessibilityLabel={
                          'instantcashfastsuccessscreen_detailitem_totalamount'
                        }
                        text={amountValue}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashfastsuccessscreen_detailitem_operationnumber
                        }
                        accessibilityLabel={
                          'instantcashfastsuccessscreen_detailitem_operationnumber'
                        }
                        text={transaction.data.operationNumber.toString()}
                        style={styles.marginDetail}
                      />
                      <DetailItem
                        label={
                          L.instantcashfastsuccessscreen_detailitem_creationdatetime
                        }
                        accessibilityLabel={
                          'instantcashfastsuccessscreen_detailitem_creationdatetime'
                        }
                        text={moment(
                          transaction.submitDateTime,
                          L.instantcashfastsuccessscreen_detailitem_date_input_format
                        ).format(
                          L.instantcashfastsuccessscreen_detailitem_date_output_format
                        )}
                      />
                    </ExpandableView>
                  </View>
                )}
              </CardView>

              {!!transaction && (
                <>
                  <Channels style={styles.channels} />
                  <CardView
                    padding
                    style={{
                      marginTop: 20,
                      borderColor: Colors.accentDark,
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ paddingRight: 20 }}>
                      <Image
                        source={require('../../../assets/images/icon-invoice.png')}
                        style={{
                          width: 44,
                          height: 52,
                          tintColor: Colors.accentDark,
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.textEECCMessage}>
                        {
                          'Recibirás todos los meses tu estado de cuenta en tu correo electrónico. Si lo deseas en físico, llamanos al '
                        }
                        <Text numberOfLines={1}>{'(01) 319-9999.'}</Text>
                      </Text>
                    </View>
                  </CardView>
                  {!!transaction.data.userEmail &&
                    (ChangeDestinyMailEECC ? (
                      <ConfirmationSendingMessage
                        style={styles.footer}
                        userEmail={transaction.data.userEmail}
                        onPress={this.updateMail}
                      />
                    ) : (
                      <>
                        <ConfirmationSendingMessage
                          style={styles.footer}
                          userEmail={transaction.data.userEmail}
                          onPress={this.updateMail}
                        />
                      </>
                    ))}
                </>
              )}

              <View style={styles.buttons}>
                <Button
                  accessibilityLabel={
                    'instantcashfastsuccessscreen_button_share'
                  }
                  light
                  onPress={this.share}
                  title={L.instantcashfastsuccessscreen_button_share_title}
                  style={styles.marginButton}
                />
                <Button
                  accessibilityLabel={'instantcashfastsuccessscreen_button_end'}
                  onPress={this.goToLoansMenu}
                  title={L.instantcashfastsuccessscreen_button_end_title}
                  style={styles.marginButton}
                />
              </View>
            </Content>
            <ShareReceipt
              ref={ref => {
                this.shareView = ref;
              }}
              title={
                L.instantcashfastsuccessscreen_shareconstance_instantcash_title
              }
              content={content}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashFastSuccessScreenType = InstantCashFastSuccessScreen;
export default withFocused<InstantCashFastSuccessScreen, Props>(
  InstantCashFastSuccessScreen
);
