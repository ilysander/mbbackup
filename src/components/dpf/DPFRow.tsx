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
import { DpfListItem } from '../../api/backend/response/Execute';
import { Touchable } from '../../components/ui';
import { Colors } from '../../resources/constants';
import { Currency } from '../../resources/constants/Currencies';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  } as ViewStyle,
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: Colors.secondary,
  } as ImageStyle,
  infoContainer: {
    flex: 1,
  } as ViewStyle,
  feeText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  amountText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 16,
    color: Colors.primary,
  } as TextStyle,
  detailsContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  rateText: {
    ...Font(),
    fontSize: 12,
    color: Colors.grey5,
  } as TextStyle,
  dueDateText: {
    ...Font(),
    fontSize: 14,
    color: Colors.grey4,
  } as TextStyle,
});

export interface DPFRowProps extends TouchableProps {
  item: DpfListItem;
  style?: StyleProp<ViewStyle>;
  currency: Currency;
  selected?: boolean;
}

export interface DPFRowState {}

export default class DPFRow extends React.PureComponent<
  DPFRowProps,
  DPFRowState
> {
  state: DPFRowState = {};

  render() {
    const {
      item,
      style,
      currency,
      selected,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <Touchable
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel || 'dpfrow'}
        {...props}
      >
        {selected && (
          <Image
            accessibilityLabel={'dpfrow_checkbox_active'}
            style={styles.checkbox}
            resizeMode={'contain'}
            source={require('../../assets/images/item-checked-icon.png')}
          />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.feeText} accessibilityLabel={'dpfrow_quota_text'}>
            {L.dpfrow_quota_text}
          </Text>
          <Text
            style={styles.amountText}
            accessibilityLabel={'dpfrow_amount_text'}
          >
            {Amount.format(item.amountgenerated, currency.label)}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.rateText} accessibilityLabel={'dpfrow_rate_text'}>
            {L.dpfrow_rate_text} {Amount.toFixedSingle(item.rate, 2)}
            {'%'}
          </Text>
          <Text
            style={styles.dueDateText}
            accessibilityLabel={'dpfrow_due_text'}
          >
            {item.term} {L.dpfrow_due_text}
          </Text>
        </View>
      </Touchable>
    );
  }
}
