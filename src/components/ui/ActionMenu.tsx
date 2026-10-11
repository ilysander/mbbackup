import * as React from 'react';
import {
  LayoutChangeEvent,
  Modal,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import ButtonImage, { ButtonImageProps } from './ButtonImage';
import Touchable from './Touchable';
import CardView from './CardView';

const contentWidth = 200;
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  } as ViewStyle,
  shadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowColor: Colors.shadow,
    shadowOpacity: 1.0,
    shadowRadius: 16,
    elevation: 16,
  } as ViewStyle,
  content: {
    marginTop: -1,
    zIndex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 2,
    marginBottom: 10,
    width: contentWidth,
    borderRadius: 8,
  } as ViewStyle,
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.transparent,
  } as ViewStyle,
});

export interface ActionMenuProps extends ButtonImageProps {
  position?: 'left' | 'right';
  offset?: {
    x: number;
    y: number;
  };
  tooltipStyle?: StyleProp<ViewStyle>;
  onToggle?: (active: boolean) => void;
  onPressTooltip?: () => void;
}

export interface ActionMenuState {
  isVisible: boolean;
  dimensions: {
    px: number;
    py: number;
    width: number;
    height: number;
  };
}

export default class ActionMenu extends React.Component<
  ActionMenuProps,
  ActionMenuState
> {
  static defaultProps = {
    position: 'left',
    offset: {
      x: 0,
      y: 0,
    },
  };

  state: ActionMenuState = {
    isVisible: false,
    dimensions: {
      px: 0,
      py: 0,
      width: 0,
      height: 0,
    },
  };

  buttonRef!: ButtonImage | null;

  close = () => {
    const isVisible = false;
    this.setState({ isVisible });
  };

  toggle = () => {
    const isVisible = !this.state.isVisible;
    this.setState({ isVisible });
    this.updatePosition();
  };

  componentDidUpdate(_prevProps: ActionMenuProps, prevState: ActionMenuState) {
    const { isVisible } = this.state;
    if (prevState.isVisible !== isVisible) {
      const { onToggle } = this.props;
      if (typeof onToggle === 'function') {
        onToggle(isVisible);
      }
    }
  }

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
        const dimensions = { fx, fy, width, height, px, py };
        this.setState({ dimensions });
      }
    );
  };
  onLayout = (event: LayoutChangeEvent) => {
    const { onLayout } = this.props;
    if (typeof onLayout === 'function') {
      onLayout(event);
    }
    this.updatePosition();
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
      children,
      tooltipStyle,
      offset,
      position,
      accessibilityLabel,
      ...props
    } = this.props;
    const { isVisible, dimensions } = this.state;
    const offsetItem = offset || ActionMenu.defaultProps.offset;
    const left =
      position === 'right'
        ? dimensions.px - offsetItem.x
        : dimensions.px - contentWidth + dimensions.width / 2 - offsetItem.x;

    return [
      <ButtonImage
        accessibilityLabel={accessibilityLabel || 'actionmenu_button'}
        key={'button'}
        ref={ref => {
          this.buttonRef = ref;
        }}
        {...props}
        onPress={this.toggle}
        onLayout={this.onLayout}
      />,
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
          <StatusBar
            backgroundColor={Colors.grey4}
            barStyle={'dark-content'}
            animated
          />
          <Touchable
            accessibilityLabel={'actionmenu_overlay'}
            activeOpacity={1}
            style={styles.overlay}
            onPress={this.close}
          />
          <Touchable
            accessibilityLabel={'actionmenu_tooltip'}
            onPress={this.onPressTooltip}
            style={{
              top: dimensions.py + dimensions.height / 2 + offsetItem.y,
            }}
          >
            <View style={styles.container}>
              <CardView
                accessibilityLabel={'actionmenu_tooltip_content'}
                style={[styles.content, styles.shadow, { left }, tooltipStyle]}
              >
                {children}
              </CardView>
            </View>
          </Touchable>
        </Modal>
      ),
    ];
  }
}
