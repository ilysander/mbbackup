import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Font } from '../../resources/functions';
import { Colors } from '../../resources/constants';

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  title: {
    ...Font(),
    color: Colors.grey6,
    fontSize: 13,
  } as TextStyle,
  subtitle: {
    ...Font({ weight: 'SemiBold' }),
    color: Colors.grey6,
    fontSize: 16,
  } as TextStyle,
});

export interface ResumeBoxProps extends ViewProps {
  title: string;
  subtitle: string;
  accessibilityLabel: string;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

export interface ResumeBoxState {}

export default class ResumeBox extends React.Component<
  ResumeBoxProps,
  ResumeBoxState
> {
  state: ResumeBoxState = {};

  render() {
    const {
      style,
      title,
      subtitle,
      titleStyle,
      subtitleStyle,
      accessibilityLabel,
      ...props
    } = this.props;

    return (
      <View
        accessibilityLabel={accessibilityLabel || 'resumebox'}
        style={[styles.item, style]}
        {...props}
      >
        <Text
          accessibilityLabel={'resumebox_title'}
          style={[styles.title, titleStyle]}
        >
          {title}
        </Text>
        <Text
          accessibilityLabel={'resumebox_subtitle'}
          style={[styles.subtitle, subtitleStyle]}
        >
          {subtitle}
        </Text>
      </View>
    );
  }
}
