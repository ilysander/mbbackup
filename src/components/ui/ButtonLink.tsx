import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
  Image,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 6,
    flexDirection: 'row',
  } as ViewStyle,
  strong: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  title: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey5,
    textAlign: 'center',
    fontSize: 13,
  } as TextStyle,
  icon: {
    width: 12,
    height: 12,
    tintColor: Colors.primary,
    marginLeft: 3,
  } as ImageStyle,
  iconExtra: {
    width: 13,
    height: 22,
    tintColor: Colors.accentDark,
  } as ImageStyle,
});

export interface ButtonLinkProps extends TouchableProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  title?: string;
  strong?: boolean;
  accent?: AccentColor;
  titleStyle?: StyleProp<TextStyle>;
  imagePosition?: 'left' | 'right';
  imageSource?: ImageSourcePropType;
  imageExtraSource?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  imageExtraStyle?: StyleProp<ImageStyle>;
  titleComponent?: React.ReactNode[] | React.ReactNode;
}

export interface ButtonLinkState { }
type AccentColor =
  | 'primary'
  | 'primaryLight'
  | 'secondary'
  | 'accent'
  | 'accentDark'
  | 'shine';
export default class ButtonLink extends React.Component<
  ButtonLinkProps,
  ButtonLinkState
> {
  static defaultProps = {
    imagePosition: 'left',
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  };
  onPress = (event: GestureResponderEvent) => {
    const { onPress, isLoading, isDisabled } = this.props;
    if (isDisabled || isLoading) {
      return;
    }
    if (typeof onPress === 'function') {
      onPress(event);
    }
  };

  buildStyleColor = (style?: AccentColor) => {
    const defaultStyle = {
      color: Colors.grey5,
      tintColor: Colors.grey5,
    };

    switch (style) {
      case 'primary':
        defaultStyle.color = Colors.primary;
        defaultStyle.tintColor = Colors.primary;
        break;
      case 'secondary':
        defaultStyle.color = Colors.secondary;
        defaultStyle.tintColor = Colors.secondary;
        break;
      case 'accent':
        defaultStyle.color = Colors.accent;
        defaultStyle.tintColor = Colors.accent;
        break;
      case 'accentDark':
        defaultStyle.color = Colors.accentDark;
        defaultStyle.tintColor = Colors.accentDark;
        break;
      case 'shine':
        defaultStyle.color = Colors.shine;
        defaultStyle.tintColor = Colors.shine;
        break;
      case 'primaryLight':
        defaultStyle.color = Colors.primaryLight;
        defaultStyle.tintColor = Colors.primaryLight;
        break;
      default:
        break;
    }

    return defaultStyle;
  };

  render() {
    const {
      title,
      strong,
      onPress,
      accent,
      style,
      titleStyle,
      imageSource,
      imagePosition,
      imageStyle,
      imageExtraSource,
      imageExtraStyle,
      titleComponent,
      accessibilityLabel,
      ...props
    } = this.props;
    const position = imagePosition || ButtonLink.defaultProps.imagePosition;
    const styleColor = this.buildStyleColor(accent);
    return (
      <Touchable
        analyticsParams={title ? title : undefined}
        accessibilityLabel={accessibilityLabel || 'buttonlink'}
        style={[styles.container, style]}
        {...props}
        onPress={onPress ? this.onPress : undefined}
      >
        {imageExtraSource && (
          <Image
            accessibilityLabel={'buttonexternal_image'}
            style={[styles.iconExtra, imageExtraStyle]}
            source={imageExtraSource}
            resizeMode={'contain'}
          />
        )}
        {title && (
          <Text
            accessibilityLabel={'buttonlink_text'}
            style={[
              styles.title,
              strong && styles.strong,
              { color: styleColor.color },
              titleStyle,
            ]}
          >
            {title}
          </Text>
        )}
        {titleComponent}
        {imageSource && position === 'right' && (
          <Image
            accessibilityLabel={'buttonexternal_image'}
            style={[
              styles.icon,
              { tintColor: styleColor.tintColor },
              imageStyle,
            ]}
            source={imageSource}
            resizeMode={'contain'}
          />
        )}
      </Touchable>
    );
  }
}
