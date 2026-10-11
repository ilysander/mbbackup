import * as React from 'react';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import Config from '../../../../Config';
import API from '../../../../api';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import { FrequentContactType } from '../../../../api/backend/response/Execute';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import ExchangeRate from '../../../../components/transactions/ExchangeRate';
import {
  Button,
  CardView,
  CircularCheck,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
  TextInput,
} from '../../../../components/ui';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import { Colors, ErrorRequest } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import ConfirmCode from '../../../../components/sms/ConfirmCode';
import ModalTermsLPDP from '../../../../components/terms-lpdp/ModalTermsLPDP';
import CheckLPDP from '../../../../components/terms-lpdp/CheckLPDP';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
  } as ViewStyle,
  inputTarget: {
    marginLeft: 0,
    marginRight: 0,
    ...Font(),
    color: Colors.grey6,
  } as TextStyle,
  formAmountLabel: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
    fontSize: 14,
    lineHeight: 16,
  } as TextStyle,
  networkStatus: {
    margin: 4,
    marginBottom: 10,
  } as ViewStyle,
  buttons: {
    marginVertical: 20,
    marginTop: 40,
  } as ViewStyle,
  formText: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as TextStyle,
  formLabel: {
    textAlign: 'left',
    ...Font(),
    marginTop: 10,
    color: Colors.grey5,
    fontSize: 14,
    lineHeight: 16,
  } as ViewStyle,
  formMainAccent: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
    fontSize: 20,
  } as ViewStyle,
  detailContent: {
    padding: 20,
    marginBottom: 20,
  } as ViewStyle,
  formRowContent: {
    width: '100%',
  } as ViewStyle,
  cardView: {
    padding: 20,
  } as ViewStyle,
});
const TAG = '[TransfersOtherAccountsConfirmScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isAllowedReadSMS: boolean;
  isLoadingResend: boolean;
  isFrequentContact: boolean;
  frequentContactName: string;
  frequentContact?: FrequentContactType;
  resume?: any;
  errorFrequentContact: string;
}

class TransfersOtherAccountsConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.transfersscreen_title,
  // };
  state: State = {
    isLoading: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    isFrequentContact: false,
    frequentContactName: '',
    frequentContact: undefined,
    resume: undefined,
    errorFrequentContact: '',
  };

  code!: ConfirmCode | null;
  note!: TextInput | null;

  modalTermsLpdp!: ModalTermsLPDP | null;
  checkLpdp!: CheckLPDP | null;

  componentDidMount() {
    const { route } = this.props;

    const resume = route.params && route.params.resume;
    const frequentContact = route.params && route.params.frequentContact;
    // const resume = navigation.getParam('resume');
    // const frequentContact = navigation.getParam('frequentContact');
    this.setState({
      resume,
      frequentContact,
    });
  }

  focus = () => {
    Log.debug(TAG, 'focus');
    this.code && this.code.focus();
  };

  onCheckPermissions = (isAllowedReadSMS: boolean) => {
    this.setState({ isAllowedReadSMS }, () => {
      this.focusIfAllowed();
    });
  };
  focusIfAllowed = () => {
    const { isAllowedReadSMS } = this.state;
    !isAllowedReadSMS && this.focus();
  };
  onReadCode = (code: string) => {
    Log.debug(TAG, 'onReadCode');
    this.code && this.code.setValue(code);
  };

  onChangeCheckSaveTransference = (value: boolean) => {
    let { frequentContactName } = this.state;

    if (!value) {
      frequentContactName = '';
    }
    this.setState(
      {
        isFrequentContact: value,
        frequentContactName,
      },
      () => {
        if (value) {
          this.note && this.note.focus();
        }
      }
    );
  };

  tooltipAction = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  onChangeNote = (value: string) => {
    this.validateFrequentContact(value);
    this.setState({ frequentContactName: value });
  };
  isValidCode = () => {
    return this.code && this.code.isValid();
  };

  isValidContact = () => {
    const { errorFrequentContact } = this.state;
    return errorFrequentContact === '';
  };
  isValid = () => {
    const { isFrequentContact } = this.state;
    if (isFrequentContact && !this.isValidContact()) {
      this.note && this.note.focus();
      return false;
    }
    if (!this.isValidCode()) {
      return false;
    }
    return true;
  };

  tryToSubmit = () => {
    this.blur();
    if (this.isValid()) {
      this.setState({ isLoading: true });
      this.submit();
    }
  };

  submit = async () => {
    try {
      const {
        frequentContactName,
        frequentContact,
        isFrequentContact,
        resume,
      } = this.state;
      const { navigation, route } = this.props;

      const origin = route.params && route.params.origin;
      const currency = route.params && route.params.currency;
      // const origin = navigation.getParam('origin');
      // const currency = navigation.getParam('currency');
      const amountCredit = {
        currency: resume.creditAccountCurrency.toString(),
        quantity: resume.creditAmount.toString(),
      };
      const amountDebit = {
        currency: resume.debitAccountCurrency.toString(),
        quantity: resume.debitAmount.toString(),
      };
      const isFrecuent = !!(isFrequentContact && frequentContactName);
      const response = await API.Execute.transfersLocalSend(
        isFrecuent.toString(),
        frequentContactName,
        this.code ? this.code.getValue() : '',
        resume.creditAccountNumber,
        currency.label === origin.currency ? amountDebit : amountCredit,
        origin.idProduct
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'confirmTransference', response);
      }
      const error = response.body.data as DefaultErrorResponse;
      if (response.body.code === API.ResponseCode.OK) {
        const idTransaction = response.body.idTransaction;
        this.checkLpdp && this.checkLpdp.trySave();
        navigation.navigate('TransfersOtherAccountsSuccess', {
          resume,
          origin,
          currency,
          idTransaction,
          frequentContact,
        });
      } else if (error.otp) {
        this.code && this.code.setCodeError(error.otp);
      } else {
        Emitter.emit<AlertEvent>('onAlertMedia', {
          tag: TAG,
          method: 'ErrorOperationTransfers',
          e: '',
        });
      }
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlertMedia', {
        tag: TAG,
        method: 'ErrorOperationTransfers',
        e: '',
      });
    }
    this.setState({ isLoading: false });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };
  blur = () => {
    Log.debug(TAG, 'blur');
    KeyboardUtil.hide();
  };
  onResend = async () => {
    this.blur();
    AnalyticsEvent.track(A.transfersotheraccountsconfirmscreen_text_resend_sms);
    this.setState({ isLoadingResend: true });
    try {
      const { route } = this.props;
      // let resume = navigation.getParam('resume');
      // const origin = navigation.getParam('origin');
      // const currency = navigation.getParam('currency');
      // const amountInput = navigation.getParam('amountInput');

      let resume = route.params && route.params.resume;
      const origin = route.params && route.params.origin;
      const currency = route.params && route.params.currency;
      const amountInput = route.params && route.params.amountInput;

      const response = await API.Execute.transfersLocalPreview(
        {
          quantity: amountInput,
          currency: currency.label,
        },
        origin.idProduct,
        resume.creditAccountNumber
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'onResend', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        resume = response.body.data.transferData;
        this.setState({ resume });
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'onResend',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'onResend', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'onResend',
        e,
      });
    }
    this.setState({ isLoadingResend: false }, () => {
      this.code && this.code.setValue('');
      this.focusIfAllowed();
    });
  };

  validateFrequentContact = (value: string) => {
    if (value.length > 0) {
      this.setErrorFrequentContact('');
    } else {
      this.setErrorFrequentContact(
        L.transfersotheraccountsconfirmscreen_error_empty_frequent_contact
      );
    }
  };

  setErrorFrequentContact = (errorFrequentContact: string) => {
    this.note && this.note.setError(errorFrequentContact);
  };

  showTermsLpdp = () => {
    this.modalTermsLpdp && this.modalTermsLpdp.showPanel();
  };

  render() {
    const {
      isLoading,
      isFrequentContact,
      frequentContactName,
      frequentContact,
    } = this.state;
    const { isFocused, route } = this.props;
    let { resume } = this.state;
    if (!resume) {
      // resume = navigation.getParam('resume');
      resume = route.params && route.params.resume;
    }
    // const origin = navigation.getParam('origin');
    const origin = route.params && route.params.origin;


    const amountMoney = Amount.format(
      resume.creditAmount,
      resume.creditAccountCurrency
    );
    const targetLabel = resume.creditAccountNumber;
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );

    const beneficiaryName = resume.creditAccountHolder;

    const sameCurrency =
      resume.creditAccountCurrency.toString() ===
      resume.debitAccountCurrency.toString();
    const currencyLabel = resume.debitAccountCurrency;
    const debitAmount = resume.debitAmount;
    const exchangeRate = resume.exchangeRate;

    return (
      <Container>
        <FormSteps total={3} current={2} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Header
                center
                style={styles.header}
                title={
                  L.transfersotheraccountsconfirmscreen_sectionheader_title
                }
                accessibilityLabel={
                  'transfersotheraccountsconfirmscreen_sectionheader_title'
                }
              />
              <CardView style={[styles.formRowContent, styles.detailContent]}>
                <Text
                  style={styles.formAmountLabel}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_text_amount'
                  }
                >
                  {L.transfersotheraccountsconfirmscreen_text_amount}
                </Text>
                <Text style={styles.formMainAccent}>{amountMoney}</Text>
                {!sameCurrency && (
                  <ExchangeRate
                    accessibilityLabel={
                      'transfersotheraccountsconfirmscreen_exchangerate'
                    }
                    currencyLabel={currencyLabel}
                    debitAmount={debitAmount}
                    exchangeRate={exchangeRate}
                  />
                )}
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_text_transfer_type'
                  }
                >
                  {L.transfersotheraccountsconfirmscreen_text_transfer_type}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_text_transfer_type_description'
                  }
                >
                  {
                    L.transfersotheraccountsconfirmscreen_text_transfer_type_description
                  }
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_text_account_origin'
                  }
                >
                  {L.transfersotheraccountsconfirmscreen_text_account_origin}
                </Text>
                <Text style={styles.formText}>{originLabel}</Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_text_account_destiny'
                  }
                >
                  {L.transfersotheraccountsconfirmscreen_text_account_destiny}
                </Text>
                <Text style={styles.formText}>{targetLabel}</Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_text_beneficiary'
                  }
                >
                  {L.transfersotheraccountsconfirmscreen_text_beneficiary}
                </Text>
                <Text style={styles.formText}>
                  {Sanitizer.titleCase(beneficiaryName)}
                </Text>
                {frequentContact && (
                  <>
                    <Text
                      style={styles.formLabel}
                      accessibilityLabel={
                        'transfersotheraccountsconfirmscreen_text_frequent_contact'
                      }
                    >
                      {
                        L.transfersotheraccountsconfirmscreen_text_frequent_contact
                      }
                    </Text>
                    <Text style={styles.formText}>
                      {frequentContact._alias}
                    </Text>
                  </>
                )}
              </CardView>
              {!frequentContact && (
                <CardView style={[styles.formRowContent, styles.detailContent]}>
                  <CircularCheck
                    placeholder={
                      L.transfersotheraccountsconfirmscreen_checkbox_save_transference
                    }
                    accessibilityLabel={
                      'transfersotheraccountsconfirmscreen_checkbox_save_transference'
                    }
                    onChangeValue={this.onChangeCheckSaveTransference}
                  />
                  {isFrequentContact && (
                    <TextInput
                      onChangeText={this.onChangeNote}
                      style={styles.inputTarget}
                      autoCapitalize={'none'}
                      maxLength={Config.settings.maxLengthFrequentContact}
                      blurOnSubmit
                      autoCorrect={false}
                      showClearButton={false}
                      accessibilityLabel={
                        'transfersotheraccountsconfirmscreen_textinputfrequentcontact_contactname'
                      }
                      ref={ref => {
                        this.note = ref;
                      }}
                      onBlur={() => {
                        this.validateFrequentContact(frequentContactName);
                      }}
                    />
                  )}
                </CardView>
              )}

              <CardView style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_confirmcode'
                  }
                  onResend={this.onResend}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <CheckLPDP
                ref={ref => {
                  this.checkLpdp = ref;
                }}
                showTermsLpdp={this.showTermsLpdp}
                accessibilityLabelCheck={
                  'transfersotheraccountsconfirmscreen_checkbox_terms_lpdp'
                }
                accessibilityLabelLinkOpenModal={
                  'transfersotheraccountsconfirmscreen_checklink_terms_lpdp'
                }
              />
              <SpacedView style={styles.buttons}>
                <Button
                  light
                  title={L.transfersotheraccountsconfirmscreen_button_back}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_button_back'
                  }
                  onPress={this.goBack}
                />
                <Button
                  loading={isLoading}
                  title={L.transfersotheraccountsconfirmscreen_button_confirm}
                  accessibilityLabel={
                    'transfersotheraccountsconfirmscreen_button_confirm'
                  }
                  onPress={this.tryToSubmit}
                />
              </SpacedView>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>

        <ModalTermsLPDP
          ref={ref => {
            this.modalTermsLpdp = ref;
          }}
          accessibilityLabel={'transfersotheraccountsconfirmscreen_modalldpdp'}
          accessibilityLabelButtonClose={
            'transfersotheraccountsconfirmscreen_modalldpdp_close'
          }
          accessibilityLabelExpandableItem={
            'transfersotheraccountsconfirmscreen_modalldpdp_toggle'
          }
        />
      </Container>
    );
  }
}

export type TransfersOtherAccountsConfirmScreenType = TransfersOtherAccountsConfirmScreen;
export default withFocused<TransfersOtherAccountsConfirmScreen, Props>(
  TransfersOtherAccountsConfirmScreen
);
