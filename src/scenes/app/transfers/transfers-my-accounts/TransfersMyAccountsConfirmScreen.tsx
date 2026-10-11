import * as React from 'react';
import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import API from '../../../../api';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import ExchangeRate from '../../../../components/transactions/ExchangeRate';
import {
  Button,
  CardView,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  SpacedView,
} from '../../../../components/ui';
import { Colors } from '../../../../resources/constants';
import { Size } from '../../../../resources/dimensions';
import { Font, Sanitizer, Validate } from '../../../../resources/functions';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { Amount } from '../../../../resources/money';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import ModalTermsLPDP from '../../../../components/terms-lpdp/ModalTermsLPDP';
import CheckLPDP from '../../../../components/terms-lpdp/CheckLPDP';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  formRowContent: {
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  } as ViewStyle,
  networkStatus: {
    marginTop: 10,
  } as ViewStyle,
  buttons: {
    marginVertical: 20,
    marginTop: 40,
  } as ViewStyle,
  header: {
    marginVertical: 20,
  } as ViewStyle,
  descriptionLabelBold: {
    marginTop: 10,
    color: Colors.grey5,
    fontSize: 14,
  } as ViewStyle,
  descriptionAmountBold: {
    textAlign: 'left',
    color: Colors.accent,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as ViewStyle,
  descriptionLabelCurrencyExchange: {
    fontSize: 13,
    color: Colors.accent,
  } as ViewStyle,
  descriptionTextBold: {
    textAlign: 'left',
    color: Colors.grey6,
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
  } as TextStyle,
  amountToTransfer: {
    textAlign: 'left',
    ...Font({ weight: 'Bold' }),
    fontSize: 22,
    color: Colors.accent,
  } as ViewStyle,
  detailContent: {
    alignItems: 'flex-start',
    padding: 20,
  } as ViewStyle,
});

const TAG = '[TransfersMyAccountsConfirmScreen]';

export interface Props extends NativeStackScreenProps<any, any> {
  // navigation: NavigationScreenProp<any, any>;
}

export interface State {
  isLoading: boolean;
}

class TransfersMyAccountsConfirmScreen extends React.Component<
  Props & FocusedProps,
  State
> {
  // static navigationOptions: NavigationStackScreenOptions = {
  //   title: L.transfersscreen_title,
  // };
  state: State = {
    isLoading: false,
  };

  modalTermsLpdp!: ModalTermsLPDP | null;
  checkLpdp!: CheckLPDP | null;

  goBack = () => {
    this.props.navigation.goBack();
  };
  submit = async () => {
    this.setState({ isLoading: true });

    const { navigation, route } = this.props;
    // const resume = navigation.getParam('resume');
    const resume = route.params && route.params.resume;
    const { amount } = resume;
    const amountBody = {
      ...amount,
      quantity: amount.quantity.toString(),
    };
    const requestBody = {
      amount: amountBody,
      destinationAccount: resume.target.idProduct,
      originAccount: resume.origin.idProduct,
    };

    try {
      const response = await API.Execute.transfersInternalSend(requestBody);
      if (!Validate.validateStatusCode(response.status)) {
        Log.withStatusCode(TAG, 'submit', response);
      }
      const { body } = response;
      if (body.code === API.ResponseCode.OK) {
        const { idTransaction } = response.body;
        this.checkLpdp && this.checkLpdp.trySave();
        navigation.navigate('TransfersMyAccountsSuccess', {
          idTransaction,
          resume,
        });
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

  showTermsLpdp = () => {
    this.modalTermsLpdp && this.modalTermsLpdp.showPanel();
  };

  render() {
    const { isFocused, route } = this.props;
    const { isLoading } = this.state;

    const resume = route.params && route.params.resume;
    // const resume = navigation.getParam('resume');

    const {
      amount,
      isSameCurrency,
      currencyLabel,
      debitAmount,
      exchangeRate,
      origin,
      target,
    } = resume;
    const targetLabel = Sanitizer.getAccountFormattedFromLabel(
      target.shortLabel,
      target.number
    );
    const originLabel = Sanitizer.getAccountFormattedFromLabel(
      origin.shortLabel,
      origin.number
    );
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
                accessibilityLabel={
                  'transfersmyaccountsconfirmscreen_sectionheader_title'
                }
                title={L.transfersmyaccountsconfirmscreen_sectionheader_title}
              />
              <CardView style={[styles.formRowContent, styles.detailContent]}>
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_amount_label'
                  }
                  style={styles.descriptionAmountBold}
                >
                  {L.transfersmyaccountsconfirmscreen_text_amount_label}
                </Text>
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_amount_value'
                  }
                  style={styles.amountToTransfer}
                >
                  {Amount.format(amount.quantity, amount.currency)}
                </Text>
                {!isSameCurrency && (
                  <ExchangeRate
                    accessibilityLabel={
                      'transfersmyaccountsconfirmscreen_exchangerate'
                    }
                    style={styles.descriptionLabelCurrencyExchange}
                    currencyLabel={currencyLabel}
                    debitAmount={debitAmount}
                    exchangeRate={exchangeRate}
                  />
                )}
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_type_label'
                  }
                  style={styles.descriptionLabelBold}
                >
                  {L.transfersmyaccountsconfirmscreen_text_type_label}
                </Text>
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_type_value'
                  }
                  style={styles.descriptionTextBold}
                >
                  {L.transfersmyaccountsconfirmscreen_text_type_value}
                </Text>
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_origin_label'
                  }
                  style={styles.descriptionLabelBold}
                >
                  {L.transfersmyaccountsconfirmscreen_text_origin_label}
                </Text>
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_origin_value'
                  }
                  style={styles.descriptionTextBold}
                >
                  {originLabel}
                </Text>
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_target_label'
                  }
                  style={styles.descriptionLabelBold}
                >
                  {L.transfersmyaccountsconfirmscreen_text_target_label}
                </Text>
                <Text
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_text_target_value'
                  }
                  style={styles.descriptionTextBold}
                >
                  {targetLabel}
                </Text>
              </CardView>
              <CheckLPDP
                ref={ref => {
                  this.checkLpdp = ref;
                }}
                showTermsLpdp={this.showTermsLpdp}
                accessibilityLabelCheck={
                  'transfersmyaccountsconfirmscreen_checkbox_terms_lpdp'
                }
                accessibilityLabelLinkOpenModal={
                  'transfersmyaccountsconfirmscreen_checklink_terms_lpdp'
                }
              />
              <SpacedView style={styles.buttons}>
                <Button
                  light
                  onPress={this.goBack}
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_button_back'
                  }
                  title={L.transfersmyaccountsconfirmscreen_button_back}
                />
                <Button
                  loading={isLoading}
                  onPress={this.submit}
                  accessibilityLabel={
                    'transfersmyaccountsconfirmscreen_button_confirm'
                  }
                  title={L.transfersmyaccountsconfirmscreen_button_confirm}
                />
              </SpacedView>
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>

        <ModalTermsLPDP
          ref={ref => {
            this.modalTermsLpdp = ref;
          }}
          accessibilityLabel={'transfersmyaccountsconfirmscreen_modalldpdp'}
          accessibilityLabelButtonClose={
            'transfersmyaccountsconfirmscreen_modalldpdp_close'
          }
          accessibilityLabelExpandableItem={
            'transfersmyaccountsconfirmscreen_modalldpdp_toggle'
          }
        />
      </Container>
    );
  }
}

export type TransfersMyAccountsConfirmScreenType = TransfersMyAccountsConfirmScreen;
export default withFocused<TransfersMyAccountsConfirmScreen, Props>(
  TransfersMyAccountsConfirmScreen
);
