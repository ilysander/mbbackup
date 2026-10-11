const moment = require('moment');
import * as React from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle } from 'react-native';
import {
  FocusedProps,
  withFocused,
} from '../../../../components/screen/ScreenContainer';
import {
  Button,
  Container,
  Content,
  FormSteps,
  Header,
  KeyboardAvoidingView,
  NetworkStatusAlert,
  SafeAreaView,
  Separator,
  CardView,
} from '../../../../components/ui';
import { ErrorRequest, Colors } from '../../../../resources/constants';
import { L } from '../../../../resources/language';
import { Emitter } from '../../../../resources/listeners';
import { Log } from '../../../../resources/log';
import { KeyboardUtil } from '../../../../resources/util';
import { AlertEvent } from '../../../../components/alert/AlertManager';
import BillItem from '../../../../components/payments-services/BillItem';
import { Bill } from '../../../../api/backend/response/Execute';
import { CurrencyType } from '../../../../resources/persistence/models/AmountModel';
import Font from '../../../../resources/functions/Font';
import { Sanitizer } from '../../../../resources/functions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    maxWidth: '75%',
    alignSelf: 'center',
  } as ViewStyle,
  formSteps: {
    marginBottom: 550,
  } as ViewStyle,
  info: {
    marginBottom: 20,
    marginTop: 30,
  } as ViewStyle,
  title: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 14,
    lineHeight: 19,
  } as TextStyle,
  nameText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 16,
  } as TextStyle,
  infoOwner: {
    alignItems: 'center',
    marginBottom: 30,
  } as ViewStyle,
  content: {
    marginTop: 10,
  } as ViewStyle,
  button: {
    height: 50,
    marginBottom: 40,
  } as ViewStyle,
  buttonText: {
    fontSize: 16,
  } as TextStyle,
  separador: {
    marginHorizontal: 20,
  } as ViewStyle,
});

const TAG = '[PaymentsServicesChooseBillScreen]';
export interface NavigationParams {
  bills: Bill[];
  supplyLabel: string;
  supply: string;
}
export interface Props extends NativeStackScreenProps<any, any> {
}

export interface State {
  bills: Bill[];
  indexBill: number;
  isValid: boolean;
  isLoading: boolean;
  bill?: Bill;
  name: string;
  supplyLabel?: string;
  supply?: string;
}

class PaymentsServicesChooseBillScreen extends React.Component<
  Props & FocusedProps,
  State
> {

  state: State = {
    bills: [],
    indexBill: -1,
    isValid: false,
    isLoading: false,
    name: '',
  };

  componentDidMount() {
    this.load();
  }

  load = () => {
    const { route } = this.props;

    const bills = route.params ? route.params.bills ? route.params.bills : [] : [];
    const supplyLabel = route.params && route.params.supplyLabel;
    const supply = route.params && route.params.supply;
    if (bills.length === 0) {
      return;
    }
    bills.sort((bill1: Bill, bill2: Bill) => {
      return (
        moment(bill1.expirationDate, L.billitem_expirationdate_format_raw) -
        moment(bill2.expirationDate, L.billitem_expirationdate_format_raw)
      );
    });
    const bill = bills[0];
    const name = bill.clientName;
    this.setState({
      supplyLabel,
      supply,
      bills,
      indexBill: 0,
      isValid: true,
      bill,
      name,
    });
  };

  tryToSubmit = async () => {
    this.setState({ isLoading: true });
    await this.submit();
    this.setState({ isLoading: false });
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  submit = async () => {
    try {
      const { navigation } = this.props;
      const { bill, supplyLabel, supply } = this.state;
      if (bill) {
        navigation.navigate('PaymentsServicesChooseAccount', {
          bill,
          supplyLabel,
          supply,
        });
        return;
      }
      const hasError = false;

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

  render() {
    const {
      isLoading,
      indexBill,
      isValid,
      bills,
      name,
      supplyLabel,
      supply,
    } = this.state;
    const { isFocused } = this.props;
    return (
      <Container>
        <FormSteps total={4} current={1} />
        <KeyboardAvoidingView
          enabled={isFocused}
          keyboardShouldPersistTaps={'handled'}
          scrollEventThrottle={100}
        >
          <SafeAreaView>
            <Content style={styles.content}>
              <NetworkStatusAlert />
              <Header
                center
                style={styles.header}
                accessibilityLabel={
                  'paymentsserviceschoosebillscreen_header_title'
                }
                title={L.paymentsserviceschoosebillscreen_header_title}
              />
              <View style={styles.infoOwner}>
                <Text style={styles.title}>
                  {L.paymentsserviceschoosebillscreen_owner_name}
                </Text>
                <Text
                  accessibilityLabel={
                    'paymentsserviceschoosebillscreen_title_name'
                  }
                  style={styles.nameText}
                >
                  {Sanitizer.titleCase(name)}
                </Text>
                <Text style={styles.title}>
                  {Sanitizer.titleCase(supplyLabel)} {supply}
                </Text>
              </View>

              <CardView>
                {bills.map((bill, index) => {
                  const isLast = bills.length - 1 === index;
                  return (
                    <View key={index.toString()}>
                      <BillItem
                        accessibilityLabel={
                          'paymentsserviceschoosebillscreen_bill_item'
                        }
                        item={bill}
                        index={index}
                        enabled
                        selected={index === indexBill}
                        currency={CurrencyType.PEN}
                      />
                      {!isLast && <Separator style={styles.separador} />}
                    </View>
                  );
                })}
              </CardView>
            </Content>
            <Content vertical={false} style={styles.info}>
              <Button
                disabled={!isValid}
                allowOnPress
                accessibilityLabel={
                  'paymentsserviceschoosebillscreen_button_continue'
                }
                onPress={this.tryToSubmit}
                loading={isLoading}
                title={L.paymentsserviceschoosebillscreen_button_continue}
                style={styles.button}
                textStyle={styles.buttonText}
              />
            </Content>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export type PaymentsServicesChooseBillScreenType = PaymentsServicesChooseBillScreen;
export default withFocused<PaymentsServicesChooseBillScreen, Props>(
  PaymentsServicesChooseBillScreen
);
