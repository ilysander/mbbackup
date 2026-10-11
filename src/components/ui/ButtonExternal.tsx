import * as React from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Loading from './Loading';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  fontBold: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  fontRegular: {
    ...Font(),
  } as TextStyle,
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  icon: {
    width: 16,
    height: 16,
    tintColor: Colors.grey6,
  } as ImageStyle,
  iconExtra: {
    width: 12,
    height: 12,
    tintColor: Colors.grey6,
  } as ImageStyle,
  title: {
    color: Colors.grey5,
    fontSize: 13,
  } as TextStyle,
  titleLeft: {
    marginLeft: 5,
  } as TextStyle,
  titleRight: {
    marginRight: 6,
  } as TextStyle,
  underlineText: {
    textDecorationLine: 'underline',
  } as TextStyle,
});

export interface ButtonExternalProps extends TouchableProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  allowOnPress?: boolean;
  underline?: boolean;
  accent?: boolean;
  lightTitle?: boolean;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  imagePosition?: 'left' | 'right';
  imageSource?: ImageSourcePropType;
  imageExtraSource?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  imageExtraStyle?: StyleProp<ImageStyle>;
}

export interface ButtonExternalState {}

export default class ButtonExternal extends React.Component<
  ButtonExternalProps,
  ButtonExternalState
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

  render() {
    const {
      style,
      title,
      imageSource,
      imageExtraSource,
      imageStyle,
      imageExtraStyle,
      imagePosition,
      isLoading,
      underline,
      hitSlop,
      titleStyle,
      lightTitle,
      accessibilityLabel,
      ...props
    } = this.props;

    const position = imagePosition || ButtonExternal.defaultProps.imagePosition;

    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'buttonexternal'}
        style={[styles.container, style]}
        hitSlop={hitSlop}
        {...props}
        onPress={this.onPress}
      >
        {isLoading && (
          <Loading
            style={imageStyle}
            size={'small'}
            color={Colors.accentDark}
          />
        )}
        {!isLoading && imageSource && position === 'left' && (
          <Image
            accessibilityLabel={'buttonexternal_image'}
            style={[styles.icon, imageStyle]}
            source={imageSource}
          />
        )}
        {title && (
          <Text
            accessibilityLabel={'buttonexternal_text'}
            style={[
              styles.fontBold,
              styles.title,
              position === 'left' && styles.titleLeft,
              position === 'right' && styles.titleRight,
              underline && styles.underlineText,
              lightTitle && styles.fontRegular,
              titleStyle,
            ]}
          >
            {title}
          </Text>
        )}
        {imageSource && position === 'right' && (
          <Image
            accessibilityLabel={'buttonexternal_image'}
            style={[styles.icon, imageStyle]}
            source={imageSource}
          />
        )}
        {imageExtraSource && (
          <Image
            accessibilityLabel={'buttonexternal_image'}
            style={[styles.iconExtra, imageExtraStyle]}
            source={imageExtraSource}
            resizeMode={'contain'}
          />
        )}
      </Touchable>
    );
  }
}
