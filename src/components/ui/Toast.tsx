import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Colors from '../../resources/constants/Colors';
import Font from '../../resources/functions/Font';
import Touchable from './Touchable';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.grey5,
  } as ViewStyle,
  text: {
    ...Font({ weight: 'Medium' }),
    color: Colors.white,
    fontSize: 14,
  } as TextStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  action: {
    marginLeft: 10,
  } as ViewStyle,
  actionTitleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.accent,
    fontSize: 14,
  } as TextStyle,
});

export interface ToastActionProps {
  title: string;
  onPress?: () => void;
  style: StyleProp<ViewStyle>;
}

export interface ToastProps extends ViewProps {
  message?: string;
  action?: ToastActionProps;
}

export interface ToastState {}

export default class Toast extends React.Component<ToastProps, ToastState> {
  render() {
    const { style, action, message, ...props } = this.props;

    return (
      <View
        accessibilityLabel={'toast'}
        style={[styles.container, style]}
        {...props}
      >
        <View style={styles.content} accessibilityLabel={'toast_content'}>
          <Text style={styles.text} accessibilityLabel={'toast_text_message'}>
            {message}
          </Text>
        </View>
        <View>
          {!!action && (
            <Touchable
              accessibilityLabel={'toast_touchable_action'}
              onPress={action.onPress}
              style={[styles.action, action.style]}
              hitSlop={{ left: 20, top: 20, right: 20, bottom: 20 }}
            >
              <Text
                accessibilityLabel={'toast_touchable_action_text'}
                style={styles.actionTitleText}
              >
                {action.title}
              </Text>
            </Touchable>
          )}
        </View>
      </View>
    );
  }
}
