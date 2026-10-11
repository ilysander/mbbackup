import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Config from '../../../../Config';
import API from '../../../../api';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import TermsModal from '../../../../components/info/TermsModal';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  ButtonLink,
  CardView,
  CheckBox,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
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
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  contentCard: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    marginBottom: 20,
  } as ViewStyle,
  contentCardAmount: {
    paddingHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 20,
  } as ViewStyle,
  formText: {
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as TextStyle,
  leftText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 13,
    lineHeight: 15,
    color: Colors.accent,
  } as TextStyle,
  formLabel: {
    textAlign: 'left',
    ...Font(),
    marginTop: 10,
    color: Colors.grey5,
    fontSize: 14,
    lineHeight: 16,
  } as TextStyle,
  formAmountLabel: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
    fontSize: 14,
    lineHeight: 16,
  } as TextStyle,
  formMainAccent: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
    fontSize: 20,
  } as ViewStyle,
  footerContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
  } as ViewStyle,
  detailsContainer: {
    paddingBottom: 0,
  } as ViewStyle,
  detailsButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingTop: 0,
  } as ViewStyle,
  detailsButtonLink: {
    fontSize: 13,
  } as TextStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  cardView: {
    padding: 20,
    marginBottom: 20,
  } as ViewStyle,
});
const TAG = '[TransfersOtherBanksConfirmScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isAllowedReadSMS: boolean;
  isLoadingResend: boolean;
  isFrequentContact: boolean;
  frequentContactName?: string;
  resume?: any;
  isTermsValid: boolean;
  showDetails: boolean;
  showTerms: boolean;
  isRequiredTerms: boolean;
  isNewFrequentContact: boolean;
}

class TransfersOtherBanksConfirmScreen extends React.Component<
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
    frequentContactName: undefined,
    resume: undefined,
    isTermsValid: true,
    showDetails: false,
    showTerms: false,
    isRequiredTerms: true,
    isNewFrequentContact: false,
  };

  code!: ConfirmCode | null;
  terms!: CheckBox | null;

  modalTermsLpdp!: ModalTermsLPDP | null;
  checkLpdp!: CheckLPDP | null;

  componentDidMount() {
    const { route } = this.props;

    const resume = route.params && route.params.resume;
    let frequentContactName = route.params && route.params.frequentContactName;
    const frequentContact = route.params && route.params.frequentContact;

    // const resume = navigation.getParam('resume');
    // let frequentContactName = navigation.getParam('frequentContactName');
    // const frequentContact = navigation.getParam('frequentContact');

    const isNewFrequentContact = !!frequentContactName;
    if (frequentContact) {
      frequentContactName = frequentContact.alias;
    }
    const isFrequentContact = !!frequentContactName;

    this.setState({
      resume,
      isFrequentContact,
      frequentContactName,
      isNewFrequentContact,
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

  tooltipAction = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };
  isValidCode = () => {
    return this.code && this.code.isValid();
  };

  isValid = () => {
    if (!this.isValidCode()) {
      return false;
    }
    return true;
  };

  tryToSubmit = () => {
    const { isRequiredTerms } = this.state;
    this.blur();

    if (isRequiredTerms) {
      const isTermsValid = this.terms ? this.terms.getValue() : false;
      this.setState({ isTermsValid });
      if (!isTermsValid) {
        return;
      }
    }
    if (this.isValid()) {
      this.setState({ isLoading: true });
      this.submit();
    }
  };
  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isTermsValid: value });
  };
  showTerms = () => {
    this.setState({ showTerms: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };
  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  submit = async () => {
    try {
      const { resume, frequentContactName, isNewFrequentContact } = this.state;
      const { navigation, route } = this.props;
      // const origin = navigation.getParam('origin');
      // const currency = navigation.getParam('currency');

      const origin = route.params && route.params.origin;
      const currency = route.params && route.params.currency;

      const response = await API.Execute.transferInterbankInmediateSend(
        isNewFrequentContact ? frequentContactName || '' : '',
        this.terms ? this.terms.getValue().toString() : 'false',
        resume.creditAccountCCI,
        resume.debitAccountID,
        {
          quantity: resume.requestedAmount.toString(),
          currency: resume.amountCurrency.toString(),
        },
        resume.mail,
        this.code ? this.code.getValue() : ''
      );
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'confirmTransference', response);
      }
      const error = response.body.data as DefaultErrorResponse;
      if (response.body.code === API.ResponseCode.OK) {
        const idTransaction = response.body.idTransaction;
        this.checkLpdp && this.checkLpdp.trySave();
        navigation.navigate('TransfersOtherBanksSuccess', {
          resume,
          origin,
          currency,
          idTransaction,
          frequentContactName,
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
    AnalyticsEvent.track(A.transfersotherbanksconfirmscreen_text_resend_sms);
    this.setState({ isLoadingResend: true });
    try {
      const { route } = this.props;

      const origin = route.params && route.params.origin;
      const currency = route.params && route.params.currency;
      const amountInput = route.params && route.params.amountInput;
      const targetInput = route.params && route.params.targetInput;


      const response = await API.Execute.transferInterbankInmediatePreview(
        origin.idProduct,
        {
          quantity: amountInput,
          currency: currency.label,
        },
        targetInput,
        Config.settings.emailTransfersImmediate
      );

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'onResend', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const resume = response.body.data;
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

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  showTermsLpdp = () => {
    this.modalTermsLpdp && this.modalTermsLpdp.showPanel();
  };

  render() {
    const {
      isLoading,
      isFrequentContact,
      frequentContactName,
      isTermsValid,
      showTerms,
      showDetails,
    } = this.state;
    const { route, isFocused } = this.props;

    // const resume = navigation.getParam('resume');
    // const origin = navigation.getParam('origin');


    const origin = route.params && route.params.origin;
    const resume = route.params && route.params.resume;

    const amountMoney = Amount.format(
      resume.totalAmount,
      resume.amountCurrency
    );
    const originLabel = Sanitizer.getAccountEmptyFromLabel(
      origin.shortLabel,
      origin.number
    );

    const beneficiaryName = resume._beneficiaryName;

    const {
      requestedAmount = 0,
      itf = 0,
      mibancoComission = 0,
      interbankComission = 0,
      otherAmount = 0,
    } = resume;

    const currencyLoan = resume.amountCurrency.toString();
    const requestedAmountFormatted = Validate.formatAmount(
      requestedAmount,
      currencyLoan
    );
    const itfFormatted = Validate.formatAmount(itf, currencyLoan);

    const mibancoComissionFormatted = Validate.formatAmount(
      mibancoComission,
      currencyLoan
    );
    const interbankComissionFormatted = Validate.formatAmount(
      interbankComission,
      currencyLoan
    );
    const otherFormatted = Validate.formatAmount(otherAmount, currencyLoan);

    return (
      <Container>
        <TermsModal
          accessibilityLabel={'transfersotherbanksconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_transfers_interbank}
          onClose={this.closeTerms}
          closeButton={{
            title: L.transfersotherbanksconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.transfersotherbanksconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
          }}
        />
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
                title={L.transfersotherbanksconfirmscreen_sectionheader_title}
                accessibilityLabel={
                  'transfersotherbanksconfirmscreen_sectionheader_title'
                }
              />
              <CardView style={styles.contentCardAmount}>
                <Text
                  style={styles.formAmountLabel}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_text_amount'
                  }
                >
                  {L.transfersotherbanksconfirmscreen_text_amount}
                </Text>
                <Text style={styles.formMainAccent}>{amountMoney}</Text>
                <View style={styles.detailsButtonContainer}>
                  <ButtonLink
                    accent={'primary'}
                    strong
                    accessibilityLabel={
                      'transfersotherbanksconfirmscreen_buttonlink_details'
                    }
                    onPress={this.toggleDetails}
                    titleStyle={styles.detailsButtonLink}
                    title={
                      showDetails
                        ? L.transfersotherbanksconfirmscreen_buttonlink_close_details
                        : L.transfersotherbanksconfirmscreen_buttonlink_show_details
                    }
                    hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
                    style={{ padding: 0 }}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'transfersotherbanksconfirmscreen_text_amountdetails_capital'
                    }
                  >
                    {L.transfersotherbanksconfirmscreen_text_requested_amount}:{' '}
                    {requestedAmountFormatted.valueFormatted}
                  </Text>
                  {showDetails && (
                    <View>
                      <Text
                        style={styles.leftText}
                        accessibilityLabel={
                          'transfersotherbanksconfirmscreen_text_amountdetails_interest'
                        }
                      >
                        {
                          L.transfersotherbanksconfirmscreen_text_interbank_commission
                        }
                        : {interbankComissionFormatted.valueFormatted}
                      </Text>
                      <Text
                        style={styles.leftText}
                        accessibilityLabel={
                          'transfersotherbanksconfirmscreen_text_amountdetails_overdue'
                        }
                      >
                        {
                          L.transfersotherbanksconfirmscreen_text_mibanco_commission
                        }
                        : {mibancoComissionFormatted.valueFormatted}
                      </Text>
                      {!itfFormatted.isEmpty && (
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'transfersotherbanksconfirmscreen_text_amountdetails_itf'
                          }
                        >
                          {L.transfersotherbanksconfirmscreen_itf_label}:{' '}
                          {itfFormatted.valueFormatted}
                        </Text>
                      )}
                      {!otherFormatted.isEmpty && (
                        <Text
                          style={styles.leftText}
                          accessibilityLabel={
                            'transfersotherbanksconfirmscreen_text_amountdetails_other'
                          }
                        >
                          {L.transfersotherbanksconfirmscreen_other_label}:{' '}
                          {otherFormatted.valueFormatted}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </CardView>
              <CardView style={styles.contentCard}>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_text_transfer_type'
                  }
                >
                  {L.transfersotherbanksconfirmscreen_text_transfer_type}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_text_transfer_type_description'
                  }
                >
                  {
                    L.transfersotherbanksconfirmscreen_text_transfer_type_description
                  }
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_text_account_origin'
                  }
                >
                  {L.transfersotherbanksconfirmscreen_text_account_origin}
                </Text>
                <Text style={styles.formText}>
                  {originLabel} - {origin.number}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_text_account_destiny'
                  }
                >
                  {L.transfersotherbanksconfirmscreen_text_account_destiny}
                </Text>
                <View>
                  <Text style={styles.formText}>{resume.bankName}</Text>
                  <Text style={styles.formText}>
                    {Sanitizer.formatTextCCI(resume.creditAccountCCI)}
                  </Text>
                </View>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_text_beneficiary'
                  }
                >
                  {L.transfersotherbanksconfirmscreen_text_beneficiary}
                </Text>
                <Text style={styles.formText}>
                  {Sanitizer.titleCase(beneficiaryName)}
                </Text>
                {isFrequentContact && (
                  <>
                    <Text
                      style={styles.formLabel}
                      accessibilityLabel={
                        'transfersotherbanksconfirmscreen_text_frequent_contact'
                      }
                    >
                      {L.transfersotherbanksconfirmscreen_text_frequent_contact}
                    </Text>
                    <Text style={styles.formText}>{frequentContactName}</Text>
                  </>
                )}
              </CardView>

              <CardView style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_confirmcode'
                  }
                  onResend={this.onResend}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>
              <CardView padding>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_checkbox_terms'
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={
                    L.transfersotherbanksconfirmscreen_checkbox_terms_part1
                  }
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'transfersotherbanksconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={
                        L.transfersotherbanksconfirmscreen_checkbox_terms_part2
                      }
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.transfersotherbanksconfirmscreen_texterror_terms
                  }
                />
              </CardView>
              <CheckLPDP
                ref={ref => {
                  this.checkLpdp = ref;
                }}
                showTermsLpdp={this.showTermsLpdp}
                accessibilityLabelCheck={
                  'transfersotherbanksconfirmscreen_checkbox_terms_lpdp'
                }
                accessibilityLabelLinkOpenModal={
                  'transfersotherbanksconfirmscreen_checklink_terms_lpdp'
                }
              />
              <SpacedView style={styles.footerContainer}>
                <Button
                  light
                  title={L.transfersotherbanksconfirmscreen_button_back}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_button_back'
                  }
                  onPress={this.goBack}
                />
                <Button
                  loading={isLoading}
                  title={L.transfersotherbanksconfirmscreen_button_confirm}
                  accessibilityLabel={
                    'transfersotherbanksconfirmscreen_button_confirm'
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
          accessibilityLabel={'transfersotherbanksconfirmscreen_modalldpdp'}
          accessibilityLabelButtonClose={
            'transfersotherbanksconfirmscreen_modalldpdp_close'
          }
          accessibilityLabelExpandableItem={
            'transfersotherbanksconfirmscreen_modalldpdp_toggle'
          }
        />
      </Container>
    );
  }
}

export type TransfersOtherBanksConfirmScreenType = TransfersOtherBanksConfirmScreen;
export default withFocused<TransfersOtherBanksConfirmScreen, Props>(
  TransfersOtherBanksConfirmScreen
);
