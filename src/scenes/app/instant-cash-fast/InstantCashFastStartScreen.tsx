import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  InteractionManager,
  Image,
  ImageStyle,
  Text,
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
  CardView,
  Panel,
  Separator,
  Button,
  Loading,
  TextInputChipAmount,
  ItemSelector,
  Modal,
} from '../../../components/ui';
import {Size} from '../../../resources/dimensions';
import {L} from '../../../resources/language';
import Font from '../../../resources/functions/Font';
import {
  Colors,
  Formats,
  ErrorRequest,
  AccountsType,
} from '../../../resources/constants';
import {
  OptionListChip,
  LoanRequestListOptionsChips,
  DigitalProductOptions,
  AmountOption,
  PreferencesUserDataModifyPreResponse,
} from '../../../api/backend/response/Execute';
import FeesRowNew from '../../../components/loans/FeesRowNew';
import ChipRow from '../../../components/loans/ChipRow';
import {AlertEvent} from '../../../components/alert/AlertManager';
import {Emitter} from '../../../resources/listeners';
import Session from '../../../api/Session';
import {KeyboardUtil} from '../../../resources/util';
import {Amount} from '../../../resources/money';
import {Sanitizer, Validate} from '../../../resources/functions';
import API from '../../../api';
import Log from '../../../resources/log/Log';
import {DefaultErrorResponse} from '../../../api/backend/response/Error';
import NetworkManager from '../../../components/network/NetworkManager';
import AnalyticsEvent from '../../../resources/analytics/AnalyticsEvent';
import {A} from '../../../resources/analytics';
import OpenAccountModal from '../../../components/loans/OpenAccountModal';
import ModalInfoNoEmail from '../../../components/email/ModalInfoNoEmail';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
const styles = StyleSheet.create({
  networkStatus: {
    marginTop: 20,
  } as ViewStyle,
  header: {
    marginTop: 0,
    marginBottom: 0,
  } as ViewStyle,
  mainPanel: {
    paddingTop: 16.92,
  } as ViewStyle,
  subtitleStyle: {
    ...Font({weight: 'SemiBold'}),
    color: Colors.primary,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: -9,
  } as TextStyle,
  panel: {
    marginBottom: 0,
  } as ViewStyle,
  cardView: {
    marginBottom: 30,
    marginTop: 5,
    padding: 15,
  } as ViewStyle,
  textError: {
    marginTop: 10,
    marginHorizontal: 20,
  } as ViewStyle,
  buttons: {
    marginTop: 30,
    marginBottom: 50,
  } as ViewStyle,
  label: {
    ...Font({weight: 'SemiBold'}),
    color: Colors.grey6,
  } as TextStyle,
  headerSubtitle: {
    marginTop: 30,
  } as ViewStyle,
  headerSubtitleText: {
    color: Colors.grey5,
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
  itemSelector: {
    marginBottom: 20,
    marginHorizontal: 20,
  } as ViewStyle,
  button: {
    height: 50,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
  } as TextStyle,
  topImage: {
    resizeMode: 'contain',
    height: 22,
    width: 180,
  } as ImageStyle,
  topImageCont: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  mainTitle: {
    ...Font({weight: 'Bold'}),
    color: Colors.primary,
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'left',
  } as TextStyle,
  mainTitleAmount: {
    ...Font({weight: 'Bold'}),
    color: Colors.primary,
    fontSize: 30,
    lineHeight: 41,
    marginTop: -4,
    textAlign: 'left',
  } as TextStyle,
  chipsCont: {
    flexDirection: 'row',
  } as ViewStyle,
  chipsRow: {
    marginHorizontal: 5,
    marginVertical: 5,
  } as ViewStyle,
  textInputBase: {
    ...Font({weight: 'Bold'}),
    fontSize: 14,
  } as TextStyle,
  separator: {
    marginHorizontal: 20,
  } as ViewStyle,
  amountDescription: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  container: {
    padding: 20,
    alignItems: 'center',
  } as ViewStyle,
  modalAccountTitle: {
    ...Font({weight: 'Bold'}),
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
    ...Font({weight: 'Bold'}),
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
});

export interface Params {
  code?: number;
  seedA: 'eat_fast_pres' | 'eat_fast_ini';
  user: PreferencesUserDataModifyPreResponse;
}
export interface Props extends NativeStackScreenProps<any, any> {}

export interface State {
  options: OptionListChip[];
  isLoading: boolean;
  isLoadingOptions: boolean;
  isValid: boolean;
  optionIndex: number;
  paymentDateIndex: number;
  error?: string;
  codeUpdate: number;
  chips: AmountOption[][];
  isLoadingChips: boolean;
  chipIndex: number;
  inputChipSelected: boolean;
  chipSelected: AmountOption | null;
  newProduct: DigitalProductOptions | null;
  stopCalculation: boolean;
  loanWanted: LoanRequestListOptionsChips | null;
  visibleModal: boolean;

  showModalAccount: boolean;
  accounts: any[];
  showModalEmail: boolean;
}

const TAG = '[InstantCashFastStartScreen]';
class InstantCashFastStartScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.instantcashfaststartscreen_title,
  };

  state: State = {
    isLoading: false,
    isValid: false,
    isLoadingOptions: false,
    optionIndex: -1,
    paymentDateIndex: -1,
    options: [],
    codeUpdate: 0,
    chips: [],
    isLoadingChips: false,
    chipIndex: -1,
    inputChipSelected: false,
    chipSelected: null,
    newProduct: null,
    stopCalculation: false,
    loanWanted: null,
    visibleModal: false,

    showModalAccount: false,
    accounts: [],
    showModalEmail: false,
  };

  interaction!: any;
  amountInput!: TextInputChipAmount | null;
  paymentDate!: ItemSelector | null;
  destination!: ItemSelector | null;
  scroll!: ScrollView | null;
  loadOptionsTimeout!: NodeJS.Timeout;

  async componentDidMount() {
    AnalyticsEvent.track(A.seed_instafastcash_pas0 + '_inicio');
    this.loadChipOptions();
    this.load();
  }

  onSelectOption = (index: number) => {
    this.blur();
    this.scrollToEnd();
    this.setState({optionIndex: index}, () => {
      this.isValid();
    });
  };

  onSelectOptionFromChip = (index: number) => {
    this.blur();
    this.scrollToEnd();
    this.setState({optionIndex: index}, () => {
      if (this.isValid()) {
        this.loadListOptions(false, index);
      }
    });
  };

  onSelectOptionStart = (index: number) => {
    this.blur();
    this.setState({optionIndex: index}, () => this.isValid());
  };

  onSelectChip = (index: number, item: AmountOption) => {
    this.setState(
      {
        chipIndex: index,
        inputChipSelected: false,
        stopCalculation: false,
        chipSelected: item,
      },
      () => this.loadListOptions(true),
    );
    this.amountInput && this.amountInput.clearError();
    this.amountInput && this.amountInput.setErrorAmountStyle(false, '');
  };

  onPressChipText = () => {
    this.setState({
      inputChipSelected: true,
      stopCalculation: true,
      chipIndex: -1,
      chipSelected: null,
      isValid: false,
    });
  };

  scrollToEnd = () => {
    InteractionManager.runAfterInteractions(() => {
      this.scroll && this.scroll.scrollToEnd();
    });
  };

  isValid = (showErrors = true) => {
    const isValidLoad = this.isValidLoad(showErrors);
    const isValidOption = this.isValidOption(showErrors);
    const isValid = [isValidLoad, isValidOption].every(item => item);
    this.setState({isValid});
    return isValid && NetworkManager.isConnected;
  };

  isValidLoad = (showErrors = true) => {
    const isValid = [
      this.isValidAmount(showErrors),
      this.isValidPaymentDate(showErrors),
    ].every(item => item);
    return isValid;
  };

  isValidOption = (showErrors: boolean) => {
    const {optionIndex} = this.state;
    this.setState({error: ''});
    if (optionIndex === -1) {
      showErrors &&
        this.setState({error: L.instantcashfaststartscreen_error_option});
      return false;
    }
    return true;
  };

  isValidPaymentDate = (showErrors: boolean) => {
    const {paymentDateIndex} = this.state;
    if (!this.paymentDate) {
      return false;
    }
    this.paymentDate.clearError();
    if (paymentDateIndex === -1) {
      showErrors &&
        this.paymentDate.setError(
          L.instantcashfaststartscreen_error_paymentdate,
        );
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
      const {route} = this.props;
      const user = route.params && route.params.user;
      const hasEmail = !!user._mail;

      if (!hasEmail) {
        this.setState({showModalEmail: true});
        return;
      }

      const {accounts} = this.state;
      if (accounts.length === 0) {
        this.setState({showModalAccount: true});
        return;
      }
      this.submit();
    });
  };

  submit = async () => {
    const {navigation} = this.props;
    const {loanWanted, optionIndex, inputChipSelected, newProduct} = this.state;
    const hasAccount = await this.hasAccount();
    const optionSelected = !!loanWanted && loanWanted.options[optionIndex]; //Item con valores para siguiente pantalla

    if (inputChipSelected) {
      AnalyticsEvent.track(
        A.seed_instafastcash_pas0 + '_chip_montopreestablecido',
      );
    } else {
      AnalyticsEvent.track(A.seed_instafastcash_pas0 + '_chip_montoescrito');
    }

    if (hasAccount) {
      navigation.navigate('InstantCashFastChoose', {
        locked: false,
        optionSelected,
        newProduct,
      });
    } else {
      this.setState({visibleModal: true});
    }
  };

  hasAccount = async () => {
    let hasAccount = false;
    this.setState({isLoading: true});
    const accounts = await this.loadAccountSubmit();
    this.setState({isLoading: false});
    if (accounts && accounts.length > 0) {
      hasAccount = true;
    } else {
      hasAccount = false;
    }
    return hasAccount;
  };

  loadAccountSubmit = async () => {
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
      return accounts;
    } catch (e) {
      Log.exception(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
    }
    return [];
  };

  isValidAmount = (showErrors: boolean) => {
    const {chipSelected, newProduct} = this.state;

    if (!newProduct) {
      return;
    } else {
      if (newProduct.amountOptions.length > 1) {
        if (!this.amountInput) {
          return;
        }
      }
    }
    !!this.amountInput && this.amountInput.clearError();

    const amount =
      chipSelected === null
        ? !!this.amountInput
          ? this.amountInput.getValue()
          : 0
        : chipSelected.totalAmount;
    if (amount < 300 || amount > newProduct.request.amount) {
      showErrors &&
        !!this.amountInput &&
        this.amountInput.setErrorAmountStyle(true, 'Error');
      return false;
    } else {
      showErrors &&
        !!this.amountInput &&
        this.amountInput.setErrorAmountStyle(false, '');
    }

    return true;
  };

  onBlurAmount = () => {
    this.isValidAmount(true);
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
    if (!this.amountInput) {
      return;
    }
    this.loadOptionsTimeout && clearTimeout(this.loadOptionsTimeout);
    if (this.amountInput.getValue() > 0) {
      this.loadOptionsTimeout = setTimeout(() => {
        this.loadListOptions(true);
      }, 1000);
    }
  };

  onSelectPaymentDate = (index: number) => {
    this.setState({paymentDateIndex: index}, () => {
      this.loadListOptions(true);
    });
  };

  loadListOptions = async (initialOptionList: boolean, index?: number) => {
    const {newProduct, paymentDateIndex, chipSelected} = this.state;
    if (!newProduct) {
      return;
    } else {
      if (newProduct.amountOptions.length > 1) {
        if (!this.amountInput) {
          return;
        }
      }
    }

    this.setState({
      isLoadingOptions: true,
      options: [],
      optionIndex: -1,
      isValid: false,
      error: undefined,
      stopCalculation: false,
    });
    this.scrollToEnd();
    try {
      const paymentDate = newProduct.dayOptions[paymentDateIndex];
      const amount =
        newProduct.amountOptions.length > 1
          ? chipSelected === null
            ? !!this.amountInput
              ? this.amountInput.getValue()
              : 0
            : chipSelected.totalAmount
          : !!chipSelected
          ? chipSelected.totalAmount
          : 0;

      const response = await API.Execute.loanrequestListOptionsChips({
        currencyKey: newProduct.request.currency.id,
        productId: newProduct.request.product.id,
        payDay: paymentDate,
        requestAmount: amount,
        maxFeeAmount: newProduct.request.maxFeeAmount,
      });
      const body = response.body;
      const data = body.data as LoanRequestListOptionsChips;

      if (body.code === API.ResponseCode.OK) {
        this.blur();
        const orderOptionsList = data.options.sort(this.compareFeeOptions);
        this.setState({options: orderOptionsList, loanWanted: data});
        if (initialOptionList) {
          this.onSelectOption(0);
        } else {
          !!index && this.onSelectOption(index);
        }
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
    this.setState({isLoadingOptions: false});
  };

  compare(a: AmountOption, b: AmountOption) {
    if (a.totalAmount < b.totalAmount) {
      return 1;
    }
    if (a.totalAmount > b.totalAmount) {
      return -1;
    }
    return 0;
  }

  compareFeeOptions(a: OptionListChip, b: OptionListChip) {
    if (a.amountFee < b.amountFee) {
      return 1;
    }
    if (a.amountFee > b.amountFee) {
      return -1;
    }
    return 0;
  }

  createChipMatr = (data: AmountOption[]) => {
    const orderChipList = data.sort(this.compare);
    let newArrayChipSec = [];
    let newArrayChipCol = [];
    for (let i = 0; i < orderChipList.length; i++) {
      let orderChipItem = orderChipList[i];
      const baseFlex = 100;
      let chipIndex = i + 1;
      orderChipItem.index = chipIndex;

      if (orderChipList.length == 6 || orderChipList.length == 4) {
        orderChipItem.flex = baseFlex;
        newArrayChipSec.push(orderChipItem);
        if ((i + 1) % 2 === 0) {
          newArrayChipCol.push(newArrayChipSec);
          newArrayChipSec = [];
        }
      } else {
        if (orderChipList[i].totalAmount / 100 > 10) {
          orderChipItem.flex = baseFlex;
          newArrayChipSec.push(orderChipItem);
          if ((i + 1) % 2 === 0) {
            newArrayChipCol.push(newArrayChipSec);
            newArrayChipSec = [];
          }
        } else {
          if (orderChipList[i].totalAmount / 100 < 10) {
            orderChipItem.flex = baseFlex * 0.27;
          } else {
            orderChipItem.flex = baseFlex * 0.46;
          }
          newArrayChipSec.push(orderChipItem);
        }
      }
    }
    newArrayChipCol.push(newArrayChipSec);
    this.setState({chips: newArrayChipCol});
  };

  load = async () => {
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      let {accounts} = response.body.data;

      const validTypes = [
        AccountsType.SAVING_ACCOUNTS.family,
        AccountsType.CHECKING_ACCOUNTS.family,
      ];
      const accountsList = (accounts || []).filter(account =>
        validTypes.includes(account.family),
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
      const {navigation} = this.props;
      navigation.goBack();
    }
  };

  loadChipOptions = async () => {
    this.setState({
      isLoadingChips: true,
    });

    try {
      const response = await API.Execute.loanrequestListChips();

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadListOptions', response);
      }
      const body = response.body;
      const data = body.data as DigitalProductOptions;
      const newProduct = data;
      if (body.code === API.ResponseCode.OK) {
        this.createChipMatr(data.amountOptions);
        this.setState({newProduct});
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'loadListOptions',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'loadListChips', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadListChips',
        e,
      });
    }
    this.setState({isLoadingChips: false}, () =>
      this.onSelectChip(1, this.state.chips[0][0]),
    );
    this.onSelectPaymentDate(0);
    this.onSelectOptionStart(0);
  };

  openAccount = async () => {
    const {navigation} = this.props;
    AnalyticsEvent.track(A.seed_instafastcash_pas0 + '_btn_abrircuenta');
    this.setState({visibleModal: false}, () =>
      navigation.navigate('NewAccount'),
    );
  };

  closeModal = () => {
    AnalyticsEvent.track(A.seed_instafastcash_pas0 + '_btn_loharedespues');
    this.setState({visibleModal: false});
  };

  closeModalAccount = () => {
    this.setState({showModalAccount: false});
  };

  goToNewAccount = () => {
    this.setState({showModalAccount: false}, () => {
      const {navigation} = this.props;
      navigation.navigate('NewAccount');
    });
  };

  closeEmailModal = () => {
    this.setState({showModalEmail: false});
  };

  render() {
    const {
      isLoadingOptions,
      isValid,
      isLoading,
      optionIndex,
      options,
      paymentDateIndex,
      chips,
      isLoadingChips,
      chipIndex,
      inputChipSelected,
      newProduct,
      stopCalculation,
      visibleModal,
      showModalAccount,
      showModalEmail,
    } = this.state;
    const {isFocused, navigation, route} = this.props;
    if (!newProduct) {
      return null;
    }
    const currency = Sanitizer.getCurrencyByLabel(
      newProduct.request.currency.id.toString(),
    );
    const uniqueAmountOption =
      newProduct.amountOptions.length > 1 ? false : true;
    const user = route.params && route.params.user;
    return (
      <Container>
        {showModalAccount && (
          <Modal onClose={this.closeModalAccount}>
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
                onPress={this.closeModalAccount}
              />
            </View>
          </Modal>
        )}
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
          scrollEventThrottle={100}
          ref={ref => {
            this.scroll = ref;
          }}>
          <View style={styles.topImageCont}>
            <Image
              resizeMode={'contain'}
              style={styles.topImage}
              source={require('../../../assets/images/banderolas-prestamo-digital.png')}
            />
          </View>

          <SafeAreaView>
            <Content style={styles.mainPanel}>
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
                accessibilityLabel={'instantcashfaststartscreen_header'}
                titleContainer={
                  <View style={styles.amountDescription}>
                    <Text
                      accessibilityLabel={'header_text_title'}
                      style={styles.mainTitle}>
                      {uniqueAmountOption
                        ? 'Desembolsa'
                        : L.instantcashfaststartscreen_header_title}
                    </Text>
                    <Text
                      accessibilityLabel={'header_text_title_amount'}
                      style={styles.mainTitleAmount}>
                      {`${Amount.format(
                        newProduct.request.amount,
                        newProduct.request.currency.id.toString(),
                      )}`}
                    </Text>
                  </View>
                }
                center
                subtitle={L.instantcashfaststartscreen_header_title_part2}
                subtitleStyle={styles.subtitleStyle}
              />

              {!uniqueAmountOption && (
                <Header
                  style={styles.headerSubtitle}
                  titleStyle={styles.headerSubtitleText}
                  accessibilityLabel={
                    'instantcashfaststartscreen_header_subtitle'
                  }
                  title={L.instantcashfaststartscreen_header_subtitle}
                />
              )}

              {!uniqueAmountOption && (
                <CardView style={styles.cardView}>
                  {!isLoadingChips && chips.length !== 0
                    ? chips.map(chipRow => {
                        return (
                          <View style={styles.chipsCont}>
                            {chipRow.map(chipItem => {
                              return (
                                <View
                                  style={[
                                    styles.chipsRow,
                                    !!chipItem.flex && {flex: chipItem.flex},
                                  ]}
                                  key={chipItem.index}>
                                  <ChipRow
                                    onPress={() => {
                                      !!chipItem.index &&
                                        this.onSelectChip(
                                          chipItem.index,
                                          chipItem,
                                        );
                                    }}
                                    accessibilityLabel={
                                      'instantcashfaststartscreen_panel_options_feesrow'
                                    }
                                    currencyKey={newProduct.request.currency.id}
                                    selected={chipItem.index === chipIndex}
                                    item={chipItem}
                                  />
                                </View>
                              );
                            })}
                          </View>
                        );
                      })
                    : isLoadingChips && <Loading margin={'large'} />}

                  {!isLoadingChips && (
                    <TextInputChipAmount
                      currency={currency ? currency.symbol : undefined}
                      accessibilityLabel={
                        'instantcashfaststartscreen_textinputamount_amount'
                      }
                      textInputBase={styles.textInputBase}
                      inputChipSelected={inputChipSelected}
                      focusMode={'top'}
                      focusOffset={-70}
                      onPressChip={this.onPressChipText}
                      onChangeText={this.onChangeAmount}
                      keyboardType={'decimal-pad'}
                      showClearButton={false}
                      autoCorrect={false}
                      onFocus={this.clearAmount}
                      blurOnSubmit
                      topAmount={newProduct.request.amount}
                      autoCapitalize={'none'}
                      onBlur={this.onBlurAmount}
                      errorDecoration={false}
                      ref={ref => {
                        this.amountInput = ref;
                      }}
                      formatText={Formats.Amount}
                      returnKeyType={'done'}
                    />
                  )}
                </CardView>
              )}

              <Header
                style={styles.headerSubtitle}
                titleStyle={styles.headerSubtitleText}
                accessibilityLabel={
                  'instantcashfaststartscreen_header_subtitle'
                }
                title={L.instantcashfaststartscreen_header_subtitle_parte2}
              />

              <Panel
                accessibilityLabel={'instantcashfaststartscreen_panel_options'}
                contentStyle={[
                  styles.panel,
                  {paddingBottom: stopCalculation === false ? 0 : 30},
                ]}>
                {!isLoadingChips ? (
                  <ItemSelector
                    selectedIndex={paymentDateIndex}
                    textItemSelectorDefault={'Elige tus cuotas'}
                    ref={ref => {
                      this.paymentDate = ref;
                    }}
                    values={newProduct.dayOptions.map(day => {
                      return `${L.instantcashfaststartscreen_itemselector_paymentdate_label_part1} ${day} ${L.instantcashfaststartscreen_itemselector_paymentdate_label}`;
                    })}
                    accessibilityLabel={
                      'instantcashfaststartscreen_itemselector_paymentdate'
                    }
                    onPress={this.onSelectPaymentDate}
                    style={[
                      styles.itemSelector,
                      {marginBottom: options.length !== 0 ? 0 : 0},
                    ]}
                  />
                ) : (
                  isLoadingChips && <Loading style={{marginVertical: 30}} />
                )}

                {!isLoadingOptions &&
                options.length !== 0 &&
                stopCalculation === false
                  ? options.map((option, index) => {
                      const isLast = index === options.length - 1;
                      return (
                        <View key={option.numberFee}>
                          <FeesRowNew
                            onPress={() => {
                              this.onSelectOptionFromChip(index);
                            }}
                            accessibilityLabel={
                              'instantcashfaststartscreen_panel_options_feesrow'
                            }
                            selected={index === optionIndex}
                            item={option}
                            isLast={isLast}
                            currencyKey={newProduct.request.currency.id}
                          />
                          {!isLast && <Separator style={styles.separator} />}
                        </View>
                      );
                    })
                  : isLoadingOptions && (
                      <Loading style={{marginVertical: 30}} />
                    )}
              </Panel>
              <View style={styles.buttons}>
                <Button
                  style={styles.button}
                  disabled={!isValid}
                  textStyle={styles.buttonText}
                  allowOnPress
                  accessibilityLabel={
                    'instantcashfaststartscreen_button_continue'
                  }
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  title={L.instantcashfaststartscreen_button_continue}
                />
              </View>
            </Content>
          </SafeAreaView>
          <OpenAccountModal
            openAccount={this.openAccount}
            closeModal={this.closeModal}
            visible={visibleModal}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashFastStartScreenType = InstantCashFastStartScreen;
export default withFocused<InstantCashFastStartScreen, Props>(
  InstantCashFastStartScreen,
);
