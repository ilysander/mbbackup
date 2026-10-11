import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import {
  findNodeHandle,
  Image,
  ImageStyle,
  InteractionManager,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import API from '../../../../api';
import {AccountItemSavingsAll} from '../../../../api/backend/response/Execute';
import NetworkManager from '../../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import AccountSelector from '../../../../components/transfers/AccountSelector';
import FrequentContact from '../../../../components/transfers/FrequentContact';
import SelectFrequentContactDropdown from '../../../../components/transfers/SelectFrequentContactDropdown';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  TextInput,
  TextInputAmount,
  Touchable,
  CardView,
  SectionHeader,
  Alert,
} from '../../../../components/ui';
import Config from '../../../../Config';
import {A, AnalyticsEvent} from '../../../../resources/analytics';
import {
  Colors,
  Currencies,
  ErrorRequest,
  Formats,
  TransfersOtherBanksErrors,
} from '../../../../resources/constants';
import {Currency} from '../../../../resources/constants/Currencies';
import TransferType from '../../../../resources/constants/TransferType';
import {Size} from '../../../../resources/dimensions';
import {Linking, Validate, Font} from '../../../../resources/functions';
import {L} from '../../../../resources/language';
import {Emitter} from '../../../../resources/listeners';
import {Log} from '../../../../resources/log';
import {Amount} from '../../../../resources/money';
import {KeyboardUtil} from '../../../../resources/util';
import {AlertEvent} from '../../../../components/alert/AlertManager';
import Session from '../../../../api/Session';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 40,
    marginBottom: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  inputFrequent: {
    fontSize: 12.5,
    lineHeight: 15,
    marginLeft: 0,
    marginRight: 0,
    color: Colors.grey6,
  } as ViewStyle,
  header: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  dropdown: {
    marginTop: -5,
    marginBottom: 5,
  } as ViewStyle,
  toggleFrequentButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    borderRadius: 6,
    right: 2,
    top: 5,
    bottom: 5,
  } as ViewStyle,
  accountSelector: {
    marginBottom: 20,
  } as ViewStyle,
  toggleFrequentIcon: {
    width: 20,
    tintColor: Colors.secondary,
    height: 20,
  } as ImageStyle,
  amountInput: {
    marginTop: 7,
    marginBottom: 13,
  } as ViewStyle,
  targetRightStyle: {
    right: 0,
    top: 0,
    bottom: 0,
  } as ViewStyle,
  inputFrequentFocused: {
    color: Colors.grey6,
  } as ViewStyle,
  bannerBorder: {
    marginTop: 25,
    backgroundColor: Colors.white,
    borderColor: Colors.secondary,
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 12,
    padding: 10,
  } as ViewStyle,
  textBanner: {
    ...Font({weight: 'Medium'}),
    color: Colors.secondary,
    fontSize: 13,
    lineHeight: 17,
  } as TextStyle,
  bannerImage: {
    height: 24,
    width: 24,
    alignSelf: 'center',
    tintColor: Colors.secondary,
    marginRight: 10,
  } as ImageStyle,
  bannerMessageContainer: {
    flex: 1,
  } as ViewStyle,
  modalBankDoesntAcceptTitle: {
    fontSize: 18,
    lineHeight: 22,
    paddingHorizontal: 5,
    color: Colors.accentDark,
    textAlign: 'center',
    ...Font({weight: 'Bold'}),
    marginBottom: 10,
  } as TextStyle,
  modalBankDoesntAcceptParraph: {
    paddingHorizontal: 5,
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font(),
    marginBottom: 15,
  } as TextStyle,
  modalBankDoesntAcceptParraphSecond: {
    paddingHorizontal: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font(),
  } as TextStyle,
  textBold: {
    ...Font({weight: 'Bold'}),
  } as TextStyle,
});

const Length = {
  CCI: 20,
};

const TAG = '[TransfersOtherBanksChooseScreen]';

export interface Props extends NativeStackScreenProps<any, any> {}

export interface State {
  accounts: AccountItemSavingsAll[];
  frequentContacts: FrequentContact[];
  indexOrigin: number;
  indexCurrency: number;
  isLoading: boolean;
  isValid: boolean;
  currencies: Currency[];
  frequentContact?: FrequentContact;
  isTargetCompleted: boolean;
  showFrequentForm: boolean;
  scrollMinHeight: number;
  showFrequentDropdown: boolean;
  frequentFocused: boolean;
  isMessageBankDesntAccept: boolean;
}

class TransfersOtherBanksChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.transfersscreen_title,
  // };
  state: State = {
    accounts: [],
    frequentContacts: [],
    indexOrigin: -1,
    indexCurrency: 0,
    isLoading: false,
    isValid: false,
    currencies: [Currencies.PEN, Currencies.USD],
    frequentContact: undefined,
    isTargetCompleted: false,
    showFrequentForm: false,
    showFrequentDropdown: false,
    frequentFocused: false,
    scrollMinHeight: Size.getVisibleTabScreenHeight(),
    isMessageBankDesntAccept: false,
  };
  interaction!: any;
  timeoutScroll!: NodeJS.Timeout;
  timeoutHeight!: NodeJS.Timeout;
  amountInput!: TextInputAmount | null;
  originAccount!: AccountSelector | null;
  frequentInput!: TextInput | null;
  targetInput!: FrequentContact | TextInput | null;
  targetContainer!: View | null;
  scroll!: ScrollView | null;

  goBack = () => {
    this.props.navigation.navigate('TransfersHome');
  };
  getAccountOrigin = () => {
    const {accounts, indexOrigin} = this.state;
    if (indexOrigin < 0) {
      return;
    }
    return accounts[indexOrigin];
  };
  getCurrency = () => {
    const {currencies, indexCurrency, indexOrigin} = this.state;
    if (indexOrigin === -1) {
      return Currencies.PEN;
    }
    return currencies[indexCurrency];
  };

  componentDidMount() {
    Log.debug(TAG, 'componentDidMount');
    this.load();
  }

  componentWillUnmount() {
    Log.debug(TAG, 'componentWillUnmount');
    this.interaction && this.interaction.cancel();
    this.timeoutScroll && clearTimeout(this.timeoutScroll);
  }

  load = () => {
    const {route} = this.props;
    const allowedTransferTypes = [TransferType.IMMEDIATE, TransferType.LOCAL];

    let frequentContacts = route.params
      ? route.params.frequentContacts
        ? route.params.frequentContacts
        : []
      : [];

    frequentContacts = frequentContacts.filter((item: any) =>
      allowedTransferTypes.includes(item.type),
    );

    // const frequentContacts = this.props.navigation
    //   .getParam('frequentContacts', [])
    //   .filter((item: any) => allowedTransferTypes.includes(item.type));

    const accounts = route.params
      ? route.params.accounts
        ? route.params.accounts
        : []
      : [];
    const frequentContact = route.params && route.params.contact;

    // const accounts = this.props.navigation.getParam('accounts', []);
    // const frequentContact = this.props.navigation.getParam('contact');

    this.setState({accounts, frequentContact, frequentContacts}, () => {
      if (accounts.length === 1) {
        AnalyticsEvent.track(
          A.transfersotherbankschoosescreen_event_origin_autoassigned,
        );
        this.changeOriginAccountBase(0);
      }
    });
  };

  getIndexByCurrency = (currency: any) => {
    const {currencies} = this.state;
    return currencies.findIndex(
      item => item.label.toString() === currency.toString(),
    );
  };
  changeCurrency = (indexCurrency: number) => {
    this.amountInput && this.amountInput.setValue('');
    this.setState({indexCurrency});
  };
  changeOriginAccount = (indexOrigin: number) => {
    AnalyticsEvent.track(
      A.transfersotherbankschoosescreen_accountselector_origin,
    );
    this.targetInput && this.targetInput.focus();
    this.changeOriginAccountBase(indexOrigin);
  };
  isAvailabilityAlertEnabled = async () => {
    let isAvailabilityAlertEnabled = false;
    try {
      const value = await AsyncStorage.getItem('disable_availability_alert');
      isAvailabilityAlertEnabled = JSON.parse(value || '');
    } catch (e) {
      Log.info(TAG, 'isAvailabilityAlertEnabled error', e);
    }
    return isAvailabilityAlertEnabled;
  };
  changeOriginAccountBase = (indexOrigin: number) => {
    const {accounts} = this.state;
    const origin = accounts[indexOrigin];
    const indexCurrency = this.getIndexByCurrency(origin.currency);

    const isValid = origin.availableBalance > 0;
    if (isValid) {
      this.originAccount && this.originAccount.clearError();
    } else {
      this.originAccount &&
        this.originAccount.setError(
          L.transfersotherbankschoosescreen_origin_amount_zero,
        );
    }

    this.setState(
      {
        indexOrigin,
        indexCurrency,
      },
      () => {
        this.isValidSilent();
      },
    );
  };
  isValid = () => {
    const amountIsValid = this.isValidAmount();
    const targetIsValid = this.isValidTarget();
    const frequentIsValid = this.isValidFrequent();

    const {indexOrigin} = this.state;

    const isValid = [
      indexOrigin !== -1,
      amountIsValid,
      targetIsValid,
      frequentIsValid,
    ].every(item => item);

    this.setState({isValid});

    return isValid && NetworkManager.isConnected;
  };

  isValidSilent = () => {
    requestAnimationFrame(() => {
      this.isValidSilentDirect();
    });
  };
  isValidSilentDirect = () => {
    const {indexOrigin, showFrequentForm} = this.state;
    const target = this.targetInput ? this.targetInput.getValue() : '';
    const amount = this.amountInput ? this.amountInput.getValue() : 0;

    const isValidAmount = amount > 0;
    const isValidOrigin = indexOrigin !== -1;
    const isValidTarget = target.length === Length.CCI;

    if (showFrequentForm) {
      const frequent = this.frequentInput ? this.frequentInput.getValue() : '';
      const isValidFrequent = frequent !== '';

      const isValid =
        isValidFrequent && isValidAmount && isValidOrigin && isValidTarget;
      this.setState({isValid});
      return;
    }

    const isValid = isValidAmount && isValidOrigin && isValidTarget;
    this.setState({isValid});
  };

  resetMinHeight = () => {
    return new Promise<void>(resolve => {
      this.timeoutHeight && clearTimeout(this.timeoutHeight);
      this.timeoutHeight = setTimeout(() => {
        const scrollMinHeight = Size.getVisibleTabScreenHeight();
        this.setState({scrollMinHeight}, () => {
          resolve();
        });
      }, 300);
    });
  };
  onBlurTarget = async () => {
    const {showFrequentDropdown} = this.state;
    if (showFrequentDropdown) {
      this.hideTargetDropdown();
    } else {
      await this.resetMinHeight();
      this.isValidSilent();
    }
  };
  onFocusTarget = () => {
    this.showTargetDropdownIfEmpty();
  };

  componentDidUpdate(_prevProps: Props, prevState: State) {
    const {showFrequentDropdown} = this.state;
    if (
      prevState.showFrequentDropdown !== showFrequentDropdown &&
      showFrequentDropdown
    ) {
      this.targetInput && this.targetInput.clearError();
    }
  }

  showFrequentContactDropdown = () => {
    this.setState({frequentContact: undefined}, () => {
      this.targetInput && this.targetInput.focus();
    });
  };

  closeMessageBankDoesntAccept = () => {
    this.setState({isMessageBankDesntAccept: false});
  };

  goToWeb = async () => {
    try {
      await Linking.openURL(Config.settings.frontendUrl);
    } catch (e) {
      Log.debug(TAG, 'goToLoans', e);
    }
  };

  onPressFrequentContactItem = (index: number) => {
    AnalyticsEvent.track(
      A.transfersotherbankschoosescreen_selectfrequentcontactdropdown_item,
    );
    this.targetInput && this.targetInput.blur();
    this.onChangeTarget('');
    this.hideTargetDropdown();
    const {frequentContacts} = this.state;
    const frequentContact = frequentContacts[index];
    this.setState({frequentContact}, () => {
      this.isValidSilent();
    });
  };

  isValidAmount = () => {
    if (!this.amountInput) {
      return false;
    }
    const isValid = this.amountInput.isValid();
    if (!isValid) {
      return false;
    }

    const amount = this.amountInput.getValue();
    if (amount < this.getMinAmount()) {
      this.amountInput.setError(
        `${
          L.transfersotherbankschoosescreen_textinput_amount_minimal_error
        } ${this.getMinAmountFormatted()}`,
      );
      return false;
    }
    if (amount > this.getMaxAmount()) {
      this.amountInput.setError(
        `${
          L.transfersotherbankschoosescreen_textinput_amount_limit_error
        } ${this.getMaxAmountFormatted()}`,
      );
      return false;
    }
    if (!this.isValidFunds(amount)) {
      this.amountInput.setError(
        L.transfersotherbankschoosescreen_textinput_amount_balance_error,
      );
      return false;
    }
    return true;
  };

  isValidTarget = () => {
    if (!this.targetInput) {
      return false;
    }
    return this.targetInput.isValid();
  };
  isValidFrequent = () => {
    const {showFrequentForm} = this.state;
    if (showFrequentForm) {
      const frequent = this.frequentInput ? this.frequentInput.getValue() : '';
      const isValidFrequent = frequent !== '';

      if (!isValidFrequent) {
        this.frequentInput &&
          this.frequentInput.setError(
            L.transfersotherbankschoosescreen_textinput_frequent_empty_error,
          );
        return false;
      }
    }
    return true;
  };

  isValidFunds = (amount: number) => {
    const accountOrigin = this.getAccountOrigin();
    if (!accountOrigin) {
      return false;
    }
    return amount <= accountOrigin.availableBalance;
  };

  onBlurAmount = () => {
    if (!this.amountInput) {
      return;
    }
    this.isValidAmount();
    this.isValidSilent();
  };

  clearAmount = () => {
    if (!this.amountInput) {
      return;
    }
    if (this.amountInput.getValue() <= 0) {
      this.amountInput.setValue('');
    }
  };

  tryToSubmit = () => {
    this.blur();

    this.interaction && this.interaction.cancel();
    this.interaction = InteractionManager.runAfterInteractions(async () => {
      const isValid = this.isValid();
      if (!isValid) {
        return;
      }

      this.setState({isLoading: true});
      await this.submit();
      this.setState({isLoading: false});
    });
  };
  getFrequentContactName = () => {
    const {showFrequentForm} = this.state;
    if (!showFrequentForm) {
      return;
    }
    return this.frequentInput ? this.frequentInput.getValue() : '';
  };
  submit = async () => {
    if (!Session.hasPhone()) {
      Emitter.emit<AlertEvent>('onAlertUpdate', {
        tag: TAG,
        method: 'submit',
        e: '',
      });
      return;
    }
    try {
      this.blur();
      const {navigation} = this.props;
      const origin = this.getAccountOrigin();
      const currency = this.getCurrency();
      const targetInput = this.targetInput ? this.targetInput.getValue() : '';
      const amountInput = this.amountInput
        ? this.amountInput.getValue().toString()
        : '';
      const response = await API.Execute.transferInterbankInmediatePreview(
        origin ? origin.idProduct : '',
        {
          quantity: amountInput,
          currency: currency ? currency.label : '',
        },
        targetInput,
        Config.settings.emailTransfersImmediate,
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      const body = response.body;
      const data = body.data;
      if (body.code === API.ResponseCode.OK) {
        const resume = data;
        const {frequentContact} = this.state;
        const frequentContactName = this.getFrequentContactName();
        navigation.navigate('TransfersOtherBanksConfirm', {
          resume,
          origin,
          currency,
          frequentContact,
          frequentContactName,
          amountInput,
          targetInput,
        });
        return;
      }

      this.responseError(data);
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  responseError = (data: any) => {
    let hasError = false;
    const {destinationAccount, amount, NO_FIELD} = data;
    if (destinationAccount) {
      if (
        destinationAccount.includes(
          TransfersOtherBanksErrors.config.blockedAccount,
        )
      ) {
        this.targetInput &&
          this.targetInput.setError(
            L.transfersotherbankschoosescreen_target_invalid_blocked,
          );
      } else if (
        destinationAccount.includes(
          TransfersOtherBanksErrors.config.differentCurrency,
        )
      ) {
        this.targetInput &&
          this.targetInput.setError(
            L.transfersotherbankschoosescreen_target_different_currency,
          );
      } else if (
        destinationAccount.includes(
          TransfersOtherBanksErrors.config.bankDoesntAccept,
        )
      ) {
        this.setState({isMessageBankDesntAccept: true});
      } else {
        this.targetInput &&
          this.targetInput.setError(
            L.transfersotherbankschoosescreen_target_invalid,
          );
      }
      hasError = true;
    }
    if (amount) {
      if (amount.includes(TransfersOtherBanksErrors.config.amountLimit)) {
        this.amountInput &&
          this.amountInput.setError(
            L.transfersotherbankschoosescreen_textinput_amount_limit_error,
          );
      } else {
        this.amountInput && this.amountInput.setError(amount);
      }
      hasError = true;
    }
    if (NO_FIELD && !hasError) {
      if (NO_FIELD.includes(TransfersOtherBanksErrors.config.sameBank)) {
        this.targetInput &&
          this.targetInput.setError(
            L.transfersotherbankschoosescreen_target_same_bank,
          );
      } else {
        this.targetInput && this.targetInput.setError(NO_FIELD);
      }
      hasError = true;
    }
    !hasError &&
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'responseError',
        e: ErrorRequest.Default,
      });
  };

  blur = () => {
    KeyboardUtil.hide();
  };
  onSubmitEditingTarget = () => {
    const {showFrequentForm} = this.state;
    const isValid = this.isValidTarget();
    if (!isValid) {
      return;
    }
    if (showFrequentForm) {
      this.frequentInput && this.frequentInput.focus();
    } else {
      this.amountInput && this.amountInput.focus();
    }
  };
  onSubmitEditingFrequent = () => {
    const isValid = this.isValidFrequent();
    if (!isValid) {
      return;
    }
    this.amountInput && this.amountInput.focus();
  };
  onChangeTarget = (value: string) => {
    const isValid = !!value;

    this.setState({
      isTargetCompleted: value.length === Formats.CCI.format.length,
      showFrequentDropdown: !isValid,
      showFrequentForm: false,
    });
  };

  onFocusFrequent = () => {
    this.setState({frequentFocused: true});

    this.showTargetDropdownIfEmpty();
  };
  onBlurFrequent = async () => {
    this.setState({frequentFocused: false});
    await this.resetMinHeight();
    this.isValidSilent();
  };

  hideTargetDropdown = async () => {
    this.setState({showFrequentDropdown: false}, () => {
      this.isValidSilent();
    });

    await this.resetMinHeight();
    if (this.hasFrequentContacts()) {
      this.timeoutScroll && clearTimeout(this.timeoutScroll);
      this.timeoutScroll = setTimeout(() => {
        this.scroll &&
          this.scroll.scrollTo({
            y: 0,
            animated: true,
          });
      }, 100);
    }
  };
  showTargetDropdownIfEmpty = () => {
    if (this.targetInput) {
      const target = this.targetInput.getValue();
      this.showTargetDropdown(!target);
    }
  };
  showTargetDropdown = async (showFrequentDropdown = true) => {
    this.timeoutHeight && clearTimeout(this.timeoutHeight);
    try {
      if (this.hasFrequentContacts()) {
        const {y} = await this.measureTargetContainer();
        this.timeoutHeight && clearTimeout(this.timeoutHeight);
        const scrollMinHeight = Size.getVisibleScreenHeight() + y;
        this.setState(
          {
            scrollMinHeight,
            showFrequentDropdown,
          },
          () => {
            this.timeoutScroll && clearTimeout(this.timeoutScroll);
            this.timeoutScroll = setTimeout(() => {
              this.scroll && this.scroll.scrollTo({y, animated: true});
            }, 100);
          },
        );
      }
    } catch (e) {
      Log.warn(TAG, 'showTargetDropdown', e);
    }

    this.setState({showFrequentDropdown}, () => {
      this.isValidSilent();
    });
  };
  measureTargetContainer = (): Promise<{x: number; y: number}> => {
    return new Promise((resolve, reject) => {
      const scrollNode = findNodeHandle(this.scroll);
      if (!this.targetContainer || !scrollNode) {
        reject();
        return;
      }

      this.targetContainer.measureLayout(
        scrollNode,
        (x, y) => {
          resolve({x, y});
        },
        () => {
          reject();
        },
      );
    });
  };

  hasFrequentContacts = () => {
    const {frequentContacts} = this.state;
    return frequentContacts && frequentContacts.length > 0;
  };

  toggleFrequentForm = () => {
    const showFrequentForm = !this.state.showFrequentForm;
    this.setState(
      {
        showFrequentForm,
      },
      () => {
        showFrequentForm && this.frequentInput && this.frequentInput.focus();
      },
    );
  };
  renderFrequentIcon = () => {
    const {isTargetCompleted, showFrequentForm} = this.state;

    let frequentImage = require('../../../../assets/images/frequent-icon-inactive.png');
    if (showFrequentForm) {
      frequentImage = require('../../../../assets/images/frequent-icon-full.png');
    } else if (isTargetCompleted) {
      frequentImage = require('../../../../assets/images/frequent-icon-active.png');
    }
    return (
      <Touchable
        onPress={isTargetCompleted ? this.toggleFrequentForm : undefined}
        activeOpacity={isTargetCompleted ? 0.2 : 1}
        style={styles.toggleFrequentButton}
        accessibilityLabel={
          'transfersotherbankschoosescreen_touchable_toggle_frequent'
        }>
        <Image source={frequentImage} style={styles.toggleFrequentIcon} />
      </Touchable>
    );
  };

  getMinAmount = () => {
    const currency = this.getCurrency();
    if (currency.label === Currencies.USD.label) {
      return Config.settings.limitMinTransfersOtherBanksPEN;
    }

    return Config.settings.limitMinTransfersOtherBanksPEN;
  };
  getMinAmountFormatted = () => {
    const currency = this.getCurrency();
    return Amount.format(this.getMinAmount(), currency.label);
  };

  getMaxAmount = () => {
    const currency = this.getCurrency();
    if (currency.label === Currencies.USD.label) {
      return Config.settings.limitTransfersOtherBanksUSD;
    }

    return Config.settings.limitTransfersOtherBanksPEN;
  };
  getMaxAmountFormatted = () => {
    const currency = this.getCurrency();
    return Amount.format(this.getMaxAmount(), currency.label);
  };

  renderTarget() {
    const {
      frequentContacts,
      showFrequentDropdown,
      showFrequentForm,
      frequentFocused,
    } = this.state;
    const hasFrequentContacts = this.hasFrequentContacts();
    const icon = this.renderFrequentIcon();
    return (
      <>
        <SectionHeader
          accessibilityLabel={
            'transfersotherbankschoosescreen_sectionheader_target'
          }
          title={L.transfersotherbankschoosescreen_sectionheader_target}
        />
        <TextInput
          keyboardType={'numeric'}
          autoCorrect={false}
          focusMode={hasFrequentContacts ? 'none' : undefined}
          blurOnSubmit={false}
          accessibilityLabel={
            'transfersotherbankschoosescreen_textinput_target'
          }
          autoCapitalize={'none'}
          returnKeyType={'next'}
          ref={ref => {
            this.targetInput = ref;
          }}
          onChangeText={this.onChangeTarget}
          formatText={Formats.CCI}
          onBlur={this.onBlurTarget}
          onFocus={this.onFocusTarget}
          onSubmitEditing={this.onSubmitEditingTarget}
          showClearButton={false}
          rightContainer={icon}
          rightContainerStyle={styles.targetRightStyle}>
          {showFrequentDropdown && hasFrequentContacts && (
            <SelectFrequentContactDropdown
              accessibilityLabel={
                'transfersotherbankschoosescreen_selectfrequentcontactdropdown'
              }
              onPressItem={this.onPressFrequentContactItem}
              values={frequentContacts}
              style={styles.dropdown}
            />
          )}
        </TextInput>
        {showFrequentForm && (
          <TextInput
            autoCorrect={false}
            blurOnSubmit
            focusMode={hasFrequentContacts ? 'none' : undefined}
            accessibilityLabel={
              'transfersotherbankschoosescreen_textinput_frequent'
            }
            autoCapitalize={'none'}
            label={L.transfersotherbankschoosescreen_textinput_frequent}
            returnKeyType={'done'}
            style={[
              styles.inputFrequent,
              frequentFocused && styles.inputFrequentFocused,
            ]}
            ref={ref => {
              this.frequentInput = ref;
            }}
            onFocus={this.onFocusFrequent}
            onBlur={this.onBlurFrequent}
            onSubmitEditing={this.onSubmitEditingFrequent}
            showClearButton={false}
          />
        )}
      </>
    );
  }

  render() {
    const {
      isLoading,
      indexOrigin,
      accounts,
      isValid,
      frequentContact,
      scrollMinHeight,
      isMessageBankDesntAccept,
    } = this.state;
    const {isFocused} = this.props;
    const currency = this.getCurrency();
    return (
      <Container>
        <Alert
          visible={isMessageBankDesntAccept}
          message={
            <View>
              <Text style={styles.modalBankDoesntAcceptTitle}>
                <Text>
                  {L.transfersotherbankschoosescreen_modal_bankdoesnt_title}
                </Text>
              </Text>
              <Text style={styles.modalBankDoesntAcceptParraph}>
                {L.transfersotherbankschoosescreen_modal_bankdoesnt_text_part1}
              </Text>

              <Text style={styles.modalBankDoesntAcceptParraphSecond}>
                {L.transfersotherbankschoosescreen_modal_bankdoesnt_text_part2}
                <Text style={styles.textBold}>
                  {
                    L.transfersotherbankschoosescreen_modal_bankdoesnt_text_part3
                  }
                </Text>
                {L.transfersotherbankschoosescreen_modal_bankdoesnt_text_part4}
              </Text>
            </View>
          }
          onClose={this.closeMessageBankDoesntAccept}
          actionButton={{
            accessibilityLabel:
              'transfersotherbankschoosescreen_button_closebankdoesntaccept',
            title:
              L.transfersotherbankschoosescreen_modal_button_closebankdoesntaccept,
            onPress: this.goToWeb,
          }}
          cancelButton={{
            accessibilityLabel:
              'transfersotherbankschoosescreen_button_actionbankdoesntaccept',
            title:
              L.transfersotherbankschoosescreen_modal_button_actionbankdoesntaccept,
            onPress: this.closeMessageBankDoesntAccept,
          }}
        />
        <FormSteps total={3} current={1} />
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
              <View accessibilityLabel={'banner'} style={styles.bannerBorder}>
                <Image
                  accessibilityLabel={'feeitem_checkbox_active'}
                  style={styles.bannerImage}
                  resizeMode={'contain'}
                  source={require('../../../../assets/images/info-icon.png')}
                />
                <View style={styles.bannerMessageContainer}>
                  <Text style={styles.textBanner}>
                    {L.transfersotherbankschoosescreen_banner_text}
                  </Text>
                </View>
              </View>
              <Header
                style={styles.header}
                center
                accessibilityLabel={
                  'transfersotherbankschoosescreen_sectionheader_accounts'
                }
                title={
                  L.transfersotherbankschoosescreen_sectionheader_title_part1
                }
              />
              <CardView
                accessibilityLabel={'transfersotherbankschoosescreen_cardview'}
                padding>
                <AccountSelector
                  accessibilityLabel={
                    'transfersotherbankschoosescreen_accountselector_title_origin'
                  }
                  ref={ref => {
                    this.originAccount = ref;
                  }}
                  title={
                    L.transfersotherbankschoosescreen_accountselector_title_origin
                  }
                  placeholder={
                    L.transfersotherbankschoosescreen_accountselector_placeholder_origin
                  }
                  values={accounts}
                  selectedIndex={indexOrigin}
                  readOnly={accounts.length === 1}
                  onPress={this.changeOriginAccount}
                  style={styles.accountSelector}
                />
                {!frequentContact && this.renderTarget()}
                {!!frequentContact && (
                  <FrequentContact
                    title={
                      L.transfersotherbankschoosescreen_sectionheader_target
                    }
                    accessibilityLabel={
                      'transfersotherbankschoosescreen_textinput_target'
                    }
                    containerStyle={{marginBottom: 20}}
                    ref={ref => {
                      this.targetInput = ref;
                    }}
                    onPress={
                      this.hasFrequentContacts()
                        ? this.showFrequentContactDropdown
                        : undefined
                    }
                    formatText={Formats.CCI}
                    frequentContact={frequentContact}
                  />
                )}
                <SectionHeader
                  accessibilityLabel={
                    'transfersotherbankschoosescreen_sectionheader_amount'
                  }
                  title={L.transfersotherbankschoosescreen_sectionheader_amount}
                  subtitle={`${
                    L.transfersotherbankschoosescreen_sectionheader_amount_subtitle_part1
                  } ${this.getMinAmountFormatted()} ${
                    L.transfersotherbankschoosescreen_sectionheader_amount_subtitle_part2
                  }  ${this.getMaxAmountFormatted()}`}
                />
                <TextInputAmount
                  focusMode={'center'}
                  returnKeyType={'done'}
                  keyboardType={'decimal-pad'}
                  showClearButton={false}
                  autoCorrect={false}
                  containerStyle={styles.amountInput}
                  onFocus={this.clearAmount}
                  blurOnSubmit
                  accessibilityLabel={
                    'transfersotherbankschoosescreen_textinput_amount'
                  }
                  autoCapitalize={'none'}
                  currency={currency ? currency.symbol : undefined}
                  ref={ref => {
                    this.amountInput = ref;
                  }}
                  formatText={Formats.Amount}
                  onBlur={this.onBlurAmount}
                />
              </CardView>

              <Button
                style={styles.buttons}
                disabled={!isValid}
                allowOnPress
                accessibilityLabel={
                  'transfersotherbankschoosescreen_button_continue'
                }
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.transfersotherbankschoosescreen_button_continue}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type TransfersOtherBanksChooseScreenType =
  TransfersOtherBanksChooseScreen;
export default withFocused<TransfersOtherBanksChooseScreen, Props>(
  TransfersOtherBanksChooseScreen,
);
