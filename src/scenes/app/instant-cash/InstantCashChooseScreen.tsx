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
  Button,
  AlertModalUpdate,
  DetailItem,
  Touchable,
  ModalEndorsement,
} from '../../../components/ui';
import { Platform } from 'react-native';
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
  CreditLineOffer,
} from '../../../resources/constants';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import {
  View,
  StyleSheet,
  ImageStyle,
  Text,
  TextStyle,
  ViewStyle,
  InteractionManager,
  Image,
  Animated,
} from 'react-native';
import ExpandableView from '../../../components/ui/ExpandableView';
import { MaskModel, MaskObj } from '../../../resources/persistence/models';
import NetworkManager from '../../../components/network/NetworkManager';
import { Amount } from '../../../resources/money';
import {
  ContentCreditLine,
  OptionsList,
  LoanDestination,
  AccountItemSavingsAll,
  PreferencesUserDataModifyPreResponse,
  InsuranceItem,
} from '../../../api/backend/response/Execute';
import Session from '../../../api/Session';
import { KeyboardUtil } from '../../../resources/util';
import { A, AnalyticsEvent, K } from '../../../resources/analytics';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import ModalInfoChangeEmail from '../../../components/email/ModalInfoChangeEmail';
import CardEmailNotify from '../../../components/email/CardEmailNotify';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setEventValue } from '../../../resources/analytics/AnalyticsEvent';
const initialBottomModal = Size.getProportionalHeight(-2);
const finalBottomModal = 0;
const animationEmergingModalTime = 450;

const styles = StyleSheet.create({
  text: {
    ...Font(),
    color: Colors.grey5,
  } as TextStyle,
  igvText: {
    ...Font(),
    color: Colors.grey5,
    marginTop: 10,
  } as TextStyle,
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  headerTitle: {
    color: Colors.accentDark,
    fontSize: 18,
    textAlign: 'center',
  } as TextStyle,
  textBold: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
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
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 19,
  } as TextStyle,
  buttons: {
    marginBottom: 20,
    marginTop: 30,
  } as ViewStyle,
  marginTop: {
    marginTop: 30,
  } as ViewStyle,
  titleStyle: {
    fontSize: 32,
    lineHeight: 34,
    marginVertical: 10,
  } as TextStyle,
  marginExpandableView: {
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowColor: Colors.grey6,
    shadowOffset: { height: 4, width: 0 },
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: Platform.OS === 'android' && Platform.Version < 20 ? 0.75 : 0,
    borderColor: Colors.grey2,
    elevation: 3,
    overflow: 'visible',
    paddingVertical: 10,
    padding: 5,
    paddingHorizontal: 15,
  } as ViewStyle,
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  containerHelpDetail: {
    marginVertical: 10,
  } as ViewStyle,
  labelAskEndorsement: {
    ...Font(),
    color: Colors.brown,
  } as TextStyle,
  iconToolTip: {
    tintColor: Colors.brown,
    width: 16,
    height: 16,
    resizeMode: 'stretch',
    justifyContent: 'center',
  } as ImageStyle,
  card: {
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  containerExpandableView: {
    marginTop: 10,
  } as ViewStyle,
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
  subtitle: {
    ...Font({ weight: 'Bold' }),
    textAlign: 'center',
    color: Colors.primaryLight,
    fontSize: 16,
  } as TextStyle,
  marginDetail: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  } as ViewStyle,
  textDetail: {
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
  containerDetail: {
    justifyContent: 'space-between',
  } as ViewStyle,
  tooltipContainer: {
    marginLeft: 60,
    position: 'absolute',
    top: 36,
  } as ViewStyle,
  helpButtonIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.secondary,
  } as ImageStyle,
  openEndorsementView: {
    flexDirection: 'row',
    marginVertical: 10,
  } as ViewStyle,
  openEndorsementLabel: {
    justifyContent: 'center',
  } as ViewStyle,
  imageButtonlinkView: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  } as ViewStyle,
});
export interface Params {
  destination: LoanDestination;
  amount: number;
  creditLine: ContentCreditLine;
  option: OptionsList;
  paymentDate: string;
  insurances: InsuranceItem[];
  seedA: 'eat_flargo_pres' | 'eat_flargo_ini';
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  indexTarget: number;
  isLoading: boolean;
  accounts: AccountItemSavingsAll[];
  emailMasked?: MaskModel;
  user?: PreferencesUserDataModifyPreResponse;
  isValid: boolean;
  isShowModalCancel: boolean;
  isShowModalChangeEmail: boolean;
  openEndorsementModal: boolean;
  bottomPositionEmergingModal: Animated.Value;
}
const TAG = '[InstantCashChooseScreen]';
class InstantCashChooseScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions = {
  //   title: L.instantcashchoosescreen_title,
  // };

  state: State = {
    indexTarget: -1,
    isLoading: false,
    accounts: [],
    isValid: false,
    isShowModalCancel: false,
    isShowModalChangeEmail: false,
    openEndorsementModal: false,
    bottomPositionEmergingModal: new Animated.Value(initialBottomModal),
  };

  interaction!: any;
  target!: AccountSelector | null;

  componentDidMount() {
    this.load();
  }

  load = async () => {
    await this.loadAccounts();
    await this.loadProfile();
    const { user } = this.state;
    if (user && user._mail) {
      const masked = Sanitizer.maskEmail(user._mail);
      const emailMasked = MaskObj.init(user._mail, masked);
      this.setState({ emailMasked });

      this.isValid(false);
    }
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
    const { accounts } = this.state;
    const shortLabel = Sanitizer.getProductTitle(accounts[indexTarget]);
    AnalyticsEvent.track(A.instantcashchoosescreen_accountselector_target, shortLabel);
    this.setState({ indexTarget }, () => {
      this.isValidAccountTarget();
      this.isValid(false);
    });
  };

  getEmail = () => {
    const { emailMasked } = this.state;
    if (emailMasked) {
      return emailMasked.value || '';
    }
    return '';
  };

  isValid = (showError = true) => {
    const isValidAccountTarget = this.isValidAccountTarget(showError);
    const isValidEmail = this.isValidEmail();
    const isValid = [isValidAccountTarget, isValidEmail].every(item => !!item);

    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };
  isValidEmail = () => {
    const value = this.getEmail();
    return !!value;
  };
  isValidAccountTarget = (showError = true) => {
    if (!this.target) {
      return false;
    }
    showError && this.target.clearError();
    const { indexTarget } = this.state;
    if (indexTarget === -1) {
      showError &&
        this.target.setError(L.instantcashchoosescreen_error_account_target);
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
    const { navigation, route } = this.props;

    const amount = route.params && route.params.amount;
    const option = route.params && route.params.option;
    const destination = route.params && route.params.destination;
    const insurances = route.params && route.params.insurances;
    const creditLine = route.params && route.params.creditLine;
    const seedA = route.params && route.params.seedA;

    const insurancesJoin = insurances.map((e: any) => e.product.id).join(',');

    const target = this.getAccountTarget();
    const email = this.getEmail();
    if (!target) {
      return;
    }
    const params = {
      valueDate: '',
      debitAccount: target.idProduct,
      creditLine: option.creditLine,
      payDay: option.payDay.toString(),
      numberFee: option.numberFee.toString(),
      currency: option.currency,
      amount: amount.toString(),
      wayToPay: destination.destinationId.toString(),
      typeofoffer: CreditLineOffer.TypeOfOffer.Disposition,
      requesttype: CreditLineOffer.RequestType.Disposition,
      requestnumber: '0',
      deliverydocuments: {
        type: '1',
        _destination: email,
      },
      accountId: option.accountKeyr,
      productId: creditLine.productKey,
      graceType: '0',
      gracePeriod: '0',
      numberAffiliates: '1',
      debitProductID: '0',
      creditProductID: target.idProduct,
      insuranceTermsAccepted: '1',
      insuranceProduct: insurancesJoin === '' ? '0' : insurancesJoin,
      amountFee: option.numberFee,
      insurances: {
        ids: insurancesJoin === '' ? '0' : insurancesJoin,
      },
    };
    try {
      const response = await API.Execute.requestLoanDisbursmentPreview(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data;
        // const seedA = navigation.getParam('seedA');
        navigation.navigate('InstantCashConfirm', {
          target,
          option,
          creditLine,
          email,
          destination,
          resume,
          insurances: resume.insurances,
          seedA,
          insurancesJoin,
        });
        const newSeedA = (seedA + '_escoje_sig') as
          | 'eat_flargo_pres_escoje_sig'
          | 'eat_flargo_ini_escoje_sig';
        AnalyticsEvent.track(A[newSeedA]);
        AnalyticsEvent.track(A.eat_flargo_escoje_sig);
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

  actionModal = () => {
    this.setState({ isShowModalCancel: !this.state.isShowModalCancel });
  };

  getInsuranceTitle = (id: number) => {
    switch (id) {
      case 1:
        return L.instantcash_insurance_title_1;
      case 2:
        return L.instantcash_insurance_title_2;
      case 3:
        return L.instantcash_insurance_title_3;
      case 4:
        return L.instantcash_insurance_title_4;
      default:
        return '';
    }
  };

  toggleModalEmail = () => {
    setEventValue(A.InstantCashChooseModalChangeEmail, L.instantcashchoosescreen_cardemail_tooltip)
    const label = K[A.InstantCashChooseModalChangeEmail]
    AnalyticsEvent.trackEvent('virtualEventApp', label)
    this.setState({
      isShowModalChangeEmail: !this.state.isShowModalChangeEmail,
    });
  };

  openEndorsementModal = async () => {
    await this.changeVisiblity(true);
    this.state.openEndorsementModal && this.showPanel();
  };

  closeEndorsementModal = async () => {
    this.dismissPanel();
  };
  changeVisiblity = async (val: boolean) => {
    this.setState({ openEndorsementModal: val });
  };
  showPanel() {
    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: finalBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start();
  }
  dismissPanel() {
    Animated.timing(this.state.bottomPositionEmergingModal, {
      toValue: initialBottomModal,
      duration: animationEmergingModalTime,
      useNativeDriver: false,
    }).start(() => this.changeVisiblity(false));
  }

  render() {
    const {
      indexTarget,
      accounts,
      emailMasked,
      isValid,
      isLoading,
      isShowModalChangeEmail,
      user,
      openEndorsementModal,
      bottomPositionEmergingModal,
    } = this.state;
    const { navigation, route, isFocused } = this.props;

    const amount = route.params && route.params.amount;
    const creditLine = route.params && route.params.creditLine;
    const option = route.params && route.params.option;
    const insurances = route.params && route.params.insurances;

    const maxHeight =
      120 + insurances.filter((item: any) => item.selected).length * 15;

    return (
      <Container>
        {!!user && isShowModalChangeEmail && (
          <ModalInfoChangeEmail
            accessibilityLabel={'instantcashshort_changeemailmodal'}
            onClose={this.toggleModalEmail}
            navigation={navigation}
            user={user}
          />
        )}
        <ModalEndorsement
          visible={openEndorsementModal}
          onClose={this.closeEndorsementModal}
          bottom={bottomPositionEmergingModal}
        />
        <FormSteps total={4} current={2} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />
              <Header
                accessibilityLabel={'instantcashchoosescreen_header_title'}
                style={styles.marginTop}
                title={L.instantcashchoosescreen_header_title}
                center
              />
              <Header
                accessibilityLabel={'instantcashchoosescreen_header_amount'}
                title={Amount.format(amount, creditLine.currencyKey.toString())}
                titleStyle={styles.titleStyle}
                center
              />
              <Text style={styles.subtitle}>
                {L.instantcashchoosescreen_subtitle}
              </Text>

              <AlertModalUpdate
                titleStyle={styles.titleModalText}
                title={L.instantcashchoosescreen_alertmodal_title}
                message={`${L.instantcashchoosescreen_alertmodal_messagepart1}\n\n${L.instantcashchoosescreen_alertmodal_messagepart2}`}
                messageStyle={styles.infoDocumentModal}
                visible={this.state.isShowModalCancel}
                actionButton={{
                  accessibilityLabel:
                    'instantcashchoosescreen_alertmodal_actionbutton',
                  title: L.instantcashchoosescreen_alertmodal_button,
                  preventClose: true,
                  onPress: this.actionModal,
                  textStyle: styles.textActionInfoDocument,
                  light: true,
                  style: styles.viewActionInfoDocument,
                }}
                onClose={this.actionModal}
              />

              <ExpandableView
                accessibilityLabel={'instantcashchoosescreen_expandable_view'}
                maxHeight={maxHeight}
                style={styles.marginExpandableView}
              >
                <DetailItem
                  label={L.instantcashchoosescreen_text_insurance}
                  accessibilityLabel={
                    'instantcashsuccessscreen_detailitem_insurancedisposal'
                  }
                  text={Amount.format(
                    option.insuranceDisposal,
                    option.currency.toString()
                  )}
                  style={styles.marginDetail}
                  tooltipText={L.instantcashsuccessscreen_tooltip_message}
                  styleText={styles.textDetail}
                />
                <View style={styles.rowDetail}>
                  <Text style={styles.text}>
                    {L.instantcashchoosescreen_itf}
                  </Text>
                  <Text style={styles.text}>
                    {'+ '}
                    {Amount.format(option.itf, option.currency.toString())}
                  </Text>
                </View>

                {insurances
                  .filter((item: any) => item.selected)
                  .map((item: any, index: number) => (
                    <View style={styles.rowDetail} key={index.toString()}>
                      <Text style={styles.text}>
                        {this.getInsuranceTitle(item.type.id)}
                      </Text>
                      <Text style={styles.textBold}>
                        {Amount.format(item.amount, option.currency.toString())}
                      </Text>
                    </View>
                  ))}

                <View style={styles.containerHelpDetail}>
                  <Text style={styles.text}>
                    {L.instantcashchoosescreen_text_help}
                  </Text>
                  <Text style={styles.igvText}>
                    {L.instantcashchoosescreen_text_igv}
                  </Text>
                </View>
                <Touchable
                  accessibilityLabel={
                    'instantcashchoosescreen_choose_ask_endorsement'
                  }
                  onPress={this.openEndorsementModal}
                  style={styles.openEndorsementView}
                >
                  <View style={styles.openEndorsementLabel}>
                    <Text style={[styles.labelAskEndorsement]}>
                      {L.instantcashchoosescreen_buttonlink_title}
                    </Text>
                  </View>
                  <View style={styles.imageButtonlinkView}>
                    <Image
                      style={styles.iconToolTip}
                      source={require('../../../assets/images/help-icon.png')}
                    />
                  </View>
                </Touchable>
              </ExpandableView>
              <CardView padding style={styles.card}>
                <AccountSelector
                  readOnly={accounts.length < 2} // AccountSelector[readOnly] Esto es porque en esta vista se inicia sin cuentas, en la carga aparece 'seleccionar' cuando no tiene niguna, deberia tener un loader dentro del componente
                  accessibilityLabel={
                    'instantcashchoosescreen_accountselector_title_target'
                  }
                  title={L.instantcashchoosescreen_accountselector_target_title}
                  ref={ref => {
                    this.target = ref;
                  }}
                  values={accounts}
                  selectedIndex={indexTarget}
                  onPress={this.changeTargetAccount}
                />
              </CardView>
              {!!emailMasked && (
                <CardEmailNotify
                  emailMasked={emailMasked}
                  actionModal={this.actionModal}
                  toggleModalEmail={this.toggleModalEmail}
                  message={L.instantcashchoosescreen_cardemail_message}
                  tooltipMessage={L.instantcashchoosescreen_cardemail_tooltip}
                  accessibilityLabelBase={'instantcashchoosescreen_cardemail'}
                />
              )}
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'instantcashchoosescreen_button_continue'}
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  title={L.instantcashchoosescreen_button_continue}
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

export type InstantCashChooseScreenType = InstantCashChooseScreen;
export default withFocused<InstantCashChooseScreen, Props>(
  InstantCashChooseScreen
);
