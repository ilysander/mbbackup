import * as React from 'react';
import { Animated, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  container: {
    marginLeft: -20,
    paddingLeft: 20,
    marginRight: -20,
    paddingRight: 20,
  } as ViewStyle,
  absolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'center',
  } as ViewStyle,
  overlayContainer: {
    zIndex: 200,
  } as ViewStyle,
});

export interface FocusProps extends ViewProps {
  isFocused?: boolean;
  duration?: number;
  forwardedRef?: any;
  onPress?: () => void;
  overlay?: React.ReactNode[] | React.ReactNode;
  children?: React.ReactNode[] | React.ReactNode;
}

export interface FocusState {
  fadeAnim: Animated.Value;
  showOverlay: boolean;
}

const Opacity = {
  Focus: 1,
  Blur: 0.2,
};

class FocusContainer extends React.Component<FocusProps, FocusState> {
  static defaultProps = {
    duration: 300,
  };

  state: FocusState = {
    fadeAnim: new Animated.Value(Opacity.Focus),
    showOverlay: true,
  };
  private animation?: Animated.CompositeAnimation;

  componentDidMount() {
    const { isFocused } = this.props;
    if (isFocused) {
      this.focus();
    } else {
      this.blur();
    }
  }

  blur = () => {
    this.animation && this.animation.stop();
    const { duration } = this.props;
    this.setState({ showOverlay: true }, () => {
      this.animation = Animated.timing(this.state.fadeAnim, {
        toValue: Opacity.Blur,
        duration,
        useNativeDriver: false,
      });
      this.animation.start();
    });
  };

  focus = () => {
    const { duration } = this.props;
    this.animation && this.animation.stop();
    this.animation = Animated.timing(this.state.fadeAnim, {
      toValue: Opacity.Focus,
      duration,
      useNativeDriver: false,
    });
    this.animation.start(() => {
      this.setState({ showOverlay: false });
    });
  };

  componentDidUpdate(prevProps: FocusProps) {
    const { isFocused } = this.props;
    if (prevProps.isFocused !== isFocused) {
      if (isFocused) {
        this.focus();
      } else {
        this.blur();
      }
    }
  }

  render() {
    const { fadeAnim, showOverlay } = this.state;
    const {
      style,
      onPress,
      overlay,
      forwardedRef,
      children,
      ...props
    } = this.props;

    const overlayAnim = fadeAnim.interpolate({
      inputRange: [Opacity.Blur, Opacity.Focus],
      outputRange: [1, 0],
    });

    return (
      <View
        style={[styles.container, style]}
        accessibilityLabel={'focus_' + (showOverlay ? 'inactive' : 'active')}
        ref={forwardedRef}
        {...props}
      >
        <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>

        {showOverlay && !overlay && (
          <Touchable
            accessibilityLabel={'focus_toggle'}
            style={styles.absolute}
            onPress={onPress}
            activeOpacity={1}
          />
        )}
        {showOverlay && !!overlay && (
          <Touchable
            accessibilityLabel={'focus_toggle'}
            style={styles.absolute}
            onPress={onPress}
            activeOpacity={1}
          >
            <Animated.View
              style={[styles.overlayContainer, { opacity: overlayAnim }]}
            >
              {overlay}
            </Animated.View>
          </Touchable>
        )}
      </View>
    );
  }
}

const Focus = React.forwardRef<View, FocusProps>((props, ref) => {
  return <FocusContainer {...props} forwardedRef={ref} />;
});
export default Focus;
