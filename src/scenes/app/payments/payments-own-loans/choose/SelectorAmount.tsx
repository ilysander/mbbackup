import * as React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, Text } from 'react-native';
import {
  TextError,
  Button,
  Separator,
  TextInputAmount,
} from '../../../../../components/ui';
import { Font, Sanitizer, Linking } from '../../../../../resources/functions';
import { Colors, Formats } from '../../../../../resources/constants';
import { L } from '../../../../../resources/language';
import ChoosePaymentItemScreen from '../../../../../components/payments/ChoosePaymentItemScreen';
import Config from '../../../../../Config';
import { Log } from '../../../../../resources/log';
import { KeyboardUtil } from '../../../../../resources/util';
import Features from '../../../../../resources/remote/Features';
import { TabNames } from './Constants';
import { AnalyticsEvent, A } from '../../../../../resources/analytics';
import { LoansItem } from '../../../../../api/backend/response/Execute';

const styles = StyleSheet.create({
  tabContainer: {} as ViewStyle,
  textError: {
    paddingVertical: 4,
  } as TextStyle,
  payAllDue: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  separator: {
    marginHorizontal: 20,
  } as ViewStyle,
  choosePaymentInputContainer: {
    marginLeft: 48,
  } as ViewStyle,
  choosePaymentInput: {
    borderRadius: 10,
    borderWidth: 1,
  } as TextStyle,
  containerAmountTotal: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 70,
  } as ViewStyle,
  contentAmountTotal: {
    flex: 1,
    alignItems: 'flex-start',
  } as ViewStyle,
  amountContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
});

export interface ScreenProps {
  errorFee?: string;
  fees: any[];
  loan: LoansItem;
  isLastPayment: boolean;
  onChangeFees: (fees: any[]) => void;
  onBlurAmount: () => void;
  amountInput: React.RefObject<TextInputAmount>;
  onChangeTab: (currentTab: string) => void;
}

export interface Props {
  screenProps: ScreenProps;
}

export interface State {
  isValidText: boolean;
  isFocused: boolean;
  partialFee: boolean;
  totalFee: boolean;
}

const TAG = '[SelectorAmount]';

export default class SelectorAmount extends React.Component<Props, State> {

  state: State = {
    isFocused: true,
    isValidText: false,
    partialFee: false,
    totalFee: false,
  };

  getProps = () => {
    const { screenProps } = this.props;
    return screenProps;
  };
  onEditAmount = () => {
    const amountInput = this.getAmountInputRef();
    if (amountInput && amountInput.getValue() <= 0) {
      amountInput.setValue('');
    }
    this.updateTabPartial();
  };
  getAmountInputRef = () => {
    const { amountInput } = this.getProps();
    if (!amountInput || !amountInput.current) {
      return;
    }
    return amountInput.current;
  };

  updateStyle = (text: string) => {
    const isValid = !!text;
    this.setState({
      isValidText: isValid,
    });
  };

  onSelect = (index: number, selected: boolean) => {
    const amountInput = this.getAmountInputRef();

    if (selected) {
      if (index === 1) {
        this.updateTabFee();
        KeyboardUtil.hide();
        if (amountInput) {
          amountInput.setValue('');
          amountInput.setError('');
        }
      }
      if (index === 2) {
        this.updateTabPartial();
        if (amountInput) {
          amountInput.focus();
        }
      }
    }
  };

  updateTabFee = () => {
    const { onChangeTab } = this.getProps();
    this.setState({
      totalFee: true,
      partialFee: false,
      isValidText: false,
    });
    onChangeTab(TabNames.Fee);
    AnalyticsEvent.track(A.paymentsownloanschoosescreen_tab_fee);
  };

  updateTabPartial = () => {
    const { onChangeTab } = this.getProps();
    this.setState({
      totalFee: false,
      partialFee: true,
      isValidText: true,
    });
    onChangeTab(TabNames.Partial);
    AnalyticsEvent.track(A.paymentsownloanschoosescreen_tab_partial);
  };

  goToLoanPayments = async () => {
    try {
      await Linking.openURL(Config.settings.loanPaymentsUrl);
    } catch (e) {
      Log.debug(TAG, 'goToLoanPayments', e);
    }
  };

  render() {
    const { errorFee, fees, loan, onBlurAmount, amountInput } = this.getProps();
    const { isValidText, partialFee, totalFee } = this.state;
    const currency = Sanitizer.getCurrencyByLabel(loan.currency);
    const fee = fees.length > 0 ? fees[0] : null;
    if (!fees) {
      return <View />;
    }
    return (
      <View
        style={[styles.tabContainer]}
        accessibilityLabel={'paymentsownloanschoosescreen_tab_fee'}
      >
        {fee && (
          <ChoosePaymentItemScreen
            accessibilityLabel={'paymentsownloanschoosescreen_tab_partial'}
            enabled
            selected={totalFee}
            index={1}
            item={fee['statement']}
            currency={loan.currency}
            onSelect={this.onSelect}
            label={L.selectoramount_text_pay_fee}
          />
        )}
        <Separator style={styles.separator} />
        {fee && (
          <ChoosePaymentItemScreen
            accessibilityLabel={'paymentsownloanschoosescreen_tab_partial'}
            enabled
            selected={partialFee}
            index={2}
            item={fee['statement']}
            currency={loan.currency}
            onSelect={this.onSelect}
            label={L.selectoramount_text_pay_free}
          >
            <TextInputAmount
              focusMode={'center'}
              returnKeyType={'next'}
              keyboardType={'decimal-pad'}
              showClearButton={false}
              autoCorrect={false}
              containerStyle={styles.choosePaymentInputContainer}
              onFocus={this.onEditAmount}
              blurOnSubmit={false}
              accessibilityLabel={
                'paymentsownloanschoosescreen_textinput_amount'
              }
              label={''}
              autoCapitalize={'none'}
              currency={currency ? currency.symbol : undefined}
              ref={amountInput}
              formatText={isValidText ? Formats.Amount : null}
              onBlur={onBlurAmount}
              style={styles.choosePaymentInput}
            />
          </ChoosePaymentItemScreen>
        )}
        {Features.isAllowedTo('PaymentsOwnLoansWeb') && (
          <>
            <Separator style={styles.separator} />
            <View style={styles.containerAmountTotal}>
              <View style={styles.contentAmountTotal}>
                <Text style={styles.payAllDue}>
                  {L.selectoramount_text_pay_all}
                </Text>
              </View>
              <View style={styles.amountContainer}>
                <Button
                  typeColor={'primary'}
                  small
                  accessibilityLabel={'selectoramount_pay_all_loan'}
                  title={L.selectoramount_pay_all_loan}
                  onPress={this.goToLoanPayments}
                />
              </View>
            </View>
          </>
        )}
        {!!errorFee && (
          <TextError style={styles.textError}>{errorFee}</TextError>
        )}
      </View>
    );
  }
}
