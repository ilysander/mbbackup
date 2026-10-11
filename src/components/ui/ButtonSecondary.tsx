import * as React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable, { TouchableProps } from './Touchable';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 6,
  } as ViewStyle,
  text: {
    ...Font({ weight: 'Bold' }),
    color: Colors.primary,
    fontSize: 13,
    paddingHorizontal: 2,
  } as TextStyle,
  title: {
    color: Colors.primary,
  } as TextStyle,
});

export interface ButtonSecondaryProps extends TouchableProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  title?: string;
  subtitle?: string;
}

export interface ButtonSecondaryState {}

export default class ButtonSecondary extends React.Component<
  ButtonSecondaryProps,
  ButtonSecondaryState
> {
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
      onPress,
      title,
      subtitle,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <Touchable
        accessibilityLabel={accessibilityLabel || 'buttonsecondary'}
        style={[styles.container, style]}
        {...props}
        onPress={onPress ? this.onPress : undefined}
      >
        {subtitle && (
          <Text
            accessibilityLabel={'buttonsecondary_text_subtitle'}
            style={styles.text}
          >
            {subtitle}
          </Text>
        )}
        {title && (
          <Text
            accessibilityLabel={'buttonsecondary_text_title'}
            style={[styles.text, styles.title]}
          >
            {title}
          </Text>
        )}
      </Touchable>
    );
  }
}
