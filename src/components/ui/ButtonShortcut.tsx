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
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  imgStyle: {
    height: 32,
    width: 32,
    tintColor: Colors.white,
  } as ImageStyle,
  text: {
    ...Font(),
    fontSize: 12,
    textAlign: 'center',
    color: Colors.white,
  } as TextStyle,
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    padding: 8,
    alignItems: 'center',
    borderRadius: 4,
  } as ViewStyle,
  content: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  } as ViewStyle,
  containerText: {
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
  } as ViewStyle,
});

export interface ButtonShortcutProps extends TouchableProps {
  title: string;
  isDisabled?: boolean;
  imageSource: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
}

export interface ButtonShortcutState {}

export default class ButtonShortcut extends React.Component<
  ButtonShortcutProps,
  ButtonShortcutState
> {
  buttonRef!: TouchableOpacity | null;

  onPress = (event: GestureResponderEvent) => {
    const { onPress, isDisabled } = this.props;
    if (isDisabled) {
      return;
    }
    if (typeof onPress === 'function') {
      onPress(event);
    }
  };

  render() {
    const {
      imageSource,
      imageStyle,
      onPress,
      title,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <Touchable
        style={styles.container}
        accessibilityLabel={accessibilityLabel || 'buttonshortcut'}
        {...props}
        onPress={onPress ? this.onPress : undefined}
      >
        <View style={styles.content}>
          <Image
            accessibilityLabel={'buttonshortcut_image'}
            style={[styles.imgStyle, imageStyle]}
            source={imageSource}
          />
          <View style={styles.containerText}>
            <Text
              accessibilityLabel={'buttonshortcut_text_title'}
              style={styles.text}
            >
              {title}
            </Text>
          </View>
        </View>
      </Touchable>
    );
  }
}
