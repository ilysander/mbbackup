const moment = require('moment');
import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { Touchable } from '../ui';
import { Bill } from '../../api/backend/response/Execute';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 20,
  } as ViewStyle,
  infoContainer: {
    flex: 1,
  } as ViewStyle,
  detailsContainer: {
    alignItems: 'flex-end',
    maxWidth: 120,
  } as ViewStyle,
  optionsContainer: {
    marginRight: 10,
    width: 25,
  } as ViewStyle,
  dueDateText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'right',
  } as TextStyle,
  ticketNumberText: {
    ...Font(),
    fontSize: 13,
    textAlign: 'right',
    color: Colors.grey5,
  } as TextStyle,
  amountText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    lineHeight: 20,
    color: Colors.grey6,
  } as TextStyle,
  checkbox: {
    width: 24,
    height: 24,
    tintColor: Colors.primaryLight,
  } as ImageStyle,
});

export interface BillItemProps extends TouchableProps {
  enabled?: boolean;
  selected?: boolean;
  onSelect?: (index: number, selected: boolean) => void;
  onSelectAll?: (index: number) => void;
  index: number;
  item: Bill;
  currency: string;
}

export default class BillItem extends React.Component<BillItemProps> {
  selectAll = () => {
    const { onSelectAll, index } = this.props;
    typeof onSelectAll === 'function' && onSelectAll(index);
  };
  render() {
    const {
      item,
      currency,
      selected,
      accessibilityLabel,
      ...props
    } = this.props;
    const dateExpiration = moment(
      item.expirationDate,
      L.billitem_expirationdate_format_raw
    );
    const today = moment();
    const isExpired = dateExpiration < today;

    return (
      <Touchable
        onLongPress={this.selectAll}
        style={styles.container}
        accessibilityLabel={accessibilityLabel || 'billitem'}
        {...props}
      >
        <View style={styles.optionsContainer}>
          {selected && (
            <Image
              accessibilityLabel={'billitem_checkbox_active'}
              style={styles.checkbox}
              resizeMode={'contain'}
              source={require('../../assets/images/item-checked-icon.png')}
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text
            style={[styles.amountText]}
            accessibilityLabel={'billitem_amount'}
          >
            {Amount.format(item.totalAmount || item.debtAmount, currency)}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.dueDateText} accessibilityLabel={'billitem_due'}>
            {isExpired ? L.billitem_due_defeated : L.billitem_due}{' '}
            {moment(
              item.expirationDate,
              L.billitem_expirationdate_format_raw
            ).format(L.billitem_text_date_format)}
          </Text>
          <Text style={styles.ticketNumberText}>
            {L.billitem_text_ticket_number}
            {item.ticketNumber}
          </Text>
        </View>
      </Touchable>
    );
  }
}
