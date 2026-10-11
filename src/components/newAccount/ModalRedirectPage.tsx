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
    color: Colors.accentDark,
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
  } as ViewStyle,
});

export interface ModalRedirectPageProps {
  onAction?: () => void;
  onClose?: () => void;
  accessibilityLabel: string;
}

export interface ModalRedirectPageState {}

export default class ModalRedirectPage extends React.Component<
  ModalRedirectPageProps,
  ModalRedirectPageState
> {
  render() {
    const { onAction, onClose } = this.props;
    return (
      <Alert
        message={
          <View>
            <Text style={styles.alertMessageType}>
              {L.newaccountscreen_title_modal}
            </Text>
            <Text style={styles.alertMessageReminder1}>
              {L.newaccountscreen_text_modal}
            </Text>
          </View>
        }
        cancelButton={{
          accessibilityLabel: 'newaccount_button_close',
          title: L.newaccountscreen_button_close,
          style: styles.button,
        }}
        actionButton={{
          accessibilityLabel: 'newaccount_button_action',
          title: L.newaccountscreen_button_action,
          onPress: onAction,
          style: styles.button,
        }}
        onClose={onClose}
      />
    );
  }
}
