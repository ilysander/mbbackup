import { NavigationProp } from '@react-navigation/native';
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
import { AccountItemAll } from '../../api/backend/response/Execute';
import { A, AnalyticsEvent } from '../../resources/analytics';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Sanitizer from '../../resources/functions/Sanitizer';
import { L } from '../../resources/language';
import Touchable, { TouchableProps } from '../ui/Touchable';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  info: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  nameContainer: {
    flex: 1,
  } as ViewStyle,
  nameText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey6,
  } as TextStyle,
  options: {
    alignItems: 'flex-start',
  } as ViewStyle,
  balanceText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 18,
  } as TextStyle,
  balanceDescriptionText: {
    ...Font(),
    fontSize: 13,
    color: Colors.grey5,
  } as TextStyle,
  moreIcon: {
    tintColor: Colors.grey4,
    marginLeft: 5,
    width: 6,
    height: 12,
  } as ImageStyle,
});
type AccountItemType =
  | 'loan'
  | 'accountCA'
  | 'accountCC'
  | 'accountCTS'
  | 'deposit';

export interface AccountItemProps extends TouchableProps {
  item?: AccountItemAll;
  navigation: NavigationProp<any, any>;
  type?: AccountItemType;
  name?: string;
  balance?: string;
  balanceDescription?: string;
  hasDetail?: boolean;
}

export interface AccountItemState { }

export default class AccountItem extends React.Component<
  AccountItemProps,
  AccountItemState
> {
  onPress = () => {
    const { item, navigation, type, name } = this.props;
    AnalyticsEvent.track(A.queriesscreen_itemlist);
    AnalyticsEvent.track(A.queriesscreen_itemlist_tab, name);
    if (type === 'deposit') {
      navigation.navigate('DPF', { item, title: L.dpfscreen_title });
      return;
    }

    if (type === 'loan') {
      navigation.navigate('Loan', { item });
      return;
    }
    if (type === 'accountCA') {
      navigation.navigate('Saving', { item, title: L.accountitem_title_ca });
      return;
    }
    if (type === 'accountCTS') {
      navigation.navigate('CTS', { item, title: L.ctsscreen_title });
      return;
    }
    if (type === 'accountCC') {
      navigation.navigate('Saving', { item, title: L.accountitem_title_cc });
      return;
    }
    const title = Sanitizer.getProductTitle(item);
    navigation.navigate('Maintenance', { item, title });
    return;
  };

  getIcon = (type: AccountItemType) => {
    if (type === 'deposit') {
      return require('../../assets/images/account-deposit-icon.png');
    }
    if (type === 'accountCTS') {
      return require('../../assets/images/account-accountcts-icon.png');
    }
    if (type === 'loan') {
      return require('../../assets/images/account-loan-icon.png');
    }
    return require('../../assets/images/account-accountca-icon.png');
  };

  render() {
    const {
      name,
      type,
      balance,
      balanceDescription,
      style,
      hasDetail,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'accountitem'}
        onPress={this.onPress}
        style={[styles.container, style]}
        {...props}
      >
        <View style={styles.info}>
          <View style={styles.nameContainer}>
            <Text
              accessibilityLabel={'accountitem_name'}
              style={styles.nameText}
            >
              {name}
            </Text>
            <View style={styles.options}>
              <Text
                accessibilityLabel={'accountitem_balance'}
                style={styles.balanceText}
              >
                {balance}
              </Text>
              <Text
                accessibilityLabel={'accountitem_balance_description'}
                style={styles.balanceDescriptionText}
              >
                {balanceDescription}
              </Text>
            </View>
          </View>
        </View>
        {hasDetail && (
          <Image
            accessibilityLabel={'accountitem_more_icon'}
            style={styles.moreIcon}
            source={require('../../assets/images/arrow-icon.png')}
          />
        )}
      </Touchable>
    );
  }
}
