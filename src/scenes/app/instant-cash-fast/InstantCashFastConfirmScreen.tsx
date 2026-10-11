import * as React from 'react';
import {
  FocusedProps,
  withFocused,
} from '../../../components/screen/ScreenContainer';
import {
  Container,
  CheckBox,
  CheckBoxMulti,
  ButtonLink,
  SafeAreaView,
  KeyboardAvoidingView,
  Content,
  NetworkStatusAlert,
  Header,
  FormSteps,
  CardView,
  Button,
} from '../../../components/ui';
import Size from '../../../resources/dimensions/Size';
import { L } from '../../../resources/language';
import ConfirmCode from '../../../components/sms/ConfirmCode';
import Log from '../../../resources/log/Log';
import API from '../../../api';
import { Validate, Font } from '../../../resources/functions';
import { Colors, ErrorRequest } from '../../../resources/constants';
import { Emitter } from '../../../resources/listeners';
import { AlertEvent } from '../../../components/alert/AlertManager';
import { View, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import ExpandableView from '../../../components/ui/ExpandableView';
import NetworkManager from '../../../components/network/NetworkManager';
import TermsModal from '../../../components/info/TermsModal';
import { Amount } from '../../../resources/money';
import {
  LoanPreviewResponse,
  OptionsList,
  AccountItemSavingsAll,
  DigitalProductOptions,
  OptionListChip,
  DigitalLoanPreviewResponse,
} from '../../../api/backend/response/Execute';
import { KeyboardUtil } from '../../../resources/util';
import { A, AnalyticsEvent } from '../../../resources/analytics';
import { DefaultErrorResponse } from '../../../api/backend/response/Error';
import Modal from '../../../components/ui/ModalStandingUp';
import LoadingMibanco from '../../../components/ui/LoadingMibanco';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
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
  cardView: {
    padding: 20,
    marginBottom: 20,
  } as ViewStyle,
  cardSMSConfirm: {
    padding: 20,
    marginTop: 20,
  } as ViewStyle,
  cardOverview: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  } as ViewStyle,
  buttons: {
    marginBottom: 20,
    marginTop: 40,
  } as ViewStyle,
  marginToggle: {
    marginTop: 10,
  } as ViewStyle,
  marginTop: {
    marginHorizontal: 20,
    marginTop: 20 + 10, // 10 adicional por formsteps
    marginBottom: 20,
  } as ViewStyle,
  marginExpandableView: {
    marginHorizontal: 0,
  } as ViewStyle,
  insurancesCard: {
    marginTop: 20,
  } as TextStyle,
  insurancesContainer: {
    flexWrap: 'wrap',
    paddingRight: 20,
  } as TextStyle,
  textTerms: {
    color: Colors.grey5,
    fontSize: 14,
  } as TextStyle,
  textTermsLinks: {
    color: Colors.primary,
    fontWeight: 'bold',
  } as TextStyle,
  cardText: {
    flexWrap: 'wrap',
    paddingRight: 20,
  } as TextStyle,
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  textLoading: {
    marginTop: 12,
    ...Font({ weight: 'Regular' }),
    fontSize: 14,
    textAlign: 'center',
    color: Colors.grey1,
    lineHeight: 19,
  } as TextStyle,
});

export interface Params {
  email: string;
  newProduct: DigitalProductOptions;
  optionSelected: OptionListChip;
  targetId: string;
  resume: DigitalLoanPreviewResponse;
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isAllowedReadSMS: boolean;
  isValid: boolean;
  isTermsValid: boolean;
  showTerms: boolean;
  showInsuranceTerms: boolean;
  showTermsPersonalData: boolean;
  isLoadingResend: boolean;
  isLoading: boolean;
  option?: OptionsList;
  resume?: LoanPreviewResponse;
  target?: AccountItemSavingsAll;
  isRequiredTerms: boolean;
}

const TAG = '[InstantCashFastConfirmScreen]';
class InstantCashFastConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  static navigationOptions = {
    title: L.instantcashfastconfirmscreen_title,
  };

  state: State = {
    isLoading: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    isValid: false,
    isTermsValid: true,
    showTerms: false,
    showInsuranceTerms: false,
    showTermsPersonalData: false,
    option: undefined,
    resume: undefined,
    target: undefined,
    isRequiredTerms: true,
  };
  code!: ConfirmCode | null;
  terms!: CheckBox | null;
  termsPersonalData!: CheckBox | null;

  blur = () => {
    KeyboardUtil.hide();
  };

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

  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isTermsValid: value }, () => this.isValid(false));
  };

  showTerms = () => {
    this.setState({ showTerms: true });
  };

  showTermsPersonalData = () => {
    this.setState({ showTermsPersonalData: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };

  closeTermsPersonalData = () => {
    this.setState({ showTermsPersonalData: false });
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  onAcceptTermsPersonalData = () => {
    this.termsPersonalData && this.termsPersonalData.setValue(true);
    this.closeTermsPersonalData();
  };

  isValidTerms = (showError = true) => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    if (showError) {
      this.setState({ isTermsValid });
    }
    return isTermsValid;
  };

  isValid = async (showErrors = true) => {
    const isValidCode = this.isValidCode(showErrors);
    const isValidTerms = this.isValidTerms(showErrors);
    const isValid = [isValidCode, isValidTerms].every(item => !!item);
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  isValidCode = (showErrors = true) => {
    return this.code && this.code.isValid(showErrors);
  };

  onChangeCode = () => {
    this.isValid(false);
  };

  tryToSubmit = async () => {
    this.blur();
    if (await this.isValid()) {
      this.setState({ isLoading: true });
      this.submit();
    }
  };

  submit = async () => {
    const { navigation, route } = this.props;
    try {

      const resume = route.params && route.params.resume;
      const newProduct = route.params && route.params.newProduct;
      const optionSelected = route.params && route.params.optionSelected;
      const targetId = route.params && route.params.targetId;
      const email = route.params && route.params.email;
      const termsPersonalData = this.termsPersonalData
        ? this.termsPersonalData.getValue()
        : false;
      const currency = newProduct.request.currency.id + '';
      const params = {
        requestNumber: newProduct.request.number,
        amount: newProduct.request.amount,
        payDay: resume.payDay,
        amountFee: resume.amountFee,
        creditProductId: targetId,
        aceptTermAndCondition: 'true',
        checkdataprotection: termsPersonalData ? 1 : 0,
        interestRate: optionSelected.rate,
        _otp: this.code ? this.code.getValue() : '',
        documents: {
          delivery: {
            type: 1,
            destination: email,
          },
        },
        wayToPay: 1,
      };
      const response = await API.Execute.loanRequestDigitalSend(params);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }

      const error = response.body.data as DefaultErrorResponse;
      if (response.body.code === API.ResponseCode.OK) {
        const idTransaction = response.body.idTransaction;
        navigation.navigate('InstantCashFastSuccess', {
          idTransaction,
          resume,
          currency,
          optionSelected,
        });
        this.setState({ isLoading: false });
        return;
      }
      if (error.otp || error._otp) {
        this.code && this.code.setCodeError(error.otp || error._otp);
      } else {
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      }
    } catch (e) {
      Log.exception(TAG, 'submit', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'submit',
        e,
      });
    }
    this.setState({ isLoading: false });
  };

  onResend = async () => {
    this.blur();
    AnalyticsEvent.track(A.instantcashfastconfirmscreen_text_resend_sms);
    this.setState({ isLoadingResend: true });
    const { route } = this.props;

    const newProduct = route.params && route.params.newProduct;
    const optionSelected = route.params && route.params.optionSelected;
    const email = route.params && route.params.email;
    const targetId = route.params && route.params.targetId;

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

  render() {
    const {
      isTermsValid,
      showTerms,
      showTermsPersonalData,
      isValid,
      isLoading,
    } = this.state;
    const { route, isFocused } = this.props;

    const resume = route.params && route.params.resume;
    const newProduct = route.params && route.params.newProduct;
    const optionSelected = route.params && route.params.optionSelected;

    const currency = newProduct.request.currency.id + '';
    const requestAmount = Amount.format(resume.amount, currency);
    const totalAmount = Amount.format(resume.totalAmount, currency);
    const targetName = resume.debitAccount;
    const amountFee = Amount.format(resume.amountFee, currency);

    const insuranceDisposal = Amount.format(resume.insuranceDisposal, currency);
    const { insuranceDisposalRate, rate, payDay } = resume;
    const term = resume.term + '';

    const itfAmount = Amount.format(optionSelected.itf, currency);

    return (
      <Container>
        <Modal
          visible={isLoading}
          onClose={() => {
            this.setState({ isLoading: false });
          }}
        >
          <View style={styles.loadingContainer}>
            <View style={{ width: 70, height: 70 }}>
              <LoadingMibanco
                accessibilityLabel={'instantcashsuccessscreen_happy'}
                style={{
                  height: 70,
                  paddingTop: 0,
                  marginTop: 0,
                }}
              />
            </View>
            <Text style={styles.textLoading}>
              {L.instantcashfastconfirmscreen_loading_title}
            </Text>
          </View>
        </Modal>
        <TermsModal
          accessibilityLabel={
            'instantcashshortconfirmscreen_termsmodal_personal_data'
          }
          visible={showTermsPersonalData}
          title={L.termsmodal_instantcash_personal_data_title}
          body={L.termsmodal_instantcash_personal_data_protection}
          onClose={this.closeTermsPersonalData}
          closeButton={{
            title: L.instantcashfastconfirmscreen_terms_modal_button_close,
            onPress: this.closeTermsPersonalData,
          }}
          actionButton={{
            title: L.instantcashfastconfirmscreen_terms_modal_button_accept,
            onPress: this.onAcceptTermsPersonalData,
          }}
        />
        <TermsModal
          accessibilityLabel={'instantcashfastconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_instantcash}
          onClose={this.closeTerms}
          closeButton={{
            title: L.instantcashfastconfirmscreen_personal_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.instantcashfastconfirmscreen_personal_modal_button_accept,
            onPress: this.onAcceptTerms,
          }}
        />
        <FormSteps total={3} current={2} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight:
              Size.getVisibleTabScreenHeight() + Size.getHeaderBarHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical>
              <NetworkStatusAlert style={styles.marginTop} />

              <Header
                accessibilityLabel={'instantcashfastconfirmscreen_header_title'}
                style={styles.marginTop}
                title={L.instantcashfastconfirmscreen_header_title}
                center
              />

              <CardView style={styles.cardOverview}>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_request_amount'
                  }
                >
                  {L.instantcashfastconfirmscreen_text_request_amount}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_request_amount_description'
                  }
                >
                  {requestAmount}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_target_account'
                  }
                >
                  {L.instantcashfastconfirmscreen_text_target_account}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_target_account_description'
                  }
                >
                  {targetName}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_amount_fee'
                  }
                >
                  {L.instantcashfastconfirmscreen_text_amount_fee}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_amount_fee_description'
                  }
                >
                  {amountFee}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={'instantcashfastconfirmscreen_text_term'}
                >
                  {L.instantcashfastconfirmscreen_text_term}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_term_description'
                  }
                >
                  {term}{' '}
                  {term === '1'
                    ? L.instantcashfastconfirmscreen_text_term_label_singular
                    : L.instantcashfastconfirmscreen_text_term_label_plural}
                </Text>
                <Text
                  style={styles.formLabel}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_pay_day'
                  }
                >
                  {L.instantcashfastconfirmscreen_text_pay_day}
                </Text>
                <Text
                  style={styles.formText}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_text_pay_day_description'
                  }
                >
                  {payDay}{' '}
                  {L.instantcashfastconfirmscreen_text_paymentdate_label}
                </Text>
                <ExpandableView
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_expandable_view'
                  }
                  maxHeight={140}
                  toggleContainerStyle={styles.marginToggle}
                  style={styles.marginExpandableView}
                >
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_pay_tcea'
                    }
                  >
                    {L.instantcashfastconfirmscreen_text_pay_tcea}
                  </Text>
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_pay_tcea_description'
                    }
                  >
                    {rate}
                    {'%'}
                  </Text>
                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_insurance_disposal'
                    }
                  >
                    {L.instantcashfastconfirmscreen_text_insurance_disposal}
                  </Text>
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_insurance_disposal_description'
                    }
                  >
                    {insuranceDisposal} {'('}
                    {insuranceDisposalRate}
                    {'%)'}
                  </Text>

                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_amount'
                    }
                  >
                    {L.instantcashshortconfirmscreen_text_itf}
                  </Text>
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_amount_description'
                    }
                  >
                    {itfAmount}
                  </Text>

                  <Text
                    style={styles.formLabel}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_amount'
                    }
                  >
                    {L.instantcashfastconfirmscreen_text_amount}
                  </Text>
                  <Text
                    style={styles.formText}
                    accessibilityLabel={
                      'instantcashfastconfirmscreen_text_amount_description'
                    }
                  >
                    {totalAmount}
                  </Text>
                </ExpandableView>
              </CardView>
              <CardView style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_confirmcode'
                  }
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>

              <CardView padding>
                <CheckBoxMulti
                  ref={ref => {
                    this.termsPersonalData = ref;
                  }}
                  accessibilityLabel={
                    'instantcashshortconfirmscreen_checkbox_terms'
                  }
                  container={
                    <Text style={styles.cardText}>
                      <Text style={styles.textTerms}>
                        {
                          L.instantcashfastconfirmscreen_checkbox_dataprotect_part1
                        }
                      </Text>
                      <Text
                        onPress={this.showTermsPersonalData}
                        style={styles.textTermsLinks}
                      >
                        {L.instantcashfastconfirmscreen_checkbox_dataprotect_part2 +
                          '.'}
                      </Text>
                    </Text>
                  }
                />
              </CardView>

              <CardView style={styles.cardSMSConfirm}>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_checkbox_terms'
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={
                    L.instantcashfastconfirmscreen_checkbox_terms_part1
                  }
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'instantcashfastconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={
                        L.instantcashfastconfirmscreen_checkbox_terms_part2 +
                        '.'
                      }
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.instantcashfastconfirmscreen_texterror_terms
                  }
                />
              </CardView>
              <View style={styles.buttons}>
                <Button
                  disabled={!isValid}
                  allowOnPress
                  accessibilityLabel={
                    'instantcashfastconfirmscreen_button_continue'
                  }
                  onPress={this.tryToSubmit}
                  loading={isValid && isLoading}
                  title={L.instantcashfastconfirmscreen_button_continue}
                />
              </View>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type InstantCashFastConfirmScreenType = InstantCashFastConfirmScreen;
export default withFocused<InstantCashFastConfirmScreen, Props>(
  InstantCashFastConfirmScreen
);
