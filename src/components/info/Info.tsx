import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../resources/constants';
import { Font } from '../../resources/functions';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  } as ViewStyle,
  text: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  titleText: {
    ...Font({ weight: 'Bold' }),
    color: Colors.grey6,
    fontSize: 14,
  } as TextStyle,
  centerText: {
    textAlign: 'center',
  } as TextStyle,
});

export interface InfoProps extends ViewProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  accessibilityLabel: string;
}

export interface InfoState {}

export default class Info extends React.Component<InfoProps, InfoState> {
  render() {
    const {
      style,
      center,
      title,
      subtitle,
      accessibilityLabel,
      ...props
    } = this.props;
    return (
      <View
        accessibilityLabel={accessibilityLabel || 'info'}
        style={[styles.container, style]}
        {...props}
      >
        <Text
          style={[styles.titleText, center && styles.centerText]}
          accessibilityLabel={'info_text_title'}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={[styles.text, center && styles.centerText]}
            accessibilityLabel={'info_text'}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  }
}
