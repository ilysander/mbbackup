import * as React from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  EasingFunction,
} from 'react-native';
import Colors from '../../resources/constants/Colors';

const tinycolor = require('tinycolor2');

const styles = StyleSheet.create({
  background: {
    borderRadius: 10,
    backgroundColor: tinycolor(Colors.accentDark)
      .setAlpha(0.6)
      .toRgbString(),
    height: 50,
    overflow: 'hidden',
  } as ViewStyle,
  fill: {
    borderRadius: 10,
    backgroundColor: Colors.accentDark,
    height: 50,
  } as ViewStyle,
});

export interface ProgressBarProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  fillStyle?: StyleProp<ViewStyle>;
  width: number;
  progress: number;
  easingDuration?: number;
  easing?: EasingFunction;
  accessibilityLabel: string;
}

export interface ProgressBarState {
  progress: Animated.Value;
}

export default class ProgressBar extends React.Component<
  ProgressBarProps,
  ProgressBarState
> {
  static defaultProps = {
    progress: 0,
    easingDuration: 700,
    fillStyle: undefined,
    easing: Easing.ease,
    width: 200,
  };

  static getDerivedStateFromProps(
    props: ProgressBarProps,
    state: ProgressBarState
  ) {
    const { easing, easingDuration, progress } = props;
    Animated.timing(state.progress, {
      easing,
      duration: easingDuration,
      toValue: progress > 1 ? 1 : progress,
      useNativeDriver: false,
    }).start();
    return null;
  }
  animation!: Animated.CompositeAnimation;
  state: ProgressBarState = {
    progress: new Animated.Value(0),
  };

  setValue = (progress: number) => {
    const { easing, easingDuration } = this.props;
    this.animation && this.animation.stop();
    this.animation = Animated.timing(this.state.progress, {
      easing,
      duration: easingDuration,
      toValue: progress > 1 ? 1 : progress,
      useNativeDriver: false,
    });
    this.animation.start();
  };

  render() {
    const { progress } = this.state;
    const {
      style,
      width,
      fillStyle,
      children,
      accessibilityLabel,
      ...props
    } = this.props;

    const fillWidth = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width],
    });

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'progressbar'}
        style={[styles.background, style, { width }]}
        {...props}
      >
        <Animated.View
          accessibilityLabel={'progressbar_seek'}
          style={[styles.fill, fillStyle, { width: fillWidth }]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
}
