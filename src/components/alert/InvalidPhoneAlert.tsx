import { NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Alert } from '../ui';
import { ReturnOptions } from './ConfirmPhoneAlert';

const styles = StyleSheet.create({
  alert: {
    marginVertical: 10,
  } as ViewStyle,
  container: {
    width: '90%',
    paddingHorizontal: 8,
  } as ViewStyle,
  textBold: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  textActionButton: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  descriptionText: {
    fontSize: 15,
    lineHeight: 18,
    color: Colors.grey5,
    textAlign: 'center',
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  titleText: {
    fontSize: 22,
    marginBottom: 10,
    color: Colors.accentDark,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  footer: {
    marginTop: 20,
  } as ViewStyle,
});

export interface InvalidPhoneAlertProps {
  accessibilityLabel: string;
  navigation: NavigationProp<any, any>;
  onClose?: () => void;
  returnOptions?: ReturnOptions;
}

export interface InvalidPhoneAlertState { }

export default class InvalidPhoneAlert extends React.Component<
  InvalidPhoneAlertProps,
  InvalidPhoneAlertState
> {
  goToProfile = () => {
    const { navigation, returnOptions, onClose } = this.props;

    navigation.navigate('Profile', { returnOptions });

    typeof onClose === 'function' && onClose();
  };

  render() {
    const { onClose: onClose, accessibilityLabel } = this.props;
    return (
      <Alert
        accessibilityLabel={accessibilityLabel}
        style={styles.alert}
        message={
          <View style={styles.container}>
            <Text
              accessibilityLabel={'invalidphonealert_text_title'}
              style={styles.titleText}
            >
              {L.invalidphonealert_text_title}
            </Text>
            <Text
              accessibilityLabel={'invalidphonealert_text_description'}
              style={styles.descriptionText}
            >
              {L.invalidphonealert_text_description_part1}{' '}
              <Text style={styles.textBold}>
                {L.invalidphonealert_text_description_part2}
              </Text>
            </Text>
            <View
              accessibilityLabel={'invalidphonealert_text_description_footer'}
              style={styles.footer}
            >
              <Text style={styles.descriptionText}>
                {L.invalidphonealert_text_description_footer}
              </Text>
            </View>
          </View>
        }
        onClose={onClose}
        cancelButton={{
          accessibilityLabel: 'invalidphonealert_button_close',
          title: L.invalidphonealert_button_close,
        }}
        actionButton={{
          textStyle: styles.textActionButton,
          accessibilityLabel: 'invalidphonealert_button_action',
          title: L.invalidphonealert_button_action,
          onPress: this.goToProfile,
        }}
      />
    );
  }
}
