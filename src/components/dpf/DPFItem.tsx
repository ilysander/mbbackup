import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Currency } from '../../resources/constants/Currencies';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { CardView, TextError } from '../ui';

const styles = StyleSheet.create({
  button: {
    padding: 20,
  } as ViewStyle,
  nameText: {
    ...Font({ weight: 'Black' }),
    color: Colors.secondary,
    fontSize: 14,
  } as TextStyle,
  subtitleText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  bodyContainer: {
    flexDirection: 'row',
  } as ViewStyle,
  leftContainer: {
    flex: 1,
  } as ViewStyle,
  rightContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  amountText: {
    ...Font({ weight: 'Black' }),
    color: Colors.secondary,
    fontSize: 20,
    lineHeight: 22,
  } as TextStyle,
  treaText: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey5,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  treaDescriptionText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 12,
    lineHeight: 14,
  } as TextStyle,
  footerContainer: {
    alignSelf: 'flex-end',
  } as ViewStyle,
  textError: {
    marginTop: 10,
  } as ViewStyle,
});

export interface DPFItemProps extends ViewProps {
  currency: Currency;
  item: any;
  accessibilityLabel: string;
}

export interface DPFItemState {
  errorMessage?: string;
}

export default class DPFItem extends React.Component<
  DPFItemProps,
  DPFItemState
> {
  state: DPFItemState = {
    errorMessage: '',
  };
  setError = (value?: string) => {
    this.setState({ errorMessage: value });
  };
  clearError = () => {
    this.setError(undefined);
  };

  render() {
    const { item, currency, style, accessibilityLabel, ...props } = this.props;
    const { errorMessage } = this.state;
    return (
      <View accessibilityLabel={accessibilityLabel || 'dpfitem'}>
        <CardView
          accessibilityLabel={'dpfitem_detail'}
          style={[styles.button, style]}
          {...props}
        >
          <Text
            accessibilityLabel={'dpfitem_text_amount'}
            style={styles.nameText}
            numberOfLines={1}
            textBreakStrategy={'simple'}
          >
            {L.dpfitem_text_amount} {Amount.format(item.amount, currency.label)}
          </Text>
          <View style={styles.bodyContainer}>
            <View style={styles.leftContainer}>
              <Text
                accessibilityLabel={'dpfitem_text_term'}
                style={styles.subtitleText}
                textBreakStrategy={'simple'}
              >
                {L.dpfitem_text_term_part1} {item.term}{' '}
                {L.dpfitem_text_term_part2}
                {':'}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <Text
                accessibilityLabel={'dpfitem_text_amount'}
                style={styles.amountText}
              >
                {Amount.format(item.amountgenerated, currency.label)}
              </Text>
              <Text
                accessibilityLabel={'dpfitem_text_trea'}
                style={styles.treaText}
              >
                {L.dpfitem_text_trea} {Amount.toFixedSingle(item.rate, 2)}
                {L.dpfitem_text_trea_percent}
              </Text>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <Text
              accessibilityLabel={'dpfitem_text_trea_description'}
              style={styles.treaDescriptionText}
            >
              {L.dpfitem_text_trea_description}
            </Text>
          </View>
        </CardView>
        {!!errorMessage && (
          <TextError style={styles.textError}>{errorMessage}</TextError>
        )}
      </View>
    );
  }
}
