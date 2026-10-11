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
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';
import { Alert } from './index';
import { AlertProps } from './Alert';

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
    color: Colors.grey6,
  } as TextStyle,
  textBold: {
    ...Font({ weight: 'SemiBold' }),
  } as TextStyle,
  imageMedia: {
    width: 80,
    height: 80,
  } as ImageStyle,
});

export interface AlertModalMediaProps extends AlertProps {
  imgNeedTint?: boolean;
  icon?: ImageSourcePropType;
  title?: string;
  message1?: string | React.ReactNode[];
  message2?: string | React.ReactNode[];
  message3?: string | React.ReactNode[];
  confirmText?: string;
  onSuccess?: () => void;
  iconStyle?: StyleProp<ImageStyle>;
  messageStyle?: StyleProp<TextStyle>;
  notShowIcon?: boolean;
}

export interface AlertModalMediaState {}

export default class AlertModalMedia extends React.Component<
  AlertModalMediaProps,
  AlertModalMediaState
> {
  render() {
    const {
      title,
      icon,
      message1,
      message2,
      message3,
      confirmText,
      onSuccess,
      iconStyle,
      titleStyle,
      imgNeedTint,
      messageStyle,
      notShowIcon,
      ...props
    } = this.props;

    return (
      <Alert
        actionButton={{
          accessibilityLabel: 'alertmodalmediaoptions_button_success',
          title: !!confirmText ? confirmText : '',
          onPress: onSuccess,
          style: { width: '100%' },
        }}
        {...props}
        message={
          <View
            style={styles.content}
            accessibilityLabel={'alertmessage_content'}
          >
            <Image
              style={[styles.imageMedia, iconStyle]}
              resizeMode={'stretch'}
              source={
                icon
                  ? icon
                  : require('../../assets/images/adn-man-important.png')
              }
            />

            {title && (
              <Text
                style={[styles.titleText, titleStyle]}
                accessibilityLabel={'alertmessage_text_title'}
              >
                {title}
              </Text>
            )}
            {!!message1 && (
              <>
                <Text
                  style={styles.text}
                  accessibilityLabel={'alertmessage_text_message'}
                >
                  <Text
                    style={styles.textBold}
                    accessibilityLabel={'alertmessage_text_message'}
                  >
                    {message1}
                  </Text>
                  <Text
                    style={styles.text}
                    accessibilityLabel={'alertmessage_text_message'}
                  >
                    {message2}
                  </Text>
                </Text>
                <Text
                  style={styles.text}
                  accessibilityLabel={'alertmessage_text_message'}
                >
                  {'\n'}
                  {message3}
                </Text>
              </>
            )}
          </View>
        }
      />
    );
  }
}
