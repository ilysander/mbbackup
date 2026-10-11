import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Amount } from '../../resources/money';
import { Touchable } from '../ui';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  containerItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    borderColor: Colors.grey3,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  } as ViewStyle,
  containerLastItem: {
    borderBottomWidth: 0,
  } as ViewStyle,
  nameContainer: {
    flex: 1,
  } as ViewStyle,
  info: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  aliasText: {
    ...Font({ weight: 'Medium' }),
    color: Colors.grey5,
    fontSize: 15,
  } as TextStyle,
  descriptionText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 12,
  } as TextStyle,
});

export interface SelectFrequentContactItemProps extends TouchableProps {
  item: any;
  last?: boolean;
}

export interface SelectFrequentContactItemState {}

export default class SelectFrequentContactItem extends React.Component<
  SelectFrequentContactItemProps,
  SelectFrequentContactItemState
> {
  state: SelectFrequentContactItemState = {};

  getBalance = (item: any) => {
    const { currency, availableBalance } = item;
    return Amount.format(availableBalance, currency);
  };

  render() {
    const { item, last, accessibilityLabel, ...props } = this.props;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'selectfrequentcontactitem'}
        style={[styles.containerItem, last && styles.containerLastItem]}
        {...props}
      >
        <View style={styles.info}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'selectfrequentcontactitem_alias'}
              style={styles.aliasText}
            >
              {item.alias}
            </Text>
            <Text
              accessibilityLabel={'selectfrequentcontactitem_description'}
              style={styles.descriptionText}
            >
              {item.bankName}
            </Text>
          </View>
        </View>
      </Touchable>
    );
  }
}
