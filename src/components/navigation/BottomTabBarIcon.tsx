import * as React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StyleProp,
  Animated,
} from 'react-native';
import { Colors } from '../../resources/constants';
import TourRegisterStep from '../tour/TourRegisterStep';
import { TourStep } from '../tour/TourManager';
import { L } from '../../resources/language';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 2,
    bottom: -10,

    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.shine,
    zIndex: 0,
  } as ViewStyle,
  content: {
    flex: 1,
    position: 'relative',
  } as ViewStyle,
});

export interface BottomTabBarIconProps {
  index: number;
  focused: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  style: StyleProp<ViewStyle>;
  children: any
}

export interface BottomTabBarIconState {
  active: Animated.Value;
}

export default class BottomTabBarIcon extends React.Component<
  BottomTabBarIconProps,
  BottomTabBarIconState
> {
  state: BottomTabBarIconState = {
    active: new Animated.Value(0),
  };

  animation!: Animated.CompositeAnimation;

  componentDidMount() {
    const { focused } = this.props;
    focused && this.focus();
  }

  componentDidUpdate(prevProps: BottomTabBarIconProps) {
    const { focused } = this.props;
    if (prevProps.focused !== focused) {
      if (focused) {
        this.focus();
      } else {
        this.blur();
      }
    }
  }

  focus() {
    this.animation && this.animation.stop();
    this.animation = Animated.spring(this.state.active, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    });

    this.animation.start();
  }

  blur() {
    this.animation && this.animation.stop();
    this.animation = Animated.spring(this.state.active, {
      toValue: 0,
      useNativeDriver: true,
    });
    this.animation.start();
  }

  getStepData(index: number): TourStep {
    switch (index) {
      case 0:
        return {
          stepNumber: 1,
          message: L.stepmodal_step1_message,
          hidePrev: true,
          onStart: (navigate: (routeName: string) => void) => {
            navigate('Queries');
          },
        };
      case 1:
        return {
          stepNumber: 2,
          message: L.stepmodal_step2_message,
          onStart: (navigate: (routeName: string) => void) => {
            navigate('Transfers');
          },
        };
      case 2:
        return {
          stepNumber: 3,
          message: L.stepmodal_step3_message,
          onStart: (navigate: (routeName: string) => void) => {
            navigate('Payments');
          },
        };
      case 3:
        return {
          stepNumber: 4,
          message: L.stepmodal_step4_message,
          onStart: (navigate: (routeName: string) => void) => {
            navigate('Loans');
          },
        };
      case 4:
        return {
          stepNumber: 5,
          message: L.stepmodal_step5_message,
          onStart: (navigate: (routeName: string) => void) => {
            navigate('Foryou');
          },
          buttonNextProps: {
            title: L.stepmodal_finish_text,
          },
        };
      default:
        return {
          stepNumber: 1,
        };
    }
  }

  render() {
    const {
      accessibilityLabel,
      onPress,
      onLongPress,
      focused,
      children,
      index,
      ...props
    } = this.props;
    const { active } = this.state;

    const opacity = active.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 1, 1],
    });
    const scale = active.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 1],
    });
    const translateY = active.interpolate({
      inputRange: [0, 1],
      outputRange: [55, 2],
    });

    const transform = {
      opacity,
      transform: [
        {
          translateY,
        },
        {
          scale,
        },
      ],
    };

    return (
      <TouchableWithoutFeedback
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <TourRegisterStep
          accessibilityLabel={'tour_register'}
          step={this.getStepData(index)}
          style={styles.content}
        >
          <Animated.View style={[styles.background, transform]} />

          <View {...props}>{children}</View>
        </TourRegisterStep>
      </TouchableWithoutFeedback>
    );
  }
}
