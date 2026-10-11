import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  View,
  InteractionManager,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  Content,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  Header,
  FormSteps,
  ProgressInfo,
  CardView,
  Panel,
  Separator,
  Button,
  Loading,
  TextError,
  TextInputAmount,
  ItemSelector,
  Modal,
} from '../../../components/ui';
import { Size } from '../../../resources/dimensions';
import { L } from '../../../resources/language';
import Font from '../../../resources/functions/Font';
import {
  Colors,
  Formats,
  ErrorRequest,
  AccountsType,
} from '../../../resources/constants';
import {
  ContentCreditLine,
  OptionsList,
  LoanRequestListOptions,
  PreferencesUserDataModifyPreResponse,
} from '../../../api/backend/response/Execute';
import FeesRow from '../../../components/loans/FeesRow';
import { AlertEvent } from '../../../components/alert/AlertManager';
import { Emitter } from '../../../resources/listeners';
import Session from '../../../api/Session';
import { KeyboardUtil } from '../../../resources/util';
import { Amount } from '../../../resources/money';
import { Sanitizer, Validate } from '../../../resources/functions';
import API from '../../../api';
import Log from '../../../resources/log/Log';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import NetworkManager from '../../../components/network/NetworkManager';
import AnalyticsEvent, {
  AnalyticsTrackParams,
} from '../../../resources/analytics/AnalyticsEvent';
import { A } from '../../../resources/analytics';
import perf from '@react-native-firebase/perf';
import MobileServiceManager from '../../../components/mobile-service/MobileServiceManager';
import ModalInfoNoEmail from '../../../components/email/ModalInfoNoEmail';
import Config from '../../../Config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const moment = require('moment');
const styles = StyleSheet.create({
  networkStatus: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  panel: {
    marginBottom: 20,
  } as ViewStyle,
  panelTitle: {
    fontSize: 20,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
    marginTop: 7,
  } as ViewStyle,
  progressSubtitle: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey6,
    marginTop: 4,
    fontSize: 13,
    textAlign: 'center',
  } as TextStyle,
  textError: {
    marginTop: 10,
    marginHorizontal: 20,
  } as ViewStyle,
  buttons: {
    marginTop: 10,
    marginBottom: 50,
  } as ViewStyle,
  label: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
  } as TextStyle,
  headerSubtitle: {
    marginTop: 20,
  } as ViewStyle,
  headerSubtitleText: {
    color: Colors.secondary,
    fontSize: 16,
    lineHeight: 18,
  } as TextStyle,
  itemSelector: {
    marginBottom: 20,
  } as ViewStyle,
  button: {
    height: 50,
  } as ViewStyle,
  modalAccountTitle: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
  } as TextStyle,
  modalAccountText: {
    ...Font(),
    color: Colors.grey5,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  } as TextStyle,
  modalAccountTextBold: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey5,
  } as TextStyle,
  buttonContainer: {
    minHeight: 40,
    width: '100%',
  } as ViewStyle,
  buttonNewAccountContainer: {
    minHeight: 40,
    marginBottom: 20,
    width: '100%',
  } as ViewStyle,
  container: {
    padding: 20,
    alignItems: 'center',
  } as ViewStyle,
});
export interface Params {
  creditLine: ContentCreditLine;
  code?: number;
  seedA: 'eat_flargo_pres' | 'eat_flargo_ini';
  user: PreferencesUserDataModifyPreResponse;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  creditLine?: ContentCreditLine;
  options: OptionsList[];
  isLoading: boolean;
  isLoadingOptions: boolean;
  isValid: boolean;
  optionIndex: number;
  paymentDateIndex: number;
  destinationIndex: number;
  error?: string;
  codeUpdate: number;
  showModalAccount: boolean;
  accounts: any[];
  showModalEmail: boolean;
}

const TAG = '[InstantCashStartScreen]';
class InstantCashStartScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isLoading: false,
    isValid: false,
    isLoadingOptions: false,
    optionIndex: -1,
    paymentDateIndex: -1,
    destinationIndex: -1,
    options: [],
    codeUpdate: 0,
    showModalAccount: false,
    accounts: [],
    showModalEmail: false,
  };

  interaction!: any;
  amountInput!: TextInputAmount | null;
  paymentDate!: ItemSelector | null;
  destination!: ItemSelector | null;
  scroll!: ScrollView | null;
  loadOptionsTimeout!: NodeJS.Timeout;
  willBlurListener!: any;
  didFocusListener!: any;
  trace!: any | null;

  async componentDidMount() {
    const { route } = this.props;

    const creditLine = route.params && route.params.creditLine;
    const code = route.params ? route.params.code ? route.params.code : 0 : 0;

    this.setState({ creditLine, codeUpdate: code });
    this.load();
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.willBlurListener = this.props.navigation.addListener(
        'blur',
        this.willBlur
      );
      this.didFocusListener = this.props.navigation.addListener(
        'focus',
        this.didFocus
      );
    }
  }

  componentWillUnmount(): void {
    this.willBlurListener && this.willBlurListener();
    this.didFocusListener && this.didFocusListener();
  }

  load = async () => {
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      let { accounts } = response.body.data;

      const validTypes = [
        AccountsType.SAVING_ACCOUNTS.family,
        AccountsType.CHECKING_ACCOUNTS.family,
      ];
      const accountsList = (accounts || []).filter(account =>
        validTypes.includes(account.family)
      );
      this.setState({
        accounts: accountsList,
      });
    } catch (e) {
      Log.info(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
      const { navigation } = this.props;
      navigation.goBack();
    }
  };

  componentDidUpdate(prevProps: Props & FocusedProps, prevState: State) {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      const { route } = this.props;

      const creditLine = route.params && route.params.creditLine;
      const code = route.params ? route.params.code ? route.params.code : 0 : 0;

      if (code !== prevState.codeUpdate) {
        this.setState({
          creditLine,
          codeUpdate: code,
          optionIndex: -1,
          paymentDateIndex: -1,
          destinationIndex: -1,
          options: [],
          isValid: false,
        });

        this.amountInput && this.amountInput.setValue('');
      }
    }
  }

  didFocus = async () => {
    this.trace = perf().newTrace('InstantCashStartScreen');
    await this.trace.start();
  };

  willBlur = async () => {
    this.trace && (await this.trace.stop());
  };

  onSelectOption = (index: number) => {
    this.blur();
    this.scrollToEnd();

    this.setState({ optionIndex: index }, () => {
      this.isValid();
    });
  };

  scrollToEnd = () => {
    InteractionManager.runAfterInteractions(() => {
      this.scroll && this.scroll.scrollToEnd();
    });
  };

  selectedParams = () => {
    const { creditLine, paymentDateIndex, destinationIndex } = this.state;
    if (!creditLine || !this.amountInput) {
      return {};
    }
    const amount = this.amountInput.getValue();
    const paymentDate = creditLine.paymentDatesList[paymentDateIndex];
    const destination = creditLine.loanDestinations[destinationIndex];
    if (!destination || !paymentDate) {
      return {};
    }
    return {
      paymentDate,
      amount,
      destination: Sanitizer.titleCase(destination.destinationName),
    } as AnalyticsTrackParams;
  };

  isValid = (showErrors = true) => {
    const isValidLoad = this.isValidLoad(showErrors);
    const isValidOption = this.isValidOption(showErrors);
    const isValid = [isValidLoad, isValidOption].every(item => item);
    this.setState({ isValid });

    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      !isValidLoad &&
        this.trace &&
        this.trace.incrementMetric('loadInvalid', 1);

      !isValidOption &&
        this.trace &&
        this.trace.incrementMetric('optionInvalid', 1);

      !isValid && this.trace && this.trace.incrementMetric('error', 1);
    }

    return isValid && NetworkManager.isConnected;
  };

  isValidLoad = (showErrors = true) => {
    const isValid = [
      this.isValidAmount(showErrors),
      this.isValidDestination(showErrors),
      this.isValidPaymentDate(showErrors),
    ].every(item => item);
    return isValid;
  };

  isValidOption = (showErrors: boolean) => {
    const { optionIndex } = this.state;

    this.setState({ error: '' });
    if (optionIndex === -1) {
      showErrors &&
        this.setState({ error: L.instantcashstartscreen_error_option });
      return false;
    }

    return true;
  };

  isValidPaymentDate = (showErrors: boolean) => {
    const { paymentDateIndex } = this.state;
    if (!this.paymentDate) {
      return false;
    }
    this.paymentDate.clearError();
    if (paymentDateIndex === -1) {
      showErrors &&
        this.paymentDate.setError(L.instantcashstartscreen_error_paymentdate);
      return false;
    }

    return true;
  };

  isValidDestination = (showErrors: boolean) => {
    const { destinationIndex } = this.state;
    if (!this.destination) {
      return false;
    }
    this.destination.clearError();
    if (destinationIndex === -1) {
      showErrors &&
        this.destination.setError(L.instantcashstartscreen_error_destination);
      return false;
    }

    return true;
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  tryToSubmit = async () => {
    this.blur();

    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'tryToSubmit',
        e: '',
      });
      return;
    }

    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      const isValid = this.isValid(true);
      if (!isValid) {
        return;
      }
      const { route } = this.props;
      // const user = navigation.getParam('user');
      const user = route.params && route.params.user;
      const hasEmail = !!user._mail;

      if (!hasEmail) {
        this.setState({ showModalEmail: true });
        return;
      }

      const { accounts } = this.state;
      if (accounts.length === 0) {
        this.setState({ showModalAccount: true });
        return;
      }
      this.submit();
    });
  };

  submit = async () => {
    const { navigation, route } = this.props;

    const {
      creditLine,
      options,
      paymentDateIndex,
      optionIndex,
      destinationIndex,
    } = this.state;

    if (!creditLine || !this.amountInput) {
      return;
    }

    const option = options[optionIndex];
    const amount = this.amountInput.getValue();
    const paymentDate = creditLine.paymentDatesList[paymentDateIndex];
    const destination = creditLine.loanDestinations[destinationIndex];

    const seedA = route.params && route.params.seedA;
    // const seedA = navigation.getParam('seedA');

    navigation.navigate('InstantCashSelectInsurance', {
      amount,
      creditLine,
      option,
      paymentDate,
      destination,
      seedA,
    });

    const newSeedA = (seedA + '_calc_sig') as
      | 'eat_flargo_pres_calc_sig'
      | 'eat_flargo_ini_calc_sig';
    AnalyticsEvent.track(A[newSeedA]);
    AnalyticsEvent.track(A.eat_flargo_calc_sig);
  };

  isValidAmount = (showErrors: boolean) => {
    const { creditLine } = this.state;
    if (!creditLine || !this.amountInput) {
      return false;
    }

    const amount = this.amountInput.getValue();
    if (amount < 1) {
      showErrors &&
        this.amountInput.setError(L.instantcashstartscreen_error_amount_empty);
      return false;
    }
    if (amount > creditLine.avaiCredLAmountWithoutTax) {
      showErrors &&
        this.amountInput.setError(L.instantcashstartscreen_error_amount_limit);
      return false;
    }
    if (amount < creditLine.dispositionMinimumAmount) {
      showErrors &&
        this.amountInput.setError(
          `${L.instantcashstartscreen_error_amount_minimal} ${Amount.format(
            creditLine.dispositionMinimumAmount,
            creditLine.currencyKey.toString()
          )}`
        );
      return false;
    }
    if (amount == Config.settings.amountNotAllowedForEat) {
      showErrors &&
        this.amountInput.setError(L.instantcashstartscreen_text_error_amount_not_allowed_eat);
      return false;
    }

    return true;
  };

  onBlurAmount = () => {
    this.isValidAmount(true);
    this.validateLoadListOptions();
  };

  clearAmount = () => {
    if (!this.amountInput) {
      return;
    }
    if (this.amountInput.getValue() <= 0) {
      this.amountInput.setValue('');
      this.setState({
        isValid: false,
      });
    }
  };

  onChangeAmount = () => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && this.trace.incrementMetric('changeAmount', 1);
    }
  };

  onSelectPaymentDate = (index: number) => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && this.trace.incrementMetric('selectPaymentDate', 1);
    }
    this.setState({ paymentDateIndex: index }, () => {
      this.isValidPaymentDate(true);
      this.validateLoadListOptions();
    });
  };

  onSelectDestination = (index: number) => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && this.trace.incrementMetric('selectDestination', 1);
    }
    this.setState({ destinationIndex: index }, () => {
      this.isValidDestination(true);
      this.validateLoadListOptions();
    });
  };

  validateLoadListOptions = (activate: boolean = true) => {
    if (!activate) {
      this.loadOptionsTimeout && clearTimeout(this.loadOptionsTimeout);
      return;
    }
    this.loadOptionsTimeout && clearTimeout(this.loadOptionsTimeout);
    this.loadOptionsTimeout = setTimeout(() => {
      this.loadListOptions();
    }, 700);
  };

  loadListOptions = async () => {
    const isValid = this.isValidLoad(false);
    if (!isValid) {
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && (await this.trace.incrementMetric('loadOptions', 1));
    }
    const { creditLine, paymentDateIndex, destinationIndex } = this.state;

    if (!creditLine || !this.amountInput) {
      return;
    }

    this.setState({
      isLoadingOptions: true,
      options: [],
      optionIndex: -1,
      isValid: false,
      error: undefined,
    });
    this.scrollToEnd();

    const paymentDate = creditLine.paymentDatesList[paymentDateIndex];
    const destination = creditLine.loanDestinations[destinationIndex];

    try {
      if (MobileServiceManager.isGms || Platform.OS === 'ios') {
        if (this.trace) {
          await this.trace.putMetric('amount', this.amountInput.getValue());
          await this.trace.putAttribute('paymentDate', paymentDate);
          await this.trace.putAttribute(
            'loanReason',
            destination.destinationId.toString()
          );
        }
      }

      const response = await API.Execute.loanrequestListOptions({
        amount: this.amountInput.getValue().toString(),
        payment_date: paymentDate,
        payment_amount: '0',
        loanReason: destination.destinationId.toString(),
        currency: creditLine.currencyKey.toString(),
        creditLine: creditLine.creditLine,
      });

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadListOptions', response);
      }
      const body = response.body;
      const data = body.data as LoanRequestListOptions;
      if (body.code === API.ResponseCode.OK) {
        this.blur();
        AnalyticsEvent.track(
          A.instantcashstartscreen_apicall_list_options,
          this.selectedParams()
        );
        this.setState({ options: data.optionsList });
      } else {
        let hasError = false;
        const error = body.data as DefaultErrorResponse;
        if (error.NO_FIELD) {
          this.amountInput && this.amountInput.setError(error.NO_FIELD);
          hasError = true;
        }

        !hasError &&
          Emitter.emit<AlertEvent>('onAlert', {
            tag: TAG,
            method: 'loadListOptions',
            e: ErrorRequest.Default,
          });
      }
    } catch (e) {
      Log.exception(TAG, 'loadListOptions', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadListOptions',
        e,
      });
    }
    this.setState({ isLoadingOptions: false });
  };

  closeModal = () => {
    this.setState({ showModalAccount: false });
  };

  goToNewAccount = () => {
    this.setState({ showModalAccount: false }, () => {
      const { navigation } = this.props;
      navigation.navigate('NewAccount');
    });
  };

  closeEmailModal = () => {
    this.setState({ showModalEmail: false });
  };

  onOpenSelector = () => {
    this.amountInput && this.amountInput.blur();
    setTimeout(() => {
      this.validateLoadListOptions(false);
    }, 200);
  };

  render() {
    const {
      creditLine,
      isLoadingOptions,
      isValid,
      isLoading,
      optionIndex,
      options,
      error,
      paymentDateIndex,
      destinationIndex,
      showModalAccount,
      showModalEmail,
    } = this.state;
    const { isFocused, navigation, route } = this.props;
    if (!creditLine) {
      return null;
    }
    const currency = Sanitizer.getCurrencyByLabel(
      creditLine.currencyKey.toString()
    );
    // const user = navigation.getParam('user');
    const user = route.params && route.params.user;
    return (
      <Container>
        {showModalAccount && (
          <Modal onClose={this.closeModal}>
            <View style={styles.container}>
              <Image
                source={require('../../../assets/images/hand-money.png')}
              />
              <Text style={styles.modalAccountTitle}>
                {L.instantcashstartscreen_modalaccount_title}
              </Text>
              <Text style={styles.modalAccountText}>
                {L.instantcashstartscreen_modalaccount_subtitle1}
                <Text style={styles.modalAccountTextBold}>
                  {L.instantcashstartscreen_modalaccount_subtitle2}
                </Text>
                {L.instantcashstartscreen_modalaccount_subtitle3}
              </Text>

              <Button
                accessibilityLabel={
                  'instantcashstartscreen_modalaccount_btn_newaccount'
                }
                style={styles.buttonNewAccountContainer}
                title={L.instantcashstartscreen_modalaccount_btn_newaccount}
                onPress={this.goToNewAccount}
              />
              <Button
                accessibilityLabel={
                  'instantcashstartscreen_modalaccount_btn_canccel'
                }
                style={styles.buttonContainer}
                title={L.instantcashstartscreen_modalaccount_btn_canccel}
                light
                onPress={this.closeModal}
              />
            </View>
          </Modal>
        )}
        <FormSteps total={4} current={1} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
          scrollEventThrottle={100}
          ref={ref => {
            this.scroll = ref;
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              {showModalEmail && (
                <ModalInfoNoEmail
                  accessibilityLabel={'foryoumenuscreen_modalinfo_noemail'}
                  navigation={navigation}
                  onClose={this.closeEmailModal}
                  user={user}
                />
              )}
              <Header
                style={styles.header}
                accessibilityLabel={'instantcashstartscreen_header'}
                title={`${L.instantcashstartscreen_header_title
                  }\n${Amount.format(
                    creditLine.avaiCredLAmountWithoutTax,
                    creditLine.currencyKey.toString()
                  )}`}
                center
              />
              <ProgressInfo
                accessibilityLabel={'instantcashstartscreen_progressinfo'}
                width={Size.getVisibleWidth() - 40}
                progress={
                  creditLine.withdrawnCreditLineAmount /
                  creditLine.approvedCreditLineAmount
                }
                leftValue={Amount.format(
                  creditLine.withdrawnCreditLineAmount,
                  creditLine.currencyKey.toString()
                )}
                leftLabel={L.instantcashstartscreen_progressinfo_left}
                rightValue={Amount.format(
                  creditLine.approvedCreditLineAmount,
                  creditLine.currencyKey.toString()
                )}
                rightLabel={L.instantcashstartscreen_progressinfo_right}
              />
              {!!creditLine.expirationdate && (
                <Text
                  accessibilityLabel={'instantcashstartscreen_expiration'}
                  style={styles.progressSubtitle}
                >
                  {L.instantcashstartscreen_expiration}{' '}
                  {moment(
                    creditLine.expirationdate,
                    L.instantcashstartscreen_expiration_format_source
                  ).format(L.instantcashstartscreen_expiration_format)}
                </Text>
              )}
              <Header
                style={styles.headerSubtitle}
                titleStyle={styles.headerSubtitleText}
                accessibilityLabel={'instantcashstartscreen_header_subtitle'}
                title={L.instantcashstartscreen_header_subtitle}
              />

              <CardView style={styles.cardView} padding>
                <TextInputAmount
                  currency={currency ? currency.symbol : undefined}
                  labelStyle={styles.label}
                  accessibilityLabel={
                    'instantcashstartscreen_textinputamount_amount'
                  }
                  label={L.instantcashstartscreen_textinputamount_amount_label}
                  focusMode={'top'}
                  focusOffset={-70}
                  onChangeText={this.onChangeAmount}
                  keyboardType={'decimal-pad'}
                  showClearButton={false}
                  autoCorrect={false}
                  onFocus={this.clearAmount}
                  blurOnSubmit
                  autoCapitalize={'none'}
                  onBlur={this.onBlurAmount}
                  errorDecoration={false}
                  ref={ref => {
                    this.amountInput = ref;
                  }}
                  formatText={Formats.Amount}
                  returnKeyType={'done'}
                />
                <ItemSelector
                  selectedIndex={paymentDateIndex}
                  ref={ref => {
                    this.paymentDate = ref;
                  }}
                  values={creditLine.paymentDatesList.map(day => {
                    return `${day} ${L.instantcashstartscreen_itemselector_paymentdate_label}`;
                  })}
                  accessibilityLabel={
                    'instantcashstartscreen_itemselector_paymentdate'
                  }
                  accessibilityLabelOption={'instantcashstartscreen_itemselector_paymentdate_press'}
                  title={
                    L.instantcashstartscreen_itemselector_paymentdate_title
                  }
                  placeholder={
                    L.instantcashstartscreen_itemselector_paymentdate_title
                  }
                  onPress={this.onSelectPaymentDate}
                  style={styles.itemSelector}
                  onOpen={this.onOpenSelector}
                />
                <ItemSelector
                  selectedIndex={destinationIndex}
                  ref={ref => {
                    this.destination = ref;
                  }}
                  values={creditLine.loanDestinations.map(destination => {
                    return Sanitizer.titleCase(destination.destinationName);
                  })}
                  accessibilityLabel={
                    'instantcashstartscreen_itemselector_destination'
                  }
                  accessibilityLabelOption={'instantcashstartscreen_itemselector_destination_press'}
                  title={
                    L.instantcashstartscreen_itemselector_destination_title
                  }
                  placeholder={
                    L.instantcashstartscreen_itemselector_destination_title
                  }
                  onPress={this.onSelectDestination}
                  onOpen={this.onOpenSelector}
                />
              </CardView>

              {isLoadingOptions && <Loading margin={'large'} />}
              {!isLoadingOptions && options.length !== 0 && (
                <>
                  <Panel
                    titleStyle={styles.panelTitle}
                    title={L.instantcashstartscreen_panel_options}
                    accessibilityLabel={'instantcashstartscreen_panel_options'}
                    style={styles.panel}
                  >
                    {options.map((option, index) => {
                      const isLast = index === options.length - 1;
                      return (
                        <View key={option.numberFee}>
                          <FeesRow
                            onPress={() => {
                              this.onSelectOption(index);
                            }}
                            accessibilityLabel={
                              'instantcashstartscreen_panel_options_feesrow'
                            }
                            selected={index === optionIndex}
                            item={option}
                            isLast={isLast}
                          />
                          {!isLast && (
                            <Separator style={{ marginHorizontal: 20 }} />
                          )}
                        </View>
                      );
                    })}
                  </Panel>
                  {!!error && (
                    <TextError
                      accessibilityLabel={
                        'instantcashstartscreen_panel_options_texterror'
                      }
                      style={styles.textError}
                    >
                      {error}
                    </TextError>
                  )}
                </>
              )}
              <View style={styles.buttons}>
                <Button
                  // style={styles.button}
                  disabled={!isValid}
                  analyticsParams={this.selectedParams}
                  allowOnPress
                  accessibilityLabel={'instantcashstartscreen_button_continue'}
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  title={L.instantcashstartscreen_button_continue}
                  big
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashStartScreenType = InstantCashStartScreen;
export default withFocused<InstantCashStartScreen, Props>(
  InstantCashStartScreen
);
