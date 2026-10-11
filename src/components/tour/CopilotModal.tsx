import * as React from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageStyle,
  LayoutChangeEvent,
  Modal,
  NativeModules,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Size } from '../../resources/dimensions';
import { Font } from '../../resources/functions';
import { L } from '../../resources/language';
import { Log } from '../../resources/log';
import { Touchable, ButtonLink } from '../ui';
import Features from '../../resources/remote/Features';

const ZIndex = 50;
const Margin = 13;
const ArrowSize = -10;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: ZIndex,
  } as ViewStyle,
  arrow: {
    position: 'absolute',
    margin: ArrowSize,
  } as ViewStyle,
  arrowimg: {
    width: 32,
    height: 80,
    tintColor: Colors.shine,
  } as ImageStyle,
  close: {
    position: 'absolute',
    top: Size.getStatusBarHeight() + 10,
    right: 10,
  } as ViewStyle,
  closeimg: { width: 32, height: 32 } as ImageStyle,
  tooltip: {
    ...Font({ weight: 'Medium' }),
    color: Colors.white,
    fontSize: 16,
    position: 'absolute',
    paddingHorizontal: 15,
    left: 40,
    right: 0,
  } as TextStyle,
  tooltipbold: {
    ...Font({ weight: 'Bold' }),
  } as TextStyle,
  button: {
    backgroundColor: Colors.white,
    position: 'absolute',
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 20,
    right: 0,
    left: 0,
  } as ViewStyle,
  overlayRectangle: {
    position: 'absolute',
    backgroundColor: Colors.modal,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  } as ViewStyle,
});

const noop = () => {
  return true;
};

const TAG = '[CopilotModal]';

class CopilotModal extends React.Component<any, any> {
  static defaultProps = {
    easing: Easing.elastic(0.7),
    animationDuration: 400,
    overlay: 'view',
    // If animated was not specified, rely on the default overlay type
    animated: typeof NativeModules.RNSVGSvgViewManager !== 'undefined',
    androidStatusBarVisible: true,
  };

  state: any = {
    tooltip: {},
    arrow: {},
    button: {},
    animatedValues: {
      top: new Animated.Value(0),
    },
    animated: false,
    containerVisible: false,
  };
  layout = {
    width: 0,
    height: 0,
  };
  animation!: Animated.CompositeAnimation;

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.visible === false) {
      this.reset();
    }
  }

  goToSignUpButton = () => {
    if (Features.isAllowedTo('SignUpWeb')) {
      this.props.navigation.navigate('SignUpWeb');
    } else {
      this.props.navigation.navigate('SignUpCredentials');
    }
    this.handleStop();
  };

  handleLayoutChange = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    this.layout = layout;
  };

  measure() {
    if (typeof __TEST__ !== 'undefined' && __TEST__) {
      return new Promise(resolve =>
        resolve({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        })
      );
    }

    return new Promise(resolve => {
      const setLayout = () => {
        if (this.layout.width !== 0) {
          resolve(this.layout);
        } else {
          requestAnimationFrame(setLayout);
        }
      };
      setLayout();
    });
  }

  async _animateMove(obj: any = {}) {
    const layout = await this.measure();

    const tooltip: any = {};
    const arrow: any = {};
    const button: any = {};

    const maxHeight = Size.getVisibleHeight() * 0.85;
    const top = obj.top > maxHeight ? maxHeight : obj.top;

    tooltip.top = top - Margin - obj.height - 85 - 50;
    arrow.top = top - Margin - obj.height - 50;
    arrow.right = Size.getVisibleWidth() * 0.12 - Margin;
    button.top = top - Margin;

    const animate: any = {
      top,
    };

    if (this.state.animated) {
      this.animation && this.animation.stop();
      this.animation = Animated.parallel(
        Object.keys(animate).map(key =>
          Animated.timing(this.state.animatedValues[key], {
            toValue: animate[key],
            duration: this.props.animationDuration,
            easing: this.props.easing,
            useNativeDriver: false,
          })
        )
      );
      this.animation.start();
    } else {
      Object.keys(animate).forEach(key => {
        this.state.animatedValues[key].setValue(animate[key]);
      });
    }

    this.setState({
      tooltip,
      arrow,
      button,
      layout,
      animated: this.props.animated,
    });
  }

  animateMove(obj = {}) {
    return new Promise<void>(resolve => {
      this.setState({ containerVisible: true }, () =>
        requestAnimationFrame(async () => {
          await this._animateMove(obj);
          resolve();
        })
      );
    });
  }

  reset() {
    Log.debug(TAG, 'reset');
    this.setState({
      animated: false,
      containerVisible: false,
      layout: undefined,
    });
  }

  handleStop = () => {
    this.reset();
    this.props.stop();
  };

  renderMask() {
    return <Animated.View style={styles.overlayRectangle} />;
  }

  renderTooltip() {
    return [
      <Touchable
        key={'close'}
        accessibilityLabel={'copilotmodal_touchableopacity_apptour_close'}
        style={styles.close}
        onPress={this.handleStop}
      >
        <Image
          style={styles.closeimg}
          source={require('../../assets/images/app-tour-close.png')}
        />
      </Touchable>,
      <Animated.View key={'arrow'} style={[styles.arrow, this.state.arrow]}>
        <Image
          style={styles.arrowimg}
          source={require('../../assets/images/app-tour-arrow.png')}
        />
      </Animated.View>,
      <Text
        accessibilityLabel={'copilotmodal_text_apptour_tooltip'}
        key={'tooltip'}
        style={[styles.tooltip, this.state.tooltip]}
      >
        <Text accessibilityLabel={'copilotmodal_text_apptour_tooltip_part1'}>
          {L.signinscreen_text_apptour_tooltip_part1}
        </Text>
        <Text
          style={styles.tooltipbold}
          accessibilityLabel={'copilotmodal_text_apptour_tooltip_part2'}
        >
          {L.signinscreen_text_apptour_tooltip_part2}
        </Text>
        <Text
          style={styles.tooltipbold}
          accessibilityLabel={'copilotmodal_text_apptour_tooltip_part3'}
        >
          {L.signinscreen_text_apptour_tooltip_part3}
        </Text>
        <Text accessibilityLabel={'copilotmodal_text_apptour_tooltip_part4'}>
          {L.signinscreen_text_apptour_tooltip_part4}
        </Text>
        <Text
          style={styles.tooltipbold}
          accessibilityLabel={'copilotmodal_text_apptour_tooltip_part5'}
        >
          {L.signinscreen_text_apptour_tooltip_part5}
        </Text>
      </Text>,
      <Animated.View key={'button'} style={[styles.button, this.state.button]}>
        <ButtonLink
          accent={'accentDark'}
          accessibilityLabel={'copilotmodal_buttonsecondary_apptour_signup'}
          onPress={this.goToSignUpButton}
          title={L.signinscreen_buttonsecondary_signup}
        />
      </Animated.View>,
    ];
  }

  render() {
    const containerVisible = this.state.containerVisible || this.props.visible;
    const contentVisible = this.state.layout && containerVisible;

    return (
      <Modal
        animationType={'none'}
        visible={containerVisible}
        onRequestClose={noop}
        transparent
      >
        <View style={styles.container} onLayout={this.handleLayoutChange}>
          {contentVisible && this.renderMask()}
          {contentVisible && this.renderTooltip()}
        </View>
      </Modal>
    );
  }
}

export default CopilotModal;
