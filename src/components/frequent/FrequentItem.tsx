import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { ButtonLink, Touchable } from '../ui';
import Features from '../../resources/remote/Features';
import { TouchableProps } from '../ui/Touchable';

import { Sanitizer } from '../../resources/functions';
import { NavigationProp } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  infoContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  editContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  editButton: {
    ...Font({ weight: 'SemiBold' }),
    padding: 20,
  } as TextStyle,
  info: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  } as ViewStyle,
  nameText: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 15,
  } as TextStyle,
  subtitleText: {
    ...Font(),
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
});

export interface FrequentItemProps extends TouchableProps {
  navigation: NavigationProp<any, any>;
  item: any;
  onPress?: () => void;
}

export interface FrequentItemState {
  showOptions: boolean;
}

export default class FrequentItem extends React.Component<
  FrequentItemProps,
  FrequentItemState
> {
  state: FrequentItemState = {
    showOptions: false,
  };
  goToEdit = () => {
    const { item, navigation } = this.props;
    const { idFrequentContact, accountNumber, alias } = item;
    navigation.navigate('ChangeContact', {
      idFrequentContact,
      accountNumber,
      alias,
    });
  };

  render() {
    const { item, onPress, accessibilityLabel, ...props } = this.props;
    const bankName =
      item.currency === 1
        ? item.bankName + L.frequentitem_txt_soles
        : item.bankName + L.frequentitem_txt_dolares;
    const accountNumber =
      item.type === 'inter'
        ? item.accountNumber
        : Sanitizer.formatTextCCI(item.accountNumber);
    const typeAccount =
      item.type === 'inter'
        ? L.frequentitem_txt_number_account
        : L.frequentitem_txt_cci;
    return (
      <View accessibilityLabel={'frequentitem'} style={styles.container}>
        <Touchable
          accessibilityLabel={accessibilityLabel || 'frequentitem_detail'}
          style={styles.infoContainer}
          onPress={onPress}
          {...props}
        >
          <View style={styles.info}>
            <View>
              <Text
                accessibilityLabel={'frequentitem_text_name'}
                style={styles.nameText}
                numberOfLines={1}
              >
                {item.alias}
              </Text>
            </View>
            <View>
              <Text
                accessibilityLabel={'frequentitem_text_name'}
                style={styles.subtitleText}
              >
                {typeAccount}
                {accountNumber}
              </Text>
            </View>
            <View>
              <Text
                accessibilityLabel={'frequentitem_text_name'}
                style={styles.subtitleText}
              >
                {bankName}
              </Text>
            </View>
          </View>
        </Touchable>
        {Features.isAllowedTo('ChangeContact') && (
          <View style={styles.editContainer}>
            <ButtonLink
              accent={'primary'}
              accessibilityLabel={'frequentitem_touchable_edit'}
              style={styles.editButton}
              onPress={this.goToEdit}
              title={L.frequentitem_touchable_edit}
            />
          </View>
        )}
      </View>
    );
  }
}
