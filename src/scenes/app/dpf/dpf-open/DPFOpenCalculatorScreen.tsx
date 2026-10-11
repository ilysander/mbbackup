const moment = require('moment');
import * as React from 'react';
import {
  InteractionManager,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import API from '../../../../api';
import {
  AccountItemSavingsAll,
  DpfListItem,
  PreferencesUserDataModifyPreResponse,
} from '../../../../api/backend/response/Execute';
import DeclarationAlert from '../../../../components/alert/DeclarationAlert';
import DPFAvailabilityAlert from '../../../../components/alert/DPFAvailabilityAlert';
import DPFRow from '../../../../components/dpf/DPFRow';
import NetworkManager from '../../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  InfoMessage,
  KeyboardAvoidingView,
  Loading,
  NetworkStatusAlert,
  Panel,
  SafeAreaView,
  Selector,
  Separator,
  TextError,
  TextInput,
  TextInputAmount,
  SelectorTag,
  SectionHeader,
  CardView,
} from '../../../../components/ui';
import Config from '../../../../Config';
import {A, AnalyticsEvent} from '../../../../resources/analytics';
import {
  AccountsType,
  Currencies,
  ErrorRequest,
  Formats,
} from '../../../../resources/constants';
import {Currency} from '../../../../resources/constants/Currencies';
import DPFType from '../../../../resources/constants/DPFType';
import {Size} from '../../../../resources/dimensions';
import {Validate} from '../../../../resources/functions';
import {L} from '../../../../resources/language';
import {Emitter} from '../../../../resources/listeners';
import {Log} from '../../../../resources/log';
import {Amount} from '../../../../resources/money';
import {KeyboardUtil} from '../../../../resources/util';
import {AlertEvent} from '../../../../components/alert/AlertManager';
import Session from '../../../../api/Session';
import Banner from '../../../../components/dpf/Banner';
import perf from '@react-native-firebase/perf';
import MobileServiceManager from '../../../../components/mobile-service/MobileServiceManager';
import ModalInfoNoEmail from '../../../../components/email/ModalInfoNoEmail';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamListBase, RouteProp} from '@react-navigation/native';

const styles = StyleSheet.create({
  buttons: {
    marginVertical: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 20,
  } as ViewStyle,
  infoMessage: {
    marginTop: 20,
    marginBottom: 20,
  } as ViewStyle,
  header: {
    marginTop: 30,
  } as ViewStyle,
  textError: {marginTop: 10, marginHorizontal: 20} as ViewStyle,
  selectorTag: {
    marginBottom: 10,
  } as ViewStyle,
  amountContainer: {
    marginTop: 0,
    marginBottom: 0,
  } as ViewStyle,
  separator: {
    marginHorizontal: 20,
  } as ViewStyle,
});

const TAG = '[DPFOpenCalculatorScreen]';
export interface P extends ParamListBase {
  params: {
    user: PreferencesUserDataModifyPreResponse;
  };
}
export type Props = NativeStackScreenProps<P, 'params'>;
export interface State {
  showDeclarationAlert: boolean;
  isLoadingDeclarationAgree: boolean;
  isLoadingDeclarationReject: boolean;
  isLoading: boolean;
  isValid: boolean;
  currencies: Currency[];
  accounts: AccountItemSavingsAll[];
  frequentContact?: any;
  isTargetCompleted: boolean;
  showFrequentForm: boolean;
  showAvailabilityAlert: boolean;
  scrollMinHeight: number;
  rowsData: DpfListItem[];
  dpf?: any;
  isLoadingRows: boolean;
  error?: string;
  indexDpf: number;
  showModalEmail: boolean;
}

class DPFOpenCalculatorScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  state: State = {
    showDeclarationAlert: false,
    showAvailabilityAlert: false,
    isLoadingDeclarationAgree: false,
    isLoadingDeclarationReject: false,
    isLoading: false,
    isValid: false,
    currencies: [Currencies.PEN, Currencies.USD],
    frequentContact: undefined,
    isTargetCompleted: false,
    showFrequentForm: false,
    scrollMinHeight: Size.getVisibleTabScreenHeight(),
    rowsData: [],
    accounts: [],
    isLoadingRows: false,
    indexDpf: -1,
    dpf: undefined,
    showModalEmail: false,
  };

  interaction!: any;
  scroll!: ScrollView | null;
  loadOptions!: NodeJS.Timeout;
  timeout!: NodeJS.Timeout;
  emailInput!: TextInput | null;
  currencySelector!: Selector<Currency> | null;
  amountInput!: TextInputAmount | null;
  trace!: any | null;

  goBack = () => {
    this.props.navigation.navigate('TransfersHome');
  };

  getCurrency = () => {
    let currency;
    if (this.currencySelector) {
      currency = this.currencySelector.getValue();
    }
    return currency || Currencies.PEN;
  };

  componentDidMount() {
    Emitter.on('onClearDPFForm', this.clearForm);
    this.load();
  }

  componentWillUnmount() {
    Emitter.off('onClearDPFForm', this.clearForm);
    this.interaction && this.interaction.cancel();
  }

  onFocus = async () => {
    this.trace = perf().newTrace('DPFOpenCalculatorScreen');
    await this.trace.start();
  };

  onBlur = async () => {
    this.trace && (await this.trace.stop());
  };

  componentDidUpdate(prevProps: Props & FocusedProps) {
    const {isFocused} = this.props;

    if (isFocused) {
      this.timeout && clearTimeout(this.timeout);
    }

    if (prevProps.isFocused !== isFocused) {
      if (isFocused) {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.onFocus();
        }
      } else {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.onBlur();
        }
        this.timeout = setTimeout(() => {
          this.clearForm();
        }, Config.settings.timeoutClearDPFOpenForm);
      }
    }
  }

  load = () => {
    this.loadAccounts();
  };
  loadAccounts = async () => {
    const {isLoading} = this.state;
    if (isLoading) {
      Log.info(TAG, 'loadAccounts', 'now already isLoading');
      return;
    }
    this.setState({isLoading: true});
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      let {accounts} = response.body.data;
      const validTypes = [AccountsType.SAVING_ACCOUNTS.family];
      accounts = (accounts || []).filter(account =>
        validTypes.includes(account.family),
      );
      this.setState({accounts});
    } catch (e) {
      Log.info(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
    }
    this.setState({isLoading: false});
  };

  clearForm = () => {
    this.amountInput && this.amountInput.setValue('');
    this.setState({
      rowsData: [],
      error: undefined,
      isValid: false,
      indexDpf: -1,
    });
  };

  isValid = (showErrors: boolean) => {
    const isValidAmount = this.isValidAmount(showErrors);
    const {accounts} = this.state;
    let {rowsData, indexDpf} = this.state;
    const currency = this.getCurrency();
    let error;

    if (showErrors) {
      if (!isValidAmount) {
        rowsData = [];
        indexDpf = -1;
      }
      if (indexDpf === -1) {
        error = L.dpfopencalculatorscreen_list_dpf_error;
      }
      error = this.validateAccountByCurrency(accounts, currency, error);
      this.setState({
        rowsData,
        error,
        indexDpf,
      });
    }

    return isValidAmount && !error && NetworkManager.isConnected;
  };

  validateAccountByCurrency = (
    accounts: any[],
    currency: any,
    error?: string,
  ) => {
    const acountWithCurrency = (accounts || []).find(account => {
      return account.currency === currency.label;
    });
    const hasAccountWithCurrency = !!acountWithCurrency;
    if (!hasAccountWithCurrency && currency.label === Currencies.PEN.label) {
      error = L.dpfopencalculatorscreen_list_dpf_error_account_pen;
    }
    if (!hasAccountWithCurrency && currency.label === Currencies.USD.label) {
      error = L.dpfopencalculatorscreen_list_dpf_error_account_usd;
    }
    return error;
  };

  isValidAmount = (markError = true) => {
    if (!this.amountInput) {
      return false;
    }
    let isValid = true;

    const amount = this.amountInput.getValue();
    const limit = this.getCurrencyLimitFormatted();
    if (amount <= 0) {
      markError &&
        this.amountInput.setError(
          L.dpfopencalculatorscreen_textinput_amount_min_error + limit,
        );
      isValid = false;
    }
    if (isValid && !this.isValidLimit(amount)) {
      markError &&
        this.amountInput.setError(
          L.dpfopencalculatorscreen_textinput_amount_min_error + limit,
        );
      isValid = false;
    }
    return isValid;
  };

  getCurrencyLimitFormatted = () => {
    const currency = this.getCurrency();
    let limit = '';
    const format = {
      format: '%s%v',
    };
    if (currency.label === Currencies.PEN.label) {
      limit = Amount.format(
        Config.settings.limitMinDPFOpenPEN,
        Currencies.PEN.label,
        format,
      );
    } else if (currency.label === Currencies.USD.label) {
      limit = Amount.format(
        Config.settings.limitMinDPFOpenUSD,
        Currencies.USD.label,
        format,
      );
    }
    return limit;
  };

  isValidLimit = (amount: number) => {
    const currency = this.getCurrency();
    if (currency.label === Currencies.PEN.label) {
      return amount >= Config.settings.limitMinDPFOpenPEN;
    }
    if (currency.label === Currencies.USD.label) {
      return amount >= Config.settings.limitMinDPFOpenUSD;
    }
    return true;
  };

  onBlurAmount = () => {
    this.isValidAmount();
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

  isAvailable = async () => {
    this.setState({isLoading: true});
    let serviceAvailable = false;
    let betweenOfficeHour = false;
    try {
      const response = await API.ServiceAvalability.list();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'isAvailable', response);
      }
      const {enable} = response.body.data;
      const parsedDate = moment(response.headers.Date).utcOffset(
        Config.settings.countryTimezone,
      );
      betweenOfficeHour =
        parsedDate.isoWeekday() !== 7 &&
        Validate.isBetweenHours(
          response.headers.Date,
          Config.settings.startTimeDPFOpening,
          Config.settings.endTimeDPFOpening,
        );
      serviceAvailable = enable;
    } catch (e) {
      serviceAvailable = false;
      Log.exception(TAG, 'isAvailable', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'isAvailables',
        e,
      });
    }
    this.setState({isLoading: false});
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace &&
        (await this.trace.putAttribute(
          'serviceAvailable',
          serviceAvailable.toString(),
        ));
      this.trace &&
        (await this.trace.putAttribute(
          'betweenOfficeHour',
          betweenOfficeHour.toString(),
        ));
    }

    return serviceAvailable && betweenOfficeHour;
  };

  tryToSubmit = async () => {
    this.blur();

    const {navigation, route} = this.props;
    const {accounts} = this.state;

    const user = route.params && route.params.user;
    const hasEmail = !!user._mail;
    if (!hasEmail) {
      this.setState({showModalEmail: true});
      return;
    }
    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      if (!Session.hasPhone()) {
        Emitter.emit<AlertEvent>('onAlertUpdate', {
          tag: TAG,
          method: 'tryToSubmit',
          e: '',
        });
        return;
      }

      if (accounts.length < 1) {
        navigation.navigate('NewAccountDPF', {});
        return;
      }
      const isValid = this.isValid(true);
      if (!isValid) {
        return;
      }
      const isAvailable = await this.isAvailable();
      isAvailable ? this.showDeclarationAlert() : this.showAvailabilityAlert();
    });
  };

  submit = async () => {
    const {navigation} = this.props;
    const {accounts, indexDpf, rowsData} = this.state;
    const currency = this.getCurrency();
    const amount = this.amountInput
      ? this.amountInput.getValue().toString()
      : '';
    const dpf = rowsData[indexDpf];
    navigation.navigate('DPFOpenChoose', {
      amount,
      currency,
      accounts,
      dpf,
    });
    InteractionManager.runAfterInteractions(() => {
      this.timeout && clearTimeout(this.timeout);
    });
  };

  blur = () => {
    KeyboardUtil.hide();
  };
  onSubmitEditingAmount = () => {
    const isValidAmount = this.isValidAmount();
    const {indexDpf} = this.state;
    const isValid = indexDpf > -1 && isValidAmount;
    this.blur();

    this.setState(
      {
        rowsData: [],
        indexDpf: -1,
        isValid,
      },
      () => {
        if (isValidAmount) {
          this.onChangeAmount();
        }
      },
    );
  };

  onChangeAmount = () => {
    this.loadOptions && clearTimeout(this.loadOptions);
    this.loadOptions = setTimeout(() => {
      this.loadListOptions();
    }, 500);
  };

  loadListOptions = async () => {
    const amountInput = this.amountInput ? this.amountInput.getValue() : '';
    const currency = this.getCurrency();
    const isValidAmount = this.isValidAmount(false);

    if (!isValidAmount) {
      return;
    }
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && (await this.trace.putAttribute('currency', currency.code));
      this.trace && (await this.trace.incrementMetric('loadListOptions', 1));
    }

    this.setState({
      isLoadingRows: true,
      isValid: false,
      rowsData: [],
      indexDpf: -1,
      error: undefined,
      dpf: undefined,
    });

    try {
      const response = await API.Execute.depositListOptions(
        amountInput.toString(),
        currency.label,
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadListOptions', response);
      }
      const body = response.body;
      const data = body.data;
      if (body.code === API.ResponseCode.OK) {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.trace && (await this.trace.incrementMetric('OkResponse', 1));
        }

        this.setState({
          rowsData: data.dpfList,
        });
      } else if (body.code === API.ResponseCode.ERROR) {
        if (MobileServiceManager.isGms || Platform.OS === 'ios') {
          this.trace && (await this.trace.incrementMetric('errorResponse', 1));
        }
        this.blur();
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
    this.setState({
      isLoadingRows: false,
    });
  };

  onChooseDpf = async (indexDpf: number) => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && (await this.trace.incrementMetric('onChooseDpf', 1));
      this.trace && (await this.trace.putMetric('option', indexDpf));
    }

    this.blur();
    AnalyticsEvent.track(A.dpfopencalculatorscreen_dpf_selected);

    const isValid = indexDpf > -1 && this.isValidAmount(false);

    this.setState({indexDpf, isValid, error: undefined});

    InteractionManager.runAfterInteractions(() => {
      this.scroll && this.scroll.scrollToEnd();
    });
  };

  showDeclarationAlert = () => {
    this.setState({showDeclarationAlert: true});
  };

  goToInvalid = async () => {
    if (MobileServiceManager.isGms || Platform.OS === 'ios') {
      this.trace && (await this.trace.incrementMetric('goToInvalid', 1));
    }

    const {route} = this.props;
    const user = route.params && route.params.user;

    this.setState({isLoadingDeclarationReject: true});
    try {
      const response = await API.Execute.depositSunatDeclaration(DPFType.DPF);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'goToInvalid', response);
      }
      this.setState({
        isLoadingDeclarationReject: false,
        showDeclarationAlert: false,
      });
    } catch (e) {
      this.setState({
        isLoadingDeclarationReject: false,
        showDeclarationAlert: false,
      });
      Log.exception(TAG, 'goToInvalid', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'goToInvalid',
        e,
      });
    }
    this.props.navigation.navigate('DPFOpenInvalid', {user});
  };

  goToChoose = async () => {
    this.setState({showDeclarationAlert: false});
    await this.submit();
  };

  hideAvailabilityAlert = async () => {
    this.setState({showAvailabilityAlert: false});
  };

  showAvailabilityAlert = async () => {
    this.setState({showAvailabilityAlert: true});
  };
  closeEmailModal = () => {
    this.setState({showModalEmail: false});
  };
  render() {
    const {
      isLoading,
      showDeclarationAlert,
      showAvailabilityAlert,
      isLoadingDeclarationReject,
      isValid,
      currencies,
      scrollMinHeight,
      rowsData,
      indexDpf,
      error,
      isLoadingRows,
      // user,
      showModalEmail,
    } = this.state;

    const {isFocused, navigation, route} = this.props;
    const user = route.params && route.params.user;

    const currency = this.getCurrency();
    let minAmount = '';

    switch (currency.label) {
      case Currencies.PEN.label:
        minAmount = Amount.format(
          Config.settings.limitMinDPFOpenPEN,
          Currencies.PEN.label,
        );
        break;
      case Currencies.USD.label:
        minAmount = Amount.format(
          Config.settings.limitMinDPFOpenUSD,
          Currencies.USD.label,
        );
        break;
      default:
    }

    return (
      <Container>
        <DeclarationAlert
          accessibilityLabel={'dpfopencalculatorscreen_declaration_alert'}
          visible={showDeclarationAlert}
          loading={isLoadingDeclarationReject}
          onReject={this.goToInvalid}
          onAgree={this.goToChoose}
        />
        {showAvailabilityAlert && (
          <DPFAvailabilityAlert
            accessibilityLabel={'dpfopencalculatorscreen_availability_alert'}
            onClose={this.hideAvailabilityAlert}
          />
        )}

        {showModalEmail && !!user && (
          <ModalInfoNoEmail
            accessibilityLabel={'foryoumenuscreen_modalinfo_noemail'}
            navigation={navigation}
            onClose={this.closeEmailModal}
            user={user}
          />
        )}

        <FormSteps total={4} current={1} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: scrollMinHeight,
          }}
          scrollEventThrottle={100}
          ref={ref => {
            this.scroll = ref;
          }}>
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />

              <Banner />

              <Header
                style={styles.header}
                accessibilityLabel={'dpfopencalculatorscreen_header_title'}
                title={L.dpfopencalculatorscreen_header_title}
              />

              <CardView
                accessibilityLabel={'dpfopencalculatorscreen_cardview'}
                padding>
                <SectionHeader
                  accessibilityLabel={
                    'dpfopencalculatorscreen_sectionheader_currency'
                  }
                  title={L.dpfopencalculatorscreen_sectionheader_currency}
                />
                <SelectorTag
                  accessibilityLabel={
                    'dpfopencalculatorscreen_segmented_currency'
                  }
                  options={currencies.map(item => ({
                    label: `${item.symbol} ${item.code}`,
                    value: item,
                  }))}
                  ref={ref => {
                    this.currencySelector = ref;
                  }}
                  defaultValue={Currencies.PEN}
                  onSelectIndex={this.clearForm}
                  style={styles.selectorTag}
                />

                <SectionHeader
                  accessibilityLabel={
                    'dpfopencalculatorscreen_sectionheader_amount'
                  }
                  title={L.dpfopencalculatorscreen_sectionheader_amount_title}
                  subtitle={
                    L.dpfopencalculatorscreen_sectionheader_amount_subtitle +
                    minAmount
                  }
                />
                <TextInputAmount
                  errorDecoration={false}
                  focusMode={'top'}
                  focusOffset={-70}
                  onChangeText={this.onChangeAmount}
                  keyboardType={'decimal-pad'}
                  showClearButton={false}
                  autoCorrect={false}
                  onFocus={this.clearAmount}
                  blurOnSubmit
                  accessibilityLabel={
                    'dpfopencalculatorscreen_textinput_amount'
                  }
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  currency={currency.symbol}
                  onBlur={this.onBlurAmount}
                  ref={ref => {
                    this.amountInput = ref;
                  }}
                  formatText={Formats.Amount}
                  containerStyle={styles.amountContainer}
                />
              </CardView>

              {isLoadingRows && <Loading margin={'large'} />}
              {!isLoadingRows && rowsData.length !== 0 && (
                <>
                  <InfoMessage
                    accessibilityLabel={'dpfopencalculatorscreen_infomessage'}
                    style={styles.infoMessage}
                    message={L.dpfopencalculatorscreen_header_dpf_description}
                  />
                  <Panel
                    theme={'light'}
                    accessibilityLabel={'dpfopencalculatorscreen_panel_dpf'}
                    title={L.dpfopencalculatorscreen_header_dpf}>
                    {rowsData.map((item, index) => {
                      const selected = indexDpf === index;
                      const isLast = index === rowsData.length - 1;
                      return (
                        <View key={index.toString()}>
                          <DPFRow
                            accessibilityLabel={
                              'dpfopencalculatorscreen_dpfrow'
                            }
                            onPress={() => {
                              this.onChooseDpf(index);
                            }}
                            item={item}
                            currency={currency}
                            selected={selected}
                          />
                          {!isLast && <Separator style={styles.separator} />}
                        </View>
                      );
                    })}
                  </Panel>
                  {!!error && (
                    <TextError style={styles.textError}>{error}</TextError>
                  )}
                </>
              )}

              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'dpfopencalculatorscreen_button_continue'}
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  title={L.dpfopencalculatorscreen_button_continue}
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type DPFOpenCalculatorScreenType = DPFOpenCalculatorScreen;
export default withFocused<DPFOpenCalculatorScreen, Props>(
  DPFOpenCalculatorScreen,
);
