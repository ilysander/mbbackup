import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { OptionListChip } from '../../api/backend/response/Execute';
import { Touchable } from '../../components/ui';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Amount } from '../../resources/money';
import { TouchableProps } from '../ui/Touchable';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
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
  amountText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.primary,
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
});

export interface FeesRowNewProps extends TouchableProps {
  item: OptionListChip;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  isLast?: boolean;
  currencyKey: string;
}

export interface FeesRowNewState {}

export default class FeesRowNew extends React.PureComponent<
  FeesRowNewProps,
  FeesRowNewState
> {
  state: FeesRowNewState = {};

  render() {
    const { item, style, selected, isLast, currencyKey, ...props } = this.props;
    return (
      <Touchable style={[styles.container, style]} {...props}>
        <View>
          {selected && (
            <Image
              accessibilityLabel={'feesrow_checkbox_active'}
              style={[styles.icon, styles.iconActive]}
              resizeMode={'contain'}
              source={require('../../assets/images/item-checked-icon.png')}
            />
          )}
          {!selected && (
            <Image
              accessibilityLabel={'feesrow_checkbox_active'}
              style={styles.icon}
              resizeMode={'contain'}
              source={require('../../assets/images/radio-button-unselected.png')}
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text
            style={styles.feeText}
            accessibilityLabel={'feesrow_quota_text'}
          >
            {item.numberFee} {L.feesrow_quota_text}
          </Text>
          <Text
            style={styles.rateText}
            accessibilityLabel={'feesrow_rate_text'}
          >
            {L.feesrow_tcea_text} {Amount.toFixedSingle(item.tcea, 2)} {'%'}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text
            style={styles.amountText}
            accessibilityLabel={'feesrow_rate_text'}
          >
            {Amount.format(item.amountFee, currencyKey)}
          </Text>
          <Text
            style={styles.dueDateText}
            accessibilityLabel={'feesrow_due_text'}
          >
            {L.feesrow_due_text}
          </Text>
        </View>
      </Touchable>
    );
  }
}
