import * as React from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform,
} from 'react-native';

import Font from '../../resources/functions/Font';

import ButtonImage, { ButtonImageProps } from './ButtonImage';
import Touchable from './Touchable';
import { InitialAppScreen } from '../../resources/initialAppScreen';
import { TypeInitialStart, Colors } from '../../resources/constants';

import { Size } from '../../resources/dimensions';
import { NavigationProp } from '@react-navigation/native';

const tooltipWidth = 280;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  } as ViewStyle,
  pointerPrimary: {
    width: 0,
    height: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.accentDark,
  } as ViewStyle,
  shadow: {
    shadowOffset: { width: 0, height: 3 },
    shadowColor: Colors.shadow,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  backgroundPrimary: {
    backgroundColor: Colors.accentDark,
  } as ViewStyle,
  backgroundSecondary: {
    backgroundColor: Colors.secondary,
  } as ViewStyle,
  pointerSecondary: {
    width: 0,
    marginTop: -18,
    marginLeft: 25,
    height: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: Colors.secondary,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  } as ViewStyle,
  content: {
    zIndex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 8,
    width: tooltipWidth - 5,
    borderRadius: 13,
  } as ViewStyle,
  message: {
    ...Font({ weight: 'Medium' }),
    color: Colors.white,
    fontSize: 11,
    flexWrap: 'wrap',
  } as TextStyle,
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  } as ViewStyle,
});

export interface TooltipProps extends ButtonImageProps {
  showInitial: boolean;
  message?: string | React.ReactNode;
  tooltipPosition?: 'default' | 'left' | 'right';
  tooltipStyle?: StyleProp<ViewStyle>;
  onPressTooltip?: () => void;
  onPress?: () => void;
  navigation: NavigationProp<any, any>;
  infoColor?: boolean;
  title?: string;
}

export interface TooltipState {
  showInitial: boolean;
  isVisible: boolean;
  position: {
    fx: number;
    fy: number;
    width: number;
    height: number;
    px: number;
    py: number;
  };
}
const LoadingDuration: number = 1700;
export default class Tooltip extends React.Component<
  TooltipProps,
  TooltipState
> {
  static defaultProps = {
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  };

  state: TooltipState = {
    showInitial: this.props.showInitial,
    isVisible: false,
    position: {
      fx: 0,
      fy: 0,
      width: 0,
      height: 0,
      px: 0,
      py: 0,
    },
  };

  buttonRef!: ButtonImage | null;
  didFocusListener!: any;

  async componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener(
      'focus',
      this.didFocus
    );
  }

  componentWillUnmount(): void {
    this.didFocusListener && this.didFocusListener();
  }

  didFocus = async () => {
    if (InitialAppScreen.ShowToolTip === TypeInitialStart.ShowToolTip) {
      if (this.state.showInitial === true) {
        InitialAppScreen.ShowToolTip = TypeInitialStart.NotShowToolTip;
        let ref: any = this.buttonRef && this.buttonRef.getButtonRef();
        setTimeout(() => {
          this.timerIniciar(ref);
        }, LoadingDuration);
      }
    }
  };

  getRefButtonTool = () => {
    return this.buttonRef && this.buttonRef.getButtonRef();
  };

  async timerIniciar(ref: any) {
    if (!ref) {
      ref = this.getRefButtonTool();
    }

    if (ref) {
      ref.measure((fx: number) => {
        if (Platform.OS == 'android') {
          if (fx == 0) {
            this.toggle();
          }
        }
        if (fx != 0) {
          this.toggle();
        }
      });
    }
  }

  close = () => {
    this.setState({ isVisible: false });
  };
  toggle = () => {
    this.setState({ isVisible: !this.state.isVisible });
    const { onPress } = this.props;
    if (typeof onPress === 'function') {
      onPress();
    }

    this.updatePosition();
  };

  updatePosition = () => {
    const ref: any = this.buttonRef ? this.buttonRef.getButtonRef() : null;
    if (!ref) {
      return;
    }
    ref.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number
      ) => {
        const position = { fx, fy, width, height, px, py };

        this.setState({ position });

        if (
          Platform.OS == 'android' &&
          this.state.showInitial === true &&
          InitialAppScreen.ShowToolTip === TypeInitialStart.ShowToolTip
        ) {
          InitialAppScreen.ShowToolTip = TypeInitialStart.NotShowToolTip;

          this.setState({ isVisible: true });
        }
      }
    );
  };

  updatePositionLayout = () => {
    const ref: any = this.buttonRef ? this.buttonRef.getButtonRef() : null;
    if (!ref) {
      return;
    }
    ref.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number
      ) => {
        const position = { fx, fy, width, height, px, py };

        this.setState({ position });
      }
    );
  };

  onLayout = (e: LayoutChangeEvent) => {
    const { onLayout } = this.props;
    if (typeof onLayout === 'function') {
      onLayout(e);
    }
    this.updatePositionLayout();
  };

  onPressTooltip = () => {
    const { onPressTooltip } = this.props;
    if (typeof onPressTooltip === 'function') {
      onPressTooltip();
    }
    this.close();
  };

  render() {
    const {
      message,
      tooltipPosition: tooltipPositionProp,
      tooltipStyle,
      hitSlop,
      infoColor,
      title,
      ...props
    } = this.props;
    const { isVisible, position } = this.state;
    const dimensions = Dimensions.get('window');
    const offsetLeft = (dimensions.width - tooltipWidth) / 2;
    const tooltipPosition = tooltipPositionProp || 'default';

    return [
      <ButtonImage
        key={'button'}
        ref={ref => {
          this.buttonRef = ref;
        }}
        onPress={this.toggle}
        onLayout={this.onLayout}
        hitSlop={hitSlop}
        analyticsParams={title}
        {...props}
      ></ButtonImage>,
      isVisible && (
        <Modal
          key={'modal'}
          visible
          animationType={'fade'}
          transparent
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
          onRequestClose={this.close}
        >
          <Touchable
            accessibilityLabel={'tooltip_overlay'}
            activeOpacity={1}
            style={styles.overlay}
            onPress={this.close}
            analyticsParams={title}
          />
          <View
            accessibilityLabel={'tooltip_tooltip'}
            style={[{ top: position.py + position.height * 0.85 }]}
          >
            <View style={styles.container}>
              <View
                style={[
                  infoColor ? styles.pointerSecondary : styles.pointerPrimary,
                  { left: position.px + (position.width - 25) * 0.55 },
                  tooltipPosition === 'left' && {
                    top: (position.px - position.height * 4) / 2,
                    borderTopWidth: 10,
                    borderBottomWidth: 0,
                    borderBottomColor: Colors.secondary,
                    borderTopColor: Colors.accentDark,
                    left: position.px + (position.width - 10) * 0.5,
                  },
                ]}
              />

              <Touchable
                accessibilityLabel={'tooltip_touchable_content'}
                analyticsParams={title}
                onPress={this.onPressTooltip}
                activeOpacity={1}
                style={[
                  styles.content,
                  infoColor
                    ? styles.backgroundSecondary
                    : styles.backgroundPrimary,
                  styles.shadow,
                  { left: offsetLeft },
                  tooltipPosition === 'right' && {
                    width: Size.getWidth() - position.px - 50,
                    left: position.px + 30,
                    top: -(position.height * 2.5),
                  },
                  tooltipPosition === 'left' && {
                    left: position.px - 10,
                    padding: 10,
                    top: -(position.height * 3.2),
                  },
                  tooltipPosition === 'left' && {
                    width:
                      Platform.OS == 'ios'
                        ? Size.getWidth() > 300
                          ? tooltipWidth - 125
                          : tooltipWidth - 100
                        : Size.getHeight() > 740
                          ? tooltipWidth - Size.getHeight() * 0.15
                          : Size.getWidth() > 400
                            ? tooltipWidth - Size.getHeight() * 0.14
                            : tooltipWidth - 120,
                  },
                  tooltipStyle,
                ]}
              >
                <Text
                  style={[
                    styles.message,
                    tooltipPosition === 'left' && {
                      fontSize: 13,
                      textAlign: 'center',
                    },
                  ]}
                  accessibilityLabel={'tooltip_content_text'}
                >
                  {message}
                </Text>
              </Touchable>
            </View>
          </View>
        </Modal>
      ),
    ];
  }
}
