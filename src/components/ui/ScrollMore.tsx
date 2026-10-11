import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  Image,
  ImageStyle,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    zIndex: 1000,
  } as ViewStyle,
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ImageStyle,
  icon: {
    width: 70,
    height: 70,
  } as ImageStyle,
});

export interface ScrollMoreProps extends ViewProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export interface ScrollMoreState {}

export default class ScrollMore extends React.Component<
  ScrollMoreProps,
  ScrollMoreState
> {
  render() {
    const { onPress, style, ...props } = this.props;

    return (
      <Animated.View
        accessibilityLabel={'scrollmore'}
        style={[styles.container, style]}
        {...props}
      >
        <Touchable
          accessibilityLabel={'scrollmore_button'}
          style={styles.button}
          onPress={onPress}
        >
          <Image
            accessibilityLabel={'scrollmore_image'}
            source={require('../../assets/images/arrow-show-more-icon.png')}
            style={styles.icon}
          />
        </Touchable>
      </Animated.View>
    );
  }
}
