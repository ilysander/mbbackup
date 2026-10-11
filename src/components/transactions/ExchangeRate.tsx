import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Colors, Currencies } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import Features from '../../resources/remote/Features';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  } as ViewStyle,
  label: {
    textAlign: 'left',
    ...Font({ weight: 'Bold' }),
    fontSize: 13,
    color: Colors.accent,
    margin: 0,
    paddingHorizontal: 1,
  } as TextStyle,
});

export interface ExchangeRateProps extends ViewProps {
  exchangeRate: string;
  debitAmount: string;
  currencyLabel: string;
  style?: StyleProp<TextStyle>;
}

export interface ExchangeRateState {}

export default class ExchangeRate extends React.Component<
  ExchangeRateProps,
  ExchangeRateState
> {
  render() {
    const {
      exchangeRate,
      debitAmount,
      currencyLabel,
      style,

      ...props
    } = this.props;

    if (!Features.isAllowedTo('ExchangeRate')) {
      return null;
    }

    return (
      <View
        style={styles.container}
        accessibilityLabel={'transfers_exchangerate'}
        {...props}
      >
        <View>
          <Text
            style={[styles.label, style]}
            accessibilityLabel={'transfers_exchangerate_purchase'}
          >
            {L.transfers_exchangerate_purchase_label}
            {': '}
            {Amount.format(exchangeRate, Currencies.PEN.label, {
              precision: 3,
            })}
          </Text>
          <Text
            style={[styles.label, style]}
            accessibilityLabel={'transfers_exchangerate_sale'}
          >
            {L.transfers_exchangerate_sale_label}
            {': '}
            {Amount.format(debitAmount, currencyLabel)}
          </Text>
        </View>
      </View>
    );
  }
}
