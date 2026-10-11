import * as React from 'react';
import { StyleSheet, StyleProp, Text, TextStyle } from 'react-native';
import { Font } from '../../resources/functions';
import { Colors } from '../../resources/constants';

export interface DotProps {
  style?: StyleProp<TextStyle>;
}

export interface DotState {}
const dot = '•';

const styles = StyleSheet.create({
  dot: {
    ...Font({ weight: 'Medium' }),
    fontSize: 20,
    color: Colors.accentDark,
  } as TextStyle,
});

export default class Dot extends React.Component<DotProps, DotState> {
  render() {
    const { style } = this.props;
    return <Text style={[styles.dot, style]}>{dot}</Text>;
  }
}
