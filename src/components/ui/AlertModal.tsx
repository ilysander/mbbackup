import * as React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
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
    color: Colors.accentDark,
    fontSize: 18,
    paddingVertical: 20,
    textAlign: 'center',
  } as TextStyle,
  text: {
    ...Font(),
    textAlign: 'center',
    fontSize: 14,
    color: Colors.grey5,
  } as TextStyle,
  imageIcon: {
    tintColor: Colors.accentDark,
    width: 70,
    height: 70,
  } as ImageStyle,
  imageIconNoTint: {
    width: 70,
    height: 70,
  } as ImageStyle,
});

export interface AlertModalProps extends AlertProps {
  imgNeedTint?: boolean;
  icon?: ImageSourcePropType;
  title?: string;
  message?: string | React.ReactNode[];
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  iconStyle?: StyleProp<ImageStyle>;
  messageStyle?: StyleProp<TextStyle>;
  notShowIcon?: boolean;
  bodyTextComponent?: React.ReactNode;
}

export interface AlertModalState {}

export default class AlertModal extends React.Component<
  AlertModalProps,
  AlertModalState
> {
  render() {
    const {
      title,
      icon,
      message,
      onSuccess,
      iconStyle,
      titleStyle,
      imgNeedTint,
      messageStyle,
      notShowIcon,
      buttonsComponents,
      bodyTextComponent,
      onClose,
      ...props
    } = this.props;

    return (
      <Alert
        actionButton={{
          accessibilityLabel: 'alertmodaloptions_button_success',
          title: L.alertmodaloptions_button_success,
          onPress: onSuccess,
        }}
        onClose={onClose}
        buttonsComponents={buttonsComponents}
        {...props}
        message={
          <View
            style={styles.content}
            accessibilityLabel={'alertmessage_content'}
          >
            {!notShowIcon && (
              <Image
                style={[
                  !imgNeedTint ? styles.imageIcon : styles.imageIconNoTint,
                  iconStyle,
                ]}
                resizeMode={'stretch'}
                source={
                  icon ? icon : require('../../assets/images/warning-icon.png')
                }
              />
            )}
            {title && (
              <Text
                style={[styles.titleText, titleStyle]}
                accessibilityLabel={'alertmessage_text_title'}
              >
                {title}
              </Text>
            )}
            {!!message && (
              <Text
                style={!messageStyle ? styles.text : messageStyle}
                accessibilityLabel={'alertmessage_text_message'}
              >
                {message}
              </Text>
            )}
            {!!bodyTextComponent && bodyTextComponent}
          </View>
        }
      />
    );
  }
}
