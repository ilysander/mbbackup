import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  Header,
  FormSteps,
  CardView,
  TextInputMasked,
  Button,
  Loading,
  Alert,
  AlertModalUpdate,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import AccountSelector from '../../../components/transfers/AccountSelector';
import Log from '../../../resources/log/Log';
import API from '../../../api';
import { Validate, Font, Sanitizer } from '../../../resources/functions';
import {
  AccountsType,
  Colors,
  ErrorRequest,
} from '../../../resources/constants';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  View,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  InteractionManager,
  ImageStyle,
} from 'react-native';
import { MaskObj } from '../../../resources/persistence/models';
import NetworkManager from '../../../components/network/NetworkManager';
import { Amount } from '../../../resources/money';
import {
  ContentCreditLine,
  AccountItemSavingsAll,
  InsuranceItem,
  PreferencesUserDataModifyPreResponse,
  OptionListChip,
  DigitalProductOptions,
  DigitalLoanPreviewResponse,
} from '../../../api/backend/response/Execute';
import Session from '../../../api/Session';
import { KeyboardUtil } from '../../../resources/util';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import ExpandableView from '../../../components/ui/ExpandableView';
import AnalyticsEvent from '../../../resources/analytics/AnalyticsEvent';
import { A } from '../../../resources/analytics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  formText: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
  } as TextStyle,
  formLabel: {
    marginBottom: 20,
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as ViewStyle,
  formLabelError: {
    marginBottom: 20,
    ...Font(),
    color: Colors.danger,
    fontSize: 14,
  } as ViewStyle,
  detailText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  detailTextBold: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  textHelp: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.accentDark,
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
  supplyCode: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 19,
  } as TextStyle,

  buttons: {
    marginBottom: 50,
    marginTop: 40,
  } as ViewStyle,
  marginTop: {
    marginTop: 20,
  } as ViewStyle,
  titleStyle: {
    fontSize: 30,
    lineHeight: 36,
  } as TextStyle,
  card: {
    paddingTop: 20,
    paddingBottom: 0,
    marginTop: 16,
  } as ViewStyle,
  cardMore: {
    paddingTop: 0,
    paddingBottom: 6,
    marginTop: 8,
  } as ViewStyle,
  cardOptions: {
    paddingTop: 0,
    paddingBottom: 6,
    marginTop: 6,
    marginBottom: 6,
  } as ViewStyle,
  subtitle: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 18,
    textAlign: 'center',
    color: Colors.grey6,
  } as TextStyle,
  subtitleGreen: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primaryLight,
  } as TextStyle,
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  detailsRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  insurancesTitle: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 14,
    paddingTop: 0,
  } as TextStyle,
  insuranceDescription: {
    marginBottom: 13,
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  insuranceAmount: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 15,
  } as TextStyle,
  header: {
    marginVertical: 6,
  } as ViewStyle,
  expandableView: {
    paddingHorizontal: 20,
    marginTop: 10,
  } as ViewStyle,
  detailsLoading: {
    marginVertical: 20,
  } as ViewStyle,
  feeLoading: {
    marginVertical: 0,
  } as ViewStyle,
  alertTextTitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    fontSize: 18,
    color: Colors.accentDark,
    marginBottom: 20,
    marginTop: 10,
  } as TextStyle,
  alertTextMessage: {
    ...Font(),
    fontSize: 16,
    color: Colors.grey6,
    textAlign: 'center',
  } as TextStyle,
  alertButton: {
    width: '100%',
  } as ViewStyle,
  itemSelector: {
    marginBottom: 20,
  } as ViewStyle,

  forgotPassword: {
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,

  titleButtonSignUp: {
    fontSize: 16,
  } as TextStyle,
  titleButtonPassword: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  iconButtonForgot: {
    tintColor: Colors.primaryLight,
    width: 6,
    marginLeft: 6,
  } as ImageStyle,
  editEmail: {
    marginTop: 2,
  } as ViewStyle,
  infoDocumentModal: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  } as ViewStyle,
  textActionInfoDocument: {
    color: 'white',
    fontSize: 16,
  } as TextStyle,
  viewActionInfoDocument: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    width: 280,
    height: 40,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  titleModalText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 18,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  insurancesContainer: {
    marginTop: 27,
  },
  insurancesTextContainer: {
    paddingLeft: 35,
    paddingTop: 0,
  },
  insuranceMoreContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  insuranceMoreSymbol: {
    fontSize: 30,
    paddingRight: 5,
    lineHeight: 30,
    marginBottom: 20,
    ...Font(),
    color: Colors.grey5,
  } as TextStyle,
  insuranceMoreDescription: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    fontSize: 13,
    paddingRight: 20,
  } as TextStyle,
  insuranceMoreTitle: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 11,
    marginBottom: 4,
    marginTop: 14,
  } as TextStyle,
  helpButtonIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.secondary,
  } as ImageStyle,
  helpRememberButtonIcon: {
    paddingLeft: 6,
  } as ImageStyle,
});
export interface Params {
  locked: boolean;
  optionSelected: OptionListChip;
  newProduct: DigitalProductOptions;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  indexTarget: number;
  optionList: number[];
  isLoading: boolean;
  accounts: AccountItemSavingsAll[];
  insurances: InsuranceItem[];
  creditLine?: ContentCreditLine;
  optionItemToRemove?: string;
  emailMasked?: MaskObj;
  user?: PreferencesUserDataModifyPreResponse;
  isValid: boolean;
  showLockAlert: boolean;
  locked: boolean;
  isShowModalCancel: boolean;
  isLoadingFee: boolean;
}
const TAG = '[InstantCashFastChooseScreen]';
class InstantCashFastChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.instantcashfastchoosescreen_title,
  };

  state: State = {
    indexTarget: -1,
    optionList: [0, 1, 2, 3],
    optionItemToRemove: undefined,
    isLoading: false,
    creditLine: undefined,
    accounts: [],
    insurances: [],
    isValid: false,
    showLockAlert: false,
    locked: false,
    isShowModalCancel: false,
    isLoadingFee: false,
  };

  interaction!: any;
  target!: AccountSelector | null;
  emailInput!: TextInputMasked | null;

  componentDidMount() {
    AnalyticsEvent.track(A.seed_instafastcash_pas1 + '_inicio');
    this.load();
  }

  load = async () => {
    await this.loadAccounts();
    await this.loadProfile();
    const { route } = this.props;

    const locked = route.params && route.params.locked || false;
    const { user } = this.state;
    if (user && user._mail) {
      const masked = Sanitizer.maskEmail(user._mail);
      const emailMasked = MaskObj.init(user._mail, masked);
      this.setState({ emailMasked });
      this.isValid(false);
    }
    this.setState({ locked, isLoadingFee: false });
  };
  loadProfile = async () => {
    const { isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.preferencesUserDataModifyPre();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadProfile', response);
      }
      const user = response.body.data;
      this.setState({ user });
    } catch (e) {
      Log.exception(TAG, 'loadProfile', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadProfile',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  loadAccounts = async () => {
    const { isLoading } = this.state;
    if (isLoading) {
      Log.info(TAG, 'loadAccounts', 'now already isLoading');
      return;
    }
    this.setState({ isLoading: true });
    try {
      const response = await API.Execute.accountList();
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'loadAccounts', response);
      }
      let { accounts } = response.body.data;
      const validTypes = [AccountsType.SAVING_ACCOUNTS.family];
      accounts = (accounts || []).filter(account =>
        validTypes.includes(account.family)
      );
      const indexTarget = accounts.length > 1 ? -1 : 0;
      this.setState({ accounts, indexTarget });
    } catch (e) {
      Log.info(TAG, 'loadAccounts', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'loadAccounts',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  changeTargetAccount = (indexTarget: number) => {
    this.setState({ indexTarget }, () => {
      this.isValidAccountTarget();
      this.isValid(false);
    });
  };

  getEmail = () => {
    const { emailMasked } = this.state;
    if (emailMasked) {
      return emailMasked.value;
    }
    return this.emailInput ? this.emailInput.getValue() : '';
  };

  onPressInputEmail = () => {
    this.setState({ emailMasked: undefined, isValid: false }, () => {
      this.emailInput && this.emailInput.focus();
    });
  };

  onSubmitEditingEmail = () => {
    this.isValidEmail(true);
    this.isValid(false);
  };

  onEmptyStateEmail = () => {
    this.isValidEmail(true);
    this.isValid(false);
  };

  isValid = (showError = true) => {
    const isValidAccountTarget = this.isValidAccountTarget(showError);
    const isValidEmail = this.isValidEmail(showError);
    const isValid = [isValidAccountTarget, isValidEmail].every(item => !!item);
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };
  isValidEmail = (showError = true) => {
    const value = this.getEmail();
    if (!value) {
      showError &&
        this.emailInput &&
        this.emailInput.setError(
          L.instantcashfastchoosescreen_textinput_email_error_empty
        );
      return false;
    }

    const isValid = Validate.email(value);
    if (!isValid) {
      showError &&
        this.emailInput &&
        this.emailInput.setError(
          L.instantcashfastchoosescreen_textinput_email_error_format
        );
      return false;
    }
    return true;
  };
  isValidAccountTarget = (showError = true) => {
    if (!this.target) {
      return false;
    }
    showError && this.target.clearError();
    const { indexTarget } = this.state;
    if (indexTarget === -1) {
      showError &&
        this.target.setError(
          L.instantcashfastchoosescreen_error_account_target
        );
      return false;
    }
    return true;
  };

  getAccountTarget = () => {
    const { accounts, indexTarget } = this.state;
    if (indexTarget < 0) {
      return undefined;
    }
    return accounts[indexTarget];
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
      this.setState({ isLoading: true });
      await this.submit();
      this.setState({ isLoading: false });
    });
  };

  submit = async () => {
    const { route } = this.props;
    const target = this.getAccountTarget();
    const email = this.getEmail();
    if (!target) {
      return;
    }
    const targetId = target.idProduct;

    const newProduct = route.params && route.params.newProduct;
    const optionSelected = route.params && route.params.optionSelected;

    try {
      const response = await API.Execute.loanRequestDigitalPreview({
        requestNumber: newProduct.request.number,
        amount: newProduct.request.amount,
        payDay: newProduct.request.payDay,
        amountFee: optionSelected.amountFee,
        creditProductId: targetId,
        interestRate: optionSelected.rate,
        documents: {
          delivery: {
            type: 1,
            destination: email,
          },
        },
        wayToPay: 1,
      });
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data as DigitalLoanPreviewResponse;
        this.props.navigation.navigate('InstantCashFastConfirm', {
          resume,
          newProduct,
          optionSelected,
          email,
          targetId,
        });
        return;
      }

      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.creditAccount) {
        this.target && this.target.setError(error.creditAccount);
        hasError = true;
      }

      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  closeLockAlert = () => {
    this.setState({ showLockAlert: false });
  };

  actionModal = () => {
    this.setState({ isShowModalCancel: !this.state.isShowModalCancel });
  };

  render() {
    const {
      indexTarget,
      accounts,
      emailMasked,
      isValid,
      isLoading,
      isLoadingFee,
    } = this.state;
    const { route } = this.props;
    const { showLockAlert, insurances } = this.state;

    const newProduct = route.params && route.params.newProduct;
    const optionSelected = route.params && route.params.optionSelected;

    const currency = newProduct.request.currency.id + '';

    const dataPreview = {
      term: newProduct.request.term + '',
      amountFee: optionSelected.amountFee,
      insuranceDisposalRate: optionSelected.insuranceDisposalRate,
      insuranceDisposal: optionSelected.insuranceDisposal,
      itf: optionSelected.itf,
      rate: optionSelected.rate,
    };

    return (
      <Container>
        {showLockAlert && (
          <Alert
            message={
              <View>
                <Text style={styles.alertTextTitle}>
                  {L.instantcashfastchoosescreen_alert_title}
                </Text>
                <Text style={styles.alertTextMessage}>
                  {L.instantcashfastchoosescreen_alert_message}
                </Text>
              </View>
            }
            actionButton={{
              accessibilityLabel:
                'instantcashfastchoosescreen_alert_button_agree',
              onPress: this.closeLockAlert,
              title: L.instantcashfastchoosescreen_alert_button_agree,
              style: styles.alertButton,
            }}
          />
        )}
        <FormSteps current={1} total={3} />
        <SafeAreaView>
          <KeyboardAvoidingView
            enabled={true}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{
              minHeight: Size.getVisibleTabScreenHeight() - 20,
            }}
          >
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <Header
                accessibilityLabel={'instantcashfastchoosescreen_header_title'}
                style={styles.marginTop}
                title={L.instantcashfastchoosescreen_header_title}
                center
              />
              <Header
                accessibilityLabel={'instantcashfastchoosescreen_header_amount'}
                title={Amount.formatWithZero(
                  newProduct.request.amount,
                  currency.toString()
                )}
                style={styles.header}
                titleStyle={styles.titleStyle}
                center
              />
              <AlertModalUpdate
                titleStyle={styles.titleModalText}
                title={L.instantcashfastchoosescreen_alertmodal_title}
                message={`${L.instantcashfastchoosescreen_alertmodal_messagepart1}\n\n${L.instantcashfastchoosescreen__alertmodal_messagepart2}`}
                messageStyle={styles.infoDocumentModal}
                visible={this.state.isShowModalCancel}
                actionButton={{
                  accessibilityLabel:
                    'instantcashfastchoosescreen_alertmodal_actionbutton',
                  title: L.instantcashfastchoosescreen_alertmodal_button,
                  preventClose: true,
                  onPress: this.actionModal,
                  textStyle: styles.textActionInfoDocument,
                  light: true,
                  style: styles.viewActionInfoDocument,
                }}
                onClose={this.actionModal}
              />

              {dataPreview && (
                <>
                  <View style={styles.summaryContainer}>
                    <Text style={styles.subtitle}>
                      <Text style={styles.subtitleGreen}>
                        {dataPreview.term}{' '}
                        {dataPreview.term === '1'
                          ? L.instantcashfastchoosescreen_text_part1_singular
                          : L.instantcashfastchoosescreen_text_part1_plural}
                      </Text>
                      {L.instantcashfastchoosescreen_text_part2}
                    </Text>
                    {isLoadingFee ? (
                      <Loading style={styles.feeLoading} />
                    ) : (
                      <Text style={styles.subtitle}>
                        <Text style={styles.subtitleGreen}>
                          {Amount.format(dataPreview.amountFee, currency)}
                        </Text>
                      </Text>
                    )}

                    <Text style={styles.subtitle}>
                      <Text>{L.instantcashfastchoosescreen_text_part3}</Text>
                    </Text>
                  </View>

                  <ExpandableView
                    accessibilityLabel={
                      'instantcashfastchoosescreen_resume_toogle_active'
                    }
                    style={styles.expandableView}
                    maxHeight={
                      insurances.filter(item => item.selected).length * 15 + 140
                    }
                  >
                    <View style={[styles.detailsRow, { marginTop: 10 }]}>
                      <Text style={styles.detailText}>
                        {L.instantcashfastchoosescreen_text_insurance}
                        {'('}
                        {dataPreview.insuranceDisposalRate}
                        {'%)'}{' '}
                      </Text>
                      <Text style={styles.detailText}>
                        {Amount.format(dataPreview.insuranceDisposal, currency)}
                      </Text>
                    </View>
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailText}>
                        {L.instantcashfastchoosescreen_text_itf}{' '}
                      </Text>
                      <Text style={styles.detailText}>
                        {Amount.format(dataPreview.itf, currency)}
                      </Text>
                    </View>
                    {insurances
                      .filter(item => item.selected)
                      .map(insurance => {
                        return (
                          <View style={styles.detailsRow} key={insurance.id}>
                            <Text style={styles.detailTextBold}>
                              {insurance.product.description}
                            </Text>
                            <Text style={styles.detailTextBold}>
                              {Amount.format(insurance.amount, currency)}
                            </Text>
                          </View>
                        );
                      })}
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailTextBold}>
                        {L.instantcashfastchoosescreen_text_amounttodisburse}
                      </Text>
                      <Text style={styles.detailTextBold}>
                        {Amount.format(newProduct.request.amount, currency)}
                      </Text>
                    </View>
                    <View style={styles.detailsRowBottom}>
                      <Text style={styles.detailTextBold}>
                        {L.instantcashfastchoosescreen_text_tcea}
                      </Text>
                      <Text style={styles.detailTextBold}>
                        {dataPreview.rate}
                        {'%'}
                      </Text>
                    </View>
                    <Text style={styles.detailText}>
                      {L.instantcashfastchoosescreen_text_help}
                    </Text>
                  </ExpandableView>
                </>
              )}

              <CardView padding style={styles.card}>
                <AccountSelector
                  readOnly={accounts.length < 2} // AccountSelector[readOnly] Esto es porque en esta vista se inicia sin cuentas, en la carga aparece 'seleccionar' cuando no tiene niguna, deberia tener un loader dentro del componente
                  accessibilityLabel={
                    'instantcashfastchoosescreen_accountselector_title_target'
                  }
                  title={
                    L.instantcashfastchoosescreen_accountselector_title_target
                  }
                  ref={ref => {
                    this.target = ref;
                  }}
                  values={accounts}
                  selectedIndex={indexTarget}
                  onPress={this.changeTargetAccount}
                />
                <View style={styles.marginTop}>
                  <Text>
                    <Text style={styles.textHelp}>
                      {L.instantcashfastchoosescreen_message_email}
                    </Text>
                  </Text>
                  <TextInputMasked
                    mask={emailMasked}
                    onPress={this.onPressInputEmail}
                    accessibilityLabel={
                      'instantcashfastchoosescreen_textinputmasked_email'
                    }
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    blurOnSubmit
                    ref={ref => {
                      this.emailInput = ref;
                    }}
                    onEmptyState={this.onEmptyStateEmail}
                    onSubmitEditing={this.onSubmitEditingEmail}
                    returnKeyType={'done'}
                    style={styles.supplyCode}
                    containerStyle={{ marginTop: 0 }}
                    onBlur={this.onEmptyStateEmail}
                  />
                </View>
              </CardView>
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={
                    'instantcashfastchoosescreen_button_continue'
                  }
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  style={{ minHeight: 50, alignItems: 'center' }}
                  textStyle={{ fontSize: 16 }}
                  title={L.instantcashfastchoosescreen_button_continue}
                />
              </View>
            </Content>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Container>
    );
  }
}

export type InstantCashFastChooseScreenType = InstantCashFastChooseScreen;
export default withFocused<InstantCashFastChooseScreen, Props>(
  InstantCashFastChooseScreen
);
