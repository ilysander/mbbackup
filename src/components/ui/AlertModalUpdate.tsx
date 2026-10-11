import * as React from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import { L } from '../../resources/language';
import Alert, { AlertProps } from './Alert';

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  } as ViewStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.brown,
    fontSize: 26,
    paddingVertical: 20,
    textAlign: 'center',
  } as TextStyle,
  text: {
    ...Font(),
    textAlign: 'center',
    fontSize: 16,
    color: Colors.grey5,
  } as TextStyle,
});

export interface AlertModalUpdateProps extends AlertProps {
  icon?: ImageSourcePropType;
  title?: string;
  message?: string;
  messageLarge?: string | React.ReactNode;
  showMessageLarge?: boolean;
  confirmText?: string;
  messageStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface AlertModalUpdateState {}

export default class AlertModalUpdate extends React.Component<
  AlertModalUpdateProps,
  AlertModalUpdateState
> {
  render() {
    const {
      title,
      icon,
      message,
      messageLarge,
      onSuccess,
      confirmText,
      messageStyle,
      titleStyle,
      showMessageLarge,
      ...props
    } = this.props;

    return (
      <Alert
        actionButton={{
          accessibilityLabel: 'alertmodaloptions_button_success',
          title: confirmText || L.alertmodaloptions_button_success,
          onPress: onSuccess,
          typeColor: 'accentDark',
        }}
        {...props}
        message={
          <View
            style={styles.content}
            accessibilityLabel={'alertmessage_content'}
          >
            {title && (
              <Text
                style={[styles.titleText, titleStyle]}
                accessibilityLabel={'alertmessage_text_title'}
              >
                {title}
              </Text>
            )}
            {message && (
              <Text
                style={!messageStyle ? styles.text : messageStyle}
                accessibilityLabel={'alertmessage_text_message'}
              >
                {message}
              </Text>
            )}
            {showMessageLarge && messageLarge}
          </View>
        }
      />
    );
  }
}
