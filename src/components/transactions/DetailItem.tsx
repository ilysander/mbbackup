import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Validate } from '../../resources/functions';

const styles = StyleSheet.create({
  detailText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.accent,
  } as TextStyle,
});

export interface DetailItemProps {
  element?: any;
  currency?: any;
  label?: string;
  text?: string;
  optional?: string;
  accessibilityLabel?: string;
  style?: StyleProp<TextStyle>;
  alwaysVisible?: boolean | string;
}

export interface DetailItemState {}

export default class DetailItem extends React.Component<
  DetailItemProps,
  DetailItemState
> {
  static defaultProps = {
    alwaysVisible: false,
    currency: true,
  };

  formatObject = (currency: any, object: any): any => {
    if (currency) {
      return Validate.formatAmount(object, currency);
    }
    return `${object}`;
  };

  renderItem = (item: any, style: StyleProp<TextStyle>) => {
    return <Text style={[styles.detailText, style]}>{item}</Text>;
  };

  render() {
    const { element, currency, label, style, alwaysVisible } = this.props;
    const elementFormatted = this.formatObject(currency, element);
    if (currency && (!elementFormatted.isEmpty || !!alwaysVisible)) {
      return this.renderItem(
        `${label}: ${elementFormatted.valueFormatted}`,
        style
      );
    }
    if (!currency && (elementFormatted || !!alwaysVisible)) {
      return this.renderItem(`${label} ${elementFormatted}`, style);
    }
    return null;
  }
}
