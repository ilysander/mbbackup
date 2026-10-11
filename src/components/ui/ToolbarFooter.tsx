import * as React from 'react';
import {
  StyleSheet,
  Animated,
  ViewStyle,
  EmitterSubscription,
  Keyboard,
  Easing,
  ViewProps,
  View,
  LayoutChangeEvent,
} from 'react-native';
import Colors from '../../resources/constants/Colors';

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: {
      height: -2,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    backgroundColor: Colors.grey1,
  } as ViewStyle,
});

export interface ToolbarFooterProps extends ViewProps {
  isSuccess?: boolean;
  accessibilityLabel: string;
  children: React.ReactNode[] | React.ReactNode;
  height?: number;
}

export interface ToolbarFooterState {
  offsetAnim: Animated.Value;
  containerHeight: number;
}
export default class ToolbarFooter extends React.Component<
  ToolbarFooterProps,
  ToolbarFooterState
> {
  static defaultProps = {
    height: 100,
  };
  state: ToolbarFooterState = {
    offsetAnim: new Animated.Value(0),
    containerHeight: 100,
  };
  animation!: Animated.CompositeAnimation;
  keyboardWillShowListener!: EmitterSubscription;
  keyboardWillHideListener!: EmitterSubscription;

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  onLayout = (event: LayoutChangeEvent) => {
    this.setState({ containerHeight: event.nativeEvent.layout.height });
  };

  keyboardWillShow = () => {
    const { containerHeight } = this.state;
    this.animation && this.animation.stop();
    this.animation = Animated.timing(this.state.offsetAnim, {
      toValue: -containerHeight,
      easing: Easing.inOut(Easing.ease),
      duration: 300,
      useNativeDriver: false,
    });

    requestAnimationFrame(() => {
      this.animation.start();
    });
  };

  keyboardWillHide = () => {
    this.animation && this.animation.stop();
    this.animation = Animated.spring(this.state.offsetAnim, {
      toValue: 0,
      friction: 8,
      useNativeDriver: false,
    });
    requestAnimationFrame(() => {
      this.animation.start();
    });
  };

  getHeight = () => {
    const { height: heightProp } = this.props;
    return heightProp || ToolbarFooter.defaultProps.height;
  };

  render() {
    const { children, style, height: _height, ...props } = this.props;

    const { offsetAnim } = this.state;
    return (
      <Animated.View
        style={[styles.container, { marginBottom: offsetAnim }]}
        {...props}
      >
        <View style={style} onLayout={this.onLayout}>
          {children}
        </View>
      </Animated.View>
    );
  }
}
