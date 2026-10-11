import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Alert } from '../ui';

const styles = StyleSheet.create({
  alertMessageType: {
    fontSize: 18,
    paddingHorizontal: 5,
    color: Colors.primary,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
    marginBottom: 20,
  } as TextStyle,
  alertMessageReminder1: {
    paddingHorizontal: 5,
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font(),
  } as TextStyle,
  button: {
    minHeight: 40,
    width: '100%',
  } as ViewStyle,
});

export interface ModalInfoNewAccountProps {
  onAction?: () => void;
  onClose?: () => void;
  accessibilityLabel: string;
}

export interface ModalInfoNewAccountState {}

export default class ModalInfoNewAccount extends React.Component<
  ModalInfoNewAccountProps,
  ModalInfoNewAccountState
> {
  render() {
    const { onAction, onClose } = this.props;
    return (
      <Alert
        message={
          <View>
            <Text style={styles.alertMessageType}>
              {L.newaccountscreen_modal_title}
            </Text>
            <Text style={styles.alertMessageReminder1}>
              {L.newaccountscreen_modal_info}
            </Text>
          </View>
        }
        actionButton={{
          accessibilityLabel: 'newaccount_button_modal_action',
          title: L.newaccountscreen_modal_accept,
          onPress: onAction,
          style: styles.button,
          typeColor: 'primary',
        }}
        onClose={onClose}
      />
    );
  }
}
