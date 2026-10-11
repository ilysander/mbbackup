import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { AnalyticsLabelsType } from '../../resources/analytics';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Alert } from '../ui';

const styles = StyleSheet.create({
  descriptionText: {
    fontSize: 18,
    lineHeight: 20,
    marginBottom: 20,
    color: Colors.accentDark,
    textAlign: 'center',
    ...Font({ weight: 'Bold' }),
  } as TextStyle,

  disclaimerText: {
    fontSize: 14,
    color: Colors.grey5,
    textAlign: 'center',
    ...Font(),
  } as TextStyle,
  actionButton: {
    width: '100%',
    height: 40,
    minHeight: 40,
  } as ViewStyle,
});

export interface NotAllowedAlertProps {
  accessibilityLabel: string;
  accessibilityLabelBtn: AnalyticsLabelsType;
  onClose?: () => void;
  title?: string;
  description?: string;
}

export interface NotAllowedAlertState {}

export default class NotAllowedAlert extends React.Component<
  NotAllowedAlertProps,
  NotAllowedAlertState
> {
  render() {
    const {
      onClose,
      accessibilityLabel,
      accessibilityLabelBtn,
      title,
      description,
    } = this.props;
    return (
      <Alert
        accessibilityLabel={accessibilityLabel}
        message={
          <View>
            <Text
              accessibilityLabel={'notallowedalert_text_title'}
              style={styles.descriptionText}
            >
              {title || L.notallowedalert_text_title}
            </Text>
            <Text
              accessibilityLabel={'notallowedalert_text_description'}
              style={styles.disclaimerText}
            >
              {description || L.notallowedalert_text_description}
            </Text>
          </View>
        }
        actionButton={{
          accessibilityLabel: accessibilityLabelBtn,
          title: L.notallowedalert_button_action,
          style: styles.actionButton,
          onPress: onClose,
        }}
      />
    );
  }
}
