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
  hours: {
    fontSize: 14,
    paddingTop: 10,
    color: Colors.grey5,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  alertMessageReminder1: {
    paddingHorizontal: 5,
    fontSize: 14,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font(),
    marginBottom: 15,
  } as TextStyle,
  alertMessageReminder2: {
    paddingHorizontal: 5,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey6,
    textAlign: 'center',
    ...Font(),
    marginBottom: 10,
  } as TextStyle,
  holidayNotice: {
    paddingHorizontal: 20,
    textAlign: 'center',
    color: Colors.grey4,
    fontSize: 13,
    paddingBottom: 15,
    ...Font({ weight: 'Medium' }),
  } as TextStyle,
  disableAvailabilityAlertCheck: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignSelf: 'center',
    marginBottom: 0,
    paddingBottom: 0,
  } as ViewStyle,
});

export interface AvailabilityAlertProps {
  onAction?: () => void;
  onClose?: () => void;
  outOfTime?: boolean;
  accessibilityLabel: string;
}

export interface AvailabilityAlertState {}

export default class AvailabilityAlert extends React.Component<
  AvailabilityAlertProps,
  AvailabilityAlertState
> {
  render() {
    const { onAction, onClose } = this.props;
    return (
      <Alert
        message={
          <View>
            <Text style={styles.alertMessageType}>
              <Text>{L.availabilityalert_title} </Text>
            </Text>
            <Text style={styles.alertMessageReminder1}>
              {L.availabilityalert_message_part1}
            </Text>

            <Text style={styles.alertMessageReminder2}>
              {L.availabilityalert_message_part2}
            </Text>
          </View>
        }
        onClose={onClose}
        actionButton={{
          accessibilityLabel: 'availabilityalert_button_close',
          title: L.availabilityalert_button_close,
        }}
        cancelButton={{
          accessibilityLabel: 'availabilityalert_button_action',
          title: L.availabilityalert_button_action,
          onPress: onAction,
        }}
      />
    );
  }
}
