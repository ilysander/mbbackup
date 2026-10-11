const moment = require('moment');
import * as React from 'react';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import API from '../../../../api';
import { DefaultErrorResponse } from '../../../../api/backend/response/Error';
import TermsModal from '../../../../components/info/TermsModal';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import { DetailItemProps } from '../../../../components/transactions/DetailItem';
import {
  Button,
  ButtonLink,
  CardView,
  CheckBox,
  Container,
  Content,
  DetailItem,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
} from '../../../../components/ui';
import { A, AnalyticsEvent } from '../../../../resources/analytics';
import {
  Colors,
  ErrorRequest,
  FrequencyDeposit,
} from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import NetworkManager from '../../../../components/network/NetworkManager';
import ConfirmCode from '../../../../components/sms/ConfirmCode';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  buttons: {
    marginTop: 40,
    marginBottom: 20,
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  leftText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.accent,
  } as TextStyle,
  amountText: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
    fontSize: 20,
  } as ViewStyle,
  amountLabelText: {
    ...Font({ weight: 'Black' }),
    color: Colors.accent,
    fontSize: 14,
  } as ViewStyle,
  cardView: {
    padding: 20,
  } as ViewStyle,
  detailItem: {
    marginTop: 10,
  } as ViewStyle,
  cardViewSMS: {
    marginTop: 20,
    marginBottom: 20,
  } as ViewStyle,
});
const TAG = '[DPFOpenConfirmScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  isLoading: boolean;
  isAllowedReadSMS: boolean;
  isLoadingResend: boolean;
  resume?: any;
  isTermsValid: boolean;
  showTerms: boolean;
  isRequiredTerms: boolean;
}

class DPFOpenConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    isLoading: false,
    isAllowedReadSMS: false,
    isLoadingResend: false,
    resume: undefined,
    isTermsValid: true,
    showTerms: false,
    isRequiredTerms: true,
  };

  code!: ConfirmCode | null;
  terms!: CheckBox | null;

  componentDidMount() {
    const { route } = this.props;
    const resume = route.params && route.params.resume;
    this.setState({ resume });
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

  isValidCode = () => {
    return this.code ? this.code.isValid() : false;
  };

  tooltipAction = () => {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  };

  isValid = () => {
    const isValid = [this.isValidCode(), NetworkManager.isConnected].every(
      value => value
    );

    return isValid;
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
      const { resume, isTermsValid } = this.state;
      const { navigation, route } = this.props;

      const origin = route.params && route.params.origin;
      const dpf = route.params && route.params.dpf;
      const email = route.params && route.params.email;
      const target = route.params && route.params.target;

      const currency = resume.depositCurrency;

      const response = await API.Execute.depositCreateSend({
        idTransaction: '',
        valueDate: '',
        isFrequentContact: `${false}`,
        aceptTermAndCondition: `${isTermsValid}`,
        _otp: this.code ? this.code.getValue() : '',
        depositDetails: {
          amount: `${dpf.amount}`,
          rate: `${dpf.rate}`,
          generatedAmount: `${dpf.amountgenerated}`,
          currency: `${currency}`,
          term: `${dpf.term}`,
        },
        debitAccount: `${resume.debitAccount}`,
        frequency: `${resume.frequency}`,
        renewDeposit: `${resume.renewDeposit ? 1 : 0}`,
        creditAccount: `${resume.creditAccount}`,
        _mail: `${email}`,
      });
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'confirmTransference', response);
      }
      const error = response.body.data as DefaultErrorResponse;
      if (response.body.code === API.ResponseCode.OK) {
        const idTransaction = response.body.idTransaction;
        navigation.navigate('DPFOpenSuccess', {
          resume,
          origin,
          currency,
          idTransaction,
          target,
        });
      } else if (error._otp) {
        this.code && this.code.setCodeError(error._otp);
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

  goBack = () => {
    this.props.navigation.goBack();
  };
  blur = () => {
    Log.debug(TAG, 'blur');
    KeyboardUtil.hide();
  };
  onResend = async () => {
    this.blur();
    AnalyticsEvent.track(A.dpfopenconfirmscreen_text_resend_sms);
    this.setState({ isLoadingResend: true });
    try {
      const { route } = this.props;

      const origin = route.params && route.params.origin;
      const dpf = route.params && route.params.dpf;
      const target = route.params && route.params.target;
      const autoRenew = route.params && route.params.autoRenew;
      const email = route.params && route.params.email;


      const response = await API.Execute.depositCreatePreview(
        '',
        {
          amount: `${dpf.amount}`,
          rate: `${dpf.rate}`,
          generatedAmount: `${dpf.amountgenerated}`,
          currency: `${origin.currency}`,
          term: `${dpf.term}`,
        },
        origin.idProduct,
        FrequencyDeposit.AtTheEnd,
        autoRenew ? '1' : '',
        target.idProduct,
        email
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

  render() {
    const { isLoading, isTermsValid, showTerms } = this.state;
    const { route, isFocused } = this.props;

    const resume = route.params && route.params.resume;
    const origin = route.params && route.params.origin;
    const target = route.params && route.params.target;

    const {
      term,
      trea,
      returnDate,
      amount,
      depositCurrency,
      frequency,
      interest,
    } = resume;
    const amountMoney = Amount.format(amount, depositCurrency);
    const termFormatted = `${term} ${L.dpfopenconfirmscreen_label_frequency_term.toLowerCase()}`;
    const returnDateFormatted = `${moment(
      returnDate,
      L.dpfopenconfirmscreen_date_format
    ).format(L.dpfopenconfirmscreen_date_format)}`;

    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
    const targetLabel = Sanitizer.getAccountFormattedFromLabel(
      target.shortLabel,
      target.number
    );
    const detailItemList: DetailItemProps[] = [
      {
        label: L.dpfopenconfirmscreen_label_term_of_deposit,
        accessibilityLabel: 'dpfopenconfirmscreen_label_term_of_deposit',
        text: termFormatted,
      },
      {
        label: L.dpfopenconfirmscreen_label_date_of_deposit,
        accessibilityLabel: 'dpfopenconfirmscreen_label_date_of_deposit',
        text: returnDateFormatted,
      },
      {
        label: L.dpfopenconfirmscreen_label_deposit_frequency,
        accessibilityLabel: 'dpfopenconfirmscreen_label_deposit_frequency',
        text:
          FrequencyDeposit.AtTheEnd === frequency
            ? L.dpfopenconfirmscreen_text_frequency_deposit_at_the_end
            : L.dpfopenconfirmscreen_text_frequency_deposit_every_month,
      },
      {
        label: L.dpfopenconfirmscreen_label_interest,
        accessibilityLabel: 'dpfopenconfirmscreen_label_interest',
        text: Amount.format(interest, depositCurrency),
      },
      {
        label: L.dpfopenconfirmscreen_label_account_origin,
        accessibilityLabel: 'dpfopenconfirmscreen_data_deposit',
        text: originLabel,
      },
      {
        label: L.dpfopenconfirmscreen_label_account_destiny,
        accessibilityLabel: 'dpfopenconfirmscreen_label_account_destiny',
        text: targetLabel,
      },
    ];
    return (
      <Container>
        <TermsModal
          accessibilityLabel={'dpfopenconfirmscreen_termsmodal'}
          visible={showTerms}
          body={L.termsmodal_content_dpfopen}
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
                title={L.dpfopenconfirmscreen_sectionheader_title}
                accessibilityLabel={'dpfopenconfirmscreen_sectionheader_title'}
              />

              <CardView style={styles.cardView}>
                <DetailItem
                  label={L.dpfopenconfirmscreen_text_amount}
                  accessibilityLabel={'dpfopenconfirmscreen_text_amount'}
                  text={amountMoney}
                  styleText={styles.amountText}
                  styleLabel={styles.amountLabelText}
                >
                  <Text
                    style={styles.leftText}
                    accessibilityLabel={
                      'dpfopenconfirmscreen_text_amountdetails_itf'
                    }
                  >
                    {`${L.dpfopenconfirmscreen_label_trea.toUpperCase()} ${trea}%`}
                  </Text>
                </DetailItem>

                {detailItemList.map((item, index) => {
                  return (
                    <DetailItem
                      accessibilityLabel={'dpfopenconfirmscreen_detailitem'}
                      style={styles.detailItem}
                      key={index.toString()}
                      {...item}
                    />
                  );
                })}
              </CardView>
              <CardView padding style={styles.cardViewSMS}>
                <ConfirmCode
                  accessibilityLabel={'dpfopenconfirmscreen_confirmcode'}
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
                  accessibilityLabel={'dpfopenconfirmscreen_checkbox_terms'}
                  onChangeValue={this.onChangeCheckboxTermsValue}
                  placeholder={L.dpfopenconfirmscreen_checkbox_terms_part1}
                  rightContainer={
                    <ButtonLink
                      accent={'primary'}
                      accessibilityLabel={
                        'dpfopenconfirmscreen_buttonlink_terms'
                      }
                      onPress={this.showTerms}
                      title={L.dpfopenconfirmscreen_checkbox_terms_part2}
                      style={{ paddingVertical: 0 }}
                    />
                  }
                  errorMessage={
                    isTermsValid ? '' : L.dpfopenconfirmscreen_texterror_terms
                  }
                />
              </CardView>

              <SpacedView style={styles.buttons}>
                <Button
                  light
                  title={L.dpfopenconfirmscreen_button_back}
                  accessibilityLabel={'dpfopenconfirmscreen_button_back'}
                  onPress={this.goBack}
                />
                <Button
                  loading={isLoading}
                  title={L.dpfopenconfirmscreen_button_confirm}
                  accessibilityLabel={'dpfopenconfirmscreen_button_confirm'}
                  onPress={this.tryToSubmit}
                />
              </SpacedView>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type DPFOpenConfirmScreenType = DPFOpenConfirmScreen;
export default withFocused<DPFOpenConfirmScreen, Props>(DPFOpenConfirmScreen);
