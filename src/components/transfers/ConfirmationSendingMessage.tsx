import * as React from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font, Sanitizer } from '../../resources/functions';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  } as ViewStyle,
  confirmationTooltipImage: {
    width: 18,
    tintColor: Colors.primary,
    height: 18,
  } as ImageStyle,
  confirmationTooltip: {
    margin: 3,
  } as ViewStyle,
  boldText: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  confirmationText: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
  } as TextStyle,
  confirmationTextWithoutMail: {
    ...Font(),
    color: Colors.secondary,
    flex: 1,
    fontSize: 14,
    textAlign: 'left',
  } as TextStyle,
  confirmationContainer: {
    alignSelf: 'center',
    overflow: 'visible',
  } as ViewStyle,
  confirmation: {
    width: '90%',
  } as ViewStyle,
  confirmationWithoutMail: {
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  moreIcon: {
    tintColor: Colors.secondary,
    marginLeft: 5,
    width: 9,
    height: 16,
  } as ImageStyle,
});

export interface ConfirmationSendingMessageProps {
  userEmail?: string;
  style?: StyleProp<ViewStyle>;
  description?: string;
  onPress?: () => void;
}

export interface ConfirmationSendingMessageState {}

export default class ConfirmationSendingMessage extends React.Component<
  ConfirmationSendingMessageProps,
  ConfirmationSendingMessageState
> {
  render() {
    const { userEmail, style, description } = this.props;
    if (!userEmail) {
      return <View />;
    }
    return (
      <View style={[styles.confirmation, style]}>
        <Text
          accessibilityLabel={'confirmationsendingmessage'}
          style={styles.confirmationText}
        >
          {!!description ? description : L.confirmationsendingmessage_text}
        </Text>
        <View
          accessibilityLabel={'confirmationsendingmessage_email'}
          style={[styles.confirmationContainer, styles.emailContainer]}
        >
          <Text style={[styles.confirmationText, styles.boldText]}>
            {Sanitizer.maskEmail(userEmail)}
          </Text>
        </View>
      </View>
    );
  }
}
