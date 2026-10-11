import * as React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Alert } from '../ui';

const styles = StyleSheet.create({
  noticeText: {
    fontSize: 18,
    paddingHorizontal: 5,
    color: Colors.accentDark,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  footNoteText: {
    paddingHorizontal: 5,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grey5,
    textAlign: 'center',
    ...Font(),
  } as TextStyle,
  hoursText: {
    fontSize: 14,
    paddingTop: 10,
    color: Colors.grey5,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
});

export interface DPFAvailabilityAlertProps {
  onClose?: () => void;
  accessibilityLabel: string;
}

export interface DPFAvailabilityAlertState {}

export default class DPFAvailabilityAlert extends React.PureComponent<
  DPFAvailabilityAlertProps,
  DPFAvailabilityAlertState
> {
  render() {
    const { onClose, accessibilityLabel } = this.props;
    return (
      <Alert
        accessibilityLabel={accessibilityLabel}
        message={
          <View>
            <Text
              accessibilityLabel={'dpfavailabilityalert_text_notice'}
              style={styles.noticeText}
            >
              {L.dpfavailabilityalert_text_notice}
            </Text>
            <Text
              accessibilityLabel={'dpfavailabilityalert_text_hours'}
              style={styles.hoursText}
            >
              {L.dpfavailabilityalert_text_hours}
            </Text>
            <Text
              accessibilityLabel={'dpfavailabilityalert_text_footnote'}
              style={styles.footNoteText}
            >
              {L.dpfavailabilityalert_text_footnote}
            </Text>
          </View>
        }
        onClose={onClose}
        actionButton={{
          accessibilityLabel: 'dpfavailabilityalert_button_close',
          title: L.dpfavailabilityalert_button_close,
        }}
      />
    );
  }
}
