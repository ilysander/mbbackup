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
import Font from '../../resources/functions/Font';
import Colors from '../../resources/constants/Colors';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
  } as ViewStyle,
  title: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    textAlign: 'left',
    fontSize: 14,
  } as TextStyle,
  icon: {
    width: 16,
    height: 16,
    tintColor: Colors.secondary,
    marginLeft: 7,
    backgroundColor: 'transparent',
  } as ImageStyle,
});

export interface TextLinkProps extends TouchableProps {
  title?: string;
  imageSource?: ImageSourcePropType;
  styleTitle?: StyleProp<TextStyle>;
  styleIcon?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
}

export interface TextLinkState {}

export default class TextLink extends React.Component<
  TextLinkProps,
  TextLinkState
> {
  onPress = (event: GestureResponderEvent) => {
    const { onPress } = this.props;
    if (typeof onPress === 'function') {
      onPress(event);
    }
  };

  render() {
    const {
      title,
      onPress,
      style,
      imageSource,
      styleTitle,
      styleIcon,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'TextLink'}
        style={[styles.container, style]}
        {...props}
        onPress={onPress ? this.onPress : undefined}
      >
        {title && (
          <Text
            accessibilityLabel={'TextLink_text'}
            style={[styles.title, styleTitle]}
          >
            {title}{' '}
            {imageSource && (
              <Image
                accessibilityLabel={'buttonexternal_image'}
                style={[styles.icon, styleIcon]}
                source={imageSource}
                resizeMode={'contain'}
              />
            )}
          </Text>
        )}
      </Touchable>
    );
  }
}
