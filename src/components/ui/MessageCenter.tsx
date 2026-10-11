import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  InteractionManager,
} from 'react-native';
import Log from '../../resources/log/Log';
import MessageCenterItem from './MessageCenterItem';

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  } as ViewStyle,
  item: {
    marginBottom: 10,
  } as ViewStyle,
});

const TAG = '[MessageCenter]';

export interface MessageCenterProps extends ViewProps {
  itemStyle?: StyleProp<ViewStyle>;
}

export interface MessageCenterState {
  messages: any[];
}

export default class MessageCenter extends React.Component<
  MessageCenterProps,
  MessageCenterState
> {
  static counter = 0;
  messages: {
    [name: string]: MessageCenterItem | null;
  } = {};

  state: MessageCenterState = {
    messages: [],
  };

  show = async (params: any, callback?: () => void) => {
    MessageCenter.counter++;
    params.hash = MessageCenter.counter;
    if (!params.id) {
      params.id = MessageCenter.counter.toString();
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

    Log.info(TAG, 'show', messages.length, MessageCenter.counter);
    this.setState({ messages }, () => {
      InteractionManager.runAfterInteractions(() => {
        typeof callback === 'function' && callback();
      });
    });
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

    return (
      <View style={[styles.container, style]} {...props}>
        {children}
        {messages.map(item => (
          <MessageCenterItem
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
