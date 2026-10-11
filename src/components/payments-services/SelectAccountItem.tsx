import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import { Touchable } from '../ui';
import { AccountItemSavingsAll } from '../../api/backend/response/Execute';
import { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  } as ViewStyle,
  infoContainer: {
    flexDirection: 'row',
    flex: 1,
  } as ViewStyle,
  nameText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  accountText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 12,
    lineHeight: 15,
  } as TextStyle,
  balanceText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 16,
    textAlign: 'right',
    alignSelf: 'flex-end',
  } as TextStyle,
  balanceDescriptionText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'right',
    alignSelf: 'flex-end',
  } as TextStyle,
  image: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: Colors.grey3,
  } as ImageStyle,
  imageSelected: {
    tintColor: Colors.primaryLight,
  } as ImageStyle,
  nameContainer: {
    flex: 1,
  } as ViewStyle,
  optionsContainer: {
    alignSelf: 'center',
    marginLeft: 5,
  } as ViewStyle,
});

export interface SelectAccountItemProps extends TouchableProps {
  item: AccountItemSavingsAll;
  selected?: boolean;
}

export interface SelectAccountItemState {}

export default class SelectAccountItem extends React.Component<
  SelectAccountItemProps,
  SelectAccountItemState
> {
  state: SelectAccountItemState = {};

  getBalance = (item: any) => {
    const { currency, availableBalance } = item;
    return Amount.format(availableBalance, currency);
  };

  render() {
    const { item, selected, accessibilityLabel, ...props } = this.props;
    return (
      <Touchable
        style={styles.container}
        accessibilityLabel={accessibilityLabel || 'selectaccountitem'}
        {...props}
      >
        <Image
          accessibilityLabel={'item_image'}
          style={[styles.image, selected && styles.imageSelected]}
          source={
            selected
              ? require('../../assets/images/item-checked-icon.png')
              : require('../../assets/images/radio-button-unselected.png')
          }
        />
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'selectaccountitem_name'}
              style={styles.nameText}
            >
              {Sanitizer.getProductTitle(item)}
            </Text>

            <Text style={styles.accountText}>{item.number}</Text>
          </View>
          <View style={styles.optionsContainer}>
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
        </View>
      </Touchable>
    );
  }
}
