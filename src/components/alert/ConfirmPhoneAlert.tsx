import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { PreferencesUserDataModifyPreResponse } from '../../api/backend/response/Execute';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';
import { Alert } from '../ui';

const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingHorizontal: 10,
  } as ViewStyle,
  descriptionText: {
    fontSize: 18,
    lineHeight: 20,
    color: Colors.accentDark,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  valueContainer: {
    paddingVertical: 20,
  } as ViewStyle,
  titleText: {
    fontSize: 14,
    marginBottom: 2,
    color: Colors.grey5,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  disclaimerText: {
    fontSize: 14,
    color: Colors.grey5,
    textAlign: 'center',
    ...Font(),
  } as TextStyle,
});

export interface ReturnOptions {
  success?: {
    onPress: () => void;
    title: string;
  };
  cancel?: {
    onPress: () => void;
  };
}

export interface ConfirmPhoneAlertProps {
  navigation: NavigationProp<any, any>;
  accessibilityLabel: string;
  onCancel?: () => void;
  onAction?: () => void;
  user: PreferencesUserDataModifyPreResponse;
  returnOptions?: ReturnOptions;
}

export interface ConfirmPhoneAlertState { }

export default class ConfirmPhoneAlert extends React.Component<
  ConfirmPhoneAlertProps,
  ConfirmPhoneAlertState
> {
  goToChangePhone = () => {
    const { navigation, returnOptions, onCancel, user } = this.props;
    const { mobilePhone: current } = user;
    navigation.navigate('ChangePhone', { returnOptions, current });

    typeof onCancel === 'function' && onCancel();
  };

  render() {
    const { onAction, user, accessibilityLabel } = this.props;
    return (
      <Alert
        accessibilityLabel={accessibilityLabel}
        message={
          <View style={styles.container}>
            <Text
              accessibilityLabel={'confirmphonealert_text_description'}
              style={styles.descriptionText}
            >
              {L.confirmphonealert_text_description_part1}{' '}
              {L.confirmphonealert_text_description_part2}{' '}
              {L.confirmphonealert_text_description_part3}
              {'.'}
            </Text>
            <View style={styles.valueContainer}>
              <Text
                accessibilityLabel={'confirmphonealert_text_title'}
                style={styles.titleText}
              >
                {L.confirmphonealert_text_title}
              </Text>
              <Text
                accessibilityLabel={'confirmphonealert_text_phone_value'}
                style={styles.titleText}
              >
                {Sanitizer.maskPhone(user.mobilePhone || '')}
              </Text>
            </View>
            <Text
              accessibilityLabel={'confirmphonealert_text_disclaimer'}
              style={styles.disclaimerText}
            >
              {L.confirmphonealert_text_disclaimer}
            </Text>
          </View>
        }
        cancelButton={{
          accessibilityLabel: 'confirmphonealert_button_close',
          title: L.confirmphonealert_button_close,
          onPress: this.goToChangePhone,
        }}
        actionButton={{
          accessibilityLabel: 'confirmphonealert_button_action',
          title: L.confirmphonealert_button_action,
          onPress: onAction,
        }}
      />
    );
  }
}
