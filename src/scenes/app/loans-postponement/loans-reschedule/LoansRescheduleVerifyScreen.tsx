import * as React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  Text,
  ImageStyle,
} from 'react-native';
import {
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  NetworkStatusAlert,
  Header,
  DetailItem,
  Button,
  FormSteps,
  CardView,
  CheckBox,
  ButtonLink,
  TextInputMasked,
  AlertModalUpdate,
} from '../../../../components/ui';
import { L } from '../../../../resources/language';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import { Size } from '../../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../../resources/functions';
import {
  LoansItem,
  PreferencesUserDataModifyPreResponse,
  LoanPostponementPreviewResponse,
  LoanPostponementSendResponse,
} from '../../../../api/backend/response/Execute';
import { Amount } from '../../../../resources/money';
import ConfirmCode from '../../../../components/sms/ConfirmCode';
import NetworkManager from '../../../../components/network/NetworkManager';
import { MaskModel, MaskObj } from '../../../../resources/persistence/models';
import { Colors, Loan, ErrorRequest } from '../../../../resources/constants';
import API from '../../../../api';
import { Log } from '../../../../resources/log';
import { Emitter } from '../../../../resources/listeners';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import { KeyboardUtil } from '../../../../resources/util';
import TermsModal from '../../../../components/info/TermsModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const moment = require('moment');

const styles = StyleSheet.create({
  networkStatus: {
    marginBottom: 10,
    marginTop: 10,
  } as ViewStyle,
  title: {
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
    fontSize: 22,
    lineHeight: 25,
    marginTop: 32,
    marginBottom: 20,
  } as TextStyle,
  detailContainer: {
    width: '100%',
    padding: 20,
  } as ViewStyle,
  titleButton: {
    fontSize: 16,
  } as TextStyle,
  buttonReschedule: {
    marginVertical: 30,
  } as ViewStyle,
  marginDetail: {
    marginBottom: 10,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
  } as ViewStyle,
  textEmailHelp: {
    ...Font({ weight: 'Medium', style: 'Italic' }),
    color: Colors.secondary,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  supplyCode: {
    ...Font(),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 19,
  } as TextStyle,
  spaceEmail: {
    marginTop: 4,
    marginBottom: 10,
  } as ViewStyle,
  receiveDocs: {
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    ...Font({ weight: 'Regular' }),
  } as TextStyle,
  receiveDocsSpace: {
    marginBottom: 10,
  } as ViewStyle,
  receiveDocsTitle: {
    marginBottom: 20,
    paddingVertical: 0,
    fontSize: 18,
    lineHeight: 22,
    color: Colors.primary,
  } as ViewStyle,
  textActionbtnReceiveDocsModal: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  viewActionReceiveDocs: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    width: Size.getWidth() * 0.7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
    paddingTop: 0,
  } as ViewStyle,
  btnReceiveDocs: {
    width: Size.getWidth() * 0.8,
    marginTop: 3,
    padding: 0,
    alignSelf: 'flex-start',
  } as ViewStyle,
  iconButton: {
    tintColor: Colors.secondary,
    width: 16,
    height: 16,
    alignSelf: 'flex-end',
    marginLeft: -10,
  } as ImageStyle,
  titleReceiveDocs: {
    color: Colors.grey6,
    ...Font({ weight: 'SemiBold' }),
    textAlign: 'left',
  } as TextStyle,
});

export interface NavigationParams {
  loan: LoansItem;
  numberLoan: number;
  amountLoan: number;
  fee: number;
  tcea: number;
  periodGrace: number;
  term: number;
  datePay: string;
  currency: number;
  operationNumber: number;
  operationDate: string;
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isValid: boolean;
  isTermsValid: boolean;
  showTerms: boolean;
  emailMasked?: MaskModel;
  user?: PreferencesUserDataModifyPreResponse;
  isLoading: boolean;
  isAllowedReadSMS: boolean;
  isLoadingResend: boolean;
  loan?: LoansItem;
  numberLoan: number;
  amountLoan: number;
  fee: number;
  tcea: number;
  periodGrace: number;
  term: number;
  datePay: string;
  currency: number;
  operationNumber: number;
  operationDate: string;
  isShowModalCancel: boolean;
}

const TAG = '[LoansRescheduleVerifyScreen]';

class LoansRescheduleVerifyScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isValid: false,
    isTermsValid: true,
    showTerms: false,
    isLoading: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    loan: undefined,
    numberLoan: 0,
    amountLoan: 0,
    fee: 0,
    tcea: 0,
    periodGrace: 0,
    term: 0,
    datePay: '',
    currency: 0,
    operationNumber: 0,
    operationDate: '',
    isShowModalCancel: false,
  };

  code!: ConfirmCode | null;
  terms!: CheckBox | null;
  emailInput!: TextInputMasked | null;

  componentDidMount() {
    this.load();
  }

  blur = () => {
    KeyboardUtil.hide();
  };

  load = async () => {
    const { route } = this.props;
    const loan = route.params && route.params.loan;
    const numberLoan = route.params && route.params.numberLoan;
    const amountLoan = route.params && route.params.amountLoan;
    const fee = route.params && route.params.fee;
    const tcea = route.params && route.params.tcea;
    const periodGrace = route.params && route.params.periodGrace;
    const term = route.params && route.params.term;
    const datePay = route.params && route.params.datePay;
    const currency = route.params && route.params.currency;
    const operationNumber = route.params && route.params.operationNumber;
    const operationDate = route.params && route.params.operationDate;

    this.setState({
      loan,
      numberLoan,
      amountLoan,
      fee,
      tcea,
      periodGrace,
      term,
      datePay,
      currency,
      operationNumber,
      operationDate,
    });

    await this.loadProfile();
    const { user } = this.state;
    if (user && user._mail) {
      const masked = Sanitizer.maskEmail(user._mail);
      const emailMasked = MaskObj.init(user._mail, masked);
      this.setState({ emailMasked });
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

  onChangeCode = () => {
    this.isValid(false);
  };

  onChangeCheckboxTermsValue = (value: boolean) => {
    this.setState({ isTermsValid: value }, () => this.isValid());
  };

  onAcceptTerms = () => {
    this.terms && this.terms.setValue(true);
    this.closeTerms();
  };

  showTerms = () => {
    this.setState({ showTerms: true });
  };

  closeTerms = () => {
    this.setState({ showTerms: false });
  };

  onPressInputEmail = () => {
    this.setState({ emailMasked: undefined, isValid: false }, () => {
      this.emailInput && this.emailInput.focus();
    });
  };

  onEmptyStateEmail = () => {
    this.isValidEmail(true);
    this.isValid(false);
  };

  onSubmitEditingEmail = () => {
    this.isValidEmail(true);
    this.isValid(false);
  };

  getEmail = () => {
    const { emailMasked } = this.state;
    if (emailMasked) {
      return emailMasked.value;
    }
    return this.emailInput ? this.emailInput.getValue() : '';
  };

  isValid = (showErrors = true) => {
    const isValidEmail = this.isValidEmail(showErrors);
    const isValidCode = this.isValidCode(showErrors);
    const isValidTerms = this.isValidTerms(showErrors);
    const isValid = [isValidEmail, isValidCode, isValidTerms].every(
      item => !!item
    );

    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  isValidTerms = (showError = true) => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    if (showError) {
      this.setState({ isTermsValid });
    }
    return isTermsValid;
  };

  isValidCode = (showErrors = true) => {
    return this.code && this.code.isValid(showErrors);
  };

  isValidEmail = (showError = true) => {
    const value = this.getEmail();
    if (!value) {
      showError &&
        this.emailInput &&
        this.emailInput.setError(
          L.loansrescheduleverifyscreen_textinput_email_error_empty
        );
      return false;
    }

    const isValid = Validate.email(value);
    if (!isValid) {
      showError &&
        this.emailInput &&
        this.emailInput.setError(
          L.loansrescheduleverifyscreen_textinput_email_error_format
        );
      return false;
    }
    return true;
  };

  focusIfAllowed = () => {
    const { isAllowedReadSMS } = this.state;
    !isAllowedReadSMS && this.focus();
  };

  focus = () => {
    Log.debug(TAG, 'focus');
    this.code && this.code.focus();
  };

  onResend = async () => {
    const { loan, numberLoan, periodGrace, term, currency } = this.state;

    if (!loan) {
      return;
    }

    this.blur();
    this.setState({ isLoadingResend: true });

    try {
      const termCalculated =
        loan.totalFees - loan.paidFees + Loan.Terms[term].quantity;
      const response = await API.Execute.requestLoanPostponementPreview({
        sendOTP: true,
        amount: 0,
        term: termCalculated,
        payday: 0,
        currency,
        grace: {
          period: Loan.PeriodsGrace[periodGrace].quantity,
          type: 'H',
        },
        reschedule: {
          loansId: numberLoan.toString(),
          type: 19,
          monthsadd: Loan.Terms[term].quantity,
          freezequotas: 0,
        },
        documents: {
          delivery: {
            type: 0,
            destination: '',
          },
        },
      });
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const data = response.body.data as LoanPostponementPreviewResponse;
        const { fee, tcea, grace, reschedule, currency, operation } = data;

        const requesttotalamount = !!reschedule.loans?.length
          ? reschedule.loans[0].requesttotalamount
          : 0;
        const numberLoan = !!reschedule.loans?.length
          ? reschedule.loans[0].id
          : 0;

        this.setState(
          {
            numberLoan,
            amountLoan: requesttotalamount,
            fee: fee.amount,
            tcea,
            periodGrace: grace.period,
            term: reschedule.monthsadd,
            datePay: fee.expirationdate,
            currency: currency.id,
            operationNumber: operation.number,
            operationDate: operation.date,
            isLoadingResend: false,
          },
          () => {
            this.code && this.code.setValue('');
            this.focusIfAllowed();
          }
        );
        return;
      }
      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.NO_FIELD) {
        hasError = true;
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      }
      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
    }
    this.setState({ isLoadingResend: false }, () => {
      this.code && this.code.setValue('');
      this.focusIfAllowed();
    });
  };

  tryToSuccess = () => {
    this.blur();

    if (this.isValid()) {
      this.setState({ isLoading: true });
      this.goToSuccess();
    }
  };

  goToSuccess = async () => {
    const { navigation } = this.props;
    const { loan, numberLoan, periodGrace, term, currency } = this.state;

    if (!loan) {
      return;
    }

    try {
      const termCalculated =
        loan.totalFees - loan.paidFees + Loan.Terms[term].quantity;
      const email = this.getEmail();
      const response = await API.Execute.requestLoanPostponementSend({
        acceptTermAndCondition: true,
        _otp: this.code ? this.code.getValue() : '',
        amount: 0,
        term: termCalculated,
        payday: 0,
        currency,
        grace: {
          period: Loan.PeriodsGrace[periodGrace].quantity,
          type: 'H',
        },
        reschedule: {
          loansId: numberLoan.toString(),
          type: 19,
          monthsadd: Loan.Terms[term].quantity,
          freezequotas: 0,
        },
        documents: {
          delivery: {
            type: 0,
            destination: email,
          },
        },
      });
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'load', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const data = response.body.data as LoanPostponementSendResponse;
        const { fee, tcea, currency, grace, reschedule, operation } = data;
        const requesttotalamount = !!reschedule.loans?.length
          ? reschedule.loans[0].requesttotalamount
          : 0;
        this.setState({ isLoading: false });
        navigation.navigate('LoansRescheduleSuccess', {
          loan,
          amountLoan: requesttotalamount,
          fee: fee.amount,
          tcea,
          periodGrace: grace.period,
          term: reschedule.monthsadd,
          datePay: fee.expirationdate,
          currency: currency.id,
          operationNumber: operation.number,
          operationDate: operation.date,
        });
        return;
      }
      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;

      if (error.NO_FIELD) {
        hasError = true;
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      }
      if (error.otp || error._otp) {
        hasError = true;
        this.code && this.code.setCodeError(error.otp || error._otp);
      }
      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'submit',
          e: ErrorRequest.Default,
        });
      this.setState({ isLoading: false });
    } catch (e) {
      Log.info(TAG, 'load', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'load',
        e,
      });
      this.setState({ isLoading: false });
    }
  };

  closeModalCancel = () => {
    this.setState({ isShowModalCancel: false });
  };

  btnReceiveDocs = () => {
    this.setState({ isShowModalCancel: true });
  };

  render() {
    const {
      isTermsValid,
      emailMasked,
      isLoading,
      loan,
      amountLoan,
      datePay,
      fee,
      tcea,
      periodGrace,
      term,
      isValid,
      currency,
      showTerms,
      isShowModalCancel,
    } = this.state;
    const { isFocused } = this.props;
    const date = moment(
      datePay,
      L.loansrescheduleverifyscreen_input_format_date
    )
      .format(L.loansrescheduleverifyscreen_output_format_date)
      .toLowerCase();

    return (
      <Container>
        <AlertModalUpdate
          title={'Recibir los documentos y el\nestado de cuenta del\npréstamo'}
          showMessageLarge
          messageLarge={
            <View>
              <Text style={[styles.receiveDocs, styles.receiveDocsSpace]}>
                {L.loansrescheduleverifyscreen_button_info_docs1}
              </Text>
              <Text style={styles.receiveDocs}>
                {L.loansrescheduleverifyscreen_button_info_docs2}
              </Text>
            </View>
          }
          visible={isShowModalCancel}
          titleStyle={styles.receiveDocsTitle}
          actionButton={{
            accessibilityLabel: 'loansrescheduleverifyscreen_tooltip_terms',
            title: 'Entiendo',
            preventClose: true,
            onPress: this.closeModalCancel,
            textStyle: styles.textActionbtnReceiveDocsModal,
            light: true,
            style: styles.viewActionReceiveDocs,
          }}
          onClose={this.closeModalCancel}
        />
        <TermsModal
          accessibilityLabel={'loansrescheduleverifyscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_loans_reschedule}
          onClose={this.closeTerms}
          closeButton={{
            title: L.loansrescheduleverifyscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.loansrescheduleverifyscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
          }}
        />
        <FormSteps total={4} current={3} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content vertical center>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Header
                center
                accessibilityLabel={'loansreschedulemessagescreen_header'}
                title={L.loansrescheduleverifyscreen_header_title}
                titleStyle={styles.title}
              />
              <CardView style={styles.cardView}>
                {!!loan && (
                  <View style={styles.detailContainer}>
                    <DetailItem
                      label={L.loansrescheduleverifyscreen_resume_title1}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_label_nameloan'
                      }
                      text={Sanitizer.cleanProductLabel(loan.shortLabel, loan)}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansrescheduleverifyscreen_resume_title2}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_label_amountloan'
                      }
                      text={Amount.format(amountLoan, currency.toString())}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansrescheduleverifyscreen_resume_title3}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_label_fee'
                      }
                      text={Amount.format(fee, currency.toString())}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansrescheduleverifyscreen_resume_title4}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_label_tcea'
                      }
                      text={`${tcea}%`}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansrescheduleverifyscreen_resume_title5}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_label_periodgrace'
                      }
                      text={Loan.PeriodsGrace[periodGrace].title}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansrescheduleverifyscreen_resume_title6}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_label_term'
                      }
                      text={Loan.Terms[term].title}
                      style={styles.marginDetail}
                    />
                    <DetailItem
                      label={L.loansrescheduleverifyscreen_resume_title7}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_label_datetime'
                      }
                      text={date}
                      style={styles.marginDetail}
                    />
                  </View>
                )}
              </CardView>
              <CardView padding style={styles.cardView}>
                <ButtonLink
                  accessibilityLabel={
                    'loansrescheduleverifyscreen_tooltip_terms'
                  }
                  style={styles.btnReceiveDocs}
                  onPress={this.btnReceiveDocs}
                  titleStyle={styles.titleReceiveDocs}
                  title={
                    'Recibir los documentos y el estado de\ncuenta del préstamo en este correo'
                  }
                  imageSource={require('../../../../assets/images/help-icon.png')}
                  imagePosition={'right'}
                  imageStyle={styles.iconButton}
                />
                <TextInputMasked
                  mask={emailMasked}
                  onPress={this.onPressInputEmail}
                  accessibilityLabel={
                    'loansrescheduleverifyscreen_textinputmasked_email'
                  }
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  blurOnSubmit
                  ref={ref => {
                    this.emailInput = ref;
                  }}
                  containerStyle={styles.spaceEmail}
                  onEmptyState={this.onEmptyStateEmail}
                  onSubmitEditing={this.onSubmitEditingEmail}
                  returnKeyType={'done'}
                  style={styles.supplyCode}
                  onBlur={this.onEmptyStateEmail}
                  placeholder={L.loansrescheduleverifyscreen_email_placeholder}
                />
                <Text style={styles.textEmailHelp}>
                  {L.loansrescheduleverifyscreen_email_subtitle}
                </Text>
              </CardView>
              <CardView padding style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={'loansrescheduleverifyscreen_confirmcode'}
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
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
                    'loansrescheduleverifyscreen_buttonlink_terms'
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={
                    L.loansrescheduleverifyscreen_checkbox_terms_part1
                  }
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'loansrescheduleverifyscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={L.loansrescheduleverifyscreen_checkbox_terms_part2}
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.loansrescheduleverifyscreen_texterror_terms
                  }
                />
              </CardView>
              <Button
                disabled={!isValid}
                accessibilityLabel={
                  'loansrescheduleconfirmscreen_button_reprogramar'
                }
                title={L.loansrescheduleverifyscreen_button_reschedule}
                onPress={this.tryToSuccess}
                loading={isLoading}
                textStyle={styles.titleButton}
                style={styles.buttonReschedule}
                allowOnPress
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansRescheduleVerifyScreenType = LoansRescheduleVerifyScreen;
export default withFocused<LoansRescheduleVerifyScreen, Props>(
  LoansRescheduleVerifyScreen
);
