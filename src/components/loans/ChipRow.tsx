import * as React from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { AmountOption } from '../../api/backend/response/Execute';
import { Touchable } from '../../components/ui';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Amount } from '../../resources/money';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'yellow',
  } as ViewStyle,
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: Colors.grey3,
  } as ImageStyle,
  iconActive: {
    tintColor: Colors.primaryLight,
  } as ImageStyle,
  infoContainer: {
    flex: 1,
  } as ViewStyle,
  feeText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    lineHeight: 16,
    color: Colors.grey5,
  } as TextStyle,
  amountTextDisabled: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 15,
    color: Colors.grey6,
  } as TextStyle,
  amountTextEnabled: {
    ...Font({ weight: 'SemiBold' }),
    fontSize: 15,
    color: Colors.white,
  } as TextStyle,
  detailsContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  rateText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey5,
  } as TextStyle,
  dueDateText: {
    ...Font(),
    fontSize: 14,
    lineHeight: 16,
    color: Colors.grey5,
  } as TextStyle,
  chipContDisabled: {
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.grey2,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  chipContEnabled: {
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});

export interface ChipRowProps extends TouchableProps {
  item: AmountOption;
  currencyKey: string;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  isLast?: boolean;
}

export interface ChipRowState {}

export default class ChipRow extends React.PureComponent<
  ChipRowProps,
  ChipRowState
> {
  state: ChipRowState = {};

  render() {
    const { item, style, selected, isLast, currencyKey, ...props } = this.props;
    return (
      <Touchable
        style={selected ? styles.chipContEnabled : styles.chipContDisabled}
        {...props}
      >
        <Text
          style={
            selected ? styles.amountTextEnabled : styles.amountTextDisabled
          }
          accessibilityLabel={'chiprow_rate_text'}
        >
          {Amount.formatWithZero(item.totalAmount, currencyKey)}
        </Text>
      </Touchable>
    );
  }
}
