import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { Touchable } from '../ui';
import { TouchableProps } from '../ui/Touchable';
import { AccountItemSavingsAll } from '../../api/backend/response/Execute';

const styles = StyleSheet.create({
  containerItem: {
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
  } as ViewStyle,
  containerLastItem: {
    borderBottomWidth: 0,
  } as ViewStyle,
  options: {
    alignItems: 'flex-end',
  } as ViewStyle,
  balanceText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 16,
  } as TextStyle,
  nameText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  nameContainer: {
    flex: 1,
    paddingRight: 3,
  } as ViewStyle,
  info: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  secondaryText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  balanceDescriptionText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
});

export interface SelectAccountItemProps extends TouchableProps {
  item: AccountItemSavingsAll;
  last?: boolean;
}

export interface SelectAccountItemState {}

export default class SelectAccountItem extends React.Component<
  SelectAccountItemProps,
  SelectAccountItemState
> {
  state: SelectAccountItemState = {};

  getBalance = (item: AccountItemSavingsAll) => {
    const { currency, availableBalance } = item;
    return Amount.format(availableBalance, currency);
  };

  render() {
    const { item, last, accessibilityLabel, ...props } = this.props;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'selectaccountitem'}
        style={[styles.containerItem, last && styles.containerLastItem]}
        {...props}
      >
        <View style={styles.info}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'selectaccountitem_name'}
              style={styles.secondaryText}
            >
              {Sanitizer.getProductTitle(item)}
            </Text>
            <Text
              accessibilityLabel={'selectaccountitem_date'}
              style={styles.nameText}
              numberOfLines={1}
            >
              {item.number}
            </Text>
          </View>
        </View>
        <View style={styles.options}>
          <Text
            accessibilityLabel={'selectaccountitem_amount'}
            style={styles.balanceText}
          >
            {this.getBalance(item)}
          </Text>
          <Text
            accessibilityLabel={'selectaccountitem_reference'}
            style={styles.balanceDescriptionText}
          >
            {L.selectaccountitem_text_reference}
          </Text>
        </View>
      </Touchable>
    );
  }
}
