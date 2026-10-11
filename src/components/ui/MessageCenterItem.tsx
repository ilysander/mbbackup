import * as React from 'react';
import {Animated, LayoutChangeEvent, View} from 'react-native';
import Log from '../../resources/log/Log';
import AlertMessage from './AlertMessage';
import InfoMessage from './InfoMessage';
import {InfoMessageTouchableProps} from './InfoMessage';

const DefaultHeight = 50;
const TAG = '[MessageCenterItem]';

export interface MessageCenterItemProps extends InfoMessageTouchableProps {
  duration?: number;
  hash?: string;
  type?: 'info' | 'warning';
  onTimeout: () => void;
}

export interface MessageCenterItemState {
  top: Animated.Value;
  fade: Animated.Value;
  itemHeight: number;
}

export default class MessageCenterItem extends React.Component<
  MessageCenterItemProps,
  MessageCenterItemState
> {
  static defaultProps = {
    type: 'warning',
  };

  state: MessageCenterItemState = {
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
    this.timeout && clearTimeout(this.timeout);
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

  componentDidUpdate(prevProps: MessageCenterItemProps) {
    const reload = prevProps.hash !== this.props.hash;
    reload && this.durationSetup();
  }

  render() {
    const {type: typeProp, ...props} = this.props;
    const {fade, top} = this.state;
    const type = typeProp || MessageCenterItem.defaultProps.type;
    return (
      <Animated.View style={{opacity: fade, marginTop: top}}>
        <View accessibilityLabel={'messagecenteritem'} onLayout={this.onLayout}>
          {type === 'warning' && <AlertMessage {...props} />}
          {type === 'info' && <InfoMessage {...props} />}
        </View>
      </Animated.View>
    );
  }
}
