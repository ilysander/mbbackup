const moment = require('moment');
const tinycolor = require('tinycolor2');
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import {
  AccountsCAItem,
  AccountsCCItem,
  DepositsItem,
  DepositsStatementsItem,
  StatementsItem,
} from '../../api/backend/response/Execute';
import { A, AnalyticsEvent } from '../../resources/analytics';
import Colors from '../../resources/constants/Colors';
import TransactionType from '../../resources/constants/TransactionType';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import { Amount } from '../../resources/money';
import Touchable, { TouchableProps } from '../ui/Touchable';

const timelineColor = tinycolor(Colors.grey3)
  .setAlpha(0.2)
  .toRgbString();

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
  } as ViewStyle,
  timeline: {
    justifyContent: 'center',
  } as ViewStyle,
  info: {
    paddingRight: 30,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  options: {
    flex: 1,
    alignItems: 'flex-end',
  } as ViewStyle,
  balanceTextIncome: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.primary,
    fontSize: 15,
  } as TextStyle,
  balanceTextExpenses: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.danger,
    fontSize: 15,
  } as TextStyle,
  moreIcon: {
    tintColor: Colors.grey4,
    marginLeft: 17,
    width: 6,
    height: 12,
  } as ImageStyle,
  secondaryText: {
    ...Font(),
    textAlign: 'right',
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  dateText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  separator: {
    marginLeft: 10,
  } as ViewStyle,
});

export interface MovementItemProps extends TouchableProps {
  navigation: NativeStackNavigationProp<any, any, undefined>;
  item: StatementsItem | DepositsStatementsItem;
  position?: 'first' | 'last' | 'middle';
  size: number;
  account: AccountsCAItem | AccountsCCItem | DepositsItem;
  amountStyle?: StyleProp<TextStyle>;
}

export interface MovementItemState { }

export default class MovementItem extends React.Component<
  MovementItemProps,
  MovementItemState
> {
  goToMovement = () => {
    const { item, account } = this.props;
    const details = { account, item };
    AnalyticsEvent.track(A.movementitem_itemlist);
    this.props.navigation.navigate('Movement', details);
  };

  render() {
    const {
      style,
      item,
      account,
      amountStyle,
      position,
      size,
      accessibilityLabel,
      ...props
    } = this.props;
    let amountStyleCustom = styles.balanceTextIncome;
    let amountBase = item.amount;

    if (item.type === TransactionType.DEBIT) {
      amountStyleCustom = styles.balanceTextExpenses;
      if (amountBase > 0) {
        amountBase *= -1;
      }
    }
    const dateMovement = moment(item.date).format(L.movementitem_date_format);
    const amountFormatted = Amount.format(amountBase, account.currency);
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'movementitem'}
        onPress={this.goToMovement}
        style={[styles.container, style]}
        {...props}
      >
        <View style={styles.timeline}>
          <View
            style={{
              backgroundColor:
                size > 1 && position !== 'first' ? timelineColor : Colors.white,
              width: 4,
              marginLeft: 4,
              flex: 1,
            }}
          />
          <View
            style={{
              backgroundColor: Colors.grey3,
              height: 12,
              width: 12,
              borderRadius: 12 / 2,
            }}
          />
          <View
            style={{
              backgroundColor:
                size > 1 && position !== 'last' ? timelineColor : Colors.white,
              width: 4,
              marginLeft: 4,
              flex: 1,
            }}
          />
        </View>
        <View style={styles.content}>
          <View
            style={{
              paddingLeft: 10,
              paddingVertical: 20,
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <View style={styles.info}>
              <Text
                accessibilityLabel={'movementitem_date'}
                style={styles.dateText}
                numberOfLines={1}
              >
                {dateMovement}
              </Text>
            </View>
            <View style={styles.options}>
              <Text
                accessibilityLabel={'movementitem_amount'}
                style={[amountStyleCustom, amountStyle]}
              >
                {amountFormatted}
              </Text>
              <Text
                accessibilityLabel={'movementitem_name'}
                style={styles.secondaryText}
                numberOfLines={2}
              >
                {item.note ? '* ' + item.note : item.comment}
              </Text>
            </View>
            <Image
              accessibilityLabel={'accountitem_more_icon'}
              style={styles.moreIcon}
              source={require('../../assets/images/arrow-icon.png')}
            />
          </View>
        </View>
      </Touchable>
    );
  }
}
