import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  Animated,
  Easing,
  StyleProp,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import LottieView from 'lottie-react-native';
import { L } from '../../resources/language';
const styles = StyleSheet.create({
  animation: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  } as ViewStyle,
  content: {
    position: 'absolute',
    paddingTop: 50,
    paddingBottom: 40,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  } as ViewStyle,
  subtitleText: {
    ...Font({ weight: 'Bold' }),
    fontSize: 18,
    lineHeight: 19,
    textAlign: 'center',
    color: Colors.accentDark,
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'Bold', style: 'Italic' }),
    fontSize: 32,
    textAlign: 'center',
    color: Colors.primary,
  } as TextStyle,
});

export interface HappyProps extends ViewProps {
  accessibilityLabel: string;
  contentStyle?: StyleProp<ViewStyle>;
  title?: string | React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  subtitle?: string | React.ReactNode;
  loop?: boolean;
  type?: 'default' | 'fullscreen';
}

export interface HappyState {
  fade: Animated.Value;
  fadeSubtitle: Animated.Value;
}

export default class Happy extends React.Component<HappyProps, HappyState> {
  static defaultProps = {
    title: L.happy_title,
    loop: true,
    type: 'default',
  };

  state: HappyState = {
    fade: new Animated.Value(0),
    fadeSubtitle: new Animated.Value(0),
  };

  animation!: LottieView | null;

  componentDidMount() {
    this.start();
  }

  start = () => {
    Animated.timing(this.state.fade, {
      toValue: 1,
      delay: 800,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      this.animation && this.animation.play();

      Animated.timing(this.state.fadeSubtitle, {
        toValue: 1,
        delay: 200,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });
  };

  render() {
    const {
      type,
      style,
      contentStyle,
      title,
      titleStyle,
      subtitleStyle,
      subtitle,
      loop,
      children,
    } = this.props;
    const { fade, fadeSubtitle } = this.state;
    let source;
    switch (type) {
      case 'fullscreen':
        source = require('../../assets/lottie/happy_fullscreen.json');
        break;

      default:
        source = require('../../assets/lottie/happy.json');
        break;
    }
    return (
      <View style={[style]}>
        <LottieView
          style={styles.animation}
          ref={animation => {
            this.animation = animation;
          }}
          loop={loop}
          imageAssetsFolder={'lottie/happy/images'}
          source={source}
        />
        {children}
        <View style={[styles.content, contentStyle]}>
          {!!title && (
            <Animated.View style={{ opacity: fade }}>
              <Text style={[styles.titleText, titleStyle]}>{title}</Text>
            </Animated.View>
          )}
          {!!subtitle && (
            <Animated.View style={{ opacity: fadeSubtitle }}>
              <Text style={[styles.subtitleText, subtitleStyle]}>
                {subtitle}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    );
  }
}
