import * as React from 'react';
import {
  ImageStyle,
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import API from '../../../../api';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import ConfirmPhoneAlert, {
  ReturnOptions,
} from '../../../../components/alert/ConfirmPhoneAlert';
import InvalidPhoneAlert from '../../../../components/alert/InvalidPhoneAlert';
import DPFItem from '../../../../components/dpf/DPFItem';
import NetworkManager from '../../../../components/network/NetworkManager';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import AccountSelector from '../../../../components/transfers/AccountSelector';
import {
  Button,
  CheckBox,
  Container,
  Content,
  FormSteps,
  InfoMessage,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
  CardView,
} from '../../../../components/ui';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import {
  Colors,
  Currencies,
  ErrorRequest,
  FrequencyDeposit,
} from '../../../../resources/constants';
import { Currency } from '../../../../resources/constants/Currencies';
import { Size } from '../../../../resources/dimensions';
import { Font, Validate, Sanitizer } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import Features from '../../../../resources/remote/Features';
import NotAllowedAlert from '../../../../components/alert/NotAllowedAlert';
import { MaskModel, MaskObj } from '../../../../resources/persistence/models';
import CardEmailNotify from '../../../../components/email/CardEmailNotify';
import ModalInfoChangeEmail from '../../../../components/email/ModalInfoChangeEmail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  titleLinkText: {
    color: Colors.primary,
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  checkboxAutorenewIcon: {
    tintColor: Colors.secondary,
  } as ImageStyle,
  boldText: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  dpfitem: {
    marginTop: 20,
  } as ViewStyle,
  infoMessage: {
    marginTop: 20,
  } as ViewStyle,
  cardView: {
    marginTop: 20,
    marginBottom: 10,
  } as ViewStyle,
  accountSelectorTarget: {
    marginTop: 30,
  } as ViewStyle,
  checkbox: {
    marginTop: 30,
  } as TextStyle,
  checkboxPlaceholderText: {
    flex: 1,
    color: Colors.grey6,
  } as TextStyle,
  emailTitle: {
    ...Font({ weight: 'Bold' }),
    marginTop: 30,
    fontSize: 14,
    color: Colors.grey6,
  } as TextStyle,
});

const TAG = '[DPFOpenChooseScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  dpf: any;
  user: any;
  accounts: any[];
  indexOrigin: number;
  indexTarget: number;
  isLoading: boolean;
  isLoadingAccounts: boolean;
  showConfirmModal: boolean;
  showInvalidModal: boolean;
  showNotAllowedModal: boolean;
  isValid: boolean;
  currency: Currency;
  email: string;
  emailMasked?: MaskModel;
  isShowModalChangeEmail: boolean;
}

class DPFOpenChooseScreen extends React.Component<Props & FocusedProps, State> {

  state: State = {
    dpf: {},
    user: {},
    email: '',
    accounts: [],
    indexOrigin: -1,
    indexTarget: -1,
    isLoading: false,
    isValid: false,
    isLoadingAccounts: false,
    showConfirmModal: false,
    showInvalidModal: false,
    showNotAllowedModal: false,
    currency: Currencies.PEN,
    isShowModalChangeEmail: false,
  };
  scroll!: ScrollView | null;
  interaction: any;
  origin!: AccountSelector | null;
  target!: AccountSelector | null;
  // emailInput!: TextInputMasked | null;
  autorenew!: CheckBox | null;

  goBack = () => {
    this.props.navigation.goBack();
  };

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.interaction && this.interaction.cancel();
  }

  getAccountOrigin = () => {
    const { accounts, indexOrigin } = this.state;
    if (indexOrigin < 0) {
      return {};
    }
    return accounts[indexOrigin] || {};
  };
  getAccountTarget = () => {
    const { accounts, indexTarget } = this.state;
    if (indexTarget < 0) {
      return {};
    }
    return accounts[indexTarget] || {};
  };
  changeOriginAccount = (indexOrigin: number) => {
    AnalyticsEvent.track(A.dpfopenchoosescreen_accountselector_origin);
    this.setState({ indexOrigin }, () => {
      this.isValidAccountOrigin();
      this.isValid(false);
    });
  };
  changeTargetAccount = (indexTarget: number) => {
    AnalyticsEvent.track(A.dpfopenchoosescreen_accountselector_target);
    this.setState({ indexTarget }, () => {
      this.isValidAccountTarget();
      this.isValid(false);
    });
  };
  load = async () => {
    const { route } = this.props;

    const dpf = route.params && route.params.dpf || {};
    const currency = route.params && route.params.currency || Currencies.PEN;
    const accounts = route.params && route.params.accounts || [];

    const indexOrigin = accounts.length > 1 ? -1 : 0;
    const indexTarget = accounts.length > 1 ? -1 : 0;
    this.setState({ dpf, currency, accounts, indexOrigin, indexTarget }, () => {
      if (accounts.length === 1) {
        this.isValidAccountOrigin();
        this.isValidAccountTarget();
      }
    });

    await this.loadProfile();
    const { user } = this.state;
    if (user && user._mail) {
      const maskedMail = Sanitizer.maskEmail(user._mail);
      const emailMasked: MaskObj | undefined = user._mail
        ? MaskObj.init(user._mail, maskedMail)
        : user._mail;
      this.setState({
        emailMasked,
      });
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

  getErrorAccountOriginDifferentCurrency = () => {
    const { currency } = this.state;
    if (currency.label === Currencies.USD.label) {
      return L.dpfopenchoosescreen_error_account_origin_different_currency_usd;
    }
    if (currency.label === Currencies.PEN.label) {
      return L.dpfopenchoosescreen_error_account_origin_different_currency_pen;
    }
    return L.dpfopenchoosescreen_error_account_origin;
  };
  getErrorAccountTargetDifferentCurrency = () => {
    const { currency } = this.state;
    if (currency.label === Currencies.USD.label) {
      return L.dpfopenchoosescreen_error_account_target_different_currency_usd;
    }
    if (currency.label === Currencies.PEN.label) {
      return L.dpfopenchoosescreen_error_account_target_different_currency_pen;
    }
    return L.dpfopenchoosescreen_error_account_target;
  };
  getAccountTargetPlaceholder = () => {
    const { currency } = this.state;
    if (currency.label === Currencies.USD.label) {
      return L.dpfopenchoosescreen_accountselector_title_target_placeholder_usd;
    }
    if (currency.label === Currencies.PEN.label) {
      return L.dpfopenchoosescreen_accountselector_title_target_placeholder_pen;
    }
    return L.dpfopenchoosescreen_accountselector_title_target_placeholder;
  };
  isValidAccountOriginBalance = (showError = true) => {
    if (!this.origin) {
      return false;
    }
    const { dpf } = this.state;
    const account = this.getAccountOrigin();

    if (dpf.amount > account.availableBalance) {
      showError &&
        this.origin.setError(
          L.dpfopenchoosescreen_error_account_origin_balance
        );
      return false;
    }
    return true;
  };
  isValidAccountOrigin = (showError = true) => {
    if (!this.origin) {
      return false;
    }
    showError && this.origin.clearError();
    const { indexOrigin } = this.state;
    if (indexOrigin === -1) {
      showError &&
        this.origin.setError(L.dpfopenchoosescreen_error_account_origin);
      return false;
    }
    const { currency } = this.state;
    const account = this.getAccountOrigin();

    if (currency.label !== account.currency) {
      showError &&
        this.origin.setError(this.getErrorAccountOriginDifferentCurrency());
      return false;
    }

    return this.isValidAccountOriginBalance(showError);
  };
  isValidAccountTarget = (showError = true) => {
    if (!this.target) {
      return false;
    }
    showError && this.target.clearError();
    const { indexTarget } = this.state;
    if (indexTarget === -1) {
      showError &&
        this.target.setError(L.dpfopenchoosescreen_error_account_target);
      return false;
    }
    const { currency } = this.state;
    const account = this.getAccountTarget();
    if (currency.label !== account.currency) {
      showError &&
        this.target.setError(this.getErrorAccountTargetDifferentCurrency());
      return false;
    }
    return true;
  };

  isValid = (showError = true) => {
    const { emailMasked } = this.state;
    const isValidAccountOrigin = this.isValidAccountOrigin(showError);
    const isValidAccountTarget = this.isValidAccountTarget(showError);
    const isValidEmail = emailMasked ? !!emailMasked.value : false;
    const isValid = [
      isValidEmail,
      isValidAccountOrigin,
      isValidAccountTarget,
    ].every(item => !!item);

    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  tryToSubmit = () => {
    this.interaction && this.interaction.cancel();

    this.interaction = InteractionManager.runAfterInteractions(async () => {
      const isValid = this.isValid();
      if (!isValid) {
        AnalyticsEvent.track(A.dpfopenchoosescreen_form_invalid);
        return;
      }
      await this.loadProfile();
      const { user } = this.state;

      if (user && user.mobilePhone) {
        if (Features.isAllowedTo('ChangePhone')) {
          this.setState({ showConfirmModal: true });
        } else {
          this.confirmModal();
        }
      } else {
        if (Features.isAllowedTo('ChangePhone')) {
          this.setState({ showInvalidModal: true });
        } else {
          this.setState({ showNotAllowedModal: true });
        }
      }
    });
  };

  hideNotAllowedModal = () => {
    this.setState({ showNotAllowedModal: false });
  };
  hideConfirmModal = () => {
    this.setState({ showConfirmModal: false });
  };
  hideInvalidModal = () => {
    this.setState({ showInvalidModal: false });
  };
  confirmModal = async () => {
    this.setState({ showConfirmModal: false, isLoading: true });
    await this.submit();
    this.setState({ isLoading: false });
  };

  getEmail = () => {
    const { emailMasked } = this.state;
    if (emailMasked) {
      return emailMasked.value || '';
    }
    return '';
  };

  submit = async () => {
    const { navigation } = this.props;
    const { currency, dpf, user } = this.state;

    try {
      const origin = this.getAccountOrigin();
      const target = this.getAccountTarget();
      const autoRenew = this.autorenew ? this.autorenew.getValue() : '';
      const email = this.getEmail();

      const response = await API.Execute.depositCreatePreview(
        '',
        {
          amount: dpf.amount.toString(),
          rate: dpf.rate.toString(),
          generatedAmount: dpf.amountgenerated.toString(),
          currency: currency.label,
          term: dpf.term.toString(),
        },
        origin.idProduct,
        FrequencyDeposit.AtTheEnd,
        autoRenew ? '1' : '',
        target.idProduct,
        email
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data;
        navigation.navigate('DPFOpenConfirm', {
          resume,
          dpf,
          user,
          origin,
          target,
          email,
          autoRenew,
        });
        return;
      }

      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.creditAccount) {
        this.target && this.target.setError(error.creditAccount);
        hasError = true;
      }
      if (error.debitAccount) {
        this.origin && this.origin.setError(error.debitAccount);
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

  goToInfo = () => {
    const { navigation } = this.props;
    navigation.navigate('DPFOpenInfo');
  };

  getConfirmReturnOptions = (): ReturnOptions => {
    const { navigation } = this.props;

    return {
      success: {
        onPress: () => {
          navigation.navigate('DPFOpenChoose');
        },
        title: L.dpfopenchoosescreen_returnoptions_change_success,
      },
      cancel: {
        onPress: () => {
          navigation.navigate('DPFOpenChoose');
        },
      },
    };
  };

  actionModal = () => { };

  toggleModalEmail = () => {
    this.setState({
      isShowModalChangeEmail: !this.state.isShowModalChangeEmail,
    });
  };

  render() {
    const {
      isLoading,
      indexOrigin,
      indexTarget,
      accounts,
      dpf,
      currency,
      isValid,
      user,
      showConfirmModal,
      showInvalidModal,
      showNotAllowedModal,
      emailMasked,
      isShowModalChangeEmail,
    } = this.state;
    const { isFocused, navigation } = this.props;
    const returnOptions = this.getConfirmReturnOptions();

    return (
      <Container>
        {showConfirmModal && (
          <ConfirmPhoneAlert
            accessibilityLabel={'dpfopenchoosescreen_confirmphonealert'}
            navigation={navigation}
            returnOptions={returnOptions}
            user={user}
            onAction={this.confirmModal}
            onCancel={this.hideConfirmModal}
          />
        )}
        {showInvalidModal && (
          <InvalidPhoneAlert
            accessibilityLabel={'dpfopenchoosescreen_invalidphonealert'}
            navigation={navigation}
            returnOptions={returnOptions}
            onClose={this.hideInvalidModal}
          />
        )}
        {showNotAllowedModal && (
          <NotAllowedAlert
            accessibilityLabel={'dpfopenchoosescreen_notallowedalert'}
            accessibilityLabelBtn={'notallowedalert_button_action'}
            onClose={this.hideNotAllowedModal}
          />
        )}
        {isShowModalChangeEmail && user && (
          <ModalInfoChangeEmail
            accessibilityLabel={'newaccount_changeemailmodal'}
            onClose={this.toggleModalEmail}
            navigation={navigation}
            user={user}
          />
        )}
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
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              {!!dpf && (
                <DPFItem
                  accessibilityLabel={
                    'dpfopenchoosescreen_sectionheader_dpfitem'
                  }
                  style={styles.dpfitem}
                  item={dpf}
                  currency={currency}
                />
              )}
              <InfoMessage
                style={styles.infoMessage}
                accessibilityLabel={'dpfopenchoosescreen_infomessage'}
                message={
                  <Text>
                    {L.dpfopenchoosescreen_help_part1}{' '}
                    <Text onPress={this.goToInfo} style={styles.titleLinkText}>
                      {L.dpfopenchoosescreen_help_part2}
                    </Text>
                  </Text>
                }
              />

              <CardView
                accessibilityLabel={'dpfopenchoosescreen_cardview'}
                style={styles.cardView}
                padding
              >
                <AccountSelector
                  readOnly={accounts.length === 1}
                  accessibilityLabel={
                    'dpfopenchoosescreen_accountselector_title_origin'
                  }
                  title={L.dpfopenchoosescreen_accountselector_title_origin}
                  placeholder={
                    currency.label === Currencies.PEN.label
                      ? L.dpfopenchoosescreen_accountselector_title_origin_placeholder_pen
                      : L.dpfopenchoosescreen_accountselector_title_origin_placeholder_usd
                  }
                  ref={ref => {
                    this.origin = ref;
                  }}
                  values={accounts}
                  selectedIndex={indexOrigin}
                  onPress={this.changeOriginAccount}
                />
                <CheckBox
                  ref={ref => {
                    this.autorenew = ref;
                  }}
                  iconStyle={styles.checkboxAutorenewIcon}
                  style={styles.checkbox}
                  accessibilityLabel={'dpfopenchoosescreen_checkbox_autorenew'}
                  placeholderStyle={styles.checkboxPlaceholderText}
                  placeholder={
                    <Text>
                      {L.dpfopenchoosescreen_checkbox_autorenew_part1}{' '}
                      <Text style={styles.boldText}>
                        {L.dpfopenchoosescreen_checkbox_autorenew_part2}
                      </Text>{' '}
                      {L.dpfopenchoosescreen_checkbox_autorenew_part3}
                    </Text>
                  }
                />
                <AccountSelector
                  style={styles.accountSelectorTarget}
                  readOnly={accounts.length === 1}
                  accessibilityLabel={
                    'dpfopenchoosescreen_accountselector_title_target'
                  }
                  title={L.dpfopenchoosescreen_accountselector_title_target}
                  placeholder={this.getAccountTargetPlaceholder()}
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
                  toggleModalEmail={this.toggleModalEmail}
                  message={L.dpfopenchoosescreen_cardemail_message}
                  tooltipMessage={L.dpfopenchoosescreen_cardemail_tooltip}
                  accessibilityLabelBase={'dpfopenchoosescreen_cardemail'}
                />
              )}

              <SpacedView style={styles.buttons}>
                <Button
                  light
                  accessibilityLabel={'dpfopenchoosescreen_button_cancel'}
                  onPress={this.goBack}
                  title={L.dpfopenchoosescreen_button_cancel}
                />
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={'dpfopenchoosescreen_button_continue'}
                  onPress={this.tryToSubmit}
                  loading={isLoading}
                  title={L.dpfopenchoosescreen_button_continue}
                />
              </SpacedView>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type DPFOpenChooseScreenType = DPFOpenChooseScreen;
export default withFocused<DPFOpenChooseScreen, Props>(DPFOpenChooseScreen);
