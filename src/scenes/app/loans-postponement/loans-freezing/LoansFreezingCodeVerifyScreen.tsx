import * as React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  Container,
  KeyboardAvoidingView,
  SafeAreaView,
  Content,
  NetworkStatusAlert,
  Header,
  Button,
  FormSteps,
  CardView,
  CheckBox,
  ButtonLink,
} from '../../../../components/ui';
import { L } from '../../../../resources/language';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import { Size } from '../../../../resources/dimensions';
import { Font, Validate } from '../../../../resources/functions';
import {
  LoansItem,
  LoansItemFeeComplete,
  LoanPostponementPreviewResponse,
  LoanPostponementSendResponse,
} from '../../../../api/backend/response/Execute';
import ConfirmCode from '../../../../components/sms/ConfirmCode';
import NetworkManager from '../../../../components/network/NetworkManager';
import TermsModal from '../../../../components/info/TermsModal';
import { Log } from '../../../../resources/log';
import { KeyboardUtil } from '../../../../resources/util';
import API from '../../../../api';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import { Emitter } from '../../../../resources/listeners';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { ErrorRequest } from '../../../../resources/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
  } as TextStyle,
  titleButton: {
    fontSize: 16,
  } as TextStyle,
  buttonFreezing: {
    marginVertical: 30,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
  } as ViewStyle,
  headeMain: {
    fontSize: 16,
  } as TextStyle,
  header: {
    marginTop: 32,
    marginBottom: 20,
  } as ViewStyle,
});

export interface NavigationParams {
  loan: LoansItem;
  feesFreezing: LoansItemFeeComplete[];
  numberLoan: number;
  numberCredit: number;
  tcea: number;
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
  phone: string;
  isAllowedReadSMS: boolean;
  loan?: LoansItem;
  numberLoan: number;
  numberCredit: number;
  tcea: number;
  currency: number;
  operationNumber: number;
  operationDate: string;
  feesFreezing?: LoansItemFeeComplete[];
  isLoadingResend: boolean;
  isLoading: boolean;
}

const NRO_FEES = '<<NRO_FEES>>';
const TEXT_FEES = '<<TEXT_FEES>>';
const TEXT_YOUR_FEES = '<<TEXT_YOUR_FEES>>';
const TAG = '[LoansFreezingCodeVerifyScreen]';
class LoansFreezingCodeVerifyScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.loansfreezingcodeverifyscreen_title,
  //   header: (props: HeaderProps) => {
  //     return <HeaderMain styleTitle={styles.headeMain} {...props} />;
  //   },
  // };

  state: State = {
    isValid: false,
    isTermsValid: true,
    showTerms: false,
    phone: '',
    isAllowedReadSMS: false,
    loan: undefined,
    numberLoan: 0,
    numberCredit: 0,
    tcea: 0,
    currency: 0,
    operationNumber: 0,
    operationDate: '',
    feesFreezing: [],
    isLoadingResend: false,
    isLoading: false,
  };

  code!: ConfirmCode | null;
  terms!: CheckBox | null;

  componentDidMount() {
    this.load();
  }

  blur = () => {
    KeyboardUtil.hide();
  };

  load = async () => {
    const { route } = this.props;

    const loan = route.params && route.params.loan;
    const feesFreezing = route.params && route.params.feesFreezing;
    const numberLoan = route.params && route.params.numberLoan;
    const numberCredit = route.params && route.params.numberCredit;
    const tcea = route.params && route.params.tcea;
    const currency = route.params && route.params.currency;
    const operationNumber = route.params && route.params.operationNumber;
    const operationDate = route.params && route.params.operationDate;



    this.setState({
      loan,
      feesFreezing,
      numberLoan,
      numberCredit,
      tcea,
      currency,
      operationNumber,
      operationDate,
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
    const { navigation, route } = this.props;
    const { phone, loan, numberLoan, currency } = this.state;
    const feesFreezing = route.params && route.params.feesFreezing;


    if (!loan) {
      return;
    }

    try {
      const feesFreezingCalculated = !!feesFreezing.length
        ? feesFreezing.length
        : 0;
      const response = await API.Execute.requestLoanPostponementSend({
        acceptTermAndCondition: true,
        _otp: this.code ? this.code.getValue() : '',
        amount: 0,
        term: feesFreezingCalculated,
        payday: 0,
        currency,
        grace: {
          period: 0,
          type: 'N',
        },
        reschedule: {
          loansId: numberLoan.toString(),
          type: 20,
          monthsadd: 0,
          freezequotas: feesFreezingCalculated,
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
        const data = response.body.data as LoanPostponementSendResponse;
        const { tcea, currency, reschedule, operation } = data;
        const numberCredit = !!reschedule.loans?.length
          ? reschedule.loans[0].number
          : 0;

        this.setState({ isLoading: false });
        navigation.navigate('LoansFreezingSuccess', {
          loan,
          feesFreezing,
          numberCredit,
          tcea,
          currency: currency.id,
          operationNumber: operation.number,
          operationDate: operation.date,
          phone,
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

  getPhoneNumber = (phone: string) => {
    this.setState({ phone });
  };

  onChangeCode = () => {
    this.isValid(false);
  };

  isValid = (showErrors = true) => {
    const isValidCode = this.isValidCode(showErrors);
    const isValidTerms = this.isValidTerms(showErrors);
    const isValid = [isValidCode, isValidTerms].every(item => !!item);
    this.setState({ isValid });
    return isValid && NetworkManager.isConnected;
  };

  isValidCode = (showErrors = true) => {
    return this.code && this.code.isValid(showErrors);
  };

  isValidTerms = (showError = true) => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    if (showError) {
      this.setState({ isTermsValid });
    }
    return isTermsValid;
  };

  focusIfAllowed = () => {
    const { isAllowedReadSMS } = this.state;
    !isAllowedReadSMS && this.focus();
  };

  focus = () => {
    Log.debug(TAG, 'focus');
    this.code && this.code.focus();
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

  onResend = async () => {
    const { loan, numberLoan, currency, feesFreezing } = this.state;

    if (!loan) {
      return;
    }

    if (!feesFreezing?.length) {
      return;
    }

    this.blur();
    this.setState({ isLoadingResend: true });

    try {
      const feesFreezingCalculated = !!feesFreezing.length
        ? feesFreezing.length
        : 0;
      const response = await API.Execute.requestLoanPostponementPreview({
        sendOTP: true,
        amount: 0,
        term: feesFreezingCalculated,
        payday: 0,
        currency,
        grace: {
          period: 0,
          type: 'N',
        },
        reschedule: {
          loansId: numberLoan.toString(),
          type: 20,
          monthsadd: 0,
          freezequotas: feesFreezingCalculated,
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
        const { tcea, currency, reschedule, operation } = data;
        const numberLoan = !!reschedule.loans?.length
          ? reschedule.loans[0].id
          : 0;
        const numberCredit = !!reschedule.loans?.length
          ? reschedule.loans[0].number
          : 0;

        this.setState(
          {
            numberLoan,
            numberCredit,
            tcea,
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

  render() {
    const {
      isTermsValid,
      showTerms,
      isValid,
      isLoading,
      feesFreezing,
    } = this.state;
    const { isFocused } = this.props;
    const nroFeeFreezing = !!feesFreezing?.length ? feesFreezing.length : '';
    const textYourFeeCalculated = L.loansfreezingcodeverifyscreen_header_title.replace(
      TEXT_YOUR_FEES,
      nroFeeFreezing > 1
        ? L.loansfreezingcodeverifyscreen_title_plural_your_fee
        : L.loansfreezingcodeverifyscreen_title_singular_your_fee
    );
    const textNroFeeCalculated = textYourFeeCalculated.replace(
      NRO_FEES,
      nroFeeFreezing > 1 ? ' ' + nroFeeFreezing + ' ' : ' '
    );
    const textFeeCalculated = textNroFeeCalculated.replace(
      TEXT_FEES,
      nroFeeFreezing > 1
        ? L.loansfreezingcodeverifyscreen_title_plural_fee
        : L.loansfreezingcodeverifyscreen_title_singular_fee
    );

    const textBtn = L.loansfreezingcodeverifyscreen_button_freezing.replace(
      TEXT_FEES,
      nroFeeFreezing > 1
        ? L.loansfreezingcodeverifyscreen_title_plural_fee
        : L.loansfreezingcodeverifyscreen_title_singular_fee
    );

    return (
      <Container>
        <TermsModal
          accessibilityLabel={'loansfreezingcodeverifyscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_loans_freezing}
          onClose={this.closeTerms}
          closeButton={{
            title: L.loansfreezingsuccessscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.loansfreezingsuccessscreen_modal_button_accept,
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
            <Content vertical>
              <NetworkStatusAlert style={styles.networkStatus} />
              <Header
                center
                accessibilityLabel={'loansfreezingcodeverifyscreen_header'}
                title={textFeeCalculated}
                titleStyle={styles.title}
                style={styles.header}
              />
              <CardView padding style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={'loansfreezingverifyscreen_confirmcode'}
                  onResend={this.onResend}
                  onChangeText={this.onChangeCode}
                  autoFocus={false}
                  onPhoneNumber={this.getPhoneNumber}
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
                    'loansfreezingcodeverifyscreen_buttonlink_terms'
                  }
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={
                    L.loansfreezingcodeverifyscreen_checkbox_terms_part1
                  }
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'loansfreezingcodeverifyscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={
                        L.loansfreezingcodeverifyscreen_checkbox_terms_part2
                      }
                    />
                  }
                  errorMessage={
                    isTermsValid
                      ? ''
                      : L.loansfreezingcodeverifyscreen_texterror_terms
                  }
                />
              </CardView>
              <Button
                disabled={!isValid}
                accessibilityLabel={
                  'loansfreezingcodeverifyscreen_button_reprogramar'
                }
                title={textBtn}
                onPress={this.tryToSuccess}
                loading={isLoading}
                textStyle={styles.titleButton}
                style={styles.buttonFreezing}
                allowOnPress
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type LoansFreezingCodeVerifyScreenType = LoansFreezingCodeVerifyScreen;
export default withFocused<LoansFreezingCodeVerifyScreen, Props>(
  LoansFreezingCodeVerifyScreen
);
