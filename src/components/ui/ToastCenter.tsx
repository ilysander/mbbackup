import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Size } from '../../resources/dimensions';
import { Log } from '../../resources/log';
import ToastCenterItem from './ToastCenterItem';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  } as ViewStyle,
  item: {
    marginBottom: 10,
  } as ViewStyle,
});

const TAG = '[ToastCenter]';

export interface ToastCenterProps extends ViewProps {
  itemStyle?: StyleProp<ViewStyle>;
}

export interface ToastCenterState {
  messages: any[];
}

export default class ToastCenter extends React.Component<
  ToastCenterProps,
  ToastCenterState
> {
  static counter = 0;
  messages: {
    [name: string]: ToastCenterItem | null;
  } = {};

  state: ToastCenterState = {
    messages: [],
  };

  show = async (params: any) => {
    ToastCenter.counter++;
    params.hash = ToastCenter.counter;
    if (!params.id) {
      params.id = ToastCenter.counter.toString();
    }

    let messages = this.state.messages;
    const exist = messages.some(message => params.id === message.id);

    if (!exist) {
      messages = [...messages, params];
    } else {
      messages = messages.map(message => {
        if (params.id === message.id) {
          return params;
        }
        return message;
      });
    }

    Log.info(TAG, 'show', messages.length, ToastCenter.counter);
    this.setState({ messages });
    return params.id;
  };

  hideAll = () => {
    const { messages } = this.state;
    messages.forEach(item => {
      this.hide(item.id);
    });
  };

  remove = (id: string) => {
    const messages = this.state.messages.filter(item => item.id !== id);
    this.setState({ messages });
  };

  hide = (id: string) => {
    const messageRef = this.messages[`message_${id}`];
    messageRef &&
      messageRef.hide(() => {
        this.remove(id);
      });
  };

  render() {
    const { messages } = this.state;
    const { style, itemStyle, children, ...props } = this.props;
    const bottom = Size.getBottomTabBarHeight() + 10;
    const hasMessages = messages.length > 0;
    return (
      <View
        style={[styles.container, hasMessages && { padding: 8, bottom }, style]}
        {...props}
      >
        {children}
        {messages.map(item => (
          <ToastCenterItem
            key={item.id}
            ref={ref => {
              this.messages[`message_${item.id}`] = ref;
            }}
            onTimeout={() => {
              this.hide(item.id);
            }}
            {...item}
            style={[styles.item, itemStyle, item.style]}
          />
        ))}
      </View>
    );
  }
}
