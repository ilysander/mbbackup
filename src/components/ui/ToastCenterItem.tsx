import * as React from 'react';
import {Animated, LayoutChangeEvent, View} from 'react-native';
import {Log} from '../../resources/log';
import Toast, {ToastProps} from './Toast';

const DefaultHeight = 60;
const TAG = '[ToastCenterItem]';

export interface ToastCenterItemProps extends ToastProps {
  duration?: number;
  hash?: string;
  onTimeout: () => void;
}

export interface ToastCenterItemState {
  top: Animated.Value;
  fade: Animated.Value;
  itemHeight: number;
}

export default class ToastCenterItem extends React.Component<
  ToastCenterItemProps,
  ToastCenterItemState
> {
  static defaultProps = {
    duration: 4000,
  };
  state: ToastCenterItemState = {
    top: new Animated.Value(-DefaultHeight),
    fade: new Animated.Value(0),
    itemHeight: 0,
  };

  animation!: Animated.CompositeAnimation;
  timeout!: NodeJS.Timeout;

  onLayout = (event: LayoutChangeEvent) => {
    const itemHeight = event.nativeEvent.layout.height;
    this.setState({itemHeight});
    Log.info(TAG, 'onLayout', itemHeight);
  };

  show = () => {
    this.animation && this.animation.stop();

    this.animation = Animated.parallel([
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.spring(this.state.top, {
        toValue: 0,
        friction: 8,
        useNativeDriver: false,
      }),
    ]);
    this.animation.start();
  };

  hide = (cb: Animated.EndCallback) => {
    const offset =
      this.state.itemHeight < 1 ? DefaultHeight : this.state.itemHeight;

    this.animation && this.animation.stop();

    this.animation = Animated.parallel([
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: DefaultHeight,
        useNativeDriver: false,
      }),
      Animated.spring(this.state.top, {
        toValue: offset * -1,
        friction: 8,
        useNativeDriver: false,
      }),
    ]);
    this.animation.start(cb);
  };

  componentDidMount() {
    this.show();
    this.durationSetup();
  }

  componentWillUnmount() {
    this.animation && this.animation.stop();
  }

  durationSetup = () => {
    const {duration, hash, onTimeout} = this.props;
    Log.debug(TAG, 'durationSetup', hash);
    this.timeout && clearTimeout(this.timeout);

    if (duration) {
      this.timeout = setTimeout(() => {
        onTimeout();
      }, duration);
    }
  };

  componentDidUpdate(prevProps: ToastCenterItemProps) {
    const reload = prevProps.hash !== this.props.hash;
    reload && this.durationSetup();
  }

  render() {
    const {...props} = this.props;
    const {fade, top} = this.state;

    return (
      <Animated.View style={{opacity: fade, marginBottom: top}}>
        <View accessibilityLabel={'toastcenteritem'} onLayout={this.onLayout}>
          <Toast {...props} />
        </View>
      </Animated.View>
    );
  }
}
