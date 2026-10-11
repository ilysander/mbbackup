import * as React from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageSourcePropType,
  ViewProps,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable, {TouchableProps} from './Touchable';
import {AnalyticsLabelsType} from '../../resources/analytics/index';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  } as ViewStyle,
  text: {
    ...Font({weight: 'Medium'}),
    fontSize: 13,
    lineHeight: 15,
  } as TextStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  icon: {
    marginRight: 10,
    width: 21,
    height: 21,
  } as ImageStyle,
});

export type InfoMessageProps =
  | InfoMessageDefaultProps
  | InfoMessageTouchableProps;

interface InfoMessageCommonProps {
  message?: string | React.ReactNode;
  imageSource?: ImageSourcePropType;
  typeColor?:
    | 'primaryLight'
    | 'primary'
    | 'secondary'
    | 'accentDark'
    | 'accent'
    | 'danger';
  showImage?: boolean;
  isMessage?: boolean;
  isCustomMessage?: boolean;
  customMessage?: View | React.ReactNode;
}
export interface InfoMessageTouchableProps
  extends TouchableProps,
    InfoMessageCommonProps {
  accessibilityLabel: AnalyticsLabelsType;
}

export interface InfoMessageDefaultProps
  extends ViewProps,
    InfoMessageCommonProps {
  accessibilityLabel: string;
  onPress?: () => void;
}

export interface InfoMessageState {}

export default class InfoMessage extends React.Component<
  InfoMessageProps,
  InfoMessageState
> {
  static defaultProps = {
    isMessage: true,
    isCustomMessage: false,
  };

  render() {
    const {
      message,
      style,
      onPress,
      typeColor,
      showImage,
      imageSource,
      isMessage,
      isCustomMessage,
      customMessage,
      ...props
    } = this.props as InfoMessageTouchableProps;
    let color;
    typeColor ? (color = Colors[typeColor]) : (color = Colors.secondary);

    const hasCustomMessage = !!isCustomMessage;

    return (
      <Touchable
        style={[styles.container, {borderColor: color}, style]}
        activeOpacity={onPress ? undefined : 1}
        onPress={onPress}
        {...props}>
        {!showImage && (
          <Image
            resizeMode={'contain'}
            accessibilityLabel={'infomessage_icon'}
            style={[styles.icon, {tintColor: color}]}
            source={imageSource || require('../../assets/images/info-icon.png')}
          />
        )}
        <View style={styles.content}>
          {isMessage && (
            <Text
              style={[styles.text, {color}]}
              accessibilityLabel={'infomessage_text_content'}>
              {message}
            </Text>
          )}
          {!!hasCustomMessage && <>{customMessage}</>}
        </View>
      </Touchable>
    );
  }
}
