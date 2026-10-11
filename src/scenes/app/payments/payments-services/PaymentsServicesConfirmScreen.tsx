import * as React from 'react';
import {
  StyleSheet,
  ScrollView,
  ViewStyle,
  InteractionManager,
  TextStyle,
} from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Container,
  Header,
  Button,
  CardView,
  SafeAreaView,
  FormSteps,
  Content,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  DetailItem,
  Loading,
  CheckBox,
  ButtonLink,
} from '../../../../components/ui';
import { L } from '../../../../resources/language';
import { Font, Validate, Sanitizer } from '../../../../resources/functions';
import { Colors, ErrorRequest } from '../../../../resources/constants';
import { Amount } from '../../../../resources/money';
import { Size } from '../../../../resources/dimensions';
import Log from '../../../../resources/log/Log';
import {
  ServicePaymentPreviewResponse,
  AccountItemSavingsAll,
  Bill,
} from '../../../../api/backend/response/Execute';
import NetworkManager from '../../../../components/network/NetworkManager';
import { Emitter } from '../../../../resources/listeners';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import API from '../../../../api';
import { KeyboardUtil } from '../../../../resources/util';
import { CurrencyType } from '../../../../resources/persistence/models/AmountModel';
import TermsModal from '../../../../components/info/TermsModal';
import { DetailItemProps } from '../../../../components/transactions/DetailItem';
import ConfirmCode from '../../../../components/sms/ConfirmCode';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    maxWidth: '73%',
    alignSelf: 'center',
  } as ViewStyle,
  detailItem: {
    marginTop: 10,
  } as ViewStyle,
  cardView: {
    marginBottom: 20,
  } as ViewStyle,
  amountText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 14,
    lineHeight: 18,
  } as TextStyle,
  amountLabelText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  button: {
    marginTop: 30,
    marginBottom: 40,
    height: 50,
  } as ViewStyle,
  textButton: {
    fontSize: 16,
  } as TextStyle,
  buttonLinkPadding: {
    paddingVertical: 0,
    paddingLeft: 0,
  } as ViewStyle,
  content: {
    marginTop: 10,
  } as ViewStyle,
  termStyle: {
    fontSize: 14,
    textAlign: 'left',
  } as TextStyle,
});

export interface NavigationParams {
  resume: ServicePaymentPreviewResponse;
  bill: Bill;
  currency: CurrencyType;
  origin: AccountItemSavingsAll;
  supplyLabel: string;
}

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isAllowedReadSMS: boolean;
  resume?: ServicePaymentPreviewResponse;
  currency: CurrencyType;
  isLoading: boolean;
  isValid: boolean;
  bill?: Bill;
  origin?: AccountItemSavingsAll;
  supplyLabel?: string;
  isTermsValid: boolean;
  showTerms: boolean;
  isRequiredTerms: boolean;
}

const TAG = '[PaymentsServicesConfirmScreen]';
class PaymentsServicesConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.paymentsservicesscreen_title,
  // };

  state: State = {
    isAllowedReadSMS: false,
    isValid: false,
    isLoading: false,
    currency: CurrencyType.PEN,
    isTermsValid: true,
    showTerms: false,
    isRequiredTerms: true,
  };

  scroll!: ScrollView | null;
  code!: ConfirmCode | null;
  terms!: CheckBox | null;

  componentDidMount() {
    const { route } = this.props;

    const currency = route.params ? route.params.currency : CurrencyType.PEN;
    const origin = route.params && route.params.origin;
    const resume = route.params && route.params.resume;
    const bill = route.params && route.params.bill;
    const supplyLabel = route.params && route.params.supplyLabel;

    this.setState({ currency, resume, bill, origin, supplyLabel });
  }

  isValidCode = () => {
    return this.code ? this.code.isValid() : false;
  };

  isValid = () => {
    const isValid = [
      this.isValidCode(),
      NetworkManager.isConnected,
      this.isValidTerms(),
    ].every(value => value);

    this.setState({ isValid });
    return isValid;
  };

  blur = () => {
    KeyboardUtil.hide();
  };

  tryToSubmit = async () => {
    const isValid = this.isValid();
    const isTermsValid = this.isValidTerms();
    if (!isValid || !isTermsValid) {
      return;
    }
    this.blur();
    this.scrollToEnd();
    this.setState({ isLoading: true });
    await this.submit();
    this.setState({ isLoading: false });
  };

  scrollToEnd = () => {
    InteractionManager.runAfterInteractions(() => {
      this.scroll && this.scroll.scrollToEnd();
    });
  };
  submit = async () => {
    const { resume, bill, supplyLabel, origin } = this.state;
    if (!resume || !bill || !origin) {
      Log.info(TAG, 'submit', 'empty data');
      return;
    }

    try {
      const { navigation } = this.props;
      const response = await API.Execute.servicePaymentSend({
        valueDate: '',
        isFrequentContact: false.toString(),
        aceptTermAndCondition: true.toString(),
        frequentPaymentAlias: '',
        _otp: this.code ? this.code.getValue() : '',
        totalAmount: resume.totalAmount,
        debitAccount: origin.idProduct,
        billSelector: bill,
      });

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        const idTransaction = response.body.idTransaction;
        navigation.navigate('PaymentsServicesSuccess', {
          supplyLabel,
          idTransaction,
          origin,
        });
        return;
      }

      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      const errorMessage = error.NO_FIELD || error.otp;
      if (errorMessage) {
        this.code && this.code.setCodeError(errorMessage);
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

  getDetails = (): DetailItemProps[] => {
    const { resume, origin, supplyLabel } = this.state;
    if (!resume || !origin) {
      return [];
    }
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
    return [
      {
        label: L.paymentsservicesconfirmscreen_label_originaccount,
        accessibilityLabel: 'paymentsservicesconfirmscreen_label_originaccount',
        text: originLabel,
      },
      {
        label: L.paymentsservicesconfirmscreen_label_clientname,
        accessibilityLabel: 'paymentsservicesconfirmscreen_label_clientname',
        text: resume.clientName,
      },
      {
        label: L.paymentsservicesconfirmscreen_label_companyservice,
        accessibilityLabel:
          'paymentsservicesconfirmscreen_label_companyservice',
        text: resume.companyService,
      },
      {
        label: Sanitizer.titleCase(supplyLabel || ''),
        accessibilityLabel: 'paymentsservicesconfirmscreen_label_supply',
        text: resume.supply,
      },
      {
        label: L.paymentsservicesconfirmscreen_label_ticket,
        accessibilityLabel: 'paymentsservicesconfirmscreen_label_ticket',
        text: resume.ticketNro
          .toLowerCase()
          .replace('nro.', '')
          .trim(),
      },
    ];
  };

  resend = async () => {
    const { bill, resume, origin } = this.state;
    if (!bill || !resume || !origin) {
      Log.info(TAG, 'resend', 'empty data');
      return;
    }
    try {
      const response = await API.Execute.servicePaymentPreview({
        valueDate: '',
        debitAccount: origin.idProduct,
        totalAmount: resume.totalAmount,
        billSelector: bill,
      });

      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'resend', response);
      }
      if (response.body.code === API.ResponseCode.OK) {
        return;
      }

      const error = response.body.data as DefaultErrorResponse;
      let hasError = false;
      if (error.NO_FIELD) {
        this.code && this.code.setCodeError(error.NO_FIELD);
        hasError = true;
      }
      !hasError &&
        Emitter.emit<AlertEvent>('onAlert', {
          tag: TAG,
          method: 'resend',
          e: ErrorRequest.Default,
        });
    } catch (e) {
      Log.exception(TAG, 'resend', e);
      Emitter.emit<AlertEvent>('onAlert', {
        tag: TAG,
        method: 'resend',
        e,
      });
    }
  };

  isValidTerms = () => {
    const isTermsValid = this.terms ? this.terms.getValue() : false;
    this.setState({ isTermsValid });
    return isTermsValid;
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
  render() {
    const { isFocused } = this.props;
    const { resume, currency, isLoading, isTermsValid, showTerms } = this.state;

    const details = this.getDetails();
    return (
      <Container>
        <TermsModal
          accessibilityLabel={'dpfopenconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_service}
          onClose={this.closeTerms}
          closeButton={{
            title: L.dpfopenconfirmscreen_modal_button_close,
            onPress: this.closeTerms,
          }}
          actionButton={{
            title: L.dpfopenconfirmscreen_modal_button_accept,
            onPress: this.onAcceptTerms,
          }}
        />
        <FormSteps total={4} current={3} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          ref={ref => {
            this.scroll = ref;
          }}
          contentContainerStyle={{
            minHeight: Size.getVisibleTabScreenHeight(),
          }}
        >
          <SafeAreaView>
            <Content style={styles.content}>
              <NetworkStatusAlert />
              <Header
                center
                style={styles.header}
                title={L.paymentsservicesconfirmscreen_header_title}
                accessibilityLabel={
                  'paymentsservicesconfirmscreen_header_title'
                }
              />
              <CardView padding style={styles.cardView}>
                {resume && (
                  <DetailItem
                    label={L.paymentsservicesconfirmscreen_label_totalamount}
                    accessibilityLabel={
                      'paymentsservicesconfirmscreen_label_totalamount'
                    }
                    text={Amount.format(resume.totalAmount, currency)}
                    styleLabel={styles.amountLabelText}
                    styleText={styles.amountText}
                  />
                )}

                {details.length < 1 && <Loading margin={'large'} />}
                {details.map((item, index) => {
                  return (
                    <DetailItem
                      accessibilityLabel={'paymentsservicesconfirmscreen_label'}
                      style={styles.detailItem}
                      key={index.toString()}
                      {...item}
                    />
                  );
                })}
              </CardView>
              <CardView padding style={styles.cardView}>
                <ConfirmCode
                  accessibilityLabel={
                    'paymentsservicesconfirmscreen_confirmcode'
                  }
                  onResend={this.resend}
                  autoFocus={false}
                  ref={ref => {
                    this.code = ref;
                  }}
                />
              </CardView>

              <CardView padding style={styles.cardView}>
                <CheckBox
                  ref={ref => {
                    this.terms = ref;
                  }}
                  accessibilityLabel={'dpfopenconfirmscreen_checkbox_terms'}
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={
                    L.dpfopenconfirmscreen_checkbox_terms_part1 + ' '
                  }
                  placeholderStyle={styles.termStyle}
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'dpfopenconfirmscreen_buttonlink_terms'
                      }
                      style={styles.buttonLinkPadding}
                      onPress={this.showTerms}
                      title={L.dpfopenconfirmscreen_checkbox_terms_part2}
                      titleStyle={styles.termStyle}
                    />
                  }
                  errorMessage={
                    isTermsValid ? '' : L.dpfopenconfirmscreen_texterror_terms
                  }
                />
              </CardView>

              <Button
                style={styles.button}
                textStyle={styles.textButton}
                allowOnPress
                accessibilityLabel={
                  'paymentsservicesconfirmscreen_button_continue'
                }
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.paymentsservicesconfirmscreen_button_continue}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsServicesConfirmScreenType = PaymentsServicesConfirmScreen;
export default withFocused<PaymentsServicesConfirmScreen, Props>(
  PaymentsServicesConfirmScreen
);
